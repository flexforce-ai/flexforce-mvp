// All /api/auth/* routes.
//   POST /api/auth/magic-link    { email, redirect } -> send link
//   GET  /api/auth/verify?token= -> set session cookie + redirect
//   GET  /api/auth/me            -> { session: {...} | null }
//   POST /api/auth/logout

import {
  createMagicLink, consumeMagicLink, createSession, destroySession,
  sessionCookie, clearSessionCookie, parseCookies, COOKIE_NAME, getSession
} from '../_lib/auth.js';
import { sendMagicLink } from '../_lib/email.js';
import { jsonGet, jsonPut } from '../_lib/blob.js';

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function htmlRedirect(res, location, cookie) {
  res.statusCode = 302;
  if (cookie) res.setHeader('Set-Cookie', cookie);
  res.setHeader('Location', location);
  res.end('Redirecting…');
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
  const parts = parsePath(req, 'auth');
  const [route] = parts;

  try {
    // ── POST /api/auth/magic-link ───────────────────────────────────────
    if (req.method === 'POST' && route === 'magic-link') {
      const body = await readBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return json(res, 400, { error: 'invalid_email' });
      const redirect = String(body.redirect || '/app/dashboard');
      const t = await createMagicLink(email, redirect);
      const link = `https://flexforce.ai/api/auth/verify?token=${encodeURIComponent(t)}`;
      try {
        await sendMagicLink({ to: email, link, redirect });
      } catch (e) {
        console.error('magic link email send failed:', e);
        return json(res, 500, { error: 'email_failed' });
      }
      // Don't leak whether email exists — always return success.
      return json(res, 200, { ok: true });
    }

    // ── GET /api/auth/verify?token= ─────────────────────────────────────
    if (req.method === 'GET' && route === 'verify') {
      const t = String(queryParam(req, 'token') || '');
      if (!t) return json(res, 400, { error: 'missing_token' });
      const data = await consumeMagicLink(t);
      if (!data) return htmlRedirect(res, '/app/login?error=expired');
      const sess = await createSession(data.email);
      // Ensure user record exists
      const u = (await jsonGet(`users/${data.email}.json`)) || null;
      if (!u) {
        await jsonPut(`users/${data.email}.json`, {
          email: data.email,
          shops: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      return htmlRedirect(res, data.redirect || '/app/dashboard', sessionCookie(sess.token));
    }

    // ── GET /api/auth/me ────────────────────────────────────────────────
    if (req.method === 'GET' && route === 'me') {
      const cookies = parseCookies(req.headers.cookie || '');
      const s = await getSession(cookies[COOKIE_NAME]);
      return json(res, 200, { session: s });
    }

    // ── POST /api/auth/logout ───────────────────────────────────────────
    if (req.method === 'POST' && route === 'logout') {
      const cookies = parseCookies(req.headers.cookie || '');
      await destroySession(cookies[COOKIE_NAME]);
      res.setHeader('Set-Cookie', clearSessionCookie());
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { error: 'route_not_found' });
  } catch (e) {
    console.error('[auth]', e);
    return json(res, 500, { error: 'internal_error', message: String(e.message || e) });
  }
}
