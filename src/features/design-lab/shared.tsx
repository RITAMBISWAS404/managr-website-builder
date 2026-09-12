import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { useS, useDispatch } from "@/store/hooks";
import { THEMES, PALETTES, FONT_PAIRS } from "@/data/managr";
import { siteAccent } from "@/store/selectors";
import { cn } from "@/lib/utils";

/* ============================================================================
   DESIGN LAB — PASS 1 (corrected), shared plumbing.

   Correction from the first attempt: that pass changed the IDENTITY of the
   UI (a dark IDE console, a full-bleed website takeover, an editorial
   lookbook) instead of its composition. This file now holds the same
   semantic pieces the real Design popup already has — a popup, a section
   heading, a theme card, a colour swatch, a typography option, a logo row,
   a hex input, a bounded preview panel — as small reusable atoms. Each of
   the three directions arranges these SAME atoms differently (position,
   size, grouping, navigation model). None of them invent a new kind of
   control.

   Colours/typography here are deliberately plain (white surfaces, neutral
   grays, the system font stack, the browser's default radii) — not the
   ManagR tokens (Pass 2's job), but also not a deliberately alien palette.
   The only colour that isn't neutral is the real, live accent the owner has
   actually chosen (`siteAccent`) — that's functional data, not branding.

   Wired to the real store exactly like the production DesignSheet
   (`setTheme` / `setDesign`), so live preview, autosave and undo/redo all
   genuinely work from this lab. Nothing here is imported by the real app.
   ========================================================================= */

export { THEMES, PALETTES, FONT_PAIRS };
export type ThemeDef = (typeof THEMES)[number];

export const HEADING_STYLE: Record<string, string> = {
  modern: "font-extrabold tracking-tight",
  friendly: "font-bold tracking-normal",
  premium: "font-semibold tracking-[0.01em]",
  classic: "font-bold tracking-normal",
};

export function useDesignState() {
  const s = useS();
  const theme = THEMES.find((t) => t.key === s.theme) ?? THEMES[0];
  const accent = siteAccent(s);
  const font = FONT_PAIRS.find((f) => f.key === s.fontPair) ?? FONT_PAIRS[0];
  const isPresetColor = PALETTES.some((p) => p.accent.toLowerCase() === accent.toLowerCase());
  return { s, theme, accent, font, isPresetColor };
}

/* ---------------------------------------------------------------------------
   POPUP SHELL — a real Radix dialog (portal, focus trap, Esc, overlay click),
   styled from scratch so it carries no ManagR token classes, but it is
   still, unambiguously, a modal/sheet: a scrim behind it, a title, a close
   control. Each direction only supplies where/how big it is via className.
--------------------------------------------------------------------------- */
export function Popup({
  open, onOpenChange, className, overlayClassName, children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={cn("fixed inset-0 z-40 bg-black/35", overlayClassName)} />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-white text-neutral-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] focus:outline-none",
            className,
          )}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
export const PopupTitle = DialogPrimitive.Title;
export const PopupDescription = DialogPrimitive.Description;
export function PopupClose({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700",
        className,
      )}
      aria-label="Close"
    >
      <X className="size-4" />
    </DialogPrimitive.Close>
  );
}

export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400", className)}>{children}</div>;
}

/* ---------------------------------------------------------------------------
   ATOM — theme/style card. Same identity everywhere: a schematic + a name +
   a blurb, selectable, bordered. `size` only changes its footprint.
--------------------------------------------------------------------------- */
export function ThemeCard({ theme, size = "md" }: { theme: ThemeDef; size?: "sm" | "md" | "lg" }) {
  const { s } = useDesignState();
  const dispatch = useDispatch();
  const selected = s.theme === theme.key;
  const cardTreat: React.CSSProperties =
    theme.cards === "outlined" ? { border: `1px solid color-mix(in srgb, ${theme.accent} 28%, #dcdfe3)`, background: "#fff" } :
    theme.cards === "filled" ? { background: `color-mix(in srgb, ${theme.accent} 9%, #fff)` } :
    { background: "transparent", borderBottom: "1px solid #e5e7eb" };
  const dims = { sm: "aspect-[4/3]", md: "aspect-[4/3]", lg: "aspect-[16/10]" }[size];
  const pad = { sm: "p-2", md: "p-2.5", lg: "p-4" }[size];

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "setTheme", theme: theme.key })}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border bg-white text-left transition-[border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98]",
        selected ? "border-neutral-900 shadow-[0_0_0_1px_rgba(23,23,23,0.9)]" : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm",
      )}
    >
      <div className={cn("flex flex-col bg-neutral-50", dims, pad)} style={{ borderRadius: 0 }}>
        <span className="mb-1.5 h-1.5 w-3/4 rounded-full bg-neutral-300" />
        <span className="mb-2 h-1 w-1/2 rounded-full bg-neutral-200" />
        <span className="flex-1" style={{ borderRadius: theme.cards === "flat" ? 0 : `calc(${theme.radius} * 0.4)`, ...cardTreat }} />
        <span className="mt-2 h-2.5 w-10" style={{ background: theme.accent, borderRadius: theme.cards === "flat" ? 2 : 999 }} />
      </div>
      <div className={cn(size === "lg" ? "p-3.5" : "p-2.5")}>
        <div className={cn("font-semibold text-neutral-900", size === "lg" ? "text-[14px]" : "text-[13px]")}>{theme.name}</div>
        {size !== "sm" && <div className="mt-0.5 text-[12px] text-neutral-500">{theme.blurb}</div>}
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   ATOM — colour swatch. Circle + name, check mark when selected. Same
   identity everywhere; `size` only changes the circle's diameter.
