import { Link } from "react-router-dom";
import { ShieldCheck, Info, Eye, Layers, Building2, Lock } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  Field,
  Segmented,
  ChoiceCard,
  ListContainer,
  StatusBadge,
  IconTile,
  Callout,
  AdvancedLock,
} from "@/components/common";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { ALL_PROPERTIES, FRESH, freshness } from "@/data/managr";
import { publicProperties, staleProp } from "@/store/selectors";

const LEVELS = [
  {
    key: "property",
    name: "The whole property",
    desc: "One line at the top of a property page.",
    ex: "“3 beds available” · “Full — from 20 Sep”",
  },
  {
    key: "roomtype",
    name: "Each room type",
    desc: "A line on every room type. Where most of the value is.",
    ex: "Triple: 2 now · Double: full, next free 15 Sep",
  },
  {
    key: "bed",
    name: "Every bed",
    desc: "A room picture showing which beds are free. Very persuasive — but shows how your building fills up.",
    ex: "▢▢▣▣  (never any names)",
  },
] as const;

const NEVER_SHOWN = [
  "Tenant names, photos, phone numbers or documents",
  "Why a bed is blocked",
  "Your exact street address",
  "Which bed a particular person is in",
];

export function AvailabilityScreen() {
  const s = useS();
  const dispatch = useDispatch();
  const { advActive } = useDerived();
  const set = (patch: Partial<typeof s>) => dispatch({ type: "patch", patch });

  if (!advActive)
    return (
      <Page size="full">
        <PageHead title="Live availability" description="Show real free beds on your property pages." />
        <AdvancedLock
          feature="Live bed availability"
          what="Visitors see “3 beds available” or “Full — from 20 Sept”, straight from the bed status your staff keep every day. It's the biggest reason a serious tenant calls."
          basic="property pages show photos, rent and rooms — but not availability."
        />
      </Page>
    );

  const rows = [...publicProperties(s), ...ALL_PROPERTIES.filter((p) => p.status !== "live")];

  return (
    <Page size="full">
      <PageHead
        title="Live availability"
        description="Sophisticated underneath, simple to set. Choose what visitors see and where."
      />

      <PageBody>
        {/* master on/off — identity+explanation left, current state+toggle
            right, the same horizontal relationship used on /website for a
            single-control card, so it doesn't read as a tiny switch floating
            in an otherwise empty wide surface. */}
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <IconTile icon={<Eye />} tint="green" size="md" className="mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-section font-bold leading-snug text-foreground">Availability on your website</h3>
              <p className="mt-0.5 max-w-[52ch] text-caption leading-snug text-muted-foreground">
                Property pages show how many beds are free — pulled live from the bed status your staff keep.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto sm:border-l sm:border-border-subtle sm:pl-6">
            <div className="min-w-0">
              <StatusBadge status={s.availOn ? "live" : "off"} className="text-sm font-semibold">
                {s.availOn ? "On" : "Off"}
              </StatusBadge>
              <div className="mt-1 text-caption text-muted-foreground">
                {s.availOn ? "Visible on property pages" : "Hidden from visitors"}
              </div>
            </div>
            <Switch
              checked={s.availOn}
              onCheckedChange={(v) => set({ availOn: v })}
              aria-label="Show availability on my website"
              className="ml-1 shrink-0"
            />
          </div>
        </Card>

        {s.availOn && (
          <>
            <SettingsCard
              icon={<Layers />}
              tint="blue"
              title="What visitors see"
              description="How much detail to reveal. You can dial this up later once you're comfortable."
            >
              {/* primary decision — a 3-up choice grid on desktop instead of
                  three full-width rows, so title/description/example sit
                  close together rather than stretched across a huge gap to
                  a far-right radio dot. Border-only selection, unchanged. */}
              <RadioGroup
                value={s.availLevel}
                onValueChange={(v) => set({ availLevel: v as never })}
                className="grid gap-2.5 sm:grid-cols-3"
              >
                {LEVELS.map((l) => (
                  <ChoiceCard
                    key={l.key}
                    selected={s.availLevel === l.key}
                    control={<RadioGroupItem value={l.key} />}
                    title={l.name}
                    description={
                      <>
                        {l.desc}
                        <span className="mt-1 block italic">Visitor sees: {l.ex}</span>
                      </>
                    }
                  />
                ))}
              </RadioGroup>

              {/* secondary — how that choice is phrased. Set apart in a
                  quiet inset panel so it reads as configuration of the
                  decision above, not a fourth peer option. */}
              <div className="rounded-xl bg-surface-2 p-4 sm:p-5">
                <div className="mb-3 text-micro font-bold uppercase tracking-[0.07em] text-faint">Wording</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">How to phrase the count</div>
                    <Segmented
                      className="mt-2"
                      value={s.availNumbers}
                      onChange={(v) => set({ availNumbers: v as never })}
                      options={[
                        { value: "exact", label: "Show the count" },
                        { value: "vague", label: "Just a label" },
                      ]}
                    />
                    <p className="mt-1.5 text-caption leading-relaxed text-muted-foreground">
                      “Just a label” stops competitors counting your empty beds.
                    </p>
                  </div>
                  <div className="flex items-start justify-between gap-3 sm:border-l sm:border-border-subtle sm:pl-4">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">Show the date a bed next frees up</div>
                      <p className="mt-0.5 text-caption leading-relaxed text-muted-foreground">
                        e.g. “Full — from 20 Sept” instead of just “Full”.
                      </p>
                    </div>
                    <Switch
                      checked={s.availFromDate}
                      onCheckedChange={(v) => set({ availFromDate: v })}
                      aria-label="Show the date a bed next frees up"
                      className="mt-0.5 shrink-0"
                    />
                  </div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              icon={<ShieldCheck />}
              tint="cyan"
              title="What the public site never shows"
              description="Built in, not a setting. Your dashboard shows tenant names on beds — the public site strips all of that out automatically."
            >
              <ul className="grid gap-2 sm:grid-cols-2">
                {NEVER_SHOWN.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-body text-muted-foreground">
                    <Lock className="mt-0.5 size-3.5 shrink-0 text-faint" />
                    {x}
                  </li>
                ))}
              </ul>
            </SettingsCard>

            <SettingsCard
              icon={<Building2 />}
              tint="purple"
              title="Which properties"
              description="Turn availability on per property. Properties that aren't published or are stale can't show it."
            >
              <ListContainer>
                {rows.map((p) => {
                  const stale = staleProp(s, p);
                  const fr = freshness(p.updatedDaysAgo);
                  const off = p.status !== "live";
                  const hidden = off || fr === "stale";
                  const line = off
                    ? p.status === "review"
                      ? "Under review — hidden from your site"
                      : "Unpublished"
                    : fr === "fresh"
                      ? `Updated ${p.updatedDaysAgo === 0 ? "today" : `${p.updatedDaysAgo} days ago`}`
                      : fr === "slightly"
                        ? `Updated ${p.updatedDaysAgo} days ago — still shown`
                        : `Not updated in ${p.updatedDaysAgo} days — hidden until staff refresh it`;
                  return (
                    <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <label htmlFor={`avail-prop-${p.id}`} className={cn("min-w-0", !off && "cursor-pointer")}>
                        <span className="block font-medium text-foreground">{p.name}</span>
                      </label>
                      <div className="flex shrink-0 items-center gap-3">
                        {hidden ? (
                          <StatusBadge status={off ? "off" : "attention"} className="text-caption">
                            {line}
                          </StatusBadge>
                        ) : (
                          <span className="text-caption text-muted-foreground">{line}</span>
                        )}
                        <Switch
                          id={`avail-prop-${p.id}`}
                          defaultChecked={p.status === "live" && !stale}
                          disabled={off}
                        />
                      </div>
                    </div>
                  );
                })}
              </ListContainer>
            </SettingsCard>

            {/* the card spans the full content grid, same as the cards
                above it — only the prose inside keeps a comfortable
                reading width, rather than capping the whole card and
                leaving an empty region beside it. */}
            <Callout tone="info" icon={<Info className="size-4" />} title="Keeping it honest">
              <span className="block max-w-[760px]">
                Visitors see “Availability updated today”. If a property isn't updated for a while, we quietly stop showing
                it as live and warn you on{" "}
                <Link to="/website/health" className="font-semibold text-brand">
                  Website health
                </Link>
                .{" "}
                <span className="text-muted-foreground">
                  (Currently: not shown after {FRESH.slightly} days — a number to confirm with product.)
                </span>
              </span>
            </Callout>
          </>
        )}
      </PageBody>
    </Page>
  );
}
