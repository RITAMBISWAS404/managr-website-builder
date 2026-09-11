# ManagR Website Builder — build notes

Companion to **`BUILDER-PRODUCT-ARCHITECTURE.md`** (the model) and **`BUILDER-UX-QA.md`**
(Pass-3 UX audit + spacing/interaction rules).
This file = what changed across iterations, the state matrix, edge-case decisions, the assumptions log, the self-audit.

> **Pass 3:** architecture, flows and low-fi visuals unchanged from Pass 2. Refinement
> only — hierarchy, spacing, plain-language copy, discoverability, mobile, accessibility,
> progressive disclosure, edge-case completeness.
>
> **Pass 4 (current):** production sign-off. Browser QA at 320–1300px × 6 plan states.
> Fixed: version Restore (was a no-op → real snapshots), publish summary ("Minor edits"
> forever → honest), inert inspector Layout tab (→ wired), coach-mark leak, mobile home-header
> overflow, dev-button covering mobile Publish, enquiry field errors. Simplified: content &
> layout are single-value (all screens); only per-section show/hide is per-screen — the
> `overrides` seam stays for a future opt-in. One `.tabbar` component. See `BUILDER-UX-QA.md
> §9–16` and `BUILDER-PRODUCT-ARCHITECTURE.md §22`.

> **React migration (current):** the builder is now a React/TS/Vite/Tailwind/shadcn app
> (`npm install && npm run dev`). The product — IA, flows, states, this whole document —
> is unchanged. Code architecture: `TECH-STACK.md`. The original HTML prototype this file
> describes is preserved in `legacy/` (`node legacy/server.js` → `/builder.html`).

**Run (HTML prototype):** `node legacy/server.js` → **http://localhost:4173/builder.html**
Low-fi wireframe visuals on purpose. Prototype controls behind the ⚙ button (bottom-right):
jump to any surface + flip the ManagR state the builder reads — **plan** (basic / trial / advanced /
expiring / payment-failed / lapsed), **role** (owner / manager / staff), **connection**, site live,
setup stage, published properties, availability freshness, publish-fails.

---

## 1 · What changed from the structural iteration

| Area | Before | Now |
|---|---|---|
| Editor left panel | one section navigator | **rail of 4 modes** — Layers · Pages · Add · Assets — + Theme / Responsive / ⌘K |
| Pages | single implicit "Home" | **full page model** — Home + property template on Basic; add / rename / duplicate / delete / set-home / nav-toggle / hidden on Advanced; property page = one design fanned over approved properties |
| Global sections | header/footer just present | **stored once at site level**, "used on every page" banner, edits apply everywhere |
| Inspector | flat control list | **tabbed: Content · Layout · Data · Visibility** — consistent across every section |
| Data binding | "From ManagR" note | dedicated **Data tab** listing every bound field + "Edit in ManagR →"; publish summary states data is never published |
| Responsive | device toggle only | **Desktop / Tablet / Mobile** canvas preview; content + layout are single-value (all screens), only per-section show/hide is per-screen (Pass 4 simplification); grids auto-adapt column count; **Responsive checker** overlay (jump / fix / dismiss / restore) |
| Themes | 1 axis | **Theme (look) + Template (arrangement)** as independent axes, each with an apply-confirm that spells out what changes / what doesn't |
| Publish | confirm + error | **readiness check** (blockers vs warnings) → **publish summary** ("3 section changes · 1 theme change · no data changes") → "Publish anyway" for warnings → success / categorised failure |
| Version history | list + restore | current draft / live / prior versions, **preview a version**, restore = "saved as your draft first, nothing goes live" |
| Plan states | basic / advanced / lapsed | + **trial / expiring / payment-failed**, each with its own hub banner + editor behaviour; lapse preserves everything and auto-hides (never deletes) Advanced sections |
| Roles | — | **owner / manager / staff**; staff gets a proper view-only editor; manager can't touch billing |
| Onboarding | — | first-run **coach marks** (desktop) / one-card tip (mobile), dismissible, shown once |
| Command menu | — | **⌘K** quick actions (add section, go to page, theme, run check, preview, publish, …) |
| Keyboard | — | ⌘Z/⇧⌘Z · ⌘↵ publish · P preview · ⌫ delete · ⌘D duplicate · ⌥↑/↓ move — all optional |
| Site health | — | standalone **health view** + hub card; same check runs pre-publish |
| Connection | — | Saving / Saved / **Offline (saved on this device)** indicator |
| Web address | 7 states | + reserved / temporarily-unavailable handling, permanent lock + "Need to change this?" → support |
| Autosave | "saved to draft" text | real debounced field-save + snapshot into undo history |

