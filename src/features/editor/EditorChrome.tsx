import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers, Plus, Image as ImageIcon, Sparkles, Tablet, Search, ChevronLeft, Undo2, Redo2,
  Monitor, Smartphone, Eye, Pencil, ChevronDown, Check, AlertTriangle, Info, History, RotateCcw,
  MoreHorizontal, ArrowUp, ArrowDown, Cloud, CloudOff, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useBuilder } from "@/store/BuilderProvider";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { useEditorUI } from "./EditorContext";
import { Seg } from "./panel";
import { SECTIONS } from "@/features/sections/registry";
import { OWNER } from "@/data/managr";
import { structureLocked } from "@/store/selectors";

type LeftMode = "layers" | "pages" | "add" | "assets";
// "Pages" is deliberately not a rail destination: the site is a single page
// today, plus one auto-generated property-detail page and (Advanced) a
// handful of extra pages — switching between them belongs with "where am I"
// in the toolbar's page picker, not competing with page STRUCTURE here.
//
// The rail is two tiers, not one flat list: Sections/Add/Design are the
// primary editing modes (full size); Photos/Check are secondary utilities
// (smaller, quieter) — they support the edit, they aren't a peer of it.
const PRIMARY_RAIL: [LeftMode, string, typeof Layers][] = [
  ["layers", "Sections", Layers],
  ["add", "Add", Plus],
];

/* ---------- left rail ("tools") ---------- */
export function EditorRail() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const btn =
    "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold min-h-[50px] transition-colors [&_svg]:size-[18px]";
  const idle = "text-muted-foreground hover:bg-accent hover:text-foreground";
  const active = "bg-brand/[0.09] font-bold text-brand";
  const minor =
    "flex flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[9.5px] font-medium min-h-[40px] text-faint transition-colors hover:bg-accent hover:text-muted-foreground [&_svg]:size-4";
  return (
    <div className="flex h-full flex-col gap-1 border-r border-border bg-surface-2 px-1.5 py-3">
      {PRIMARY_RAIL.map(([mode, label, Icon]) => (
        <button key={mode} onClick={() => dispatch({ type: "leftMode", mode })} className={cn(btn, s.leftMode === mode ? active : idle)}>
          <Icon /> {label}
        </button>
      ))}
      <button className={cn(btn, idle)} onClick={() => ui.open("design")}><Sparkles /> Design</button>

      <div className="mx-3 my-1.5 h-px bg-border-subtle" />

      <button
        className={cn(minor, s.leftMode === "assets" && "text-muted-foreground")}
        onClick={() => dispatch({ type: "leftMode", mode: "assets" })}
      >
        <ImageIcon /> Photos
      </button>
      <button className={minor} onClick={() => ui.open("responsive")}><Tablet /> Check</button>

      <div className="flex-1" />
      <button className={minor} onClick={() => ui.open("command")}><Search /> Find</button>
    </div>
  );
}

/* ---------- save indicator (quiet) ---------- */
function SaveDot() {
  const s = useS();
  if (s.saveState === "saving")
    return <span className="flex items-center gap-1.5 text-caption text-muted-foreground"><Cloud className="size-3.5 animate-pulse" /> Saving…</span>;
  if (s.saveState === "offline")
    return <span className="flex items-center gap-1.5 text-caption text-warning"><CloudOff className="size-3.5" /> Offline — saved on this device</span>;
  return <span className="flex items-center gap-1.5 text-caption text-muted-foreground"><Check className="size-3.5 text-success" /> Saved</span>;
}

