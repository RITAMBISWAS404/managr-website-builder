# BEDR — Design Foundation (Implementation-Ready)

Practical foundation for building the **new** website in plain HTML + CSS + minimal JS.

- **Source of truth:** [`BEDR-DESIGN-SYSTEM.md`](BEDR-DESIGN-SYSTEM.md). Every value here is preserved from it. No new colours, spacing, radii, or component styles were invented.
- **Companion file:** [`assets/css/tokens.css`](assets/css/tokens.css) — the tokens below as ready-to-use CSS custom properties.
- **Scope of this step:** tokens + component system + reuse rules + layout foundation. No pages.
- Anything not in the Figma reference is **not styled here** — it is listed in [Design System Gaps](#7-design-system-gaps).

---

## 1. Token system

Naming convention: `--<category>-<name>`. All tokens live on `:root` in `tokens.css`. Prototype CSS must reference tokens, never raw hex/px.

### 1.1 Colour

**Brand**

| Token | Value | Role |
|---|---|---|
| `--color-primary` | `#F7553D` | BEDR coral — active states, accent text, primary-brand fills |
| `--color-primary-strong` | `#EF4444` | Solid primary CTA fill, tab underline, destructive |
| `--color-primary-alt` | `#FF5A3D` | Active segment in split/toggle controls |
| `--color-primary-progress` | `#FB2C36` | Progress-bar fill at low value |
| `--color-navy` | `#001737` | Active sidebar nav background, dark banners |
| `--color-navy-ink` | `#002F5D` | Deep navy (hero/revenue surfaces) |
| `--color-navy-grad-from` / `--color-navy-grad-to` | `#002F5D` → `#0F5584` | `--gradient-navy` (90deg) — secondary "navy" button, hero cards |
| `--color-cta-orange` | `#FF6900` | Setup / onboarding CTA fill |
| `--color-cta-orange-glow` | `#FFD6A7` | Colored glow shadow on the orange CTA |

**Neutral ramp** (slate; rendered borders use `--border-*`)

| Token | Value | Typical use |
|---|---|---|
| `--color-white` | `#FFFFFF` | Card + page background |
| `--color-n-50` | `#F8FAFC` | Table header row |
| `--color-n-100` | `#F1F5F9` | Progress track, dividers, modal header/footer border |
| `--color-n-150` | `#E5E5E5` | Table cell divider, subtle button border |
| `--color-n-200` | `#E2E8F0` | **Default control border** |
| `--color-n-400` | `#90A1B9` | Tertiary/muted text, micro labels, chevrons |
| `--color-n-500` | `#62748E` | Secondary body text, inactive tab |
| `--color-n-600` | `#45556C` | Card labels, tertiary button text |
| `--color-n-700` | `#314158` | Form labels, strong secondary text |
| `--color-n-800` | `#1D293D` | Modal section headings |
| `--color-n-900` | `#0F172B` | Headings, metric numbers, strong values |
| `--color-ink` | `#0A0A0A` | Near-black label text |
| `--color-placeholder` | `rgba(10,10,10,0.5)` | Input placeholder |
| `--color-field-border` | `#767676` | Checkbox / radio unselected border |

`--color-n-300` (`#CAD5E2`) is reserved (named, unused) — do not use until a need appears.

**Semantic**

| Group | Tokens | Values |
|---|---|---|
| Success | `--color-success-text` / `-solid` / `-surface` / `-border` | `#009966` / `#00BC7D` / `#ECFDF5` / `#A4F4CF` |
| Warning | `--color-warning-text` / `-surface` / `-border` | `#BB4D00` / `#FFFBEB` / `#FEE685` |
| Info | `--color-info-solid` / `-selected` | `#155DFC` / `#0075FF` |
| Purple | `--color-purple-text` | `#8200DB` |
| Danger | `--color-danger` / `--color-danger-required` | `#EF4444` / `#E7000B` |
| Banner (amber) | `--color-banner-surface` / `-border` | `rgba(255,247,237,0.5)` / `#FFEDD4` |

**Semantic aliases** (what components actually reference)

```
--text-heading:      var(--color-n-900);
--text-body:         var(--color-n-700);
--text-muted:        var(--color-n-500);
--text-subtle:       var(--color-n-400);
--text-on-primary:   var(--color-white);
--surface-page:      var(--color-white);
--surface-card:      var(--color-white);
--surface-subtle:    var(--color-n-50);
```

### 1.2 Typography

| Token | Value |
|---|---|
| `--font-family` | `"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |

**Font weights**

| Token | Value |
|---|---|
| `--fw-regular` | `400` |
| `--fw-medium` | `500` |
| `--fw-semibold` | `600` |
| `--fw-bold` | `700` |

**Font sizes** (px, from the extracted scale — nothing added)

| Token | Value |
|---|---|
| `--fs-micro` | `10px` |
| `--fs-pill` | `11px` |
| `--fs-caption` | `12px` |
| `--fs-body` | `14px` |
| `--fs-section` | `16px` |
| `--fs-title` | `18px` |
| `--fs-display` | `24px` |

**Line heights** (px, paired with the sizes above)

| Token | Value |
|---|---|
| `--lh-micro` | `15px` |
| `--lh-pill` | `16.5px` |
| `--lh-caption` | `16px` |
| `--lh-body` | `20px` |
| `--lh-section` | `24px` |
| `--lh-title` | `28px` |
| `--lh-display` | `32px` |

**Letter-spacing** (only values confirmed in the reference)

| Token | Value | Use |
|---|---|---|
| `--ls-display` | `-0.6px` | Display metric numbers |
| `--ls-micro` | `0.25px` | Uppercase micro labels |
| `--ls-table-head` | `0.6px` | Table column headers |
| `--ls-normal` | `0` | Everything else |

**Text styles** (utility classes — the only typographic combos used in the reference)

| Class | Size / line-height / weight / spacing / colour |
|---|---|
| `.t-display` | 24 / 32 / 600 / `-0.6px` / `--text-heading` |
| `.t-page-title` | 18 / 28 / 700 / 0 / `--text-heading` |
| `.t-card-title` | 18 / 28 / 700 / 0 / `--text-heading` |
| `.t-section` | 16 / 24 / 600 / 0 / `--color-n-800` |
| `.t-body` | 14 / 20 / 400 / 0 / `--text-body` |
| `.t-body-medium` | 14 / 20 / 500 / 0 / `--text-body` |
| `.t-body-strong` | 14 / 20 / 600 / 0 / `--text-body` |
| `.t-label` | 12 / 16 / 600 / 0 / `--text-muted` |
| `.t-caption` | 12 / 16 / 500 / 0 / `--text-muted` |
| `.t-micro` | 10 / 15 / 500 / `0.25px` / `--text-subtle` · `text-transform:uppercase` |
| `.t-pill` | 11 / 16.5 / 500 / 0 / (contextual) |

> `--fs-h1` box height in Figma is 32; the glyph size is **18px**. Use `.t-page-title` (18/28).

### 1.3 Spacing

Canonical scale = Figma `Spacing/*`. Keep the same indices.

| Token | Value | Figma |
|---|---|---|
| `--space-0` | `4px` | `Spacing/0` |
| `--space-1` | `8px` | `Spacing/1` |
| `--space-2` | `10px` | `Spacing/2` |
| `--space-3` | `12px` | `Spacing/3` |
| `--space-4` | `16px` | `Spacing/4` |
| `--space-5` | `20px` | `Spacing/5` |
| `--space-6` | `24px` | `Spacing/6` |
| `--space-8` | `40px` | `Spacing/8` |
| `--space-10` | `64px` | `Spacing/10` |

`--space-7` and `--space-9` do not exist in the reference — do not add them.
`6px` appears as an in-button icon gap only → `--gap-icon: 6px` (single-purpose token).

### 1.4 Border radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | `2px` | Checkbox |
| `--radius-sm` | `4px` | Small inset elements (`Radius/1`) |
| `--radius-md` | `8px` | Radio, small ghost button (`Radius/2`) |
| `--radius-lg` | `10px` | **Default control radius** — buttons, inputs, selects, textareas, nav items, icon tiles |
| `--radius-xl` | `14px` | Cards, stat cards, onboarding CTA |
| `--radius-2xl` | `18px` | Modals, welcome banner, 48px icon tiles |
| `--radius-full` | `9999px` | Pills, badges, chips, progress bars, avatars, circular icon buttons |

### 1.5 Borders / strokes

| Token | Value | Use |
|---|---|---|
| `--border-width` | `0.8px` | **All default component borders** (deliberate, file-wide) |
| `--border-width-strong` | `1px` | Checkbox / radio outline (`Stroke/1`) |
| `--border-width-tab` | `1.6px` | Tab underline (active + transparent inactive) |
| `--border-color` | `#E2E8F0` | Default border (inputs, cards, buttons, selects, badges) |
| `--border-color-divider` | `#F1F5F9` | Tab-track, modal header/footer, list separators |
| `--border-color-table` | `#E5E5E5` | Table row divider (bottom only) |
| `--border-color-field` | `#767676` | Checkbox / radio unselected |
| `--border-color-active` | `#EF4444` | Active tab underline |
| `--border-color-selected` | `#0075FF` | Selected radio ring |

Standard border shorthand: `border: var(--border-width) solid var(--border-color);`

### 1.6 Shadows

| Token | Value |
|---|---|
| `--shadow-xs` | `0 1px 1px rgba(0,0,0,.05)` |
| `--shadow-sm` | `0 1px 1.5px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.1)` |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)` |
| `--shadow-nav-active` | `0 4px 3px rgba(0,0,0,.1), 0 2px 2px rgba(0,0,0,.1)` |
| `--shadow-modal` | `0 25px 50px -12px rgba(0,0,0,.25)` |
| `--shadow-inset` | `inset 0 2px 4px rgba(0,0,0,.05)` |
| `--glow-orange` | `0 10px 7.5px var(--color-cta-orange-glow), 0 4px 3px var(--color-cta-orange-glow)` |
| `--blur-glass` | `blur(12px)` (badges); `blur(8px)` for circular image buttons → `--blur-glass-sm` |

### 1.7 Gradients & effects

| Token | Value |
|---|---|
| `--gradient-navy` | `linear-gradient(90deg, #002F5D, #0F5584)` |
| `--gradient-card-tint` | `linear-gradient(152deg, rgba(98,116,142,.12) 0%, rgba(98,116,142,.06) 50%, rgba(98,116,142,0) 100%)` (grey stat card; recolour per accent) |
| `--scrim-image` | `linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 50%)` (property-card photo scrim, 80% opacity) |

### 1.8 Layout tokens

| Token | Value | Source |
|---|---|---|
| `--sidebar-w-collapsed` | `72px` | frame structure |
| `--sidebar-w` | `204px` | inferred (Dashboard frame) |
| `--header-h` | `64px` | frame structure |
| `--page-gutter` | `24px` | `Spacing/6` |
| `--content-pad-top` | `20px` | frames |
| `--card-gap` | `16px` | `Spacing/4` |
| `--section-gap` | `24px` | `Spacing/6` |
| `--content-max` | `1464px` | main column at 1536 − 72 sidebar |

### 1.9 Implementation utilities (not visual — required to build)

Not from Figma; needed for a working prototype. No visual impact.

| Token | Value |
|---|---|
| `--z-base` / `--z-sticky` / `--z-dropdown` / `--z-overlay` / `--z-modal` / `--z-toast` | `0 / 100 / 1000 / 1100 / 1200 / 1300` |
| `--transition-fast` / `--transition` | `120ms ease` / `180ms ease` |
| `--overlay-backdrop` | `rgba(15,23,43,0.5)` — modal scrim (exact value is a Gap; this is a working default) |
| `--focus-ring` | `0 0 0 2px var(--color-info-selected)` — keyboard focus (interaction states are a Gap) |

---

## 2. Component system

Conventions:
- **BEM-lite:** block `.card`, element `.card__title`, modifier `.card--stat`.
- Components are **token-only** (no literals). Layout (margins, grid placement) is set by the parent, not the component.
- Every component below is fully specified for its **default/rest state**. Hover / focus-visible / active / disabled / loading are **not in the reference** → see [Gaps](#7-design-system-gaps). `tokens.css` ships `--focus-ring` + `--transition` so states can be added in one place later.

### 2.1 Button — `.btn`

Base: `display:inline-flex; align-items:center; justify-content:center; gap:var(--gap-icon); font:600 14px/20px var(--font-family); border-radius:var(--radius-lg); padding:var(--space-2) var(--space-4); border:0; cursor:pointer;` Icon size 16px (14px in compact).

| Variant | Class | Fill / border | Text | Radius | Shadow |
|---|---|---|---|---|---|
| Primary | `.btn--primary` | `--color-primary-strong` | white | lg | `--shadow-sm` |
| Navy | `.btn--navy` | `--gradient-navy` | white | lg | `--shadow-sm` |
| Onboarding | `.btn--cta` | `--color-cta-orange` | white, 700 | xl | `--glow-orange` |
| Outline (default secondary) | `.btn--outline` | white · `border` | `--color-n-700` | lg | `--shadow-sm` |
| Ghost | `.btn--ghost` | white · `border` (`n-150`) | `--color-ink`, 500 | md | `--shadow-xs` |
| Compact chip | `.btn--compact` | white · `border` | `--color-n-600`, 600 / 12px | lg | `--shadow-sm` |
| Danger | `.btn--danger` | `--color-danger` | white | lg | `--shadow-sm` |
| Success | `.btn--success` | success green (see Gaps for exact hex) | white | lg | `--shadow-sm` |

**Sizes:** `.btn` (default, h≈40, `--space-2`/`--space-4`) · `.btn--sm` (h≈32–38, `--space-1`/`--space-3`, 12–14px) · `.btn--icon` (square, `--radius-full` or lg, padding `--space-0`, 32/36px).

**Modifiers:** `.btn--block` (full width). Icon-only circular buttons on imagery add `backdrop-filter:var(--blur-glass-sm); background:rgba(255,255,255,.9);`.

**Split / toggle control — `.segmented`**
```
.segmented           → inline-flex; border; border-radius:lg; overflow:hidden
.segmented__item     → padding:0 var(--space-3); height:38px; display:grid; place-items:center
.segmented__item + . → border-left: var(--border-width) solid var(--border-color)
.segmented__item.is-active → background:var(--color-primary-alt); color:#fff
```

**States:** rest only defined. Cancel button in modals = `.btn--outline` with 700 weight text.

### 2.2 Text input / phone input / textarea — `.field`

```
.field            → wrapper (optional), display:flex; flex-direction:column; gap:var(--space-1)
.field__label     → .t-body-strong; color:var(--color-n-700)
.field__label .req→ color:var(--color-danger-required)      /* the * */
.field__control   → the input/select/textarea
```
`.input` (and `textarea.input`):
- `background:var(--surface-card); border:var(--border-width) solid var(--border-color); border-radius:var(--radius-lg);`
- `padding:var(--space-1) var(--space-3); min-height:38px; font:400 14px/20px var(--font-family); color:var(--color-n-900);`
- `::placeholder{ color:var(--color-placeholder); }`
- Textarea: `min-height:78px; padding-block:var(--space-1); resize:vertical;`
- With leading icon → `.input--with-icon{ padding-left:var(--space-8); }` + absolutely-positioned 16px icon at `left:var(--space-3)`.

**Variants:** `.input--search` (icon + `--radius-lg`, often `--radius-full` visually acceptable — reference uses lg). `.input--sm` height 32.
**States:** default only. `focus`, `:disabled`, error (`aria-invalid`) → Gaps. Required affordance = `.req` asterisk only.

### 2.3 Select / dropdown — `.select`

- Same box as `.input` (border, radius-lg, padding, 38px height).
- Trailing chevron: 8px box, `border-bottom + border-right: 1.6px solid var(--color-n-400)`, `transform:rotate(45deg)`, positioned `right:var(--space-3)`.
- Placeholder text `--color-n-400`.
- Full-width variant `.select--block` spans the container (e.g. 624px modal fields).
- Menu / option / open state → **Gaps** (not in reference). Build the closed control now; wire the menu with minimal JS later using `--z-dropdown`.

### 2.4 Checkbox & radio — `.check`, `.radio`

| | Size | Border (rest) | Radius | Selected |
|---|---|---|---|---|
| `.check` | 16px | `1px solid var(--border-color-field)` on white | `--radius-xs` | check glyph, fill TBD (Gap) |
| `.radio` | 16px | `1px solid var(--border-color-field)` on white | `--radius-md` | `1px solid var(--border-color-selected)` ring + 10px inner dot |

Label: `.t-body` (`--color-n-700`), gap `--space-1`; option groups gap `--space-4`.

### 2.5 Card — `.card`

```
.card         → background:var(--surface-card); border:var(--border-width) solid var(--border-color);
                border-radius:var(--radius-xl); box-shadow:var(--shadow-sm); padding:var(--space-4);
.card--flush  → padding:0 (for media-first cards)
.card--pad-lg → padding:var(--space-6) (dashboard chart cards)
.card__header → display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3)
.card__title  → .t-card-title   (or .t-section for 16px header cards)
.card__action → .t-body-medium; color:var(--color-primary)   /* "View all", "Edit" */
.card__body   → grid/flex, block gap var(--space-4)
```

**Variant — Stat / KPI card `.card--stat`** (fixed layout, ~92px tall)
```
.stat__value  → .t-display
.stat__label  → .t-caption; color:var(--color-n-600)
.stat__icon   → 36px; border-radius:var(--radius-lg); display:grid; place-items:center;
                background: color-mix(in srgb, <accent> 20%, transparent); /* icon 20px */
