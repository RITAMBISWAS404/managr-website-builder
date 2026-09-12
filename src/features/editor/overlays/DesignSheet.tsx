import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdvancedLock } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { PALETTES, FONT_PAIRS } from "@/data/managr";
import { siteAccent } from "@/store/selectors";
import { useEditorUI } from "../EditorContext";

/* ============================================================================
   DESIGN — final production refinement pass on the Continuous Sheet.

   Structure is unchanged from Pass 2 and stays that way: one popup, one
   scroll area, three chapters (Style → Brand → Typography), no dots, no
   rail, no tabs. This pass corrects a real content-model mistake surfaced
   by the previous round's screenshots, then does a full visual/interaction
   audit of everything else.

   CORRECTION — Style is spacing, not a theme picker. The three cards here
   used to be curated visual themes ("Clean Modern" / "Warm Family-run" /
   "Premium Co-living"), a different, separate feature. Reviewing the actual
   screenshots against the brief, the decision (confirmed with the product
   owner) was to drop that theme picker from this popup entirely and make
   Style what the three equal cards actually need to answer: "how spacious
   should my website feel?" — Compact / Balanced / Airy, driven by the real
   `layoutDensity` field (which already supported all three values; only two
   were ever exposed in the UI). The theme field itself is untouched in the
   store — it simply has no control surface in Design any more, by product
   decision, not by omission.

   AUDIT FIXES this pass:
   - Logo container is now a true square (was a taller rounded rectangle),
     with predictable size and a centred placeholder, sitting next to a real
     `Button` — not floating text pretending to be one.
   - "Custom colour" / "Reset to style colour" are real `Button`s now (ghost/
     outline), not bare coloured text that could be mistaken for a caption.
   - "Website settings" is a `Button variant="link" asChild` — reads as an
     intentional action, not a stray underline in a sentence.
   - Colour swatches are square chips (matching every other selectable
     surface in this popup) with a `border-brand` selected ring — the same
     language the rest of the sheet already uses, so the checkmark-on-circle
     special case from the previous round is gone; one selection language,
     no exceptions.
   - Typography previews are roughly half their previous footprint — a
     heading, one supporting line and a button, sized to be scanned, not to
     simulate a website.
   - Zero decorative icons. The only icon that existed here (a check mark on
     round swatches) is gone now that swatches are square and use the same
     border language as every other card in the sheet. */

const PRESS = "transition-[border-color,box-shadow,transform] duration-150 ease-smooth active:scale-[0.98]";
const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function DesignSheet() {
  const ui = useEditorUI();
  const { advActive } = useDerived();
  const open = ui.overlay === "design";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && ui.close()}>
      <DialogContent className={cn("gap-0 overflow-hidden p-0", advActive ? "max-w-[560px]" : "max-w-md")}>
        <DialogHeader>
          <DialogTitle>Design</DialogTitle>
          <DialogDescription>Choose how your website looks.</DialogDescription>
        </DialogHeader>

        {!advActive ? (
          <div className="p-5">
            <AdvancedLock
              feature="Website design"
              what="Choose your website's spacing, your brand colour and logo, and a typography personality for your site."
              basic="the site uses the default ManagR look."
            />
          </div>
        ) : (
          <div className="max-h-[68vh] overflow-y-auto px-6 py-6 scrollbar-thin">
            <StyleSection />
            <div className="my-7 border-t border-border-subtle" />
            <BrandSection />
            <div className="my-7 border-t border-border-subtle" />
            <TypographySection />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <div className="text-section font-bold text-foreground">{children}</div>;
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{children}</div>;
}

/* ---------------------------------------------------------------------------
   STYLE — spacing/density. Three equally-weighted cards; the schematic (the
   same three bars, different gap) is proportioned from the real values
   WebsiteCanvas.tsx applies (px-6 py-4 / py-7 / py-10), so the preview never
   promises rhythm the site doesn't actually use.
--------------------------------------------------------------------------- */
const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "balanced", label: "Balanced" },
  { value: "spacious", label: "Airy" },
] as const;

