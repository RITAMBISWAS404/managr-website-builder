import { Sparkles, ShieldCheck, MessageCircle, Phone, ArrowRight } from "lucide-react";
import type { Block, BuilderState } from "@/types";
import { SECTIONS } from "./registry";
import { cn } from "@/lib/utils";
import { publicProperties, ownerInfo, advActive, staleProp, properties, siteAccent } from "@/store/selectors";
import { OWNER } from "@/data/managr";

const SHAPE_RADIUS = { soft: "12px", rounded: "20px", clean: "4px" } as const;

/** A clean, low-detail render of a website section. Honors block.layout and the
 *  site's design settings (accent, shape). Not pixel-final — a faithful preview. */
export function SiteSection({ block, s }: { block: Block; s: BuilderState }) {
  const d = block.data as Record<string, unknown>;
  const str = (k: string) => (d[k] as string) ?? "";
  const accent = siteAccent(s);
  const radius = SHAPE_RADIUS[s.shape];
  const P = publicProperties(s);
  const mobile = s.device === "mobile";

  const Btn = ({ children, outline }: { children: React.ReactNode; outline?: boolean }) => (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold"
      style={
        outline
          ? { border: `1.5px solid ${accent}`, color: accent, borderRadius: radius }
          : { background: accent, color: "#fff", borderRadius: radius }
      }
    >
      {children}
    </span>
  );
  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-3 text-[15px] font-bold -tracking-[0.01em] text-[#111318]">{children}</h3>
  );
  const Img = ({ className, label }: { className?: string; label?: string }) => (
    <div
      className={cn("grid place-items-center bg-gradient-to-b from-[#f2f4f6] to-[#e9ecef] text-[9px] font-medium text-[#a7aeb8]", className)}
      style={{ borderRadius: radius }}
    >
      <span className="flex flex-col items-center gap-1">
        <ImageGlyph />
        {label && <span>{label}</span>}
      </span>
    </div>
  );

  const availChip = (p: (typeof P)[number]) => {
    if (!s.availOn || !advActive(s) || staleProp(s, p)) return null;
    const total = p.rooms.reduce((a, r) => a + r.freeNow, 0);
    const soon = p.rooms.find((r) => r.freeFrom);
    const cls = "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold";
    if (total > 0) return <span className={cn(cls, "bg-success-surface text-success")}>{s.availNumbers === "vague" ? "Available" : `${total} bed${total > 1 ? "s" : ""} now`}</span>;
    if (soon && s.availFromDate) return <span className={cn(cls, "bg-warning-surface text-warning")}>{s.availNumbers === "vague" ? "Full" : `Free from ${soon.freeFrom}`}</span>;
    return <span className={cn(cls, "bg-warning-surface text-warning")}>Full</span>;
  };

  switch (block.type) {
    case "header":
      return (
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-extrabold -tracking-[0.01em] text-[#111318]">
            {s.globals.header.logo ? "LOGO" : OWNER.biz}
          </span>
          <span className="flex items-center gap-3">
            {!mobile ? (
              <span className="flex items-center gap-4 text-[11px] font-medium text-[#667085]">
                {s.globals.header.links.map((l) => <span key={l}>{l}</span>)}
              </span>
            ) : (
              <span className="flex flex-col gap-[3px]" aria-hidden>
                <span className="h-[1.5px] w-4 rounded bg-[#667085]" />
                <span className="h-[1.5px] w-4 rounded bg-[#667085]" />
                <span className="h-[1.5px] w-4 rounded bg-[#667085]" />
              </span>
            )}
            {s.globals.header.call && <Btn><Phone className="size-3" /> Call</Btn>}
          </span>
        </div>
      );

    case "hero": {
      const img = <Img className={cn("w-full", mobile ? "h-[120px]" : "h-[190px]")} label={str("bg") === "plain" ? "Brand colour" : "Property photo"} />;
      const txt = (
        <div className="space-y-3">
          <h2 className="text-[23px] font-extrabold leading-[1.12] tracking-[-0.022em] text-[#0f1115]">
            {str("headline") || ownerInfo(s, "headline")}
          </h2>
          <p className="max-w-[38ch] text-[12.5px] leading-relaxed text-[#5b6472]">{str("sub") || "Direct from the owner. No brokerage."}</p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5"><Btn>{str("btn") || "Call now"}</Btn></div>
        </div>
      );
      const lay = block.layout;
      if (lay === "Text only") return <div className="py-2">{txt}</div>;
      if (lay === "Image background")
        return <div className="grid min-h-[140px] place-items-center p-6 text-center" style={{ background: "#eef1f5", borderRadius: radius }}>{txt}</div>;
      if (lay === "Image left") return <div className={cn("grid items-center gap-4", mobile ? "grid-cols-1" : "grid-cols-2")}>{img}{txt}</div>;
      if (lay === "Image right") return <div className={cn("grid items-center gap-4", mobile ? "grid-cols-1" : "grid-cols-2")}>{txt}{img}</div>;
      return <div className="space-y-3">{img}{txt}</div>;
    }

    case "properties": {
      if (!P.length) return <Empty>No approved properties yet — visitors see “New listings coming soon”.</Empty>;
      const lay = block.layout;
      const compact = lay === "Compact list";
      const cols = compact ? 1 : lay === "2 per row" ? 2 : lay === "3 per row" ? 3 : mobile ? 1 : 3;
      return (
        <>
          <H2>Our properties</H2>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {P.map((p) => (
              <div
                key={p.id}
                className={cn("overflow-hidden border border-[#e6e8ec] bg-white", compact ? "flex gap-3" : "shadow-[0_1px_2px_rgba(16,24,40,0.04)]")}
                style={{ borderRadius: radius }}
              >
                {!compact && <Img className="h-[98px] w-full rounded-none" label={p.photos ? "Photo" : "Photo coming soon"} />}
                <div className={cn("p-3", compact && "flex-1")}>
                  <div className="text-[12.5px] font-bold -tracking-[0.01em] text-[#111318]">{p.name}</div>
                  <div className="mt-[1px] text-[10px] text-[#98a2b3]">{p.area}</div>
                  <div className="mt-1.5 text-[12.5px] font-extrabold" style={{ color: accent }}>
                    {p.from}<span className="font-medium text-[#98a2b3]"> /mo</span>
                  </div>
                  {availChip(p)}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    case "featured": {
      const p = P[0];
      if (!p) return <Empty>No property to feature.</Empty>;
      return (
        <>
          <H2>Featured</H2>
          <div className="overflow-hidden border border-[#e8e8e8]" style={{ borderRadius: radius }}>
            <Img className="h-[120px] w-full rounded-none" />
            <div className="p-3">
              <div className="text-[12px] font-bold">{p.name}</div>
              <div className="text-[10px] text-[#98a2b3]">{p.area} · {p.from}/mo</div>
              {availChip(p)}
            </div>
          </div>
        </>
      );
    }

    case "areas":
      return (
        <>
          <H2>Areas we cover</H2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(P.map((p) => p.area))].map((a) => (
              <span key={a} className="rounded-full border border-[#e8e8e8] px-2.5 py-1 text-[10px] text-[#475467]">{a}</span>
            ))}
          </div>
        </>
      );

    case "highlights": {
      const items = (d.items as string[]) || ["Meals included", "CCTV & security", "5 min to metro"];
      const iconList = block.layout === "Icon list";
      return (
        <>
          <H2>Why residents choose us</H2>
          <div className={cn("grid gap-3", iconList ? "grid-cols-1" : mobile ? "grid-cols-2" : "grid-cols-3")}>
            {items.map((h) => (
              <div key={h} className={cn("flex items-center gap-2 text-[11px] text-[#344054]", !iconList && "flex-col text-center")}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full" style={{ background: `${accent}1a`, color: accent }}>
                  <Sparkles className="size-3" />
                </span>
                {h}
              </div>
            ))}
          </div>
        </>
      );
    }

    case "trust":
      return (
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold" style={{ borderColor: accent, color: accent }}>
          <ShieldCheck className="size-3.5" /> Direct from owner · No brokerage
        </div>
      );

    case "reviews":
      return (
        <>
          <H2>What residents say</H2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="border border-[#e8e8e8] p-3 text-[11px] text-[#475467]" style={{ borderRadius: radius }}>
                “Clean, safe and the food is genuinely good.”
                <div className="mt-1.5 text-[10px] font-semibold text-[#98a2b3]">Verified resident</div>
              </div>
            ))}
          </div>
        </>
      );

    case "about":
      return (
        <div className={cn("grid gap-4", mobile ? "grid-cols-1" : block.layout === "Text only" ? "grid-cols-1" : "grid-cols-2")}>
          {block.layout === "Photo + text" && <Img className="h-[110px] w-full" />}
          <div>
            <H2>About us</H2>
            <p className="text-[12px] leading-relaxed text-[#667085]">{str("text") || ownerInfo(s, "about")}</p>
          </div>
          {block.layout !== "Text only" && block.layout !== "Photo + text" && <Img className="h-[110px] w-full" />}
        </div>
      );

    case "richtext":
      return <p className="text-[12px] leading-relaxed text-[#667085]">{str("text") || "Your text here — house rules, meal menu, anything you like."}</p>;

    case "gallery":
      return (
        <>
          <H2>Photos</H2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => <Img key={i} className="aspect-square" label="" />)}
          </div>
        </>
      );

    case "faq":
      return (
        <>
          <H2>Common questions</H2>
          <div className="divide-y divide-[#e8e8e8] border-y border-[#e8e8e8]">
            {((d.items as string[]) || ["What's the rent?", "Are meals included?", "What's the notice period?"]).map((q) => (
              <div key={q} className="flex items-center justify-between py-2.5 text-[11px] font-semibold text-[#344054]">
                {q} <span className="text-[#98a2b3]">＋</span>
              </div>
            ))}
          </div>
        </>
      );

    case "enquiry":
      return (
        <>
          <H2>Send an enquiry</H2>
          <div className="space-y-2">
            {["Your name", "Phone number", "Budget / move-in"].map((f) => (
              <div key={f} className="border border-[#e8e8e8] px-3 py-2 text-[10px] text-[#98a2b3]" style={{ borderRadius: radius }}>{f}</div>
            ))}
            <Btn>Send enquiry</Btn>
          </div>
        </>
      );

    case "visit":
      return (
        <>
          <H2>Book a visit</H2>
          <p className="text-[12px] text-[#667085]">Choose a day and time that suits you.</p>
          <div className="mt-2"><Btn>See available times <ArrowRight className="size-3" /></Btn></div>
        </>
      );

    case "bookcta":
      return (
        <div className="rounded-xl border border-dashed p-4 text-center" style={{ borderColor: accent, borderRadius: radius }}>
          <div className="text-[12px] font-bold text-[#111318]">Ready to move in?</div>
          <div className="mt-2"><Btn>Request a bed</Btn></div>
        </div>
      );

    case "offer":
      return (
        <div className="mx-auto w-fit rounded-lg border border-dashed px-4 py-2 text-[11px] font-bold" style={{ borderColor: accent, color: accent, borderRadius: radius }}>
          {str("text") || "₹1,000 off this month"}
        </div>
      );

    case "contact":
      return (
        <div className={cn("grid gap-4", block.layout === "Two columns" && !mobile ? "grid-cols-2" : "grid-cols-1")}>
          <div>
            <H2>Contact</H2>
            <div className="space-y-1.5 text-[11px] text-[#475467]">
              <div className="flex items-center gap-2"><Phone className="size-3.5" style={{ color: accent }} /> {OWNER.phone}</div>
              <div className="flex items-center gap-2"><MessageCircle className="size-3.5" style={{ color: "var(--whatsapp)" }} /> WhatsApp</div>
              <div className="text-[10px] text-[#98a2b3]">{OWNER.area.split(",")[0]} (approximate area)</div>
            </div>
          </div>
          <Img className="h-[92px] w-full" label="Approximate area" />
        </div>
      );

    case "wacta":
      return (
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold text-white" style={{ background: "var(--whatsapp)" }}>
          <MessageCircle className="size-3.5" /> {str("text") || "Chat with us"}
        </div>
      );

    case "footer":
      return (
        <div className="text-[10px] leading-relaxed text-[#98a2b3]">
          {OWNER.biz} · {OWNER.phone} · {OWNER.area.split(",")[0]}
          <br />Direct from owner · No brokerage
          {(s.globals.footer.powered || !advActive(s)) && <div className="mt-1.5 text-[9px] opacity-70">Powered by ManagR</div>}
        </div>
      );

    default:
      return null;
  }
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-[#e8e8e8] bg-[#f7f8fa] p-3 text-center text-[11px] text-[#98a2b3]">{children}</div>;
}

function ImageGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4 opacity-70" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m3 17 5-4 4 3 3-2 6 5" />
    </svg>
  );
}

/* ---------- locked / needs-data placeholders (edit mode only) ---------- */
export function SectionPlaceholder({ block, s }: { block: Block; s: BuilderState }) {
  const meta = SECTIONS[block.type];
  if (meta.advanced && !advActive(s))
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-advanced-border bg-advanced-surface p-5 text-center">
        <Sparkles className="size-4 text-advanced" />
        <span className="text-caption font-semibold text-advanced">{meta.name} — available with Advanced</span>
        <span className="text-caption text-muted-foreground">{meta.blurb}</span>
      </div>
    );
  const needsPhotos = meta.needs === "photos" && publicProperties(s).every((p) => !p.photos);
  const needsReviews = meta.needs === "reviews" && publicProperties(s).every((p) => !p.reviews);
  if (needsPhotos || needsReviews)
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted p-5 text-center">
        <div className="text-caption font-semibold text-foreground">{meta.name} — nothing to show yet</div>
        <p className="mx-auto mt-1 max-w-xs text-caption text-muted-foreground">
          {needsReviews
            ? "This appears on its own once you have resident reviews in ManagR."
            : "None of your public properties have photos yet. Add some in ManagR → Properties."}
        </p>
        <p className="mt-1 text-caption text-muted-foreground/70">Visitors won't see an empty box — the section just won't appear.</p>
      </div>
    );
  return null;
}

export function hasPlaceholder(block: Block, s: BuilderState) {
  const meta = SECTIONS[block.type];
  if (meta.advanced && !advActive(s)) return true;
  if (meta.needs === "photos" && publicProperties(s).every((p) => !p.photos)) return true;
  if (meta.needs === "reviews" && publicProperties(s).every((p) => !p.reviews)) return true;
  return false;
}

export { properties };
