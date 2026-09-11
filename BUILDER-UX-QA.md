# ManagR Website Builder — UX QA & refinement log

**Pass 3** (§1–8): UX polish — hierarchy, spacing, copy, discoverability, consistency,
progressive disclosure, mobile, a11y.
**Pass 4** (§9–16): production sign-off — browser QA, real defect fixes, interaction-model
hardening, deliberate simplification. No new concepts.

The architecture, flows, editor model, ManagR shell and low-fi visual direction are
**unchanged** across both passes. Read with `BUILDER-PRODUCT-ARCHITECTURE.md` (the model,
now incl. §22) and `BUILDER-lowfi-notes.md` (state matrix + assumptions).

---

## 1. Heuristic audit — issues found & fixed

### Layout & spacing (was: ad-hoc inline `margin-top` everywhere)
| Issue | Fix |
|---|---|
| ~9 different spacing values used at random via inline styles | Single scale `--s1..--s8` (4/8/12/16/20/24/32/40). Components consume it; screens use `.group` for the standard gap before a titled block. |
| Editor panels cramped (`padding:9px`, `gap:6px`) | Panel body `12px`, toolbar `52px` min-height + `8px` gaps, inspector groups spaced on the scale. |
| `.list-row` / `.rcard` / `.navrow` each a different height | All snap to `--tap` (40) or `--tap-lg` (44); one `.rcard` shape for choice-cards, checkbox rows and toggle rows. |
| Content column too wide, uneven | `max-width:900px`, consistent `20/16` gutters, `.pagehead` block on every sub-screen. |
| Sub-views (availability, visits, enquiries, requests, analytics) had **no page title** — dumped straight into controls | Every one now opens with `pageHead(title, one-line description)` + "Back to Website". |

### Typographic hierarchy (was: walls of same-size text)
- Base font 13.5→**14px/1.5** (the audience is 45–60).
- Real scale: `h1` 20 · `h2` 16 · `h3` 14 · **`.sub` 13 (supporting text)** · `.tiny` 12 · `.eyebrow` 11 caps.
- Descriptions under titles moved from `.tiny` (11.5, too small) to `.sub`.
- Every screen now has one clear title, one supporting line, then eyebrow-labelled groups.

### Tap targets & accessibility (§44)
- `--tap` 38→**40**, primary owner-flow buttons **44** (`.btn-lg`, sheet footers, `.rcard`).
- Toggle hit area extended 6px beyond the visual switch.
- `:focus-visible` ring + `box-shadow` focus on inputs; toggles show a focus ring.
- Icon buttons carry `title` **and** `aria-label`; destructive ones say "Remove", not just a bin icon.
- No colour-only meaning: chips pair colour with icon/text; availability freshness uses words.
- **Bug found & fixed:** the base `.icon { width:1em }` rule was dropped in the CSS rewrite, so any icon outside a `.btn`/`.chip` rendered at the SVG default 300×150. Restored.

### Buttons & labels (§09)
| Before | After |
|---|---|
| "Continue" (address step) | "Continue to confirm →" |
| "Claim this address" | kept — but preceded by a plain-language confirmation checkbox ("Yes — I've checked the spelling…") and a lock icon |
| "Finish & go live" | "Publish my website" |
| "Fix →" / "Review →" | "Go fix this →" / "Review" · "Dismiss" |
| generic "Add" for sections | "Add a section", cards tagged "+ Add" / "On the page" / "Advanced" / "Needs data first" |
| "Add a property" | unchanged (clear), with a plain "In this prototype, this stands in for the real flow" line |

### Icons (§10)
- Editor left rail: icon-**only** → **icon + label** ("Sections · Pages · Add · Photos · Design · Check · Find"). A non-designer can now read the rail.
- `⌘K` (Mac symbol, meaningless to the audience) → **"Quick actions"** button with a small "(Ctrl-K)" hint.
- Section navigator tools get `title` tooltips; the canvas contextual toolbar ends with an explicit **"✓ Done"**.

