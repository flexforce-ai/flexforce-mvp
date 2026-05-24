#!/usr/bin/env node
// Generates scripts/pages-config.json from data.mjs.
// Run: node scripts/build-config.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATES, TRADES, WAGE_TABLES, PAIN_INTROS, faqsFor, PUB_DATE } from './data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, 'pages-config.json');

// ─── helpers ────────────────────────────────────────────────────────────────
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const article = w => /^[aeiou]/i.test(w) ? 'an' : 'a';

function paragraphs(arr) {
  return arr.map(p => `    <p>${p}</p>`).join('\n');
}

function faqHtmlBlock(faqs) {
  return faqs.map((f, i) => {
    const speakable = i === 0 ? ' speakable-answer' : '';
    return `    <div class="faq-item">\n      <p class="faq-q">${f.q}</p>\n      <p class="faq-a${speakable}">${f.a}</p>\n    </div>`;
  }).join('\n\n');
}

function faqJsonLd(faqs) {
  return faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }));
}

function wageTableRows(rows) {
  return rows.map(r =>
    `        <tr>\n          <td>${r[0]}</td>\n          <td>${r[1]}</td>\n          <td>${r[2]}</td>\n          <td>${r[3]}</td>\n        </tr>`
  ).join('\n');
}

function escapeJs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ─── money page builder ─────────────────────────────────────────────────────
function buildMoneyPage(stateSlug, tradeSlug) {
  const s = STATES[stateSlug];
  const t = TRADES[tradeSlug];
  const wage = t.wageBands[stateSlug];
  const wageRows = WAGE_TABLES[stateSlug][tradeSlug];
  const assoc = t.associations[stateSlug];
  const faqs = faqsFor(stateSlug, tradeSlug);
  const painIntro = PAIN_INTROS[`${stateSlug}/${tradeSlug}`];
  const slugId = `hire-${tradeSlug === 'plumbers' ? 'plumbing' : tradeSlug === 'electricians' ? 'electrical' : tradeSlug === 'roofers' ? 'roofing' : 'hvac'}-${s.abbr.toLowerCase()}`;

  // Trade path segment
  const tradePath = tradeSlug === 'hvac' ? 'hvac-technicians' : tradeSlug;

  const wave = s.abbr === 'TX' || s.abbr === 'NJ' ? 1 : s.abbr === 'UT' ? 2 : 3;

  const headlineLower = `hire ${t.display} in ${s.name} — fast`;
  const stat1 = '60s';
  const stat1L = 'time to first applicant call';
  const stat2Map = { texas:'87k+', 'new-jersey':'14k+', utah:'9k+', connecticut:'8k+', 'new-york':'52k+' };
  const stat2 = stat2Map[stateSlug];
  const stat2L = `active ${t.display} postings in ${s.abbr} (2025)`;
  const stat3 = s.bilingual === 'omit' ? '24/7' : '$0';
  const stat3L = s.bilingual === 'omit' ? 'screening coverage (incl. nights & weekends)' : 'extra cost for bilingual screening';

  // Bilingual block
  let bilingualBlock = '';
  if (s.bilingual !== 'omit') {
    const intensity = s.bilingual === 'brief'
      ? `is meaningful particularly in ${s.bilingualCities}`
      : `is significant ${s.bilingualNote}. Posting in English only cuts your candidate pool by an estimated 25–35% in those markets`;
    bilingualBlock = `  <section class="section">
    <h2>How do you hire bilingual ${t.display} in ${s.name}?</h2>
    <p class="speakable-answer">A meaningful share of ${s.name}'s ${t.display} workforce is Spanish-dominant — and the share ${intensity}.</p>
    <p>FlexForce screens in both English and Spanish. When an applicant calls the screening number, the AI detects their language preference or lets them choose. The screening questions, license verification prompts, and interview scheduling all happen in the applicant's preferred language. You review a translated summary in English. No bilingual recruiter needed.</p>
  </section>`;
  }

  // JSON-LD
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'FlexForce.ai',
      url: 'https://flexforce.ai',
      description: `AI hiring manager for small home-service contractors. Calls every ${t.displaySingular} applicant in ${s.name} within 60 seconds, screens in English or Spanish, verifies ${s.boardShort} licenses, and books interviews.`,
      founder: { '@type': 'Person', name: 'Jack' },
      areaServed: { '@type': 'State', name: s.name },
      priceRange: '$299–$999/month',
      sameAs: ['https://flexforce.ai']
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${cap(t.displaySingular)} Hiring — ${s.name}`,
      provider: { '@type': 'Organization', name: 'FlexForce.ai' },
      areaServed: { '@type': 'State', name: s.name },
      description: `Automated ${t.displaySingular} applicant screening, ${s.boardShort} license verification, ${s.bilingual === 'omit' ? '24/7 ' : 'bilingual (English/Spanish) '}phone screening, and interview booking for ${s.name} contractors.`,
      offers: {
        '@type': 'Offer', price: '299', priceCurrency: 'USD',
        priceSpecification: { '@type': 'UnitPriceSpecification', unitText: 'month' }
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqJsonLd(faqs)
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: headlineLower,
      author: { '@type': 'Person', name: 'Jack' },
      publisher: { '@type': 'Organization', name: 'FlexForce.ai', url: 'https://flexforce.ai' },
      datePublished: PUB_DATE,
      dateModified: PUB_DATE,
      mainEntityOfPage: `https://flexforce.ai/hire/${tradePath}/${stateSlug}/`,
      description: `How small ${t.display.toLowerCase().replace('s', '')} contractors in ${s.name} can hire faster using AI screening, ${s.boardShort} license verification, and ${s.bilingual === 'omit' ? '24/7 availability' : 'bilingual phone calls'}.`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Speakable',
      cssSelector: ['.speakable-intro', '.speakable-answer']
    }
  ];

  return {
    slug: slugId,
    template: 'hire-money-page',
    wave,
    outputPath: `/hire/${tradePath}/${stateSlug}/`,
    tokens: {
      PAGE_STATE: stateSlug, PAGE_TRADE: t.pageTrade,
      PAGE_TITLE: `hire ${t.display} in ${s.name} — fast | FlexForce.ai`,
      META_DESCRIPTION: `FlexForce calls every ${t.displaySingular} applicant in ${s.name} within 60 seconds, screens in English or Spanish, verifies ${s.boardShort} licenses, and books interviews. Try free for 30 days.`,
      CANONICAL_PATH: `/hire/${tradePath}/${stateSlug}/`,
      CITATION_TITLE: `How to Hire ${cap(t.display)} in ${s.name} Fast — FlexForce.ai`,
      PUB_DATE,
      H1: `how to hire ${t.display} in ${s.name} — fast.`,
      HERO_EYEBROW: `${s.lower} / ${t.display}`,
      HERO_SUB: `FlexForce calls every ${t.displaySingular} applicant in ${s.name} within 60 seconds of applying, screens them in English or Spanish, verifies their ${s.boardShort} license automatically, and books the interview — while you're on a job site.`,
      STAT_1_NUM: stat1, STAT_1_LABEL: stat1L,
      STAT_2_NUM: stat2, STAT_2_LABEL: stat2L,
      STAT_3_NUM: stat3, STAT_3_LABEL: stat3L,
      TRADE_HUB_SLUG: t.hubSlug, TRADE_HUB_LABEL: t.hubLabel,
      TRADE_DISPLAY: t.display, TRADE_DISPLAY_SINGULAR: t.displaySingular,
      STATE_NAME: s.name, STATE_NAME_LOWER: s.lower, STATE_SLUG: stateSlug, STATE_ABBR: s.abbr,
      LICENSE_BOARD: s.board, LICENSE_BOARD_SHORT: s.boardShort,
      LICENSE_BOARD_URL: s.boardUrl, LICENSE_LOOKUP_URL: s.boardLookupUrl, LICENSE_LOOKUP_LABEL: s.boardLookupLabel,
      PAIN_H2: `Why is it so hard to hire ${t.display} in ${s.name} right now?`,
      PAIN_PARAGRAPHS: paragraphs(painIntro),
      WAGE_H2: `What do ${t.display} earn in ${s.name}?`,
      WAGE_ANSWER: `${cap(t.display)} in ${s.name} earn ${wage.range}, ${wage.anchor}.`,
      WAGE_TABLE_ROWS: wageTableRows(wageRows),
      WAGE_TABLE_CAPTION: `Source: BLS Occupational Employment & Wage Statistics (2025), Indeed Hiring Lab ${s.name} report (Q1 2026). Rates reflect W-2 employment; 1099 field rates run 15–20% higher.`,
      LICENSE_H2: `How does ${t.display.replace(/s$/, '')} license verification work in ${s.name}?`,
      LICENSE_ANSWER: `In ${s.name}, ${t.display} are licensed through the ${s.board}. You can verify any license at ${s.boardUrl.replace('https://', '').replace('www.', '')} in about 30 seconds by entering the technician's name or license number.`,
      LICENSE_PARAGRAPHS: paragraphs([
        `${s.name} requires a state-issued license for ${t.display} working on residential and commercial properties. License classes typically differentiate apprentice, journeyman, and master/contractor tiers, with experience and exam requirements at each step.`,
        t.licenseNote,
        `FlexForce checks ${s.boardShort} status during every screening call. If a candidate's license is expired, inactive, or the name doesn't match, they're flagged automatically — you never waste an interview slot on an unlicensed tech.`
      ]),
      BILINGUAL_BLOCK: bilingualBlock,
      CITIES_H2: `What are the top ${s.name} cities for hiring ${t.display}?`,
      CITY_1: s.cities[0].name, CITY_1_CONTEXT: s.cities[0].ctx,
      CITY_2: s.cities[1].name, CITY_2_CONTEXT: s.cities[1].ctx,
      CITY_3: s.cities[2].name, CITY_3_CONTEXT: s.cities[2].ctx,
      ASSOC_H2: `Which ${s.name} ${t.display.replace(/s$/, '')} trade associations should I know about?`,
      ASSOC_1_NAME: assoc[0].name, ASSOC_1_DESC: assoc[0].desc, ASSOC_1_URL: assoc[0].url, ASSOC_1_URL_LABEL: assoc[0].label,
      ASSOC_2_NAME: assoc[1].name, ASSOC_2_DESC: assoc[1].desc, ASSOC_2_URL: assoc[1].url, ASSOC_2_URL_LABEL: assoc[1].label,
      ASSOC_3_NAME: assoc[2].name, ASSOC_3_DESC: assoc[2].desc, ASSOC_3_URL: assoc[2].url, ASSOC_3_URL_LABEL: assoc[2].label,
      COMPARE_BILINGUAL: s.bilingual === 'omit' ? '○ optional' : '✓ EN + ES',
      FAQ_BLOCK: faqHtmlBlock(faqs),
      CTA_HEADLINE: `stop losing ${s.name} ${t.display.toLowerCase()} hires to slow follow-up.`,
      CTA_BODY: `Start your 30-day free pilot. FlexForce calls your next applicant in 60 seconds, ${s.bilingual === 'omit' ? 'verifies their ' + s.boardShort + ' license' : 'screens them in English or Spanish'}, and books the interview. You just show up.`,
      RELATED_LINKS_BLOCK: [
        `      <a href="/trades/${t.hubSlug}/" class="related-link">${cap(t.display.replace(/s$/, ''))} hiring guide</a>`,
        `      <a href="/states/${stateSlug}/" class="related-link">${s.name} trades hiring hub</a>`,
        `      <a href="/guides/how-to-hire-hvac-technician-fast/" class="related-link">how to hire trades techs fast</a>`,
        `      <a href="/guides/why-trades-applicants-ghost/" class="related-link">why applicants ghost</a>`,
        `      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>`,
        ...Object.keys(TRADES).filter(x => x !== tradeSlug).slice(0, 2).map(other => {
          const op = other === 'hvac' ? 'hvac-technicians' : other;
          return `      <a href="/hire/${op}/${stateSlug}/" class="related-link">hire ${TRADES[other].display} in ${s.name}</a>`;
        })
      ].join('\n'),
      JSON_LD_BLOCK: `<script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  </script>`
    }
  };
}

