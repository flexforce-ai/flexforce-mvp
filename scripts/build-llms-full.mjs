#!/usr/bin/env node
// Generate llms-full.txt by concatenating cleaned content from every key page.
// Strips HTML, preserves headings + paragraph structure as markdown.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  { path: '/', file: 'index.html', title: 'FlexForce.ai — home' },
  { path: '/trades/hvac/', file: 'trades/hvac/index.html' },
  { path: '/trades/plumbing/', file: 'trades/plumbing/index.html' },
  { path: '/trades/electrical/', file: 'trades/electrical/index.html' },
  { path: '/trades/roofing/', file: 'trades/roofing/index.html' },
  { path: '/states/texas/', file: 'states/texas/index.html' },
  { path: '/states/new-jersey/', file: 'states/new-jersey/index.html' },
  { path: '/states/utah/', file: 'states/utah/index.html' },
  { path: '/states/connecticut/', file: 'states/connecticut/index.html' },
  { path: '/states/new-york/', file: 'states/new-york/index.html' },
  ...['hvac-technicians', 'plumbers', 'electricians', 'roofers'].flatMap(tp =>
    ['texas', 'new-jersey', 'utah', 'connecticut', 'new-york'].map(st => ({
      path: `/hire/${tp}/${st}/`, file: `hire/${tp}/${st}/index.html`
    }))
  ),
  { path: '/guides/how-to-hire-hvac-technician-fast/', file: 'guides/how-to-hire-hvac-technician-fast/index.html' },
  { path: '/guides/spanish-speaking-trades-recruiting/', file: 'guides/spanish-speaking-trades-recruiting/index.html' },
  { path: '/guides/why-trades-applicants-ghost/', file: 'guides/why-trades-applicants-ghost/index.html' },
  { path: '/guides/2026-skilled-trades-labor-shortage-report/', file: 'guides/2026-skilled-trades-labor-shortage-report/index.html' },
  { path: '/guides/cost-to-hire-a-licensed-tradesperson/', file: 'guides/cost-to-hire-a-licensed-tradesperson/index.html' },
  { path: '/compare/flexforce-vs-indeed/', file: 'compare/flexforce-vs-indeed/index.html' },
  { path: '/compare/flexforce-vs-servicetitan-recruiting/', file: 'compare/flexforce-vs-servicetitan-recruiting/index.html' },
  { path: '/compare/flexforce-vs-workrise/', file: 'compare/flexforce-vs-workrise/index.html' },
  { path: '/compare/flexforce-vs-in-house-recruiter/', file: 'compare/flexforce-vs-in-house-recruiter/index.html' },
  { path: '/reports/2026-skilled-trades-hiring-report/', file: 'reports/2026-skilled-trades-hiring-report/index.html' }
];

function htmlToMarkdown(html) {
  // Drop everything outside <body> and remove scripts + styles.
  let body = html.replace(/[\s\S]*<body[^>]*>/i, '').replace(/<\/body>[\s\S]*/i, '');
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<style[\s\S]*?<\/style>/gi, '');
  body = body.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  body = body.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  // Heading conversions.
  body = body.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t).trim()}\n\n`);
  body = body.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t).trim()}\n\n`);
  body = body.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t).trim()}\n\n`);
  // Paragraphs
  body = body.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `${stripTags(t).trim()}\n\n`);
  // Lists
  body = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}\n`);
  body = body.replace(/<\/(ul|ol)>/gi, '\n');
  body = body.replace(/<(ul|ol)[^>]*>/gi, '');
  // Tables
  body = body.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, t) => {
    const cells = [];
    t.replace(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, cell) => { cells.push(stripTags(cell).trim()); return ''; });
    return cells.length ? `| ${cells.join(' | ')} |\n` : '';
  });
  body = body.replace(/<\/?(thead|tbody|table)[^>]*>/gi, '\n');
  // Drop any remaining tags
  body = stripTags(body);
  // Collapse whitespace
  body = body.replace(/\n{3,}/g, '\n\n').trim();
  return body;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
}

function main() {
  const out = [];
  out.push('# FlexForce.ai — full content\n');
  out.push('> Concatenated content for AI crawlers. Maintained at https://flexforce.ai/llms-full.txt\n');
  out.push(`> Generated ${new Date().toISOString().slice(0, 10)}.\n\n---\n`);

  for (const page of PAGES) {
    const fp = path.join(ROOT, page.file);
    if (!fs.existsSync(fp)) {
      console.warn(`  skip ${page.path} (file not found: ${page.file})`);
      continue;
    }
    const html = fs.readFileSync(fp, 'utf8');
    const md = htmlToMarkdown(html);
    out.push(`\n\n# Source: https://flexforce.ai${page.path}\n\n${md}\n\n---\n`);
    console.log(`  ✓ ${page.path}`);
  }

  fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), out.join(''));
  console.log(`Wrote llms-full.txt (${out.join('').length} bytes)`);
}

main();
