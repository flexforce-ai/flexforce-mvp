// All /api/shops/* routes.
//   POST   /api/shops/create               { slug, shopName, ... }   create + claim slug (auth)
//   GET    /api/shops/slug-available?slug= check FCFS availability
//   GET    /api/shops/mine                 list shops for current user (auth)
//   GET    /api/shops/{slug}               fetch shop config (public — sanitized)
//   PATCH  /api/shops/{slug}               update shop config (owner-auth)
//   DELETE /api/shops/{slug}               release slug (owner-auth)

import { jsonGet, jsonPut, listPrefix, claimSlug, releaseSlug } from '../_lib/blob.js';
import { requireSession } from '../_lib/auth.js';
import { defaultsForTrade, licenseBoardForState, isValidSlug, normalizeSlug } from '../_lib/defaults.js';
import { sendShopCreated, JACK_EMAIL } from '../_lib/email.js';

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function publicShopView(shop) {
  if (!shop) return null;
  // strip private fields before sending to applicants/anyone
  const { ownerEmail, internalNotes, createdBy, ...pub } = shop;
  return pub;
}

async function readBody(req) {
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const parts = (req.query.path || []).filter(Boolean);
  const [first, ...rest] = parts;

  try {
    // ── /api/shops/slug-available?slug=X ────────────────────────────────
    if (req.method === 'GET' && first === 'slug-available') {
      const slug = normalizeSlug(req.query.slug || '');
      if (!isValidSlug(slug)) return json(res, 200, { available: false, reason: 'invalid', slug });
      const existing = await jsonGet(`slugs/${slug}.json`);
      return json(res, 200, { available: !existing, slug });
    }

    // ── /api/shops/mine ─────────────────────────────────────────────────
    if (req.method === 'GET' && first === 'mine') {
      const session = await requireSession(req);
      if (!session) return json(res, 401, { error: 'not_authenticated' });
      const user = (await jsonGet(`users/${session.email}.json`)) || { email: session.email, shops: [] };
      const shops = [];
      for (const slug of user.shops || []) {
        const s = await jsonGet(`shops/${slug}.json`);
        if (s) shops.push(s);
      }
      return json(res, 200, { shops });
    }

    // ── POST /api/shops/create ──────────────────────────────────────────
    if (req.method === 'POST' && first === 'create') {
      const session = await requireSession(req);
      if (!session) return json(res, 401, { error: 'not_authenticated' });
      const body = await readBody(req);
      const slug = normalizeSlug(body.slug);
      if (!isValidSlug(slug)) return json(res, 400, { error: 'invalid_slug' });

      const claimed = await claimSlug(slug, session.email);
      if (!claimed) return json(res, 409, { error: 'slug_taken' });

      const trade = body.trade || 'other';
      const stateSlug = body.state || '';
      const td = defaultsForTrade(trade);
      const lb = licenseBoardForState(stateSlug);

      const shop = {
        slug,
        shopName: String(body.shopName || '').trim().slice(0, 80) || 'Unnamed Shop',
        ownerEmail: session.email,
        trade,
        state: stateSlug,
        city: String(body.city || '').trim().slice(0, 60),
        licenseBoard: lb.board,
        licenseBoardUrl: lb.url,
        languages: Array.isArray(body.languages) && body.languages.length ? body.languages : ['en'],
        brand: body.brand && body.brand.primary ? {
          primary: body.brand.primary,
          dark: body.brand.dark || body.brand.primary,
          soft: body.brand.soft || '#f6f3ee'
        } : { primary: '#1d4d3d', dark: '#0f2922', soft: '#f6f3ee' },
        logoText: (body.logoText || body.shopName || 'F').trim().charAt(0).toUpperCase(),
        logoImageUrl: body.logoImageUrl || null,
        job: {
          title: body.job?.title || td.title,
          payLow: Number(body.job?.payLow ?? td.payLow),
          payHigh: Number(body.job?.payHigh ?? td.payHigh),
          summary: body.job?.summary || td.summary,
          perks: Array.isArray(body.job?.perks) && body.job.perks.length ? body.job.perks : td.perks,
          schedule: body.job?.schedule || 'Full-time'
        },
        questions: Array.isArray(body.questions) && body.questions.length ? body.questions : td.questions,
        calLink: body.calLink || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicantCount: 0
      };

      await jsonPut(`shops/${slug}.json`, shop);

      // Update user record
      const user = (await jsonGet(`users/${session.email}.json`)) || { email: session.email, shops: [], createdAt: new Date().toISOString() };
      if (!user.shops) user.shops = [];
      if (!user.shops.includes(slug)) user.shops.push(slug);
      user.updatedAt = new Date().toISOString();
      await jsonPut(`users/${session.email}.json`, user);

      // Audit
      await jsonPut(`audit/${new Date().toISOString()}-${slug}.json`, {
        ts: new Date().toISOString(), event: 'shop_created', slug, email: session.email
      });

      // Notify shop owner + Jack
      try {
        await sendShopCreated({ to: session.email, shop });
        if (JACK_EMAIL && JACK_EMAIL !== session.email) {
          await sendShopCreated({ to: JACK_EMAIL, shop });
        }
      } catch (e) { console.error('shop-created email failed', e); }

      return json(res, 200, { shop });
    }

    // ── GET /api/shops/{slug} ───────────────────────────────────────────
    if (req.method === 'GET' && first && !rest.length) {
      const slug = normalizeSlug(first);
      const shop = await jsonGet(`shops/${slug}.json`);
      if (!shop) return json(res, 404, { error: 'not_found' });
      return json(res, 200, { shop: publicShopView(shop) });
    }

    // ── PATCH /api/shops/{slug} ─────────────────────────────────────────
    if (req.method === 'PATCH' && first && !rest.length) {
      const session = await requireSession(req);
      if (!session) return json(res, 401, { error: 'not_authenticated' });
      const slug = normalizeSlug(first);
      const shop = await jsonGet(`shops/${slug}.json`);
      if (!shop) return json(res, 404, { error: 'not_found' });
      if (shop.ownerEmail !== session.email) return json(res, 403, { error: 'forbidden' });

      const body = await readBody(req);
      const allowedTopLevel = ['shopName', 'city', 'state', 'trade', 'languages', 'brand', 'logoText', 'logoImageUrl', 'job', 'questions', 'calLink', 'status'];
      const next = { ...shop };
      for (const k of allowedTopLevel) {
        if (k in body) next[k] = body[k];
      }
      // Re-derive license board if state changed
      if ('state' in body) {
        const lb = licenseBoardForState(body.state);
        next.licenseBoard = lb.board;
        next.licenseBoardUrl = lb.url;
      }
      next.updatedAt = new Date().toISOString();
      await jsonPut(`shops/${slug}.json`, next);
      return json(res, 200, { shop: next });
    }

    // ── DELETE /api/shops/{slug} ────────────────────────────────────────
    if (req.method === 'DELETE' && first && !rest.length) {
      const session = await requireSession(req);
      if (!session) return json(res, 401, { error: 'not_authenticated' });
      const slug = normalizeSlug(first);
      const shop = await jsonGet(`shops/${slug}.json`);
      if (!shop) return json(res, 404, { error: 'not_found' });
      if (shop.ownerEmail !== session.email) return json(res, 403, { error: 'forbidden' });
      shop.status = 'archived';
      shop.updatedAt = new Date().toISOString();
      await jsonPut(`shops/${slug}.json`, shop);
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { error: 'route_not_found', method: req.method, parts });
  } catch (e) {
    console.error('[shops]', e);
    return json(res, 500, { error: 'internal_error', message: String(e.message || e) });
  }
}
