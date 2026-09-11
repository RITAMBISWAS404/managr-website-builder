# ManagR · Website Builder Design Brief

**For UI/UX Designer**  
**From:** Product & Engineering  
**Date:** 7 September 2026  
**Status:** Basic tier partly built · Advanced tier undefined

---

## Contents

1. Who it is for
2. What exists today
3. Rules of the system
4. The two plans
5. Switching it on
6. Upgrading
7. The editor
8. Live inventory
9. Visit calendar
10. Enquiries & bookings
11. Everywhere rules
12. Future scope
13. What we need
14. Open questions
15. Glossary

---

# 01 · Who we are designing for

## The owner — the person using the builder

Runs between 1 and 40 properties. Most run 1 to 5.

Age 30 to 60. Often not the person who is good with computers — sometimes their son, daughter or office manager does the setup.

Phone first. A large share will do this entire flow on a five-year-old Android, standing in a corridor. Desktop exists but is not the default.

Their marketing today is a board outside the building, a WhatsApp group, a Justdial listing, a broker, and word of mouth.

**What they actually want:** a link. One link for their WhatsApp bio, their Instagram, their visiting card and their board, that makes them look like a real business rather than a room in someone's flat.

**What they fear:** looking cheap, being copied by a competitor, exposing their tenant list, and paying for something they cannot see working.

## The owner's staff

Managers and wardens who update bed status daily. They will never open the website builder, but their data entry is what keeps the public site honest.

If the site publishes availability, their sloppiness becomes public. The design has to account for that.

## The visitor — the person the website is for

Students, first-job professionals, and their parents, who are frequently the ones who actually call.

Arrives from a WhatsApp forward, an Instagram link, a Google search, or a QR code on the building gate.

Almost entirely mobile, on a slow connection, watching their data.

Wants, in this order:

1. Photos
2. Rent
3. Location
4. Is it free now
5. How do I call

Distrusts brokers. **“Direct from owner, no brokerage”** is a genuine selling point, not a slogan.

---

# 02 · What exists today

A first version of the Basic website is already built. Treat it as a working prototype to improve on, not a design to preserve.

## The owner's side

One **Website** tab inside Settings.

It stays locked until their first property is approved.

After that:

- A field to choose their web address with live availability checking
- A headline
- A short about paragraph
- A contact number
- An email
- An office address
- Their live link with copy and open buttons
- A single live-or-offline toggle

## The visitor's side

Two pages:

### Property list

- Brand bar
- Headline
- Grid of cards showing:
  - Photo
  - Name
  - Area
  - Starting rent
  - Sharing types
- Footer with the owner's contact details

### Property detail page

- Photo gallery
- Room types with rent and deposit
- Amenities
- Services
- House rules
- Approximate map
- Sticky card with a phone button and a WhatsApp button

## What Basic deliberately does not have

- Enquiry form
- Availability
- Visit booking
- Customisation beyond text
- Logo
- Choice of layout

These are what Advanced is for.

## On visits and bookings

Self-serve visit scheduling and booking requests were built once already and have since been taken out of the live product, because a newer feature replaced them on the marketplace side.

That work is not lost — we will recover it and reuse it for Advanced, where it belongs.

Sections 09 and 10 describe something we have shipped before and know the shape of. Design them fresh; the machinery behind them already exists.

---

# 03 · Rules of the system that shape every screen

These are product truths. Please design around them rather than against them.

| Rule | Why it exists | What it means for you |
|---|---|---|
| Content comes from the dashboard, not the builder | One source of truth. An owner who edits rent on their website but not in the system will sell a room at the wrong price. | The editor styles and arranges. It never lets anyone retype a rent, a room count or an amenity. Where a section shows live data, say so, and link to where it is edited. |
| Only approved properties appear | Properties are reviewed before going public. | Show a property still under review, greyed out, with an explanation. An owner who cannot see why their property is missing assumes the site is broken. |
| The web address is chosen once | It gets printed on boards and pasted into WhatsApp groups. Changing it breaks links they cannot fix. | The claim step needs weight. Show the full address as they type, confirm before committing, then show it locked with a route to support. |
| The exact address of a property is never public | Owners are protected from brokers scraping them. | Maps are approximate. Say so without sounding evasive. |
| The site can be taken offline at any time | Owners go on holiday, fill up, or have a dispute. | A clear, reversible offline state with an honest description of what visitors see. |
| An empty site is worse than no site | A blank grid under someone's own name embarrasses them. | “No properties yet” and “live but empty” are first-class screens, not afterthoughts. |

