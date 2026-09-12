import { Link } from "react-router-dom";
import { ShieldCheck, Info, Eye, Layers, Building2, Lock } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  Field,
  FieldGroup,
  ToggleField,
  ChoiceCard,
  IconTile,
  Callout,
  AdvancedLock,
} from "@/components/common";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        {/* one binary setting: name + a one-line consequence, one trailing
            toggle — the same shape at every width. No separate On/Off
            label, no divider: the switch's own state (and its native
            aria-checked, announced automatically to assistive tech) already
            communicates on/off, so showing it again as text was solving a
            problem the control already solves. */}
        <Card className="flex items-center gap-4 p-5 sm:p-6">
          <IconTile icon={<Eye />} tint="green" size="md" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 id="avail-master-heading" className="text-section font-bold leading-snug text-foreground">
              Availability on your website
            </h3>
            <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
              Shows how many beds are free on each property page.
            </p>
          </div>
          <Switch
            checked={s.availOn}
            onCheckedChange={(v) => set({ availOn: v })}
            aria-labelledby="avail-master-heading"
            className="shrink-0"
          />
        </Card>

        {s.availOn && (
          <>
            <SettingsCard
              icon={<Layers />}
              tint="blue"
              title="What visitors see"
              description="How much detail to reveal. You can dial this up later once you're comfortable."
            >
              {/* primary decision — each option carries a title, a
                  description and a "Visitor sees" example, so 3 columns
                  only from xl, once there's genuinely enough width per card
                  for that much text; 2 columns from sm keeps every card
                  comfortably readable rather than cramming three dense
                  cards into a narrow row. Border-only selection, unchanged. */}
              <RadioGroup
                value={s.availLevel}
                onValueChange={(v) => set({ availLevel: v as never })}
                className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3"
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

              {/* secondary — two settings that configure the decision above,
                  each a plain setting-name/control row rather than an
                  implementation concept ("Wording") the user has to learn.
                  A border-t marks this as a distinct group from the choice
                  above; the divide-y between the two rows themselves is the
                  only other separator — no eyebrow, no nested panel. */}
              <div className="border-t border-border-subtle pt-4">
                <FieldGroup>
                  <div className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <label htmlFor="avail-phrase" className="block text-body font-medium text-foreground">
                        How to phrase the count
                      </label>
                      <p className="mt-0.5 text-caption leading-relaxed text-muted-foreground">
                        Exact numbers, or just a status like “Available”.
                      </p>
                    </div>
                    <Select value={s.availNumbers} onValueChange={(v) => set({ availNumbers: v as never })}>
                      <SelectTrigger id="avail-phrase" className="w-full shrink-0 sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="exact" description="e.g. “3 beds available”.">
                          Show the count
                        </SelectItem>
                        <SelectItem value="vague" description="Stops competitors counting your empty beds.">
                          Just a label
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ToggleField
                    label="Show the date a bed next frees up"
                    description="e.g. “Full — from 20 Sept” instead of just “Full”."
                    control={
                      <Switch checked={s.availFromDate} onCheckedChange={(v) => set({ availFromDate: v })} />
                    }
                  />
                </FieldGroup>
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
              {/* the parent SettingsCard is the only container — a flat
                  divided list, not a bordered box nested inside it. Status
                  communicates hierarchy through color and subordinate size
                  alone; no decorative dot in front of it. */}
              <div className="divide-y divide-border-subtle">
                {rows.map((p) => {
                  const stale = staleProp(s, p);
                  const fr = freshness(p.updatedDaysAgo);
                  const off = p.status !== "live";
                  const line = off
                    ? p.status === "review"
                      ? "Under review — hidden from your site"
                      : "Unpublished"
                    : fr === "fresh"
                      ? `Updated ${p.updatedDaysAgo === 0 ? "today" : `${p.updatedDaysAgo} days ago`}`
                      : fr === "slightly"
                        ? `Updated ${p.updatedDaysAgo} days ago — still shown`
                        : `Not updated in ${p.updatedDaysAgo} days — hidden until staff refresh it`;
                  // stale or slightly-aging freshness is worth a glance even
                  // though the property isn't administratively hidden —
                  // everything else (fresh, or off entirely) is a plain,
                  // quiet status; the text itself already says "Unpublished"
                  // or "Under review", so no separate color tier for "off".
                  const needsAttention = !off && fr !== "fresh";
                  return (
                    // name + status form one left-anchored column at every
                    // width, so the toggle's horizontal position never
                    // depends on how long the status sentence is — this
                    // single structure already works from 375px to 1440px,
                    // it doesn't need a separate mobile composition.
                    <div key={p.id} className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                      <label htmlFor={`avail-prop-${p.id}`} className={cn("min-w-0 flex-1", !off && "cursor-pointer")}>
                        <span className="block font-medium text-foreground">{p.name}</span>
                        <span
                          className={cn(
                            "mt-0.5 block text-caption",
                            needsAttention ? "font-medium text-warning" : "text-muted-foreground",
                          )}
                        >
                          {line}
                        </span>
                      </label>
                      <Switch
                        id={`avail-prop-${p.id}`}
                        defaultChecked={p.status === "live" && !stale}
                        disabled={off}
                        aria-label={`Show availability for ${p.name}`}
                        className="mt-0.5 shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
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
