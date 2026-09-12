import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp, ArrowDown, GripVertical, Plus, ChevronLeft, Search, Sparkles,
  Image as ImageIconLg,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { SECTIONS, ADD_CATEGORIES } from "@/features/sections/registry";
import { structureLocked, sectionLocked, needsData } from "@/store/selectors";
import { SectionPreview } from "@/features/sections/SectionPreview";
import { Panel, PanelHeader, PanelScroll, PanelFooter, Group, SECTION_TINT } from "./panel";
import type { Tint } from "@/components/common";
import type { SectionType, Block } from "@/types";

/* Tailwind needs the full class name literally in source to generate it —
   never build "text-tint-${x}-fg" at runtime. */
const TINT_FG: Record<Tint, string> = {
  blue: "text-tint-blue-fg",
  green: "text-tint-green-fg",
  amber: "text-tint-amber-fg",
  purple: "text-tint-purple-fg",
  coral: "text-tint-coral-fg",
  cyan: "text-tint-cyan-fg",
};

/** A sub-view's header: back control on the LEFT, then the heading —
 *  conventional drill-down order (Page structure → Add a section), not the
 *  heading-then-back-on-the-right layout that read backwards. */
function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-1 border-b border-panel-border bg-panel-header px-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to sections"
        className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-panel-hover hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="truncate text-sm font-semibold text-foreground">{title}</span>
    </div>
  );
}

export function LeftPanel() {
  const s = useS();
  if (s.leftMode === "pages") return <PagesPanel />;
  if (s.leftMode === "add") return <AddPanel />;
  if (s.leftMode === "assets") return <AssetsPanel />;
  return <LayersPanel />;
}

/* ============================================================================
   Sections (Layers)
   ========================================================================== */
export function LayersPanel() {
  const s = useS();
  const dispatch = useDispatch();
  const { page } = useDerived();
  const locked = structureLocked(s);
  const rows = page.blocks.map((b, i) => ({ b, i }));

  const [dragI, setDragI] = React.useState<number | null>(null);
  const [overI, setOverI] = React.useState<number | null>(null);
  const dragRef = React.useRef<number | null>(null);
  const overRef = React.useRef<number | null>(null);

  const onDrop = () => {
    const from = dragRef.current;
    const to = overRef.current;
    if (from != null && to != null && from !== to) {
      const name = SECTIONS[page.blocks[from].type].name;
      dispatch({ type: "reorderBlock", from, to });
      toast(`Moved ${name}`);
    }
    dragRef.current = null;
    overRef.current = null;
    setDragI(null);
    setOverI(null);
  };

  // Every block — header, footer, everything between — is one uniform list.
  // Header/footer still can't be reordered or removed (NavRow's `canStruct`
  // guards that per-row), but nothing here visually singles them out as a
  // different kind of thing: same heading, same rows, no dividers.
  return (
    <Panel>
      <PanelHeader title="Page structure" meta={`${rows.length} section${rows.length === 1 ? "" : "s"}`} />
      <PanelScroll>
        {locked && (
          <div className="px-3 pt-3">
            <Notice tone="advanced" className="text-caption">
              <b>This layout is set for you.</b> You can edit the wording in every section. Advanced lets you rearrange,
              add, hide and remove them.
            </Notice>
          </div>
        )}

        <div className="space-y-0.5 p-2" onDragOver={(e) => e.preventDefault()}>
          {rows.map((x) => (
            <NavRow
              key={x.b.id}
              block={x.b}
              index={x.i}
              draggable={!locked && !SECTIONS[x.b.type].structural}
              dragging={dragI === x.i}
              dropBefore={overI === x.i && dragI != null && dragI !== x.i}
              onDragStart={() => { dragRef.current = x.i; setDragI(x.i); }}
              onDragEnter={() => { overRef.current = x.i; setOverI(x.i); }}
              onDragEnd={onDrop}
            />
          ))}
        </div>
      </PanelScroll>

      {!locked && (
        <PanelFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={() => dispatch({ type: "leftMode", mode: "add" })}>
            <Plus /> Add a section
          </Button>
        </PanelFooter>
      )}
    </Panel>
  );
}

