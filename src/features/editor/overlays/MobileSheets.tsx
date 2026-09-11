import {
  ArrowUp, ArrowDown, Eye, EyeOff, Copy, Trash2, Plus, Lock, FileText, Image as ImageIcon,
  Tablet, Settings, RefreshCw, Undo2, Play, Check, ChevronRight, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBuilder } from "@/store/BuilderProvider";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { SECTIONS, ADD_CATEGORIES } from "@/features/sections/registry";
import { structureLocked, sectionLocked } from "@/store/selectors";
import { InspectorPanel } from "@/features/inspector/InspectorPanel";
import type { SectionType } from "@/types";
import { useEditorUI } from "../EditorContext";

/* ---- page picker ---- */
export function PagePickSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { advActive } = useDerived();
  return (
    <Dialog open={ui.overlay === "pagePick"} onOpenChange={(v) => !v && ui.close()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Pages</DialogTitle><DialogDescription>Jump to a page to edit it</DialogDescription></DialogHeader>
        <div className="p-2">
          {s.pages.map((p) => (
            <button
              key={p.id}
              onClick={() => { dispatch({ type: "setPage", id: p.id }); ui.close(); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body transition-colors hover:bg-panel-hover"
            >
              <span className="flex-1 truncate font-medium">
                {p.name}
                {(p.home || p.hidden) && <span className="ml-1 text-caption font-normal text-muted-foreground">· {p.home ? "home" : "hidden"}</span>}
              </span>
              {s.currentPage === p.id && <Check className="size-4 shrink-0 text-brand" />}
            </button>
          ))}
        </div>
        <div className="border-t border-border-subtle p-2">
          {advActive ? (
            <Button
              variant="outline" size="sm" className="w-full"
              onClick={() => { dispatch({ type: "addPage", kind: "blank" }); }}
            >
              <Plus /> Add a page
            </Button>
          ) : (
            <p className="px-1 py-1 text-caption text-muted-foreground">
              Extra pages come with Advanced.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- editor "more" ---- */
export function EditorMoreSheet() {
  const ui = useEditorUI();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { undo } = useBuilder();
  const rows: [React.ComponentType<{ className?: string }>, string, () => void][] = [
    [FileText, "Pages", () => ui.open("pagePick")],
    [ImageIcon, "Photos", () => ui.open("mobileLayers")],
    [Tablet, "Responsive check", () => ui.open("responsive")],
    [Settings, "Website settings", () => nav("/website/settings")],
    [RefreshCw, "Version history", () => ui.open("versions")],
    [Undo2, "Undo", () => { undo(); ui.close(); }],
    [RefreshCw, "Discard draft changes", () => { dispatch({ type: "discardDraft" }); ui.close(); }],
    [Play, "Preview as visitor", () => nav("/website/preview")],
  ];
  return (
    <Sheet open={ui.overlay === "editorMore"} onOpenChange={(v) => !v && ui.close()}>
      <SheetContent side="bottom" className="sm:mx-auto sm:max-w-md">
        <SheetHeader><SheetTitle>More</SheetTitle></SheetHeader>
        <SheetBody>
          <div className="overflow-hidden rounded-xl border border-hair border-border">
            {rows.map(([Icon, label, fn]) => (
              <button key={label} onClick={fn} className="flex w-full items-center gap-3 border-b border-border-subtle px-3 py-3 text-left text-body last:border-0 hover:bg-muted [&_svg]:size-4">
                <Icon /> <span className="flex-1">{label}</span> <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

/* ---- mobile: sections list ---- */
export function MobileLayersSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { page } = useDerived();
  const locked = structureLocked(s);

  // Same mental model as desktop: header pinned at the top, footer pinned at
  // the bottom, everything else reorderable in between — one continuous list.
  const rows = page.blocks.map((b, i) => ({ b, i }));
  const body = rows.filter((x) => !SECTIONS[x.b.type].structural);
  const header = rows.find((x) => x.b.type === "header");
  const footer = rows.find((x) => x.b.type === "footer");

  const row = (b: (typeof rows)[number]["b"], i: number, pinned?: "top" | "bottom") => {
    const meta = SECTIONS[b.type];
    const canStruct = !pinned && !meta.structural && !locked;
    return (
      <div key={b.id} className="flex items-center gap-2.5 px-3.5 py-3 text-body">
        {pinned && <Lock className="size-3.5 shrink-0 text-faint" />}
        <meta.icon className="size-4 shrink-0 text-muted-foreground" />
        <span className={`min-w-0 flex-1 truncate font-medium ${b.hidden ? "text-muted-foreground/70 line-through" : ""}`}>
          {meta.name}
        </span>
        {pinned ? (
          <span className="shrink-0 text-caption text-muted-foreground/70">Fixed</span>
        ) : locked ? (
          <Badge variant="advanced"><Sparkles /> Advanced</Badge>
        ) : (
          <span className="flex shrink-0 gap-0.5">
            {canStruct && (
              <>
                <MB onClick={() => dispatch({ type: "moveBlock", index: i, dir: -1 })}><ArrowUp /></MB>
                <MB onClick={() => dispatch({ type: "moveBlock", index: i, dir: 1 })}><ArrowDown /></MB>
              </>
            )}
            <MB onClick={() => dispatch({ type: "hideBlock", index: i })}>{b.hidden ? <Eye /> : <EyeOff />}</MB>
            {meta.dup && canStruct && <MB onClick={() => dispatch({ type: "dupBlock", index: i })}><Copy /></MB>}
            {canStruct && <MB onClick={() => dispatch({ type: "removeBlock", index: i })}><Trash2 /></MB>}
          </span>
        )}
      </div>
    );
  };

  return (
    <Sheet open={ui.overlay === "mobileLayers"} onOpenChange={(v) => !v && ui.close()}>
      <SheetContent side="full">
        <SheetHeader><SheetTitle>Sections · {page.name}</SheetTitle><SheetDescription>{locked ? "Fixed on Basic" : "Reorder, hide, remove"}</SheetDescription></SheetHeader>
        <SheetBody className="p-0">
          <div className="divide-y divide-border-subtle rounded-xl border border-border">
            {header && row(header.b, header.i, "top")}
            <div className="flex items-center gap-2 bg-surface-2 px-3.5 py-1.5">
              <span className="text-micro font-semibold uppercase tracking-[0.05em] text-faint">Sections</span>
            </div>
            {body.map((x) => row(x.b, x.i))}
            {footer && row(footer.b, footer.i, "bottom")}
          </div>
          <p className="px-1 pt-3 text-caption leading-snug text-muted-foreground">
            Header and footer are fixed in place and shared everywhere this site is shown.
          </p>
          {!locked && (
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => ui.open("mobileAdd")}><Plus /> Add section</Button>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
function MB({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="grid size-8 place-items-center rounded text-muted-foreground [&_svg]:size-4">{children}</button>;
}

/* ---- mobile: add ---- */
export function MobileAddSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { advActive, page } = useDerived();
  const present = page.blocks.map((b) => b.type);
  return (
    <Sheet open={ui.overlay === "mobileAdd"} onOpenChange={(v) => !v && ui.close()}>
      <SheetContent side="full">
        <SheetHeader><SheetTitle>Add a section</SheetTitle><SheetDescription>Every section is pre-designed and can't break on a phone</SheetDescription></SheetHeader>
        <SheetBody>
          {structureLocked(s) ? (
            <div className="rounded-xl border border-advanced-border bg-advanced-surface p-4 text-body">
              <div className="flex items-center gap-2 font-semibold text-advanced"><Lock className="size-4" /> Adding sections is part of Advanced</div>
              <p className="mt-2">Basic keeps a fixed, safe layout.</p>
              <Button asChild size="sm" variant="primary" className="mt-2"><a href="/website/upgrade">See Advanced</a></Button>
            </div>
          ) : (
            ADD_CATEGORIES.map((cat) => (
              <div key={cat.key}>
                <div className="px-1.5 pb-1 pt-4 text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground/70">{cat.label}</div>
                {Object.values(SECTIONS).filter((m) => m.category === cat.key).map((m) => {
                  const added = m.solo && present.includes(m.id);
                  const adv = m.advanced && !advActive;
                  return (
                    <button
                      key={m.id}
                      disabled={added}
                      onClick={() => { dispatch({ type: "addBlock", sectionType: m.id as SectionType }); ui.close(); }}
                      className="mb-1.5 flex w-full items-center gap-2.5 rounded-lg border border-hair border-border p-2.5 text-left disabled:opacity-50"
                    >
                      <m.icon className="size-4 text-muted-foreground" />
                      <span className="flex-1"><b className="text-caption">{m.name}</b><span className="block text-caption text-muted-foreground">{m.blurb}</span></span>
                      {added ? <Badge variant="neutral">Added</Badge> : adv ? <Badge variant="advanced"><Lock /></Badge> : <Badge variant="success">+</Badge>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

/* ---- mobile: section settings ---- */
export function MobileSectionSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { page } = useDerived();
  const sel = s.selection?.block;
  const open = ui.overlay === "mobileSection" && sel != null;
  const block = sel != null ? page.blocks[sel] : null;
  const meta = block ? SECTIONS[block.type] : null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && ui.close()}>
      <SheetContent side="full" className="p-0" hideClose>
        {block && meta && (
          <>
            <div className="min-h-0 flex-1 overflow-hidden pt-1">
              <InspectorPanel mobile onClose={ui.close} />
            </div>
            <SheetFooter>
              <Button variant="primary" onClick={ui.close}>Done editing</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
