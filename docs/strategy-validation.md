# Strategy validation — Phase 2 output

> Confirms the SEO + AEO plan documented in `seo-strategy.md` and `aeo-strategy.md` against
> brand context in `CLAUDE.md` and the keyword cluster in `keyword-clusters.md`.

---

## Editorial plan — confirmed

The five-state, four-trade plan ships in three waves:

- **Wave 1 (Day 1):** TX + NJ money pages (8), 4 trade hubs, 2 state hubs (TX, NJ), 5 guides, 4 comparisons, 1 original-data report. Infrastructure: sitemap.xml, robots.txt, llms.txt, llms-full.txt.
- **Wave 2 (Day 4):** UT money pages (4) + state hub. Updated sitemap/llms files.
- **Wave 3 (Day 8):** CT + NY money pages (8) + state hubs. Updated sitemap/llms files.

Total: 39 new pages + infrastructure.

## Priorities

1. **Depth over breadth.** 39 deep pages with state-specific data beats 200 thin programmatic pages. Google's helpful-content updates penalize the latter.
2. **Question-led structure.** Every H2 is a question; first sentence below is the direct answer. AEO requirement; also improves SERP rich snippet eligibility.
3. **State-specific data.** Wage tables, license boards, named associations, city contexts are uniquely written per state-trade combo to avoid duplicate-content flagging.
4. **Speakable + JSON-LD coverage.** Money pages carry LocalBusiness + Service + FAQPage + Article + Speakable. Guides carry Article + FAQPage + HowTo (where applicable) + Speakable. Report carries Article + Dataset + FAQPage + Speakable.
5. **Off-site presence.** Crunchbase, Product Hunt, G2/Capterra, AlternativeTo, Reddit, HN — handled in a separate submission pack (`docs/off-site-submission-pack.md`) for Jack to execute.

## Gap analysis vs current site

| Item | Status before | Status after Wave 1 |
|---|---|---|
| Trade hubs | none | 4 published |
| State hubs | none | 2 of 5 published (TX, NJ) |
| Money pages | 1 (TX HVAC) | 9 (TX + NJ × 4 trades, plus the reference) |
| Comparison pages | none | 4 published |
| Evergreen guides | none | 5 published |
| Original-data report | none | 1 published |
| sitemap.xml | none | published, 40 URLs |
| robots.txt | none | published, AI-crawler-explicit |
| llms.txt + llms-full.txt | none | both published |
| JSON-LD | minimal on home | full coverage per page type |
| AEO meta tags | none | every page |
| Analytics tracking | none | GTM + PostHog wired across all pages |

## Risk register

1. **Indexing speed.** Google may take 2–7 days to index new pages; first impressions in Search Console after 1–2 weeks. Mitigation: submit sitemap day one, request indexing for the 8 priority URLs (see `gsc-setup.md`).
2. **Duplicate content classification.** Money pages share structural templates but bespoke per-state copy. Spot-check confirms unique pain sections, wage tables, city contexts, FAQs per state-trade combo.
3. **AI citation lag.** AEO results show up in 6–16 weeks. The baseline doc (`ai-visibility-baseline.md`) frames what to track and where to invest off-site presence first.
4. **Solo founder bandwidth.** All off-site submissions, GSC setup, and weekly AI-query monitoring fall to Jack. Cadence in `gsc-setup.md`.

## Sign-off

Plan is consistent with brand voice (CLAUDE.md), avoids Thursday Strategy / team references, holds the lowercase-confident first-person style throughout. Ready to ship.
