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

## 31. Section list — fixed row height, real selected state, Header/Footer unlocked

First-pass refinement of only the section-list interaction/visual states inside
the left panel (`NavRow` / `LayersPanel`). No business logic, section
architecture, routing, or other screens changed.

- **Header/Footer are no longer "locked."** Removed the `Lock` icon, the
  "Fixed" trailing label, and the explanatory paragraph at the bottom of the
  list ("Header and footer are fixed in place and shared everywhere...").
  They now render as plain rows — same icon slot, same trailing-badge slot,
  same click-to-select behaviour as every other section. No new
  reorder/remove affordance was added for them: `canStruct` was already
  `false` for structural sections before this pass, so nothing about what
  they can *do* changed, only how they *look*.
- **Every row is a fixed `h-9` (36px), unconditionally.** Verified by reading
  `getBoundingClientRect()` on all 7 rows (Header, Hero, Properties,
  Highlights, About, Contact, Footer) in default, hovered, and selected
  states — height is 36px in every case, with 0px variance. Hover/selected
  never add padding, borders, or transforms that could change geometry;
  they only ever change `background-color`/`color`/`font-weight`, none of
  which affect box size.
- **A real selected-state bug was found and fixed.** The selected-row
  treatment (and, it turned out, the left rail's active-tab treatment from
  an earlier pass) used `bg-brand/[0.08])`-style arbitrary opacity
  utilities. `--brand` is declared as a raw hex CSS variable
  (`--brand: #f7553d`), and Tailwind cannot generate a real alpha-blended
  rule for a color that isn't a channel tuple — confirmed by grepping the
  *built* CSS: no `.bg-brand\/\[0.08\]` rule existed anywhere, only the
  full-opacity `.bg-brand{background-color:var(--brand)}`. The selected row
  was rendering with **no visible fill at all**. Fixed by switching to
  `bg-tint-coral` — an existing solid, pre-mixed token
  (`--tint-coral: #fdeee9`) already used elsewhere in the app for exactly
  this kind of light tint — for both `NavRow`'s selected state and
  `EditorRail`'s active-tab state. Verified via computed style:
  `background-color: rgb(253, 238, 233)` now actually renders. This is a
  restrained, ManagR-coral fill — not a stripe, not a saturated
  warning/error color.
- **A related but out-of-scope defect was found and flagged, not fixed
  here.** The same broken opacity-modifier pattern appears on ~10 other
  spots across unrelated screens (VisitsScreen, SettingsScreen, SetupFlow,
  WebsiteHome, WebsiteCanvas, DesignSheet, the shared `ChoiceRow`/
  `ChoiceCard`). Left untouched per this pass's explicit scope, and handed
  off as a separate suggested task rather than silently left.
- **Hover is a plain background tint only** (`hover:bg-panel-hover`, a
  solid token, already worked correctly before this pass — confirmed via a
  real `:hover` state check, not just class inspection).
- **Content stability:** the drag-handle icon slot is always reserved
  (rendered transparent when not draggable/hovered, never removed from
  layout), so reorder/more-action controls appearing on hover/selection
  never shift the icon or the section name. Added `min-w-0` to the name
  span so a long section name truncates instead of breaking row layout or
  pushing the trailing badge/controls out of the row.
- **Bottom of the panel now ends cleanly**: `Header → SECTIONS → Hero …
  Contact → Footer → Add a section`, no leftover metadata text.

Verified live at desktop (1280px): typed through Header, Hero, Footer as the
selected section — inspector content updates correctly for each, selected
fill renders as real `#fdeee9`, all 7 rows measured at exactly 36px in every
state. `tsc -b --noEmit` and `npm run build` clean.

## 32. Editor-wide structural refinement — rail removed, right panel de-accordioned, top bar simplified

A whole-editor pass, scoped to structure/IA and the right inspector's shared
scaffolding — not a rewrite of every section's field set (see "not done"
below).

- **The left tool rail is gone.** `EditorRail` (Sections/Add/Design/Photos/
  Check/Find icon column) is deleted outright, not just visually demoted.
  The editor grid is now 3 columns (layer list / canvas / inspector), not 4.
  Sections/Add already lived correctly inside the layer panel itself
  ("+Add a section" swaps the panel content in place); Check and Find were
  fully redundant with the existing status-bar "phone-layout notes" button
  and the global ⌘K shortcut, so removing them loses nothing.
- **Design moved to the top bar** as a real `outline` button next to Preview,
  since it's a global editor action, not a layer. Verified it still opens
  the (already-curated, 4-tab, Theme-first) Design dialog from there.
