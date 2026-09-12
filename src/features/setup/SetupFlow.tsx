import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Callout } from "@/components/common";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { DOMAIN, OWNER, RESERVED_SLUGS, TAKEN_SLUGS } from "@/data/managr";
import { useS, useDispatch } from "@/store/hooks";
import { ownerInfo } from "@/store/selectors";

const STEPS = ["Address", "Confirm", "Your info", "Live"];

function Progress({ step }: { step: number }) {
  return (
    <div className="mb-6 flex flex-wrap gap-1.5">
      {STEPS.map((label, i) => (
        <span
          key={label}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-caption font-semibold",
            i < step && "border-success-border bg-success-surface text-success",
            i === step && "border-brand bg-tint-coral text-brand",
            i > step && "border-hair bg-secondary text-muted-foreground",
          )}
        >
          {i < step ? <Check className="size-3" /> : i + 1} {label}
        </span>
      ))}
    </div>
  );
}

export function SetupFlow() {
  const s = useS();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const setStage = (setup: typeof s.setup) => dispatch({ type: "patch", patch: { setup } });

  if (s.setup === "locked")
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-title font-bold">Get your own website</h1>
          <p className="mt-2 text-body text-muted-foreground">
            One link for your WhatsApp bio, Instagram and the board outside — built from the property details you already
            keep in ManagR. You never retype rent or room numbers here.
          </p>
        </div>
        <div className="rounded-xl border border-hair border-border bg-card p-4">
          <div className="mb-2 text-micro font-bold uppercase tracking-wide text-muted-foreground">What you get</div>
          <ul className="space-y-1.5 text-caption">
            {["Your own web address", "Photos, rent, rooms and location — always current", "Call & WhatsApp buttons", "Take it offline whenever you like"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="size-3.5 text-success" /> {t}</li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-3"><Eye /> Show me a sample</Button>
        </div>
        <Callout tone="info" title="How to switch it on">
          Add your first property and get it approved (about a day). Your website turns on by itself the moment it's approved.
        </Callout>
        <Button variant="primary" size="lg" className="w-full" onClick={() => { setStage("unlocked"); toast.success("Property approved"); }}>
          <Plus /> Add a property
        </Button>
        <p className="text-center text-caption text-muted-foreground">In this prototype, this stands in for the real Add-property flow.</p>
      </div>
    );

  if (s.setup === "unlocked")
    return (
      <div className="space-y-4">
        <Callout tone="ok" icon={<Check className="size-4" />} title={<>“Shree Residency” is approved!</>}>
          Your website is ready to switch on. Setting it up takes about two minutes.
        </Callout>
        <div className="rounded-xl border border-hair border-border bg-card p-4">
          <div className="mb-2 text-micro font-bold uppercase tracking-wide text-muted-foreground">A peek at how it'll look</div>
          <div className="ph min-h-[120px]">Your site — hero, property cards, contact</div>
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={() => setStage("address")}>Set up my website</Button>
        <Button variant="ghost" className="w-full" onClick={() => toast("Set it up any time from the Website tab")}>I'll do this later</Button>
      </div>
    );

  if (s.setup === "address") return <AddressStep />;

  if (s.setup === "confirm")
    return <ConfirmStep />;

  // info
  return <InfoStep onDone={() => { setStage("done"); nav("/website"); toast.success("Your website is live"); }} />;
}

function AddressStep() {
  const s = useS();
  const dispatch = useDispatch();
  const [raw, setRaw] = React.useState("");
  const [status, setStatus] = React.useState<"empty" | "invalid" | "short" | "reserved" | "taken" | "ok">("empty");
  const slug = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");

  React.useEffect(() => {
    if (!raw) return setStatus("empty");
    if (raw !== raw.toLowerCase() || /[^a-z0-9-]/.test(raw)) return setStatus("invalid");
    if (slug.length < 3) return setStatus("short");
    if (RESERVED_SLUGS.includes(slug)) return setStatus("reserved");
    if (TAKEN_SLUGS.includes(slug)) return setStatus("taken");
    setStatus("ok");
  }, [raw, slug]);

  const hint = {
    empty: "Type the name you'd like — try your business name.",
    invalid: "Use lowercase letters, numbers and hyphens only — no spaces or symbols.",
    short: "A little longer, please — at least 3 letters.",
    reserved: `Sorry, “${slug}” is a word we keep reserved. Try something else.`,
    taken: "That one's taken. How about a variation with your area?",
    ok: `${slug}.${DOMAIN} is available`,
  }[status];

  return (
    <div>
      <Progress step={0} />
      <h1 className="text-title font-bold">Pick your web address</h1>
      <p className="my-2 text-body text-muted-foreground">This is the link you'll share everywhere. Keep it short and easy to say out loud.</p>

      <Label htmlFor="addr">Web address</Label>
      <div className="mt-1 flex items-center rounded-lg border border-hair border-input">
        <span className="px-2 text-caption text-muted-foreground">https://</span>
        <input
          id="addr"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          autoCapitalize="none"
          spellCheck={false}
          placeholder="your-name"
          className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-center text-[15px] font-bold outline-none"
        />
        <span className="px-2 text-caption text-muted-foreground">.{DOMAIN}</span>
      </div>
      <p className={cn("mt-1 text-caption", status === "ok" ? "font-semibold text-success" : status === "invalid" || status === "reserved" ? "text-destructive" : "text-muted-foreground")}>
        {status === "ok" && <Check className="mr-1 inline size-3.5" />}
        {hint}
      </p>
      {status === "taken" && (
        <div className="mt-2 flex flex-wrap gap-2">
          {[`${slug}-andheri`, `${slug}-pg`, `${slug}1`].map((x) => (
            <button key={x} onClick={() => setRaw(x)} className="rounded-full border border-hair bg-secondary px-3 py-1 text-caption font-medium">
              {x}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 rounded-lg border border-hair border-border bg-muted p-3">
        <div className="text-caption text-muted-foreground">Your link will be</div>
        <div className="mt-1 font-mono text-body font-bold">https://{slug || "your-name"}.{DOMAIN}</div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        disabled={status !== "ok"}
        onClick={() => dispatch({ type: "patch", patch: { slug, setup: "confirm" } })}
      >
        Continue to confirm →
      </Button>
    </div>
  );
}

function ConfirmStep() {
  const s = useS();
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(false);
  return (
    <div>
      <Progress step={1} />
      <h1 className="text-title font-bold">Is this exactly right?</h1>
      <p className="my-2 text-body text-muted-foreground">
        You choose your address once. It goes on your boards and into WhatsApp groups, so it can't be changed later without contacting support.
      </p>
      <div className="my-5 rounded-xl border border-hair border-border bg-card p-4 text-center">
        <div className="text-caption text-muted-foreground">Your website will be</div>
        <div className="mt-2 break-all font-mono text-[18px] font-extrabold">https://{s.slug}.{DOMAIN}</div>
      </div>
      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-hair border-border p-3 text-body">
        <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)} className="mt-0.5" />
        <span>Yes — I've checked the spelling and I understand this is permanent.</span>
      </label>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={() => dispatch({ type: "patch", patch: { setup: "address" } })}>Change it</Button>
        <Button variant="primary" size="lg" className="flex-1" disabled={!checked} onClick={() => dispatch({ type: "patch", patch: { setup: "info" } })}>
          <Lock /> Claim this address
        </Button>
      </div>
    </div>
  );
}

function InfoStep({ onDone }: { onDone: () => void }) {
  const s = useS();
  const dispatch = useDispatch();
  const [form, setForm] = React.useState({ headline: "", about: "", phone: OWNER.phone, email: "", office: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const finish = (save: boolean) => {
    if (save)
      dispatch({
        type: "patch",
        patch: { info: { ...form, phone: form.phone === OWNER.phone ? "" : form.phone } },
      });
    onDone();
  };

  return (
    <div>
      <Progress step={2} />
      <h1 className="text-title font-bold">A few details for visitors</h1>
      <p className="my-2 text-body text-muted-foreground">
        All optional. Anything you skip gets a sensible default, and you can change it later in Website settings.
      </p>
      <div className="space-y-3">
        <div>
          <Label htmlFor="head">Headline on your site</Label>
          <Input id="head" className="mt-1" value={form.headline} onChange={set("headline")} placeholder={ownerInfo(s, "headline")} />
        </div>
        <div>
          <Label htmlFor="about">A line or two about your place</Label>
          <Textarea id="about" className="mt-1" value={form.about} onChange={set("about")} placeholder="Family-run, home-cooked meals, five minutes from the station…" />
        </div>
        <div>
          <Label htmlFor="phone">Contact number</Label>
          <Input id="phone" className="mt-1" value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" className="mt-1" value={form.email} onChange={set("email")} placeholder="Leave blank to hide it" />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="ghost" onClick={() => finish(false)}>Skip — use defaults</Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={() => finish(true)}>Publish my website</Button>
      </div>
    </div>
  );
}
