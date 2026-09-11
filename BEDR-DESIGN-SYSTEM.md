# BEDR / ManagR — Design System (Source of Truth)

Reverse-engineered from the existing BEDR web app Figma frames (file `PhBtU2UVlsHO8ZaeFzZnAX`).
Frames studied: Dashboard, Properties (Buildings), Leads & CRM, BedR Leads, Scheduled Visits (calendar), Add Visit modal, Settings, Property Detail.

**Rules honoured in this document**
- Nothing is redesigned. Every value below is read directly from the Figma frames (via bound variables or inspected CSS).
- Where a value could not be seen in the supplied frames it is explicitly marked **"Not available in current Figma reference."**
- Figma variable names are quoted verbatim (e.g. `Spacing/4 = 16`). Raw hex/px values are the inspected values where no variable was bound.

---

## 0. Brand / typography family

| Property | Value | Source |
|---|---|---|
| Primary typeface | **Plus Jakarta Sans** | every text node in every frame |
| Weights in use | Regular (400), Medium (500), SemiBold (600), Bold (700) | inspected |
| Fallback stack | Not defined in Figma. Recommend `"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | inferred |
| Secondary / display / mono typeface | **Not available in current Figma reference.** | — |

---

## 1. Foundation

### 1.1 Typography scale

All sizes observed, with the role they play in the frames. Sizes are px, line-height is px.

| Token (suggested) | Size / line-height | Weight(s) seen | Letter-spacing | Used for |
|---|---|---|---|---|
| `display` | **24 / 32** | SemiBold 600 | `-0.6px` (≈ -0.025em) | Stat-card metric numbers ("33", "4%") |
| `h1` (page title) | **18 / 32 box** (glyph ~32 tall) | Bold 700 | default | Page headings — "Good morning, Niraj", "Buildings", "Leads & CRM", "Scheduled Visits", "Settings" |
| `h2` (dialog title) | **18 / 18–22.5** | SemiBold 600 / Bold 700 | default | Modal titles ("Add Visit"), "Welcome to Bedr!" |
| `h3` (card title) | **18 / 28** | Bold 700 | default | Property-card name, section cards |
| `section-heading` | **16 / 24** | SemiBold 600 | default | In-modal section headers ("Property Details", "Customer Details", "Visit Schedule") |
| `body` | **14 / 20** | Regular 400 | default | Paragraph/body copy, input values, nav labels |
| `body-medium` | **14 / 20** | Medium 500 | default | Nav item label, secondary button label, tab label, list values |
| `body-strong` | **14 / 20** | SemiBold 600 / Bold 700 | default | Primary/secondary button labels, form labels, emphasised values ("0%") |
| `label` / `caption` | **12 / 16** | Medium 500 / SemiBold 600 | `0` – `0.6px` on table headers | Card sub-labels, table column headers (SemiBold 12, tracking `0.6px`), badge text, helper text |
| `caption-sm` | **12 / 16.5** | Medium 500 | default | Status pill text ("Live" = 11/16.5) |
| `micro` (overline) | **10 / 15** | Medium 500 | `0.25px`, `text-transform: uppercase` | Property-card bed stats ("TOTAL BEDS", "AVAILABLE", "OCCUPIED", "ON HOLD") |
| `pill-11` | **11 / 16.5** | Medium 500 | default | "Live" status chip |

Heading text colour is `#0f172b` (or `#1d293d` for modal section headings). Body colour ranges `#314158`–`#62748e` (see colour tokens).

> Note: Figma reports some heading nodes with `leading-[0]` because the label is a single-line auto-layout text; the effective line-height for those is the span value (20px). Treat h1 as **18px Bold** visually — the "32" is the node box height, not the font size.

---

### 1.2 Colour palette & semantic tokens

#### Brand

| Token | Hex | Figma variable | Notes |
|---|---|---|---|
| `brand/primary` | `#F7553D` | `Colors/Primary/300` | Coral/red — the BEDR primary. Active tab, accent text ("Niraj"), calendar "today" dot, active list-view toggle. |
| `brand/primary-alt` | `#FF5A3D` | — | Split-button active segment fill (Import ▸ list toggle). |
| `brand/primary-strong` | `#EF4444` | — | Solid primary CTA fill ("Add Lead", "Create Visit", "Help", tab underline). |
| `brand/primary-progress` | `#FB2C36` | — | Progress-bar fill at low/zero occupancy. |
| `brand/navy` | `#001737` | — | Active sidebar nav item background. |
| `brand/navy-gradient` | `linear-gradient(90deg, #002F5D → #0F5584)` | — | "Import" button, "Monthly Revenue" hero card, dark banners. |
| `brand/navy-ink` | `#002F5D` | — | Deep navy used in hero/revenue card. |

#### Neutrals (Slate ramp — matches Tailwind `slate`)

