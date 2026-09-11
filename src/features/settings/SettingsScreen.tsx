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
  Callout,
  AdvancedLock,
  SaveBar,
  useSaveState,
} from "@/components/common";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OWNER } from "@/data/managr";
import { useDerived } from "@/store/hooks";

const MENU_LINKS = ["Home", "Properties", "About", "Contact", "FAQ"];

export function SettingsScreen() {
  const { advActive, url } = useDerived();
  const { state, markDirty, save, reset } = useSaveState();

  return (
    <Page>
      <PageHead
        title="Website settings"
        description="Your address, brand, menu and contact details — grouped so you only open what you need."
      />

      {/* onInput bubbles from every native field; Radix controls call markDirty directly */}
      <div onInput={markDirty}>
        <PageBody>
          <SettingsCard
            icon={<Globe />}
            tint="blue"
            title="Address & language"
            description="How your site is named and reached. The web address is fixed once your site goes live."
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <Field label="Your web address" hint="Set for good — it goes on your boards and into WhatsApp groups.">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3.5 py-2.5">
                <span className="flex items-center gap-1.5 font-mono text-sm text-foreground">
                  <Lock className="size-3.5 text-faint" /> {url}
                </span>
                <button className="text-caption font-semibold text-brand hover:underline">Need to change it?</button>
              </div>
            </Field>
          </SettingsCard>

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
              <div className="grid gap-2 sm:grid-cols-2">
                {MENU_LINKS.map((l, i) => (
                  <label
                    key={l}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-body transition-colors has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand/[0.04]"
                  >
                    <Checkbox defaultChecked={i < 3} onCheckedChange={markDirty} /> {l}
                  </label>
                ))}
              </div>
            </Field>

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
          </SettingsCard>

          <SettingsCard
            icon={<Phone />}
            tint="green"
            title="Contact details"
            description="Shown in your footer and used by the Call and WhatsApp buttons. An area only — never a property's exact address."
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="grid gap-4 sm:grid-cols-2">
              {["Instagram", "Facebook", "YouTube"].map((l) => (
                <Field key={l} label={l}>
                  <Input placeholder="Paste the link" />
                </Field>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            icon={<Palette />}
            tint="coral"
            title="Brand"
            description="Logo, colours, fonts and corner style — edited live in the editor so you can watch your site change."
          >
            {advActive ? (
              <Button asChild variant="outline">
                <a href="/website/editor">
                  Open Design in the editor <ExternalLink />
                </a>
              </Button>
            ) : (
              <AdvancedLock
                feature="Your logo, colours & fonts"
                what="Upload a logo, pick a colour and a font pairing from safe presets, and choose how rounded the corners are."
                basic="the site uses the ManagR palette and a generated “S” mark."
              />
            )}
          </SettingsCard>

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
                <Field label="Title in search results" htmlFor="seo-title" className="max-w-[560px]">
                  <Input id="seo-title" defaultValue="Shree Residency — PG in Andheri West, Mumbai" />
                </Field>
                <Field label="Description in search results" htmlFor="seo-desc" className="max-w-[560px]">
                  <Textarea
                    id="seo-desc"
                    defaultValue="Direct-from-owner PG in Andheri. Photos, rent, room types, live availability. No brokerage."
                  />
                </Field>
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
