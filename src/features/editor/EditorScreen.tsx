import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/store/BuilderProvider";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { canEdit } from "@/store/selectors";
import { EditorUIProvider, useEditorUI } from "./EditorContext";
import { EditorRail, EditorToolbar, EditorStatusBar, EditorMobileTop, EditorMobileBar, EditorMobileFloat } from "./EditorChrome";
import { LeftPanel } from "./LeftPanel";
import { WebsiteCanvas } from "./WebsiteCanvas";
import { InspectorPanel } from "@/features/inspector/InspectorPanel";
import { EditorOverlays } from "./overlays/EditorOverlays";
import { CoachMarks } from "./CoachMarks";

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
      <EditorToolbar />
      <EditorMobileTop />

      <div className="grid min-h-0 flex-1 lg:grid-cols-[52px_284px_1fr_324px] xl:grid-cols-[56px_300px_1fr_340px]">
        {/* 1 · navigation / sections — "tools" */}
        <div className="hidden lg:block"><EditorRail /></div>
        <div className="hidden min-w-0 overflow-hidden border-r border-panel-border bg-panel lg:block"><LeftPanel /></div>
        {/* 2 · the workspace holding the website */}
        <div className="min-w-0 overflow-auto bg-workspace"><WebsiteCanvas /></div>
        {/* 3 · contextual inspector */}
        <div className="hidden min-w-0 overflow-hidden border-l border-panel-border bg-panel lg:block"><InspectorPanel /></div>
      </div>

      <EditorMobileFloat />
      <EditorMobileBar />
      <div className="hidden lg:block"><EditorStatusBar /></div>

      <EditorOverlays />
      <CoachMarks />
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
