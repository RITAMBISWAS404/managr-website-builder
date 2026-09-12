import { Plus, Globe, Info } from "lucide-react";
import { Page, PageHead, PageBody, Callout, ListContainer, Placeholder } from "@/components/common";
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
    // reached directly from the main sidebar, not nested under Website — no
    // back control, since there's no page above it to return to.
    <Page size="full">
      <PageHead
        title="Scheduled Visits"
        back={null}
        actions={
          <Button variant="outline" size="sm">
            <Plus /> Add visit
          </Button>
        }
      />

      <PageBody>
        <Callout tone="info" icon={<Info className="size-4" />} title="Statuses simplified">
          Was 11 colours — now 6 that each mean one real thing.
          <div className="mt-2 flex flex-wrap gap-2">
            {LEGEND.map(([label, tone]) => (
              <Badge key={label} variant={tone}>{label}</Badge>
            ))}
          </div>
        </Callout>

        <Placeholder className="min-h-[120px]">Month calendar — visits coloured by status</Placeholder>

        <ListContainer>
          {ROWS.map((r) => (
            <div key={r.name} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{r.name}</span>
                <span className="block text-caption text-muted-foreground">{r.when}</span>
              </span>
              <Badge variant={r.source === "Website" ? "success" : "neutral"}>
                {r.source === "Website" && <Globe />} {r.source}
              </Badge>
              <Badge variant={r.tone as never}>{r.status}</Badge>
            </div>
          ))}
        </ListContainer>

        <Callout tone="info" icon={<Info className="size-4" />}>
          The <Badge variant="success"><Globe /> Website</Badge> tag shows which visits your site brought in — visible in
          month, week and list views.
        </Callout>
      </PageBody>
    </Page>
  );
}