| Token | Hex | Figma variable | Usage |
|---|---|---|---|
| `neutral/0` (white) | `#FFFFFF` | `Colors/Neutral/Card Light`, `Colors/Neutral/Background Light` | Card & page background |
| `neutral/icon-bg` | `#FAFAFA` | `Colors/Neutral/Icon Background` | Icon tile background (some cards) |
| `neutral/50` | `#F8FAFC` | — | Table header row background |
| `neutral/100` | `#F1F5F9` | — | Progress-bar track, divider borders, tab divider, modal header/footer border |
| `neutral/150` | `#E5E5E5` | — | Table cell bottom border, "AI Report" button border |
| `neutral/200` | `#E2E8F0` | — | **Default component border** (inputs, cards, buttons, dropdowns) — rendered at `0.8px` |
| `neutral/300` | `#CAD5E2` | — | **Not explicitly seen; reserve.** |
| `neutral/400` | `#90A1B9` | — | Placeholder-adjacent text, micro labels, disabled-ish text, dropdown chevron |
| `neutral/500` | `#62748E` | — | Secondary body text, inactive tab, muted labels |
| `neutral/600` | `#45556C` | — | Card labels, "Refresh" text, Cancel-button text |
| `neutral/700` | `#314158` | — | Form labels, "Filters" text, radio/checkbox label text |
| `neutral/800` | `#1D293D` | — | Modal section headings |
| `neutral/900` | `#0F172B` | — | Primary headings, metric numbers, strong values |
| `neutral/ink` | `#0A0A0A` | — | "AI Report" label; `rgba(10,10,10,0.5)` = input placeholder |
| `neutral/input-border` | `#767676` | `Stroke/1 = 1px` | Checkbox / radio unselected border |

#### Semantic — Success (green)

| Token | Hex | Usage |
|---|---|---|
| `success/text` | `#009966` (`#096`) | "Live" chip text, positive values |
| `success/solid` | `#00BC7D` | "Live" pulse dot (@ 50% opacity), confirmed states |
| `success/surface` | `#ECFDF5` | "Live" chip background, success banners |
| `success/border` | `#A4F4CF` | "Live" chip border |
| `success/action` | green solid (Export Excel, WhatsApp buttons) — **exact hex not inspected; approximate `#059669` / `#16A34A`.** Mark **partially available.** |

#### Semantic — Warning / Amber

| Token | Hex | Usage |
|---|---|---|
| `warning/text` | `#BB4D00` | "Pending" property badge text |
| `warning/surface` | `#FFFBEB` | "Pending" badge background |
| `warning/border` | `#FEE685` | "Pending" badge border |
| `warning/accent` | `#FF6900` | "Start Setup" CTA fill (orange) |
| `warning/glow` | `#FFD6A7` | Colored drop-shadow on the orange CTA |
| `warning/banner-surface` | `rgba(255,247,237,0.5)` (amber-50 @ 50%) | "Welcome to Bedr!" banner background |
| `warning/banner-border` | `#FFEDD4` | Welcome banner border + icon-tile fill |

#### Semantic — Info / Blue

| Token | Hex | Usage |
|---|---|---|
| `info/solid` | `#155DFC` | "Boys Only" badge fill |
| `info/selected` | `#0075FF` | Selected radio button ring |
| `info/surface` | `#DBEAFE` (approx, from "New" status dropdown) | Status pill surface — **approximate, confirm.** |
| `info/chart` | `#155DFC` | Donut / lead-source chart primary segment |

#### Semantic — Purple

| Token | Hex | Usage |
|---|---|---|
| `accent/purple-text` | `#8200DB` | "PG" property-type badge text |
| `accent/purple-border` | `rgba(243,232,255,0.5)` | "PG" badge border |
| `accent/purple-chart` | `#AD46FF` / `#8200DB` | Conversion-funnel gradient |

#### Semantic — Danger / Error

| Token | Hex | Usage |
|---|---|---|
| `danger/required` | `#E7000B` | Required-field asterisk `*` in forms |
| `danger/overdue` | `#C10007` (approx) | "OVERDUE ₹1.9L" figure — **approximate.** |
| `danger/solid` | `#EF4444` / `#FB2C36` | Destructive actions ("Delete Property"), 0% progress fill |

#### Status-dropdown colour map (Leads table — inferred from swatches, verify exact hex)

| Status | Surface / text |
|---|---|
| New | blue surface / blue text |
| Contacted | amber surface / amber text |
| Booked | green surface / green text |
| Lost | red/grey surface |
Priority pills: **Low** = green, **Medium** = amber, **High** = red (only Low/Medium visible in frames).

---

### 1.3 Spacing scale

Bound Figma variables (`Spacing/*`) — this is the canonical scale:

| Variable | Value |
|---|---|
| `Spacing/0` | **4px** |
| `Spacing/1` | **8px** |
| `Spacing/2` | **10px** |
| `Spacing/3` | **12px** |
| `Spacing/4` | **16px** |
| `Spacing/5` | **20px** |
| `Spacing/6` | **24px** |
| `Spacing/8` | **40px** |
| `Spacing/10` | **64px** |

`Spacing/7` (≈28/32) and `Spacing/9` (≈48/56) were **not observed** — do not assume they exist; `Spacing/10 = 64`.

Common applications seen:
- Icon ↔ label gap inside buttons/nav: `Spacing/1` (8) or `6px` (small buttons).
- Card internal padding: `Spacing/4` (16).
- Section / dialog padding: `Spacing/6` (24).
- Grid gaps between cards: `Spacing/4` (16) primary; `Spacing/1` (8) for tight stat grids.
- Vertical rhythm between modal sections: `Spacing/6` (24) top padding.
- Button padding: `16px` horizontal / `10px` vertical (primary), `12px` / `8px` (compact).

