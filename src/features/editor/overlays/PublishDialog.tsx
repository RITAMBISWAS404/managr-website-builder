import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/common";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { canPublish, publishChanges, siteUrl } from "@/store/selectors";
import { useEditorUI } from "../EditorContext";

export function PublishDialog() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const ui = useEditorUI();
  const { check, dirty } = useDerived();
  const open = ui.overlay === "publish";

  // reset the machine when closed
  React.useEffect(() => {
    if (!open && s.publishPhase !== "idle") dispatch({ type: "patch", patch: { publishPhase: "idle" } });
  }, [open, s.publishPhase, dispatch]);

  const doPublish = () => {
    dispatch({ type: "publish" });
    setTimeout(() => dispatch({ type: "publishResult", ok: !s.simulatePublishFail }), 600);
  };

  let body: React.ReactNode;
  let footer: React.ReactNode;
  let title = "Publish";

  if (!canPublish(s)) {
    title = "Can't publish";
    body = <p className="text-body text-muted-foreground">Your role ({s.role}) can edit the draft but not publish. Ask an Owner or a Website manager to publish.</p>;
    footer = <Button variant="primary" onClick={ui.close}>OK</Button>;
  } else if (s.publishPhase === "success") {
    title = "Published";
    body = <p className="text-body">Your live site is updated. Bound data (rent, rooms, availability) keeps updating on its own.</p>;
    footer = (
      <>
        <Button variant="outline" onClick={ui.close}>Back to editor</Button>
        <Button variant="primary" onClick={() => { ui.close(); nav("/website/preview"); }}>View live</Button>
      </>
    );
  } else if (!dirty) {
    title = "Nothing to publish";
    body = <p className="text-body text-muted-foreground">Your draft already matches your live site.</p>;
    footer = <Button variant="primary" onClick={ui.close}>OK</Button>;
  } else if (s.publishPhase === "error") {
    title = "Couldn't publish";
    body = (
      <div className="space-y-2">
        <Callout tone="stop" icon={<AlertTriangle className="size-4" />}>
          <b>Network problem.</b> We couldn't reach the publishing service. Your live site is unchanged — nothing was half-published.
        </Callout>
        <p className="text-caption text-muted-foreground">Check your connection and try again. Your draft is safe.</p>
      </div>
    );
    footer = (
      <>
        <Button variant="outline" onClick={ui.close}>Close</Button>
        <Button variant="primary" onClick={doPublish}>Try again</Button>
      </>
    );
  } else if (check.blockers.length) {
    title = `${check.blockers.length} thing${check.blockers.length > 1 ? "s" : ""} to fix before publishing`;
    body = (
      <div className="space-y-2">
        {check.blockers.map((b) => (
          <div key={b.msg} className="flex items-start gap-2 text-caption">
            <AlertTriangle className="mt-0.5 size-4 text-destructive" /> {b.msg}
          </div>
        ))}
        <p className="text-caption text-muted-foreground">Your live site is unchanged while you sort these out.</p>
      </div>
    );
    footer = <Button variant="primary" onClick={ui.close}>OK</Button>;
  } else {
    title = check.warnings.length ? `Ready to publish · ${check.warnings.length} warning${check.warnings.length > 1 ? "s" : ""}` : "Ready to publish";
    body = (
      <div className="space-y-3">
        <p className="text-body">Publishing to <span className="font-mono">{siteUrl(s)}</span> — visitors see this immediately.</p>
        <div className="rounded-lg border border-hair border-border p-2.5">
          <p className="text-caption"><b>Changed:</b> {publishChanges(s)}</p>
          <p className="mt-0.5 flex items-center gap-1 text-caption text-success"><Check className="size-3.5" /> No data changes — rent, rooms and availability always come straight from ManagR.</p>
        </div>
        {check.warnings.length > 0 && (
          <Callout tone="warn" className="text-caption">
            {check.warnings.map((w) => <div key={w.msg}>• {w.msg}</div>)}
          </Callout>
        )}
      </div>
    );
    footer = (
      <>
        <Button variant="outline" onClick={ui.close}>Keep editing</Button>
        <Button variant="primary" onClick={doPublish} disabled={s.publishPhase === "publishing"}>
          {s.publishPhase === "publishing" ? "Publishing…" : check.warnings.length ? "Publish anyway" : "Publish now"}
        </Button>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && ui.close()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <DialogBody>{body}</DialogBody>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
