import * as React from "react";
import { Copy, Info, Search, Inbox } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  ToggleField,
  FilterBar,
  ListContainer,
  Segmented,
  IconTile,
  EmptyState,
  AdvancedLock,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
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
      <Page size="full">
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
  const contactedCount = all.filter((r) => r.status === "Contacted").length;
  const filtered = all.filter(
    (r) =>
      (tab === "all" || r.status.toLowerCase() === tab) &&
      (q === "" || `${r.name} ${r.detail}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Page size="full">
      <PageHead title="Enquiries" description="Leads that came from your website — manage them here or in your CRM." />

      <PageBody>
        {/* a compact action card, not a documentation callout — the same
            architecture as Website Home's "You have changes to publish"
            (icon + title + one concise line, action trailing), just without
            its brand-ring emphasis: this is routine information, not
            something that needs attention. Doesn't depend on how many
            enquiries there are, so it no longer needs a separate empty-state
            branch. */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-e1 sm:flex-row sm:items-center sm:gap-4 sm:p-6">
          <IconTile icon={<Info />} tint="blue" size="lg" className="shadow-xs" />
          <div className="min-w-0 flex-1">
            <div className="text-section font-semibold text-foreground">Where enquiries go</div>
            <p className="mt-0.5 text-body text-muted-foreground">
              Every enquiry becomes a lead in <span className="text-foreground">Leads &amp; CRM</span>, tagged
              “Website”.
            </p>
          </div>
          <Button variant="outline" className="w-full shrink-0 sm:w-auto">
            Open Leads &amp; CRM
          </Button>
        </div>

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
              <Segmented
                value={tab}
                onChange={setTab}
                options={[
                  { value: "all", label: <FilterLabel text="All" count={all.length} active={tab === "all"} /> },
                  { value: "new", label: <FilterLabel text="New" count={newCount} active={tab === "new"} /> },
                  { value: "contacted", label: <FilterLabel text="Contacted" count={contactedCount} active={tab === "contacted"} /> },
                ]}
              />
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
                      <col className="w-[22%]" />
                      <col />
                      <col className="w-[128px]" />
                      <col className="w-[120px]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-border-subtle text-micro font-bold uppercase tracking-[0.07em] text-faint">
                        <th className="px-4 py-3 font-bold">Name</th>
                        <th className="px-4 py-3 font-bold">Looking for</th>
                        <th className="px-4 py-3 font-bold">Received</th>
                        <th className="px-4 py-3 text-right font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filtered.map((r) => (
                        <tr key={r.id} className="transition-colors hover:bg-surface-2">
                          <td className="px-4 py-3.5 font-semibold text-foreground">{r.name}</td>
                          <td className="px-4 py-3.5 text-muted-foreground">{r.detail}</td>
                          <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{r.when}</td>
                          <td className="px-4 py-3.5 text-right">
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
                        <div className="mt-1 text-caption tabular-nums text-muted-foreground">{r.when}</div>
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
          {/* the three form fields are one group of peer choices — a 3-up
              grid reads faster than three stacked full-width rows and uses
              the canvas the fields themselves actually need, no more. */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            {["Looking for (sharing type)", "Move-in date", "Budget"].map((l) => (
              <label
                key={l}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3.5 py-3 transition-colors has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-tint-coral"
              >
                <span className="text-sm font-medium text-foreground">{l}</span>
                <Checkbox defaultChecked />
              </label>
            ))}
          </div>

          {/* a different setting — mobile display behaviour, not a form
              field — set apart with a rule so it doesn't read as a fourth
              peer of the group above. */}
          <div className="border-t border-border-subtle pt-4">
            <ToggleField
              label="Floating “Enquire” button on mobile"
              description="Follows the visitor as they scroll."
              control={<Switch defaultChecked />}
            />
          </div>
        </SettingsCard>
      </PageBody>
    </Page>
  );
}

/** a segmented-control option label with its count set in plain, softer
    type right beside it — no pill, no extra container, just a quieter,
    slightly smaller number so it reads as part of the label. */
function FilterLabel({ text, count, active }: { text: string; count: number; active: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      {text}
      <span className={cn("text-caption tabular-nums", active ? "text-muted-foreground" : "text-faint")}>{count}</span>
    </span>
  );
}
