# FlexForce.ai — SEO Strategy

> Source of truth for the SEO program. Maintained by Jack. The next Claude (in Claude Code) executes against this plan using the `searchfit-seo` skill suite.

---

## Strategic decision: start narrow, then expand

**Phase 1 (weeks 1–8): TX + NJ.** Two states, four trades. Depth over breadth.

**Phase 2 (weeks 4–8): add UT.** Fast-growing mountain west market, lower competition.

**Phase 3 (weeks 8–12): add CT + NY.** Tri-state complete + Texas anchor established.

**Phase 4 (month 6+): programmatic city-level pages** for the top 50 metros.

**Why narrow first:**
- Google's 2024–2025 helpful-content + spam updates sandbox sites that ship hundreds of thin programmatic pages on launch
- Solo-founder bandwidth: 39 deep pages > 200 thin pages
- Local search depth (state license boards, real wage data, named associations) requires real research per state
- 60-day window to rank in lower-competition markets (UT, CT) before NY competes for authority

---

## Target geos and trades — five-state program

**All five states:** Texas (TX), New Jersey (NJ), Utah (UT), Connecticut (CT), New York (NY)
**All four trades:** HVAC, plumbing, electrical, roofing

### State data blocks (canonical — use these in all page content)

| State | License Board | Top 3 Cities | Wage Band (tech) | Trade Associations | Key Pain Points |
|---|---|---|---|---|---|
| **Texas** | TDLR (Texas Dept of Licensing & Regulation) | Houston, Dallas, Austin | $32–45/hr | ACCA of Texas, PHCC of Texas, IEC Texas | Data-center build-out wave, summer AC crisis demand spikes, large foreign-trained workforce needing rapid license verification |
| **New Jersey** | NJ Division of Consumer Affairs (HVAC via NJBPU) | Newark, Jersey City, Paterson | $38–52/hr | ACCA NJ, PHCC NJ, NJ Electrical Contractors Association | Aging housing stock retrofit demand, lead-pipe replacement mandate, NYC commuter wage pressure pushing tradesperson costs up |
| **Utah** | Utah DOPL (Division of Occupational & Professional Licensing) | Salt Lake City, Provo, Ogden | $30–42/hr | Utah HVAC Contractors Association, UPHCA, IEC Utah | Nation's fastest population growth rate (23% since 2010), Silicon Slopes tech construction boom, new residential development overwhelming local labor supply |
| **Connecticut** | CT Dept of Consumer Protection | Bridgeport, Hartford, New Haven | $36–50/hr | CT Heating & Cooling Contractors Association, CT PHCC, CT IEC | Oil-to-heat-pump conversion surge (CT state incentive program), aging tech workforce retiring faster than apprentices enter, dense suburb demand with commuter competition from NYC wages |
| **New York** | NYS Dept of State (licensing varies city/county) | New York City, Buffalo, Rochester | $40–58/hr | ACCA NY, PHCC NY, NECA NY (New York Chapter) | NYC Local Law 97 building emissions retrofit wave (hundreds of thousands of buildings requiring HVAC and electrical upgrades by 2030), union vs non-union split creating credential complexity, tight urban labor pools |

---

## Page architecture — 39 pages total