The **ManagR shell** (sidebar, top bar, nav conventions) is unchanged. `index.html` (the earlier
hi-fi setup flow) is untouched.

---

## 2 · State coverage (§79 of the brief)

Every state below is reachable in the prototype (mostly via the ⚙ bar).

| State | Where it shows |
|---|---|
| **Default** | every surface |
| **Loading** | ⚙ → Loading state (skeleton hub); visitor site uses skeleton-friendly structure |
| **Empty** | no properties (hub "live but empty" + visitor "coming soon") · no photos (card placeholder + inspector note) · no reviews / gallery (section "needs data" placeholder + hide affordance) · no enquiries · no visits |
| **Success** | publish success · enquiry sent · visit booked · request sent · address available |
| **Error** | publish failure (⚙ → Publish: Fails) · enquiry validation · asset upload states listed · categorised error copy (network / validation / permission / conflict / plan / upload) |
| **Disabled** | single-instance section already added · undo/redo at ends · "Continue" until a valid choice |
| **Locked** | staff role (whole editor) · manager (billing) · Basic (structure, branding, extra pages, Advanced sections) |
| **Advanced** | consistent lock explainer on every gated control + canvas placeholder |
| **Lapsed** | ⚙ → Plan: Lapsed — hub banner, editor reverts to fixed layout, live preview drops Advanced sections & branding, config preserved |
| **Trial / Expiring / Payment-failed** | ⚙ → Plan — distinct banners, features stay on |
| **Stale** | ⚙ → Availability: Stale — per-property "not shown as live", owner warning on health, freshness thresholds panel |
| **Missing data** | featured property/photo/review gone → inspector "replace / remove", public site silently drops |
| **Under review** | property greyed in Properties section + hub attention item + not on public site |
| **Offline (site)** | ⚙ → Site: Offline — hub copy, visitor "temporarily unavailable", still editable |
| **Offline (connection)** | ⚙ → Connection: Offline — "saved on this device" indicator |
| **Published / Draft / Unpublished** | Draft chip · "unpublished changes" hub banner · Preview labelled "draft, not published" |
| **Conflict** | visit slot race (`confirm` → "that time was just taken" + nearby times) · booking-request date recovery |
| **Validating / Saved / Unsaved** | address "checking…" · save-state indicator · publish summary |

---

## 3 · Edge-case decisions (§80)

| What if… | Behaviour |
|---|---|
| owner has no approved property | Website home = locked explainer + sample preview + "Add a property"; editor unreachable |
| a featured property is unpublished under them | inspector flags "1 featured item is no longer available — replace / remove"; public site drops it, no broken card |
| another user edits in parallel | optimistic UI; on the next server sync the owner sees "this changed while you were working — here's what's true now" (architecture; prototype simulates via ⚙) |
| publish fails mid-way | live site untouched, "nothing was half-published", Retry; draft safe |
| a section needs data it doesn't have | canvas placeholder + inspector guidance + one-tap "Hide for now" — never an empty gap on the live site |
| visitor submits an enquiry twice | "you already enquired on 3 Sep — send another?" (prototype: phone `9990000000` triggers it) |
| a visit slot fills during booking | on Confirm: "that time was just taken" + nearby same-day times (prototype: date 9 + time 5:00) |
| requested move-in date can't be met | recovery, not rejection — "free from 2 March · Request for 2 March" |
| owner refreshes / returns later | full state persisted to `localStorage`; editor restores page, selection, device, left mode |
| owner has 40 properties | Properties inspector "Choose specific" → picker with search + status + availability filters (prototype: "Preview the property picker") |
| a label doubles in length (i18n) | wireframe uses no fixed-width labels / fragile buttons; long hero headline surfaces a responsive-checker warning |
| 360px screen | mobile editor is a distinct model (canvas-first + bottom bar + full-screen settings), not a shrink |
| owner doesn't understand what happened | every destructive/irreversible step confirms with plain "what changes / what doesn't"; toasts carry Undo; "Why?" links where a rule bites |

