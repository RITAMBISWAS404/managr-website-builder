# ManagR Website — Section Contracts

> **Generated** from `src/features/sections/contracts.ts` — run `npm run contracts`. Do not edit by hand.

This is the single source of truth shared by three things that must never drift apart:

```
EDITOR  ⇅  SECTION CONTRACT  ⇅  TEMPLATE IMPLEMENTATION
```

**Rule 1** — the editor must never expose a capability that is not in a section's contract.
**Rule 2** — a template variant must never add an owner-controllable capability the editor does not expose.
**Rule 3** — the future template website implements *exactly* the model below, per section, per variant.

Privacy rules marked 🔒 are enforced by the render layer and re-checked at publish — they can never be toggled off.

---

## Controls every section shares

These are exposed by the inspector's **Layout** tab for every non-locked section and are
in addition to the per-section controls documented below. Every template variant must honour them.

| Control | Values | Notes |
|---|---|---|
| Layout / style | the section's named variants | shown in the inspector as a visual mini-preview grid, one choice active |
| Section spacing | cosy · compact · roomy | vertical padding only — never arbitrary margins |
| Show on screen | Desktop · Tablet · Phone | per-screen show/hide; content and layout stay identical across screens |
| Hide whole section | on / off | kept in the section list; never renders a visible empty box on the live site |
| Reorder | drag / ⌥↑ ⌥↓ / move up-down | header stays first, footer stays last, globals excluded |

The inspector is one scrolling panel with collapsible **Content · Layout · Visibility · Data**
groups (no tabs). The **Data** group is read-only — it lists the ManagR values the section binds to.
Colours, fonts and corner radius are **global** (Design panel), never per-section.

---

## Section index

| Section | Plan | Scope | Instances | Layout options | Future variants |
|---|---|---|---|---|---|
| **Header / brand bar** | Basic | Global | one per page | 1 | up to 3 |
| **Hero banner** | Basic | Page | one per page | 5 | up to 3 |
| **Properties grid** | Basic | Page | one per page | 4 | up to 3 |
| **Featured property** | Basic | Page | one or more | 1 | up to 3 |
| **Areas covered** | Basic | Page | one or more | 1 | up to 2 |
| **Highlights** | Basic | Page | many | 3 | up to 3 |
| **Trust banner** | Basic | Page | one or more | 1 | up to 2 |
| **Reviews** | Basic | Page | one or more | 1 | up to 3 |
| **About us** | Basic | Page | one or more | 3 | up to 3 |
| **Rich text** | Advanced | Page | many | 1 | up to 2 |
| **Photo gallery** | Advanced | Page | many | 3 | up to 3 |
| **FAQ** | Advanced | Page | many | 1 | up to 2 |
| **Enquiry form** | Advanced | Page | one per page | 1 | up to 2 |
| **Visit booking** | Advanced | Page | one per page | 1 | up to 2 |
| **Booking request CTA** | Advanced | Page | one or more | 1 | up to 2 |
| **Offer banner** | Advanced | Page | many | 1 | up to 2 |
| **Contact block** | Basic | Page | one or more | 2 | up to 3 |
| **WhatsApp bar** | Advanced | Global | one per page | 1 | up to 2 |
| **Footer** | Basic | Global | one per page | 1 | up to 2 |

---

## Header / brand bar

**Purpose.** Site-wide identity, navigation and a call button.

**Plan** Basic · **Scope** global (shows on every page) · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Business name shown | text | yes | yes | Owner | 1 line, ~40 chars |
| Logo image | image | — | yes | Owner | — |
| Menu links | list | — | yes | Owner | only pages that exist; order follows page order |
| Show a Call button | toggle | — | yes | Owner | — |
| Keep the menu visible while scrolling | toggle | — | yes | Owner | — |
| Call button number | auto | — | **no** | Website settings | — |

- *Business name shown* — Falls back to the business name from Website settings.
- *Logo image* — Advanced only. No logo → a generated monogram, never a broken image.

