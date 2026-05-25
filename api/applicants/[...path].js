// All /api/applicants/* routes.
//   POST /api/applicants/submit          { slug, name, email, phone, answers[], method } public
//   GET  /api/applicants?shop=slug       list applicants (auth, owner)
//   GET  /api/applicants/{id}?shop=slug  detail (auth, owner)
//   POST /api/applicants/{id}/status     { status, note } update (auth, owner)
//   POST /api/applicants/webhook         Vapi callback (uses VAPI_WEBHOOK_SECRET)

import crypto from 'node:crypto';
import { jsonGet, jsonPut, listPrefix } from '../_lib/blob.js';
import { requireSession } from '../_lib/auth.js';
import { sendApplicantToShop, sendApplicantConfirmation, JACK_EMAIL } from '../_lib/email.js';
import { startCall as vapiStartCall, isConfigured as vapiConfigured } from '../_lib/vapi.js';
import { smsApplicantMissedCall, isConfigured as twilioConfigured } from '../_lib/twilio.js';
import { verify as verifyLicense } from '../_lib/license.js';

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-\(\)\.]{10,20}$/;

function parsePath(req, resource) {
  const url = req.url || '';
  const noQuery = url.split('?')[0];
  const prefix = `/api/${resource}/`;
  if (!noQuery.startsWith(prefix)) return [];
  return noQuery.slice(prefix.length).split('/').filter(Boolean);
}

function queryParam(req, key) {
  const url = req.url || '';
  const q = url.split('?')[1];
  if (!q) return '';
  for (const part of q.split('&')) {
    const [k, v] = part.split('=');
    if (decodeURIComponent(k) === key) return decodeURIComponent(v || '');
  }
  return '';
}

