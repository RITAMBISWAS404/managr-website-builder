import { useNavigate } from "react-router-dom";
import { Plus, FileText, Sparkles, HeartPulse, Tablet, Play, Check, RefreshCw, Eye, CalendarDays, Smartphone, Monitor, Home } from "lucide-react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useDispatch } from "@/store/hooks";
import { useEditorUI } from "../EditorContext";

export function CommandMenu() {
  const ui = useEditorUI();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const open = ui.overlay === "command";

  const run = (fn: () => void) => () => { ui.close(); fn(); };

  const items: [React.ComponentType<{ className?: string }>, string, () => void][] = [
    [Plus, "Add a section", run(() => dispatch({ type: "leftMode", mode: "add" }))],
    [FileText, "Go to a page", run(() => ui.open("pagePick"))],
    [Sparkles, "Open Design (theme, template, brand)", run(() => ui.open("design"))],
    [HeartPulse, "Run the site check", run(() => nav("/website/health"))],
    [Tablet, "Responsive check", run(() => ui.open("responsive"))],
    [Play, "Preview as a visitor", run(() => nav("/website/preview"))],
    [Check, "Publish", run(() => ui.open("publish"))],
    [RefreshCw, "Version history", run(() => ui.open("versions"))],
    [Eye, "Live availability settings", run(() => nav("/website/availability"))],
    [CalendarDays, "Visit settings", run(() => nav("/website/visits"))],
    [Smartphone, "Switch device — Mobile", run(() => dispatch({ type: "device", device: "mobile" }))],
    [Monitor, "Switch device — Desktop", run(() => dispatch({ type: "device", device: "desktop" }))],
    [Home, "Back to ManagR", run(() => nav("/website"))],
  ];

  return (
    <CommandDialog open={open} onOpenChange={(v) => !v && ui.close()}>
      <CommandInput placeholder="Type a command… (add section, theme, availability, preview, publish)" />
      <CommandList>
        <CommandEmpty>No match</CommandEmpty>
        <CommandGroup heading="Quick actions">
          {items.map(([Icon, label, fn]) => (
            <CommandItem key={label} onSelect={fn}>
              <Icon /> {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
