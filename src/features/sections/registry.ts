/* ============================================================================
   SECTION REGISTRY — the scalable core of the builder.
   Add a section = add one entry here (+ a case in SectionCanvas + optional
   inspector schema). Nothing else in the app hardcodes a section list.
   ========================================================================== */
import type { LucideIcon } from "lucide-react";
import {
  LayoutPanelTop, Image, Grid3x3, Star, MapPin, ShieldCheck, Type, Images, HelpCircle,
  Inbox, CalendarDays, CheckCircle2, Tag, Phone, MessageCircle,
} from "lucide-react";
import type { SectionType, SectionCategory } from "@/types";
import { CONTRACTS, verifyContract, type SectionContract } from "./contracts";

/* ---- inspector field schema (rendered by InspectorField) ---- */
export type Field =
  | { kind: "text"; key: string; label: string; placeholder?: string; hint?: string }
  | { kind: "textarea"; key: string; label: string; placeholder?: string; hint?: string }
  | { kind: "select"; key: string; label: string; options: string[]; hint?: string }
  | { kind: "toggle"; key: string; label: string; sub?: string }
  | { kind: "checklist"; label: string; items: string[]; hint?: string }
  | { kind: "note"; tone?: "info" | "warn"; text: string }
  | { kind: "frommgr"; where: string }
  | { kind: "action"; label: string; go: string; icon?: string };

export interface SectionMeta {
  id: SectionType;
  name: string;
  category: SectionCategory;
  icon: LucideIcon;
  blurb: string;
  advanced?: boolean;
  global?: "header" | "footer" | "wacta";
  structural?: boolean;
  solo?: boolean;
  dup?: boolean;
  needs?: "photos" | "reviews";
  subParts?: string[];
  layoutVariants: string[];
  /** Content-tab primary fields + a `more` bucket for progressive disclosure */
  content: { primary: Field[]; more?: { label: string; fields: Field[] } };
  /** ManagR-data rows shown on the "ManagR data" tab (read-only) */
  dataRows?: { label: string; value: string; where: string }[];
}

const DEF_LAYOUT = ["Default"];

