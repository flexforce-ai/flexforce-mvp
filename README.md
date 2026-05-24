# FlexForce.ai — Landing + Signup MVP

Built by Jack. Solo, off-hours.

A deployable MVP for FlexForce.ai: marketing landing page, live candidate-experience demo, and a real serverless signup pipeline (CAPTCHA-protected, dual confirmation emails, Cal.com booking link).

```
flexforce-mvp/
├── index.html         Landing page (sells the product)
├── apply.html         Live candidate apply page demo (Mike's HVAC sample)
├── api/
│   └── signup.js      Vercel serverless function — handles the signup form
├── package.json       Declares the Resend dependency (Vercel auto-installs)
├── vercel.json        Static + functions deploy config
├── .env.example       Documented environment variables
├── .gitignore         Ignores Vercel build, env files, macOS junk
├── deploy.sh          One-shot initial setup script (GitHub + Vercel link)
├── README.md          This file
└── nextdoor.md        Ready-to-post Nextdoor copy variants
```

---

## What the signup flow actually does now

1. Visitor fills out the form on `index.html`
2. They solve the Cloudflare Turnstile CAPTCHA (modern, no-puzzle, frictionless)
3. JavaScript POSTs the form data + CAPTCHA token to `/api/signup` (Vercel serverless function)
4. The function verifies the CAPTCHA token against Cloudflare's servers
5. It sends two emails via Resend:
   - **To Jack** at `jack@flexforce.ai` — a clean table with all the prospect's details, `reply-to` set to the prospect's email so a tap-reply goes straight to them
   - **To the prospect** — a personal confirmation from Jack with a one-click Cal.com link to book the onboarding call
6. Visitor sees an inline success message: *"Got it. Check your inbox — I just sent you a Cal.com link to book your 15-minute onboarding. — Jack"*

Both emails fail gracefully — if anything goes wrong server-side, the prospect sees: *"Please email jack@flexforce.ai directly and I will personally onboard you."*

---

## First-time setup (~15 minutes, one-time)

You need accounts on five services. Four are free, one (custom domain email) is optional.

### 1. Resend — for sending emails

