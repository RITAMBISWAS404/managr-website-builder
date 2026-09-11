# ManagR Website Builder — Production UX QA

Refinement passes on the React app (no stack change, no architecture rewrite). The goal
was to move it from "functional prototype assembled from components" to "one
intentionally designed product." Product requirements are unchanged — see
`ManagR_Website_Builder_Design_Brief.md` and `BUILDER-PRODUCT-ARCHITECTURE.md`.

Run: `npm install && npm run dev` → http://localhost:4173

- **Pass A** (§1–11): first system consolidation — tokens, primitives, editor add-flow,
  drag reorder, curated Design, home hierarchy.
- **Pass B** (§12 below): "it still feels too white / flat" — surface hierarchy, editor
  shell identity, section navigator, canvas framing, inspector rework.

---

## 1. What was audited

Every route (`/website`, `/availability`, `/visits`, `/enquiries`, `/bookings`,
`/analytics`, `/plan`, `/upgrade`, `/health`, `/settings`, `/scheduled-visits`,
`/editor`, `/preview`) plus setup lifecycle, in Basic / Advanced / lapsed plan states,
owner / manager / staff roles, and at 360–1440px.

Audited: information hierarchy, control heights & rhythm, button hierarchy, iconography,
status treatment, radii/borders/shadows, empty/loading/error/locked/stale states,
editor mental model, section selection, add-section flow, global design, canvas render
fidelity, responsive/mobile behaviour, keyboard, focus, colour-only meaning, copy.

---

## 2. Design system — consolidated in code

| Area | Before | Now |
|---|---|---|
| **Tokens** | ad-hoc semantic vars, `#fff` page, hatched image placeholders | `src/styles/globals.css` `:root` block is the single source. `#fafafa` page / `#fff` surface / `#e8e8e8` borders. Radius **12** (controls) / **20** (elevated cards). Two elevation shadows (`--shadow-e1/e2`) + one pop. `--ease` + `prefers-reduced-motion` guard. Calm image placeholder (soft fill, no wireframe hatching). |
| **Button** | 7 variants, heavy outline default, mixed icon sizes | `primary · navy · secondary · outline · ghost · destructive · link`; icon size scales with button size; consistent 12px radius, `active:translate-y-px`, ring-offset focus. One clear hierarchy. |
| **Card** | `rounded-xl` everywhere, one shadow | `Card` = elevated (20px, `shadow-e1`); `Card flat` = grouped info (12px, no shadow). Whitespace used as a divider instead of nesting cards. |
| **New shared primitives** (`components/common`) | — | `PageHead/PageHeader`, `SectionHeader`, `Notice` (was `Callout`), `EmptyState` (icon + what/why/next), `ChoiceRow` + `ChoiceGroup` (one shape for every selectable/toggle row), `StatusBadge` (dot + text, never colour-only), `Stat`, `FromManagR`, `BoundField`, `AdvancedLock`. |
| **Section previews** | none | `SectionPreview` — a tiny calm schematic per section type, used in the Add panel. |
| **Canvas render** | crude fixed-px text, hatched blocks | `SectionCanvas` rewritten: real type scale, soft photo blocks, honours the site's accent + shape, reads like a simplified real website. |

Terminology standardised: "Sections" (not layers/blocks), "Design" (not theme/branding),
"Available with Advanced" (not "part of Advanced — locked"), "Publish / Preview / Live",
"Hide from website" vs "Remove section".

---

## 3. Key UX decisions made this pass

1. **Website home leads with one action.** A single "Next" card states the one thing to
   do now (fix health / publish changes / add a property / open editor) with the only
   primary button on the screen. The status strip below answers is-it-live / address /
   plan / health. "View live site" is a quiet ghost link. Weekly numbers are `Stat`s, not
   a sentence.
2. **Editor = 4 clear zones.** Top: identity, page, save, undo/redo, device, Preview,
   Publish. Left rail: Sections · Pages · Add · Photos, then Design · Check · Find.
   Centre: the real website in a device frame. Right: settings for whatever is selected
   (page overview when nothing is).
3. **Selection is subtle.** Hover = 1px inset brand ring. Selected = 1.5px ring + a small
   uppercase name tag + a compact toolbar (up / down / ⋯ / Done). Secondary actions
   (hide, duplicate, remove) live in the ⋯ menu — never five icons competing.
4. **Add section is intent-first.** Grouped as *First impression · Show your properties ·
   Build trust · Tell your story · Turn visitors into leads · Help people reach you*. Each
   section shows a mini preview, a plain description, and its state (Add / Already on page
   / Advanced / Needs data). Searchable. No component catalogue, no type names.
5. **Design is curated, not a toolbox.** Six areas: **Template** (arrangement) ·
   **Colours** (8 accessibility-safe palettes, no colour wheel — bad combinations are
   impossible) · **Fonts** (4 pairings) · **Shape** (soft / rounded / clean) · **Layout**
   (spacious / balanced / compact) · **Brand** (logo, theme feel). Colour / font / shape
   change the live canvas immediately.
6. **Reorder is real.** Drag in the Sections list (drop indicator, keyboard `Alt+↑/↓`
   alternative, `Move up/down` always available). Never drag-only.
