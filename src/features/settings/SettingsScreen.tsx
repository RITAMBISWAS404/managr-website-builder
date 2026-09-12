import * as React from "react";
import { Lock, Info, Globe, PanelsTopLeft, Phone, Share2, Palette, Search, ExternalLink } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  Field,
  FieldGroup,
  ToggleField,
  IconTile,
  AdvancedLock,
  SaveBar,
  useSaveState,
} from "@/components/common";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OWNER } from "@/data/managr";
import { useDerived } from "@/store/hooks";

const MENU_LINKS = ["Home", "Properties", "About", "Contact", "FAQ"];

export function SettingsScreen() {
  const { advActive, url } = useDerived();
  const { state, markDirty, save, reset } = useSaveState();

  return (
    <Page size="full">
      <PageHead
        title="Website settings"
        description="Your address, brand, menu and contact details — grouped so you only open what you need."
      />

      {/* onInput bubbles from every native field; Radix controls call markDirty directly */}
      <div onInput={markDirty}>
        <PageBody>
          {/* foundational — business name, language and the fixed web address
              now read as three members of one settings system: same label
              role, same control height/radius/padding (all built on the
              shared Input/Select geometry), same LABEL-then-CONTROL rhythm.
              Two columns from sm (address spanning below), a plain equal
              three-up from xl now that the address column no longer needs
              extra width for an inline action. No divider between them —
              a divider would re-separate the one field this refinement is
              specifically trying to make feel like a peer of the other two. */}
          <SettingsCard
            icon={<Globe />}
            tint="blue"
            title="Address & language"
            description="How your site is named and reached. The web address is fixed once your site goes live."
          >
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Business name shown on the site" htmlFor="biz">
                <Input id="biz" defaultValue={OWNER.biz} />
              </Field>
              <Field label="Language" htmlFor="lang">
                <Select defaultValue="English" onValueChange={markDirty}>
                  <SelectTrigger id="lang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi" disabled>
                      Hindi (coming soon)
                    </SelectItem>
                    <SelectItem value="Marathi" disabled>
                      Marathi (coming soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2 xl:col-span-1">
                <Field label="Your web address" htmlFor="web-address">
                  {/* the same Input primitive as Business name — same height,
                      radius, border — but read-only and bg-sunken, the exact
                      treatment Input already uses for its own disabled state.
                      Consistency of container, not identical interaction: a
                      lock (decorative, aria-hidden — the real signal is
                      `readOnly` itself) plus a small info affordance replace
                      both the old inline "Contact support" button and the
                      floating caption line below the field; the one real
                      product fact (why it's fixed, how to change it) now
                      lives in one place instead of two. */}
                  <div className="relative">
                    <Lock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-faint"
                    />
                    <Input
                      id="web-address"
                      readOnly
                      value={url}
                      className="cursor-default truncate !bg-sunken pl-8 pr-8 font-mono !text-sm"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          aria-label="Why your web address is fixed"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-faint transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                        >
                          <Info className="size-3.5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-64 text-caption leading-relaxed text-muted-foreground">
                        It goes on your boards and into WhatsApp groups, so it's set for good. Need to change it?
                        Contact support.
                      </PopoverContent>
                    </Popover>
                  </div>
                </Field>
              </div>
            </div>
          </SettingsCard>

          {/* the most interactive section on the page — full width so the
              five link options can sit in one row, with menu-behaviour set
              apart as its own sub-group rather than just stacked after. */}
          <SettingsCard
            icon={<PanelsTopLeft />}
            tint="purple"
            title="Menu"
            description="Which links people see at the top of every page, and how the menu behaves."
            footer={
              <span className="flex items-center gap-1.5">
                <Info className="size-3.5 shrink-0" />
                Menu order follows your page order — change it in the editor's Pages panel.
              </span>
            }
          >
            <Field label="Links in the menu">
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {MENU_LINKS.map((l, i) => (
                  <label
                    key={l}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-body transition-colors has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-tint-coral"
                  >
                    <Checkbox defaultChecked={i < 3} onCheckedChange={markDirty} /> {l}
                  </label>
                ))}
              </div>
            </Field>

            <div className="border-t border-border-subtle pt-4">
              <FieldGroup>
                <ToggleField
                  label="Show a Call button in the menu"
                  control={<Switch defaultChecked onCheckedChange={markDirty} />}
                />
                <ToggleField
                  label="Keep the menu visible as people scroll"
                  control={<Switch defaultChecked onCheckedChange={markDirty} />}
                />
              </FieldGroup>
            </div>
          </SettingsCard>

          {/* paired — both are "how people reach or find you" channels, each
              genuinely compact enough to share a row rather than each
              claiming a full-width card of empty space. Equal height (the
              grid's default stretch): Social links is naturally the taller
              of the two, so Contact details grows to match it rather than
              terminating early with a disconnected gap beneath — the extra
              room becomes quiet bottom padding inside the card, not a
              stretched/centered form. Reverts to each card's own natural
              height once the row breaks (mobile, below lg). */}
          <div className="grid gap-5 lg:grid-cols-2">
            <SettingsCard
              icon={<Phone />}
              tint="green"
              title="Contact details"
              description="Shown in your footer and used by the Call and WhatsApp buttons. An area only — never a property's exact address."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone" htmlFor="phone">
                  <Input id="phone" defaultValue={OWNER.phone} />
                </Field>
                <Field label="WhatsApp" htmlFor="wa">
                  <Input id="wa" defaultValue={OWNER.phone} />
                </Field>
                <Field label="Email" htmlFor="email">
                  <Input id="email" placeholder="Leave blank to hide it" />
                </Field>
                <Field label="Office area" htmlFor="office">
                  <Input id="office" placeholder="e.g. Andheri West" />
                </Field>
              </div>
            </SettingsCard>

            <SettingsCard
              icon={<Share2 />}
              tint="cyan"
              title="Social links"
              description="Optional. Any you fill in appear as icons in the footer."
            >
              <div className="space-y-5">
                {["Instagram", "Facebook", "YouTube"].map((l) => (
                  <Field key={l} label={l}>
                    <Input placeholder="Paste the link" />
                  </Field>
                ))}
              </div>
            </SettingsCard>
          </div>

          {/* Brand carries almost no configuration here — it's an action
              that hands off to the editor — so it gets a compact,
              single-row surface instead of a mostly-empty full card. */}
          {advActive ? (
            <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <IconTile icon={<Palette />} tint="coral" size="md" className="mt-0.5" />
                <div className="min-w-0">
                  <h3 className="text-section font-bold leading-snug text-foreground">Brand</h3>
                  <p className="mt-0.5 max-w-[56ch] text-caption leading-snug text-muted-foreground">
                    Logo, colours, fonts and corner style — edited live in the editor so you can watch your site
                    change.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto">
                <a href="/website/editor">
                  Open Design in the editor <ExternalLink />
                </a>
              </Button>
            </Card>
          ) : (
            <SettingsCard
              icon={<Palette />}
              tint="coral"
              title="Brand"
              description="Logo, colours, fonts and corner style — edited live in the editor so you can watch your site change."
            >
              <AdvancedLock
                feature="Your logo, colours & fonts"
                what="Upload a logo, pick a colour and a font pairing from safe presets, and choose how rounded the corners are."
                basic="the site uses the ManagR palette and a generated “S” mark."
              />
            </SettingsCard>
          )}

          <SettingsCard
            icon={<Search />}
            tint="amber"
            title="Google & search"
            description="Whether search engines can find your site, and what they show when they do."
          >
            {advActive ? (
              <>
                <FieldGroup>
                  <ToggleField
                    label="Let people find my website on Google"
                    description="Off keeps the site reachable by link only."
                    control={<Switch defaultChecked onCheckedChange={markDirty} />}
                  />
                </FieldGroup>
                {/* subordinate to the toggle above — a rule sets them apart as
                    "what Google shows", not a third peer setting. Full card
                    width, same as the toggle row and divider above: title
                    and description are the only content here, so the
                    intentional choice is to align everything to the same
                    edge rather than invent a narrow column for them. */}
                <div className="space-y-5 border-t border-border-subtle pt-4">
                  <Field label="Title in search results" htmlFor="seo-title">
                    <Input id="seo-title" defaultValue="Shree Residency — PG in Andheri West, Mumbai" />
                  </Field>
                  <Field label="Description in search results" htmlFor="seo-desc">
                    <Textarea
                      id="seo-desc"
                      defaultValue="Direct-from-owner PG in Andheri. Photos, rent, room types, live availability. No brokerage."
                      className="min-h-[100px]"
                    />
                  </Field>
                </div>
              </>
            ) : (
              <AdvancedLock
                feature="Being found on Google"
                what="A proper page title, description, share picture and a sitemap search engines can read."
                basic="your site is private — reachable by link only, hidden from search."
              />
            )}
          </SettingsCard>

          <SaveBar state={state} onSave={save} onReset={reset} />
        </PageBody>
      </div>
    </Page>
  );
}