/* ---------- desktop toolbar ---------- */
export function EditorToolbar() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { undo, redo, canUndo, canRedo } = useBuilder();
  const { page } = useDerived();
  const ui = useEditorUI();

  return (
    <div className="relative hidden h-[60px] shrink-0 items-center gap-2.5 border-b border-border bg-surface pl-2.5 pr-3.5 shadow-xs lg:flex">
      {/* left cluster: where am I */}
      <Button asChild variant="ghost" size="sm" className="-mr-0.5 text-muted-foreground">
        <Link to="/website"><ChevronLeft /> Website</Link>
      </Button>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">{OWNER.biz}</span>
        <span className="text-faint">/</span>
        <button
          onClick={() => ui.open("pagePick")}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-caption font-semibold text-foreground transition-colors hover:border-border hover:bg-surface-2"
        >
          {page.name} <ChevronDown className="size-3.5 text-faint" />
        </button>
      </div>
      <span className="mx-0.5 h-5 w-px bg-border" />
      <SaveDot />

      <span className="flex-1" />

      {/* centre well: the editing tools, visually its own group */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-2 p-1">
        <Hint label="Undo (⌘Z)">
          <button aria-label="Undo" disabled={!canUndo} onClick={undo} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface disabled:opacity-30 [&_svg]:size-4"><Undo2 /></button>
        </Hint>
        <Hint label="Redo (⇧⌘Z)">
          <button aria-label="Redo" disabled={!canRedo} onClick={redo} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface disabled:opacity-30 [&_svg]:size-4"><Redo2 /></button>
        </Hint>
        <span className="mx-0.5 h-5 w-px bg-border-subtle" />
        <DeviceSwitcher />
      </div>

      {/* right cluster: leave / ship */}
      <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "editMode", on: !s.editMode })}>
        {s.editMode ? <><Eye /> Preview</> : <><Pencil /> Edit</>}
      </Button>

      <div className="flex shadow-e1 [&>*]:shadow-none">
        <Button variant="primary" size="sm" className="h-9 rounded-r-none pl-3.5 pr-3 font-bold" onClick={() => ui.open("publish")}>
          Publish
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm" aria-label="More publish options" className="h-9 rounded-l-none border-l border-white/20 px-1.5">
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => ui.open("publish")}><Check /> Review &amp; publish</DropdownMenuItem>
            <DropdownMenuItem onClick={() => ui.open("responsive")}><Tablet /> Check phone layout</DropdownMenuItem>
            <DropdownMenuItem onClick={() => nav("/website/preview")}><Eye /> Preview as a visitor</DropdownMenuItem>
            <DropdownMenuItem onClick={() => ui.open("versions")}><History /> Version history</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={() => dispatch({ type: "discardDraft" })}>
              <RotateCcw /> Discard draft changes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function DeviceSwitcher() {
  const s = useS();
  const dispatch = useDispatch();
  return (
    <Seg
      value={s.device}
      onChange={(d) => dispatch({ type: "device", device: d as never })}
      options={[
        { value: "desktop", label: <Monitor />, title: "Desktop" },
        { value: "tablet", label: <Tablet />, title: "Tablet" },
        { value: "mobile", label: <Smartphone />, title: "Phone" },
      ]}
    />
  );
}

/* ---------- desktop status bar ---------- */
export function EditorStatusBar() {
  const s = useS();
  const nav = useNavigate();
  const { page, check, respIssues } = useDerived();
  const ui = useEditorUI();
  const health = check.blockers.length
    ? { dot: "bg-warning", text: `${check.blockers.length} to fix before publishing` }
    : check.warnings.length
      ? { dot: "bg-info", text: `${check.warnings.length} to review` }
      : { dot: "bg-success", text: "Ready to publish" };

  return (
    <div className="flex h-9 shrink-0 items-center gap-4 border-t border-border bg-surface px-4 text-caption text-muted-foreground">
      <span>{page.name} · {page.blocks.filter((b) => !b.hidden).length} sections showing</span>
      <button className="inline-flex items-center gap-1.5 hover:text-foreground" onClick={() => nav("/website/health")}>
        <span className={cn("size-1.5 rounded-full", health.dot)} /> {health.text}
      </button>
      <button className="inline-flex items-center gap-1.5 hover:text-foreground" onClick={() => ui.open("responsive")}>
        <Smartphone className="size-3.5" />{" "}
        {respIssues.length ? `${respIssues.length} phone-layout note${respIssues.length > 1 ? "s" : ""}` : "Phone layout looks good"}
      </button>
      <span className="flex-1" />
      <button
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground"
        onClick={() => ui.open("command")}
      >
        <Search className="size-3.5" /> Quick actions <kbd className="text-[10px] text-faint">⌘K</kbd>
      </button>
    </div>
  );
}

