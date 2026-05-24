# FlexForce.ai — SEO + AEO Full Execution Prompt
> Paste this entire file into Claude Code desktop. It runs the complete SEO + AEO
> program end-to-end from Phase 3 to final handoff.

---

You are the SEO + AEO program manager for FlexForce.ai.

═══════════════════════════════════════════
WHAT'S ALREADY DONE — START FROM PHASE 2
═══════════════════════════════════════════

The following work is complete — do NOT redo it:

✓ docs/seo-strategy.md — updated with 5-state plan + staggered wave schedule
✓ docs/keyword-clusters.md — 39 pages mapped to primary keywords (Jack approved)
✓ hire/hvac-technicians/texas/index.html — complete reference money page (use
  this file's exact CSS, nav, footer, and HTML structure for every page you build)
✓ All 39 page directories created under hire/, states/, trades/, guides/,
  compare/, reports/
✓ Git commit: "update seo-strategy: 5-state plan with staggered publication"

═══════════════════════════════════════════
SOURCE FILES — READ THESE FIRST
═══════════════════════════════════════════

Before writing a single file, read ALL of these:

1. CLAUDE.md                              brand rules, voice, colors, logo SVG,
                                          code conventions (mandatory)
2. docs/seo-strategy.md                   state data, wage tables, license boards,
                                          associations, pain points per state
3. docs/aeo-strategy.md                   AEO rules, schema map, meta tags,
                                          llms.txt format, 15 test queries
4. docs/keyword-clusters.md               primary keyword per page, competition
                                          level, wave assignment
5. hire/hvac-technicians/texas/index.html reference page — copy its CSS exactly
                                          into every page you build

═══════════════════════════════════════════
HOW TO USE THE SEARCHFIT-SEO SKILL SUITE
═══════════════════════════════════════════

The searchfit-seo skill suite is active. Use it via the Skill tool with
these exact names at the phases specified below:

  searchfit-seo:content-strategy
  searchfit-seo:keyword-cluster
  searchfit-seo:create-topic
  searchfit-seo:create-content
  searchfit-seo:on-page-seo
  searchfit-seo:generate-schema
  searchfit-seo:ai-visibility
  searchfit-seo:internal-linking

If a skill call fails or returns an error, fall back to executing that
phase manually using the data and instructions in this prompt.

═══════════════════════════════════════════
SCOPE — 39 PAGES TOTAL
═══════════════════════════════════════════

20 money pages:
  hire/hvac-technicians/texas/         hire/hvac-technicians/new-jersey/
  hire/hvac-technicians/utah/          hire/hvac-technicians/connecticut/
  hire/hvac-technicians/new-york/
  hire/plumbers/texas/                 hire/plumbers/new-jersey/
  hire/plumbers/utah/                  hire/plumbers/connecticut/
  hire/plumbers/new-york/
  hire/electricians/texas/             hire/electricians/new-jersey/
  hire/electricians/utah/              hire/electricians/connecticut/
  hire/electricians/new-york/
  hire/roofers/texas/                  hire/roofers/new-jersey/
  hire/roofers/utah/                   hire/roofers/connecticut/
  hire/roofers/new-york/

5 state hubs:
  states/texas/   states/new-jersey/   states/utah/
  states/connecticut/   states/new-york/

4 trade hubs:
  trades/hvac/   trades/plumbing/   trades/electrical/   trades/roofing/

5 evergreen guides:
  guides/how-to-hire-hvac-technician-fast/
  guides/spanish-speaking-trades-recruiting/
  guides/why-trades-applicants-ghost/
  guides/2026-skilled-trades-labor-shortage-report/
  guides/cost-to-hire-a-licensed-tradesperson/

4 comparison pages:
  compare/flexforce-vs-indeed/
  compare/flexforce-vs-servicetitan-recruiting/
  compare/flexforce-vs-workrise/
  compare/flexforce-vs-in-house-recruiter/

1 original-data report:
  reports/2026-skilled-trades-hiring-report/

Plus: sitemap.xml, robots.txt, llms.txt, llms-full.txt at repo root.

═══════════════════════════════════════════
STATE DATA — CANONICAL (use exactly)
═══════════════════════════════════════════

TX | TDLR (Texas Dept of Licensing & Regulation) | tdlr.texas.gov
   | Houston, Dallas, Austin
   | HVAC $32–45/hr · Plumbing $30–44/hr · Electrical $28–43/hr · Roofing $22–35/hr
   | ACCA of Texas · PHCC of Texas · IEC Texas
   | Pain: data-center build-out wave DFW, summer AC crisis, large bilingual workforce
   | Bilingual screening: YES (Houston, Dallas, Austin)
   | HVAC license: tdlr.texas.gov/hvac
   | Plumbing license: tdlr.texas.gov/plumbing
   | Electrical license: tdlr.texas.gov/electricians
   | Roofing: no statewide license; HIC registration required in many cities

NJ | NJ Division of Consumer Affairs + NJBPU | njconsumeraffairs.gov
   | Newark, Jersey City, Paterson
   | HVAC $38–52/hr · Plumbing $38–54/hr · Electrical $40–56/hr · Roofing $28–42/hr
   | ACCA NJ · PHCC NJ · NJ Electrical Contractors Association
   | Pain: aging housing stock retrofit, lead-pipe replacement mandate (2031 deadline),
   |       NYC commuter wage pressure
   | Bilingual screening: YES
   | HVAC license: njconsumeraffairs.gov/hvacr
   | Plumbing license: njconsumeraffairs.gov/plumb
   | Electrical license: njconsumeraffairs.gov/elec
   | Roofing: NJ HIC (Home Improvement Contractor) license — njconsumeraffairs.gov/hic

UT | Utah DOPL (Div. of Occupational & Professional Licensing) | dopl.utah.gov
   | Salt Lake City, Provo, Ogden
   | HVAC $30–42/hr · Plumbing $30–44/hr · Electrical $29–43/hr · Roofing $22–34/hr
   | Utah HVAC Contractors Association · UPHCA · IEC Utah
   | Pain: nation's fastest population growth (23% since 2010), Silicon Slopes
   |       commercial construction, new residential overwhelming local labor supply
   | Bilingual screening: NO — omit bilingual block for all UT pages
   | HVAC license: dopl.utah.gov/hvac
   | Plumbing license: dopl.utah.gov/plumber
   | Electrical license: dopl.utah.gov/electrical
   | Roofing: dopl.utah.gov/contractor

CT | CT Dept of Consumer Protection | ct.gov/dcp
   | Bridgeport, Hartford, New Haven
   | HVAC $36–50/hr · Plumbing $38–54/hr · Electrical $40–56/hr · Roofing $26–40/hr
   | CT Heating & Cooling Contractors Association · CT PHCC · CT IEC
   | Pain: oil-to-heat-pump conversion surge (Energize CT rebates up to $15k),
   |       aging workforce retiring faster than apprentices enter, NYC wage competition
   | Bilingual screening: brief mention only (Bridgeport has Spanish-speaking community)
   | All trade licenses: ct.gov/dcp
   | Roofing: CT Home Improvement Contractor (HIC) registration — ct.gov/dcp

NY | NYS Dept of State (upstate) + NYC Dept of Buildings (NYC)
   | dos.ny.gov/licensing + nyc.gov/site/buildings
   | New York City, Buffalo, Rochester
   | HVAC $40–58/hr · Plumbing $42–62/hr · Electrical $44–65/hr · Roofing $30–48/hr
   |   (NYC union scales significantly higher — show both union and non-union ranges)
   | ACCA NY · PHCC NY · NECA NY
   | Pain: NYC Local Law 97 building emissions retrofit wave (HVAC + electrical +
   |       plumbing upgrades required across hundreds of thousands of buildings by 2030),
   |       union vs non-union split, tight urban labor pools in NYC
   | Bilingual screening: YES (especially NYC outer boroughs)
   | Note: NYC requires separate DOB licenses for plumbing and electrical;
   |       upstate follows NYS Dept of State licensing. Mention both.

═══════════════════════════════════════════
PHASE 2 — STRATEGY VALIDATION + KEYWORD CLUSTER
═══════════════════════════════════════════

NOTE: Jack has already approved the keyword clusters in docs/keyword-clusters.md.
Do NOT stop and ask for approval again. Run these skills to produce the output
files, then proceed directly to Phase 3.

Run searchfit-seo:content-strategy
  Input:  docs/seo-strategy.md + docs/aeo-strategy.md + CLAUDE.md
  Output: save to docs/strategy-validation.md

Run searchfit-seo:keyword-cluster
  Input:  seed keyword list from docs/seo-strategy.md expanded with UT/CT/NY
          variants from docs/keyword-clusters.md
  Output: overwrite docs/keyword-clusters.md with the skill output as the
          canonical version going forward

═══════════════════════════════════════════
PHASE 3 — BUILD TEMPLATES + GENERATOR
═══════════════════════════════════════════

Build 5 HTML templates under templates/ with tokenized variables.
CSS must be copied exactly from hire/hvac-technicians/texas/index.html.

  templates/hire-money-page.html
  templates/state-hub.html
  templates/trade-hub.html
  templates/guide.html
  templates/comparison.html

Tokens to use across templates:
  {{PAGE_TITLE}} {{META_DESCRIPTION}} {{CANONICAL_PATH}} {{H1}}
  {{TRADE_NAME}} {{TRADE_SLUG}} {{TRADE_HUB_SLUG}} {{STATE_NAME}}
  {{STATE_SLUG}} {{STATE_ABBR}} {{LICENSE_BOARD}} {{LICENSE_BOARD_URL}}
  {{WAGE_LOW}} {{WAGE_HIGH}} {{CITY_1}} {{CITY_2}} {{CITY_3}}
  {{CITY_1_CONTEXT}} {{CITY_2_CONTEXT}} {{CITY_3_CONTEXT}}
  {{ASSOC_1_NAME}} {{ASSOC_1_URL}} {{ASSOC_2_NAME}} {{ASSOC_2_URL}}
  {{ASSOC_3_NAME}} {{ASSOC_3_URL}} {{PAIN_SECTION}} {{BILINGUAL_BLOCK}}
  {{INTRO_PARAGRAPH}} {{WAGE_TABLE_ROWS}} {{FAQ_BLOCK}} {{JSON_LD_BLOCK}}
  {{RELATED_LINKS_BLOCK}} {{STAT_1}} {{STAT_2}} {{STAT_3}} {{PUB_DATE}}
  {{COMPARE_TARGET}} {{COMPARE_TABLE}}

AEO rules baked into every template:
  • H2s phrased as QUESTIONS — never topic statements
    CORRECT: "How do I hire plumbers fast in New Jersey?"
    WRONG:   "Hiring plumbers in New Jersey"
  • First sentence after each H2 = direct answer (no setup phrases)
  • Paragraphs max 3 sentences
  • At least one data TABLE per money page
  • Specific numbers everywhere ("27% faster" not "much faster")
  • speakable-intro and speakable-answer CSS classes on key answer sentences

AEO meta tags in every template <head>:
  <meta name="robots" content="index, follow, max-snippet:-1,
    max-image-preview:large, max-video-preview:-1">
  <meta name="GPTBot" content="allow">
  <meta name="ChatGPT-User" content="allow">
  <meta name="ClaudeBot" content="allow">
  <meta name="anthropic-ai" content="allow">
  <meta name="PerplexityBot" content="allow">
  <meta name="Google-Extended" content="allow">
  <meta property="og:type" content="article">
  <meta property="article:author" content="Jack">
  <meta name="citation_publication_date" content="2026-05-23">
  <meta name="citation_author" content="Jack, FlexForce.ai">

Build scripts/generate-pages.js
  Node script that reads scripts/pages-config.json, loads the appropriate
  template, replaces all {{TOKENS}}, writes index.html to the canonical path.

Build scripts/pages-config.json
  One entry per page (39 total) with all token values filled in using the
  state data above and docs/keyword-clusters.md as sources.

Verify: run `node scripts/generate-pages.js` and confirm one sample page
(hire/hvac-technicians/new-jersey/index.html) renders correctly before
generating the remaining 37. Fix template if broken, then generate all.

═══════════════════════════════════════════
PHASE 4 — TOPIC PLANS (39 pages)
═══════════════════════════════════════════

For EACH of the 39 pages, run searchfit-seo:create-topic.

  Input per call:
    - page type (money page | state hub | trade hub | guide | comparison | report)
    - trade (HVAC | plumbing | electrical | roofing) — where applicable
    - state (Texas | New Jersey | Utah | Connecticut | New York) — where applicable
    - primary keyword (from docs/keyword-clusters.md)
    - local data block (from the STATE DATA section above)
    - AEO structural rules (from docs/aeo-strategy.md)

  Output per call: save to content-briefs/[page-slug].md

Run all 39 in sequence. After completion, print a summary table:
  [#] | slug | primary keyword | brief headline

Money page brief must confirm all 13 required elements are planned:
  1.  H1 with primary keyword exact
  2.  Local hook in first 100 words (city name + license board + pain)
  3.  Wage band TABLE (3–4 cities, entry/journeyman/senior rates)
  4.  License verification section (board name, check process, link)
  5.  3 named local trade associations with links
  6.  3 city callout cards (biggest metros, one-sentence context each)
  7.  Trade+state pain section (unique per page — no copy-paste)
  8.  Bilingual recruiting block (TX/NJ/NY full; CT brief; UT omit)
  9.  Comparison table (FlexForce vs Indeed vs in-house recruiter)
  10. CTA block (green bg, lime button, "start free pilot →")
  11. 5 FAQ items as faq-q/faq-a div pairs
  12. related-links section (trade hub, state hub, 2 guides, 1 comparison)
  13. JSON-LD: LocalBusiness + Service + FAQPage + Article + Speakable

═══════════════════════════════════════════
PHASE 5 — CONTENT GENERATION (39 pages)
═══════════════════════════════════════════

For EACH of the 39 pages, run searchfit-seo:create-content.

  Input per call:
    - content brief from content-briefs/[slug].md
    - appropriate template from templates/
    - brand voice from CLAUDE.md
    - AEO structural rules from docs/aeo-strategy.md

  Output per call: complete HTML page at canonical path
    hire/[trade-slug]/[state-slug]/index.html
    states/[state-slug]/index.html
    trades/[trade-slug]/index.html
    guides/[topic-slug]/index.html
    compare/[vs-target]/index.html
    reports/2026-skilled-trades-hiring-report/index.html

After every batch of 5 pages, run searchfit-seo:on-page-seo on that batch.
  Input:  the 5 generated HTML files
  Fix all flagged issues before continuing to the next batch of 5.

Reject and regenerate any page that:
  1. Has content substantially similar to another page in the same trade
  2. Has any H2 phrased as a statement instead of a question
  3. Is missing 3+ of the 13 required money-page elements
  4. Primary keyword missing from H1 or first 100 words
  5. Internal links missing or pointing to wrong paths

For the original-data report:
  • Cite real public sources: BLS OEWS 2025, JLL Workforce 2025, ACCA 2025,
    NECA 2025, PHCC 2025, Indeed Hiring Lab Q1 2026, ABC Workforce Survey
  • Include 3 "FlexForce Analysis" callout blocks (proprietary insights
    synthesized from public data — branded as FlexForce original research)
  • Include "How to cite this report" with proper citation format
  • Make it a citable artifact: clean URL, authoritative structure

═══════════════════════════════════════════
PHASE 6 — STRUCTURED DATA (JSON-LD)
═══════════════════════════════════════════

For EACH of the 39 pages, run searchfit-seo:generate-schema.

  Schema map:
    Money pages:   LocalBusiness + Service + FAQPage + Article + Speakable
    Guides:        Article + FAQPage + HowTo (where steps exist) + Speakable
    State hubs:    ItemList + Service + FAQPage
    Trade hubs:    ItemList + Service + FAQPage
    Comparisons:   Article + FAQPage
    Report:        Article + Dataset + Speakable
    Home page:     Organization + WebSite + SoftwareApplication + Person (Jack)
      (update index.html — add home-page schemas if not already present)

  Inject JSON-LD directly before </head> in each HTML file.

  Speakable: mark .speakable-intro and .speakable-answer CSS selectors on:
    • H1 + first paragraph of every money page and guide
    • First answer sentence after each Q-led H2

  Person schema for Jack (home page + report):
    "@type": "Person", "name": "Jack",
    "jobTitle": "Founder", "worksFor": "FlexForce.ai",
    "url": "https://flexforce.ai"

═══════════════════════════════════════════
PHASE 7 — SITEMAP, ROBOTS, LLMS.TXT
═══════════════════════════════════════════

sitemap.xml at repo root — all 40 URLs (39 new + home):
  <loc>         full URL https://flexforce.ai/[path]
  <lastmod>     2026-05-23
  <changefreq>  weekly (hubs, guides, comparisons) | monthly (money pages)
                never (report)
  <priority>    1.0 home | 0.9 hubs + report | 0.8 money pages
                0.7 comparisons | 0.6 guides

robots.txt at repo root:
  User-agent: *
  Allow: /

  User-agent: GPTBot
  Allow: /

  User-agent: ChatGPT-User
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: anthropic-ai
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: Google-Extended
  Allow: /

  User-agent: CCBot
  Allow: /

  User-agent: cohere-ai
  Allow: /

  Sitemap: https://flexforce.ai/sitemap.xml

llms.txt at repo root (Jeremy Howard standard):
  # FlexForce.ai
  > [one-line product description]
  ## Key facts    (pricing, trades, states, founder, free trial)
  ## Documentation
  ## Trade hubs   (links + 1-line descriptions)
  ## State hubs   (links + 1-line descriptions)
  ## Guides       (links + 1-line descriptions)
  ## Comparisons  (links + 1-line descriptions)
  ## Reports      (link to 2026 report)

llms-full.txt at repo root:
  Programmatically concatenate the full text content of every key page
  (strip HTML tags, preserve headings and structure in markdown format).
  This is what AI crawlers ingest in one fetch.

═══════════════════════════════════════════
PHASE 8 — INTERNAL LINKING
═══════════════════════════════════════════

Run searchfit-seo:internal-linking if available.
  Input:  all 39 generated HTML files + the linking graph below
  Output: updated HTML files with contextual internal links inserted

If the skill is not available, apply the linking graph manually:
  Money pages  → trade hub + state hub + 2 guides + 1 comparison
  Guides       → 2–3 related money pages + 1 comparison
  Comparisons  → 2 related money pages + relevant trade hub
  Trade hubs   → all 5 state money pages for that trade
  State hubs   → all 4 trade money pages for that state
  Home page    → 4 trade hubs + report (add to footer links)
  Report       → 4 trade hubs + 2 money pages

Use the .related-links div and .related-link anchor class from the reference
page. All links use root-relative paths (e.g. /trades/hvac/ not ./hvac/).

═══════════════════════════════════════════
PHASE 9 — STAGGERED COMMITS
═══════════════════════════════════════════

Stage in three waves. Each is a separate git add + git commit.
Do NOT push — Jack pushes manually after reviewing each wave.

Wave 1 — commit message:
  "wave 1: ship TX + NJ + all hubs + guides + comparisons + report"
  Files: 8 TX+NJ money pages, 4 trade hubs, 2 state hubs (TX+NJ),
         5 guides, 4 comparison pages, 1 report,
         sitemap.xml, robots.txt, llms.txt, llms-full.txt,
         templates/, scripts/, content-briefs/

Wave 2 — commit message:
  "wave 2: ship UT money pages + state hub"
  Files: 4 UT money pages, states/utah/, updated sitemap.xml,
         llms.txt, llms-full.txt

Wave 3 — commit message:
  "wave 3: ship CT + NY money pages + state hubs"
  Files: 8 CT+NY money pages, states/connecticut/, states/new-york/,
         updated sitemap.xml, llms.txt, llms-full.txt

After staging each wave, print the file list so Jack can verify before pushing.

═══════════════════════════════════════════
PHASE 10 — AI VISIBILITY BASELINE
═══════════════════════════════════════════

Run searchfit-seo:ai-visibility
  Input:
    - the 15 target test queries from docs/aeo-strategy.md
    - competitors: VeroSkills, Workrise, Indeed, ServiceTitan, BlueCrew, Wonolo
    - the shipped URLs (all 39 pages)
  Output: save to docs/ai-visibility-baseline.md
    • per-query: who is currently cited and why
    • FlexForce gap analysis: which directories/properties are missing
      vs where competitors appear
    • prioritized action list: top 10 places to get listed, ranked by
      AI training-data weight

If the skill is unavailable, write docs/ai-visibility-baseline.md manually
using known patterns: identify which of the 15 queries competitors likely
dominate, which directories (Crunchbase, G2, ProductHunt, Reddit, HN) drive
AI citations, and what FlexForce needs to be present on first.

═══════════════════════════════════════════
PHASE 11 — OFF-SITE SUBMISSION ASSET PACK
═══════════════════════════════════════════

Write docs/off-site-submission-pack.md — Jack's copy-paste kit.
Claude Code cannot submit to these — Jack does it with his account.

One section per property with exact copy + submission URL:

CRUNCHBASE
  Tagline (60 chars), short description (150 chars), long description (500 chars),
  categories (Applicant Tracking, AI, Recruiting), founded date, founder (Jack),
  HQ, funding stage (Bootstrapped), submission URL

PRODUCT HUNT
  Tagline, description (250 chars), first-comment template (Jack's launch message),
  maker comment template, 3 gallery image specs (homepage, apply page, dashboard mock),
  topic tags, submission URL, launch day checklist
  Best launch day: Tuesday 12:01am PT

G2 / CAPTERRA / GETAPP  (one section each, reformatted per platform)
  Product name, vendor, categories (3), description (1000 chars),
  feature list, pricing tier descriptions

ALTERNATIVETO
  List as alternative to: Indeed, BlueCrew, VeroSkills, Workrise
  Description (300 chars), tags

LINKEDIN COMPANY PAGE
  About section copy, tagline, industry, specialties tags (10), cover image spec

HACKER NEWS — Show HN post
  Title (≤80 chars, no marketing speak), body (≤200 words),
  first-comment template, best day (Tuesday or Wednesday),
  48-hour engagement plan

REDDIT ORGANIC ENGAGEMENT
  20 subreddits/thread topics across r/HVAC, r/electricians, r/Plumbing,
  r/Contractors where a genuine FlexForce mention adds real value
  For each: topic + value-first comment template
  Include Reddit account warming tips (don't post from a day-old account)

Also write docs/asset-specs.md — visual asset specs for any screenshots
or images needed for the above submissions (dimensions, content, format).

═══════════════════════════════════════════
PHASE 12 — GSC + BING SETUP GUIDE
═══════════════════════════════════════════

Write docs/gsc-setup.md with exact step-by-step instructions for Jack:

  a. google.com/search-console → Add property → Domain → flexforce.ai
  b. TXT record verification → copy value → add to DNS at registrar
  c. Wait 5–10 min → Verify
  d. Left nav → Sitemaps → submit https://flexforce.ai/sitemap.xml
  e. URL Inspection → request indexing for these 8 priority pages:
       /
       /trades/hvac/
       /trades/plumbing/
       /hire/hvac-technicians/texas/
       /hire/hvac-technicians/new-jersey/
       /states/texas/
       /reports/2026-skilled-trades-hiring-report/
       /compare/flexforce-vs-indeed/
  f. Bing Webmaster Tools (bing.com/webmasters) → Import from Google Search
     Console → one click, sitemap carries over automatically

Include section "After indexing — what to expect":
  • Pages indexed within 2–7 days of submission
  • First impressions in Search Console: 1–2 weeks
  • First ranking positions: 4–8 weeks
  • Weekly tasks: check impressions per page; manually run the 15 AEO test
    queries from docs/aeo-strategy.md across ChatGPT, Claude, Perplexity,
    Gemini, and Grok; log results in docs/ai-visibility-tracker.md

Create docs/ai-visibility-tracker.md as an empty tracker table:
  | Query | ChatGPT | Claude | Perplexity | Gemini | Grok | Notes |
  |---|---|---|---|---|---|---|
  (pre-populate with all 15 queries from docs/aeo-strategy.md, cells blank)

═══════════════════════════════════════════
WHEN TO STOP AND ASK JACK
═══════════════════════════════════════════

Interrupt only for:
1. A Vercel deploy fails — stop, share the build log
2. Local data for a state is unclear after checking the STATE DATA block
   above — propose best guess, ask for confirmation
3. Final handoff — when everything is built, post a summary:
     (a) count of pages built + estimated words generated
     (b) schema types added per page type
     (c) pending Jack actions: GSC setup, off-site submissions,
         real Turnstile key swap (replace 1x00000000000000000000AA in index.html),
         Resend domain verification

For everything else — all 39 pages, all schemas, all docs, all commits —
proceed and report.

═══════════════════════════════════════════
DEFINITION OF DONE
═══════════════════════════════════════════

SEO:
  ✓ 38 new pages built (TX HVAC reference already exists = 39 total)
  ✓ Unique, locally-specific content on every page
  ✓ sitemap.xml + robots.txt at repo root
  ✓ JSON-LD on every page per schema map above
  ✓ Internal linking graph complete
  ✓ 3 commit waves staged (not pushed)

AEO:
  ✓ llms.txt + llms-full.txt at repo root
  ✓ AI-friendly meta tags on every page
  ✓ Question-led H2s + answer-first paragraphs throughout
  ✓ Speakable schema on money pages + guides
  ✓ 4 comparison pages + 1 original-data report shipped

Docs and handoff:
  ✓ docs/strategy-validation.md
  ✓ docs/keyword-clusters.md (skill output version)
  ✓ docs/ai-visibility-baseline.md
  ✓ docs/off-site-submission-pack.md
  ✓ docs/asset-specs.md
  ✓ docs/gsc-setup.md
  ✓ docs/ai-visibility-tracker.md (empty tracker table pre-populated)
  ✓ templates/ (5 HTML templates)
  ✓ scripts/generate-pages.js + scripts/pages-config.json
  ✓ content-briefs/ (39 briefs, one per page)

Begin with Phase 2.
