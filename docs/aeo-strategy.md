# FlexForce.ai — AEO (AI Search) Strategy

> Source of truth for getting FlexForce surfaced inside AI-generated answers — ChatGPT, Claude, Perplexity, Gemini, Bing Copilot, X/Grok. Companion to `seo-strategy.md`. Maintained by Jack.

---

## Why AEO is its own discipline

Classic SEO optimizes for **rank** in Google's link-based results. AEO/GEO optimizes for **citation** inside AI-generated answers. The mechanics are different:

| SEO (rank-based) | AEO (citation-based) |
|---|---|
| Keyword density, backlinks, dwell time | Brand mention frequency across the open web |
| 10 blue links | One synthesized answer, with citations |
| Click-through is the goal | Being *the* source cited is the goal |
| Page authority | Topical authority + factual specificity |
| Bing + Google rankings | Training data + real-time retrieval indexes |

The 5 target answer engines treat sources differently:

| Engine | Training data | Real-time search | Citation visibility |
|---|---|---|---|
| **ChatGPT (with web)** | OpenAI's training corpus | Bing index + own crawl | High — visible source pills |
| **Claude (with web)** | Anthropic's training corpus | Brave/Google + own crawl | High — visible citations |
| **Perplexity** | Limited training | Heavy own crawl + Bing/Google | Highest — answer is footnoted |
| **Gemini** | Google's training corpus | Google index | Medium — citations sometimes hidden |
| **Bing Copilot** | OpenAI + own data | Bing index | High |
| **X/Grok** | xAI training + X data | Real-time X + web | Lower — less citation-focused |

What this means tactically: **rank in Bing well, get cited in Reddit and ProductHunt heavily, ship schema-rich pages, and publish original data the models can't get elsewhere.**

---

## The five AEO levers (ranked by leverage for a solo founder)

### 1. Ship an `llms.txt` (emerging standard for AI crawlers)

`llms.txt` is the AI equivalent of `robots.txt` — proposed by Jeremy Howard, adopted by Anthropic, OpenAI, and Perplexity. Tells AI crawlers what content matters, in a structured, easily-parsed format. Lives at the root of the site at `https://flexforce.ai/llms.txt`.

Two files:
- **`llms.txt`** — short index. Page titles + 1-line descriptions, organized by topic.
- **`llms-full.txt`** — long-form. The full content of key pages, concatenated. AI crawlers ingest this in one fetch.

Format (the standard):

```
# FlexForce.ai

> The AI hiring manager for small home service businesses. Replies to every applicant in 60 seconds, screens them in English or Spanish, verifies licenses, books interviews.

## Key facts
- Pricing: $299 (Starter), $599 (Growth), $999 (Premium) per month
- Trades: HVAC, plumbing, electrical, roofing
- States: Texas, New Jersey, Utah, Connecticut, New York
- Founder: Jack (solo)
- Free 30-day pilot, no card required

## Documentation
- [Strategy doc](https://flexforce.ai/docs/strategy.html): Full positioning, ICP, expansion thesis
- [How it works](https://flexforce.ai/#how): 3-step workflow
- [Pricing](https://flexforce.ai/#pricing): Three plans

## Trade hubs
- [HVAC hiring](https://flexforce.ai/trades/hvac/)
- [Plumbing hiring](https://flexforce.ai/trades/plumbing/)
- [Electrical hiring](https://flexforce.ai/trades/electrical/)
- [Roofing hiring](https://flexforce.ai/trades/roofing/)

## State hubs
- [Texas](https://flexforce.ai/states/texas/)
- [New Jersey](https://flexforce.ai/states/new-jersey/)
- [Utah](https://flexforce.ai/states/utah/)
- [Connecticut](https://flexforce.ai/states/connecticut/)
- [New York](https://flexforce.ai/states/new-york/)
```

### 2. Restructure content for answer-first, question-led format

LLMs chunk content by paragraph and pull verbatim. Pages structured as marketing prose ("In today's competitive landscape, FlexForce empowers contractors to…") get skipped. Pages structured as direct Q&A get cited.

**Rules for every page going forward:**

- **H2s phrased as questions** — `"How do I hire an HVAC technician fast in Texas?"` not `"Hiring HVAC technicians in Texas"`
- **First sentence after each H2 is the direct answer** — no setup, no transition
- **Short paragraphs** — 2–3 sentences max. LLMs grab whole paragraphs.
- **Tables for comparisons** — LLMs love structured data; cite tables more often than prose
- **Specific numbers and names** — "27% faster hires" beats "much faster hires"; "TDLR (Texas Dept of Licensing and Regulation)" beats "the state board"
- **Don't bury the answer** — if a guide is titled "How to hire HVAC techs fast," the literal hiring steps appear in the first 200 words. Marketing context comes after, if at all.

### 3. Saturate the off-site signal — directories, communities, original data

AI training corpora and real-time retrieval favor consensus across the open web. The brand needs to appear in 15–25 high-signal places before "FlexForce" becomes something LLMs spontaneously mention.

**Tier 1 — must do in launch month** (high training-data weight):