---

### 1.4 Border-radius system

Bound Figma variables:

| Variable | Value |
|---|---|
| `Radius/1` | **4px** |
| `Radius/2` | **8px** |

Observed radii in components (many are raw values, not bound to the two variables above):

| Radius | Where |
|---|---|
| `2px` | Checkbox |
| `4px` (`Radius/1`) | Small inset elements |
| `8px` (`Radius/2`) | Radio button, "AI Report" button, small icon usage |
| `10px` | **Default control radius** — buttons, inputs, dropdowns, text areas, tab-less pill buttons, icon tiles inside stat cards, nav items |
| `14px` | Cards (stat cards), "Start Setup" CTA |
| `18px` | Modals/dialogs, the welcome banner, large icon tiles (48px) |
| `26843500px` (i.e. `9999px` / fully round) | Pills, badges, status chips, progress-bar track & fill, avatar, circular icon buttons, pulse dots |

> Recommendation for the token set: `radius/xs 2`, `radius/sm 4`, `radius/md 8`, `radius/lg 10` (controls), `radius/xl 14` (cards), `radius/2xl 18` (modals), `radius/full 9999`.

---

### 1.5 Border / stroke system

| Token | Value | Notes |
|---|---|---|
| `Stroke/1` | **1px** (Figma variable) | Nominal stroke unit; used on checkbox/radio (`#767676`). |
| Default control border | **0.8px solid `#E2E8F0`** | Inputs, dropdowns, cards, secondary buttons, badges. The `0.8px` (not 1px) is deliberate and consistent across the file. |
| Table cell divider | **0.8px solid `#E5E5E5`** bottom only | Table header + body rows. |
| Divider / hairline | **0.8px solid `#F1F5F9`** | Tab-bar underline track, modal header/footer separators, list separators. |
| Active tab underline | **1.6px solid `#EF4444`** bottom | Selected tab. |
| Inactive tab underline | **1.6px solid `transparent`** | Keeps layout stable. |
| Badge borders | **0.8px solid**, colour-matched to surface (e.g. `#FEE685` on amber, `#A4F4CF` on green, `rgba(243,232,255,0.5)` on purple). |
| Selected radio ring | **1px solid `#0075FF`** | Inner 10px dot. |
| Unselected radio/checkbox | **1px solid `#767676`** on white fill. |
| Dropdown chevron | 8px box, `1.6px` solid `#90A1B9` bottom+right, rotated 45°. |

---

### 1.6 Shadow styles

All shadows observed (Figma → CSS):

| Token | Value | Where |
|---|---|---|
| `shadow/xs` | `0px 1px 1px rgba(0,0,0,0.05)` | "AI Report" button |
| `shadow/sm` | `0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)` (drop-shadow) | Primary & secondary buttons, badges, stat cards |
| `shadow/card` | `0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)` | Welcome banner, property-type badge chip |
| `shadow/nav-active` | `0px 4px 3px rgba(0,0,0,0.1), 0px 2px 2px rgba(0,0,0,0.1)` | Active sidebar nav item |
| `shadow/modal` | `0px 25px 50px -12px rgba(0,0,0,0.25)` | Dialogs / modals |
| `shadow/inset` | `inset 0px 2px 4px rgba(0,0,0,0.05)` | Inside the welcome-banner icon tile |
| `glow/orange` | `0px 10px 7.5px #FFD6A7, 0px 4px 3px #FFD6A7` | "Start Setup" orange CTA |
| Backdrop blur | `blur(8px)` – `blur(12px)` | Glass badges & the circular "property menu" button on property-card images |

---

### 1.7 Breakpoints

**Not available in current Figma reference.** All supplied frames are a single desktop width of **1536px** (frame width), with the main content column at **1464px** (1536 − 72px collapsed sidebar) and page gutter **24px** each side. No tablet or mobile frames were provided, and no responsive variables exist in the file.

Inferred desktop layout constants only (see §3).

---

## 2. Components

Font is Plus Jakarta Sans everywhere; only deviations are called out.

### 2.1 Buttons

