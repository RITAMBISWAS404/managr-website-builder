import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Lock, Eye, Monitor, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/store/BuilderProvider";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { canEdit } from "@/store/selectors";
import { OWNER } from "@/data/managr";
import { EditorUIProvider, useEditorUI } from "./EditorContext";
import { EditorToolbar } from "./EditorChrome";
import { LeftPanel } from "./LeftPanel";
import { WebsiteCanvas } from "./WebsiteCanvas";
import { InspectorPanel } from "@/features/inspector/InspectorPanel";
import { EditorOverlays } from "./overlays/EditorOverlays";
import { CoachMarks } from "./CoachMarks";

/* Editing needs the left structure panel, the canvas, and the right
   inspector on screen at once — the same three-column layout the rest of
   this editor is built around. Below that, there isn't a cramped-but-usable
   middle ground worth building for V1: tablet/phone owners get a clean
   preview instead of a half-working editor. Matches the `lg` breakpoint
   already used everywhere else in this editor to draw that same line
   (EditorChrome, LeftPanel, WebsiteCanvas) — one named threshold, not a
   second one invented for this. */
export const EDITOR_MIN_WIDTH = 1024;

export function EditorScreen() {
  return (
    <EditorUIProvider>
      <EditorInner />
    </EditorUIProvider>
  );
}

function EditorInner() {
  const s = useS();
  const dispatch = useDispatch();
  const { undo, redo } = useBuilder();
  const ui = useEditorUI();
  const [params, setParams] = useSearchParams();

  // URL <-> state sync for current page (§20)
  React.useEffect(() => {
    const p = params.get("page");
    if (p && p !== s.currentPage && s.pages.some((x) => x.id === p)) dispatch({ type: "setPage", id: p });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  React.useEffect(() => {
    if (params.get("page") !== s.currentPage) {
      const next = new URLSearchParams(params);
      next.set("page", s.currentPage);
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.currentPage]);

  // keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === "Escape") ui.close();
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); ui.open("command"); }
      if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if (mod && e.key === "Enter") { e.preventDefault(); ui.open("publish"); }
      if (!mod && e.key.toLowerCase() === "p" && !/input|textarea/i.test((e.target as HTMLElement)?.tagName)) {
        dispatch({ type: "editMode", on: !s.editMode });
      }
      if (s.selection?.block != null && e.key === "Backspace" && !/input|textarea/i.test((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        dispatch({ type: "removeBlock", index: s.selection.block });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui, undo, redo, dispatch, s.editMode, s.selection]);

  if (!canEdit(s)) return <EditorLocked />;

  return (
    <div className="fixed inset-0 flex flex-col bg-workspace">
      {/* Desktop: the real editor — toolbar + three-column grid. Both this
          and the notice below are always mounted; only CSS (the same `lg`
          breakpoint) decides which one shows, so resizing the window never
          remounts anything and never touches the store — draft edits,
          selection, undo history and the current page all survive a resize
          in either direction for free. */}
      <div className="hidden min-h-0 flex-1 flex-col lg:flex">
        <EditorToolbar />
        <div className="grid min-h-0 flex-1 lg:grid-cols-[284px_1fr_324px] xl:grid-cols-[300px_1fr_340px]">
          <div className="min-w-0 overflow-hidden border-r border-panel-border bg-panel"><LeftPanel /></div>
          <div className="min-w-0 overflow-auto bg-workspace"><WebsiteCanvas /></div>
          <div className="min-w-0 overflow-hidden border-l border-panel-border bg-panel"><InspectorPanel /></div>
        </div>
      </div>

      {/* Tablet/phone: editing genuinely isn't available yet — a real
          environment limit, not a device the "Desktop/Tablet/Mobile"
          preview switcher can be set to. That switcher controls what the
          *website* is previewed at from a desktop editor; it's unrelated
          to whether the *editor itself* can run here. */}
      <div className="flex min-h-0 flex-1 lg:hidden">
        <EditorDesktopOnlyNotice />
      </div>

      <EditorOverlays />
      <CoachMarks />
    </div>
  );
}

function EditorDesktopOnlyNotice() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-workspace">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-2">
        <Button asChild variant="ghost" size="icon-sm" aria-label="Back to Website">
          <Link to="/website"><ChevronLeft /></Link>
        </Button>
        <span className="truncate text-sm font-semibold text-foreground">{OWNER.biz}</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sunken text-muted-foreground">
          <Monitor className="size-5" />
        </span>
        <div className="max-w-[280px] space-y-1.5">
          <p className="text-body font-bold text-foreground">Editing is available on desktop</p>
          <p className="text-caption leading-relaxed text-muted-foreground">
            Use a desktop computer to edit your website. You can still preview it here.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link to="/website/preview"><Eye /> Preview website</Link>
        </Button>
      </div>
    </div>
  );
}

function EditorLocked() {
  const s = useS();
  return (
    <div className="fixed inset-0 grid place-items-center bg-workspace p-6">
      <div className="max-w-md space-y-3 rounded-2xl border border-border bg-surface p-7 text-center shadow-e1">
        <Lock className="mx-auto size-8 text-muted-foreground" />
        <h2 className="text-title font-bold">View only</h2>
        <p className="text-caption text-muted-foreground">
          Your role (<b>{s.role}</b>) can see the website but not edit it. Keeping bed status current in ManagR is the part
          of the job that keeps public availability honest.
        </p>
        <div className="flex justify-center gap-2 pt-1">
          <Button asChild variant="outline" size="sm"><Link to="/website/preview"><Eye /> Preview the live site</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/website">Back</Link></Button>
        </div>
        <p className="text-caption text-faint">Ask an Owner to change your access.</p>
      </div>
    </div>
  );
}