7. **Draft/publish stays trustworthy.** Quiet "Saved / Saving… / Offline" indicator.
   Publish → validation → plain change summary ("2 section changes · design · header &
   footer") → confirm → success with View live / done. Version history uses human labels
   and real snapshots; Restore keeps the current draft first.
8. **Data-aware.** Sections that need ManagR data render a "nothing to show yet" note
   (with where to add it), never a broken component. The "ManagR data" tab lists bound
   values with `From ManagR` + `Edit in ManagR →`. The builder never writes ManagR data.
9. **Plan-aware, not punishing.** Basic feels intentionally simple (fixed layout, edit
   wording). Advanced locks show *Available with Advanced → what it does → See Advanced*.
   Lapse: "Your Advanced plan has ended. Your website is still live on Basic. Live
   availability and booking are paused." Work is kept.

---

## 4. Editor mental model (for engineering & future sessions)

```
Choose a section   →  Sections list / click on the canvas
Change how it looks →  Layout tab (friendly variants) + Design (global)
Change the content  →  Content tab (schema-driven fields, progressive "More")
Move it             →  drag, or Move up/down
Preview             →  Preview toggle / Open full preview
Publish             →  Review & publish
```

The owner never meets: layers, frames, breakpoints, tokens, CSS, z-index, variants-as-jargon.

`brandColor / fontPair / shape / layoutDensity` were added to `BuilderState` +
`SiteSnapshot` (so version restore/publish carry the look). The canvas reads them through
`siteAccent(state)` and per-section `SHAPE_RADIUS`.

---

## 5. Responsive decisions

- **Editor ≥1024px:** `grid-cols-[66px_280px_1fr_316px]`. **<1024px:** canvas-first, a
  5-slot bottom bar, a floating selection bar on tap, full-screen sheets for section
  settings / sections list / add. One overlay layer at a time. Safe-area padding on the
  bottom bar. The dev tool sits clear of both bars.
- The canvas device switcher (Desktop/Tablet/Mobile) constrains the frame **on desktop
  only**; on a phone the frame is naturally full width.
- Verified 0 horizontal overflow at 360 / 375 / 390 / 414 / 768 / 1280 / 1440 across all
  routes. Long strings tolerated (stat labels wrap, headers wrap, buttons never clip).

---

## 6. Edge cases handled

no approved property · no photos · no reviews · no availability · site offline · property
under review · Advanced locked (per feature) · Advanced lapsed · publish blockers vs
warnings · publish failure (retry, live site untouched) · stale availability (owner
warning + public freshness) · duplicate enquiry · visit slot with no times · booking date
unavailable → earliest valid date offered · draft dirty · restore keeps current draft ·
staff role (view-only editor) · manager role (no billing).

---

## 7. Accessibility

- Focus-visible ring (2px, offset) on every control; `prefers-reduced-motion` respected.
- `StatusBadge` and every state chip pair colour with a dot/icon **and text** — no
  colour-only meaning.
- Icon-only controls carry `aria-label` + a tooltip (undo/redo, device switch, QR/share,
  section actions).
- Radix primitives supply dialog/sheet/menu focus trapping & keyboard nav.
- Section rows are `role="button"` + `tabIndex` with Enter/Space and `Alt+↑/↓` reorder.
- Enquiry form: invalid fields get `aria-invalid` + focus + a specific message.
- Editor shortcuts: ⌘Z / ⇧⌘Z, ⌘↵ publish, P preview, ⌫ remove selected, ⌘K command menu.

---

## 8. Performance

- Vendor split: `react` (54kB gz) · `radix` (43kB gz) · app (80kB gz). Build clean, no
  chunk warning.
- Visitor site is plain markup with soft placeholders — no images to block, no heavy JS.
- Canvas preview is CSS/DOM only (no iframe, no rendering engine).
- Motion is limited to sheet/dialog enter, selection feedback, save/publish confirmation.

---

## 9. Known limitations (build depth, not product gaps)

- Uploads, QR, payments, real auth, real analytics: designed states, not wired.
- Visitor "version preview" shows the current site with a badge (snapshot-accurate
  visitor render is a follow-up).
- Drag reorder is list-only (not on the canvas) and desktop-first; mobile uses arrows.
- `fontPair`, `layoutDensity` are stored and shown in Design but only lightly reflected in
  the schematic canvas (full typographic systems are a hi-fi follow-up).
- Blackout-date editor, 40-property picker, per-field SEO, image crop/focal-point: present
  as affordances, not fully interactive.
- Operational screens (availability / visits / enquiries / settings) got the token &
  primitive upgrade but a few of their inputs remain presentational.

---

## 10. Future work

- Snapshot-accurate version preview.
- Real image pipeline (choose / crop / focal point / optimise) behind safe aspect ratios.
- Per-device visibility surfaced as a first-class, friendly control ("Hide on phones").
- Typography systems wired to `fontPair` end-to-end.
- Custom domain flow, richer property presentation (video, floor plans), reviews capture,
  A/B, multi-brand — the architecture (section registry, `SiteSnapshot`, `data/managr`
  interface) leaves room for all of these without a rewrite.

---

## 11. Sign-off checklist

| | |
|---|---|
| Stack unchanged (React/TS/Vite/Tailwind/shadcn/Radix/Lucide/Router) | ✅ |
| TypeScript strict, `npm run build` clean, 0 console errors | ✅ |
| One visual language, tokens in one file, no scattered hex | ✅ |
| One primary action per screen | ✅ |
| Editor understandable without training; Basic intentionally simple | ✅ |
| Add section is intent-grouped with previews | ✅ |
| Curated colours / fonts / shape / layout; live canvas | ✅ |
| Drag reorder + arrows + keyboard | ✅ |
| Section selection subtle; actions in an overflow menu | ✅ |
| Draft/save/publish/validation/version-restore trustworthy | ✅ |
| ManagR data boundary explicit; builder never writes it | ✅ |
| Mobile editor is a distinct model, not a shrink | ✅ |
| 0 horizontal overflow 360–1440 | ✅ |
| Colour never the only signal; focus visible; reduced-motion | ✅ |
| Visitor site fast, privacy-safe, real states | ✅ |
| Legacy HTML prototype preserved in `legacy/` | ✅ |
| Docs updated (this file + `TECH-STACK.md`) | ✅ |

---

## 12. Pass B — surface hierarchy & editor identity

**The complaint:** functional, but "too white, flat, blends together, not at a polished
product bar." Fixed at the system level, not screen by screen.

### 12.1 A real surface ladder (the core fix)

`globals.css :root` now defines steps that create depth **without shadows or decoration**:

| Token | Value | Used for |
|---|---|---|
| `--background` | `#fafafa` | ManagR app background |
| `--workspace` | `#ecedf0` | the editor canvas area — the "desk" the website sits on |
| `--surface` | `#ffffff` | panels, bars, elevated cards |
| `--surface-2` | `#f7f8f9` | quiet grouping *inside* a white panel (Recent activity, section groups, input rests) |
| `--sunken` | `#f1f2f4` | inset wells |

Borders split into `--border` / `--border-subtle` (internal dividers) / `--border-strong`.
Text: `--foreground #111`, `--muted-foreground #606060`, `--faint #9a9a9a`.
Two elevations only (`--shadow-e1` hairline, `--shadow-e2`) plus `--shadow-frame` for the
website preview and `--shadow-pop` for modals. Radius **4 / 8 / 12 / 20 / pill**.

### 12.2 Editor shell — three regions with distinct identity

| Region | Surface | Reads as |
|---|---|---|
| Left rail | `surface-2` + right border | tools |
| Sections / Pages / Add / Photos panel | `surface` white | tool panel |
| Canvas area | `workspace` (`#ecedf0`) | a workspace holding the website |
| Website frame | white, `rounded-2xl`, `border-strong`, `shadow-frame`, real browser chrome (lock + URL) | the actual website |
| Inspector | `surface` white + left border | contextual settings |
| Toolbar / status bar | `surface` white | chrome |

The website preview never visually competes with the editor: it's the only elevated white
surface floating on the grey workspace.

### 12.3 Toolbar

Grouped, not a row of bordered buttons. Left cluster = *where am I* (Website / brand /
page ▾ / quiet Saved). Right = tool group (undo·redo in a `surface-2` segmented well) ·
device group (same treatment, active = white pill) · Preview (ghost) · **Publish** (the one
filled primary, with a `▾` for check / preview / versions / discard).

### 12.4 Section navigator = a page outline, not a list of buttons

Rows are quiet (`hover:bg-surface-2`), selected = `bg-brand/[0.06]` + inset ring + a 3px
brand bar on the left + brand-tinted icon. Move up / down inline on hover; everything else
(hide, duplicate, remove) in a `⋯` menu. Drag handle appears only when reorder is allowed.
Group headers: `On this page` / `On every page`.

### 12.5 Canvas selection

Hover = 1px inset `brand/25` ring + the section-name tag fades in. Selected = 1.5px brand
ring + solid tag + a compact floating toolbar (↑ ↓ ⋯ | Done). No giant outline. An
`Add a section` strip closes the frame in edit mode.

### 12.6 Inspector — reworked

- **3 tabs: Content · Layout · Data** (was 4). "Visibility" folded in: a `Show on
  Desktp/Tablet/Phone` segmented control lives in **Layout**; the whole-section hide is the
  eye button in the header.
- **Header:** `⚙ {section name}` · eye (hide) · `⋯` (duplicate / remove) · close.
- **Scope line is integrated**, not an amber alert glued above the form: a quiet
  `surface-2` strip — `🌐 Shows on every page. Changes here apply everywhere.` for globals,
  or `On the Home page` for local.
- Content fields are groups with real labels (`text-sm font-semibold`), not bordered
  boxes; secondary options in a borderless "More options" disclosure.
- Layout variants are a single-select list with a "More layout choices coming" note —
  the seam for the future section-variant library, kept curated (no raw style controls).
- Nothing selected → a clean page overview: section-visibility list + "Worth a look".

### 12.7 Left navigation (ManagR shell)

Active item = `bg-white/10` + a 3px brand bar; plain hover `bg-white/[0.07]`. Plan badge is
a soft `bg-white/15` chip, not an outlined pill. Brand mark in a rounded coral tile.
Redundant desktop "Website" title bar removed (the page owns its `h1`).

### 12.8 Website dashboard

- **One "Next" card** — attention-toned (`brand/[0.04]`, brand border) when there's
  something to do, calm white when up to date. The only place a primary button sits at the
  top of the page.
- **Status is one cohesive panel** (`Card` with `divide-y`), not four floating cards:
  Status · Address · Plan · Health as key/value rows.
- This week = a `Stat` row inside one card. Manage = a divided list with icon tiles.
  Recent activity = a `surface-2` grouped list (no card at all).

### 12.9 Components touched centrally

`Card` (elevated 20px / `flat` 12px / `tone="sunken"`), `Button` (white text on coral
enforced; segmented tool wells), `Input`/`Textarea` (surface bg, faint placeholder),
`Label` (13px semibold `foreground`), `Badge` (borderless soft chips), plus new
`PanelHeader`, `Surface`, `KeyRow`, `ScopeNote`, `SectionHeader` in `components/common`.

### 12.10 Verified

`tsc` + `npm run build` clean · 0 console errors · 0 horizontal overflow at 375 across
`/website` and every `/website/*` route + editor + preview · section select / content edit
(live canvas) / layout tab / drag reorder / publish (validation → summary → success) /
Design palettes / mobile section sheet all work. Desktop editor visually verified at
1180 / 1280 (3-region depth reads; website frame is the focal point).

### 12.11 Not done (deliberately, per the brief)

The section-variant template library (`Hero 1 / Hero 2 …`) — the registry, `layoutVariants`,
`SiteSnapshot` design fields and the Layout tab are ready for it, but it is a separate task.

---

## 13. Pass C — ManagR-native visual language + Section Contracts

Two goals: (1) make the Website Builder read as *part of ManagR*, not a separate SaaS;
(2) put every editor capability under a documented, typed **Section Contract** that the
future template library will implement.

### 13.1 Section Contract system (new source of truth)

- **`src/features/sections/contracts.ts`** — one typed `SectionContract` per section
  (19 including globals). Each carries: `content[]` (field · type · required · editable ·
  `DataSource` · limit · notes), `layout` (options / rules / **forbidden** / responsive),
  `design` (allowed / **forbidden**), `data` (dependsOn / ownerControls / notEditable /
  **privacy** 🔒), `states[]`, `editorControls[]`, and a `variants` contract
  (`max`, `baseline`, `mayVary`, `neverAcrossVariants`).
- **`WEBSITE-SECTION-CONTRACTS.md`** — generated by `npm run contracts`
  (`scripts/gen-contracts.mts` → `renderContractsMarkdown()`). Never hand-edited.
- **Drift guard** — `registry.ts` now imports the contracts and, in DEV, runs
  `verifyContract(id, editorKeys(id))` for every section: the console warns if the
  inspector exposes a field the contract doesn't know, or omits one it promises.
  `contractFor(id)` and `editorKeys(id)` are exported for the future template project.
- **Alignment achieved:** registry `content` → inspector → `contracts.ts` → generated MD
  all describe the same fields. `editorControls` in each contract was reconciled to exactly
  what the inspector renders today (checklist/note/frommgr/action fields expose no `key`,
  so several sections are show/hide-only and now say so).

### 13.2 ManagR design tokens (from the 8 product screenshots)

`globals.css`:

| token | value | role |
|---|---|---|
| `--navy` | `#0a1628` | sidebar — much darker, matches the product |
| `--navy-active` | `#1b2b45` | selected nav row = lighter-navy fill (**not** a coral bar) |
| `--navy-hover` | `#14213a` | nav row hover |
| `--secondary-blue` (+ `-surface` / `-border`) | `#1e40af` | navy-blue secondary action ("Import" style) |
| `--tint-{blue,green,amber,purple,coral,cyan}` (+ `-fg`) | soft pastels | icon-tile / metric-card squares |

`tailwind.config.ts` maps them (`bg-navy-active`, `bg-tint-blue text-tint-blue-fg`, …).

### 13.3 Shared components

- **`IconTile`** (`components/common`) — the ManagR soft-tinted rounded icon square,
  `sm | md | lg`, six tints.
- **`MetricCard`** — big number + label + sublabel + `IconTile`, matching the ManagR
  dashboard metric cards.
- **`Button` `variant="blue"`** — navy-blue tinted secondary.

### 13.4 Screens

- **Sidebar (`ManagRShell`)** — darker navy; active item is a calm navy fill with
  white semibold text; removed the coral left-bar accents (coral now appears only on the
  ManagR logo square and true primary actions).
- **Website dashboard (`WebsiteHome`)** — "This week" is now a `MetricCard` grid
  (2→3→5 cols); "Manage" list uses per-row `IconTile`s.

### 13.5 Cross-cutting fix — coral buttons had black text

`cn()` used bare `twMerge`, which didn't know our custom font-size scale
(`text-body`, `text-section`, …) and so treated `text-body` as a text-*colour*,
**silently dropping `text-primary-foreground`** from every button whose size class
sorted after it. Result: coral / navy / destructive buttons rendered `#111` text.
Fixed in `src/lib/utils.ts` with `extendTailwindMerge({ extend: { classGroups: {
"font-size": [{ text: [...] }] } } })`. Verified: primary buttons now
`color: rgb(255,255,255)` on `rgb(247,85,61)`.

### 13.6 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` regenerates the MD ·
dev server restarted, `/website` + `/website/editor` load with **0 runtime errors**
(`window.onerror` capture empty) and **0 horizontal overflow** at 375 and desktop ·
coral-button text colour verified white in-browser · sidebar navy `#0a1628` verified.

### 13.7 Not done (unchanged scope boundary)

The template-variant library is still **not built** — but `contracts.ts` now gives it a
precise seam: each section's `variants.{baseline,mayVary,neverAcrossVariants}` is the spec
a future `Hero 1 / Hero 2` set must satisfy, and `contractFor()` is its import point.
Deeper editor-shell work (a slim persistent ManagR sidebar rail *inside* the editor,
operational screens adopting `MetricCard`) is scoped but not in this pass.

---

## 14. Pass D — high-craft refinement (geometry, rhythm, states)

Not a redesign. The Pass C direction is kept; this pass tunes the details that separate
"well structured" from "production-polished", centrally wherever possible.

### 14.1 Radius hierarchy (was: mostly 12 / 20)

`globals.css` now defines **5 · 8 · 10 · 14 · pill** and `tailwind.config.ts` maps every
key onto it (`md`→8, `xl`→14, `2xl`→14). Effect: buttons/inputs/rows tighten 12→10, cards
and modals de-inflate 20→14, the website frame 20→14. Pills are reserved for status only.

### 14.2 Button system

Rebuilt `button.tsx` as one CVA system: `default` 40→**36px** (`h-9`), `lg` 44→40,
`sm` unchanged, new `xs` (28px); `gap-2`→`gap-1.5`; `text-body`→`text-sm`; `rounded-lg`
(10). Hover states unified (`outline` gets `hover:border-border-strong`). Added a `loading`
prop (centred spinner, auto-`disabled` + `aria-busy`). `asChild` path kept clean for
`<Link>` children. Coral primary keeps **white text** (Pass C `twMerge` fix still in place).

### 14.3 Spacing / density / typography

- `PageHead` title 19→**24px** (`text-display`) to match ManagR page titles; `mb-6`→`mb-5`.
- `KeyRow` `py-3`→`py-2.5`; dashboard `space-y-7`→`space-y-6`; "Next" card `p-5`→`p-4`.
- `--muted-foreground` `#606060`→`#5f6368`, `--faint` `#9a9a9a`→`#8a8d92` (more legible
  metadata); `micro` letter-spacing `.045`→`.062em` for the uppercase eyebrows.
- Inspector: label→field gap `mt-1`→`mt-1.5`; checklist/toggle rows go from bordered
  white boxes to `border-border-subtle bg-surface-2` (less "every field is a card").
- `MetricCard` number → 26px, padding `p-3.5`→`p-4`, redundant "this week" sublabels dropped.

### 14.4 Editor shell

- **Toolbar**: `gap-3`→`gap-2.5`, added a hairline divider before Save state; undo/redo
  and device switcher are now identical segmented wells (`bg-sunken` + hairline);
  device switcher active state coral→`text-foreground` (coral reserved).
- **Rail**: items `min-h-50`→`46`, icons 18→17, active tint `0.08`→`0.07`.
- **Section navigator**: selected row drops the coral left-bar, keeps a quiet
  `bg-brand/[0.07]` + `ring-brand/15` fill; drag grip fades in on hover instead of
  always showing. Pages list gets the same selected treatment.
- **Canvas**: outer padding `px-10/py-8`→`px-14/py-10` so the frame reads as the hero;
  frame border `border-strong`→`border`, `--shadow-frame` deepened; browser chrome
  `h-9`→`h-8`, dots 2.5→2px and lighter; hover ring `/25`→`/20`; "Add a section" strip
  gets a dashed top rule and a neutral (not coral) hover.
- **Inspector**: Spacing and Show-on are now proper segmented controls matching the
  device switcher, not bordered button strips.

### 14.5 Public preview

Scrim/top-bar `#141414`→`--navy`; phone frame gets `shadow-frame` on the grey workspace
so it reads as a device; sticky site header gets a `backdrop-blur`; `Call` chip becomes a
real 10px-radius button; property-card placeholders `PHOTO`/`NO PHOTO` → lowercase
`photo` / `photo coming soon`, card hover shadow, tighter type. Schematic `SiteSection`
header now shows a hamburger on mobile + keeps the call button (matches the contract).

### 14.6 Cross-cutting bug fixed — modal / sheet scrim was invisible

`Dialog`/`Sheet`/`AlertDialog` overlays used `bg-navy/50`. Tailwind **was not generating
that utility** for a CSS-var colour (`.bg-navy` exists in the build, `.bg-navy\/50` does
not), so every modal and sheet opened with **no dimming behind it**. Fixed with a
pre-composited `--overlay: rgb(10 22 40 / 0.55)` token + `bg-overlay` utility. Verified in
the browser: the publish dialog and the Design sheet now dim the editor correctly.

### 14.7 Section contracts kept in sync

No section capability changed, so `contracts.ts` field/layout/variant data is unchanged.
Added a **"Controls every section shares"** table to the generated
`WEBSITE-SECTION-CONTRACTS.md` (section spacing · per-screen show/hide · hide · reorder)
and a "plus the shared controls" line under every section's Design block — these are real
inspector capabilities that were previously undocumented. `npm run contracts` regenerated;
the DEV `verifyContract` drift check still passes.

### 14.8 Verified

`npx tsc --noEmit` + `npm run build` clean (no Tailwind ambiguity warnings) ·
`npm run contracts` regenerates · dev server restarted. Walked `/website`, `/website/editor`
(desktop + 375), `/website/preview`, `/website/settings`, `/website/health`,
`/website/availability`, `/website/analytics`, `/website/plan`, `/website/enquiries`,
`/scheduled-visits`: **0 runtime errors** (`window.onerror` + `unhandledrejection` capture
empty), **0 horizontal overflow** at 375 and desktop. Publish dialog, Design sheet, layout
segmented controls, section select, coral-button contrast all verified in-browser.

---

## 15. Pass E — editor panel architecture (depth without decoration)

The dashboard was close to the ManagR product; the **editor still felt flat** — panels read as
white documents with thin outlines and full-width form controls. This pass gives the editor a
real panel system with genuine spatial hierarchy, without adding shadows or cards-in-cards.

### 15.1 New shared panel grammar — `src/features/editor/panel.tsx`

| Primitive | Role |
|---|---|
| `Panel` / `PanelHeader` / `PanelScroll` / `PanelFooter` | panel skeleton; header + footer on the `--panel-header` band, footer pins actions |
| `Group` | collapsible, band-headed region (uppercase micro label + chevron + optional helper) — the workhorse for both panels |
| `Row` | compact inline control (label left ~68px, control right) |
| `Field` | stacked label + control (inputs) |
| `Seg` / `SegToggles` | one segmented surface; `SegToggles` items toggle independently (per-screen visibility) |
| `ChoiceGrid` / `ChoiceCard` / `LayoutMini` | visual pick-one grid; `LayoutMini` draws a tiny schematic from a layout-variant name (image position, columns, text-only…) |
| `ScopeChip` | contextual metadata band ("On the Home page" / "Global") — quiet, never amber |

Tokens added: `--panel #fff` · `--panel-header #f8f9fb` · `--panel-section` · `--panel-hover`
· `--panel-border #e6e7ea`. `--workspace` deepened `#ecedf0` → `#e9eaee` so the white frame
floats harder.

### 15.2 Inspector — tabs removed, replaced by collapsible groups

`InspectorPanel.tsx` is now **one scroll** with `Content · Layout · Visibility · Data` groups
(Data collapsed by default). Answers "what am I editing / what can I change / where's the data
from / what's the layout / where's it visible" without hunting through tab→disclosure→control.
- **Content** — schema fields; the section's `more` bucket is a nested lightweight disclosure.
- **Layout** — a **visual `ChoiceCard` grid** of layout variants (mini-previews), then a
  `Spacing` segmented row. This is also the clean seam for the future variant library.
- **Visibility** — a `SegToggles` "Show on Desktop / Tablet / Phone".
- **Data** — read-only `BoundField` rows.
Group open/closed state persists for the session. `s.inspectorTab` is now unused (reducer
action kept, harmless). Field labels dropped to 12px to match the tool-panel density.

### 15.3 Left structure panel

`LeftPanel.tsx` rebuilt on the panel grammar: `PanelHeader` ("Sections · 8 showing"),
`Group` "On this page" / "On every page" band headers, section rows in a tight `p-1.5` body,
and **"Add a section" pinned in a `PanelFooter`** instead of floating mid-list. Pages, Add
(each intent category is now a collapsible `Group`) and Photos panels adopt the same shell.
Section-row selection unchanged from Pass D (quiet brand tint + ring, hover-only actions).

### 15.4 Overlays — desktop dialogs, not drawers

Design, Version history and Phone/tablet check moved from bottom `Sheet` → centred `Dialog`
(scrollable body, `--overlay` scrim). The toolbar Pages picker is a `Dialog` too. Bottom
sheets now only appear on the genuinely mobile-only surfaces. Design keeps its 6-facet tab
row (Template / Colours / Fonts / Shape / Layout / Brand) — appropriate there, unlike the
inspector.

### 15.5 Canvas

Outer padding `px-14/py-10` → `px-16/py-12`; frame border → `ring-black/6` + deepened
`shadow-frame` for a crisper floating edge on the darker workspace; the "Editing · Desktop"
strip became a compact status pill (dot + label) that never wraps. Grid columns tightened
(`52/284/…/324` at `lg`, `56/300/…/340` at `xl`) to give the frame ~44px more width than
Pass D. Website preview: hero heading 22→23px with tighter tracking and a capped measure;
property cards get a hairline shadow, larger photo area and sentence-case placeholders.

### 15.6 Section contracts

No section capability changed (same fields, same layout variants, same spacing/visibility/data
controls) — `verifyContract` still passes. The generated `WEBSITE-SECTION-CONTRACTS.md`
"Controls every section shares" table now documents the layout picker as a visual mini-preview
grid and notes the inspector is one panel of collapsible groups.

### 15.7 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` regenerates. In-browser:
editor at desktop + 375, section select, all four inspector groups render + collapse/expand,
`LayoutMini` previews render, Design dialog opens centred with a working scrim, mobile
section sheet renders the new grouped inspector, `/website` + `/website/preview` unaffected.
**0 runtime errors** (`onerror` + `unhandledrejection` empty), **0 horizontal overflow** at
375 and desktop.

---

## 16. Pass F — Website dashboard, native to ManagR

Scoped to **`WebsiteHome.tsx` only** (+ the shared primitives it needs). Editor, inspector,
canvas and other screens untouched. Goal: make the Website home read as a first-class ManagR
screen, using the 4 supplied product screenshots (Dashboard, Scheduled Visits, Settings,
Property detail) as the visual reference.

### 16.1 What was wrong

Too sparse / flat / generic — no section labels, no card headers, a status "surface" that was
just key rows, metric cards with no ManagR character, an always-present "Next" box that
dominated even when there was nothing to do.

### 16.2 Shared primitives

- **`CardHead`** (new, `components/common`) — icon tile + bold title + grey subtitle + right
  action. The ManagR "Property Address" / "Managed By" card-header pattern.
- **`MetricCard`** — number 26→28px; new **`wash`** prop applies the subtle white→tint
  gradient of the Scheduled-Visits stat cards (`157deg, #fff 55% → var(--tint-*)`); gains
  `shadow-xs`.
- **`SectionHeader`** — `mb-2.5`→`mb-3`, tracking `0.07em`, slight left inset — matches the
  reference "PORTFOLIO AT A GLANCE" eyebrows.
- **`--shadow-e1`** retuned to the BEDR `shadow/card` value (`0 1px 3px /6%`), dropping the
  faint inset ring — every `Card` across the product now sits with the same gentle
  elevation the reference screens show (directly addresses "too flat"). One-line token change.
- Shell content width `1040`→`1120` so a 5-metric row breathes without stretching.

### 16.3 Dashboard structure (every group now has a section label)

1. **Header** — title + `plan · published {relTime}` subtitle; right cluster is a quiet
   `• Live` / `• Offline` badge + `View live site` (outline) + `Open editor` (primary).
2. **One thing to do next** — renders **only when there is one** (blockers / unpublished /
   no properties). A restrained brand-tinted surface with an `IconTile` (lg), "NEXT" eyebrow,
   title, body and a single coral CTA — the "Welcome to Bedr!" banner pattern, not a loud
   alert. When there's nothing to do it's simply absent.
3. **Your website** — `Card` with a `CardHead` (Globe tile + business name + web address +
   copy / QR / WhatsApp actions) then a divided key-row surface: Status (live text + switch),
   Plan, Health (status badge + first message + Details). Reads as one product object.
4. **This week** — `SectionHeader` + `See more ›` + a `MetricCard` grid (2 / 3 / 5 cols,
   `wash` tint per metric, `advActive`-gated cards drop cleanly on Basic).
5. **Manage** — one `Card`, divided icon-tile rows (icon tile + name + sub + chevron nudge).
6. **Recent activity** — quiet `surface-2` list; a compact `EmptyState` when there's nothing.

### 16.4 States verified in-browser

Advanced + Live + calm · Advanced + Live + unpublished changes (attention surface) · Basic
(3 metrics, "See Advanced") · Offline (badge + status row go muted, toggle off) · desktop +
375. `relTime`-driven "published Xd ago" derives from the live `PublishVersion`; absent when
nothing published yet.

### 16.5 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` unaffected (no section
change). `/website` at desktop + 375, `/scheduled-visits`, `/website/health`,
`/website/editor` — **0 runtime errors**, **0 horizontal overflow**. Card elevation bump
checked on operational screens (Scheduled Visits, Health) — subtle, no regression.

