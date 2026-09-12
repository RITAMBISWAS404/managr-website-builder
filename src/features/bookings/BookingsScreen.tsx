import { Check, MessageCircle, Info, CalendarCheck, SlidersHorizontal } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  SectionHeader,
  FieldGroup,
  ToggleField,
  Callout,
  AdvancedLock,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { useDerived } from "@/store/hooks";
import { MOCK_REQUESTS } from "@/data/managr";

export function BookingsScreen() {
  const { advActive } = useDerived();

  if (!advActive)
    return (
      <Page>
        <PageHead title="Booking requests" description="Let visitors request a bed from a move-in date." />
        <AdvancedLock
          feature="Move-in requests"
          what="A visitor picks a room type and a date. We check a bed can be free by then, then it waits for you to approve or decline."
          basic="there's no way for a visitor to request a bed — it's all phone and WhatsApp."
        />
      </Page>
    );

  const req = MOCK_REQUESTS[0];

  return (
    <Page>
      <PageHead title="Booking requests" description="Move-in requests waiting for your decision." />

      <PageBody>
        <section>
          <SectionHeader>Waiting for you · 1</SectionHeader>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-e1">
            <div className="flex items-start justify-between gap-3 border-b border-border-subtle p-4 sm:p-5">
              <div className="min-w-0">
                <div className="text-section font-bold text-foreground">{req.name}</div>
                <div className="mt-0.5 text-caption text-muted-foreground">
                  {req.detail} · move-in <b className="whitespace-nowrap text-foreground">{req.moveIn}</b>
                </div>
              </div>
              <Badge variant="warning">{req.status}</Badge>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <div className="inline-flex items-center gap-2 rounded-lg bg-success-surface px-3 py-2 text-caption font-medium text-success">
                <CalendarCheck className="size-4 shrink-0" />
                A bed can be ready by {req.moveIn}.
              </div>
              <p className="max-w-[60ch] text-caption text-muted-foreground">
                Approving creates a CRM lead and holds the bed for {req.name} until move-in. Declining notifies the
                visitor with your reason.
              </p>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  variant="primary"
                  onClick={() => toast.success("Approved — lead created, bed held until move-in")}
                >
                  <Check /> Approve &amp; hold the bed
                </Button>
                <Button variant="outline" onClick={() => toast("Opening a message to the visitor")}>
                  <MessageCircle /> Message first
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Decline</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Decline {req.name}'s request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        The visitor is notified with your reason and the request moves to Leads &amp; CRM. This can't be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep it open</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:brightness-90"
                        onClick={() => toast("Declined — the visitor is notified with your reason")}
                      >
                        Decline request
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          <p className="mt-3 px-1 text-caption text-muted-foreground">
            That's the only open request. Approved and declined requests move to{" "}
            <span className="text-foreground">Leads &amp; CRM</span>.
          </p>
        </section>

        <SettingsCard
          icon={<SlidersHorizontal />}
          tint="cyan"
          title="Rules"
          description="How requests are collected and answered."
        >
          <FieldGroup>
            <ToggleField
              label="Let visitors request a bed from property pages"
              control={<Switch defaultChecked />}
            />
            <ToggleField
              label="Offer the next free date when a date can't be met"
              description="Instead of just saying “no”."
              control={<Switch defaultChecked />}
            />
          </FieldGroup>
        </SettingsCard>

        <Callout tone="advanced" icon={<Info className="size-4" />}>
          <b>No payment yet.</b> The flow is: request → you approve →{" "}
          <span className="text-muted-foreground">[payment step, later]</span> → confirmation. Adding payment won't change
          anything else.
        </Callout>
      </PageBody>
    </Page>
  );
}