| Variant | Fill | Text | Border | Radius | Padding | Height | Icon | Shadow |
|---|---|---|---|---|---|---|---|---|
| **Primary (red)** | `#EF4444` | white, SemiBold/Bold 14/20 | none | `10px` | `16px` × `10px` (`Spacing/4`×`Spacing/2`); modal uses `16`×`8` | ~40px | 16px, leading, gap 8 | `shadow/sm` |
| **Primary (orange CTA)** | `#FF6900` | white, Bold 14/20 | none | `14px` | `24px` × `10px` | 40px | 14px trailing, gap 6 | `glow/orange` |
| **Secondary / navy** | `linear-gradient(90deg,#002F5D→#0F5584)` | white, SemiBold 14/20 | none | `10px` | `16px` × `10px` | 40px | 16px, gap 8 | `shadow/sm` |
| **Outline / default** | white | `#314158` (or `#45556C`), Medium/Bold 14/20 | `0.8px #E2E8F0` | `10px` | `16px`×`8px` or `12px`×0 (h-locked 38) | 38–40px | 14px, gap 6 | `shadow/sm` |
| **Ghost small ("AI Report")** | white | `#0A0A0A`, Medium 14/20 | `0.8px #E5E5E5` | `8px` | `10px` horizontal, h-locked | 32px | 16px, gap 6 | `shadow/xs` |
| **Compact chip ("Refresh")** | white | `#45556C`, SemiBold 12/16 | `0.8px #E2E8F0` | `10px` | `16px`×`8px` | — | 14px, gap 6 | `shadow/sm` |
| **Icon button (circular)** | white / `rgba(255,255,255,0.9)` + backdrop-blur | — | none or `0.8px` | `full` | `4px` | 32–36px | 16–20px | — |
| **Split button** | container white, `0.8px #E2E8F0`, radius `10px`, `overflow:clip`; active segment `#FF5A3D`, inactive white; segments divided by `0.8px #E2E8F0` left border | — | — | `10px` (outer) | segment `12px` horizontal | 38–40px | 16px | — |
| **Cancel (modal)** | white | `#45556C`, Bold 14/20 | `0.8px #E2E8F0` | `10px` | `16px`×`8px` | — | — | — |

States:
- **Default:** as above.
- **Selected/active** (split button, toggles): fill switches to `#FF5A3D` / `#F7553D`, icon/text becomes white.
- **Hover / focus / disabled / loading:** **Not available in current Figma reference** (no interaction states or variants provided). Recommend deriving hover as −4–6% lightness on fill, disabled as 40% opacity, focus ring `2px #0075FF` — flagged as an addition, not from Figma.

### 2.2 Input fields (text, phone, textarea)

- **Structure:** optional label above (SemiBold 14, `#314158`, required `*` in `#E7000B`), then the field; 24px reserved for the label row, field offset `top: 24`.
- **Field box:** white fill, border `0.8px solid #E2E8F0`, radius `10px`, `overflow: clip`.
- **Padding:** `12px` horizontal (`Spacing/3`), `8px` vertical (`Spacing/1`). Search input uses `pl 40px` (`Spacing/8`) to clear the leading icon, `pr 16px`.
- **Height:** `38px` (modal), `37.6px` (search) — treat as **38px**.
- **Placeholder text:** Regular 14, `rgba(10,10,10,0.5)`; some placeholders `#90A1B9`.
- **Value text:** Regular 14, `#0A0A0A` / `#0F172B`.
- **Leading icon** (search): 16px, positioned `left: 12`, vertically centred.
- **Textarea:** same box, height `78px`, top-aligned content, placeholder "Add any notes…".
- **States:** default only. Focus/error/disabled/filled = **Not available in current Figma reference.** (Only the required-asterisk affordance exists.)

### 2.3 Dropdowns / selects

- Box identical to input: white, `0.8px #E2E8F0`, radius `10px`, `12px`×`8px`, height `38px`.
- **Chevron:** 8px square, `1.6px solid #90A1B9` on bottom+right edges, rotated 45°, positioned ~`right: 12`.
- Placeholder ("Select property") Regular 14 `#90A1B9`, may be centre-aligned in a fixed text box.
- Full-width variants span the dialog content width (e.g. 624px / "Dialed By", "Duration of Stay").
- Open/menu/option styling, hover, selected-checkmark: **Not available in current Figma reference.**

### 2.4 Cards (generic surface)

- **Fill:** white (`Colors/Neutral/Card Light`).
- **Border:** `0.8px solid #E2E8F0`.
- **Radius:** `14px` (stat/summary cards). Large content cards on the dashboard appear at the same `14px`; property cards ≈ `14–16px` (wrapper radius not directly inspected — **treat as `14px`, part of the card system**).
- **Shadow:** `shadow/sm` (`0 1px 1.5px + 0 1px 1px` rgba .1).
- **Padding:** `16px` (`Spacing/4`) default; dashboard chart cards use `20–24px`.
- **Optional tint overlay:** stat cards carry a diagonal gradient wash keyed to the card's accent colour, e.g. `linear-gradient(152deg, rgba(98,116,142,0.12) 0%, rgba(98,116,142,0.06) 50%, rgba(98,116,142,0) 100%)` (grey example; blue/green/amber/purple variants exist).

**Stat / KPI card** (Total Buildings, Occupancy Rate, Total Visits, etc.):
- Layout: metric number top-left, icon tile top-right, label bottom-left.
- Metric: SemiBold **24 / 32**, `#0F172B`, tracking `-0.6px`.
- Icon tile: **36px** square, radius `10px`, fill = accent @ ~20% opacity (`rgba(98,116,142,0.2)` grey example), icon **20px** centred.
- Label: Medium **12 / 16**, `#45556C` (some `#314158`).
- Height ≈ 92px.
- Colour families seen: grey/slate, green, red/pink, blue, purple, amber — one per card, applied to gradient wash + icon tile.

**Section card with header** (Amenities, PG Rules, Booking Config, Occupancy Map, Action Items, Lead Sources…):
- Header row: leading icon (often coral) + title Bold 16–18 + optional right-aligned link ("View all", "Edit") in `#F7553D`.
- Body: chips, lists, or charts. Padding `16–24px`.