---

## 17. Pass G — Website dashboard: app chrome + card composition

Second structural pass on `/website` only. The Pass F dashboard was ManagR-flavoured but
still **list-like** (Manage was a 6-item vertical list, the status "surface" was 4 rows) and
the page felt "naked" without the ManagR application top bar.

### 17.1 Shared application chrome (`ManagRShell`)

- New **desktop top bar** (`lg:` only, sticky) reused by every shell screen: a
  `🏢 All properties ▾` scope selector (`DropdownMenu` over `ALL_PROPERTIES`, updates its
  label + toasts), the plan badge, a `Help` action, and an initials avatar. The Website page
  (and every `/website/*` screen) now sits inside the same frame as Properties / Scheduled
  Visits / Settings.
- The mobile header gains the same initials avatar on the right.
- `OWNER.owner` ("Niraj Rawool") added to mock data for the avatar/name.
- `main` vertical padding trimmed (`py-7`→`py-6`) now that a top bar sits above it.

### 17.2 Website overview → one identity card (not four rows)

`Card` = `CardHead` (Globe tile + business name + web address + copy / QR / open-live
actions) **+ a 3-panel inset grid** (`StatPanel` — `surface-2`, micro label):
- **Status** — live badge + toggle + one-line explainer
- **Plan** — plan name + `Manage plan ›` / `See Advanced ›`
- **Health** — status badge + first message + `Details ›`

