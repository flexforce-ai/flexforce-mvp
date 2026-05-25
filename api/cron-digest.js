// GET /api/cron-digest  (Vercel Cron-triggered daily)
// Walks all shops, finds applicants from last 24h, emails the owner a digest.
// Skips shops with zero new applicants. Secured by CRON_SECRET (Vercel sets
// the `Authorization: Bearer <secret>` header automatically when the cron
// is configured under vercel.json with `crons` + matching env var.)

import { listPrefix, jsonGet } from './_lib/blob.js';
import { sendDailyDigest } from './_lib/email.js';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  // Allow Vercel Cron header OR a query-param secret for manual triggering.
  const auth = req.headers.authorization || '';
  const cronOk = process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
  const manualOk = req.query.secret && req.query.secret === process.env.CRON_SECRET;
  if (process.env.CRON_SECRET && !cronOk && !manualOk) return json(res, 401, { error: 'unauthorized' });

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const shopBlobs = await listPrefix('shops/');
  const sent = [];
  const skipped = [];

  for (const sb of shopBlobs) {
    const shop = await jsonGet(sb.pathname);
    if (!shop || shop.status !== 'active' || !shop.ownerEmail) { skipped.push(sb.pathname); continue; }

    const aBlobs = await listPrefix(`applicants/${shop.slug}/`);
    const recent = [];
    for (const ab of aBlobs) {
      const a = await jsonGet(ab.pathname);
      if (a && a.createdAt && a.createdAt > cutoff) recent.push(a);
    }
    if (!recent.length) { skipped.push(shop.slug); continue; }
    recent.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    try {
      await sendDailyDigest({ to: shop.ownerEmail, shop, applicants: recent });
      sent.push({ slug: shop.slug, count: recent.length });
    } catch (e) {
      console.error('digest send failed for', shop.slug, e);
      skipped.push(shop.slug + ' (send_failed)');
    }
  }

  return json(res, 200, { sent, skipped, ranAt: new Date().toISOString() });
}