### Layout contract

- **Options (owner picks one):** Default
- Always first on every page
- Cannot be removed or reordered
- **Never (guards editor + template):** Multiple headers · Mega-menu / dropdown nav · Search bar · Language switcher · Custom link URLs
- **Responsive:** desktop — logo left, links centre/right, call button right; tablet — same; mobile — logo left, links collapse into a menu button, call button visible

### Design controls

- **Allowed (section-specific):** Sticky on/off · Call button on/off
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Header height · Link spacing · Custom colours (comes from Design → Colours) · Transparency / overlay modes

### Data & privacy

- **Reads from:** Website settings → business name · Website settings → contact number · Pages (for link targets)
- **Owner controls:** Business name text · Which links show · Call button on/off · Sticky on/off
- **Not editable here:** Call button phone number (from settings) · Link URLs (auto from pages)

### Editor controls exposed today

`logotext` · `call` · `sticky`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- Basic (fixed layout, wording editable)
- no logo (monogram)
- Advanced (logo upload)

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** monogram/logo + menu links + optional call button
- **May vary between variants:** logo vs wordmark · link alignment · call button style (filled / outline)
- **No variant may add:** dropdown menus · search · more than one CTA · announcement bar baked in

---

## Hero banner

**Purpose.** The first thing a visitor sees — one clear promise and one action.

**Plan** Basic · **Scope** page section · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Eyebrow (small line above the heading) | text | — | yes | Owner | 1 short line, ~30 chars |
| Main heading | text | yes | yes | Owner | 1 heading, ~60 chars |
| One line under it | text | — | yes | Owner | 1 sentence, ~120 chars |
| Main button action | choice | — | yes | Owner | call / WhatsApp / scroll to properties / hidden |
| Main button wording | text | — | yes | Owner | ~20 chars |
| Secondary button | cta | — | yes | Owner | max 1; scroll target only |
| Background | choice | — | yes | Owner | property photo / plain colour |
| Hero image | image | — | yes | ManagR · Properties | — |

- *Main heading* — Falls back to a generated headline from the business name + area.
- *Secondary button* — 2 CTAs maximum on the whole section.
- *Hero image* — Chosen from your property photos in ManagR.

### Layout contract

- **Options (owner picks one):** Image on top · Image left / text right · Text left / image right · Image background · Text only
- One heading, one sub-line, at most two buttons
- Image is decorative — never the only way to get information
- **Never (guards editor + template):** A third CTA · Video background · Carousel / slider · Badge / logo row · Stat counters · Arbitrary content blocks
- **Responsive:** desktop — as chosen layout; tablet — inherits desktop; 3-up grids become 2-up; mobile — single column, media above text, full-width CTAs

### Design controls

- **Allowed (section-specific):** Layout variant · Text alignment (left / centre) · Background style (photo / plain) · Button style (from Design)
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Font size · Custom margins / padding · Custom width · Overlay opacity slider · Absolute positioning

### Data & privacy

- **Reads from:** Property photos (ManagR) for the image · Website settings → contact number / WhatsApp for the button action
- **Owner controls:** All wording · Which layout · Which button action · Which photo (from ManagR)
- **Not editable here:** The photo file itself (managed in ManagR → Properties)
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

`headline` · `sub` · `btnAction` · `bg` · `btn`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- no headline (generated default used)
- no image chosen (plain colour)
- property photo missing in ManagR (plain colour fallback)

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** eyebrow? + heading + sub? + up to 2 CTAs + image?
- **May vary between variants:** image position · text alignment · background treatment · CTA arrangement
- **No variant may add:** 3rd CTA · video · carousel · stat row · form embedded in the hero

---

## Properties grid

**Purpose.** Your live rooms — name, area, rent and availability — pulled straight from ManagR.