.card--stat::before → --gradient-card-tint recoloured to <accent>   /* diagonal wash */
```
Accent families in the reference: slate, green, red, blue, purple, amber (one per card). Expose as `.card--stat.accent-{slate|green|red|blue|purple|amber}` setting an `--accent` custom prop.

**Variant — Dark/banner card `.card--dark`**: `background:var(--gradient-navy); color:#fff;` used for revenue hero and the "Setup 2/3" banner (thin `--color-primary-strong` progress line, `--space-6` padding).

### 2.6 Property card — `.property-card`

`.card .card--flush` + column layout: media header → body.

```
.property-card__media      → position:relative; height:224px; background:var(--color-n-200); overflow:hidden
.property-card__media img  → object-fit:cover; width:100%; height:100%
.property-card__media::after→ content:""; inset:0; background:var(--scrim-image); opacity:.8   /* bottom-up */
.property-card__type        → top-left, var(--space-3) inset · .pill.pill--glass (icon 14 + 12px/700 text, colour by type)
.property-card__menu        → top-right · .btn--icon glass (32px, blur-glass-sm)
.property-card__flags       → bottom-left, top:~187px · row of .pill, gap var(--space-1)   /* status + audience */
.property-card__body        → padding:var(--space-4); display:flex; flex-direction:column
  · block gap: var(--space-5) between title-block / stat-quad, var(--space-4) before occupancy
.property-card__name        → .t-card-title
.property-card__location    → 14px pin icon + .t-body-medium (--color-n-500), gap var(--space-0)
.property-card__stats       → display:grid; grid-template-columns:repeat(4,1fr); gap:var(--space-1)
  .stat-cell               → flex column, centre; icon 20 → value (.t-body-strong 16, --color-n-900) → label (.t-micro)
.property-card__occupancy   → row: "Occupancy" .t-body-medium (--color-n-500) | right: "Occupied" .t-caption + "NN%" .t-body-strong
.property-card__bar         → height:8px; border-radius:var(--radius-full); background:var(--color-n-100)
  .property-card__bar > i   → height:8px; border-radius:var(--radius-full); width:NN%
                              low → var(--color-primary-progress); high → var(--color-success-solid)
```
**Variant `.property-card--compact`** (flats/single listings): replace `__stats` with a mini key/value list (NAME / STATUS / VIEWS); STATUS uses a `.pill` ("• Vacant" danger).

