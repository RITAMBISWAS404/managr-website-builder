import { Link } from "react-router-dom";
import { Lock, Check, Minus, CreditCard } from "lucide-react";
import { Page, PageHead, PageBody, SettingsCard, SectionHeader, Callout } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useS, useDerived } from "@/store/hooks";

const MATRIX: [string, boolean, boolean][] = [
  ["Your web address", true, true],
  ["Property pages, call & WhatsApp", true, true],
  ["Take the site offline", true, true],
  ["Your logo, colours & fonts", false, true],
  ["Rearrange & add sections", false, true],
  ["Extra pages (About / Gallery / FAQ)", false, true],
  ["Enquiry form → CRM", false, true],
  ["Live bed availability", false, true],
  ["Visit booking calendar", false, true],
  ["Booking / move-in requests", false, true],
  ["Show on Google", false, true],
  ["Hide “Powered by ManagR”", false, true],
];

const PLAN_COPY: Record<string, { tone: "ok" | "info" | "warn" | "stop" | "plain"; title: string; body: string }> = {
  advanced: { tone: "ok", title: "Advanced — active", body: "₹499/mo · renews 3 Oct 2026" },
  trial: { tone: "info", title: "Advanced trial — 9 days left", body: "You won't be charged until you choose a plan." },
  expiring: { tone: "info", title: "Advanced — renews in 3 days", body: "₹499/mo · card ending 4242" },
  payment_failed: {
    tone: "warn",
    title: "Advanced — payment failed",
    body: "We'll retry twice more. Advanced pauses on 12 Sep if it doesn't go through. Your site and settings are safe.",
  },
  lapsed: {
    tone: "stop",
    title: "Advanced — ended 3 Sep",
    body: "Site stays live on the Basic look. Availability & visit booking are paused. Your sections, pages, branding and rules are all preserved.",
  },
  basic: { tone: "plain", title: "Basic — Free", body: "Your address, property pages, call & WhatsApp. Always free (for now)." },
};

export function PlanScreen() {
  const s = useS();
  const { canBilling } = useDerived();
  const plan = PLAN_COPY[s.plan];

  return (
    <Page size="full">
      <PageHead title="Plan & billing" description="Basic is free. Advanced turns the site into a working front desk." />

      <PageBody>
        <SettingsCard icon={<CreditCard />} tint="blue" title={plan.title} description={plan.body}>
          {!canBilling && (
            <Callout tone="info" className="text-caption" icon={<Lock className="size-4" />}>
              Your role ({s.role}) can't change billing. Ask an Owner.
            </Callout>
          )}
          {s.plan === "basic" && (
            <Button asChild variant="primary" size="lg" className="w-full">
              <Link to="/website/upgrade">See what Advanced includes</Link>
            </Button>
          )}
        </SettingsCard>

        <section>
          <SectionHeader>What's in each plan</SectionHeader>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-micro font-bold uppercase tracking-[0.07em] text-faint">
                  <th className="px-4 py-2.5 font-bold">Capability</th>
                  <th className="w-20 px-2 py-2.5 text-center font-bold">Basic</th>
                  <th className="w-20 px-2 py-2.5 text-center font-bold">Advanced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {MATRIX.map(([label, b, a]) => (
                  <tr key={label}>
                    <td className="px-4 py-2.5 text-foreground">{label}</td>
                    <td className="px-2 py-2.5 text-center">
                      {b ? <Check className="mx-auto size-4 text-muted-foreground" /> : <Minus className="mx-auto size-4 text-faint" />}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {a ? <Check className="mx-auto size-4 text-success" /> : <Minus className="mx-auto size-4 text-faint" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </PageBody>
    </Page>
  );
}
