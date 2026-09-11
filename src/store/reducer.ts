import type { BuilderState, Block, SiteSnapshot, SectionType, Device, PublishVersion } from "@/types";
import { SECTIONS } from "@/features/sections/registry";
import { makeBlock, freshPages } from "./initialState";
import { structureLocked, currentPage, snapshotOf, publishChanges } from "./selectors";
import { uid, clone } from "@/lib/utils";
import { TEMPLATES } from "@/data/managr";

function applySnap(snap: SiteSnapshot): Partial<BuilderState> {
  return {
    pages: clone(snap.pages),
    theme: snap.theme,
    brandColor: snap.brandColor ?? null,
    fontPair: snap.fontPair ?? "modern",
    shape: snap.shape ?? "soft",
    layoutDensity: snap.layoutDensity ?? "balanced",
    globals: clone(snap.globals),
  };
}

export type Action =
  | { type: "patch"; patch: Partial<BuilderState> }
  | { type: "select"; block: number | null }
  | { type: "leftMode"; mode: BuilderState["leftMode"] }
  | { type: "device"; device: Device }
  | { type: "editMode"; on: boolean }
  | { type: "inspectorTab"; tab: BuilderState["inspectorTab"] }
  | { type: "setPage"; id: string }
  | { type: "addBlock"; sectionType: SectionType }
  | { type: "removeBlock"; index: number }
  | { type: "moveBlock"; index: number; dir: -1 | 1 }
  | { type: "reorderBlock"; from: number; to: number }
  | { type: "hideBlock"; index: number; hidden?: boolean }
  | { type: "dupBlock"; index: number }
  | { type: "updateBlockData"; index: number; key: string; value: unknown }
  | { type: "blockLayout"; index: number; layout: string }
  | { type: "blockDense"; index: number; dense: Block["dense"] }
  | { type: "blockVisibility"; index: number; device: Device; visible: boolean }
  | { type: "setTheme"; theme: string }
  | { type: "setDesign"; patch: Partial<Pick<BuilderState, "brandColor" | "fontPair" | "shape" | "layoutDensity">> }
  | { type: "setHeader"; patch: Partial<BuilderState["globals"]["header"]> }
  | { type: "setFooter"; patch: Partial<BuilderState["globals"]["footer"]> }
  | { type: "applyTemplate"; key: string }
  | { type: "addPage"; kind: string }
  | { type: "pageAction"; kind: "sethome" | "dup" | "del" | "rename" | "nav" | "hide"; id: string; name?: string }
  | { type: "publish" }
  | { type: "publishResult"; ok: boolean }
  | { type: "discardDraft" }
  | { type: "restoreVersion"; snap: SiteSnapshot }
  | { type: "restoreSnapshot"; snap: SiteSnapshot } // undo/redo
  | { type: "dismissCheck"; msg: string }
  | { type: "restoreChecks" }
  | { type: "markSaved"; state: BuilderState["saveState"] };

const cp = (s: BuilderState) => currentPage(s);
const withPages = (s: BuilderState, pages: BuilderState["pages"]): BuilderState => ({ ...s, pages });

function mapCurrentBlocks(s: BuilderState, fn: (blocks: Block[]) => Block[]): BuilderState {
  return withPages(
    s,
    s.pages.map((pg) => (pg.id === s.currentPage ? { ...pg, blocks: fn(clone(pg.blocks)) } : pg)),
  );
}

