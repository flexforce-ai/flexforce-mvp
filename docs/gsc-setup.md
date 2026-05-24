# Google Search Console + Bing Webmaster Tools setup

> Step-by-step for Jack. Do this on Day 1 of Wave 1.

---

## Google Search Console

1. Go to https://search.google.com/search-console and sign in with the Google account you want to own the property.
2. Click **Add property** → **Domain** → enter `flexforce.ai`.
3. GSC will give you a **TXT record** value (looks like `google-site-verification=...`).
4. In your DNS host (Cloudflare or wherever flexforce.ai is managed):
   - Add a new **TXT** record on the root (`@` or `flexforce.ai`)
   - Paste the value
   - TTL: Auto / 5 minutes
   - Save
5. Wait 5–10 minutes for DNS propagation. Back in GSC, click **Verify**.
6. Once verified, in the left nav click **Sitemaps**. Submit:
   ```
   https://flexforce.ai/sitemap.xml
   ```
7. Click **URL Inspection** (top of left nav). Paste each of these 8 priority URLs and click **Request indexing**:
   - `https://flexforce.ai/`
   - `https://flexforce.ai/trades/hvac/`
   - `https://flexforce.ai/trades/plumbing/`
   - `https://flexforce.ai/hire/hvac-technicians/texas/`
   - `https://flexforce.ai/hire/hvac-technicians/new-jersey/`
   - `https://flexforce.ai/states/texas/`
   - `https://flexforce.ai/reports/2026-skilled-trades-hiring-report/`
   - `https://flexforce.ai/compare/flexforce-vs-indeed/`

Note: Google rate-limits indexing requests to ~10/day per property. The 8 above should fit in one session.

## Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters and sign in (Microsoft account).
2. Click **Add a site** → enter `https://flexforce.ai`.
3. Choose **Import from Google Search Console** (Bing recognizes the GSC verification and imports your verification + sitemap automatically). This takes ~30 seconds and saves a manual DNS step.
4. Confirm the sitemap is imported. If not, manually submit `https://flexforce.ai/sitemap.xml`.

Bing drives ~10% of US searches and disproportionately serves contractors over 50 — worth the 2 minutes.

---

## After indexing — what to expect

| Timeline | Expected |
|---|---|
| 2–7 days | Pages indexed in Search Console (visible in **Coverage** report) |
| 1–2 weeks | First impressions per page in **Performance** report |
| 4–8 weeks | First ranking positions on long-tail keywords |
| 10–12 weeks | First organic page visits driving signup |

**Weekly tasks (every Monday morning, 30 min):**

1. **GSC Performance check.** Note impressions per page. Sort by query — see which long-tail keywords are picking up.
2. **Run the 15 AEO test queries** (from `aeo-strategy.md`) manually across:
   - ChatGPT (with web search on)
   - Claude.ai (with web search on)
   - Perplexity
   - Gemini
   - Grok
3. **Log results** in `docs/ai-visibility-tracker.md`. Note which engine cited FlexForce vs which cited competitors, and which source page got cited.
4. **Spot-check a competitor.** Pick one (Workiz, ServiceTitan, Mya, Workrise, BlueCrew). Run the same 15 queries to see who they're beating you on and from which source.
5. **Investigate one gap.** Pick the highest-leverage AI-visibility gap from the prior week and act on it (Crunchbase profile fill, Reddit comment thread, ProductHunt re-engagement, etc.).

---

## Monthly tasks (first Monday of each month, 1 hour)

1. **GSC Sitemaps coverage.** Confirm all 40 URLs are indexed. If any aren't, investigate.
2. **Cumulative AEO tracker review.** Look for trend lines: are we showing up in more queries / more engines than last month?
3. **Off-site presence audit.** Crunchbase, G2, Capterra, AlternativeTo, ProductHunt — anything updated by competitors? Anything we should refresh?
4. **Refresh sitemap dates** if you've updated pages.

---

## Quick GSC interpretation tips

- **Impressions** in low single digits week 1 → 100+ week 4 → 1000+ week 12 = on track
- **Average position** above 50 = page exists but isn't ranking yet (normal first 4 weeks)
- **Average position** 20–50 = entering page 2–5 territory (good progress)
- **Average position** 1–10 = page 1 of SERP (the goal)
- **CTR** below 1% on page-1 ranking = title/meta needs work
- **CTR** above 3% on page-1 ranking = strong title/meta, leave it alone
