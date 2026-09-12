import * as React from "react";
import { Globe, Copy, Info, Search, Inbox, MailPlus } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  FieldGroup,
  ToggleField,
  FilterBar,
  ListContainer,
  MetricCard,
  Callout,
  EmptyState,
  AdvancedLock,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { useS, useDerived } from "@/store/hooks";
import { MOCK_ENQUIRIES } from "@/data/managr";

const STATUS_BADGE: Record<string, "info" | "neutral"> = { New: "info", Contacted: "neutral" };

export function EnquiriesScreen() {
  const s = useS();
  const { advActive, url } = useDerived();
  const [tab, setTab] = React.useState("all");
  const [q, setQ] = React.useState("");

  if (!advActive)
    return (
      <Page>
        <PageHead title="Enquiries" description="Turn website visitors into leads in your CRM." />
        <AdvancedLock
          feature="Enquiry form"
          what="A short form — name, phone, budget, move-in — that drops straight into Leads & CRM tagged “Website”. These leads cost you nothing."
          basic="visitors can only call or WhatsApp you."
        />
      </Page>
    );

  const all = s.propMode === "none" ? [] : MOCK_ENQUIRIES;
  const newCount = all.filter((r) => r.status === "New").length;
  const filtered = all.filter(
    (r) =>
      (tab === "all" || r.status.toLowerCase() === tab) &&
      (q === "" || `${r.name} ${r.detail}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Page size="full">
      <PageHead title="Enquiries" description="Leads that came from your website — manage them here or in your CRM." />

      <PageBody>
        {all.length > 0 && (
          <div className="grid max-w-[640px] grid-cols-2 gap-3">
            <MetricCard tint="amber" icon={<Inbox />} value={all.length} label="Total enquiries" />
            <MetricCard tint="blue" icon={<MailPlus />} value={newCount} label="New — not yet contacted" />
          </div>
        )}

        <Callout tone="info" title="Where enquiries go" className="max-w-[640px]">
          Every one becomes a lead in <b>Leads &amp; CRM</b>, tagged{" "}
          <Badge variant="success">
            <Globe /> Website
          </Badge>{" "}
          so it stands out from marketplace leads — and it cost you nothing.
          <div className="mt-2">
            <Button variant="outline" size="sm">
              Open Leads &amp; CRM
            </Button>
          </div>
        </Callout>

        {all.length === 0 ? (
          <EmptyState
            icon={<Inbox />}
            title="No enquiries yet"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(`https://${url}`);
                  toast.success("Link copied");
                }}
              >
                <Copy /> Copy your link to share
              </Button>
            }
          >
            New website enquiries will appear here and in your CRM.
          </EmptyState>
        ) : (
          <section className="space-y-3">
            <FilterBar className="justify-between">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="contacted">Contacted</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full sm:w-56">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint"
                />
                <Input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search enquiries by name or detail"
                  placeholder="Search name or detail"
                  autoComplete="off"
                  spellCheck={false}
                  className="pl-8"
                />
              </div>
            </FilterBar>

            <p aria-live="polite" className="sr-only">
              {filtered.length} {filtered.length === 1 ? "enquiry" : "enquiries"} shown
            </p>

            {filtered.length === 0 ? (
              <EmptyState icon={<Search />} title="No matching enquiries" className="py-7">
                Try a different search or status.
              </EmptyState>
            ) : (
              <>
                {/* desktop table */}
                <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface md:block">
                  <table className="w-full text-left text-sm">
                    <colgroup>
                      <col className="w-[26%]" />
                      <col />
                      <col className="w-[124px]" />
                      <col className="w-[116px]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-border-subtle text-micro font-bold uppercase tracking-[0.06em] text-faint">
                        <th className="px-4 py-2.5 font-bold">Name</th>
                        <th className="px-4 py-2.5 font-bold">Looking for</th>
                        <th className="px-4 py-2.5 font-bold">Received</th>
                        <th className="px-4 py-2.5 text-right font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filtered.map((r) => (
                        <tr key={r.id} className="transition-colors hover:bg-surface-2">
                          <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.detail}</td>
                          <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.when}</td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant={STATUS_BADGE[r.status] ?? "neutral"}>{r.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* mobile cards */}
                <ListContainer className="md:hidden">
                  {filtered.map((r) => (
                    <div key={r.id} className="flex items-start justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground">{r.name}</div>
                        <div className="mt-0.5 text-caption text-muted-foreground">{r.detail}</div>
                        <div className="mt-1 text-caption tabular-nums text-faint">{r.when}</div>
                      </div>
                      <Badge variant={STATUS_BADGE[r.status] ?? "neutral"}>{r.status}</Badge>
                    </div>
                  ))}
                </ListContainer>
              </>
            )}
          </section>
        )}

        <SettingsCard
          icon={<Info />}
          tint="amber"
          title="What the form asks for"
          description="Name and phone are always asked. Choose the rest."
          footer={
            <span className="flex items-center gap-1.5">
              <Info className="size-3.5 shrink-0" />
              You can also drop an inline form into About, Contact or a Rich-text section from the editor.
            </span>
          }
        >
          <FieldGroup>
            {["Looking for (sharing type)", "Move-in date", "Budget"].map((l) => (
              <ToggleField key={l} label={l} control={<Checkbox defaultChecked />} />
            ))}
            <ToggleField
              label="Floating “Enquire” button on mobile"
              description="Follows the visitor as they scroll."
              control={<Switch defaultChecked />}
            />
          </FieldGroup>
        </SettingsCard>
      </PageBody>
    </Page>
  );
}
