import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Info, CalendarDays } from "lucide-react";
import type { Field } from "@/features/sections/registry";
import { Input, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FromManagR } from "@/components/common";
import { cn } from "@/lib/utils";

/* compact field label — matches the editor panel language (12px) */
function FLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-caption font-semibold text-foreground">
      {children}
    </label>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-caption leading-snug text-muted-foreground">{children}</p>;
}

export function InspectorNotice({ tone = "info", children }: { tone?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <p className={cn("flex gap-1.5 text-caption leading-snug", tone === "warn" ? "text-warning" : "text-muted-foreground")}>
      <Info className="mt-0.5 size-3.5 shrink-0" /> <span>{children}</span>
    </p>
  );
}

/* ---- schema-driven field ---- */
export function InspectorField({
  field,
  data,
  onChange,
  options,
}: {
  field: Field;
  data: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  options?: (key: string) => string[] | undefined;
}) {
  const nav = useNavigate();
  const val = (k: string) => (data[k] as string) ?? "";

  switch (field.kind) {
    case "text":
      return (
        <div>
          <FLabel htmlFor={field.key}>{field.label}</FLabel>
          <Input id={field.key} value={val(field.key)} placeholder={field.placeholder} onChange={(e) => onChange(field.key, e.target.value)} />
          {field.hint && <Hint>{field.hint}</Hint>}
        </div>
      );
    case "textarea":
      return (
        <div>
          <FLabel htmlFor={field.key}>{field.label}</FLabel>
          <Textarea id={field.key} value={val(field.key)} placeholder={field.placeholder} onChange={(e) => onChange(field.key, e.target.value)} />
          {field.hint && <Hint>{field.hint}</Hint>}
        </div>
      );
    case "select": {
      const opts = options?.(field.key) ?? field.options;
      return (
        <div>
          <FLabel>{field.label}</FLabel>
          <Select value={val(field.key) || opts[0]} onValueChange={(v) => onChange(field.key, v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          {field.hint && <Hint>{field.hint}</Hint>}
        </div>
      );
    }
    case "toggle":
      return (
        <label className="flex cursor-pointer items-center justify-between gap-3 py-0.5 text-caption font-medium text-foreground">
          <span className="min-w-0">
            {field.label}
            {field.sub && <span className="mt-0.5 block font-normal leading-snug text-muted-foreground">{field.sub}</span>}
          </span>
          <Switch checked={!!data[field.key]} onCheckedChange={(v) => onChange(field.key, v)} />
        </label>
      );
    case "checklist": {
      const items = (options?.("items") ?? field.items).filter(Boolean);
      const selected = (data.checklist as string[]) ?? items.slice(0, 3);
      return (
        <div>
          <FLabel>{field.label}</FLabel>
          {/* plain rows — a checkbox group is a list, not five stacked cards */}
          <div className="-mx-1">
            {items.map((it) => (
              <label
                key={it}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-[7px] text-caption text-foreground transition-colors hover:bg-panel-hover"
              >
                <Checkbox
                  checked={selected.includes(it)}
                  onCheckedChange={(c) => onChange("checklist", c ? [...selected, it] : selected.filter((x) => x !== it))}
                />
                {it}
              </label>
            ))}
          </div>
          {field.hint && <Hint>{field.hint}</Hint>}
        </div>
      );
    }
    case "note":
      return <InspectorNotice tone={field.tone === "warn" ? "warn" : "info"}>{field.text}</InspectorNotice>;
    case "frommgr":
      return <FromManagR where={field.where} />;
    case "action":
      return (
        <Button variant="outline" size="sm" className="w-full" onClick={() => nav(`/website/${field.go === "assets" ? "editor" : field.go}`)}>
          {field.icon === "calendar" && <CalendarDays />} {field.label} →
        </Button>
      );
    default:
      return null;
  }
}
