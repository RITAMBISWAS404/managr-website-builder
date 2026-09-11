/* ============================================================================
   WEBSITE SECTION CONTRACTS — the single source of truth.

   The editor, the section renderer, and the future template website all read
   THIS file. Rule: the editor may never expose a capability that is not in a
   section's contract, and a template variant may never add an owner-controllable
   capability that the editor does not expose.

   `WEBSITE-SECTION-CONTRACTS.md` is generated from this file (`npm run contracts`)
   — never edit the .md by hand.
   ========================================================================== */
import type { SectionType } from "@/types";

export type FieldType =
  | "text" | "longtext" | "choice" | "toggle" | "list" | "image" | "cta" | "auto";

export type DataSource =
  | "owner"              // owner types / chooses it in the editor
  | "managr-property"    // ManagR Properties (name, area, rent, rooms, photos, amenities)
  | "managr-inventory"   // ManagR live bed inventory / availability
  | "managr-tenant"      // ManagR Tenants (reviews only — never identity)
  | "settings"           // Website settings (address, contact, nav, brand)
  | "system"             // generated / fixed by the platform
  | "template";          // fixed copy that lives in the template variant

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  editable: boolean;
  source: DataSource;
  limit?: string;
  notes?: string;
}

export interface SectionContract {
  id: SectionType;
  name: string;
  purpose: string;
  plan: "basic" | "advanced";
  global: boolean;
  structural: boolean;
  singleInstance: boolean;
  duplicatable: boolean;

  content: ContentField[];

  layout: {
    /** curated, named layout choices the owner picks between */
    options: string[];
    /** structural rules the section always obeys */
    rules: string[];
    /** capabilities the owner NEVER gets — the guard for editor + template */
    forbidden: string[];
    responsive: { desktop: string; tablet: string; mobile: string };
  };

  design: {
    allowed: string[];
    forbidden: string[];
  };

  data: {
    /** ManagR / settings sources this section reads */
    dependsOn: string[];
    ownerControls: string[];
    notEditable: string[];
    /** hard privacy rules — the public site can never render these */
    privacy: string[];
  };

  /** every state the section + its inspector must handle */
  states: string[];

  /** exactly what the inspector exposes today (must equal derived registry fields) */
  editorControls: string[];

  /** contract every future template variant of this section must honour */
  variants: {
    max: number;
    baseline: string;
    mayVary: string[];
    neverAcrossVariants: string[];
  };

  notes?: string[];
}

const PRIVACY_ALWAYS = [
  "Never a tenant name, photo, phone number or document",
  "Never which bed a specific person is in",
  "Never the reason a bed is blocked",
  "Never the exact street address (approximate area only)",
];

const RESPONSIVE_STACK = {
  desktop: "as chosen layout",
  tablet: "inherits desktop; 3-up grids become 2-up",
  mobile: "single column, media above text, full-width CTAs",
};

const BASE_STATES = ["normal", "hidden (kept in the section list)", "unpublished changes"];