---

## 4 · Assumptions log (§81) — product decisions the brief doesn't specify

Each is demonstrated in the UI **and** flagged (a `product decision` chip or a note) for sign-off.

| # | Decision | Chosen | Reversible? |
|---|---|---|---|
| 1 | Inventory freshness threshold | Fresh ≤ 3d · slightly stale 4–10d (shown, softer) · stale > 10d (not shown as live) — **configurable in Availability settings** | yes, in-product |
| 2 | Default disclosure level | Room-type, **master switch off**, opt-in | yes |
| 3 | Phone verification for visits | Same-day bookings only | policy |
| 4 | Booking-request SLA shown to visitor | "usually within a day" — no countdown | policy |
| 5 | Visits/slot · min notice · horizon defaults | 2 · 3h · 21d, owner-editable | yes |
| 6 | Payment insertion point | After owner approval, before visitor confirmation (`request → approve → [payment] → confirm`) | architecture |
| 7 | Extra pages & "add page" | Advanced only | matches capability matrix |
| 8 | "Powered by ManagR" | On for Basic; Footer toggle on Advanced | matches matrix |
| 9 | Basic → paid later | Plan / badge / renewal / lapsed components exist now; Basic reads "Free" | brief asks for this |
| 10 | Breakpoint pixel values | Not surfaced to owners; front-end's call | n/a |
| 11 | Draft preview sharing | Unlisted link, not access-controlled in v1 | revisit w/ permissions |
| 12 | Autosave offline | Local device only, honest wording, syncs on reconnect | n/a |
| 13 | Roles that can publish | Owner + Website manager; Staff view-only | uses ManagR's permission store |
| 14 | Scheduled Visits status set | 6 semantic states (was 11 colours): Pending · Confirmed · Visited · Rescheduled · Cancelled · No-show | policy |

---

## 5 · Self-audit (§83) — did the UX problem get solved, not just a screen exist