---

# 04 · The two plans

## Basic

Basic is the free, zero-effort site.

The owner picks an address and it exists.

It answers one question:

> Does this business look real, and how do I call them?

## Advanced

Advanced is the paid tier.

It contains everything in Basic, plus three capabilities that turn a brochure into a working front desk:

- Live inventory
- Their own visit and booking calendar
- The website editor

## Design implications

We may charge for Basic later too, depending on demand.

Design the plan and billing surfaces so Basic can move from free to paid without a redesign.

The following should exist as components from day one:

- Plan badge
- Plan page
- Renewal state
- Lapsed state

Even while Basic reads **Free**.

## Capability matrix

| Capability | Basic | Advanced |
|---|---:|---:|
| Their own web address | Yes | Yes |
| Property list and detail pages | Yes | Yes |
| Photos, rent, room types, amenities, rules | Yes | Yes |
| Approximate map | Yes | Yes |
| Call and WhatsApp buttons | Yes | Yes |
| Headline, about, footer contact | Yes | Yes |
| Take the site offline | Yes | Yes |
| Their own logo | Default mark | Yes |
| Their own colours and fonts | Our palette | Yes |
| Choose and rearrange page sections | Fixed layout | Yes |
| Extra pages — about, gallery, FAQ, contact | No | Yes |
| Enquiry form feeding their CRM | No | Yes |
| Live bed availability on property pages | No | Yes |
| Visit booking calendar | No | Yes |
| Booking / move-in requests | No | Yes |
| Discoverable on Google | Hidden | Yes |
| “Powered by ManagR” footer | Always | Optional |
| Custom domain of their own | No | Later |

## Where the upgrade conversation happens

Do not build one pricing page and stop.

The upgrade should be offered at the moment the owner feels the limit:

- In the editor when they open an Advanced-only section
- Next to the availability switch
- In the visits screen while they are manually typing in a visit a visitor could have booked
- As a nudge after the fact: **“3 people called you from your website this week. Let them book a visit themselves.”**

Each needs a locked-state treatment:

- Visible
- Understandable
- Never nagging
- Never a dead end

---

# 05 · Flow A — Switching the site on

The first-run flow, and the one most owners will ever see.

It has to be finishable in under three minutes on a phone.

## Entry points

- Card on the dashboard home
- Sidebar item
- Nudge when their first property is approved
- WhatsApp message with a deep link

## Step 1 — Locked. No approved property yet

Explain:

- What the website is
- What it will look like
- What unlocks it

One action:

**Add a property**

A preview of a sample site matters here — most owners cannot picture what they are being offered.

## Step 2 — The unlock moment

Their first property is approved.

This should feel like a reward, not a settings change.

## Step 3 — Choosing the address

They type a name and see the full address form in front of them.

States:

- Empty with a suggestion pre-filled from their business name
- Checking
- Available
- Taken
- Too short
- Invalid characters
- Reserved word

The suggestion matters. A blank box makes people freeze.

## Step 4 — Confirming the address

Because it is permanent:

- Show the final address large
- Ask them to agree
- Make the permanence clear

## Step 5 — What visitors see

Fields:

- Headline
- About
- Contact number
- Email
- Office address

Every one has a sensible fallback, so the whole step should be skippable.

Design the skip path.

## Step 6 — It is live

Show the link prominently, with:

- Copy
- Open
- WhatsApp share
- QR code

The QR matters — owners print it and stick it on the gate.

## Step 7 — The steady state

What they see on every later visit:

- Their link
- Live or offline indicator
- Fields they filled
- Eventually a simple count of visitors and calls

## Live but empty warning

Also design the state where:

> Your site is live but has nothing on it

This happens when a property gets unpublished later.

---

# 06 · Flow B — Upgrading to Advanced

Keep this short. Owners abandon long payment flows.

## The offer

Show what they get in their language, with pictures rather than a feature list.

Three headlines:

