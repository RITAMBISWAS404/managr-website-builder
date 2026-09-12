/* ============================================================================
   Mocked ManagR data. Structured so a real API can drop in later — nothing here
   is referenced from JSX directly; screens read it through hooks/selectors.
   ========================================================================== */
import type { Property, Theme, Template, Enquiry, BookingRequest } from "@/types";

export const DOMAIN = "managr.in";

export const OWNER = {
  biz: "Shree Residency",
  owner: "Niraj Rawool",
  phone: "88576 15102",
  email: "niraj@example.com",
  area: "Andheri West, Mumbai",
};

export const ALL_PROPERTIES: Property[] = [
  {
    id: "p1", name: "Shree Residency", area: "Andheri West", from: "₹8,000",
    sharing: ["Double", "Triple"], photos: 3, reviews: 0, updatedDaysAgo: 0, status: "live",
    rooms: [
      { id: "r1", label: "Triple sharing", rent: "₹8,000/mo", deposit: "₹16,000", freeNow: 2, freeFrom: null },
      { id: "r2", label: "Double sharing", rent: "₹11,000/mo", deposit: "₹22,000", freeNow: 0, freeFrom: "15 Sep" },
      { id: "r3", label: "Private room", rent: "₹17,000/mo", deposit: "₹34,000", freeNow: 1, freeFrom: null },
    ],
    beds: [1, 1, 0, 0, 1, 0, 0, 0],
  },
  {
    id: "p2", name: "Shree Residency — Girls", area: "Andheri East", from: "₹9,500",
    sharing: ["Double", "Private"], photos: 0, reviews: 2, updatedDaysAgo: 3, status: "review",
    rooms: [{ id: "r4", label: "Double sharing", rent: "₹9,500/mo", deposit: "₹19,000", freeNow: 1, freeFrom: null }],
    beds: [1, 0, 0, 0],
  },
  {
    id: "p3", name: "Green Nest PG", area: "Powai", from: "₹7,500",
    sharing: ["Triple"], photos: 4, reviews: 5, updatedDaysAgo: 22, status: "live",
    rooms: [{ id: "r5", label: "Triple sharing", rent: "₹7,500/mo", deposit: "₹15,000", freeNow: 0, freeFrom: null }],
    beds: [0, 0, 0],
  },
  {
    id: "p4", name: "Hillview Ladies PG", area: "Andheri West", from: "₹10,000",
    sharing: ["Double"], photos: 6, reviews: 3, updatedDaysAgo: 1, status: "unpublished",
    rooms: [{ id: "r6", label: "Double sharing", rent: "₹10,000/mo", deposit: "₹20,000", freeNow: 3, freeFrom: null }],
    beds: [1, 1, 1, 0],
  },
];

export const THEMES: Theme[] = [
  { key: "modern", name: "Clean Modern", blurb: "Crisp, lots of white space, sharp corners.", accent: "#F7553D", radius: "10px", cards: "outlined", density: "airy" },
  { key: "family", name: "Warm Family-run", blurb: "Friendly, rounded, softer type.", accent: "#BB4D00", radius: "16px", cards: "filled", density: "cozy" },
  { key: "premium", name: "Premium Co-living", blurb: "Dark, confident, minimal.", accent: "#001737", radius: "6px", cards: "flat", density: "tight" },
];

export const ACCENTS = ["#F7553D", "#BB4D00", "#009966", "#8200DB", "#155DFC", "#314158"];

/** Curated, accessibility-safe palettes. The owner picks one; supporting colours
 *  are derived. No colour wheel. */
export const PALETTES: { key: string; name: string; accent: string }[] = [
  { key: "coral", name: "Coral", accent: "#F7553D" },
  { key: "navy", name: "Navy", accent: "#1E3A8A" },
  { key: "forest", name: "Forest", accent: "#166534" },
  { key: "warm", name: "Warm", accent: "#B45309" },
  { key: "ocean", name: "Ocean", accent: "#0E7490" },
  { key: "plum", name: "Plum", accent: "#7C3AED" },
  { key: "charcoal", name: "Charcoal", accent: "#334155" },
  { key: "rose", name: "Rose", accent: "#BE185D" },
];

export const FONT_PAIRS: { key: string; name: string; note: string }[] = [
  { key: "modern", name: "Modern", note: "Clean and confident" },
  { key: "friendly", name: "Friendly", note: "Softer, approachable" },
  { key: "premium", name: "Premium", note: "Refined, editorial" },
  { key: "classic", name: "Classic", note: "Familiar and neutral" },
];

export const TEMPLATES: Template[] = [
  { key: "propertyFirst", name: "Property-first", blurb: "Get people to the rooms fast.", blocks: ["header", "hero", "properties", "trust", "highlights", "contact", "footer"] },
  { key: "brandFirst", name: "Brand-first", blurb: "Lead with your story and reviews.", blocks: ["header", "hero", "about", "highlights", "properties", "reviews", "contact", "footer"] },
];

/** freshness thresholds — PRODUCT DECISION (configurable). See architecture §15.1 */
export const FRESH = { fresh: 3, slightly: 10 };
export function freshness(days: number): "fresh" | "slightly" | "stale" {
  if (days <= FRESH.fresh) return "fresh";
  if (days <= FRESH.slightly) return "slightly";
  return "stale";
}

export const DEFAULT_HOME_BLOCKS = ["header", "hero", "properties", "highlights", "about", "contact", "footer"] as const;

export const MOCK_ENQUIRIES: Enquiry[] = [
  { id: "e1", name: "Rahul M.", detail: "Double sharing · move-in October · budget ₹10–12k", when: "2 hours ago", status: "New" },
  { id: "e2", name: "Priya (parent)", detail: "Private room · move-in as soon as possible", when: "Yesterday", status: "Contacted" },
];

export const MOCK_REQUESTS: BookingRequest[] = [
  { id: "b1", name: "Aditya", detail: "Double sharing · Shree Residency", moveIn: "2 March", status: "Awaiting your decision" },
  { id: "b2", name: "Rohan", detail: "Single sharing · Green Nest PG", moveIn: "9 March", status: "Awaiting your decision" },
];

export const RESERVED_SLUGS = ["admin", "api", "www", "managr", "bedr", "help", "support", "app", "test", "new"];
export const TAKEN_SLUGS = ["shreeresidency", "urbanstay", "greennest", "zolo"];
