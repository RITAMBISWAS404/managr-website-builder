# ManagR Website Builder — Tech Stack & Architecture

The Website Builder is now a **React application**. The product (UX, IA, workflows,
states) is unchanged from the HTML prototype — see `BUILDER-PRODUCT-ARCHITECTURE.md`.
This document is for engineers continuing the build.

The previous vanilla HTML/CSS/JS prototype is preserved verbatim in **`legacy/`**
(`node legacy/server.js` → http://localhost:4173/builder.html). Nothing in `legacy/`
is imported by the React app.

---

## 1. Stack

| Concern | Choice | Version |
|---|---|---|
| UI library | **React** | 18.3 |
| Language | **TypeScript** | 5.6 (strict) |
| Build / dev | **Vite** | 5.4 |
| Styling | **Tailwind CSS** | 3.4 (utility layer only) |
| Components | **shadcn/ui** pattern (Radix primitives) | hand-authored in `src/components/ui` |
| Icons | **lucide-react** | 0.454 |
| Routing | **react-router-dom** | 6 |
| Toasts | **sonner** | 1.7 |
| Command palette | **cmdk** | 1 |

Deliberately **not** used: Next.js, Redux, a second component library, a data-fetching
library, an animation framework, any backend. All data is mocked (`src/data`).

### Run it

```bash
npm install
npm run dev        # http://localhost:4173
npm run build      # tsc -b && vite build  → dist/
npm run preview     # serve the production build
npm run typecheck
```

If `esbuild` fails to resolve its binary after install (sandboxed installs skip
post-install scripts): `node node_modules/esbuild/install.js`.

---

## 2. Directory layout

```
src/
  app/            App.tsx — the route table
  components/
    ui/           shadcn/ui primitives (Button, Dialog, Sheet, Tabs, …) — customised for ManagR
    layout/       ManagRShell, DevBar, ErrorBoundary
    common/       cross-screen atoms: PageHead, Callout, EmptyState, FromManagR, AdvancedLock, …
  features/
    home/         Website home (status strip)
    setup/        switch-on flow (locked → address → confirm → info → live)
    inventory/    Live availability config
    visits/       Visit settings + Scheduled Visits
    enquiries/    Website enquiries
    bookings/     Booking requests
    analytics/    "what your site did"
    plan/         Plan & billing, Upgrade
    health/       Website health
    settings/     Website settings (tabbed)
    editor/       the builder workspace
      EditorScreen.tsx        assembly + keyboard shortcuts + URL sync
      EditorChrome.tsx        toolbar, rail, status bar, mobile bars, mobile float
      LeftPanel.tsx           Sections (drag reorder) / Pages / Add (intent-grouped) / Photos
      WebsiteCanvas.tsx       device-framed live draft, subtle selection chrome
      CoachMarks.tsx          first-run tip
      EditorContext.tsx       overlay UI state (which dialog/sheet is open)
      overlays/               PublishDialog, VersionsSheet, DesignSheet (Template/Colours/Fonts/Shape/Layout/Brand), CommandMenu, ResponsiveSheet, MobileSheets
    inspector/    InspectorPanel + schema-driven primitives
    sections/     registry.ts (catalogue) + SectionCanvas.tsx (render) + SectionPreview.tsx (Add-panel thumbnails)
    visitor/      the public site preview
  store/          BuilderProvider (reducer + context), reducer.ts, selectors.ts, initialState.ts, hooks.ts
  data/           managr.ts — all mocked ManagR + website data
  types/          index.ts — the domain model
  styles/         globals.css — design tokens + Tailwind entry
```

---

## 3. Design system

`src/styles/globals.css` `:root` is the **single source of truth**. Every colour, radius,
shadow, easing lives there as a CSS variable, named to the shadcn contract.

**Surface ladder (this is what gives the UI depth — not shadows):**
`--background #fafafa` (app) → `--workspace #ecedf0` (editor canvas area) →
`--surface #fff` (panels/cards) → `--surface-2 #f7f8f9` (quiet grouping inside a panel) →
`--sunken #f1f2f4` (wells / segmented-control tracks). Borders: `--border` / `--border-subtle`
(dividers) / `--border-strong`. Text: `--foreground #111` / `--muted-foreground #5f6368` /
`--faint #8a8d92`. Brand `--brand #f7553d`; navy sidebar `--navy #0a1628` (+ `-active` /
`-hover` / `-border`); `--secondary-blue #1e40af` (+ `-surface` / `-border`, the "Import"
button); channels `--call #2261b6`, `--whatsapp #57b562`; `--success` `--warning` `--info`
`--advanced` each with `-surface` / `-border` (`--warning` also has `-wash`, a whisper-warm
block fill for "gently needs attention"); `--overlay` (modal / sheet scrim — a
pre-composited translucent navy, so it never depends on `bg-*/opacity` which Tailwind
does not reliably generate for CSS-var colours); `--tint-{blue,green,amber,purple,coral,cyan}`
(+ `-fg`) for `IconTile` / `MetricCard`.
**Radius hierarchy — 5 / 8 / 10 / 14 / pill:** 5 = checkbox·kbd, 8 = icon buttons·segmented·
chips, 10 = buttons·inputs·rows (`rounded-lg`), 14 = cards·panels·modals·website frame
(`rounded-xl` = `rounded-2xl`), pill = status only. Shadows: `--shadow-xs` (control rest) /
`--shadow-e1` (hairline) / `--shadow-e2` / `--shadow-frame` (website preview, deepened) /
`--shadow-pop` (modals). `--ease` / `--dur 140ms`; a `prefers-reduced-motion` block
neutralises transitions. `--shadow-e1` is the ManagR/BEDR **shadow/card** value
(`0 1px 3px /6% + 0 1px 2px -1px /4%`) — cards read as gently elevated on the `#fafafa` page,
matching the reference product; `--shadow-xs` is its lighter sibling for controls at rest.

**Buttons** (`components/ui/button.tsx`): one CVA system. Sizes `xs h-7` / `sm h-8` /
`default h-9` / `lg h-10` + `icon` / `icon-sm`; `rounded-lg` (10px), `gap-1.5`, `text-sm`
default. Variants `primary` (coral, **white text always**) · `navy` · `blue` · `secondary` ·
`outline` · `ghost` · `destructive` · `link`, plus a `loading` prop (spinner, auto-disables).

`tailwind.config.ts` maps those to theme keys, so components use `bg-primary`,
`text-muted-foreground`, `border-border`, `rounded-lg` / `rounded-2xl`, `shadow-e1` — never
raw hex. **To retheme the whole product, edit the `:root` block.**

Cross-screen primitives live in `src/components/common`: `PageHead` (24px display title),
`SectionHeader` (uppercase micro eyebrow), `PanelHeader`, `Surface`, `KeyRow`, `Notice`,
`ScopeNote`, `EmptyState`, `ChoiceRow`/`ChoiceGroup`, `StatusBadge`, `Stat`, `IconTile`
(tinted rounded icon square, 6 tints), `CardHead` (icon tile + bold title + grey subtitle +
right action — the ManagR card-header pattern; `size="md"` for a stronger identity header),
`StatusBadge` (dot+text, or `pill` for a bordered semantic status pill),
`MetricCard` (28px number + label + `IconTile`; `wash` prop adds the subtle white→tint
gradient of the ManagR stat cards), `FromManagR`, `BoundField`, `AdvancedLock`.
Fix a pattern there, not on a screen.

**Website Management page language** (shared by `/website/settings`, `/availability`,
`/visits`, `/enquiries`, `/bookings`) also lives in `src/components/common`: `Page`
(the ONE content frame — `mx-auto max-w-[840px]` — every management page's header and
body sit in it so the five share an outer geometry; width *inside* is a per-section,
left-anchored choice, never per-page), `PageBody` (the `space-y-5` rhythm under
`PageHead`), `SettingsCard` (icon-tile + bold title + grey
description header / `space-y-4` content / optional `surface-2` footer — the one card style
for a settings group), `Field` (vertical label / control / hint), `ToggleField` +
`FieldGroup` (borderless labelled switch/checkbox rows separated by dividers, never boxes),
`Segmented` (small either/or choices), `ListContainer` (the one operational list — desktop
rows / mobile cards), `FilterBar`, `SaveBar` + `useSaveState` (sticky save-state bar:
`clean → dirty → saving → saved`, appears only when there's something to save). Segmented controls (device switcher, inspector
Spacing / Show-on, toolbar undo·redo well) share one look: `rounded-lg border
border-border-subtle bg-sunken p-0.5`, active item `bg-surface text-foreground shadow-xs`.

**Editor panel system** — `src/features/editor/panel.tsx` is the shared visual grammar for
the left structure panel and the right inspector: `Panel` / `PanelHeader` (identity strip on
the `--panel-header` band) / `PanelScroll` / `PanelFooter` (pinned actions) / `Group`
(collapsible band-headed region — the workhorse) / `Row` (compact label-left / control-right)
/ `Field` (stacked) / `Seg` + `SegToggles` (segmented controls) / `ChoiceGrid` + `ChoiceCard`
+ `LayoutMini` (visual layout-variant picker) / `ScopeChip` (contextual metadata band).
Tokens: `--panel` / `--panel-header` / `--panel-section` / `--panel-hover` / `--panel-border`.

**Editor shell surfaces** (`EditorScreen.tsx` grid `lg:[52px 284px 1fr 324px]` ·
`xl:[56px 300px 1fr 340px]`): left rail `surface-2`, structure + inspector panels `panel`
with `border-panel-border` seams, canvas area `workspace` (`#e9eaee` — recessed stage),
website frame white + `shadow-frame` + `ring-black/6` + browser chrome. The website preview
is the only elevated white surface on the grey workspace, so it stays the focal point.

**Inspector** (`InspectorPanel.tsx`): **one scrolling panel, no tabs.** Collapsible `Group`s —
Content (fields + a nested "more" disclosure) · Layout (visual style picker + Spacing seg) ·
Visibility (per-screen `SegToggles`) · Data (read-only bound rows, collapsed by default).
Whole-section hide is the header eye button; scope is a quiet `ScopeChip` band, never an alert.
Open/closed group state is remembered for the session.

**Editor overlays** — desktop uses centred `Dialog`s (Publish, Design, Version history,
Phone/tablet check, Pages) with a `--overlay` scrim; bottom `Sheet`s are reserved for the
genuinely mobile-only surfaces (`EditorMore`, `MobileLayers/Add/Section`).

- **Font:** Plus Jakarta Sans (Google Fonts `@import`; system-ui fallback).
- **Primary:** `#EF4444` fill / `#F7553D` brand-coral accent. **Navy:** `#001737`.
- To retheme the whole product, edit the `:root` block in `globals.css`.

`shadcn/ui` components are customised (radius, borders, coral primary, navy tooltips) —
they are not the default demo appearance.

---

## 4. State architecture

One store, `BuilderProvider` (`src/store/`), exposed via `useS()` (state), `useDispatch()`,
`useDerived()` (memo-free selector bundle), and `useBuilder()` (adds `undo`/`redo`).

- **`reducer.ts`** — a typed discriminated-union reducer. UI state, site content, draft,
  publish machine and simulated product state all live in one `BuilderState`; the reducer
  keeps block/page indices correct.
- **`selectors.ts`** — pure functions over `(state, mockData)`: `advActive`, `structureLocked`,
  `publicProperties`, `siteCheck`, `draftDirty`, `publishChanges`, …
- **Autosave + undo** — the provider wraps `dispatch`: content-changing actions
  (`CONTENT_ACTIONS`) push a `SiteSnapshot` onto a 50-deep history stack and flip the
  save indicator `saving → saved`. `undo`/`redo` replay snapshots.
- **Persistence** — the whole state is mirrored to `localStorage` (`managr_builder_react_v1`).
- **Publish state machine** — `publishPhase: idle → publishing → success | error`, driven by
  `PublishDialog`. A published `SiteSnapshot` is stored on `state.published` and pushed as a
  `PublishVersion` (with a full `snap`) so **Restore and version Preview are real**.

Editor-only overlay state (which dialog is open) is separate: `EditorContext`.

**Global design** — `brandColor` (curated palette override), `fontPair`, `shape`,
`layoutDensity` live on `BuilderState` **and** `SiteSnapshot`, so version restore /
publish carry the look. The canvas reads the accent through `siteAccent(state)` in
`selectors.ts` and per-section corner radius through `SHAPE_RADIUS`. `setDesign` /
`setTheme` are content actions (snapshot + autosave).

The **ManagR-data / website-data boundary** (`types/index.ts` comments, `data/managr.ts`)
is strict: a field is *either* owner-editable *or* bound. The builder never writes
operational data.

---

## 5. The section registry & Section Contracts — how to add things

**Section Contracts are the source of truth.** `src/features/sections/contracts.ts`
holds one typed `SectionContract` per section (content fields + type/required/editable/
`DataSource`/limit, layout options **and forbidden list**, design allowed/forbidden,
data dependencies + `privacy` 🔒, states, `editorControls`, and a `variants` contract for
the future template library). `WEBSITE-SECTION-CONTRACTS.md` is **generated** from it —
`npm run contracts` (`scripts/gen-contracts.mts`). Never edit the `.md` by hand.

`registry.ts` imports the contracts: `contractFor(id)`, `editorKeys(id)`, and a DEV-only
`verifyContract` drift check that warns in the console if the inspector and the contract
disagree about a section's fields. **Rule: the editor never exposes a capability absent
from the contract; a future template variant never adds one the editor doesn't expose.**
When you change a section's editor controls, update `contracts.ts` first, then re-run
`npm run contracts`.


### Add a section
1. Add a `SectionType` to `src/types/index.ts`.
2. Add an entry to `SECTIONS` in `src/features/sections/registry.ts`:
   `{ id, name, category, icon, blurb, layoutVariants, content: { primary: Field[], more? }, dataRows? }`
   — plus flags: `advanced`, `global`, `structural`, `solo`, `dup`, `needs`.
3. Add a `case` to `SiteSection` in `src/features/sections/SectionCanvas.tsx` (the preview).
That's it — Add panel, Layers, the inspector (Content / Layout / Data) and
the canvas all pick it up from the registry.

### Add an inspector control
Extend the `Field` union in `registry.ts` and handle the new `kind` in
`src/features/inspector/primitives.tsx` (`InspectorField`). Every section's Content tab is
rendered from its `content.primary` / `content.more` field list.

### Add a page type
`makePage`-style: extend the `layouts`/`names` maps in the `addPage` case of `reducer.ts`.
Page objects are `{ id, name, slug, kind, home, hidden, inNav, blocks[] }`.

### Add a theme / template / palette / font pairing
Append to `THEMES` / `TEMPLATES` / `PALETTES` / `FONT_PAIRS` in `src/data/managr.ts`. The
Design sheet (`overlays/DesignSheet.tsx`) renders them; `applyTemplate` preserves a
section's data by type where the type survives. A palette entry just needs
`{ key, name, accent }` — accessibility of the pair is the curator's responsibility, and
that's the point (no colour wheel).

### Add a mini section preview
Add a `case` to `Body()` in `src/features/sections/SectionPreview.tsx` (used by the Add panel).

### Add a screen / route
Create `src/features/<area>/<Screen>.tsx`, add a `<Route>` in `src/app/App.tsx` (inside
`<ManagRShell>` for shell screens, top-level for full-screen surfaces), and a title in
`ManagRShell`'s `TITLES` map. Add it to `DevBar`'s `JUMPS` for quick access.

---

## 6. Routing

```
/website                     Website home (or the switch-on flow when setup ≠ done)
/website/availability        Live availability
/website/visits              Visit settings
/website/enquiries           Website enquiries
/website/bookings            Booking requests
/website/analytics           Analytics
/website/plan  /website/upgrade
/website/health              Website health
/website/settings            Website settings
/scheduled-visits            Scheduled Visits (ManagR-level screen)
/website/editor              the builder workspace (full-screen, ?page= is URL-synced)
/website/preview             the visitor site (full-screen; ?version=N for a snapshot preview)
```

`ManagRShell` is a layout route; the editor and visitor site render outside it. It provides
the shared app chrome: navy sidebar + a sticky desktop **`AppTopBar`** (`🏢 All properties ▾`
scope selector · plan badge · Help · initials avatar) so every shell screen sits inside the
same ManagR frame; the mobile header carries the avatar too.

---

## 7. Responsive & mobile

- Shell: sidebar is a left rail ≥1024px, a `Sheet` below.
- Editor ≥1024px: `grid-cols-[64px_296px_1fr_344px]` (rail / left panel / canvas / inspector).
- Editor <1024px: canvas-first, a bottom bar, a floating contextual bar on selection, and
  full-screen `Sheet`s for section settings / sections list / add. One overlay layer at a time.
- The canvas device switcher (Desktop/Tablet/Mobile) is a **preview** — it does not change
  the editing context. Content and layout are single-value across screens; only per-section
  show/hide is per-screen (Visibility tab).

---

## 8. Known gaps (intentional for this stage)

- No backend / API — `src/data/managr.ts` is the single source. Types are shaped for a drop-in API.
- Uploads, QR, payments, real auth: designed states, not wired.
- Visitor "version preview" shows the current site with a badge (snapshot-accurate rendering
  is a follow-up).
- Drag-reorder of sections is not implemented (arrows only, as in the prototype); the
  `@dnd-kit`-style upgrade is a follow-up.
- A few deep sub-screens (blackout-date editor, property picker at 40+ properties, per-field
  SEO) are represented but not fully interactive.
- `EnquiriesScreen` / `VisitsScreen` form controls are presentational where the prototype's were.

None of these change the product model; they are build depth, tracked here.