```
flexforce.ai/
├── /                                       Existing landing (broad)
│
├── /trades/                                Trade hubs — content + state links
│   ├── hvac/
│   ├── plumbing/
│   ├── electrical/
│   └── roofing/
│
├── /states/                                State hubs — content + trade links
│   ├── texas/
│   ├── new-jersey/
│   ├── utah/
│   ├── connecticut/
│   └── new-york/
│
├── /hire/                                  Money pages — trade × state combos
│   ├── hvac-technicians/texas/
│   ├── hvac-technicians/new-jersey/
│   ├── hvac-technicians/utah/
│   ├── hvac-technicians/connecticut/
│   ├── hvac-technicians/new-york/
│   ├── plumbers/texas/
│   ├── plumbers/new-jersey/
│   ├── plumbers/utah/
│   ├── plumbers/connecticut/
│   ├── plumbers/new-york/
│   ├── electricians/texas/
│   ├── electricians/new-jersey/
│   ├── electricians/utah/
│   ├── electricians/connecticut/
│   ├── electricians/new-york/
│   ├── roofers/texas/
│   ├── roofers/new-jersey/
│   ├── roofers/utah/
│   ├── roofers/connecticut/
│   └── roofers/new-york/
│
├── /guides/                                Evergreen authority content
│   ├── how-to-hire-hvac-technician-fast/
│   ├── spanish-speaking-trades-recruiting/
│   ├── why-trades-applicants-ghost/
│   ├── 2026-skilled-trades-labor-shortage-report/
│   └── cost-to-hire-a-licensed-tradesperson/
│
├── /compare/                               Comparison pages (SEO + AEO)
│   ├── flexforce-vs-indeed/
│   ├── flexforce-vs-servicetitan-recruiting/
│   ├── flexforce-vs-workrise/
│   └── flexforce-vs-in-house-recruiter/
│
└── /reports/                               Original citable data
    └── 2026-skilled-trades-hiring-report/
```

**Page counts:**
- 20 money pages (4 trades × 5 states)
- 5 state hubs
- 4 trade hubs
- 5 evergreen guides
- 4 comparison pages
- 1 original-data report
- **Total new: 39 pages**

URL conventions:
- Trade names plural in URL (`/trades/hvac` but `/hire/hvac-technicians/...`)
- State names lowercase with hyphens (`/states/new-jersey`, not `/states/NJ`)
- Trailing slash on all directories (Vercel `cleanUrls: true` handles canonical)

---

## Keyword strategy — two layers

### Layer 1: Bottom-funnel intent (the money keywords)

Low search volume per keyword. High conversion. Each money page targets one primary + 3–5 long-tail variants.

| Pattern | TX Example | NJ Example | UT Example | CT Example | NY Example |
|---|---|---|---|---|---|
| hire [trade] in [state] | "hire HVAC technicians Texas" | "hire plumbers New Jersey" | "hire electricians Utah" | "hire HVAC technicians Connecticut" | "hire electricians New York" |
| [trade] hiring software [state] | "plumber hiring software Texas" | "electrician hiring software NJ" | "HVAC hiring software Utah" | "plumber hiring software CT" | "roofing hiring software NYC" |
| find [trade] candidates fast [city] | "find HVAC techs fast Houston" | "find plumbers fast Newark" | "find electricians Salt Lake City" | "find HVAC techs Bridgeport" | "find electricians NYC fast" |
| [trade] applicant tracking [state] | "electrician ATS Texas" | "plumber ATS New Jersey" | "HVAC ATS Utah" | "electrician ATS Connecticut" | "plumber applicant tracking NYC" |
| [trade] recruiting agency [city] | "HVAC recruiting agency Dallas" | "plumber recruiting agency Jersey City" | "electrician recruiting SLC" | "HVAC recruiter Hartford" | "electrician recruiter Brooklyn" |

### Layer 2: Mid-funnel education (the authority keywords)

Higher search volume. Lower direct conversion. Built into `/guides/` pages.

| Pattern | Example |
|---|---|
| [trade] labor shortage 2026 | "skilled trades labor shortage 2026" |
| why [trade] applicants ghost | "why HVAC applicants ghost" |
| cost to hire a [trade] | "cost to hire HVAC technician" |
| [state] [trade] license verification | "TDLR HVAC license verification" |
| [trade] hiring software comparison | "FlexForce vs Indeed HVAC hiring" |

---

## Seed keyword list — expanded five-state

Paste into `searchfit-seo:keyword-cluster` to expand and map to pages.