### Progressive disclosure (§17) — inspector was a wall of controls
- Content tab now shows **2–4 primary controls**, with the rest inside a
  `<details class="more">` ("More options — …"). Applied to Header, Hero, Properties,
  Highlights, Gallery, Offer, FAQ, Footer.
- Visit settings: the common case (pick days → pick times → which properties) is上front;
  blackout dates / visit types / timing rules are inside "More options".
- Tab renamed **"Data" → "ManagR data"** (§22 — plain language over jargon).

### Global vs local vs data (§21–22)
- Every inspector opens with a **lead line**: *"Editing the Hero banner section on the
  Home page"* — or, for header/footer, a warn-tinted *"This appears on every page.
  Changes here apply everywhere."*
- Layers panel splits **"Sections on this page"** from **"On every page"** with an
  explainer, instead of one flat list + a link-icon chip.
- One **"From ManagR"** chip convention (`.frommgr`) used identically in every place a
  value is read-only — plus "Edit in ManagR →" and "Managed in Properties → Photos".

### Empty / missing / locked (§39, §50)
| State | Copy now |
|---|---|
| Reviews, no reviews | *"Reviews — nothing to show yet. This appears automatically once you have tenant reviews (collected in ManagR → Tenants). Visitors won't see an empty box — the section just doesn't appear."* |
| Gallery, no photos | *"…None of your public properties have photos yet. Add some in ManagR → Properties."* |
| Advanced-locked section on canvas | small dashed block: *"Enquiry form — part of Advanced"* + one line of what it does. Not an oversized card. |
| Enquiries, no enquiries | *"New website enquiries will appear here and in your CRM"* + "Copy your link to share". |

### Advanced-lock consistency (§33) — was 4 different treatments
- One `.advlock` component: **feature name → what it does → what Basic does instead →
  [See what Advanced includes] [Not now]**. Used for whole-area locks
  (availability, visits, enquiries, brand, SEO, analytics).
- Small inline `chip chip-adv` / one-line `callout` kept only for minor in-context
  locks ("Logo · Advanced", "Extra pages are part of Advanced").
- Never a dead end; dismissible; no urgency language.

### Website Home (§35) — answers the 5 questions in one glance now
Replaced the scattered cards with a **status strip**: `Status · Address · Plan ·
Health · Next` — each row one line, with the right action inline. Below it: "This
week" (one plain sentence), a 2-col "Manage" grid, "Recent activity". No dashboard sprawl.

