// POST /api/import → scrape an Indeed / Craigslist / generic job-post URL,
// extract title/location/pay/description, return a partial shop config.
//
// Works in two modes:
//   1. Direct fetch + heuristic parser (free, works for most public posts)
//   2. ScrapingBee API fallback (if SCRAPINGBEE_API_KEY env var is set)

import { requireSession } from './_lib/auth.js';

function json(res, status, body) {
  res.statusCode = status;
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
  });
}

async function fetchHtml(url) {
  const sb = process.env.SCRAPINGBEE_API_KEY;
  if (sb) {
    // Premium proxy + JS render — required for Indeed/LinkedIn/etc.
    const u = `https://app.scrapingbee.com/api/v1/?api_key=${sb}&url=${encodeURIComponent(url)}&render_js=true&premium_proxy=true`;
    const r = await fetch(u);
    if (!r.ok) throw new Error('scrape_failed_' + r.status + ' (set SCRAPINGBEE_API_KEY plan that includes premium_proxy if Indeed/LinkedIn)');
    return await r.text();
  }
  // Direct fetch with browser-ish headers
  const r = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  if (!r.ok) {
    // Indeed/LinkedIn block Vercel data-center IPs with 403. Surface a useful error.
    const hint = r.status === 403
      ? 'This site blocks server-side requests (common for Indeed/LinkedIn). Paste the job text directly, or set SCRAPINGBEE_API_KEY in Vercel env vars.'
      : `HTTP ${r.status}`;
    throw new Error(hint);
  }
  return await r.text();
}

function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function extractText(html, selector) {
  const re = new RegExp(`<[^>]*${selector}[^>]*>([\\s\\S]*?)<\\/`, 'i');
  const m = html.match(re);
  return m ? stripTags(m[1]).trim() : '';
}

function findFirst(html, patterns) {
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return stripTags(m[1] || m[0]).trim();
  }
  return '';
}

