import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers, Plus, Sparkles, Tablet, ChevronLeft, Undo2, Redo2,
  Monitor, Smartphone, Eye, Pencil, ChevronDown, Check, History, RotateCcw,
  MoreHorizontal, ArrowUp, ArrowDown, Cloud, CloudOff, SlidersHorizontal, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useBuilder } from "@/store/BuilderProvider";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { useEditorUI } from "./EditorContext";
import { Seg } from "./panel";
import { SECTIONS } from "@/features/sections/registry";
import { OWNER } from "@/data/managr";
import { structureLocked } from "@/store/selectors";

/* ---------- save indicator — a compact status pill, not a badge ---------- */
function SaveDot() {
  const s = useS();
  const pill = "inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-caption font-medium";
  if (s.saveState === "saving")
    return <span className={cn(pill, "bg-sunken text-muted-foreground")}><Cloud className="size-3.5 animate-pulse" /> Saving…</span>;
  if (s.saveState === "offline")
    return <span className={cn(pill, "bg-warning-surface text-warning")}><CloudOff className="size-3.5" /> Offline</span>;
  return <span className={cn(pill, "bg-success-surface text-success")}><Check className="size-3.5" /> Saved</span>;
}

/* ---------- current website context — reuses the real property data,
   does not invent a multi-website switcher (see EditorChrome notes) ---------- */
function PropertySelector() {
  const { publicProperties } = useDerived();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex h-8 min-w-0 max-w-[220px] items-center gap-1.5 rounded-lg px-2 text-caption font-semibold text-foreground transition-colors hover:bg-surface-2">
          <Building2 className="size-3.5 shrink-0 text-faint" />
          <span className="truncate">{OWNER.biz}</span>
          <ChevronDown className="size-3.5 shrink-0 text-faint" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" collisionPadding={8} className="w-64">
        <DropdownMenuLabel>Your website</DropdownMenuLabel>
        <div className="flex items-center gap-2 px-2 py-1.5 text-body">
          <Check className="size-4 shrink-0 text-success" />
          <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{OWNER.biz}</span>
        </div>
        {publicProperties.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Properties on this site</DropdownMenuLabel>
            {publicProperties.map((p) => (
              <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 text-caption text-muted-foreground">
                <Building2 className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="shrink-0 text-faint">{p.area}</span>
              </div>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- desktop toolbar ---------- */
export function EditorToolbar() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { undo, redo, canUndo, canRedo } = useBuilder();
  const ui = useEditorUI();

  return (
    <div className="relative hidden h-[60px] shrink-0 items-center gap-2 border-b border-border bg-surface pl-2.5 pr-3.5 shadow-xs lg:flex">
      {/* left cluster: leave the editor, current context, save state.
          No page picker here — this V1 editor has one page, so a page
          dropdown would only imply a choice that doesn't exist. */}
      <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
        <Link to="/website" aria-label="Back to Website"><ChevronLeft className="size-4" /> Website</Link>
      </Button>

      <span className="h-5 w-px bg-border" />

      <PropertySelector />
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

      {/* right cluster: global actions only — design, preview, publish */}
      <Button variant="outline" size="sm" onClick={() => ui.open("design")}>
        <Sparkles /> Design
      </Button>
      <Button variant="outline" size="sm" onClick={() => dispatch({ type: "editMode", on: !s.editMode })}>
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
          <DropdownMenuContent align="end" collisionPadding={8}>
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

/* ---------- mobile top bar ---------- */
export function EditorMobileTop() {
  const s = useS();
  const { page } = useDerived();
  const ui = useEditorUI();
  const hasMultiplePages = s.pages.filter((p) => p.kind === "standard").length > 1;
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-2 lg:hidden">
      <Button asChild variant="ghost" size="icon-sm" aria-label="Back to Website">
        <Link to="/website"><ChevronLeft /></Link>
      </Button>
      {hasMultiplePages ? (
        <button
          onClick={() => ui.open("pagePick")}
          className="flex h-9 flex-1 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-caption font-semibold"
        >
          {page.name} <ChevronDown className="size-3.5 text-faint" />
        </button>
      ) : (
        <span className="flex-1 px-3 text-caption font-semibold text-muted-foreground">{page.name}</span>
      )}
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
