# FlexForce.ai — Landing Page + MVP

A deployable, static MVP for FlexForce.ai. Two pages, zero build step, lives on Vercel in under three minutes.

Built by Jack, solo, in off-hours.

## What's in this folder

```
flexforce-mvp/
├── index.html         The landing page (sells the product)
├── apply.html         Live candidate apply page demo (Mike's HVAC sample)
├── vercel.json        Vercel static-deploy config
├── README.md          This file — deploy + GTM playbook
└── nextdoor.md        Ready-to-post Nextdoor copy variants
```

No build process. No npm install. Just static files. Vercel hosts them for free.

---

## 1. Deploy to Vercel (3 minutes)

### Option A — Vercel CLI (recommended)

```bash
# Install Vercel CLI once
npm i -g vercel

# From this folder
cd flexforce-mvp

# Deploy a preview
vercel

# Promote to production
vercel --prod
```

Vercel hands you a URL like `flexforce-mvp.vercel.app` instantly. Test there first.

### Option B — Drag-and-drop

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag this entire `flexforce-mvp` folder onto the page
3. Click Deploy
4. Done in 60 seconds

### Connecting flexforce.ai (custom domain)

1. In the Vercel project: **Settings → Domains → Add**
2. Enter `flexforce.ai`
3. Vercel gives you two DNS records to add at your registrar (Cloudflare, Porkbun, GoDaddy, etc.):
   - An `A` record for the root pointing to `76.76.21.21`
   - A `CNAME` for `www` pointing to `cname.vercel-dns.com`
4. Apex + www verified, HTTPS auto-issued — usually 5–15 minutes.

For the candidate-facing subdomain `apply.flexforce.ai` (for future use), add another CNAME once the real per-shop apply pages are built.

---

## 2. Wire up the signup form (5 minutes)

The signup form on `index.html` posts to **FormSubmit** — zero-signup email forwarding.

**Default behavior:** Submissions go to `jack@flexforce.ai`.

To activate the first time:
1. Deploy the site
2. Submit the form once with any valid email
3. FormSubmit emails Jack a one-time confirmation link — click it
4. From then on, every signup hits Jack's inbox as a clean table-formatted email

### Want a better setup later? Three upgrade paths:

- **Tally.so** — Replace the `<form>` block with a `<iframe>` Tally embed. Free up to 3 forms. Nicer dashboard, branching logic.
- **Resend + Vercel serverless** — If signups should land in Supabase or fire a custom Slack ping. Requires moving from static to a Next.js project.
- **Stripe Payment Link** — Replace one of the "Start pilot" CTAs with a Stripe Payment Link to collect a $99 refundable deposit. Reduces tire-kickers; raises conversion confidence on the call.

---

## 3. Update the hard-coded bits before going live

Open `index.html` and search for these:
- `jack@flexforce.ai` — currently set on `_subject`/`action`. Change if you'd rather route to a different inbox (e.g., `hello@flexforce.ai`).
- `https://flexforce.ai/?signed_up=1` — change to your actual production domain once `flexforce.ai` is live.
- "Mike's HVAC" / "Carlos R." in the hero phone mockup — keep as-is for now, or swap to a real first design-partner shop once you have one. Concrete > generic.

Open `apply.html`:
- "Mike's HVAC & Cooling" / Austin address / job details — these are the demo. Leave as-is until you build the per-shop apply page generator.

---

## 4. The 500K gig-worker list — activation plan

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

Expected response: 8–15% = 40k–75k segmented leads. The "interested in skilled trades" subset alone is the most valuable cold list in the country for FlexForce sales.

### Week 2 — The dual product

**For FlexForce.ai (employer side):**
Use the segmented data as a sales weapon. Every cold pitch opens with: *"I run a pre-vetted talent pool of 12,000 HVAC-interested workers in Texas. Want to be the first contractor they see when they're ready to apply?"* That converts a recruiting-software pitch into a talent-pool pitch — much higher close rate.