**Plan** Basic · **Scope** page section · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Which properties to show | choice | yes | yes | Owner | all approved / a chosen set |
| Order | choice | — | yes | Owner | newest / featured first / most beds free |
| Card style | choice | — | yes | Owner | with photo / compact |
| Property name | auto | yes | **no** | ManagR · Properties | — |
| Area | auto | yes | **no** | ManagR · Properties | — |
| Rent from | auto | yes | **no** | ManagR · Properties | — |
| Sharing types | auto | — | **no** | ManagR · Properties | — |
| Property photo | auto | — | **no** | ManagR · Properties | — |
| Availability badge | auto | — | **no** | ManagR · Inventory | — |

- *Section title* — Defaults to “Our properties”.
- *Area* — Approximate area only.
- *Availability badge* — Only shows if Live availability is on (Advanced). Controlled on the Live availability screen.

### Layout contract

- **Options (owner picks one):** Photo cards · Compact list · 2 per row · 3 per row
- Cards are generated per approved property — the owner never builds a card
- A card with no photo shows a clean placeholder, never a broken image
- **Never (guards editor + template):** Editing any property's name / rent / area / photos here · Manually adding a property that isn't in ManagR · Per-card custom copy · More than 3 columns
- **Responsive:** desktop — chosen columns; tablet — 2 columns; mobile — 1 column

### Design controls

- **Allowed (section-specific):** Column count / card style · Section title · Ordering · Which properties
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Card colours · Card padding · Per-card layout · Font sizes

### Data & privacy

- **Reads from:** ManagR → Properties (approved only) · ManagR → live inventory (for the availability badge) · Live availability settings (disclosure level, exact vs vague, from-date)
- **Owner controls:** Section title · Which properties · Order · Card style / columns
- **Not editable here:** Property name, area, rent, room types, photos — all from ManagR → Properties · The availability numbers — from ManagR inventory
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)
- 🔒 Only approved & public properties appear
- 🔒 Bed-level detail only if the owner opted in on Live availability

### Editor controls exposed today

`which` · `order` · `cardStyle`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- no approved properties (“New listings coming soon”)
- properties without photos (placeholder card)
- under-review property (hidden from the public grid)
- availability stale (badge hidden, owner warned on Website health)

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** generated card per approved property: photo? + name + area + rent + sharing + availability badge?
- **May vary between variants:** card shape · column count · photo aspect · badge placement
- **No variant may add:** owner-authored card copy · prices/areas typed by the owner · a map view · filtering UI on the public site

---

## Featured property

**Purpose.** Put one property in the spotlight.

**Plan** Basic · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Property to feature | choice | yes | yes | Owner | one approved property |
| Name / area / rent / photo | auto | yes | **no** | ManagR · Properties | — |
| Availability badge | auto | — | **no** | ManagR · Inventory | — |

### Layout contract

- **Options (owner picks one):** Default
- One property only
- **Never (guards editor + template):** Editing the property's data · Featuring a non-approved property · More than one property
- **Responsive:** desktop — as chosen layout; tablet — inherits desktop; 3-up grids become 2-up; mobile — single column, media above text, full-width CTAs

### Design controls

- **Allowed (section-specific):** Which property
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Card style · Colours · Custom copy

### Data & privacy

- **Reads from:** ManagR → Properties · ManagR → inventory
- **Owner controls:** Which property is featured
- **Not editable here:** All property data
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

`prop`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- chosen property removed / unapproved in ManagR (section auto-hides)
- no approved properties

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** one property: large photo + name + area + rent + availability
- **May vary between variants:** image size / position · detail density
- **No variant may add:** multiple properties · owner-typed description

---

## Areas covered

**Purpose.** Show the neighbourhoods you have buildings in.

**Plan** Basic · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Areas to list | list | yes | yes | Owner | chosen from your properties' areas |

- *Areas to list* — The list of areas comes from ManagR; the owner ticks which to show.

### Layout contract

- **Options (owner picks one):** Default
- Areas are a chip list generated from your properties
- **Never (guards editor + template):** Typing an area you don't have a property in · Exact addresses
- **Responsive:** desktop — chip row; tablet — chip row wraps; mobile — chip row wraps