function StyleSection() {
  const s = useS();
  const dispatch = useDispatch();
  const current = s.layoutDensity ?? "balanced";

  return (
    <section>
      <SectionHeading>Style</SectionHeading>
      <p className="mt-1 text-caption text-muted-foreground">Pick the overall visual direction for your site.</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {DENSITY_OPTIONS.map((d) => {
          const selected = current === d.value;
          return (
            <button
              key={d.value}
              type="button"
              aria-pressed={selected}
              onClick={() => { dispatch({ type: "setDesign", patch: { layoutDensity: d.value } }); toast(`Style: ${d.label}`); }}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl border bg-surface text-left",
                PRESS,
                selected ? "border-brand shadow-e1" : "border-border-subtle hover:border-border-strong hover:shadow-xs",
              )}
            >
              <DensitySchematic density={d.value} />
              <div className="px-2.5 py-2">
                <div className="text-caption font-semibold text-foreground">{d.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Same three content rows every time — only the gap between them (and the
 *  outer padding) changes, proportioned from the real per-density padding
 *  `WebsiteCanvas.tsx` applies to every section (16 / 28 / 40px), scaled
 *  down to fit a small card. */
function DensitySchematic({ density }: { density: (typeof DENSITY_OPTIONS)[number]["value"] }) {
  const pad = { compact: 6, balanced: 10, spacious: 14 }[density];
  const gap = { compact: 3, balanced: 6, spacious: 10 }[density];
  return (
    <div className="flex aspect-[4/3] w-full flex-col bg-[#fafafa]" style={{ padding: pad, gap }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex-1 rounded-sm border border-[#e2e4e8] bg-white" />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   BRAND — two distinct jobs, composed as two distinct groups: Logo (a
   square identity container + its actions, with the Website-settings
   pointer folded into a quiet info strip underneath, not floating in a
   sentence), then a hairline divider, then Brand colour (large rectangular
   swatches — colour is the primary visual element here, not a caption's
   accent dot). Every actionable control is a real `Button`; nothing is
   left as bare coloured text.
--------------------------------------------------------------------------- */
function BrandSection() {
  const s = useS();
  const dispatch = useDispatch();
  const accent = siteAccent(s);
  const [custom, setCustom] = React.useState(false);
  const [hex, setHex] = React.useState(accent);
  const [hexError, setHexError] = React.useState(false);
  const isPreset = PALETTES.some((p) => p.accent.toLowerCase() === accent.toLowerCase());

  const applyHex = () => {
    const v = hex.trim();
    if (!HEX_RE.test(v)) { setHexError(true); return; }
    setHexError(false);
    dispatch({ type: "setDesign", patch: { brandColor: v } });
    toast("Brand colour updated");
  };

  return (
    <section>
      <SectionHeading>Brand</SectionHeading>
      <p className="mt-1 text-caption text-muted-foreground">Your logo and colour — how visitors recognise you.</p>

      {/* ---- Logo ---- */}
      <div className="mt-4">
        <SubLabel>Logo</SubLabel>
        <div className="mt-2.5 flex items-center gap-3.5">
          <div className="grid size-16 shrink-0 place-items-center rounded-xl border border-border-subtle bg-sunken text-title font-bold text-muted-foreground">
            S
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <Button size="sm" variant="outline">Upload logo</Button>
            <p className="text-caption text-muted-foreground">No logo → a generated “S” mark.</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2.5">
          <p className="text-caption text-muted-foreground">Business name and contact details are managed in Website settings.</p>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <a href="/website/settings">Open →</a>
          </Button>
        </div>
      </div>

      <div className="my-5 border-t border-border-subtle" />

      {/* ---- Brand colour ---- */}
      <div>
        <div className="flex items-center justify-between">
          <SubLabel>Brand colour</SubLabel>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm ring-1 ring-inset ring-black/[0.1]" style={{ background: accent }} />
            <span className="font-mono text-caption text-faint">{accent.toUpperCase()}</span>
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {PALETTES.map((p) => {
            const selected = accent.toLowerCase() === p.accent.toLowerCase();
            return (
              <button
                key={p.key}
                type="button"
                aria-pressed={selected}
                aria-label={p.name}
                onClick={() => { dispatch({ type: "setDesign", patch: { brandColor: p.accent } }); setHex(p.accent); setCustom(false); toast(`Colour: ${p.name}`); }}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "h-12 w-full rounded-lg border-2",
                    PRESS,
                    selected ? "border-brand" : "border-transparent ring-1 ring-inset ring-black/[0.08] hover:ring-black/20",
                  )}
                  style={{ background: p.accent }}
                />
                <span className="text-[11px] font-medium text-muted-foreground">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" aria-expanded={custom} onClick={() => setCustom((v) => !v)}>
            {custom ? "Hide custom colour" : "Custom colour"}
          </Button>
          {!isPreset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { dispatch({ type: "setDesign", patch: { brandColor: null } }); setCustom(false); toast("Colour reset to style default"); }}
            >
              Reset to style colour
            </Button>
          )}
        </div>

        <div className="grid transition-[grid-template-rows] duration-200 ease-smooth" style={{ gridTemplateRows: custom ? "1fr" : "0fr" }}>
          <div className="overflow-hidden">
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-caption font-semibold text-foreground" htmlFor="brand-hex">Colour</label>
                <div className="flex items-center gap-2">
                  <span className="size-9 shrink-0 rounded-lg border border-border-subtle" style={{ background: HEX_RE.test(hex) ? hex : "transparent" }} />
                  <Input id="brand-hex" value={hex} onChange={(e) => { setHex(e.target.value); setHexError(false); }} placeholder="#F7553D" className="font-mono" />
                </div>
                {hexError && <p className="mt-1 text-caption text-destructive">Enter a valid colour, like #F7553D.</p>}
              </div>
              <Button size="sm" variant="primary" onClick={applyHex}>Apply</Button>
            </div>
          </div>
        </div>

        <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-caption leading-snug text-muted-foreground">
          Text, buttons and links automatically stay readable against any colour you choose.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   TYPOGRAPHY — curated type personalities. Compact specimens: a heading,
   one line, a button — enough to show personality, not a mock website.
--------------------------------------------------------------------------- */
function TypographySection() {
  const s = useS();
  const dispatch = useDispatch();
  const accent = siteAccent(s);

  return (
    <section>
      <SectionHeading>Typography</SectionHeading>
      <p className="mt-1 text-caption text-muted-foreground">How your website's words feel.</p>

      <div className="mt-4 space-y-2">
        {FONT_PAIRS.map((f) => {
          const selected = s.fontPair === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={selected}
              onClick={() => { dispatch({ type: "setDesign", patch: { fontPair: f.key } }); toast(`Typography: ${f.name}`); }}
              className={cn(
                "w-full rounded-xl border bg-surface p-2.5 text-left",
                PRESS,
                selected ? "border-brand shadow-e1" : "border-border-subtle hover:border-border-strong hover:shadow-xs",
              )}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-caption font-semibold text-foreground">{f.name}</span>
                <span className="text-caption text-faint">{f.note}</span>
              </div>
              <TypeSpecimen variant={f.key} accent={accent} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TypeSpecimen({ variant, accent }: { variant: string; accent: string }) {
  const heading = {
    modern: "font-extrabold tracking-tight",
    friendly: "font-bold tracking-normal",
    premium: "font-semibold tracking-wide",
    classic: "font-bold tracking-normal",
  }[variant] ?? "font-bold";
  const btnRadius = variant === "friendly" ? "rounded-full" : variant === "premium" ? "rounded-sm" : "rounded-md";

  return (
    <div className="rounded-lg bg-surface-2 p-2.5">
      <div className={cn("text-sm text-foreground", heading)}>Shree Residency</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">Comfortable rooms near Andheri</div>
      <span className={cn("mt-1.5 inline-block px-2 py-1 text-[10px] font-semibold text-white", btnRadius)} style={{ background: accent }}>
        View rooms
      </span>
    </div>
  );
}
