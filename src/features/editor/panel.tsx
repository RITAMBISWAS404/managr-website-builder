import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconTile, type Tint } from "@/components/common";
import type { SectionCategory } from "@/types";

/* ============================================================================
   Editor panel system — the shared visual grammar for the left structure panel
   and the right inspector. The point: a panel is a *tool*, not a white document.

     Panel
       PanelHeader     — identity strip (panel-header band)
       PanelScroll      — the scroll region
         Group          — a labelled, collapsible region (band header + body)
           Row / Field   — compact control rows
           Seg           — segmented control
           ChoiceGrid    — mini-preview choices
       PanelFooter      — pinned action(s)
   ========================================================================== */

/** One colour per section category — the same tint language the rest of
 *  ManagR already uses (Website Home's Manage grid, metric cards). Lets the
 *  left navigator and the inspector header agree on "what kind of thing is
 *  this" at a glance, instead of every section reading as the same grey icon. */
export const SECTION_TINT: Record<SectionCategory, Tint> = {
  Structural: "blue",
  Hero: "coral",
  Properties: "blue",
  Trust: "green",
  Content: "purple",
  Convert: "amber",
  Contact: "cyan",
};

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex h-full min-h-0 flex-col bg-panel", className)}>{children}</div>;
}

export function PanelHeader({
  title, meta, actions, className,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b border-panel-border bg-panel-header px-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
        <span className="truncate text-sm font-semibold text-foreground">{title}</span>
        {meta != null && <span className="shrink-0 text-caption text-faint">{meta}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-0.5">{actions}</div>}
    </div>
  );
}

export function PanelScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto scrollbar-thin", className)}>{children}</div>;
}

export function PanelFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("shrink-0 border-t border-panel-border bg-panel-header p-2.5", className)}>
      {children}
    </div>
  );
}

