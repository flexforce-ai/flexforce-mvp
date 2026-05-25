// Vercel Blob helpers — JSON-typed get/put/list/del + FCFS locks.
import { put, head, del, list } from '@vercel/blob';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function jsonPut(pathname, data, { allowOverwrite = true } = {}) {
  const body = JSON.stringify(data, null, 2);
  return await put(pathname, body, {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite,
    token: TOKEN,
    cacheControlMaxAge: 0
  });
}

async function jsonGet(pathname) {
  try {
    const meta = await head(pathname, { token: TOKEN });
    const res = await fetch(meta.url, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    if (e.status === 404 || /not\s*found/i.test(String(e.message))) return null;
    throw e;
  }
}

async function exists(pathname) {
  try {
    await head(pathname, { token: TOKEN });
    return true;
  } catch (e) {
    return false;
  }
}

async function jsonDel(pathname) {
  try {
    await del(pathname, { token: TOKEN });
    return true;
  } catch (e) {
    return false;
  }
}

async function listPrefix(prefix) {
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, cursor, token: TOKEN, limit: 1000 });
    for (const b of r.blobs) out.push(b);
    cursor = r.cursor;
  } while (cursor);
  return out;
}

// FCFS slug claim. Returns true if claimed, false if already taken.
async function claimSlug(slug, ownerEmail) {
  try {
    await jsonPut(`slugs/${slug}.json`, { slug, ownerEmail, claimedAt: new Date().toISOString() }, { allowOverwrite: false });
    return true;
  } catch (e) {
    return false;
  }
}

async function releaseSlug(slug) {
  return await jsonDel(`slugs/${slug}.json`);
}

export {
  jsonPut, jsonGet, jsonDel, exists, listPrefix, claimSlug, releaseSlug
};
