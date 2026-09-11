import type { BuilderState, Block, Page, SectionType } from "@/types";
import { SECTIONS } from "@/features/sections/registry";
import { DEFAULT_HOME_BLOCKS } from "@/data/managr";
import { uid } from "@/lib/utils";

export function makeBlock(type: SectionType): Block {
  const meta = SECTIONS[type];
  return {
    id: uid(),
    type,
    hidden: false,
    global: meta.global ?? null,
    data: {},
    layout: meta.layoutVariants[0],
    dense: "comfortable",
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function freshPages(): Page[] {
  return [
    {
      id: "home", name: "Home", slug: "", kind: "standard", home: true, hidden: false, inNav: true,
      blocks: DEFAULT_HOME_BLOCKS.map((t) => makeBlock(t)),
    },
    {
      id: "ptpl", name: "Property page", slug: "p/…", kind: "template:property", home: false, hidden: false, inNav: false,
      blocks: (["header", "hero", "gallery", "contact", "footer"] as SectionType[]).map((t) => makeBlock(t)),
    },
  ];
}

export function createInitialState(): BuilderState {
  return {
    plan: "basic",
    role: "owner",
    conn: "online",
    siteLive: true,
    setup: "done",
    propMode: "many",

    slug: "shreeresidency",
    info: { headline: "", about: "", phone: "", email: "", office: "" },
    theme: "modern",
    brandColor: null,
    fontPair: "modern",
    shape: "soft",
    layoutDensity: "balanced",
    globals: {
      header: { logo: false, links: ["Properties", "About", "Contact"], call: true, sticky: true },
      footer: { fields: ["Phone", "WhatsApp", "Office area"], powered: true },
      wacta: { text: "Chat with us" },
    },
    pages: freshPages(),
    published: null,
    versions: [],

    availOn: false,
    availLevel: "roomtype",
    availNumbers: "exact",
    availFromDate: true,
    availStale: false,

    currentPage: "home",
    device: "mobile",
    editMode: true,
    leftMode: "layers",
    selection: null,
    inspectorTab: "content",
    saveState: "saved",
    onboarded: false,
    dismissedChecks: [],

    publishPhase: "idle",
    simulatePublishFail: false,
  };
}