### 2.5 Property card

- **Wrapper:** white card, `0.8px #E2E8F0`, radius ~`14px`, `shadow/sm`. Column layout: image header → body.
- **Image header:** fixed height **224px**, full-bleed; bottom gradient scrim `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)` at 80% opacity for legibility. Placeholder = `#E2E8F0` block with image-off icon when no photo.
- **On-image chips (top):**
  - **Property-type badge** (top-left, `12px` inset): glass — `rgba(255,255,255,0.95)` + `backdrop-blur(12px)`, border `0.8px rgba(243,232,255,0.5)`, radius `full`, `12px`×`4px`, `shadow/card`. Icon 14px + label Bold **12 / 16**. "PG" text `#8200DB`; "Flat" / "Hostel" use their own accent (purple family observed).
  - **Property-menu button** (top-right): 32px circle, `rgba(255,255,255,0.9)` + `backdrop-blur(8px)`, 16px kebab icon.
- **On-image chips (bottom-left, `top: ~187`):** status + audience pills, gap 8:
  - **Status pill** ("Pending" / "Approved" / "Reupload"): `backdrop-blur(12px)`, radius `full`, `10px`×`4px` (`Spacing/2`×`Spacing/0`), `0.8px` border, SemiBold **12 / 16**, `drop-shadow shadow/sm`.
    - Pending: bg `#FFFBEB`, border `#FEE685`, text `#BB4D00`.
    - Approved: green family (surface/border/text) — exact hex **not inspected**, follows success tokens.
  - **Audience pill** ("Boys Only" / "Girls Only" / "Co-ed"): `#155DFC` fill, white SemiBold **12 / 16**, radius `full`, `10px`×`4px`, `shadow/sm`.
- **Body:** padding `16px`, stacked blocks separated by `pb 20 / 16`:
  1. **Title** — Bold **18 / 28**, `#0F172B`. Then location row: 14px pin icon + Medium **14 / 20** `#62748E`, gap 4.
  2. **Bed-stat quad** — 4-col grid, gap 8, each cell centre-aligned: 20px icon → value Bold **16 / 16** `#0F172B` → label Medium **10 / 15** `#90A1B9`, `uppercase`, tracking `0.25px`. Labels: TOTAL BEDS / AVAILABLE / OCCUPIED / ON HOLD (or BLOCKED).
  3. **Occupancy row** — "Occupancy" Medium **14 / 20** `#62748E` on the left; on the right "Occupied" Medium **12** `#90A1B9` + `NN%` Bold **14 / 20** `#0F172B`.
  4. **Progress bar** — track `#F1F5F9`, height **8px**, radius `full`; fill radius `full`, colour by occupancy: red `#FB2C36` at 0–low, blue mid, green `#00BC7D`-family high (green/red split visible on "TestRoom" 50%).
- **Compact / flat-listing variant:** replaces bed-stat quad with a mini key-value table (NAME / STATUS / VIEWS rows), STATUS shows a red "• Vacant".
- **States:** default only. Hover/selected = **Not available in current Figma reference** (though a hover elevation is implied by the card shadow).

### 2.6 Tabs

Two tab patterns exist:

**A. Underline tabs** (Leads status filter: All / New / Contacted / Visit Scheduled / Booking Request / Booked / Lost):
- Container: `flex`, gap **24px** (`Spacing/6`), `px 16`, bottom border `0.8px #F1F5F9`.
- Each tab: `flex-col`, centre, `py 12px` (`Spacing/3`), bottom border `1.6px`.
- **Active:** border `#EF4444`, text `#EF4444`, Medium **14 / 20**.
- **Inactive:** border `transparent`, text `#62748E`, Medium **14 / 20**.
- Optional count badge appears after label ("Requests 3" style) — small superscript number.

**B. Pill / segmented tabs** (Property detail: Overview / Rooms & Beds / Leads / Tenants / Rent Collection / Charges / Electricity / Bank Account; Settings sub-nav):
- Row of text buttons with a leading icon; **active** = coral text `#F7553D` + coral underline; **inactive** = `#62748E`. Same underline mechanic as A. (Settings tabs additionally show a small green ✓ or a red "REQUIRED" badge per tab.)

### 2.7 Pills / badges / chips

Shared spec: radius `full`, border `0.8px` (colour-matched), text **12 / 16** SemiBold (or **11** Medium for the smallest), padding `10px`×`4px` (`Spacing/2`×`Spacing/0`) or `12px`×`4px`.