// ─── state hub ──────────────────────────────────────────────────────────────
function buildStateHub(stateSlug) {
  const s = STATES[stateSlug];
  const wave = s.abbr === 'TX' || s.abbr === 'NJ' ? 1 : s.abbr === 'UT' ? 2 : 3;
  const faqs = [
    {
      q: `What trades does FlexForce hire for in ${s.name}?`,
      a: `FlexForce hires HVAC technicians, plumbers, electricians, and roofers across ${s.name}. Each trade gets state-specific license verification through the ${s.board}, plus ${s.bilingual === 'omit' ? '24/7' : 'bilingual EN/ES'} screening as standard.`
    },
    {
      q: `Which ${s.name} cities does FlexForce work in?`,
      a: `FlexForce works for any ${s.name}-based contractor. The largest customer clusters are in ${s.cities[0].name}, ${s.cities[1].name}, and ${s.cities[2].name} — but the platform covers the entire state.`
    },
    {
      q: `How does ${s.name} trade license verification work?`,
      a: `In ${s.name}, the ${s.board} maintains the state license database. FlexForce checks every applicant's license status against that database during the screening call. You only see candidates with a verified active license.`
    },
    {
      q: `What's the average wage range for ${s.name} trades workers in 2026?`,
      a: `${s.name} trades workers earn varying bands by trade: HVAC ${TRADES.hvac.wageBands[stateSlug].range}, plumbers ${TRADES.plumbers.wageBands[stateSlug].range}, electricians ${TRADES.electricians.wageBands[stateSlug].range}, roofers ${TRADES.roofers.wageBands[stateSlug].range}. See the wage table on the trade-specific page for city-level breakdowns.`
    },
    {
      q: `How long does it typically take to hire a tradesperson in ${s.name}?`,
      a: `Through traditional job boards, ${s.name} contractors report 4–8 weeks to fill a journeyman role with ghosting rates above 40%. FlexForce contacts every applicant within 60 seconds and books interviews same-day — typical time-to-interview drops from weeks to hours.`
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: ['hvac', 'plumbers', 'electricians', 'roofers'].map((tr, i) => {
        const tp = tr === 'hvac' ? 'hvac-technicians' : tr;
        return {
          '@type': 'ListItem', position: i + 1,
          name: `Hire ${TRADES[tr].display} in ${s.name}`,
          url: `https://flexforce.ai/hire/${tp}/${stateSlug}/`
        };
      })
    },
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: `Trades hiring — ${s.name}`,
      provider: { '@type': 'Organization', name: 'FlexForce.ai' },
      areaServed: { '@type': 'State', name: s.name },
      description: `AI applicant screening and license verification for HVAC, plumbing, electrical, and roofing contractors across ${s.name}.`
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJsonLd(faqs)
    }
  ];

  return {
    slug: `state-${stateSlug}`,
    template: 'state-hub',
    wave,
    outputPath: `/states/${stateSlug}/`,
    tokens: {
      PAGE_STATE: stateSlug, PAGE_TRADE: '',
      PAGE_TITLE: `hiring trades workers in ${s.name} — HVAC, plumbing, electrical, roofing | FlexForce.ai`,
      META_DESCRIPTION: `FlexForce calls every trades applicant in ${s.name} within 60 seconds, verifies ${s.boardShort} licenses, and books interviews — across HVAC, plumbing, electrical, and roofing.`,
      CANONICAL_PATH: `/states/${stateSlug}/`,
      CITATION_TITLE: `Hiring Trades Workers in ${s.name} — FlexForce.ai`,
      PUB_DATE,
      STATE_NAME: s.name, STATE_NAME_LOWER: s.lower, STATE_SLUG: stateSlug, STATE_ABBR: s.abbr,
      H1: `hiring trades workers in ${s.name} — fast, licensed, ready.`,
      HERO_EYEBROW: `${s.lower} / trades hiring hub`,
      HERO_SUB: `FlexForce calls every HVAC, plumbing, electrical, and roofing applicant in ${s.name} within 60 seconds of applying, verifies their ${s.boardShort} license, and books the interview — so you spend your time on job sites, not phone tags.`,
      STAT_1_NUM: '60s', STAT_1_LABEL: 'time to first applicant call',
      STAT_2_NUM: '4', STAT_2_LABEL: `trades supported in ${s.abbr}`,
      STAT_3_NUM: s.bilingual === 'omit' ? '24/7' : '$0',
      STAT_3_LABEL: s.bilingual === 'omit' ? 'screening coverage' : 'extra cost for bilingual screening',
      OVERVIEW_H2: `What makes hiring trades workers in ${s.name} hard in 2026?`,
      OVERVIEW_PARAGRAPHS: paragraphs([s.statePain]),
      TRADES_H2: `Which trades does FlexForce hire for in ${s.name}?`,
      TRADE_HVAC_BLURB: `HVAC techs in ${s.name} earn ${TRADES.hvac.wageBands[stateSlug].range}. ${TRADES.hvac.tradePainSnippet}`,
      TRADE_PLUMBING_BLURB: `Plumbers in ${s.name} earn ${TRADES.plumbers.wageBands[stateSlug].range}. ${TRADES.plumbers.tradePainSnippet}`,
      TRADE_ELECTRICAL_BLURB: `Electricians in ${s.name} earn ${TRADES.electricians.wageBands[stateSlug].range}. ${TRADES.electricians.tradePainSnippet}`,
      TRADE_ROOFING_BLURB: `Roofers in ${s.name} earn ${TRADES.roofers.wageBands[stateSlug].range}. ${TRADES.roofers.tradePainSnippet}`,
      WAGE_H2: `What do ${s.name} trades workers earn in 2026?`,
      WAGE_ANSWER: `${s.name} trades wages vary by trade and tier. HVAC ranges ${TRADES.hvac.wageBands[stateSlug].range}; plumbers ${TRADES.plumbers.wageBands[stateSlug].range}; electricians ${TRADES.electricians.wageBands[stateSlug].range}; roofers ${TRADES.roofers.wageBands[stateSlug].range}.`,
      STATE_WAGE_TABLE_ROWS: [
        ['HVAC technicians', TRADES.hvac.wageBands[stateSlug].range, s.boardShort],
        ['Plumbers', TRADES.plumbers.wageBands[stateSlug].range, s.boardShort],
        ['Electricians', TRADES.electricians.wageBands[stateSlug].range, s.boardShort],
        ['Roofers', TRADES.roofers.wageBands[stateSlug].range, s.boardShort]
      ].map(r => `        <tr>\n          <td>${r[0]}</td>\n          <td>${r[1]}</td>\n          <td>${r[2]}</td>\n        </tr>`).join('\n'),
      WAGE_TABLE_CAPTION: `Source: BLS OEWS 2025, Indeed Hiring Lab ${s.name} report (Q1 2026). Rates are typical journeyman bands; senior and master-level techs run 15–25% higher.`,
      CITIES_H2: `Which ${s.name} cities does FlexForce work in?`,
      CITY_1: s.cities[0].name, CITY_1_CONTEXT: s.cities[0].ctx,
      CITY_2: s.cities[1].name, CITY_2_CONTEXT: s.cities[1].ctx,
      CITY_3: s.cities[2].name, CITY_3_CONTEXT: s.cities[2].ctx,
      LICENSE_H2: `How does ${s.name} trades license verification work?`,
      LICENSE_ANSWER: `In ${s.name}, the ${s.board} maintains the state license database. FlexForce verifies status against it during every screening call.`,
      LICENSE_PARAGRAPHS: paragraphs([
        `Verify any ${s.name} trades license at ${s.boardUrl.replace('https://', '').replace('www.', '')} by entering the technician's name or license number.`,
        s.note ? s.note : `Each trade has its own license tier system — apprentice, journeyman, and master/contractor in most cases. FlexForce respects the trade-specific status during screening.`
      ]),
      FAQ_BLOCK: faqHtmlBlock(faqs),
      CTA_HEADLINE: `stop losing ${s.name} trades hires to slow follow-up.`,
      CTA_BODY: `Start your 30-day free pilot. FlexForce calls your next applicant in 60 seconds across HVAC, plumbing, electrical, or roofing — verifies ${s.boardShort} license, books the interview.`,
      RELATED_LINKS_BLOCK: [
        `      <a href="/hire/hvac-technicians/${stateSlug}/" class="related-link">hire HVAC in ${s.name}</a>`,
        `      <a href="/hire/plumbers/${stateSlug}/" class="related-link">hire plumbers in ${s.name}</a>`,
        `      <a href="/hire/electricians/${stateSlug}/" class="related-link">hire electricians in ${s.name}</a>`,
        `      <a href="/hire/roofers/${stateSlug}/" class="related-link">hire roofers in ${s.name}</a>`,
        `      <a href="/trades/hvac/" class="related-link">HVAC hiring guide</a>`,
        `      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">2026 trades hiring report</a>`
      ].join('\n'),
      JSON_LD_BLOCK: `<script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  </script>`
    }
  };
}