1. Show what's free
2. Let people book visits
3. Make it look like yours

## Price and cycle

- Monthly
- Yearly
- Show the yearly saving

## Payment

Online by default.

Some owners will want:

- Bank transfer
- A salesperson to arrange it

Design the **Talk to us** fallback.

## Success

Drop them straight into the editor with everything unlocked.

Do not send them back to a settings page.

## Plan states

- Active
- Renewing on a date
- Payment failed
- Expired

## Advanced lapse

Current thinking:

- Site stays up
- Site quietly falls back to Basic appearance
- Availability switches off
- Booking switches off

The owner needs a clear, non-punishing warning first.

---

# 07 · Flow C — The website editor

This is the largest piece of design work in the project.

## The mental model

Not a blank canvas with draggable boxes.

Owners are not designers, and a free-form editor produces sites that embarrass them and us.

Instead:

A website is made of sections stacked down a page.

The owner:

- Picks which sections appear
- Chooses their order
- Fills in a handful of choices for each

Every section is designed by you and cannot be broken.

Think:

> Choose your rooms and their order

Not:

> Draw your house

## What the editor has to do

- Show a live preview with their real properties
- Switch between phone and desktop, phone first
- List the sections on the page
- Add sections
- Remove sections
- Reorder sections
- Hide sections
- Open a section and change its few settings
- Set global brand choices once:
  - Logo
  - Colours
  - Fonts
  - Browser-tab mark
- Work on a draft
- Preview it
- Publish deliberately
- Ensure half-finished edits never leak onto the live site
- Undo
- Discard all unpublished changes
- Save automatically

## Mobile editing

The editor has to work on a phone.

A side-by-side editor and preview does not exist on a 360-pixel screen.

We need a genuine mobile editing experience, not a “please use a computer” message.

This is one of the main reasons we want a designer on this.

## Section catalogue

### Structural — always present, editable, not removable

| Section | What the owner controls |
|---|---|
| Header / brand bar | Logo, which links appear, whether the call button shows |
| Footer | Contact details, about text, social links, whether “Powered by ManagR” shows |

### Optional sections

| Section | Purpose | Owner controls |
|---|---|---|
| Hero banner | The first impression | Headline, sub-line, background image or a property photo, main button |
| Properties | The core of the site | How many, order, card style, whether availability shows |
| Highlights | Trust — meals included, CCTV, walk to metro | Pick from existing property features or write their own, with icons |
| About us | Their story | Text, one photo |
| Photo gallery | Photos across all properties | Which photos, how arranged |
| Reviews | Social proof | Which reviews to feature |
| Enquiry form | Turns a visitor into a lead | Which fields, where enquiries go |
| Visit booking | See Section 09 | Which properties accept visits |
| FAQ | Reduces repeat phone calls | Question and answer pairs, with common ones suggested |
| Areas covered | For owners with several buildings in a city | Which areas to list |
| Offer banner | “₹1,000 off this month” | Text, dates, colour |
| Contact | Phone, WhatsApp, email, map, hours | Which channels show |

## Per-section states to mock

Every relevant section should cover:

- No content yet
- Hidden
- Locked because it needs Advanced
- Unable to show because the underlying data is missing

Example:

A Reviews section for an owner with no reviews.

## Themes and templates

We would like three to five complete looks an owner picks in one tap and is done.

Suggested themes:

- Clean modern
- Warm family-run
- Premium co-living

Each theme sets:

- Colours
- Fonts
- Corners
- Cards
- Spacing

Then allow overrides on top from curated palettes, not a raw colour picker.

An owner given a colour wheel may pick something that makes their text unreadable, creating support issues.

### Themeability constraint

Every component has to survive having its brand colour swapped.

Build the system with that constraint rather than designing against one palette.

## Guardrails and honesty

The editor should make a bad-looking site impossible, not merely discouraged.

Requirements:

- Text always readable
- Images always fitting
- Layout never breaking on a phone
- Good default mark generated when there is no logo

The site shows real prices and real availability.

That is its advantage over a designed-once brochure, and also its risk.

A site saying **“2 beds free”** when there are none loses the owner a customer and gets us blamed.

Wherever live data appears, it should carry a quiet sense of when it was last confirmed.

