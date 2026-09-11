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
  ChoiceGroup,
  ChoiceRow,
  Segmented,
  ListContainer,
  Callout,
  AdvancedLock,
} from "@/components/common";
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
      <Page>
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
    <Page>
      <PageHead
        title="Live availability"
        description="Sophisticated underneath, simple to set. Choose what visitors see and where."
      />

      <PageBody>
        <SettingsCard
          icon={<Eye />}
          tint="green"
          title="Availability on your website"
          description="When on, property pages show how many beds are free — pulled live from the bed status your staff keep."
        >
          <ToggleField
            label="Show availability on my website"
            description={
              s.availOn ? "Property pages currently show live availability." : "Property pages show photos and rent only."
            }
            control={<Switch checked={s.availOn} onCheckedChange={(v) => set({ availOn: v })} />}
          />
        </SettingsCard>

        {s.availOn && (
          <>
            <SettingsCard
              icon={<Layers />}
              tint="blue"
              title="What visitors see"
              description="How much detail to reveal. You can dial this up later once you're comfortable."
            >
              <Field label="Level of detail">
                <RadioGroup
                  value={s.availLevel}
                  onValueChange={(v) => set({ availLevel: v as never })}
                  className="gap-2"
                >
                  {LEVELS.map((l) => (
                    <ChoiceRow
                      key={l.key}
                      selected={s.availLevel === l.key}
                      control={<RadioGroupItem value={l.key} className="mt-0.5" />}
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
              </Field>

              <Field label="How to phrase the count" hint="“Just a label” stops competitors counting your empty beds.">
                <Segmented
                  value={s.availNumbers}
                  onChange={(v) => set({ availNumbers: v as never })}
                  options={[
                    { value: "exact", label: "Show the count" },
                    { value: "vague", label: "Just a label" },
                  ]}
                />
              </Field>

              <FieldGroup>
                <ToggleField
                  label="Show the date a bed next frees up"
                  description="e.g. “Full — from 20 Sept” instead of just “Full”."
                  control={
                    <Switch checked={s.availFromDate} onCheckedChange={(v) => set({ availFromDate: v })} />
                  }
                />
              </FieldGroup>
            </SettingsCard>

            <SettingsCard
              icon={<ShieldCheck />}
              tint="cyan"
              title="What the public site never shows"
              description="Built in, not a setting. Your dashboard shows tenant names on beds — the public site strips all of that out automatically."
            >
              <ul className="space-y-2">
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
                    <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <label htmlFor={`avail-prop-${p.id}`} className={cn("min-w-0", !off && "cursor-pointer")}>
                        <span className="block font-medium text-foreground">{p.name}</span>
                        <span
                          className={cn(
                            "block text-caption",
                            fr === "stale" || off ? "text-destructive" : "text-muted-foreground",
                          )}
                        >
                          {line}
                        </span>
                      </label>
                      <Switch
                        id={`avail-prop-${p.id}`}
                        defaultChecked={p.status === "live" && !stale}
                        disabled={off}
                      />
                    </div>
                  );
                })}
              </ListContainer>
            </SettingsCard>

            <Callout tone="info" icon={<Info className="size-4" />} title="Keeping it honest">
              Visitors see “Availability updated today”. If a property isn't updated for a while, we quietly stop showing
              it as live and warn you on{" "}
              <Link to="/website/health" className="font-semibold text-brand">
                Website health
              </Link>
              .{" "}
              <span className="text-muted-foreground">
                (Currently: not shown after {FRESH.slightly} days — a number to confirm with product.)
              </span>
            </Callout>
          </>
        )}
      </PageBody>
    </Page>
  );
}
