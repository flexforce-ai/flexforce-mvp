# Claude Code execution prompt — full SEO + AEO program ship

Paste the prompt below into Claude Code from inside the `flexforce-mvp/` directory. It's designed to be executed end-to-end without involvement, only interrupting Jack when something genuinely requires his decision or his login.

This prompt ships **both** the classic SEO program (Google + Bing rank) and the AEO program (citation in ChatGPT, Claude, Perplexity, Gemini, Grok answers) in one pass.

---

## The prompt

```
You are the SEO + AEO program manager for FlexForce.ai. Read these four files
first and follow their conventions absolutely — they are the source of truth:

  1. CLAUDE.md            — project context, brand rules, voice, current state
  2. docs/strategy.html   — full business strategy doc (open in browser preview)
  3. docs/seo-strategy.md — classic SEO program plan
  4. docs/aeo-strategy.md — AEO / AI search optimization plan

Then execute the full SEO + AEO program end-to-end across five states and four
trades, plus comparison pages, the original-data report, llms.txt, and the
off-site submission asset pack. Do not ask me to approve each step — proceed
autonomously. Only interrupt me for the four reasons listed under "When to
involve Jack" below.

═══════════════════════════════════════════════════════════════════════════════
SCOPE
═══════════════════════════════════════════════════════════════════════════════

States (5):  Texas (TX), New Jersey (NJ), Utah (UT), Connecticut (CT), New York (NY)
Trades (4):  HVAC, plumbing, electrical, roofing

Pages to ship:
  • 20 money pages       — 4 trades × 5 states, at /hire/[trade]/[state]/
  • 5 state hubs         — /states/[state]/
  • 4 trade hubs         — /trades/[trade]/
  • 5 evergreen guides   — /guides/[topic]/
  • 4 comparison pages   — /compare/[vs-target]/
  • 1 original-data report — /reports/2026-skilled-trades-hiring-report/
                                                              ─────────
                                                              39 pages

Plus: sitemap.xml, robots.txt (AI-crawler-aware), llms.txt, llms-full.txt,
JSON-LD on every page, internal linking graph, off-site submission asset pack.

═══════════════════════════════════════════════════════════════════════════════
PHASE 1 — Update the strategy doc
═══════════════════════════════════════════════════════════════════════════════

Open docs/seo-strategy.md. Update it to reflect the five-state scope with real
local data for each state. Use the data below as canonical — verify via web
search and correct if anything is wrong:

  TX  | TDLR (Texas Dept of Licensing & Regulation) | Houston, Dallas, Austin
      | Wage $32–45/hr | ACCA of Texas, PHCC of Texas, IEC Texas
      | Pain: data-center build-out, summer AC crisis, foreign-trained workforce
  NJ  | NJ Division of Consumer Affairs + NJBPU     | Newark, Jersey City, Paterson
      | Wage $38–52/hr | ACCA NJ, PHCC NJ, NJ Electrical Contractors Assn
      | Pain: aging housing stock, lead-pipe replacement, NYC commuter wage pressure
  UT  | Utah DOPL (Div. of Occupational & Professional Licensing) | SLC, Provo, Ogden
      | Wage $30–42/hr | Utah HVAC Contractors, UPHCA, IEC Utah
      | Pain: fast population growth, new construction boom, Silicon Slopes demand
  CT  | CT Dept of Consumer Protection              | Bridgeport, Hartford, New Haven
      | Wage $36–50/hr | CT Heating & Cooling Contractors, CT PHCC, CT IEC
      | Pain: oil-to-heat-pump conversions, aging tech workforce, dense suburbs
  NY  | NYS Dept of State (city/county varies)      | NYC, Buffalo, Rochester
      | Wage $40–58/hr | ACCA NY, PHCC NY, NECA NY
      | Pain: NYC Local Law 97 building emissions retrofits, union vs non-union split

Add a section "Staggered publication plan" — to avoid Google's helpful-content
sandbox, push commits in three waves:

  Wave 1 (day 1)  — TX + NJ money pages, all hubs, all guides, all comparisons,
                    the original-data report, llms.txt, robots.txt   (~30 pages)
  Wave 2 (day 4)  — UT money pages + UT state hub                     (5 pages)
  Wave 3 (day 8)  — CT + NY money pages + state hubs                  (10 pages)

Each wave is its own commit + push. Vercel deploys them as separate releases
so Google sees gradual growth, not a content dump.

Commit: "update seo-strategy: 5-state plan with staggered publication"

═══════════════════════════════════════════════════════════════════════════════
PHASE 2 — Validate strategy + cluster keywords
═══════════════════════════════════════════════════════════════════════════════

Run skill: searchfit-seo:content-strategy
  Input: the updated docs/seo-strategy.md + docs/aeo-strategy.md + CLAUDE.md
  Save the output to docs/strategy-validation.md

Run skill: searchfit-seo:keyword-cluster
  Input: the seed keyword list from seo-strategy.md, expanded with UT, CT, NY
         variants (e.g., "hire HVAC technicians Salt Lake City", "plumber
         recruiting Hartford", "electrician hiring NYC")
  Save output to docs/keyword-clusters.md

If the cluster output suggests page-keyword mappings that contradict the
strategy doc, prefer the cluster output and update seo-strategy.md to match.

** This is the ONE checkpoint where you stop and ask Jack. **
Post the proposed keyword cluster output to chat, ask for a yes/no approval,
then proceed.

═══════════════════════════════════════════════════════════════════════════════
PHASE 3 — Build templates (SEO + AEO structured)
═══════════════════════════════════════════════════════════════════════════════

Build five reusable HTML templates under templates/ :

  templates/hire-money-page.html  — /hire/[trade]/[state]/ pages
  templates/state-hub.html        — /states/[state]/
  templates/trade-hub.html        — /trades/[trade]/
  templates/guide.html            — /guides/[topic]/
  templates/comparison.html       — /compare/[vs-target]/

Use tokenized variables: {{TRADE_NAME}}, {{TRADE_SLUG}}, {{STATE_NAME}},
{{STATE_SLUG}}, {{STATE_ABBR}}, {{LICENSE_BOARD}}, {{LICENSE_BOARD_URL}},
{{WAGE_LOW}}, {{WAGE_HIGH}}, {{CITY_1}}, {{CITY_2}}, {{CITY_3}},
{{ASSOCIATION_1}}, {{ASSOCIATION_2}}, {{ASSOCIATION_3}}, {{PRIMARY_KEYWORD}},
{{META_DESCRIPTION}}, {{H1}}, {{TRADE_PAIN_SECTION}}, {{STATE_SPECIFIC_BLOCK}},
{{FAQ_BLOCK}}, {{JSON_LD_BLOCK}}, {{COMPARE_TARGET}}, {{COMPARE_VERDICT}}.

** AEO structural rules — apply to every template **

  • H2s phrased as QUESTIONS, not topics:
       YES → "How do I hire HVAC technicians fast in Texas?"
       NO  → "Hiring HVAC technicians in Texas"

  • First sentence after each H2 is the direct ANSWER, no setup, no
    "In today's competitive market…"

  • Short paragraphs (2–3 sentences max). LLMs grab whole paragraphs.

  • At least one comparison/data TABLE per money page (wages, license fees,
    timeline, cost). LLMs cite tables more often than prose.

  • Specific NUMBERS, DATES, NAMES throughout. "27% faster hires" beats
    "much faster hires." "TDLR" beats "the state board."

  • Don't bury the answer. If the page title promises "how to hire HVAC
    techs fast," the literal hiring steps appear in the first 200 words.

** AEO meta tags — every template must include these in <head> **

  <meta name="description" content="[answer-first summary, 155 chars]">
  <link rel="canonical" href="https://flexforce.ai/[path]">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="GPTBot" content="allow">
  <meta name="ChatGPT-User" content="allow">
  <meta name="ClaudeBot" content="allow">
  <meta name="anthropic-ai" content="allow">
  <meta name="PerplexityBot" content="allow">
  <meta name="Google-Extended" content="allow">
  <meta property="og:type" content="article">
  <meta property="article:author" content="Jack">

** Brand system — exact match required, no improvisation **

  • Forest green #1d4d3d primary, lime #bef264 accent, cream #f6f3ee background
  • Inter typography, weights 400 + 500 only
  • Lowercase confident voice
  • All copy first-person from Jack
  • CTA links to /#signup
  • Logo mark: inline SVG (path documented in CLAUDE.md gotchas)

Build a Node script at scripts/generate-pages.js that reads a JSON of page
configs and emits HTML files by token substitution into the templates. This
will be used in phase 5.

Run vercel dev locally and verify ONE sample page renders correctly
(e.g., /hire/hvac/texas/) before mass-generating the other 38. If it doesn't
render, fix the template, don't proceed.

═══════════════════════════════════════════════════════════════════════════════
PHASE 4 — Generate topic plans for all 39 pages
═══════════════════════════════════════════════════════════════════════════════

For every page, run:

  Skill: searchfit-seo:create-topic
  Inputs: trade, state, primary keyword (from cluster output), local data block,
          AEO structural rules from aeo-strategy.md
  Output: content brief saved to content-briefs/[page-slug].md

Pages to brief:
  • 20 money pages         (4 trades × 5 states)
  • 5 state hubs           (TX, NJ, UT, CT, NY)
  • 4 trade hubs           (HVAC, plumbing, electrical, roofing)
  • 5 evergreen guides:
      - how-to-hire-hvac-technician-fast
      - spanish-speaking-trades-recruiting
      - why-trades-applicants-ghost
      - 2026-skilled-trades-labor-shortage-report
      - cost-to-hire-a-licensed-tradesperson
  • 4 comparison pages:
      - flexforce-vs-indeed
      - flexforce-vs-servicetitan-recruiting
      - flexforce-vs-workrise
      - flexforce-vs-in-house-recruiter
  • 1 original-data report:
      - 2026-skilled-trades-hiring-report

Total briefs: 39. Show me a summary list at the end — page slug + primary
keyword + brief headline — so I can spot-check before content gen.

═══════════════════════════════════════════════════════════════════════════════
PHASE 5 — Generate content (SEO + AEO structured)
═══════════════════════════════════════════════════════════════════════════════

For each of the 39 briefs, run:

  Skill: searchfit-seo:create-content
  Input: the topic plan + the appropriate template + brand voice from CLAUDE.md
         + AEO structural rules from aeo-strategy.md
  Output: complete HTML page

Place output at canonical URLs:
  /hire/[trade-slug]/[state-slug]/index.html
  /states/[state-slug]/index.html
  /trades/[trade-slug]/index.html
  /guides/[topic-slug]/index.html
  /compare/[vs-target]/index.html
  /reports/2026-skilled-trades-hiring-report/index.html

After every batch of 5 pages, run searchfit-seo:on-page-seo to audit. Fix
issues before continuing.

CRITICAL — three rules that get a page rejected:
  1. Content is substantively similar to another page (geo-page duplication)
  2. H2s are statements instead of questions
  3. The page is missing 3+ of the 13 required elements from seo-strategy.md

For the original-data report specifically:
  • Cite real public sources (JLL, JobsPikr, BLS, Indeed Hiring Lab, ABC)
  • Include 3-5 proprietary insights (synthesize from public data, brand them
    as FlexForce analysis)
  • Make the report a citable artifact — clean URLs, downloadable PDF version,
    "How to cite this report" footnote

═══════════════════════════════════════════════════════════════════════════════
PHASE 6 — Structured data (SEO + AEO schema coverage)
═══════════════════════════════════════════════════════════════════════════════

For each page, run:

  Skill: searchfit-seo:generate-schema

Apply this schema map (more aggressive than baseline SEO):

  • Money pages:   LocalBusiness + Service + FAQPage + Speakable
  • Guides:        Article + FAQPage + HowTo (where applicable) + Speakable
  • Hubs:          ItemList + Service
  • Comparisons:   Article + ComparisonTable + FAQPage
  • Report:        Article + Dataset + Speakable
  • Home page:     Organization + WebSite + SoftwareApplication + Person (Jack)

Inject the JSON-LD into each HTML file directly before </head>.

Speakable schema is critical for voice-assistant pickup (Alexa, Google Assistant).
Mark the H1 + first paragraph after each Q-led H2 as speakable.

═══════════════════════════════════════════════════════════════════════════════
PHASE 7 — Sitemap, robots.txt, llms.txt, llms-full.txt
═══════════════════════════════════════════════════════════════════════════════

Create sitemap.xml at the repo root listing every URL with:
  <loc>          full URL on https://flexforce.ai
  <lastmod>      today's ISO date
  <changefreq>   weekly for hubs + guides, monthly for money pages, never for report
  <priority>     1.0 home, 0.9 hubs + report, 0.8 money pages, 0.7 comparisons,
                 0.6 guides

Create robots.txt at the repo root — explicit AI-crawler allow:

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

Create llms.txt at the repo root (Jeremy Howard standard — index for AI crawlers):

  Structure:
    # FlexForce.ai
    > [one-line product description]
    ## Key facts (pricing, trades, states, founder, free trial)
    ## Documentation (strategy doc, how it works, pricing)
    ## Trade hubs (links + 1-line descriptions)
    ## State hubs (links + 1-line descriptions)
    ## Guides (links + 1-line descriptions)
    ## Comparisons (links + 1-line descriptions)
    ## Reports (link to 2026 report)

Create llms-full.txt at the repo root — concatenated full markdown content of
all key pages. Generated programmatically from the source HTML/MD of each
page. This is what AI crawlers ingest in one fetch.

═══════════════════════════════════════════════════════════════════════════════
PHASE 8 — Internal linking pass
═══════════════════════════════════════════════════════════════════════════════

After all pages exist, do an internal linking sweep:

  • Each money page → trade hub + state hub + 2 related guides + 1 comparison
  • Each guide → 2-3 related money pages + 1 comparison
  • Each comparison → 2 related money pages + the relevant trade hub
  • Each hub → its 4-5 child money pages
  • Home page → 4 trade hubs + the report (footer additions)
  • Report → 4 trade hubs + 2 money pages (citation-friendly internal links)

Use searchfit-seo:internal-linking if available, otherwise do this with a
Node script that parses the rendered HTML and inserts links contextually.

═══════════════════════════════════════════════════════════════════════════════
PHASE 9 — Staggered commits
═══════════════════════════════════════════════════════════════════════════════

Stage commits in three waves. Each is a separate commit + push. Vercel
auto-deploys on each push.

  Wave 1 (day 1) — "wave 1: ship TX + NJ + all hubs + guides + comparisons + report"
    Includes: 8 money pages (TX, NJ), 4 trade hubs, 2 state hubs, 5 guides,
              4 comparison pages, 1 original-data report,
              sitemap.xml, robots.txt, llms.txt, llms-full.txt,
              all JSON-LD schemas

  Wave 2 (day 4) — "wave 2: ship UT money pages + state hub"
    Includes: 4 UT money pages, UT state hub, sitemap.xml update,
              llms.txt update, llms-full.txt update

  Wave 3 (day 8) — "wave 3: ship CT + NY money pages + state hubs"
    Includes: 8 money pages (CT, NY), 2 state hubs, sitemap.xml update,
              llms.txt update, llms-full.txt update

After each wave, verify the deploy succeeded by checking flexforce.ai. If a
deploy fails, stop and ask Jack for the build log.

═══════════════════════════════════════════════════════════════════════════════
PHASE 10 — AI visibility analysis
═══════════════════════════════════════════════════════════════════════════════

After Wave 1 deploys, run:

  Skill: searchfit-seo:ai-visibility

  Inputs:
    • The 15 target test queries from aeo-strategy.md
    • The list of competitors mentioned in the strategy doc (VeroSkills, Workrise,
      Indeed, ServiceTitan recruiting, BlueCrew, Wonolo)
    • The shipped URLs

  Output: docs/ai-visibility-baseline.md
    • Per-query analysis: who's currently cited, what sources, why
    • FlexForce gap analysis: which directories/properties FlexForce is missing
      from that competitors are on
    • Prioritized action list — top 10 places to get listed

This becomes the source-of-truth report Jack uses to prioritize his off-site
submission work (next phase).

═══════════════════════════════════════════════════════════════════════════════
PHASE 11 — Prepare off-site submission asset pack for Jack
═══════════════════════════════════════════════════════════════════════════════

Claude Code cannot submit to these directories — they require Jack's login.
But you CAN prep every asset he'll need so each submission is a copy-paste job.

Create docs/off-site-submission-pack.md with these sections, one per property:

  CRUNCHBASE
    • Tagline (60 char)
    • Short description (150 char)
    • Long description (500 char)
    • Categories (Applicant Tracking, AI, Recruiting)
    • Founded date, founder (Jack), HQ
    • Funding stage (Bootstrapped)
    • Direct submission URL

  PRODUCT HUNT
    • Tagline
    • Description (250 char)
    • First comment template (Jack's launch message)
    • Maker comment template
    • 3 gallery image specs (homepage, apply page, dashboard mock)
    • Topic tags
    • Submission URL + launch day prep checklist

  G2
    • Product name
    • Vendor name
    • Categories (3 most relevant)
    • Description (1000 char)
    • Feature list
    • Pricing tier descriptions

  CAPTERRA
    • Same as G2 but Capterra-formatted

  GETAPP
    • Same as G2 but GetApp-formatted

  ALTERNATIVETO
    • Submit-as-alternative-to: Indeed, BlueCrew, VeroSkills, Workrise
    • Description (300 char)
    • Tags

  LINKEDIN COMPANY PAGE
    • About section copy
    • Tagline
    • Industry
    • Specialties tags (10)
    • Cover image spec

  HACKER NEWS — Show HN post
    • Title (80 char max, no marketing speak)
    • Body (200 word max)
    • First-comment template
    • Best day to post (Tuesday or Wednesday)
    • What to do for the first 48 hours of engagement

  REDDIT ORGANIC ENGAGEMENT
    • List 20 recent threads in r/HVAC, r/electricians, r/Plumbing,
      r/Contractors where a genuine FlexForce mention would add value
    • For each: link, what to say, value-first comment template
    • Reddit account warming tips (don't post as a 1-day-old account)

For each property, also include the SCREENSHOTS or IMAGE ASSETS that need to
exist. Save those specs to docs/asset-specs.md so Jack (or a designer) knows
exactly what to make.

═══════════════════════════════════════════════════════════════════════════════
PHASE 12 — Google Search Console + Bing Webmaster Tools setup (handoff)
═══════════════════════════════════════════════════════════════════════════════

Write docs/gsc-setup.md with these exact steps for Jack:

  a. Go to https://search.google.com/search-console
  b. Click "Add property" → choose Domain property for flexforce.ai
  c. Pick TXT record verification → copy the TXT value Google provides
  d. Add the TXT to flexforce.ai DNS at the registrar
  e. Wait 5-10 min, click Verify
  f. Once verified: left nav → Sitemaps → submit https://flexforce.ai/sitemap.xml
  g. URL Inspection tool → manually request indexing for these eight priority
     pages:
       • /
       • /trades/hvac/
       • /trades/plumbing/
       • /hire/hvac-technicians/texas/
       • /hire/hvac-technicians/new-jersey/
       • /states/texas/
       • /reports/2026-skilled-trades-hiring-report/
       • /compare/flexforce-vs-indeed/
  h. Bing Webmaster Tools (https://www.bing.com/webmasters):
       • Sign in with same Google account
       • Click "Import from Google Search Console" → pick flexforce.ai
       • One click and the sitemap submission carries over

Add a section "After indexing — what to expect" with:
  • Pages indexed within 2-7 days of submission
  • First Search Console impressions: 1-2 weeks
  • First ranking positions: 4-8 weeks
  • Weekly tasks: check Search Console for impressions per page, manually run
    the 15 AEO test queries from aeo-strategy.md across 5 engines, log results
    in docs/ai-visibility-tracker.md

═══════════════════════════════════════════════════════════════════════════════
WHEN TO INVOLVE JACK
═══════════════════════════════════════════════════════════════════════════════

Interrupt me only for these:

  1. After phase 2: post the keyword cluster output, ask for yes/no approval
     before generating 39 pages. This is the single approval gate.

  2. If you cannot find local data for a state after 3 web-search attempts.
     Tell me what's missing, propose your best guess, ask for confirmation.

  3. If a Vercel deploy fails: stop, tell me, share the build log.

  4. When everything is built: hand off (a) the GSC setup checklist, (b) the
     off-site submission asset pack, (c) the AI visibility baseline report.

For literally everything else — including all 39 individual content briefs,
content generation, schema generation, llms.txt, template edits, internal
linking, asset-pack copy variants — do NOT ask me. Proceed and report.

═══════════════════════════════════════════════════════════════════════════════
DEFINITION OF DONE
═══════════════════════════════════════════════════════════════════════════════

  SEO deliverables:
    ✓ 39 pages live on flexforce.ai with unique locally-specific content
    ✓ sitemap.xml + robots.txt at repo root (AI-crawler-aware robots)
    ✓ JSON-LD schemas on every page (SEO + AEO coverage)
    ✓ Internal linking graph complete
    ✓ Staggered into 3 commit waves, all pushed and deployed

  AEO deliverables:
    ✓ llms.txt + llms-full.txt at repo root
    ✓ AI-friendly meta tags on every page (GPTBot, ClaudeBot, etc. explicitly allowed)
    ✓ Question-led H2s + answer-first paragraphs throughout
    ✓ Speakable schema on money pages + guides
    ✓ 4 comparison pages + 1 original-data report shipped
    ✓ AI visibility baseline analysis saved to docs/ai-visibility-baseline.md
    ✓ Off-site submission asset pack saved to docs/off-site-submission-pack.md

  Handoff:
    ✓ docs/gsc-setup.md exists with copy-paste-able manual steps
    ✓ docs/off-site-submission-pack.md exists with property-by-property assets
    ✓ docs/asset-specs.md exists for any visual assets to create
    ✓ Final summary in chat: pages built, words generated, schemas added,
      pending Jack actions (GSC setup, off-site submissions, real Turnstile
      key swap, Resend domain verification if not done)

Begin.
```