---

# 08 · Flow D — Live inventory on the public site

## What our inventory actually looks like

The owner's inventory is a hierarchy that already exists in ManagR:

**Property**

One building

↓

**Flat**

A unit on a floor

↓

**Room**

With a sharing type

↓

**Bed**

What is actually sold

## Bed statuses

Every single bed carries one status, maintained daily by the owner's staff:

| Status | Meaning |
|---|---|
| Vacant | Free, can be taken today |
| Occupied | Someone lives there |
| Notice | Occupied, but the tenant has given notice |
| On hold | A token is paid, it is spoken for |
| Blocked | Deliberately off the market — repairs, personal use |

## The date-based availability model

A bed can be occupied today and still available from a date.

Example:

> A tenant leaves on the 13th, so the bed is free from the 14th.

The owner may also set a few clear days between one tenant leaving and the next arriving, for cleaning.

A bed can be occupied today and already promised to someone from a future date.

In the dashboard that shows as:

> Next: Niraj, 15 Aug

Therefore:

**Public availability is never a simple yes or no. It is a date.**

The design has to express:

> Free from the 15th

as naturally as:

> Free now

## What the visitor should see

Design at least these three levels of disclosure so the product can choose, and owners can choose, how much to reveal.

### Level 1 — Property level

On a card and at the top of a property page.

Examples:

- Rooms available
- 3 beds available
- Filling fast
- Fully booked — available from 20 Sept

Simple, low risk, probably what most owners will use.

### Level 2 — Room type level

Inside a property page, on each room type row.

This is where the real value may be.

Example:

**Triple sharing**  
₹9,000/mo · ₹18,000 deposit  
2 beds available now

**Double sharing**  
₹12,000/mo · ₹24,000 deposit  
Full — next free 15 Sept

**Private room**  
₹18,000/mo · ₹36,000 deposit  
1 bed available now

### Level 3 — Bed level

A visual of the room showing which beds are taken.

High trust and very persuasive, but it exposes how the owner runs their building, and some will hate it.

Design it as an owner-controlled option, and show a tasteful version.

## What must never appear publicly

Non-negotiable.

Design so it is impossible to reveal:

- Tenant names
- Tenant photos
- Tenant phone numbers
- Tenant documents
- The reason a bed is blocked
- The exact street address of a property
- Which specific bed a specific person is in

The dashboard shows tenant names on beds.

The public site must not.

The design should make that boundary visually obvious to the owner while they configure it.

## The owner's controls

Allow owners to:

- Turn public availability on or off globally
- Turn public availability on or off per property
- Choose the level of detail from the three levels above
- Choose whether to show a “from” date when a property is full
- Optionally hide exact numbers and show only:
  - Available
  - Filling fast
  - Full

This is for owners who do not want competitors counting their empty beds.

## Trust and freshness

If a property's bed data has not been touched in weeks, we should not present it as live.

### Visitor freshness signal

> Availability updated today

This sells confidence and gently pressures the owner to keep data current.

### Owner warning

> Your website is showing availability you last updated 22 days ago.

## States to cover

- Everything free
- Partly free
- Fully booked with a known free date
- Fully booked with no known date
- Availability turned off by the owner
- Property under maintenance
- Property temporarily hidden

---

# 09 · Flow E — The visit calendar

Today a visitor calls, the owner writes the visit into the dashboard by hand, and a WhatsApp confirmation goes out.

Advanced should let the visitor book the visit themselves, within the rules the owner sets.

This flow existed before and was removed when a newer feature took its place. We will recover and reuse it here, so treat it as a redesign of something real.

## What the owner already configures

All of this exists in the product and needs a home in the website builder:

- Which days of the week the property accepts visits
- Which time slots, from a fixed catalogue
- One-tap presets:
  - Mornings only
  - Evenings only
- Blackout dates — festivals, days they are away
- A buffer — how many days before a bed frees up they are willing to show it
- Visit types:
  - In person
  - Video walkthrough

The current owner-side interface for this is functional and plain, and deserves a proper pass — especially the weekly-availability picker, the piece owners touch most.

Also consider:

- How many visits fit in one slot
- How much notice they need
- How far ahead someone can book

## Visitor booking flow

Roughly:

