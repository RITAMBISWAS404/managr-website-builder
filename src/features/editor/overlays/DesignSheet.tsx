import * as React from "react";
import { Check, Palette, Type, LayoutGrid, Sparkles, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notice, AdvancedLock, ChoiceRow } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { THEMES, TEMPLATES, PALETTES, FONT_PAIRS } from "@/data/managr";
import { siteAccent } from "@/store/selectors";
import { SECTIONS } from "@/features/sections/registry";
import { useEditorUI } from "../EditorContext";

// Simplified to a small, curated set: Theme is the primary, first choice;
// Template (arrangement), Colour and Typography are the only other options
// exposed in V1. Raw shape/spacing/density controls are deliberately not
// surfaced here — they're low-level styling knobs, not a V1 decision.
const TABS = [
  { key: "theme", label: "Theme", icon: Sparkles },
  { key: "template", label: "Template", icon: LayoutGrid },
  { key: "colours", label: "Colour", icon: Palette },
  { key: "fonts", label: "Typography", icon: Type },
];

export function DesignSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { advActive } = useDerived();
  const [tab, setTab] = React.useState("theme");
  const open = ui.overlay === "design";
  const accent = siteAccent(s);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && ui.close()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Design</DialogTitle>
          <DialogDescription>Theme sets the look · template sets the arrangement</DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-col">
          <TabsList className="shrink-0 gap-1 px-5">
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="gap-1.5 px-1.5">
                <t.icon className="size-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="max-h-[62vh] overflow-y-auto px-5 py-4 scrollbar-thin">
            {/* THEME — the primary choice: overall feel, logo, business identity */}
            <TabsContent value="theme" className="space-y-4">
              {!advActive ? (
                <AdvancedLock feature="Your theme" what="Choose the overall feel of your site and add your logo. Business name and contact details always come from your settings." basic="the site uses the default ManagR theme." />
              ) : (
                <>
                  <div>
                    <div className="mb-1.5 text-caption font-semibold text-foreground">Theme feel</div>
                    <div className="space-y-2">
                      {THEMES.map((t) => (
                        <ChoiceRow
                          key={t.key}
                          as="button"
                          selected={s.theme === t.key}
                          onClick={() => { dispatch({ type: "setTheme", theme: t.key }); toast(`Theme: ${t.name}`); }}
                          title={t.name}
                          description={t.blurb}
                          control={s.theme === t.key ? <Badge variant="success">Current</Badge> : null}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 text-caption font-semibold text-foreground">Logo</div>
                    <div className="flex items-center gap-3">
                      <div className="ph size-11 min-h-0">S</div>
                      <Button size="sm" variant="outline">Upload logo</Button>
                    </div>
                    <p className="mt-1 text-caption text-muted-foreground">No logo → a generated “S” mark. Never a broken image.</p>
                  </div>
                  <Notice tone="info" className="text-caption" icon={<Info className="size-4" />}>
                    Business name, phone and address come from <b>Website settings</b> — change them once, everywhere.
                  </Notice>
                </>
              )}
            </TabsContent>

            {/* TEMPLATE */}
            <TabsContent value="template" className="space-y-2.5">
              <p className="text-caption text-muted-foreground">
                A template arranges your sections. Your wording is kept for every section that stays.
              </p>
              {TEMPLATES.map((t) => (
                <div key={t.key} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-2 p-3">
                  <div className="min-w-0">
                    <b className="text-body">{t.name}</b>
                    <div className="text-caption text-muted-foreground">{t.blurb}</div>
                    <div className="mt-1 truncate text-caption text-faint">
                      {t.blocks.filter((b) => !SECTIONS[b].structural).map((b) => SECTIONS[b].name).join(" → ")}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { dispatch({ type: "applyTemplate", key: t.key }); toast.success(`${t.name} template applied`); ui.close(); }}>
                    Apply
                  </Button>
                </div>
              ))}
              <Notice tone="info" className="text-caption" icon={<Info className="size-4" />}>
                You can rearrange sections afterwards. Template and look are independent.
              </Notice>
            </TabsContent>

            {/* COLOURS */}
            <TabsContent value="colours" className="space-y-4">
              {!advActive ? (
                <AdvancedLock feature="Your colours" what="Pick a brand colour from a safe palette. Buttons, links and headings update together." basic="the site uses the ManagR coral." />
              ) : (
                <>
                  <div>
                    <div className="mb-2 text-caption font-semibold text-foreground">Brand colour</div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {PALETTES.map((p) => {
                        const on = accent.toLowerCase() === p.accent.toLowerCase();
                        return (
                          <button
                            key={p.key}
                            onClick={() => { dispatch({ type: "setDesign", patch: { brandColor: p.accent } }); toast(`Colour: ${p.name}`); }}
                            className={cn("flex flex-col items-center gap-1 rounded-lg border p-1.5 transition-colors", on ? "border-brand bg-brand/[0.06]" : "border-border-subtle hover:bg-panel-hover")}
                            aria-pressed={on}
                          >
                            <span className="relative grid size-8 place-items-center rounded-full" style={{ background: p.accent }}>
                              {on && <Check className="size-4 text-white" />}
                            </span>
                            <span className="text-[10px] font-medium">{p.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-caption text-muted-foreground">
                      Every palette keeps text readable and CTAs visible. No colour wheel — bad combinations aren't possible.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { dispatch({ type: "setDesign", patch: { brandColor: null } }); toast("Colour reset to theme default"); }}>
                    Reset to theme colour
                  </Button>
                </>
              )}
            </TabsContent>

            {/* FONTS */}
            <TabsContent value="fonts" className="space-y-2">
              {!advActive ? (
                <AdvancedLock feature="Fonts" what="Choose from a few safe pairings. We handle sizes and spacing." basic="the site uses one clean typeface." />
              ) : (
                FONT_PAIRS.map((f) => (
                  <ChoiceRow
                    key={f.key}
                    as="button"
                    selected={s.fontPair === f.key}
                    onClick={() => { dispatch({ type: "setDesign", patch: { fontPair: f.key } }); toast(`Font: ${f.name}`); }}
                    title={<span style={{ fontWeight: f.key === "premium" ? 700 : 600 }}>{f.name}</span>}
                    description={f.note}
                    control={s.fontPair === f.key ? <Check className="size-4 text-brand" /> : null}
                  />
                ))
              )}
            </TabsContent>

          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