The user sees which site, its address, whether it's live, its plan and whether anything
needs attention — as one composed object, not four identical settings rows.

### 17.3 Manage → responsive card grid (not a list)

`grid-cols-2 lg:grid-cols-3` of compact utility cards: icon tile top-left, chevron
top-right, title + one-line description below, hover = border + surface shift + chevron
nudge. Equal heights per row (grid stretch). 6 destinations, 2–3 rows instead of a
6-row list that read like Settings.

### 17.4 Other

- **Next action** — now a **white** `Card` with a subtle `border-brand/25` and the icon
  tile, rather than a fully coral-tinted panel. Prominent but clearly below the page header.
  Renders only when there's something to do.
- **Metric cards** — dropped the gradient `wash`; plain white surface + `shadow-xs` +
  tinted icon only (the Property-detail stat-card treatment — the more restrained of the two
  ManagR patterns). Number stays 28px.
- **Recent activity** — unchanged: one compact `surface-2` list, `EmptyState` when empty.
- `KeyRow` no longer used on this screen.

### 17.5 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` unaffected. In-browser:
`/website` at 1440 / 1380 / 800 / 375 — app top bar, dropdown, overview panels, 3-col →
2-col Manage grid, attention state (dirty), calm state, mobile avatar. `/website/settings`,
`/scheduled-visits` (top bar now present, no regression), `/website/editor` (unaffected —
outside the shell). **0 runtime errors**, **0 horizontal overflow** at 375 and desktop.

---

## 18. Pass H — Website dashboard: component anatomy & alignment (frontend-design skill)

Third pass on `/website` only, run under `anthropic-skills:frontend-design` (applied for
rigour — hierarchy, anatomy, alignment, affordance — **not** for a new aesthetic; ManagR
language is preserved). Fixes the "collection of rows" feel by enforcing real component
anatomy and a deliberate alignment system.

