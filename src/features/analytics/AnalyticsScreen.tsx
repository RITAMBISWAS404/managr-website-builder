import type { ReactNode } from "react";
import { Eye, MessageCircle, PhoneCall, Inbox, CalendarClock, IndianRupee } from "lucide-react";
import { Page, PageHead, PageBody, SectionHeader, MetricCard, SettingsCard, AdvancedLock, Stat, type Tint } from "@/components/common";
import { cn } from "@/lib/utils";
import { useDerived } from "@/store/hooks";

export function AnalyticsScreen() {
  const { advActive } = useDerived();

  const week: { icon: ReactNode; tint: Tint; value: string; label: string }[] = [
    { icon: <Eye />, tint: "blue", value: "8", label: "Website visitors" },
    { icon: <MessageCircle />, tint: "green", value: "3", label: "WhatsApp chats" },
    { icon: <PhoneCall />, tint: "cyan", value: "2", label: "Calls" },
    ...(advActive
      ? [
          { icon: <Inbox />, tint: "amber" as Tint, value: "2", label: "Enquiries" },
          { icon: <CalendarClock />, tint: "purple" as Tint, value: "1", label: "Visit booked" },
        ]
      : []),
  ];

  return (
    <Page size="full">
      <PageHead title="What your website is doing" description="Plain numbers — no charts to read." />

      <PageBody>
        <section>
          <SectionHeader>This week</SectionHeader>
          <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", advActive && "xl:grid-cols-5")}>
            {week.map((m) => (
              <MetricCard key={m.label} icon={m.icon} tint={m.tint} value={m.value} label={m.label} />
            ))}
          </div>
          {!advActive && <p className="mt-2.5 text-caption text-muted-foreground">Enquiries and visits are counted on Advanced.</p>}
        </section>

        <SettingsCard
          icon={<IndianRupee />}
          tint="green"
          title="Roughly what it brought in"
          description="3 move-ins started with a website visit or booking."
        >
          <Stat value="₹1,10,000" label="this month" />
        </SettingsCard>

        {!advActive && (
          <AdvancedLock
            feature="Full analytics"
            what="See exactly which enquiries, visits and bookings came from your website each month."
            basic="you see visitors, calls and WhatsApp taps only."
          />
        )}
      </PageBody>
    </Page>
  );
}