1. Choose property
2. Choose what they are looking for
3. Choose a date
4. Choose a time
5. Give name and phone
6. Confirm

## Decisions to explore

### Number of steps

How many steps?

- One screen
- Several screens

Every extra step loses people; so does a single crowded screen.

### Phone verification

Should the visitor be verified by a one-time code?

A one-time code cuts fake bookings but is a real drop-off point.

Possibility:

- Only for repeat bookings
- Or same-day bookings

### Dates with no slots

How do we show a date with no slots left without making the calendar a wall of unavailable dates?

### Confirmation

Follow-up arrives on WhatsApp, not email.

Consider:

- Save to calendar
- Directions
- Owner's number

## Additional visit states

Also design:

- Reschedule
- Cancel
- Reminder the day before
- Property filling up after the visitor starts booking
- Booking conflict / race condition

## What the owner sees afterwards

The visit appears in their **Scheduled Visits** screen:

- Monthly calendar
- Colour-coded statuses
- Table view
- Day sidebar
- Filters

It should be obvious at a glance that this one came from their own website.

That is the proof the plan is paying for itself.

The screen exists and works, but its status colour system has grown to eleven values and needs rationalising.

Include it in scope.

---

# 10 · Flow F — Enquiries and booking requests

## Enquiry

The simplest and most valuable addition to the site.

A short form:

- Name
- Phone
- What they are looking for
- When they want to move in
- Budget

This becomes a lead in the owner's CRM, tagged as having come from their own website.

The CRM already tracks leads by source, with statuses the owner drags between columns.

A lead from their own site should look visibly different from a marketplace lead, because it cost them nothing.

## Enquiry design scope

Design:

- Form
- Inline version that can sit in several sections
- Floating Enquire button on mobile
- Success state
- Duplicate enquiry case

## Booking request

A step beyond an enquiry.

The visitor asks to actually take a bed.

They:

1. Pick a room type
2. Pick a move-in date
3. The system checks whether a bed can be free by then

This uses exactly the date logic in Section 08.

This flow, like visit booking, was built and then retired.

It comes back for Advanced.

### Important state 1 — Cannot meet the requested date

The system knows the earliest date that room type can be ready.

Design this as a helpful redirection:

> That room type is free from 2 March. Book for then?

Not as a rejection.

### Important state 2 — Awaiting the owner

The request sits with the owner to approve or decline.

The visitor needs to know:

- What happens next
- Roughly when they should expect an answer

### Payment extensibility

Whether money changes hands on the owner's own site is an open product question.

The marketplace already runs token payments and online agreements.

Design the flow so a payment step can be inserted later without restructuring the flow.

For now, mock the version without payment.

---

# 11 · Things that apply to every screen

## Mobile is the product

Owner side and visitor side both.

Design phone first and let desktop be the adaptation.

## Bad connection

Assume a bad connection.

Requirements:

- Light pages
- Progressive images
- Nothing important depending on speed

## WhatsApp, not email

Sharing, confirmations, reminders and receipts all travel over WhatsApp in this market.

Design those moments around it.

## Language

English now.

Hindi, Marathi, Kannada, Telugu and Tamil are likely later, on the visitor-facing site first.

Leave room for longer strings.

Avoid designs that break when a label doubles in length.

## Empty, loading and error states

For a new owner, the empty state is the product for the first week.

At minimum:

- No properties
- No photos
- No availability data
- No reviews
- No enquiries
- Site offline
- Property under review
- Plan lapsed
- Something went wrong

## Trust markers

> Direct from owner, no brokerage

This performs well and should be designed properly, not dropped in as small print.

## Accessibility

- Large tap targets
- Real contrast
- Text that survives zooming

Many parents using these sites are over 50.

---

# 12 · Separate scope — Future scope

None of this is in the current build.

It is here so the designer can see where this is going and design a system that grows into it rather than a set of screens that will need replacing.

Nothing below is committed.

## The site itself

- Their own domain name
  - Most-requested thing after launch
  - Clearest reason a serious owner pays
  - Guided flow for people who have never touched a domain
  - “We'll do it for you” path
- More themes, including seasonal and festival variants
- Pages they write themselves:
  - Meals and menu
  - House rules
  - Careers
  - Blog