1. Sign up at [resend.com](https://resend.com) (free: 100 emails/day, 3,000/month)
2. Add `flexforce.ai` as a verified domain: [resend.com/domains](https://resend.com/domains)
3. Resend gives you DNS records to add at your domain registrar (DKIM, SPF, optionally DMARC)
4. Wait 5–15 minutes for DNS to propagate, click verify
5. Once verified, you can send `From: Jack at FlexForce <jack@flexforce.ai>` (otherwise emails get filtered as spam by Gmail/Outlook)
6. Create an API key at [resend.com/api-keys](https://resend.com/api-keys), copy the `re_...` value

**Pro tip:** if you don't want to set up the flexforce.ai domain in Resend right away, the API will fall back to Resend's default `onboarding@resend.dev` sender for testing. Just leave `MAIL_FROM_JACK` and `MAIL_FROM_SIGNUPS` unset until your domain is verified.

### 2. Cloudflare Turnstile — for CAPTCHA

1. Sign up at [cloudflare.com](https://cloudflare.com) if you don't already have an account (free)
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile** in the left sidebar
3. Click **Add site**, name it `flexforce`, add hostnames: `flexforce.ai`, `www.flexforce.ai`, and `flexforce-mvp.vercel.app` (your Vercel preview URL — needed for testing before custom domain is live)
4. Widget mode: **Managed** (best UX, mostly invisible)
5. Copy the **Site Key** (public, goes in your HTML) and **Secret Key** (private, goes in Vercel env)

After you have the site key, open `index.html` and find this line:

```html
<div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="dark" data-size="flexible"></div>
```

Replace `1x00000000000000000000AA` (Cloudflare's test "always-pass" key, fine for local testing) with your real site key. Commit and push.

### 3. Cal.com — for onboarding bookings

1. Sign up at [cal.com](https://cal.com) (free)
2. Pick a username — `jack-flexforce` recommended
3. Create a new **Event Type**: name it "Pilot onboarding", duration 15 min, scheduling type "round robin" off (just you)
4. Set availability: weekdays 9am–5pm in your timezone, weekends off
5. Add a few thoughtful questions: "What trade?", "How many techs?", "What state are you in?", "What's the biggest hiring headache?"
6. Get your booking link — should be `https://cal.com/jack-flexforce/pilot-onboarding`

### 4. GitHub organization

If `flexforce-ai` doesn't exist as a GitHub org yet, create it at [github.com/account/organizations/new](https://github.com/account/organizations/new) (free).

### 5. Vercel — for hosting

You already have this set up (the site is live at `flexforce-mvp.vercel.app`). The next steps connect the GitHub repo so deploys happen on `git push`.

---

## Connect GitHub → Vercel (one-time, the proper way)

Two options. The CLI path is cleaner.

### Option A — Vercel CLI (recommended)

From inside the `flexforce-mvp/` folder:

```bash
# Link this folder to a Vercel project (interactive)
vercel link

# Add environment variables — paste the value when prompted, pick "Production"
vercel env add RESEND_API_KEY production
vercel env add TURNSTILE_SECRET_KEY production
vercel env add JACK_EMAIL production
vercel env add CAL_LINK production
vercel env add MAIL_FROM_JACK production
vercel env add MAIL_FROM_SIGNUPS production

# (Optional) Add the same vars for preview deploys
vercel env add RESEND_API_KEY preview
vercel env add TURNSTILE_SECRET_KEY preview
# …and so on for the rest
```

Then connect the GitHub repo for auto-deploy on push:

```bash
# Push your code to GitHub (deploy.sh does this; or run manually)
git remote add origin git@github.com:flexforce-ai/flexforce-mvp.git
git push -u origin main

# Then in the Vercel dashboard:
#   Settings → Git → Connect Git Repository → choose flexforce-ai/flexforce-mvp
```

After this, every `git push origin main` triggers a production deploy automatically.

### Option B — Vercel dashboard

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → pick `flexforce-ai/flexforce-mvp`
3. Framework preset: **Other**
4. Add env vars under **Environment Variables** before clicking Deploy
5. Click **Deploy**

---

## Daily workflow — make changes, deploy

Once everything is set up, the loop is just:

```bash
# Make changes locally
vim index.html

# Commit and push
git add .
git commit -m "Tighten the hero subhead"
git push

# Vercel auto-builds in ~30 seconds and ships to flexforce.ai
```

No CLI deploy commands. Git is the deploy pipeline. Vercel emails you when each build completes (or fails).

### Branch + preview deploys

For larger changes, work on a branch — Vercel automatically deploys preview URLs for every push:

```bash
git checkout -b try-new-headline
# …make changes…
git commit -am "Try the 'AI hiring manager' headline variant"
git push -u origin try-new-headline
```

Vercel gives you a unique preview URL like `flexforce-mvp-git-try-new-headline-flexforce-ai.vercel.app`. Open a PR, test, merge to main when ready, production auto-deploys.

---

## Custom domain — connecting flexforce.ai

You said the site already loads at `https://flexforce.ai`. If it doesn't yet, or you want to make the apex canonical instead of `www`:

1. In Vercel: **Settings → Domains → Add Domain**
2. Type `flexforce.ai`, click Add
3. Vercel shows you the DNS records — usually:
   - `A` record at root → `76.76.21.21`
   - `CNAME` at `www` → `cname.vercel-dns.com`
4. Add those at your DNS registrar (Cloudflare, Porkbun, GoDaddy, etc.)
5. Verify in Vercel. Apex + www auto-issued SSL in ~5–15 min.

To make the apex (no www) the canonical instead of www: **Settings → Domains → Edit** on `flexforce.ai` → set as primary, then on `www.flexforce.ai` set redirect to apex.

---

## Local dev (optional — only if you want to test the API function locally)

```bash
# Install dependencies
npm install

# Install Vercel CLI globally if you haven't
npm i -g vercel

# Create a .env file locally (copy from .env.example, fill in real values)
cp .env.example .env
# Edit .env with your real Resend + Turnstile keys

# Run the dev server (serves static files AND runs the API function locally)
vercel dev
```

You'll get a local URL like `http://localhost:3000`. Form submissions will POST to your local API which will send real emails using your real Resend key — useful for testing the email templates without redeploying.

---

## The 500K gig-worker list — activation plan

You have leverage no other one-person founder has. Treat the list as a strategic asset, not a marketing channel.

### Week 1 — Re-engagement + segmentation

Send one broadcast. Subject-line A/B variants:
- "60 seconds — what kind of work do you actually want?"
- "Quick favor: 3 questions, 60 seconds"
- "Helping you find better-paying gigs near you"

Body links to a Tally or Typeform form with 3–4 questions:

1. **What kind of work do you do today?** (Driver / Delivery / Cleaning / Handyman / Construction / Other)
2. **Are you interested in a higher-paying skilled trade?** (HVAC / Plumbing / Electrical / Roofing / Already am one / Not interested)
3. **What state are you in?**
4. **Do you speak Spanish?** (Yes, primary / Yes, fluent / Some / No)

Optional fifth: *"Do you have any trade license or certification?"* (free text)

Expected response: 8–15% = 40k–75k segmented leads.

### Week 2 — Use the panel as your supply story

Every FlexForce cold pitch now opens with: *"I run a pre-vetted talent pool of 12,000 HVAC-interested workers in Texas. Want to be the first contractor they see when they're ready to apply?"* — closes 3–5× better than a generic recruiting-software pitch.

### Week 3+ — Launch GigWise.ai

Free AI career copilot at `gigwise.ai`. The 500K is the launch audience. See the strategy doc for full details on the audience-layer play.

---

## Posting on Nextdoor

See `nextdoor.md` for three ready-to-post variants. Sign every post as Jack.

---

## Troubleshooting

**Form submits but I don't get an email:**
- Check the Vercel function logs: `vercel logs --follow` (or the dashboard's Functions tab)
- Most likely: `RESEND_API_KEY` not set in Vercel env, or the sender domain isn't verified in Resend yet (Resend silently rejects unverified senders).

**CAPTCHA appears but submission fails:**
- Check `TURNSTILE_SECRET_KEY` is set in Vercel
- Check the Turnstile widget's hostnames in Cloudflare include both your Vercel URL and `flexforce.ai`

**Confirmation email goes to spam:**
- Verify `flexforce.ai` domain in Resend with DKIM + SPF
- Add a DMARC record at `_dmarc.flexforce.ai` with `v=DMARC1; p=none; rua=mailto:jack@flexforce.ai`
- First few sends always look suspicious — they "warm up" within a week

**Build fails on Vercel:**
- Most likely: `package.json` parse error or missing dep. Check the Vercel build logs — they're loud about it.

---

## Brand notes — Modern Premium

- **Palette**: forest green (`#1d4d3d`) + lime (`#bef264`) + warm cream (`#f6f3ee`) + deep forest (`#0f2922`)
- **Type**: Inter at weights 400/500. JetBrains Mono for small eyebrow numbers. No Syne, no Fraunces, no serif.
- **Voice**: Owner-to-owner. First-person from Jack where appropriate. Lowercase confident, not screaming.
- **Logo mark**: rounded forest-green square, cream left F, lime right F, lime accent dot bottom-right (proper SVG, not CSS shapes).
- **Wordmark**: lowercase `flexforce.` — the period is the brand.

Aesthetic reference: Mercury · Linear · Ramp · Vercel.

---

Built by Jack. Ship Friday.