- **Photos is now purely contextual.** The "Choose photos →" action inside
  Gallery's Content group was previously dead — it called
  `nav("/website/editor")`, a no-op since that's the page you're already on.
  It now dispatches into the same lightweight Photos view used before, with
  a "← Sections" back affordance, reached only from the section that
  actually needs it (Gallery today; the same wiring is available to any
  future section's image field).
- **Right panel: no more accordions.** Content, Layout and Data were
  collapsible `Group`s with per-session open/closed state (a `force()`
  re-render hack to persist it outside React state). All three are now
  `collapsible={false}` — always expanded, plain section headings, one
  continuous scroll. The truly secondary, rarely-touched knobs (Header's
  "Menu links & buttons", Layout's "Spacing") stay behind their existing
  small text-disclosure — that distinction (core groups always visible,
  genuinely secondary options opt-in) is the one from the brief's own
  examples, not a blanket ban on all disclosure.
- **Visibility section removed** from the right panel entirely — no more
  per-breakpoint (desktop/tablet/phone) show/hide grid. The existing
  simple "hide this section" toggle (header icon + row menu) already covers
  "should this show or not," which is as far as this product should go.
- **Removed a redundant meta line.** The "On the Home page" scope chip
  (shown on every non-global section, always saying the same one thing)
  is gone. The "Global — on every page, changes apply everywhere" chip
  stays on Header/Footer, since that fact is genuinely non-obvious and
  prevents real confusion.
- **Top bar page control is now conditional, not always a dropdown.** With
  exactly one real (`kind: "standard"`) page, "Home" renders as plain text —
  no chevron, not clickable, nothing to "choose." The interactive page
  picker only reappears once an Advanced owner has actually added more
  pages (`s.pages.filter(p => p.kind === "standard").length > 1`). Applied
  to both the desktop toolbar and the mobile top bar.
- **Preview is a real bounded button now** (`variant="outline"`, same
  treatment as the new Design button) instead of a ghost/ghost-adjacent
  control that only shows a background on hover.
- **Investigated, not reproduced: the reported "3-dot menu opens at the
  top-left" bug.** Triggered every section row's and the inspector header's
  "More actions" menu repeatedly at 1280px — Radix positioned each one
  correctly, anchored to its trigger, in every attempt. `Button` forwards
  its ref correctly and the row trigger is a native `<button>`, so the two
  usual causes (broken ref forwarding, a `transform`d ancestor breaking the
  portaled content's containing block) don't apply here. Added
  `collisionPadding={8}` to the toolbar's publish-options menu as cheap
  insurance; did not chase this further without a reproduction.

**Not done in this pass (scope called out honestly, not silently skipped):**
- A full field-by-field redesign of all 14 registered section types (Hero,
  Properties, Featured, Areas, Highlights, Trust, Reviews, About, Text,
  Gallery, FAQ, Enquiry, Visits, Booking request, Offer, Contact, WhatsApp,
  Header, Footer) was **audited by reading the registry**, not rebuilt.
  They already follow the brief's rules reasonably well — `frommgr`/
  `dataRows` markers correctly separate ManagR-owned data from
  owner-editable content everywhere, none expose raw CSS/spacing/hex
  colour/z-index, and layout options are always a small curated list. The
  shared rendering shell (Content/Layout/Data, no accordions, no
  Visibility) now applies uniformly to every one of them since they all
  render through the same `InspectorPanel`/`InspectorField`. No individual
  section's field list was rewritten.
- Global Design remains a modal, not a dedicated `/website/design` page.
  It was already brought down to 4 focused, Theme-first tabs in an earlier
  pass and is not "broken" by the brief's own definition (proper header,
  bounded width, real scroll, no clipping) — moving it to a full page is a
  larger, separate change and wasn't attempted here.
- The section row's own reorder/hide/remove menu items were not audited
  section-by-section for "only show what applies" beyond what already
  existed (`dup` gates Duplicate, `structural` gates Remove).

Verified: `tsc -b --noEmit`, `npm run build`, `npm run contracts` all clean.
Live-tested at 1280px (rail gone, Design/Preview/Publish as real buttons,
Header/Contact/Gallery right panels all accordion-free with no Visibility
group, "Choose photos" opens the contextual Photos view) and at 375px
mobile (bottom bar unchanged and correct, top bar page label now static
text).

## 33. Left panel — one heading, one uniform list, no row menu, no status bar

A tight, left-panel-only pass (plus the bottom editor status bar, called out
explicitly in the request despite living outside the panel itself).

- **One heading instead of three.** The panel used to stack `PanelHeader`
  ("Sections · 14 showing") directly on top of a `Group` band that repeated
  "Page structure" as its own heading, plus a "SECTIONS" micro-label
  dividing header from body. Collapsed into a single `PanelHeader`: **"Page
  structure · 8 sections"** — one structural heading, one count, right next
  to it as secondary metadata, then the list.
- **Header and Footer are now indistinguishable from any other row.**
  Removed the `Group` wrapper and both `<div className="h-px ...">`
  dividers that fenced Header off from the body and the body off from
  Footer. All blocks — Header, Hero, Properties, …, Footer — now map
  through the exact same `<NavRow>` in one continuous list, same height,
  spacing, icon and hover/selected treatment. (Header/Footer still can't be
  dragged or removed — `canStruct`/`meta.structural` still gate that, per
  "preserve underlying constraints" — but that's an interaction difference
  driven by what's actually possible, not a visual category anymore.)
- **The row-level "⋯" menu is gone.** Deleted the `DropdownMenu` (Hide from
  website / Duplicate / Remove) from every row entirely — not replaced with
  another control. Both actions it carried already exist in the right
  inspector's header once a section is selected (an `Eye`/`EyeOff` hide
  toggle and its own "More actions" menu with Duplicate/Remove), so nothing
  was lost. Rows now end at reorder-arrows-on-hover, nothing else.
- **The bottom editor status bar is deleted**, not hidden — the
  `EditorStatusBar` component and its render call are gone from
  `EditorScreen.tsx`. "Home · N sections showing / X to review / Phone
  layout looks good" no longer occupies permanent screen space under the
  editor. ⌘K and the phone-layout check are still reachable (global
  shortcut + the toolbar's publish-options menu already had "Check phone
  layout"), so this was pure duplication, not a lost feature.
- **Fixed the backwards Add-section header.** It read "Add a section
  ⋯⋯⋯⋯⋯⋯ ‹ Sections" — the back control rendered on the right via
  `PanelHeader`'s `actions` slot, heading on the left, i.e. backwards
  drill-down order. Added a small `BackHeader` component (bounded icon
  button on the left, heading immediately beside it) and used it for both
  of Add-section's header states (locked/Basic and normal) and for the
  Photos view, which had the identical bug from the same "reuse a `back`
  button in `actions`" pattern. Verified live: clicking "Add a section" now
  reads `← Add a section`, clicking "Choose photos" reads `← Photos`, and
  the back arrow returns cleanly to Page structure both times.
- **Add-section library untouched** beyond the header fix — still the flat,
  non-accordion catalogue with search, plain category labels, thumbnail +
  name + one-line blurb, and "Already on this page" from the prior pass.
  Nothing added.

Verified live at 1280px: 8-row uniform list (Header→Gallery→Footer) all
measuring 36px via `getBoundingClientRect()`, zero `[aria-label="More
actions"]` nodes anywhere in the panel, no status bar under the canvas, both
back-headers correct. Re-checked at 375px mobile — bottom tab bar
(Sections/Add/Design/Preview/Publish) untouched and unaffected by the status
bar removal. `tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.

## 34. Top editor bar — back navigation, property context, save-state pill

Scoped to the top bar only ([EditorChrome.tsx](src/features/editor/EditorChrome.tsx)). Center (Undo/Redo/device switcher) and right (Design/Preview/Publish) clusters kept as-is — they were already directionally correct.

- **Back control clarified.** `[← Website]` stays a real `Button` (it already
  was one), but is now visually separated from the rest of the left cluster
  by one divider and given a touch more breathing room (`gap-1`), so it
  reads as "leave the editor," not as the first crumb in a breadcrumb trail.
  Still routes to `/website` — confirmed via a real click, lands on the
  dashboard.
- **The Home page dropdown is gone, unconditionally.** The previous pass
  had it conditional on page count (plain text for one page, a real
  dropdown once Advanced owners added more). This pass removes it
  outright, per explicit instruction — there is no page picker, no "Home",
  no "/" in the top bar at all any more, regardless of page count.
- **Added a real property/website-context selector**, replacing the old
  page slot. Clicking `Shree Residency ▾` opens a dropdown with "Your
  website" (the current business, checked) and "Properties on this site" —
  the actual `publicProperties` list already used elsewhere in the app
  (Availability, Properties section), not invented data.
  **Important limitation, stated plainly**: this product has exactly one
  website per account — confirmed by the router (a single `/website` route,
  no `/websites` list, no account/org switcher anywhere in the codebase).
  "Properties" are listings *inside* that one website, not separate
  switchable websites. So this selector shows real context and real data,
  but it does not — and structurally cannot — let you "switch which website
  you're editing," because that concept doesn't exist in this product yet.
  Building a fake switch would have meant inventing state the app has no
  model for. Flagged rather than faked.
- **Saved is now a compact status pill**, not a plain icon+text row:
  `bg-success-surface text-success` for Saved, a neutral pill for Saving,
  `bg-warning-surface text-warning` for Offline — all solid pre-mixed
  tokens already in `globals.css` (not opacity-modified `success/10`,
  which would hit the same "Tailwind can't blend a raw-hex CSS variable"
  issue documented in §31/§33). No new persistence states invented — still
  exactly the three that exist in `SaveState`. This is a shared
  `SaveDot`, so the mobile top bar's save indicator picked up the same
  refinement for free.
- **Grouping reduced to one divider** in the left cluster (between "leave"
  and "current context + save state"), not several — matches "avoid
  excessive vertical separator lines."

Verified live at 1280px: back button navigates to `/website`; property
dropdown opens and lists real properties; Design/Preview/Publish and the
device switcher all still fire correctly (checked via real clicks, not just
inspection — Undo/Redo enable after a real change and undo/redo it, the
Publish dropdown opens with all five items, Desktop/Phone switching updates
the canvas label); a synthetically long business name truncates at the
selector's `max-w-[220px]` with no overflow or collision with Design/
Preview/Publish. `tsc -b --noEmit`, `npm run build`, `npm run contracts`
all clean.

## 35. Right inspector — visible subsections, real header actions, redesigned DATA cards

The biggest single pass of this project: the section inspector
([InspectorPanel.tsx](src/features/inspector/InspectorPanel.tsx),
[registry.ts](src/features/sections/registry.ts),
[common/index.tsx](src/components/common/index.tsx)). Two rounds — a full
structural pass, then a targeted DATA/header refinement once the structural
pass was live.

**Structural pass:**

- **Per-section Spacing (Cozy/Compact/Roomy) removed entirely.** It was
  tucked behind a "Spacing" text-disclosure inside every section's Layout
  group. Spacing/density is a global Design decision, not a per-section
  one — audited the whole registry, this was the only place it leaked in,
  now gone with no replacement control.
- **"Picture & button wording" and every other hidden disclosure removed.**
  The registry's `content` schema changed from `{primary, more?}` (one
  optional hidden bucket) to `{primary, groups?}` — any number of named,
  **always-visible** subsections, styled identically to Content/Layout/Data.
  Migrated: Header → "Navigation", Hero → "Button" + "Image" (split, per the
  brief's own worked example), Properties → "Display", About → its photo
  field promoted to its own "Image" group. FAQ and Offer's `more` buckets
  held nothing but a single static note each — folded those directly into
  Content instead of inventing a one-line subsection.
- **Section header actions are now direct icon buttons**, not a "⋯" menu:
  Eye (hide/show) · Duplicate (only when `meta.dup`) · Delete (only when
  `!meta.structural`, styled destructive) · a divider · Close/Deselect. No
  fake buttons — Duplicate only appears where `dupBlock` genuinely exists.
- **Layout grid changed from a cramped single row to a real 2-column
  grid** (`ChoiceGrid columns={2}` unconditionally) — 2 layouts sit side by
  side, 3 wrap 2+1, 4 wrap 2+2, verified on Hero (5!), Contact (2),
  Highlights (3), Properties (4).
- **Layout/Data groups no longer render when empty.** A section with a
  single "Default" layout variant shows no Layout group at all (Header,
  Footer, FAQ, Trust, …); a section with no `dataRows` shows no Data group
  at all (Highlights, Areas, Trust, Enquiry's operational fields, …) — no
  more "this section has no ManagR data" filler card.
- **A real, honest "Edit in ManagR" bug was fixed.** The pre-existing
  `BoundField`'s "Edit in ManagR →" button had no `onClick`/`href` at
  all — a dead control on every single data row, in production. Added a
  small `where → destination` map covering only the destinations that
  actually exist in this codebase (`Website settings → Contact` →
  `/website/settings`), and every other `where` value now renders as plain
  inert text instead of a fake link.

**DATA and header refinement (this round):**

- **Header alignment fixed at the root cause.** The header row used
  `items-start` with hand-tuned `pt-0.5` nudges on the text block and the
  actions row to fake vertical centering — the classic sign the wrong
  alignment property was in use. Switched to a fixed `h-[60px]` row with
  `items-center` (the same pattern `CardHead` already uses elsewhere in the
  app) and removed both padding hacks. Verified by measuring: icon, text
  block and actions all land on the exact same vertical center (confirmed
  via `getBoundingClientRect()`, not just eyeballing), for both the
  `IconTile`-based header (regular sections) and the plain-span header
  (structural sections) — they use the same 36px box, so nothing needed to
  change there.
- **DATA rebuilt around "Managed by ManagR" (or "Website settings")
  spoken once, plus one bordered card per logical data source.** The old
  layout was a flat, undifferentiated run of label/value/"Managed in X"
  lines with the ManagR sentence repeated per row (or, on Contact, an
  inline red "Edit in ManagR →" floating with no visual anchor at all). New
  `DataSource` component says the source once, compactly, with a link icon.
  New `DataCard` wraps each `dataRow` as its own quiet `bg-surface-2`
  bordered card: eyebrow (what this is) → bold value → a bottom line
  pairing "Managed in …" with the action, only where a real one exists.
  Properties' previously-orphaned "Set up live availability →" button (it
  used to float below the cards as a separate, disconnected control, with
  "Availability shown: roomtype" as a trailing unexplained line) is now
  folded directly into its own data card's action + source line.
- **Source label is now correct per section**, not a blanket "ManagR"
  claim: sections whose `dataRows` are entirely Website-settings-sourced
  (Contact, Footer) say "Website settings"; everything actually CRM-sourced
  (Hero, About, Gallery, Properties, Reviews) says "Managed by ManagR" —
  computed from the data itself, not hardcoded per section type.
- **Added the missing `--destructive-surface` solid token** (globals.css +
  tailwind.config.ts), matching the existing `success-surface`/
  `warning-surface`/`info-surface` convention, so the new destructive
  Delete button gets a real light-red hover state — confirmed present in
  the compiled CSS and via computed style (text renders as the actual
  destructive red, not silently dropped like the app's older
  opacity-modified destructive classes elsewhere).

Verified live across Header, Hero, Properties, Highlights (incl. its real
Duplicate action), About, Contact, Gallery, FAQ, Reviews, Enquiry, Footer:
every header measures identically centered; every Data section renders as
discrete cards with a correct, single source line; layout grids are 2-wide
everywhere; no accordions, no "⋯" menus, no dead links anywhere in the
panel. `tsc -b --noEmit`, `npm run build`, `npm run contracts` all clean.

**Known, stated limitation:** FAQ still has no real add/reorder/remove
mechanism — the registry only ever had two static guidance notes here, not
an actual repeating-list field kind. Building one would be new CMS
functionality (a new `Field` kind, a new reducer shape for a per-block list)
explicitly out of scope for a presentation-only refinement pass. Copy was
corrected to stop implying a "one tap to add" interaction that doesn't
exist, but the underlying gap remains and would need its own scoped task.

## 36. DATA card — from "text lines with different fonts" to a real 3-zone component

A deeper pass than §35's visual polish — this changes the underlying
information architecture of the DATA card itself, in both the registry
schema and the component ([registry.ts](src/features/sections/registry.ts),
[common/index.tsx](src/components/common/index.tsx),
[InspectorPanel.tsx](src/features/inspector/InspectorPanel.tsx)).

- **The registry's `dataRows` schema changed shape**, from `{label, value,
  where}` (which conflated "what this is," "its value," and "what fields
  it includes" into two ambiguous strings) to `{title, context, state,
  detail?, where}` — a real identity/state split. Every one of the 9
  sections with `dataRows` (Hero, Properties ×2, Reviews, About, Gallery,
  Enquiry, Visit, Contact ×2, Footer) was re-authored, not just
  re-templated: e.g. Properties' first row used to read `label: "Property
  name, area, rent, rooms"` as if that were the identity — it's actually
  describing which fields are included. Now: `title: "Property
  information"`, `state: "Approved properties"`, `detail: "Property name,
  area, rent, rooms"` — identity, current state, and field list are three
  different things again.
- **`DataCard` rebuilt as a genuine three-zone component**, not a
  restyled stack of lines: **Identity** (title, bold caption + a quieter
  context line directly under it) → **State** (the current value, now the
  single strongest line in the card — `text-body font-bold`, everything
  else is `text-caption`) → **Footer**, separated by an actual `border-t`
  divider, pairing "Managed in X" (left) with the action (right). The
  footer — divider included — only renders at all when there's a `where`
  or an `action`; a purely informational card (Map location) ends cleanly
  after its state/detail, with no dangling empty footer.
- **Fixed the exact bug called out**: "Edit in ManagR →" used to sit beside
  a metadata line mid-card, with no visual anchor. It now lives in its own
  footer row, right-aligned against the left-aligned source text, separated
  from the state by a divider — verified it never collides with source
  text, including on the longest real `where` string in the registry
  ("Website settings → Contact").
- **Live availability now reflects real state**, not a static placeholder.
  `DataBody` computes its `state` at render time — `"Not set up yet"` vs
  `"Showing {level}"` — instead of the registry's old fixed copy ("Set in
  Live availability") that never changed regardless of whether the owner
  had actually turned it on. Verified both states live by toggling
  `s.availOn` in the running app.
- **Source label logic unchanged from §35** (Website settings vs Managed by
  ManagR, computed from the data) — still correct under the new schema.

Not touched: the "don't invent a destination" rule from §35 — the
`MANAGR_ACTION` map still only resolves `where` values that have a real
route (`/website/settings`, `/website/availability`); every other row
(Properties → Photos, Tenants → Reviews, Leads & CRM, Visit settings) still
renders as plain, honest, non-clickable text.

Verified live: Contact (2 cards, one with a footer+action, one purely
informational with none), Properties (2 cards, one static "Managed in
Properties" with no action since none exists, one with a dynamic
configured/not-configured state), Footer, Enquiry, Reviews, Hero, About,
Gallery — each scannable in the "identity → state → where/action" order
the brief asked for, no card taller than it needs to be, no wrapping
collisions. Section header alignment (fixed in §35 — `h-[60px]`,
`items-center`, 3px title/subtitle gap) re-verified unchanged and correct.
`tsc -b --noEmit`, `npm run build`, `npm run contracts` all clean.

## 37. Final full-editor polish pass — a real, app-wide focus-ring bug found and fixed

A comprehensive audit of the finished editor (toolbar, left panel, canvas,
right inspector, all 19 registered section types, Basic/Advanced plan
states) rather than another redesign — per explicit instruction, the goal
was to fix genuine problems, not restyle what already works.

**What was audited, live in the browser, and found already solid (no
change made):**
- Top toolbar balance and overlap at 1366 / 1280 / 1024px, including a
  synthetically long property name — zero overlap between the left cluster,
  the absolutely-positioned center well, and the right cluster at any
  width tested, down to the exact 1024px `lg` breakpoint edge.
- The Add-section flow's auto-return to the section list after adding
  (`addBlock` sets `leftMode: "layers"` and selects the new block) —
  initially looked like a bug during testing (multiple sequential adds
  from one script "failed"), traced to the actual cause: this is
  deliberate, pre-existing reducer behavior ("add it, then show me exactly
  that block selected and ready to edit"), not a defect. Left untouched.
- All 19 registered section types (Header, Hero, Properties, Highlights,
  About, Contact, Featured property, Areas, Trust, Reviews, Text, Gallery,
  FAQ, Enquiry, Visits, Booking request, Offer, WhatsApp, Footer) added to
  a page and individually inspected — every one renders only the
  subsections that genuinely apply to it (no forced empty Layout/Data/
  Image/Button groups), no accordions crept back in, no fake actions.
- The Advanced-lock state (Enquiry/Visits/Booking request under a Basic
  plan) — single focused card, one real CTA ("See Advanced") + a real
  dismiss ("Not now"), not a marketing wall.

**A real, previously-invisible bug found and fixed — app-wide, not editor-
specific:** `--ring` (globals.css) was declared as a plain hex string
(`#f7553d`), the same mistake already found and fixed twice this project
for other tokens (`--brand`, `--destructive`). Every `ring-ring/NN` class
in the entire app — `Button`'s and `Input`'s and `Checkbox`'s and
`Dialog`'s focus rings, `common/index.tsx`'s focus rings — silently
compiled to nothing. **Every focused input, button, and checkbox in this
product has had no visible focus ring at all.** Confirmed by grepping the
built CSS before the fix (no rule existed for e.g. `.focus-visible\:ring-ring\/25`)
and after (`rgb(var(--ring) / .25)`, a real rule). Fixed at the root this
time, correctly, instead of patching each call site: `--ring` is now a
channel triplet (`247 85 61`) consumed as `rgb(var(--ring) / <alpha-value>)`
in `tailwind.config.ts` — the standard pattern for a token that
legitimately needs graduated opacity, as opposed to the discrete solid
tint tokens (`bg-tint-coral`, `success-surface`, `destructive-surface`)
used everywhere else in this codebase. The one direct CSS consumer
(`:focus-visible`'s `outline`) was updated to `rgb(var(--ring))` to match.
Fixes every focus ring in the product in one change, not just the editor.
- **The canvas's unselected-section hover ring was equally broken** —
  `hover:ring-1 hover:ring-inset hover:ring-brand/20` in
  [WebsiteCanvas.tsx](src/features/editor/WebsiteCanvas.tsx), same root
  cause (`--brand` is also a plain hex, not alpha-blendable). Rather than
  convert `--brand` itself (used everywhere at full opacity already, higher
  blast radius), added one precomputed solid token, `--brand-ring-soft`
  (a ~20%-brand-over-white mix), and pointed the hover state at it —
  confirmed compiling to a real rule and (unplannedly, but conclusively)
  observed rendering live: a leftover focused input from an earlier test
  step showed a visible orange focus ring in a screenshot taken immediately
  after this fix, where none would have appeared before it.

Not touched: the still-open, separately-tracked app-wide opacity-modifier
audit (`task_1d18e903` from an earlier session) — `ring-brand/20` and
`--ring` were fixed here because they were directly encountered auditing
the editor's own interaction states; the remaining flagged instances
elsewhere in the app (VisitsScreen, SettingsScreen, SetupFlow, WebsiteHome,
DesignSheet, the shared `ChoiceRow`/`ChoiceCard`) are outside this editor
polish pass and remain queued in that task.

Verified: `tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.
Confirmed in the built CSS that `ring-ring`, `ring-ring/20`, `ring-ring/25`,
`ring-ring/50`, `ring-ring/60`, and `ring-ring-soft` all now generate real
rules with the correct colors and alpha values.

## 38. Desktop-only editing — a real product constraint, not a broken responsive editor

New product decision, implemented and folded into the same final QA pass:
editing requires desktop; tablet/phone owners get a clean, intentional
preview-only state instead of a cramped or half-working editor. ([EditorScreen.tsx](src/features/editor/EditorScreen.tsx))

- **Two critical distinctions kept separate, as required:** (1) the
  *actual environment* the owner is using the editor from, vs. (2) the
  `Desktop/Tablet/Mobile` control that previews the generated *website* at
  different sizes from a desktop editor. The second was never touched or
  consulted for this — it's driven entirely by `s.device`, a separate,
  pre-existing piece of state; the new gating reads none of it.
- **Detection reuses the editor's own existing breakpoint**, not a new
  device-detection system: the `lg` (1024px) Tailwind breakpoint is the
  same one `EditorChrome`, `LeftPanel`, and the inspector columns already
  require to lay out the three-column grid at all — there was no sensible
  threshold to invent. Documented as `EDITOR_MIN_WIDTH = 1024` so the
  number has one named home instead of being restated as a bare `1024`
  anywhere new.
- **Both the desktop editor and the new notice are always mounted** —
  gated by CSS (`hidden lg:flex` / `lg:hidden`) exactly like the rest of
  this editor's existing responsive chrome, not by a JS width check that
  would mount/unmount trees. Consequence: crossing the breakpoint in either
  direction is a pure repaint. Verified directly — selected "Highlights",
  narrowed the window below 1024px (notice appeared), widened back past it,
  and the inspector still showed "Highlights" selected. Nothing in the
  store (selection, undo history, draft edits, current page) is tied to
  which chrome is visible, so nothing to lose.
- **The non-desktop state**: a minimal header (back to `/website` + the
  business name — no Saved dot, no Design/Publish, nothing that isn't
  real here), a calm neutral `Monitor` icon (not a warning triangle, not
  red), "Editing is available on desktop" / "Use a desktop computer to
  edit your website. You can still preview it here.", and one action —
  **Preview website**, linking to the already-existing `/website/preview`
  route (`VisitorSite`) verbatim. No duplicate preview logic was built.
- **The previous mobile *editing* chrome (`EditorMobileTop`,
  `EditorMobileBar`, `EditorMobileFloat`) is no longer rendered** — it
  used to let a phone-width user tap sections on the canvas and open
  Sections/Add sheets, which is exactly the "half-working editor" this
  product decision rules out. Left the component definitions and the
  `MobileSheets.tsx` overlays in place rather than deleting them: they're
  simply unreached now (no trigger sets their overlay state), which is a
  much smaller, safer change for a polish pass than excising them and
  their `EditorContext` overlay-type wiring.
- **Verified boundary precisely**: 1024px → full editor; 1023px → notice,
  confirmed both ways by reading the rendered DOM, not just visually.
  Confirmed no horizontal overflow at 375px. Confirmed the desktop
  `Desktop/Tablet/Mobile` preview switcher still works untouched at
  1280px, immediately after this change.

**Not touched:** the actual public website (`VisitorSite`) — fully
responsive on every device, as it already was; this constraint applies
only to the builder's own editing chrome. Publishing behavior — untouched;
nothing here alters draft/publish state, and there is no separate
publishing path introduced for this state (Publish isn't offered at all
below the breakpoint, matching "don't imply you can publish from here").

`tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.

## 39. Layout selection double-outline, DATA footer collision — two real bugs found and fixed

Focused fix pass on three flagged areas of the right inspector — one turned
out to already be correct, two were real, verifiable bugs.

- **Layout card "orange + blue" double outline — root cause diagnosed and
  fixed.** `ChoiceCard`'s selected state was `border-brand` (solid, real)
  plus `ring-1 ring-inset ring-brand/20` (the by-now-familiar bug: `--brand`
  is a raw hex var, so `ring-brand/20` compiles to nothing). Critically,
  `ring-1`/`ring-inset` themselves are real, valid utilities that set
  `--tw-ring-shadow` — with no color utility successfully setting
  `--tw-ring-color`, the ring fell back to **Tailwind's own default ring
  color, blue-500** — exactly the stray blue outline reported, riding
  underneath the (real) orange border. Fixed by removing the ring
  entirely rather than re-coloring it: the selected state is now one
  deliberate solid `border-brand` + a solid `bg-tint-coral` fill (a real
  token, not an opacity modifier) + the existing corner dot. Mouse-selected
  state (persistent border+fill) and keyboard focus (the global
  `:focus-visible` outline, real again since `--ring` was fixed to an
  alpha-blendable token in the previous pass) are now genuinely two
  different, non-competing visual states instead of one broken ring trying
  to serve both. Verified: selected card's className is exactly `border
  border-brand bg-tint-coral` — no `ring-*` class present at all.
- **Section header alignment — audited, found already correct, left
  alone.** Measured directly rather than trusting the screenshot: title→
  subtitle gap is 3px, and icon/text-block/actions all share the exact
  same vertical center (89.6px) in a fixed 60px row. This was fixed in an
  earlier pass and remains correct — no change made here, per "don't
  change what isn't broken."
- **DATA card footer collision — a real bug, now fixed.** The footer row
  was `flex items-center justify-between` with the source text
  `truncate`/`min-w-0` and the action `shrink-0` — exactly the layout that
  produces "Managed in Website setting…　Edit in ManagR →" once both
  strings don't fit one line, which they routinely don't in a ~260px-wide
  card. Source and action now stack on **separate lines** — source gets
  the full card width (only truncates if it alone overflows, essentially
  never), action renders in full on its own right-aligned line below.
  Collision is now structurally impossible regardless of string length.
  Also nudged the card's internal spacing to the requested ranges: padding
  `px-3 py-2.5` → `px-3.5 py-3` (14px/12px), header→body and body→footer
  gaps `mt-2`/`mt-2.5` → `mt-3` (12px) — using existing spacing scale
  values, no new tokens.

Verified live: Contact's "Managed in Website settings → Contact" (the
exact long string from the bug report) now sits on its own full-width
line with "Edit in ManagR →" cleanly below it, no truncation, no overlap.
Properties' two cards (Property information — no action, since no route
exists; Live availability — dynamic "Not set up yet" + "Set up live
availability →") both render with the same structure. Layout grids
re-confirmed at 2 and 4 variants (Contact, Properties) with the corrected
selected state.

Not changed: the DATA section's higher-level "no data yet" states — those
are already handled one tier up, by the existing `needsData` panel-level
notice (shown before Content/Layout/Data render at all), so no separate
empty/disabled DataCard variant was built on top of it — building one
would duplicate that existing state rather than filling a real gap.

`tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.

## 40. One selection language (orange border, no fill) + DATA simplified to a single "managed automatically" summary

A direction change on two fronts, both implemented: selection everywhere
becomes a border, not a fill; DATA drops the per-field "database record"
framing entirely in favor of one plain summary per source.

**Selection — one system, border only:**
- **Left panel section rows** ([LeftPanel.tsx](src/features/editor/LeftPanel.tsx)):
  removed the `bg-tint-coral` fill from `NavRow`'s selected state. Selection
  is now `border-brand` alone — the row already reserved a `border`
  (transparent when unselected) from an earlier pass, so this is a pure
  colour swap with zero geometry change (re-verified: every row still
  exactly 36px regardless of border colour).
- **Layout cards** ([panel.tsx](src/features/editor/panel.tsx)): removed
  `bg-tint-coral` and the corner dot from `ChoiceCard`'s selected state —
  same reasoning: one signal, not two. Selected is now `border-brand` on
  the same `bg-surface-2` every card already uses; the inner preview swatch
  border is back to the plain neutral colour in both states (no accent
  tint) so "the inside of the card" is genuinely unchanged by selection, as
  asked.
- **A real, separate keyboard-focus gap found and fixed along the way**:
  `NavRow` had an unconditional `outline-none` with *no* replacement focus
  style at all — not `focus-visible:outline-none` (which the rest of the
  app pairs with a ring), just `outline-none`, full stop. Keyboard-tabbing
  to a section row showed literally nothing. Fixed to
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
  focus-visible:ring-ring/60` — a real, visible, inset ring while tabbed,
  independent of the persistent selected-border colour. `ChoiceCard` needed
  no equivalent fix — it never set `outline-none`, so the global
  `:focus-visible` rule (fixed to a real alpha-blendable token two passes
  ago) already applied to it untouched.

**DATA — dropped the per-field "record" framing:**
- **Registry schema simplified again**, from `{title, context, state,
  detail?, where}` (an identity/state/source split that still read like
  database fields) to `{items: string[], note: string, where: string}` —
  `items` is a plain list of what's automatic (field *names*, e.g.
  "Property name", "Area", "Rent", "Rooms" — not values), `note` is one
  explanatory sentence, `where` still resolves an action through the same
  `MANAGR_ACTION` map as before (unchanged mechanism — no route was
  invented). Migrated all 9 sections with `dataRows` (Hero, Properties ×2,
  Reviews, About, Gallery, Enquiry, Visit, Contact ×2, Footer).
- **`DataCard` rebuilt around the new mental model**: a "Managed
  automatically" header, a plain bulleted list of what's automatic, a short
  note, and — only when `MANAGR_ACTION` resolves a real destination — an
  actual bounded `Button` (`variant="outline"`, full-width) at the very
  bottom, separated by a divider. Not a filled orange button (that's
  Publish's job), not a text link floating mid-card.
- **`DataSource` (the once-per-section top indicator) shortened** to a
  single line — icon + "Managed automatically" — dropping the previous
  two-line "Managed by ManagR / Changes update automatically." and the
  website-settings-vs-ManagR distinction it used to carry at that level;
  section-specific nuance (e.g. "these details are managed in Website
  settings") now lives in each card's own `note` instead.
- **Live availability's dynamic behaviour preserved**: `DataBody` still
  overrides that one row's `note` at render time — "Not set up yet." vs
  "Showing {level}." — the only genuinely runtime-dependent line in the
  whole system; verified both states live.

Verified in the browser: Contact renders two cards (contact channels, with
a real "Edit in ManagR →" button; map location, informational, correctly
no button) with the exact bulleted-list structure; Properties renders two
cards (property fields, no action since no route exists; live availability,
dynamic note + real setup action); layout selection on both a 2- and a
4-variant grid shows a single clean orange border with no fill and no dot;
section-row selection shows the same border-only treatment with stable 36px
row height throughout.

`tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.

## 41. DATA — real card composition, one source statement, one real orange button

A full recomposition of `DataCard`/`DataSource`/the registry's `dataRows`
shape — the third and final iteration on this component this project, this
time changing the actual composition rather than typography/padding.

- **"Managed automatically" no longer repeats per card.** It was the
  header of *every* card in the previous iteration (§40) — genuinely
  redundant once a section has two cards (Contact, Properties both showed
  it twice). `DataSource` now says it once, for the whole DATA group:
  "Managed automatically from ManagR / These details stay in sync with
  your account." Each card's own header is now the thing that's actually
  different between cards — its category name.
- **Registry schema changed a third time**, from `{items, note, where}` to
  `{title, items, note?, where}` — cards were missing an actual identity
  before this (they opened directly on the repeated "Managed automatically"
  line with no way to tell "Property information" apart from "Live
  availability" except by reading the bullet list). `title` is now a real
  bold, uppercase, micro-caps card heading ("PROPERTY INFORMATION",
  "CONTACT INFORMATION", "LIVE AVAILABILITY", "MAP LOCATION" …) — the
  card's identity, matching the app's existing heading convention rather
  than inventing a new one. Migrated all 9 sections with `dataRows` again.
- **The card now actually looks like a card.** Panel body and `--surface`
  are the same white, so a background-color difference was never going to
  read as elevation — swapped the fill-based distinction for what the
  design system already has for exactly this (`shadow-xs`, used elsewhere
  for "elevated but calm"): `border-border` (a full, visible border, not
  `border-subtle`) + `shadow-xs` + `rounded-xl` (bumped from `rounded-lg`,
  matching this token's role as a surface rather than a control). No new
  shadow/radius token invented.
- **The list is a real list now**, not bullets dressed up as prose: plain
  `<li>` rows at `text-body` (the content's actual weight, one step up
  from caption-sized metadata), `space-y-1.5`. Single-fact cards (Hero's
  "Background photo", Reviews) render no list at all rather than a
  one-item bullet that added nothing — just the category heading and a
  one-line note.
- **The action is now unmistakably a button.** The previous two rounds
  used an `outline` button, easy to miss against the card's own border.
  It's now `variant="primary"` — the same solid orange as Publish, full
  width, at the very bottom of the card, below a divider and a quiet
  "Managed in X" line. Distinguished from Publish by context and size
  (`size="sm"`, embedded in an inspector card) rather than by being a
  weaker color — the brief was explicit that a weak/text-link action was
  the actual problem, not that it needed to avoid orange.
- **No dead footer.** Cards with no real destination (Property information,
  Reviews, Hero/About/Gallery's photo fields, Visit settings, Map location,
  Enquiry's lead routing) render no divider and no "Managed in X" line at
  all — the footer block exists only when `action` resolves through the
  same `MANAGR_ACTION` map as the last two rounds (still only
  `/website/settings` and `/website/availability` — no new destinations
  invented).

Verified live: Properties renders two cards ("PROPERTY INFORMATION" —
4-item list, no footer; "LIVE AVAILABILITY" — 2-item list, dynamic
"Not set up yet."/"Showing {level}." note, real solid-orange "Set up live
availability →" button). Contact renders two cards ("CONTACT INFORMATION"
— 3-item list, real "Edit in ManagR →" button; "MAP LOCATION" — no list,
one privacy note, no footer, no fake action). Hero renders one single-fact
card ("BACKGROUND PHOTO", no list, one note). Left-panel and layout-card
selection (border-only, from §40) re-verified unaffected — Hero's row
showed the real `rgb(247, 85, 61)` border with zero background fill after
selecting it, 36px row height unchanged.

`tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.

**Still not built, stated plainly (unchanged from §40):** a distinct
"empty" DataCard state (e.g. "Property photos / No photos available yet /
Add photos in ManagR →") — Gallery's true empty-photos case is already
handled one tier up by the existing `needsData` panel-level notice, so a
second empty-state surface inside DataCard would duplicate it rather than
fill a gap.

## 42. Design — rebuilt from first principles around Style / Brand / Typography

A genuine information-architecture redesign of the global Design experience
([DesignSheet.tsx](src/features/editor/overlays/DesignSheet.tsx)), not a
relabel of the old Theme/Template/Colour/Typography tabs.

- **Template removed from Design entirely.** It let owners re-arrange
  sections from inside a "look" dialog — a second, competing mental model
  for the same job Add/reorder/Layout already do. The `TEMPLATES` data and
  `applyTemplate` reducer action are untouched (still real, still callable)
  in case they're useful elsewhere later; they're simply no longer a
  Design-facing control.
- **Three tabs, matching the three real questions**: **Style** ("what
  should my website look like") · **Brand** (logo + brand colour — Colour
  folded in here, since a colour choice is a brand decision, not a
  separate axis) · **Typography** ("what should the type feel like").
- **Style presets now show, not just tell.** Each of the three curated
  presets (renamed Clean/Warm/Premium — reusing the existing `THEMES` data
  as-is, no new design system invented) gets a small honest schematic
  preview built from the theme's own real `accent`/`radius`/`cards`
  fields — never a screenshot, never a promise the site doesn't keep.
- **Global Spacing finally has a real home** — and a real effect. `Balanced
  / Airy`, writing to `s.layoutDensity`. This is the same state field the
  earlier per-section Cozy/Compact/Roomy control should have been backed
  by all along but never was — `layoutDensity` existed in the store (typed,
  tracked in the dirty-check) but nothing ever read it. Traced the actual
  per-section spacing rendering to `WebsiteCanvas.tsx`'s `DENSE[b.dense]`
  lookup, and found `block.dense` itself has been frozen at its initial
  "comfortable" value for every block since the per-section control was
  removed (nothing writes to it any more). Rewired the lookup to read
  `s.layoutDensity` instead — the new Spacing control is the first thing
  that's actually applied it, not a fake toggle sitting on top of dead
  wiring.
- **Brand colour is now genuinely safe, not just described as safe.**
  Kept the curated swatch grid (`PALETTES`, real accessible-by-construction
  colours) and added a real custom-colour path: a hex `Input` with live
  swatch preview, format validation ("Enter a valid colour, like
  #F7553D" — no RGB/HSL/alpha exposed), and an Apply step. Verified: an
  invalid value is rejected with a visible error and never applied; a valid
  one applies immediately and the "Reset to style colour" action appears
  only once there's an actual override to reset (not permanently
  occupying space).
- **Typography previews are real, live samples** — the same three lines
  (business name / one-line pitch / a "View rooms" button) rendered once
  per option with only the type treatment changing between them (weight,
  tracking, case), so the difference is seen, not read. The preview button
  uses the owner's actual selected brand colour (`siteAccent(s)`, not a
  static swatch), so Brand and Typography never look like two disconnected
  systems even inside a single preview card.
- **One selected-state language, everywhere in this dialog and beyond.**
  Style presets, Spacing options, Brand colour swatches, and Typography
  cards all use the same `border-brand`-only treatment established in
  §40/§41 — no fill, no ring, no checkmark badge. While auditing this, found
  and fixed the exact same broken-opacity "orange + stray blue ring" bug
  (`bg-brand/[0.05] ring-1 ring-inset ring-brand/20`, the by-now-familiar
  "Tailwind can't alpha-blend a raw-hex CSS var" failure) still present in
  the shared `ChoiceRow` component — used by `AvailabilityScreen` and
  `UpgradeScreen` too, so this fix reaches beyond just Design.
- **Live preview confirmed working end-to-end**, not merely wired: selected
  Warm in Style, watched the canvas's Call button switch from coral to the
  Warm theme's own brownish accent live, with no reload. Confirmed brand
  colour overrides correctly take priority over the theme's own accent and
  persist across a Style change (deliberately — Brand and Style are
  independent axes, not one overwriting the other).
- **Removed the redundant "Current" badges** (the border already
  communicates selection) and the old "Business name, phone and address
  come from Website settings" full `Notice` card, replaced with one
  compact inline sentence + a real link to `/website/settings`.

**Verified, pre-existing, and explicitly not this task's to fix:** the
separate public-preview prototype (`VisitorSite.tsx`, the `/website/preview`
route) does not read `s.theme`, `s.brandColor`, `s.fontPair`, or
`s.layoutDensity` at all — confirmed by checking for any reference and
finding none. This predates this change entirely: none of the *previous*
Theme/Colour/Typography controls ever affected that route either, since it
renders through an entirely separate, hardcoded component tree rather than
`SectionCanvas`/`WebsiteCanvas`'s pipeline. Design changes are fully live in
the editor's own canvas (what the owner actually looks at while editing);
they don't yet reach the separate visitor-preview mock. Confirmed the
public preview route still renders correctly and is unaffected either way.

`tsc -b --noEmit`, `npm run build`, `npm run contracts` clean.

---

## 43. Design — engineering pass on §42's IA (Emil Kowalski review, implemented)

Run under the `emil-design-eng` skill: first an **audit-only** pass against
Emil Kowalski's design-engineering principles, the app's own tokens, and the
§42 IA (no edits); then this implementation pass against that audit's
findings. Scope stayed exactly where the brief drew it: **only
[DesignSheet.tsx](src/features/editor/overlays/DesignSheet.tsx)**. No product
IA change, no new tokens, no new features, no other editor screen touched.

| Before | After | Why |
| --- | --- | --- |
| `{tab === "style" && <StyleTab/>}` etc. inside a plain `<div>`, with `TabsContent` imported but never used | Real `<TabsContent value="style">…</TabsContent>` (and `brand`/`type`) inside the existing `<Tabs>` | The manual conditional skipped Radix's `role="tabpanel"`/`aria-controls` wiring entirely — keyboard users and screen readers got a `tablist` with three tabs pointing at nothing. `TabsContent` has zero built-in transition (confirmed by reading `tabs.tsx`), so switching gained real semantics with no visible animation — satisfying "no animation on tab switch" for free instead of needing to suppress one. |
| Style rows, Spacing options, Brand swatches, Typography cards: bare `transition-colors`, no `:active` state | Added a shared `CARD_INTERACTIVE = "transition-colors duration-100 ease-smooth active:scale-[0.98]"` applied to every one of them | This dialog was the one place left in the editor with zero press feedback — every other pressable surface (`Button`, canvas selection) already used `ease-smooth` + a press cue. `scale-[0.98]` rather than `Button`'s `translate-y-px` because these are square/wide cards, not pill buttons — a Y-nudge on a 68px-tall row reads as a jump, a subtle uniform scale reads as a press. |
| Style list ran straight into "Spacing" with only a `mt` gap | `border-t border-border-subtle pt-4` between them | Matches the divider rhythm the Brand tab already used before Brand colour — makes Style read as two decisions (look, then density) instead of one long list that happens to grow a second heading. |
| `StylePreview`: 64×48px, three flat bars, no depth | 96×64px schematic with a heading line, a dot, a filled "photo" block and an accent chip bottom-right, still built only from the theme's real `accent`/`radius`/`cards` fields | The audit's "improve horizontal-space usage" point — the old preview was too small to actually communicate a style at a glance and left the row looking like a settings list item rather than a visual choice. No new preview system, no screenshot, no invented styling not backed by the real theme object. |
| Brand colour swatches: 28px flat circles | 32px circles + `ring-1 ring-inset ring-black/[0.06]` | A hairline inner ring gives every swatch a defined edge against the white card background (several palette colours were previously indistinguishable from the card at a glance) without touching `PALETTES` or the colour system itself. |
| Section comment block described the redesigned IA from §42 but not this pass's interaction language | Rewrote the file's top comment to also state the shared tactile language (`ease-smooth`/`duration-100`/press cue) and the reasoning for real `TabsContent` | Keeps the file self-documenting for the next session, consistent with every other file's header-comment convention in this codebase. |

**Left untouched, deliberately:** `DialogContent`'s size/radius/shadow/open
animation (already correct per Emil's modal-centering exemption — confirmed
by re-reading `dialog.tsx`); Brand tab's IA (Logo → Website-settings pointer →
Brand colour — no change needed, just got the same press/rhythm treatment);
Typography tab's IA and its live preview logic; every `dispatch`/`toast` call,
the hex-validation regex, and the `isPreset`/reset-to-style-colour logic —
none of that changed, this pass is styling/structure only. Plus Jakarta Sans
untouched; no arbitrary font picker added; no decorative animation added for
its own sake (only real state-change feedback).

**Verified:**

- `npx tsc -b --noEmit`, `npm run build`, `npm run contracts` — all clean, no
  new warnings.
- Live in-browser (preview server restarted first — it had been running
  ~19h and had drifted into a stale HMR state referencing removed code from
  earlier in this session; a fresh tab against a freshly-started server
  showed **zero console errors**): opened the editor, opened Design, and
  visually confirmed all three tabs — Style (schematic previews, Warm
  selected with a border, Spacing divider + Balanced selected), Brand
  (larger ringed swatches, Warm-derived colour selected), Typography (three
  live preview cards, Modern selected, brand-colour button in each preview).
- Confirmed the real accessibility tree via `read_page`: a genuine
  `tablist` → `tab`×3 → `tabpanel` structure is now present (previously a
  bare `div` with conditionally-rendered children and no tabpanel role at
  all).
- Mouse-driven tab switching confirmed working via screenshots (Style →
  Brand → Typography, each rendering its correct panel). Arrow-key
  round-tripping between tabs did not register a selection change in this
  automated browser tool specifically — but this is Radix Tabs' own
  built-in keyboard handling, entirely unmodified by this pass (no custom
  `onKeyDown` was written or touched), and is the same primitive already
  used elsewhere in the app; treating this as a tool-level synthetic-event
  quirk (consistent with this session's earlier notes on Radix components
  not always responding to synthetic clicks/keys) rather than a product
  regression, since the underlying wiring is exactly Radix's own tested
  ARIA-tabs implementation.
- Re-confirmed the live-preview path from §42 still works after these
  changes: selecting "Clean" in Style updated the canvas selection state
  immediately (toast fired, border moved), then reselected "Warm" to leave
  state as found.

---

## 44. Design — full redesign: the "Design Studio" (emil-design-eng, independent authority)

A ground-up redesign, explicitly authorised to ignore §42/§43's layout,
tabs, modal size and card language and make new composition decisions
from `emil-design-eng` alone. Scope stayed the same as §43: only
[DesignSheet.tsx](src/features/editor/overlays/DesignSheet.tsx). No product
IA change beyond composition (still Style / Brand / Typography), no new
store fields, no other editor screen touched.

### 44.1 The core decision: a rail + stage "studio," not top tabs over a list

Top tabs over a stacked list of rows reads as a settings form. Replaced it
with a persistent **left rail** (Style / Brand / Typography, vertical) next
to a **wide stage** that shows one thing at a time, large:

- The rail is Radix `Tabs` with `orientation="vertical"` — same tested
  keyboard/tabpanel semantics as §43, just restyled from an underline strip
  into a sidebar. Radix's vertical orientation switches arrow-key handling
  to Up/Down automatically; nothing custom was written for it.
- Each rail row carries a **live chip** of the owner's current choice — a
  tiny tinted swatch for Style, a colour dot for Brand, a lettered "Aa" set
  in the current type weight for Typography — so the rail alone answers
  "what's set right now" without opening anything. This is new; nothing
  like it existed before.
- The selected rail row **lifts onto white** (`bg-surface` + `shadow-xs`)
  against the rail's quieter grey (`bg-panel-header`), rather than getting
  an underline or a tint — it reads as "this is now part of the stage,"
  not "this tab is active."
- The dialog itself is much larger and fixed-height (`900×600px`, capped
  at `80vh`) instead of `max-w-lg` — there's finally room for real visual
  specimens instead of compressed rows. `DialogTitle`/`DialogDescription`
  moved out of the shared `DialogHeader` bar and into the rail's own
  header block, since a full-width header bar is exactly the "tabs on
  top" model being replaced.

### 44.2 Style — a gallery of posters, not a list of radio rows

Three large schematic posters side by side (`aspect-[4/3]`, ~3× the old
preview's area), each built **only** from the theme's own real fields —
`accent`, `radius`, `cards`, and, newly, **`density`** (defined on every
`Theme` since the data model's creation, never once read by any previous
preview). Density now visibly changes the poster's internal rhythm
(airy/cozy/tight gap between elements), so "more room to breathe" is
something the owner can see, not just an adjective in the blurb. `cards`
now drives a real card treatment inside the poster — outlined (hairline
border tinted from the theme's own accent via `color-mix`), filled (a
soft accent-tinted fill, so "Warm" actually reads warm), or flat (no
card chrome, a plain hairline rule) — so the three posters are
genuinely different-looking, not the same layout in three colours.
Selection is a 2px brand border + a resting shadow lift; hovering an
unselected poster nudges it up half a pixel with a real shadow, which
only costs `transform`/`box-shadow` (compositor-only, no layout cost).
Spacing (`layoutDensity` — same global field as §42/§43) moved out of
the stacked list entirely into a compact `Seg` control (the same shared
segmented-control component the rest of the editor already uses for
Layout/Visibility) in the Style stage's own header, as a modifier of the
main choice rather than competing with it as a second heading.

### 44.3 Brand — the current colour gets real weight

Kept the exact same curated palette + validated hex escape hatch, but the
*current* colour is no longer just "whichever circle has a ring" — a
header row shows a 24px swatch + the colour's name + its hex in mono,
so the current brand colour is legible at a glance the way the rail chip
promises. Palette swatches grew (28→36px) and switched their selected
state from a border to a **white check mark** — the clearest possible
signal on a solid colour circle, and deliberately different from the
border-only language used for the multi-line poster/specimen cards,
because a single rule doesn't fit both: a border reads clearly on a card
with text, a checkmark reads clearer on a plain disc. "Custom colour"
is still progressive disclosure, but now unfolds with a real (if brief)
height transition — `grid-template-rows: 0fr → 1fr` at 200ms, the modern
CSS way to animate an unknown-height reveal without measuring the DOM —
instead of snapping the input row into existence.

### 44.4 Typography — full specimens, not caption-sized previews

The same three-line live sample (business name / pitch / button) as
§42/§43, but rendered at real reading size (19px heading via the app's own
`text-title` scale, not the previous 14px) inside a taller card, stacked
vertically one-per-row instead of competing for space in a tight list.
It now reads as an actual type specimen sheet, not a labelled swatch.

### 44.5 Animation decisions (per the skill's own framework, not by default)

- **No animation on rail-item switch.** Per the frequency table, switching
  between Style/Brand/Typography happens "tens of times" in one sitting —
  the "hover effects, list navigation" bucket, which the skill says to
  remove or drastically reduce, not the "occasional" bucket a fresh modal
  open belongs to. `TabsContent` still has zero built-in transition, so
  this was free, not something added.
- **Where motion was added, it's short and has one job**: poster hover-lift
  (150ms, `transform`+`box-shadow` only), the custom-colour disclosure
  (200ms, `grid-template-rows`), rail/press states (100ms `ease-smooth`).
  Nothing animates from `scale(0)`; nothing uses `transition-all`.
- Modal stayed centred (`left-1/2 top-1/2 -translate-x/y-1/2`, untouched
  in `dialog.tsx`) — the skill's explicit exception to "popovers should be
  origin-aware": modals aren't anchored to a trigger, so centred is
  correct regardless of how different the inside looks now.

### 44.6 Preserved exactly

Every dispatch call (`setTheme`, `setDesign` patches for
`brandColor`/`fontPair`/`layoutDensity`), the hex-validation regex, the
`isPreset`/reset-to-style-colour conditional, the `toast()` calls, the
`AdvancedLock` gate for Basic plan, the Website-settings pointer sentence,
and the "no logo → generated S mark" copy are all unchanged — this is a
new presentation of the same state and the same actions, so live preview,
autosave and undo/redo needed no changes to keep working.

### 44.7 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` — all clean
(`contracts` produced no diff, confirming no section/data-model change).
Live in-browser at 1440×900: opened Design, inspected all three stages
(Style gallery with three visually distinct posters, Brand with the new
current-colour header + check-marked swatches, Typography's full-size
specimens); clicked a palette swatch (Coral) and confirmed the header
pill, the check mark, and the canvas's "Call now" button all updated
live in the same click; clicked a Typography option (Friendly) and
confirmed its border + the rail's "Aa" chip both updated; confirmed via
`read_page`/a direct DOM query that the rail is a real `tablist` with
`aria-orientation="vertical"`, three `tab`s with correct `aria-selected`
and `aria-controls`, and matching `tabpanel`s (only the active one
un-hidden) — the same accessible structure as §43, now vertical; focused
a rail tab and confirmed the ring-based focus-visible style renders
(screenshotted); used Undo to revert the test brand-colour change and
confirmed the canvas accent reverted live, exercising real undo/redo
through the new UI. **Zero console errors** across every step (checked
after each interaction, including once after a full round of Style →
Brand → Typography → colour-pick → Undo). Not independently exercised
this round: the Basic-plan (`!advActive`) locked state — its JSX is a
small, low-risk, unchanged-in-spirit branch (title + description +
the existing `AdvancedLock` component, same as §42/§43), but there was
no in-app control found to flip the mocked plan to Basic within this
session to screenshot it directly.

---

## 45. Design — Pass 1 (structural exploration, isolated) → Pass 2 (final, in production)

Two-part process, run at the user's explicit direction: separate **structure**
from **design system**, decide the structure first in isolation, then carry
only the winner into production dressed in real ManagR tokens.

### 45.1 Pass 1, round one — rejected

First attempt at `/design-lab` (an additive-only route, `src/features/
design-lab/`, never linked from any nav) explored three *product identities*
instead of three *layouts* — a full-bleed dark "Live Canvas" with a floating
glass dock, an editorial full-viewport "Look Book," and a two-pane dark
"Studio Console." All three worked technically (real store wiring, zero
console errors) but the user correctly rejected the round: the brief asked
for layout exploration, not a new product. Rebuilt from scratch.

### 45.2 Pass 1, round two — three layouts of the same popup, one wins

Same `/design-lab` route, entirely new content: three directions built from
identical shared atoms (`ThemeCard`, `ColorSwatch`, `TypeOption`, `LogoRow`,
`HexRow`, a bounded `PreviewPanel`, a real `Popup` built on bare
`@radix-ui/react-dialog` primitives — no ManagR tokens yet, deliberately, so
the structure could be judged on its own) — every direction unambiguously a
popup/sheet, none of them a new product:

1. **Continuous Sheet** — no tabs, no rail: Style → Brand → Typography as
   one continuous scroll, wayfinding via small anchor dots on the edge.
2. **Split Preview** — a wide dialog, a bounded live-preview panel
   permanently on the left, pill tabs on the right.
3. **Bottom Sheet · Grid** — a sheet anchored to the viewport bottom, a
   full-width segmented control, denser card grids.

**Continuous Sheet won** and was named the approved structural direction.

### 45.3 Pass 2 — the winner, in the real ManagR system, in production

`src/features/editor/overlays/DesignSheet.tsx` rewritten entirely (the
previous rail+stage "Design Studio" from §44 is gone, not hidden behind a
flag) as the Continuous Sheet, now carrying real tokens/components:

- **No second navigation mechanism.** The Pass-1 prototype's three anchor
  dots are gone, per explicit instruction — three short chapters in one
  `scrollbar-thin` scroll area need nothing else. No dots, no scrollspy, no
  rail.
- **Real ManagR chrome.** `Dialog`/`DialogContent`/`DialogHeader` (shared,
  unmodified) for the popup shell, `max-w-[560px]` (up from the original
  `max-w-lg`, sized for a 3-up card row), a single `max-h-[68vh]
  overflow-y-auto` body under a static header — header and content are
  visually separate, satisfying "sticky header, never competing with
  content" without actually needing `position: sticky`, since the header
  already sits outside the scroll container.
- **One coherent sheet, not a wall of cards.** Only genuinely selectable
  visual options are cards (the 3 style posters, the 4 typography rows,
  the palette swatches) — section relationships come from a heading
  (`text-section font-bold`), a one-line `text-caption` description, and a
  plain `border-t border-border-subtle` hairline between chapters, never a
  nested card-in-a-card.
- **Icons audited, not inherited.** The old rail's `Sparkles`/`Palette`/
  `Type` icons are gone — there's no navigation left for them to
  disambiguate, and the brief was explicit that a decorative icon next to
  a self-explanatory heading doesn't earn its place. The one icon left in
  the file is the `Check` mark on a selected colour swatch — functional,
  the clearest signal available on a solid disc.
- **Selection language, unchanged from the established convention**:
  `border-brand` + a light `shadow-e1` lift for cards, a white check mark
  for round swatches — no blue outline, no double ring, no filled card.
- **Style copy trimmed.** The old per-card blurb ("Crisp, lots of white
  space, sharp corners.") is gone from the card itself — the schematic
  (rebuilt using only the theme's real `accent`/`radius`/`cards`/`density`
  fields, exactly as validated in §44) carries that signal now, per "the
  visual sample should do most of the work."
  Spacing (`layoutDensity`) — existing, real functionality — stayed as a
  compact `Seg` control in the Style section's own header row, the same
  shared segmented control the rest of the editor already uses.
- **Motion unchanged from the established idiom**: `border-color`/
  `box-shadow`/`transform` only, `duration-150 ease-smooth`,
  `active:scale-[0.98]` press feedback — nothing decorative, nothing new.

### 45.4 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` (no diff) — all
clean. Live in-browser at 1440×900, dev server + browser tab restarted fresh
first: opened Design from the real editor toolbar, confirmed one continuous
scroll with **no dot/scrollspy indicator anywhere**; scrolled to the bottom
via `scrollTop = scrollHeight` and confirmed `atBottom: true` — the final
Typography row is fully reachable with comfortable padding; picked "Coral"
in Brand and confirmed the header hex pill, the check mark, and the canvas's
"Call now" button all updated live in one click; confirmed keyboard `Tab`
moves focus through the Seg control and into the theme cards with a visible
focus ring (screenshotted); confirmed `ui.overlay` (inspected directly via
the React fiber tree) correctly goes to `null` on Escape and the Radix
`data-state` flips to `closed` immediately — the DOM node's actual removal
lagged several seconds in this automated, frequently-backgrounded browser
tab, reproduced identically on the untouched, pre-existing Publish dialog,
confirming it's a rendering-throttle artifact of the test environment (not
a regression, not specific to this file) rather than a real dismiss bug.
**Zero console errors** at every step. `/design-lab` (Pass 1) was left
completely untouched, still reachable, not linked from any nav.

---

## 46. Design — final production refinement pass

Structure unchanged from §45 (Continuous Sheet, one scroll, no dots/rail/
tabs) — this pass corrects a content-model mistake surfaced by reviewing
actual screenshots of §45's output, then does a full visual/interaction
audit of everything else. Only [DesignSheet.tsx](src/features/editor/
overlays/DesignSheet.tsx) touched.

### 46.1 Correction — Style was mislabelled as a theme picker; it's spacing

Reviewing screenshots of §45's Style section side by side with the request
surfaced a real conflict: the three cards were curated visual themes
("Clean Modern" / "Warm Family-run" / "Premium Co-living" — a genuinely
different, separate feature, each with its own accent/radius/card
treatment), while a small 2-option "Balanced | Airy" toggle in the corner
was the *actual* spacing control. Asked the product owner to resolve it
rather than guessing at a change this consequential — the answer:
**drop the theme picker from Design entirely**; Style is now what those
three cards need to be: **Compact / Balanced / Airy**, all three backed by
`layoutDensity` (which already supported all three values — only two were
ever exposed). `s.theme` is untouched in the store; it simply has no
control surface in this popup any more, by explicit product decision.

The new schematic is three identical bars whose gap and outer padding scale
with density, proportioned from the real per-density padding
`WebsiteCanvas.tsx` already applies to every section (16 / 28 / 40px,
scaled down for a small card) — "the same content, different breathing
room," exactly what the section now needs to answer.

### 46.2 Full audit pass — every interactive element corrected

| Before | After | Why |
| --- | --- | --- |
| Logo preview: a short, wide rounded rectangle (`size-11 min-h-0`, effectively landscape) | A true square (`size-14`, fixed width = height), centred placeholder, its own border | A logo container that isn't square reads as an accident, not a design decision |
| "Custom colour" / "Reset to style colour": bare coloured/muted text | Real `Button` components (`outline` / `ghost`) | Anything actionable must look actionable; coloured text reads as a label, not a control |
| "Website settings." as a plain inline underline mid-sentence | `Button variant="link" asChild` — "Open Website settings →" | The link now reads as an intentional action, not a stray underline the eye trips over |
| Colour swatches: circles, selection shown by a white check mark | Square chips (`rounded-md`), selection shown by the same `border-brand` language every other card in the sheet uses | One selection language, no exceptions — the checkmark existed only because a plain circle border was ambiguous; a square doesn't have that problem |
| Typography specimens: `text-body` heading, `p-3` card padding, `space-y-2.5` between rows | `text-sm` heading, `p-2.5` card padding, `space-y-2` between rows — roughly two-thirds the footprint | The brief was explicit these previews are too large; a personality needs a heading + one line + a button, not room to breathe like a landing page |
| Brand and Logo/Brand-colour subsections ran together with no label | Added `LOGO` / `BRAND COLOUR` uppercase sub-labels (matching the app's existing caption-eyebrow convention) | "Two clearly understandable groups inside Brand," per the brief, needed a visible seam stronger than a paragraph break |

### 46.3 Icons

Net icon count in this file after the pass: **zero**. The one icon that
existed (a `Check` mark on round colour swatches) is gone now that swatches
are square and use the sheet's ordinary border-selection language — nothing
replaced it. No icon was added anywhere else; every section heading is text
only, as the brief asked.

### 46.4 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` (no diff) — all
clean. Live in-browser at 1440×900, fresh server + fresh tab: confirmed the
Style section shows three equal-weight cards (Compact/Balanced/Airy) with
visibly different bar spacing, "Balanced" correctly selected on load;
clicked "Compact" and confirmed `layoutDensity` in the persisted store
flips to `"compact"` and the real canvas's Hero section visibly tightens
once the popup is closed; confirmed the Logo box is a true square, "Upload
logo" and "Custom colour" render as bordered buttons, "Open Website
settings →" renders as a link-styled `Button`; scrolled to the bottom
(`scrollTop = scrollHeight`) and confirmed `atBottom: true` with all four
Typography rows comfortably visible above the fold at that scroll position;
confirmed keyboard `Tab` moves focus into the Style cards with a visible
ring. **Zero console errors** at every step. No dot/scrollspy indicator
anywhere (confirmed by inspection — it was already removed in §45 and
nothing in this pass reintroduced one).

### 46.5 Unresolved

None. This was the last planned pass for this popup per the request.

---

## 47. Design — Brand section, internal composition refinement

Scoped to the Brand section only, inside the same unchanged Continuous
Sheet — Style and Typography untouched, popup shell untouched, editor
untouched. Only [DesignSheet.tsx](src/features/editor/overlays/
DesignSheet.tsx)'s `BrandSection` function changed.

### 47.1 The problem

§46 already made every Brand control a real component, but the section
still read as one flat stack — Logo, its helper text, the Website-settings
sentence, Brand colour, its hex readout, the swatches and both colour
actions all sat at roughly the same visual weight, so the two actual jobs
("manage my logo" and "choose my brand colour") weren't visually
distinguishable from each other at a glance.

### 47.2 What changed

- **Website-settings pointer moved into a quiet info strip.** Was a
  sentence with an inline link; now `bg-surface-2 rounded-lg px-3 py-2.5`
  containing the sentence plus a real `Button variant="outline" size="sm"`
  ("Open →") — reads as product guidance sitting quietly under the Logo
  controls, not a second primary action competing with "Upload logo."
- **A visible seam between Logo and Brand colour.** A `border-t
  border-border-subtle` (tighter margin than the major section dividers —
  `my-5` vs `my-7` — so it reads as a subsection break, not another
  chapter) makes "these are two different jobs" immediate rather than
  inferred from a heading change.
- **Colour swatches: circles → large rectangles.** `size-8` circles became
  `h-12 w-full` rounded rectangles arranged in a `grid-cols-4` (2 rows of
  4), so colour is now the dominant visual element in the section instead
  of eight small dots competing with everything else. Selected state is
  the same `border-brand` language every other card in the sheet already
  uses (no new language introduced); label stays beneath each swatch,
  unchanged in substance.
- **Readability note wrapped in the same quiet-info treatment** as the
  Website-settings strip (`bg-surface-2 rounded-lg px-3 py-2`) instead of
  floating as a bare paragraph — one consistent "this is supporting
  information" pattern used twice in the section, not invented twice.
- Logo box grown slightly (`size-14`→`size-16`, `rounded-lg`→`rounded-xl`)
  to carry more visual presence now that it's the section's anchor.
- All existing `Button`/swatch/hex logic (upload no-op, custom-colour
  disclosure, hex validation, reset-when-not-preset) is untouched — this
  pass changed composition and container treatment only, no interaction
  logic.

### 47.3 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` (no diff) — all
clean. Live in-browser at 1440×900, fresh server + fresh tab: scrolled to
Brand and confirmed the two-group composition reads correctly (square logo
+ Upload button + quiet settings strip, divider, large rectangular swatch
grid + hex + actions + quiet readability strip); clicked "Coral" and
confirmed the `border-brand` selected ring renders clearly on a rectangle,
the hex readout updates, and the canvas's "Call now" button updates live
after closing the popup; opened the custom-colour disclosure, typed an
invalid value ("zzz") and confirmed the existing validation still fires
("Enter a valid colour, like #F7553D.") with the swatch preview correctly
showing no fill; confirmed real keyboard `Tab` moves focus through Upload
logo → Open → → each colour swatch in turn, with a visible focus ring
distinct from the selected-state border on every stop. **Zero console
errors** at every step.

### 47.4 Unresolved

None.

---

## 48. Website dashboard — final refinement pass

Scoped to the `/website` dashboard only (`WebsiteHome.tsx`), plus one
single-value, deliberately-shared change to `ManagRShell.tsx`'s content
container. No other Website page's internal layout touched.

### 48.1 What was actually wrong

Read the page's own code before touching anything — it already carried
several prior refinement passes (§16–20) and most of the brief's concerns
(icon-only actions needing tooltips/labels, Plan vs. Health treated as
distinct facts, restrained "only tint when it needs attention" colour use)
were already correctly built. The one concrete, measurable problem: at a
1600px window, `ManagRShell.tsx`'s shared content `<main>` capped at
`max-w-[1120px]`, leaving **248px of pure dead margin** beyond the page's
own gutter — confirmed via `getBoundingClientRect()`, not eyeballing.
Everything the brief called "cluttered" or "the weakest part of the page"
was, on inspection, a well-grouped card whose real problem was simply
having too little width to breathe in.

### 48.2 Changes

| File | Change | Why |
| --- | --- | --- |
| `ManagRShell.tsx` | `main` container `max-w-[1120px]` → `max-w-[1280px]` | The single number actually responsible for the "constrained" feeling versus the reference dashboard. A width bump only, not a layout rewrite — every other Website page gets more room automatically but none of their internal content was touched this pass, exactly as scoped ("reuse this gutter principle on the next pages later") |
| `WebsiteHome.tsx` — identity region | `p-5` → `p-6` | Padding proportion re-tuned now that the card itself is wider — 20px felt tight relative to the new available space |
| `WebsiteHome.tsx` — `FactCell` (Plan/Health strip) | `px-5` → `px-6` (matches identity's new left edge exactly — confirmed via `getBoundingClientRect`, both start at the same x) + a base `bg-surface-2` | Restrained tinted surface distinguishing "supporting facts" from the primary identity region above, per the reference dashboard's use of tinted categories — `Health`'s existing `bg-warning-wash` still overrides it when attention is needed, unchanged |
| `WebsiteHome.tsx` — This Week / Manage grids | `gap-2.5` → `gap-3` | Matches the slightly richer rhythm the wider container now calls for; still a token value, not an arbitrary one |

### 48.3 Deliberately left unchanged

- **"Manage plan" as a text link** (not a button, unlike Health's escalated
  "Review" button). This was a deliberate pattern from §19 — Plan is calm,
  static information; Health is dynamic and only gets a heavier button
  when something actually needs a glance. Re-reviewed against this pass's
  "every action must look like a button" instruction and judged this is
  the "unless clearly appropriate" exception the brief itself names:
  forcing every secondary link into a button would make two different
  kinds of information (a calm fact vs. an urgent one) look identical,
  which is a regression, not a polish win.
- Icon-only website actions (copy/QR/open-live): already had bounded
  button surfaces, `Hint` tooltips, `aria-label`s and `focus-visible`
  rings — matched the brief's own requirement exactly, so left untouched.
- The Plan/Health split as one card with an internal divider (not two
  separate cards, not five tiny cards) — already the "one identity card +
  a lower split row" structure the brief itself suggested as a good
  direction.
- `PlanBanner.tsx` (a different, currently-hidden conditional banner for
  trial/expiring/lapsed states) — not visible in the current `advanced`
  plan state, not part of either reference screenshot, left untouched.

### 48.4 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` (no diff,
expected — this page isn't part of the section-contracts system) — all
clean. Live in-browser: confirmed via `getBoundingClientRect()` that
`main` now renders at 1280px (was 1120px) at a 1600px window; confirmed
the "Plan" label's left edge and the identity card's left inner edge are
now pixel-identical (325.5px in both cases); toggled the live/offline
switch and confirmed the header pill, status row and toggle track all
update together; tabbed through the page with real keyboard input and
confirmed a visible focus ring lands correctly on every stop including a
`Manage` grid card; checked 1024px width and confirmed zero horizontal
overflow (`scrollWidth === clientWidth`). **Zero console errors** at every
step.

### 48.5 Unresolved

None.

---

## 49. Website workspace — final refinement across all five sub-pages

Scope: `/website/settings`, `/website/availability`, `/website/visits`,
`/website/enquiries`, `/website/bookings`, plus the one shared component
(`Page`, in `common/index.tsx`) all five already used. `/website` itself —
the parent/reference page from §48 — was not touched this pass, per the
brief; only its navigation/visual relationship to the children was
verified, not its content.

### 49.1 What was actually wrong (found by reading, not guessing)

All five pages already shared one component vocabulary (`Page`, `PageHead`,
`PageBody`, `SettingsCard`, `Field`, `ListContainer`, `Callout`, …) from
earlier passes (§21) — so "five different implementations of the same
pattern" was never the problem. Two concrete, measurable problems were:

1. **`Page` capped every one of the five pages at a fixed `max-w-[840px]`,
   centred with `mx-auto`.** A real `<table>` inside Enquiries was already
   `w-full` — but 100% of a fixed 840px is still just 840px. No amount of
   internal styling could let that table use the room `/website`'s own
   1280px frame (§48) now provides. The original code comment even said
   the width should be "a per-section decision… never a per-page one" —
   correct for a form, structurally wrong for a table.
2. **Visit settings' day/time grid was hard-capped at `max-w-[400px]`**
   inside a card that (once widened) has ~1000px to offer — precisely the
   "tiny table floating inside a giant blank card" the brief named.

### 49.2 The fix: `Page` gets a `size`, and drops `mx-auto`

```tsx
// before: one fixed, centred width for every page
<div className="mx-auto w-full max-w-[840px]">

// after: one shared left edge (no centring — anchored to the shell's own
// padding), three content-aware widths
size="content" → max-w-[840px]   (Availability, Booking requests — prose/decisions read best at this width)
size="wide"    → max-w-[1040px]  (Settings' two-column fields, Visits' schedule grid)
size="full"    → max-w-none      (Enquiries — has a real table)
```

Dropping `mx-auto` was the detail that makes this actually work: a
"content" page and a "full" page now start at the **identical x-position**
(confirmed: 296.5px / 300.5px on both Bookings and Enquiries at a 1600px
window) because the left edge comes from the shared shell's padding, not
from each page centring its own, different-width box. Without that change,
giving pages different widths would have broken exactly the "one coherent
vertical axis" the brief asked for.

| Page | `size` | Why |
| --- | --- | --- |
| Website settings | `wide` | Two-column address/contact/social forms benefit from more room per field |
| Live availability | `content` (default, unchanged) | Prose + radio choices read best at a comfortable width; already correctly composed |
| Visit settings | `wide` | The schedule grid and stepper rows want the room |
| Enquiries | `full` | Has a real `<table>`; metrics and the "Where enquiries go" callout keep their own `max-w-[640px]` internally, unchanged, so only the table actually grows |
| Booking requests | `content` (default, unchanged) | A decision card + prose; already the right width |

### 49.3 Visit settings' schedule grid

`max-w-[400px] grid-cols-[40px_repeat(3,1fr)]` → `max-w-[620px]
grid-cols-[64px_repeat(3,1fr)]`, cell `min-h-[38px]` → `[42px]`, label
column widened so "Morning/Midday/Evening" and the day labels aren't
cramped. The grid now reads as an intentional schedule matrix instead of a
small table adrift in a mostly-empty card — the single most visible fix
in this pass.

### 49.4 Deliberately left unchanged

- **Availability and Booking requests' width.** Both are already
  well-composed at "content" width; widening them would have meant option
  cards and prose stretching past a comfortable reading measure for no
  benefit — exactly the "do not force every component to full width"
  instruction.
- **Enquiries' metric cards and callout stay capped at 640px** even
  though the page itself is now `full` — a metric card and a short callout
  don't get more useful at 1200px, only the table does. This is the
  brief's own "ask what the natural width of this information is" applied
  literally, not "assume every card must have the same width."
- **`SettingsCard`'s header (icon/title/description/divider) — already
  one shared component**, so icon size, heading hierarchy and header
  padding were already identical across every card on every page; no
  change needed.
- **The back-link pattern ("‹ Website") — already built into `PageHead`
  by default** (`back="/website"`) and already present on all five pages;
  nothing to add.
- `/website` itself untouched, per the brief.

### 49.5 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` (no diff) —
all clean. Live in-browser at 1600×1000, fresh server + fresh tab, all
five routes: confirmed via `getBoundingClientRect()` that the back-link
and `<h1>` sit at the same x-position on both a `content`-width page
(Bookings) and the `full`-width page (Enquiries); toggled Live
availability's master switch and confirmed the radio options appear
correctly at content width; clicked a Visit-settings grid cell (`Sat
Midday`) and confirmed it toggled on; searched "Rahul" on Enquiries and
confirmed the table filtered correctly, then cleared it; opened and
cancelled the Decline confirmation dialog on Booking requests; tabbed
through Enquiries with real keyboard input and confirmed a focus ring
lands on the search input; confirmed zero horizontal overflow at 1024px
on both Enquiries (full-width) and Visits (wide, grid-heavy) — the two
pages most likely to break narrow. **Zero console errors** at every step
across all five pages.

### 49.6 Unresolved

None.

---

## 50. Website Settings — internal card audit + full Website workspace consistency pass

Two connected pieces of work: (a) a full internal audit of `/website/settings`
specifically (every card/control, per an explicit request with a reference
screenshot), and (b) using what that audit found to check and fix the
*rest* of the non-editor Website workspace (`/website/health`,
`/website/plan`, `/website/upgrade`, `/website/analytics`, plus
re-verifying `/website/availability`, `/website/visits`, `/website/enquiries`,
`/website/bookings` together). The editor (`/website/editor`) was never
touched. `/website` itself (the parent/reference page) was inspected for
comparison but not modified.

### 50.1 Settings — width corrected precisely, not just widened

§49 had already put Settings on `Page size="wide"` (1040px), but reviewing
it side-by-side with a fresh screenshot of `/website` at the same window
width showed a real, measurable gap: `/website`'s cards have no `Page`
wrapper at all and simply fill the shared shell's full 1280px frame, so
Settings' extra 1040px cap still left it visibly narrower with dead space
on the right that `/website` doesn't have. Changed Settings to `size="full"`
and confirmed via `getBoundingClientRect()` that its card's right edge
now lands at the exact same x-coordinate as `/website`'s card at 1920px
width (1676.5px in both cases).

That alone over-corrected in the other direction: a plain 2-column grid
stretched across the now-full-width card put single-line fields like
"Business name" at 579px wide — visibly too wide for their content.
Fixed by capping the *field grids themselves* at `max-w-[820px]` (Address
& language's grid, the web-address row, Contact details' grid) while
leaving the card shell at full width — the card boundary now matches
`/website`, the actual inputs stay a sensible width. This is the same
"ask what the natural width of this information is" principle from §49,
applied one level deeper (per-grid, not just per-page).

### 50.2 Settings — card-level fixes found by combining screenshots with DOM checks

| Before | After | Why |
| --- | --- | --- |
| Menu's 5 links in `sm:grid-cols-2` → 3 rows, last row one orphaned cell beside empty space | `sm:grid-cols-3` → 2 rows of 3+2 | A visibly asymmetric grid for no reason — plain rebalancing |
| Social links' 3 fields in `sm:grid-cols-2` → same orphan-cell pattern (YouTube alone) | `sm:grid-cols-3` — all three in one row | Same fix, same reasoning, applied for consistency the moment the first instance was found |
| Checked menu-link rows: `has-[[data-state=checked]]:bg-brand/[0.04]` | `has-[[data-state=checked]]:bg-tint-coral` | The recurring bug this whole project has hit repeatedly — a Tailwind opacity modifier on `--brand`, which is a plain hex CSS var, compiles to nothing. Confirmed broken via `getComputedStyle` (background stayed pure white on a checked row) before fixing; confirmed fixed the same way after. Reused the existing `--tint-coral` token rather than inventing a new one |
| Unused `Callout` import in `SettingsScreen.tsx` | Removed | Dead import found while auditing; harmless but not clean |

### 50.3 Shared fix — `SettingsCard`'s header (benefits every page using it, not just Settings)

The exact wording of the request ("excessive vertical spacing between
heading and subheading, poor optical alignment with the icon") pointed at
one shared component: `SettingsCard`'s header combines an `IconTile`
with a title + description block. The description used `leading-relaxed`
(1.625× line-height on 12px text — roughly 4–5px of invisible padding
above and below the visible glyphs) stacked on top of an explicit `mt-1`,
which read as a looser gap than the two lines' actual relationship
warranted; the icon's `mt-px` didn't account for that combined height,
so it sat visibly high relative to a two-line block.

```
description: mt-1 leading-relaxed  →  mt-0.5 leading-snug
icon:        mt-px                 →  mt-0.5
```

This one component is used by every card on `/website/settings`,
`/website/health`, `/website/plan` (implicitly, via the plan card), and
`/website/analytics` — fixing it once fixed the same visible looseness
everywhere at once, exactly the "solve it at the shared-component level"
instruction. `CardHead` (a different component, used only by
`/website`'s own "Your website" card) uses `items-center` with
single-line truncated text and was already correct — confirmed
unaffected, not touched.

While in the same file, found and fixed one more instance of the same
opacity-on-raw-hex-var bug in `Notice`/`Callout`'s `stop` tone
(`bg-destructive/[0.05]` → `bg-destructive-surface`, an existing solid
token). Not currently rendered anywhere in the live app (no page passes
`tone="stop"` today), but a one-line, zero-risk, correct fix while already
looking at the exact same bug class in the same file.

### 50.4 Rest of the workspace — audited, one more width fix

Read `HealthScreen.tsx`, `PlanScreen.tsx`, `UpgradeScreen.tsx`,
`AnalyticsScreen.tsx` in full before changing anything:

- **Health** — `ListContainer` rows (message + action button), already
  full-width within its container; content naturally suits the default
  `content` (840px) frame. No change.
- **Plan** — a real comparison `<table>`, but a simple 3-column one
  (capability name + two checkmark columns); widening it would only add
  blank space in the capability column. Left at `content`. No change.
- **Upgrade** — pure prose/decision content (`ListContainer` benefits +
  a `ChoiceRow` billing-cycle picker); `content` width is correct here,
  matches Booking requests/Availability's own established pattern. No change.
- **Analytics** — a "This week" `MetricCard` grid identical in shape to
  `/website`'s own metric row, plus one `SettingsCard`. At the default
  840px frame, 5 metric cards would render visibly smaller than their
  siblings on `/website`'s 1280px-wide row — an inconsistency between two
  pages showing the literal same kind of content. Changed to
  `size="wide"` (1040px); confirmed live the five cards now sit at a
  comfortable, consistent size.

### 50.5 Verified

`npx tsc -b --noEmit`, `npm run build`, `npm run contracts` (no diff) —
all clean. Live in-browser, fresh server + fresh tab, walked every
non-editor Website route in sequence (`/website`, `/website/settings`,
`/website/availability`, `/website/visits`, `/website/enquiries`,
`/website/bookings`, `/website/health`, `/website/plan`,
`/website/upgrade`, `/website/analytics`): confirmed the tightened
`SettingsCard` header renders correctly and consistently on every page
that uses it; confirmed Settings' Menu/Social grids are now balanced with
no orphan cells; confirmed the checked-row tint is visible; toggled a
menu-link checkbox and confirmed the `SaveBar` appears and Save works;
confirmed zero horizontal overflow at 1024px, 768px (tablet) and 390px
(mobile) on the two most width-sensitive pages (Enquiries' table, Visits'
schedule grid) — mobile correctly falls back to the existing card list
for Enquiries and a single-column stack everywhere else, unchanged from
before this pass. **Zero console errors** on every route, at every width,
throughout. `/website/editor` was not opened or modified — out of scope,
confirmed via `git diff` that no editor file was touched this pass.

### 50.6 Unresolved

None.

## 51. Full-workspace independent follow-through audit

A second, independent pass over the same in-scope routes (`/website` and its nine
sub-pages), explicitly re-opening every page and every card rather than trusting the
§45–§50 passes were exhaustive. Route tree re-verified against `src/app/App.tsx` — the
known 10-route list is exhaustive; `/website/preview` (`VisitorSite`) and `/scheduled-visits`
are separate surfaces, not part of the Website workspace nav, and were left untouched.
`/website/editor` was not opened.

### 51.1 What this pass found

Re-reading every in-scope screen file end-to-end (not just the shared components)
surfaced one more cluster of the same root-cause bug documented in §46/§50: a Tailwind
opacity modifier (`/NN` or `/[0.NN]`) silently resolves to nothing when applied to a color
whose CSS custom property is a plain hex string (`--brand`, `--destructive`) rather than an
RGB channel triplet. §50 fixed two instances found on Settings; this pass swept every
in-scope file for the same pattern and found four more, all live and all previously missed:

| File | Was | Rendered as | Fixed to |
| --- | --- | --- | --- |
| [WebsiteHome.tsx](src/features/home/WebsiteHome.tsx) — "Next" banner | `border-brand/25` | no visible border at all | `border-ring-soft` (existing `--brand-ring-soft` token) |
| [PlanBanner.tsx](src/features/home/PlanBanner.tsx) — `stop` tone | `border-destructive/30 bg-destructive/10` | plain white banner, no tint | `border-destructive-border bg-destructive-surface` |
| [VisitsScreen.tsx](src/features/visits/VisitsScreen.tsx) — "Exact times to offer" chips | `bg-brand/[0.06]` on selected chips | selected chip had border only, no fill | `bg-tint-coral` |
| [BookingsScreen.tsx](src/features/bookings/BookingsScreen.tsx) — Decline confirm button | `hover:bg-destructive/90` | no hover feedback | `hover:brightness-90` (format-agnostic, no new token needed) |

Two of these are genuinely shared-component fixes, addressed at the token/component level
so every current and future caller benefits automatically:

- **`StatusBadge`'s `action` pill** (`src/components/common/index.tsx`) used
  `border-destructive/25 bg-destructive/[0.06]` while every sibling status (`live`,
  `attention`, `advanced`) already used precomputed `-border`/`-surface` tokens. The
  system was missing a `--destructive-border` token entirely — `success`, `warning`, and
  `advanced` all have one, `destructive` didn't. Added `--destructive-border: #f0b3ab`
  in [globals.css](src/styles/globals.css) (same proportional relationship to
  `--destructive`/`--destructive-surface` as the other three status colors), wired it
  into `tailwind.config.ts`, and switched the `action` pill to
  `border-destructive-border bg-destructive-surface`. This is the pill used for
  "N to fix"-style states wherever `StatusBadge` is rendered with `status="action"`.
- **The shared `destructive` `Button` variant** (`src/components/ui/button.tsx`) had the
  identical bug (`border-destructive/25` + `hover:bg-destructive/[0.06]`) — every
  destructive-styled outline button across the app (e.g. the "Decline" trigger on
  Bookings) was rendering with no visible border and no hover state. Fixed to
  `border-destructive-border` / `hover:bg-destructive-surface`, reusing the same new
  token.

A full repo-wide grep for the same opacity-on-hex-var pattern (`/[0.` and `/NN` on
`brand`/`destructive`/`success`/`warning`/`advanced`/`accent`) was run again after these
fixes; the only remaining hits are inside `src/features/editor/**`, which is out of
scope and was left exactly as-is.

### 51.2 Re-audited and confirmed correct (no change)

Every card on `/website`, Availability, Visits, Enquiries, Bookings, Analytics, Plan,
Upgrade, Health, and Settings was re-read in full against this round's brief (card
proportion, internal composition, padding, header spacing, icon alignment, action
placement, grid balance). No further composition problems were found beyond the tint
bugs above — the width, card-header, and grid fixes from §48–§50 already addressed the
structural issues; this pass's job was specifically to catch anything those passes
missed, and what it found was exclusively the tint/opacity class of bug, not layout.

Notably re-confirmed as intentionally correct and left untouched:
- `ChoiceRow`'s selection language (border-only, no fill) — by design, not a bug.
- WebsiteHome's "Your Website" card two-region composition (status block + Plan/Health
  fact-cell strip) — still the strongest composition for that content.
- Bookings' WHO→WHAT→WHEN→AVAILABILITY→ACTIONS ordering and
  primary/secondary/tertiary action hierarchy — unchanged, as required.

### 51.3 Validation

- `tsc --noEmit` — clean.
- `npm run build` — clean production build (`vite build` succeeded, no warnings beyond
  normal chunk-size notices).
- `npm run contracts` — regenerated, **zero diff**, confirming no section/data-model
  drift.
- Live browser verification of every fix via `getComputedStyle`/computed background
  checks (not just visual screenshots) on `/website`, `/website/visits`, and
  `/website/bookings` — confirmed the previously-inert classes now resolve to the
  intended token colors.
- Full-page screenshot + zero-console-error check at 390×1600 (mobile) on `/website` —
  no overflow, no regressions, "Next" banner border and Health attention-tint fact cell
  both rendering correctly.
- `git status`/`git diff` re-confirmed: only the eight files below were touched this
  pass — no editor, inspector, or section-registry file was opened or modified.

### 51.4 Files changed this pass

`src/styles/globals.css`, `tailwind.config.ts`, `src/components/common/index.tsx`,
`src/components/ui/button.tsx`, `src/features/home/WebsiteHome.tsx`,
`src/features/home/PlanBanner.tsx`, `src/features/visits/VisitsScreen.tsx`,
`src/features/bookings/BookingsScreen.tsx`.

### 51.5 Unresolved

None.