| # | Area | Verdict |
|---|---|---|
| A | Information architecture | ✅ Website is its own section; editor is the workspace; config deep-links back into it |
| B | Owner onboarding | ✅ locked → unlock → address (all states) → confirm → info → live → coached into the editor |
| C | Website management | ✅ hub answers is-it-live / URL / plan / health / attention / activity / metrics / next step |
| D | Editor | ✅ rail modes · canvas · tabbed inspector · status bar · in-editor overlays; you rarely leave |
| E | Pages | ✅ page model + property template; Basic vs Advanced boundary; nav order follows page order |
| F | Sections | ✅ select / drag / up-down / hide / duplicate / remove / lock / needs-data / shallow sub-parts |
| G | Global components | ✅ header/footer stored once, "used on every page", one edit = everywhere |
| H | Themes | ✅ 3 looks, curated overrides, apply-confirm, structurally equivalent |
| I | Templates | ✅ separate axis, arrangement presets, content-preserving apply with a diff |
| J | Assets | ✅ ManagR photos browsed in place + website uploads (Advanced) + upload states |
| K | Data binding | ✅ two visually distinct zones; Data tab; publish summary states data isn't published |
| L | Responsive system | ✅ single-value content/layout, per-section per-screen show/hide, auto grid columns, checker with jump/fix/dismiss |
| M | Mobile editing | ✅ genuine distinct model; entire workflow completable on a phone |
| N | Preview | ✅ editor edit/preview · device switch · visitor preview · test-mode forms · version preview |
| O | Draft | ✅ autosave + save-state + snapshots; "editing draft, visitors see published" everywhere |
| P | Publish | ✅ check → summary → confirm → success/failure; blockers vs warnings |
| Q | Version history | ✅ draft / live / prior; **real snapshot per version** — preview renders from it, restore loads it as draft (current draft saved first) |
| R | Advanced gating | ✅ one lock component; visible, understandable, never a dead end, never nagging |
| S | Plan states | ✅ 6 states, each with hub + editor behaviour; graceful non-punishing lapse |
| T | Inventory | ✅ 3 disclosure levels + example previews + per-property + freshness + numbers |
| U | Privacy | ✅ permanent firewall panel; enforced at the render layer (not a toggle); re-checked at publish |
| V | Visits | ✅ owner rules (weekly picker + slots + blackout + capacity) → visitor 4-step → Scheduled Visits tag |
| W | Enquiries | ✅ field config + destination + FAB + inline placements; validation / success / duplicate / error |
| X | Booking requests | ✅ visitor flow with date recovery + payment placeholder + owner inbox (approve/decline+reason) |
| Y | Analytics | ✅ plain-language metrics + "roughly what your site brought in" |
| Z | Site health | ✅ standalone view + hub card + pre-publish gate; dismiss/restore |
| AA | Error states | ✅ categorised copy (what happened / what it means / what next) |
| AB | Empty states | ✅ each suggests the next useful action |
| AC | Multi-property | ✅ property picker with search + filters; scales to 40 |
| AD | Accessibility | ✅ ≥38–44px targets, focus-visible, keyboard editor, labelled controls, no colour-only meaning |
| AE | i18n | ✅ no fixed-width labels; ~1.8× length tolerated; long strings surface as responsive warnings |
| AF | Performance | ✅ save queue + reconnect + honest offline; visitor site is structurally light |
| AG | Permissions | ✅ 3 roles, proper locked states, architected for per-capability checks |
| AH | Support | ✅ inline "Why?" / short explainers / WhatsApp support for address & billing |

### Against the 12 required demonstration flows (§85) — all navigable:
1 setup → editor · 2 edit → preview → publish · 3 add → configure → reorder → hide → restore ·
4 theme + template → review → publish · 5 mobile → section settings → responsive override → check ·
6 Advanced lock → upgrade · 7 availability → room-level → stale → preview · 8 visit config → visitor books → Scheduled Visits (Website source) ·
9 enquiry → CRM lead · 10 booking request → date recovery → owner approves · 11 Advanced lapse → fallback → reactivate ·
12 publish mistake → version history → preview old → restore.

---

## 6 · Files

```
builder.html               shell · icon sprite · mount points · dev bar
assets/css/wireframe.css    the entire low-fi visual language (one file)
assets/js/builder.js        ~2000 lines · 6 parts: core+data / app-shell / editor / overlays / visitor / events+boot
server.js                   dependency-free static server
BUILDER-PRODUCT-ARCHITECTURE.md   the mental model an engineering team would build from
BUILDER-lowfi-notes.md      this file
```
Untouched from earlier iterations: `index.html`, `assets/css/tokens|base|components|prototype.css`,
`BEDR-DESIGN-SYSTEM.md`, `BEDR-FOUNDATION.md`.

---

## 7 · Known prototype shortcuts (not product gaps)

- Real uploads, real QR, real payment, real backend — not wired. States and insertion points are designed.
- "Add a property" and "Simulate approval" are ⚙-bar stand-ins for the actual Properties flow.
- Drag-reorder works on desktop Layers; mobile uses up/down by design.
- Version **Restore and Preview are real** as of Pass 4 — each published version keeps a full
  `{pages, theme, globals}` snapshot; restore loads it as the draft, preview renders the
  visitor site from it. (Retention window is a backend decision; prototype keeps 12 + genesis.)
- Layout variants: Hero and Properties visibly reflow on the canvas; other sections persist
  the choice without a distinct wireframe rendering (low-fi — a full per-variant render is a hi-fi task).
- Coach marks position against live elements; on very small windows they clamp rather than point precisely.
- Interaction states (hover/active) use theme-safe shifts; a full state spec stays a design-system Gap (`BEDR-FOUNDATION §7`).