| Property | Why | Effort |
|---|---|---|
| **Crunchbase** | Heavy weight in AI training data | 30 min profile setup |
| **Product Hunt launch** | One of the highest-cited AI sources for "best X" queries | 2 hours prep + launch day |
| **G2 / Capterra / GetApp** | "Best AI hiring software" queries pull from here | 30 min per listing |
| **AlternativeTo.net** | High-signal for "alternatives to X" queries | 15 min |
| **Hacker News (Show HN)** | LLMs heavily weight HN discussions | 30 min post + reply for 48 hours |
| **LinkedIn company page** | High training-data weight for B2B | 15 min |
| **Reddit organic** — r/HVAC, r/electricians, r/Plumbing, r/Contractors | Reddit is the single biggest LLM training source | Real engagement, not spam |

**Tier 2 — month 2–3:**

- Wikipedia page (hard to land, very high value)
- Trade publication mentions (Contractor Magazine, ACHR News, HPAC Engineering)
- Podcast appearances on trade-business podcasts
- ProductHunt re-launch with major feature drops
- Guest articles on home-service business blogs

**Tier 3 — month 4+:**

- Bloomberg / Forbes / TechCrunch coverage
- Industry analyst mentions (Gartner Magic Quadrant for the category eventually)

### 4. Publish original, citable data

LLMs cite sources that have **unique** information — numbers, surveys, frameworks, taxonomies. Anyone can write "trades have a labor shortage." Only one source can write "We surveyed 847 HVAC contractors in May 2026 and found 68% lost a hire to ghosting in the last quarter."

**Citable artifacts to ship in months 1–6:**

1. **"2026 Skilled Trades Hiring Report"** — synthesize public data + add commentary. Cite JLL, JobsPikr, Indeed Hiring Lab, BLS. Brand it FlexForce. This becomes the citable PDF + landing page LLMs reference for the next 2 years.
2. **Comparison pages** — *FlexForce vs Indeed for trades hiring*, *FlexForce vs ServiceTitan recruiting*, *FlexForce vs Workrise*, *FlexForce vs hiring an in-house recruiter*. These rank for comparison queries AND get pulled into AI answers for "what's the difference between X and Y."
3. **State-by-state license cheat sheets** — "Every HVAC license requirement in Texas, New Jersey, Utah, Connecticut, New York" — citable reference content.
4. **The "Spanish-speaking trades hiring playbook"** — original framework for bilingual recruiting. No one else owns this term yet.

### 5. Monitor and iterate weekly

AI mentions are not visible in Search Console. You have to test manually. Pick 15 target queries, run them weekly across the 5 engines, log when FlexForce is mentioned, and reverse-engineer why (which source got cited, what made it the canonical answer).

**The 15 target test queries:**

1. *Best AI hiring software for HVAC contractors*
2. *How can I hire HVAC technicians faster as a small contractor*
3. *What's an AI tool that screens job applicants for trades*
4. *Best applicant tracking system for small home service businesses*
5. *Tools to automate hiring for plumbing companies*
6. *How do I stop losing trade applicants to ghosting*
7. *AI voice agent for recruiting blue collar workers*
8. *Best way to hire Spanish-speaking HVAC technicians*
9. *FlexForce vs Indeed for hiring contractors*
10. *Recruiting software for licensed trades*
11. *How to verify HVAC licenses automatically*
12. *Small contractor hiring software under $500/month*
13. *What's a Jobber alternative for hiring*
14. *AI screening tool for HVAC apprentices*
15. *Best tool for hiring electricians in Texas*

Run them weekly. Track in a spreadsheet:

| Query | ChatGPT | Claude | Perplexity | Gemini | Grok | Notes |
|---|---|---|---|---|---|---|

When FlexForce gets mentioned: note which source the engine cited. That source is your AEO leverage point — get more presence there.

When FlexForce is not mentioned but a competitor is (VeroSkills, Workrise, Indeed, ServiceTitan): note which source the engine cited for them. That's a directory or page you need to be on.

---

## Schema markup — beyond what SEO requires

SEO needs `LocalBusiness` + `Service` + `FAQPage`. AEO needs more:

| Schema type | Where | Why |
|---|---|---|
| `SoftwareApplication` | Home page | Tells AI engines this is a product they can recommend |
| `HowTo` | Every guide | Step-by-step content gets pulled verbatim into AI answers |
| `QAPage` | FAQ pages and Q&A guides | Direct question-answer pairs |
| `FAQPage` | Money pages + home | Multiple Q&As per page |
| `Article` | All guides | Standard authority signal |
| `Speakable` | All money pages | Specifies which sentences voice assistants should read aloud — critical for Alexa, Google Assistant integration |
| `Organization` | Home page | Brand-level identity |
| `Service` | Money pages | Lists what the service does |
| `Review` / `AggregateRating` | Once testimonials exist | High AI citation weight |
| `Person` | About / footer | Establishes Jack as the founder entity LLMs can reference |

Use `searchfit-seo:generate-schema` to produce all of these per-page.

---