### Design controls

- **Allowed (section-specific):** Which areas show
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Chip colours · Layout · Custom labels

### Data & privacy

- **Reads from:** ManagR → Properties → location (area only)
- **Owner controls:** Which areas appear
- **Not editable here:** The area names
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- only one area (still valid)
- no properties

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** chip list of area names
- **May vary between variants:** chip style · alignment
- **No variant may add:** a map · counts per area typed by owner

---

## Highlights

**Purpose.** The handful of things residents actually care about.

**Plan** Basic · **Scope** page section · **Instances** duplicatable

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Highlights to show | list | yes | yes | Owner | 3–6 items, chosen from your amenities |
| Section title | text | — | yes | Owner | ~40 chars |

- *Highlights to show* — Options come from ManagR → Amenities; the owner ticks 3–6.
- *Section title* — Defaults to “Why residents choose us”.

### Layout contract

- **Options (owner picks one):** 3 across · 2 across · Icon list
- Each highlight is an icon + a short label
- 3–6 items
- **Never (guards editor + template):** A paragraph per highlight · Custom icons / images · More than 6 items
- **Responsive:** desktop — chosen columns; tablet — 2 across; mobile — 2 across or list

### Design controls

- **Allowed (section-specific):** Column count / list style · Which highlights · Section title
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Icon choice · Colours · Per-item styling

### Data & privacy

- **Reads from:** ManagR → Properties → Amenities (option list)
- **Owner controls:** Which highlights · Layout · Title
- **Not editable here:** The amenity list itself

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- fewer than 3 chosen (defaults filled in)
- no amenities on any property

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** 3–6 × (icon + short label), optional title
- **May vary between variants:** columns vs list · icon container style
- **No variant may add:** long text per item · images per item · more than 6

---

## Trust banner

**Purpose.** A single reassuring line that converts.

**Plan** Basic · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Banner text | auto | yes | **no** | Template (fixed) | — |

- *Banner text* — Fixed wording — “Direct from owner · No brokerage” — because it performs. The owner can hide the section but not reword it.

### Layout contract

- **Options (owner picks one):** Default
- One line, centred
- **Never (guards editor + template):** Rewording · Multiple lines · Adding a CTA
- **Responsive:** desktop — centred pill; tablet — centred pill; mobile — centred pill, wraps

### Design controls

- **Allowed (section-specific):** Show / hide the whole section
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Text · Colour · Icon

### Data & privacy

- **Owner controls:** Show / hide
- **Not editable here:** The wording

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** one fixed line + shield icon
- **May vary between variants:** pill vs full-width bar · icon on/off
- **No variant may add:** owner-editable text · CTA · multiple claims

---

## Reviews

**Purpose.** Real resident reviews, pulled from ManagR.

**Plan** Basic · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Review text | auto | yes | **no** | ManagR · Tenants | — |
| Attribution | auto | yes | **no** | System | — |

- *Section title* — Defaults to “What residents say”.
- *Attribution* — Always shown as “Verified resident” — never a name.

### Layout contract

- **Options (owner picks one):** Default
- Reviews are generated from ManagR
- Attribution is always anonymous
- **Never (guards editor + template):** Typing a review · Editing a review · Showing the reviewer's name / photo · Star-rating widgets the owner sets
- **Responsive:** desktop — 2-up; tablet — 2-up; mobile — 1-up

### Design controls

- **Allowed (section-specific):** Section title · How many show
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Review text · Attribution · Colours

### Data & privacy

- **Reads from:** ManagR → Tenants → Reviews (text only)
- **Owner controls:** Section title · Which / how many reviews feature
- **Not editable here:** The review text · The attribution
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)
- 🔒 Reviewer identity is never shown

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- no reviews yet (section auto-hides on the live site; editor shows a “nothing to show yet” note)
- normal
- hidden (kept in the section list)
- unpublished changes

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** quote text + “Verified resident”
- **May vary between variants:** card vs slider · columns
- **No variant may add:** reviewer names/photos · owner-authored testimonials · editable star ratings

