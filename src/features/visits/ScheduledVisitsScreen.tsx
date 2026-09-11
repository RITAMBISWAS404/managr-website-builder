import { Plus, Globe } from "lucide-react";
import { GroupLabel, Callout, Placeholder } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LEGEND: [string, "warning" | "success" | "destructive"][] = [
  ["Pending", "warning"], ["Confirmed", "success"], ["Visited", "success"],
  ["Rescheduled", "warning"], ["Cancelled", "destructive"], ["No-show", "destructive"],
];

const ROWS = [
  { name: "Ankit · Double sharing", when: "Thu 11 Sep · 5:00 PM · Shree Residency · in person", source: "Website", status: "Confirmed", tone: "success" },
  { name: "Meena (parent)", when: "Fri 12 Sep · 11:00 AM · Green Nest PG", source: "Phone", status: "Pending", tone: "warning" },
  { name: "Sameer", when: "Sat 13 Sep · 10:00 AM · Shree Residency · video call", source: "Website", status: "Rescheduled", tone: "warning" },
] as const;

export function ScheduledVisitsScreen() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-title font-bold">Scheduled Visits</h1>
        <Button variant="outline" size="sm"><Plus /> Add visit</Button>
      </div>

      <Callout tone="info" title="Statuses simplified">
        Was 11 colours — now 6 that each mean one real thing.
        <div className="mt-2 flex flex-wrap gap-2">
          {LEGEND.map(([label, tone]) => (
            <Badge key={label} variant={tone}>{label}</Badge>
          ))}
        </div>
      </Callout>

      <Placeholder className="my-4 min-h-[120px]">Month calendar — visits coloured by status</Placeholder>

      <div className="overflow-hidden rounded-xl border border-hair border-border bg-card">
        {ROWS.map((r) => (
          <div key={r.name} className="flex items-center gap-3 border-b border-border-subtle px-3 py-3 last:border-0">
            <span className="flex-1">
              <b>{r.name}</b>
              <span className="block text-caption text-muted-foreground">{r.when}</span>
            </span>
            <Badge variant={r.source === "Website" ? "success" : "neutral"}>
              {r.source === "Website" && <Globe />} {r.source}
            </Badge>
            <Badge variant={r.tone as never}>{r.status}</Badge>
          </div>
        ))}
      </div>

      <p className="mt-3 text-body text-muted-foreground">
        The <Badge variant="success"><Globe /> Website</Badge> tag shows which visits your site brought in — visible in month, week and list views.
      </p>
    </>
  );
}
