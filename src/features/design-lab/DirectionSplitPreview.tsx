import * as React from "react";
import {
  Popup, PopupTitle, PopupDescription, PopupClose, SectionHeading,
  ThemeCard, ColorSwatch, TypeOption, LogoRow, WebsiteSettingsNote, HexRow, PreviewPanel,
  THEMES, PALETTES, FONT_PAIRS,
} from "./shared";
import { cn } from "@/lib/utils";

/* ============================================================================
   DIRECTION 2 — "Split Preview"

   Layout question explored: what if a bounded preview sits beside the
   controls, permanently, so the owner never has to imagine the effect of a
   choice? A wide modal (still unambiguously a modal — a fixed, bordered
   rectangle with a scrim behind it, not full-bleed) split into two columns:
   a framed preview panel on the left that never moves, and the actual
   controls on the right, switched with a horizontal pill tab bar — the
   original popup's navigation model, restyled and given more room, not
   replaced.
   ========================================================================= */

const TABS = [
  { key: "style", label: "Style" },
  { key: "brand", label: "Brand" },
  { key: "type", label: "Typography" },
] as const;

export function DirectionSplitPreview() {
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = React.useState<(typeof TABS)[number]["key"]>("style");

  if (!open) return <ReopenButton onClick={() => setOpen(true)} />;

  return (
    <Popup open={open} onOpenChange={setOpen} className="left-1/2 top-1/2 h-[560px] max-h-[85vh] w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div>
          <PopupTitle className="text-[16px] font-bold text-neutral-900">Design</PopupTitle>
          <PopupDescription className="mt-0.5 text-[13px] text-neutral-500">Choose how your website looks.</PopupDescription>
        </div>
        <PopupClose />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[300px] shrink-0 flex-col justify-center border-r border-neutral-100 bg-neutral-50/60 px-7 py-8">
          <PreviewPanel size="xl" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 gap-1 border-b border-neutral-100 px-6 pt-4">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-t-lg px-3.5 py-2 text-[13px] font-semibold transition-colors",
                  tab === t.key ? "border border-b-white bg-white text-neutral-900" : "text-neutral-400 hover:text-neutral-700",
                )}
                style={tab === t.key ? { marginBottom: -1 } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {tab === "style" && (
              <div>
                <SectionHeading>Style</SectionHeading>
                <p className="mt-1 text-[13px] text-neutral-500">The overall visual direction for your site.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {THEMES.map((t) => <ThemeCard key={t.key} theme={t} size="md" />)}
                </div>
              </div>
            )}
            {tab === "brand" && (
              <div>
                <SectionHeading>Brand</SectionHeading>
                <p className="mt-1 text-[13px] text-neutral-500">Your logo and colour — how visitors recognise you.</p>
                <div className="mt-4"><LogoRow /></div>
                <div className="mt-3"><WebsiteSettingsNote /></div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {PALETTES.map((p) => <ColorSwatch key={p.key} palette={p} />)}
                </div>
                <div className="mt-4"><HexRow /></div>
              </div>
            )}
            {tab === "type" && (
              <div>
                <SectionHeading>Typography</SectionHeading>
                <p className="mt-1 text-[13px] text-neutral-500">How your website's words feel.</p>
                <div className="mt-4 space-y-2.5">
                  {FONT_PAIRS.map((f) => <TypeOption key={f.key} font={f} layout="row" />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}

function ReopenButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <button type="button" onClick={onClick} className="rounded-md bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800">
        Reopen Design popup
      </button>
    </div>
  );
}