---

## About us

**Purpose.** Your story in a few lines, with one photo.

**Plan** Basic · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Your story | longtext | yes | yes | Owner | 1 paragraph, ~400 chars |
| Photo | choice | — | yes | ManagR · Properties | one property photo (or upload on Advanced) |

### Layout contract

- **Options (owner picks one):** Text + photo · Photo + text · Text only
- One paragraph, one photo
- **Never (guards editor + template):** Multiple paragraphs with headings · A team grid · Timeline / milestones · Video
- **Responsive:** desktop — as chosen layout; tablet — inherits desktop; 3-up grids become 2-up; mobile — single column, media above text, full-width CTAs

### Design controls

- **Allowed (section-specific):** Layout variant · Photo side · Section title
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Font size · Rich text formatting · Multiple images

### Data & privacy

- **Reads from:** Property photos (ManagR) for the image
- **Owner controls:** The paragraph · Layout · Which photo
- **Not editable here:** The photo file (managed in ManagR)
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

`text` · `photo`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- no text (default copy used)
- no photo (text-only layout)

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** title? + one paragraph + one photo?
- **May vary between variants:** photo position · text alignment · photo shape
- **No variant may add:** multiple photos · headings inside the text · team members · stats

---

## Rich text

**Purpose.** A free block of words — house rules, meal menu, anything.

**Plan** Advanced · **Scope** page section · **Instances** duplicatable

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Text | longtext | yes | yes | Owner | plain paragraphs + simple lists, ~1500 chars |

### Layout contract

- **Options (owner picks one):** Default
- Plain paragraphs and bullet lists only
- **Never (guards editor + template):** Embeds / iframes · Custom HTML · Images inside the text · Columns
- **Responsive:** desktop — single readable column, max ~640px; tablet — single column; mobile — single column

### Design controls

- **Allowed (section-specific):** Bold / bullets (basic)
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Font size · Colours · Custom width · HTML

### Data & privacy

- **Owner controls:** The text
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

`text`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- empty (placeholder shown in editor, section hidden on live site)

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** one text block, constrained width
- **May vary between variants:** alignment · max width
- **No variant may add:** media · columns · raw HTML

---

## Photo gallery

**Purpose.** A wall of photos from across your properties.

**Plan** Advanced · **Scope** page section · **Instances** duplicatable

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Which photos | list | yes | yes | ManagR · Properties | chosen from your property photos; 6–12 recommended |
| Arrangement | choice | — | yes | Owner | grid / rows |

### Layout contract

- **Options (owner picks one):** Grid · Rows · Masonry
- Photos are chosen from ManagR, never uploaded here
- Safe aspect ratios; broken images never break the layout
- **Never (guards editor + template):** Uploading photos in this section · Captions per photo · Lightbox-only content · Video
- **Responsive:** desktop — chosen arrangement; tablet — 2–3 columns; mobile — 2 columns

### Design controls

- **Allowed (section-specific):** Arrangement · Which photos · Section title
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Per-photo cropping controls · Colours · Spacing

### Data & privacy

- **Reads from:** ManagR → Properties → Photos
- **Owner controls:** Which photos · Arrangement · Title
- **Not editable here:** The photo files
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- no photos on any property (section auto-hides; editor shows a note + link to add photos in ManagR)
- normal
- hidden (kept in the section list)
- unpublished changes

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** 6–12 photos in a grid/rows layout
- **May vary between variants:** grid vs masonry vs rows · column count · gap
- **No variant may add:** captions · owner uploads here · video tiles

---

## FAQ

**Purpose.** Answer the questions people always ask and cut repeat calls.

**Plan** Advanced · **Scope** page section · **Instances** duplicatable

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Questions & answers | list | yes | yes | Owner | 3–10 Q&A; question ~80 chars, answer ~300 chars |

### Layout contract