---

## What's new vs. the SEO-only version

This prompt adds:

- **4 comparison pages** (FlexForce vs Indeed / ServiceTitan / Workrise / in-house recruiter) — these rank for "X vs Y" SEO queries AND get pulled into AI answers for comparison questions
- **1 original-data report** ("2026 Skilled Trades Hiring Report") — citable artifact that LLMs reference for 2+ years
- **llms.txt + llms-full.txt** — emerging AI-crawler standard, like robots.txt for AI
- **AI-crawler-explicit robots.txt** — GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended all explicitly allowed
- **AI-friendly meta tags on every page** — explicit allow signals to AI crawlers
- **Question-led H2s and answer-first paragraphs** as a structural requirement, not a style choice — LLMs cite question-formatted content disproportionately
- **Expanded schema map** — adds HowTo, Speakable, SoftwareApplication, Person (for Jack), Dataset (for the report)
- **Phase 10: AI visibility baseline analysis** using the `searchfit-seo:ai-visibility` skill — gives Jack a per-query gap report
- **Phase 11: Off-site submission asset pack** — Claude Code preps everything Jack needs to submit to Crunchbase, ProductHunt, G2, Capterra, AlternativeTo, HN, LinkedIn, and Reddit. Pure copy-paste for him.

**Total pages: 39 instead of 34. Total deliverables: SEO + AEO + handoff packs.**

The single human approval gate is still just the keyword cluster check after phase 2. After that, Claude Code runs unattended for ~4-6 hours and produces everything.

## Notes for Jack

- The off-site submissions (phase 11 deliverables) are the **highest-leverage AEO work** — Crunchbase + ProductHunt + Reddit organic engagement do more for getting cited in AI answers than any on-site optimization. Plan to spend a Saturday on those after Claude Code finishes the build.
- The AI visibility baseline (`docs/ai-visibility-baseline.md`) tells you exactly which competitors are cited where. That report becomes the prioritization map for off-site submissions — go where competitors are surfacing.
- The 15 AEO test queries should be run **manually, weekly**, across all 5 engines. Set a recurring calendar block for 30 min on Friday mornings. Log results in `docs/ai-visibility-tracker.md` (the prompt asks Claude Code to set up the file template).