```
# Texas
how to hire HVAC technicians in Texas
hire plumbers fast Texas
electrician hiring software Texas
find roofing techs Houston
HVAC recruiting agency Dallas
plumber recruiting agency Houston
electrician staffing service Texas
data center HVAC hiring Texas
2026 HVAC apprenticeship Texas
TDLR HVAC license verification
TDLR electrician license check
Spanish speaking HVAC techs Texas
bilingual plumber hiring Texas
roofer hiring Austin Texas
electrician applicant tracking Texas

# New Jersey
how to hire HVAC technicians New Jersey
hire plumbers fast NJ
electrician applicant tracking system NJ
roofing crew hiring Newark
HVAC recruiting agency Newark
plumber recruiting agency Jersey City
NJ HIC license check
licensed plumber shortage New Jersey
NJ electrical contractor license verification
2026 plumbing apprenticeship NJ
lead pipe replacement plumber New Jersey
HVAC tech hiring Paterson NJ
roofer staffing New Jersey
bilingual electrician hiring Newark

# Utah
how to hire HVAC technicians Utah
hire electricians Salt Lake City
hire plumbers Provo Utah
roofing crew hiring Ogden Utah
HVAC technician shortage Utah
Utah DOPL license verification
electrician hiring software Utah
plumber recruiting Salt Lake City
Silicon Slopes HVAC hiring Utah
new construction HVAC Utah
population growth trades hiring Utah
Utah plumbing contractor license check
hire roofers fast Utah
bilingual trades hiring Salt Lake City

# Connecticut
how to hire HVAC technicians Connecticut
hire electricians Hartford CT
plumber hiring Bridgeport Connecticut
HVAC tech shortage Connecticut
CT heat pump installation hiring
Connecticut Department of Consumer Protection license verification
roofing crew hiring New Haven
oil to heat pump contractor hiring CT
electrician staffing Connecticut
plumber recruiting Hartford CT
HVAC apprenticeship Connecticut
aging workforce HVAC Connecticut
hire roofers Connecticut fast

# New York
how to hire HVAC technicians New York
hire electricians NYC
plumber hiring Brooklyn New York
Local Law 97 HVAC contractor hiring
HVAC technician NYC shortage
NYS license verification electrician
roofing crew hiring Buffalo NY
Rochester NY plumber recruiting
electrical contractor hiring New York City
union vs non-union electrician hiring NYC
hire HVAC techs fast Queens NY
plumber staffing New York City
roofer hiring upstate New York

# Mid-funnel / guides
HVAC technician ghosting applicants
why trades applicants don't show up
skilled trades labor shortage 2026
cost to hire HVAC technician
how long does it take to hire a plumber
how to retain skilled trades workers
Spanish speaking trades recruiting
JLL skilled trades 2030 forecast
home service hiring 2026
FlexForce vs Indeed trades hiring
FlexForce vs ServiceTitan recruiting
FlexForce vs Workrise
AI hiring software vs in-house recruiter trades
```

---

## Staggered publication plan

To avoid Google's helpful-content sandbox, commits are staged in three waves.
Each wave is its own commit + push — Vercel deploys them as separate releases
so Google sees gradual organic content growth, not a single dump.

### Wave 1 — Day 1

**Commit message:** `wave 1: ship TX + NJ + all hubs + guides + comparisons + report`

Pages included:
- 8 money pages: TX (hvac, plumbing, electrical, roofing) + NJ (hvac, plumbing, electrical, roofing)
- 4 trade hubs: /trades/hvac/, /trades/plumbing/, /trades/electrical/, /trades/roofing/
- 2 state hubs: /states/texas/, /states/new-jersey/
- 5 guides: all evergreen guides
- 4 comparison pages: all four /compare/ pages
- 1 original-data report: /reports/2026-skilled-trades-hiring-report/
- Infrastructure: sitemap.xml (all 39 URLs), robots.txt, llms.txt, llms-full.txt
- All JSON-LD schemas on every page

**Count: ~24 pages + infrastructure files**

### Wave 2 — Day 4

**Commit message:** `wave 2: ship UT money pages + state hub`

Pages included:
- 4 money pages: UT (hvac, plumbing, electrical, roofing)
- 1 state hub: /states/utah/
- Updated sitemap.xml, llms.txt, llms-full.txt

**Count: 5 pages**

### Wave 3 — Day 8

**Commit message:** `wave 3: ship CT + NY money pages + state hubs`

