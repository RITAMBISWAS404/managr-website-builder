import * as React from "react";
import { useNavigate } from "react-router-dom";
import { X, Phone, MessageCircle, ShieldCheck, Check, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Callout } from "@/components/common";
import { useS, useDerived } from "@/store/hooks";
import { ownerInfo, staleProp, advActive } from "@/store/selectors";
import { OWNER } from "@/data/managr";
import type { Property } from "@/types";

type Route =
  | { name: "home" }
  | { name: "detail"; prop: string }
  | { name: "enquiry" }
  | { name: "visit"; step: number }
  | { name: "visit-done" }
  | { name: "request" }
  | { name: "request-done" };

export function VisitorSite() {
  const s = useS();
  const nav = useNavigate();
  const { url, publicProperties } = useDerived();
  const [route, setRoute] = React.useState<Route>({ name: "home" });
  const isVersion = new URLSearchParams(location.search).has("version");

  const goHome = () => setRoute({ name: "home" });
  const openProp = (id: string) => setRoute({ name: "detail", prop: id });

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <div className="flex items-center gap-2 bg-navy px-3 py-2 text-[11.5px] text-white/80">
        <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10" aria-label="Close" onClick={() => nav(-1)}><X /></Button>
        <span className="flex-1 truncate font-mono opacity-70">{url}</span>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium tracking-wide">{isVersion ? "PREVIEW · older version" : "PREVIEW · test mode"}</span>
      </div>

      <div className="flex-1 overflow-y-auto bg-workspace">
        <div className="mx-auto min-h-full max-w-[430px] bg-white shadow-frame">
          {route.name === "home" && <VHome s={s} props={publicProperties} onOpen={openProp} />}
          {route.name === "detail" && (
            <VDetail
              s={s}
              prop={publicProperties.find((p) => p.id === route.prop) ?? publicProperties[0]}
              onBack={goHome}
              onBook={() => setRoute({ name: "visit", step: 0 })}
              onRequest={() => setRoute({ name: "request" })}
              onEnquire={() => setRoute({ name: "enquiry" })}
            />
          )}
          {route.name === "enquiry" && <VEnquiry onBack={goHome} />}
          {route.name === "visit" && <VVisit step={route.step} setStep={(step) => setRoute({ name: "visit", step })} onDone={() => setRoute({ name: "visit-done" })} onBack={goHome} />}
          {route.name === "visit-done" && <VDone title="Visit booked" body="Fri 14 Sep · 5:00 PM · Shree Residency" onHome={goHome} />}
          {route.name === "request" && <VRequest s={s} onSend={() => setRoute({ name: "request-done" })} onBack={goHome} />}
          {route.name === "request-done" && <VDone title="Request sent" body={`Waiting for ${OWNER.biz} to confirm. They usually respond within a day.`} onHome={goHome} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */
function Top() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-white/95 px-4 py-3 backdrop-blur">
      <b className="text-[15px] tracking-tight">{OWNER.biz}</b>
      <span className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white"><Phone className="size-3" /> Call</span>
    </div>
  );
}
function Sec({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-border-subtle p-4">{children}</div>;
}

function VHome({ s, props, onOpen }: { s: ReturnType<typeof useS>; props: Property[]; onOpen: (id: string) => void }) {
  if (!s.siteLive)
    return (
      <>
        <Top />
        <Sec>
          <div className="ph min-h-[56px]">—</div>
          <h3 className="mt-3 font-bold">Temporarily unavailable</h3>
          <p className="text-caption text-muted-foreground">This website is offline right now. Please check back soon.</p>
        </Sec>
      </>
    );
  if (!props.length)
    return (
      <>
        <Top />
        <Sec>
          <h3 className="font-bold">New listings coming soon</h3>
          <p className="text-caption text-muted-foreground">Call us in the meantime.</p>
          <span className="mt-2 inline-block rounded-md bg-brand px-3 py-1 text-[10px] font-bold text-white"><Phone className="mr-1 inline size-3" />Call</span>
        </Sec>
      </>
    );
  return (
    <>
      <Top />
      <Sec>
        <div className="text-[19px] font-extrabold leading-tight">{ownerInfo(s, "headline")}</div>
        <p className="my-2 text-caption text-muted-foreground">{ownerInfo(s, "about")}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success px-2.5 py-0.5 text-[11px] font-bold text-success">
          <ShieldCheck className="size-3" /> Direct from owner · No brokerage
        </span>
      </Sec>
      <Sec>
        <div className="mb-3 text-[15px] font-extrabold">Our properties</div>
        {props.map((p) => {
          const total = p.rooms.reduce((a, r) => a + r.freeNow, 0);
          const av =
            s.availOn && advActive(s) && !staleProp(s, p) && s.availLevel === "property"
              ? total
                ? <div className="mt-1 text-[10px] font-bold text-success">{s.availNumbers === "vague" ? "Available now" : `${total} beds available`}</div>
                : <div className="mt-1 text-[10px] font-bold text-warning">Full{s.availFromDate ? " — from 15 Sep" : ""}</div>
              : null;
          return (
            <button key={p.id} onClick={() => onOpen(p.id)} className="mb-3 block w-full overflow-hidden rounded-xl border border-hair text-left transition-shadow hover:shadow-e1">
              <div className="ph min-h-[128px] rounded-none border-0 text-[10px] font-medium lowercase tracking-normal">{p.photos ? "photo" : "photo coming soon"}</div>
              <div className="p-3.5">
                <b className="text-[15px] tracking-tight">{p.name}</b>
                <div className="text-caption text-muted-foreground">{p.area} · approximate</div>
                <div className="mt-1 font-extrabold">{p.from} <span className="text-caption font-medium text-muted-foreground">/mo onwards</span></div>
                {av}
              </div>
            </button>
          );
        })}
        {s.availOn && advActive(s) && <p className="mt-1.5 text-caption text-success"><Check className="mr-1 inline size-3.5" />Availability updated today</p>}
      </Sec>
      <ContactBlock s={s} />
    </>
  );
}

function VDetail({
  s, prop, onBack, onBook, onRequest, onEnquire,
}: {
  s: ReturnType<typeof useS>;
  prop: Property;
  onBack: () => void;
  onBook: () => void;
  onRequest: () => void;
  onEnquire: () => void;
}) {
  const lvl = s.availOn && advActive(s) && !staleProp(s, prop) ? s.availLevel : null;
  return (
    <>
      <Top />
      <Sec>
        <button onClick={onBack} className="mb-2 text-caption text-brand">← All properties</button>
        <div className="ph min-h-[120px]">PHOTO GALLERY</div>
        <div className="mt-2 text-[19px] font-extrabold">{prop.name}</div>
        <div className="text-caption text-muted-foreground">{prop.area} · approximate location</div>
      </Sec>
      {lvl === "property" && (
        <Sec>
          <Callout tone={prop.rooms.some((r) => r.freeNow) ? "ok" : "warn"}>
            <b>{prop.rooms.some((r) => r.freeNow) ? `${prop.rooms.reduce((a, r) => a + r.freeNow, 0)} beds available now` : "Fully booked — next free 15 Sep"}</b>
            <div className="text-caption">Availability updated today</div>
          </Callout>
        </Sec>
      )}
      <Sec>
        <div className="mb-3 text-[15px] font-extrabold">Room types</div>
        {prop.rooms.map((r) => (
          <div key={r.id} className="mb-2 rounded-lg border border-hair p-3">
            <div className="flex items-center justify-between">
              <div><b>{r.label}</b><div className="text-caption text-muted-foreground">{r.rent} · deposit {r.deposit}</div></div>
              {lvl === "roomtype" &&
                (r.freeNow ? (
                  <span className="rounded-full border border-success-border bg-success-surface px-2 py-0.5 text-[11px] font-semibold text-success">
                    {s.availNumbers === "vague" ? "Available" : `${r.freeNow} bed${r.freeNow > 1 ? "s" : ""} now`}
                  </span>
                ) : (
                  <span className="rounded-full border border-warning-border bg-warning-surface px-2 py-0.5 text-[11px] font-semibold text-warning">
                    Full — next free {r.freeFrom ?? "—"}
                  </span>
                ))}
            </div>
            {lvl === "bed" && (
              <>
                <div className="mt-2 grid max-w-[210px] grid-cols-4 gap-1.5">
                  {prop.beds.slice(0, 8).map((b, i) => (
                    <div key={i} className={cn("grid aspect-square place-items-center rounded text-[9px] font-bold", b ? "border border-success-border bg-success-surface text-success" : "bg-secondary text-muted-foreground")}>
                      {b ? "Free" : "•"}
                    </div>
                  ))}
                </div>
                <div className="mt-1 text-caption text-muted-foreground">No names, ever. Blocked beds show as unavailable with no reason.</div>
              </>
            )}
          </div>
        ))}
      </Sec>
      <Sec>
        <div className="mb-2 text-[15px] font-extrabold">Location</div>
        <div className="ph min-h-[90px]">MAP — APPROXIMATE AREA ONLY</div>
        <div className="mt-1 text-caption text-muted-foreground">The exact address is shared when you contact the owner.</div>
      </Sec>
      {advActive(s) && (
        <Sec>
          <div className="space-y-2">
            <Button variant="primary" className="w-full" onClick={onBook}>Book a visit</Button>
            <Button variant="outline" className="w-full" onClick={onRequest}>Request this room</Button>
            <Button variant="ghost" className="w-full" onClick={onEnquire}>Send an enquiry</Button>
          </div>
        </Sec>
      )}
      <div className="sticky bottom-0 flex gap-2 border-t border-border-subtle bg-white p-2 [&>*]:flex-1">
        <Button variant="primary"><Phone /> Call owner</Button>
        <Button variant="outline"><MessageCircle /> WhatsApp</Button>
      </div>
    </>
  );
}

function ContactBlock({ s }: { s: ReturnType<typeof useS> }) {
  return (
    <Sec>
      <div className="mb-2 text-[15px] font-extrabold">Contact</div>
      <div className="text-caption"><Phone className="mr-1 inline size-3.5" />{ownerInfo(s, "phone")} &nbsp; <MessageCircle className="mr-1 inline size-3.5" />WhatsApp</div>
      <div className="mt-1 text-caption text-muted-foreground">{OWNER.area.split(",")[0]} area (approximate)</div>
      {(s.globals.footer.powered || !advActive(s)) && <div className="mt-2 text-[9px] text-muted-foreground/70">Powered by ManagR</div>}
    </Sec>
  );
}

function VEnquiry({ onBack }: { onBack: () => void }) {
  const [err, setErr] = React.useState("");
  const nameRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const [sent, setSent] = React.useState(false);

  const send = () => {
    const name = nameRef.current!.value.trim();
    const phone = phoneRef.current!.value.trim();
    if (!name || !phone) {
      nameRef.current!.setAttribute("aria-invalid", String(!name));
      phoneRef.current!.setAttribute("aria-invalid", String(!phone));
      setErr("Please add your name and phone so the owner can reply to you.");
      (!name ? nameRef : phoneRef).current!.focus();
      return;
    }
    setSent(true);
  };

  if (sent)
    return (
      <Sec>
        <Callout tone="ok" icon={<Check className="size-4" />} title="Enquiry sent (test — not sent)">
          In the live site this would create a lead in Leads &amp; CRM tagged “Website”, and the owner replies on WhatsApp.
        </Callout>
        <Button variant="primary" className="mt-4 w-full" onClick={onBack}>Back to properties</Button>
      </Sec>
    );

  return (
    <Sec>
      <div className="mb-1 text-[15px] font-extrabold"><Inbox className="mr-1 inline size-4" />Send an enquiry</div>
      <p className="text-caption text-muted-foreground">The owner usually replies on WhatsApp within a day.</p>
      <div className="mt-3 space-y-3">
        <div><Label htmlFor="en">Name *</Label><Input id="en" ref={nameRef} className="mt-1" onInput={(e) => (e.target as HTMLInputElement).removeAttribute("aria-invalid")} /></div>
        <div><Label htmlFor="ep">Phone *</Label><Input id="ep" ref={phoneRef} className="mt-1" inputMode="tel" onInput={(e) => (e.target as HTMLInputElement).removeAttribute("aria-invalid")} /></div>
        <div><Label htmlFor="eb">Budget</Label><Input id="eb" className="mt-1" placeholder="₹" /></div>
      </div>
      {err && <p className="mt-2 text-caption font-semibold text-destructive">{err}</p>}
      <Button variant="primary" className="mt-4 w-full" onClick={send}>Send enquiry</Button>
      <Callout tone="warn" className="mt-3 text-caption">Preview — this won't send a real enquiry.</Callout>
    </Sec>
  );
}

const STEPS = ["Room", "Date", "Time", "Your details"];
function VVisit({ step, setStep, onDone, onBack }: { step: number; setStep: (n: number) => void; onDone: () => void; onBack: () => void }) {
  const [date, setDate] = React.useState<number | null>(null);
  const [time, setTime] = React.useState<string | null>(null);
  const full = [11, 12, 18];
  const canNext = step === 1 ? date != null && !full.includes(date) : step === 2 ? !!time : true;

  return (
    <Sec>
      <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</div>
      <div className="mt-3">
        {step === 0 && (
          <>
            <div className="mb-2 text-[15px] font-extrabold">What are you looking for?</div>
            {["Any room", "Double sharing", "Private room"].map((o, i) => (
              <label key={o} className="mb-2 flex items-center gap-2 rounded-lg border border-hair p-3 text-body">
                <input type="radio" name="lk" defaultChecked={i === 0} /> {o}
              </label>
            ))}
          </>
        )}
        {step === 1 && (
          <>
            <div className="mb-2 text-[15px] font-extrabold">Pick a date</div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 21 }, (_, i) => {
                const d = i + 8;
                const none = full.includes(d) || [3, 4].includes(i);
                return (
                  <button
                    key={d}
                    disabled={none}
                    onClick={() => setDate(d)}
                    className={cn(
                      "grid aspect-square place-items-center rounded-lg border border-hair text-[12px]",
                      none && "bg-secondary text-muted-foreground/50",
                      date === d && "border-brand bg-brand text-white",
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-caption text-muted-foreground">Greyed days are full.</p>
          </>
        )}
        {step === 2 && (
          <>
            <div className="mb-2 text-[15px] font-extrabold">Pick a time</div>
            <div className="grid grid-cols-3 gap-2">
              {["9:00", "10:00", "11:00", "4:00", "5:00", "6:00"].map((t, i) => (
                <button
                  key={t}
                  disabled={i === 2}
                  onClick={() => setTime(t)}
                  className={cn("min-h-[40px] rounded-lg border border-hair text-caption", i === 2 && "bg-secondary text-muted-foreground/50 line-through", time === t && "border-brand bg-brand text-white")}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="mb-2 text-[15px] font-extrabold">Your details</div>
            <div className="space-y-3">
              <div><Label>Name *</Label><Input className="mt-1" /></div>
              <div><Label>Phone *</Label><Input className="mt-1" inputMode="tel" /></div>
            </div>
            <Callout tone="info" className="mt-3 text-caption">You're booked straight away. No code needed.</Callout>
          </>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={() => (step > 0 ? setStep(step - 1) : onBack())}>Back</Button>
        <Button variant="primary" className="flex-1" disabled={!canNext} onClick={() => (step < 3 ? setStep(step + 1) : onDone())}>
          {step < 3 ? "Continue" : "Confirm visit"}
        </Button>
      </div>
      <p className="mt-2 text-center text-caption text-muted-foreground">Preview — no real booking is made.</p>
    </Sec>
  );
}

function VRequest({ s, onSend, onBack }: { s: ReturnType<typeof useS>; onSend: () => void; onBack: () => void }) {
  const p = s.pages && [];
  void p;
  return (
    <Sec>
      <div className="mb-1 text-[15px] font-extrabold">Request a bed</div>
      <div className="space-y-3">
        <div><Label>Room type</Label><Input className="mt-1" defaultValue="Double sharing" /></div>
        <div><Label>Move-in date</Label><Input className="mt-1" type="date" defaultValue="2026-02-01" /></div>
      </div>
      <Callout tone="ok" className="mt-3 text-caption">A bed can be ready by your date.</Callout>
      <Callout tone="plain" className="mt-2 border-dashed text-caption">— Payment step goes here later. Not enabled yet. —</Callout>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" className="flex-1" onClick={onSend}>Send request</Button>
      </div>
    </Sec>
  );
}

function VDone({ title, body, onHome }: { title: string; body: string; onHome: () => void }) {
  return (
    <Sec>
      <Callout tone="ok" icon={<Check className="size-4" />} title={title}>{body}</Callout>
      <div className="mt-3 rounded-xl rounded-bl-sm border border-success-border bg-success-surface p-3 text-body">
        ✅ We've sent the details to your WhatsApp — the owner's number and directions to the approximate area.
      </div>
      <Button variant="primary" className="mt-4 w-full" onClick={onHome}>Back to properties</Button>
    </Sec>
  );
}