### 2.7 Tabs — `.tabs`

Underline pattern (the primary one):
```
.tabs        → display:flex; gap:var(--space-6); padding-inline:var(--space-4);
               border-bottom:var(--border-width) solid var(--border-color-divider)
.tabs__tab   → padding-block:var(--space-3); border-bottom:var(--border-width-tab) solid transparent;
               font:500 14px/20px var(--font-family); color:var(--color-n-500); cursor:pointer
.tabs__tab.is-active → color:var(--color-primary-strong); border-bottom-color:var(--color-primary-strong)
.tabs__count → small superscript number after the label
```
**Variant `.tabs--icon`** (property-detail / settings sub-nav): each tab has a leading icon; active colour = `--color-primary`. Per-tab trailing status marker allowed (`✓` success, `.pill` "REQUIRED").

### 2.8 Pill / badge / chip — `.pill`

Base: `display:inline-flex; align-items:center; gap:var(--gap-icon); border-radius:var(--radius-full); padding:var(--space-0) var(--space-2); font:600 12px/16px var(--font-family); border:var(--border-width) solid transparent;`

| Variant | Class | Surface / border / text |
|---|---|---|
| Warning (Pending) | `.pill--warning` | `--color-warning-surface` / `--color-warning-border` / `--color-warning-text` |
| Success (Approved / Live) | `.pill--success` | `--color-success-surface` / `--color-success-border` / `--color-success-text` |
| Info solid (audience) | `.pill--info-solid` | `--color-info-solid` / — / white |
| Purple (type) | `.pill--purple` | white 95% / `rgba(243,232,255,.5)` / `--color-purple-text` |
| Neutral | `.pill--neutral` | `--color-n-100` / — / `--color-n-600` |
| Danger | `.pill--danger` | danger surface / — / `--color-danger` |