| Chip | Surface | Border | Text | Extra |
|---|---|---|---|---|
| Status "Live" | `#ECFDF5` | `#A4F4CF` | `#009966`, Medium 11/16.5 | 6px `#00BC7D` dot @ 50% opacity, gap 6 |
| Property type "PG" | `rgba(255,255,255,0.95)` | `rgba(243,232,255,0.5)` | `#8200DB`, Bold 12/16 | 14px icon, `backdrop-blur(12px)`, `shadow/card` |
| Status "Pending" | `#FFFBEB` | `#FEE685` | `#BB4D00`, SemiBold 12/16 | `backdrop-blur(12px)` on image |
| Audience "Boys Only" | `#155DFC` | none | white, SemiBold 12/16 | solid |
| Priority "Medium" | amber surface | — | amber text | table cell |
| Priority "Low" | green surface | — | green text | table cell |
| Lead-stage dropdown ("New", "Contacted", "Booked") | tinted surface per stage | — | tinted text | trailing chevron; acts as a select |
| "REQUIRED" (settings tab) | red/coral surface | — | white/red | tiny |
| Setup progress "SETUP 2/3" | pill with inline progress track (`#EF4444` fill on light track) + chevron | — | uppercase micro label | header widget |
| Count badge (nav "Settings 2/3", "Requests 3") | small solid coral/orange circle-ish pill | — | white 10–12 | — |

### 2.8 Navigation

**Sidebar (primary nav):**
- **Collapsed rail width:** `72px` (from frame structure). Expanded width ≈ `204px` (inferred from Dashboard frame; not a bound variable).
- Rail background: **dark navy** (`#001737`/near-black) in the collapsed state; expanded panel appears white with dark items on the Dashboard frame — both states exist in the file.
- **Nav item:** `flex`, gap **12px** (`Spacing/3`), `px 16` `py 12` (`Spacing/4` / `Spacing/3`), radius `10px`, icon **20px**, label Medium **14 / 20**.
  - **Active:** background `#001737`, white text/icon, `shadow/nav-active`.
  - **Inactive:** transparent background, muted text (white @ lower opacity on dark rail; `#62748E`-ish on light panel).
- **"Collapse" control** at the bottom of the expanded panel (chevron + "Collapse" label). A `16px` toggle strip sits on the rail's right edge.
- Item list (Dashboard frame): Dashboard, Properties, Leads & CRM, BedR Leads, Scheduled Visits, Tenants, Add Tenant, Payments, E-Stamp & E-Sign, Reports, Team Management, Settings.
- Bottom "＋" FAB-style button (48×36, coral) on the collapsed rail.

**Top header bar:**
- Height **64.8px** (`≈64px`), white, hairline bottom border.
- Left: **"All Properties" selector** — outline button, `0.8px #E2E8F0`, radius `10px`, leading building icon + label Medium 14 + trailing chevron; `padding ~16`, height 36.
- Right cluster (gap **12px**): "SETUP 2/3" progress pill → avatar (`NR`, 32–36px circle, `#FFE… ` tinted, initials) → "Tour" ghost button (with ▶ icon) → "Help" primary-red button.
- Page-level secondary controls sit just below the header inside Main Content, right-aligned (e.g. "Visit Availability" outline, "Export Excel" green, "Add Visit" red).

**Breadcrumb** (Property detail): `Home › Properties › shlok pg`, 12–14px, `#62748E`, current in `#F7553D`, chevron separators.

### 2.9 Tables

(Leads & CRM table is the reference.)
- **Layout:** CSS grid; column widths fixed per content (e.g. `48 / 182 / 164 / 138 / 157 / 153 / 129 / 153 / 290` px). First column = 48px checkbox.
- **Header row:** height **53.2px**, background `#F8FAFC`, bottom border `0.8px #E5E5E5`. Header label SemiBold **12 / 16**, `#62748E`, tracking `0.6px` (effectively uppercase-ish letter-spacing; text is Title Case in-file). Cell padding: `24px`×`16px` (`Spacing/6`×`Spacing/4`); checkbox cell `16px` all round.
- **Body row:** height **72.8px**, bottom border `0.8px #E5E5E5`, white; alternating/hover tint (a faint amber `#FFF…` highlight on one row is visible — likely hover/selected state). Cell padding `24`×`16`.
- **Cell content patterns:**
  - Primary + secondary stacked text (e.g. "assa sdd" Medium 14 `#0F172B` / "LD-70" 12 `#90A1B9`).
  - Source & status shown as pills (see §2.7).
  - Priority as pill.
  - Date as plain 14 `#62748E`.
  - **Actions** column: status dropdown pill + edit (pencil) + delete (trash) icon buttons, 16px icons.
- **Checkbox:** 16px, white fill, `1px #767676` border, radius `2px`.
- **Empty state:** "No visits scheduled for today" centred grey text (see §2.11).
- **Pagination:** "Showing 1–10 of 14" + a page-size select + `‹ 1/2 ›` arrows, bottom of list, 12px `#90A1B9`.
- Sort control: "Sort [Newest ▾]" — label + small select.

### 2.10 Modals / Sheets / Dialogs

