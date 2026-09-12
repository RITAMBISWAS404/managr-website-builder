import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Undo2, Redo2, RotateCcw } from "lucide-react";
import { useBuilder } from "@/store/BuilderProvider";
import { DirectionContinuousSheet } from "./DirectionContinuousSheet";
import { DirectionSplitPreview } from "./DirectionSplitPreview";
import { DirectionBottomSheetGrid } from "./DirectionBottomSheetGrid";

/* ============================================================================
   /design-lab — PASS 1 (corrected), layout-only exploration.

   Additive route, does not touch the production editor, DesignSheet, or any
   other screen. This is still, unambiguously, the Design popup: a modal or
   sheet, opened over the editor, containing Style / Brand / Typography
   controls built from the same recognizable pieces (theme cards, colour
   swatches, typography options, a logo row, a hex input, a bounded preview
   panel) — see shared.tsx. Only the arrangement of those pieces differs
   between the three directions below.

   A muted, static stand-in for the real editor sits behind the popup so the
   overlay relationship reads correctly — it is not the real EditorScreen,
   just enough chrome to show "this opens on top of the editor."

   State is the real store (setTheme/setDesign — same actions the production
   DesignSheet uses), so live preview, autosave and undo/redo are genuine.
   ========================================================================= */

const DIRECTIONS = [
  { key: "sheet", label: "1 · Continuous Sheet", render: DirectionContinuousSheet },
  { key: "split", label: "2 · Split Preview", render: DirectionSplitPreview },
  { key: "grid", label: "3 · Bottom Sheet · Grid", render: DirectionBottomSheetGrid },
] as const;

export function DesignLabPage() {
  const [dir, setDir] = React.useState<(typeof DIRECTIONS)[number]["key"]>("sheet");
  const { dispatch, undo, redo, canUndo, canRedo } = useBuilder();
  const Active = DIRECTIONS.find((d) => d.key === dir)!.render;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-100 font-sans">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 text-[13px]">
        <Link to="/website/editor" className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900">
          <ArrowLeft className="size-3.5" /> Editor
        </Link>
        <span className="h-4 w-px bg-neutral-200" />
        <span className="font-semibold text-neutral-800">Design Lab</span>
        <span className="text-neutral-400">Pass 1 (corrected) — same popup, three layouts</span>

        <div className="ml-auto flex items-center gap-1 rounded-full bg-neutral-100 p-1">
          {DIRECTIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDir(d.key)}
              className={
                "rounded-full px-3 py-1.5 font-medium transition-colors " +
                (dir === d.key ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900")
              }
            >
              {d.label}
            </button>
          ))}
        </div>

        <span className="h-4 w-px bg-neutral-200" />
        <button onClick={undo} disabled={!canUndo} className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30" title="Undo">
          <Undo2 className="size-4" />
        </button>
        <button onClick={redo} disabled={!canRedo} className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30" title="Redo">
          <Redo2 className="size-4" />
        </button>
        <button
          onClick={() => dispatch({ type: "setDesign", patch: { brandColor: null, fontPair: "modern", layoutDensity: "balanced" } })}
          className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          title="Reset demo colours/type"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <FauxEditorBackdrop />
        <Active key={dir} />
      </div>
    </div>
  );
}

/** A muted, non-interactive stand-in for the real editor — just enough
 *  chrome so the three popups read as "opened over the editor," not as a
 *  standalone page. Never the real EditorScreen; nothing here is wired. */
function FauxEditorBackdrop() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#e9eaee]">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 text-[12px] text-neutral-400">
        <span className="font-semibold text-neutral-500">Shree Residency</span>
        <span className="ml-auto rounded-md border border-neutral-200 px-2.5 py-1">Design</span>
        <span className="rounded-md border border-neutral-200 px-2.5 py-1">Preview</span>
        <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-white">Publish</span>
      </div>
      <div className="flex flex-1">
        <div className="w-56 shrink-0 border-r border-neutral-200 bg-white p-3">
          {["Header", "Hero", "Properties", "About", "Contact", "Footer"].map((s) => (
            <div key={s} className="mb-1.5 rounded-md px-2.5 py-2 text-[12px] text-neutral-400">{s}</div>
          ))}
        </div>
        <div className="flex flex-1 items-start justify-center p-10">
          <div className="h-[420px] w-full max-w-[640px] rounded-xl border border-neutral-200 bg-white shadow-sm" />
        </div>
        <div className="w-64 shrink-0 border-l border-neutral-200 bg-white" />
      </div>
    </div>
  );
}