export default async function handler(req, res) {
  const parts = parsePath(req, 'applicants');
  const [first, second] = parts;

  try {
    // ── POST /api/applicants/submit (public) ────────────────────────────
    if (req.method === 'POST' && first === 'submit') {
      const body = await readBody(req);
      const slug = String(body.slug || '').trim();
      if (!slug) return json(res, 400, { error: 'missing_slug' });
      const shop = await jsonGet(`shops/${slug}.json`);
      if (!shop || shop.status !== 'active') return json(res, 404, { error: 'shop_not_found' });

      const name = String(body.name || '').trim().slice(0, 80);
      const email = String(body.email || '').trim().toLowerCase();
      const phone = String(body.phone || '').trim();
      if (!name) return json(res, 400, { error: 'missing_name' });
      if (!EMAIL_RE.test(email)) return json(res, 400, { error: 'invalid_email' });
      if (!PHONE_RE.test(phone)) return json(res, 400, { error: 'invalid_phone' });

      const answers = Array.isArray(body.answers) ? body.answers.slice(0, 20).map(a => ({
        key: String(a.key || '').slice(0, 40),
        label: String(a.label || '').slice(0, 120),
        value: String(a.value || '').slice(0, 1000)
      })) : [];

      const id = crypto.randomBytes(12).toString('base64url');
      const applicant = {
        id, slug, name, email, phone, answers,
        language: body.language || 'en',
        method: body.method || 'web',
        status: 'new',
        utm: body.utm || {},
        createdAt: new Date().toISOString(),
        events: [{ ts: new Date().toISOString(), type: 'submitted', source: body.method || 'web' }]
      };

      await jsonPut(`applicants/${slug}/${id}.json`, applicant);

      // Bump shop applicant count
      shop.applicantCount = (shop.applicantCount || 0) + 1;
      shop.lastApplicantAt = applicant.createdAt;
      await jsonPut(`shops/${slug}.json`, shop);

      // Notify shop owner + confirmation to applicant + ping Jack
      try {
        await sendApplicantToShop({ to: shop.ownerEmail, shop, applicant });
        await sendApplicantConfirmation({ to: email, shop, applicant });
        if (JACK_EMAIL && JACK_EMAIL !== shop.ownerEmail) {
          await sendApplicantToShop({ to: JACK_EMAIL, shop, applicant });
        }
      } catch (e) { console.error('applicant email failed', e); }

      // Auto-trigger Vapi screening call when configured. Non-blocking.
      if (vapiConfigured() && applicant.method !== 'text') {
        try {
          const r = await vapiStartCall({ shop, applicant });
          applicant.status = 'screening';
          applicant.events.push({ ts: new Date().toISOString(), type: 'screening_started', vapi: r });
          if (r.callId) applicant.vapiCallId = r.callId;
          await jsonPut(`applicants/${slug}/${id}.json`, applicant);
        } catch (e) { console.error('vapi start failed', e); }
      }

      return json(res, 200, { ok: true, id, screeningMode: vapiConfigured() ? 'live' : 'stub' });
    }

    // ── POST /api/applicants/webhook (Vapi/Twilio callback) ─────────────
    if (req.method === 'POST' && first === 'webhook') {
      const secret = req.headers['x-webhook-secret'] || queryParam(req, 'secret') || '';
      if (!process.env.VAPI_WEBHOOK_SECRET || secret !== process.env.VAPI_WEBHOOK_SECRET) {
        return json(res, 401, { error: 'bad_secret' });
      }
      const body = await readBody(req);
      // Expected: { applicantId, slug, event, transcript, license_verified, score }
      const { applicantId, slug, event, transcript, license_verified, score, summary } = body;
      if (!applicantId || !slug) return json(res, 400, { error: 'missing_ids' });
      const a = await jsonGet(`applicants/${slug}/${applicantId}.json`);
      if (!a) return json(res, 404, { error: 'applicant_not_found' });
      a.events.push({ ts: new Date().toISOString(), type: event || 'webhook', payload: body });
      if (transcript) a.transcript = transcript;
      if (summary) a.summary = summary;
      if (typeof score === 'number') a.score = score;
      if (typeof license_verified === 'boolean') a.licenseVerified = license_verified;
      if (event === 'screening_complete' || event === 'call_complete') a.status = 'screened';
      if (event === 'interview_booked') a.status = 'booked';
      a.updatedAt = new Date().toISOString();
      await jsonPut(`applicants/${slug}/${applicantId}.json`, a);
      return json(res, 200, { ok: true });
    }

    // Anything below requires auth
    const session = await requireSession(req);
    if (!session) return json(res, 401, { error: 'not_authenticated' });
    const slug = String(queryParam(req, 'shop') || '').trim();
    if (!slug) return json(res, 400, { error: 'missing_shop_param' });
    const shop = await jsonGet(`shops/${slug}.json`);
    if (!shop) return json(res, 404, { error: 'shop_not_found' });
    if (shop.ownerEmail !== session.email) return json(res, 403, { error: 'forbidden' });

    // ── GET /api/applicants?shop=slug ───────────────────────────────────
    if (req.method === 'GET' && !first) {
      const blobs = await listPrefix(`applicants/${slug}/`);
      const items = [];
      for (const b of blobs) {
        const a = await jsonGet(b.pathname);
        if (a) items.push(a);
      }
      items.sort((x, y) => (y.createdAt || '').localeCompare(x.createdAt || ''));
      return json(res, 200, { applicants: items });
    }

    // ── GET /api/applicants/{id}?shop=slug ──────────────────────────────
    if (req.method === 'GET' && first && !second) {
      const a = await jsonGet(`applicants/${slug}/${first}.json`);
      if (!a) return json(res, 404, { error: 'not_found' });
      return json(res, 200, { applicant: a });
    }

    // ── POST /api/applicants/{id}/start-screening?shop=slug ─────────────
    if (req.method === 'POST' && second === 'start-screening') {
      const a = await jsonGet(`applicants/${slug}/${first}.json`);
      if (!a) return json(res, 404, { error: 'not_found' });
      const r = await vapiStartCall({ shop, applicant: a });
      a.events.push({ ts: new Date().toISOString(), type: 'screening_started_manual', vapi: r, by: session.email });
      if (r.callId) a.vapiCallId = r.callId;
      if (r.ok) a.status = 'screening';
      a.updatedAt = new Date().toISOString();
      await jsonPut(`applicants/${slug}/${first}.json`, a);
      return json(res, 200, { ok: r.ok, mode: r.mode, callId: r.callId || null });
    }

    // ── POST /api/applicants/{id}/sms-followup?shop=slug ────────────────
    if (req.method === 'POST' && second === 'sms-followup') {
      const a = await jsonGet(`applicants/${slug}/${first}.json`);
      if (!a) return json(res, 404, { error: 'not_found' });
      const r = await smsApplicantMissedCall({ applicant: a, shop });
      a.events.push({ ts: new Date().toISOString(), type: 'sms_followup', twilio: r, by: session.email });
      await jsonPut(`applicants/${slug}/${first}.json`, a);
      return json(res, 200, { ok: r.ok, mode: r.mode });
    }

    // ── POST /api/applicants/{id}/verify-license?shop=slug ──────────────
    if (req.method === 'POST' && second === 'verify-license') {
      const a = await jsonGet(`applicants/${slug}/${first}.json`);
      if (!a) return json(res, 404, { error: 'not_found' });
      const licenseAnswer = (a.answers || []).find(x => x.key === 'license');
      const r = await verifyLicense({
        stateSlug: shop.state, trade: shop.trade,
        licenseNumber: licenseAnswer?.value, name: a.name
      });
      a.licenseVerified = r.status === 'verified';
      a.licenseVerifyResult = r;
      a.events.push({ ts: new Date().toISOString(), type: 'license_verify', result: r, by: session.email });
      a.updatedAt = new Date().toISOString();
      await jsonPut(`applicants/${slug}/${first}.json`, a);
      return json(res, 200, r);
    }

    // ── POST /api/applicants/{id}/status?shop=slug ──────────────────────
    if (req.method === 'POST' && second === 'status') {
      const a = await jsonGet(`applicants/${slug}/${first}.json`);
      if (!a) return json(res, 404, { error: 'not_found' });
      const body = await readBody(req);
      const allowed = ['new', 'screening', 'screened', 'booked', 'hired', 'rejected', 'ghosted'];
      if (body.status && !allowed.includes(body.status)) return json(res, 400, { error: 'invalid_status' });
      if (body.status) a.status = body.status;
      if (body.note) a.events.push({ ts: new Date().toISOString(), type: 'note', note: String(body.note).slice(0, 1000), by: session.email });
      a.updatedAt = new Date().toISOString();
      await jsonPut(`applicants/${slug}/${first}.json`, a);
      return json(res, 200, { applicant: a });
    }

    return json(res, 404, { error: 'route_not_found' });
  } catch (e) {
    console.error('[applicants]', e);
    return json(res, 500, { error: 'internal_error', message: String(e.message || e) });
  }
}
