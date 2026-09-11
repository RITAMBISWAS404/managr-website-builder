import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* Teach tailwind-merge our custom font-size scale (globals.css / tailwind.config.ts).
   Without this it mistakes `text-body` etc. for a text-COLOUR and drops a real
   colour class like `text-primary-foreground` sitting earlier in the list. */
const FONT_SIZES = ["micro", "pill", "caption", "sm", "body", "section", "title", "display"];
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uid = () => Math.random().toString(36).slice(2, 9);
export const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

export function relTime(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
}