export const CONTRACTS: Record<SectionType, SectionContract> = {
  header: {
    id: "header", name: "Header / brand bar", purpose: "Site-wide identity, navigation and a call button.",
    plan: "basic", global: true, structural: true, singleInstance: true, duplicatable: false,
    content: [
      { key: "logotext", label: "Business name shown", type: "text", required: true, editable: true, source: "owner", limit: "1 line, ~40 chars", notes: "Falls back to the business name from Website settings." },
      { key: "logo", label: "Logo image", type: "image", required: false, editable: true, source: "owner", notes: "Advanced only. No logo → a generated monogram, never a broken image." },
      { key: "links", label: "Menu links", type: "list", required: false, editable: true, source: "owner", limit: "only pages that exist; order follows page order" },
      { key: "call", label: "Show a Call button", type: "toggle", required: false, editable: true, source: "owner" },
      { key: "sticky", label: "Keep the menu visible while scrolling", type: "toggle", required: false, editable: true, source: "owner" },
      { key: "phone", label: "Call button number", type: "auto", required: false, editable: false, source: "settings" },
    ],
    layout: { options: ["Default"], rules: ["Always first on every page", "Cannot be removed or reordered"], forbidden: ["Multiple headers", "Mega-menu / dropdown nav", "Search bar", "Language switcher", "Custom link URLs"], responsive: { desktop: "logo left, links centre/right, call button right", tablet: "same", mobile: "logo left, links collapse into a menu button, call button visible" } },
    design: { allowed: ["Sticky on/off", "Call button on/off"], forbidden: ["Header height", "Link spacing", "Custom colours (comes from Design → Colours)", "Transparency / overlay modes"] },
    data: { dependsOn: ["Website settings → business name", "Website settings → contact number", "Pages (for link targets)"], ownerControls: ["Business name text", "Which links show", "Call button on/off", "Sticky on/off"], notEditable: ["Call button phone number (from settings)", "Link URLs (auto from pages)"], privacy: [] },
    states: [...BASE_STATES, "Basic (fixed layout, wording editable)", "no logo (monogram)", "Advanced (logo upload)"],
    editorControls: ["logotext", "call", "sticky"],
    variants: { max: 3, baseline: "monogram/logo + menu links + optional call button", mayVary: ["logo vs wordmark", "link alignment", "call button style (filled / outline)"], neverAcrossVariants: ["dropdown menus", "search", "more than one CTA", "announcement bar baked in"] },
  },

  hero: {
    id: "hero", name: "Hero banner", purpose: "The first thing a visitor sees — one clear promise and one action.",
    plan: "basic", global: false, structural: false, singleInstance: true, duplicatable: false,
    content: [
      { key: "eyebrow", label: "Eyebrow (small line above the heading)", type: "text", required: false, editable: true, source: "owner", limit: "1 short line, ~30 chars" },
      { key: "headline", label: "Main heading", type: "text", required: true, editable: true, source: "owner", limit: "1 heading, ~60 chars", notes: "Falls back to a generated headline from the business name + area." },
      { key: "sub", label: "One line under it", type: "text", required: false, editable: true, source: "owner", limit: "1 sentence, ~120 chars" },
      { key: "btnAction", label: "Main button action", type: "choice", required: false, editable: true, source: "owner", limit: "call / WhatsApp / scroll to properties / hidden" },
      { key: "btn", label: "Main button wording", type: "text", required: false, editable: true, source: "owner", limit: "~20 chars" },
      { key: "secondaryCta", label: "Secondary button", type: "cta", required: false, editable: true, source: "owner", limit: "max 1; scroll target only", notes: "2 CTAs maximum on the whole section." },
      { key: "bg", label: "Background", type: "choice", required: false, editable: true, source: "owner", limit: "property photo / plain colour" },
      { key: "image", label: "Hero image", type: "image", required: false, editable: true, source: "managr-property", notes: "Chosen from your property photos in ManagR." },
    ],
    layout: { options: ["Image on top", "Image left / text right", "Text left / image right", "Image background", "Text only"], rules: ["One heading, one sub-line, at most two buttons", "Image is decorative — never the only way to get information"], forbidden: ["A third CTA", "Video background", "Carousel / slider", "Badge / logo row", "Stat counters", "Arbitrary content blocks"], responsive: RESPONSIVE_STACK },
    design: { allowed: ["Layout variant", "Text alignment (left / centre)", "Background style (photo / plain)", "Button style (from Design)"], forbidden: ["Font size", "Custom margins / padding", "Custom width", "Overlay opacity slider", "Absolute positioning"] },
    data: { dependsOn: ["Property photos (ManagR) for the image", "Website settings → contact number / WhatsApp for the button action"], ownerControls: ["All wording", "Which layout", "Which button action", "Which photo (from ManagR)"], notEditable: ["The photo file itself (managed in ManagR → Properties)"], privacy: PRIVACY_ALWAYS },
    states: [...BASE_STATES, "no headline (generated default used)", "no image chosen (plain colour)", "property photo missing in ManagR (plain colour fallback)"],
    editorControls: ["headline", "sub", "btnAction", "bg", "btn"],
    variants: { max: 3, baseline: "eyebrow? + heading + sub? + up to 2 CTAs + image?", mayVary: ["image position", "text alignment", "background treatment", "CTA arrangement"], neverAcrossVariants: ["3rd CTA", "video", "carousel", "stat row", "form embedded in the hero"] },
  },

  properties: {
    id: "properties", name: "Properties grid", purpose: "Your live rooms — name, area, rent and availability — pulled straight from ManagR.",
    plan: "basic", global: false, structural: false, singleInstance: true, duplicatable: false,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars", notes: "Defaults to “Our properties”." },
      { key: "which", label: "Which properties to show", type: "choice", required: true, editable: true, source: "owner", limit: "all approved / a chosen set" },
      { key: "order", label: "Order", type: "choice", required: false, editable: true, source: "owner", limit: "newest / featured first / most beds free" },
      { key: "cardStyle", label: "Card style", type: "choice", required: false, editable: true, source: "owner", limit: "with photo / compact" },
      { key: "propertyName", label: "Property name", type: "auto", required: true, editable: false, source: "managr-property" },
      { key: "propertyArea", label: "Area", type: "auto", required: true, editable: false, source: "managr-property", notes: "Approximate area only." },
      { key: "propertyRent", label: "Rent from", type: "auto", required: true, editable: false, source: "managr-property" },
      { key: "propertySharing", label: "Sharing types", type: "auto", required: false, editable: false, source: "managr-property" },
      { key: "propertyPhoto", label: "Property photo", type: "auto", required: false, editable: false, source: "managr-property" },
      { key: "availabilityBadge", label: "Availability badge", type: "auto", required: false, editable: false, source: "managr-inventory", notes: "Only shows if Live availability is on (Advanced). Controlled on the Live availability screen." },
    ],
    layout: { options: ["Photo cards", "Compact list", "2 per row", "3 per row"], rules: ["Cards are generated per approved property — the owner never builds a card", "A card with no photo shows a clean placeholder, never a broken image"], forbidden: ["Editing any property's name / rent / area / photos here", "Manually adding a property that isn't in ManagR", "Per-card custom copy", "More than 3 columns"], responsive: { desktop: "chosen columns", tablet: "2 columns", mobile: "1 column" } },
    design: { allowed: ["Column count / card style", "Section title", "Ordering", "Which properties"], forbidden: ["Card colours", "Card padding", "Per-card layout", "Font sizes"] },
    data: { dependsOn: ["ManagR → Properties (approved only)", "ManagR → live inventory (for the availability badge)", "Live availability settings (disclosure level, exact vs vague, from-date)"], ownerControls: ["Section title", "Which properties", "Order", "Card style / columns"], notEditable: ["Property name, area, rent, room types, photos — all from ManagR → Properties", "The availability numbers — from ManagR inventory"], privacy: [...PRIVACY_ALWAYS, "Only approved & public properties appear", "Bed-level detail only if the owner opted in on Live availability"] },
    states: [...BASE_STATES, "no approved properties (“New listings coming soon”)", "properties without photos (placeholder card)", "under-review property (hidden from the public grid)", "availability stale (badge hidden, owner warned on Website health)"],
    editorControls: ["which", "order", "cardStyle"],
    variants: { max: 3, baseline: "generated card per approved property: photo? + name + area + rent + sharing + availability badge?", mayVary: ["card shape", "column count", "photo aspect", "badge placement"], neverAcrossVariants: ["owner-authored card copy", "prices/areas typed by the owner", "a map view", "filtering UI on the public site"] },
  },

  featured: {
    id: "featured", name: "Featured property", purpose: "Put one property in the spotlight.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "prop", label: "Property to feature", type: "choice", required: true, editable: true, source: "owner", limit: "one approved property" },
      { key: "propertyDetails", label: "Name / area / rent / photo", type: "auto", required: true, editable: false, source: "managr-property" },
      { key: "availabilityBadge", label: "Availability badge", type: "auto", required: false, editable: false, source: "managr-inventory" },
    ],
    layout: { options: ["Default"], rules: ["One property only"], forbidden: ["Editing the property's data", "Featuring a non-approved property", "More than one property"], responsive: RESPONSIVE_STACK },
    design: { allowed: ["Which property"], forbidden: ["Card style", "Colours", "Custom copy"] },
    data: { dependsOn: ["ManagR → Properties", "ManagR → inventory"], ownerControls: ["Which property is featured"], notEditable: ["All property data"], privacy: PRIVACY_ALWAYS },
    states: [...BASE_STATES, "chosen property removed / unapproved in ManagR (section auto-hides)", "no approved properties"],
    editorControls: ["prop"],
    variants: { max: 3, baseline: "one property: large photo + name + area + rent + availability", mayVary: ["image size / position", "detail density"], neverAcrossVariants: ["multiple properties", "owner-typed description"] },
  },

  areas: {
    id: "areas", name: "Areas covered", purpose: "Show the neighbourhoods you have buildings in.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "items", label: "Areas to list", type: "list", required: true, editable: true, source: "owner", limit: "chosen from your properties' areas", notes: "The list of areas comes from ManagR; the owner ticks which to show." },
    ],
    layout: { options: ["Default"], rules: ["Areas are a chip list generated from your properties"], forbidden: ["Typing an area you don't have a property in", "Exact addresses"], responsive: { desktop: "chip row", tablet: "chip row wraps", mobile: "chip row wraps" } },
    design: { allowed: ["Which areas show"], forbidden: ["Chip colours", "Layout", "Custom labels"] },
    data: { dependsOn: ["ManagR → Properties → location (area only)"], ownerControls: ["Which areas appear"], notEditable: ["The area names"], privacy: [...PRIVACY_ALWAYS] },
    states: [...BASE_STATES, "only one area (still valid)", "no properties"],
    editorControls: [],
    variants: { max: 2, baseline: "chip list of area names", mayVary: ["chip style", "alignment"], neverAcrossVariants: ["a map", "counts per area typed by owner"] },
  },

  highlights: {
    id: "highlights", name: "Highlights", purpose: "The handful of things residents actually care about.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: true,
    content: [
      { key: "items", label: "Highlights to show", type: "list", required: true, editable: true, source: "owner", limit: "3–6 items, chosen from your amenities", notes: "Options come from ManagR → Amenities; the owner ticks 3–6." },
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars", notes: "Defaults to “Why residents choose us”." },
    ],
    layout: { options: ["3 across", "2 across", "Icon list"], rules: ["Each highlight is an icon + a short label", "3–6 items"], forbidden: ["A paragraph per highlight", "Custom icons / images", "More than 6 items"], responsive: { desktop: "chosen columns", tablet: "2 across", mobile: "2 across or list" } },
    design: { allowed: ["Column count / list style", "Which highlights", "Section title"], forbidden: ["Icon choice", "Colours", "Per-item styling"] },
    data: { dependsOn: ["ManagR → Properties → Amenities (option list)"], ownerControls: ["Which highlights", "Layout", "Title"], notEditable: ["The amenity list itself"], privacy: [] },
    states: [...BASE_STATES, "fewer than 3 chosen (defaults filled in)", "no amenities on any property"],
    editorControls: [],
    variants: { max: 3, baseline: "3–6 × (icon + short label), optional title", mayVary: ["columns vs list", "icon container style"], neverAcrossVariants: ["long text per item", "images per item", "more than 6"] },
  },

  trust: {
    id: "trust", name: "Trust banner", purpose: "A single reassuring line that converts.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "text", label: "Banner text", type: "auto", required: true, editable: false, source: "template", notes: "Fixed wording — “Direct from owner · No brokerage” — because it performs. The owner can hide the section but not reword it." },
    ],
    layout: { options: ["Default"], rules: ["One line, centred"], forbidden: ["Rewording", "Multiple lines", "Adding a CTA"], responsive: { desktop: "centred pill", tablet: "centred pill", mobile: "centred pill, wraps" } },
    design: { allowed: ["Show / hide the whole section"], forbidden: ["Text", "Colour", "Icon"] },
    data: { dependsOn: [], ownerControls: ["Show / hide"], notEditable: ["The wording"], privacy: [] },
    states: [...BASE_STATES],
    editorControls: [],
    variants: { max: 2, baseline: "one fixed line + shield icon", mayVary: ["pill vs full-width bar", "icon on/off"], neverAcrossVariants: ["owner-editable text", "CTA", "multiple claims"] },
  },

  reviews: {
    id: "reviews", name: "Reviews", purpose: "Real resident reviews, pulled from ManagR.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars", notes: "Defaults to “What residents say”." },
      { key: "reviewText", label: "Review text", type: "auto", required: true, editable: false, source: "managr-tenant" },
      { key: "reviewAttribution", label: "Attribution", type: "auto", required: true, editable: false, source: "system", notes: "Always shown as “Verified resident” — never a name." },
    ],
    layout: { options: ["Default"], rules: ["Reviews are generated from ManagR", "Attribution is always anonymous"], forbidden: ["Typing a review", "Editing a review", "Showing the reviewer's name / photo", "Star-rating widgets the owner sets"], responsive: { desktop: "2-up", tablet: "2-up", mobile: "1-up" } },
    design: { allowed: ["Section title", "How many show"], forbidden: ["Review text", "Attribution", "Colours"] },
    data: { dependsOn: ["ManagR → Tenants → Reviews (text only)"], ownerControls: ["Section title", "Which / how many reviews feature"], notEditable: ["The review text", "The attribution"], privacy: [...PRIVACY_ALWAYS, "Reviewer identity is never shown"] },
    states: ["no reviews yet (section auto-hides on the live site; editor shows a “nothing to show yet” note)", ...BASE_STATES],
    editorControls: [],
    variants: { max: 3, baseline: "quote text + “Verified resident”", mayVary: ["card vs slider", "columns"], neverAcrossVariants: ["reviewer names/photos", "owner-authored testimonials", "editable star ratings"] },
  },

  about: {
    id: "about", name: "About us", purpose: "Your story in a few lines, with one photo.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars" },
      { key: "text", label: "Your story", type: "longtext", required: true, editable: true, source: "owner", limit: "1 paragraph, ~400 chars" },
      { key: "photo", label: "Photo", type: "choice", required: false, editable: true, source: "managr-property", limit: "one property photo (or upload on Advanced)" },
    ],
    layout: { options: ["Text + photo", "Photo + text", "Text only"], rules: ["One paragraph, one photo"], forbidden: ["Multiple paragraphs with headings", "A team grid", "Timeline / milestones", "Video"], responsive: RESPONSIVE_STACK },
    design: { allowed: ["Layout variant", "Photo side", "Section title"], forbidden: ["Font size", "Rich text formatting", "Multiple images"] },
    data: { dependsOn: ["Property photos (ManagR) for the image"], ownerControls: ["The paragraph", "Layout", "Which photo"], notEditable: ["The photo file (managed in ManagR)"], privacy: PRIVACY_ALWAYS },
    states: [...BASE_STATES, "no text (default copy used)", "no photo (text-only layout)"],
    editorControls: ["text", "photo"],
    variants: { max: 3, baseline: "title? + one paragraph + one photo?", mayVary: ["photo position", "text alignment", "photo shape"], neverAcrossVariants: ["multiple photos", "headings inside the text", "team members", "stats"] },
  },

  richtext: {
    id: "richtext", name: "Rich text", purpose: "A free block of words — house rules, meal menu, anything.",
    plan: "advanced", global: false, structural: false, singleInstance: false, duplicatable: true,
    content: [
      { key: "text", label: "Text", type: "longtext", required: true, editable: true, source: "owner", limit: "plain paragraphs + simple lists, ~1500 chars" },
    ],
    layout: { options: ["Default"], rules: ["Plain paragraphs and bullet lists only"], forbidden: ["Embeds / iframes", "Custom HTML", "Images inside the text", "Columns"], responsive: { desktop: "single readable column, max ~640px", tablet: "single column", mobile: "single column" } },
    design: { allowed: ["Bold / bullets (basic)"], forbidden: ["Font size", "Colours", "Custom width", "HTML"] },
    data: { dependsOn: [], ownerControls: ["The text"], notEditable: [], privacy: PRIVACY_ALWAYS },
    states: [...BASE_STATES, "empty (placeholder shown in editor, section hidden on live site)"],
    editorControls: ["text"],
    variants: { max: 2, baseline: "one text block, constrained width", mayVary: ["alignment", "max width"], neverAcrossVariants: ["media", "columns", "raw HTML"] },
  },

  gallery: {
    id: "gallery", name: "Photo gallery", purpose: "A wall of photos from across your properties.",
    plan: "advanced", global: false, structural: false, singleInstance: false, duplicatable: true,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars" },
      { key: "photos", label: "Which photos", type: "list", required: true, editable: true, source: "managr-property", limit: "chosen from your property photos; 6–12 recommended" },
      { key: "arrangement", label: "Arrangement", type: "choice", required: false, editable: true, source: "owner", limit: "grid / rows" },
    ],
    layout: { options: ["Grid", "Rows", "Masonry"], rules: ["Photos are chosen from ManagR, never uploaded here", "Safe aspect ratios; broken images never break the layout"], forbidden: ["Uploading photos in this section", "Captions per photo", "Lightbox-only content", "Video"], responsive: { desktop: "chosen arrangement", tablet: "2–3 columns", mobile: "2 columns" } },
    design: { allowed: ["Arrangement", "Which photos", "Section title"], forbidden: ["Per-photo cropping controls", "Colours", "Spacing"] },
    data: { dependsOn: ["ManagR → Properties → Photos"], ownerControls: ["Which photos", "Arrangement", "Title"], notEditable: ["The photo files"], privacy: PRIVACY_ALWAYS },
    states: ["no photos on any property (section auto-hides; editor shows a note + link to add photos in ManagR)", ...BASE_STATES],
    editorControls: [],
    variants: { max: 3, baseline: "6–12 photos in a grid/rows layout", mayVary: ["grid vs masonry vs rows", "column count", "gap"], neverAcrossVariants: ["captions", "owner uploads here", "video tiles"] },
  },

  faq: {
    id: "faq", name: "FAQ", purpose: "Answer the questions people always ask and cut repeat calls.",
    plan: "advanced", global: false, structural: false, singleInstance: false, duplicatable: true,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars" },
      { key: "items", label: "Questions & answers", type: "list", required: true, editable: true, source: "owner", limit: "3–10 Q&A; question ~80 chars, answer ~300 chars" },
    ],
    layout: { options: ["Default (accordion)"], rules: ["Each item is one question + one short answer", "Accordion — one open at a time"], forbidden: ["Rich media in answers", "Links styled as buttons", "Nested questions", "More than 10"], responsive: { desktop: "single column accordion", tablet: "single column", mobile: "single column" } },
    design: { allowed: ["Section title", "Which Q&A, order"], forbidden: ["Colours", "Answer formatting beyond plain text"] },
    data: { dependsOn: [], ownerControls: ["Every question and answer", "Order"], notEditable: [], privacy: PRIVACY_ALWAYS },
    states: [...BASE_STATES, "no items (default starter questions offered in the editor)"],
    editorControls: [],
    variants: { max: 2, baseline: "accordion of Q&A", mayVary: ["single vs two column at desktop", "divider style"], neverAcrossVariants: ["media answers", "more than 10 items", "CTA inside an answer"] },
  },

  enquiry: {
    id: "enquiry", name: "Enquiry form", purpose: "Turn a visitor into a CRM lead in a few taps.",
    plan: "advanced", global: false, structural: false, singleInstance: true, duplicatable: false,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars" },
      { key: "fields", label: "Optional questions", type: "list", required: false, editable: true, source: "owner", limit: "pick from: looking-for, move-in date, budget. Name & phone are always asked." },
      { key: "fab", label: "Floating “Enquire” button on mobile", type: "toggle", required: false, editable: true, source: "owner" },
      { key: "destination", label: "Where leads go", type: "auto", required: true, editable: false, source: "system", notes: "Always Leads & CRM, tagged “Website”. Not configurable." },
    ],
    layout: { options: ["Default"], rules: ["Name + phone required; up to 3 optional fields", "Submissions create a CRM lead — nothing else"], forbidden: ["Custom fields the CRM can't store", "File uploads", "Payment inside the form", "Sending to an email / webhook the owner types"], responsive: { desktop: "inline form", tablet: "inline form", mobile: "inline form + optional floating button" } },
    design: { allowed: ["Section title", "Which optional fields", "Mobile floating button on/off", "Button style (from Design)"], forbidden: ["Field order", "Field labels", "Colours", "Multi-step"] },
    data: { dependsOn: ["ManagR → Leads & CRM (destination)"], ownerControls: ["Title", "Optional fields", "Floating button"], notEditable: ["Name / phone always asked", "Where leads go", "Lead tag"], privacy: [...PRIVACY_ALWAYS, "Visitor data goes only to the owner's CRM"] },
    states: [...BASE_STATES, "Basic (locked — shows an “Available with Advanced” panel in the editor and a placeholder on the canvas)", "duplicate submission (visitor told they already enquired)", "validation error", "submit failure (retry)"],
    editorControls: ["fab"],
    variants: { max: 2, baseline: "name + phone + up to 3 optional fields + submit", mayVary: ["single column vs two column at desktop", "inline vs card container"], neverAcrossVariants: ["extra fields", "uploads", "multi-step", "owner-set destination"] },
  },

  visit: {
    id: "visit", name: "Visit booking", purpose: "Let visitors book a viewing in the slots you allow.",
    plan: "advanced", global: false, structural: false, singleInstance: true, duplicatable: false,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars" },
      { key: "props", label: "Properties that accept visits", type: "list", required: true, editable: true, source: "owner", limit: "chosen from your approved properties" },
      { key: "schedule", label: "Days, slots, notice, capacity, visit types", type: "auto", required: true, editable: false, source: "settings", notes: "All set on the Visit settings screen — not in the editor." },
    ],
    layout: { options: ["Default"], rules: ["The section is an entry point; the booking flow is a fixed 4-step flow (property → need → date → time → details)"], forbidden: ["Editing the booking steps", "Adding fields to the booking flow", "Changing slot logic here"], responsive: { desktop: "prompt + button → flow", tablet: "same", mobile: "same, full-screen flow" } },
    design: { allowed: ["Section title", "Which properties", "Button style (from Design)"], forbidden: ["The booking flow itself", "Slot rules", "Colours"] },
    data: { dependsOn: ["Visit settings (days, slots, blackout, capacity, notice, horizon, visit types)", "ManagR → Properties", "ManagR → inventory (free-from dates)"], ownerControls: ["Title", "Which properties accept visits"], notEditable: ["Everything about the schedule — set on Visit settings", "Bookings land in Scheduled Visits tagged “Website”"], privacy: [...PRIVACY_ALWAYS] },
    states: [...BASE_STATES, "Basic (locked panel)", "no slots configured (owner prompted to set Visit settings)", "no properties accept visits", "slot taken during booking (visitor offered nearby times)", "same-day booking (one-time code)"],
    editorControls: [],
    variants: { max: 2, baseline: "title + short line + button that opens the fixed booking flow", mayVary: ["inline mini-calendar preview vs button only", "container style"], neverAcrossVariants: ["editing the flow", "extra steps", "custom fields", "owner-set slot logic"] },
  },

  bookcta: {
    id: "bookcta", name: "Booking request CTA", purpose: "Let a visitor request a bed from a move-in date.",
    plan: "advanced", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "text", label: "CTA wording", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars", notes: "Defaults to “Ready to move in?”." },
      { key: "flow", label: "Request flow", type: "auto", required: true, editable: false, source: "system", notes: "Fixed: room type → move-in date → availability check → request → owner approves/declines. Payment slots in later without changing the flow." },
    ],
    layout: { options: ["Default"], rules: ["An entry point to the fixed request flow"], forbidden: ["Editing the request flow", "Collecting payment here (yet)"], responsive: RESPONSIVE_STACK },
    design: { allowed: ["CTA wording", "Button style"], forbidden: ["The flow", "Colours", "Fields"] },
    data: { dependsOn: ["ManagR → inventory (availability check)", "ManagR → Properties (room types)"], ownerControls: ["CTA wording"], notEditable: ["The request flow", "Availability logic"], privacy: PRIVACY_ALWAYS },
    states: [...BASE_STATES, "Basic (locked panel)", "requested date unavailable (visitor offered the earliest valid date)", "request pending / approved / declined"],
    editorControls: [],
    variants: { max: 2, baseline: "short line + one button", mayVary: ["banner vs card", "icon on/off"], neverAcrossVariants: ["multiple buttons", "a form", "owner-set availability rules"] },
  },

  offer: {
    id: "offer", name: "Offer banner", purpose: "A time-boxed promotion that shows and hides itself.",
    plan: "advanced", global: false, structural: false, singleInstance: false, duplicatable: true,
    content: [
      { key: "text", label: "Offer text", type: "text", required: true, editable: true, source: "owner", limit: "1 line, ~50 chars" },
      { key: "from", label: "Show from", type: "text", required: false, editable: true, source: "owner", limit: "date" },
      { key: "until", label: "Hide after", type: "text", required: false, editable: true, source: "owner", limit: "date" },
      { key: "colour", label: "Colour", type: "choice", required: false, editable: true, source: "owner", limit: "from your brand palette only" },
    ],
    layout: { options: ["Default"], rules: ["One line", "Auto shows/hides on the dates"], forbidden: ["A CTA button", "Multiple lines", "Images", "Custom hex colours"], responsive: { desktop: "full-width bar or centred pill", tablet: "same", mobile: "same, wraps" } },
    design: { allowed: ["Colour (from palette)", "Schedule"], forbidden: ["Custom colours", "Font", "A button"] },
    data: { dependsOn: ["Design → Colours (palette)"], ownerControls: ["Text", "Dates", "Colour from palette"], notEditable: [], privacy: [] },
    states: [...BASE_STATES, "outside the date window (hidden on the live site, visible in the editor with a note)", "no dates (always shown)"],
    editorControls: ["text"],
    variants: { max: 2, baseline: "one line + scheduled visibility", mayVary: ["bar vs pill", "colour from palette"], neverAcrossVariants: ["a CTA", "images", "custom colours", "countdown timer"] },
  },

  contact: {
    id: "contact", name: "Contact block", purpose: "Phone, WhatsApp, email and an approximate map.",
    plan: "basic", global: false, structural: false, singleInstance: false, duplicatable: false,
    content: [
      { key: "title", label: "Section title", type: "text", required: false, editable: true, source: "owner", limit: "~40 chars" },
      { key: "methods", label: "Which contact methods show", type: "list", required: true, editable: true, source: "owner", limit: "pick from: phone, WhatsApp, email, approximate map, opening hours" },
      { key: "phone", label: "Phone / WhatsApp / email", type: "auto", required: true, editable: false, source: "settings" },
      { key: "map", label: "Map", type: "auto", required: false, editable: false, source: "system", notes: "General area only — the exact street address is never shown, on any plan." },
    ],
    layout: { options: ["Stacked", "Two columns"], rules: ["Contact details come from Website settings", "Map is approximate area only"], forbidden: ["Typing contact details here", "A precise-pin map", "A contact form (that's the Enquiry form section)"], responsive: { desktop: "chosen layout", tablet: "stacked", mobile: "stacked" } },
    design: { allowed: ["Layout variant", "Which methods", "Section title"], forbidden: ["Colours", "Map zoom / pin precision", "Editing the numbers"] },
    data: { dependsOn: ["Website settings → Contact (phone, WhatsApp, email, office area)"], ownerControls: ["Title", "Which methods show", "Layout"], notEditable: ["The phone / WhatsApp / email values (edit them once in Website settings)", "Map precision"], privacy: [...PRIVACY_ALWAYS, "Map is always the approximate area, never a precise pin"] },
    states: [...BASE_STATES, "email left blank in settings (email row hidden)"],
    editorControls: [],
    variants: { max: 3, baseline: "chosen contact rows + optional approximate map", mayVary: ["stacked vs columns", "map on a side vs full width"], neverAcrossVariants: ["a form", "precise map pin", "owner-typed contact values"] },
  },

  wacta: {
    id: "wacta", name: "WhatsApp bar", purpose: "A WhatsApp button that follows the visitor as they scroll.",
    plan: "advanced", global: true, structural: false, singleInstance: true, duplicatable: false,
    content: [
      { key: "text", label: "Button wording", type: "text", required: false, editable: true, source: "owner", limit: "~24 chars", notes: "Defaults to “Chat with us”." },
      { key: "number", label: "WhatsApp number", type: "auto", required: true, editable: false, source: "settings" },
    ],
    layout: { options: ["Default"], rules: ["Floating, bottom of the viewport, on every page"], forbidden: ["Moving it", "Multiple floating buttons", "A call button here (that's the header)"], responsive: { desktop: "bottom-right floating pill", tablet: "same", mobile: "full-width bottom bar" } },
    design: { allowed: ["Button wording", "Show / hide"], forbidden: ["Position", "Colour (fixed WhatsApp green)", "Size"] },
    data: { dependsOn: ["Website settings → WhatsApp number"], ownerControls: ["Wording", "Show / hide"], notEditable: ["The number", "The colour / position"], privacy: [] },
    states: [...BASE_STATES, "Advanced only"],
    editorControls: ["text"],
    variants: { max: 2, baseline: "floating WhatsApp pill / bar", mayVary: ["pill vs bar on mobile", "icon + text vs icon only"], neverAcrossVariants: ["repositioning", "colour changes", "multiple actions"] },
  },

  footer: {
    id: "footer", name: "Footer", purpose: "Contact details and a link back to you, on every page.",
    plan: "basic", global: true, structural: true, singleInstance: true, duplicatable: false,
    content: [
      { key: "fields", label: "Details shown", type: "list", required: false, editable: true, source: "owner", limit: "pick from: phone, WhatsApp, email, office area, Instagram" },
      { key: "powered", label: "Show “Powered by ManagR”", type: "toggle", required: false, editable: true, source: "owner", notes: "Advanced can turn it off; on Basic it stays on." },
      { key: "contactValues", label: "Contact values", type: "auto", required: true, editable: false, source: "settings" },
    ],
    layout: { options: ["Default"], rules: ["Always last on every page", "Cannot be removed or reordered"], forbidden: ["Multiple footers", "Nav columns / sitemap", "A newsletter form", "Custom links"], responsive: { desktop: "single row / few columns", tablet: "stacked", mobile: "stacked" } },
    design: { allowed: ["Which detail rows show", "“Powered by ManagR” on/off (Advanced)"], forbidden: ["Colours", "Layout", "Editing the values"] },
    data: { dependsOn: ["Website settings → Contact + Social"], ownerControls: ["Which rows show", "“Powered by” toggle (Advanced)"], notEditable: ["The contact / social values (from settings)"], privacy: [...PRIVACY_ALWAYS] },
    states: [...BASE_STATES, "Basic (“Powered by ManagR” forced on)"],
    editorControls: ["powered"],
    variants: { max: 2, baseline: "chosen contact rows + “Powered by ManagR”", mayVary: ["single row vs stacked", "social icons vs text links"], neverAcrossVariants: ["sitemap columns", "newsletter form", "custom links"] },
  },
};

