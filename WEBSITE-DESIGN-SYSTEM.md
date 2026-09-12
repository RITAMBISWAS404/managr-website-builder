# ManagR Website Builder — Design System

Source of truth for the **Website workspace** (`/website` and its sub-pages), derived
directly from the shipped implementation — `tailwind.config.ts`, `src/styles/globals.css`,
and `src/components/common/index.tsx`. Not a Figma reference and not aspirational: every
value below is already in the codebase and in use today.

This document exists so the next page-level refinement (Settings, Availability, Enquiries,
Bookings, Visits, Plan, Health) reuses the same semantic roles instead of re-deriving them
from scratch or drifting into one-off values.

`BEDR-DESIGN-SYSTEM.md` / `BEDR-FOUNDATION.md` remain the source of truth for the
Figma-original BEDR product (Dashboard, Properties, Leads & CRM) and for the raw brand
tokens (navy sidebar, coral primary, Plus Jakarta Sans). This document is the
implementation-level layer built on top of those tokens specifically for the Website
workspace's own component language — it doesn't replace or duplicate them.

---

## 1. Typography — semantic roles

The type scale is defined once, in `tailwind.config.ts` → `theme.fontSize`. Every role below
maps to one of those tokens — never an arbitrary size. If two pieces of text serve the same
role, they use the same token; there is no "close enough."

