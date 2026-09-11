import type { BuilderState, Property, Page, SiteCheck, SiteSnapshot } from "@/types";
import { ALL_PROPERTIES, OWNER, DOMAIN, FRESH } from "@/data/managr";
import { SECTIONS } from "@/features/sections/registry";

export const advActive = (s: BuilderState) =>
  ["advanced", "trial", "expiring", "payment_failed"].includes(s.plan);

export const canEdit = (s: BuilderState) => s.role !== "staff";
export const canPublish = (s: BuilderState) => s.role === "owner" || s.role === "manager";
export const canBilling = (s: BuilderState) => s.role === "owner";
export const structureLocked = (s: BuilderState) => !advActive(s);
export const brandingLocked = (s: BuilderState) => !advActive(s);

export const siteUrl = (s: BuilderState) => `${s.slug}.${DOMAIN}`;

export function properties(s: BuilderState): Property[] {
  if (s.propMode === "none") return [];
  if (s.propMode === "one") return [ALL_PROPERTIES[0]];
  return ALL_PROPERTIES;
}
export const publicProperties = (s: BuilderState) => properties(s).filter((p) => p.status === "live");

export const currentPage = (s: BuilderState): Page => s.pages.find((p) => p.id === s.currentPage) ?? s.pages[0];

export function ownerInfo(s: BuilderState, key: keyof BuilderState["info"]): string {
  if (key === "phone") return s.info.phone || OWNER.phone;
  if (key === "headline")
    return s.info.headline || `${OWNER.biz} — PG & Hostel stays in ${OWNER.area.split(",")[0]}`;
  if (key === "about")
    return (
      s.info.about ||
      "Comfortable, well-managed shared accommodation. Direct from the owner — no brokerage."
    );
  return s.info[key] || "";
}

export function needsData(s: BuilderState, type: keyof typeof SECTIONS): boolean {
  const meta = SECTIONS[type];
  if (meta.needs === "reviews") return publicProperties(s).every((p) => !p.reviews);
  if (meta.needs === "photos") return publicProperties(s).every((p) => !p.photos);
  return false;
}

export const sectionLocked = (s: BuilderState, type: keyof typeof SECTIONS) =>
  !!SECTIONS[type].advanced && !advActive(s);

export const staleProp = (s: BuilderState, p: Property) => s.availStale && p.updatedDaysAgo > FRESH.slightly;

const DESIGN_KEYS = ["theme", "brandColor", "fontPair", "shape", "layoutDensity"] as const;

export function snapshotOf(s: BuilderState): SiteSnapshot {
  return {
    pages: JSON.parse(JSON.stringify(s.pages)),
    theme: s.theme,
    brandColor: s.brandColor,
    fontPair: s.fontPair,
    shape: s.shape,
    layoutDensity: s.layoutDensity,
    globals: JSON.parse(JSON.stringify(s.globals)),
  };
}

/** the ManagR themes; keep light so selectors have no circular import */
const THEME_ACCENT: Record<string, string> = { modern: "#f7553d", family: "#b54708", premium: "#0b1a2b" };
export function siteAccent(s: BuilderState): string {
  return s.brandColor ?? THEME_ACCENT[s.theme] ?? "#f7553d";
}

export function draftDirty(s: BuilderState): boolean {
  if (!s.published) return true;
  const pick = (x: Pick<BuilderState, (typeof DESIGN_KEYS)[number]>) =>
    DESIGN_KEYS.map((k) => x[k]).join("|");
  return (
    JSON.stringify(s.pages) !== JSON.stringify(s.published.pages) ||
    JSON.stringify(s.globals) !== JSON.stringify(s.published.globals) ||
    pick(s) !== pick(s.published)
  );
}

export function respIssues(s: BuilderState) {
  const out: { msg: string; where: string; bp: string; fix?: string }[] = [];
  const home = s.pages[0].blocks.filter((b) => !b.hidden);
  if (home.find((b) => b.type === "highlights"))
    out.push({ msg: "Highlights: 3 columns may be cramped on mobile", where: "highlights", bp: "mobile", fix: "Stack on mobile" });
  if (s.globals.header.links.length >= 4)
    out.push({ msg: "Header: navigation links may overflow on mobile", where: "header", bp: "mobile", fix: "Use a menu on mobile" });
  return out.filter((i) => !s.dismissedChecks.includes(i.msg));
}

export function siteCheck(s: BuilderState): SiteCheck {
  const blockers: SiteCheck["blockers"] = [];
  const warnings: SiteCheck["warnings"] = [];
  const homeBlocks = s.pages[0].blocks.filter((b) => !b.hidden).map((b) => b.type);

  if (!s.slug || s.setup !== "done") blockers.push({ msg: "Your web address isn't claimed yet", where: "home" });
  if (!ownerInfo(s, "phone")) blockers.push({ msg: "No contact number — visitors can't reach you", where: "settings" });
  if (homeBlocks.includes("properties") && publicProperties(s).length === 0)
    blockers.push({ msg: "The Properties section is on, but no approved property is public", where: "properties" });
  if (homeBlocks.includes("enquiry") && !advActive(s))
    blockers.push({ msg: "Enquiry form needs Advanced to receive leads", where: "plan" });

  const hero = s.pages[0].blocks.find((b) => b.type === "hero" && !b.hidden);
  if (hero && !hero.data.headline) warnings.push({ msg: "Hero has no headline — a default will be used", where: "hero" });
  if (publicProperties(s).every((p) => !p.photos))
    warnings.push({ msg: "No property has photos — cards show a placeholder", where: "properties" });
  if (s.availOn && properties(s).some((p) => staleProp(s, p)))
    warnings.push({ msg: "One property's availability is stale — it won't show as live", where: "availability" });
  if (respIssues(s).length)
    warnings.push({ msg: `${respIssues(s).length} responsive issue(s) to review`, where: "responsive" });

  return { blockers, warnings: warnings.filter((w) => !s.dismissedChecks.includes(w.msg)) };
}

export function publishChanges(s: BuilderState): string {
  if (!s.published) return "First publish";
  const a = s.published;
  const parts: string[] = [];
  let secChanges = 0;
  a.pages.forEach((pp, i) => {
    const cur = s.pages[i];
    if (cur && JSON.stringify(pp.blocks) !== JSON.stringify(cur.blocks)) secChanges++;
  });
  if (secChanges) parts.push(`${secChanges} section change${secChanges > 1 ? "s" : ""}`);
  if (a.theme !== s.theme) parts.push("theme");
  if (
    a.brandColor !== s.brandColor ||
    a.fontPair !== s.fontPair ||
    a.shape !== s.shape ||
    a.layoutDensity !== s.layoutDensity
  )
    parts.push("design");
  if (JSON.stringify(a.globals) !== JSON.stringify(s.globals)) parts.push("header & footer");
  return parts.length ? parts.join(" · ") : "small edits";
}