**For GigWise.ai (worker side):**
Launch a free AI career copilot at `gigwise.ai`. The 500K is the launch audience. Email subject: *"Free — your personal AI career coach (helps you find $40+/hr jobs near you)"*. The copilot:
- Suggests higher-paying gigs based on existing skills
- Maps current experience to the trades that pay best in their state
- Drafts their first résumé and first 5 cold applications
- Notifies them when FlexForce employers in their state are hiring

You get: engagement data, retention signals, language preference, geographic density. Every engaged worker = a calibrated training-data point for the audience-validation layer.

### Week 3+ — Use the panel as paid micro-survey respondents

When a FlexForce employer pastes a job post, GigWise.ai pings a real subset of the 500K matching that persona (e.g., 50 HVAC techs in TX) for 60-second micro-feedback at $1 each.

They answer:
- Would you apply to this? (1–10)
- What's the first thing that turns you off?
- What would you change?

Employer pays $99 per posting validation. Worker earns $1. Jack keeps $49 (after panel payouts).

This is the wedge GigWise.ai launches on. Real respondents beat synthetic until enough calibration data exists to synthesize confidently. The 500K makes that possible — no other competitor has anywhere close.

---

## 5. Posting on Nextdoor

See `nextdoor.md` for three ready-to-post variants. Key principles:

- **Lead with the problem, not the product.** Nextdoor users tune out anything that smells like an ad.
- **Hyperlocal first.** Post in Jack's own neighborhood first. Mention the geography ("looking for 5 Austin-area HVAC owners…").
- **Soft CTA.** "DM me if curious" beats "click here."
- **Be a real person.** Use first name, mention being local, offer to grab coffee.

---

## 6. What's next after deploy

In order of leverage:

1. **Get 3 design partners.** Reach out to 25 local contractors. Offer 30-day free pilot. Take any conversation, even from someone who turns you down — their reasoning is the product roadmap.
2. **Build the real screening flow.** The current `apply.html` is a polished mock. The real one needs Vapi + Twilio + a Supabase backend. Estimate 2 weeks of focused build for v1.
3. **Ship one ATS integration.** Jobber is the easiest API. Build the webhook that pushes hired candidates into a Jobber team profile.
4. **Real Stripe checkout for the $299/$599/$999 plans.** Until then, the pilot CTAs go to Calendly for onboarding calls.

Don't build a CRM. Don't build a marketing site CMS. Don't hire. Don't raise. Run lean. The first $20k MRR is sales velocity, not engineering elegance.

---

## 7. Tracking conversions

Drop a Plausible (`plausible.io`, $9/mo, privacy-friendly) or Vercel Analytics (free with Pro) snippet into the `<head>` of both HTML files. Track:
- Hero CTA clicks (`#signup` anchor)
- "See applicant experience" clicks
- Form submissions
- `apply.html` page visits, chat starts, chat completions

The single most important number to watch in week one: **landing-page visitor → form-submission conversion rate.** Target 4–8%. Below 2% = the hero pitch isn't landing. Above 10% = the hero is overselling or the price is too low.

---

## Brand notes — Modern Premium direction (locked in)

- **Palette**: forest green (`#1d4d3d`) + lime (`#bef264`) + warm cream (`#f6f3ee`) + deep forest (`#0f2922`)
- **Type**: Inter at weights 400 (body), 500 (display). JetBrains Mono for eyebrows and tags. No Syne, no Fraunces, no serif anywhere.
- **Voice**: Owner-to-owner. First-person from Jack where appropriate ("I built this because…"). Lowercase confident, not screaming.
- **Logo mark**: rounded forest-green square, cream left F, lime right F, lime accent dot bottom-right.
- **Wordmark**: lowercase `flexforce.` — the period is the brand. Always set the period in the primary green when on cream/white, in lime when on dark.

Aesthetic reference shelf: Mercury · Linear · Ramp · Vercel.

---

Built by Jack. Ship it Friday.
