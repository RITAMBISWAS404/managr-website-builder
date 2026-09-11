import type { SectionType } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Tiny, calm schematic of a section — used in the Add panel and variant pickers.
 * Not the real render; just enough for the owner to recognise the shape.
 */
const bar = "rounded-[2px] bg-current";

export function SectionPreview({ type, className }: { type: SectionType; className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full flex-col justify-center gap-1.5 overflow-hidden rounded-md border border-border bg-surface p-2 text-border-strong",
        className,
      )}
      aria-hidden
    >
      <Body type={type} />
    </div>
  );
}

function Body({ type }: { type: SectionType }) {
  switch (type) {
    case "header":
      return (
        <div className="flex items-center justify-between">
          <span className={cn(bar, "h-1.5 w-4")} />
          <span className="flex gap-1">
            <span className={cn(bar, "h-1 w-2")} />
            <span className={cn(bar, "h-1 w-2")} />
          </span>
        </div>
      );
    case "hero":
      return (
        <>
          <div className="h-6 rounded-[3px] bg-muted" />
          <span className={cn(bar, "h-1.5 w-3/4")} />
          <span className={cn(bar, "h-1 w-1/2")} />
        </>
      );
    case "properties":
    case "featured":
      return (
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-0.5">
              <div className="h-4 rounded-[2px] bg-muted" />
              <span className={cn(bar, "block h-0.5 w-full")} />
            </div>
          ))}
        </div>
      );
    case "highlights":
      return (
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="size-2 rounded-full bg-muted" />
              <span className={cn(bar, "h-0.5 w-3")} />
            </div>
          ))}
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-3 grid-rows-2 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[2px] bg-muted" />
          ))}
        </div>
      );
    case "reviews":
      return (
        <div className="space-y-1">
          <div className="h-3 rounded-[2px] bg-muted" />
          <div className="h-3 rounded-[2px] bg-muted" />
        </div>
      );
    case "about":
      return (
        <div className="flex gap-1.5">
          <div className="h-8 w-10 rounded-[3px] bg-muted" />
          <div className="flex-1 space-y-1 pt-0.5">
            <span className={cn(bar, "block h-0.5 w-full")} />
            <span className={cn(bar, "block h-0.5 w-4/5")} />
            <span className={cn(bar, "block h-0.5 w-2/3")} />
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={cn(bar, "h-1 w-2/3")} />
              <span className={cn(bar, "size-1")} />
            </div>
          ))}
        </div>
      );
    case "trust":
      return <div className="mx-auto h-3 w-3/4 rounded-full border border-current" />;
    case "offer":
      return <div className="mx-auto h-3 w-4/5 rounded-[3px] border border-dashed border-current" />;
    case "enquiry":
      return (
        <div className="space-y-1">
          <div className="h-2.5 rounded-[2px] bg-muted" />
          <div className="h-2.5 rounded-[2px] bg-muted" />
          <div className="h-2.5 w-1/3 rounded-[2px] bg-current" />
        </div>
      );
    case "visit":
      return (
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[2px] bg-muted" />
          ))}
        </div>
      );
    case "bookcta":
      return <div className="mx-auto h-4 w-2/3 rounded-[3px] bg-current" />;
    case "contact":
      return (
        <div className="space-y-1">
          <span className={cn(bar, "block h-1 w-1/2")} />
          <div className="h-4 rounded-[2px] bg-muted" />
        </div>
      );
    case "areas":
      return (
        <div className="flex flex-wrap gap-1">
          {[6, 8, 5, 7].map((w, i) => (
            <span key={i} className="h-2 rounded-full border border-current" style={{ width: w * 2 }} />
          ))}
        </div>
      );
    case "wacta":
      return <div className="mx-auto h-3 w-3/5 rounded-full bg-current" />;
    case "footer":
      return (
        <div className="space-y-1 opacity-70">
          <span className={cn(bar, "block h-0.5 w-2/3")} />
          <span className={cn(bar, "block h-0.5 w-1/2")} />
        </div>
      );
    default:
      return <div className="h-full rounded-[3px] bg-muted" />;
  }
}