- **Options (owner picks one):** Default (accordion)
- Each item is one question + one short answer
- Accordion — one open at a time
- **Never (guards editor + template):** Rich media in answers · Links styled as buttons · Nested questions · More than 10
- **Responsive:** desktop — single column accordion; tablet — single column; mobile — single column

### Design controls

- **Allowed (section-specific):** Section title · Which Q&A, order
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Colours · Answer formatting beyond plain text

### Data & privacy

- **Owner controls:** Every question and answer · Order
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- no items (default starter questions offered in the editor)

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** accordion of Q&A
- **May vary between variants:** single vs two column at desktop · divider style
- **No variant may add:** media answers · more than 10 items · CTA inside an answer

---

## Enquiry form

**Purpose.** Turn a visitor into a CRM lead in a few taps.

**Plan** Advanced · **Scope** page section · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Optional questions | list | — | yes | Owner | pick from: looking-for, move-in date, budget. Name & phone are always asked. |
| Floating “Enquire” button on mobile | toggle | — | yes | Owner | — |
| Where leads go | auto | yes | **no** | System | — |

- *Where leads go* — Always Leads & CRM, tagged “Website”. Not configurable.

### Layout contract

- **Options (owner picks one):** Default
- Name + phone required; up to 3 optional fields
- Submissions create a CRM lead — nothing else
- **Never (guards editor + template):** Custom fields the CRM can't store · File uploads · Payment inside the form · Sending to an email / webhook the owner types
- **Responsive:** desktop — inline form; tablet — inline form; mobile — inline form + optional floating button

### Design controls

- **Allowed (section-specific):** Section title · Which optional fields · Mobile floating button on/off · Button style (from Design)
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Field order · Field labels · Colours · Multi-step

### Data & privacy

- **Reads from:** ManagR → Leads & CRM (destination)
- **Owner controls:** Title · Optional fields · Floating button
- **Not editable here:** Name / phone always asked · Where leads go · Lead tag
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)
- 🔒 Visitor data goes only to the owner's CRM

### Editor controls exposed today

`fab`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- Basic (locked — shows an “Available with Advanced” panel in the editor and a placeholder on the canvas)
- duplicate submission (visitor told they already enquired)
- validation error
- submit failure (retry)

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** name + phone + up to 3 optional fields + submit
- **May vary between variants:** single column vs two column at desktop · inline vs card container
- **No variant may add:** extra fields · uploads · multi-step · owner-set destination

---

## Visit booking

**Purpose.** Let visitors book a viewing in the slots you allow.

**Plan** Advanced · **Scope** page section · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Properties that accept visits | list | yes | yes | Owner | chosen from your approved properties |
| Days, slots, notice, capacity, visit types | auto | yes | **no** | Website settings | — |

- *Days, slots, notice, capacity, visit types* — All set on the Visit settings screen — not in the editor.

### Layout contract

- **Options (owner picks one):** Default
- The section is an entry point; the booking flow is a fixed 4-step flow (property → need → date → time → details)
- **Never (guards editor + template):** Editing the booking steps · Adding fields to the booking flow · Changing slot logic here
- **Responsive:** desktop — prompt + button → flow; tablet — same; mobile — same, full-screen flow

### Design controls

- **Allowed (section-specific):** Section title · Which properties · Button style (from Design)
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** The booking flow itself · Slot rules · Colours

### Data & privacy

- **Reads from:** Visit settings (days, slots, blackout, capacity, notice, horizon, visit types) · ManagR → Properties · ManagR → inventory (free-from dates)
- **Owner controls:** Title · Which properties accept visits
- **Not editable here:** Everything about the schedule — set on Visit settings · Bookings land in Scheduled Visits tagged “Website”
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- Basic (locked panel)
- no slots configured (owner prompted to set Visit settings)
- no properties accept visits
- slot taken during booking (visitor offered nearby times)
- same-day booking (one-time code)

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** title + short line + button that opens the fixed booking flow
- **May vary between variants:** inline mini-calendar preview vs button only · container style
- **No variant may add:** editing the flow · extra steps · custom fields · owner-set slot logic

