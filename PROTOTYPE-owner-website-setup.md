# Prototype — Owner Website Setup (Flow A)

Clickable HTML/CSS/JS prototype of **“Switching the site on”**, built on the BEDR foundation.
No framework. Mobile-first. State is mock ManagR/dashboard data (the builder never edits property data).

## Run it

```bash
node server.js
```

Then open **http://localhost:4173**. (Any static server works; `server.js` is dependency-free.)
Best viewed at phone width first — the flow is designed mobile-first, desktop is the adaptation.

## What’s covered

| Step | Screen | States |
|---|---|---|
| 1 | Website · Locked | explainer, “what unlocks it”, **sample website preview** (bottom sheet), add-property → “sent for review” sheet |
| 2 | Website · Unlocked | reward banner, live preview of *their* data, “Set up my website” |
| 3 | Choose address | empty + suggestion · checking · available · taken (+ alternatives) · too short · invalid characters · reserved word; live full-URL echo |
| 4 | Confirm address | large final URL, permanence checkbox, “contact support to change” |
| 5 | Basic information | headline / about / phone / email / office — each shows its fallback; **Skip for now** (confirm sheet) |
| 6 | Website is live | copy link · open · Share on WhatsApp · QR code (download + “print for your gate”) · what’s next (Advanced shown locked) |
| 7 | Steady state | live/offline toggle, link + share, 7-day visitor / call / WhatsApp counts + “updated today”, editable Website information (property data marked read-only), published properties, non-nagging Advanced nudge |
| 8 | Live but empty | same page, `notice--warning` explaining *why* (property unpublished / re-review), “nothing is broken” reassurance, fix paths |
| — | Loading | skeleton of the website home |
| — | Visitor site | rendered Basic-tier site: brand bar + call, hero, “Direct from owner · no brokerage”, property list → detail (room types, amenities, rules, **approximate** map), sticky call/WhatsApp, “Powered by ManagR” |

## Prototype controls (flask button, bottom-right)

Scaffolding only — **not part of the design system**. It simulates the dashboard data the builder reads:

- Jump to any screen/state
- Toggle: *Property approved* · *Property published* · *Site live*
- **Visitor-site brand colour** swatches — demonstrates that every visitor-facing component repaints from one `--site-brand` token (the Advanced-tier requirement), without building Advanced
- Reset prototype (clears saved state)

Progress is saved to `localStorage` so a refresh keeps your place.

## Files

```
index.html                     screens + SVG icon sprite
assets/css/tokens.css          design tokens (unchanged from foundation step)
assets/css/base.css            reset, text styles, layout helpers        ← new, from BEDR-FOUNDATION §5.1
assets/css/components.css      reusable component classes                ← new, from BEDR-FOUNDATION §2
assets/css/prototype.css       screen routing, visitor site, dev toolbar
assets/js/app.js               flow logic (router, address validation, QR, render)
server.js / .claude/launch.json  static server for local preview
```

## Foundation components reused

`.btn` (primary / outline / ghost / cta / success / danger / icon / link / sm / block) · `.field` `.input` `.select` `.check` · `.card` (+ `--pad-lg` `--flush` `--dark`) · `.stat` · `.pill` (success / warning / neutral / dot / sm) · `.segmented` · `.sidebar` `.nav-item` `.appbar` `.avatar` `.page-head` · `.overlay` + `.sheet` (responsive: bottom sheet on mobile, centred modal ≥680px) · `.notice` · `.empty` · `.progress` · `.icon-tile` · `.setup-banner` · `.switch` · `.card-grid` `.stack`.

## New components (token-only, all recurring) — added to `components.css`

`.wizard` + `.stepper` · `.url-field` + `.url-echo` · `.copybar` · `.phone-frame` · `.qr` · `.toast` · `.kv` · `.freshness` · `.suggest-chip`. Rationale in the delivery notes / `BEDR-FOUNDATION §2`.

## Known prototype shortcuts (not design gaps)

- Property photos are gradient placeholders (matches how the current app renders missing photos).
- QR uses `qrcodejs` from cdnjs; offline it falls back to a non-scannable preview pattern with a note.
- “Add a property” opens a stub sheet with a *Simulate approval* button instead of the real Properties flow.
- Interaction states (hover / focus / active) use theme-safe `filter`/opacity + the `--focus-ring` token as working defaults — the real state spec remains a Design System Gap (`BEDR-FOUNDATION §7`).