function parseJobPost(html, sourceUrl) {
  const host = (() => { try { return new URL(sourceUrl).hostname; } catch (e) { return ''; } })();
  const out = { source: host, sourceUrl };

  // Title — prefer og:title or specific job-title classes; fall back to <title>
  out.title = findFirst(html, [
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /<h1[^>]*(?:job|title)[^>]*>([\s\S]*?)<\/h1>/i,
    /<h1[^>]*>([\s\S]*?)<\/h1>/i,
    /<title>([\s\S]*?)<\/title>/i
  ]);
  // Remove site suffix like " - Indeed.com"
  out.title = out.title.replace(/\s*[\|\-–—]\s*(Indeed|Craigslist|ZipRecruiter|LinkedIn|Glassdoor)[^\n]*$/i, '').trim();

  // Location
  out.location = findFirst(html, [
    /<meta[^>]+property=["']og:locality["'][^>]+content=["']([^"']+)["']/i,
    /"formattedLocation"\s*:\s*"([^"]+)"/i,
    /"jobLocation"[^}]*?"addressLocality"\s*:\s*"([^"]+)"/i,
    /data-testid="[^"]*[Ll]ocation[^"]*"[^>]*>([^<]{2,60})</i,
    /id="jobLocationText"[^>]*>\s*<div[^>]*>([^<]{2,60})</i,
    /\b([A-Z][a-z]+(?:[\s\-][A-Z][a-z]+)*,\s*[A-Z]{2})\b/
  ]);

  // Pay — hourly first (most trades). Handles "$50 - $65 an hour", "$50/hr",
  // "$50 to $65 per hour", "$65 hourly".
  const payHourlyRange = html.match(/\$\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)\s*(?:[-–]|to)\s*\$?\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)\s*(?:an?\s+hour|\/\s*(?:hr|hour)|per\s+hour|hourly|hr\b)/i);
  const payHourlySingle = html.match(/\$\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)\s*(?:an?\s+hour|\/\s*(?:hr|hour)|per\s+hour|hourly)/i);
  const payAnnualRange = html.match(/\$\s*([0-9]{2,3}(?:,[0-9]{3})?)\s*(?:[-–]|to)\s*\$?\s*([0-9]{2,3}(?:,[0-9]{3})?)\s*(?:a\s+year|per\s+year|annually|\/\s*year)/i);
  if (payHourlyRange) {
    out.payLow = Math.round(Number(payHourlyRange[1]));
    out.payHigh = Math.round(Number(payHourlyRange[2]));
  } else if (payAnnualRange) {
    out.payLow = Math.round(Number(payAnnualRange[1].replace(/,/g, '')) / 2080);
    out.payHigh = Math.round(Number(payAnnualRange[2].replace(/,/g, '')) / 2080);
  } else if (payHourlySingle) {
    const v = Math.round(Number(payHourlySingle[1]));
    out.payLow = v; out.payHigh = v;
  }

  // Description — try JSON-LD schema first, then largest <p> block
  const jsonLd = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLd) {
    for (const block of jsonLd) {
      const inner = block.replace(/<script[^>]*>|<\/script>/gi, '');
      try {
        const data = JSON.parse(inner);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'JobPosting') {
            if (item.title && !out.title) out.title = item.title;
            if (item.description) out.description = stripTags(item.description).slice(0, 2000);
            if (item.baseSalary?.value?.minValue) out.payLow = Number(item.baseSalary.value.minValue);
            if (item.baseSalary?.value?.maxValue) out.payHigh = Number(item.baseSalary.value.maxValue);
            if (item.jobLocation?.address?.addressLocality && !out.location)
              out.location = `${item.jobLocation.address.addressLocality}, ${item.jobLocation.address.addressRegion || ''}`.trim().replace(/,\s*$/, '');
            if (item.employmentType) out.schedule = String(item.employmentType).replace(/_/g, ' ').toLowerCase();
          }
        }
      } catch (e) {}
    }
  }
  // Indeed-specific: the job body lives in #jobDescriptionText. Extract a
  // chunk from that id forward and strip tags (nested divs make a clean
  // regex capture unreliable, so we slice a window and clean it).
  if (!out.description) {
    const idx = html.search(/id=["']jobDescriptionText["']/i);
    if (idx >= 0) {
      const chunk = html.slice(idx, idx + 9000);
      const cleaned = stripTags(chunk.replace(/^[^>]*>/, ''));
      if (cleaned.length > 40) out.description = cleaned.slice(0, 1500);
    }
  }
  if (!out.description) {
    // Fall back to og:description or meta description
    out.description = findFirst(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
    ]);
  }

  // Trade guess
  const text = (out.title + ' ' + out.description).toLowerCase();
  out.tradeGuess = /hvac|air condition|heat\s*pump|refriger/.test(text) ? 'hvac'
    : /plumb|pipe|water heater/.test(text) ? 'plumbing'
    : /electric|wir(e|ing)|panel|ev charg/.test(text) ? 'electrical'
    : /roof|shingle|gutter/.test(text) ? 'roofing'
    : 'other';

  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  const session = await requireSession(req);
  if (!session) return json(res, 401, { error: 'not_authenticated' });

  const body = await readBody(req);
  const url = String(body.url || '').trim();
  const text = String(body.text || '').trim();

  // Mode 1: raw text paste — extract directly, no fetch needed.
  if (text) {
    const parsed = parseJobPost(text, url || 'pasted://text');
    return json(res, 200, { parsed, mode: 'text' });
  }

  if (!url || !/^https?:\/\//.test(url)) return json(res, 400, { error: 'invalid_url' });

  try {
    const html = await fetchHtml(url);
    const parsed = parseJobPost(html, url);
    return json(res, 200, { parsed, mode: process.env.SCRAPINGBEE_API_KEY ? 'scrapingbee' : 'direct' });
  } catch (e) {
    console.error('[import]', e);
    return json(res, 502, { error: 'fetch_failed', message: String(e.message || e) });
  }
}