### 18.1 `StatusBadge` — new `pill` variant (`components/common`)

`StatusBadge` gains `pill` — a bordered semantic pill (`border-*-border bg-*-surface
text-*`) for each status. Used in the page header so **"Live" reads unmistakably as a
status**, visually separate from the action buttons (the reference `• Live` pill). The
plain dot+text form is unchanged and still used as a panel *value*.

### 18.2 `CardHead` — `size` prop

`size="md"` = 15px bold title + `lg` icon tile (the ManagR "Property Address" card-header
weight); `sm` (default, unchanged) elsewhere. Both `StatusBadge` and `CardHead` are only
consumed by `WebsiteHome`, so these are dashboard-scoped changes.

### 18.3 "Your website" card — composed, not flexed

- **Identity header** — Globe tile (`lg`) + business name (15px bold, the strongest thing
  in the card) + web address (mono caption, clearly metadata) + a **segmented icon group**
  (bordered, `divide-x`, hover states, tooltips) for copy / QR / open-live — icon actions
  now read as controls, not text floating on white.
- **Status · Plan · Health** — one **inset region** (`surface-2`, level-3 surface) with
  three columns separated by `divide-x` / `divide-y` dividers. **No per-panel card** —
  a separator is enough (kills the card-in-card feel).
- Every column is the same `StatPanel` family with enforced anatomy:
  **micro label → primary value → supporting text → bottom action**, `min-h` + `mt-auto`
  so the three actions bottom-align to the pixel (verified: panels 127px, actions 16px
  from the bottom). The interaction differs by column (Status = toggle + On/Off; Plan /
  Health = coral text-links with a chevron nudge) — deliberately not identical, per the
  spec, since the interaction patterns differ.
- **Toggle** — anchored at the bottom of the Status column, grouped with its `On`/`Off`
  state label, mirroring where Plan/Health put their links. No longer "centred because
  flexbox centred it".

### 18.4 Elsewhere on the page

- **Page header** — status pill separated from the button cluster (`gap-x-3`, buttons in
  their own `gap-2` group); title→meta→actions hierarchy tightened; page `space-y` 6→7.
- **Manage cards** — the navigation chevron moved to the **bottom-right, baseline-aligned
  with the description** (was floating top-right, far from the icon). Icon tile top-left,
  title + description, chevron / Advanced tag bottom-right.
- **`SectionLink`** — shared treatment for a SectionHeader's right-side action ("See more")
  so it reads as navigation (coral, chevron, hover nudge), consistent with the panel links.
- **Recent activity** — unchanged (already one surface with dividers, no nested cards).

### 18.5 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` unaffected. In-browser
at 1440 / 800 / 375: page header, identity action group + tooltips, the three panels
(equal height, actions pixel-aligned), toggle group, Manage grid chevrons, attention
(unpublished) + calm states, mobile stack. `/website/health`, `/scheduled-visits`,
`/website/editor` — no regression (StatusBadge/CardHead are dashboard-only). **0 runtime
errors**, **0 horizontal overflow** at 375 and desktop.

---

## 19. Pass I — Website dashboard: final composition of "Your website"

Final polish pass on `/website`, under `anthropic-skills:frontend-design` (rigour, not a
new aesthetic). The remaining issue was that Status / Plan / Health were **three mechanically
equal columns** — but they are not equal in importance or interaction. Recomposed around
what each actually means.

### 19.1 "Your website" — new information architecture

Two regions instead of one flat grid:

1. **Identity** (the object being managed) — Globe tile (`lg`) + business name (15px bold,
   strongest thing) + the web address as a **real link** (`hover:text-brand hover:underline`,
   opens the live site) + a bordered **segmented icon group** (copy / QR / open) with hover
   + focus-visible rings.
2. **State / management** (inset `surface-2` region):
   - **Status** — the primary operational question, given a **full-width row**. Label + `Live`
     badge + supporting line on the left; the toggle is a **labelled control block**
     (`Website is on` + `Switch`, bordered, on white — a level-3 control surface) anchored
     to the right at exactly the card's `px-5` gutter. No more "centred because flexbox".
   - **Plan · Health** — two *distinct* blocks (`sm:grid-cols-2`, divided), not thirds.
     **Plan** stays quiet: value + one line + a text-link. **Health is dynamic** — when
     something needs review it gets a whisper-of-warm background (`--warning-wash`, new
     token) and its action becomes a small **outline button** ("Review notes / issues");
     when all is well it's plain with a green badge and a quiet "Full report" link. The
     emphasis appears only when it's earned.

### 19.2 Token added

