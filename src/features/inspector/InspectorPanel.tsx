import * as React from "react";
import { EyeOff, Eye, Trash2, X, MoreHorizontal, Copy, Globe, MapPin, ChevronDown, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { BoundField, AdvancedLock, Notice, IconTile } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { SECTIONS, type Field } from "@/features/sections/registry";
import { InspectorField } from "./primitives";
import {
  Panel, PanelHeader, PanelScroll, Group, Row, Seg, SegToggles, ChoiceGrid, ChoiceCard, LayoutMini, ScopeChip,
  SECTION_TINT,
} from "@/features/editor/panel";
import type { Device, Property } from "@/types";
import { sectionLocked, needsData } from "@/store/selectors";

/* which groups are open — remembered for the session (not persisted) */
const openState = { content: true, layout: true, visibility: true, data: false };

type OptionFn = (key: string) => string[] | undefined;
const makeOptions = (type: string, pubs: Property[]): OptionFn => (key) => {
  if (type === "featured" && key === "prop") return pubs.map((p) => p.name);
  if (type === "areas" && key === "items") return [...new Set(pubs.map((p) => p.area))];
  if (type === "visit" && key === "items") return pubs.map((p) => p.name);
  if (type === "properties" && key === "prop") return pubs.map((p) => p.name);
  return undefined;
};

export function InspectorPanel({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const s = useS();
  const dispatch = useDispatch();
  const { page, publicProperties } = useDerived();
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [moreLayout, setMoreLayout] = React.useState(false);
  const setOpen = (k: keyof typeof openState) => (o: boolean) => { openState[k] = o; force(); };
  const sel = s.selection?.block ?? null;
  const close = () => (onClose ? onClose() : dispatch({ type: "select", block: null }));

  if (sel == null) return <PageOverview />;
  const block = page.blocks[sel];
  if (!block) return <PageOverview />;
  const meta = SECTIONS[block.type];

  if (sectionLocked(s, block.type)) {
    const M: Record<string, [string, string]> = {
      enquiry: ["Enquiry form", "Turns a website visitor into a lead in your CRM — name, phone, budget, move-in — tagged “Website”."],
      visit: ["Visit booking", "Visitors book a viewing themselves in the slots you allow. Every booking lands in Scheduled Visits."],
      bookcta: ["Booking request", "Visitors request a bed from a move-in date; you approve or decline."],
    };
    const [name, what] = M[block.type] ?? [meta.name, "Part of Advanced."];
    return (
      <Wrap title={meta.name} onClose={close}>
        <AdvancedLock feature={name} what={what} onNotNow={() => dispatch({ type: "removeBlock", index: sel })} />
      </Wrap>
    );
  }

  if (meta.needs && needsData(s, block.type)) {
    return (
      <Wrap title={meta.name} onClose={close}>
        <Notice tone="warn" title="Nothing to show here yet">
          <p className="text-caption text-muted-foreground">
            {block.type === "reviews"
              ? "This appears on its own once you have resident reviews in ManagR."
              : "None of your public properties have photos yet."}
          </p>
          <Button size="sm" variant="outline" className="mt-2.5" onClick={() => dispatch({ type: "hideBlock", index: sel })}>
            Hide this section for now
          </Button>
        </Notice>
      </Wrap>
    );
  }

  const options = makeOptions(block.type, publicProperties);
  const onChange = (key: string, value: unknown) => dispatch({ type: "updateBlockData", index: sel, key, value });
  const hasContent = meta.content.primary.length > 0 || !!meta.content.more;
  const variants = meta.layoutVariants.length > 1 ? meta.layoutVariants : [];
  const curLayout = meta.layoutVariants.includes(block.layout) ? block.layout : meta.layoutVariants[0];

  const tint = SECTION_TINT[meta.category];

  return (
    <Panel>
      <div className="flex shrink-0 items-start gap-3 border-b border-panel-border bg-panel-header px-3.5 py-3">
        {meta.structural ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sunken text-faint">
            <meta.icon className="size-[18px]" />
          </span>
        ) : (
          <IconTile icon={<meta.icon />} tint={tint} size="md" />
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="truncate text-body font-bold text-foreground">{meta.name}</div>
          <div className="mt-0.5 truncate text-caption text-faint">{meta.category}</div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
          <Button
            variant="ghost" size="icon-sm"
            aria-label={block.hidden ? "Show on website" : "Hide from website"}
            className={block.hidden ? "text-warning" : ""}
            onClick={() => { dispatch({ type: "hideBlock", index: sel }); toast(block.hidden ? "Section shown" : "Section hidden — still in your list"); }}
          >
            {block.hidden ? <EyeOff /> : <Eye />}
          </Button>
          {(!meta.structural || meta.dup) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="More actions"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {meta.dup && (
                  <DropdownMenuItem onClick={() => { dispatch({ type: "dupBlock", index: sel }); toast(`${meta.name} duplicated`); }}>
                    <Copy /> Duplicate
                  </DropdownMenuItem>
                )}
                {!meta.structural && (
                  <>
                    {meta.dup && <DropdownMenuSeparator />}
                    <DropdownMenuItem destructive onClick={() => { dispatch({ type: "removeBlock", index: sel }); toast(`${meta.name} removed`); }}>
                      <Trash2 /> Remove section
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="icon-sm" aria-label={mobile ? "Close" : "Deselect"} onClick={close}><X /></Button>
        </div>
      </div>

      {block.global ? (
        <ScopeChip icon={<Globe />}>
          <span className="font-medium text-foreground">Global</span> — on every page, changes apply everywhere
        </ScopeChip>
      ) : (
        <ScopeChip icon={<MapPin />}>
          On the <span className="font-medium text-foreground">{page.name}</span> page
        </ScopeChip>
      )}

      <PanelScroll>
        {hasContent && (
          <Group label="Content" open={openState.content} onOpenChange={setOpen("content")}>
            {meta.content.primary.map((f, i) => (
              <InspectorField key={i} field={f} data={block.data} onChange={onChange} options={options} />
            ))}
            {meta.content.more && (
              <MoreDisclosure label={meta.content.more.label} fields={meta.content.more.fields} data={block.data} onChange={onChange} options={options} />
            )}
          </Group>
        )}

        <Group label="Layout" open={openState.layout} onOpenChange={setOpen("layout")}>
          {variants.length > 0 && (
            <ChoiceGrid columns={variants.length >= 3 ? 3 : (variants.length as 1 | 2)}>
              {variants.map((v, i) => (
                <ChoiceCard
                  key={v}
                  selected={curLayout === v}
                  onClick={() => { dispatch({ type: "blockLayout", index: sel, layout: v }); toast(`Layout: ${v}`); }}
                  preview={<LayoutMini variant={v} />}
                  label={
                    <span className="flex flex-col gap-0">
                      <span>Layout {i + 1}</span>
                      <span className="truncate text-[10px] font-normal text-faint">{v}</span>
                    </span>
                  }
                />
              ))}
            </ChoiceGrid>
          )}
          {/* spacing is a refinement, not a first-run decision — kept out of
              the default view so Layout reads as "pick one of these" */}
          <Disclosure label="Spacing" open={moreLayout} onToggle={() => setMoreLayout((o) => !o)}>
            <Seg
              value={block.dense}
              onChange={(d) => dispatch({ type: "blockDense", index: sel, dense: d as never })}
              options={[
                { value: "comfortable", label: "Cosy" },
                { value: "compact", label: "Compact" },
                { value: "roomy", label: "Roomy" },
              ]}
            />
            <p className="flex items-start gap-1.5 text-caption text-faint">
              <Link2 className="mt-0.5 size-3.5 shrink-0" />
              Colours, fonts and corners come from <b className="font-medium text-muted-foreground">Design</b>.
            </p>
          </Disclosure>
        </Group>

        <Group label="Visibility" open={openState.visibility} onOpenChange={setOpen("visibility")}>
          <Row label="Show on">
            <SegToggles
              items={(["desktop", "tablet", "mobile"] as Device[]).map((bp) => ({
                value: bp,
                label: bp === "desktop" ? "Desktop" : bp === "tablet" ? "Tablet" : "Phone",
                on: block.visibility[bp] !== false,
                onToggle: () => dispatch({ type: "blockVisibility", index: sel, device: bp, visible: block.visibility[bp] === false }),
              }))}
            />
          </Row>
          <p className="text-caption text-muted-foreground">
            Turn a screen off to hide this section there. Wording and layout stay the same on every screen.
          </p>
        </Group>

        <Group label="Data" open={openState.data} onOpenChange={setOpen("data")}>
          <DataBody type={block.type} />
        </Group>
      </PanelScroll>
    </Panel>
  );
}

function MoreDisclosure({
  label, fields, data, onChange, options,
}: {
  label: string;
  fields: Field[];
  data: Record<string, unknown>;
  onChange: (k: string, v: unknown) => void;
  options: OptionFn;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Disclosure label={label} open={open} onToggle={() => setOpen((o) => !o)}>
      {fields.map((f, i) => (
        <InspectorField key={i} field={f} data={data} onChange={onChange} options={options} />
      ))}
    </Disclosure>
  );
}

/** a quiet "more" toggle — a text control, not another boxed card */
function Disclosure({
  label, open, onToggle, children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="-mx-1 flex w-[calc(100%+0.5rem)] items-center gap-1.5 rounded-md px-1 py-1 text-caption font-semibold text-muted-foreground transition-colors hover:bg-panel-hover hover:text-foreground"
      >
        <ChevronDown className={cn("size-3.5 shrink-0 text-faint transition-transform", open && "rotate-180")} />
        {label}
      </button>
      {open && <div className="mt-3 space-y-3.5">{children}</div>}
    </div>
  );
}

function DataBody({ type }: { type: string }) {
  const s = useS();
  const dispatch = useDispatch();
  const meta = SECTIONS[type as keyof typeof SECTIONS];
  if (!meta.dataRows?.length)
    return (
      <p className="text-caption text-muted-foreground">
        This section has no ManagR data — everything in it is content you set here.
      </p>
    );
  return (
    <>
      <p className="text-caption text-muted-foreground">
        These come straight from ManagR and update on your live site on their own — never part of publishing.
      </p>
      {meta.dataRows.map((r) => <BoundField key={r.label} label={r.label} value={r.value} where={r.where} />)}
      {type === "properties" && (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href="/website/availability" onClick={() => dispatch({ type: "select", block: null })}>Set up live availability →</a>
        </Button>
      )}
      {s.availOn && type === "properties" && (
        <p className="text-caption text-muted-foreground">Availability shown: {s.availLevel}</p>
      )}
    </>
  );
}

function Wrap({ title, onClose, children }: { title: string; onClose?: () => void; children: React.ReactNode }) {
  const dispatch = useDispatch();
  return (
    <Panel>
      <PanelHeader
        title={title}
        actions={<Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => (onClose ? onClose() : dispatch({ type: "select", block: null }))}><X /></Button>}
      />
      <div className="p-3">{children}</div>
    </Panel>
  );
}

/* ---------- page overview (nothing selected) ---------- */
function PageOverview() {
  const s = useS();
  const dispatch = useDispatch();
  const { page, check } = useDerived();
  const shown = page.blocks.filter((b) => !b.hidden).length;
  const pageChecks = [...check.blockers, ...check.warnings].filter((c) =>
    ["hero", "properties", "header", "footer", "contact", "home"].includes(c.where),
  );

  return (
    <Panel>
      <PanelHeader title={page.name} meta={`${shown} showing`} />
      <PanelScroll>
        <div className="px-3 py-3">
          <p className="text-caption text-muted-foreground">
            Pick a section on the canvas — or in the <b className="font-medium text-foreground">Sections</b> list — to edit it.
          </p>
        </div>
        <Group label="On this page" collapsible={false}>
          <div className="overflow-hidden rounded-lg border border-border-subtle">
            {page.blocks
              .filter((b) => !SECTIONS[b.type].structural)
              .map((b) => {
                const i = page.blocks.indexOf(b);
                return (
                  <label key={b.id} className="flex items-center justify-between border-b border-border-subtle bg-surface px-3 py-2 text-caption last:border-0">
                    <span className={cn(b.hidden && "text-muted-foreground line-through")}>{SECTIONS[b.type].name}</span>
                    <Switch checked={!b.hidden} onCheckedChange={() => dispatch({ type: "hideBlock", index: i })} />
                  </label>
                );
              })}
          </div>
        </Group>
        <Group label="Worth a look" collapsible={false}>
          {pageChecks.length ? (
            <div className="space-y-1.5">
              {pageChecks.map((c) => (
                <div key={c.msg} className="flex items-start gap-2 text-caption text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" /> {c.msg}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-success">Nothing outstanding on this page.</p>
          )}
        </Group>
      </PanelScroll>
    </Panel>
  );
}
