import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Link2, Info, ShieldCheck, Sparkles, Globe, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

/* ============================================================================
   Cross-screen primitives. One implementation each.
   ========================================================================== */

/* ---------- page header ---------- */
export function PageHead({
  title,
  description,
  back = "/website",
  backLabel = "Website",
  actions,
}: {
  title: string;
  description?: string;
  back?: string | null;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      {back && (
        <Link
          to={back}
          className="mb-2.5 -ml-1 inline-flex items-center gap-1 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" /> {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-display font-bold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-1.5 max-w-prose text-body text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
export const PageHeader = PageHead;

/* ---------- section header / eyebrow ---------- */
export function SectionHeader({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3 pl-0.5", className)}>
      <h2 className="text-micro font-bold uppercase tracking-[0.07em] text-faint">{children}</h2>
      {action}
    </div>
  );
}
export const GroupLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mb-2 text-micro font-bold uppercase text-faint", className)}>{children}</div>
);

/* ---------- panel header (editor left/right panels, sheets) ---------- */
export function PanelHeader({
  title,
  sub,
  action,
  className,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border-subtle px-3.5", className)}>
      <div className="min-w-0">
        <div className="truncate text-body font-semibold text-foreground">{title}</div>
        {sub && <div className="truncate text-caption text-muted-foreground">{sub}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- surface (neutral grouped region — the anti "everything-is-a-card") ---------- */
export function Surface({
  tone = "sunken",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "sunken" | "plain" }) {
  return (
    <div
      className={cn("rounded-lg", tone === "sunken" && "border border-border-subtle bg-surface-2", className)}
      {...props}
    />
  );
}

/* ---------- key/value row (settings, status) ---------- */
export function KeyRow({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-2.5", className)}>
      <span className="w-14 shrink-0 text-caption font-medium text-muted-foreground sm:w-20">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  );
}

/* ---------- notice / callout ---------- */
const noticeTone = {
  info: "border-l-info bg-info-surface",
  warn: "border-l-warning bg-warning-surface",
  ok: "border-l-success bg-success-surface",
  stop: "border-l-destructive bg-destructive/[0.05]",
  advanced: "border-l-advanced bg-advanced-surface",
  plain: "border-l-border-strong bg-surface-2",
};
export function Notice({
  tone = "plain",
  title,
  children,
  icon,
  className,
}: {
  tone?: keyof typeof noticeTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-l-[3px] px-3.5 py-3 text-body leading-relaxed text-foreground", noticeTone[tone], className)}>
      {title && (
        <div className="mb-0.5 flex items-center gap-1.5 font-semibold [&_svg]:size-4 [&_svg]:shrink-0">
          {icon} {title}
        </div>
      )}
      {children}
    </div>
  );
}
export const Callout = Notice;

/* ---------- inline scope note ("this is global") — integrated, not an alert ---------- */
export function ScopeNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-2 px-3.5 py-2.5 text-caption text-muted-foreground", className)}>
      <Globe className="mt-0.5 size-3.5 shrink-0 text-faint" />
      <span>{children}</span>
    </div>
  );
}

/* ---------- empty state ---------- */
export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface px-5 py-8 text-center", className)}>
      {icon && (
        <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-surface-2 text-faint [&_svg]:size-[18px]">
          {icon}
        </div>
      )}
      <div className="text-section font-semibold text-foreground">{title}</div>
      {children && <p className="mx-auto mt-1 max-w-xs text-caption text-muted-foreground">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/* ---------- ManagR data boundary ---------- */
export function FromManagR({ where }: { where?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-info-surface px-2 py-0.5 text-caption font-medium text-info">
      <Link2 className="size-3" /> From ManagR{where ? ` · ${where}` : ""}
    </span>
  );
}
export function BoundField({ label, value, where }: { label: string; value: string; where: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-2 px-3.5 py-3">
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold text-foreground">{value}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <FromManagR />
        <button className="text-caption font-semibold text-brand hover:underline">Edit in ManagR →</button>
      </div>
      {where !== "—" && <div className="mt-1 text-caption text-faint">Managed in {where}</div>}
    </div>
  );
}

/* ---------- advanced lock ---------- */
export function AdvancedLock({
  feature,
  what,
  basic,
  onNotNow,
}: {
  feature: string;
  what: string;
  basic?: string;
  onNotNow?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-advanced-border bg-advanced-surface p-4">
      <div className="flex items-center gap-1.5 text-caption font-semibold uppercase text-advanced">
        <Sparkles className="size-3.5" /> Available with Advanced
      </div>
      <p className="mt-2 text-section font-semibold text-foreground">{feature}</p>
      <p className="mt-1 text-body text-muted-foreground">{what}</p>
      {basic && <p className="mt-2 text-caption text-muted-foreground">On Basic: {basic}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="primary">
          <Link to="/website/upgrade">See Advanced</Link>
        </Button>
        {onNotNow && (
          <Button size="sm" variant="ghost" onClick={onNotNow}>
            Not now
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------- selectable / toggle row ---------- */
export function ChoiceRow({
  title,
  description,
  control,
  selected,
  onClick,
  as = "label",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  control?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  as?: "label" | "button" | "div";
  className?: string;
}) {
  const Comp = as as React.ElementType;
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-body transition-colors",
        onClick || as === "label" ? "cursor-pointer" : "",
        selected ? "border-brand bg-brand/[0.05] ring-1 ring-inset ring-brand/20" : "border-border bg-surface hover:bg-surface-2",
        className,
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-foreground">{title}</span>
        {description && <span className="mt-0.5 block text-caption text-muted-foreground">{description}</span>}
      </span>
      {control && <span className="shrink-0">{control}</span>}
    </Comp>
  );
}
export function ChoiceGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

/* ---------- status badge (dot + text, optionally a solid pill) ---------- */
const statusMap = {
  live: { dot: "bg-success", text: "text-success", pill: "border-success-border bg-success-surface text-success" },
  ok: { dot: "bg-success", text: "text-success", pill: "border-success-border bg-success-surface text-success" },
  attention: { dot: "bg-warning", text: "text-warning", pill: "border-warning-border bg-warning-surface text-warning" },
  action: { dot: "bg-destructive", text: "text-destructive", pill: "border-destructive/25 bg-destructive/[0.06] text-destructive" },
  off: { dot: "bg-faint", text: "text-muted-foreground", pill: "border-border bg-sunken text-muted-foreground" },
  pending: { dot: "bg-warning", text: "text-warning", pill: "border-warning-border bg-warning-surface text-warning" },
  advanced: { dot: "bg-advanced", text: "text-advanced", pill: "border-advanced-border bg-advanced-surface text-advanced" },
};
export function StatusBadge({
  status,
  children,
  pill = false,
  className,
}: {
  status: keyof typeof statusMap;
  children: React.ReactNode;
  pill?: boolean;
  className?: string;
}) {
  const s = statusMap[status];
  if (pill)
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption font-semibold leading-none", s.pill, className)}>
        <span className={cn("size-1.5 rounded-full", s.dot)} /> {children}
      </span>
    );
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-caption font-semibold", s.text, className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} /> {children}
    </span>
  );
}

/* ---------- stat ---------- */
export function Stat({ value, label }: { value: React.ReactNode; label: React.ReactNode }) {
  return (
    <div>
      <div className="text-title font-bold tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-caption text-muted-foreground">{label}</div>
    </div>
  );
}

/* ---------- ManagR tinted icon square ---------- */
export type Tint = "blue" | "green" | "amber" | "purple" | "coral" | "cyan";
const TINT: Record<Tint, string> = {
  blue: "bg-tint-blue text-tint-blue-fg",
  green: "bg-tint-green text-tint-green-fg",
  amber: "bg-tint-amber text-tint-amber-fg",
  purple: "bg-tint-purple text-tint-purple-fg",
  coral: "bg-tint-coral text-tint-coral-fg",
  cyan: "bg-tint-cyan text-tint-cyan-fg",
};
/** subtle white→tint wash for a metric card (matches the ManagR Scheduled Visits stat cards) */
const TINT_WASH: Record<Tint, string> = {
  blue: "linear-gradient(157deg, #ffffff 55%, var(--tint-blue))",
  green: "linear-gradient(157deg, #ffffff 55%, var(--tint-green))",
  amber: "linear-gradient(157deg, #ffffff 55%, var(--tint-amber))",
  purple: "linear-gradient(157deg, #ffffff 55%, var(--tint-purple))",
  coral: "linear-gradient(157deg, #ffffff 55%, var(--tint-coral))",
  cyan: "linear-gradient(157deg, #ffffff 55%, var(--tint-cyan))",
};
export function IconTile({
  icon, tint = "blue", size = "md", className,
}: { icon: React.ReactNode; tint?: Tint; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-lg",
        size === "sm" && "size-7 [&_svg]:size-3.5",
        size === "md" && "size-9 [&_svg]:size-[18px]",
        size === "lg" && "size-11 rounded-xl [&_svg]:size-5",
        TINT[tint],
        className,
      )}
    >
      {icon}
    </span>
  );
}

/* ---------- card header: icon tile + title + subtitle + right action (ManagR card pattern) ---------- */
export function CardHead({
  icon, tint = "blue", title, subtitle, action, size = "sm", className,
}: {
  icon?: React.ReactNode;
  tint?: Tint;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", size === "md" ? "px-4 py-3.5" : "px-4 py-3", className)}>
      {icon && <IconTile icon={icon} tint={tint} size={size === "md" ? "lg" : "md"} />}
      <div className="min-w-0 flex-1">
        <div className={cn("truncate font-bold text-foreground", size === "md" ? "text-section" : "text-sm")}>{title}</div>
        {subtitle && <div className="truncate text-caption text-muted-foreground">{subtitle}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-1">{action}</div>}
    </div>
  );
}

/* ---------- ManagR metric card (big number + label + sublabel + icon square) ---------- */
export function MetricCard({
  icon, tint = "blue", value, label, sublabel, wash = false, className,
}: {
  icon?: React.ReactNode; tint?: Tint; wash?: boolean;
  value: React.ReactNode; label: React.ReactNode; sublabel?: React.ReactNode; className?: string;
}) {
  return (
    <div
      className={cn("flex min-h-[116px] flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-xs sm:p-[18px]", className)}
      style={wash ? { background: TINT_WASH[tint] } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[28px] font-bold leading-none tracking-tight tabular-nums text-foreground">{value}</div>
        {icon && <IconTile icon={icon} tint={tint} className="-mt-0.5" />}
      </div>
      <div className="mt-3">
        <div className="text-caption font-medium leading-snug text-foreground">{label}</div>
        {sublabel && <div className="mt-0.5 text-pill text-faint">{sublabel}</div>}
      </div>
    </div>
  );
}

export function Placeholder({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("ph", className)}>{children}</div>;
}

/* ============================================================================
   Website Management page language — shared by /website/settings, /availability,
   /visits, /enquiries, /bookings. One card style, one form rhythm, one list.
   ========================================================================== */

/* ---------- the one Website-Management content frame ----------
   Every management page — header AND body — sits in this, so the five pages
   share one outer geometry: same left/right edge, same gutters, same header
   anchor. Width *inside* the frame is a per-section decision (a form reads
   narrow, a table uses the room) — never a per-page one. */
export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[840px]", className)}>{children}</div>;
}

/* ---------- page wrapper: consistent vertical rhythm under PageHead ---------- */
export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-5", className)}>{children}</div>;
}

/* ---------- a settings group: icon + title + description / content / footer ----------
   The header is one unit: the icon tile is nudged to sit optically level with the
   title's cap-height, and a trailing `action` shares the same top-anchored row. */
export function SettingsCard({
  icon,
  tint = "blue",
  title,
  description,
  action,
  children,
  footer,
  className,
}: {
  icon?: React.ReactNode;
  tint?: Tint;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-start gap-3 border-b border-border-subtle p-4 sm:px-5 sm:py-4">
        {icon && <IconTile icon={icon} tint={tint} size="md" className="mt-px" />}
        <div className="min-w-0 flex-1">
          <h3 className="text-section font-bold leading-snug text-foreground">{title}</h3>
          {description && (
            <p className="mt-1 max-w-[68ch] text-caption leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0 pl-1">{action}</div>}
      </div>
      {React.Children.toArray(children).length > 0 && <div className="space-y-4 p-4 sm:p-5">{children}</div>}
      {footer && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border-subtle bg-surface-2 px-4 py-3 text-caption text-muted-foreground sm:px-5">
          {footer}
        </div>
      )}
    </Card>
  );
}

/* ---------- a vertical labelled form field (label / control / hint) ---------- */
export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      <div className={cn(label && "mt-1.5")}>{children}</div>
      {hint && <p className="mt-1 text-caption leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ---------- borderless labelled control row (switch / checkbox) ----------
   Wrap a set of these in <FieldGroup> so dividers — not boxes — separate them.
   The row's label is wired to `control` (Radix Switch/Checkbox both take `id`)
   so screen readers announce a name and the whole label area toggles it. */
export function ToggleField({
  label,
  description,
  control,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  control: React.ReactElement;
  className?: string;
}) {
  const autoId = React.useId();
  const id = (control.props as { id?: string }).id ?? autoId;
  const wired = React.isValidElement(control) ? React.cloneElement(control, { id } as never) : control;
  return (
    <div className={cn("flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0", className)}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-body font-medium text-foreground">{label}</span>
        {description && (
          <span className="mt-0.5 block text-caption leading-relaxed text-muted-foreground">{description}</span>
        )}
      </label>
      <div className="shrink-0 pt-0.5">{wired}</div>
    </div>
  );
}
export function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-border-subtle", className)}>{children}</div>;
}

/* ---------- segmented control — small either/or choices ---------- */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-lg border border-border-subtle bg-sunken p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "rounded-[7px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            size === "sm" ? "px-2.5 py-1 text-caption" : "px-3 py-1.5 text-sm",
            value === o.value ? "bg-surface text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- operational list container (desktop rows / mobile cards) ---------- */
export function ListContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface", className)}>
      <div className="divide-y divide-border-subtle">{children}</div>
    </div>
  );
}

/* ---------- filter / search bar above a list ---------- */
export function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

/* ---------- save state bar (sticky, appears only when there's something to save) ---------- */
export type SaveState = "clean" | "dirty" | "saving" | "saved" | "error";
export function SaveBar({
  state,
  onSave,
  onReset,
  className,
}: {
  state: SaveState;
  onSave: () => void;
  onReset: () => void;
  className?: string;
}) {
  if (state === "clean") return null;
  const meta: Record<Exclude<SaveState, "clean">, { icon: React.ReactNode; text: string }> = {
    dirty: { icon: <span className="size-2 rounded-full bg-warning" />, text: "Unsaved changes" },
    saving: { icon: <Loader2 className="size-3.5 animate-spin text-muted-foreground" />, text: "Saving…" },
    saved: { icon: <Check className="size-3.5 text-success" />, text: "All changes saved" },
    error: { icon: <AlertCircle className="size-3.5 text-destructive" />, text: "Couldn't save — try again" },
  };
  const m = meta[state];
  return (
    <div
      className={cn(
        "sticky bottom-3 z-30 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/95 px-3.5 py-2.5 shadow-e2 backdrop-blur supports-[backdrop-filter]:bg-surface/85",
        className,
      )}
    >
      <span role="status" aria-live="polite" className="flex items-center gap-2 text-caption font-medium text-muted-foreground">
        <span aria-hidden="true" className="flex items-center">{m.icon}</span> {m.text}
      </span>
      <span className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onReset} disabled={state === "saving" || state === "saved"}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={onSave} loading={state === "saving"} disabled={state === "saved"}>
          Save changes
        </Button>
      </span>
    </div>
  );
}

/* ---------- a tiny hook to drive SaveBar from any settings page ---------- */
export function useSaveState() {
  const [state, setState] = React.useState<SaveState>("clean");
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const markDirty = React.useCallback(() => {
    setState((s) => (s === "saving" ? s : "dirty"));
  }, []);
  const save = React.useCallback(() => {
    setState("saving");
    timer.current = setTimeout(() => {
      setState("saved");
      timer.current = setTimeout(() => setState("clean"), 1800);
    }, 650);
  }, []);
  const reset = React.useCallback(() => setState("clean"), []);
  return { state, markDirty, save, reset };
}

export const InfoIcon = Info;
export const ShieldIcon = ShieldCheck;