function NavRow({
  block,
  index,
  draggable = false,
  dragging = false,
  dropBefore = false,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  block: Block;
  index: number;
  draggable?: boolean;
  dragging?: boolean;
  dropBefore?: boolean;
  onDragStart?: () => void;
  onDragEnter?: () => void;
  onDragEnd?: () => void;
}) {
  const s = useS();
  const dispatch = useDispatch();
  const meta = SECTIONS[block.type];
  const selected = s.selection?.block === index;
  const canStruct = !meta.structural && !structureLocked(s);
  const locked = sectionLocked(s, block.type);
  const nd = meta.needs && needsData(s, block.type);
  const tint = SECTION_TINT[meta.category];

  const act = (fn: () => void, msg?: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
    if (msg) toast(msg);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onClick={() => dispatch({ type: "select", block: selected ? null : index })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dispatch({ type: "select", block: selected ? null : index }); }
        if (canStruct && e.altKey && e.key === "ArrowUp") { e.preventDefault(); dispatch({ type: "moveBlock", index, dir: -1 }); }
        if (canStruct && e.altKey && e.key === "ArrowDown") { e.preventDefault(); dispatch({ type: "moveBlock", index, dir: 1 }); }
      }}
      className={cn(
        // Fixed row height, always — selection/hover only ever change colour,
        // never geometry. A border is always reserved (transparent when
        // unselected), so turning it orange never nudges the row's size —
        // one system with the selected layout cards below: selection =
        // a border, never a fill, never a stripe.
        "group relative flex h-9 items-center gap-2.5 rounded-lg border pl-2 pr-1.5 text-body transition-colors",
        // Keyboard focus is its own, separate signal from selection — a
        // ring, shown only while tabbed to, on top of whatever the
        // selected/unselected border already is.
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60",
        selected ? "border-brand font-medium text-foreground" : "border-transparent hover:bg-panel-hover",
        meta.structural && !selected && "text-muted-foreground",
        dragging && "opacity-40",
      )}
    >
      {dropBefore && <span className="absolute inset-x-1.5 -top-px h-0.5 rounded-full bg-brand" />}

      <GripVertical
        className={cn(
          "size-3.5 shrink-0 transition-opacity",
          draggable ? "cursor-grab text-faint opacity-0 group-hover:opacity-100" : "text-transparent",
          selected && draggable && "opacity-100",
        )}
      />
      <meta.icon
        className={cn("size-4 shrink-0", meta.structural ? "text-muted-foreground" : TINT_FG[tint])}
      />
      <span className={cn("min-w-0 flex-1 truncate font-medium", block.hidden && "text-muted-foreground/70 line-through")}>
        {meta.name}
      </span>

      {block.hidden ? (
        <span className="shrink-0 text-caption text-muted-foreground/70">Hidden</span>
      ) : locked ? (
        <Badge variant="advanced"><Sparkles /> Advanced</Badge>
      ) : nd ? (
        <Badge variant="warning">Needs data</Badge>
      ) : null}

      {canStruct ? (
        // Reorder only — hide/duplicate/remove now live in the right
        // inspector once a section is selected, not in a row-level menu.
        <span className={cn("shrink-0 items-center gap-0.5", selected ? "flex" : "hidden group-hover:flex")}>
          <IconBtn onClick={act(() => dispatch({ type: "moveBlock", index, dir: -1 }), "Moved up")} label="Move up"><ArrowUp /></IconBtn>
          <IconBtn onClick={act(() => dispatch({ type: "moveBlock", index, dir: 1 }), "Moved down")} label="Move down"><ArrowDown /></IconBtn>
        </span>
      ) : (
        !meta.structural && block.global && <span className="shrink-0 text-caption text-muted-foreground/70">Every page</span>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}

/* ============================================================================
   Pages
   ========================================================================== */
export function PagesPanel() {
  const s = useS();
  const dispatch = useDispatch();
  const { advActive } = useDerived();
  const standard = s.pages.filter((p) => p.kind === "standard");
  const template = s.pages.find((p) => p.kind === "template:property");

  const pageRow = (id: string, name: string, tags?: React.ReactNode) => (
    <div
      key={id}
      role="button"
      tabIndex={0}
      onClick={() => dispatch({ type: "setPage", id })}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && dispatch({ type: "setPage", id })}
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 py-2 text-body transition-colors",
        s.currentPage === id ? "bg-brand/[0.07] font-medium ring-1 ring-inset ring-brand/15" : "hover:bg-panel-hover",
      )}
    >
      <span className="flex-1 truncate">{name}</span>
      {tags}
    </div>
  );

  return (
    <Panel>
      <PanelHeader title="Pages" />
      <PanelScroll>
        <Group label="Your pages" collapsible={false} bodyClassName="p-2">
          {standard.map((p) =>
            pageRow(p.id, p.name, (
              <>
                {p.home && <Badge variant="neutral">Home</Badge>}
                {p.hidden && <Badge variant="neutral">Hidden</Badge>}
              </>
            )),
          )}
        </Group>

        <Group label="Automatic pages" collapsible={false} bodyClassName="p-2 pb-2.5">
          {template && pageRow(template.id, template.name)}
          <p className="px-1.5 pt-1.5 text-caption leading-snug text-muted-foreground">
            The property page is one design that ManagR fills in for every approved property.
          </p>
        </Group>
      </PanelScroll>

      <PanelFooter>
        {advActive ? (
          <Button variant="outline" size="sm" className="w-full" onClick={() => { dispatch({ type: "addPage", kind: "blank" }); toast("New page added"); }}>
            <Plus /> Add a page
          </Button>
        ) : (
          <Notice tone="advanced" className="text-caption">
            Extra pages — About, Gallery, FAQ, Contact — come with Advanced.{" "}
            <Link to="/website/upgrade" className="font-semibold text-brand hover:underline">See Advanced →</Link>
          </Notice>
        )}
      </PanelFooter>
    </Panel>
  );
}