**Modifiers:** `.pill--glass` (`backdrop-filter:var(--blur-glass)`, `--shadow-card`, for on-image chips) · `.pill--dot` (leading `--space-1` status dot, e.g. Live = `--color-success-solid` @ 50%) · `.pill--sm` (11px/`--fs-pill`, weight 500).

**Status-map helper:** lead stages (New=info, Contacted=warning, Booked=success, Lost=neutral/danger) and priorities (Low=success, Medium=warning, High=danger). Exact stage-surface hexes for the dropdown style → Gaps.

### 2.9 Navigation

**Sidebar — `.sidebar`**
```
.sidebar              → width:var(--sidebar-w); background:var(--color-navy); (rail = --sidebar-w-collapsed)
.sidebar.is-collapsed → width:var(--sidebar-w-collapsed)
.nav-item             → display:flex; align-items:center; gap:var(--space-3);
                        padding:var(--space-3) var(--space-4); border-radius:var(--radius-lg);
                        font:500 14px/20px var(--font-family); color:rgba(255,255,255,.7)
.nav-item .icon       → 20px
.nav-item.is-active   → background:var(--color-navy); color:#fff; box-shadow:var(--shadow-nav-active)
.nav-item__badge      → .pill--sm, coral/orange solid, white text  ("2/3")
```
(A light sidebar panel also exists in the reference; if used, active item = coral-tinted surface, inactive text `--color-n-500`. Pick one variant per build — see Reuse Rules.)