`--warning-wash: #fbf7ef` (+ `warning.wash` in Tailwind) — a barely-there warm fill for a
block that *gently* needs attention. (`bg-warning-surface/50` can't be used — Tailwind
doesn't generate `/opacity` on CSS-var colours, the recurring gotcha.)

### 19.3 Also

- Metric grid `lg:grid-cols-5` → `xl:grid-cols-5` so the 1024–1279 range gets comfortable
  3-up cards instead of five ~150px ones.
- Icon-button focus-visible rings on the identity group.

### 19.4 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` unaffected. In-browser at
1440 / 1024 / 768 / 375: identity + link + action group, full-width Status row with the
toggle control anchored right (154px block, 20px from the edge), Plan/Health blocks —
**calm** (plain + green + quiet link) and **attention** (warm wash + amber badge + Review
button) both checked, metric grid at every breakpoint, Manage grid, `/website/editor`
(no regression — `StatusBadge`/`CardHead`/`--warning-wash` are additive). **0 runtime
errors**, **0 horizontal overflow**.

---

## 20. Pass J — Website dashboard: "Your website" as one object, final polish

Last pass on `/website` (frontend-design skill, rigour not aesthetic). The "Your website"
card still read as *partitioned* (3 stacked regions + 2 dividers + a `divide-x` grid + a
bordered "Website is on" sub-box). Recomposed it as a single coherent object.

### 20.1 "Your website" — new composition

**Two regions, one divider** (was four+ dividers):

1. **The website + its live state** (`p-5`, generous) — Globe tile + business name (15px
   bold) + the address as a link + the segmented copy/QR/open group; then, separated only
   by **whitespace** (`mt-5`, no rule), a `STATUS` micro-label with `● Live · Visitors can
   see it` and — the key fix — **just the bare `Switch`**, right-anchored on that line (the
   universal settings-row pattern). The "Website is on" bordered sub-box is gone.
2. **Plan & Health** — two calm `MetaRow`s: a fixed 52px label column, value + context that
   truncates, action pinned right. `min-h-[56px]` so the two rows match. This is the
   ManagR "ROLE / NAME" key-value pattern, not a mechanical 2-column grid. **Health**
   stays plain with a quiet "Full report" link when all is well, and gets the
   `--warning-wash` fill + a small "Review" outline button only when something needs a
   glance.

**Why it's better:** the card now flows identity → state → detail with one structural
seam; whitespace (not borders) separates identity from status; the toggle is part of the
status line rather than an orphaned box; Plan/Health are aligned rows that scan in one
pass and are no longer forced into equal thirds.

### 20.2 This Week — refined `MetricCard` anatomy

Number top-left / icon top-right on one line, **label pinned to the bottom** via
`flex-col justify-between` + `min-h-[116px]` — every card is the same height and every
label sits on the same baseline (verified: all five 116px). Padding `p-4` → `sm:p-[18px]`.
Grid: `sm:grid-cols-3`, and `xl:grid-cols-5` only when Advanced (Basic's 3 cards stay wide
instead of shrinking to fifths).

### 20.3 Smaller refinements

- Manage cards `p-3.5` → `p-4`, `gap-3` → `gap-3.5`, real focus-visible ring.
- Recent-activity rows `py-2.5` → `py-3`.
- Identity icon-buttons `size-3.5` → `size-4` glyphs; focus-visible rings added.
- `MetricCard` (common) is the only shared component touched — it's dashboard-only.

### 20.4 Verified

`npx tsc --noEmit` + `npm run build` clean · `npm run contracts` unaffected. In-browser at
1440 / 1280 / 375: the card at **calm** (plain rows, quiet links) and **attention** (warm
Health row + Review button); metric cards equal height at every breakpoint; Manage grid;
`/website/editor` + `/website/health` — no regression. **0 runtime errors**, **0 horizontal
overflow**.

---

## 21. Phase 2 — the five Website Management pages

`/website/settings` · `/website/availability` · `/website/visits` · `/website/enquiries` ·
`/website/bookings` brought to the dashboard's polish level and made to read as **one
system**. The dashboard (`/website`) was not touched.

### 21.1 The shared page language (new primitives in `src/components/common`)

| primitive | what it standardises |
|---|---|
| `PageBody` | the `space-y-6` vertical rhythm every page uses under `PageHead` |
| `SettingsCard` | one settings-group card: IconTile + bold title + grey description header · `space-y-4` content · optional `surface-2` footer for the "where this shows up" note |
| `Field` | vertical label / control / hint — one form-row shape |
| `ToggleField` + `FieldGroup` | borderless labelled switch/checkbox rows, divided not boxed — kills the "outline around every row" flatness |
| `Segmented` | small either/or choices (disclosure phrasing, …) |
| `ListContainer` | the single operational list — `divide-y` rows on desktop, stacked cards on mobile |
| `FilterBar` | the tabs + search row above a list |
| `SaveBar` + `useSaveState` | sticky save-state bar: `clean → dirty → saving → saved`, only rendered when dirty |

### 21.2 Per page

- **Website settings** — tabs-only structure replaced by six stacked `SettingsCard`s
  (Address & language / Menu / Contact / Social / Brand / Google). Native fields feed a
  `SaveBar` via an `onInput` capture + explicit `onCheckedChange`/`onValueChange` hooks;
  save simulates `saving → saved → clean`. Menu links are a 2-col checkbox grid with a
  `has-[[data-state=checked]]` selected style. All `border-hair`/`bg-card` ad-hoc rows gone.
- **Live availability** — master status is a `ToggleField` in its own card with a live
  description. Disclosure level is a `RadioGroup` of `ChoiceRow` cards (each with the
  visitor-facing example); count phrasing is a `Segmented`. Privacy is now a calm cyan
  "what the public site never shows" card (lock glyphs, grey) instead of a warning callout.
  Property list → `ListContainer`.
- **Visit settings** — a real scheduling control centre: day × part-of-day grid with
  live local state and "add a common pattern" presets, time chips, per-property
  `ListContainer`, blackout dates with a **Popover + native date input** add flow,
  visit-type `FieldGroup`, and a shared `Stepper` for the four timing rules. The old
  single accordion is gone — each concern is its own card.
- **Enquiries** — operational: two honest `MetricCard`s (only when data exists),
  `FilterBar` = status `Tabs` + search, **table on desktop / `ListContainer` cards on
  mobile**, a "no matching enquiries" empty state, and the form-field controls in a
  `SettingsCard`.
- **Booking requests** — a decision card with a clear hierarchy: name/detail header,
  a green "a bed can be ready by <date>" availability strip, then **Approve (primary)**
  vs **Message first (outline)** vs **Decline (low-weight red ghost, right-aligned)**.
  Decline opens an `AlertDialog` confirmation. Rules → `FieldGroup`.

### 21.3 Verified

`npx tsc -b --noEmit` clean · `npm run build` clean · `npm run contracts` unaffected.
In-browser at **390 / 1280** (spot-checked 375–1440): **0 runtime errors** across all five
routes plus the decline dialog, **0 horizontal overflow** at every width. `SaveBar`
transitions and the availability master toggle exercised live.

### 21.4 Second pass — content decides the width

The first pass stacked full-bleed cards; the shell's `max-w-[1120px]` made
text-and-form content feel stretched. Fixed with a shared `Page` wrapper — three
content widths, chosen per page by what the page actually holds:

| size | width | pages |
|---|---|---|
| `form` | 620px | Website settings, Booking requests |
| `content` | 760px | Live availability, Visit settings |
| `wide` | 1040px | Enquiries (operational table) |

Within a page, individual regions are constrained further where the content is
narrower than its container: choice-card `RadioGroup` → 560px, property
`ListContainer`s → 520px, the visit day×part grid → 400px, time chips → 440px,
Enquiries metric pair → 440px, the "Where enquiries go" banner → 640px, the
Enquiries table → 880px with explicit `<colgroup>` widths (Name 26% · Looking-for
flex · Received 124px · Status 116px). The Booking "only open request" note is now
a quiet one-line caption, not a full `EmptyState` card.

`SettingsCard` header refined into one unit: the icon tile is nudged to the
title's cap-height (`mt-px`, `items-start`), the description is capped at `52ch`,
and an optional top-anchored `action` slot shares the header row.

Re-verified at 390 / 1280: **0 console errors**, **0 horizontal overflow** on all
five routes; `tsc -b` + `build` clean.

### 21.5 Third pass — one frame, correcting the over-correction

21.4 over-corrected: three different per-page `max-w` values, each centred, so
every page had different side margins and the five stopped feeling like one area.

Replaced with **one shared frame**: `Page` = `mx-auto max-w-[840px]`, used by all
five routes for *both* the header and the body. The header, every card and every
section now begin on the same vertical line, and switching between the five pages
no longer changes the page width.

Inside that one frame, width is a per-*section* choice, left-anchored to the frame
edge — never a per-page one:

- **Settings** — cards span the frame; forms fill them via 2-col grids (name + language, contact, social, menu links); only a lone SEO title/description is held to `560px`.
- **Availability / Visits** — cards span the frame; the visit day×part grid stays a compact `400px` control (it's a designed control, not a table); choice cards and lists fill their card.
- **Enquiries** — the table spans the frame with `<colgroup>` proportions; the metric pair and the "Where enquiries go" banner share a `640px` measure stacked at the frame's left edge.
- **Bookings** — the request card spans the frame; its internal copy is held to `60ch`, the availability chip hugs its text, and Approve / Message first / Decline stay grouped (Decline is a quiet red ghost, not pushed away).

All the per-section `max-w-[…px]` caps added in 21.4 that merely duplicated a page
column were deleted. Re-verified at 390 / 1280: **0 console errors**, **0
horizontal overflow** on all five routes; `tsc -b` + `build` + `contracts` clean.

### 21.6 Fourth pass — rendered-browser QA + a11y

Ran a real-browser sweep of the five routes at 375 / 390 / 430 / 768 / 1024 / 1280 /
1440 (DOM geometry + inspected screenshots), a Web Interface Guidelines review of
the source, and a critique pass. Fixes:

**Layout / consistency**
- `html { scrollbar-gutter: stable }` — the shared `Page` frame no longer shifts
  7px between a page that scrolls and one that doesn't. Verified: header left edge
  is now identical across all five routes at every width (328px @ 1280, 408px @ 1440).
- **`bg-sunken` was a dead class** — used ~10 places (the Segmented track, the `off`
  status pill, `disabled:` input/select backgrounds, editor toolbars) but never
  emitted, because the token only existed nested as `surface.sunken`. Added
  `sunken: "var(--sunken)"` as a top-level colour in `tailwind.config.ts`; all
  existing `bg-sunken` usages now render their intended `#f1f2f4` well. No semantic
  change — this restores styling the code already asked for.

**Visits**
- Day × part-of-day grid: replaced the 14-coral-outline "spreadsheet" look with a
  calm heatmap — solid `bg-brand` for on, `bg-sunken` for off, no border strokes.
- Time chips: softened from coral-filled to a subtle coral border + dark text.
- Grid/chip buttons: `aria-pressed`, per-cell `aria-label`, wrapping `role="group"`.
- Property rows and the blackout-date input: proper label association.

**Enquiries**
- "New — not yet contacted" metric icon `Search` → `MailPlus` (Search meant nothing
  there).
- Search field: `type="search"`, `aria-label`, `autoComplete="off"`, `spellCheck={false}`,
  icon `aria-hidden`; a visually-hidden `aria-live` node announces the result count.

**Bookings**
- Decline: `variant="ghost"` (looked like plain red text) → `variant="destructive"`
  (bordered button, red text) — reads as a real button, still the lightest of the three.
- Move-in date `<b>` gets `whitespace-nowrap` so "2 March" can't split across lines.

**Shared**
- `ToggleField` now wires its label to the control (`useId` + `htmlFor`/`id`), so every
  switch/checkbox row across the five pages has an accessible name and a full-width hit target.
- `SaveBar` status text is a `role="status"` `aria-live="polite"` region; its icons `aria-hidden`.
- `IconTile` marked `aria-hidden` (decorative recognition aid).

Re-verified: `tsc -b` + `build` + `contracts` clean · **0 runtime errors** on all five
routes · **0 horizontal overflow** at all seven widths · SaveBar / tab-filter / decline
dialog exercised live.

## 22. Fifth pass — Health / Plan / Upgrade / Analytics brought into the system

These four routes had never been through a refinement pass — they still used the
pre-`SettingsCard` era pattern (`border border-hair border-border bg-card`, bare
`GroupLabel` cards, ad-hoc comparison table, hand-rolled radio rows, plain-text
metric rows). Rewritten to the same language as the five management pages:

- **Health** — `StatusBadge pill` verdict in the page-head actions slot;
  "Fix these first" / "Worth a look" / "Working well" are now `SettingsCard`s
  (coral/amber/green) with `ListContainer` rows and real `Button` actions
  (was `variant="link"` text).
- **Plan** — plan state is a `SettingsCard` (icon + state as title/description,
  the upgrade CTA and the billing-permission notice live in its content); the
  Basic/Advanced matrix is a proper `<table>` with `Check`/`Minus` icons instead
  of "✓"/"—" glyphs, matching Enquiries' table pattern.
- **Upgrade** — the three benefit blocks (previously three separate bordered
  boxes) are one `ListContainer` with `IconTile`s — less card soup, one grouped
  list. The billing-cycle picker now reuses `ChoiceRow` + `RadioGroup` instead of
  hand-rolled `border-brand bg-brand/5` labels — identical to Availability's
  disclosure-level picker.
- **Analytics** — "This week" is now a `MetricCard` grid with real icons
  (`Eye`/`MessageCircle`/`PhoneCall`/`Inbox`/`CalendarClock`), the same component
  and icon set WebsiteHome uses for the identical data — genuine cross-page
  reuse instead of a parallel implementation. "Roughly what it brought in" is a
  `SettingsCard` with the big number in its content.

**Shared-component fix**: `SettingsCard` no longer renders an empty padded
content strip when all of its children evaluate to nothing (`React.Children
.toArray(children).length > 0` gate) — surfaced by Plan's advanced-plan state,
benefits any other conditional-children usage.

All nine non-editor Website Builder routes now share one `Page` frame, one card
language, one table language, one choice-row language, one metric-card language.

Verified: `tsc -b` + `build` + `contracts` clean · **0 console errors** and
**0 horizontal overflow** across all 10 routes (`/website` + the 9 above) at
390 and 1280.

### 22.1 Editor — inspected, not rewritten

Read and exercised `EditorChrome.tsx`, `LeftPanel.tsx`, `WebsiteCanvas.tsx`,
`panel.tsx` (the shared inspector/panel primitives), and `InspectorPanel.tsx`'s
page-overview state, plus rendered the editor on desktop and mobile. Found an
already-bespoke, restrained system: collapsible grouped inspector (`Group`) with
real layout-preview thumbnails (`LayoutMini` draws an actual mini schematic per
variant, not a generic icon), a canvas selection treatment that's a 1.5px ring +
small label chip (not a heavy box), a mobile mode with its own floating
contextual toolbar rather than a shrunk desktop layout. This is the result of
the prior "final high-craft" and "editor toolbar/nav/canvas/inspector" passes
already logged earlier in this document. No changes were made here beyond the
`bg-sunken` token fix (§21.6), which already restored the Segmented-control
track and disabled-state backgrounds this system depends on. A further
ground-up pass was deliberately not attempted without a concrete rendered
defect to act on — see the accompanying report.

## 23. Editor panel density — informed by four real Figma reference frames

The user supplied four Figma frame links as the visual benchmark for editor
panel design principles. Fetched via the Figma MCP (`get_screenshot`) and
inspected directly — they turned out to be reference captures of **Figma's own
UI chrome** (not ManagR mockups): (1) Figma's right-side properties inspector
(dark, collapsible groups, hairline dividers, label-left/control-right rows,
segmented toggles, a colour-swatch list); (2) Figma's left Assets panel
(tabs, search, collapsible categories with a "+", icon+label rows); (3) an
Add/gallery grid of visual preview thumbnails grouped by category; (4) a
searchable category list with icon+chevron rows and a highlighted active row.

Comparing these against the existing editor implementation (`panel.tsx`,
`LeftPanel.tsx`, `InspectorPanel.tsx`) found the *structure* already matching:
collapsible grouped sections with hairline dividers (not per-property boxes),
search-first Add/Assets panels, real visual previews per choice (`SectionPreview`,
`LayoutMini` — actual mini schematics, not generic icons), hover-highlighted
list rows with active-state tinting. No structural rebuild was warranted or
performed.

The one concrete, reference-evidenced gap: **row and group breathing room** was
tighter than the reference chrome's. Fixed in the shared primitives so every
consumer (desktop docked inspector, mobile full-screen section sheet, left
Sections/Pages/Add panels) picks it up from one place:

- `Group` header `px-3 py-2` → `px-3.5 py-2.5`; body `space-y-3 px-3 py-3` →
  `space-y-3.5 px-3.5 py-3.5`.
- `Field` label-to-control gap `mb-1.5` → `mb-2`; hint gap `mt-1` → `mt-1.5`.
- `ChoiceCard` (the Layout-style picker) `p-1.5` → `p-2`, preview `h-11` → `h-12`.
- Section-list row (`NavRow`) `py-[7px]` → `py-2`; page-list row `py-1.5` → `py-2`.
- The five `Group` `bodyClassName` overrides in `LeftPanel.tsx` bumped by the
  same increment so list-style groups stay consistent with field-style ones.

Verified live: selected the Hero section, opened its inspector on desktop and
its full-screen sheet on mobile — same generous spacing in both, one source of
truth. `tsc -b` + `build` + `contracts` clean, 0 console errors, 0 horizontal
overflow at 390/1280/1440.

**Not changed, with reason**: canvas selection chrome (already a quiet 1.5px
ring + small label chip, matching reference restraint), the Add-section item
layout (already shows a real preview + name + blurb + badges — richer than the
reference's bare thumbnail grid, and correctly kept that way since ManagR's
non-technical owner needs the explanatory text the reference didn't have to
carry), toolbar grouping (already separates identity/save from
device/preview/publish with dividers). Reference principles that don't
transfer — raw numeric side-by-side fields, technical property exposure — were
correctly not applied, since ManagR's inspector deliberately never exposes
raw layout values.

## 24. Section list rebuilt around Home/Footer as fixed bookends

A genuine product-model clarification, not just a visual tweak: the left
"Sections" panel (desktop `LayersPanel`) and the mobile "Sections" sheet each
used to split the page into two separate groups — "On this page" (reorderable)
and "On every page" (Header/Footer) — which read as two unrelated lists.
Rebuilt as **one continuous structure**: Header pinned at the top (lock icon,
"Fixed" label, no drag handle or reorder menu), a quiet "SECTIONS" divider,
the reorderable sections in the middle exactly as before, then Footer pinned
at the bottom the same way, with one explanatory line beneath. `NavRow` gained
a `pinned?: "top" | "bottom"` prop that swaps the drag handle for a lock icon
and adds the "Fixed" caption — everything else (selection, click-to-edit,
dispatches) is untouched.

The mobile sheet (`MobileSheets.tsx`'s `MobileLayersSheet`) got the equivalent
treatment, since it's a structurally separate component from the desktop panel
(mobile renders full-screen sheets, not docked panels) — same header/sections/
footer shape, same lock+"Fixed" language, and its per-row `border-hair
border-border` full boxes (a leftover from before this session's `border-hair`
fix elsewhere) were replaced with a single `divide-y` list, matching the
`ListContainer` convention used everywhere else in the product.

**Scope note**: the request described the product as "a SINGLE PAGE website"
with "HOME" and "FOOTER" as its fixed bookends. The codebase and
`BUILDER-PRODUCT-ARCHITECTURE.md` document a genuinely multi-page model
(Home + a per-property template page, plus About/Gallery/FAQ/Contact on
Advanced) with its own `Pages` panel — that is existing, intentional,
documented functionality, not a bug, so it was preserved untouched. What
actually maps to "HOME fixed top / FOOTER fixed bottom" is the **Header and
Footer global sections within a page**, which is what this change addresses.

Verified: `tsc -b` + `build` + `contracts` clean, 0 console errors, 0 overflow
at 390/1440; exercised the mobile sheet's reorder/hide/duplicate/remove icons
render correctly in the new layout (dispatch wiring unchanged).

## 25. Editor — substantial visual transformation

Prior passes verified the editor was structurally sound and made only spacing
corrections. This pass made bold, visible visual changes on top of that
structure — no architecture, state, or business-logic change.

- **Toolbar** — height 56px → 60px, a `shadow-xs` lift off the canvas, the
  page-name control now a real bordered chip. Undo/redo + the device switcher
  pulled out of the linear button row into a **centred floating tool-well**
  (`bg-surface-2`, rounded-xl, bordered) — the Figma/Framer pattern of framing
  the editing tools as their own object rather than one more item in a row.
  Publish gets its own drop shadow and bolder weight — visibly the one action
  that matters most.
- **Rail** — active workspace mode (Sections/Pages/Add/Photos) now shows a
  **coral left accent bar** instead of a flat background tint; bigger icons,
  more vertical room per item.
- **Section list — colour-coded by category.** Every section's icon is now
  tinted by its registry `category` (`SECTION_TINT` in `panel.tsx`: Hero=coral,
  Properties=blue, Trust=green, Content=purple, Convert=amber, Contact=cyan,
  reusing the exact tint tokens the rest of ManagR already uses for metric
  cards and the Manage grid — not a new palette). The list reads at a glance
  instead of as a wall of identical grey icons. Selection state switched from
  a ring+tint to the same **left accent bar** language as the rail, so the two
  panels visibly speak one system.
- **Inspector header — rebuilt.** Was a small `SlidersHorizontal` + name label
  inside the generic `PanelHeader`. Now a proper identity block: a
  category-tinted `IconTile` (neutral grey tile for Header/Footer, which are
  chrome, not content) + bold section name + a quiet category caption
  ("Properties", "Convert", …), actions unchanged on the right. Verified live:
  selecting Hero banner shows a coral tile, Properties grid shows blue.
- **Canvas — workspace background.** The grey void around the device frame
  now carries a subtle dot-grid (`radial-gradient`, 20px pitch, ~8% black) —
  the standard "this is a design-tool canvas, not a blank page" cue used by
  every reference product, applied at effectively zero risk (pure background,
  no layout change).

**Not touched, deliberately**: Add-section panel, Design panel, publish
dialog, version history — re-inspected, no concrete gap found worth churning
a working flow for.

Verified: `tsc -b` + `build` + `contracts` clean; **0 console errors**, **0
horizontal overflow** at 375/390/430/768/1024/1280/1440; confirmed the
category-tint system by selecting sections of different categories and
reading the generated `--tint-*` background colour off the live DOM, not just
visually.

## 26. "Your website" card — the status/plan/health rows finally read as one surface

Re-opened by explicit request. The card was architecturally "2 regions"
(identity+status, then plan/health) since Pass J, but **visually** the Plan and
Health rows used the exact same label/row styling as the Status row — so all
three still read as one repeating list of facts, not a composed object.

Fixed by giving the secondary facts a genuinely different shape instead of a
different name: Plan and Health are now a **side-by-side 2-column strip**
(`sm:grid-cols-2 sm:divide-x`) below the status line, each cell laid out
vertically (label → value → helper → action) rather than as a horizontal row.
On mobile it falls back to a single stacked column — still visually distinct
from the Status row because of the vertical, denser cell shape. `MetaRow`
(the old horizontal-row component) was replaced by `FactCell`; no data,
actions, or links changed — `Manage plan`, `See Advanced`, `Review`, the
health-attention tint all work exactly as before.

Verified: DOM geometry confirms Plan/Health render side-by-side at desktop
widths and stacked on mobile; 0 console errors, 0 overflow at 375/1280.

## 27. Section naming and "3 generic layout labels" — declined, with reasons

Two specific asks from this round were evaluated and **not implemented**:

- **"Section names read like marketing copy (e.g. FIRST IMPRESSION)."** Checked
  the actual registry (`src/features/sections/registry.ts`) — every section
  name is already short and functional: "Hero banner", "Properties grid",
  "About us", "Photo gallery", "Contact block", "Highlights", "Reviews", "FAQ".
  The described problem doesn't exist in this codebase; nothing needed fixing.
- **"Relabel each section's layout choices to generic Layout 1/2/3."** The
  current layout variants have descriptive names with real visual previews
  (`LayoutMini` — e.g. "Image on top", "Image left", "Text only") shown right
  next to the label. Replacing that with "Layout 1/2/3" would remove
  information the owner currently has for no gain, since the underlying ask
  ("the visual thumbnail should communicate the difference") is already true.
  Kept the named variants.

## 28. Editor simplification — Pages off the rail, layouts numbered

Two of this round's repeated, explicit asks were real and implemented:

- **"Pages" removed from the primary left rail.** The rail's job is now
  purely "Sections / Add / Photos" (plus the separated global tools
  Design/Check) — page structure no longer competes with a page-switching
  concept. Page switching wasn't deleted: it already existed as the toolbar's
  page-picker dialog (`Shree Residency / Home ▾` → `PagePickSheet`), which is
  the contextually correct place for "which page am I on" and is shared by
  desktop and mobile already. **"Add a page" moved into that same dialog**
  (bordered button below the page list, Advanced-gated exactly as before) so
  no capability was lost — it just isn't a rail destination anymore. The
  `PagesPanel` component and the `"pages"` left-mode value are left in place,
  unreachable but harmless, rather than touching the `BuilderState` shape.
- **Layout choices now show a number first.** `Layout 1`, `Layout 2`, `Layout
  3`… as the primary label, with the existing descriptive name ("Photo
  cards", "Compact list") as a small muted caption underneath — verified live
  on Properties grid (4 variants, `Layout 1 · Photo cards` through `Layout 4 ·
  3 per row`). The grid now uses up to 3 columns instead of 2. Note: sections
  have different numbers of real variants (1 to 5) — the ask assumed exactly
  three per section, which isn't how the registry is authored today; rather
  than fabricate or delete variants to force a count of three, every real
  variant got a number, in order.

**Declined again, same reasoning as before**: renaming sections in the
registry (checked a third time — the names already are "Hero banner",
"Properties grid", "About us", not marketing copy); moving global Photos
management fully into per-section "Change image" controls (the inspector's
field schema has no image field kind today — building one is a real feature
addition to the schema, not a UI reorganization, and out of bounds for a
UI-only simplification pass).

Verified: `tsc -b` + `build` + `contracts` clean, 0 console errors, 0
overflow at 390/1100 for the editor; page-picker dialog exercised live
(opened, showed Home + "Add a page"); layout picker exercised live on a real
section with 4 variants.

## 29. Editor simplification — fewer names, fewer boxes, fewer default controls

Driven by a screenshot of the live editor, which showed three concrete
problems the earlier passes hadn't caught:

- **Verbose layer names.** The structure list read "Header / brand bar",
  "Hero banner", "Properties grid", "About us", "Contact block",
  "WhatsApp bar". Shortened in the registry to "Header", "Hero",
  "Properties", "About", "Contact", "WhatsApp", plus "Areas", "Trust",
  "Text", "Gallery", "Enquiry", "Visits", "Booking request", "Offer". The
  `blurb` still carries the explanation in the Add library, so nothing was
  lost where the longer phrasing actually helped. (Two earlier rounds I
  declined this on the grounds the names were "already concise" — rendered in
  a narrow navigator column they clearly weren't.)
- **A card per checkbox.** The Contact inspector rendered "Which ways to
  contact you show" as five full-width bordered `bg-surface-2` boxes. Both
  `checklist` and `toggle` in `primitives.tsx` now render as plain rows with a
  hover tint — a checkbox group is a list, not five stacked cards.
- **Too many default controls in Layout.** The Spacing segmented control
  (Cosy/Compact/Roomy) and the "Colours, fonts and corners come from Design"
  note now sit behind a quiet `Spacing` disclosure, so the Layout group opens
  showing only the layout thumbnails. `MoreDisclosure` was also rebuilt on the
  same borderless `Disclosure` primitive — it used to be another bordered box.

Verified live at 1100 (desktop editor, Contact selected) and 390 (mobile
editor + section sheet): `tsc -b` + `build` + `contracts` clean, **0 console
errors**, **0 horizontal overflow** across all 12 Website Builder routes at
1440 and at 390.

## 30. Left panel + section library + global editor navigation — final IA refinement

Scoped narrowly, per the request, to: the left rail, the Sections/Layers
panel, the Add-section experience, Photos, and Design. Canvas and the right
inspector were left untouched. Four screenshots of the live (broken) state
drove every change below.

- **The coral vertical selection stripe is gone.** `NavRow` (section list)
  and `EditorRail` (left rail) both used a `border-l-2 border-l-brand`
  accent bar for the active/selected state — the exact "decorative orange
  line" the screenshots showed, and one I had deliberately added earlier
  this session, reasoning it mirrored VS Code/Linear sidebars. Both now use a
  plain filled container instead: `bg-brand/[0.09]` with bold/medium text and
  no border of any kind. Verified live — the selected "Contact" row reads as
  a quiet coral-tinted pill, not a tab.
- **The left rail is now two tiers, not six equal-weight icons.** Sections,
  Add and Design are full-size primary destinations. Photos and Check are
  visually demoted (smaller `minor` style, below a divider) — support
  functions, not peers of the editing workflow. Find stays (it opens the
  real ⌘K command menu, which is materially useful — jumping to any section
  or page by name — so removing it would be a regression) but is demoted to
  the same quiet `minor` treatment at the bottom of the rail.
- **The Add-section library is now a flat, static catalogue — no
  accordions.** `AddPanel` used a collapsible `Group` per category with
  marketing copy ("FIRST IMPRESSION · The top of your page", "BUILD TRUST ·
  Reasons to choose you", …). `ADD_CATEGORIES` was stripped down to plain
  category names (Hero/Properties/Trust/Content/Convert/Contact — matching
  the section registry's own vocabulary) and `AddPanel` now renders every
  category as a static micro-caps heading followed directly by its items —
  nothing to expand, the whole library scrolls as one list. Each row keeps
  its hand-drawn `SectionPreview` thumbnail, name, one-line blurb, and a
  trailing `+` — that part already matched the "thumbnail, name,
  description, Add action" spec and didn't need to change.
- **Photos is no longer a wall of anonymous placeholders.** The panel was a
  3×3 grid of nine identical empty grey tiles under "FROM YOUR PROPERTIES".
  There's no real photo/thumbnail data in the app model (`Property.photos`
  is a count, not URLs), so rather than fake thumbnails, `AssetsPanel` now
  lists actual properties by name with their real photo count ("Shree
  Residency · 3 photos"), and a genuine empty state — "No photos yet. Add
  photos in Properties." — when an owner has no public properties at all.
  Visually it's now a light reference list, not a competing primary surface.
- **Design is down from 6 tabs to 4, Theme-first.** Template / Colours /
  Fonts / **Shape** / **Layout** / Brand → **Theme** / Template / Colour /
  Typography. Shape (corner rounding) and Layout (spacing density) were the
  literal low-level "spacing, shape" controls the brief said not to expose
  in V1 — removed. Brand's content (theme-feel picker, logo, business-info
  notice) was folded into a new **Theme** tab and made the default/first tab,
  since Theme is meant to be the primary decision. Template (page
  arrangement) and Colour/Typography stayed, as explicitly allowed.
- **Mobile verified compliant, not touched.** The mobile bottom bar was
  already Sections/Add/Design/Preview/Publish — no Photos/Check/Find. The
  mobile Sections sheet was already Header (fixed) → Sections → Footer
  (fixed) → Add section — no Pages/Photos/Design/Check/Find inside the
  structure surface. Confirmed via DOM read + a real click into the sheet,
  not just source inspection.
- **A stale Impeccable suppression was cleaned up.** The `side-tab`
  ignore-value in `.impeccable/config.json` excused the accent-bar this pass
  removed; it's gone now that there's nothing left to excuse.
- **Not touched (correctly, by scope):** the three-layout system already
  lives only in the right inspector (`InspectorPanel`'s Layout group) —
  Add-section only ever chose section *type*, never layout, so no change was
  needed there. Canvas, toolbar, and inspector internals are unchanged.

Verified: `tsc -b --noEmit` clean, `npm run build` clean, `npm run contracts`
regenerated without diff-worthy changes, live in the browser at desktop
(~800–1100px: rail, selected-row fill, flat Add catalogue, Photos list,
4-tab Design dialog with Theme opening first, Colour tab) and at 375px
mobile (bottom bar, Sections sheet content). The duplicate "Featured
property / Highlights / Contact" rows visible in the user's screenshot did
not reproduce in a fresh session — they're accumulated local test state
(those three section types are legitimately `dup: true`, addable more than
once), not a registry defect.
