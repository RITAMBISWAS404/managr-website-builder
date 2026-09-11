# ManagR Website Builder — Product Architecture

The UX architecture. **Unchanged by the React migration** — this document still
describes the product exactly. It was first proven in a low-fi HTML prototype
(now in `legacy/`); the implementation is now a React/TypeScript/Vite/Tailwind/shadcn
app. For the code architecture see **`TECH-STACK.md`**.

Read alongside `BUILDER-lowfi-notes.md` (edge-case log + open questions) and
`BUILDER-UX-QA.md` (the sign-off QA).

---

## 0. One-paragraph mental model

ManagR is the operating system for a PG/hostel business. The **Website Builder** is a
constrained no-code layer that turns the data the owner already keeps (properties, rooms,
photos, availability, visits, leads) into a public website on a permanent address. The
builder feels like a modern design tool — persistent workspace, layers, inspector, pages,
assets, preview, deliberate publishing — but every action is bounded so the owner **cannot
break the site, expose a tenant, or contradict operational data.** Presentation is editable;
truth comes from ManagR.

---

## 1. Information architecture

```
ManagR shell (unchanged: sidebar + top bar)
│
└─ WEBSITE  (own sidebar section; was buried in Settings)
   │
   ├─ Website Home ............ status · URL · plan · health · attention · activity · metrics · shortcuts
   │                            (pre-setup: shows the switch-on flow instead)
   │
   ├─ Editor (workspace) ...... the primary surface. Almost everything is reachable here
   │   ├─ Left panel modes: Layers · Pages · Add · Assets
   │   ├─ Canvas: device-framed live draft preview (Desktop / Tablet / Mobile)
   │   ├─ Inspector: section (Content / Layout / Data / Visibility) | page | page-overview+checklist
   │   ├─ In-editor overlays: Theme & Brand · Templates · Site settings · Responsive check
   │   │                       · Publish check · Version history · Command menu · Onboarding
   │   └─ Status bar: page summary · responsive status · ⌘K
   │
   ├─ Live availability ....... Flow D config (also linked from Properties section inspector)
   ├─ Visit settings .......... Flow E config (also linked from Visit Booking section inspector)
   ├─ Enquiries .............. inbox mirror of Website leads + form config
   ├─ Booking requests ....... inbox + rules + date-recovery
   ├─ Analytics .............. plain-language "what your site did for you"
   └─ Plan & billing ......... plan state, capability matrix, upgrade / reactivate

Visitor site (separate render) ... Home / About / Gallery / FAQ / Contact / Property detail
   reachable from: Website Home "View live" · Editor "Preview" (draft) · Version history "Preview this version"
```

**Principle:** not one screen per requirement. The editor holds every section's settings;
one availability area holds all of Flow D; one visit area holds all of Flow E. Config that
is operationally distinct (availability, visits, plan) stays a focused surface but is
**deep-linked from the editor as an overlay**, so the owner rarely feels they left the builder.

---

## 2. Editor architecture

### 2.1 Desktop
```
┌───────────────────────────────────────────────────────────────────────────┐
│ ≡ ManagR   Shree Residency ▸ Home ▾    ● Saved · 2s ago   ↺ ↻   ▷ Preview   Publish ▾ │
├─────┬─────────────────────────────────────────────────────────┬───────────┤
│ M   │  [Desktop | Tablet | Mobile]        Fit ▾   Edit│Preview │ INSPECTOR │
│ O   │ ┌─────────────────────────────────────────────────┐     │           │
│ D   │ │ Header            (global — used on every page)  │     │  Content  │
│ E   │ │ Hero                                    ◄ selected│    │  Layout   │
│ S   │ │ Properties                                       │     │  Data     │
│     │ │ …                                               │     │  Visibility│
│ ▤◇+◈│ │ Footer            (global)                       │     │           │
│     │ └─────────────────────────────────────────────────┘     │           │
├─────┴─────────────────────────────────────────────────────────┴───────────┤
│ Home · 8 sections · ⚠ 2 warnings      Responsive ✓      ⌘K quick actions   │
└───────────────────────────────────────────────────────────────────────────┘
```
- **Top bar** — identity + navigation (page selector), live save status, undo/redo, Preview,
  Publish split button (Publish · Check site · Version history · Preview live).
