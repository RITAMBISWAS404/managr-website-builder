import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilder } from "@/store/BuilderProvider";
import type { BuilderState } from "@/types";

const JUMPS: [string, string][] = [
  ["/website", "Website home"],
  ["/website/editor", "Editor"],
  ["/website/health", "Site health"],
  ["/website/settings", "Website settings"],
  ["/website/availability", "Availability"],
  ["/website/visits", "Visit settings"],
  ["/website/enquiries", "Enquiries"],
  ["/website/bookings", "Booking requests"],
  ["/website/analytics", "Analytics"],
  ["/website/plan", "Plan"],
  ["/website/upgrade", "Upgrade offer"],
  ["/scheduled-visits", "Scheduled Visits"],
  ["/website/preview", "Visitor site"],
];

type Seg = { key: keyof BuilderState; label: string; opts: [string | boolean, string][] };
const SEGS: Seg[] = [
  { key: "plan", label: "Plan", opts: [["basic", "Basic"], ["trial", "Trial"], ["advanced", "Advanced"], ["expiring", "Expiring"], ["payment_failed", "Pay-fail"], ["lapsed", "Lapsed"]] },
  { key: "role", label: "Role", opts: [["owner", "Owner"], ["manager", "Manager"], ["staff", "Staff"]] },
  { key: "conn", label: "Connection", opts: [["online", "Online"], ["offline", "Offline"]] },
  { key: "siteLive", label: "Site", opts: [[true, "Live"], [false, "Offline"]] },
  { key: "setup", label: "Setup stage", opts: [["done", "Done"], ["locked", "Locked"], ["unlocked", "Unlocked"], ["address", "Address"]] },
  { key: "propMode", label: "Published properties", opts: [["none", "None"], ["one", "One"], ["many", "Many"]] },
  { key: "availOn", label: "Availability", opts: [[true, "On"], [false, "Off"]] },
  { key: "availStale", label: "Freshness", opts: [[false, "Fresh"], [true, "Stale"]] },
  { key: "simulatePublishFail", label: "Publish", opts: [[false, "OK"], [true, "Fails"]] },
];

export function DevBar() {
  const [open, setOpen] = React.useState(false);
  const { state, dispatch } = useBuilder();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const inEditor = pathname === "/website/editor";

  return (
    <div
      className={cn("fixed right-2 z-[900]", inEditor ? "bottom-[136px] lg:bottom-3" : "bottom-3")}
    >
      {open && (
        <div className="absolute bottom-12 right-0 max-h-[78vh] w-64 overflow-y-auto rounded-xl bg-[#141414] p-3 text-[#dcdcdc] shadow-pop scrollbar-thin">
          <h5 className="mb-1.5 text-[9.5px] font-bold uppercase tracking-widest text-[#7d7d7d]">Jump to</h5>
          <div className="flex flex-col gap-0.5">
            {JUMPS.map(([to, label]) => (
              <button
                key={to}
                onClick={() => { nav(to); setOpen(false); }}
                className={cn(
                  "rounded-md px-2 py-1.5 text-left text-caption hover:bg-[#262626]",
                  pathname === to && "bg-brand text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {SEGS.map((seg) => (
            <div key={String(seg.key)}>
              <h5 className="mb-1 mt-3 text-[9.5px] font-bold uppercase tracking-widest text-[#7d7d7d]">{seg.label}</h5>
              <div className="flex flex-wrap gap-1">
                {seg.opts.map(([val, label]) => (
                  <button
                    key={label}
                    onClick={() => {
                      const patch: Partial<BuilderState> = { [seg.key]: val } as never;
                      if (seg.key === "plan" && ["advanced", "trial", "expiring", "payment_failed"].includes(String(val)))
                        patch.setup = "done";
                      dispatch({ type: "patch", patch });
                    }}
                    className={cn(
                      "rounded-md bg-[#262626] px-2 py-1 text-[10.5px] hover:bg-[#333]",
                      String(state[seg.key]) === String(val) && "bg-brand text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            className="mt-3 w-full rounded-md bg-[#2a2a2a] p-2 text-caption font-semibold text-white hover:bg-[#333]"
            onClick={() => {
              try { localStorage.removeItem("managr_builder_react_v1"); } catch { /* ignore */ }
              location.href = "/website";
            }}
          >
            Reset prototype
          </button>
          <p className="mt-2 text-[10px] leading-relaxed text-[#6c6c6c]">
            Prototype scaffolding — simulates the ManagR plan / role / data the builder reads. Not part of the product.
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Prototype controls"
        className="grid size-10 place-items-center rounded-full bg-[#141414] text-white opacity-80 shadow-pop hover:opacity-100"
      >
        <FlaskConical className="size-[19px]" />
      </button>
    </div>
  );
}
