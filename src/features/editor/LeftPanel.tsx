import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp, ArrowDown, Eye, EyeOff, Copy, Trash2, GripVertical, Plus, MoreHorizontal, ChevronLeft, Search, Sparkles,
  Image as ImageIconLg, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hint } from "@/components/ui/tooltip";
import { Notice } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  const body = rows.filter((x) => !SECTIONS[x.b.type].structural);
  const header = rows.find((x) => x.b.type === "header");
  const footer = rows.find((x) => x.b.type === "footer");

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

  // One continuous structure — header pinned at the top, footer pinned at the
  // bottom, everything else reorderable in between. This page is the whole
  // site today; header/footer are shared across every page it ever grows to.
  return (
    <Panel>
      <PanelHeader title="Sections" meta={`${page.blocks.filter((b) => !b.hidden).length} showing`} />
      <PanelScroll>
        {locked && (
          <div className="px-3 pt-3">
            <Notice tone="advanced" className="text-caption">
              <b>This layout is set for you.</b> You can edit the wording in every section. Advanced lets you rearrange,
              add, hide and remove them.
            </Notice>
          </div>
        )}

        <Group label="Page structure" collapsible={false} bodyClassName="p-2">
          {header && <NavRow key={header.b.id} block={header.b} index={header.i} pinned="top" />}

          <div className="my-1 flex items-center gap-2 px-1.5">
            <span className="text-micro font-semibold uppercase tracking-[0.05em] text-faint">Sections</span>
            <span className="h-px flex-1 bg-panel-border" />
          </div>
          <div onDragOver={(e) => e.preventDefault()}>
            {body.map((x) => (
              <NavRow
                key={x.b.id}
                block={x.b}
                index={x.i}
                draggable={!locked}
                dragging={dragI === x.i}
                dropBefore={overI === x.i && dragI != null && dragI !== x.i}
                onDragStart={() => { dragRef.current = x.i; setDragI(x.i); }}
                onDragEnter={() => { overRef.current = x.i; setOverI(x.i); }}
                onDragEnd={onDrop}
              />
            ))}
          </div>

          {footer && (
            <>
              <div className="my-1 h-px bg-panel-border" />
              <NavRow key={footer.b.id} block={footer.b} index={footer.i} pinned="bottom" />
            </>
          )}
        </Group>

        <p className="px-3.5 pb-3 text-caption leading-snug text-muted-foreground">
          Header and footer are fixed in place and shared everywhere this site is shown — editing one changes it
          everywhere.
        </p>
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
  pinned,
}: {
  block: Block;
  index: number;
  draggable?: boolean;
  dragging?: boolean;
  dropBefore?: boolean;
  onDragStart?: () => void;
  onDragEnter?: () => void;
  onDragEnd?: () => void;
  /** header/footer: fixed in place, shown with a lock instead of a drag handle */
  pinned?: "top" | "bottom";
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
        "group relative flex items-center gap-2.5 rounded-lg py-2 pl-2 pr-1 text-body outline-none transition-colors",
        selected ? "bg-brand/[0.09] font-medium text-foreground" : "hover:bg-panel-hover",
        meta.structural && !selected && "text-muted-foreground",
        dragging && "opacity-40",
      )}
    >
      {dropBefore && <span className="absolute inset-x-1.5 -top-px h-0.5 rounded-full bg-brand" />}

      {pinned ? (
        <Hint label={pinned === "top" ? "Fixed at the top of every page" : "Fixed at the bottom of every page"}>
          <Lock className="size-3.5 shrink-0 text-faint" />
        </Hint>
      ) : (
        <GripVertical
          className={cn(
            "size-3.5 shrink-0 transition-opacity",
            draggable ? "cursor-grab text-faint opacity-0 group-hover:opacity-100" : "text-transparent",
            selected && draggable && "opacity-100",
          )}
        />
      )}
      <meta.icon
        className={cn("size-4 shrink-0", meta.structural ? "text-muted-foreground" : TINT_FG[tint])}
      />
      <span className={cn("flex-1 truncate font-medium", block.hidden && "text-muted-foreground/70 line-through")}>
        {meta.name}
      </span>

      {pinned && <span className="shrink-0 text-caption text-muted-foreground/70">Fixed</span>}

      {!pinned && (block.hidden ? (
        <span className="shrink-0 text-caption text-muted-foreground/70">Hidden</span>
      ) : locked ? (
        <Badge variant="advanced"><Sparkles /> Advanced</Badge>
      ) : nd ? (
        <Badge variant="warning">Needs data</Badge>
      ) : null)}

      {canStruct ? (
        <span className={cn("shrink-0 items-center gap-0.5", selected ? "flex" : "hidden group-hover:flex")}>
          <IconBtn onClick={act(() => dispatch({ type: "moveBlock", index, dir: -1 }), "Moved up")} label="Move up"><ArrowUp /></IconBtn>
          <IconBtn onClick={act(() => dispatch({ type: "moveBlock", index, dir: 1 }), "Moved down")} label="Move down"><ArrowDown /></IconBtn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={(e) => e.stopPropagation()} aria-label="More actions" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-surface [&_svg]:size-3.5">
                <MoreHorizontal />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { dispatch({ type: "hideBlock", index }); toast(block.hidden ? "Section shown" : "Section hidden — still in your list"); }}>
                {block.hidden ? <Eye /> : <EyeOff />} {block.hidden ? "Show on website" : "Hide from website"}
              </DropdownMenuItem>
              {meta.dup && (
                <DropdownMenuItem onClick={() => { dispatch({ type: "dupBlock", index }); toast(`${meta.name} duplicated`); }}>
                  <Copy /> Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={() => { dispatch({ type: "removeBlock", index }); toast(`${meta.name} removed`, { action: { label: "Undo", onClick: () => {} } }); }}>
                <Trash2 /> Remove section
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

  const back = (
    <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "leftMode", mode: "layers" })}>
      <ChevronLeft /> Sections
    </Button>
  );

  if (structureLocked(s))
    return (
      <Panel>
        <PanelHeader title="Add a section" actions={back} />
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
      <PanelHeader title="Add a section" actions={back} />
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
  const { advActive, publicProperties } = useDerived();
  return (
    <Panel>
      <PanelHeader title="Photos" />
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