/* ---- Group: the workhorse. A band header + a body, optionally collapsible ---- */
export function Group({
  label,
  helper,
  right,
  collapsible = true,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  bodyClassName,
  children,
}: {
  label: React.ReactNode;
  helper?: React.ReactNode;
  right?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const [local, setLocal] = React.useState(defaultOpen);
  const open = openProp ?? local;
  const toggle = () => {
    if (!collapsible) return;
    const next = !open;
    setLocal(next);
    onOpenChange?.(next);
  };

  return (
    <section className="border-b border-panel-border last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        disabled={!collapsible}
        className={cn(
          "flex w-full items-center gap-1.5 bg-panel-header px-3.5 py-2.5 text-left",
          collapsible && "transition-colors hover:bg-panel-hover",
        )}
      >
        {collapsible && (
          <ChevronRight
            className={cn("size-3.5 shrink-0 text-faint transition-transform duration-150", open && "rotate-90")}
          />
        )}
        <span className="text-micro font-bold uppercase tracking-[0.04em] text-muted-foreground">{label}</span>
        {helper && <span className="truncate text-caption font-normal normal-case text-faint">· {helper}</span>}
        <span className="ml-auto shrink-0">{right}</span>
      </button>
      {open && <div className={cn("space-y-3.5 px-3.5 py-3.5", bodyClassName)}>{children}</div>}
    </section>
  );
}

/* ---- Field: stacked label + control (for inputs / selects) ---- */
export function Field({
  label, hint, htmlFor, children,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-caption font-semibold text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-caption leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ---- Row: compact inline control — label left, control right ---- */
export function Row({
  label, hint, children, stack = false,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  stack?: boolean;
}) {
  return (
    <div>
      <div className={cn("flex gap-2", stack ? "flex-col" : "items-center justify-between")}>
        <span className={cn("shrink-0 text-caption font-semibold text-foreground", !stack && "min-w-[68px]")}>
          {label}
        </span>
        <div className={cn(stack ? "w-full" : "min-w-0 flex-1")}>{children}</div>
      </div>
      {hint && <p className="mt-1 text-caption leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ---- Segmented control ---- */
export function Seg<T extends string>({
  value, onChange, options, size = "md", className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode; title?: string }[];
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      role="group"
      className={cn(
        "flex gap-0.5 rounded-lg border border-border-subtle bg-sunken p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.title}
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-md font-semibold capitalize transition-colors [&_svg]:size-3.5",
              size === "sm" ? "h-6 px-1.5 text-pill" : "h-7 px-2 text-caption",
              on ? "bg-surface text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---- SegToggles: segmented shell, but each item toggles independently ---- */
export function SegToggles<T extends string>({
  items, className,
}: {
  items: { value: T; label: React.ReactNode; on: boolean; onToggle: () => void; title?: string }[];
  className?: string;
}) {
  return (
    <div role="group" className={cn("flex gap-0.5 rounded-lg border border-border-subtle bg-sunken p-0.5", className)}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          title={it.title}
          aria-pressed={it.on}
          onClick={it.onToggle}
          className={cn(
            "h-7 flex-1 rounded-md px-2 text-caption font-semibold capitalize transition-colors",
            it.on ? "bg-surface text-foreground shadow-xs" : "text-faint line-through hover:text-muted-foreground",
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ---- ChoiceGrid / ChoiceCard: visual pick between a small fixed set ---- */
export function ChoiceGrid({
  columns = 2, className, children,
}: {
  columns?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("grid gap-1.5", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
    >
      {children}
    </div>
  );
}

export function ChoiceCard({
  selected, onClick, preview, label, disabled,
}: {
  selected?: boolean;
  onClick?: () => void;
  preview?: React.ReactNode;
  label: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border p-2 text-left transition-colors disabled:opacity-45",
        selected
          ? "border-brand bg-brand/[0.05] ring-1 ring-inset ring-brand/20"
          : "border-border-subtle bg-surface-2 hover:border-border hover:bg-panel-hover",
      )}
    >
      {preview != null && (
        <span
          className={cn(
            "grid h-12 place-items-center overflow-hidden rounded-md border bg-white",
            selected ? "border-brand/25" : "border-border-subtle",
          )}
        >
          {preview}
        </span>
      )}
      <span className="flex items-center justify-between gap-1 px-0.5 text-caption font-medium text-foreground">
        {label}
        {selected && <span className="size-1.5 shrink-0 rounded-full bg-brand" />}
      </span>
    </button>
  );
}

/* ---- LayoutMini: a tiny schematic derived from a layout-variant name.
   Keeps layout choices visual without a per-variant asset. ---- */
export function LayoutMini({ variant }: { variant: string }) {
  const v = variant.toLowerCase();
  const box = "rounded-[2px] bg-[#d7dbe0]";
  const line = "rounded-full bg-[#c4c9d0]";
  const wrap = "flex h-8 w-[52px] items-center gap-1 p-1";

  const TextCol = ({ n = 3 }: { n?: number }) => (
    <span className="flex flex-1 flex-col justify-center gap-[3px]">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className={cn(line, "h-[2px]", i === n - 1 ? "w-2/3" : "w-full")} />
      ))}
    </span>
  );

  if (v.includes("text only")) return <span className={wrap}><TextCol n={4} /></span>;
  if (v.includes("background"))
    return (
      <span className={cn(wrap, "relative")}>
        <span className={cn(box, "absolute inset-1")} />
        <span className="relative z-10 flex w-full flex-col items-center gap-[3px]">
          <span className={cn("h-[2px] w-2/3 rounded-full bg-white/90")} />
          <span className={cn("h-[2px] w-1/2 rounded-full bg-white/70")} />
        </span>
      </span>
    );
  if (v.includes("left") || v.includes("photo + text"))
    return <span className={wrap}><span className={cn(box, "h-full w-5")} /><TextCol /></span>;
  if (v.includes("right") || v.includes("text + photo"))
    return <span className={wrap}><TextCol /><span className={cn(box, "h-full w-5")} /></span>;
  if (v.includes("compact list") || v.includes("icon list"))
    return (
      <span className="flex h-8 w-[52px] flex-col justify-center gap-[3px] p-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center gap-1">
            <span className={cn(box, "size-1.5")} /><span className={cn(line, "h-[2px] flex-1")} />
          </span>
        ))}
      </span>
    );
  if (/\d\s*(per row|across)/.test(v) || v.includes("grid") || v.includes("masonry") || v.includes("rows")) {
    const cols = v.includes("2") ? 2 : v.includes("3") ? 3 : v.includes("rows") ? 1 : 2;
    return (
      <span className="grid h-8 w-[52px] gap-[3px] p-1" style={{ gridTemplateColumns: `repeat(${cols || 2},1fr)` }}>
        {Array.from({ length: (cols || 2) * 2 }).map((_, i) => <span key={i} className={cn(box, "h-2.5")} />)}
      </span>
    );
  }
  if (v.includes("two columns"))
    return <span className={wrap}><TextCol n={2} /><TextCol n={2} /></span>;
  // default: image on top / photo cards / stacked
  return (
    <span className="flex h-8 w-[52px] flex-col gap-1 p-1">
      <span className={cn(box, "h-3.5 w-full")} />
      <TextCol n={2} />
    </span>
  );
}

/* ---- ScopeChip: contextual metadata about what's being edited ---- */
export function ScopeChip({
  icon, children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-panel-border bg-panel-section px-3 py-1.5 text-caption text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-faint">
      {icon}
      <span className="truncate">{children}</span>
    </div>
  );
}