--------------------------------------------------------------------------- */
export function ColorSwatch({ palette, size = 32 }: { palette: (typeof PALETTES)[number]; size?: number }) {
  const { accent } = useDesignState();
  const dispatch = useDispatch();
  const selected = accent.toLowerCase() === palette.accent.toLowerCase();
  return (
    <button
      type="button"
      title={palette.name}
      onClick={() => dispatch({ type: "setDesign", patch: { brandColor: palette.accent } })}
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className="grid shrink-0 place-items-center rounded-full ring-1 ring-inset ring-black/10 transition-transform duration-150 ease-out active:scale-90"
        style={{ background: palette.accent, width: size, height: size }}
      >
        {selected && <Check className="size-1/2 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />}
      </span>
      <span className="text-[10px] font-medium text-neutral-500">{palette.name}</span>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   ATOM — typography option. Two layouts of the same identity: a curated
   type personality you can pick, previewed with real weight/tracking.
--------------------------------------------------------------------------- */
export function TypeOption({ font, layout = "row" }: { font: (typeof FONT_PAIRS)[number]; layout?: "row" | "card" }) {
  const { s, accent } = useDesignState();
  const dispatch = useDispatch();
  const selected = s.fontPair === font.key;
  const base = cn(
    "w-full text-left transition-[border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] rounded-lg border",
    selected ? "border-neutral-900 shadow-[0_0_0_1px_rgba(23,23,23,0.9)]" : "border-neutral-200 hover:border-neutral-300",
  );

  if (layout === "card") {
    return (
      <button type="button" onClick={() => dispatch({ type: "setDesign", patch: { fontPair: font.key } })} className={cn(base, "p-4")}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500">{font.name}</span>
          <span className="text-[11px] text-neutral-400">{font.note}</span>
        </div>
        <div className="rounded-md bg-neutral-50 p-4">
          <div className={cn("text-[19px] text-neutral-900", HEADING_STYLE[font.key])}>Shree Residency</div>
          <div className="mt-1 text-[12px] text-neutral-500">Comfortable rooms near Andheri</div>
          <span className="mt-2.5 inline-block rounded-md px-3 py-1.5 text-[11px] font-semibold text-white" style={{ background: accent }}>View rooms</span>
        </div>
      </button>
    );
  }

  return (
    <button type="button" onClick={() => dispatch({ type: "setDesign", patch: { fontPair: font.key } })} className={cn(base, "flex items-center justify-between gap-3 p-3")}>
      <div>
        <div className="text-[13px] font-semibold text-neutral-900">{font.name}</div>
        <div className="text-[12px] text-neutral-500">{font.note}</div>
      </div>
      <span className={cn("text-[22px] text-neutral-900", HEADING_STYLE[font.key])}>Aa</span>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   ATOM — logo row (identity + upload). Same copy/behaviour as production:
   inert "Upload logo" button, generated-mark explanation.
--------------------------------------------------------------------------- */
export function LogoRow() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-neutral-100 text-[14px] font-bold text-neutral-500">S</div>
      <div>
        <button type="button" className="rounded-md border border-neutral-200 px-3 py-1.5 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-50">
          Upload logo
        </button>
        <p className="mt-1 text-[11px] text-neutral-400">No logo → a generated mark. Never a broken image.</p>
      </div>
    </div>
  );
}

export function WebsiteSettingsNote() {
  return (
    <p className="text-[12px] text-neutral-400">
      Business name and contact details are managed in{" "}
      <a href="/website/settings" className="font-medium text-neutral-600 underline underline-offset-2 hover:text-neutral-900">Website settings</a>.
    </p>
  );
}

/* ---------------------------------------------------------------------------
   ATOM — custom hex row: swatch preview + input + apply button.
--------------------------------------------------------------------------- */
export function HexRow() {
  const { accent } = useDesignState();
  const dispatch = useDispatch();
  const [hex, setHex] = React.useState(accent);
  const [error, setError] = React.useState(false);
  const valid = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="mb-1 block text-[11px] font-semibold text-neutral-500">Custom colour</label>
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 px-2 py-1.5">
          <span className="size-5 shrink-0 rounded-full border border-neutral-200" style={{ background: valid ? hex : "transparent" }} />
          <input
            value={hex}
            onChange={(e) => { setHex(e.target.value); setError(false); }}
            placeholder="#F7553D"
            className="w-full bg-transparent font-mono text-[12px] text-neutral-900 outline-none placeholder:text-neutral-300"
          />
        </div>
        {error && <p className="mt-1 text-[11px] text-red-500">Enter a valid colour, like #F7553D.</p>}
      </div>
      <button
        type="button"
        onClick={() => { if (!valid) { setError(true); return; } dispatch({ type: "setDesign", patch: { brandColor: hex.trim() } }); }}
        className="h-[34px] shrink-0 rounded-md bg-neutral-900 px-3 text-[12px] font-semibold text-white hover:bg-neutral-800"
      >
        Apply
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ATOM — bounded preview panel. Never full-bleed, never the whole stage —
   always a clearly-framed rectangle inside the popup, exactly the same
   product every direction previews.
--------------------------------------------------------------------------- */
export function PreviewPanel({ size = "md", caption = true }: { size?: "xl" | "md" | "xs"; caption?: boolean }) {
  const { theme, accent, font } = useDesignState();
  const heading = HEADING_STYLE[font.key] ?? HEADING_STYLE.modern;
  const radius = size === "xs" ? 6 : theme.cards === "flat" ? "0px" : theme.radius;
  const cardRadius = theme.cards === "flat" ? "0px" : `calc(${theme.radius} * 0.5)`;
  const gapCls = { airy: "gap-3", cozy: "gap-2", tight: "gap-1" }[theme.density];
  const cardStyle: React.CSSProperties =
    theme.cards === "outlined" ? { background: "#fff", border: `1px solid color-mix(in srgb, ${accent} 25%, #dcdfe3)`, borderRadius: cardRadius } :
    theme.cards === "filled" ? { background: `color-mix(in srgb, ${accent} 8%, #fff)`, borderRadius: cardRadius } :
    { background: "#fff", borderBottom: "1px solid #e7e9ec", borderRadius: 0 };

  const D = {
    xl: { pad: "px-6 py-6", head: "h-10 text-[12px]", h1: "text-[24px] leading-tight", sub: "text-[12px] mt-1.5", btn: "mt-3 px-4 py-2 text-[12px]", card: "h-16" },
    md: { pad: "px-4 py-4", head: "h-8 text-[10px]", h1: "text-[16px] leading-tight", sub: "text-[10px] mt-1", btn: "mt-2 px-3 py-1.5 text-[10px]", card: "h-10" },
    xs: { pad: "px-2 py-2", head: "h-5 text-[7px]", h1: "text-[11px] leading-tight", sub: "text-[7px] mt-0.5", btn: "mt-1.5 px-2 py-1 text-[7px]", card: "h-5" },
  }[size];

  return (
    <div>
      <div className="w-full overflow-hidden border border-neutral-200 bg-white" style={{ borderRadius: radius }}>
        <div className={cn("flex items-center justify-between border-b border-neutral-100 px-3", D.head)}>
          <span className={cn("font-bold text-neutral-900", heading)}>Shree Residency</span>
          <span className="text-neutral-300">●●●</span>
        </div>
        <div className={D.pad}>
          <div className={cn(heading, D.h1)} style={{ color: "#171717" }}>Comfortable stays, done right</div>
          <div className={cn("text-neutral-400", D.sub)}>Direct from the owner. No brokerage.</div>
          <span className={cn("inline-block font-semibold text-white", D.btn)} style={{ background: accent, borderRadius: theme.cards === "flat" ? 3 : 999 }}>View rooms</span>
          <div className={cn("mt-3 grid grid-cols-2", gapCls)}>
            <div className={D.card} style={cardStyle} />
            <div className={D.card} style={cardStyle} />
          </div>
        </div>
      </div>
      {caption && <div className="mt-2 text-center text-[11px] text-neutral-400">Live preview</div>}
    </div>
  );
}