---

## Booking request CTA

**Purpose.** Let a visitor request a bed from a move-in date.

**Plan** Advanced · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| CTA wording | text | — | yes | Owner | ~40 chars |
| Request flow | auto | yes | **no** | System | — |

- *CTA wording* — Defaults to “Ready to move in?”.
- *Request flow* — Fixed: room type → move-in date → availability check → request → owner approves/declines. Payment slots in later without changing the flow.

### Layout contract

- **Options (owner picks one):** Default
- An entry point to the fixed request flow
- **Never (guards editor + template):** Editing the request flow · Collecting payment here (yet)
- **Responsive:** desktop — as chosen layout; tablet — inherits desktop; 3-up grids become 2-up; mobile — single column, media above text, full-width CTAs

### Design controls

- **Allowed (section-specific):** CTA wording · Button style
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** The flow · Colours · Fields

### Data & privacy

- **Reads from:** ManagR → inventory (availability check) · ManagR → Properties (room types)
- **Owner controls:** CTA wording
- **Not editable here:** The request flow · Availability logic
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- Basic (locked panel)
- requested date unavailable (visitor offered the earliest valid date)
- request pending / approved / declined

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** short line + one button
- **May vary between variants:** banner vs card · icon on/off
- **No variant may add:** multiple buttons · a form · owner-set availability rules

---

## Offer banner

**Purpose.** A time-boxed promotion that shows and hides itself.

**Plan** Advanced · **Scope** page section · **Instances** duplicatable

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Offer text | text | yes | yes | Owner | 1 line, ~50 chars |
| Show from | text | — | yes | Owner | date |
| Hide after | text | — | yes | Owner | date |
| Colour | choice | — | yes | Owner | from your brand palette only |

### Layout contract

- **Options (owner picks one):** Default
- One line
- Auto shows/hides on the dates
- **Never (guards editor + template):** A CTA button · Multiple lines · Images · Custom hex colours
- **Responsive:** desktop — full-width bar or centred pill; tablet — same; mobile — same, wraps

### Design controls

- **Allowed (section-specific):** Colour (from palette) · Schedule
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Custom colours · Font · A button

### Data & privacy

- **Reads from:** Design → Colours (palette)
- **Owner controls:** Text · Dates · Colour from palette

### Editor controls exposed today

`text`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- outside the date window (hidden on the live site, visible in the editor with a note)
- no dates (always shown)

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** one line + scheduled visibility
- **May vary between variants:** bar vs pill · colour from palette
- **No variant may add:** a CTA · images · custom colours · countdown timer

---

## Contact block

**Purpose.** Phone, WhatsApp, email and an approximate map.

**Plan** Basic · **Scope** page section · **Instances** one or more

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Section title | text | — | yes | Owner | ~40 chars |
| Which contact methods show | list | yes | yes | Owner | pick from: phone, WhatsApp, email, approximate map, opening hours |
| Phone / WhatsApp / email | auto | yes | **no** | Website settings | — |
| Map | auto | — | **no** | System | — |

- *Map* — General area only — the exact street address is never shown, on any plan.

### Layout contract

- **Options (owner picks one):** Stacked · Two columns
- Contact details come from Website settings
- Map is approximate area only
- **Never (guards editor + template):** Typing contact details here · A precise-pin map · A contact form (that's the Enquiry form section)
- **Responsive:** desktop — chosen layout; tablet — stacked; mobile — stacked

### Design controls

- **Allowed (section-specific):** Layout variant · Which methods · Section title
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Colours · Map zoom / pin precision · Editing the numbers

### Data & privacy

- **Reads from:** Website settings → Contact (phone, WhatsApp, email, office area)
- **Owner controls:** Title · Which methods show · Layout
- **Not editable here:** The phone / WhatsApp / email values (edit them once in Website settings) · Map precision
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)
- 🔒 Map is always the approximate area, never a precise pin

