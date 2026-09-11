# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — the owner.** Runs 1–40 PG/hostel properties (most run 1–5), age ~30–60, often not
the most comfortable with computers (a son, daughter, or office manager sometimes does the
setup). Phone-first: a large share complete the whole flow on a five-year-old Android,
standing in a building corridor. Desktop exists but is not the default. Today their marketing
is a board outside the building, a WhatsApp group, a Justdial listing, a broker, and word of
mouth. They want one link — for a WhatsApp bio, Instagram, visiting card, and the board —
that makes them look like a real business rather than a room in someone's flat. They fear
looking cheap, being copied by a competitor, exposing their tenant list, and paying for
something they can't see working.

**Secondary — the owner's staff** (managers, wardens). They never open the builder, but they
update bed status daily in ManagR, and that data entry is what keeps public availability
honest. In the builder they are view-only.

**The audience the site is for — the visitor.** Students, first-job professionals, and (often)
their parents, who are frequently the ones who call. Almost entirely mobile, slow connection,
watching their data. Arrive from a WhatsApp forward, an Instagram link, a Google search, or a
QR code on the building gate. Want, in order: photos, rent, location, "is it free now", how to
call. Distrust brokers — "direct from owner, no brokerage" is a real selling point.

## Product Purpose

The **ManagR Website Builder** is a constrained no-code layer inside ManagR (the operating
system PG/hostel owners use to run their business). It turns data the owner already keeps —
properties, rooms, photos, availability, visits, leads — into a public website on a permanent
web address. Success is an owner who, in under three minutes on a phone, has a link that makes
their business look real; and, on Advanced, a site that acts as a working front desk (live
availability, self-serve visits, booking requests) without the owner ever being able to break
the site, expose a tenant, or contradict operational data.

## Positioning

**Presentation is editable; truth comes from ManagR.** Every value a section can show is
exactly one of two things: owner-editable copy/arrangement, or a live read-only binding to
ManagR data (rent, room types, amenities, availability, approval status, address). The builder
never writes operational data, so a published website can never sell a room at the wrong price
or show stale availability as current. A standalone site builder cannot make that guarantee; a
marketplace listing is not the owner's own brand. This is also what makes "direct from owner,
no brokerage" literally true.

## Operating Context

- Lives as its own **Website** section in the ManagR sidebar (previously buried in Settings).
  Locked until the owner's first property is approved.
- **Website Home** — status · address · plan · health · one "next" action · recent activity ·
  this-week metrics · shortcuts to the management surfaces. Pre-setup it shows the switch-on
  flow instead.
- **Editor** (Advanced) — a design-tool-shaped workspace: left panel (Layers / Pages / Add /
  Assets), device-framed live draft canvas (Desktop / Tablet / Mobile; default view = Phone),
  context inspector (Content / Layout / ManagR data / Visibility), in-editor overlays (Theme &
  Brand, Templates, Site settings, Responsive check, Publish check, Version history, Command
  menu, onboarding). The entire workflow is completable on mobile (reorder is arrows not drag;
  settings open full-screen).
