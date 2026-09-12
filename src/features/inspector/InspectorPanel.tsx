import * as React from "react";
import { EyeOff, Eye, Trash2, Copy, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { DataSource, DataCard, AdvancedLock, Notice, IconTile } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { SECTIONS } from "@/features/sections/registry";
import { InspectorField } from "./primitives";
import {
  Panel, PanelHeader, PanelScroll, Group, ChoiceGrid, ChoiceCard, LayoutMini, ScopeChip,
  SECTION_TINT,
} from "@/features/editor/panel";
import type { Property } from "@/types";
import { sectionLocked, needsData } from "@/store/selectors";

/* Only a few `where` locations actually resolve to a real screen in this
   app — ManagR itself (Properties, Tenants) isn't part of this codebase.
   Never point an action at a destination that doesn't exist. */
const MANAGR_ACTION: Record<string, { href: string; label: string }> = {
  "Website settings → Contact": { href: "/website/settings", label: "Edit in ManagR →" },
  "Live availability": { href: "/website/availability", label: "Set up live availability →" },
};

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
  const hasContent = meta.content.primary.length > 0 || !!meta.content.groups?.length;
  const variants = meta.layoutVariants.length > 1 ? meta.layoutVariants : [];
  const curLayout = meta.layoutVariants.includes(block.layout) ? block.layout : meta.layoutVariants[0];

  const tint = SECTION_TINT[meta.category];

  return (
    <Panel>
      <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-panel-border bg-panel-header px-3.5">
        {meta.structural ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sunken text-faint">
            <meta.icon className="size-[18px]" />
          </span>
        ) : (
          <IconTile icon={<meta.icon />} tint={tint} size="md" />
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-body font-bold text-foreground">{meta.name}</div>
          <div className="mt-[3px] truncate text-caption text-faint">{meta.category}</div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {/* Every action here is explicit and does something real — no
              overflow menu hiding Duplicate/Remove behind a "...". */}
          <Hint label={block.hidden ? "Show on website" : "Hide from website"}>
            <Button
              variant="ghost" size="icon-sm"
              aria-label={block.hidden ? "Show on website" : "Hide from website"}
              className={block.hidden ? "text-warning" : ""}
              onClick={() => { dispatch({ type: "hideBlock", index: sel }); toast(block.hidden ? "Section shown" : "Section hidden — still in your list"); }}
            >
              {block.hidden ? <EyeOff /> : <Eye />}
            </Button>
          </Hint>
          {meta.dup && (
            <Hint label="Duplicate section">
              <Button
                variant="ghost" size="icon-sm" aria-label="Duplicate section"
                onClick={() => { dispatch({ type: "dupBlock", index: sel }); toast(`${meta.name} duplicated`); }}
              >
                <Copy />
              </Button>
            </Hint>
          )}
          {!meta.structural && (
            <Hint label="Remove section">
              <Button
                variant="ghost" size="icon-sm" aria-label="Remove section"
                className="text-destructive hover:bg-destructive-surface"
                onClick={() => { dispatch({ type: "removeBlock", index: sel }); toast(`${meta.name} removed`); }}
              >
                <Trash2 />
              </Button>
            </Hint>
          )}
          <span className="mx-0.5 h-5 w-px bg-border-subtle" />
          <Hint label={mobile ? "Close" : "Deselect this section"}>
            <Button variant="ghost" size="icon-sm" aria-label={mobile ? "Close" : "Deselect"} onClick={close}><X /></Button>
          </Hint>
        </div>
      </div>

      {/* Only worth saying when it's non-obvious: a header/footer edit applies
          everywhere. Which page a regular section is on is not useful
          information in the common single-page site — omitted. */}
      {block.global && (
        <ScopeChip icon={<Globe />}>
          <span className="font-medium text-foreground">Global</span> — on every page, changes apply everywhere
        </ScopeChip>
      )}

      <PanelScroll>
        {hasContent && (
          <Group label="Content" collapsible={false}>
            {meta.content.primary.map((f, i) => (
              <InspectorField key={i} field={f} data={block.data} onChange={onChange} options={options} />
            ))}
          </Group>
        )}

        {/* Named subsections (Button, Image, Navigation, Display…) — always
            visible, same heading treatment as Content/Layout/Data. Nothing
            here is hidden behind a disclosure: this is a builder for
            non-designers, not a power-user tool with progressive reveal. */}
        {meta.content.groups?.map((g) => (
          <Group key={g.label} label={g.label} collapsible={false}>
            {g.fields.map((f, i) => (
              <InspectorField key={i} field={f} data={block.data} onChange={onChange} options={options} />
            ))}
          </Group>
        ))}

        {variants.length > 0 && (
          <Group label="Layout" collapsible={false}>
            <ChoiceGrid columns={2}>
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
          </Group>
        )}

        {/* No empty "Data" shell for sections that don't actually have any
            ManagR-backed values — an empty card here would just be noise. */}
        {!!meta.dataRows?.length && (
          <Group label="Data" collapsible={false}>
            <DataBody type={block.type} />
          </Group>
        )}
      </PanelScroll>
    </Panel>
  );
}

/** This section is only ever rendered when `meta.dataRows.length > 0` (see
 *  the caller) — no "this section has no ManagR data" filler card. */
function DataBody({ type }: { type: string }) {
  const s = useS();
  const meta = SECTIONS[type as keyof typeof SECTIONS];
  const rows = meta.dataRows!;

  return (
    <>
      <DataSource />
      <div className="mt-3 space-y-3">
        {rows.map((r) => {
          const action = MANAGR_ACTION[r.where];
          // Live availability is the one row whose *note* is runtime, not
          // static copy — configured vs. not, so the card actually
          // distinguishes "connected" from "needs setup" instead of always
          // reading the same placeholder sentence.
          const note = r.where === "Live availability"
            ? (s.availOn ? `Showing ${s.availLevel}.` : "Not set up yet.")
            : r.note;
          return (
            <DataCard
              key={r.title}
              title={r.title}
              items={r.items}
              note={note}
              where={r.where === "—" ? undefined : r.where}
              action={action}
            />
          );
        })}
      </div>
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
