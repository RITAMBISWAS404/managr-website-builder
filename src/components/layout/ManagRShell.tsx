import * as React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, CalendarClock, Wallet, Globe, Settings, Menu,
  ChevronDown, HelpCircle, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { useS, useDerived } from "@/store/hooks";
import { ALL_PROPERTIES, OWNER } from "@/data/managr";

const TITLES: Record<string, string> = {
  "/website": "Website",
  "/website/availability": "Live availability",
  "/website/visits": "Visit settings",
  "/website/enquiries": "Website enquiries",
  "/website/bookings": "Booking requests",
  "/website/analytics": "Website analytics",
  "/website/plan": "Website plan",
  "/website/upgrade": "Upgrade",
  "/website/health": "Website health",
  "/website/settings": "Website settings",
  "/scheduled-visits": "Scheduled Visits",
};

const item =
  "group relative flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-sm font-medium text-white/60 transition-colors hover:bg-navy-hover hover:text-white [&_svg]:size-[18px] [&_svg]:shrink-0";
const activeItem = "bg-navy-active text-white font-semibold";

function usePlanBadge(dark: boolean) {
  const s = useS();
  const { advActive } = useDerived();
  if (s.plan === "lapsed")
    return <Badge variant="warning" className={dark ? "border-none bg-warning/20 text-warning-foreground/90" : ""}>Lapsed</Badge>;
  if (advActive)
    return <Badge variant="advanced" className={dark ? "border-none bg-white/15 text-white/90" : ""}>Advanced</Badge>;
  return <Badge variant="neutral" className={dark ? "border-none bg-white/10 text-white/70" : ""}>Free</Badge>;
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const s = useS();
  const { pathname } = useLocation();
  const websiteActive = pathname.startsWith("/website");
  const planBadge = usePlanBadge(true);

  return (
    <nav className="flex h-full flex-col overflow-y-auto p-3">
      <div className="flex items-center gap-2.5 px-2 pb-5 pt-1.5 text-[17px] font-bold tracking-tight text-white">
        <span className="grid size-7 place-items-center rounded-lg bg-brand text-white shadow-xs">
          <Globe className="size-4" />
        </span>
        ManagR
      </div>

      <div className="flex flex-col gap-0.5">
        <a className={item}><LayoutDashboard /> Dashboard</a>
        <a className={item}><Building2 /> Properties</a>
        <a className={item}><Users /> Leads &amp; CRM</a>
        <NavLink to="/scheduled-visits" onClick={onNavigate} className={({ isActive }) => cn(item, isActive && activeItem)}>
          <CalendarClock /> Scheduled Visits
        </NavLink>
        <a className={item}><Wallet /> Payments</a>
      </div>

      <div className="my-2.5 border-t border-white/[0.08]" />

      <div className="flex flex-col gap-0.5">
        <Link to="/website" onClick={onNavigate} className={cn(item, websiteActive && activeItem)}>
          <Globe /> <span className="flex-1">Website</span> {planBadge}
        </Link>
        <a className={item}><Settings /> Settings</a>
      </div>

      <p className="mt-auto px-2.5 pt-6 text-[11px] leading-relaxed text-white/35">
        Role: <b className="font-semibold text-white/55">{s.role}</b>
      </p>
    </nav>
  );
}

/* ---------- shared desktop application top bar ---------- */
function AppTopBar() {
  const [scope, setScope] = React.useState("All properties");
  const planBadge = usePlanBadge(false);
  const initials = OWNER.owner.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 hidden h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-6 lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-surface-2">
            <Building2 className="size-4 text-muted-foreground" />
            {scope}
            <ChevronDown className="size-3.5 text-faint" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[15rem]">
          <DropdownMenuLabel>Show data for</DropdownMenuLabel>
          {["All properties", ...ALL_PROPERTIES.map((p) => p.name)].map((name) => (
            <DropdownMenuItem
              key={name}
              onClick={() => { setScope(name); toast(name === "All properties" ? "Showing all properties" : `Showing ${name}`); }}
            >
              <Check className={cn("size-4", scope === name ? "opacity-100" : "opacity-0")} /> {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2">
        {planBadge}
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => toast("Help centre opens here")}>
          <HelpCircle /> Help
        </Button>
        <span className="mx-1 h-6 w-px bg-border" />
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full bg-tint-coral text-caption font-bold text-tint-coral-fg"
          title={OWNER.owner}
        >
          {initials}
        </span>
      </div>
    </header>
  );
}

export function ManagRShell() {
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);
  const title = TITLES[pathname] ?? "Website";

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-navy lg:block">
        <SideNav />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[248px] bg-navy p-0" hideClose>
          <SideNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-col">
        {/* mobile top bar */}
        <header className="sticky top-0 z-30 flex h-[52px] items-center gap-2 border-b border-border bg-surface px-3 lg:hidden">
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu />
          </Button>
          <h1 className="text-section font-semibold">{title}</h1>
          <span className="ml-auto grid size-8 place-items-center rounded-full bg-tint-coral text-pill font-bold text-tint-coral-fg">
            {OWNER.owner.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </header>

        {/* desktop application chrome */}
        <AppTopBar />

        <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-6 pb-28 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