export const SECTIONS: Record<SectionType, SectionMeta> = {
  header: {
    id: "header", name: "Header", category: "Structural", icon: LayoutPanelTop, structural: true,
    global: "header", subParts: ["Logo", "Links", "Call button"], layoutVariants: DEF_LAYOUT,
    blurb: "Your logo, menu and call button. Shows on every page.",
    content: {
      primary: [
        { kind: "text", key: "logotext", label: "Business name shown", placeholder: "Shree Residency" },
        { kind: "note", text: "No logo is fine — visitors see a clean “S” mark, never a broken image." },
      ],
      more: {
        label: "Menu links & buttons",
        fields: [
          { kind: "checklist", label: "Which links appear in the menu", items: ["Properties", "About", "Contact", "FAQ", "Gallery"], hint: "Only pages you've created can be linked. Order follows your page order." },
          { kind: "toggle", key: "call", label: "Show a Call button in the menu" },
          { kind: "toggle", key: "sticky", label: "Keep the menu visible as visitors scroll" },
        ],
      },
    },
  },
  hero: {
    id: "hero", name: "Hero", category: "Hero", icon: Image, solo: true,
    subParts: ["Heading", "Sub-line", "Image", "Button"],
    layoutVariants: ["Image on top", "Image left", "Image right", "Image background", "Text only"],
    blurb: "A headline, a line under it, and a button. The first thing people see.",
    content: {
      primary: [
        { kind: "text", key: "headline", label: "Main heading", placeholder: "Shree Residency — PG & Hostel stays in Andheri West", hint: "Leave blank to use a sensible default." },
        { kind: "text", key: "sub", label: "One line under it", placeholder: "Direct from owner. No brokerage." },
        { kind: "select", key: "btnAction", label: "Main button does", options: ["Start a phone call", "Open WhatsApp", "Scroll down to properties", "Nothing (hide the button)"] },
      ],
      more: {
        label: "Picture & button wording",
        fields: [
          { kind: "select", key: "bg", label: "Background picture", options: ["Use one of my property photos", "Plain colour, no picture"] },
          { kind: "text", key: "btn", label: "Button wording", placeholder: "Call now" },
        ],
      },
    },
    dataRows: [{ label: "Background photo", value: "Shree Residency — exterior", where: "Properties → Photos" }],
  },
  properties: {
    id: "properties", name: "Properties", category: "Properties", icon: Grid3x3, solo: true,
    layoutVariants: ["Photo cards", "Compact list", "2 per row", "3 per row"],
    blurb: "Your rooms as cards — name, area, rent, availability. Straight from ManagR.",
    content: {
      primary: [
        { kind: "select", key: "which", label: "Which properties to show", options: ["All approved properties", "Pick specific ones…"] },
        { kind: "frommgr", where: "Properties" },
        { kind: "select", key: "order", label: "Order them by", options: ["Newest first", "Ones I've featured first", "Most beds available first"] },
      ],
      more: {
        label: "Card style & count",
        fields: [
          { kind: "select", key: "cardStyle", label: "Card style", options: ["With photo", "Compact"] },
        ],
      },
    },
    dataRows: [
      { label: "Property name, area, rent, rooms", value: "Approved properties", where: "Properties" },
      { label: "Availability shown on cards", value: "Set in Live availability", where: "Live availability" },
    ],
  },
  featured: {
    id: "featured", name: "Featured property", category: "Properties", icon: Star, layoutVariants: DEF_LAYOUT,
    blurb: "Put one property in the spotlight.",
    content: { primary: [{ kind: "select", key: "prop", label: "Property to spotlight", options: [] }, { kind: "frommgr", where: "Properties" }] },
  },
  areas: {
    id: "areas", name: "Areas", category: "Properties", icon: MapPin, layoutVariants: DEF_LAYOUT,
    blurb: "List the neighbourhoods you have buildings in.",
    content: { primary: [{ kind: "checklist", label: "Areas to list", items: [] }, { kind: "frommgr", where: "Properties → Location" }] },
  },
  highlights: {
    id: "highlights", name: "Highlights", category: "Trust", icon: Star, dup: true,
    layoutVariants: ["3 across", "2 across", "Icon list"],
    blurb: "Meals included, CCTV, walk to the metro — the reasons to choose you.",
    content: {
      primary: [
        { kind: "checklist", label: "Choose from features on your properties", items: ["Meals included", "CCTV", "WiFi", "Laundry", "Walk to metro", "Power backup"] },
        { kind: "frommgr", where: "Properties → Amenities" },
      ],
    },
  },
  trust: {
    id: "trust", name: "Trust", category: "Trust", icon: ShieldCheck, layoutVariants: DEF_LAYOUT,
    blurb: 'A simple "Direct from owner · No brokerage" bar.',
    content: { primary: [{ kind: "note", text: 'This banner reads "Direct from owner · No brokerage". Fixed wording because it performs well — you can hide the section but not reword it.' }] },
  },
  reviews: {
    id: "reviews", name: "Reviews", category: "Trust", icon: Star, needs: "reviews", layoutVariants: DEF_LAYOUT,
    blurb: "Real tenant reviews, pulled from ManagR.",
    content: { primary: [{ kind: "frommgr", where: "Tenants → Reviews" }] },
    dataRows: [{ label: "Reviews", value: "Tenant reviews", where: "Tenants → Reviews" }],
  },
  about: {
    id: "about", name: "About", category: "Content", icon: Type, subParts: ["Text", "Photo"],
    layoutVariants: ["Text + photo", "Photo + text", "Text only"],
    blurb: "Your story in a few lines, with one photo.",
    content: {
      primary: [
        { kind: "textarea", key: "text", label: "Your story, in a few lines", placeholder: "Family-run, home-cooked meals, five minutes from the station…" },
        { kind: "select", key: "photo", label: "Photo beside it", options: ["One of my property photos", "Upload a photo"] },
      ],
    },
    dataRows: [{ label: "Photo", value: "A property photo", where: "Properties → Photos" }],
  },
  richtext: {
    id: "richtext", name: "Text", category: "Content", icon: Type, dup: true, layoutVariants: DEF_LAYOUT,
    blurb: "A free block of text — house rules, meal menu, anything.",
    content: { primary: [{ kind: "textarea", key: "text", label: "Free text", placeholder: "Type here…" }] },
  },
  gallery: {
    id: "gallery", name: "Gallery", category: "Content", icon: Images, dup: true, needs: "photos",
    layoutVariants: ["Grid", "Rows", "Masonry"],
    blurb: "A wall of photos from across your properties.",
    content: {
      primary: [
        { kind: "note", text: "Photos come from your properties in ManagR." },
        { kind: "frommgr", where: "Properties → Photos" },
        { kind: "action", label: "Choose photos", go: "assets" },
      ],
    },
    dataRows: [{ label: "Photos", value: "Property photos", where: "Properties → Photos" }],
  },
  faq: {
    id: "faq", name: "FAQ", category: "Content", icon: HelpCircle, dup: true, layoutVariants: DEF_LAYOUT,
    blurb: "Answer the questions people always ask, and cut repeat calls.",
    content: {
      primary: [{ kind: "note", text: "Add the questions people ask most. Keep answers short." }],
      more: { label: "Common questions to add in one tap", fields: [{ kind: "note", text: "Is there a curfew? · Is a deposit required? · Can I visit first? · Are guests allowed?" }] },
    },
  },
  enquiry: {
    id: "enquiry", name: "Enquiry", category: "Convert", icon: Inbox, advanced: true, solo: true, layoutVariants: DEF_LAYOUT,
    blurb: "A short form. Every submission becomes a lead in your CRM.",
    content: {
      primary: [
        { kind: "checklist", label: "What the form asks for (Name & Phone always asked)", items: ["What they're looking for", "Move-in date", "Budget"] },
        { kind: "toggle", key: "fab", label: 'Floating "Enquire" button on mobile', sub: "Follows the visitor as they scroll" },
      ],
    },
    dataRows: [{ label: "Where leads go", value: 'Leads & CRM · tagged "Website"', where: "Leads & CRM" }],
  },
  visit: {
    id: "visit", name: "Visits", category: "Convert", icon: CalendarDays, advanced: true, solo: true, layoutVariants: DEF_LAYOUT,
    blurb: "Visitors book a viewing themselves, in the slots you allow.",
    content: {
      primary: [
        { kind: "checklist", label: "Properties that accept visits", items: [] },
        { kind: "action", label: "Set the days, times & rules", go: "visits", icon: "calendar" },
      ],
    },
    dataRows: [{ label: "Days, slots, rules", value: "From your visit settings", where: "Visit settings" }],
  },
  bookcta: {
    id: "bookcta", name: "Booking request", category: "Convert", icon: CheckCircle2, advanced: true, layoutVariants: DEF_LAYOUT,
    blurb: "A button for visitors to request a bed from a move-in date.",
    content: { primary: [{ kind: "note", text: "Visitors request a bed from a move-in date; you approve or decline." }] },
  },
  offer: {
    id: "offer", name: "Offer", category: "Convert", icon: Tag, dup: true, layoutVariants: DEF_LAYOUT,
    blurb: '"₹1,000 off this month" — shows and hides itself on dates you set.',
    content: {
      primary: [{ kind: "text", key: "text", label: "Offer text", placeholder: "₹1,000 off this month" }],
      more: { label: "Colour", fields: [{ kind: "note", text: "Pick from your brand palette." }] },
    },
  },
  contact: {
    id: "contact", name: "Contact", category: "Contact", icon: Phone, layoutVariants: ["Stacked", "Two columns"],
    blurb: "Phone, WhatsApp, email and an approximate map.",
    content: {
      primary: [
        { kind: "checklist", label: "Which ways to contact you show", items: ["Phone number", "WhatsApp", "Email", "Approximate map", "Opening hours"] },
        { kind: "note", tone: "info", text: "The map is always the general area only — your exact street address is never shown, on any plan." },
      ],
    },
    dataRows: [
      { label: "Phone / WhatsApp / email", value: "From Website settings", where: "Website settings → Contact" },
      { label: "Map location", value: "Approximate only — exact address never shown", where: "—" },
    ],
  },
  wacta: {
    id: "wacta", name: "WhatsApp", category: "Contact", icon: MessageCircle, global: "wacta", layoutVariants: DEF_LAYOUT,
    blurb: "A WhatsApp button that stays on screen as people scroll.",
    content: { primary: [{ kind: "text", key: "text", label: "Button wording", placeholder: "Chat with us" }] },
  },
  footer: {
    id: "footer", name: "Footer", category: "Structural", icon: LayoutPanelTop, structural: true, global: "footer",
    subParts: ["Contact", "Social", "Powered by"], layoutVariants: DEF_LAYOUT,
    blurb: "Contact details and a link back to you. Shows on every page.",
    content: {
      primary: [
        { kind: "checklist", label: "Details shown in the footer", items: ["Phone number", "WhatsApp", "Email", "Office area", "Instagram link"] },
        { kind: "toggle", key: "powered", label: 'Show "Powered by ManagR"' },
      ],
    },
    dataRows: [{ label: "Contact details", value: "From Website settings", where: "Website settings → Contact" }],
  },
};