Pages included:
- 8 money pages: CT (hvac, plumbing, electrical, roofing) + NY (hvac, plumbing, electrical, roofing)
- 2 state hubs: /states/connecticut/, /states/new-york/
- Updated sitemap.xml, llms.txt, llms-full.txt

**Count: 10 pages**

---

## Execution workflow in Claude Code

Use the `searchfit-seo` skill suite. Run in this order — each skill builds on the previous output.

### 1. Confirm the strategy
```
Use searchfit-seo:content-strategy

Input: this seo-strategy.md doc + the brand context in CLAUDE.md
Output: confirmed editorial plan, priorities, gap analysis
```

### 2. Cluster the seed keywords
```
Use searchfit-seo:keyword-cluster

Input: the seed keyword list above
Output: keyword clusters mapped to specific pages
```

### 3. Build the topic plan for each page (39 pages)
For each of the 39 pages:
```
Use searchfit-seo:create-topic

Inputs:
  - Trade: HVAC | plumbing | electrical | roofing
  - State: Texas | New Jersey | Utah | Connecticut | New York
  - Primary keyword (from clustering output)
  - Local data block (license board, cities, wage band, named associations, pain points)

Output: full topic plan — angle, search intent, primary + secondary keywords,
        competitive positioning, suggested H1, meta description, page outline
```

### 4. Write the content for each page
For each money page, hub, guide, comparison, and report:
```
Use searchfit-seo:create-content

Input: the topic plan from step 3 + the FlexForce brand voice from CLAUDE.md
Output: a complete HTML page with:
  - SEO-optimized title + meta description
  - Proper H1/H2/H3 hierarchy (H2s as questions)
  - Body content with primary keyword in first 100 words
  - Internal links to other pages (trade hub, state hub, related guides)
  - CTA pointing at the signup form (#signup anchor on home)
  - On-brand Inter typography, forest green + lime palette
```

### 5. Audit each page for on-page SEO
```
Use searchfit-seo:on-page-seo

Input: each generated HTML file
Output: report of missing or weak elements (meta, headings, images, alt text,
        internal links, keyword density)
```

### 6. Add structured data (JSON-LD)
```
Use searchfit-seo:generate-schema

For each page type:
  - Money pages: LocalBusiness + Service + FAQPage + Speakable
  - Guides: Article + FAQPage + HowTo + Speakable
  - State hubs: ItemList + Service
  - Trade hubs: ItemList + Service
  - Comparisons: Article + FAQPage
  - Report: Article + Dataset + Speakable
  - Home page: Organization + WebSite + SoftwareApplication + Person (Jack)

Output: ready-to-paste JSON-LD scripts to inject before </head>
```

### 7. Build the page template once, replicate for variations
The 20 money pages share 85% of their structure. Build five reusable HTML templates
with tokens like `{{TRADE_NAME}}`, `{{STATE_NAME}}`, `{{CITY_1}}`, `{{LICENSE_BOARD}}`,
`{{WAGE_LOW}}`, `{{WAGE_HIGH}}`, then use a Node script at `scripts/generate-pages.js`
to emit all 20 HTML files into `/hire/[trade]/[state]/index.html`.

---

## Per-page content requirements (the things that make each page rank)

Every `/hire/[trade]/[state]` money page must contain:

1. **H1** with primary keyword exactly: e.g., "How to Hire HVAC Technicians in Texas — Fast."
2. **Local hook in first 100 words** — name a city, a state license board, a real local pain point
3. **Wage band table** — what techs in that trade/state actually earn (cite BLS, JobsPikr, Indeed)
4. **License verification section** — what the state board is called, how to check a license, link out to the official portal
5. **3 named local trade associations** with links
6. **3 city callouts** — biggest metros in the state with one-sentence local context each
7. **Pain section** specific to that trade in that state (use the canonical pain data above)
8. **Bilingual recruiting angle** where applicable (TX, NJ, NY especially)
9. **Comparison row** — "FlexForce vs hiring an in-house recruiter vs using Indeed alone"
10. **CTA** to start the pilot — branded button leading to `/#signup`
11. **3–5 FAQ items** specific to that geo + trade (H2-phrased as questions)
12. **Internal links** — to the trade hub, the state hub, and 2 related guides
13. **JSON-LD schema** — LocalBusiness + Service + FAQPage + Speakable