**Header bar — `.appbar`**
```
.appbar        → height:var(--header-h); background:#fff; border-bottom:var(--border-width) solid var(--border-color-divider);
                 display:flex; align-items:center; justify-content:space-between; padding-inline:var(--page-gutter)
.appbar__left  → property scope selector = .btn--outline with leading icon + trailing chevron, height 36
.appbar__right → gap:var(--space-3): progress .pill → .avatar → .btn--ghost ("Tour") → .btn--primary ("Help")
```

**Avatar — `.avatar`**: `--radius-full`, 32–36px, tinted background + initials, `.t-body-medium`.

**Breadcrumb — `.breadcrumb`**: `.t-caption`/`.t-body`, `--color-n-500`, current item `--color-primary`, `›` separators.

**Page header — `.page-head`** (inside content, not the appbar):
```
.page-head__title → .t-page-title
.page-head__desc  → .t-body (--color-n-600)
.page-head__actions → right-aligned button row, gap var(--space-3)
```

### 2.10 Table — `.table`

```
.table            → width:100%; border-collapse:collapse; background:#fff
.table thead th   → background:var(--color-n-50); border-bottom:var(--border-width) solid var(--border-color-table);
                    height:53px; padding:var(--space-4) var(--space-6);
                    font:600 12px/16px var(--font-family); letter-spacing:var(--ls-table-head); color:var(--color-n-500); text-align:left
.table tbody td   → height:73px; padding:var(--space-4) var(--space-6);
                    border-bottom:var(--border-width) solid var(--border-color-table); vertical-align:middle
.table__select    → first col, width 48px, padding var(--space-4)
.table__primary   → .t-body-medium (--color-n-900)
.table__secondary → .t-caption (--color-n-400)   /* stacked under primary */
.table__actions   → inline-flex, 16px icon buttons + a .select/.pill status control
.table tr.is-highlight → subtle amber row wash (selected/hover — treat as selected; hover TBD)
```
**Toolbar above the table — `.list-toolbar`**: search input left · filter `.btn--outline` + view-toggle `.segmented` right · result count (`.t-caption`) below. **Pagination — `.pager`**: "Showing X–Y of Z" + page-size `.select--sm` + `‹ n/m ›` arrows.

