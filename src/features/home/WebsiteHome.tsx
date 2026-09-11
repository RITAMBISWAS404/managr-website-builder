import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ExternalLink, Pencil, Copy, QrCode, MessageCircle, Layers, Settings2, Eye, Globe, ChevronRight,
  CalendarClock, Inbox, ClipboardCheck, Sparkles, ArrowRight, AlertCircle, UploadCloud, Building2,
  PhoneCall, History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { SectionHeader, StatusBadge, MetricCard, IconTile, EmptyState, type Tint } from "@/components/common";
import { Hint } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { SetupFlow } from "@/features/setup/SetupFlow";
import { PlanBanner } from "./PlanBanner";
import { OWNER } from "@/data/managr";
import { relTime } from "@/lib/utils";

export function WebsiteHome() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { advActive, url, publicProperties, check, dirty } = useDerived();

  if (s.setup !== "done") return <SetupFlow />;

  const health: { status: Parameters<typeof StatusBadge>[0]["status"]; label: string; detail: string } =
    check.blockers.length
      ? { status: "action", label: `${check.blockers.length} to fix`, detail: check.blockers[0].msg }
      : check.warnings.length
        ? { status: "attention", label: `${check.warnings.length} to review`, detail: check.warnings[0].msg }
        : { status: "ok", label: "Looks good", detail: "Nothing needs your attention" };

  const lastPub = s.versions.find((v) => v.isLive)?.ts;

  const next:
    | { title: string; body: string; cta: string; to: string; icon: React.ReactNode; tint: Tint }
    | null = check.blockers.length
    ? { title: "A few things need fixing", body: check.blockers[0].msg, cta: "Open website health", to: "/website/health", icon: <AlertCircle />, tint: "amber" }
    : dirty
      ? { title: "You have changes to publish", body: "Visitors still see your last published version.", cta: "Review & publish", to: "/website/editor", icon: <UploadCloud />, tint: "coral" }
      : !publicProperties.length && s.siteLive
        ? { title: "Your website has no properties yet", body: "Add and approve a property in ManagR — it shows on your site automatically.", cta: "Open the editor", to: "/website/editor", icon: <Building2 />, tint: "coral" }
        : null;

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${url}`).catch(() => {});
    toast.success("Link copied");
  };

  const manage: { to: string; name: string; sub: string; icon: React.ReactNode; tint: Tint; locked: boolean }[] = [
    { to: "/website/editor", name: "Editor", sub: "Sections, wording and design", icon: <Layers />, tint: "coral", locked: false },
    { to: "/website/settings", name: "Website settings", sub: "Address, navigation and contact", icon: <Settings2 />, tint: "blue", locked: false },
    { to: "/website/availability", name: "Live availability", sub: "Show free beds on property pages", icon: <Eye />, tint: "green", locked: !advActive },
    { to: "/website/visits", name: "Visit settings", sub: "When visitors can book a viewing", icon: <CalendarClock />, tint: "purple", locked: !advActive },
    { to: "/website/enquiries", name: "Enquiries", sub: "Leads from your website", icon: <Inbox />, tint: "amber", locked: !advActive },
    { to: "/website/bookings", name: "Booking requests", sub: "Move-in requests to decide on", icon: <ClipboardCheck />, tint: "cyan", locked: !advActive },
  ];

  const activity = [
    lastPub ? { text: "Published a new version", when: relTime(lastPub) } : null,
    advActive ? { text: "3 new website enquiries", when: "1d ago" } : null,
    advActive ? { text: "A visit was booked from your website", when: "1d ago" } : null,
  ].filter(Boolean) as { text: string; when: string }[];

  return (
    <div className="space-y-7">
      {/* ================= page header ================= */}
      <header className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-display font-bold tracking-tight text-foreground">Website</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {advActive ? "Advanced plan" : "Basic plan · free"}
            {lastPub && <> · published {relTime(lastPub)}</>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge pill status={s.siteLive ? "live" : "off"} className="hidden sm:inline-flex">
            {s.siteLive ? "Live" : "Offline"}
          </StatusBadge>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/website/preview"><ExternalLink /> View live site</Link>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link to="/website/editor"><Pencil /> Open editor</Link>
            </Button>
          </div>
        </div>
      </header>

      <PlanBanner />

      {/* ================= one thing to do next ================= */}
      {next && (
        <div className="flex flex-col gap-3 rounded-2xl border border-brand/25 bg-surface p-4 shadow-e1 sm:flex-row sm:items-center sm:gap-4">
          <IconTile icon={next.icon} tint={next.tint} size="lg" className="shadow-xs" />
          <div className="min-w-0 flex-1">
            <div className="text-micro font-bold uppercase tracking-[0.07em] text-brand">Next</div>
            <div className="mt-1 text-section font-semibold text-foreground">{next.title}</div>
            <p className="mt-0.5 text-body text-muted-foreground">{next.body}</p>
          </div>
          <Button variant="primary" className="shrink-0" onClick={() => nav(next.to)}>
            {next.cta} <ArrowRight />
          </Button>
        </div>
      )}

      {/* ================= your website ================= */}
      <section>
        <SectionHeader>Your website</SectionHeader>
        <Card className="overflow-hidden">
          {/* region 1 — the website itself + its live state */}
          <div className="p-5">
            <div className="flex items-center gap-4">
              <IconTile icon={<Globe />} tint="blue" size="lg" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-section font-bold leading-tight text-foreground">{OWNER.biz}</div>
                <a
                  href={`https://${url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-block max-w-full truncate font-mono text-caption text-muted-foreground transition-colors hover:text-brand hover:underline"
                >
                  {url}
                </a>
              </div>
              <div className="flex shrink-0 items-center divide-x divide-border overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
                <Hint label="Copy address">
                  <button onClick={copyLink} aria-label="Copy website address" className="grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"><Copy /></button>
                </Hint>
                <Hint label="Share QR code">
                  <button aria-label="Share QR code" className="grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"><QrCode /></button>
                </Hint>
                <Hint label="Open live site">
                  <Link to="/website/preview" aria-label="Open live site" className="grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"><ExternalLink /></Link>
                </Hint>
              </div>
            </div>

            {/* live state — one quiet line; the switch is the control */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-micro font-bold uppercase tracking-[0.06em] text-faint">Status</div>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <StatusBadge status={s.siteLive ? "live" : "off"} className="text-sm font-semibold">{s.siteLive ? "Live" : "Offline"}</StatusBadge>
                  <span className="text-caption text-muted-foreground">
                    {s.siteLive ? "Visitors can see it" : "Visitors see a short notice"}
                  </span>
                </div>
              </div>
              <Switch
                checked={s.siteLive}
                onCheckedChange={(v) => { dispatch({ type: "patch", patch: { siteLive: v } }); toast(v ? "Website is live" : "Website taken offline"); }}
                aria-label={s.siteLive ? "Take website offline" : "Make website live"}
                className="shrink-0"
              />
            </div>
          </div>

          {/* region 2 — plan & health, a secondary facts strip (deliberately
              denser and side-by-side, so it reads as one supporting strip
              under the status line rather than a third look-alike row). */}
          <div className="grid grid-cols-1 divide-y divide-border-subtle border-t border-border-subtle sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <FactCell label="Plan" action={<PanelLink to={advActive ? "/website/plan" : "/website/upgrade"}>{advActive ? "Manage plan" : "See Advanced"}</PanelLink>}>
              <div className="font-semibold text-foreground">{advActive ? "Advanced" : "Basic — free"}</div>
              <div className="mt-0.5 text-caption text-muted-foreground">{advActive ? "Every feature is on" : "Upgrade any time"}</div>
            </FactCell>
            <FactCell
              label="Health"
              attention={health.status === "action" || health.status === "attention"}
              action={
                health.status === "ok"
                  ? <PanelLink to="/website/health">Full report</PanelLink>
                  : (
                    <Button asChild variant="outline" size="xs" className="shrink-0">
                      <Link to="/website/health">Review <ChevronRight /></Link>
                    </Button>
                  )
              }
            >
              <StatusBadge status={health.status} className="text-sm font-semibold">{health.label}</StatusBadge>
              <div className="mt-0.5 truncate text-caption text-muted-foreground">{health.detail}</div>
            </FactCell>
          </div>
        </Card>
      </section>

      {/* ================= this week ================= */}
      <section>
        <SectionHeader action={<SectionLink to="/website/analytics">See more</SectionLink>}>This week</SectionHeader>
        <div className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-3", advActive && "xl:grid-cols-5")}>
          <MetricCard tint="blue" icon={<Eye />} value="8" label="Visitors" />
          <MetricCard tint="green" icon={<MessageCircle />} value="3" label="WhatsApp chats" />
          <MetricCard tint="cyan" icon={<PhoneCall />} value="2" label="Calls" />
          {advActive && <MetricCard tint="amber" icon={<Inbox />} value="2" label="Enquiries" />}
          {advActive && <MetricCard tint="purple" icon={<CalendarClock />} value="1" label="Visits booked" />}
        </div>
      </section>

      {/* ================= manage ================= */}
      <section>
        <SectionHeader>Manage</SectionHeader>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
          {manage.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group flex flex-col gap-3.5 rounded-xl border border-border bg-surface p-4 shadow-xs transition-[background-color,border-color] hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <IconTile icon={m.icon} tint={m.tint} />
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-snug text-foreground">{m.name}</div>
                  <div className="mt-0.5 text-caption leading-snug text-muted-foreground">{m.sub}</div>
                </div>
                {m.locked ? (
                  <span className="mb-px inline-flex shrink-0 items-center gap-1 text-caption font-semibold text-advanced"><Sparkles className="size-3" /> Advanced</span>
                ) : (
                  <ChevronRight className="mb-0.5 size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= recent activity ================= */}
      <section>
        <SectionHeader>Recent activity</SectionHeader>
        {activity.length ? (
          <div className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface-2">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
                <History className="size-3.5 shrink-0 text-faint" />
                <span className="min-w-0 flex-1 truncate text-foreground">{a.text}</span>
                <span className="shrink-0 tabular-nums text-caption text-muted-foreground">{a.when}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Nothing yet" className="py-7">
            Publishing changes, new enquiries and booked visits will show up here.
          </EmptyState>
        )}
      </section>
    </div>
  );
}

/* ================= local composition pieces ================= */

/** a compact fact cell for the secondary strip under the status line:
 *  label on its own line, then the value stack, then an optional action —
 *  deliberately vertical (not a row) so it reads as denser, secondary
 *  information rather than a third copy of the primary status row.
 *  `attention` gives the cell a whisper-warm fill when it needs a glance. */
function FactCell({
  label, children, action, attention = false,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  attention?: boolean;
}) {
  return (
    <div className={cn("min-w-0 px-5 py-4", attention && "bg-warning-wash")}>
      <div className="text-micro font-bold uppercase tracking-[0.06em] text-faint">{label}</div>
      <div className="mt-1.5 min-w-0 text-sm">{children}</div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** the interactive text-link used inside a StatPanel */
function PanelLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group/link inline-flex items-center gap-1 text-caption font-semibold text-brand hover:underline">
      {children}
      <ChevronRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
    </Link>
  );
}

/** the action shown on the right of a SectionHeader */
function SectionLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className={cn("group/sl inline-flex items-center gap-0.5 text-caption font-semibold text-brand hover:underline")}>
      {children}
      <ChevronRight className="size-3.5 transition-transform group-hover/sl:translate-x-0.5" />
    </Link>
  );
}
