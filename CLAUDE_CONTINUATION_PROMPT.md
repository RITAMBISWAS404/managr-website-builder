# CLAUDE_CONTINUATION_PROMPT.md

You are picking up an existing, working project: the **ManagR Website Builder**. This is
not a greenfield task and not a redesign. Read `CLAUDE_HANDOFF.md` at the project root in
full before doing anything else — it is an accurate, code-inspected record of the current
architecture, settled decisions, rejected approaches, and unfinished work. It exists
specifically so you don't have to re-derive context by reading every file, and so you
don't accidentally undo work that was already deliberately done.

## How to treat the codebase and the handoff

- **The codebase is the source of truth for what exists.** `CLAUDE_HANDOFF.md` is a map of
  it, not a replacement for reading the actual file when you're about to change it. If the
  handoff and the code ever disagree, trust the code and note the discrepancy.
- **`BUILDER-PRODUCTION-UX-QA.md`** is the detailed, round-by-round log behind the
  handoff's summary of "work performed this session." Before touching any non-editor
  Website page, skim its most recent sections — it records exact before/after changes and
  the reasoning, which is the fastest way to avoid re-doing or reversing something.
- **`PRODUCT.md`, `BUILDER-PRODUCT-ARCHITECTURE.md`, and `TECH-STACK.md`** are the
  authoritative product/architecture references. Read the relevant one before any
  product-shape or architecture decision, not just the handoff's summary of it.

## Preserve settled decisions

`CLAUDE_HANDOFF.md` §7 and §10 list decisions that are **settled** and approaches that were
**tried and rejected**. Treat both as binding unless the user explicitly asks you to revisit
one. In particular, do not:
- Reintroduce opacity-modifier classes (`bg-brand/[0.06]`, `border-destructive/25`, etc.)
  on hex-format CSS custom properties — this bug was found and fixed repeatedly this
  session. Use the precomputed solid tokens instead.
- Touch `/website/editor`'s desktop-only editing rule, or its responsive strategy, unless
  asked. It is a deliberate product decision, not an unfinished responsive implementation.
- Revert the Design popup to a theme-picker "Style," or to the Split-Preview / Bottom-Sheet
  directions explored in `/design-lab` — Continuous Sheet is the shipped decision.
- Add `mx-auto` to the `Page` component, or otherwise change how management pages anchor
  horizontally, without understanding why it's currently left-anchored (handoff §7.3).

## How to use the installed skills

Skills are listed with their intended roles in `CLAUDE_HANDOFF.md` §18. In short:
`impeccable` is the primary audit/refinement lens; `frontend-design`, `apple-design`, and
`emil-design-eng` are composition/interaction/polish lenses; `web-design-guidelines` is the
final accessibility/implementation QA gate. Do **not** use `prototype` for incremental
refinement of existing, settled screens — it's for structural exploration, and was
explicitly excluded from this project's refinement work. Use skills as complementary
lenses on a decision you're already making, not as a reason to redesign something that
already works.

## How to behave

- **Inspect before you change.** Read the actual file, and check the relevant section of
  `CLAUDE_HANDOFF.md`/`BUILDER-PRODUCTION-UX-QA.md`, before editing anything — especially
  shared components in `src/components/common/index.tsx`, which affect many pages at once.
- **Make ordinary UI/UX decisions yourself** once you understand the existing system —
  don't ask the user to choose between layouts for problems the existing patterns already
  answer. Do ask before reversing a settled decision, committing/pushing git changes, or
  making a product-shape decision that isn't covered by the existing docs.
- **Verify like this session did:** `npx tsc --noEmit`, `npm run build`, `npm run contracts`
  (diff it — it should only change if you touched section contracts), and live browser
  checks (not just source review) for anything visual, including a console-error check and
  a couple of responsive-width spot checks.
- **Don't install or remove dependencies, don't introduce a second component library or
  animation framework, don't add a backend** — the stack is deliberately minimal (see
  handoff §2). If a task seems to require one of these, flag it to the user rather than
  deciding alone.
- **The working tree is currently uncommitted** (handoff §20). Don't assume you should
  commit or push — ask first, since several rounds of distinct work are mixed together in
  the tree.
- **When in doubt about scope** (is this page/file in scope for what I was asked to do?),
  default to the narrowest reasonable interpretation and say so, rather than expanding
  scope on your own judgment — this project has repeatedly drawn a hard line around the
  editor being out of scope for general workspace refinement, and that pattern of
  deliberate, stated scope boundaries should be assumed to continue.