### Analytics (§36) — was a 6-tile month grid
Now: a "This week" list in plain English (*"8 · website visitors / 3 · WhatsApp
conversations / …"*) + one "roughly what it brought in ₹1,10,000 this month" card.

### Availability (§28–29) — kept powerful, made obviously simple
Four numbered steps: **1 What should visitors see?** (whole property / each room type /
every bed, each with a "Visitor sees: …" example) · **2 Numbers or labels?** ·
**3 When a property is full** · **4 Which properties**. The privacy firewall is a
prominent warn-callout headed *"What your website can never show — this is built in,
not a setting"*.

### Site health (§34) — actionable, not anxious
Opens with a single verdict chip (*"Ready to publish — 1 optional improvement"*),
then **Fix these first** / **Worth a look** / **Working well**. Each item names the
problem and links straight to where it's fixed.

### Setup flow (§55) — confidence at every step
- Progress chips (`Address · Confirm · Your info · Live`) on the wizard steps.
- Address hints rewritten warm & specific: *"That one's taken. How about: …"*,
  *"Use lowercase letters, numbers and hyphens only — no spaces or symbols."*
- Confirm step: *"You choose your address once. It goes on your boards and into
  WhatsApp groups…"* + a plain checkbox.
- Finish → a **"Your website is live"** modal with the link + copy/QR/share and
  *"Nothing else to set up — but you can change the wording and look in the editor."*

---

## 2. Interaction patterns standardised

| Pattern | Rule |
|---|---|
| **Choice / checkbox / toggle row** | one `.rcard` shape. `.rc-body` (title) + optional `.rc-sub` (grey, one line). Toggle/checkbox on the right for `.between`, left for lists. |
| **Titled group** | `.eyebrow` label + `.group` top margin. Never a bare control with no heading. |
| **Read-only ManagR value** | `.frommgr` chip + "Edit in ManagR →". Never looks like a disabled input the owner is "missing". |
| **Advanced lock** | `.advlock` for a whole area; `chip-adv` for one control. Always says what Basic does instead. |
| **Destructive action** | Undo-toast by default (hide, remove, move). Confirm dialog only for: discard all draft changes, delete a page, apply a template. Irreversible steps state the consequence in the button-adjacent copy. |
| **Contextual actions on a selected section** | canvas mini-bar (↑ ↓ hide dup remove · Done) on desktop; floating bar (↑ ↓ Edit ✓) + full-screen sheet on mobile. Never hidden behind a mystery icon. |
| **Sub-screen** | `pageHead(title, sub)` + "Back to Website". |
| **Progressive disclosure** | primary controls visible; secondary in `<details class="more">`. |
| **Save feedback** | one quiet `savestate` indicator (`Saving… / Saved / Offline — saved on this device`). No per-keystroke toast. |

---

## 3. Layout / spacing rules (for the eventual hi-fi pass)

```
Spacing scale:   4  8  12  16  20  24  32  40      (--s1 … --s8)
Control heights: 44 primary flows · 40 default · 32 dense secondary
Radius:          5 default · 8 cards/sheets · 999 pills
Borders:         1px --line everywhere; --line-2 for internal dividers
Shadow:          exactly one — popovers/sheets/toasts. Nothing else.
Content width:   900px owner screens · frame widths 1180 / 760 / 390
Editor grid:     rail 66 · left panel 280 · canvas 1fr · inspector 316
Type:            body 14/1.5 · h1 20 · h2 16 · h3 14 · sub 13 · tiny 12 · eyebrow 11
Grouping:        related items 8px apart · groups 20–24px · sections on canvas 16px pad
```
Colour stays grayscale + one accent (`#2f6fed`) + four semantic tints used only for
status. No gradients, no photos, no decorative shadow — deliberately.

---

## 4. Mobile-specific decisions

- **One overlay layer at a time.** Section settings, Add, Pages, Sections list are
  each a full-screen sheet with an explicit title and close; opening one replaces the
  previous rather than stacking.
- **Selected-section controls:** floating bar shows `name · ↑ · ↓ · [Edit this] · ✓`.
  Hide / Duplicate / Remove live in the settings sheet header row (not crammed into the
  floating bar). The on-canvas mini-bar is **hidden on mobile** (it duplicated the
  floating bar).
- Bottom nav: `Sections · Add · Design · Preview · Publish` — 5 slots, 56px tall, icon + label.
- Reorder = up/down arrows only (drag is unreliable on the target's hardware); the
  Sections sheet adds ⤒/⤓ for "move to top/bottom".
- Top bar save-state label shortens on mobile; page name is the tap target for the page picker.
- Dev toolbar re-positioned above the bottom nav so it never covers Publish.

---

## 5. Edge cases addressed this pass (beyond Pass 2)

| Case | Behaviour |
|---|---|
| Availability "per property" list showed all 4 properties regardless of what's published | Now lists public properties first, then non-public ones **disabled** with the reason ("Under review — hidden from your site"). |
| Analytics showed enquiry/visit numbers even on Basic | Basic sees visitors/calls/WhatsApp only; the rest is an `.advlock`. |
| Enquiries list couldn't show its empty state | Tied to `propMode` — with no properties it shows the empty state + "copy your link". |
| Setup "live" moment was just a toast → home | Now a confirmation modal with the link, copy/QR/share, and a calm "nothing else to set up" line. |
| Inspector implied per-breakpoint text edits were normal | Content tab now states plainly: *"Wording here applies at every screen size. Only Layout and Visibility change per screen."* |
| "Data" tab jargon | → "ManagR data". Boundary now unmistakable. |
| Section-navigator "Fixed" chip with no explanation on Basic | → a short callout: *"Fixed layout on Basic. You can change the wording in each section. Advanced lets you reorder…"* |

---

## 6. Remaining product decisions (unchanged from Pass 2 — still need sign-off)

Freshness thresholds (≤3 / 4–10 / >10 days) · default disclosure level (room-type, off,
opt-in) · same-day OTP only · visit defaults (2 per slot / 3h notice / 21d horizon) ·
payment insertion point (after owner approval) · breakpoint pixel values · whether Basic
becomes paid. Full list + rationale in `BUILDER-lowfi-notes.md §4`.

New this pass:
- **Content edits are always base (all-breakpoint); only Layout & Visibility override
  per breakpoint.** This keeps the owner from accidentally maintaining three copies of
  a headline. Confirm this is the right constraint.
- **Editor opens on Phone view by default** (matches what visitors use). Confirm vs
  opening on Desktop view.
- **Recent activity / "this week"** numbers are illustrative — the real feed and metric
  definitions are a product decision.

---

## 7. Self-audit — is each area easy to understand *and use*?

| Area | Understandable? | Usable by a non-tech 50-year-old? | Notes |
|---|---|---|---|
| Website home | ✅ 5 questions answered in the status strip | ✅ one "Next" action with a Go button | |
| Setup flow | ✅ progress chips, plain hints | ✅ 3 taps after unlock, every step reassures | |
| Editor (desktop) | ✅ 4 clear zones, labelled rail | ✅ click section → edit on the right | |
| Editor (mobile) | ✅ canvas + bottom bar + full-screen settings | ✅ whole flow completable on a phone, one sheet at a time | |
| Pages | ✅ name / home / in-menu / hidden | ✅ plain menu, no "route" jargon | |
| Add section | ✅ grouped by plain purpose, previewed | ✅ "+ Add" vs "Advanced" vs "Needs data first" | |
| Inspector | ✅ lead line + 4 tabs + progressive disclosure | ✅ 2–4 controls, "more options" if wanted | |
| ManagR data boundary | ✅ one "From ManagR" convention | ✅ never feels like a missing feature | |
| Theme vs Template | ✅ "look" vs "arrangement", apply-confirm lists what changes/stays | ✅ | |
| Draft / Publish | ✅ Draft chip, "visitors still see published" everywhere | ✅ publish = check → summary → confirm | |
| Version history | ✅ draft / live / older, restore-as-draft | ✅ "your current draft is kept" stated | |
| Advanced gating | ✅ one lock component, says what Basic does | ✅ never a dead end, never nags | |
| Availability | ✅ 4 numbered choices + examples | ✅ | privacy firewall unmissable |
| Visits | ✅ 2 steps up front, rest optional | ✅ big day/time blocks | |
| Enquiries / Requests | ✅ where leads go, recovery path | ✅ | |
| Site health | ✅ one verdict + grouped items | ✅ each links to the fix | |
| Errors | ✅ what happened / what it means / what next | ✅ no codes, no jargon | |
| Empty / loading | ✅ each says what, why, what to do | ✅ | |
| Multi-property | ✅ picker with search + filters | ✅ scales to 40 | |
| Permissions | ✅ 3 roles, proper locked states | ✅ "Ask an Owner" | |
| i18n / long strings | ✅ no fixed-width labels, reflows | — | tested at 360/375/390/tablet/desktop |

---

## 8. What was deliberately **not** changed

The information architecture, the editor's four-zone model, the page/section/global
model, the draft→preview→publish model, version history, the six plan states, the
availability/visit/enquiry/booking-request sub-products, and the wireframe visual
language. Those were validated in Pass 2 and are the reference an engineering team
would build from. This pass made them *obvious*.

---
---

# Pass 4 — production sign-off

Treated the prototype as the version about to be handed to Product / Engineering / QA.
Walked the full owner lifecycle (setup → edit → brand → publish → availability → visits →
enquiries → booking requests → Advanced lapse → network failure → bad publish → restore)
in a browser at 320 / 375 / 390 / tablet / 1300px, in all six plan states and all three
roles. Fixed what was broken, inconsistent, or dishonest. No architecture was replaced.

## 9. Issues found & fixed (browser QA)

| # | Severity | Found | Fix |
|---|---|---|---|
| 1 | **High** | **Version "Restore" was a no-op** — it fired a snapshot and a *"Restored — saved as your draft"* toast but changed nothing. A destructive-recovery flow that silently does nothing. | Every published version now stores a full `snap` ({pages, theme, globals}). Restore loads it as the draft (current draft snapshotted first); "Preview" renders the visitor site from that snapshot with a *"PREVIEW · older version"* badge. Verified: restore an old version → the section that changed actually reverts. |
| 2 | **High** | **Publish summary always said "Minor edits"** — `verSummary()` ran *after* `S.published` was overwritten, so it diffed a copy against itself. Version history was useless ("Minor edits" forever). | Compute the summary before overwriting the baseline. Now reads "Sections", "Theme + header/footer", etc. |
| 3 | **High** | **Inspector "Layout" tab was inert.** Variant buttons (Image left / right / background…), the spacing control, and the "Match desktop" link did nothing on click. One of the four core inspector tabs, dead. | Wired: layout variant sets `block.layout`, persists, and re-renders the canvas (Hero and Properties visibly reflow; others persist the choice). Spacing sets `block.dense` → section padding. Removed the per-device "override / Match desktop" affordance entirely (see §13). |
| 4 | **Medium** | **Coach marks leaked.** Entering the editor then navigating to Website settings left the onboarding card floating over the settings tab bar. `maybeCoach` only *adds* to `#coachRoot`; nothing cleared it on view change. | `render()` clears `#coachRoot` on every non-editor view. |
| 5 | **Medium** | **Website Home header overflowed** the viewport below ~340px — the "View live site" + "Open editor" button row didn't wrap, forcing horizontal scroll; at 375px the title's "Basic plan · free" wrapped to three lines. | `.home-head` wraps; on ≤520px the button row goes full-width with equal-width buttons. 0 horizontal overflow at 320px. |
| 6 | **Medium** | **Prototype dev "flask" button covered the mobile editor's "Publish".** The Pass-3 mobile override (`.dev { bottom:64px }`) was written *before* the base `.dev { bottom:12px }` rule, so source-order beat it. | Moved the mobile override after the base rules; scoped it to `body[data-view="editor"]` at `bottom:120px` so it clears both the bottom bar and the floating section bar. Verified no overlap with the bar or the selected-section float. |
| 7 | **Low** | Enquiry form validation showed only a text line; invalid fields weren't marked. | Empty Name/Phone get `aria-invalid="true"` (red border via existing `.inp[aria-invalid]` rule) + focus moves to the first bad field; cleared on input. Copy → *"Please add your name and phone so the owner can reply to you."* |
| 8 | **Low** | Version label read "Live — current **live**" (redundant with the adjacent `live` chip). `relTime()` capped at hours ("48h ago"). | "Live — current version"; `relTime` now rolls over to "2d ago". |
| 9 | **Low** | Dead code: `ovFlag()` / `.ov-flag` (only consumer was the Layout tab). | `ovFlag()` removed. |

Horizontal-overflow sweep (every owner view × 6 plan states, at 320 / 375 / 1300):
**clean** after fixes. Console across the same matrix: **no errors**.

## 10. Interaction patterns standardised (adds to §2)

| Pattern | Rule |
|---|---|
| **Tab bar** | One `.tabbar` component for Website settings and the Design sheet (scrollable, underline-active). The inspector keeps `.insp-tabs` (4 fixed-width, sticky) — a deliberate variant, not a third implementation. |
| **Layout choice** | Variant buttons = a single-select group; the active one is `btn-primary`. Choosing one applies immediately + re-renders the canvas. No "apply" step, no per-device split. |
| **Version list** | Draft (top, no actions) · Live (Preview only) · older published (Preview + Restore). Restore always: snapshot current → load old as draft → *"publish when you're ready"*. |
| **Success copy** | States what changed. Never "Done" / "Restored" without saying *what* — and never a success message for an action that didn't happen (see §9.1). |

## 11. State coverage confirmed this pass

Re-verified every row of `BUILDER-lowfi-notes.md §2` in the browser. Additionally checked:
version **Restore** and **Preview** (now backed by real snapshots), the genesis "Site
created" version present on first load, publish summary wording per change type, coach-mark
lifecycle across view changes, and the dev-tool position in editor vs. app views on mobile.

## 12. Responsive issues fixed

- Website Home header: stacks on ≤520px (was overflowing ≤340px, wrapping badly at 375).
- Dev tool: repositioned on mobile so it never covers the bottom bar or the floating
  section bar in the editor.
- Full sweep (owner views × {320, 375, 1300} × 6 plans): no page-level horizontal scroll.
  Settings/Design tab bars scroll *within their own container* by design.

## 13. Accessibility decisions

- Enquiry (and the pattern for all visitor forms): invalid fields get `aria-invalid`,
  focus moves to the first error, error text is specific and human.
- Layout variant buttons are real `<button>`s in a labelled group; active state is not
  colour-only (it's the filled `btn-primary` treatment + position).
- Everything from Pass 3 holds: 44px targets in owner flows, `:focus-visible` rings,
  icon buttons with `aria-label`, no colour-only status, text reflow (verified to 320px).

## 14. Engineering simplifications (fewer things to build)

- **Per-breakpoint overrides removed from v1.** Content and layout are single-value.
  Only per-section visibility is per-screen. The `overrides` field stays in the model
  but is never written — a clean seam for a future "customise for phones" opt-in.
  This deletes an entire class of state (three-way cascade, reset affordances,
  "changed for mobile" flags) from the build.
- **One tab-bar component** instead of three ad-hoc implementations.
- **Version snapshots** are plain deep copies of `{pages, theme, globals}` — no diffing
  engine, no DOM replay. Restore = assign; Preview = render from the copy.
- The canvas device switcher is explicitly **preview-only** — no "editing context"
  branching in the inspector.

## 15. Remaining product decisions (need Product/Eng sign-off — not UX gaps)

Unchanged from Pass 3 §6 and `BUILDER-lowfi-notes.md §4`:
freshness thresholds · default disclosure level · same-day-only OTP · visit defaults
(2/slot, 3h notice, 21d horizon) · payment insertion point · breakpoint pixel values ·
whether Basic becomes paid · draft-preview link access control.

New from Pass 4:
- **Confirm layout/content are all-screens in v1** (this pass's simplification). If a
  future need for per-phone layout appears, the `overrides` seam is ready — but shipping
  without it keeps the mental model to "one site, shown at three sizes".
- **Version retention:** prototype keeps 12 published versions + genesis. Real retention
  window / storage cost is a backend decision.
- **`relTime` / activity feed** values are still illustrative.

## 16. Sign-off checklist (§48)

| | |
|---|---|
| Existing architecture preserved | ✅ nothing replaced; §1–21 intact |
| All primary workflows (desktop + mobile) | ✅ walked end-to-end in browser |
| Pages / sections / templates / themes / global settings | ✅ |
| ManagR data boundary clear | ✅ one "From ManagR" convention, "ManagR data" tab |
| Inventory privacy | ✅ render-layer firewall, restated at publish |
| Visits / enquiries / booking requests (incl. recovery) | ✅ |
| Advanced gating / 6 plan states / graceful lapse | ✅ one lock component; nothing deleted on lapse |
| Draft / publish / version history / **restore** | ✅ restore now backed by real snapshots |
| Errors / empty / loading / conflict / offline | ✅ what happened / what it means / what next |
| Multi-property (to 40) | ✅ picker with search + filters |
| Accessibility / i18n considered | ✅ 320px reflow, aria-invalid, focus, no colour-only |
| Browser layout + mobile widths checked | ✅ 320/375/1300, 6 plans — 0 overflow, 0 console errors |
| Spacing / components / terminology standardised | ✅ one scale, `.tabbar`, `.rcard`, `.advlock` |
| No dead ends / no inert controls / no dishonest feedback | ✅ Layout tab wired, Restore real, summaries honest |
| Visual style still low-fidelity | ✅ grayscale + one accent, 1px borders, one shadow |