**Card-grid alternative:** where the reference shows cards instead of rows (properties, BedR Leads), use `.card-grid` (see §4), not `.table`.

### 2.11 Modal / dialog — `.modal`

```
.modal-overlay → position:fixed; inset:0; background:var(--overlay-backdrop); z-index:var(--z-overlay);
                 display:grid; place-items:center; padding:var(--space-6)
.modal         → background:#fff; border-radius:var(--radius-2xl); box-shadow:var(--shadow-modal);
                 width:min(672px, 100%); max-height:90vh; display:flex; flex-direction:column; overflow:hidden;
                 z-index:var(--z-modal)
.modal__header → flex; align-items:center; justify-content:space-between;
                 padding:var(--space-4) var(--space-6); border-bottom:var(--border-width) solid var(--border-color-divider)
.modal__title  → .t-page-title (18/600)          .modal__subtitle → .t-caption (--color-n-500)
.modal__close  → .btn--icon, 20px glyph, --radius-full
.modal__body   → padding:var(--space-6); overflow-y:auto; flex:1
.modal__section + .modal__section → margin-top:var(--space-6)
.modal__section-title → .t-section (--color-n-800); + first field margin-top var(--space-4)
.modal__footer → flex; justify-content:flex-end; gap:var(--space-3);
                 padding:var(--space-4) var(--space-6); border-top:var(--border-width) solid var(--border-color-divider)
                 → [ .btn--outline "Cancel" ] [ .btn--primary <action> ]
```
**Field grids inside:** `.form-grid--2` (`repeat(2,1fr)`, gap `--space-4`), `.form-grid--3` (date/time), full-width for single selects.
**Confirm/alert dialog:** same shell, smaller width (`min(440px,100%)`), body = message text, footer = Cancel + primary/danger.

### 2.12 Bottom sheet — `.sheet`

**Not represented in the Figma reference.** Do not build now. When needed, reuse `.modal` internals (header/body/footer, section rhythm, `--radius-2xl` on top corners only) with bottom-anchored positioning. Listed in Gaps.

### 2.13 Alerts / notices — `.notice`

The reference has **inline notice strips** (KYC "Manual Upload Under Review", "Note: You can proceed…") but **no toast/snackbar**.
```
.notice        → display:flex; gap:var(--space-3); padding:var(--space-3) var(--space-4);
                 border-radius:var(--radius-lg); border:var(--border-width) solid transparent; font-size:var(--fs-body)
.notice--warning → --color-warning-surface / --color-warning-border / --color-warning-text
.notice--info    → light blue surface (see Gaps for exact) / --color-info-solid text
.notice--success → --color-success-surface / --color-success-border / --color-success-text
```
Toast component + positioning/stacking → Gaps (`--z-toast` reserved).

### 2.14 Empty state — `.empty`

Only the in-panel single-line form is in the reference.
```
.empty        → padding-block:var(--space-8); text-align:center
.empty__text  → .t-body-medium; color:var(--color-n-500)
```
`.empty--media` = light `--color-n-200` block + centred "image-off" icon (for missing photos).
Full illustrated empty / error / 404 states → Gaps.

### 2.15 Other recurring patterns

| Pattern | Class | Notes |
|---|---|---|
| Onboarding banner | `.setup-banner` | `.card--dark` (navy gradient) or amber (`--color-banner-surface` / `--color-banner-border`, `--radius-2xl`, `--space-6` pad) + 48px `--radius-2xl` icon tile (`--shadow-inset`) + `.btn--cta` + dismiss `.btn--icon` |
| Progress bar | `.progress` / `.progress > i` | track `--color-n-100`, fill coloured, height 8px, `--radius-full` |
| Section label | `.section-label` | `.t-micro` above a card cluster, `margin-bottom:var(--space-3)` |
| Icon tile | `.icon-tile` | square, `--radius-lg` (36px) or `--radius-2xl` (48px), tinted bg, centred icon |
| Metric delta | `.delta` | inline 12px, `--color-success-text` / `--color-danger` with ▲▼ |
| Calendar grid | `.calendar` | month grid; "today" = `--color-primary` filled circle. Only structure is in reference; day-cell interaction states → Gaps |
| KYC/verification card | reuse `.card` + `.notice` | no bespoke component |

---

## 3. Reuse rules

**Default: reuse.** Before adding any CSS, check §2 for a component that covers the need.