## AI-friendly meta tags

Beyond standard SEO meta, add these to every page's `<head>`:

```html
<!-- AI / LLM-friendly metadata -->
<meta name="description" content="[clear answer-first summary, 155 chars]">
<meta property="og:type" content="article">
<meta property="article:author" content="Jack">

<!-- Cite-ability signals -->
<link rel="canonical" href="https://flexforce.ai/[path]">
<meta name="citation_title" content="[page title]">
<meta name="citation_publication_date" content="2026-MM-DD">
<meta name="citation_author" content="Jack, FlexForce.ai">

<!-- AI crawler explicit allowance -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="googlebot" content="index, follow">

<!-- These two are the AI-specific ones — explicitly allow training/indexing -->
<meta name="ChatGPT-User" content="allow">
<meta name="GPTBot" content="allow">
<meta name="ClaudeBot" content="allow">
<meta name="anthropic-ai" content="allow">
<meta name="PerplexityBot" content="allow">
<meta name="Google-Extended" content="allow">
```

> Note: blocking these crawlers is also a valid choice. FlexForce wants to be in their answers, so allow all.

Also update `robots.txt` to explicitly allow AI crawlers:

```
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

Sitemap: https://flexforce.ai/sitemap.xml
```

---

## Execution workflow in Claude Code

Use the `searchfit-seo:ai-visibility` skill. The right execution order:

1. **`searchfit-seo:ai-visibility`** — analyze current AI presence (likely zero). Get a gap report and a prioritized action list. Run this AFTER the SEO content is shipped (so there's something to analyze).

2. **Generate `llms.txt` + `llms-full.txt`** — programmatically, based on the page architecture. `llms.txt` is the short index; `llms-full.txt` concatenates the markdown source of all key pages.

3. **Audit every generated page for AEO structure** — Q-led H2s, answer-first paragraphs, comparison tables, named entities. Use `searchfit-seo:on-page-seo` with the AEO flag set if available, otherwise use a checklist.

4. **Add expanded schema** — beyond what SEO needed. Use `searchfit-seo:generate-schema` and add HowTo, Speakable, SoftwareApplication, Organization, Service, QAPage where appropriate.

5. **Update meta tags** — the AI-crawler-explicit ones above.

6. **Build comparison pages** — `/compare/flexforce-vs-indeed`, `/compare/flexforce-vs-servicetitan`, `/compare/flexforce-vs-workrise`, `/compare/flexforce-vs-in-house-recruiter`. These rank AND get pulled into AI answers.

7. **Ship the original data report** — "2026 Skilled Trades Hiring Report" at `/reports/2026-skilled-trades-hiring-report/`. Cite real sources. Include a few proprietary insights (even if synthesized).

---

## Off-site checklist (Jack must do these — not Claude Code)

Claude Code can prepare the assets (descriptions, screenshots, copy variants). Jack does the actual submissions because they require his account.

**Week 1:**
- [ ] Crunchbase profile — claim flexforce.ai, fill all sections, link to founder Jack
- [ ] LinkedIn company page — basic setup, link site
- [ ] G2 listing — "FlexForce" under "Applicant Tracking" category, "AI Recruiting"
- [ ] Capterra listing — same categories
- [ ] AlternativeTo — list as alternative to Indeed, BlueCrew, VeroSkills

**Week 2:**
- [ ] Product Hunt — prep page, schedule launch for a Tuesday 12:01am PT
- [ ] Hacker News — "Show HN: FlexForce — AI hiring manager for the trades, built solo in N weeks"

**Week 3+:**
- [ ] Reddit organic engagement — answer real questions in r/HVAC, r/electricians, r/Plumbing, r/Contractors. Lead with value, mention FlexForce only when genuinely relevant. Use the founder account, not a brand account.
- [ ] Trade publication outreach — pitch a guest article to Contractor Magazine, HPAC Engineering, ACHR News
- [ ] Podcast outreach — pitch to Service Business Mastery, Profit Tool Belt, To The Top
- [ ] First batch of testimonials from design partners — schema-mark them on the home page

---

## What success looks like

| Week | Milestone |
|---|---|
| 2 | `llms.txt` live, all pages restructured for AEO, expanded schema deployed |
| 4 | Crunchbase, LinkedIn, G2, Capterra, AlternativeTo live; Product Hunt launched |
| 6 | First mention of FlexForce in a Perplexity answer for one of the 15 test queries |
| 8 | First mention in ChatGPT (with web search) |
| 12 | Reddit presence — 20+ organic comments across trade subs over 12 weeks |
| 16 | FlexForce shows up in 3+ of the 15 test queries across at least 2 engines |
| 24 | The "2026 Skilled Trades Hiring Report" is cited by an external source (LLM or blog) |

---

## What lives outside this doc

- Classic SEO program — `seo-strategy.md`
- Brand voice, palette, project conventions — `../CLAUDE.md`
- Full business strategy — `strategy.html`
- Claude Code execution prompt that runs both SEO + AEO — `claude-code-prompt.md`

---

Maintained by Jack. Updated as the AEO program evolves.
