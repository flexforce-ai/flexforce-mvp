# CLAUDE.md — FlexForce.ai project context

> Project handover for Claude Code. Read this first. Everything below is ground truth for working in this repo.

---

## TL;DR — 60 seconds

**FlexForce.ai** is an AI hiring manager for small home-service contractors (HVAC, plumbing, electrical, roofing, 3–30 techs). It calls every applicant within 60 seconds, screens them in English or Spanish, verifies licenses, and books interviews. Pricing: $299 / $599 / $999 per month.

**Owner:** **Jack.** Solo founder, off-hours project. **There is no team and no agency.** Do not reference Thursday Strategy, do not invent co-founders, do not write copy that implies more than one person. Voice is first-person, owner-to-owner, lowercase confident.

**Current stage:** Pre-launch MVP. Landing page + sample apply page + serverless signup API are built. Deployed to Vercel (`flexforce.ai` and `flexforce-mvp.vercel.app`). Domain mail is routed to Gmail. The first Nextdoor post hasn't gone live yet.

**Sibling product on the roadmap:** `GigWise.ai` — the audience-layer for AI-drafted workforce decisions (Litmus-shaped: workflow SaaS → certification standard → proprietary dataset). Not built yet. Don't propose building it before FlexForce has design partners.

**Strategic asset:** Jack owns a 500K gig-worker email list. That list is the long-term moat — used for FlexForce supply storytelling and GigWise.ai's real-respondent validation panel. See README section 4 for the activation plan.

**Full strategy doc** (designed in dark editorial Litmus aesthetic) lives in the repo at:
```
docs/strategy.html
```
Open this in a browser before making any architectural or positioning decisions. It covers the macro thesis (AI-driven labor reallocation, the $1T trades gap), the FlexForce wedge details, the GigWise.ai audience-layer reframe, the 500K-list activation plan, pricing model, MVP roadmap, and pressure tests.

---

## Architecture

Static HTML + Vercel serverless function. No frontend framework, no build step, no SPA.

```
flexforce-mvp/
├── index.html          Landing page — sells the product
├── apply.html          Live candidate-experience demo (sample shop: Mike's HVAC)
├── api/
│   └── signup.js       Vercel serverless function — handles the signup form
├── docs/
│   ├── strategy.html         Full strategy doc (positioning, ICP, GigWise.ai expansion, 500K list plan)
│   ├── seo-strategy.md       SEO program — page architecture, keywords, execution
│   ├── aeo-strategy.md       AEO / AI-search optimization (ChatGPT, Claude, Perplexity, Gemini, Grok)
│   └── claude-code-prompt.md Executable prompt that ships SEO + AEO in one pass
├── package.json        Declares Resend dep (Vercel auto-installs on deploy)
├── vercel.json         Static + functions config (cleanUrls, security headers)
├── .env.example        Documented environment variables
├── .gitignore          Standard ignores (.vercel, .env, node_modules)
├── deploy.sh           One-time setup script (GitHub repo + Vercel link)
├── README.md           Human-readable setup + ops docs
├── nextdoor.md         Three ready-to-post Nextdoor copy variants
└── CLAUDE.md           ← you are here
```

**Tech stack decisions (do not change without strong reason):**
- HTML/CSS in single files. No Tailwind, no React, no build pipeline.
- Fonts: Inter (400/500) for everything. JetBrains Mono for small eyebrow text. No Syne, no Fraunces, no serif anywhere.
- Email: Resend (SDK in `api/signup.js`). 100 emails/day free, $20/mo for 50k after that. Do not migrate to another provider without checking with Jack.
- CAPTCHA: Cloudflare Turnstile (free, no puzzles).
- Scheduling: Cal.com (link in the confirmation email).
- Hosting: Vercel. Static + serverless functions. Deploy via `git push` (no CLI deploys).
- Git host: GitHub, org `flexforce-ai`.

---

## Current state — what's done, what's pending