export const ADD_CATEGORIES: { key: SectionCategory; label: string }[] = [
  { key: "Hero", label: "Hero" },
  { key: "Properties", label: "Properties" },
  { key: "Trust", label: "Trust" },
  { key: "Content", label: "Content" },
  { key: "Convert", label: "Convert" },
  { key: "Contact", label: "Contact" },
];

export const sectionList = () => Object.values(SECTIONS);

/* ---- registry ⇄ contract bridge -------------------------------------------
   The inspector renders `content`; the contract in contracts.ts is the source
   of truth for what the future template can support. This keeps them aligned. */
export const contractFor = (id: SectionType): SectionContract => CONTRACTS[id];

/** every `key` the inspector schema exposes for a section */
export function editorKeys(id: SectionType): string[] {
  const m = SECTIONS[id];
  const keys: string[] = [];
  const walk = (fields: Field[] = []) => {
    for (const f of fields) if ("key" in f && f.key) keys.push(f.key);
  };
  walk(m.content.primary);
  walk(m.content.more?.fields);
  return keys;
}

/* Dev-only drift check: fail loud in the console if the inspector and the
   section contract disagree about which fields exist. */
if (import.meta.env?.DEV) {
  const problems = (Object.keys(SECTIONS) as SectionType[]).flatMap((id) =>
    verifyContract(id, editorKeys(id)),
  );
  if (problems.length) {
    // eslint-disable-next-line no-console
    console.warn("[section contracts] editor ⇄ contract drift:\n" + problems.join("\n"));
  }
}
