import * as React from "react";
import {
  Popup, PopupTitle, PopupDescription, PopupClose, SectionHeading,
  ThemeCard, ColorSwatch, TypeOption, LogoRow, WebsiteSettingsNote, HexRow, PreviewPanel,
  THEMES, PALETTES, FONT_PAIRS,
} from "./shared";
import { cn } from "@/lib/utils";

/* ============================================================================
   DIRECTION 3 — "Bottom Sheet, Grid"

   Layout questions explored: (1) what if this is a sheet anchored to the
   viewport, not a floating centered dialog — the same "it's still a
   modal/sheet" identity, a different modal TYPE; (2) what if navigation is
   a full-width horizontal segmented control instead of pill tabs or a
   vertical rail; (3) what if choices are shown as a denser grid of larger
   cards instead of a list, trading scroll for a wider glance. A small
   preview thumbnail rides along in the header — always visible, never
   dominant, a "current state" chip rather than a focal preview.
   ========================================================================= */

const SEGMENTS = [
  { key: "style", label: "Style" },
  { key: "brand", label: "Brand" },
  { key: "type", label: "Typography" },
] as const;

export function DirectionBottomSheetGrid() {
  const [open, setOpen] = React.useState(true);
  const [seg, setSeg] = React.useState<(typeof SEGMENTS)[number]["key"]>("style");

  if (!open) return <ReopenButton onClick={() => setOpen(true)} />;

  return (
    <Popup
      open={open}
      onOpenChange={setOpen}
      className="bottom-0 left-1/2 max-h-[78vh] w-[760px] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-t-2xl"
    >
      <div className="flex shrink-0 justify-center pb-1.5 pt-2.5">
        <span className="h-1 w-9 rounded-full bg-neutral-200" />
      </div>

      <div className="flex shrink-0 items-center justify-between px-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 shrink-0"><PreviewPanel size="xs" caption={false} /></div>
          <div>
            <PopupTitle className="text-[16px] font-bold text-neutral-900">Design</PopupTitle>
            <PopupDescription className="text-[12px] text-neutral-500">Choose how your website looks.</PopupDescription>
          </div>
        </div>
        <PopupClose />
      </div>

      <div className="shrink-0 px-6 pb-4">
        <div className="flex rounded-lg bg-neutral-100 p-1">
          {SEGMENTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSeg(s.key)}
              className={cn(
                "flex-1 rounded-md py-2 text-[13px] font-semibold transition-colors",
                seg === s.key ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-7">
        {seg === "style" && (
          <div>
            <SectionHeading>Style</SectionHeading>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {THEMES.map((t) => <ThemeCard key={t.key} theme={t} size="lg" />)}
            </div>
          </div>
        )}
        {seg === "brand" && (
          <div>
            <SectionHeading>Brand</SectionHeading>
            <div className="mt-3 grid grid-cols-2 gap-5">
              <div>
                <LogoRow />
                <div className="mt-3"><WebsiteSettingsNote /></div>
              </div>
              <div>
                <div className="grid grid-cols-4 gap-3">
                  {PALETTES.map((p) => <ColorSwatch key={p.key} palette={p} size={36} />)}
                </div>
                <div className="mt-3.5"><HexRow /></div>
              </div>
            </div>
          </div>
        )}
        {seg === "type" && (
          <div>
            <SectionHeading>Typography</SectionHeading>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {FONT_PAIRS.map((f) => <TypeOption key={f.key} font={f} layout="card" />)}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
}

function ReopenButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="grid h-full w-full place-items-end justify-center pb-16">
      <button type="button" onClick={onClick} className="rounded-md bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800">
        Reopen Design popup
      </button>
    </div>
  );
}
