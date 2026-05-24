# Asset specs

> Visual assets needed for the off-site submission pack (Crunchbase, ProductHunt, G2, LinkedIn, etc.).
> Jack to produce these in Figma / Canva / Photoshop.

---

## 1. Brand logo (SVG)

Already in the codebase as an inline SVG in nav and footer:

- Rounded forest-green square (rx=14)
- Cream-fill left F at path `M 18 18 L 30 18 L 30 22.5 L 23 22.5 L 23 27.5 L 28.5 27.5 L 28.5 32 L 23 32 L 23 44 L 18 44 Z`
- Lime-fill right F (symmetric path)
- Lime accent dot bottom-right (circle cx=44 cy=44 r=3)

**Export sizes for off-site:**
- 256×256 PNG (Crunchbase profile logo)
- 512×512 PNG (G2, Capterra, AlternativeTo)
- 1024×1024 PNG (ProductHunt logo)
- SVG (LinkedIn — they accept SVG)
- Favicon: 32×32 + 16×16 ICO (apex/index.html)

## 2. Cover / banner images

**LinkedIn cover:** 1128×191px. Forest-green background (#1d4d3d). Centered wordmark "flexforce." (lowercase, period in lime). Below in JetBrains Mono 14px: "the AI hiring manager for the trades." Right-aligned tagline: "60-second response · bilingual screening · license verification."

**Crunchbase profile banner:** 1920×320px. Same composition as LinkedIn, wider.

**X / Twitter header (if needed):** 1500×500px. Same brand system.

## 3. ProductHunt gallery images (3)

All 1270×760px, 16:9 ratio. JPG, 80% quality.

**1. Homepage hero:** Screenshot of flexforce.ai showing the hero headline, subhead, and "Start your 30-day pilot" CTA. Crop tight on the hero section.

**2. Apply page demo:** Screenshot of apply.html mid-flow showing the chat interface in Spanish (toggle the EN/ES button before capturing). Show 4–5 chat bubbles for visual richness.

**3. Dashboard mock:** Designed mock — does not need to be real product. Show a "Daily Digest" email view with:
   - 3 example screened candidates (names like "Carlos M.", "Brian T.", "Maria L.")
   - Each with license status (✓ verified), call summary (2 lines), score (0–100), action button "Book interview"
   - Forest-green header bar with "FlexForce" wordmark
   - Cream background, card surfaces

## 4. Open Graph image

**Spec:** 1200×630px PNG. Used by all pages when shared on social / Slack / iMessage.

**Composition:**
- Background: forest-green (#1d4d3d)
- Logo top-left
- Centered headline (Inter 500, 64px, white): "AI hiring manager for the trades."
- Below (Inter 400, 24px, lime): "60-second response. EN/ES screening. License verification."
- Bottom strip: "flexforce.ai" wordmark with lime period

Save as `/og.png` at repo root; reference in every page's `<head>` with:
```html
<meta property="og:image" content="https://flexforce.ai/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://flexforce.ai/og.png">
```

Per-page OG images (one per money page) would be ideal at scale but is a v2 optimization — single shared OG works for launch.

## 5. ProductHunt thumbnail

240×240px (square). Logo on cream background. Used as the post tile.

## 6. Trade publication featured image

For when pitching ACHR News / Contractor Magazine: a 1600×900px graphic summarizing the 2026 hiring report headline:
- "350,000+ worker gap by 2028."
- "Response time is the new wage."
- Bar chart: time-to-fill 2020 vs 2026 (21 → 38 days)
- Citation: BLS, JLL, Indeed Hiring Lab 2026
- Bottom: small FlexForce wordmark + flexforce.ai

## 7. AI screening flow diagram

For the strategy doc + investor / pilot conversations:
- Step 1: Applicant submits form
- Arrow → Step 2: AI calls in 60s, screens in EN/ES
- Arrow → Step 3: License auto-verified against state board
- Arrow → Step 4: Interview booked on Cal.com
- Arrow → Step 5: Daily digest email to owner

1600×600px. Forest-green + cream system. Simple flat illustration, no 3D / no shadows.

---

## Production notes

- All assets should use Inter (display + body) and JetBrains Mono (micro-text only)
- Colors: forest #1d4d3d, deep forest #0f2922, lime #bef264, cream #f6f3ee
- No emojis in marketing assets unless explicitly asked
- Lowercase headlines (matches site voice)
- Founder name "Jack" — never "Jagdish" or "Thursday Strategy"

## Storage

Save all source files (.fig, .ai, .sketch) in a `assets/source/` folder (gitignored). Save exported PNGs/JPGs/SVGs in `/public/og/` or similar for direct serving. Reference them by URL in submission forms.