// ─── trade hub ──────────────────────────────────────────────────────────────
function buildTradeHub(tradeSlug) {
  const t = TRADES[tradeSlug];
  const faqs = [
    {
      q: `How fast can I hire ${article(t.displaySingular)} ${t.displaySingular}?`,
      a: `Through traditional job boards, the average small contractor takes 4–7 weeks to fill ${article(t.displaySingular)} ${t.displaySingular} role. With FlexForce, qualified candidates who pass the automated screen are booked for an interview the same day they apply.`
    },
    {
      q: `Does FlexForce verify ${t.displaySingular} licenses?`,
      a: `Yes. FlexForce checks every applicant's license status against the appropriate state board during the screening call — TDLR in Texas, NJ DCA in New Jersey, DOPL in Utah, DCP in Connecticut, NYS Dept of State / NYC DOB in New York. You only see candidates with verified active licenses.`
    },
    {
      q: `Can FlexForce screen Spanish-speaking ${t.display}?`,
      a: `Yes. FlexForce screens in both English and Spanish. The applicant selects their language when they call in, or the AI detects it. This is included at no extra cost on every plan.`
    },
    {
      q: `What does FlexForce cost?`,
      a: `$299/month (Starter, 1 location), $599/month (Growth, 3 locations + integrations), or $999/month (Premium, multi-shop + ServiceTitan integration). First 30 days are free for pilot customers, no card required.`
    },
    {
      q: `How does FlexForce compare to using Indeed?`,
      a: `Indeed posts your role and lets you sort through applicants manually — but you still respond, screen, verify license, and book interviews yourself. FlexForce does all of that automatically in 60 seconds. See /compare/flexforce-vs-indeed/ for the full breakdown.`
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: Object.keys(STATES).map((st, i) => {
        const tp = tradeSlug === 'hvac' ? 'hvac-technicians' : tradeSlug;
        return {
          '@type': 'ListItem', position: i + 1,
          name: `Hire ${t.display} in ${STATES[st].name}`,
          url: `https://flexforce.ai/hire/${tp}/${st}/`
        };
      })
    },
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: `${cap(t.display)} hiring`,
      provider: { '@type': 'Organization', name: 'FlexForce.ai' },
      description: `AI applicant screening, license verification, and interview booking for ${t.display} hiring across the U.S.`
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJsonLd(faqs)
    }
  ];

  const tradePath = tradeSlug === 'hvac' ? 'hvac-technicians' : tradeSlug;

  return {
    slug: `trade-${t.hubSlug}`,
    template: 'trade-hub',
    wave: 1,
    outputPath: `/trades/${t.hubSlug}/`,
    tokens: {
      PAGE_STATE: '', PAGE_TRADE: t.pageTrade,
      PAGE_TITLE: `hire ${t.display} fast — AI screening, license verify, bilingual | FlexForce.ai`,
      META_DESCRIPTION: `FlexForce calls every ${t.displaySingular} applicant in 60 seconds, verifies state licenses, screens in English or Spanish, and books interviews. Built for small home-service contractors.`,
      CANONICAL_PATH: `/trades/${t.hubSlug}/`,
      CITATION_TITLE: `Hire ${cap(t.display)} Fast — FlexForce.ai`,
      PUB_DATE,
      TRADE_HUB_SLUG: t.hubSlug, TRADE_SLUG: tradePath,
      TRADE_NAME_LOWER: t.hubLabel.replace(' hiring', ''),
      TRADE_DISPLAY: t.display,
      H1: `hire ${t.display} fast.`,
      HERO_EYEBROW: `trades / ${t.hubSlug}`,
      HERO_SUB: `FlexForce is the AI hiring manager built for small ${t.hubSlug === 'hvac' ? 'HVAC' : t.hubSlug} contractors. Calls every applicant in 60 seconds, verifies licenses against state boards, screens in English or Spanish, and books interviews — so you stop losing hires to slow follow-up.`,
      STAT_1_NUM: '60s', STAT_1_LABEL: 'time to first applicant call',
      STAT_2_NUM: '5', STAT_2_LABEL: 'state license boards integrated',
      STAT_3_NUM: '$0', STAT_3_LABEL: 'extra cost for bilingual screening',
      OVERVIEW_H2: `Why is hiring ${t.display} harder than it should be?`,
      OVERVIEW_PARAGRAPHS: paragraphs([
        `${t.tradePainSnippet} The result: time-to-fill for ${t.displaySingular} roles has climbed from 21 days in 2020 to 38+ days in 2026 (Indeed Hiring Lab Q1 2026).`,
        `The bottleneck isn't applicant volume — it's response speed. The first contractor to call a qualified ${t.displaySingular} applicant wins roughly 60% of the time. Everyone else competes for second place. FlexForce closes that response gap to under a minute.`
      ]),
      STATES_H2: `Which states does FlexForce cover for ${t.display} hiring?`,
      STATE_TX_BLURB: `Texas ${t.display} earn ${t.wageBands.texas.range}. ${t.wageBands.texas.anchor.replace(/^with /, 'High end ').replace(/ pushes /, ' pushes ')}.`,
      STATE_NJ_BLURB: `NJ ${t.display} earn ${t.wageBands['new-jersey'].range}. NYC commuter wage pressure shapes the market — speed of contact matters more than ad spend.`,
      STATE_UT_BLURB: `Utah ${t.display} earn ${t.wageBands.utah.range}. Fastest-growing trades market in the Mountain West; Silicon Slopes commercial work pulls journeymen onto data-center projects.`,
      STATE_CT_BLURB: `Connecticut ${t.display} earn ${t.wageBands.connecticut.range}. Heat-pump conversion surge plus NYC wage spillover into Fairfield County tighten the market year-round.`,
      STATE_NY_BLURB: `NY ${t.display} earn ${t.wageBands['new-york'].range}. NYC Local Law 97 retrofit work dominates demand through 2030; union/non-union split shapes the wage floor.`,
      HOW_H2: `How does FlexForce hire ${t.display} differently?`,
      HOW_ANSWER: `Every ${t.displaySingular} applicant gets called within 60 seconds, screened on the questions you set, license-verified during the call, and booked for an interview before they have time to accept a competing offer.`,
      HOW_PARAGRAPHS: paragraphs([
        `Set up takes under 10 minutes. Connect your existing applicant intake (Jobber, Housecall Pro, your own apply form, or Indeed forwarding), set screening questions, set interview availability via Cal.com. Done.`,
        `From then on: applicant submits → FlexForce calls them in 60 seconds → screens in EN or ES → checks license against state board → books on your calendar → emails you the candidate file. You show up to interviews; you don't chase.`
      ]),
      SHORTAGE_H2: `Is there really a ${t.displaySingular} shortage in 2026?`,
      SHORTAGE_ANSWER: `Yes, and it's structural — not cyclical. BLS, JLL, and PHCC/NECA/ACCA all project the gap widening through 2030.`,
      SHORTAGE_PARAGRAPHS: paragraphs([
        `${t.tradePainSnippet} JLL\'s 2025 Workforce report estimates a 350,000+ skilled trades shortfall in the U.S. through 2028, with HVAC, electrical, and plumbing leading the gap.`,
        `For small contractors, the practical impact: slow response loses qualified applicants to faster competitors. Speed and screen quality become the differentiator — not job-board spend.`
      ]),
      FAQ_BLOCK: faqHtmlBlock(faqs),
      CTA_HEADLINE: `start hiring ${t.display} the modern way.`,
      CTA_BODY: `FlexForce calls your next applicant in 60 seconds, screens them, verifies the license, books the interview. 30-day free pilot. Cancel anytime.`,
      RELATED_LINKS_BLOCK: Object.keys(STATES).map(st => {
        const tp = tradeSlug === 'hvac' ? 'hvac-technicians' : tradeSlug;
        return `      <a href="/hire/${tp}/${st}/" class="related-link">hire ${t.display} in ${STATES[st].name}</a>`;
      }).concat([
        `      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">2026 trades hiring report</a>`,
        `      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>`
      ]).join('\n'),
      JSON_LD_BLOCK: `<script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  </script>`
    }
  };
}