### ✅ Built and deployed
- Landing page with hero, pain stats, how-it-works, demo CTA, pricing, ICP, signup, FAQ
- Sample candidate apply page (Mike's HVAC) with full interactive AI screening simulation, EN/ES toggle, license-verify flow, interview-booked end state
- Vercel serverless function `/api/signup.js` — Turnstile-verified, dual-email pipeline (notification to Jack + confirmation to prospect with Cal link)
- Domain `flexforce.ai` resolves to Vercel
- Email receiving for `jack@flexforce.ai` is set up via Gmail (Cloudflare Email Routing, Workspace, or similar — confirm with Jack)

### ⏳ Pending setup tasks
The signup pipeline is wired but not yet fully active. The next agent should help Jack finish these in order:

1. **Verify `flexforce.ai` as a sending domain in Resend** ([resend.com/domains](https://resend.com/domains)). Adds DKIM + SPF records. Without this, prospect-side emails go via `onboarding@resend.dev` and look spammy.
2. **Get real Cloudflare Turnstile keys** ([dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile). Allowed hostnames: `flexforce.ai`, `www.flexforce.ai`, `flexforce-mvp.vercel.app`. Replace the test site key in `index.html` (currently `1x00000000000000000000AA` — always-passes test key from Cloudflare).
3. **Create Cal.com event** ([cal.com](https://cal.com) → username `jack-flexforce` → event "pilot-onboarding", 15 min). Copy the link into the Vercel env var `CAL_LINK`.
4. **Set six Vercel env vars** (production scope):
   - `RESEND_API_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `JACK_EMAIL` (e.g. `jack@flexforce.ai`)
   - `CAL_LINK`
   - `MAIL_FROM_JACK` (e.g. `Jack at FlexForce <jack@flexforce.ai>`)
   - `MAIL_FROM_SIGNUPS` (e.g. `FlexForce Signups <signups@flexforce.ai>`)
5. **Connect GitHub auto-deploy in Vercel** — Settings → Git → Connect Git Repository → pick `flexforce-ai/flexforce-mvp`.
6. **End-to-end test** — submit the form using Jack's personal email, verify both emails arrive, click the Cal link, book the slot.

### 📋 What's not built (intentional — do not build without Jack asking)
- Real Vapi/Twilio voice screening — `apply.html` is currently a polished JavaScript simulation, not the real product. The actual call/SMS flow is v1, not v0.
- Per-shop branded apply pages — currently one demo at `apply.html`. The real system needs a per-shop subdomain or path: `apply.flexforce.ai/{shop-slug}`.
- ATS integrations (Jobber, Housecall Pro, ServiceTitan) — promised in pricing tiers, not yet built.
- Owner dashboard — currently the daily digest is a promise, not a built feature.
- Stripe payment integration — pricing tiers link to the signup form, not checkout.
- Supabase / DB — submissions live in email only. No persistence yet.
- GigWise.ai — separate product, not started.

---

## Deploy workflow

**Do not run `vercel --prod` from the CLI.** That was the bootstrap method. Now Vercel is connected to GitHub and auto-deploys on push.

The loop is:

```bash
git add .
git commit -m "What changed in one short sentence"
git push
```

Vercel builds in ~30 seconds and ships to production. Build status arrives in Jack's email. Branch pushes auto-create preview URLs for testing before merging to main.

**To check function logs:**
```bash
vercel logs --follow
```
Or in the dashboard → Project → Functions tab.

**To run locally** (for testing the API function without deploying):
```bash
npm install
vercel dev
```
Local server runs on `http://localhost:3000`. Form submissions hit the local function with whatever's in `.env` (copy from `.env.example`).

---

## Conventions and rules

### Voice and copy
- Always first-person from Jack ("I built this because…", "Email support from Jack")
- Lowercase confident, not screaming caps
- Never use Title Case for headings outside the actual brand wordmark
- Never reference Thursday Strategy, Jagdish, or any team or agency
- Founders behind FlexForce: **Jack and only Jack.** If FAQ asks "Who's behind FlexForce?" the answer is *"Built by Jack — a solo founder who got tired of watching small contractors lose great hires to broken software. When you email support, you get me directly."*
- Owner-to-owner tone in all FAQ, signup, and email copy
- The candidate apply page (`apply.html`) uses the SHOP's voice (Mike's HVAC, not Jack's voice)

### Brand system — modern premium
- **Primary**: forest green `#1d4d3d`
- **Primary dark / text**: deep forest `#0f2922`
- **Accent / success / highlight**: lime `#bef264`
- **Background**: warm cream `#f6f3ee`
- **Card surfaces**: `#fbf9f4`
- **Borders**: warm beige `#e0d9c8`
- **Type**: Inter (400 body, 500 display). JetBrains Mono for numeric eyebrows (`01 / the problem`).
- **Logo mark**: inline SVG — rounded forest-green square (rx=14), cream-fill left F, lime-fill right F, lime accent dot bottom-right. The SVG path is defined in three places (nav, footer, footer of apply.html). When updating the logo, update all three.
- **Wordmark**: lowercase `flexforce.` — the period is the brand element. Period is forest green on light backgrounds, lime on dark.

The sample shop (Mike's HVAC) uses its own brand inside `apply.html`:
- **Mike's HVAC primary**: burnt orange `#c2410c`
- **Mike's HVAC dark**: `#9a330a`
- **Mike's HVAC soft**: `#fff7ed`
This contrasts cleanly with FlexForce green and signals "real local business" rather than "tech startup."

Aesthetic reference shelf: Mercury · Linear · Ramp · Vercel.

### Code style
- HTML and CSS in one file (no separate `.css` files for this project)
- CSS uses CSS custom properties for colors
- No CSS framework, no preprocessor
- JavaScript in `<script>` tags at the bottom of HTML files for landing/apply
- The serverless function in `api/signup.js` uses ESM (`import`/`export`) because `package.json` has `"type": "module"`
- Keep `api/signup.js` self-contained — no separate utility files for now
- Always escape user input in email HTML (the `esc()` helper in `signup.js` already does this)

### Git hygiene
- Commit messages should be short, lowercase, present tense — e.g. *"tighten the hero subhead"*, *"swap turnstile test key for real key"*
- One commit per logical change
- Don't squash unless explicitly asked
- Branch for anything bigger than a copy tweak; preview deploys catch issues before main

---

## Common tasks — how to do them

### Update the landing page copy
Edit `index.html`. Search for the section by its eyebrow label (`01 / the problem`, `02 / how it works`, etc.). Change copy, commit, push. Live in 30 seconds.

### Update the prospect confirmation email
Edit `api/signup.js`. The function `confirmationEmail({ firstName, business, trade, shopSlug, calLink, jackEmail })` builds the HTML. Inline styles only (email clients don't load external CSS). Test by `vercel dev` and submitting to your own address.

### Update the Jack-side notification email
Edit `api/signup.js`. The function `jackNotificationEmail({ ... })` builds the table. Keep it dense and scannable — Jack will read this on a phone.

### Add a new form field
Two places:
1. Add the `<label>` + `<input>` in `index.html` inside the form
2. Add it to the `payload = {...}` object in the `submitSignup()` JS handler
3. Add it to the destructure in `api/signup.js` and into both email templates
Don't forget to escape it in the email HTML.

### Change the pricing tiers
Edit the `.price-grid` section in `index.html`. Three plans. The middle plan has `.featured` class and the "most popular" badge. If adding a 4th plan, also update `.price-grid` CSS grid-template to `repeat(4, 1fr)` and the media queries.

### Add a new trade to the ICP list
Edit `index.html`, find the `.trade-list` div, add a new `<div class="trade">{trade name}</div>`. Also update the trade `<select>` options in the signup form.

### Update the candidate apply experience
Edit `apply.html`. The chat flow is defined in the `flow` JavaScript array near the bottom. Each step has `bot`, `botEs` (Spanish), and either `options` (multiple choice), `input` (free text), or `system` (status message). The flow ends with `done: true` which triggers the completion card.

### Debug a failing signup submission
1. Check Vercel function logs: `vercel logs --follow`
2. Most common causes (ranked):
   - `RESEND_API_KEY` env var missing or wrong → console.error
   - Sending domain not verified in Resend → silent send failure
   - Turnstile hostname mismatch → 400 from `/api/signup`
   - Cal.com link wrong format → confirmation email looks broken
3. Verify env vars: `vercel env ls`

---

## Gotchas — read before debugging

- **Turnstile site key in `index.html` is currently a test key** (`1x00000000000000000000AA`) that always passes. Replace it with the real key before going live or bots will get through.
- **`MAIL_FROM_JACK` and `MAIL_FROM_SIGNUPS` env vars must use domains verified in Resend.** Until `flexforce.ai` is verified, leave them blank — the API falls back to `onboarding@resend.dev`. Setting them to an unverified address makes Resend silently drop emails.
- **The form posts to a relative URL `/api/signup`** — works on any domain (Vercel preview, production, localhost). Do not change to an absolute URL.
- **FormSubmit was removed** — do not reintroduce it. The native Vercel function is the only signup pipeline.
- **`apply.html` is a demo, not the real product.** The "AI screening" is a JavaScript-driven mock. Real voice/SMS screening (Vapi + Twilio) is v1, not yet built.
- **There is no database yet.** Submissions live in Jack's inbox. Lose the inbox, lose the leads. Consider Supabase when volume justifies it.
- **The brand mark logo uses inline SVG**, not CSS pseudo-elements. An earlier version used CSS shapes — they rendered as cut-off 7-shapes (no middle horizontal bar). Stick with the SVG path: `M 18 18 L 30 18 L 30 22.5 L 23 22.5 L 23 27.5 L 28.5 27.5 L 28.5 32 L 23 32 L 23 44 L 18 44 Z` (left F, cream) and the symmetric right F (lime).
- **The strategy doc lives at `docs/strategy.html`** inside this repo. It's the source of truth for positioning, ICP, pricing, and the GigWise.ai expansion thesis. If any of those need to change, update the strategy doc in the same PR — drift between the strategy doc and the live site is the first sign the brand is becoming inconsistent.

---

## Next moves — ordered by leverage

In rough order of what to do after the setup checklist is done:

1. **Activate the signup pipeline end-to-end.** Finish the six env vars, verify Resend domain, swap real Turnstile key, test once.
2. **Post Nextdoor Variant 1** (from `nextdoor.md`) in Jack's own neighborhood. Reply to every comment within 4 hours.
3. **Get 3 design partners.** 30-day free pilots. Use their feedback to define what real screening features matter.
4. **Re-engagement broadcast to the 500K list.** See README section 4. Use Tally or Typeform for the segmentation survey. Bulk email infrastructure (Amazon SES or EmailOctopus) is a different code path — not in this repo yet.
5. **Build real screening v1.** Vapi for voice, Twilio for SMS, Supabase for state. This is where this repo grows beyond static + one function. Likely worth converting to a proper Next.js app at that point.
6. **First ATS integration: Jobber webhook.** Lowest API friction.
7. **Stripe payment links** for the three pricing tiers.
8. **Per-shop branded apply pages** at `apply.flexforce.ai/{shop-slug}`. Requires a database to store shop config.
9. **Owner dashboard.** Once there's a database, build the daily digest as a real product surface.
10. **GigWise.ai companion landing.** Same brand system, sibling product. Don't start until FlexForce has revenue.

---

## When in doubt

- If a decision affects positioning, voice, or pricing — ask Jack first. Don't guess.
- If a decision affects code structure, palette, or workflow — apply the conventions above.
- If a service migration is on the table (Resend → X, Vercel → X, etc.) — discuss with Jack before changing. Don't migrate to save $5/mo at the cost of an hour of work.
- If a feature is "for v1" per the gotchas section — confirm Jack wants it built before starting.
- If `apply.html` needs changes — remember Mike's HVAC is the sample shop, not FlexForce. Keep its brand orange, FlexForce's chrome (banner + footer) green.

---

Built by Jack. Off-hours. One person at a time.
