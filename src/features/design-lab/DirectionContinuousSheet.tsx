import * as React from "react";
import {
  Popup, PopupTitle, PopupDescription, PopupClose, SectionHeading,
  ThemeCard, ColorSwatch, TypeOption, LogoRow, WebsiteSettingsNote, HexRow,
  THEMES, PALETTES, FONT_PAIRS,
} from "./shared";

/* ============================================================================
   DIRECTION 1 — "The Continuous Sheet"

   Layout question explored: what if there is no tab/rail navigation at all?
   A compact, centered modal — the same footprint as the popup opens at
   today — but Style, Brand and Typography are simply three sections in one
   continuous scroll, each introduced by a section heading, in the order the
   owner actually thinks about them. Wayfinding is a slim set of anchor dots
   on the edge, not a control you have to operate before you can see
   anything — everything is already visible, you just scroll to it.

   No preview panel: the real editor canvas sits behind the dimmed overlay,
   exactly like the production popup today — this direction bets that
   showing the owner their actual canvas (already there) is enough, and a
   second preview inside the popup would be redundant.
   ========================================================================= */

const SECTIONS = ["style", "brand", "type"] as const;

export function DirectionContinuousSheet() {
  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState<(typeof SECTIONS)[number]>("style");
  const scroller = React.useRef<HTMLDivElement>(null);
  const refs = { style: React.useRef<HTMLDivElement>(null), brand: React.useRef<HTMLDivElement>(null), type: React.useRef<HTMLDivElement>(null) };

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const mid = el.scrollTop + el.clientHeight / 3;
    let closest: (typeof SECTIONS)[number] = "style";
    let dist = Infinity;
    for (const key of SECTIONS) {
      const top = refs[key].current?.offsetTop ?? 0;
      const d = Math.abs(top - mid);
      if (d < dist) { dist = d; closest = key; }
    }
    setActive(closest);
  };

  const goTo = (key: (typeof SECTIONS)[number]) => {
    refs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!open) return <ReopenButton onClick={() => setOpen(true)} />;

  return (
    <Popup open={open} onOpenChange={setOpen} className="left-1/2 top-1/2 h-[640px] max-h-[85vh] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div>
          <PopupTitle className="text-[16px] font-bold text-neutral-900">Design</PopupTitle>
          <PopupDescription className="mt-0.5 text-[13px] text-neutral-500">Choose how your website looks.</PopupDescription>
        </div>
        <PopupClose />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div ref={scroller} onScroll={onScroll} className="h-full overflow-y-auto px-6 py-6">
          <section ref={refs.style} className="scroll-mt-2">
            <SectionHeading>Style</SectionHeading>
            <p className="mt-1 text-[13px] text-neutral-500">The overall visual direction for your site.</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {THEMES.map((t) => <ThemeCard key={t.key} theme={t} size="sm" />)}
            </div>
          </section>

          <div className="my-7 h-px bg-neutral-100" />

          <section ref={refs.brand} className="scroll-mt-2">
            <SectionHeading>Brand</SectionHeading>
            <p className="mt-1 text-[13px] text-neutral-500">Your logo and colour — how visitors recognise you.</p>
            <div className="mt-3.5"><LogoRow /></div>
            <div className="mt-3"><WebsiteSettingsNote /></div>
            <div className="mt-4 flex flex-wrap gap-3">
              {PALETTES.map((p) => <ColorSwatch key={p.key} palette={p} />)}
            </div>
            <div className="mt-4"><HexRow /></div>
          </section>

          <div className="my-7 h-px bg-neutral-100" />

          <section ref={refs.type} className="scroll-mt-2 pb-2">
            <SectionHeading>Typography</SectionHeading>
            <p className="mt-1 text-[13px] text-neutral-500">How your website's words feel.</p>
            <div className="mt-3 space-y-2">
              {FONT_PAIRS.map((f) => <TypeOption key={f.key} font={f} layout="row" />)}
            </div>
          </section>
        </div>

        {/* anchor way-finding — present, not operated-before-you-see-anything */}
        <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {SECTIONS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => goTo(key)}
              className={
                "pointer-events-auto size-2 rounded-full transition-all duration-150 " +
                (active === key ? "scale-125 bg-neutral-900" : "bg-neutral-300 hover:bg-neutral-400")
              }
              aria-label={`Jump to ${key}`}
            />
          ))}
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