- **Left panel** — one panel, four modes via a thin rail: **Layers** (default), **Pages**,
  **Add section**, **Assets**.
- **Canvas** — the actual draft site rendered in a device frame. Device switcher +
  Edit/Preview toggle. Edit mode shows section chrome (hover outline, click-to-select,
  inline ↑ ↓ 👁 toolbar); Preview mode is chrome-free.
- **Inspector** — context sensitive:
  - section selected → tabbed **Content · Layout · Data · Visibility** (Advanced tab only if the section has advanced options)
  - page selected (via Pages) → page settings
  - nothing selected → **page overview**: section list + the page's slice of the readiness checklist
- **Status bar** — page summary, responsive status (links to checker), ⌘K hint.
- **Overlays inside the editor** (never leave the workspace): Theme & Brand, Templates,
  Site settings, Responsive checker, Publish check, Version history, Command menu,
  first-run onboarding, Advanced-lock explainer.

### 2.2 Mobile
Not a shrunk desktop.
```
┌───────────────────────────────┐
│ ‹  Home ▾   ● Saved     ⋯      │  top bar (page selector + more: Assets/Settings/Versions/Health)
├───────────────────────────────┤
│                               │
│   CANVAS (full-width draft)   │  tap a section → select
│                               │
│  ┌─ Hero ─ ↑ ↓ 👁 ⚙ ⋯ ──────┐ │  floating contextual toolbar on selection
├───────────────────────────────┤
│  Sections   Add   Design   ▷ Preview   Publish │  bottom bar
└───────────────────────────────┘
```
- Section settings open **full-screen** with the same Content/Layout/Data/Visibility tabs.
- Reorder = up/down + "move to top/bottom" (drag is unreliable on the target's hardware).
- One overlay layer at a time; every sheet has an explicit back/close and title.
- The **entire workflow is completable on mobile**: onboarding → edit → add → reorder →
  theme → responsive check → preview → publish.

### 2.3 Builder modes (context, not destinations)
`Edit` · `Preview` · `Pages` · `Add` · `Assets` · `Design (Theme/Template)` · `Data (Availability)` ·
`Visits` · `Publish/Check`. Switching mode changes the panel/overlay, not the page.

---

## 3. Page model

Site = ordered list of **pages**. Each page: `{ id, name, slug, kind, home, hidden, inNav, blocks[] }`.

| kind | meaning | editable |
|---|---|---|
| `standard` | Home, About, Gallery, FAQ, Contact — free-form section stack | full |
| `template:property` | the **property detail** layout — one design, rendered per approved property | section arrangement + copy; property data is bound |
| `system` | 404 / offline — auto-generated, minimal controls | tone only |

**Pages panel actions:** add (from a small catalogue: About / Gallery / FAQ / Contact / Blank),
rename, change slug (with the same availability/validation rules as sections that produce URLs),
duplicate, delete (confirm; can't delete Home or the property template), **set as home**,
reorder (drives nav order), toggle **Show in navigation**, toggle **Hidden** (reachable by
direct link only), preview page.

- Home cannot be deleted or hidden.
- Deleting a page in nav → nav link removed, warning if other sections link to it.
- Extra pages (About/Gallery/FAQ/Contact) and the ability to add pages = **Advanced**.
  Basic has Home + the property template only.
- Property template is **not a CMS** — it's one page design that fans out over approved
  properties. Establishes the model for future dynamic pages without building CMS infra.

---

## 4. Section model

Page `blocks[]`. Each block:
```
{
  id, type, hidden,
  global: false | 'header' | 'footer' | 'contact-cta' | 'whatsapp-bar',
  data: { <field>: value },              // owner choices only
  layout: '<variant key>',               // safe layout options for this type
  visibility: { desktop:true, tablet:true, mobile:true },
  overrides: { tablet:{}, mobile:{} }     // limited: layout, align, textSize, imageFocal, visibility
}
```

### 4.1 Section catalogue (categories for Add)
| Category | Sections |
|---|---|
| Hero | Hero banner |
| Properties | Properties grid, Featured property, Areas covered |
| Trust | Highlights, Trust banner ("Direct from owner"), Reviews |
| Content | About, Rich text, Photo gallery, FAQ |
| Convert | Enquiry form ⓐ, Visit booking ⓐ, Booking request CTA ⓐ, Offer banner |
| Contact | Contact block, WhatsApp bar (global option) |
| Structural | Header ⓖ, Footer ⓖ  (always present, not removable) |

ⓐ Advanced · ⓖ Global

### 4.2 Rules the model enforces
- Structural sections can't be removed; can't be reordered past the ends of the page.
- Single-instance sections (Hero, Properties, Enquiry, Visit booking) — "Add" disabled once present.
- Advanced sections can be **added on any plan** but render a `🔒 Advanced` placeholder in
  the canvas and a lock explainer in the inspector until upgrade. They are never silently deleted.
- Sections that need data they don't have (Reviews with 0 reviews, Gallery with 0 photos)
  render a "needs data" placeholder + inspector guidance + one-tap "Hide for now".
- Depth stops at **section**. A few sections expose shallow safe sub-parts in Layers
  (Hero → Heading / Text / Image / Button) — selecting a sub-part shows only its 2–3 props.
  No arbitrary nesting, no free positioning.

### 4.3 Global / reusable sections
- Header & Footer are stored **once at site level** and referenced by every page.
- Editing a global section shows a persistent banner: *"Used on every page — changes apply everywhere."*
- Optional global sections (Contact CTA, WhatsApp bar): when the owner adds one to a second
  page they're asked *"Add a new one, or use the same one as [page]?"* — "use the same" makes
  it global. The owner concept is **"Used everywhere"**, never "component instance".

---

## 5. Inspector architecture (consistent across all sections)

| Tab | Contains | Example (Hero) |
|---|---|---|
| **Content** | owner-editable copy + choices | headline, sub-line, button label & action |
| **Layout** | safe layout variant + spacing-around-section (Comfortable/Compact/Roomy). Applies to **all screen sizes** | image on top / left / right / background / text only |
| **ManagR data** | every value this section pulls from ManagR, read-only, with "Edit in ManagR →" | background photo source, (none for Hero copy) |
| **Visibility** | show/hide the whole section; **per-screen show/hide** (the one genuinely per-breakpoint control); schedule (offer banner) | show on: ✓desktop ✓tablet ✗mobile |
| **Advanced** *(conditional)* | only if the section has advanced-only options | — |

- Every **bound** field renders as: value (greyed) + `From ManagR` chip + `Edit in ManagR →`.
- Every **owner** field renders editable, with its fallback shown: *"If blank: …"*.
- **Content and Layout are single-value** — they apply on every screen size. A non-technical
  owner never maintains two copies of a headline or two layouts. Only **Visibility**
  (show / hide) is set per screen, and that reads as a plain choice ("hide on phones"),
  not an "override". `overrides` stays in the section model for a future opt-in
  ("customise this section for phones") but is not written in this build.

---

## 6. Data-binding model

Two zones, always visually distinct:

| WEBSITE CONTENT (editable here) | LIVE MANAGR DATA (read-only, "From ManagR") |
|---|---|
| headline, sub-line, about text, FAQ Q&A, highlight labels, offer text, section order, layout choices, theme, nav links, which properties/photos/reviews are featured | property name, area, rent, deposit, room types, sharing types, amenities, house rules, **availability**, property photos, approval status, exact address (never public) |

- The builder **never** writes operational data. A field is exactly one of: owner-editable OR bound.
- No duplicate/conflicting values possible — the model has no field that is both.
- Bound values update live on the published site the moment they change in ManagR;
  they are **not** part of a "publish". The publish summary states this explicitly:
  *"No data changes — rent, rooms and availability always come straight from ManagR."*
- Broken reference handling: a featured property/photo/review that disappears →
  inspector shows *"1 featured item is no longer available — [replace] [remove]"*; the
  public site silently drops it (never a broken card).

---

## 7. Responsive model

- Breakpoints: **Desktop · Tablet · Mobile** (values are a product decision — see §16).
- The canvas device switcher is a **preview aid** — it shows the owner what each screen
  size looks like. It is not an editing context.
- **Content and layout are the same on every screen** (see §5). The cascade the owner
  actually touches is a single axis: **per-screen show/hide** on the Visibility tab.
  Grid column counts still adapt automatically (e.g. a 3-up grid becomes 2-up on a phone) —
  the owner does not set that.
- **Not adjustable at all:** colours, fonts, spacing scale, position — theme-level and global.
- The owner never sees CSS, media queries, pixel values, or the word "override".
- `overrides` remains in the section model for a possible future "customise for phones"
  opt-in; this build does not write it. (Pass-4 simplification — see §22.)

### 7.1 Responsive checker (in-editor overlay)
Scans the current draft for likely problems:
`text overflow · button wider than screen · nav links overflow · image too small for its slot ·
section very tall on mobile · low contrast (theme-derived) · empty section on a breakpoint ·
horizontal scroll`.
Each issue: description · which page/section/breakpoint · **[Jump to]** · **[Fix]** (only
when the fix is safe and obvious, e.g. "stack columns on mobile") · **[Dismiss]**.
Dismissed issues are recoverable. Runs automatically before publish (as warnings).

---

## 8. Theme & Template

### 8.1 Theme = visual personality (site-wide)
`{ accent, secondary, fontPair, radius, cardStyle, buttonStyle, density, imageTreatment }`
Presets: **Clean Modern · Warm Family-run · Premium Co-living** (+ room for more).
Curated overrides only: pick accent from ~6 accessible swatches (each swatch = a full
palette that keeps text readable), font pair from 3, corners from 3. **No hex input, no
colour wheel, no font upload, no CSS.** Themes are structurally equivalent so switching
never breaks content. Apply → confirm modal: *what changes* (colour, type, corners, cards,
spacing) / *what doesn't* (sections, order, content, logo, data).

### 8.2 Template = arrangement (per site, seeds pages)
`{ name, blurb, blocks:[types] }`. Examples: **Property-first** (lean hero → properties →
trust → contact) vs **Brand-first** (big hero → about → highlights → properties → reviews).
Apply → preview → confirm modal listing **sections that will be added / removed**; existing
block *data* is preserved by type where the type survives; removed blocks are recoverable
via undo + version history. Theme and Template are independent axes.

---

## 9. Assets

An **Assets** panel (left-panel mode + mobile overlay). Sources, in priority order:
1. **Property photos from ManagR** — browsed in place, never copied. This is the default
   for hero/gallery/about/property cards.
2. **Website uploads** (Advanced) — logo, favicon, extra gallery images, hero image.

Per asset: preview, name, dimensions, "used in N places". Upload states:
`uploading · done · unsupported format · too large (>N MB) · too small for this use ·
failed — retry`. Reuse an existing asset rather than re-uploading. Missing asset in a
section → placeholder + inspector prompt.

### 9.1 Image quality guardrails (light)
On selecting an image for a slot: *"Looks good"* or *"This image is small / very wide —
it may look blurry or crop oddly here. [Use anyway] [Pick another]"*. Never blocks.

---

## 10. Draft / Preview / Live

Three concepts, never conflated:

| | what it is | who sees it |
|---|---|---|
| **Draft** | your working copy in the editor | you (and teammates with edit access) |
| **Preview** | a render of the **draft**, chrome-free, forms in test mode | you, via a shareable preview link |
| **Live** | the last **published** version | visitors |

- **Autosave** to draft; top-bar indicator: `Saving… · Saved · Offline (saved on this device)`.
- The editor label everywhere reinforces: *"Editing draft — visitors still see your published site."*
- **Preview**: device switch, navigate pages, click visitor CTAs, see availability states.
  Forms show *"Preview — this won't send a real enquiry / booking."* No visitor records created.
- **Publish workflow:** `Edit → autosaved → Check → Preview → Publish`.
  - Publish runs the **site check** (§11). Blockers stop it; warnings don't.
  - **Publish summary** (confirmation): what changed since last publish —
    *"Publishing: 3 section changes · 1 theme change · 2 pages · No data changes."*
    Plus any warnings (*"Availability last updated 8 days ago"*), then `Publish` / `Cancel`.
  - Progress → success (`View live`) or **failure** (categorised, *"Your live site is
    unchanged — nothing was half-published"*, `Retry`).
- **Discard draft** → confirm; current draft is snapshotted to version history first, then
  reset to the live version. Never a silent data-loss.

---

## 11. Site check / readiness (pre-publish + Website Home card)

Three buckets, never alarmist:

| Bucket | Meaning | Publish |
|---|---|---|
| **Blockers** | site would be broken or unsafe for visitors | blocks publish, with jump links |
| **Warnings** | site works but could be better | "Publish anyway" allowed |
| **Ready** | nothing outstanding | — |

Checks (each maps to a jump target):
approved property exists · address claimed · contact number present · hero has a headline ·
≥1 property photo · availability fresh (if shown) · enquiry destination valid ·
visit config valid (if Visit Booking visible) · navigation not empty · no broken section ·
no missing featured item · responsive checker clean · plan permits visible sections.

Home card wording: *"2 things to fix before publishing · 1 optional improvement."*

---

## 12. Version history

`versions[] = { id, kind:'published'|'draft-snapshot', ts, summary, isLive }`
- Shows: **current draft**, **live (published)**, previous published versions, and
  auto-snapshots taken before risky actions (Restore, Discard, Template apply).
- Per version: **Preview this version** (opens visitor preview pinned to it) ·
  **Restore** (*"Restore this version as your draft? Your current draft is saved first.
  Nothing goes live until you publish."*).
- Change summary is human ("Hero + theme", "Added FAQ", "Availability disclosure changed").
- Not a Git tree. Answers *"what did my site look like yesterday"* and *"undo what I just published"*.

---

## 13. Undo / redo

- Scoped to editor content actions: add/remove/hide/reorder section, edit field, change
  layout, change theme, apply template, swap image.
- Each undo shows a toast naming what was undone ("Undid: hide Reviews").
- Does not cross into published state (that's version history) or into other surfaces
  (availability/visit config have their own save model).
- Keyboard: ⌘Z / ⇧⌘Z. History depth ~50.

---

## 14. Advanced / Basic + plan states

`plan: basic | trial | advanced | expiring | payment_failed | lapsed`

| State | Editor behaviour | Home banner |
|---|---|---|
| `basic` | fixed layout (content editable, structure/branding/extra-pages/Advanced-sections locked); consistent lock explainer | "Basic · Free" |
| `trial` | full Advanced; countdown | "Advanced trial · 9 days left" |
| `advanced` | full | (badge only) |
| `expiring` | full; gentle notice | "Advanced renews in 3 days" |
| `payment_failed` | full for a grace period | "Payment failed · Advanced pauses in 5 days · Update payment" (warning) |
| `lapsed` | falls back to Basic: Advanced sections **auto-hidden** (not deleted), branding reverts on **live** (draft keeps it), availability + visit booking paused | "Advanced ended · your site is live on the Basic look · Reactivate" (non-punishing) |

- **Lock treatment** is one component everywhere: *what it does · why it matters · preview
  where sensible · [See Advanced] [Not now]*. Dismissible, never nagging, never a dead end.
- **Nothing is destroyed on lapse.** Sections, pages, theme, copy, visit rules, availability
  config all persist and reactivate instantly on renewal.

---

## 15. Sub-products (kept coherent, not sprawling)

### 15.1 Live inventory (Flow D)
- Route + in-editor overlay. Master toggle → **disclosure level** (Property / Room-type /
  **Bed**) each with an example preview · exact-vs-vague counts · "show free-from date when
  full" · per-property on/off.
- **Privacy firewall** — a permanent panel wherever availability is configured, listing
  exactly what the public site can never show (tenant name/photo/phone/docs · blocked
  reason · exact address · bed↔person). Non-negotiable, enforced by the render layer,
  re-stated in the publish check.
- **Freshness** (thresholds are a product decision, editable, default Fresh ≤3d /
  Slightly-stale 4–10d / Stale >10d → not shown as live + owner warned).
- Bed-level render: a plain room diagram, **available / occupied** only, blocked shown as
  unavailable **without a reason**, never a name.
- States: everything free · partly free · full+date · full+no-date · off · maintenance ·
  temporarily hidden · stale.

### 15.2 Visits (Flow E)
- Owner: which properties accept visits · **weekly picker** (big targets, presets) · slot
  catalogue · blackout dates · buffer · per-slot capacity · minimum notice · booking
  horizon · visit types (in person / video).
- Visitor: 4 short steps (room → date → time → name+phone). Full days greyed with a legend
  (never a wall of "unavailable"). Same-day → one-time code; otherwise booked directly.
  Slot race handled on confirm (*"that time was just taken — nearby times"*).
  WhatsApp-framed confirmation with add-to-calendar / approximate directions / owner
  contact / reschedule / cancel; day-before reminder.
- Scheduled Visits screen: month · day · list; filters; **Source: Website** tag;
  **rationalised status system** (6 semantic states: Pending · Confirmed · Visited ·
  Rescheduled · Cancelled · No-show) replacing the current 11 colours.

### 15.3 Enquiries (Flow F)
- Section config: which fields (Name/Phone locked on) · destination = **Leads & CRM**
  (read-only link) · floating mobile CTA toggle · placement (which sections may host an
  inline form).
- Visitor: inline form + mobile FAB → validate → loading → success (*"owner usually replies
  on WhatsApp within a day"*) → duplicate (*"you already enquired on 3 Sep — send another?"*)
  → error (retry).
- CRM: lead with `source = Website`, visibly distinct from marketplace leads.

### 15.4 Booking requests (Flow F)
- Visitor: room type → move-in date → **availability validation** (§15.1 date logic) →
  submit → awaiting owner. If the date can't be met but an earlier one can → **recovery**,
  not rejection: *"Double sharing is full on 1 Feb. The next bed is free from 2 March.
  [Request for 2 March]"*. Fully full, no date → *"[see other rooms] [send an enquiry]"*.
- Owner: inbox → open → **Approve** (creates a lead, holds the bed) / **Decline** (with a
  reason, moves to CRM).
- **Payment-ready:** a labelled insertion point on the review screen —
  *"— Payment step goes here later. Not enabled yet. —"*. The flow does not restructure
  when payment is added (approval → [payment] → confirmation).

---

## 16. Product decisions made here (brief is silent — flagged for sign-off)

| Decision | Chosen behaviour | Why |
|---|---|---|
| Inventory freshness threshold | Fresh ≤3d · slightly stale 4–10d · stale >10d (not shown live); **configurable** | Needs an operational policy; made it visible + adjustable, not silent |
| Default disclosure level | Room-type, **master switch off**, opt-in | Matches the brief's own instinct; all 3 switchable to compare |
| Phone verification for visits | Same-day bookings only | Cuts fakes where risk is highest without taxing normal bookings |
| Booking-request response SLA shown to visitor | "usually within a day" (soft, no timer) | Avoids a promise the owner can't keep |
| Max visits per slot / min notice / horizon | Owner-set, defaults 2 / 3h / 21d | Sensible starting points; fully editable |
| Payment insertion point | After owner approval, before visitor confirmation | Natural place; keeps deposit-holds owner-gated |
| Extra pages & add-page | Advanced only | Matches capability matrix ("extra pages: Advanced") |
| "Powered by ManagR" | On for Basic; Footer toggle on Advanced | Matches matrix |
| Basic → paid later | Plan/badge/renewal/lapsed components exist now, Basic reads "Free" | Brief asks for this explicitly |
| Breakpoint values | Desktop / Tablet / Mobile, values TBD by front-end | Owner never sees numbers; not a UX decision |
| Draft sharing | Preview link is unlisted, not access-controlled in v1 | Simple; revisit with permissions |
| Autosave when offline | Local-only, honest wording, syncs on reconnect | Don't imply real offline backend |

Full running list + rationale in `BUILDER-lowfi-notes.md`.

---

## 17. Permissions (architecture only — reuses ManagR's system)

| Role | Website Builder |
|---|---|
| **Owner / Org admin** | everything incl. plan & billing, delete site, address support requests |
| **Website manager** | edit · publish · pages · theme · assets · visits · enquiries · booking requests. **Not** plan/billing, **not** delete site |
| **Staff / warden** | **view only** in the builder (locked editor with an explainer). Their real job — keeping bed status current — happens in ManagR and is what keeps public availability honest |

Every gated action shows a proper locked state naming the role and the path to get access
("Ask an Owner"). The builder is architected so these capabilities are individually
permission-checked; it does not implement the permission store.

---

## 18. Cross-cutting

- **Errors** — categorised (`network · validation · permission · missing-data · conflict ·
  unavailable · plan · publish · upload`), each rendered with *what happened / what it means
  / what to do*. No stack traces, no codes shown to owners.
- **Conflict / race** — visit slots, booking requests, featured-property changes, asset
  edits: optimistic UI + graceful "that changed while you were working — here's what's true
  now" recovery. Never silent overwrite.
- **Accessibility** — ≥44px targets, visible focus, keyboard-navigable editor, labelled
  controls, errors tied to fields, never colour-only meaning, text reflows on zoom.
- **i18n** — English now; layouts tolerate ~1.8× string length; no text baked into images;
  no fixed-width labels or fragile buttons. Visitor site is first to be localised (Hindi,
  Marathi, Kannada, Telugu, Tamil).
- **Weak network** — editor: save queue + reconnect + retry, honest offline wording.
  Visitor: skeletons, progressive images, key info (rent, area, call) before images load.
- **Support** — contextual, not a manual: inline "Why?" links, short explainers, WhatsApp
  support for account/address issues, "Need to change your address? → Support".
- **Command menu (⌘K)** — Add section · Go to page · Open theme · Open availability ·
  Run site check · Preview · Publish · Find a section. Optional; the product never depends on it.
- **Keyboard shortcuts** — ⌘Z/⇧⌘Z, ⌘S (force-save), P (preview), ⌘↵ (publish), ⌫ (remove
  selected), ⌥↑/↓ (move section), ⌘D (duplicate). Discoverable via a shortcuts sheet; never required.

---

## 19. Required demonstration flows (all navigable in the prototype)

1. No property → add → approved → claim address → confirm → basic info → live → enter builder
2. Live site → open builder → select section → change setting → preview → publish
3. Builder → add section → configure → reorder → hide → restore (undo / version)
4. Builder → theme → template → apply → review changes → publish
5. Builder → mobile canvas → section settings → responsive override → responsive check → preview
6. Builder → Advanced-only section → lock explainer → upgrade
7. Availability → configure → room-level disclosure → stale data → preview
8. Visits → configure schedule → visitor books a visit → Scheduled Visits shows Source: Website
9. Enquiry → visitor submits → CRM lead created (source Website)
10. Booking request → date unavailable → suggested date → request → owner approves
11. Advanced expires → warning → fallback to Basic → availability/booking disabled → reactivate
12. Publish mistake → version history → preview old version → restore

---

## 20. Explicitly NOT built (out of product identity)

Figma clone · developer IDE · full CMS · raw HTML/CSS editor · animation timeline ·
real-time multiplayer editing · enterprise publishing pipeline · analytics platform ·
custom-domain purchase flow (later) · marketplace features (that's BedR).

---

## 21. Pass 3 — UX refinement decisions (architecture unchanged)

Pass 3 kept every model above and made it *obvious for a non-technical 45–60 year old
owner*. Full audit in `BUILDER-UX-QA.md`. Decisions that touch the model:

- **Editing model clarified:** section **wording is base** (applies at every breakpoint);
  only **Layout** and **Visibility** carry per-breakpoint overrides. The owner can never
  end up maintaining three copies of a headline. The inspector states this in one line.
- **Editor default view = Phone**, matching what visitors use. Desktop/Tablet are a
  deliberate switch, not the default.
- **Inspector is progressive:** Content tab shows 2–4 primary controls; the rest sits in
  a "More options" disclosure. Tab labels: Content · Layout · **ManagR data** · Visibility.
- **One advanced-lock component** (`advlock`): *feature → what it does → what Basic does
  instead → [See what Advanced includes]*. Small inline chips only for single controls.
- **Website Home = a status strip** answering Status / Address / Plan / Health / Next in
  five one-line rows, each with its action inline. No dashboard sprawl.
- **Site health** leads with a single verdict, then *Fix these first / Worth a look /
  Working well*, each linking to where it's fixed. The same check gates publish.
- **Availability** presented as four numbered choices, each with a "Visitor sees: …"
  example; the privacy firewall is a headed callout, stated as built-in not a toggle.
- **Visit settings** front-loads days → times → properties; blackout/types/timing rules
  are in "More options".
- **Every sub-screen** has a title + one-line description + "Back to Website".
- **Spacing/type/tap system:** one scale (`--s1…--s8` = 4…40), 14px base, 44px targets
  in owner flows, one shadow (popovers only). Full rules in `BUILDER-UX-QA.md §3`.
- **Mobile:** one overlay layer at a time; section actions split between a floating bar
  (move / Edit) and the settings-sheet header (hide / duplicate / remove); reorder is
  arrows, not drag.

---

## 22. Production UX sign-off (Pass 4)

Pass 4 is the final designer sign-off — no new concepts. The architecture in §1–21 is
approved. This pass hardened the interaction model, made every visible control do what it
says, and fixed the real layout/state defects found in browser QA. Full log in
`BUILDER-UX-QA.md §9–16`.

### 22.1 Decisions engineering should treat as intentional

| # | Decision | Rationale |
|---|---|---|
| 1 | **Section-based constrained builder.** Fixed catalogue of pre-built sections; no free canvas, no arbitrary nesting, no raw CSS. | The owner cannot build a broken or unsafe page. |
| 2 | **Content + layout are single-value (all screens).** Only per-section show/hide is per-screen. `overrides` unused in v1. | A non-technical owner never maintains multiple copies of anything. The canvas device switch is preview-only. |
| 3 | **Editor default view = Phone.** | Matches what most visitors use; safe now that layout is not per-screen. |
| 4 | **ManagR data boundary is absolute.** A field is *either* owner-editable *or* bound ("From ManagR" + "Edit in ManagR →"). Never both. The builder never writes operational data. | No conflicting sources of truth. |
| 5 | **Draft → Preview → Publish.** Autosave to draft (quiet indicator); visitors only ever see the last published version; publish runs the site check (blockers stop, warnings don't) then a plain-language change summary. | Deliberate, reversible publishing. |
| 6 | **Version history carries a full snapshot per published version** (`versions[].snap`). Restore and Preview both operate on the real snapshot; restore lands as a draft, current draft saved first, nothing goes live until re-publish. | "Undo a bad publish" is a genuine, safe operation — not a decorative list. |
| 7 | **Destructive actions prefer Undo** (toast) over confirmation. Confirm dialogs only for: discard all draft changes, delete a page, apply a template. | Forgiving; no modal fatigue. |
| 8 | **Advanced gating = one component** (`advlock`): feature → what it does → what Basic does instead → [See what Advanced includes]. Dismissible, never a dead end, never nags. Advanced sections/pages are hidden on lapse, **never deleted**. | Commercial prompts that respect the user. |
| 9 | **Inventory privacy is enforced at the render layer, not a setting.** The public site can never emit tenant identity, blocked-reason, exact address, or bed↔person. Re-stated at publish. | Non-negotiable; a config mistake cannot leak a tenant. |
| 10 | **Stale availability quietly stops showing as "live"** past the freshness threshold and warns the owner on Website health — it never shows a stale number as current. | Honest live data or none. |
| 11 | **Booking-request unmet date → recovery, not rejection** ("next bed free from 2 March · Request for 2 March"). Payment slots in after owner approval without restructuring the flow. | |
| 12 | **Roles:** owner / website-manager / staff. Staff = view-only editor with an explainer. Every gated action names the role and the way to get access. | |
| 13 | **One tab-bar component** (`.tabbar`) for Website settings and the Design sheet; the inspector keeps `.insp-tabs` (4 fixed, sticky). One `.rcard` for every choice/checkbox/toggle row. One spacing/type/tap scale. | Fewer components to build and keep consistent. |
| 14 | **The prototype's dev "flask" is scaffolding**, positioned clear of the mobile editor bars; it simulates the ManagR plan/role/data the builder *reads*. Not part of the product. | |

### 22.2 Defects fixed in this pass (were shippable-looking but wrong)

- **Version Restore did nothing** while showing a success toast → now restores a real snapshot.
- **Publish always logged "Minor edits"** (summary computed after the baseline was overwritten) → computed before.
- **Inspector Layout tab was inert** — variant buttons, spacing control and "Match desktop" link did nothing → variants and spacing now apply and persist; the confusing per-device "override" affordance is removed.
- **Coach marks leaked** onto Website settings / other views after leaving the editor → cleared on every non-editor render.
- **Website Home header overflowed** the viewport below ~340px → title block and action buttons stack on a phone.
- **Prototype dev button covered the mobile "Publish" bar** (a CSS source-order bug) → repositioned above both bottom bars.
- **Enquiry validation** showed only a text message → invalid fields now get `aria-invalid` + focus.
