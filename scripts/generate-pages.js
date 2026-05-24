#!/usr/bin/env node
// FlexForce page generator.
// Reads scripts/pages-config.json, loads the matching template under templates/,
// substitutes every {{TOKEN}} with the page's tokens, writes index.html to the
// canonical path.
//
// Usage:
//   node scripts/generate-pages.js              generate every page in the config
//   node scripts/generate-pages.js <slug>       generate only the page with that slug
//
// Slugs match the `slug` field in pages-config.json (e.g. "hire-hvac-nj").

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const PARTIALS_DIR = path.join(TEMPLATES_DIR, 'partials');
const CONFIG_PATH = path.join(__dirname, 'pages-config.json');

const STYLES = fs.readFileSync(path.join(PARTIALS_DIR, 'styles.css'), 'utf8');
const NAV = fs.readFileSync(path.join(PARTIALS_DIR, 'nav.html'), 'utf8').trimEnd();
const FOOTER = fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8').trimEnd();
const TRACKING = fs.readFileSync(path.join(PARTIALS_DIR, 'tracking.html'), 'utf8').trimEnd();

function loadTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, `${name}.html`), 'utf8');
}

function substitute(template, tokens) {
  let out = template;
  // Two-pass replacement so token values can reference other tokens.
  for (let pass = 0; pass < 2; pass++) {
    for (const [key, value] of Object.entries(tokens)) {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      out = out.replace(pattern, value == null ? '' : String(value));
    }
  }
  return out;
}

function findUnreplacedTokens(html) {
  const matches = html.match(/\{\{[A-Z0-9_]+\}\}/g);
  return matches ? Array.from(new Set(matches)) : [];
}

function generatePage(page) {
  const template = loadTemplate(page.template);
  const tokens = {
    STYLES,
    NAV,
    FOOTER,
    TRACKING,
    PAGE_ID: page.slug,
    PAGE_TYPE: page.template,
    PAGE_WAVE: page.wave ? String(page.wave) : '',
    PAGE_STATE: '',
    PAGE_TRADE: '',
    ...page.tokens,
  };
  const html = substitute(template, tokens);

  const unreplaced = findUnreplacedTokens(html);
  if (unreplaced.length) {
    console.warn(`  ⚠ ${page.slug}: unreplaced tokens → ${unreplaced.join(', ')}`);
  }

  const outDir = path.join(ROOT, page.outputPath.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'index.html');
  fs.writeFileSync(outFile, html, 'utf8');
  return { outFile, unreplaced };
}

function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const filterSlug = process.argv[2];
  const pages = filterSlug
    ? config.pages.filter(p => p.slug === filterSlug)
    : config.pages;

  if (!pages.length) {
    console.error(`No pages matched${filterSlug ? ` slug="${filterSlug}"` : ''}`);
    process.exit(1);
  }

  console.log(`Generating ${pages.length} page(s)…`);
  let totalUnreplaced = 0;
  for (const page of pages) {
    const { outFile, unreplaced } = generatePage(page);
    totalUnreplaced += unreplaced.length;
    console.log(`  ✓ ${page.slug} → ${path.relative(ROOT, outFile)}`);
  }
  console.log(`Done. ${totalUnreplaced ? `${totalUnreplaced} token(s) unreplaced — see warnings above.` : 'All tokens replaced.'}`);
}

main();
