import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Info, Check, ShieldCheck, ChevronRight } from "lucide-react";
import { Page, PageHead, PageBody, SettingsCard, ListContainer, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useS, useDispatch, useDerived } from "@/store/hooks";
import { ownerInfo } from "@/store/selectors";

const JUMP: Record<string, string> = {
  home: "/website",
  settings: "/website/settings",
  properties: "/website/editor",
  hero: "/website/editor",
  header: "/website/editor",
  plan: "/website/plan",
  availability: "/website/availability",
  responsive: "/website/editor",
};

export function HealthScreen() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { check, publicProperties } = useDerived();

  const good = [
    publicProperties.length ? `${publicProperties.length} approved propert${publicProperties.length > 1 ? "ies" : "y"} showing publicly` : null,
    publicProperties.some((p) => p.photos) ? "Property photos are available" : null,
    ownerInfo(s, "phone") ? "Visitors can reach you by phone" : null,
    s.slug ? "Your web address is claimed" : null,
  ].filter(Boolean) as string[];

  const verdict: { status: "action" | "attention" | "ok"; label: string } = check.blockers.length
    ? { status: "action", label: `${check.blockers.length} thing${check.blockers.length > 1 ? "s" : ""} to fix before publishing` }
    : check.warnings.length
      ? { status: "attention", label: `Ready to publish — ${check.warnings.length} optional improvement${check.warnings.length > 1 ? "s" : ""}` }
      : { status: "ok", label: "Ready to publish" };

  return (
    <Page size="full">
      <PageHead
        title="Website health"
        description="The same check runs automatically before every publish."
        actions={<StatusBadge pill status={verdict.status}>{verdict.label}</StatusBadge>}
      />

      <PageBody>
        {check.blockers.length > 0 && (
          <SettingsCard
            icon={<AlertTriangle />}
            tint="coral"
            title="Fix these first"
            description="Publishing is blocked until these are resolved."
          >
            <ListContainer>
              {check.blockers.map((b) => (
                <div key={b.msg} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0 text-body text-foreground">{b.msg}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => nav(JUMP[b.where] ?? "/website/editor")}
                  >
                    Go fix this <ChevronRight />
                  </Button>
                </div>
              ))}
            </ListContainer>
          </SettingsCard>
        )}

        {check.warnings.length > 0 && (
          <SettingsCard
            icon={<Info />}
            tint="amber"
            title="Worth a look"
            description="The site works fine without these — they're optional improvements."
          >
            <ListContainer>
              {check.warnings.map((w) => (
                <div key={w.msg} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0 text-body text-foreground">{w.msg}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => nav(JUMP[w.where] ?? "/website/editor")}>
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => dispatch({ type: "dismissCheck", msg: w.msg })}
                    >
                      Dismiss
                    </Button>
                  </span>
                </div>
              ))}
            </ListContainer>
          </SettingsCard>
        )}

        <SettingsCard icon={<ShieldCheck />} tint="green" title="Working well" description="Confirmed by the same check that runs before publish.">
          <ListContainer>
            {good.map((g) => (
              <div key={g} className="flex items-center gap-3 px-4 py-3">
                <Check className="size-4 shrink-0 text-success" />
                <span className="text-body text-foreground">{g}</span>
              </div>
            ))}
          </ListContainer>
          {s.dismissedChecks.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => dispatch({ type: "restoreChecks" })}>
              Show {s.dismissedChecks.length} dismissed item{s.dismissedChecks.length > 1 ? "s" : ""} again
            </Button>
          )}
        </SettingsCard>
      </PageBody>
    </Page>
  );
}