- **Management surfaces** deep-linked from Home and from editor sections: Live availability
  (Flow D), Visit settings (Flow E), Enquiries, Booking requests, Analytics ("what your site
  did for you"), Plan & billing, Website health, Website settings.
- **Visitor site** (separate render): Home / About / Gallery / FAQ / Contact / Property
  detail. Property detail is one template design rendered per approved property — not a CMS.
- **Draft → Preview → Live** — autosave to draft; visitors only ever see the last published
  version; publish runs a site check (blockers stop it, warnings don't) then a plain-language
  change summary. Bound ManagR data updates live and is never part of a publish.
- The prototype "dev flask" simulates the ManagR plan/role/data the builder reads; it is
  scaffolding, not product.

## Capabilities and Constraints

**Two plans.** `basic` (free today; plan badge / plan page / renewal / lapsed components exist
now so Basic can become paid without a redesign) and `advanced` (paid). Plan states:
`basic · trial · advanced · expiring · payment_failed · lapsed`. On lapse the site quietly
falls back to the Basic look — Advanced sections auto-hidden (never deleted), branding reverts
on the live site only (draft keeps it), availability + visit booking pause. Nothing is
destroyed; renewal restores instantly.

**Capability matrix (Basic → Advanced):** own web address (both) · property list + detail
pages (both) · photos, rent, room types, amenities, rules (both) · approximate map (both) ·
call + WhatsApp buttons (both) · headline, about, footer contact, offline toggle (both) · own
logo (default mark → yes) · own colours + fonts (our palette → yes) · choose & rearrange page
sections (fixed layout → yes) · extra pages, about/gallery/FAQ/contact (no → yes) · enquiry
form feeding CRM (no → yes) · live bed availability on property pages (no → yes) · visit
booking calendar (no → yes) · booking / move-in requests (no → yes) · discoverable on Google
(hidden → yes) · "Powered by ManagR" footer (always → optional) · custom domain (no → later).

**Hard rules the system enforces:**
- Content comes from ManagR, not the builder. The editor styles and arranges; it never lets
  anyone retype a rent, room count, or amenity. Where a section shows live data it says so and
  links to where it is edited.
- Only approved properties appear publicly. A property still under review shows greyed with an
  explanation — never silently missing.
- The web address is chosen once (it gets printed on boards and pasted into WhatsApp groups).
  The claim step carries weight; afterwards it is locked with a route to support.
- A property's exact address is never public. Maps are approximate, and that is said plainly.
- The site can be taken offline at any time — a clear, reversible state with honest wording
  about what visitors then see.
- An empty site is worse than no site. "No properties yet" and "live but empty" are
  first-class screens, not afterthoughts.
- **Inventory privacy firewall** — enforced at the render layer, not a setting: the public
  site can never emit a tenant name/photo/phone/documents, a blocked-bed reason, the exact
  address, or which bed a particular person is in. Re-stated in the publish check. Bed-level
  disclosure is a plain available/occupied room diagram.
- Availability has a **freshness** policy (default: fresh ≤3 days, slightly stale 4–10 days,
  stale >10 days → stops showing as live and the owner is warned on Website health).
  Thresholds are a configurable product decision.

**Roles** (reuses ManagR's permission system, does not implement it): Owner / Org admin
(everything incl. plan & billing, delete site); Website manager (edit, publish, pages, theme,
assets, visits, enquiries, booking requests — not billing, not delete); Staff / warden
(view-only builder with an explainer). Every gated action names the role and the path to
access.

**Explicitly not built** (outside product identity): Figma clone · developer IDE · full CMS ·
raw HTML/CSS editor · animation timeline · real-time multiplayer editing · enterprise
publishing pipeline · analytics platform · custom-domain purchase flow (later) · marketplace
features (that is BedR).

**Undecided product facts — do not invent answers:** default public inventory disclosure
level; whether a visitor is verified by a one-time code before booking a visit (current
thinking: same-day bookings only); how prominent "Powered by ManagR" should be on a paid site;
whether a multi-property owner wants one shared visit calendar or one per property; whether
there is a kinder alternative to the quiet Basic fallback on lapse; exact responsive
breakpoint pixel values (the owner never sees numbers).

## Brand Commitments

- **Names.** ManagR — the software owners use to run the business; the builder lives inside
  it. BedR — the separate public marketplace where people search for a place to stay; not this
  product. An owner's own site carries the owner's brand, not ManagR's, beyond an optional
  "Powered by ManagR" footer.
- **The themeable-component premise is the point:** hundreds of different owners' brands run
  through the same component system. Owner theming is curated — accent from ~6 accessible
  swatches (each a full readable palette), 3 font pairs, 3 corner styles. No hex input, no
  colour wheel, no font upload, no CSS is ever exposed to the owner.
- **ManagR's own UI** — the shell the builder sits in — has an established look recorded in
  `BEDR-DESIGN-SYSTEM.md` and `BEDR-FOUNDATION.md` (Figma-reverse-engineered): navy sidebar,
  coral primary action, Plus Jakarta Sans, restrained borders and a single card shadow,
  moderate radius. The builder must read as native to it.
- **Voice.** Plain, calm, non-alarmist, non-nagging. Explains "why" inline via short links.
  Never shows the owner CSS, media queries, pixel values, or the word "override". Commercial
  prompts are visible, understandable, never nagging, never a dead end.

## Evidence on Hand

- **All product data in this repository is illustrative placeholder and must stay visibly
  fictional:** "Shree Residency" / owner "Niraj Rawool" / Andheri West, Mumbai; every visitor
  count, enquiry, booking request, review, activity item, and any pricing (`src/data/managr.ts`).
  No real testimonials, customers, benchmarks, or case studies exist — do not fabricate them.
- Real and binding: the ManagR name, and the design foundation in `BEDR-DESIGN-SYSTEM.md` /
  `BEDR-FOUNDATION.md`.
- Authoritative product documentation exists: `BUILDER-PRODUCT-ARCHITECTURE.md` (the UX
  architecture), `ManagR_Website_Builder_Design_Brief.md` (the source brief),
  `BUILDER-lowfi-notes.md` (edge-case log + flagged product-decision assumptions),
  `WEBSITE-SECTION-CONTRACTS.md` (generated per-section field contracts, `npm run contracts`),
  `BUILDER-PRODUCTION-UX-QA.md` (browser-QA sign-off log), `TECH-STACK.md` (code architecture).
- Runnable: `npm run dev` → http://localhost:4173 (Vite). All backend data is mocked in
  `src/data`; the real product reads live data from the ManagR backend per owner.

## Product Principles

1. **The owner cannot break it.** A fixed catalogue of pre-built sections — no free canvas, no
   arbitrary nesting, no raw CSS, no writing of operational data. Every action is bounded so
   the site cannot become broken, unsafe, or self-contradictory.
2. **One source of truth.** A field is owner-editable or ManagR-bound, never both. Bound
   values are always live and clearly labelled "From ManagR · Edit in ManagR →".
3. **Honest by construction.** Stale availability stops showing as live; tenant identity
   physically cannot reach the public site; "approximate map" is said plainly; an empty site
   gets a real screen, not a blank grid under the owner's name.
4. **Phone-first, low-tech-first.** Designed for a 45–60-year-old owner on an old Android in a
   corridor: big targets, plain words, one thing at a time, the whole flow finishable on
   mobile.
5. **Deliberate, reversible publishing.** Draft → Preview → Live is never conflated; every
   destructive action prefers Undo or a pre-saved snapshot; a bad publish is genuinely
   recoverable through version history.
6. **Commercial pressure that respects the user.** Advanced prompts appear where the owner
   feels the limit, always as one component: what it does → what Basic does instead → see
   Advanced. Dismissible, never nagging, never a dead end. Nothing is destroyed on lapse.

## Accessibility & Inclusion

- Owner flows: ≥44px tap targets, visible focus, keyboard-navigable editor, labelled controls,
  errors tied to their fields, never colour-only meaning, text reflows on zoom.
- Weak-network reality: the editor uses a save queue with honest offline wording; the visitor
  site loads key information (rent, area, call) before images, with skeletons and progressive
  images.
- i18n: English now; layouts must tolerate ~1.8× string length; no text baked into images; no
  fixed-width labels or fragile buttons. The visitor site is first to be localised (Hindi,
  Marathi, Kannada, Telugu, Tamil).