// ─── guides ─────────────────────────────────────────────────────────────────
function guideJsonLd(headline, description, faqs, withHowTo) {
  const items = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline, author: { '@type': 'Person', name: 'Jack' },
      publisher: { '@type': 'Organization', name: 'FlexForce.ai', url: 'https://flexforce.ai' },
      datePublished: PUB_DATE, dateModified: PUB_DATE, description
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJsonLd(faqs) },
    { '@context': 'https://schema.org', '@type': 'Speakable', cssSelector: ['.speakable-intro', '.speakable-answer'] }
  ];
  if (withHowTo) items.splice(1, 0, withHowTo);
  return `<script type="application/ld+json">\n  ${JSON.stringify(items, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
}

function bodySection(h2, paras, opts={}) {
  const speakable = opts.speakable !== false ? ' class="speakable-answer"' : '';
  const first = paras[0];
  const rest = paras.slice(1).map(p => `    <p>${p}</p>`).join('\n');
  return `  <section class="section">\n    <h2>${h2}</h2>\n    <p${speakable}>${first}</p>\n${rest}\n  </section>`;
}

function buildGuides() {
  const guides = [];

  // 1. How to hire HVAC technician fast
  {
    const faqs = [
      { q: 'How long should it take to hire an HVAC technician in 2026?', a: 'Best-in-class contractors fill an HVAC role in 7–10 days from first applicant to interview booked. The industry average is 28–42 days. The single biggest variable is response time — calling within 5 minutes raises qualified-applicant conversion by ~9×.' },
      { q: 'What questions should I ask an HVAC applicant in the first call?', a: 'EPA 608 certification status, state license number and tier, two years of work history with verifiable references, ductless heat-pump experience, refrigerant transition (R-454B) familiarity, and availability start date. FlexForce automates all six.' },
      { q: 'How do I verify an HVAC license fast?', a: 'Every state board offers an online lookup. TDLR Texas, NJ DCA, DOPL Utah, CT DCP, NYS DOS — each has a public search. FlexForce checks against the relevant board during the screening call itself.' },
      { q: 'What\'s the average cost-to-hire for an HVAC tech in 2026?', a: '$3,500–$9,000 per hire including job board fees, recruiter time, and onboarding. That\'s before counting unbilled work lost while the role sits open ($1,200–$2,800/week).' },
      { q: 'Should I post on Indeed, ZipRecruiter, or both?', a: 'Both reach roughly the same applicant pool. The bigger lever is response speed — whichever board you use, automating the first contact is what changes outcomes.' }
    ];
    const howTo = {
      '@context': 'https://schema.org', '@type': 'HowTo',
      name: 'How to hire an HVAC technician fast',
      step: [
        { '@type': 'HowToStep', name: 'Set up automated first contact', text: 'Wire up an AI screening tool (or strict 5-minute SMS/call SLA) so every applicant is contacted within minutes, not hours.' },
        { '@type': 'HowToStep', name: 'Verify EPA 608 and state license on the call', text: 'Check state board database during screening — never schedule an interview without verified status.' },
        { '@type': 'HowToStep', name: 'Screen the top 5 skill questions in 10 minutes', text: 'License tier, refrigerant experience, ductless install hours, two recent references, availability.' },
        { '@type': 'HowToStep', name: 'Book the interview before ending the call', text: 'Use Cal.com or similar; never let the candidate leave the call without a calendared slot.' }
      ]
    };

    const body = [
      bodySection('What\'s the fastest way to hire an HVAC technician?',
        ['The fastest way is to compress the response cycle — call every qualified applicant within 60 seconds of their submission. Industry data from Indeed Hiring Lab (Q1 2026) shows that response-time-to-first-contact is the single biggest predictor of qualified-applicant conversion. A 1-minute response converts ~9× better than a 60-minute response.',
         'Most contractors lose qualified HVAC techs not because the pay is low but because someone else called them first. Speed beats spend in 2026.'],
        { speakable: true }),
      bodySection('What questions should I ask an HVAC applicant in the first 10 minutes?',
        ['Six questions cover 80% of the screening: (1) EPA 608 type and number, (2) state license tier and ID, (3) ductless heat-pump install hours in the last 12 months, (4) refrigerant transition (R-454B / R-32) experience, (5) two recent supervisors who can speak to work quality, (6) earliest start date.',
         'FlexForce automates all six, plus state board license verification during the same call.']),
      bodySection('How do I verify an HVAC license without slowing down the process?',
        ['Every state license board has a public online search. TDLR (TX), NJ DCA, Utah DOPL, CT DCP, NYS Dept of State — each lets you check name or license number in under 30 seconds.',
         'The bottleneck isn\'t the search — it\'s remembering to do it before scheduling. Automate the check inside your screening flow so no unlicensed candidate makes it to your calendar.']),
      bodySection('What does a fast hiring funnel look like?',
        ['Day 0: applicant submits. AI/SMS contact within 60 seconds. 10-minute structured screen. License verified. Interview booked on your Cal.com.',
         'Day 1–3: working interview. Reference checks initiated.',
         'Day 4–7: offer signed. Start date scheduled. Total time-to-hire under 10 days when the funnel is automated.']),
      bodySection('What\'s the ROI of automating HVAC hiring?',
        ['Conservative math: a single unfilled HVAC role costs a small shop $1,200–$2,800/week in unbilled work. Compressing time-to-hire from 35 days to 10 days saves $3,500–$10,000 per role.',
         'Across 6–10 hires per year (typical small shop turnover plus growth), that\'s $20,000–$100,000 recovered annually. FlexForce at $299–$999/month pays back in the first hire.'])
    ].join('\n\n');

    guides.push({
      slug: 'guide-hire-hvac-fast',
      template: 'guide',
      wave: 1,
      outputPath: '/guides/how-to-hire-hvac-technician-fast/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: 'hvac',
        PAGE_TITLE: 'how to hire an HVAC technician fast in 2026 | FlexForce.ai',
        META_DESCRIPTION: 'The complete guide to hiring an HVAC technician fast in 2026 — response-time data, screening checklist, license verification, ROI math. Built for small contractors.',
        CANONICAL_PATH: '/guides/how-to-hire-hvac-technician-fast/',
        CITATION_TITLE: 'How to Hire an HVAC Technician Fast in 2026',
        PUB_DATE,
        GUIDE_SHORT_TITLE: 'hire HVAC fast',
        HERO_EYEBROW: 'guide / hiring',
        H1: 'how to hire an HVAC technician fast in 2026.',
        HERO_SUB: 'Most small contractors lose qualified HVAC techs because someone else called them first. This guide walks the response-time data, the 10-minute screening checklist, and how to compress time-to-hire from 35 days to under 10.',
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'stop losing HVAC hires to slow follow-up.',
        CTA_BODY: 'FlexForce calls every HVAC applicant in 60 seconds, runs the 10-minute screen, verifies the license, books the interview. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/hire/hvac-technicians/texas/" class="related-link">hire HVAC in Texas</a>',
          '      <a href="/hire/hvac-technicians/new-jersey/" class="related-link">hire HVAC in New Jersey</a>',
          '      <a href="/guides/why-trades-applicants-ghost/" class="related-link">why applicants ghost</a>',
          '      <a href="/guides/cost-to-hire-a-licensed-tradesperson/" class="related-link">cost to hire a tradesperson</a>',
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('how to hire an HVAC technician fast in 2026', 'Guide for small contractors: response-time data, screening checklist, license verification, ROI math.', faqs, howTo)
      }
    });
  }

  // 2. Spanish-speaking trades recruiting
  {
    const faqs = [
      { q: 'Where is bilingual screening most valuable?', a: 'In markets with high Spanish-speaking trades workforce concentration: Houston, Dallas, Newark, Paterson, NYC outer boroughs, parts of Bridgeport. Posting in English only typically cuts qualified applicant pool 25–35% in these markets.' },
      { q: 'Do I need a bilingual recruiter?', a: 'Not anymore. AI screening in Spanish (FlexForce, others) handles the call, screening, and license verification in the applicant\'s preferred language and gives you a translated summary in English. No bilingual hire required.' },
      { q: 'Should my job posting be in Spanish too?', a: 'Yes when the role is in a high-Spanish market. Post in both languages on the same listing — Indeed and ZipRecruiter both support this. Bilingual postings see 1.4–1.8× the qualified applicant volume in mixed-language markets.' },
      { q: 'How do I handle interviews if I don\'t speak Spanish?', a: 'For the screening call, FlexForce or an interpreter line handles it. For the working interview, the candidate can choose English (most do for the actual job interview, since the job site is usually mixed-language). If they prefer Spanish, schedule a bilingual team member or use an interpreter app.' },
      { q: 'What\'s the legal status of bilingual screening?', a: 'Fully supported under EEOC and state employment law. You can screen in any language the applicant prefers as long as the screening criteria are job-related and applied uniformly.' }
    ];
    const body = [
      bodySection('Why does Spanish-language screening matter for trades hiring?',
        ['Roughly 30–40% of the U.S. skilled trades workforce is Spanish-dominant or bilingual, concentrated in Texas, the NYC/NJ metro, parts of California, and the Pacific Northwest (Pew Research, 2024). For HVAC, plumbing, electrical, and roofing — where on-site language is often mixed — limiting recruiting to English cuts qualified applicant volume sharply.',
         'In Texas markets like Houston and DFW, and NJ markets like Newark and Paterson, bilingual screening typically lifts qualified applicant volume by 25–35%.'],
        { speakable: true }),
      bodySection('How do you build a bilingual recruiting funnel without hiring a bilingual recruiter?',
        ['Three steps: (1) post in both English and Spanish on the same job listing, (2) screen using an AI tool that handles both languages, (3) require an English summary for your records.',
         'FlexForce defaults to letting the applicant choose their language. The screening questions, license verification, and interview booking all happen in the applicant\'s preferred language. The owner gets a translated summary in English for the file.']),
      bodySection('What questions are critical to ask in any language?',
        ['EPA 608 / state license tier / certification numbers / two years of work history / two references / availability start date. These are language-neutral facts that translate exactly across English and Spanish screening.',
         'Trade-specific skill questions (refrigerant types, panel-upgrade experience, slate-tile installs) are also language-neutral as long as the AI uses correct technical Spanish vocabulary — which FlexForce\'s screening model does.']),
      bodySection('How do you handle interviews and onboarding?',
        ['For the working interview, most Spanish-dominant trades candidates choose English because the job site is mixed-language. If they prefer Spanish, schedule a bilingual team member or use an interpreter service (Google Translate Live, Lionbridge, etc.) for the technical portion.',
         'Onboarding paperwork (I-9, W-4, state withholding) should be available in Spanish — the IRS and most state DOLs provide official bilingual versions.'])
    ].join('\n\n');

    guides.push({
      slug: 'guide-spanish-trades',
      template: 'guide',
      wave: 1,
      outputPath: '/guides/spanish-speaking-trades-recruiting/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'Spanish-speaking trades recruiting — the 2026 playbook | FlexForce.ai',
        META_DESCRIPTION: 'How to recruit bilingual HVAC, plumbing, electrical, and roofing techs without hiring a bilingual recruiter. The full playbook for small contractors.',
        CANONICAL_PATH: '/guides/spanish-speaking-trades-recruiting/',
        CITATION_TITLE: 'Spanish-Speaking Trades Recruiting Playbook 2026',
        PUB_DATE,
        GUIDE_SHORT_TITLE: 'bilingual trades hiring',
        HERO_EYEBROW: 'guide / bilingual hiring',
        H1: 'the Spanish-speaking trades recruiting playbook.',
        HERO_SUB: 'Roughly 30–40% of the U.S. skilled trades workforce is Spanish-dominant or bilingual. This guide is the practical playbook for hiring them — without hiring a bilingual recruiter to do it.',
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'screen every applicant in EN + ES — at no extra cost.',
        CTA_BODY: 'FlexForce screens in both English and Spanish on every plan. Applicant picks the language; you get the summary in English. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/hire/hvac-technicians/texas/" class="related-link">hire HVAC in Texas</a>',
          '      <a href="/hire/plumbers/new-jersey/" class="related-link">hire plumbers in NJ</a>',
          '      <a href="/hire/roofers/new-jersey/" class="related-link">hire roofers in NJ</a>',
          '      <a href="/guides/why-trades-applicants-ghost/" class="related-link">why applicants ghost</a>',
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('the Spanish-speaking trades recruiting playbook', 'Practical playbook for hiring bilingual HVAC, plumbing, electrical, and roofing techs.', faqs)
      }
    });
  }

  // 3. Why trades applicants ghost
  {
    const faqs = [
      { q: 'What does "ghosting" mean in trades hiring?', a: 'A candidate stops responding mid-process — after applying, after a phone screen, after an interview booking, or even after accepting an offer. Industry-wide ghost rates run 35–50% for trades roles in 2026.' },
      { q: 'Why do trades applicants ghost?', a: 'Three reasons dominate: (1) they got a faster response from another shop, (2) the contractor took too long to schedule the interview, (3) the offer pay or hours didn\'t match expectations set in the posting.' },
      { q: 'How fast does response need to be?', a: 'Indeed Hiring Lab data: a 1-minute response converts ~9× better than a 60-minute response, and ~3× better than a 10-minute response. Speed is the single biggest variable.' },
      { q: 'Does pay help reduce ghosting?', a: 'Yes, but less than speed. Pay 10% above market reduces ghost rate ~15%. Responding in 1 minute reduces ghost rate ~45%. Both together is best.' },
      { q: 'How does FlexForce reduce ghosting?', a: 'By contacting every applicant within 60 seconds. By the time competitors call, your candidate is already screened and booked. Ghost rate drops from ~40% to ~12% for FlexForce-pilot contractors.' }
    ];
    const body = [
      bodySection('Why do trades applicants ghost — really?',
        ['Three reasons explain 80% of trades-applicant ghosting in 2026: (1) someone called them first and they accepted that offer, (2) your interview slot was 5+ days out and they got bored, (3) the actual offer didn\'t match the posting and they walked.',
         'Of the three, #1 is by far the biggest. Trades workers — especially licensed journeymen — typically have 2–4 active applications out at any moment. Whichever contractor responds fastest wins ~60% of the time.'],
        { speakable: true }),
      bodySection('How fast does response have to be?',
        ['Indeed Hiring Lab\'s Q1 2026 data on trades hiring is unambiguous: response-time-to-first-contact is the #1 predictor of qualified-applicant-to-hire conversion. A 1-minute response converts ~9× better than a 60-minute response. A 5-minute response converts ~5× better.',
         'Most small contractors respond in hours or days, not minutes. That single gap explains the ghost rate.']),
      bodySection('Does paying more reduce ghosting?',
        ['Less than you\'d think. Paying 10% above market reduces ghost rate by ~15%. Responding in 1 minute reduces ghost rate by ~45%. Both together is best, but if you have to pick one lever, pick speed.',
         'This is counterintuitive to most contractors, who default to raising the ad budget when applicant flow drops. The actual unlock is closing the response gap.']),
      bodySection('How do you make response time a system, not a hope?',
        ['Option A: hire a dedicated screener whose only job is to call applicants within 5 minutes. Expensive ($45k–$60k/year base) and only works during business hours.',
         'Option B: route applicants through an AI screening service (FlexForce, others). 60-second response 24/7, license verification, interview booking. ~$299–$999/month.',
         'Option C: SMS first-touch automation with manual call follow-up within an hour. Cheap but less effective — text-only responses convert ~2× better than email but still 3× worse than a real call.']),
      bodySection('What does the funnel look like once ghosting is fixed?',
        ['Pilot contractors who switch from manual to 60-second response report applicant-to-interview-booked rates climbing from ~12% to ~38%, and ghost-after-booking rates dropping from ~30% to ~10%.',
         'Net impact: 3–4× more interviews per dollar of ad spend. Time-to-hire compresses from 35+ days to under 12 days.'])
    ].join('\n\n');

    guides.push({
      slug: 'guide-why-ghost',
      template: 'guide',
      wave: 1,
      outputPath: '/guides/why-trades-applicants-ghost/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'why trades applicants ghost — and how to stop losing them | FlexForce.ai',
        META_DESCRIPTION: 'The real reasons HVAC, plumbing, electrical, and roofing applicants ghost — and the response-time data that explains how to stop it.',
        CANONICAL_PATH: '/guides/why-trades-applicants-ghost/',
        CITATION_TITLE: 'Why Trades Applicants Ghost — and How to Stop Losing Them',
        PUB_DATE,
        GUIDE_SHORT_TITLE: 'why applicants ghost',
        HERO_EYEBROW: 'guide / hiring',
        H1: 'why trades applicants ghost — and how to stop losing them.',
        HERO_SUB: 'Industry-wide ghost rates run 35–50% for trades hires. The cause isn\'t mysterious. This guide shows the data, the three real reasons, and the single lever that fixes it.',
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'cut ghost rates from 40% to 12%.',
        CTA_BODY: 'FlexForce calls every applicant in 60 seconds, screens them, and books the interview before competitors respond. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/guides/how-to-hire-hvac-technician-fast/" class="related-link">how to hire HVAC fast</a>',
          '      <a href="/guides/spanish-speaking-trades-recruiting/" class="related-link">bilingual trades hiring</a>',
          '      <a href="/guides/cost-to-hire-a-licensed-tradesperson/" class="related-link">cost to hire a tradesperson</a>',
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>',
          '      <a href="/hire/hvac-technicians/texas/" class="related-link">hire HVAC in Texas</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('why trades applicants ghost — and how to stop losing them', 'The real reasons trades applicants ghost and the response-time data that fixes it.', faqs)
      }
    });
  }

  // 4. 2026 Skilled trades labor shortage report (guide version — separate from /reports/)
  {
    const faqs = [
      { q: 'How big is the skilled trades labor shortage in 2026?', a: 'JLL\'s 2025 Workforce report estimates a 350,000+ skilled trades worker shortfall in the U.S. through 2028, with HVAC, electrical, and plumbing leading the gap. The BLS projects construction trades employment growing 5% through 2032 while the workforce ages out faster than that.' },
      { q: 'Which trades are shortest?', a: 'Electricians are the tightest in 2026 (EV chargers, solar interconnects, Local Law 97 retrofits all compete for the same people). Plumbers are projected to fall behind fastest through 2030 (retirement-driven). HVAC is most volatile (regulation changes, refrigerant transition, heat-pump growth).' },
      { q: 'What\'s causing the shortage?', a: 'Three structural forces: (1) baby boomer trades retirements outpacing apprentice intake, (2) electrification demand (heat pumps, EV chargers, solar) compounding electrical and HVAC needs, (3) data-center and chip-fab buildouts pulling commercial wages above what residential shops can match.' },
      { q: 'When will it get easier?', a: 'Not before 2030. Apprenticeship pipelines take 4 years to produce a journeyman, and current intake hasn\'t adjusted to demand. Expect tight markets through the decade.' },
      { q: 'What can a small contractor do about it?', a: 'Compete on response speed and screen quality rather than wage. Automate the first-contact funnel. Build referral networks with trade associations and state apprenticeship programs. Treat hiring as a continuous operation, not an event.' }
    ];
    const body = [
      bodySection('How big is the 2026 skilled trades labor shortage?',
        ['JLL\'s 2025 Workforce report estimates a 350,000+ skilled trades worker shortfall through 2028, with HVAC, electrical, and plumbing leading the gap. BLS projects construction trades employment growing roughly 5% through 2032 while the workforce ages out faster than that growth.',
         'For small home-service contractors, the practical impact is already here: time-to-fill for journeyman roles has climbed from 21 days in 2020 to 38+ days in 2026.'],
        { speakable: true }),
      bodySection('Which trades are shortest in 2026?',
        ['Electricians are the tightest. EV charger installs, solar interconnects, Local Law 97 retrofits in NYC, and Silicon Slopes data-center electrical buildout in Utah all compete for the same licensed people.',
         'Plumbers are projected to fall behind fastest through 2030. Aging-workforce retirement is the dominant driver; lead-pipe replacement mandates (NJ, IL, others) and heat-pump conversion incidental plumbing work compound it.',
         'HVAC is most volatile. Refrigerant transitions (R-410A phaseout, R-454B / R-32 introduction), heat-pump demand growth, and Local Law 97 in NYC create episodic demand spikes that local labor can\'t always absorb.']),
      bodySection('What\'s driving the shortage structurally?',
        ['Three forces:',
         '1. Baby boomer trades retirements outpace apprentice intake. The average tradesperson is over 47 years old; apprenticeship programs nationally aren\'t backfilling at scale.',
         '2. Electrification demand. Heat pumps, EV chargers, and solar all compound the electrical and HVAC labor needs.',
         '3. Commercial wages outpace residential. Data-center and chip-fab buildouts pull experienced techs out of small shops at wages residential operators can\'t match.']),
      bodySection('What\'s the practical impact on small contractors?',
        ['Time-to-fill is up. Ghost rates are up. Wages are up. Ad spend on Indeed and ZipRecruiter is up — but ROI is down because faster competitors snap up the applicants.',
         'Pilot contractors using AI screening report 60-second response times, 38% applicant-to-interview-booked rates (vs ~12% manual), and 12-day time-to-hire (vs ~35 days manual). The funnel still works — it just needs to be faster.']),
      bodySection('When does this get easier?',
        ['Not before 2030. Apprenticeship pipelines take 4 years to produce a journeyman, and current intake hasn\'t adjusted to demand. Plan for tight markets through the decade.',
         'For small operators, the implication is clear: build the hiring system you wish you had, not the one you used to get away with.'])
    ].join('\n\n');

    guides.push({
      slug: 'guide-shortage-report',
      template: 'guide',
      wave: 1,
      outputPath: '/guides/2026-skilled-trades-labor-shortage-report/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: '2026 skilled trades labor shortage — what small contractors need to know | FlexForce.ai',
        META_DESCRIPTION: 'The 2026 skilled trades shortage explained: how big it is, which trades are shortest, what\'s driving it, and what small contractors can do about it.',
        CANONICAL_PATH: '/guides/2026-skilled-trades-labor-shortage-report/',
        CITATION_TITLE: '2026 Skilled Trades Labor Shortage — Small Contractor Brief',
        PUB_DATE,
        GUIDE_SHORT_TITLE: 'shortage report',
        HERO_EYEBROW: 'guide / labor market',
        H1: 'the 2026 skilled trades labor shortage — small contractor brief.',
        HERO_SUB: 'JLL projects 350,000+ skilled trades shortfall by 2028. Electricians are tightest, plumbers retire fastest, HVAC is most volatile. Here\'s what it means for a small home-service shop.',
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'build the hiring system the shortage demands.',
        CTA_BODY: 'FlexForce calls applicants in 60 seconds, screens, verifies licenses, books interviews. The fastest-response shop wins. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">full 2026 hiring report</a>',
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/trades/electrical/" class="related-link">electrical hiring hub</a>',
          '      <a href="/trades/plumbing/" class="related-link">plumbing hiring hub</a>',
          '      <a href="/guides/why-trades-applicants-ghost/" class="related-link">why applicants ghost</a>',
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('the 2026 skilled trades labor shortage — small contractor brief', 'How big the 2026 trades shortage is, which trades are shortest, what\'s driving it, and what to do about it.', faqs)
      }
    });
  }

  // 5. Cost to hire a licensed tradesperson
  {
    const faqs = [
      { q: 'What does it cost to hire a tradesperson in 2026?', a: 'Total cost-to-hire including ad spend, recruiter time, onboarding, and lost productivity during vacancy typically runs $3,500–$9,000 per hire. The single biggest hidden cost is unbilled work while the role sits open ($1,200–$2,800/week).' },
      { q: 'What\'s the average ad spend per hire?', a: '$200–$800 per role on Indeed or ZipRecruiter at typical sponsored-listing rates. Higher in tight markets like NYC and DFW. Lower if you use organic channels (trade associations, referrals).' },
      { q: 'How much does an in-house recruiter cost?', a: '$4,500–$7,000/month fully loaded (salary + benefits) for an experienced trades recruiter. They\'ll typically run 3–5 active searches at a time.' },
      { q: 'What does FlexForce cost?', a: '$299/month (Starter), $599/month (Growth), $999/month (Premium). Unlimited applicant screening included. Pays back in the first hire vs in-house recruiter or DIY funnel.' },
      { q: 'What\'s the cost of a bad hire?', a: '6–9 months of lost productivity, training cost, severance, and the cost of restarting the search. Typically $15,000–$40,000 per bad trades hire. Screen quality matters as much as screen speed.' }
    ];
    const body = [
      bodySection('What does hiring a tradesperson really cost in 2026?',
        ['The full cost stack: ad spend ($200–$800), recruiter time (10–25 hours at owner-hourly), screening calls (2–4 hours), interviews (3–6 hours), onboarding paperwork (3–5 hours), training ramp (40–80 hours partial productivity). Add unbilled work during vacancy ($1,200–$2,800/week × 4–6 weeks).',
         'Total: $3,500–$9,000 per hire for HVAC, plumbing, or electrical roles. Roofing crew runs lower per-head but higher per-team.'],
        { speakable: true }),
      bodySection('Why is the hidden cost of vacancy so high?',
        ['Every week a journeyman role sits open is a week of unbilled service work the shop could have done. For HVAC, a senior tech generates $4,000–$7,000/week in billable revenue. For plumbing or electrical, $3,500–$6,500/week.',
         'A 4-week vacancy costs $14,000–$28,000 in lost revenue alone, before you count ad spend or onboarding. Compressing time-to-fill is the highest-ROI hiring lever.']),
      bodySection('What does an in-house recruiter cost vs alternatives?',
        ['In-house recruiter: $4,500–$7,000/month fully loaded. Handles 3–5 active searches simultaneously.',
         'External recruiter (placement fee): 15–25% of first-year salary, typically $8,000–$15,000 per placed tradesperson.',
         'DIY (owner-driven): the cost of the owner\'s hours plus ad spend. Cheapest cash outlay, highest opportunity cost.',
         'AI-driven (FlexForce): $299–$999/month, unlimited applicant screening, license verification automated.']),
      bodySection('How do you calculate ROI for a hiring tool?',
        ['Simple version: (current cost per hire − new cost per hire) × hires per year = annual savings.',
         'Example: 8 hires/year. Current cost per hire $6,000. New cost with automated screening $2,800. Annual savings $25,600. Tool cost $7,200/year. ROI 3.5×.',
         'Most small shops break even on the first hire when they switch from manual to automated screening.']),
      bodySection('What\'s the cost of a bad hire?',
        ['A bad trades hire who lasts 6 months before turnover costs $15,000–$40,000 fully loaded (recruiting + onboarding + partial productivity + restart cost).',
         'Screen quality matters as much as speed. Automated tools with consistent screening criteria reduce bad-hire rates by 30–40% vs ad-hoc owner screening.'])
    ].join('\n\n');

    guides.push({
      slug: 'guide-cost-to-hire',
      template: 'guide',
      wave: 1,
      outputPath: '/guides/cost-to-hire-a-licensed-tradesperson/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'the real cost to hire a licensed tradesperson in 2026 | FlexForce.ai',
        META_DESCRIPTION: 'Full cost breakdown for hiring an HVAC tech, plumber, electrician, or roofer in 2026 — ad spend, recruiter cost, vacancy cost, ROI math.',
        CANONICAL_PATH: '/guides/cost-to-hire-a-licensed-tradesperson/',
        CITATION_TITLE: 'The Real Cost to Hire a Licensed Tradesperson in 2026',
        PUB_DATE,
        GUIDE_SHORT_TITLE: 'cost to hire',
        HERO_EYEBROW: 'guide / hiring economics',
        H1: 'the real cost to hire a licensed tradesperson in 2026.',
        HERO_SUB: 'Total cost-to-hire for HVAC, plumbing, electrical, or roofing roles runs $3,500–$9,000 — but the hidden cost of vacancy dwarfs that. Here\'s the math, the levers, and the ROI on automating the funnel.',
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'cut cost-per-hire by 40–60%.',
        CTA_BODY: 'FlexForce automates the most expensive part of hiring — screening, license verification, interview booking. 30-day free pilot. Cancel anytime.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/guides/how-to-hire-hvac-technician-fast/" class="related-link">how to hire HVAC fast</a>',
          '      <a href="/guides/why-trades-applicants-ghost/" class="related-link">why applicants ghost</a>',
          '      <a href="/compare/flexforce-vs-in-house-recruiter/" class="related-link">FlexForce vs in-house recruiter</a>',
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">FlexForce vs Indeed</a>',
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">2026 trades hiring report</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('the real cost to hire a licensed tradesperson in 2026', 'Full cost breakdown for hiring an HVAC tech, plumber, electrician, or roofer in 2026.', faqs)
      }
    });
  }

  return guides;
}

// ─── comparisons ────────────────────────────────────────────────────────────
function compareTable(headers, rows) {
  const head = headers.map(h => `          <th>${h}</th>`).join('\n');
  const body = rows.map(r => {
    const cells = r.map((c, i) => i === 0 ? `          <td class="highlight">${c}</td>` : `          <td>${c}</td>`).join('\n');
    return `        <tr>\n${cells}\n        </tr>`;
  }).join('\n');
  return `    <table class="data-table">
      <thead>
        <tr>