If a page is missing 3+ of these 13 elements, do not ship it.

---

## Measurement — what to track

Set up **Google Search Console** day one. Submit the sitemap. Track:

- **Impressions per page** (early signal that Google sees the page)
- **Average position per page** (rank improvement over time)
- **CTR per page** (title + meta quality)
- **Clicks per page** (the actual traffic)
- **Indexed page count** (should grow weekly)

**Targets by week:**

| Week | Target |
|---|---|
| 2 | All wave 1 pages indexed in Search Console |
| 4 | Wave 2 pages indexed; first impressions on TX + NJ money pages |
| 6 | First page hits page 2 of SERP for a primary keyword |
| 8 | First page hits page 1 for at least 2 long-tail keywords; wave 3 pages indexed |
| 10 | First organic signup |
| 12 | 3+ pages on page 1 for long-tail keywords |

---

## Common SEO mistakes to avoid

1. **Don't ship 200 thin pages on launch.** Google sandboxes new sites with mass programmatic content. Build 39 deep pages in waves.
2. **Don't duplicate content across state pages.** Each state gets unique wage data, license board name, city callouts, pain section, and FAQ. Never copy-paste the body.
3. **Don't keyword-stuff.** Use the primary keyword in the H1, the first 100 words, one H2, and the meta. Then write naturally.
4. **Don't ignore internal linking.** Each money page links to its trade hub + state hub + 2 guides. Each guide links to relevant money pages. The graph compounds.
5. **Don't optimize for vanity keywords.** "Best AI hiring software" has high competition and low intent. "How to hire HVAC technicians in Houston" has lower volume but converts.
6. **Don't skip JSON-LD.** Schema gives you rich snippets in SERPs — meaningful CTR lift, especially for FAQ + LocalBusiness.
7. **Don't forget Bing.** Bing Webmaster Tools is free; ~10% of US searches happen there; contractors over 50 use Bing disproportionately.

---

## Phase 4 expansion checklist (month 6+, only if phase 1–3 is ranking)

- [ ] Add CA, FL, OH, PA, IL, GA state hubs + money pages (24 more money pages)
- [ ] Add `/blog/` if a content cadence makes sense by then
- [ ] Add city-level pages for top 10 metros (Houston, Dallas, Austin, NYC, Newark, SLC, etc.)
- [ ] Refresh all 39 pages with updated wage data + new local citations

---

## Companion: AEO (AI search optimization)

Classic SEO gets pages ranked in Google and Bing. **AEO** gets the brand cited inside AI-generated answers (ChatGPT, Claude, Perplexity, Gemini, Grok). The disciplines overlap on schema and content quality but diverge on tactics — AEO rewards off-site brand presence (Crunchbase, ProductHunt, Reddit), question-led answer-first content structure, `llms.txt`, and AI-crawler-aware meta tags.

The full AEO plan is at **`aeo-strategy.md`**. Both programs ship together in a single execution pass.

Highlights from the AEO plan that affect content built under this SEO plan:
- Every H2 must be phrased as a question, not a topic statement
- First sentence after each H2 is the direct answer (no marketing setup)
- At least one comparison/data table per money page
- `llms.txt` + `llms-full.txt` ship at the root with Wave 1
- Speakable schema on money pages + guides for voice-assistant pickup
- Original-data report (`/reports/2026-skilled-trades-hiring-report/`) anchors citability

## What lives outside this doc

- AEO / AI-search strategy — see `aeo-strategy.md`
- Brand voice, palette, typography — see `../CLAUDE.md`
- Project setup, deploy workflow, env vars — see `../README.md`
- Full business strategy (positioning, GigWise.ai expansion, 500K-list activation) — see `strategy.html`
- Posting copy for community channels — see `../nextdoor.md`
- Claude Code execution prompt that runs both SEO + AEO together — see `claude-code-prompt.md`

---

Maintained by Jack. Updated as the SEO program evolves.