### Editor controls exposed today

_show / hide only — no per-field controls_

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- email left blank in settings (email row hidden)

### Future variant contract

- **Up to 3 designed variants.**
- **Every variant must support:** chosen contact rows + optional approximate map
- **May vary between variants:** stacked vs columns · map on a side vs full width
- **No variant may add:** a form · precise map pin · owner-typed contact values

---

## WhatsApp bar

**Purpose.** A WhatsApp button that follows the visitor as they scroll.

**Plan** Advanced · **Scope** global (shows on every page) · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Button wording | text | — | yes | Owner | ~24 chars |
| WhatsApp number | auto | yes | **no** | Website settings | — |

- *Button wording* — Defaults to “Chat with us”.

### Layout contract

- **Options (owner picks one):** Default
- Floating, bottom of the viewport, on every page
- **Never (guards editor + template):** Moving it · Multiple floating buttons · A call button here (that's the header)
- **Responsive:** desktop — bottom-right floating pill; tablet — same; mobile — full-width bottom bar

### Design controls

- **Allowed (section-specific):** Button wording · Show / hide
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Position · Colour (fixed WhatsApp green) · Size

### Data & privacy

- **Reads from:** Website settings → WhatsApp number
- **Owner controls:** Wording · Show / hide
- **Not editable here:** The number · The colour / position

### Editor controls exposed today

`text`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- Advanced only

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** floating WhatsApp pill / bar
- **May vary between variants:** pill vs bar on mobile · icon + text vs icon only
- **No variant may add:** repositioning · colour changes · multiple actions

---

## Footer

**Purpose.** Contact details and a link back to you, on every page.

**Plan** Basic · **Scope** global (shows on every page) · **Instances** one per page

### Content fields

| Field | Type | Required | Editable | Source | Limit |
|---|---|---|---|---|---|
| Details shown | list | — | yes | Owner | pick from: phone, WhatsApp, email, office area, Instagram |
| Show “Powered by ManagR” | toggle | — | yes | Owner | — |
| Contact values | auto | yes | **no** | Website settings | — |

- *Show “Powered by ManagR”* — Advanced can turn it off; on Basic it stays on.

### Layout contract

- **Options (owner picks one):** Default
- Always last on every page
- Cannot be removed or reordered
- **Never (guards editor + template):** Multiple footers · Nav columns / sitemap · A newsletter form · Custom links
- **Responsive:** desktop — single row / few columns; tablet — stacked; mobile — stacked

### Design controls

- **Allowed (section-specific):** Which detail rows show · “Powered by ManagR” on/off (Advanced)
- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section
- **Never:** Colours · Layout · Editing the values

### Data & privacy

- **Reads from:** Website settings → Contact + Social
- **Owner controls:** Which rows show · “Powered by” toggle (Advanced)
- **Not editable here:** The contact / social values (from settings)
- 🔒 Never a tenant name, photo, phone number or document
- 🔒 Never which bed a specific person is in
- 🔒 Never the reason a bed is blocked
- 🔒 Never the exact street address (approximate area only)

### Editor controls exposed today

`powered`

### States

- normal
- hidden (kept in the section list)
- unpublished changes
- Basic (“Powered by ManagR” forced on)

### Future variant contract

- **Up to 2 designed variants.**
- **Every variant must support:** chosen contact rows + “Powered by ManagR”
- **May vary between variants:** single row vs stacked · social icons vs text links
- **No variant may add:** sitemap columns · newsletter form · custom links

---

## How the three layers stay aligned

1. **`contracts.ts`** (this file) is edited first for any capability change.
2. **`registry.ts`** `content` schema drives the inspector; `verifyContract()` fails the build if the inspector exposes a field not in the contract, or omits one the contract promises.
3. **`SectionCanvas.tsx`** renders only fields the contract marks editable/auto.
4. **The future template project** imports `CONTRACTS` and implements each variant against `variants.baseline` / `mayVary` / `neverAcrossVariants`.