| Role | Token | Size / line-height | Weight | Tracking | Color | Where |
|---|---|---|---|---|---|---|
| Page title | `text-display` | 24 / 29 | `font-bold` | -0.022em | `text-foreground` | `PageHead`'s `<h1>`; WebsiteHome's own hand-styled `<h1>` (must match `PageHead` exactly since it doesn't use the component) |
| Page subtitle | `text-body` | 14 / 20 | regular | — | `text-muted-foreground` | `PageHead`'s description paragraph |
| Section eyebrow | `text-micro` | 10.5 / 14 | `font-bold` `uppercase` | **0.07em** | `text-faint` | `SectionHeader` — "YOUR WEBSITE", "THIS WEEK", "MANAGE". Every uppercase micro-label on the page must use `tracking-[0.07em]`, not `0.06em` — this was a real drift bug, fixed everywhere in this workspace. Do not reintroduce `0.06em`. |
| Card heading | `text-section` | 15 / 21 | `font-bold` | -0.006em | `text-foreground` | `SettingsCard`'s `<h3>`; `FactCard`'s heading ("Health", "Plan"); the identity name in the Website card |
| Card primary value / status | `text-section` (prominent) or `text-sm` (secondary) | 15/21 or 13/18 | `font-bold` / `font-semibold` | — | semantic (see §2) or `text-foreground` | `StatusBadge` — the dot+text status pattern. Use `text-section font-bold` when the status **is** the card's main point (e.g. the "Live" line in the Website card); use `text-sm font-semibold` when it's a supporting line under a heading that already carries the weight (e.g. `FactCard`'s "2 to review" under "Health") |
| Card description | `text-caption` | 12 / 16 | regular | — | `text-muted-foreground` | `SettingsCard`'s description line |
| Body text | `text-body` | 14 / 20 | regular/medium | — | `text-foreground` | Field values, paragraph copy inside cards |
| Supporting/metadata text | `text-caption` | 12 / 16 | regular | — | `text-muted-foreground` | Timestamps, secondary explanations, list-row metadata |
| Metric value (stat) | `text-[28px]` (bespoke, `MetricCard` only) or `text-title` (`Stat`) | 28/none or 19/25 | `font-bold` `tabular-nums` | -0.018em (title) | `text-foreground` | `MetricCard`'s big number; `Stat`'s value. **Never** `text-display` for an in-card number — that token is reserved for the page `<h1>`. This was a real bug (Analytics' revenue figure), already fixed. |
| Button label | `text-sm` / `text-caption` (by size) | 13/18 or 12/16 | `font-semibold` | — | variant-dependent | `buttonVariants` — size sets the type scale, not the page |
| Table header | `text-micro` | 10.5 / 14 | `font-bold` `uppercase` | 0.07em | `text-faint` | Same eyebrow token as section headers — a table header is an eyebrow, not its own role |

**Rule of thumb:** primary text is always `text-foreground`; secondary is always
`text-muted-foreground`; tertiary/metadata is always `text-caption text-muted-foreground` or
`text-faint`. A number inside a card is never larger than `text-title` (19px) unless it is
`MetricCard`'s own bespoke 28px stat digit — and never uses the page-title token.

---

## 2. Color — semantic roles

All colors are CSS variables in `src/styles/globals.css`, surfaced as Tailwind tokens. Never
hardcode a hex value in a component; reference the token.

| Role | Token | Use |
|---|---|---|
| Primary text | `text-foreground` (`#111111`) | Headings, primary values, names |
| Secondary text | `text-muted-foreground` (`#5f6368`) | Descriptions, captions, supporting lines |
| Faint/tertiary text | `text-faint` (`#8a8d92`) | Eyebrows, disabled-adjacent hints, chevron icons |
| Border | `border-border` (`#e8e8e8`) | Card/control borders |
| Subtle border / divider | `border-border-subtle` (`#eeeeee`) | Internal dividers within a card (`border-t border-border-subtle`) |
| Strong border | `border-border-strong` (`#dcdcdc`) | Hover state on an interactive card/tile |
| Surface | `bg-surface` / `bg-card` (`#ffffff`) | Elevated card background. Both resolve to the same white — `Card` itself emits `bg-card`, hand-rolled surfaces conventionally write `bg-surface`. Either is correct; don't invent a third. |
| Sunken/grouped surface | `bg-surface-2` (`#f7f8f9`) / `bg-sunken` (`#f1f2f4`) | A quiet inset region inside a card (e.g. `Segmented`'s track, a "wording" sub-panel) |
| Brand / action | `bg-brand` / `text-brand` (`#f7553d`) | Primary buttons, active nav, links |
| Success / live | `success` family (`#00875a`) | "Live", "ok" health status, confirmed states |
| Warning / attention | `warning` family (`#b45c09`) + `bg-warning-wash` | "attention" health status, a card that gently needs a glance (whole-card warm tint, not just a badge) |
| Destructive / error | `destructive` family (`#d33a29`) | Blocking health issues, destructive confirmations |
| Informational | `info` family (`#2261b6`) | `Callout`/`Notice` explanatory panels |
| Advanced / plan-tier | `advanced` family (`#7a35c9`) | **Only** for Basic/Advanced plan-tier gating (`AdvancedLock`, "Available with Advanced"). Never reuse this purple for a generic informational message — that was a real bug (Bookings' payment-roadmap note), already fixed to `info`. |
| Icon tint squares | `tint-{blue,green,amber,purple,coral,cyan}` + matching `-fg` | `IconTile` — one tint per semantic category (blue=identity/settings, green=availability/success-adjacent, amber=health/attention, purple=scheduling/advanced-adjacent, coral=brand/primary actions, cyan=analytics/utility) |

**Rule:** a status's color must match its real semantic weight. `advanced` (purple) means
"this is about your plan tier" and nothing else. `warning` means "worth a glance," not
"blocked." Don't pick a tint because it looks nice next to its neighbor.

---

## 3. Spacing

Spacing tokens are Tailwind's default scale plus the project's small extensions (`4.5`, `5.5`,
`7`, `13`, `15`, `18` in `tailwind.config.ts`). The rhythm that matters is semantic, not the
raw scale:

| Relationship | Value | Where |
|---|---|---|
| Page gutter | shell padding (`px-4 py-6 lg:px-8 lg:py-8`) | `ManagRShell`'s `<main>` — do not touch per-page |
| Section → section | `space-y-7` (28px) | `WebsiteHome`'s top-level sections; `PageBody` uses `space-y-5` (20px) for sub-page sections — the two densities are both established and intentional (Website Home has more, larger sections; sub-pages are denser) |
| Section eyebrow → its content | `mb-3` (12px) | `SectionHeader` |
| Card → card (in a row/grid) | `gap-3` (12px) | Health/Plan row, Manage grid, metric grid |
| Card padding | `p-4 sm:p-5` (compact cards) or `p-5 sm:p-6` (hero cards: Website identity, Next-action) | Establishes a two-tier padding system: hero cards get more room, supporting cards get less |
| Card header → card body | built into `SettingsCard` (`p-4 sm:px-5 sm:py-4` header, `p-4 sm:p-5` body, separated by `border-b`) | Don't hand-roll this split elsewhere — reuse `SettingsCard` |
| Icon → heading text | `gap-3` / `gap-4` (by icon size) | `FactCard`, `SettingsCard`, Manage tiles |
| Heading → description | `mt-0.5` (2px, tight — reads as one block) or `mt-1` (4px, for a value → detail relationship) | Title/subtitle pairs stay visually joined; a value → detail relationship gets slightly more air |
| Label → control (settings row) | `gap-3`/`gap-4`, control `shrink-0` | `ToggleField` |
| Semantically-different groups within one card, mobile only | `border-t border-border-subtle pt-4` | Established divider pattern (Settings' Menu card, the Website identity card's status/utility groups) — use only between genuinely different groups, never as decoration |

---

## 4. Card architecture

Five card patterns, each with one job. Don't invent a sixth without a real gap.

1. **`SettingsCard`** — the workhorse. Icon + title + description header (with a `border-b`),
   then body content, optional `footer` (with a `border-t`, `bg-surface-2`). Use for any
   settings group with real content (fields, toggles, lists).
2. **Hero action card** (hand-rolled, e.g. WebsiteHome's identity card and pending-publish
   card) — `rounded-2xl border border-border bg-surface shadow-e1 p-5 sm:p-6`, `lg:flex-row`
   on desktop. Reserved for the one or two most important things on a page.
3. **Destination card** (`FactCard`, Manage tiles) — the *entire* card is a `<Link>`: icon,
   a heading, one status/value line, trailing chevron. No inner button. Use when the card's
   only job is "glance at a state, then go look at the detail page." Don't add a button
   alongside the chevron — that's the Review-button anti-pattern already removed from
   Health/Plan.
4. **Callout / Notice** (`Callout` = `Notice`) — `border-l-[3px]` accent, tinted background,
   optional icon + title, body text. Use for explanatory or contextual information that
   isn't a card in its own right — "Where enquiries go," "Keeping it honest." Cap prose width
   inside it (`max-w-[640–760px]`) rather than capping the whole card.
5. **Stat/metric card** (`MetricCard`) — big tabular number top-left, icon top-right, label
   below. Use only for a genuine count/metric, never for a status or a setting.

Shared card geometry regardless of tier: `rounded-2xl` or `rounded-xl` (both resolve to the
same 14px radius — see `borderRadius` in the Tailwind config), `border-border`, `shadow-e1`
(hero tier) or `shadow-xs` (grid/utility tier).

**Mobile behavior for all five:** a card that has more than one semantically distinct group
(identity vs. status vs. actions) stacks those groups vertically below `sm`, with a
`border-t` divider marking a real semantic boundary — never relies on `flex-wrap` to decide
the mobile composition by accident.

---

## 5. Controls

| Control | Established treatment |
|---|---|
| Buttons | `buttonVariants` (`primary`, `outline`, `ghost`, `destructive`, `link`) × `size` (`xs` 28px, `sm` 32px, `default` 36px, `lg` 40px, `icon`/`icon-sm` square). Primary = filled brand. Outline = the default "secondary" action. Ghost = quietest, for dismiss/cancel-adjacent actions. Never invent a new visual button style. |
| Icon-only buttons | `size-8` (32px) grid-centered icon, `aria-label` required, wrapped in `Hint` for a tooltip. Compact-list-row scale across the whole app — not held to a 44px minimum, by established convention. |
| Toggles | Radix `Switch`, always paired with a label it's `aria-label`'d to or sits directly beside; on mobile the label+toggle pair spans the full row width (`justify-between`) so the toggle anchors to a true edge, never floats mid-row. |
| Segmented control | `Segmented` — `bg-sunken` track, `p-0.5`, pill buttons, active = `bg-surface shadow-xs`. **Full-width, equal-width segments below `sm`**; content-sized `inline-flex` at `sm` and up. This responsive rule lives in the shared component — don't re-implement per page. |
| Inputs / Selects | shadcn-pattern `Input`/`Select`, `border-border`, `rounded-lg` (10px), `h-9` default |
| Status pill / badge | `StatusBadge` — dot + text (inline) or a solid pill (`pill` prop) using the semantic status map (`live/ok/attention/action/off/pending/advanced`). Never build a one-off colored span for a status — always route through `StatusBadge`. |
| Chevron / navigation affordance | `ChevronRight` at `size-4`, `text-faint`, with a `group-hover:translate-x-0.5` nudge — the established "this card/row navigates" signal. Sufficient on its own; don't add "View"/"See more" text unless the destination is ambiguous without it. |

**Touch targets:** buttons and toggles use their established sizes (28–40px) consistently
across the whole workspace; this is the accepted, already-shipped standard — don't enlarge
one control in isolation to hit an external guideline number, that creates a new
inconsistency rather than fixing one.

---

## 6. Responsive principles

1. **Mobile is a different composition, not a shrunk desktop one.** Decide, per card, what
   groups exist semantically, then decide how those groups arrange at each width — don't
   just let `flex-wrap` decide by accident.
2. **Use the available width.** A card that's full-width on mobile should use that width
   (e.g. three labeled buttons spanning a row) rather than leaving a narrow control cluster
   with dead space beside it.
3. **Stack only when content needs it.** Two short pieces of info can stay inline even on a
   narrow card; stack when a label + control + status would otherwise compete for one line.
4. **Preserve semantic relationships across breakpoints.** A toggle's label doesn't change
   meaning between mobile and desktop — only the arrangement changes.
5. **Comfortable touch targets, not maximal ones.** Match the established control sizes
   (§5); don't inflate them per breakpoint.
6. **Avoid accidental wrapping.** If a row *can* wrap, decide deliberately whether it should,
   and at what breakpoint — encode that as an explicit `flex-col sm:flex-row` (or similar),
   not a bare `flex-wrap` left to resolve itself.
7. **Desktop stays horizontally efficient.** Don't stack cards on desktop that already read
   well side-by-side; don't force a mobile-derived layout upward just for consistency's sake.

---

## 7. What this document is not

- Not a redesign mandate. Every value above already ships in the product today.
- Not exhaustive — it covers the roles actually in use on the Website workspace. A new page
  that needs a role not listed here should extend this document deliberately, not invent a
  one-off.
- Not a reason to globally re-style existing pages in one pass. Bring a page into alignment
  with this document only when refining that page specifically.
