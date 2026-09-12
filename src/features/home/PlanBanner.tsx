import { Link } from "react-router-dom";
import { Sparkles, Clock, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useS } from "@/store/hooks";

export function PlanBanner() {
  const s = useS();
  const map = {
    trial: { tone: "info", icon: <Sparkles />, text: <><b>Advanced trial</b> — 9 days left. All features on.</>, cta: ["Keep Advanced", "/website/plan"] },
    expiring: { tone: "info", icon: <Clock />, text: <>Advanced renews in <b>3 days</b>.</>, cta: ["Manage", "/website/plan"] },
    payment_failed: { tone: "warn", icon: <AlertTriangle />, text: <><b>We couldn't take payment.</b> Advanced pauses in 5 days. Your site keeps working until then.</>, cta: ["Update payment", "/website/plan"] },
    lapsed: { tone: "stop", icon: <Info />, text: <><b>Advanced ended.</b> Your site is still live on the Basic look. Availability &amp; visit booking are paused. Nothing was deleted.</>, cta: ["Reactivate", "/website/upgrade"] },
  } as const;
  const cfg = (map as Record<string, (typeof map)[keyof typeof map]>)[s.plan];
  if (!cfg) return null;

  const tone = {
    info: "border-info-border bg-info-surface",
    warn: "border-warning-border bg-warning-surface",
    stop: "border-destructive-border bg-destructive-surface",
  }[cfg.tone];

  return (
    <div className={cn("flex flex-wrap items-center gap-3 rounded-lg border border-hair px-4 py-3 text-body", tone)}>
      <span className="[&_svg]:size-4 [&_svg]:shrink-0">{cfg.icon}</span>
      <span className="min-w-[12rem] flex-1">{cfg.text}</span>
      <Button asChild size="sm" variant="outline">
        <Link to={cfg.cta[1]}>{cfg.cta[0]}</Link>
      </Button>
    </div>
  );
}