(Add Visit modal is the reference.)
- **Container:** white, radius **18px**, `overflow: clip`, shadow `0px 25px 50px -12px rgba(0,0,0,0.25)`. Width **672px** (content area 624px). Vertically it's a fixed-header / scroll-body / fixed-footer layout.
- **Header (sticky):** `px 24` `py 16`, bottom border `0.8px #F1F5F9`. Title SemiBold **18 / 18**, `#0F172B`; subtitle Regular **12 / 16**, `#62748E` (`pt 4`). Close button: `4px` padding, radius `full`, 20px icon, top-right.
- **Body:** padding **24px** (`Spacing/6`). Organised into sections; each section = heading (SemiBold **16 / 24**, `#1D293D`) then fields with **`pt 24`** separating sections and **`pt 16`** between the heading and its first field.
- **Field grids inside modal:** 2-column (`304px 304px`, gap `16px`) for paired fields; 3-column (`~197px ×3`, gap 16) for date/time; full-width (624px) for single selects.
- **Footer (sticky, right-aligned):** `px 24` `py 16`, top border `0.8px #F1F5F9`, gap **12px**, `justify-end`. Order: **Cancel** (outline) then **primary** (`#EF4444`, "Create Visit"). Both Bold 14/20, radius 10, `16`×`8` padding.
- **Radio group** (e.g. "Property Type" → "Select from list" / "Enter custom name"): 16px control, radius `8px`, unselected border `1px #767676`; selected = `1px #0075FF` ring + 10px inner dot; label Regular **14 / 20** `#314158`, gap 8, options gap `16px`.
- **Backdrop / overlay:** dimmed page behind (scrim visible in frame); exact overlay opacity **not inspected** — recommend `rgba(15,23,43,0.5)` or `rgba(0,0,0,0.4)`.
- **Bottom-sheet / side-drawer variant:** **Not available in current Figma reference** (only the centred dialog was provided).

### 2.11 Empty states

- **In-panel empty** (Action Items → "No visits scheduled for today"; Leads → within a card): single line of centred text, Regular/Medium **14**, `#62748E`/`#90A1B9`, large vertical padding inside the card. No illustration or CTA shown in the provided frames.
- **List-level empty** (BedR Leads "Available Leads (0)"): tab shows a `(0)` count; body content for the zero state itself is **not available in current Figma reference**.
- **Image-missing state** (property cards / room photos): light `#E2E8F0` block with a centred "image-off" line icon.
- Dedicated full-page empty states with illustration + heading + CTA: **Not available in current Figma reference.**

### 2.12 Badges (numeric / status indicators) — see also §2.7

- **Count badge on nav / tabs:** small solid pill, coral/orange fill, white text 10–12, e.g. "2/3", "3".
- **Progress badge:** "SETUP 2/3" and "Setup: 2/3" appear both as a header pill (with mini bar) and as a full-width dark banner (`#001737`/navy gradient, white text, thin `#EF4444` progress line, `px 24` `py 16`, radius inherited from card).
- **KYC / review badge:** "Under Review" amber pill inside the Settings KYC card; "Manual Upload Under Review" amber notice strip (`#FFFBEB` surface).
- **Metric-delta text:** e.g. "↘ -100.0%" in red, "50.0% rate" in a small pill — inline, 12px.

---

## 3. Layout rules

### 3.1 Shell

| Element | Value | Source |
|---|---|---|
| Frame / viewport width | **1536px** | all frames |
| Collapsed sidebar rail | **72px** | frame structure |
| Expanded sidebar | ≈ **204px** | inferred (Dashboard frame) |
| Top header height | **64.8px** (`≈64`) | frame structure |
| Main content width (collapsed sidebar) | **1464px** (1536 − 72) | frame structure |
| Page gutter (left/right of content) | **24px** (`Spacing/6`) | frames |
| Content top padding | **20–24px** | frames |
| Inner content max width | content column is fluid; inner containers observed at **1416px** / **1232px** / **1216px** (i.e. content width minus 24px gutters, sometimes minus an extra ~16px) | frames |

### 3.2 Grid

- **No formal column grid / variable** is defined in the file. **"Not available in current Figma reference"** for a canonical 12-col grid.
- Observed card grids:
  - **KPI/stat rows:** 4–5 equal cards in a row, gap **16px** (`Spacing/4`). Dashboard "Portfolio at a glance" = 4 cards; Properties / Property-detail summary = 5 cards.
  - **Property list:** **3 columns**, gap **16px** (auto-fill; cards ≈ 388px wide at 1536).
  - **Dashboard content blocks:** 2-column split (≈ 1fr / 1fr, sometimes 3:2) with gap **16–24px** — e.g. Revenue hero + Occupancy Map; Action Items + Lead Sources; Revenue Trend + Conversion Funnel.
  - **In-modal field grids:** 2-col `304 304` / 3-col `~197×3`, gap **16px**.

### 3.3 Section spacing

- Between stacked full-width sections in Main Content: **24px** (`Spacing/6`) — e.g. header → welcome banner → "Portfolio at a glance" → charts.
- Section label (e.g. "PORTFOLIO AT A GLANCE", "REVENUE & PAYMENTS", "TODAY'S ACTIONS") sits above its card group: uppercase micro label, ~**11–12px**, `#90A1B9`, letter-spacing ~`0.5px`, `margin-bottom ~12px`.
- Inside a card, block-to-block spacing: **16–20px**.
- Modal section-to-section: **24px** top padding.

### 3.4 Card spacing

- Card internal padding: **16px** default (`Spacing/4`); **20–24px** for chart/dashboard cards and modals.
- Gap between sibling cards (row or grid): **16px** (`Spacing/4`).
- Gap between a card's header and body: **12–16px**.
- Chip groups inside cards (amenities, badges): gap **8px** (`Spacing/1`).

### 3.5 Content hierarchy