### Reuse an existing component (no new code) when…
- The need is a labelled action → `.btn` + an existing variant.
- The need is a bordered white container with a title → `.card` (+ `--stat` / `--dark` / `--pad-lg` / `--flush`).
- The need is a short status/label token → `.pill` + a semantic variant.
- The need is a single-line text/number entry → `.field` + `.input` / `.select`.
- The need is tabular data with sortable columns → `.table`; a set of repeating rich records → `.card-grid`.
- The need is a focused task overlay → `.modal` (or its confirm size).
- Colour, spacing, radius, type — **always** from tokens; never a literal.

### Create a component **variant** (`--modifier`) when…
- Same structure and DOM, only visual treatment or one sizing dimension changes (e.g. a green action button → `.btn--success`; a wider modal field row → `.form-grid--3`).
- The variant is reusable across ≥2 features. One-feature visual tweaks belong in that feature's stylesheet as a local override of tokens, not a new global modifier.
- Naming: `.<block>--<variant>`; document it in §2 in the same PR.

### Create a **new component** only when ALL are true…
- No existing block shares its structure or purpose.
- It will recur across features (not a single screen).
- It cannot be expressed as `existing block + modifier + token overrides`.
- It uses **only** existing tokens (§1). A new component that needs a new colour/spacing/shadow value is blocked until that value has a documented requirement and is added to `tokens.css`.

### Consistency rules across pages
1. One button hierarchy per view: exactly one `.btn--primary` (the main action); everything else `.btn--outline` / `.btn--ghost`.
2. Page structure is always `.appbar` → `.page-head` → optional `.setup-banner`/`.notice` → optional KPI `.card-grid` → primary content (`.table` or `.card-grid`) → grouped `.section-label` + cards.
3. Same data type → same component everywhere (a property is always a `.property-card`; a lead stage is always a `.pill` with the stage→variant map; a metric is always `.card--stat`).
4. Spacing between siblings is `--card-gap` (16) within a group and `--section-gap` (24) between groups — no ad-hoc margins.
5. Icon sizes: 14 (in compact chips / inline text), 16 (buttons, inputs), 20 (nav, stat tiles), 24 (banner tiles). No other sizes.
6. Pick **one** sidebar treatment (navy or light) for the whole product and keep it.
7. Radius: controls `lg`, cards `xl`, modals `2xl`, pills `full`. Never mix.

---

## 4. Layout foundation

### 4.1 App shell (desktop — the only width in the reference: 1536px)
```
.app        → display:grid; grid-template-columns:var(--sidebar-w) 1fr   (rail: --sidebar-w-collapsed)
.app__main  → display:flex; flex-direction:column; min-width:0
.content    → padding:var(--content-pad-top) var(--page-gutter) var(--page-gutter);
              max-width:var(--content-max); margin-inline:auto; width:100%
```
- Header (`.appbar`) is sticky at `top:0`, `z-index:var(--z-sticky)`.
- Content column is fluid up to `--content-max`, centred, with `--page-gutter` (24) left/right.

### 4.2 Section & card spacing
- Between stacked full-width sections: `--section-gap` (24). Use `.stack` (`display:flex; flex-direction:column; gap:var(--section-gap)`) on `.content`.
- Section label → card cluster: `--space-3` (12).
- Card internal padding: `--space-4` (16); chart/dashboard/modals: `--space-6` (24).
- Gap between sibling cards / grid items: `--card-gap` (16).
- Chip groups inside cards: `--space-1` (8).

### 4.3 Grids
No formal column grid exists in the reference. Use these observed patterns via a single helper:
```
.card-grid            → display:grid; gap:var(--card-gap)
.card-grid--kpi       → grid-template-columns:repeat(4,1fr)   (or 5 — set per page)
.card-grid--properties→ grid-template-columns:repeat(3,1fr)
.card-grid--split     → grid-template-columns:1fr 1fr          (dashboard 2-col; 3fr 2fr where shown)
```
Modal field grids: `.form-grid--2` / `.form-grid--3` (§2.11).

### 4.4 Alignment & hierarchy
- Page title + primary actions share the first row of `.content` (`justify-content:space-between`).
- Text alignment: left everywhere except stat-cell values/labels and calendar cells (centre).
- Numbers in tables: left-aligned (matches reference).
- Hierarchy by colour: heading `--color-n-900` → body `--color-n-700` → muted `--color-n-500` → subtle `--color-n-400`. Coral is reserved for the single primary action + active state.

### 4.5 Desktop / mobile
- **Desktop:** fully specified above (single reference width).
- **Mobile / tablet:** the reference contains **no** mobile frames, breakpoints, or responsive variables. Reasonable, low-risk derivations only:
  - Sidebar collapses to the `--sidebar-w-collapsed` rail, then to an off-canvas drawer below a small width.
  - `.card-grid--*` collapse to 1 column; `.card-grid--split` stacks.
  - `.content` gutter may reduce to `--space-4` (16).
  - `.table` becomes horizontally scrollable in a wrapper, or switches to `.card-grid` of records.
  - `.modal` becomes full-width / bottom-anchored (`.sheet`).
- **Exact breakpoint values, per-breakpoint type/spacing scales, and the table→cards switch point are NOT defined** → Gaps. Build desktop-first; add a `@media` layer later against agreed breakpoints.

---

## 5. HTML / CSS implementation guide