/* ---------- mobile top bar ---------- */
export function EditorMobileTop() {
  const { page } = useDerived();
  const ui = useEditorUI();
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-2 lg:hidden">
      <Button asChild variant="ghost" size="icon-sm" aria-label="Back to Website">
        <Link to="/website"><ChevronLeft /></Link>
      </Button>
      <button
        onClick={() => ui.open("pagePick")}
        className="flex h-9 flex-1 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-caption font-semibold"
      >
        {page.name} <ChevronDown className="size-3.5 text-faint" />
      </button>
      <div className="pr-1"><SaveDot /></div>
      <Button variant="ghost" size="icon-sm" aria-label="More" onClick={() => ui.open("editorMore")}><MoreHorizontal /></Button>
    </div>
  );
}

/* ---------- mobile bottom bar ---------- */
export function EditorMobileBar() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold min-h-[54px] transition-colors [&_svg]:size-[19px]";
  return (
    <div className="flex shrink-0 border-t border-border bg-surface lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <button className={cn(item, "text-muted-foreground")} onClick={() => ui.open("mobileLayers")}><Layers /> Sections</button>
      <button className={cn(item, "text-muted-foreground")} onClick={() => ui.open("mobileAdd")}><Plus /> Add</button>
      <button className={cn(item, "text-muted-foreground")} onClick={() => ui.open("design")}><Sparkles /> Design</button>
      <button className={cn(item, "text-muted-foreground")} onClick={() => dispatch({ type: "editMode", on: !s.editMode })}>
        {s.editMode ? <Eye /> : <Pencil />} {s.editMode ? "Preview" : "Edit"}
      </button>
      <button className={cn(item, "text-brand")} onClick={() => ui.open("publish")}><Check /> Publish</button>
    </div>
  );
}

/* ---------- mobile selection bar ---------- */
export function EditorMobileFloat() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { page } = useDerived();
  const selBlock = s.selection?.block;
  if (selBlock == null || !s.editMode) return null;
  const block = page.blocks[selBlock];
  if (!block) return null;
  const meta = SECTIONS[block.type];
  const canStruct = meta && !meta.structural && !structureLocked(s);

  return (
    <div className="fixed inset-x-3 bottom-[74px] z-[120] flex items-center gap-1 rounded-2xl border border-border bg-surface p-1.5 shadow-pop lg:hidden">
      <span className="flex-1 truncate px-1 text-caption font-bold">
        {meta?.name}
        {block.hidden && <span className="font-normal text-muted-foreground"> · hidden</span>}
      </span>
      {canStruct && (
        <>
          <FloatBtn onClick={() => dispatch({ type: "moveBlock", index: selBlock, dir: -1 })} label="Move up"><ArrowUp /></FloatBtn>
          <FloatBtn onClick={() => dispatch({ type: "moveBlock", index: selBlock, dir: 1 })} label="Move down"><ArrowDown /></FloatBtn>
        </>
      )}
      <button
        onClick={() => ui.open("mobileSection")}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand/[0.1] px-3.5 text-caption font-semibold text-brand"
      >
        <SlidersHorizontal className="size-4" /> Edit
      </button>
      <FloatBtn onClick={() => dispatch({ type: "select", block: null })} label="Done"><Check /></FloatBtn>
    </div>
  );
}
function FloatBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button aria-label={label} onClick={onClick} className="grid size-9 place-items-center rounded-xl text-muted-foreground [&_svg]:size-4">
      {children}
    </button>
  );
}