1. **Page title** (h1, Bold 18, `#0F172B`) + one-line description (Regular 14, `#45556C`/`#62748E`) — top-left of Main Content.
2. **Page actions** — top-right, same row as the title: primary action in red, secondary actions as outline/green buttons, gap 12.
3. **Contextual banner** (setup / welcome) — full width, directly under the title block, when relevant.
4. **KPI strip** — 4–5 stat cards summarising the page.
5. **Primary content** — table, card grid, calendar, or 2-col dashboard blocks.
6. **Filters / search / sort** sit in a bar directly above the primary content (search input left, filter + view-toggle right, result count below).
7. **Section grouping** via uppercase micro labels + card clusters.

Colour signals hierarchy consistently: headings `#0F172B`, primary body `#314158`, secondary `#62748E`, tertiary/muted `#90A1B9`; the coral `#F7553D`/`#EF4444` is reserved for the single most important action and the active-state indicator.

---

## 4. Open items — not available in current Figma reference

- Hover / focus / active / disabled / loading states for buttons, inputs, dropdowns, cards, rows, nav items.
- Focus-ring / accessibility outline spec.
- Dark mode (only "…/Light" neutral variables exist; no dark tokens).
- Tablet & mobile breakpoints and any responsive behaviour.
- Formal column grid / layout-grid variables.
- Toast / snackbar / inline-alert component.
- Tooltip, popover, context-menu, date-picker open state, dropdown-menu open state.
- Bottom sheet / side drawer.
- Full-page empty, error (404/500), and skeleton-loading states.
- Exact hex for: green action buttons (Export Excel / WhatsApp), status-dropdown surfaces (New/Contacted/Booked/Lost), "Approved" property badge, overdue red, info surface.
- Typography letter-spacing for headings and the uppercase section labels (only table-header `0.6px`, micro-label `0.25px`, and display `-0.6px` are confirmed).
- Icon library / icon set name and sizing scale beyond the observed 14 / 16 / 20 / 24 px.
- Avatar sizes beyond ~32–36px; avatar colour logic.
- Chart styling tokens (axis, grid, series colours) — charts are present but not tokenised in the file.

---

## 5. Quick-reference token block (for implementation)

```
/* Type */
--font-family: "Plus Jakarta Sans", system-ui, sans-serif;
--fw-regular: 400; --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;
--text-display: 24px/32px;   /* -0.6px tracking, 600 */
--text-h1: 18px;             /* 700 */
--text-h3: 18px/28px;        /* 700 */
--text-section: 16px/24px;   /* 600 */
--text-body: 14px/20px;      /* 400 / 500 / 600 */
--text-label: 12px/16px;     /* 500 / 600; table header 600 +0.6px */
--text-micro: 10px/15px;     /* 500, uppercase, +0.25px */
--text-pill: 11px/16.5px;    /* 500 */

/* Colour — brand */
--primary: #F7553D; --primary-alt: #FF5A3D; --primary-strong: #EF4444;
--primary-progress: #FB2C36;
--navy: #001737; --navy-ink: #002F5D;
--navy-gradient: linear-gradient(90deg,#002F5D,#0F5584);
--cta-orange: #FF6900; --cta-orange-glow: #FFD6A7;

/* Colour — neutral (slate) */
--white:#FFFFFF; --n-50:#F8FAFC; --n-100:#F1F5F9; --n-150:#E5E5E5;
--n-200:#E2E8F0; --n-400:#90A1B9; --n-500:#62748E; --n-600:#45556C;
--n-700:#314158; --n-800:#1D293D; --n-900:#0F172B; --ink:#0A0A0A;
--placeholder: rgba(10,10,10,0.5);
--control-border-color:#E2E8F0; --control-border-width:0.8px;
--field-border-color:#767676; /* checkbox/radio */

/* Colour — semantic */
--success-text:#009966; --success-solid:#00BC7D; --success-surface:#ECFDF5; --success-border:#A4F4CF;
--warning-text:#BB4D00; --warning-surface:#FFFBEB; --warning-border:#FEE685;
--info-solid:#155DFC; --info-selected:#0075FF;
--purple-text:#8200DB;
--danger-required:#E7000B; --danger-solid:#EF4444;
--banner-amber-surface: rgba(255,247,237,0.5); --banner-amber-border:#FFEDD4;

/* Spacing (Figma Spacing/*) */
--sp-0:4px; --sp-1:8px; --sp-2:10px; --sp-3:12px; --sp-4:16px;
--sp-5:20px; --sp-6:24px; --sp-8:40px; --sp-10:64px;

/* Radius */
--r-xs:2px; --r-sm:4px; --r-md:8px; --r-lg:10px; --r-xl:14px; --r-2xl:18px; --r-full:9999px;

/* Elevation */
--shadow-xs: 0 1px 1px rgba(0,0,0,.05);
--shadow-sm: 0 1px 1.5px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.1);
--shadow-card: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
--shadow-nav-active: 0 4px 3px rgba(0,0,0,.1), 0 2px 2px rgba(0,0,0,.1);
--shadow-modal: 0 25px 50px -12px rgba(0,0,0,.25);

/* Shell */
--sidebar-collapsed: 72px; --header-h: 64px; --page-gutter: 24px;
--card-gap: 16px; --section-gap: 24px;
```
