import * as React from "react";
import { Link } from "react-router-dom";
import { Info, Plus, X, CalendarClock, Building2, CalendarOff, Video, SlidersHorizontal, Minus } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  FieldGroup,
  ToggleField,
  Callout,
  AdvancedLock,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useS, useDerived } from "@/store/hooks";
import { publicProperties } from "@/store/selectors";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning", "Midday", "Evening"] as const;
const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

type Grid = Record<string, boolean>;
const key = (d: number, slot: string) => `${d}:${slot}`;

const PRESETS: Record<string, (d: number, slot: string) => boolean> = {
  "Weekday mornings": (d, slot) => d < 5 && slot === "Morning",
  "Weekday evenings": (d, slot) => d < 5 && slot === "Evening",
  Weekends: (d) => d >= 5,
};

const RULES = [
  ["Show a room this many days before it frees up", "leadDays"],
  ["Visitors allowed per time slot", "perSlot"],
  ["Least notice needed (hours)", "notice"],
  ["How far ahead people can book (days)", "horizon"],
] as const;

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <span className="inline-flex shrink-0 items-center overflow-hidden rounded-lg border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        aria-label="Decrease"
      >
        <Minus className="size-3.5" />
      </button>
      <b className="w-9 border-x border-border-subtle text-center text-sm tabular-nums">{value}</b>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        aria-label="Increase"
      >
        <Plus className="size-3.5" />
      </button>
    </span>
  );
}