export function reducer(s: BuilderState, a: Action): BuilderState {
  switch (a.type) {
    case "patch":
      return { ...s, ...a.patch };

    case "select":
      return { ...s, selection: a.block == null ? null : { page: s.currentPage, block: a.block } };

    case "leftMode":
      return { ...s, leftMode: a.mode };
    case "device":
      return { ...s, device: a.device };
    case "editMode":
      return { ...s, editMode: a.on, selection: a.on ? s.selection : null };
    case "inspectorTab":
      return { ...s, inspectorTab: a.tab };
    case "setPage":
      return { ...s, currentPage: a.id, selection: null };

    case "addBlock": {
      if (structureLocked(s)) return s;
      const meta = SECTIONS[a.sectionType];
      if (meta.solo && cp(s).blocks.some((b) => b.type === a.sectionType)) return s;
      const blocks = clone(cp(s).blocks);
      const footIdx = blocks.findIndex((b) => b.type === "footer");
      const at = footIdx < 0 ? blocks.length : footIdx;
      blocks.splice(at, 0, makeBlock(a.sectionType));
      return { ...mapCurrentBlocks(s, () => blocks), selection: { page: s.currentPage, block: at }, leftMode: "layers" };
    }

    case "removeBlock": {
      const b = cp(s).blocks[a.index];
      if (!b || SECTIONS[b.type].structural) return s;
      const ns = mapCurrentBlocks(s, (blocks) => {
        blocks.splice(a.index, 1);
        return blocks;
      });
      return { ...ns, selection: s.selection?.block === a.index ? null : s.selection };
    }

    case "moveBlock": {
      if (structureLocked(s)) return s;
      const blocks = cp(s).blocks;
      const j = a.index + a.dir;
      if (j < 1 || j > blocks.length - 2) return s;
      if (SECTIONS[blocks[a.index].type].structural) return s;
      const ns = mapCurrentBlocks(s, (bl) => {
        bl.splice(j, 0, bl.splice(a.index, 1)[0]);
        return bl;
      });
      return { ...ns, selection: s.selection?.block === a.index ? { page: s.currentPage, block: j } : s.selection };
    }

    case "reorderBlock": {
      if (structureLocked(s)) return s;
      const bl = cp(s).blocks;
      const lastBody = bl.length - 2; // keep header first / footer last
      if (a.from < 1 || a.from > lastBody || SECTIONS[bl[a.from].type].structural) return s;
      let to = Math.max(1, Math.min(lastBody, a.to));
      if (to === a.from) return s;
      const ns = mapCurrentBlocks(s, (arr) => {
        const [moved] = arr.splice(a.from, 1);
        arr.splice(to, 0, moved);
        return arr;
      });
      const selBlock = s.selection?.block;
      let nextSel = selBlock;
      if (selBlock === a.from) nextSel = to;
      else if (selBlock != null && selBlock > a.from && selBlock <= to) nextSel = selBlock - 1;
      else if (selBlock != null && selBlock < a.from && selBlock >= to) nextSel = selBlock + 1;
      return { ...ns, selection: nextSel == null ? null : { page: s.currentPage, block: nextSel } };
    }

    case "hideBlock":
      return mapCurrentBlocks(s, (bl) => {
        bl[a.index].hidden = a.hidden ?? !bl[a.index].hidden;
        return bl;
      });

    case "dupBlock": {
      if (structureLocked(s)) return s;
      return mapCurrentBlocks(s, (bl) => {
        const copy = clone(bl[a.index]);
        copy.id = uid();
        bl.splice(a.index + 1, 0, copy);
        return bl;
      });
    }

    case "updateBlockData":
      return mapCurrentBlocks(s, (bl) => {
        bl[a.index] = { ...bl[a.index], data: { ...bl[a.index].data, [a.key]: a.value } };
        return bl;
      });

    case "blockLayout":
      return mapCurrentBlocks(s, (bl) => {
        bl[a.index].layout = a.layout;
        return bl;
      });
    case "blockDense":
      return mapCurrentBlocks(s, (bl) => {
        bl[a.index].dense = a.dense;
        return bl;
      });
    case "blockVisibility":
      return mapCurrentBlocks(s, (bl) => {
        bl[a.index].visibility = { ...bl[a.index].visibility, [a.device]: a.visible };
        return bl;
      });

    case "setTheme":
      return { ...s, theme: a.theme };
    case "setDesign":
      return { ...s, ...a.patch };

    case "setHeader":
      return { ...s, globals: { ...s.globals, header: { ...s.globals.header, ...a.patch } } };
    case "setFooter":
      return { ...s, globals: { ...s.globals, footer: { ...s.globals.footer, ...a.patch } } };

    case "applyTemplate": {
      const t = TEMPLATES.find((x) => x.key === a.key);
      if (!t) return s;
      const old = cp(s).blocks;
      const next = t.blocks.map((type) => old.find((b) => b.type === type) ?? makeBlock(type));
      return { ...mapCurrentBlocks(s, () => next), selection: null };
    }

    case "addPage": {
      const names: Record<string, string> = { about: "About", gallery: "Gallery", faq: "FAQ", contact: "Contact", blank: "New page" };
      const layouts: Record<string, SectionType[]> = {
        about: ["header", "about", "highlights", "contact", "footer"],
        gallery: ["header", "gallery", "contact", "footer"],
        faq: ["header", "faq", "contact", "footer"],
        contact: ["header", "contact", "footer"],
        blank: ["header", "footer"],
      };
      const id = `${a.kind}-${uid()}`;
      const page = {
        id, name: names[a.kind] ?? "New page", slug: a.kind === "blank" ? "page" : a.kind,
        kind: "standard" as const, home: false, hidden: false, inNav: true,
        blocks: (layouts[a.kind] ?? layouts.blank).map((t) => makeBlock(t)),
      };
      const pages = clone(s.pages);
      pages.splice(pages.length - 1, 0, page);
      return { ...withPages(s, pages), currentPage: id, selection: null };
    }

    case "pageAction": {
      const pages = clone(s.pages);
      const idx = pages.findIndex((p) => p.id === a.id);
      if (idx < 0) return s;
      const p = pages[idx];
      if (a.kind === "sethome") {
        pages.forEach((x) => (x.home = false));
        p.home = true;
        p.inNav = true;
      }
      if (a.kind === "nav") p.inNav = !p.inNav;
      if (a.kind === "hide") p.hidden = !p.hidden;
      if (a.kind === "rename" && a.name) p.name = a.name;
      if (a.kind === "dup") {
        const c = clone(p);
        c.id = `cp-${uid()}`;
        c.name = `${p.name} copy`;
        c.home = false;
        c.slug = `${p.slug || "page"}-copy`;
        c.blocks.forEach((b) => (b.id = uid()));
        pages.splice(idx + 1, 0, c);
      }
      if (a.kind === "del") {
        if (p.home) return s;
        pages.splice(idx, 1);
        return { ...withPages(s, pages), currentPage: s.currentPage === a.id ? "home" : s.currentPage };
      }
      return withPages(s, pages);
    }

    case "publish":
      return { ...s, publishPhase: "publishing" };

    case "publishResult": {
      if (!a.ok) return { ...s, publishPhase: "error" };
      const summary = publishChanges(s);
      const snap = snapshotOf(s);
      const version: PublishVersion = {
        id: `v${uid()}`, kind: "published", ts: Date.now(), summary, author: "You", isLive: true, snap,
      };
      const versions = [version, ...s.versions.map((v) => ({ ...v, isLive: false }))].slice(0, 12);
      return { ...s, published: snap, versions, publishPhase: "success" };
    }

    case "discardDraft": {
      const base = s.published ?? snapshotOf(s);
      return { ...s, ...applySnap(base), selection: null };
    }

    case "restoreVersion":
      return { ...s, ...applySnap(a.snap), selection: null };

    case "restoreSnapshot":
      return { ...s, ...applySnap(a.snap) };

    case "dismissCheck":
      return { ...s, dismissedChecks: [...s.dismissedChecks, a.msg] };
    case "restoreChecks":
      return { ...s, dismissedChecks: [] };

    case "markSaved":
      return { ...s, saveState: a.state };

    default:
      return s;
  }
}

/** actions that change published-able content → provider snapshots history + marks saving */
export const CONTENT_ACTIONS = new Set<Action["type"]>([
  "addBlock", "removeBlock", "moveBlock", "reorderBlock", "hideBlock", "dupBlock", "updateBlockData",
  "blockLayout", "blockDense", "blockVisibility", "setTheme", "setDesign", "setHeader", "setFooter",
  "applyTemplate", "addPage", "pageAction", "restoreVersion",
]);
