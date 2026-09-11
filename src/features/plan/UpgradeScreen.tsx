import { useNavigate } from "react-router-dom";
import { Eye, CalendarDays, Sparkles, Check } from "lucide-react";
import { Page, PageHead, PageBody, Field, IconTile, ListContainer, ChoiceRow } from "@/components/common";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import { useDispatch } from "@/store/hooks";
import * as React from "react";

const BENEFITS = [
  { icon: Eye, tint: "green" as const, title: "Show what's actually free", body: "Live bed availability on every property page — the number one reason a good tenant calls." },
  { icon: CalendarDays, tint: "purple" as const, title: "Let people book visits themselves", body: "They pick a slot you've allowed; it appears in Scheduled Visits." },
  { icon: Sparkles, tint: "coral" as const, title: "Make it look like yours", body: "Your logo, colours and fonts, plus extra pages like About and FAQ." },
];

export function UpgradeScreen() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [cycle, setCycle] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <Page>
      <PageHead title="Advanced" description="Everything in Basic, plus three things that make your website earn its keep." />

      <PageBody>
        <ListContainer>
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3 px-4 py-3.5">
              <IconTile icon={<b.icon />} tint={b.tint} />
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{b.title}</div>
                <p className="mt-0.5 text-caption leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </div>
          ))}
        </ListContainer>

        <Field label="Choose a cycle">
          <RadioGroup value={cycle} onValueChange={(v) => setCycle(v as typeof cycle)} className="gap-2">
            <ChoiceRow
              selected={cycle === "monthly"}
              control={<RadioGroupItem value="monthly" className="mt-0.5" />}
              title="Monthly"
              description="₹499 per month · cancel any time"
            />
            <ChoiceRow
              selected={cycle === "yearly"}
              control={<RadioGroupItem value="yearly" className="mt-0.5" />}
              title="Yearly"
              description="₹4,990 per year — that's two months free"
            />
          </RadioGroup>
        </Field>

        <div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              dispatch({ type: "patch", patch: { plan: "advanced", setup: "done" } });
              toast.success("Advanced unlocked — nothing to redo");
              nav("/website/editor");
            }}
          >
            Pay online &amp; unlock now
          </Button>
          <Button variant="ghost" className="mt-2 w-full">
            Bank transfer, or talk to someone
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-caption text-muted-foreground">
            <Check className="size-3.5" /> You'll land straight in the editor with everything on. Nothing to set up again.
          </p>
        </div>
      </PageBody>
    </Page>
  );
}
