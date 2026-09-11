import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-lg border border-input bg-surface text-body text-foreground transition-[border-color,box-shadow] placeholder:text-faint focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-70 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input type={type} ref={ref} className={cn(base, "h-9 px-3 py-1.5", className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(base, "min-h-[76px] px-3 py-2 leading-relaxed", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
