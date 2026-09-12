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
  ListContainer,
  Callout,
  AdvancedLock,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [blackouts, setBlackouts] = React.useState(["2 Oct — Gandhi Jayanti", "21–23 Oct — travelling"]);
  const [newDate, setNewDate] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
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
    const label = new Date(newDate + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    setBlackouts((b) => [...b, label]);
    setNewDate("");
    setAddOpen(false);
  };

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

          <div
            role="group"
            aria-label="Days and parts of day visitors can book"
            className="grid grid-cols-[minmax(64px,120px)_repeat(3,1fr)] gap-3 text-caption sm:gap-4"
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

          {/* secondary — a different configuration layer than the schedule
              above, set apart in the same quiet inset panel used elsewhere
              in the refined workspace for "configuration of the decision
              above" content. Same full width as the grid above it now. */}
          <div className="rounded-xl bg-surface-2 p-4 sm:p-5">
            <div className="mb-3 text-micro font-bold uppercase tracking-[0.07em] text-faint">Exact times to offer</div>
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
          <ListContainer>
            {publicProperties(s).map((p) => (
              <label
                key={p.id}
                htmlFor={`visit-prop-${p.id}`}
                className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3"
              >
                <span className="font-medium text-foreground">{p.name}</span>
                <Switch id={`visit-prop-${p.id}`} defaultChecked />
              </label>
            ))}
          </ListContainer>
        </SettingsCard>

        <SettingsCard
          icon={<CalendarOff />}
          tint="amber"
          title="Days you're away"
          description="Blackout dates are removed from the calendar visitors see — no bookings land on them."
          footer={
            <Popover open={addOpen} onOpenChange={setAddOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus /> Add dates
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64">
                <div id="blackout-label" className="text-sm font-semibold text-foreground">
                  Block a date
                </div>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  aria-labelledby="blackout-label"
                  className="mt-2"
                />
                <Button size="sm" variant="primary" className="mt-2 w-full" onClick={addBlackout} disabled={!newDate}>
                  Add
                </Button>
              </PopoverContent>
            </Popover>
          }
        >
          {blackouts.length ? (
            <ListContainer>
              {blackouts.map((d, i) => (
                <div key={d + i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-body">
                  {d}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${d}`}
                    onClick={() => setBlackouts((b) => b.filter((_, x) => x !== i))}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </ListContainer>
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
