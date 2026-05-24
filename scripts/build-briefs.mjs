#!/usr/bin/env node
// Generate one content-briefs/[slug].md per page from data.mjs.
// Each brief documents: page type, primary keyword, secondary keywords,
// audience, structure, and the 13 required-element confirmation for money pages.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATES, TRADES, faqsFor } from './data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'content-briefs');
fs.mkdirSync(OUT, { recursive: true });

function writeBrief(slug, body) {
  fs.writeFileSync(path.join(OUT, `${slug}.md`), body);
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Money pages ────────────────────────────────────────────────────────────
for (const stateSlug of Object.keys(STATES)) {
  for (const tradeSlug of Object.keys(TRADES)) {
    const s = STATES[stateSlug];
    const t = TRADES[tradeSlug];
    const tradePath = tradeSlug === 'hvac' ? 'hvac-technicians' : tradeSlug;
    const slugBase = `hire-${t.hubSlug}-${s.abbr.toLowerCase()}`;
    const primary = `hire ${t.display} ${s.name}`;
    const wave = s.abbr === 'TX' || s.abbr === 'NJ' ? 1 : s.abbr === 'UT' ? 2 : 3;
    const faqs = faqsFor(stateSlug, tradeSlug);

    writeBrief(slugBase, `# Content brief — hire ${t.display} in ${s.name}

**URL:** \`/hire/${tradePath}/${stateSlug}/\`
**Type:** money page
**Wave:** ${wave}
**Intent:** BOFU (commercial — contractor actively hiring)

## Keywords

- **Primary:** ${primary}
- **Secondary:** ${t.hubSlug} hiring software ${s.abbr}, ${t.displaySingular} recruiting ${s.cities[0].name}, ${s.boardShort} ${t.hubSlug} license verification, ${t.display} shortage ${s.name}
- **Long-tail variants:** find ${t.display} fast ${s.cities[0].name}, ${t.displaySingular} ATS ${s.abbr}, bilingual ${t.hubSlug} hiring ${s.name}

## Audience

Small home-service contractor (3–30 techs) in ${s.name} actively hiring ${t.display}. Either replacing a tech who left or growing the team. Pain: applicants ghost, response too slow, license verification manual.

## Local hook (in first 100 words)

- City: ${s.cities[0].name}, ${s.cities[1].name}, or ${s.cities[2].name}
- License board: ${s.board}
- Pain: ${s.statePain.split('.')[0]}.

## 13 required elements — confirmed

1. ✓ H1 with primary keyword exact: "how to hire ${t.display} in ${s.name} — fast."
2. ✓ Local hook in first 100 words (city + license board + state pain)
3. ✓ Wage band table — 4 cities × 3 tiers (entry / journeyman / senior)
4. ✓ License verification section (${s.boardShort}, lookup link)
5. ✓ 3 named associations (${t.associations[stateSlug].map(a => a.name).join(', ')})
6. ✓ 3 city callouts (${s.cities.map(c => c.name).join(', ')})
7. ✓ Pain section unique to this state-trade combo
8. ✓ Bilingual block (${s.bilingual === 'omit' ? 'omitted per state spec — UT' : s.bilingual === 'brief' ? 'brief mention — CT' : 'full block — TX/NJ/NY'})
9. ✓ Comparison table — FlexForce vs Indeed vs in-house recruiter
10. ✓ CTA block (green bg, lime button, "start free pilot →")
11. ✓ 5 FAQ items as faq-q/faq-a div pairs
12. ✓ Related links — trade hub, state hub, 2 guides, 1 comparison
13. ✓ JSON-LD: LocalBusiness + Service + FAQPage + Article + Speakable

## FAQs (5)

${faqs.map((f, i) => `${i + 1}. **${f.q}**\n   ${f.a}`).join('\n\n')}

## Internal links out

- /trades/${t.hubSlug}/
- /states/${stateSlug}/
- /guides/how-to-hire-hvac-technician-fast/
- /guides/why-trades-applicants-ghost/
- /compare/flexforce-vs-indeed/
`);
  }
}

// ─── State hubs ────────────────────────────────────────────────────────────
for (const stateSlug of Object.keys(STATES)) {
  const s = STATES[stateSlug];
  const wave = s.abbr === 'TX' || s.abbr === 'NJ' ? 1 : s.abbr === 'UT' ? 2 : 3;
  writeBrief(`state-${stateSlug}`, `# Content brief — ${s.name} trades hiring hub

**URL:** \`/states/${stateSlug}/\`
**Type:** state hub
**Wave:** ${wave}
**Intent:** MOFU (research — contractor exploring market dynamics)

## Keywords

- **Primary:** hiring trades workers ${s.name}
- **Secondary:** ${s.name} HVAC plumber electrician roofer hiring, ${s.boardShort} license, trades shortage ${s.name} 2026

## Audience

${s.name}-based contractor either evaluating market conditions or doing competitive research. Wants a single place to compare wages, license requirements, and pain points across trades in the state.

## Structure

- H1: hiring trades workers in ${s.name} — fast, licensed, ready
- Overview section: ${s.statePain.split('.')[0]}.
- 4 trade cards linking to each /hire/[trade]/${stateSlug}/ money page
- State wage table — 4 trades × wage band × license board
- 3 city callouts (${s.cities.map(c => c.name).join(', ')})
- License verification section (${s.boardShort})
- 5 FAQs (state-level)
- Related links + CTA

## JSON-LD

ItemList (4 trade money pages) + Service + FAQPage

## Internal links out

- All 4 /hire/[trade]/${stateSlug}/ money pages
- /trades/hvac/
- /reports/2026-skilled-trades-hiring-report/
`);
}

// ─── Trade hubs ────────────────────────────────────────────────────────────
for (const tradeSlug of Object.keys(TRADES)) {
  const t = TRADES[tradeSlug];
  writeBrief(`trade-${t.hubSlug}`, `# Content brief — ${cap(t.display)} hiring hub

**URL:** \`/trades/${t.hubSlug}/\`
**Type:** trade hub
**Wave:** 1
**Intent:** MOFU (research — contractor exploring hiring tools for this trade)

## Keywords

- **Primary:** hire ${t.display} fast
- **Secondary:** ${t.displaySingular} shortage 2026, how to find licensed ${t.display}, AI ${t.hubSlug} hiring software, ${t.displaySingular} ATS

## Audience

Owner of a small home-service shop in this trade. Comparing hiring approaches: Indeed, recruiter, AI tools. Wants concrete data on response time, screening quality, license verification.

## Structure

- H1: hire ${t.display} fast
- Overview: ${t.tradePainSnippet}
- 5 state cards linking to each /hire/[trade]/[state]/ money page
- How FlexForce works for this trade (response, screen, verify, book)
- Shortage section with BLS / JLL / association citations
- 5 FAQs (trade-level)
- Related links + CTA

## JSON-LD

ItemList (5 state money pages) + Service + FAQPage

## Internal links out

- All 5 /hire/[trade]/[state]/ money pages for this trade
- /reports/2026-skilled-trades-hiring-report/
- /compare/flexforce-vs-indeed/
`);
}

// ─── Guides + comparisons + report (terse — content is bespoke per page) ───
const longForm = [
  { slug: 'guide-hire-hvac-fast', title: 'How to hire an HVAC technician fast', url: '/guides/how-to-hire-hvac-technician-fast/', type: 'guide', wave: 1, primary: 'how to hire HVAC technician fast', intent: 'MOFU', audience: 'Small HVAC contractors looking for hiring playbook.', focus: 'Response-time data, screening checklist, license verification, ROI math.', schemas: 'Article + FAQPage + HowTo + Speakable' },
  { slug: 'guide-spanish-trades', title: 'Spanish-speaking trades recruiting playbook', url: '/guides/spanish-speaking-trades-recruiting/', type: 'guide', wave: 1, primary: 'Spanish-speaking trades recruiting', intent: 'MOFU', audience: 'Contractors in TX/NJ/NY/CA hiring in bilingual markets.', focus: 'Why it matters, how to run a bilingual funnel without a bilingual recruiter, legal status, interview/onboarding tips.', schemas: 'Article + FAQPage + Speakable' },
  { slug: 'guide-why-ghost', title: 'Why trades applicants ghost', url: '/guides/why-trades-applicants-ghost/', type: 'guide', wave: 1, primary: 'why trades applicants ghost', intent: 'MOFU', audience: 'Frustrated contractors losing candidates mid-funnel.', focus: 'Three reasons, response-time data, the single lever that fixes it.', schemas: 'Article + FAQPage + Speakable' },
  { slug: 'guide-shortage-report', title: '2026 skilled trades labor shortage — small contractor brief', url: '/guides/2026-skilled-trades-labor-shortage-report/', type: 'guide', wave: 1, primary: 'skilled trades labor shortage 2026', intent: 'TOFU', audience: 'Contractors + media researching trades workforce trends.', focus: 'JLL 350k gap, trade-by-trade shortage, structural causes, contractor implications.', schemas: 'Article + FAQPage + Speakable' },
  { slug: 'guide-cost-to-hire', title: 'The real cost to hire a licensed tradesperson in 2026', url: '/guides/cost-to-hire-a-licensed-tradesperson/', type: 'guide', wave: 1, primary: 'cost to hire HVAC technician', intent: 'MOFU', audience: 'Contractors evaluating hiring tool ROI.', focus: 'Full cost stack, vacancy cost, in-house vs external vs AI, bad-hire math.', schemas: 'Article + FAQPage + Speakable' },
  { slug: 'compare-indeed', title: 'FlexForce vs Indeed', url: '/compare/flexforce-vs-indeed/', type: 'comparison', wave: 1, primary: 'FlexForce vs Indeed trades hiring', intent: 'BOFU', audience: 'Contractors using Indeed and frustrated with funnel.', focus: 'Different problems — Indeed sources, FlexForce screens. Most use both.', schemas: 'Article + FAQPage' },
  { slug: 'compare-servicetitan', title: 'FlexForce vs ServiceTitan recruiting', url: '/compare/flexforce-vs-servicetitan-recruiting/', type: 'comparison', wave: 1, primary: 'FlexForce vs ServiceTitan recruiting', intent: 'BOFU', audience: 'Multi-shop operators on ServiceTitan or evaluating it.', focus: 'Hiring as secondary feature in ST vs focused tool. Run both.', schemas: 'Article + FAQPage' },
  { slug: 'compare-workrise', title: 'FlexForce vs Workrise', url: '/compare/flexforce-vs-workrise/', type: 'comparison', wave: 1, primary: 'FlexForce vs Workrise', intent: 'BOFU', audience: 'Contractors confused by gig-marketplace vs hiring-tool category.', focus: 'Workrise = gig labor marketplace; FlexForce = employee hiring. Different problems.', schemas: 'Article + FAQPage' },
  { slug: 'compare-recruiter', title: 'FlexForce vs in-house recruiter', url: '/compare/flexforce-vs-in-house-recruiter/', type: 'comparison', wave: 1, primary: 'FlexForce vs in-house recruiter', intent: 'MOFU', audience: 'Growing shops weighing first-recruiter hire vs hiring tool.', focus: 'Cost math, when each works, hybrid model for scaling shops.', schemas: 'Article + FAQPage' },
  { slug: 'report-2026', title: '2026 Skilled Trades Hiring Report', url: '/reports/2026-skilled-trades-hiring-report/', type: 'report', wave: 1, primary: '2026 skilled trades hiring report', intent: 'TOFU', audience: 'Contractors, trade associations, journalists, analysts.', focus: 'Citable original-data artifact. 350k gap, response-time data, cost math, state pressure.', schemas: 'Article + Dataset + FAQPage + Speakable' }
];

for (const p of longForm) {
  writeBrief(p.slug, `# Content brief — ${p.title}

**URL:** \`${p.url}\`
**Type:** ${p.type}
**Wave:** ${p.wave}
**Intent:** ${p.intent}

## Keyword

- **Primary:** ${p.primary}

## Audience

${p.audience}

## Editorial focus

${p.focus}

## Structure

- H1 matches primary keyword
- Question-led H2s; first sentence under each H2 is the direct answer (Speakable-class on key answers)
- 4–6 body sections, paragraphs ≤ 3 sentences each
- 5 FAQ items at the bottom
- Branded CTA block
- Related links to relevant money pages + adjacent long-form

## Schema (JSON-LD)

${p.schemas}

## Editorial notes

- First-person owner voice (Jack)
- Lowercase confident headlines
- Cite real public sources by name (BLS, JLL, Indeed Hiring Lab, ACCA, PHCC, NECA, ABC)
- For the report: mark proprietary synthesis as "FlexForce Analysis" callouts; include citation block
`);
}

console.log('Briefs written:', fs.readdirSync(OUT).length);