export function VisitsScreen() {
  const s = useS();
  const { advActive } = useDerived();

  const [grid, setGrid] = React.useState<Grid>(() => {
    const g: Grid = {};
    DAYS.forEach((_, d) => SLOTS.forEach((slot) => (g[key(d, slot)] = (d < 5 && slot !== "Midday") || (d >= 5 && slot === "Morning"))));
    return g;
  });
  const [times, setTimes] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(TIMES.map((t, i) => [t, i !== 2])),
  );
  // `date` is the already-formatted display string (a single day, e.g.
  // "2 Oct", or a pre-set range like "21–23 Oct" — the create flow below
  // only ever produces single dates; existing range entries are preserved
  // as-is since there's no range picker to reconstruct them from).
  // `reason` is genuinely optional — the two seed entries show why it's
  // worth having, the create flow now actually lets the owner add one.
  const [blackouts, setBlackouts] = React.useState<{ id: string; date: string; reason?: string }[]>([
    { id: "b1", date: "2 Oct", reason: "Gandhi Jayanti" },
    { id: "b2", date: "21–23 Oct", reason: "travelling" },
  ]);
  const [newDate, setNewDate] = React.useState("");
  const [newReason, setNewReason] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const [rules, setRules] = React.useState({ leadDays: 7, perSlot: 2, notice: 3, horizon: 21 });

  if (!advActive)
    return (
      <Page size="full">
        <PageHead title="Visit settings" description="Let visitors book a viewing themselves." />
        <AdvancedLock
          feature="Visit booking"
          what="Visitors pick a day and time you've allowed, and it lands in Scheduled Visits tagged “Website”. No more writing every visit into the dashboard after a phone call."
          basic="you arrange every visit by phone and note it down yourself."
        />
      </Page>
    );

  const applyPreset = (name: string) =>
    setGrid((g) => {
      const next = { ...g };
      DAYS.forEach((_, d) => SLOTS.forEach((slot) => (next[key(d, slot)] = next[key(d, slot)] || PRESETS[name](d, slot))));
      return next;
    });

  const addBlackout = () => {
    if (!newDate) return;
    const date = new Date(newDate + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    setBlackouts((b) => [...b, { id: crypto.randomUUID(), date, reason: newReason.trim() || undefined }]);
    setNewDate("");
    setNewReason("");
    setAddOpen(false);
    setAddSheetOpen(false);
  };

  const removeBlackout = (id: string) => setBlackouts((b) => b.filter((x) => x.id !== id));

  return (
    <Page size="full">
      <PageHead
        title="Visit settings"
        description="Your scheduling control centre. The common case is two steps — pick days, pick times."
      />

      <PageBody>
        <SettingsCard
          icon={<CalendarClock />}
          tint="purple"
          title="When people can visit"
          description="Tap the blocks that work for you, then choose the exact times to offer inside them."
        >
          {/* schedule — the primary decision on this card, now sized to
              the card's actual width rather than an arbitrary cap: the
              label column has a comfortable min/max, the three day-part
              columns share whatever room remains equally. Quick patterns
              stay a compact secondary toolbar on the same row as the
              label, not a peer field competing with the grid below. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="text-sm font-semibold text-foreground">Days &amp; parts of day</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.keys(PRESETS).map((p) => (
                <Button key={p} variant="outline" size="xs" onClick={() => applyPreset(p)}>
                  <Plus className="size-3" /> {p}
                </Button>
              ))}
            </div>
          </div>

          {/* the day-label column is a fixed track (not a minmax with a
              loose upper bound) so it can never absorb the grid's leftover
              free space during track sizing — that absorption, not any
              margin/padding, was the actual cause of the old gap before
              "Morning". A fixed track can only ever be exactly as wide as
              its own value, so the 3 day-part columns get all the room
              they're due. */}
          <div
            role="group"
            aria-label="Days and parts of day visitors can book"
            className="grid grid-cols-[40px_repeat(3,1fr)] gap-2 text-caption sm:grid-cols-[64px_repeat(3,1fr)] sm:gap-4"
          >
            <span />
            {SLOTS.map((slot) => (
              <span key={slot} className="pb-1 text-center font-semibold text-faint">
                {slot}
              </span>
            ))}
            {DAYS.map((d, i) => (
              <React.Fragment key={d}>
                <span className="flex items-center font-bold text-muted-foreground">{d}</span>
                {SLOTS.map((slot) => {
                  const on = grid[key(i, slot)];
                  return (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={on}
                      aria-label={`${DAYS[i]} ${slot} ${on ? "on" : "off"}`}
                      onClick={() => setGrid((g) => ({ ...g, [key(i, slot)]: !g[key(i, slot)] }))}
                      className={cn(
                        "min-h-[46px] rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
                        on
                          ? "bg-brand text-primary-foreground"
                          : "bg-sunken text-faint hover:bg-[#e9ebef]",
                      )}
                    >
                      {on ? "On" : "—"}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* secondary — its own distinct section, marked with a divider
              rather than an eyebrow; "Exact times to offer" is a setting in
              its own right (same text-sm font-semibold role as "Days &
              parts of day" above it), not an implementation label. */}
          <div className="border-t border-border-subtle pt-4">
            <div className="mb-3 text-sm font-semibold text-foreground">Exact times to offer</div>
            <div role="group" aria-label="Exact visit times to offer" className="flex flex-wrap gap-2">
              {TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={times[t]}
                  onClick={() => setTimes((x) => ({ ...x, [t]: !x[t] }))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
                    times[t]
                      ? "border-brand bg-tint-coral font-semibold text-foreground"
                      : "border-border-subtle bg-surface font-medium text-muted-foreground hover:bg-surface-2",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<Building2 />}
          tint="blue"
          title="Which properties take visits"
          description="Booking is offered only on the properties you turn on here."
        >
          {/* the parent card is the only container — a flat divided list,
              not a bordered box nested inside it. */}
          <div className="divide-y divide-border-subtle">
            {publicProperties(s).map((p) => (
              <label
                key={p.id}
                htmlFor={`visit-prop-${p.id}`}
                className="flex cursor-pointer items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 flex-1 font-medium text-foreground">{p.name}</span>
                <Switch id={`visit-prop-${p.id}`} defaultChecked className="shrink-0" />
              </label>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<CalendarOff />}
          tint="amber"
          title="Days you're away"
          description="Blackout dates are removed from the calendar visitors see — no bookings land on them."
          footer={
            <>
              {/* desktop: a compact popover anchored to the trigger */}
              <div className="hidden sm:block">
                <Popover open={addOpen} onOpenChange={setAddOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus /> Add dates
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-72">
                    <div className="text-sm font-semibold text-foreground">Block a date</div>
                    <div className="mt-3 space-y-3">
                      <div>
                        <label htmlFor="blackout-date" className="text-caption font-medium text-muted-foreground">
                          Date
                        </label>
                        <Input
                          id="blackout-date"
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="blackout-reason" className="text-caption font-medium text-muted-foreground">
                          Reason (optional)
                        </label>
                        <Input
                          id="blackout-reason"
                          value={newReason}
                          onChange={(e) => setNewReason(e.target.value)}
                          placeholder="e.g. travelling or festival"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button size="sm" variant="primary" className="mt-3 w-full" onClick={addBlackout} disabled={!newDate}>
                      Add
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
              {/* mobile: the same small form deserves real, comfortable
                  space rather than a floating box anchored to a small
                  button — a bottom sheet is the project's own established
                  pattern for this (already used by the app shell). */}
              <div className="sm:hidden">
                <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus /> Add dates
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom">
                    <SheetHeader>
                      <SheetTitle>Block a date</SheetTitle>
                      <SheetDescription>Visitors won't be able to book a visit on this date.</SheetDescription>
                    </SheetHeader>
                    <SheetBody className="space-y-4">
                      <div>
                        <label htmlFor="blackout-date-m" className="text-sm font-semibold text-foreground">
                          Date
                        </label>
                        <Input
                          id="blackout-date-m"
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <label htmlFor="blackout-reason-m" className="text-sm font-semibold text-foreground">
                          Reason (optional)
                        </label>
                        <Input
                          id="blackout-reason-m"
                          value={newReason}
                          onChange={(e) => setNewReason(e.target.value)}
                          placeholder="e.g. travelling or festival"
                          className="mt-1.5"
                        />
                      </div>
                    </SheetBody>
                    <SheetFooter>
                      <Button variant="primary" onClick={addBlackout} disabled={!newDate}>
                        Add
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          }
        >
          {blackouts.length ? (
            <div className="divide-y divide-border-subtle">
              {blackouts.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">{b.date}</div>
                    {b.reason && <div className="text-caption text-muted-foreground">{b.reason}</div>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${b.date}${b.reason ? ` — ${b.reason}` : ""}`}
                    onClick={() => removeBlackout(b.id)}
                    className="shrink-0"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-muted-foreground">No blackout dates. Add one whenever you'll be away.</p>
          )}
        </SettingsCard>

        <SettingsCard
          icon={<Video />}
          tint="green"
          title="Visit types"
          description="How visitors can meet you."
        >
          <FieldGroup>
            <ToggleField label="In person" control={<Switch defaultChecked />} />
            <ToggleField
              label="Video walkthrough"
              description="A video call instead of coming in."
              control={<Switch />}
            />
          </FieldGroup>
        </SettingsCard>

        <SettingsCard
          icon={<SlidersHorizontal />}
          tint="cyan"
          title="Timing rules"
          description="Defaults shown — a product decision to confirm."
        >
          {/* each rule is its own tight label+stepper pairing rather than a
              full-width row with a small control stranded at the far edge —
              and a 2-up grid halves the vertical scroll these four rules
              used to take. */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {RULES.map(([label, k]) => (
              <div
                key={k}
                className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">{label}</span>
                <Stepper value={rules[k]} onChange={(n) => setRules((r) => ({ ...r, [k]: n }))} />
              </div>
            ))}
          </div>
        </SettingsCard>

        {/* full-width card, capped reading width for the prose only */}
        <Callout tone="info" icon={<Info className="size-4" />} title="Where this shows up">
          <span className="block max-w-[760px]">
            These settings power the <b>Visit booking</b> section on your website, and every booking appears in{" "}
            <Link to="/scheduled-visits" className="font-semibold text-brand">
              Scheduled Visits
            </Link>{" "}
            with a “Website” tag.
          </span>
        </Callout>
      </PageBody>
    </Page>
  );
}
