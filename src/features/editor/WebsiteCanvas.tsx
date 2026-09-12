import { ArrowUp, ArrowDown, MoreHorizontal, Eye, EyeOff, Copy, Trash2, Check, Play, Plus, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { SECTIONS } from "@/features/sections/registry";
import { SiteSection, SectionPlaceholder, hasPlaceholder } from "@/features/sections/SectionCanvas";
import { structureLocked, siteUrl } from "@/store/selectors";

const FRAME_W = { desktop: "lg:max-w-[1200px]", tablet: "lg:max-w-[760px]", mobile: "lg:max-w-[404px]" };
// Section rhythm is now a single global Design choice (Style → Spacing),
// not a per-section control — `block.dense` predates that and is frozen at
// its initial value for every block (nothing writes to it any more), so the
// real, live setting to read here is `s.layoutDensity`.
const GLOBAL_DENSE = { balanced: "px-6 py-7", spacious: "px-6 py-10", compact: "px-6 py-4" };

export function WebsiteCanvas() {
  const s = useS();
  const dispatch = useDispatch();
  const { page } = useDerived();
  const locked = structureLocked(s);
  const deviceLabel = { desktop: "Desktop", tablet: "Tablet", mobile: "Phone" }[s.device];

  return (
    <div
      className="min-h-full px-4 py-4 lg:px-16 lg:py-12"
      style={{
        backgroundImage: "radial-gradient(rgba(17, 17, 17, 0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-3.5 hidden items-center gap-2 overflow-hidden text-caption text-muted-foreground lg:flex">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 font-medium text-foreground shadow-xs ring-1 ring-panel-border">
            <span className={cn("size-1.5 rounded-full", s.editMode ? "bg-brand" : "bg-faint")} />
            {s.editMode ? "Editing" : "Preview"} · {deviceLabel}
          </span>
          {s.editMode && <span className="hidden truncate text-faint xl:inline">click any section to edit it</span>}
          <Button asChild variant="ghost" size="sm" className="ml-auto shrink-0 text-muted-foreground">
            <Link to="/website/preview"><Play /> <span className="hidden xl:inline">Open full preview</span><span className="xl:hidden">Preview</span></Link>
          </Button>
        </div>

        <div
          className={cn(
            "mx-auto w-full overflow-hidden bg-white transition-[max-width] duration-300 ease-smooth lg:rounded-2xl lg:shadow-frame lg:ring-1 lg:ring-black/[0.06]",
            FRAME_W[s.device],
          )}
        >
          <div className="hidden h-8 items-center gap-1.5 border-b border-border-subtle bg-surface-2 px-3.5 lg:flex">
            <span className="size-2 rounded-full bg-[#dcdee2]" />
            <span className="size-2 rounded-full bg-[#dcdee2]" />
            <span className="size-2 rounded-full bg-[#dcdee2]" />
            <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-0.5 text-caption text-muted-foreground shadow-xs">
              <Lock className="size-3 text-faint" /> {siteUrl(s)}
            </span>
          </div>

          {!s.editMode && (
            <div className="flex items-center justify-center gap-1.5 border-b border-warning-border bg-warning-surface px-3 py-2 text-caption font-medium text-warning">
              <Eye className="size-3.5" /> Draft preview — visitors still see your published site
            </div>
          )}

          <div>
            {page.blocks.map((b, i) => {
              const meta = SECTIONS[b.type];
              const bpHidden = b.visibility[s.device] === false;
              if (!s.editMode && (b.hidden || bpHidden)) return null;
              const selected = s.selection?.block === i;
              const canStruct = !meta.structural && !locked;

              return (
                <div
                  key={b.id}
                  onClick={() => s.editMode && dispatch({ type: "select", block: selected ? null : i })}
                  className={cn(
                    "group relative border-b border-border-subtle transition-[box-shadow,opacity] duration-100 last:border-b-0",
                    GLOBAL_DENSE[s.layoutDensity] ?? GLOBAL_DENSE.balanced,
                    s.editMode && "cursor-pointer",
                    s.editMode && !selected && "hover:ring-1 hover:ring-inset hover:ring-ring-soft",
                    selected && "ring-[1.5px] ring-inset ring-brand",
                    (b.hidden || bpHidden) && s.editMode && "opacity-45",
                  )}
                >
                  {s.editMode && (
                    <span
                      className={cn(
                        "pointer-events-none absolute -top-px left-0 z-10 rounded-br-lg bg-brand px-2 py-0.5 text-micro font-semibold uppercase text-white transition-opacity",
                        selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      {meta.name}
                      {b.hidden ? " · hidden" : bpHidden ? ` · off on ${s.device}` : ""}
                      {b.global ? " · every page" : ""}
                    </span>
                  )}

                  {s.editMode && selected && (
                    <div className="absolute right-2 top-2 z-10 hidden items-center gap-0.5 rounded-lg border border-border bg-white p-1 shadow-e2 lg:flex">
                      {canStruct && (
                        <>
                          <Mini onClick={() => { dispatch({ type: "moveBlock", index: i, dir: -1 }); toast("Moved up"); }} label="Move up"><ArrowUp /></Mini>
                          <Mini onClick={() => { dispatch({ type: "moveBlock", index: i, dir: 1 }); toast("Moved down"); }} label="Move down"><ArrowDown /></Mini>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()} aria-label="More actions" className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted [&_svg]:size-3.5">
                                <MoreHorizontal />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { dispatch({ type: "hideBlock", index: i }); toast(b.hidden ? "Section shown" : "Section hidden"); }}>
                                {b.hidden ? <Eye /> : <EyeOff />} {b.hidden ? "Show on website" : "Hide from website"}
                              </DropdownMenuItem>
                              {meta.dup && (
                                <DropdownMenuItem onClick={() => { dispatch({ type: "dupBlock", index: i }); toast(`${meta.name} duplicated`); }}>
                                  <Copy /> Duplicate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem destructive onClick={() => { dispatch({ type: "removeBlock", index: i }); toast(`${meta.name} removed`); }}>
                                <Trash2 /> Remove section
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                      <span className="mx-0.5 h-4 w-px bg-border" />
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: "select", block: null }); }}
                        className="inline-flex h-7 items-center gap-1 rounded px-2 text-caption font-semibold text-brand hover:bg-brand/[0.08]"
                      >
                        <Check className="size-3.5" /> Done
                      </button>
                    </div>
                  )}

                  {hasPlaceholder(b, s) ? <SectionPlaceholder block={b} s={s} /> : <SiteSection block={b} s={s} />}
                </div>
              );
            })}

            {s.editMode && !locked && (
              <button
                onClick={(e) => { e.stopPropagation(); dispatch({ type: "leftMode", mode: "add" }); }}
                className="flex w-full items-center justify-center gap-2 border-t border-dashed border-border-subtle bg-surface-2 py-3.5 text-caption font-semibold text-muted-foreground transition-colors hover:bg-sunken hover:text-foreground"
              >
                <Plus className="size-4" /> Add a section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}