/* ---- drift guard: every editor control must be a real content field ---- */
export function verifyContract(id: SectionType, exposedKeys: string[]): string[] {
  const c = CONTRACTS[id];
  const known = new Set(c.content.map((f) => f.key));
  const problems: string[] = [];
  for (const k of exposedKeys) {
    if (!known.has(k)) problems.push(`editor exposes "${k}" which is not in the ${id} contract`);
  }
  for (const k of c.editorControls) {
    if (!exposedKeys.includes(k)) problems.push(`${id} contract lists editorControl "${k}" but the inspector does not expose it`);
  }
  return problems;
}

/* ---- markdown generator (source for WEBSITE-SECTION-CONTRACTS.md) ---- */
const SRC_LABEL: Record<DataSource, string> = {
  owner: "Owner", "managr-property": "ManagR · Properties", "managr-inventory": "ManagR · Inventory",
  "managr-tenant": "ManagR · Tenants", settings: "Website settings", system: "System", template: "Template (fixed)",
};

export function renderContractsMarkdown(): string {
  const order: SectionType[] = [
    "header", "hero", "properties", "featured", "areas", "highlights", "trust", "reviews",
    "about", "richtext", "gallery", "faq", "enquiry", "visit", "bookcta", "offer", "contact", "wacta", "footer",
  ];
  const lines: string[] = [];
  lines.push("# ManagR Website — Section Contracts");
  lines.push("");
  lines.push("> **Generated** from `src/features/sections/contracts.ts` — run `npm run contracts`. Do not edit by hand.");
  lines.push("");
  lines.push("This is the single source of truth shared by three things that must never drift apart:");
  lines.push("");
  lines.push("```");
  lines.push("EDITOR  ⇅  SECTION CONTRACT  ⇅  TEMPLATE IMPLEMENTATION");
  lines.push("```");
  lines.push("");
  lines.push("**Rule 1** — the editor must never expose a capability that is not in a section's contract.");
  lines.push("**Rule 2** — a template variant must never add an owner-controllable capability the editor does not expose.");
  lines.push("**Rule 3** — the future template website implements *exactly* the model below, per section, per variant.");
  lines.push("");
  lines.push("Privacy rules marked 🔒 are enforced by the render layer and re-checked at publish — they can never be toggled off.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Controls every section shares");
  lines.push("");
  lines.push("These are exposed by the inspector's **Layout** tab for every non-locked section and are");
  lines.push("in addition to the per-section controls documented below. Every template variant must honour them.");
  lines.push("");
  lines.push("| Control | Values | Notes |");
  lines.push("|---|---|---|");
  lines.push("| Layout / style | the section's named variants | shown in the inspector as a visual mini-preview grid, one choice active |");
  lines.push("| Section spacing | cosy · compact · roomy | vertical padding only — never arbitrary margins |");
  lines.push("| Show on screen | Desktop · Tablet · Phone | per-screen show/hide; content and layout stay identical across screens |");
  lines.push("| Hide whole section | on / off | kept in the section list; never renders a visible empty box on the live site |");
  lines.push("| Reorder | drag / ⌥↑ ⌥↓ / move up-down | header stays first, footer stays last, globals excluded |");
  lines.push("");
  lines.push("The inspector is one scrolling panel with collapsible **Content · Layout · Visibility · Data**");
  lines.push("groups (no tabs). The **Data** group is read-only — it lists the ManagR values the section binds to.");
  lines.push("Colours, fonts and corner radius are **global** (Design panel), never per-section.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Section index");
  lines.push("");
  lines.push("| Section | Plan | Scope | Instances | Layout options | Future variants |");
  lines.push("|---|---|---|---|---|---|");
  for (const id of order) {
    const c = CONTRACTS[id];
    const scope = c.global ? "Global" : c.structural ? "Structural" : "Page";
    const inst = c.singleInstance ? "one per page" : c.duplicatable ? "many" : "one or more";
    lines.push(`| **${c.name}** | ${c.plan === "advanced" ? "Advanced" : "Basic"} | ${scope} | ${inst} | ${c.layout.options.length} | up to ${c.variants.max} |`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const id of order) {
    const c = CONTRACTS[id];
    lines.push(`## ${c.name}`);
    lines.push("");
    lines.push(`**Purpose.** ${c.purpose}`);
    lines.push("");
    lines.push(`**Plan** ${c.plan === "advanced" ? "Advanced" : "Basic"} · **Scope** ${c.global ? "global (shows on every page)" : c.structural ? "structural" : "page section"} · **Instances** ${c.singleInstance ? "one per page" : c.duplicatable ? "duplicatable" : "one or more"}`);
    lines.push("");
    lines.push("### Content fields");
    lines.push("");
    lines.push("| Field | Type | Required | Editable | Source | Limit |");
    lines.push("|---|---|---|---|---|---|");
    for (const f of c.content) {
      lines.push(`| ${f.label} | ${f.type} | ${f.required ? "yes" : "—"} | ${f.editable ? "yes" : "**no**"} | ${SRC_LABEL[f.source]} | ${f.limit ?? "—"} |`);
    }
    const noteFields = c.content.filter((f) => f.notes);
    if (noteFields.length) {
      lines.push("");
      for (const f of noteFields) lines.push(`- *${f.label}* — ${f.notes}`);
    }
    lines.push("");
    lines.push("### Layout contract");
    lines.push("");
    lines.push(`- **Options (owner picks one):** ${c.layout.options.join(" · ")}`);
    for (const r of c.layout.rules) lines.push(`- ${r}`);
    lines.push(`- **Never (guards editor + template):** ${c.layout.forbidden.join(" · ")}`);
    lines.push(`- **Responsive:** desktop — ${c.layout.responsive.desktop}; tablet — ${c.layout.responsive.tablet}; mobile — ${c.layout.responsive.mobile}`);
    lines.push("");
    lines.push("### Design controls");
    lines.push("");
    lines.push(`- **Allowed (section-specific):** ${c.design.allowed.length ? c.design.allowed.join(" · ") : "show / hide only"}`);
    lines.push("- **Plus the shared controls:** section spacing · per-screen show/hide · hide whole section");
    lines.push(`- **Never:** ${c.design.forbidden.join(" · ")}`);
    lines.push("");
    lines.push("### Data & privacy");
    lines.push("");
    if (c.data.dependsOn.length) lines.push(`- **Reads from:** ${c.data.dependsOn.join(" · ")}`);
    lines.push(`- **Owner controls:** ${c.data.ownerControls.length ? c.data.ownerControls.join(" · ") : "—"}`);
    if (c.data.notEditable.length) lines.push(`- **Not editable here:** ${c.data.notEditable.join(" · ")}`);
    for (const p of c.data.privacy) lines.push(`- 🔒 ${p}`);
    lines.push("");
    lines.push("### Editor controls exposed today");
    lines.push("");
    lines.push(c.editorControls.length ? c.editorControls.map((k) => `\`${k}\``).join(" · ") : "_show / hide only — no per-field controls_");
    lines.push("");
    lines.push("### States");
    lines.push("");
    for (const s of c.states) lines.push(`- ${s}`);
    lines.push("");
    lines.push("### Future variant contract");
    lines.push("");
    lines.push(`- **Up to ${c.variants.max} designed variants.**`);
    lines.push(`- **Every variant must support:** ${c.variants.baseline}`);
    lines.push(`- **May vary between variants:** ${c.variants.mayVary.join(" · ")}`);
    lines.push(`- **No variant may add:** ${c.variants.neverAcrossVariants.join(" · ")}`);
    if (c.notes?.length) {
      lines.push("");
      lines.push("### Notes");
      lines.push("");
      for (const n of c.notes) lines.push(`- ${n}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push("## How the three layers stay aligned");
  lines.push("");
  lines.push("1. **`contracts.ts`** (this file) is edited first for any capability change.");
  lines.push("2. **`registry.ts`** `content` schema drives the inspector; `verifyContract()` fails the build if the inspector exposes a field not in the contract, or omits one the contract promises.");
  lines.push("3. **`SectionCanvas.tsx`** renders only fields the contract marks editable/auto.");
  lines.push("4. **The future template project** imports `CONTRACTS` and implements each variant against `variants.baseline` / `mayVary` / `neverAcrossVariants`.");
  lines.push("");
  return lines.join("\n");
}
