import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { relTime } from "@/lib/utils";
import { useEditorUI } from "../EditorContext";

export function VersionsSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const ui = useEditorUI();
  const { dirty } = useDerived();
  const open = ui.overlay === "versions";

  const rows = [
    { kind: "draft" as const, label: dirty ? "Current draft — unpublished edits" : "Current draft — matches your live site", ts: "now", live: false, snap: null },
    ...s.versions.map((v) => ({
      kind: "published" as const,
      label: v.isLive ? `Live — ${v.summary || "current version"}` : v.summary || "A published version",
      ts: relTime(v.ts),
      live: !!v.isLive,
      snap: v.snap,
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && ui.close()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Version history</DialogTitle>
          <DialogDescription>What your site looked like over time</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-3 scrollbar-thin">
          {rows.map((r, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border-subtle py-3 last:border-0">
              <span className={`mt-1 size-2.5 shrink-0 rounded-full ring-1 ${r.live ? "bg-success ring-success" : r.kind === "draft" ? "bg-brand ring-brand" : "bg-muted-foreground ring-muted-foreground"}`} />
              <div className="flex-1">
                <b className="text-caption">{r.label}</b>
                {r.live && <Badge variant="success" className="ml-1.5">live</Badge>}
                <div className="text-caption text-muted-foreground">{r.ts}</div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {r.kind === "published" && (
                  <Button size="sm" variant="outline" onClick={() => { ui.close(); nav("/website/preview?version=" + i); toast("Opening a preview of this version"); }}>
                    Preview
                  </Button>
                )}
                {r.kind === "published" && !r.live && r.snap && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dispatch({ type: "restoreVersion", snap: r.snap! });
                      ui.close();
                      toast.success("Restored as your draft — publish when you're ready");
                    }}
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Callout tone="info" className="mt-3 text-caption" icon={<Info className="size-4" />}>
            <b>Preview</b> opens that version as visitors would have seen it. <b>Restore</b> brings it back as your draft (your
            current draft is saved first). Nothing goes live until you publish.
          </Callout>
        </div>
      </DialogContent>
    </Dialog>
  );
}
