/* ============================================================================
   Domain types — ManagR Website Builder
   MANAGR DATA (read-only, from operations) vs WEBSITE DATA (owner-editable) is a
   hard boundary; see BUILDER-PRODUCT-ARCHITECTURE.md §6.
   ========================================================================== */

/* ---------- ManagR data (never written by the builder) ---------- */
export type PropertyStatus = "live" | "review" | "unpublished" | "archived";

export interface RoomType {
  id: string;
  label: string;
  rent: string;
  deposit: string;
  freeNow: number;
  freeFrom: string | null;
}

export interface Property {
  id: string;
  name: string;
  area: string;
  from: string;
  sharing: string[];
  photos: number;
  reviews: number;
  updatedDaysAgo: number;
  status: PropertyStatus;
  rooms: RoomType[];
  beds: number[]; // 1 = free, 0 = taken (never a name)
}

/* ---------- Website data (owner-editable) ---------- */
export type Plan = "basic" | "trial" | "advanced" | "expiring" | "payment_failed" | "lapsed";
export type Role = "owner" | "manager" | "staff";
export type Connection = "online" | "offline";
export type Device = "desktop" | "tablet" | "mobile";
export type SetupStage = "done" | "locked" | "unlocked" | "address" | "confirm" | "info";
export type SaveState = "saved" | "saving" | "offline";

export type SectionType =
  | "header" | "hero" | "properties" | "featured" | "areas" | "highlights" | "trust"
  | "reviews" | "about" | "richtext" | "gallery" | "faq" | "enquiry" | "visit"
  | "bookcta" | "offer" | "contact" | "wacta" | "footer";

export type SectionCategory = "Hero" | "Properties" | "Trust" | "Content" | "Convert" | "Contact" | "Structural";

export interface Block {
  id: string;
  type: SectionType;
  hidden: boolean;
  global: "header" | "footer" | "wacta" | null;
  data: Record<string, unknown>;
  layout: string;
  dense: "comfortable" | "compact" | "roomy";
  visibility: Record<Device, boolean>;
}

export type PageKind = "standard" | "template:property";

export interface Page {
  id: string;
  name: string;
  slug: string;
  kind: PageKind;
  home: boolean;
  hidden: boolean;
  inNav: boolean;
  blocks: Block[];
}

export interface Globals {
  header: { logo: boolean; links: string[]; call: boolean; sticky: boolean };
  footer: { fields: string[]; powered: boolean };
  wacta: { text: string };
}

export interface SiteSnapshot {
  pages: Page[];
  theme: string;
  brandColor: string | null;
  fontPair: string;
  shape: "soft" | "rounded" | "clean";
  layoutDensity: "spacious" | "balanced" | "compact";
  globals: Globals;
}

export interface PublishVersion {
  id: string;
  kind: "published";
  ts: number;
  summary: string;
  author: string;
  isLive: boolean;
  snap: SiteSnapshot;
}

export interface Theme {
  key: string;
  name: string;
  blurb: string;
  accent: string;
  radius: string;
  cards: "outlined" | "filled" | "flat";
  density: "airy" | "cozy" | "tight";
}

export interface Template {
  key: string;
  name: string;
  blurb: string;
  blocks: SectionType[];
}

/* ---------- operational sub-products ---------- */
export interface Enquiry { id: string; name: string; detail: string; when: string; status: string }
export interface BookingRequest { id: string; name: string; detail: string; moveIn: string; status: string }

export interface OwnerInfo {
  headline: string;
  about: string;
  phone: string;
  email: string;
  office: string;
}

export type AvailabilityLevel = "property" | "roomtype" | "bed";
export type AvailabilityNumbers = "exact" | "vague";

/* ---------- the whole builder state ---------- */
export interface BuilderState {
  /* product / ManagR context (simulated by the dev bar) */
  plan: Plan;
  role: Role;
  conn: Connection;
  siteLive: boolean;
  setup: SetupStage;
  propMode: "none" | "one" | "many";

  /* website */
  slug: string;
  info: OwnerInfo;
  theme: string;
  brandColor: string | null;   // curated palette override; null = theme default
  fontPair: string;            // "modern" | "friendly" | "premium" | "classic"
  shape: "soft" | "rounded" | "clean";
  layoutDensity: "spacious" | "balanced" | "compact";
  globals: Globals;
  pages: Page[];
  published: SiteSnapshot | null;
  versions: PublishVersion[];

  /* availability + visits config */
  availOn: boolean;
  availLevel: AvailabilityLevel;
  availNumbers: AvailabilityNumbers;
  availFromDate: boolean;
  availStale: boolean;

  /* editor UI state */
  currentPage: string;
  device: Device;
  editMode: boolean;
  leftMode: "layers" | "pages" | "add" | "assets";
  selection: { page: string; block: number | null } | null;
  inspectorTab: "content" | "layout" | "data" | "visibility";
  saveState: SaveState;
  onboarded: boolean;
  dismissedChecks: string[];

  /* publish machine */
  publishPhase: "idle" | "validating" | "ready" | "publishing" | "success" | "error";
  simulatePublishFail: boolean;
}

export interface CheckItem { msg: string; where: string }
export interface SiteCheck { blockers: CheckItem[]; warnings: CheckItem[] }
