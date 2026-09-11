import { Info, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout, EmptyState } from "@/components/common";
import { toast } from "@/components/ui/sonner";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { useEditorUI } from "../EditorContext";

export function ResponsiveSheet() {
  const s = useS();
  const dispatch = useDispatch();
  const ui = useEditorUI();
  const { respIssues } = useDerived();
  const open = ui.overlay === "responsive";
  void s;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && ui.close()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Phone &amp; tablet check</DialogTitle>
          <DialogDescription>Scans your draft for layout problems on smaller screens</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto px-5 py-4 scrollbar-thin">
          {respIssues.length === 0 ? (
            <EmptyState title="Looks good"><Check className="mr-1 inline size-3.5 text-success" />No responsive problems found on this page.</EmptyState>
          ) : (
            respIssues.map((i) => (
              <div key={i.msg} className="rounded-xl border border-border-subtle bg-surface-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <b className="text-caption">{i.msg}</b>
                  <Badge variant="warning">{i.bp}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {i.fix && (
                    <Button size="sm" variant="primary" onClick={() => { dispatch({ type: "dismissCheck", msg: i.msg }); toast.success(`Fixed — ${i.fix!.toLowerCase()}`); }}>
                      {i.fix}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => dispatch({ type: "dismissCheck", msg: i.msg })}>Dismiss</Button>
                </div>
              </div>
            ))
          )}
          <Callout tone="info" className="text-caption" icon={<Info className="size-4" />}>
            Editing on Tablet or Mobile makes an override just for that size. Desktop stays the base; smaller screens inherit it unless you change something.
          </Callout>
        </div>
      </DialogContent>
    </Dialog>
  );
}