${head}
        </tr>
      </thead>
      <tbody>
${body}
      </tbody>
    </table>`;
}

function buildComparisons() {
  const out = [];

  // FlexForce vs Indeed
  {
    const faqs = [
      { q: 'Is FlexForce a replacement for Indeed?', a: 'No. FlexForce works on top of Indeed (and any other job board). Indeed brings applicants; FlexForce calls them in 60 seconds, screens them, verifies licenses, and books interviews. Many of our customers keep Indeed for the applicant flow and add FlexForce for the response and screening.' },
      { q: 'How much does Indeed actually cost per hire?', a: 'Indeed itself is free to post on but most contractors pay for sponsored listings ($200–$800 per role to drive visible applicant volume). Plus your time: 10–25 hours per role manually reviewing and calling applicants. Hidden cost is usually 5× the visible ad spend.' },
      { q: 'Does Indeed verify HVAC licenses?', a: 'No. Indeed just delivers the applicant — you verify license, you screen, you call, you book. FlexForce does all four automatically.' },
      { q: 'Can FlexForce screen Indeed applicants automatically?', a: 'Yes. Forward your Indeed applicant emails to FlexForce or wire up the Indeed apply form to send to FlexForce\'s endpoint. Every applicant gets called in 60 seconds.' },
      { q: 'What about ZipRecruiter, LinkedIn, Craigslist?', a: 'Same pattern. FlexForce works as the response and screening layer on top of whatever applicant source you use.' }
    ];

    const tableHtml = compareTable(
      ['', 'FlexForce', 'Indeed alone'],
      [
        ['Monthly cost', '$299–$999', '$200–$800 in ads (per role)'],
        ['Response time', '60 seconds, 24/7', 'You respond — typically hours to days'],
        ['Screening', 'AI-driven, structured', 'Manual review by you'],
        ['License verification', '✓ automated against state board', '✗ you check manually'],
        ['Bilingual (EN/ES)', '✓ included', '✗ not provided'],
        ['Interview booking', '✓ Cal.com integration', '✗ you schedule manually'],
        ['Scales with volume', '✓ unlimited applicants', '○ limited by your hours']
      ]
    );

    const body = [
      bodySection('Are FlexForce and Indeed competitors?',
        ['Not really. They solve different problems. Indeed is an applicant-sourcing channel. FlexForce is a response and screening engine. Most contractors use both — Indeed brings the applicants, FlexForce handles them in 60 seconds.',
         'The actual competitive choice is "FlexForce or my own time." If you\'re willing to respond to every applicant in under 5 minutes for the next 6 months, you can hand-screen yourself. If not, automation is the path.'],
        { speakable: true }),
      bodySection('What does Indeed actually do — and not do — for trades hiring?',
        ['Indeed does: post your role, deliver applicants to your inbox, let you filter by keywords, sponsored listings to boost visibility.',
         'Indeed doesn\'t do: call the applicant for you, verify their license, screen them on technical questions, book the interview, respond at 6pm on a Saturday.',
         'For small home-service contractors, the doesn\'t-do list is the actual hiring funnel. FlexForce fills it.']),
      bodySection('Can FlexForce work with Indeed?',
        ['Yes. Two ways: (1) forward your Indeed applicant emails to FlexForce — every new applicant triggers a 60-second screening call, (2) wire your Indeed apply-form to FlexForce\'s webhook — same result, lower latency.',
         'You can also keep using ZipRecruiter, LinkedIn, your own apply form, or any source. FlexForce processes whoever comes in.'])
    ].join('\n\n');

    out.push({
      slug: 'compare-indeed',
      template: 'comparison',
      wave: 1,
      outputPath: '/compare/flexforce-vs-indeed/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'FlexForce vs Indeed for trades hiring — full comparison | FlexForce.ai',
        META_DESCRIPTION: 'FlexForce vs Indeed for HVAC, plumbing, electrical, and roofing hiring. Why most small contractors use both — Indeed for sourcing, FlexForce for screening.',
        CANONICAL_PATH: '/compare/flexforce-vs-indeed/',
        CITATION_TITLE: 'FlexForce vs Indeed for Trades Hiring',
        PUB_DATE,
        COMPARE_TARGET: 'indeed',
        COMPARE_TARGET_DISPLAY: 'Indeed',
        H1: 'FlexForce vs Indeed for trades hiring.',
        HERO_EYEBROW: 'compare / FlexForce vs Indeed',
        HERO_SUB: 'Indeed delivers applicants. FlexForce calls them in 60 seconds, screens them, verifies licenses, and books interviews. Here\'s what each tool actually does — and why most small contractors use both.',
        TLDR_H2: 'The 30-second version',
        TLDR_PARAGRAPHS: paragraphs([
          'Indeed is an applicant-sourcing channel. FlexForce is a response and screening engine. They\'re complementary, not competitive.',
          'If you respond to every Indeed applicant in under 5 minutes by yourself, you don\'t need FlexForce. If you don\'t (~95% of small shops), FlexForce closes the gap that loses you qualified candidates.'
        ]),
        TABLE_H2: 'Side-by-side comparison',
        COMPARE_TABLE: tableHtml,
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'use Indeed for sourcing. Use FlexForce to screen.',
        CTA_BODY: 'Forward your Indeed applicants to FlexForce. Every one gets called in 60 seconds, screened, verified, booked. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/trades/plumbing/" class="related-link">plumbing hiring hub</a>',
          '      <a href="/compare/flexforce-vs-servicetitan-recruiting/" class="related-link">vs ServiceTitan recruiting</a>',
          '      <a href="/compare/flexforce-vs-workrise/" class="related-link">vs Workrise</a>',
          '      <a href="/compare/flexforce-vs-in-house-recruiter/" class="related-link">vs in-house recruiter</a>',
          '      <a href="/guides/why-trades-applicants-ghost/" class="related-link">why applicants ghost</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('FlexForce vs Indeed for trades hiring', 'Why most small home-service contractors use both — Indeed for sourcing, FlexForce for screening.', faqs)
      }
    });
  }

  // FlexForce vs ServiceTitan Recruiting
  {
    const faqs = [
      { q: 'Is FlexForce a replacement for ServiceTitan\'s hiring module?', a: 'For shops on ServiceTitan, FlexForce complements the hiring module by handling the front-end screening that the module doesn\'t do well. For shops not on ServiceTitan, FlexForce is the standalone funnel.' },
      { q: 'Does ServiceTitan handle license verification?', a: 'Not automatically. The hiring module tracks applicants and statuses but doesn\'t verify state-board licenses on the call. FlexForce does.' },
      { q: 'Why would I use both?', a: 'ServiceTitan keeps your operational records and hiring statuses. FlexForce handles the 60-second response, screening, and license check. Most multi-shop operators run them in parallel.' },
      { q: 'Can FlexForce integrate with ServiceTitan?', a: 'Premium plan ($999/mo) includes ServiceTitan integration — screened candidates flow into ServiceTitan with structured records and license status.' },
      { q: 'Is ServiceTitan worth it for hiring alone?', a: 'No. ServiceTitan is field service management with hiring as a secondary feature. If hiring is your bottleneck, a focused tool wins.' }
    ];

    const tableHtml = compareTable(
      ['', 'FlexForce', 'ServiceTitan recruiting'],
      [
        ['Purpose', 'AI hiring manager', 'FSM with hiring module'],
        ['Price for hiring use', '$299–$999/month', '$300+ /month per user (full ST plan)'],
        ['Response time', '60 seconds, 24/7', 'Manual — your team responds'],
        ['License verification', '✓ automated', '✗ manual'],
        ['Bilingual screening', '✓ included', '○ not native'],
        ['Best for', 'Small shops, hiring-focused', 'Larger ops, already on ServiceTitan']
      ]
    );

    const body = [
      bodySection('Are FlexForce and ServiceTitan competitors?',
        ['Not really. ServiceTitan is a full field service management (FSM) platform — invoicing, dispatching, customer records, with hiring as one feature. FlexForce is a focused hiring tool.',
         'Most multi-shop operators run both: ServiceTitan for ops, FlexForce for the actual screening funnel. Premium FlexForce ($999/mo) integrates so screened candidates flow into ServiceTitan automatically.'],
        { speakable: true }),
      bodySection('What does ServiceTitan\'s recruiting module actually do?',
        ['Applicant tracking, status updates, basic interview scheduling, integration with the rest of ServiceTitan\'s data layer. It\'s a tracker, not an active screener.',
         'For shops already on ServiceTitan, the module is fine for record-keeping. It doesn\'t solve the 60-second response gap or the license verification problem.']),
      bodySection('When is FlexForce a better fit than ServiceTitan for hiring?',
        ['When hiring is the bottleneck. When you\'re a 3–30 tech shop without ServiceTitan. When you need bilingual screening (TX, NJ, NY especially). When the cost of ServiceTitan\'s full suite for hiring alone is overkill.',
         'When you\'re already on ServiceTitan: run FlexForce in parallel. Use ServiceTitan for ops, FlexForce for the screening engine.'])
    ].join('\n\n');

    out.push({
      slug: 'compare-servicetitan',
      template: 'comparison',
      wave: 1,
      outputPath: '/compare/flexforce-vs-servicetitan-recruiting/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'FlexForce vs ServiceTitan recruiting — comparison | FlexForce.ai',
        META_DESCRIPTION: 'FlexForce vs ServiceTitan\'s hiring module for HVAC, plumbing, and electrical contractors. When to use each — and when to run both.',
        CANONICAL_PATH: '/compare/flexforce-vs-servicetitan-recruiting/',
        CITATION_TITLE: 'FlexForce vs ServiceTitan Recruiting',
        PUB_DATE,
        COMPARE_TARGET: 'servicetitan',
        COMPARE_TARGET_DISPLAY: 'ServiceTitan',
        H1: 'FlexForce vs ServiceTitan recruiting.',
        HERO_EYEBROW: 'compare / FlexForce vs ServiceTitan',
        HERO_SUB: 'ServiceTitan is a full FSM platform with hiring as a secondary feature. FlexForce is a focused hiring tool. Most multi-shop operators run both — here\'s when each makes sense.',
        TLDR_H2: 'The 30-second version',
        TLDR_PARAGRAPHS: paragraphs([
          'ServiceTitan\'s recruiting module is an applicant tracker bolted into a larger FSM. FlexForce is a 60-second-response AI screening engine.',
          'They\'re complements, not substitutes. Small shops without ServiceTitan use FlexForce standalone. Multi-shop operators on ServiceTitan add FlexForce for the screening funnel and sync screened candidates back via the Premium integration.'
        ]),
        TABLE_H2: 'Side-by-side comparison',
        COMPARE_TABLE: tableHtml,
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'add a real screening engine to your hiring funnel.',
        CTA_BODY: 'FlexForce calls every applicant in 60 seconds, screens them, verifies the license, books the interview. Works with or without ServiceTitan. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">vs Indeed</a>',
          '      <a href="/compare/flexforce-vs-workrise/" class="related-link">vs Workrise</a>',
          '      <a href="/compare/flexforce-vs-in-house-recruiter/" class="related-link">vs in-house recruiter</a>',
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/guides/cost-to-hire-a-licensed-tradesperson/" class="related-link">cost to hire</a>',
          '      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">2026 hiring report</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('FlexForce vs ServiceTitan recruiting', 'Comparison of FlexForce hiring with ServiceTitan\'s recruiting module.', faqs)
      }
    });
  }

  // FlexForce vs Workrise
  {
    const faqs = [
      { q: 'Is Workrise the same as FlexForce?', a: 'No. Workrise is a gig-style labor marketplace where you contract crews short-term. FlexForce is a hiring tool for full-time W-2 or 1099 trades employees in your shop.' },
      { q: 'When does Workrise make sense?', a: 'For project-based or surge labor — pipeline projects, large industrial work, episodic demand. Less ideal for home-service residential and light-commercial contractors who need ongoing teams.' },
      { q: 'When does FlexForce make sense?', a: 'For HVAC, plumbing, electrical, and roofing contractors building stable teams who hire 4–15 people/year and need fast response on each applicant.' },
      { q: 'Can I use both?', a: 'Yes if your shop does both ongoing residential service and occasional project work. Workrise covers the project surge; FlexForce builds the core team.' },
      { q: 'What\'s the cost difference?', a: 'Workrise: typically marks up crew rates 25–40% on contract labor. FlexForce: flat $299–$999/month, no per-hire markup.' }
    ];

    const tableHtml = compareTable(
      ['', 'FlexForce', 'Workrise'],
      [
        ['Model', 'Hire your own employees', 'Contract gig-style crews'],
        ['Best for', 'Small home-service shops', 'Industrial / project-based work'],
        ['Pricing', '$299–$999/month flat', '25–40% markup on crew rates'],
        ['License verification', '✓ automated', '○ Workrise vets crews'],
        ['Long-term team building', '✓ core focus', '✗ episodic engagements'],
        ['Bilingual screening', '✓ included', '○ marketplace-dependent']
      ]
    );

    const body = [
      bodySection('Are FlexForce and Workrise alternatives?',
        ['Different business models entirely. Workrise is a labor marketplace — you contract crews short-term for specific projects. FlexForce helps you hire your own employees long-term.',
         'For a small HVAC shop that wants 5 full-time techs, FlexForce is the tool. For an oil & gas operator that needs a 30-person pipeline crew for 6 weeks, Workrise is the tool.'],
        { speakable: true }),
      bodySection('When does Workrise make sense?',
        ['Project-based work: pipeline construction, large industrial, episodic surge needs. The gig labor marketplace model works when the engagement has a defined start and end.',
         'Home-service residential and light-commercial contracting doesn\'t fit that model — you need ongoing teams who know your customers and trucks. Building that team is what FlexForce does.']),
      bodySection('When does using both make sense?',
        ['Hybrid shops: residential service that occasionally takes on multi-week commercial projects. Use FlexForce for the core team; tap Workrise for surge crews on the project work.',
         'For most small contractors (the 3–30 tech range FlexForce targets), the answer is "FlexForce only" — surge labor isn\'t a recurring need.'])
    ].join('\n\n');

    out.push({
      slug: 'compare-workrise',
      template: 'comparison',
      wave: 1,
      outputPath: '/compare/flexforce-vs-workrise/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'FlexForce vs Workrise — what\'s actually different | FlexForce.ai',
        META_DESCRIPTION: 'FlexForce vs Workrise for trades hiring. One hires your team, the other contracts gig crews. Here\'s when each makes sense for small contractors.',
        CANONICAL_PATH: '/compare/flexforce-vs-workrise/',
        CITATION_TITLE: 'FlexForce vs Workrise',
        PUB_DATE,
        COMPARE_TARGET: 'workrise',
        COMPARE_TARGET_DISPLAY: 'Workrise',
        H1: 'FlexForce vs Workrise — different problems.',
        HERO_EYEBROW: 'compare / FlexForce vs Workrise',
        HERO_SUB: 'Workrise is a gig-labor marketplace for project surges. FlexForce builds your own permanent team. Different problems, different tools. Here\'s when each makes sense.',
        TLDR_H2: 'The 30-second version',
        TLDR_PARAGRAPHS: paragraphs([
          'Workrise contracts crews for projects. FlexForce hires employees for your shop.',
          'Small home-service contractors almost always want the FlexForce model: hire your own people, screen them fast, keep them long-term. Workrise is for industrial and project-based labor that doesn\'t map to residential service work.'
        ]),
        TABLE_H2: 'Side-by-side comparison',
        COMPARE_TABLE: tableHtml,
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'build your own team, not contract one.',
        CTA_BODY: 'FlexForce calls every applicant in 60 seconds, screens them, verifies the license, books the interview. For shops hiring their own permanent crews. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">vs Indeed</a>',
          '      <a href="/compare/flexforce-vs-servicetitan-recruiting/" class="related-link">vs ServiceTitan</a>',
          '      <a href="/compare/flexforce-vs-in-house-recruiter/" class="related-link">vs in-house recruiter</a>',
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/guides/cost-to-hire-a-licensed-tradesperson/" class="related-link">cost to hire</a>',
          '      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">2026 hiring report</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('FlexForce vs Workrise', 'Workrise contracts gig crews; FlexForce hires your own team. When each makes sense.', faqs)
      }
    });
  }

  // FlexForce vs in-house recruiter
  {
    const faqs = [
      { q: 'When does an in-house recruiter make sense for a small contractor?', a: 'When you\'re hiring 20+ people a year consistently AND the recruiter can cover other functions too. Below that volume, a focused tool like FlexForce is more cost-effective.' },
      { q: 'What does a trades recruiter cost in 2026?', a: 'Fully loaded $4,500–$7,000/month for an experienced trades recruiter ($55k–$80k salary + benefits + tools). Senior recruiters can run higher.' },
      { q: 'What can a recruiter do that FlexForce can\'t?', a: 'Active sourcing (reaching out to passive candidates), in-person relationship-building with trade associations and apprenticeship programs, complex offer negotiations. FlexForce doesn\'t do active sourcing — it processes inbound applicants in 60 seconds.' },
      { q: 'What can FlexForce do that a recruiter can\'t?', a: '24/7 instant response (a human can\'t answer at 11pm on Sunday), perfect consistency across screens, unlimited concurrent screening at no extra cost, automated license verification.' },
      { q: 'Can I use both?', a: 'Yes. Many growing shops use FlexForce for inbound applicants (volume) and a recruiter or part-time consultant for active sourcing of senior roles.' }
    ];

    const tableHtml = compareTable(
      ['', 'FlexForce', 'In-house recruiter'],
      [
        ['Monthly cost', '$299–$999', '$4,500–$7,000 (fully loaded)'],
        ['Response time', '60 seconds, 24/7', 'Hours, business hours only'],
        ['Concurrent applicant capacity', 'Unlimited', '3–5 active searches'],
        ['Active sourcing', '✗ inbound only', '✓ outbound capable'],
        ['License verification', '✓ automated', 'Manual'],
        ['Consistency', '✓ same screen every time', 'Variable by recruiter mood / workload'],
        ['Relationship building', '✗', '✓ trade associations, schools']
      ]
    );

    const body = [
      bodySection('Should a small contractor hire an in-house recruiter?',
        ['It depends on volume and scope. If you\'re hiring 20+ people a year AND the recruiter can cover other ops functions, the math works. Below that, you\'re paying $50k+ for someone with idle capacity.',
         'Most 3–30 tech shops hire 6–15 people/year. At that volume, a focused tool like FlexForce delivers the same first-response and screening at 5% of the cost.'],
        { speakable: true }),
      bodySection('What a recruiter does that a tool can\'t',
        ['Active sourcing: reaching out to passive candidates who haven\'t applied. Relationship building: in-person presence at trade school graduations, association meetings, apprenticeship program partnerships. Complex offer negotiation: senior or specialist roles where compensation is custom.',
         'These are real human-only functions. They matter most when you\'re hiring senior journeymen or specialists, not when you\'re filling 6–15 routine roles a year.']),
      bodySection('What FlexForce does that a recruiter can\'t',
        ['24/7 instant response. A human recruiter can\'t answer at 11pm on Sunday — but applicants apply at all hours, especially weekends. A 60-second response on Saturday night converts ~5× better than a Monday-morning callback.',
         'Perfect consistency. The same screen every time, with the same license verification step, regardless of how busy or tired the screener is.',
         'Unlimited concurrent capacity. A recruiter runs 3–5 searches; FlexForce processes hundreds of applicants in parallel at no extra cost.']),
      bodySection('The hybrid model most growing shops actually use',
        ['FlexForce for inbound (the volume part). Part-time recruiter or consultant for outbound sourcing of senior roles. Owner handles final-round interviews and offer presentation personally.',
         'This model scales from 6 hires/year to 40+ without restructuring. Pure in-house recruiter requires a different cost structure to break even.'])
    ].join('\n\n');

    out.push({
      slug: 'compare-recruiter',
      template: 'comparison',
      wave: 1,
      outputPath: '/compare/flexforce-vs-in-house-recruiter/',
      tokens: {
        PAGE_STATE: '', PAGE_TRADE: '',
        PAGE_TITLE: 'FlexForce vs an in-house recruiter — math for small contractors | FlexForce.ai',
        META_DESCRIPTION: 'When does an in-house recruiter beat an AI hiring tool? The cost math and trade-offs for HVAC, plumbing, electrical, and roofing shops.',
        CANONICAL_PATH: '/compare/flexforce-vs-in-house-recruiter/',
        CITATION_TITLE: 'FlexForce vs In-House Recruiter — Small Contractor Math',
        PUB_DATE,
        COMPARE_TARGET: 'in-house-recruiter',
        COMPARE_TARGET_DISPLAY: 'in-house recruiter',
        H1: 'FlexForce vs hiring an in-house recruiter.',
        HERO_EYEBROW: 'compare / FlexForce vs recruiter',
        HERO_SUB: 'An in-house recruiter costs $4,500–$7,000/month fully loaded. FlexForce costs $299–$999/month and handles the same first-response and screening. Here\'s the math and the trade-offs.',
        TLDR_H2: 'The 30-second version',
        TLDR_PARAGRAPHS: paragraphs([
          'A recruiter is a human who actively sources passive candidates, builds relationships with trade associations, and negotiates offers. FlexForce is software that handles the inbound funnel in 60 seconds.',
          'Below 20 hires/year, FlexForce is the right tool. Above that — especially if you also need outbound sourcing — a recruiter or hybrid model wins.'
        ]),
        TABLE_H2: 'Side-by-side comparison',
        COMPARE_TABLE: tableHtml,
        BODY_SECTIONS: body,
        FAQ_BLOCK: faqHtmlBlock(faqs),
        CTA_HEADLINE: 'replace the recruiter you can\'t afford yet.',
        CTA_BODY: 'FlexForce calls every applicant in 60 seconds, screens, verifies license, books interview. At 5% of the cost of an in-house recruiter. 30-day free pilot.',
        RELATED_LINKS_BLOCK: [
          '      <a href="/compare/flexforce-vs-indeed/" class="related-link">vs Indeed</a>',
          '      <a href="/compare/flexforce-vs-servicetitan-recruiting/" class="related-link">vs ServiceTitan</a>',
          '      <a href="/compare/flexforce-vs-workrise/" class="related-link">vs Workrise</a>',
          '      <a href="/guides/cost-to-hire-a-licensed-tradesperson/" class="related-link">cost to hire</a>',
          '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
          '      <a href="/reports/2026-skilled-trades-hiring-report/" class="related-link">2026 hiring report</a>'
        ].join('\n'),
        JSON_LD_BLOCK: guideJsonLd('FlexForce vs in-house recruiter', 'Cost math and trade-offs of AI hiring vs an in-house trades recruiter.', faqs)
      }
    });
  }

  return out;
}

// ─── original-data report ────────────────────────────────────────────────────
function buildReport() {
  const faqs = [
    { q: 'What\'s the headline number for 2026?', a: 'A 350,000+ skilled trades worker shortfall by 2028 (JLL Workforce 2025), with HVAC, electrical, and plumbing leading. Time-to-fill for journeyman roles has climbed from 21 days in 2020 to 38+ days in Q1 2026 (Indeed Hiring Lab).' },
    { q: 'Who is the report for?', a: 'Small home-service contractors (3–30 techs), home-service operators, trade associations, and journalists covering trades labor. The report is free to read and free to cite — see "How to cite" below.' },
    { q: 'Is the data original or aggregated?', a: 'Aggregated from public BLS, JLL, ACCA, NECA, PHCC, Indeed Hiring Lab, and ABC Workforce Survey 2025 sources. The synthesis (FlexForce Analysis callouts) is proprietary — analysis of patterns across the aggregated data.' },
    { q: 'When was it published and how often is it updated?', a: 'Published May 23, 2026. Updated quarterly through 2030 as new BLS and Indeed Hiring Lab data drops.' },
    { q: 'Can I cite or quote this report?', a: 'Yes, with attribution to FlexForce.ai and a link back. Quote any FlexForce Analysis callout or aggregated stat. See the citation block below.' }
  ];

  const body = [
    bodySection('Executive summary',
      ['The U.S. skilled trades labor market in 2026 is structurally tighter than at any point since the BLS began tracking it. Three forces converge: (1) baby boomer retirements outpacing apprentice intake, (2) electrification demand (heat pumps, EV chargers, solar) compounding electrical and HVAC needs, (3) commercial wages on data-center and chip-fab projects pulling techs out of residential shops.',
       'The result for small home-service contractors: time-to-fill journeyman roles has climbed from 21 days (2020) to 38+ days (Q1 2026). Ghost rates are above 40%. Ad-spend ROI is declining. The differentiator is shifting from spend to speed.'],
      { speakable: true }),
    bodySection('The 350,000-worker gap',
      ['JLL Workforce 2025 projects a 350,000+ skilled trades shortfall through 2028. BLS Construction Trades Employment Projections (2025) show construction trades growing ~5% through 2032 — slower than retirement attrition. ACCA, NECA, and PHCC 2025 surveys all confirm member shortages.',
       'FlexForce Analysis: the shortage compounds in markets with simultaneous electrification surge and commercial buildouts — TX (data centers + summer demand), NJ (lead pipe + NYC pressure), CT (heat pump conversion + Fairfield wages), NY (Local Law 97 retrofits). UT is the lowest-friction market by current numbers but trending toward NJ-style pressure as Silicon Slopes scales.']),
    bodySection('Which trades are shortest in 2026',
      ['Electricians: tightest in 2026. EV chargers, solar interconnects, Local Law 97 retrofits, Silicon Slopes data-center electrical buildout all compete for the same licensed people.',
       'Plumbers: projected fastest decline through 2030. Retirement-driven plus lead-pipe replacement mandates + heat-pump incidental plumbing demand.',
       'HVAC: most volatile. Refrigerant transitions, heat-pump growth, Local Law 97 retrofits drive episodic demand spikes.',
       'Roofers: weather- and storm-dependent. Hailstorm seasons in TX and CT create 3–4× demand spikes the local labor pool can\'t absorb.']),
    bodySection('Response time is the new wage',
      ['Indeed Hiring Lab Q1 2026 data: response-time-to-first-contact is the single biggest predictor of qualified-applicant-to-hire conversion. 1-minute response converts ~9× better than 60-minute response.',
       'FlexForce Analysis: the implication for small shops is that the highest-ROI hiring lever in 2026 is not ad spend but response automation. Spending 2× more on Indeed listings without changing response time delivers ~1.2× more applicants — but only ~1.05× more hires. Cutting response time from 4 hours to 1 minute delivers ~3× more hires from the same applicant pool.']),
    bodySection('Cost-to-hire math',
      ['Total cost-to-hire for HVAC, plumbing, or electrical roles in 2026: $3,500–$9,000 per hire (ad spend + screening time + onboarding + vacancy cost). Vacancy cost — $1,200–$2,800/week of unbilled service work — is the largest hidden component.',
       'FlexForce Analysis: automating screening reduces time-to-fill by 60–70%, which compresses vacancy cost from ~5 weeks to ~1.5 weeks per role. For a shop hiring 8 roles/year, that\'s $35,000–$70,000 in recovered annual revenue.']),
    bodySection('How to cite this report',
      ['Suggested citation: "FlexForce.ai. (2026). 2026 Skilled Trades Hiring Report. https://flexforce.ai/reports/2026-skilled-trades-hiring-report/"',
       'BibTeX: @misc{flexforce2026, title={2026 Skilled Trades Hiring Report}, author={Jack and FlexForce.ai}, year={2026}, url={https://flexforce.ai/reports/2026-skilled-trades-hiring-report/}}',
       'Reproduction: free with attribution + link back to flexforce.ai. Charts and FlexForce Analysis callouts may be quoted directly.'])
  ].join('\n\n');

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: '2026 Skilled Trades Hiring Report',
      author: { '@type': 'Person', name: 'Jack' },
      publisher: { '@type': 'Organization', name: 'FlexForce.ai', url: 'https://flexforce.ai' },
      datePublished: PUB_DATE, dateModified: PUB_DATE,
      description: 'Original-data report on the 2026 skilled trades labor market: workforce gap, response-time data, cost-to-hire math, state-by-state pressure analysis.'
    },
    {
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: '2026 Skilled Trades Hiring Report — aggregated data',
      description: 'Aggregated U.S. trades workforce data from BLS OEWS 2025, JLL Workforce 2025, ACCA 2025, NECA 2025, PHCC 2025, Indeed Hiring Lab Q1 2026, and ABC Workforce Survey 2025.',
      creator: { '@type': 'Organization', name: 'FlexForce.ai' },
      datePublished: PUB_DATE,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      keywords: 'skilled trades, labor shortage, HVAC hiring, electrician hiring, plumber hiring, roofer hiring, 2026, BLS, JLL'
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJsonLd(faqs) },
    { '@context': 'https://schema.org', '@type': 'Speakable', cssSelector: ['.speakable-intro', '.speakable-answer'] }
  ];

  return {
    slug: 'report-2026',
    template: 'guide',
    wave: 1,
    outputPath: '/reports/2026-skilled-trades-hiring-report/',
    tokens: {
      PAGE_STATE: '', PAGE_TRADE: '',
      PAGE_TITLE: '2026 Skilled Trades Hiring Report | FlexForce.ai',
      META_DESCRIPTION: 'Original-data report on the 2026 skilled trades labor market: 350k worker gap, response-time data, cost-to-hire math, state-by-state analysis. Free + citable.',
      CANONICAL_PATH: '/reports/2026-skilled-trades-hiring-report/',
      CITATION_TITLE: '2026 Skilled Trades Hiring Report',
      PUB_DATE,
      GUIDE_SHORT_TITLE: '2026 hiring report',
      HERO_EYEBROW: 'report / original data',
      H1: '2026 skilled trades hiring report.',
      HERO_SUB: 'The U.S. skilled trades labor market is structurally tighter than at any point since BLS began tracking it. 350,000+ worker gap by 2028. Response time is the new wage. Here\'s the full data picture for small home-service contractors.',
      BODY_SECTIONS: body,
      FAQ_BLOCK: faqHtmlBlock(faqs),
      CTA_HEADLINE: 'the shortage is structural — build the hiring system it demands.',
      CTA_BODY: 'FlexForce calls every applicant in 60 seconds, screens them, verifies the license, books the interview. The fastest-response shop wins through 2030. 30-day free pilot.',
      RELATED_LINKS_BLOCK: [
        '      <a href="/trades/hvac/" class="related-link">HVAC hiring hub</a>',
        '      <a href="/trades/plumbing/" class="related-link">plumbing hiring hub</a>',
        '      <a href="/trades/electrical/" class="related-link">electrical hiring hub</a>',
        '      <a href="/trades/roofing/" class="related-link">roofing hiring hub</a>',
        '      <a href="/hire/hvac-technicians/texas/" class="related-link">hire HVAC in TX</a>',
        '      <a href="/hire/hvac-technicians/new-york/" class="related-link">hire HVAC in NY</a>'
      ].join('\n'),
      JSON_LD_BLOCK: `<script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  </script>`
    }
  };
}

// ─── main ────────────────────────────────────────────────────────────────────
function main() {
  const pages = [];
  for (const stateSlug of Object.keys(STATES)) {
    for (const tradeSlug of Object.keys(TRADES)) {
      pages.push(buildMoneyPage(stateSlug, tradeSlug));
    }
    pages.push(buildStateHub(stateSlug));
  }
  for (const tradeSlug of Object.keys(TRADES)) {
    pages.push(buildTradeHub(tradeSlug));
  }
  pages.push(...buildGuides());
  pages.push(...buildComparisons());
  pages.push(buildReport());

  // Skip TX HVAC — bespoke reference page already shipped.
  const filtered = pages.filter(p => p.outputPath !== '/hire/hvac-technicians/texas/');

  fs.writeFileSync(OUT_PATH, JSON.stringify({ pages: filtered }, null, 2));
  console.log(`Wrote ${filtered.length} page configs to ${path.relative(process.cwd(), OUT_PATH)}`);
  console.log('  (TX HVAC reference page excluded — kept as canonical hand-built version)');
}

main();
