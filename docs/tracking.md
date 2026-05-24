# Analytics tracking layer

> How click, button, and form tracking works across FlexForce — for GTM, PostHog,
> and any future integration. Edit `templates/partials/tracking.html` to change behavior.

---

## What's wired

Every page (including home, apply, all 39 content pages) includes a tracking partial that:

1. **Loads GTM** — container `GTM-589NB6LK`
2. **Loads PostHog** — project key `phc_ueQrvu38JbSTHgfAFJQ4XV4mRTj5A4fVgvUwVyktpDo9`, US region
3. **Sets `window.flexforcePage`** with `{id, type, state, trade, wave}`
4. **Decorates CTAs tagged with `data-utm-content`** — adds `?utm_source=flexforce_content&utm_medium=organic&utm_campaign={page_id}&utm_content={button_id}` on page load. Same-page hash anchors (`#signup`) are skipped.
5. **Listens for clicks, button clicks, form submits** — fires `link_click`, `button_click`, `form_submit` events with page identity + element metadata to `dataLayer`, `posthog.capture`, `gtag`, and `plausible`.

## Page identity

`window.flexforcePage` is set on every page. Properties:

| Key | Example | Purpose |
|---|---|---|
| `id` | `hire-hvac-nj` | Unique page slug — used as utm_campaign and event property |
| `type` | `hire-money-page`, `state-hub`, `trade-hub`, `guide`, `comparison`, `home`, `demo` | Coarse page-type grouping |
| `state` | `new-jersey`, `texas`, `''` | Geo segment |
| `trade` | `hvac`, `plumbing`, `electrical`, `roofing`, `''` | Trade segment |
| `wave` | `1`, `2`, `3`, `0` (home/apply) | Which publication wave shipped this page |

## Lead-attribution UTMs

Any `<a>` element tagged with `data-utm-content="..."` gets UTM params appended on load.

**Examples:**
- `data-utm-content="nav_cta"` — sticky-nav "Start pilot" link
- `data-utm-content="hero_cta"` — hero primary CTA
- `data-utm-content="cta_block"` — green CTA block button on content pages
- `data-utm-content="pricing_starter|growth|premium"` — pricing tier buttons
- `data-utm-content="demo_card"` — demo card on home
- `data-utm-content="footer_signup"`, `footer_pricing` — footer links

To add a new tracked CTA: add `data-utm-content="my_button_id"` to the `<a>`. No code change needed.

## Click / button / submit events

Three events fire automatically:

### `link_click`
Properties: page_id, page_type, page_state, page_trade, page_wave, link_url, link_text, link_class, link_external (bool), utm_content

### `button_click`
Properties: page_id, page_type, page_state, page_trade, page_wave, button_id, button_text, button_class, button_type, utm_content

### `form_submit`
Properties: page_id, page_type, page_state, page_trade, page_wave, form_id, form_action, form_class

## Custom events from app code

Any app-side JS can call `window.flexforceTrack(eventName, props)`. Example:

```js
window.flexforceTrack('signup_completed', { plan: 'Growth', flow: 'website' });
```

Fans out to all four destinations automatically (dataLayer, PostHog, gtag, Plausible).

## GTM setup

In GTM (container `GTM-589NB6LK`):

1. Create **Built-in variable** — Data Layer Variable `event`
2. Create **Custom Event** triggers for `link_click`, `button_click`, `form_submit`
3. Pipe to GA4 (or wherever) with the event properties forwarded
4. For PostHog parity: optionally fire a PostHog tag from GTM too — but the inline PostHog snippet already covers this, so usually skip

## PostHog setup

In PostHog (project key set):

1. Navigate to **Insights → New Insight → Trends**
2. Pick event `link_click` (or `button_click`, `form_submit`)
3. Break down by `utm_content` to see which CTAs drive volume
4. Break down by `page_id` to see which content pages drive the most clicks
5. Create a Funnel: `$pageview` → `link_click` (utm_content = hero_cta) → `form_submit` (form_id = signupForm) → `signup_completed`

## Adding a page

When `scripts/build-config.mjs` adds a new entry, the generator automatically:
- Inlines the tracking partial
- Sets PAGE_ID = slug, PAGE_TYPE = template, PAGE_STATE/PAGE_TRADE from config

So no extra work is needed per new page beyond filling out its config.

## Privacy / opt-out

PostHog is configured with `person_profiles: 'identified_only'` — anonymous browsers don't get profiled. To respect opt-outs:

```js
window.posthog?.opt_out_capturing();
```

GTM doesn't have a built-in opt-out — wire it via Consent Mode if/when consent UI ships.