/* ============================================================================
   Add a section
   ========================================================================== */
export function AddPanel() {
  const s = useS();
  const dispatch = useDispatch();
  const { advActive, page } = useDerived();
  const [q, setQ] = React.useState("");
  const goBack = () => dispatch({ type: "leftMode", mode: "layers" });

  if (structureLocked(s))
    return (
      <Panel>
        <BackHeader title="Add a section" onBack={goBack} />
        <PanelScroll>
          <div className="px-3 py-3">
            <Notice tone="advanced">
              <b className="block text-section">Your layout is set for you</b>
              <p className="mt-1 text-body text-muted-foreground">
                Basic keeps a clean, proven page you can't break. Advanced opens the full library — reviews, gallery,
                offers, an enquiry form, visit booking and more.
              </p>
              <Button asChild size="sm" variant="primary" className="mt-3"><Link to="/website/upgrade">See Advanced</Link></Button>
            </Notice>
          </div>
        </PanelScroll>
      </Panel>
    );

  const present = page.blocks.map((b) => b.type);
  const query = q.trim().toLowerCase();

  return (
    <Panel>
      <BackHeader title="Add a section" onBack={goBack} />
      <PanelScroll>
        <div className="border-b border-panel-border bg-panel-header px-3 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sections"
              className="h-9 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-body outline-none placeholder:text-faint focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
            />
          </div>
        </div>

        {/* a flat, scannable catalogue — no accordions to open, category
            labels are plain static headings so the whole list scrolls as one */}
        <div className="space-y-4 p-2.5">
          {ADD_CATEGORIES.map((cat) => {
            const items = Object.values(SECTIONS).filter(
              (m) => m.category === cat.key && (!query || m.name.toLowerCase().includes(query) || m.blurb.toLowerCase().includes(query)),
            );
            if (!items.length) return null;
            return (
              <div key={cat.key}>
                <div className="mb-1.5 px-1 text-micro font-bold uppercase tracking-[0.06em] text-faint">{cat.label}</div>
                <div className="space-y-1.5">
                  {items.map((m) => {
                    const added = m.solo && present.includes(m.id);
                    const adv = m.advanced && !advActive;
                    const nd = m.needs && needsData(s, m.id);
                    return (
                      <button
                        key={m.id}
                        disabled={added}
                        onClick={() => { dispatch({ type: "addBlock", sectionType: m.id as SectionType }); toast(`${m.name} added`); }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors",
                          added ? "opacity-50" : "hover:bg-panel-hover",
                        )}
                      >
                        <SectionPreview type={m.id} className="w-12 shrink-0 rounded-md" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <b className="text-caption font-semibold text-foreground">{m.name}</b>
                            {adv && <Badge variant="advanced"><Sparkles /> Advanced</Badge>}
                            {nd && !adv && <Badge variant="warning">Needs data</Badge>}
                          </span>
                          <span className="mt-0.5 block truncate text-caption text-muted-foreground">
                            {added ? "Already on this page" : m.blurb}
                          </span>
                        </span>
                        {!added && !adv && <Plus className="size-4 shrink-0 text-faint" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </PanelScroll>
    </Panel>
  );
}

/* ============================================================================
   Photos
   ========================================================================== */
export function AssetsPanel() {
  const dispatch = useDispatch();
  const { advActive, publicProperties } = useDerived();
  return (
    <Panel>
      <BackHeader title="Photos" onBack={() => dispatch({ type: "leftMode", mode: "layers" })} />
      <PanelScroll>
        {/* photos are secondary here — this is a light reference view, not a
            primary editing surface. Real thumbnails aren't modelled yet, so we
            show what we actually know (which property, how many) rather than
            a wall of anonymous placeholder tiles. */}
        <div className="p-2.5">
          <div className="mb-1.5 px-1 text-micro font-bold uppercase tracking-[0.06em] text-faint">From your properties</div>
          {publicProperties.length === 0 ? (
            <p className="px-1 py-1.5 text-caption leading-snug text-muted-foreground">
              No photos yet. Add photos in <b>Properties</b>.
            </p>
          ) : (
            <div className="space-y-1">
              {publicProperties.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sunken text-muted-foreground">
                    <ImageIconLg className="size-4" />
                  </div>
                  <span className="min-w-0 flex-1 truncate text-caption font-medium text-foreground">{p.name}</span>
                  <span className="shrink-0 text-caption text-muted-foreground">
                    {p.photos > 0 ? `${p.photos} photo${p.photos === 1 ? "" : "s"}` : "No photos yet"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-1.5 px-1 text-caption leading-snug text-muted-foreground">
            Used in place, never copied. Add or change these in <b>Properties → Photos</b>.
          </p>
        </div>

        <div className="border-t border-panel-border p-2.5">
          <div className="mb-1.5 px-1 text-micro font-bold uppercase tracking-[0.06em] text-faint">Uploads</div>
          {advActive ? (
            <div className="px-1">
              <Button variant="outline" size="sm" className="w-full"><Plus /> Upload an image</Button>
              <p className="mt-1.5 text-caption leading-snug text-muted-foreground">JPG or PNG, up to 5 MB. We warn you before using a small or oddly-shaped image.</p>
            </div>
          ) : (
            <Notice tone="advanced" className="mx-1 text-caption">Your own logo and image uploads come with Advanced.</Notice>
          )}
        </div>
      </PanelScroll>
    </Panel>
  );
}