### 5.1 File structure
```
assets/css/
  tokens.css        → :root custom properties (§1) — ships now
  base.css          → reset, html/body, .font defaults, .t-* text styles, layout helpers (.app/.content/.stack/.card-grid)
  components.css     → §2 component classes (build incrementally as features need them)
  utilities.css      → spacing/display helpers if needed (prefer tokens + component classes first)
```
Load order: `tokens → base → components → utilities`. No build step required; plain `<link>` tags.

### 5.2 Token → CSS mapping
- Every token in §1 is a `--custom-property` in `tokens.css` (already written).
- Components reference tokens only: `padding: var(--space-4)` not `16px`.
- Accent theming (stat cards, notices): set a local `--accent` on the element and let the component read it.

### 5.3 Consistent HTML skeletons
```html
<!-- Page -->
<div class="app">
  <aside class="sidebar">…</aside>
  <div class="app__main">
    <header class="appbar">…</header>
    <main class="content stack">
      <div class="page-head">
        <div><h1 class="t-page-title">Title</h1><p class="page-head__desc">…</p></div>
        <div class="page-head__actions"><button class="btn btn--primary">Action</button></div>
      </div>
      <section class="card-grid card-grid--kpi">…</section>
      <section> … primary content … </section>
    </main>
  </div>
</div>

<!-- Button -->
<button class="btn btn--primary"><svg class="icon">…</svg> Label</button>

<!-- Field -->
<label class="field">
  <span class="field__label">Customer Name <span class="req">*</span></span>
  <input class="input" placeholder="Enter customer name">
</label>

<!-- Pill -->
<span class="pill pill--warning">Pending</span>

<!-- Card / stat -->
<article class="card card--stat accent-slate">
  <p class="stat__value">33</p>
  <span class="stat__icon"><svg class="icon">…</svg></span>
  <p class="stat__label">Total Buildings</p>
</article>
```

### 5.4 Responsive approach
- Author desktop-first.
- Add one `@media (max-width: …)` block per component in `components.css` **only** once breakpoints are agreed (Gap).
- Use `clamp()` / `%` / `fr` for fluidity within the current column model; do not hard-code widths outside tokens.

### 5.5 JS scope
Minimal, progressive: toggle classes only (`.is-active`, `.is-collapsed`, `.is-open`), open/close `.modal`, dropdown menus, tab switching. No framework. State classes are already the styling hooks in §2.

---

## 6. What ships in this step

| Artifact | Status |
|---|---|
| `assets/css/tokens.css` | ✅ complete — all §1 tokens |
| This document | ✅ token system, component system, reuse rules, layout foundation |
| `base.css` / `components.css` | ⬜ build incrementally with the first feature (skeletons defined in §2/§5) |
| Pages | ⬜ not in scope |

---

## 7. Design System Gaps

Genuinely missing — each needs a design decision before it can be built. **Not solved here.**

**Responsive**
- Breakpoint values (mobile / tablet / desktop) and the container behaviour at each.
- Per-breakpoint type & spacing adjustments (or confirmation the desktop scale holds).
- The width at which `.table` switches to a card list, and the sidebar → drawer transition point.

**Interaction states** (reference shows rest state only)
- Hover, focus-visible, active/pressed, disabled, loading — for `.btn`, `.input`, `.select`, `.nav-item`, `.tabs__tab`, `.table` rows, `.card` (if interactive).
- Focus-ring spec (colour, width, offset). `--focus-ring` in `tokens.css` is a working placeholder.
- Form validation / error state styling (`aria-invalid`), helper/error text style.

**Components not in the reference**
- Toast / snackbar (component + stacking + position + auto-dismiss). `--z-toast` reserved.
- Bottom sheet (`.sheet`) — mobile modal pattern.
- Dropdown/select **menu** (open panel, option rows, hover/selected, multi-select, search-in-select).
- Date picker / time picker open state (closed control is defined).
- Tooltip, popover, context menu.
- Full-page empty states, error pages (404/500), and skeleton-loading placeholders.
- Pagination component exact styling (only the "Showing X of Y + arrows" text pattern is known).
- Calendar day-cell states (has-events, selected, range, past/disabled).

**Values to confirm from Figma / design**
- Exact hex for: success action buttons (Export Excel / WhatsApp green), `.notice--info` / `info-surface` blue, lead-stage dropdown surfaces (New / Contacted / Booked / Lost), "Approved" property badge greens, overdue red, "Girls Only" / "Co-ed" audience pill colours.
- Modal overlay/backdrop opacity (`--overlay-backdrop` is a working default).
- Expanded sidebar exact width (204px is inferred) and which sidebar treatment (navy vs light) is canonical.
- Heading letter-spacing (only display / table-head / micro are confirmed).
- Icon set / library name and any sizes beyond 14/16/20/24.
- Avatar size scale and the initials background-colour logic.
- Dark mode — no dark tokens exist; only `…/Light` neutrals.

**Layout**
- Formal column grid (if one is wanted) vs. the ad-hoc `repeat(n,1fr)` patterns documented in §4.3.
- Whether KPI rows are 4 or 5 columns by default (both appear).
