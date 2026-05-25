#!/usr/bin/env node
// Seed a demo shop directly into Vercel Blob. Usage:
//   BLOB_READ_WRITE_TOKEN=... node scripts/seed-shop.mjs

import { put, head } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.error('Set BLOB_READ_WRITE_TOKEN in env (pull from .env.local).');
  process.exit(1);
}

const shops = [
  {
    slug: 'jag-hvac',
    shopName: "Jag's HVAC",
    ownerEmail: 'jagdish@thursdaystrategy.com',
    trade: 'hvac',
    state: 'texas',
    city: 'Austin',
    licenseBoard: 'TDLR',
    licenseBoardUrl: 'https://www.tdlr.texas.gov',
    languages: ['en', 'es'],
    brand: { primary: '#c2410c', dark: '#9a330a', soft: '#fff7ed' },
    logoText: 'J',
    job: {
      title: 'HVAC Service Technician',
      payLow: 32, payHigh: 48,
      summary: "We're a growing residential HVAC shop in central Texas. Looking for a licensed tech with 3+ years of experience — service, install, diagnostics. Spanish a plus.",
      perks: ['Health + dental (100% covered)', '$5K signing bonus @ 90 days', 'Take-home truck', 'Paid TDLR continuing-ed', '401(k) with 4% match'],
      schedule: 'M–F + occasional Sat'
    },
    questions: [
      { key: 'license', en: "What's your TDLR license number?", es: '¿Cuál es tu número de licencia TDLR?' },
      { key: 'experience', en: 'How many years of residential HVAC experience?', es: '¿Cuántos años de experiencia en HVAC residencial?' },
      { key: 'epa608', en: 'Do you have an active EPA 608 certification?', es: '¿Tienes certificación EPA 608 activa?' },
      { key: 'available', en: 'When can you start?', es: '¿Cuándo puedes empezar?' }
    ],
    calLink: 'https://cal.com/jack-roastman/15min',
    status: 'active',
    applicantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function ensureSlugLock(slug, owner) {
  try {
    await head(`slugs/${slug}.json`, { token: TOKEN });
    console.log(`  • slug lock ${slug} already exists`);
  } catch (e) {
    await put(`slugs/${slug}.json`, JSON.stringify({ slug, ownerEmail: owner, claimedAt: new Date().toISOString() }), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: false, token: TOKEN
    });
    console.log(`  ✓ claimed slug ${slug}`);
  }
}

async function ensureUser(email, slugs) {
  let existing = null;
  try {
    const meta = await head(`users/${email}.json`, { token: TOKEN });
    const res = await fetch(meta.url + '?t=' + Date.now());
    existing = await res.json();
  } catch (e) { existing = null; }
  const user = existing || { email, shops: [], createdAt: new Date().toISOString() };
  for (const s of slugs) if (!user.shops.includes(s)) user.shops.push(s);
  user.updatedAt = new Date().toISOString();
  await put(`users/${email}.json`, JSON.stringify(user, null, 2), {
    access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, token: TOKEN
  });
  console.log(`  ✓ user ${email} → shops ${user.shops.join(', ')}`);
}

for (const shop of shops) {
  console.log(`Seeding ${shop.slug}…`);
  await ensureSlugLock(shop.slug, shop.ownerEmail);
  await put(`shops/${shop.slug}.json`, JSON.stringify(shop, null, 2), {
    access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, token: TOKEN
  });
  console.log(`  ✓ shops/${shop.slug}.json written`);
  await ensureUser(shop.ownerEmail, [shop.slug]);
}
console.log('Done.');
