import { Check, MessageCircle, Info, CalendarCheck, SlidersHorizontal, ClipboardCheck } from "lucide-react";
import {
  PageHead,
  Page,
  PageBody,
  SettingsCard,
  SectionHeader,
  FieldGroup,
  ToggleField,
  Callout,
  EmptyState,
  AdvancedLock,
} from "@/components/common";
import { Button } from "@/components/ui/button";
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
      <Page size="full">
        <PageHead title="Booking requests" description="Let visitors request a bed from a move-in date." />
        <AdvancedLock
          feature="Move-in requests"
          what="A visitor picks a room type and a date. We check a bed can be free by then, then it waits for you to approve or decline."
          basic="there's no way for a visitor to request a bed — it's all phone and WhatsApp."
        />
      </Page>
    );

  const requests = MOCK_REQUESTS;

  return (
    <Page size="full">
      <PageHead title="Booking requests" description="Move-in requests waiting for your decision." />

      <PageBody>
        <section>
          {requests.length > 0 ? (
            <>
              <SectionHeader>Waiting for you · {requests.length}</SectionHeader>

              {/* said once for the whole queue, not repeated inside every
                  request below — the same rule applies to all of them, so
                  restating it per-row would only add noise as the list
                  grows. */}
              <p className="mb-3 text-caption leading-relaxed text-muted-foreground">
                Approving creates a CRM lead and holds the bed until move-in. Declining notifies the visitor with
                your reason. Either way, the request moves to <span className="text-foreground">Leads &amp; CRM</span>.
              </p>

              {/* one shared surface for the whole queue — a divided flat
                  list, not a stack of independently bordered/shadowed
                  cards, so it stays calm whether there's 1 request or 5.
                  Each row carries only what's needed to decide: identity,
                  the booking's own facts, a quiet bed-readiness
                  confirmation, and the three actions — no separate status
                  badge, since every row here is already "awaiting" by
                  definition of the section it's in. */}
              <div className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border bg-surface shadow-e1">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="truncate text-section font-bold text-foreground">{req.name}</div>
                      <div className="text-caption text-muted-foreground">
                        {req.detail} · move-in <b className="whitespace-nowrap text-foreground">{req.moveIn}</b>
                      </div>
                      <div className="flex items-center gap-1.5 text-caption font-medium text-success">
                        <CalendarCheck className="size-3.5 shrink-0" />
                        Bed ready by {req.moveIn}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:w-[260px] sm:shrink-0">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => toast.success(`Approved ${req.name} — lead created, bed held until move-in`)}
                      >
                        <Check /> Approve &amp; hold the bed
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => toast(`Opening a message to ${req.name}`)}
                        >
                          <MessageCircle /> Message
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex-1">
                              Decline
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Decline {req.name}'s request?</AlertDialogTitle>
                              <AlertDialogDescription>
                                The visitor is notified with your reason and the request moves to Leads &amp; CRM.
                                This can't be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep it open</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:brightness-90"
                                onClick={() => toast(`Declined ${req.name}'s request — they're notified with your reason`)}
                              >
                                Decline request
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState icon={<ClipboardCheck />} title="No requests waiting" className="py-8">
              New move-in requests will appear here for you to approve or decline.
            </EmptyState>
          )}
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

        {/* full-width card, capped reading width for the prose only. "info"
            tone — same as every other page's closing explainer callout;
            this is a roadmap note for all Bookings users, not a plan-tier
            distinction, so it doesn't borrow the Advanced-tier's purple. */}
        <Callout tone="info" icon={<Info className="size-4" />}>
          <span className="block max-w-[760px]">
            <b>No payment yet.</b> The flow is: request → you approve →{" "}
            <span className="text-muted-foreground">[payment step, later]</span> → confirmation. Adding payment won't change
            anything else.
          </span>
        </Callout>
      </PageBody>
    </Page>
  );
}
