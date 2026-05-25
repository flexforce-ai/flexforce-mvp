// Admin (Jack-only) endpoints.
//   POST /api/admin/login           { password }           → set ff_admin cookie
//   POST /api/admin/logout
//   GET  /api/admin/shops           → all shops
//   GET  /api/admin/applicants      → all applicants (last 200)
//   GET  /api/admin/audit           → audit trail
//   POST /api/admin/shop/{slug}/archive
//   POST /api/admin/release-slug    { slug }   → free a taken slug

import { jsonGet, listPrefix, releaseSlug, jsonPut } from '../_lib/blob.js';
import { isAdminAuthorized, adminCookie, clearAdminCookie } from '../_lib/auth.js';

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

export default async function handler(req, res) {
  const parts = (req.query.path || []).filter(Boolean);
  const [first, second, third] = parts;

  try {
    // ── POST /api/admin/login ───────────────────────────────────────────
    if (req.method === 'POST' && first === 'login') {
      const body = await readBody(req);
      if (!process.env.ADMIN_PASSWORD) return json(res, 503, { error: 'admin_disabled' });
      if (body.password !== process.env.ADMIN_PASSWORD) return json(res, 401, { error: 'bad_password' });
      res.setHeader('Set-Cookie', adminCookie());
      return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && first === 'logout') {
      res.setHeader('Set-Cookie', clearAdminCookie());
      return json(res, 200, { ok: true });
    }

    // Everything below requires admin auth
    if (!isAdminAuthorized(req)) return json(res, 401, { error: 'admin_required' });

    if (req.method === 'GET' && first === 'shops') {
      const blobs = await listPrefix('shops/');
      const shops = [];
      for (const b of blobs) {
        const s = await jsonGet(b.pathname);
        if (s) shops.push(s);
      }
      shops.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      return json(res, 200, { shops });
    }

    if (req.method === 'GET' && first === 'applicants') {
      const blobs = await listPrefix('applicants/');
      const out = [];
      for (const b of blobs.slice(0, 200)) {
        const a = await jsonGet(b.pathname);
        if (a) out.push(a);
      }
      out.sort((x, y) => (y.createdAt || '').localeCompare(x.createdAt || ''));
      return json(res, 200, { applicants: out });
    }

    if (req.method === 'GET' && first === 'audit') {
      const blobs = await listPrefix('audit/');
      const items = [];
      for (const b of blobs.slice(0, 200)) {
        const a = await jsonGet(b.pathname);
        if (a) items.push(a);
      }
      items.sort((x, y) => (y.ts || '').localeCompare(x.ts || ''));
      return json(res, 200, { audit: items });
    }

    if (req.method === 'POST' && first === 'shop' && third === 'archive') {
      const slug = second;
      const shop = await jsonGet(`shops/${slug}.json`);
      if (!shop) return json(res, 404, { error: 'not_found' });
      shop.status = 'archived';
      shop.updatedAt = new Date().toISOString();
      await jsonPut(`shops/${slug}.json`, shop);
      await jsonPut(`audit/${new Date().toISOString()}-archive-${slug}.json`, {
        ts: new Date().toISOString(), event: 'admin_archive', slug
      });
      return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && first === 'release-slug') {
      const body = await readBody(req);
      const slug = String(body.slug || '');
      if (!slug) return json(res, 400, { error: 'missing_slug' });
      await releaseSlug(slug);
      await jsonPut(`audit/${new Date().toISOString()}-release-${slug}.json`, {
        ts: new Date().toISOString(), event: 'admin_release_slug', slug
      });
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { error: 'route_not_found' });
  } catch (e) {
    console.error('[admin]', e);
    return json(res, 500, { error: 'internal_error', message: String(e.message || e) });
  }
}