- Google discoverability
- Area-by-area landing pages
- Rich search results
- Google Business Profile connection
- Instagram connection
- Photos and reviews flowing in without extra work
- A page per locality for owners running buildings across a city

## Richer presentation

- Video tours
- Virtual walkthroughs
- Floor plans
- Reviews and ratings on the public site
- Nearby landmarks:
  - Colleges
  - Offices
  - Metro stations
  - Gyms
- Compare properties for owners with several buildings

## The site as a front desk

- Online booking end to end:
  - Token payment
  - Rental agreement
  - Digital stamping
  - Electronic signature
- Tenant login area on the owner's site:
  - Pay rent
  - Download receipts and invoices
  - View agreement
  - Raise a complaint
  - Apply to vacate
  - See notices
- WhatsApp assistant answering routine questions:
  - Rent
  - Availability
  - Food
  - Timings
- Call tracking

## Growth and measurement

A simple analytics view:

- Visitors
- Calls
- WhatsApp taps
- Enquiries
- Visits booked
- Bookings
- What the website earned them this month

Keep it in plain language.

Conversion-rate charts may not land with this audience.

Also:

- Offers
- Coupons
- Referral links
- Broadcast to past enquiries when a room frees up
- A/B testing of hero and headline, run by ManagR

## Scale and operations

- Multiple brands under one owner
- Sub-brand sites under a shared parent
- Franchise sites
- Staff-facing mobile screens for updating bed status from the corridor
- Team member who only manages the website
- Website-only permissions

The permission system already supports this; the website currently sits inside general settings.

---

# 13 · What we would like from you

## Owner journey

A flow map of the owner's journey:

- Discovering the website
- Switching it on
- Upgrading
- Editing
- Living with it week to week

## Owner-side wireframes

- Website home in the dashboard
- Setup
- Editor
- Availability settings
- Visit settings

## Visitor-side wireframes

- Home
- Property list
- Property detail
- Enquiry
- Visit booking
- Confirmation

## High fidelity

Main screens in:

- Phone
- Desktop

## Themes

Three to five complete themes showing the same site under each.

## Component system

A deliberately themeable component system.

The whole point is that hundreds of different owners' brands run through the same components.

## States

All states listed throughout this brief.

We will keep asking about these.

## Clickable prototype

Two flows matter most:

1. Owner switching their site on
2. Visitor booking a visit

---

# 14 · Open questions to decide together

1. **How much inventory detail should a public site show by default?**
   - Instinct: room-type level, off by default, opt-in by owner
   - We may be wrong

2. **Should the visitor be verified by a one-time code before booking a visit?**
   - Fewer fake bookings
   - Real drop in completed bookings is possible

3. **One page-builder screen, or a set of simple settings forms with a preview?**
   - The second is far easier for owners
   - The first may be more impressive in a sales demo

4. **On a phone, how does an owner meaningfully edit and preview at the same time?**

5. **When Advanced lapses, what does the site do?**
   - Current thinking: quiet fallback to Basic
   - Is there a kinder way?

6. **How prominent should “Powered by ManagR” be on a paid site?**

7. **Is a shared visit calendar across a multi-property owner useful, or does every property need its own?**

---

# 15 · Glossary

| Term | Meaning |
|---|---|
| **ManagR** | The software owners use to run their business. The website builder lives here. |
| **BedR** | Our public marketplace where people search for a place to stay. Separate from the owner's own website. |
| **Owner / organisation** | The business running one or more properties. |
| **Property** | One building or address. |
| **Flat** | A unit inside a property, on a floor. |
| **Room** | A room inside a flat, with a sharing type. |
| **Bed** | The thing that is actually sold. Inventory is counted in beds, not rooms. |
| **Sharing type** | How many people share a room — private, double, triple, and so on. |
| **Lead / enquiry** | Someone who has shown interest but not committed. |
| **Visit** | A scheduled viewing of a property. |
| **Booking request** | A request to take a bed from a given date, pending the owner's approval. |
| **Token** | A part-payment that holds a bed. |
| **Basic / Advanced** | The two website plans. |
| **IMS** | Inventory management — the bed status system in Section 08. |

---

**ManagR · Website Builder design brief · 7 September 2026**
