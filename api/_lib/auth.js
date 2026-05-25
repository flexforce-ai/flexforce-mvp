// Magic-link auth backed by Vercel Blob.
import crypto from 'node:crypto';
import { jsonGet, jsonPut, jsonDel } from './blob.js';

const SESSION_TTL_DAYS = 14;
const COOKIE_NAME = 'ff_session';

function token() {
  return crypto.randomBytes(24).toString('base64url');
}

async function createMagicLink(email, redirect = '/app/dashboard') {
  const t = token();
  await jsonPut(`magic/${t}.json`, {
    email: email.toLowerCase(),
    redirect,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
  });
  return t;
}

async function consumeMagicLink(t) {
  const data = await jsonGet(`magic/${t}.json`);
  if (!data) return null;
  if (new Date(data.expiresAt) < new Date()) {
    await jsonDel(`magic/${t}.json`);
    return null;
  }
  await jsonDel(`magic/${t}.json`);
  return data;
}

async function createSession(email) {
  const t = token();
  const data = {
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()
  };
  await jsonPut(`sessions/${t}.json`, data);
  return { token: t, ...data };
}

async function getSession(t) {
  if (!t) return null;
  const data = await jsonGet(`sessions/${t}.json`);
  if (!data) return null;
  if (new Date(data.expiresAt) < new Date()) {
    await jsonDel(`sessions/${t}.json`);
    return null;
  }
  return data;
}

async function destroySession(t) {
  if (!t) return;
  await jsonDel(`sessions/${t}.json`);
}

function parseCookies(cookieHeader = '') {
  const out = {};
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(rest.join('=') || '');
  }
  return out;
}

function sessionCookie(token, opts = {}) {
  const maxAge = SESSION_TTL_DAYS * 24 * 60 * 60;
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${opts.maxAge ?? maxAge}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

async function requireSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const s = await getSession(cookies[COOKIE_NAME]);
  return s;
}

// Admin auth — simple shared password
function isAdminAuthorized(req) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies.ff_admin === pass) return true;
  const header = req.headers.authorization || '';
  if (header === `Bearer ${pass}`) return true;
  return false;
}

function adminCookie() {
  const pass = process.env.ADMIN_PASSWORD || '';
  return `ff_admin=${encodeURIComponent(pass)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;
}

function clearAdminCookie() {
  return `ff_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export {
  createMagicLink, consumeMagicLink,
  createSession, getSession, destroySession,
  parseCookies, sessionCookie, clearSessionCookie, requireSession,
  isAdminAuthorized, adminCookie, clearAdminCookie,
  COOKIE_NAME
};
