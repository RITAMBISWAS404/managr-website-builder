/* ============================================================================
   ManagR Website Builder — production-UX prototype (low-fi visuals)
   One SPA. hash-routed. state in localStorage. Dev bar simulates ManagR data.
   Sections: core+data / app-shell views / editor / overlays / visitor / events.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ic = (n) => `<svg class="icon" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const uid = () => Math.random().toString(36).slice(2, 8);
  const clone = (x) => JSON.parse(JSON.stringify(x));

  let toastTimer;
  function toast(msg, undoFn) {
    const r = $("#toasts");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `${ic("check")}<span>${esc(msg)}</span>${undoFn ? `<button class="undo">Undo</button>` : ""}`;
    if (undoFn) t.querySelector(".undo").addEventListener("click", () => { undoFn(); t.remove(); });
    r.appendChild(t);
    clearTimeout(toastTimer);
    setTimeout(() => { t.style.opacity = 0; }, 3200);
    setTimeout(() => t.remove(), 3600);
  }

  /* ============================================================================
     DATA (mock ManagR)
     ========================================================================== */
  const DOMAIN = "managr.in";
  const OWNER = { biz: "Shree Residency", phone: "88576 15102", email: "niraj@example.com", area: "Andheri West, Mumbai" };

  const ALL_PROPS = [
    { id: "p1", name: "Shree Residency", area: "Andheri West", from: "₹8,000", sharing: ["Double", "Triple"],
      photos: 3, reviews: 0, updated: 0, status: "live",
      rooms: [
        { t: "Triple sharing", rent: "₹8,000/mo", dep: "₹16,000", freeNow: 2, from: null },
        { t: "Double sharing", rent: "₹11,000/mo", dep: "₹22,000", freeNow: 0, from: "15 Sep" },
        { t: "Private room",   rent: "₹17,000/mo", dep: "₹34,000", freeNow: 1, from: null } ],
      beds: [1, 1, 0, 0, 1, 0, 0, 0] },
    { id: "p2", name: "Shree Residency — Girls", area: "Andheri East", from: "₹9,500", sharing: ["Double", "Private"],
      photos: 0, reviews: 2, updated: 3, status: "review",
      rooms: [{ t: "Double sharing", rent: "₹9,500/mo", dep: "₹19,000", freeNow: 1, from: null }], beds: [1, 0, 0, 0] },
    { id: "p3", name: "Green Nest PG", area: "Powai", from: "₹7,500", sharing: ["Triple"],
      photos: 4, reviews: 5, updated: 22, status: "live",
      rooms: [{ t: "Triple sharing", rent: "₹7,500/mo", dep: "₹15,000", freeNow: 0, from: null }], beds: [0, 0, 0] },
    { id: "p4", name: "Hillview Ladies PG", area: "Andheri West", from: "₹10,000", sharing: ["Double"],
      photos: 6, reviews: 3, updated: 1, status: "unpublished",
      rooms: [{ t: "Double sharing", rent: "₹10,000/mo", dep: "₹20,000", freeNow: 3, from: null }], beds: [1, 1, 1, 0] }
  ];

  const SECTIONS = {
    header:     { name: "Header / brand bar", ico: "layout", cat: "Structural", struct: true, global: "header",
                  sub: ["Logo", "Links", "Call button"] },
    hero:       { name: "Hero banner", ico: "image", cat: "Hero", solo: true, sub: ["Heading", "Sub-line", "Image", "Button"] },
    properties: { name: "Properties grid", ico: "grid", cat: "Properties", solo: true },
    featured:   { name: "Featured property", ico: "star", cat: "Properties" },
    areas:      { name: "Areas covered", ico: "pin", cat: "Properties" },
    highlights: { name: "Highlights", ico: "star", cat: "Trust", dup: true },
    trust:      { name: "Trust banner", ico: "shield", cat: "Trust" },
    reviews:    { name: "Reviews", ico: "star", cat: "Trust", needs: "reviews" },
    about:      { name: "About us", ico: "text", cat: "Content", sub: ["Text", "Photo"] },
    richtext:   { name: "Rich text", ico: "text", cat: "Content", dup: true },
    gallery:    { name: "Photo gallery", ico: "image", cat: "Content", dup: true, needs: "photos" },
    faq:        { name: "FAQ", ico: "help", cat: "Content", dup: true },
    enquiry:    { name: "Enquiry form", ico: "inbox", cat: "Convert", advanced: true, solo: true },
    visit:      { name: "Visit booking", ico: "calendar", cat: "Convert", advanced: true, solo: true },
    bookcta:    { name: "Booking request CTA", ico: "check", cat: "Convert", advanced: true },
    offer:      { name: "Offer banner", ico: "tag", cat: "Convert", dup: true },
    contact:    { name: "Contact block", ico: "phone", cat: "Contact" },
    wacta:      { name: "WhatsApp bar", ico: "wa", cat: "Contact", global: "wacta" },
    footer:     { name: "Footer", ico: "layout", cat: "Structural", struct: true, global: "footer",
                  sub: ["Contact", "Social", "Powered by"] }
  };
  const ADD_CATS = ["Hero", "Properties", "Trust", "Content", "Convert", "Contact"];

  const THEMES = {
    modern:  { name: "Clean Modern", blurb: "Crisp, lots of white space, sharp corners.", accent: "#2f6fed", radius: "2px", cards: "outlined", density: "airy" },
    family:  { name: "Warm Family-run", blurb: "Friendly, rounded, softer type.", accent: "#b5651d", radius: "14px", cards: "filled", density: "cozy" },
    premium: { name: "Premium Co-living", blurb: "Dark, confident, minimal.", accent: "#222222", radius: "6px", cards: "flat", density: "tight" }
  };
  const TEMPLATES = {
    propertyFirst: { name: "Property-first", blurb: "Get people to the rooms fast.", blocks: ["header", "hero", "properties", "trust", "highlights", "contact", "footer"] },
    brandFirst:    { name: "Brand-first", blurb: "Lead with your story and reviews.", blocks: ["header", "hero", "about", "highlights", "properties", "reviews", "contact", "footer"] }
  };
  const ACCENTS = ["#2f6fed", "#b5651d", "#227a52", "#7a3fb0", "#c0392b", "#333333"];

  // freshness thresholds — PRODUCT DECISION (configurable), see architecture doc
  const FRESH = { fresh: 3, slightly: 10 };
  function freshness(days) {
    if (days <= FRESH.fresh) return "fresh";
    if (days <= FRESH.slightly) return "slightly";
    return "stale";
  }

  const DEFAULT_HOME = ["header", "hero", "properties", "highlights", "about", "contact", "footer"];

  /* ============================================================================
     STATE
     ========================================================================== */
  function freshPages() {
    return [
      { id: "home", name: "Home", slug: "", kind: "standard", home: true, hidden: false, inNav: true,
        blocks: DEFAULT_HOME.map((t) => mkBlock(t)) },
      { id: "ptpl", name: "Property page", slug: "p/…", kind: "template:property", home: false, hidden: false, inNav: false,
        blocks: ["header", "hero", "gallery", "contact", "footer"].map((t) => mkBlock(t)) }
    ];
  }
  function mkBlock(type) {
    return { id: uid(), type, hidden: false, global: SECTIONS[type].global || null,
      data: {}, layout: "default", visibility: { desktop: true, tablet: true, mobile: true }, overrides: {} };
  }

  const DEFAULT = {
    view: "home",
    plan: "basic",        // basic | trial | advanced | expiring | payment_failed | lapsed
    role: "owner",        // owner | manager | staff
    conn: "online",       // online | saving | offline
    siteLive: true,
    setup: "done",        // done | locked | unlocked | address | confirm | info
    slug: "shreeresidency",
    info: { headline: "", about: "", phone: "", email: "", office: "" },
    propMode: "many",     // none | one | many
    availOn: false, availLevel: "roomtype", availNumbers: "exact", availFromDate: true, availStale: false,
    theme: "modern",
    globals: { header: { logo: false, links: ["Properties", "About", "Contact"], call: true, sticky: true },
               footer: { fields: ["Phone", "WhatsApp", "Office area"], powered: true },
               wacta: { text: "Chat with us" } },
    pages: freshPages(),
    currentPage: "home",
    published: null,      // snapshot of {pages, theme, globals}
    versions: [],
    device: "mobile",
    editMode: true,
    leftMode: "layers",   // layers | pages | add | assets
    sel: null,            // {page, block, sub?}
    inspTab: "content",
    mfloatHidden: true,
    onboarded: false,
    dismissedChecks: []
  };
  let S = load();
  let HIST = [], HPOS = -1;

  function load() {
    try { const raw = localStorage.getItem("managr_builder_v2"); if (raw) return Object.assign({}, clone(DEFAULT), JSON.parse(raw)); } catch (e) {}
    return clone(DEFAULT);
  }
  function save() { try { localStorage.setItem("managr_builder_v2", JSON.stringify(S)); } catch (e) {} }

  function snapshot() {
    HIST = HIST.slice(0, HPOS + 1);
    HIST.push(JSON.stringify({ pages: S.pages, theme: S.theme, globals: S.globals }));
    if (HIST.length > 50) HIST.shift();
    HPOS = HIST.length - 1;
  }
  function restoreHist(i, label) {
    const s = JSON.parse(HIST[i]); S.pages = s.pages; S.theme = s.theme; S.globals = s.globals;
    save(); render(); if (label) toast(label);
  }
  function undo() { if (HPOS <= 0) return; HPOS--; restoreHist(HPOS, "Undid last change"); }
  function redo() { if (HPOS >= HIST.length - 1) return; HPOS++; restoreHist(HPOS, "Redid"); }
  function markSaved() {
    if (S.conn === "offline") { flashSave("offline"); return; }
    flashSave("saving");
    clearTimeout(markSaved._t);
    markSaved._t = setTimeout(() => flashSave("saved"), 500);
  }
  function flashSave(mode) {
    S._save = mode; const el = $("#saveState"); if (el) el.outerHTML = saveStateHtml();
  }
  function saveStateHtml() {
    const m = S._save || "saved";
    const map = { saving: [ic("refresh"), "Saving…"], saved: [ic("check"), "Saved"], offline: [ic("alert"), "Offline — saved on this device"] };
    return `<span class="savestate ${m === "saved" ? "" : m}" id="saveState">${map[m][0]} ${map[m][1]}</span>`;
  }

  /* ---------------- derived ---------------- */
  const advActive = () => ["advanced", "trial", "expiring", "payment_failed"].indexOf(S.plan) >= 0;
  const canEdit = () => S.role !== "staff";
  const canPublish = () => S.role === "owner" || S.role === "manager";
  const canBilling = () => S.role === "owner";
  const structureLocked = () => !advActive();       // Basic = fixed layout
  const brandingLocked = () => !advActive();
  const url = () => S.slug + "." + DOMAIN;
  function props() {
    if (S.propMode === "none") return [];
    if (S.propMode === "one") return [ALL_PROPS[0]];
    return ALL_PROPS;
  }
  const publicProps = () => props().filter((p) => p.status === "live");
  const page = () => S.pages.find((p) => p.id === S.currentPage) || S.pages[0];
  function sectionData(block) {
    return block.global ? S.globals[block.global] : block.data;
  }
  function needsData(type) {
    if (type === "reviews") return publicProps().every((p) => !p.reviews);
    if (type === "gallery") return publicProps().every((p) => !p.photos);
    return false;
  }
  function sectionLocked(type) { return SECTIONS[type].advanced && !advActive(); }
  function draftDirty() {
    if (!S.published) return true;
    return JSON.stringify({ p: S.pages, t: S.theme, g: S.globals }) !== JSON.stringify({ p: S.published.pages, t: S.published.theme, g: S.published.globals });
  }
  function staleProp(p) { return S.availStale && p.updated > FRESH.slightly; }

  /* ============================================================================
     SITE CHECK (readiness / publish validation)
     ========================================================================== */
  function siteCheck() {
    const blockers = [], warnings = [];
    const homeBlocks = S.pages[0].blocks.filter((b) => !b.hidden).map((b) => b.type);
    if (!S.slug || S.setup !== "done") blockers.push({ msg: "Your web address isn’t claimed yet", where: "home" });
    if (!getInfo("phone")) blockers.push({ msg: "No contact number — visitors can’t reach you", where: "settings" });
    if (homeBlocks.indexOf("properties") >= 0 && publicProps().length === 0)
      blockers.push({ msg: "The Properties section is on, but no approved property is public", where: "properties" });
    if (homeBlocks.indexOf("enquiry") >= 0 && !advActive())
      blockers.push({ msg: "Enquiry form needs Advanced to receive leads", where: "plan" });
    const hero = S.pages[0].blocks.find((b) => b.type === "hero" && !b.hidden);
    if (hero && !(hero.data.headline)) warnings.push({ msg: "Hero has no headline — a default will be used", where: "hero" });
    if (publicProps().every((p) => !p.photos)) warnings.push({ msg: "No property has photos — cards show a placeholder", where: "properties" });
    if (S.availOn && props().some((p) => staleProp(p))) warnings.push({ msg: "One property’s availability is stale — it won’t show as live", where: "availability" });
    if (S.globals.header.links.length === 0) warnings.push({ msg: "Header navigation is empty", where: "header" });
    if (respIssues().length) warnings.push({ msg: `${respIssues().length} responsive issue(s) to review`, where: "responsive" });
    return { blockers, warnings: warnings.filter((w) => S.dismissedChecks.indexOf(w.msg) < 0) };
  }
  function respIssues() {
    const out = [];
    const home = S.pages[0].blocks.filter((b) => !b.hidden);
    if (home.find((b) => b.type === "highlights") && S.globals) out.push({ msg: "Highlights: 3 columns may be cramped on mobile", where: "highlights", bp: "mobile", fix: "Stack on mobile" });
    if (S.globals.header.links.length >= 4) out.push({ msg: "Header: navigation links may overflow on mobile", where: "header", bp: "mobile", fix: "Use a menu on mobile" });
    if (S.pages[0].blocks.find((b) => b.type === "hero" && (b.data.headline || "").length > 42)) out.push({ msg: "Hero: long headline may overflow on mobile", where: "hero", bp: "mobile" });
    return out.filter((i) => S.dismissedChecks.indexOf(i.msg) < 0);
  }

  function getInfo(k) {
    if (k === "phone") return S.info.phone || OWNER.phone;
    if (k === "email") return S.info.email || "";
    if (k === "office") return S.info.office || "";
    if (k === "headline") return S.info.headline || `${OWNER.biz} — PG & Hostel stays in ${OWNER.area.split(",")[0]}`;
    if (k === "about") return S.info.about || "Comfortable, well-managed shared accommodation. Direct from the owner — no brokerage.";
    return S.info[k] || "";
  }

  /* ============================================================================
     ROUTER
     ========================================================================== */
  function go(v) {
    S.view = v; S.sel = null;
    if (v !== "live") S._verSnap = null;          // leaving a version preview
    if (v === "live") V = { route: "list", prop: "p1", step: 0, testMode: true, ver: V && V.ver };
    save(); location.hash = "#/" + v; render(); window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", () => {
    const v = (location.hash.replace("#/", "") || "home");
    if (v !== S.view) { S.view = v; render(); }
  });

  function render() {
    const app = $("#appShell"), ed = $("#editor"), vs = $("#vshell");
    ed.classList.remove("on"); vs.classList.remove("on"); app.style.display = "none";
    $("#cmd").classList.remove("on");
    if (S.view !== "editor") $("#coachRoot").innerHTML = "";   // don't let coach marks leak onto other views
    if (S.view === "editor") { ed.classList.add("on"); renderEditor(); }
    else if (S.view === "live") { vs.classList.add("on"); renderVisitor(); }
    else { app.style.display = ""; renderApp(); }
    renderDev();
    document.body.dataset.view = S.view;
  }

  /* ============================================================================
     APP SHELL (ManagR)
     ========================================================================== */
  function renderApp() {
    $("#sideNav").innerHTML = sideNav();
    const map = {
      home: viewHome, availability: viewAvailability, visits: viewVisits, enquiries: viewEnquiries,
      requests: viewRequests, analytics: viewAnalytics, plan: viewPlan, upgrade: viewUpgrade,
      scheduled: viewScheduled, health: viewHealth, settings: viewSettings, loading: viewLoading
    };
    const fn = map[S.view] || viewHome;
    $("#screen").innerHTML = `<div class="content">${fn()}</div>`;
    $("#topTitle").textContent = ({ home: "Website", availability: "Live availability", visits: "Visit settings",
      enquiries: "Website enquiries", requests: "Booking requests", analytics: "Website analytics", plan: "Website plan",
      upgrade: "Upgrade", scheduled: "Scheduled Visits", health: "Website health", settings: "Website settings", loading: "Website" }[S.view]) || "Website";
  }

  function sideNav() {
    const webActive = ["home", "availability", "visits", "enquiries", "requests", "analytics", "plan", "upgrade", "health", "settings"].indexOf(S.view) >= 0;
    const planBadge = S.plan === "lapsed" ? `<span class="badge chip chip-warn">Lapsed</span>`
      : advActive() ? `<span class="badge chip chip-adv">Advanced</span>` : `<span class="badge chip chip-off">Free</span>`;
    return `
      <div class="side-brand">${ic("home")} ManagR</div>
      <a>${ic("home")} Dashboard</a>
      <a>${ic("grid")} Properties</a>
      <a>${ic("users")} Leads &amp; CRM</a>
      <a data-nav="scheduled" class="${S.view === "scheduled" ? "on" : ""}">${ic("calendar")} Scheduled Visits</a>
      <a>${ic("wallet")} Payments</a>
      <div class="side-sep"></div>
      <a data-nav="home" class="${webActive ? "on" : ""}">${ic("globe")} Website ${planBadge}</a>
      <a>${ic("settings")} Settings</a>
      <div class="side-note">“Website” is its own section now (was inside Settings).<br>Role: <b>${S.role}</b></div>`;
  }

  /* ---------- plan banner (shared) ---------- */
  function planBanner() {
    if (S.plan === "trial") return `<div class="planbar info">${ic("sparkle")}<span><b>Advanced trial</b> — 9 days left. All features on.</span><button class="btn btn-sm right" data-go="plan">Keep Advanced</button></div>`;
    if (S.plan === "expiring") return `<div class="planbar info">${ic("clock")}<span>Advanced renews in <b>3 days</b>.</span><button class="btn btn-sm right" data-go="plan">Manage</button></div>`;
    if (S.plan === "payment_failed") return `<div class="planbar warn">${ic("alert")}<span><b>We couldn’t take payment.</b> Advanced pauses in 5 days. Your site keeps working until then.</span><button class="btn btn-sm right" data-go="plan">Update payment</button></div>`;
    if (S.plan === "lapsed") return `<div class="planbar stop">${ic("info")}<span><b>Advanced ended.</b> Your site is still live on the Basic look. Availability &amp; visit booking are paused. Nothing was deleted.</span><button class="btn btn-sm right" data-go="upgrade">Reactivate</button></div>`;
    return "";
  }

  /* ---------- Website Home (hub) ---------- */
  function viewHome() {
    if (S.setup !== "done") return setupStage();

    const chk = siteCheck();
    const dirty = draftDirty();
    const healthTone = chk.blockers.length ? "stop" : chk.warnings.length ? "warn" : "ok";
    const healthTxt = chk.blockers.length ? `${chk.blockers.length} thing${chk.blockers.length > 1 ? "s" : ""} to fix`
      : chk.warnings.length ? `${chk.warnings.length} to review` : "All good";
    const nextAction = chk.blockers.length ? ["Fix what’s blocking", "health"]
      : dirty ? ["Review & publish your changes", "editor"]
      : !publicProps().length && S.siteLive ? ["Add a property so your site isn’t empty", "home"]
      : ["Open the editor", "editor"];

    const activity = [
      ["Published a new version", "2 hours ago"],
      ["Changed theme to Clean Modern", "2 hours ago"],
      advActive() ? ["3 new website enquiries", "yesterday"] : null,
      advActive() ? ["A visit was booked from your website", "yesterday"] : null
    ].filter(Boolean);

    const shortcut = (v, name, sub, icon, lock) => `
      <button class="card card--tap" data-go="${v}">
        <div class="between"><span class="row">${ic(icon)} <b>${name}</b></span>${lock ? `<span class="chip chip-adv">${ic("lock")} Advanced</span>` : ic("cr")}</div>
        <div class="sub" style="margin-top:6px">${sub}</div>
      </button>`;

    return `
      <div class="between home-head" style="margin-bottom:var(--s4)">
        <div><h1>Website</h1><p class="sub">${advActive() ? "Advanced plan" : "Basic plan · free"}</p></div>
        <div class="row"><button class="btn btn-sm" data-open-live>${ic("ext")} View live site</button>
        <button class="btn btn-sm btn-primary" data-go="editor">${ic("edit")} Open editor</button></div>
      </div>

      ${planBanner() ? planBanner() : ""}
      ${dirty ? `<div class="planbar info" style="margin-top:${planBanner() ? "var(--s2)" : "0"}">${ic("edit")}<span><b>You have unpublished changes.</b> Visitors still see your last published version.</span><button class="btn btn-sm right" data-go="editor">Review &amp; publish</button></div>` : ""}

      <div class="statstrip" style="margin-top:var(--s4)">
        <div class="ss-row"><span class="ss-k">Status</span>
          <span class="ss-v">${S.siteLive ? `<span class="chip chip-live">${ic("check")} Live — visitors can see it</span>` : `<span class="chip chip-off">Offline — visitors see a short notice</span>`}</span>
          <label class="tgl right" title="${S.siteLive ? "Take offline" : "Bring online"}"><input type="checkbox" data-toggle-live ${S.siteLive ? "checked" : ""}><i></i></label></div>
        <div class="ss-row"><span class="ss-k">Address</span><span class="ss-v mono grow truncate">${esc(url())}</span>
          <span class="row" style="flex:none"><button class="btn btn-ico btn-sm" data-copy aria-label="Copy link">${ic("copy")}</button><button class="btn btn-ico btn-sm" data-open-qr aria-label="QR code">${ic("grid")}</button><button class="btn btn-ico btn-sm" data-share aria-label="Share on WhatsApp">${ic("wa")}</button></span></div>
        <div class="ss-row"><span class="ss-k">Plan</span><span class="ss-v grow">${advActive() ? "Advanced" : "Basic (free)"}</span>${!advActive() ? `<button class="btn btn-sm" data-go="upgrade">See Advanced</button>` : `<button class="btn btn-sm" data-go="plan">Manage</button>`}</div>
        <div class="ss-row"><span class="ss-k">Health</span><span class="ss-v grow"><span class="chip chip-${healthTone}">${healthTxt}</span> <span class="tiny muted">${chk.blockers[0] ? esc(chk.blockers[0].msg) : chk.warnings[0] ? esc(chk.warnings[0].msg) : "nothing outstanding"}</span></span><button class="btn btn-sm" data-go="health">Details</button></div>
        <div class="ss-row"><span class="ss-k">Next</span><span class="ss-v grow">${nextAction[0]}</span><button class="btn btn-sm btn-primary" data-go="${nextAction[1]}">Go</button></div>
      </div>

      <div class="group"><div class="section-label">This week</div>
      <div class="card"><p style="margin:0">${advActive() ? "8 visitors · 3 WhatsApp chats · 2 calls · 2 enquiries · 1 visit booked" : "8 visitors · 3 WhatsApp chats · 2 calls"}</p>
        <button class="btn btn-sm" style="margin-top:10px" data-go="analytics">What the website is doing →</button></div></div>

      <div class="group"><div class="section-label">Manage</div>
      <div class="s-grid c2" style="gap:var(--s3)">
        ${shortcut("editor", "Editor", "Change sections, pages, wording and theme", "layers")}
        ${shortcut("settings", "Website settings", "Address, brand, navigation, contact details", "settings")}
        ${shortcut("availability", "Live availability", "Show free beds on your property pages", "eye", !advActive())}
        ${shortcut("visits", "Visit settings", "Choose when visitors can book a viewing", "calendar", !advActive())}
        ${shortcut("enquiries", "Enquiries", "Leads that came from your website", "inbox", !advActive())}
        ${shortcut("requests", "Booking requests", "Move-in requests waiting for your decision", "check", !advActive())}
      </div></div>

      <div class="group"><div class="section-label">Recent activity</div>
      <div class="list">${activity.map((a) => `<div class="list-row"><span class="grow">${a[0]}</span><span class="tiny dim">${a[1]}</span></div>`).join("")}</div></div>`;
  }

  /* ---------- Flow A setup ---------- */
  function setupProgress(step) {
    const steps = ["Address", "Confirm", "Your info", "Live"];
    return `<div class="row" style="gap:6px;margin-bottom:var(--s4)">${steps.map((s, i) => `<span class="chip ${i < step ? "chip-ok" : i === step ? "chip-lg" : "chip-off"}">${i < step ? ic("check") : i + 1} ${s}</span>`).join("")}</div>`;
  }
  function setupStage() {
    if (S.setup === "locked") return `
      <h1>Get your own website</h1>
      <p class="sub" style="margin:var(--s2) 0 var(--s4)">One link for your WhatsApp bio, Instagram and the board outside — built from the property details you already keep in ManagR. You never retype rent or room numbers here.</p>
      <div class="card"><div class="section-label">What you get</div>
        <ul class="tiny" style="list-style:none;padding:0;line-height:2">
          <li>${ic("check")} Your own web address</li><li>${ic("check")} Photos, rent, rooms and location — always current</li>
          <li>${ic("check")} Call &amp; WhatsApp buttons</li><li>${ic("check")} Take it offline whenever you like</li></ul>
        <button class="btn btn-sm" style="margin-top:var(--s2)" data-open-sample>${ic("eye")} Show me a sample</button></div>
      <div class="callout callout-info group"><h4>How to switch it on</h4><div class="tiny">Add your first property and get it approved (about a day). Your website turns on by itself the moment it’s approved.</div></div>
      <button class="btn btn-primary btn-block btn-lg group" data-setup-approve>${ic("plus")} Add a property</button>
      <p class="tiny dim center" style="margin-top:6px">In this prototype, this stands in for the real Add-property flow.</p>`;
    if (S.setup === "unlocked") return `
      <div class="callout callout-ok"><h4>${ic("check")} “Shree Residency” is approved!</h4><div class="tiny">Your website is ready to switch on. Setting it up takes about two minutes.</div></div>
      <div class="card group"><div class="section-label">A peek at how it’ll look</div><div class="ph" style="min-height:120px">Your site — hero, property cards, contact</div></div>
      <button class="btn btn-primary btn-block btn-lg group" data-setup="address">Set up my website</button>
      <button class="btn btn-ghost btn-block" style="margin-top:8px" data-setup-later>I’ll do this later</button>`;
    if (S.setup === "address") return setupAddress();
    if (S.setup === "confirm") return `
      ${setupProgress(1)}
      <h1>Is this exactly right?</h1>
      <p class="sub" style="margin:var(--s2) 0">You choose your address once. It goes on your boards and into WhatsApp groups, so it can’t be changed later without contacting support.</p>
      <div class="card center group"><div class="tiny muted">Your website will be</div>
        <div class="mono" style="font-size:18px;font-weight:800;margin-top:var(--s2);word-break:break-all">https://${esc(S.slug)}.${DOMAIN}</div></div>
      <label class="rcard" style="margin-top:var(--s4)"><input type="checkbox" id="permck"><span class="rc-body">Yes — I’ve checked the spelling and I understand this is permanent.</span></label>
      <div class="row" style="margin-top:var(--s4)"><button class="btn" data-setup="address">${ic("cl")} Change it</button>
        <button class="btn btn-primary btn-lg grow" id="claimBtn" aria-disabled="true">${ic("lock")} Claim this address</button></div>`;
    if (S.setup === "info") return `
      ${setupProgress(2)}
      <h1>A few details for visitors</h1>
      <p class="sub" style="margin:var(--s2) 0">All optional. Anything you skip gets a sensible default, and you can change it later in Website settings.</p>
      <div class="field"><label class="lbl">Headline on your site</label><input class="inp" id="i_head" placeholder="${esc(getInfo("headline"))}"><div class="help">Skip it and we’ll use that suggestion.</div></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">A line or two about your place</label><textarea class="ta" id="i_about" placeholder="Family-run, home-cooked meals, five minutes from the station…"></textarea></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Contact number</label><input class="inp" id="i_phone" value="${OWNER.phone}"></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Email</label><input class="inp" id="i_email" placeholder="Leave blank to hide it"><div class="help">If blank, visitors just use call &amp; WhatsApp.</div></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Office area</label><input class="inp" id="i_office" placeholder="General area — not a full address"></div>
      <div class="row" style="margin-top:var(--s4)"><button class="btn btn-ghost" data-setup-finish>Skip — use defaults</button>
        <button class="btn btn-primary btn-lg grow" data-setup-finish="save">Publish my website</button></div>`;
  }
  function setupAddress() {
    return `
      ${setupProgress(0)}
      <h1>Pick your web address</h1>
      <p class="sub" style="margin:var(--s2) 0">This is the link you’ll share everywhere. Keep it short and easy to say out loud.</p>
      <div class="field"><label class="lbl">Web address</label>
        <div class="row" style="border:1px solid var(--line);border-radius:var(--r);min-height:var(--tap-lg)">
          <span class="tiny muted" style="padding:0 8px">https://</span>
          <input class="inp" id="addr" style="border:0;text-align:center;font-weight:700;font-size:15px" placeholder="your-name" autocomplete="off" autocapitalize="none" spellcheck="false">
          <span class="tiny muted" style="padding:0 8px">.${DOMAIN}</span><span id="addrIco" style="padding:0 10px"></span>
        </div>
        <div class="help" id="addrHint">Type the name you’d like.</div>
        <div id="addrSug" style="margin-top:var(--s2)"></div>
      </div>
      <div class="card" style="margin-top:var(--s3);background:var(--panel-2)"><div class="tiny muted">Your link will be</div>
        <div class="mono" id="addrEcho" style="font-weight:800;margin-top:4px;font-size:14px">https://your-name.${DOMAIN}</div></div>
      <button class="btn btn-primary btn-block btn-lg" style="margin-top:var(--s4)" id="addrNext" aria-disabled="true">Continue to confirm →</button>`;
  }

  /* ---------- Live availability (Flow D) ---------- */
  function viewAvailability() {
    if (!advActive()) return pageHead("Live availability", "Show real free beds on your property pages.") + advLock("Live bed availability",
      "Visitors see “3 beds available” or “Full — from 20 Sept”, straight from the bed status your staff keep every day. It’s the biggest reason a serious tenant calls.",
      "property pages show photos, rent and rooms — but not availability.");
    const level = (k, name, desc, ex) => `<label class="rcard ${S.availLevel === k ? "on" : ""}"><input type="radio" name="lvl" data-avail-level="${k}" ${S.availLevel === k ? "checked" : ""}>
      <span class="rc-body"><b>${name}</b><span class="rc-sub">${desc}</span><span class="rc-sub" style="margin-top:5px;font-style:italic">Visitor sees: ${ex}</span></span></label>`;
    return pageHead("Live availability", "Sophisticated underneath, simple to set. Four short choices.") +
      `<div class="between card"><span class="rc-body"><b>Show availability on my website</b><span class="rc-sub">Off = property pages show photos and rent only.</span></span>
        <label class="tgl"><input type="checkbox" data-avail-on ${S.availOn ? "checked" : ""}><i></i></label></div>` +
      (!S.availOn ? "" : `
        <div class="group"><div class="section-label">1 · What should visitors see?</div>
        ${level("property", "The whole property", "One line at the top of a property page.", "“3 beds available” · “Full — from 20 Sep”")}
        ${level("roomtype", "Each room type", "A line on every room type. Where most of the value is.", "Triple: 2 now · Double: full, next free 15 Sep")}
        ${level("bed", "Every bed", "A room picture showing which beds are free. Very persuasive — but shows how your building fills up.", "▢▢▣▣  (never any names)")}</div>

        <div class="callout callout-warn group"><h4>${ic("shield")} What your website can never show — this is built in, not a setting</h4>
          <ul class="tiny" style="margin-top:6px;list-style:none;padding:0;line-height:1.9">
            ${["Tenant names, photos, phone numbers or documents", "Why a bed is blocked", "Your exact street address", "Which bed a particular person is in"].map((x) => `<li>✕ ${x}</li>`).join("")}
          </ul>
          <div class="tiny" style="margin-top:4px">The dashboard shows tenant names on beds. The public site strips all of that out automatically.</div></div>

        <div class="group"><div class="section-label">2 · Numbers or simple labels?</div>
        <label class="rcard ${S.availNumbers === "exact" ? "on" : ""}"><input type="radio" name="num" data-avail-num="exact" ${S.availNumbers === "exact" ? "checked" : ""}><span class="rc-body">Show the count — “2 beds available”</span></label>
        <label class="rcard ${S.availNumbers === "vague" ? "on" : ""}"><input type="radio" name="num" data-avail-num="vague" ${S.availNumbers === "vague" ? "checked" : ""}><span class="rc-body">Just a label — Available / Filling fast / Full<span class="rc-sub">So competitors can’t count your empty beds.</span></span></label></div>

        <div class="group"><div class="section-label">3 · When a property is full</div>
        ${toggleRow("Show the date a bed next frees up", S.availFromDate, "data-avail-from", "e.g. “Full — from 20 Sept” instead of just “Full”")}</div>

        <div class="group"><div class="section-label">4 · Which properties</div>
        <div class="list">${publicProps().concat(ALL_PROPS.filter((p) => p.status !== "live")).map((p) => {
          const st = staleProp(p), days = p.updated, fr = freshness(days);
          const line = p.status !== "live" ? `${p.status === "review" ? "Under review — hidden from your site" : "Unpublished"}`
            : fr === "fresh" ? "Updated " + (days === 0 ? "today" : days + " days ago")
            : fr === "slightly" ? `<span class="help-warn">Updated ${days} days ago — still shown</span>`
            : `<span class="help-err">Not updated in ${days} days — hidden until staff refresh it</span>`;
          return `<div class="list-row"><span class="grow"><b>${esc(p.name)}</b><div class="tiny muted">${line}</div></span>
            <label class="tgl"><input type="checkbox" ${p.status === "live" && !st ? "checked" : ""} ${p.status !== "live" ? "disabled" : ""}><i></i></label></div>`;
        }).join("")}</div></div>

        <div class="callout callout-info group"><h4>${ic("info")} Keeping it honest</h4>
          <div class="tiny">Visitors see “Availability updated today”. If a property isn’t updated for a while, we quietly stop showing it as live and warn you on <a data-go="health" style="color:var(--accent);font-weight:600">Website health</a>. <span class="dim">(Currently: not shown after ${FRESH.slightly} days — a number to confirm with product.)</span></div></div>`);
  }

  /* ---------- Visit settings (Flow E owner) ---------- */
  function viewVisits() {
    if (!advActive()) return pageHead("Visit settings", "Let visitors book a viewing themselves.") + advLock("Visit booking",
      "Visitors pick a day and time you’ve allowed, and it lands in Scheduled Visits tagged “Website”. No more writing every visit into the dashboard after a phone call.",
      "you arrange every visit by phone and note it down yourself.");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return pageHead("Visit settings", "The common case is two steps: pick days, pick times. Everything else is optional.") +
      `<div class="group"><div class="section-label">1 · Which days can people visit?</div>
      <div class="wrapline" style="margin-bottom:10px"><button class="btn btn-sm">Weekday mornings</button><button class="btn btn-sm">Weekday evenings</button><button class="btn btn-sm">Weekends</button></div>
      <div class="week">${days.map((d, i) => `<span class="d">${d}</span>${["Morning", "Midday", "Evening"].map((s) => `<button class="${(i < 5 && s !== "Midday") || (i >= 5 && s === "Morning") ? "on" : ""}">${s}</button>`).join("")}`).join("")}</div>
      <div class="tiny muted" style="margin-top:6px">Tap the blocks that work for you. Big targets, no fiddly time fields.</div></div>

      <div class="group"><div class="section-label">2 · Exact times to offer</div>
      <div class="wrapline">${["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"].map((t, i) => `<label class="chip chip-lg"><input type="checkbox" ${i !== 2 ? "checked" : ""} style="margin-right:5px">${t}</label>`).join("")}</div></div>

      <div class="group"><div class="section-label">Which properties</div>
      <div class="list">${publicProps().map((p) => `<label class="list-row"><span class="grow"><b>${esc(p.name)}</b></span><span class="tgl"><input type="checkbox" checked><i></i></span></label>`).join("")}</div></div>

      <details class="more" style="margin-top:var(--s6)"><summary>More options — blackout dates, visit types, notice</summary><div class="more-body stack">
        <div><div class="section-label">Days you’re away (blackout)</div>
        <div class="list"><div class="list-row"><span class="grow">2 Oct — Gandhi Jayanti</span><button class="btn btn-ico btn-sm" aria-label="Remove">${ic("x")}</button></div>
        <div class="list-row"><span class="grow">21–23 Oct — travelling</span><button class="btn btn-ico btn-sm" aria-label="Remove">${ic("x")}</button></div></div>
        <button class="btn btn-sm" style="margin-top:8px">${ic("plus")} Add dates</button></div>

        <div><div class="section-label">Visit types</div>
        ${toggleRow("In person", true)}${toggleRow("Video walkthrough", false, null, "A video call instead of coming in")}</div>

        <div><div class="section-label">Timing rules</div>
        <div class="stack-sm">
          ${stepRow("Show a room this many days before it frees up", "7", "So people can plan ahead — this is the “buffer”")}
          ${stepRow("Visitors allowed per time slot", "2")}
          ${stepRow("Least notice needed (hours)", "3")}
          ${stepRow("How far ahead people can book (days)", "21")}
        </div>
        <div class="tiny muted" style="margin-top:6px">Defaults shown — <span class="chip chip-warn">a product decision to confirm</span>.</div></div>
      </div></details>

      <div class="callout callout-info group"><h4>${ic("info")} Where this shows up</h4>
      <div class="tiny">These settings power the <b>Visit booking</b> section on your website, and every booking appears in <a data-go="scheduled" style="color:var(--accent);font-weight:600">Scheduled Visits</a> with a “Website” tag.</div></div>`;
  }

  /* ---------- Enquiries ---------- */
  function viewEnquiries() {
    if (!advActive()) return pageHead("Enquiries", "Turn website visitors into leads in your CRM.") + advLock("Enquiry form",
      "A short form — name, phone, budget, move-in — that drops straight into Leads &amp; CRM tagged “Website”. These leads cost you nothing.",
      "visitors can only call or WhatsApp you.");
    const rows = S.propMode === "none" ? [] : [
      ["Rahul M.", "Double sharing · move-in October · budget ₹10–12k", "2 hours ago", "New"],
      ["Priya (parent)", "Private room · move-in as soon as possible", "Yesterday", "Contacted"]
    ];
    return pageHead("Enquiries", "Leads that came from your website.") +
      `<div class="callout callout-info"><h4>Where enquiries go</h4><div class="tiny">Every one becomes a lead in <b>Leads &amp; CRM</b>, tagged <span class="chip chip-ok">${ic("globe")} Website</span> so it stands out from marketplace leads — and it cost you nothing.</div>
        <div style="margin-top:8px"><button class="btn btn-sm">Open Leads &amp; CRM</button></div></div>
      <div class="group"><div class="section-label">Recent website enquiries</div>
      ${rows.length ? `<div class="list">${rows.map((r) => `<button class="list-row"><span class="grow"><b>${r[0]}</b><div class="tiny muted">${r[1]}</div></span><span class="chip">${r[3]}</span><span class="tiny dim">${r[2]}</span></button>`).join("")}</div>`
        : `<div class="empty"><h4>No enquiries yet</h4><p class="tiny">New website enquiries will appear here and in your CRM.</p><button class="btn btn-sm" data-copy>${ic("copy")} Copy your link to share</button></div>`}</div>
      <div class="group"><div class="section-label">What the form asks for</div>
      <p class="sub" style="margin-bottom:8px">Name and phone are always asked. Choose the rest:</p>
      ${["Looking for (sharing type)", "Move-in date", "Budget"].map((l) => `<label class="rcard"><input type="checkbox" checked><span class="rc-body">${l}</span></label>`).join("")}
      ${toggleRow("Floating “Enquire” button on mobile", true, null, "Follows the visitor as they scroll")}</div>
      <div class="callout callout-info tiny group">${ic("info")} You can also drop an inline form into About, Contact or a Rich-text section from the editor.</div>`;
  }

  /* ---------- Booking requests (Flow F owner inbox) ---------- */
  function viewRequests() {
    if (!advActive()) return pageHead("Booking requests", "Let visitors request a bed from a move-in date.") + advLock("Move-in requests",
      "A visitor picks a room type and a date. We check a bed can be free by then, then it waits for you to approve or decline.",
      "there’s no way for a visitor to request a bed — it’s all phone and WhatsApp.");
    return pageHead("Booking requests", "Move-in requests waiting for your decision.") +
      `<div class="group"><div class="section-label">Waiting for you</div>
      <div class="card stack-sm"><div class="between"><b>Aditya</b><span class="chip chip-warn">Awaiting your decision</span></div>
        <div class="tiny">Double sharing · Shree Residency · move-in <b>2 March</b></div>
        <div class="tiny muted">A bed can be ready by then. Approving creates a CRM lead and holds the bed for Aditya.</div>
        <div class="row row-wrap"><button class="btn btn-sm btn-primary" data-req-approve>${ic("check")} Approve &amp; hold the bed</button><button class="btn btn-sm" data-req-decline>Decline</button><button class="btn btn-sm btn-ghost">${ic("wa")} Message first</button></div></div>
      <div class="empty" style="margin-top:10px"><p class="tiny">That’s the only open request. Approved and declined requests move to Leads &amp; CRM.</p></div></div>
      <div class="group"><div class="section-label">Rules</div>
      ${toggleRow("Let visitors request a bed from property pages", true)}
      ${toggleRow("When a date can’t be met, offer the next free date instead of just saying “no”", true)}</div>
      <div class="callout callout-adv tiny group">${ic("info")} <b>No payment yet.</b> The flow is: request → you approve → <span class="dim">[payment step, later]</span> → confirmation. Adding payment won’t change anything else.</div>`;
  }

  /* ---------- Analytics ---------- */
  function viewAnalytics() {
    const week = advActive()
      ? [["8", "website visitors"], ["3", "WhatsApp conversations"], ["2", "calls"], ["2", "enquiries"], ["1", "visit booked"]]
      : [["8", "website visitors"], ["3", "WhatsApp conversations"], ["2", "calls"]];
    return pageHead("What your website is doing", "Plain numbers — no charts to read.") +
      `<div class="card"><div class="section-label">This week</div>
        ${week.map((w) => `<div class="row" style="padding:6px 0"><b style="font-size:18px;width:34px">${w[0]}</b><span class="sub">${w[1]}</span></div>`).join("")}
        ${advActive() ? "" : `<div class="tiny dim" style="margin-top:6px">Enquiries and visits are counted on Advanced.</div>`}</div>
      <div class="card group"><div class="section-label">Roughly what it brought in</div>
        <div style="font-size:24px;font-weight:800">₹1,10,000 this month</div>
        <p class="sub" style="margin-top:3px">3 move-ins started with a website visit or booking.</p></div>
      ${advActive() ? "" : advLock("Full analytics", "See exactly which enquiries, visits and bookings came from your website each month.", "you see visitors, calls and WhatsApp taps only.")}`;
  }

  /* ---------- Plan & billing ---------- */
  function viewPlan() {
    let card;
    if (S.plan === "advanced") card = `<div class="card callout-ok"><b>Advanced — active</b><div class="tiny muted">₹499/mo · renews 3 Oct 2026</div><div class="row row-wrap" style="margin-top:8px"><button class="btn btn-sm">Switch to yearly (2 months free)</button><button class="btn btn-sm btn-ghost">Manage billing</button></div></div>`;
    else if (S.plan === "trial") card = `<div class="card callout-info"><b>Advanced trial — 9 days left</b><div class="tiny muted">You won’t be charged until you choose a plan.</div><button class="btn btn-sm btn-primary" style="margin-top:8px" data-go="upgrade">Choose a plan</button></div>`;
    else if (S.plan === "expiring") card = `<div class="card callout-info"><b>Advanced — renews in 3 days</b><div class="tiny muted">₹499/mo · card ending 4242</div><button class="btn btn-sm" style="margin-top:8px">Change plan</button></div>`;
    else if (S.plan === "payment_failed") card = `<div class="card callout-warn"><b>Advanced — payment failed</b><div class="tiny">We’ll retry twice more. Advanced pauses on 12 Sep if it doesn’t go through. Your site and settings are safe.</div><button class="btn btn-sm btn-primary" style="margin-top:8px">Update payment</button></div>`;
    else if (S.plan === "lapsed") card = `<div class="card callout-stop"><b>Advanced — ended 3 Sep</b><div class="tiny">Site stays live on the Basic look. Availability &amp; visit booking are paused. Your sections, pages, branding and rules are all preserved.</div><button class="btn btn-sm btn-primary" style="margin-top:8px" data-go="upgrade">Reactivate — nothing to redo</button></div>`;
    else card = `<div class="card"><b>Basic — Free</b><div class="tiny muted">Your address, property pages, call &amp; WhatsApp. Always free (for now).</div></div>`;

    const matrix = [
      ["Your web address", 1, 1], ["Property pages, call & WhatsApp", 1, 1], ["Take the site offline", 1, 1],
      ["Your logo, colours & fonts", 0, 1], ["Rearrange & add sections", 0, 1], ["Extra pages (About / Gallery / FAQ)", 0, 1],
      ["Enquiry form → CRM", 0, 1], ["Live bed availability", 0, 1], ["Visit booking calendar", 0, 1],
      ["Booking / move-in requests", 0, 1], ["Show on Google", 0, 1], ["Hide “Powered by ManagR”", 0, 1]
    ];
    return pageHead("Plan & billing", "Basic is free. Advanced turns the site into a working front desk.") + card +
      (canBilling() ? "" : `<div class="callout callout-info tiny group">${ic("lock")} Your role (${S.role}) can’t change billing. Ask an Owner.</div>`) +
      `<div class="group"><div class="section-label">What’s in each plan</div>
      <div class="list">
      <div class="list-row tiny dim"><span class="grow"></span><span style="width:52px;text-align:center;font-weight:700">Basic</span><span style="width:74px;text-align:center;font-weight:700">Advanced</span></div>
      ${matrix.map((m) => `<div class="list-row tiny"><span class="grow">${m[0]}</span><span style="width:52px;text-align:center">${m[1] ? "✓" : "—"}</span><span style="width:74px;text-align:center;font-weight:700;color:${m[2] ? "var(--ok)" : "var(--ink-3)"}">${m[2] ? "✓" : "—"}</span></div>`).join("")}</div></div>
      ${S.plan === "basic" ? `<button class="btn btn-primary btn-block btn-lg group" data-go="upgrade">See Advanced</button>` : ""}`;
  }

  function viewUpgrade() {
    return pageHead("Advanced", "Everything in Basic, plus three things that make your website earn its keep.") +
      `${[["eye", "Show what’s actually free", "Live bed availability on every property page — the number one reason a good tenant calls."],
         ["calendar", "Let people book visits themselves", "They pick a slot you’ve allowed; it appears in Scheduled Visits."],
         ["sparkle", "Make it look like yours", "Your logo, colours and fonts, plus extra pages like About and FAQ."]].map((t) => `<div class="card" style="margin-bottom:10px"><div class="row" style="align-items:flex-start">${ic(t[0])}<div><b>${t[1]}</b><p class="sub" style="margin-top:2px">${t[2]}</p></div></div></div>`).join("")}
      <div class="group"><div class="section-label">Choose a cycle</div>
      <label class="rcard on"><input type="radio" name="cyc" checked><span class="rc-body"><b>Monthly</b><span class="rc-sub">₹499 per month · cancel any time</span></span></label>
      <label class="rcard"><input type="radio" name="cyc"><span class="rc-body"><b>Yearly</b><span class="rc-sub">₹4,990 per year — that’s two months free</span></span></label></div>
      <button class="btn btn-primary btn-block btn-lg group" data-do-upgrade>Pay online &amp; unlock now</button>
      <button class="btn btn-block btn-ghost" style="margin-top:8px">Bank transfer, or talk to someone</button>
      <p class="tiny muted center" style="margin-top:8px">${ic("check")} You’ll land straight in the editor with everything on. Nothing to set up again.</p>`;
  }

  /* ---------- Website health ---------- */
  function viewHealth() {
    const chk = siteCheck();
    const good = [
      publicProps().length ? `${publicProps().length} approved propert${publicProps().length > 1 ? "ies" : "y"} showing publicly` : null,
      publicProps().some((p) => p.photos) ? "Property photos are available" : null,
      getInfo("phone") ? "Visitors can reach you by phone" : null,
      S.slug ? "Your web address is claimed" : null
    ].filter(Boolean);
    const headline = chk.blockers.length
      ? `<span class="chip chip-stop chip-lg">${chk.blockers.length} thing${chk.blockers.length > 1 ? "s" : ""} to fix before publishing</span>`
      : chk.warnings.length
        ? `<span class="chip chip-warn chip-lg">Ready to publish — ${chk.warnings.length} optional improvement${chk.warnings.length > 1 ? "s" : ""}</span>`
        : `<span class="chip chip-ok chip-lg">${ic("check")} Ready to publish</span>`;
    return pageHead("Website health", "The same check runs automatically before every publish.") +
      `<div style="margin-bottom:var(--s4)">${headline}</div>
      ${chk.blockers.length ? `<div class="card" style="margin-bottom:var(--s3)"><div class="section-label">Fix these first</div>
        ${chk.blockers.map((b) => `<div class="health-item blocker">${ic("alert")}<div class="hi-body">${esc(b.msg)}</div>${b.where ? `<button class="jump" data-health-jump="${b.where}">Go fix this →</button>` : ""}</div>`).join("")}</div>` : ""}
      ${chk.warnings.length ? `<div class="card" style="margin-bottom:var(--s3)"><div class="section-label">Worth a look</div>
        ${chk.warnings.map((w) => `<div class="health-item warn">${ic("info")}<div class="hi-body">${esc(w.msg)}</div>
          <span class="row" style="flex:none;gap:10px"><button class="jump" data-health-jump="${w.where}">Review</button><button class="jump" data-health-dismiss="${esc(w.msg)}" style="color:var(--ink-3)">Dismiss</button></span></div>`).join("")}</div>` : ""}
      <div class="card"><div class="section-label">Working well</div>
        ${good.map((g) => `<div class="health-item ok">${ic("check")}<div class="hi-body">${esc(g)}</div></div>`).join("")}</div>
      ${S.dismissedChecks.length ? `<button class="btn btn-sm group" data-restore-checks>Show ${S.dismissedChecks.length} dismissed item${S.dismissedChecks.length > 1 ? "s" : ""} again</button>` : ""}`;
  }

  /* ---------- Website settings ---------- */
  let setTab = "general";
  function viewSettings() {
    const tabs = [["general", "Address"], ["brand", "Brand"], ["nav", "Menu"], ["contact", "Contact"], ["social", "Social"], ["discovery", "Google"]];
    let body = "";
    if (setTab === "general") body = `
      <div class="field"><label class="lbl">Business name shown on the site</label><input class="inp" value="${esc(OWNER.biz)}"></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Your web address</label>
        <div class="note-src">${ic("lock")} <span class="mono">${esc(url())}</span> · set for good · <a data-open-addr-help>Need to change it?</a></div>
        <div class="help">It’s permanent by design — it goes on your boards and into WhatsApp groups.</div></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Little icon in the browser tab</label><div class="row"><div class="ph" style="width:32px;min-height:32px">icon</div><button class="btn btn-sm">Choose</button><span class="tiny muted">Uses the ManagR mark if you don’t.</span></div></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Language</label><select class="sel"><option>English</option><option disabled>Hindi (coming soon)</option><option disabled>Marathi (coming soon)</option></select></div>`;
    else if (setTab === "brand") body = brandingLocked()
      ? advLock("Your logo, colours & fonts", "Upload a logo, pick a colour and a font pairing from safe presets, and choose how rounded the corners are.", "the site uses the ManagR palette and a generated “S” mark.")
      : `<button class="btn btn-block btn-lg" data-open-theme>${ic("sparkle")} Open Design (theme, colours, logo)</button><p class="sub" style="margin-top:8px">Theme, colours, fonts and logo all live in the editor so you can watch the changes happen on your site.</p>`;
    else if (setTab === "nav") body = `
      <div class="field"><label class="lbl">Which links appear in the menu</label>${["Home", "Properties", "About", "Contact", "FAQ"].map((l, i) => `<label class="rcard"><input type="checkbox" ${i < 3 ? "checked" : ""}><span class="rc-body">${l}</span></label>`).join("")}</div>
      ${toggleRow("Show a Call button in the menu", true)}
      ${toggleRow("Keep the menu visible as people scroll", true)}
      <div class="callout callout-info tiny" style="margin-top:var(--s3)">${ic("info")} The menu order follows your page order — change it in the editor’s <b>Pages</b> panel.</div>`;
    else if (setTab === "contact") body = `
      <div class="field"><label class="lbl">Phone</label><input class="inp" value="${OWNER.phone}"></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">WhatsApp</label><input class="inp" value="${OWNER.phone}"></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Email</label><input class="inp" placeholder="Leave blank to hide it"></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Office area</label><input class="inp" placeholder="e.g. Andheri West"><div class="help">A general area only — never a property’s exact address.</div></div>`;
    else if (setTab === "social") body = `${["Instagram", "Facebook", "YouTube"].map((l) => `<div class="field" style="margin-top:var(--s3)"><label class="lbl">${l}</label><input class="inp" placeholder="Paste the link"></div>`).join("")}`;
    else body = advActive() ? `
      ${toggleRow("Let people find my website on Google", true)}
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Title in search results</label><input class="inp" value="Shree Residency — PG in Andheri West, Mumbai"></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Description in search results</label><textarea class="ta">Direct-from-owner PG in Andheri. Photos, rent, room types, live availability. No brokerage.</textarea></div>
      <div class="field" style="margin-top:var(--s3)"><label class="lbl">Picture shown when the link is shared</label><div class="ph" style="min-height:70px">Uses your hero photo</div></div>`
      : advLock("Being found on Google", "A proper page title, description, share picture and a sitemap search engines can read.", "your site is private — reachable by link only, hidden from search.");
    return pageHead("Website settings", "Your address, brand, navigation and contact details in one place.") +
      `<div class="tabbar">${tabs.map((t) => `<button class="${setTab === t[0] ? "on" : ""}" data-settab="${t[0]}">${esc(t[1])}</button>`).join("")}</div>${body}`;
  }

  function viewLoading() {
    return `<div class="stack"><div class="sk" style="height:26px;width:40%"></div>
      <div class="card"><div class="sk" style="height:14px;width:60%"></div><div class="sk" style="height:44px;margin-top:12px"></div></div>
      <div class="s-grid c2" style="gap:var(--s3)">${[0, 0].map(() => `<div class="card"><div class="sk" style="height:34px"></div><div class="sk" style="height:12px;width:70%;margin-top:8px"></div></div>`).join("")}</div>
      <div class="sk" style="height:110px"></div></div>`;
  }

  /* ---------- Scheduled Visits ---------- */
  function viewScheduled() {
    const legend = [["Pending", "warn"], ["Confirmed", "ok"], ["Visited", "ok"], ["Rescheduled", "warn"], ["Cancelled", "stop"], ["No-show", "stop"]];
    return `<div class="between" style="margin-bottom:var(--s4)"><h1>Scheduled Visits</h1><button class="btn btn-sm">${ic("plus")} Add visit</button></div>
      <div class="callout callout-info"><h4>Statuses simplified</h4><div class="tiny">Was 11 colours — now 6 that each mean one real thing.</div>
        <div class="wrapline" style="margin-top:8px">${legend.map((l) => `<span class="chip chip-${l[1]}">${l[0]}</span>`).join("")}</div></div>
      <div class="row" style="margin:var(--s4) 0 var(--s3)"><div class="seg"><button class="on">Month</button><button>Week</button><button>List</button></div>
        <select class="sel btn-sm" style="width:auto;flex:none"><option>All sources</option><option>From my website</option><option>Phone / walk-in</option></select></div>
      <div class="ph" style="min-height:120px;margin-bottom:var(--s3)">Month calendar — visits coloured by status</div>
      <div class="list">
        <button class="list-row"><span class="grow"><b>Ankit · Double sharing</b><div class="tiny muted">Thu 11 Sep · 5:00 PM · Shree Residency · in person</div></span><span class="chip chip-ok">${ic("globe")} Website</span><span class="chip chip-ok">Confirmed</span></button>
        <button class="list-row"><span class="grow"><b>Meena (parent)</b><div class="tiny muted">Fri 12 Sep · 11:00 AM · Green Nest PG</div></span><span class="chip">Phone</span><span class="chip chip-warn">Pending</span></button>
        <button class="list-row"><span class="grow"><b>Sameer</b><div class="tiny muted">Sat 13 Sep · 10:00 AM · Shree Residency · video call</div></span><span class="chip chip-ok">${ic("globe")} Website</span><span class="chip chip-warn">Rescheduled</span></button>
      </div>
      <p class="sub" style="margin-top:var(--s3)">The <span class="chip chip-ok">${ic("globe")} Website</span> tag shows which visits your site brought in — visible in month, week and list views.</p>`;
  }

  /* ---------- shared bits ---------- */
  function backLink() { return `<button class="btn btn-ghost btn-sm back" data-go="home">${ic("cl")} Back to Website</button>`; }
  // every sub-screen gets a clear title + one-line description
  function pageHead(title, sub, opts) {
    opts = opts || {};
    return `<div class="pagehead">${opts.noBack ? "" : `<div class="back">${backLink()}</div>`}
      <h1>${esc(title)}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>`;
  }
  function toggleRow(label, on, attr, sub) {
    return `<label class="rcard between"><span class="rc-body">${esc(label)}${sub ? `<span class="rc-sub">${esc(sub)}</span>` : ""}</span>
      <span class="tgl"><input type="checkbox" ${on ? "checked" : ""} ${attr || ""}><i></i></span></label>`;
  }
  function stepRow(label, val, sub) {
    return `<div class="rcard between"><span class="rc-body">${esc(label)}${sub ? `<span class="rc-sub">${esc(sub)}</span>` : ""}</span>
      <span class="stepper"><button aria-label="Less">−</button><b>${val}</b><button aria-label="More">+</button></span></div>`;
  }
  // the ONE advanced-lock component — small, informative, not a sales card
  function advLock(what, why, basicNote, opts) {
    opts = opts || {};
    return `<div class="advlock">
      <div class="al-head">${ic("lock")} ${esc(what)} — part of Advanced</div>
      <p>${why}</p>
      ${basicNote ? `<div class="al-basic">On Basic: ${esc(basicNote)}</div>` : ""}
      <div class="al-actions"><button class="btn btn-sm btn-primary" data-go="upgrade">See what Advanced includes</button>
      ${opts.noDismiss ? "" : `<button class="btn btn-sm btn-ghost" data-go="home">Not now</button>`}</div></div>`;
  }
  const advPanel = advLock; // back-compat for existing call sites
  function frommgr(where) { return `<span class="frommgr">${ic("link")} From ManagR${where ? " · " + esc(where) : ""}</span>`; }

  let V = { route: "list", prop: "p1", step: 0, testMode: true };

  /* ============================================================================
     PART 2 · EDITOR
     ========================================================================== */
  const RAIL = [["layers", "Sections", "layers"], ["pages", "Pages", "pages"], ["add", "Add", "plus"], ["assets", "Photos", "image"]];

  function renderEditor() {
    if (!canEdit()) { renderEditorLocked(); return; }
    $("#etop").innerHTML = editorTop();
    $("#mtop").innerHTML = editorMobileTop();
    $("#erail").innerHTML = editorRail();
    $("#eLeft").innerHTML = editorLeft();
    $("#eRight").innerHTML = inspector();
    $("#eCanvas").innerHTML = canvas();
    $("#eCanvas").className = "ecanvas " + (S.editMode ? "editmode" : "previewmode");
    $("#estatus").innerHTML = editorStatus();
    $("#mbar").innerHTML = mobileBar();
    const mf = $("#mfloat");
    mf.innerHTML = mobileFloat();
    mf.classList.toggle("hide", !(S.sel && S.sel.block != null && window.matchMedia("(max-width:999px)").matches));
    maybeCoach();
  }
  function renderEditorLocked() {
    $("#etop").innerHTML = `<button class="btn btn-ghost btn-sm" data-go="home">${ic("cl")} ManagR</button><span class="sep"></span><span class="site-crumb">${esc(OWNER.biz)}</span>`;
    $("#mtop").innerHTML = ""; $("#erail").innerHTML = ""; $("#eLeft").innerHTML = ""; $("#eRight").innerHTML = "";
    $("#estatus").innerHTML = ""; $("#mbar").innerHTML = ""; $("#mfloat").classList.add("hide");
    $("#eCanvas").innerHTML = `<div style="max-width:420px;margin:40px auto;text-align:center" class="stack">
      ${ic("lock")}<h2>View only</h2>
      <p class="tiny muted">Your role (<b>${S.role}</b>) can see the website but not edit it. Keeping bed status current in ManagR is the part of the job that keeps public availability honest.</p>
      <div class="row" style="justify-content:center"><button class="btn btn-sm" data-open-live>${ic("eye")} Preview the live site</button><button class="btn btn-sm" data-go="home">Back</button></div>
      <p class="tiny dim">Ask an Owner to change your access.</p></div>`;
  }

  function editorTop() {
    return `
      <button class="btn btn-ghost btn-sm" data-go="home">${ic("cl")} ManagR</button>
      <span class="sep"></span>
      <span class="site-crumb">${ic("globe")} ${esc(OWNER.biz)}</span>
      <button class="pagepick" data-open-pagepick>${pageIcon(page())} ${esc(page().name)} ${ic("cd")}</button>
      ${saveStateHtml()}
      <span class="right"></span>
      <button class="btn btn-ico btn-sm" data-undo aria-label="Undo (⌘Z)" ${HPOS <= 0 ? "aria-disabled='true'" : ""}>${ic("undo")}</button>
      <button class="btn btn-ico btn-sm" data-redo aria-label="Redo" ${HPOS >= HIST.length - 1 ? "aria-disabled='true'" : ""}>${ic("redo")}</button>
      <span class="sep"></span>
      <div class="seg"><button data-device="desktop" class="${S.device === "desktop" ? "on" : ""}">${ic("monitor")}</button><button data-device="tablet" class="${S.device === "tablet" ? "on" : ""}">${ic("tablet")}</button><button data-device="mobile" class="${S.device === "mobile" ? "on" : ""}">${ic("phone-d")}</button></div>
      <button class="btn btn-sm" data-toggle-mode>${S.editMode ? ic("eye") + " Preview" : ic("edit") + " Edit"}</button>
      <div class="split"><button class="btn btn-sm btn-primary" data-publish>Publish</button><button class="btn btn-sm btn-primary" data-publish-menu>${ic("cd")}</button></div>`;
  }
  function editorMobileTop() {
    return `<button class="btn btn-ico btn-sm" data-go="home" aria-label="Back">${ic("cl")}</button>
      <button class="pagepick grow" data-open-pagepick style="justify-content:flex-start">${esc(page().name)} ${ic("cd")}</button>
      ${saveStateHtml()}
      <button class="btn btn-ico btn-sm" data-editor-more aria-label="More">${ic("more")}</button>`;
  }
  function pageIcon(p) { return p.kind === "template:property" ? ic("grid") : ic("pages"); }

  function editorRail() {
    return RAIL.map((r) => `<button data-leftmode="${r[0]}" class="${S.leftMode === r[0] ? "on" : ""}">${ic(r[2])}<span>${r[1]}</span></button>`).join("") +
      `<div class="sep"></div>
       <button data-open-theme>${ic("sparkle")}<span>Design</span></button>
       <button data-open-responsive>${ic("tablet")}<span>Check</span></button>
       <div class="spacer"></div>
       <button data-cmd>${ic("search")}<span>Find</span></button>`;
  }

  /* ---------- left panel ---------- */
  function editorLeft() {
    if (S.leftMode === "pages") return pagesPanel();
    if (S.leftMode === "add") return addPanel();
    if (S.leftMode === "assets") return assetsPanel();
    return layersPanel();
  }

  function layersPanel() {
    const pg = page();
    const structRows = pg.blocks.map((b, i) => ({ b, i })).filter((x) => SECTIONS[x.b.type].struct);
    const bodyRows = pg.blocks.map((b, i) => ({ b, i })).filter((x) => !SECTIONS[x.b.type].struct);
    return `<div class="epanel-h">${esc(pg.name)} page <span class="eh-sub">${pg.blocks.filter((b) => !b.hidden).length} shown</span></div>
      <div class="epanel-body">
        ${structureLocked() ? `<div class="callout callout-adv" style="margin-bottom:var(--s3)"><div class="tiny"><b>${ic("lock")} Fixed layout on Basic.</b> You can change the wording in each section. Advanced lets you reorder, add, hide and remove them.</div></div>` : ""}
        <div class="navgroup-h">Sections on this page</div>
        ${bodyRows.map((x) => navRow(x.b, x.i)).join("")}
        ${structureLocked() ? "" : `<button class="btn btn-sm btn-block" style="margin-top:var(--s2)" data-leftmode="add">${ic("plus")} Add a section</button>`}
        <div class="navgroup-h">On every page</div>
        ${structRows.map((x) => navRow(x.b, x.i)).join("")}
        <div class="tiny dim" style="padding:6px">The header and footer show on all pages — editing one changes it everywhere.</div>
      </div>`;
  }
  function navRow(b, i, sub) {
    const d = SECTIONS[b.type];
    const locked = sectionLocked(b.type);
    const nd = d.needs && needsData(b.type);
    const sel = S.sel && S.sel.block === i && S.sel.sub == null;
    const meta = b.hidden ? `<span class="navrow-meta">hidden</span>`
      : locked ? `<span class="chip chip-adv">${ic("lock")}</span>`
      : nd ? `<span class="chip chip-warn" title="Needs data">needs data</span>`
      : b.global ? `<span class="navrow-meta">all pages</span>` : "";
    const canStruct = !d.struct && !structureLocked();
    const tools = canStruct ? `<span class="navrow-tools">
        <button data-secmove="${i},-1" title="Move up" aria-label="Move up">${ic("cu")}</button>
        <button data-secmove="${i},1" title="Move down" aria-label="Move down">${ic("cd")}</button>
        <button data-sechide="${i}" title="${b.hidden ? "Show" : "Hide"}" aria-label="${b.hidden ? "Show" : "Hide"}">${ic(b.hidden ? "eye" : "eye-off")}</button>
        ${d.dup ? `<button data-secdup="${i}" title="Duplicate" aria-label="Duplicate">${ic("dup")}</button>` : ""}
        <button data-secdel="${i}" title="Remove" aria-label="Remove">${ic("trash")}</button>
      </span>` : "";
    const subrows = (d.sub && sel) ? `<div class="navsub">${d.sub.map((s, si) => `<div class="navrow ${S.sel && S.sel.sub === si ? "sel" : ""}" data-sel="${i}:${si}"><span class="navrow-ico">${ic("text")}</span><span class="navrow-name">${esc(s)}</span></div>`).join("")}</div>` : "";
    return `<div class="navrow ${sel ? "sel" : ""} ${d.struct ? "struct" : ""} ${b.hidden ? "hidden-sec" : ""}" data-sel="${i}" ${canStruct ? `draggable="true" data-drag="${i}"` : ""}>
      ${canStruct ? `<span class="drag" title="Drag to reorder">${ic("drag")}</span>` : `<span class="drag" style="opacity:.2">${ic("drag")}</span>`}
      <span class="navrow-ico">${ic(d.ico)}</span>
      <span class="navrow-name">${esc(d.name)}</span>${meta}${tools}
    </div>${subrows}`;
  }

  function pagesPanel() {
    if (!advActive()) return `<div class="epanel-h">Pages</div><div class="epanel-body">
      ${pageRow(S.pages[0])}${pageRow(S.pages.find((p) => p.kind === "template:property"))}
      <div class="callout callout-adv tiny" style="margin-top:10px">${ic("lock")} Extra pages — About, Gallery, FAQ, Contact — are part of Advanced.<br><button class="btn btn-sm" style="margin-top:6px" data-go="upgrade">See Advanced</button></div>
      <div class="tiny muted" style="margin-top:8px">The <b>Property page</b> is one design that ManagR fills in for every approved property — not something you build per property.</div>
    </div>`;
    return `<div class="epanel-h">Pages</div><div class="epanel-body">
      ${S.pages.filter((p) => p.kind !== "template:property").map((p) => pageRow(p)).join("")}
      <div class="navgroup-h">Templates</div>
      ${pageRow(S.pages.find((p) => p.kind === "template:property"))}
      <button class="btn btn-sm btn-block" style="margin-top:9px" data-add-page>${ic("plus")} Add page</button>
    </div>`;
  }
  function pageRow(p) {
    if (!p) return "";
    const on = S.currentPage === p.id;
    return `<div class="navrow ${on ? "sel" : ""}" data-page-open="${p.id}">
      <span class="navrow-ico">${pageIcon(p)}</span>
      <span class="navrow-name">${esc(p.name)}${p.home ? ` <span class="chip">home</span>` : ""}${p.hidden ? ` <span class="chip chip-off">hidden</span>` : ""}${!p.inNav && !p.home && p.kind === "standard" ? ` <span class="chip">not in nav</span>` : ""}</span>
      ${p.kind === "standard" && !p.home ? `<span class="navrow-tools"><button data-page-menu="${p.id}" aria-label="Page options">${ic("more")}</button></span>` : ""}
    </div>`;
  }

  const ADD_CAT_LABELS = { Hero: "Top of the page", Properties: "Your rooms", Trust: "Building trust", Content: "Words & pictures", Convert: "Getting in touch", Contact: "Contact" };
  function addCard(t, present) {
    const d = SECTIONS[t];
    const added = d.solo && present.indexOf(t) >= 0;
    const adv = d.advanced && !advActive();
    const nd = d.needs && needsData(t);
    const tag = added ? `<span class="chip">On the page</span>`
      : adv ? `<span class="chip chip-adv">${ic("lock")} Advanced</span>`
      : nd ? `<span class="chip chip-warn">Needs data first</span>`
      : `<span class="chip chip-ok">${ic("plus")} Add</span>`;
    return `<button class="list-row" data-addsec="${t}" ${added ? "disabled" : ""} style="border:1px solid var(--line-2);border-radius:var(--r);margin-bottom:6px">
      <span class="navrow-ico">${ic(d.ico)}</span>
      <span class="grow"><b>${esc(d.name)}</b><div class="tiny muted">${sectionBlurb(t)}</div></span>${tag}</button>`;
  }
  function addPanel() {
    if (structureLocked()) return `<div class="epanel-h">Add a section</div><div class="epanel-body">
      <div class="advlock"><div class="al-head">${ic("lock")} Adding &amp; rearranging sections</div>
      <p>Basic keeps a fixed, safe layout you can’t break. Advanced opens the full library — FAQ, Gallery, Offer banner, Enquiry form, Visit booking and more.</p>
      <div class="al-actions"><button class="btn btn-sm btn-primary" data-go="upgrade">See what Advanced includes</button></div></div></div>`;
    const present = page().blocks.map((b) => b.type);
    const body = ADD_CATS.map((cat) => {
      const items = Object.keys(SECTIONS).filter((t) => SECTIONS[t].cat === cat);
      return `<div class="navgroup-h">${ADD_CAT_LABELS[cat] || cat}</div>` + items.map((t) => addCard(t, present)).join("");
    }).join("");
    return `<div class="epanel-h">Add a section <button class="btn btn-ghost btn-sm" data-leftmode="layers">${ic("cl")} Back</button></div>
      <div class="epanel-body">
        <div class="field" style="margin-bottom:var(--s3)"><div class="row" style="border:1px solid var(--line);border-radius:var(--r);padding-left:8px">${ic("search")}<input class="inp" id="addSearch" placeholder="Search…" style="border:0" aria-label="Search sections"></div></div>
        <div class="navgroup-h">Suggested for you</div>
        ${["reviews", "faq", "offer"].map((t) => addCard(t, present)).join("")}
        ${body}
        <div class="tiny dim" style="padding:6px;margin-top:var(--s2)">Every section is pre-built and can’t break on a phone. New sections go in just above the footer — you can move them after.</div>
      </div>`;
  }
  function sectionBlurb(t) {
    return ({
      hero: "A headline, a line under it, and a button. The first thing people see.",
      properties: "Your rooms as cards — name, area, rent, availability. Straight from ManagR.",
      featured: "Put one property in the spotlight.",
      areas: "List the neighbourhoods you have buildings in.",
      highlights: "Meals included, CCTV, walk to the metro — the reasons to choose you.",
      trust: "A simple “Direct from owner · No brokerage” bar.",
      reviews: "Real tenant reviews, pulled from ManagR.",
      about: "Your story in a few lines, with one photo.",
      richtext: "A free block of text — house rules, meal menu, anything.",
      gallery: "A wall of photos from across your properties.",
      faq: "Answer the questions people always ask, and cut repeat calls.",
      enquiry: "A short form. Every submission becomes a lead in your CRM.",
      visit: "Visitors book a viewing themselves, in the slots you allow.",
      bookcta: "A button for visitors to request a bed from a move-in date.",
      offer: "“₹1,000 off this month” — shows and hides itself on dates you set.",
      contact: "Phone, WhatsApp, email and an approximate map.",
      wacta: "A WhatsApp button that stays on screen as people scroll."
    })[t] || "";
  }

  function assetsPanel() {
    const total = ALL_PROPS.reduce((a, p) => a + p.photos, 0);
    return `<div class="epanel-h">Assets</div><div class="epanel-body">
      <div class="navgroup-h">From ManagR (${total} property photos)</div>
      <div class="s-grid c3" style="gap:5px">${Array.from({ length: 9 }, (_, i) => `<div class="ph" style="min-height:44px">IMG</div>`).join("")}</div>
      <div class="tiny muted" style="margin-top:6px">${ic("link")} Browsed in place — never copied. Add or change these in <b>Properties → Photos</b>.</div>
      <div class="navgroup-h">Website uploads</div>
      ${advActive() ? `<div class="list">
        <div class="list-row tiny"><span class="grow">Logo</span><span class="chip">not set — “S” mark used</span><button class="btn btn-sm">Upload</button></div>
        <div class="list-row tiny"><span class="grow">Favicon</span><span class="chip">ManagR mark</span><button class="btn btn-sm">Upload</button></div>
      </div>
      <button class="btn btn-sm btn-block" style="margin-top:8px" data-asset-upload>${ic("plus")} Upload an image</button>
      <div class="tiny muted" style="margin-top:6px">JPG / PNG · up to 5 MB. Small or very wide images get a gentle warning before use.</div>`
      : `<div class="callout callout-adv tiny">${ic("lock")} Your own logo, favicon and uploads are part of Advanced.</div>`}
    </div>`;
  }

  /* ---------- canvas ---------- */
  function canvas() {
    const pg = page();
    const accent = liveTheme().accent;
    const blocks = pg.blocks.map((b, i) => {
      const visible = !b.hidden && (S.editMode || b.visibility[S.device] !== false);
      if (!S.editMode && !visible) return "";
      const d = SECTIONS[b.type];
      const locked = sectionLocked(b.type);
      const nd = d.needs && needsData(b.type);
      let inner;
      if (locked) inner = `<div class="sec-locked">${ic("lock")} ${esc(d.name)} — part of Advanced<span>${esc(sectionBlurb(b.type))}</span></div>`;
      else if (nd) inner = `<div class="sec-empty"><b>${esc(d.name)} — nothing to show yet</b>${b.type === "reviews"
        ? "This appears automatically once you have tenant reviews (collected in ManagR → Tenants)."
        : "None of your public properties have photos yet. Add some in ManagR → Properties."}<br><span class="dim">Visitors won’t see an empty box — the section just doesn’t appear.</span></div>`;
      else inner = siteSection(b, accent);
      const bpHidden = b.visibility[S.device] === false;
      const sel = S.sel && S.sel.block === i;
      const canStruct = !d.struct && !structureLocked();
      const mini = S.editMode && sel ? `<span class="sec-mini">
        ${canStruct ? `<button data-secmove="${i},-1" title="Move up" aria-label="Move up">${ic("cu")}</button>
        <button data-secmove="${i},1" title="Move down" aria-label="Move down">${ic("cd")}</button>
        <button data-sechide="${i}" title="${b.hidden ? "Show" : "Hide"}" aria-label="${b.hidden ? "Show" : "Hide"}">${ic(b.hidden ? "eye" : "eye-off")}</button>
        ${d.dup ? `<button data-secdup="${i}" title="Duplicate" aria-label="Duplicate">${ic("dup")}</button>` : ""}
        <button data-secdel="${i}" title="Remove" aria-label="Remove">${ic("trash")}</button><span class="sep"></span>` : ""}
        <button class="wide" data-deselect title="Done">${ic("check")} Done</button></span>` : "";
      return `<div class="sec ${sel ? "sel" : ""} ${b.hidden || bpHidden ? "sec-hidden" : ""} ${b.global ? "sec-global" : ""} ${b.dense && b.dense !== "comfortable" ? "dense-" + b.dense : ""}" data-canvas-sel="${i}">
        <span class="sec-tag">${esc(d.name)}${b.hidden ? " · hidden" : bpHidden ? " · off on " + S.device : ""}${b.global ? " · on every page" : ""}</span>
        ${mini}
        ${inner}</div>`;
    }).join("");
    const dev = { desktop: "Computer view", tablet: "Tablet view", mobile: "Phone view" }[S.device];
    const noteEdit = !S.editMode ? `<div class="preview-note">${ic("eye")} You’re previewing your <b>draft</b> — visitors still see your published site${V.testMode ? ". Forms won’t send." : "."}</div>` : "";
    const topbar = `<div class="canvas-topbar">
      <span class="ct-label">${S.editMode ? "Your website" : "Preview"}</span>
      <span>· ${dev}${S.editMode ? " · click a section to edit it" : ""}</span>
      <span class="right"></span>
      <button class="btn btn-sm" data-open-live>${ic("play")} Open full preview</button></div>`;
    return `<div class="ecanvas-inner">${topbar}<div class="frame ${S.device}">
      <div class="frame-bar"><i></i><i></i><i></i><span class="u">${esc(url())}${page().slug && page().slug !== "" ? "/" + esc(page().slug.replace("…", "")) : ""}</span></div>
      ${noteEdit}
      <div class="site" style="--sa:${accent}">${blocks}</div></div></div>`;
  }
  function liveTheme() {
    // lapsed → live site reverts to default look; draft/editor keep the chosen theme
    if (S.plan === "lapsed" && !S.editMode) return THEMES.modern;
    return THEMES[S.theme];
  }

  function siteSection(b, accent) {
    const P = publicProps();
    const gd = sectionData(b);
    const availChip = (p) => {
      if (!S.availOn || !advActive() || staleProp(p)) return "";
      const total = p.rooms.reduce((a, r) => a + r.freeNow, 0);
      const soon = p.rooms.find((r) => r.from);
      if (total > 0) return `<div class="s-avail">${S.availNumbers === "vague" ? "Available" : total + " bed" + (total > 1 ? "s" : "") + " now"}</div>`;
      if (soon && S.availFromDate) return `<div class="s-avail full">${S.availNumbers === "vague" ? "Full" : "Full · from " + soon.from}</div>`;
      return `<div class="s-avail full">Full</div>`;
    };
    switch (b.type) {
      case "header": return `<div class="s-hdr"><span class="s-logo">${S.globals.header.logo ? "LOGO" : "S · " + esc(OWNER.biz).split(" ")[0]}</span>
        <span class="s-navlinks">${S.globals.header.links.join(" · ") || "—"}</span>
        ${S.globals.header.call ? `<span class="s-btn fill">Call</span>` : ""}</div>`;
      case "hero": {
        const hImg = `<div class="ph" style="min-height:62px">${gd.bg === "plain" ? "COLOUR" : "PROPERTY PHOTO"}</div>`;
        const hTxt = `<div class="s-h1">${esc(gd.headline || getInfo("headline"))}</div>
          <div class="s-sub">${esc(gd.sub || "Direct from owner. No brokerage.")}</div>
          <span class="s-btn fill">${esc(gd.btn || "Call now")}</span>`;
        const hl = b.layout || "Image on top";
        if (hl === "Text only") return `<div class="stack-xs">${hTxt}</div>`;
        if (hl === "Image background") return `<div class="ph" style="min-height:104px;display:grid;place-items:center;text-align:center;padding:var(--s3)"><div class="stack-xs">${hTxt}</div></div>`;
        if (hl === "Image left") return `<div class="s-grid c2" style="align-items:center">${hImg}<div class="stack-xs">${hTxt}</div></div>`;
        if (hl === "Image right") return `<div class="s-grid c2" style="align-items:center"><div class="stack-xs">${hTxt}</div>${hImg}</div>`;
        return `<div class="stack-xs">${hImg}${hTxt}</div>`;
      }
      case "properties": {
        if (!P.length) return `<div class="sec-empty">No approved properties — visitors see “New listings coming soon”.</div>`;
        const pl = b.layout || "Photo cards";
        const pcols = pl === "Compact list" ? "c1" : pl === "2 per row" ? "c2" : pl === "3 per row" ? "c3" : (S.device === "desktop" ? "c3" : "c2");
        return `<div class="s-h2">Our properties</div><div class="s-grid ${pcols}">${P.map((p) =>
          `<div class="s-pcard">${p.photos ? `<div class="ph">PHOTO</div>` : `<div class="ph" style="color:var(--stop)">NO PHOTO</div>`}
          <div class="b"><b>${esc(p.name)}</b><div class="a">${esc(p.area)}</div><div class="r">${p.from} <span style="font-weight:400;color:#999">/mo</span></div>
          <div class="wrapline" style="margin-top:2px">${p.sharing.map((s) => `<span class="chip" style="font-size:8px;padding:0 4px">${s}</span>`).join("")}</div>${availChip(p)}</div></div>`).join("")}</div>
          ${props().some((p) => p.status === "review") ? `<div class="sec-empty" style="margin-top:7px">1 property greyed out — under review. Visible to you here, not to visitors.</div>` : ""}`;
      }
      case "featured": { const p = P[0]; return p ? `<div class="s-h2">Featured</div><div class="s-pcard"><div class="ph" style="min-height:90px">PHOTO</div><div class="b"><b>${esc(p.name)}</b><div class="a">${esc(p.area)} · ${p.from}/mo</div>${availChip(p)}</div></div>` : `<div class="sec-empty">No property to feature.</div>`; }
      case "areas": return `<div class="s-h2">Areas we cover</div><div class="wrapline">${[...new Set(P.map((p) => p.area))].map((a) => `<span class="chip">${a}</span>`).join("")}</div>`;
      case "highlights": return `<div class="s-h2">Why stay here</div><div class="s-grid ${S.device === "mobile" ? "c2" : "c3"}">${(gd.items || ["Meals included", "CCTV", "Walk to metro"]).map((h) => `<div class="s-hl"><div class="ph"></div>${esc(h)}</div>`).join("")}</div>`;
      case "trust": return `<div style="border:1px solid ${accent};color:${accent};border-radius:3px;padding:7px;text-align:center;font-weight:800;font-size:11px">${ic("shield")} DIRECT FROM OWNER · NO BROKERAGE</div>`;
      case "reviews": return `<div class="s-h2">What tenants say</div><div class="stack-xs">${[0, 0].map(() => `<div class="s-q">“Clean, safe, good food.” — verified tenant</div>`).join("")}</div>`;
      case "about": return `<div class="s-grid c2"><div><div class="s-h2">About us</div><div class="s-sub">${esc(gd.text || getInfo("about"))}</div></div><div class="ph" style="min-height:60px">PHOTO</div></div>`;
      case "richtext": return `<div class="s-sub">${esc(gd.text || "Your text here — house rules, meal menu, anything.")}</div>`;
      case "gallery": return `<div class="s-h2">Photos</div><div class="s-grid c3">${Array.from({ length: 6 }, () => `<div class="ph" style="min-height:42px">IMG</div>`).join("")}</div>`;
      case "faq": return `<div class="s-h2">Common questions</div>${(gd.items || ["What’s the rent?", "Are meals included?", "Notice period?"]).map((q) => `<div class="s-row"><b>${esc(q)}</b></div>`).join("")}`;
      case "enquiry": return `<div class="s-h2">Send an enquiry</div><div class="stack-xs"><div class="ph" style="min-height:22px">Name</div><div class="ph" style="min-height:22px">Phone</div><div class="ph" style="min-height:22px">Budget / move-in</div><span class="s-btn fill">Send</span></div>`;
      case "visit": return `<div class="s-h2">Book a visit</div><div class="s-sub">Pick a day and time that suits you.</div><span class="s-btn fill" style="margin-top:5px">See slots</span>`;
      case "bookcta": return `<div style="border:1px dashed ${accent};border-radius:3px;padding:8px;text-align:center"><b style="font-size:11px">Ready to move in?</b><br><span class="s-btn fill" style="margin-top:4px">Request a bed</span></div>`;
      case "offer": return `<div style="border:1px dashed ${accent};color:${accent};border-radius:3px;padding:7px;text-align:center;font-weight:800;font-size:11px">${esc(gd.text || "₹1,000 OFF THIS MONTH")}</div>`;
      case "contact": return `<div class="s-h2">Contact</div>${["📞 " + OWNER.phone, "💬 WhatsApp", "📍 " + OWNER.area.split(",")[0] + " (approximate)"].map((r) => `<div class="s-row">${r}</div>`).join("")}`;
      case "wacta": return `<div style="background:${accent};color:#fff;border-radius:3px;padding:6px;text-align:center;font-size:10px;font-weight:700">${ic("wa")} ${esc(gd.text || "Chat with us")}</div>`;
      case "footer": return `<div class="s-foot">${esc(OWNER.biz)} · ${OWNER.phone} · ${OWNER.area.split(",")[0]}<br>Direct from owner · No brokerage</div>
        ${S.globals.footer.powered || !advActive() ? `<div class="s-powered">Powered by ManagR</div>` : ""}`;
      default: return "";
    }
  }

  /* ---------- inspector ---------- */
  const INSP_TABS = [["content", "Content"], ["layout", "Layout"], ["data", "Data"], ["visibility", "Visibility"]];
  function inspector() {
    if (!S.sel || S.sel.block == null) return inspPageOverview();
    const b = page().blocks[S.sel.block]; if (!b) return inspPageOverview();
    const d = SECTIONS[b.type];
    if (sectionLocked(b.type)) return `<div class="epanel-h">${esc(d.name)}</div><div class="epanel-body">${advPanelInline(b.type, S.sel.block)}</div>`;
    if (d.needs && needsData(b.type)) return `<div class="epanel-h">${esc(d.name)}</div><div class="epanel-body"><div class="callout callout-warn stack-sm">
      <b>Can’t show this yet</b><div class="tiny">${b.type === "reviews" ? "You have no tenant reviews." : "None of your public properties have photos."}</div>
      ${srcNote(b.type === "reviews" ? "Tenants → Reviews" : "Properties → Photos")}
      <button class="btn btn-sm" data-sechide="${S.sel.block}">Hide this section for now</button></div></div>`;
    const tab = S.inspTab || "content";
    const tabName = { content: "Content", layout: "Layout", data: "ManagR data", visibility: "Visibility" };
    return `<div class="epanel-h">${esc(d.name)}
        <span class="row">
        <button class="btn btn-ico btn-sm" data-sechide="${S.sel.block}" title="${b.hidden ? "Show section" : "Hide section"}" aria-label="${b.hidden ? "Show section" : "Hide section"}">${ic(b.hidden ? "eye" : "eye-off")}</button>
        ${d.struct ? "" : `<button class="btn btn-ico btn-sm" data-secdel="${S.sel.block}" title="Remove section" aria-label="Remove section">${ic("trash")}</button>`}
        <button class="btn btn-ico btn-sm" data-deselect title="Close" aria-label="Close">${ic("x")}</button></span></div>
      ${b.global
        ? `<div class="insp-lead global">${ic("link")} <span>This appears on <b>every page</b>. Changes here apply everywhere.</span></div>`
        : `<div class="insp-lead">${ic("info")} <span>Editing the <b>${esc(d.name)}</b> section on the <b>${esc(page().name)}</b> page.</span></div>`}
      <div class="insp-tabs">${INSP_TABS.map((t) => `<button class="${tab === t[0] ? "on" : ""}" data-insptab="${t[0]}">${tabName[t[0]]}</button>`).join("")}</div>
      <div class="epanel-body stack-sm">${inspTabBody(b, tab)}</div>`;
  }
  function inspPageOverview() {
    const pg = page();
    const chk = siteCheck();
    const pageChecks = [...chk.blockers, ...chk.warnings].filter((c) => ["hero", "properties", "header", "footer", "contact"].indexOf(c.where) >= 0 || c.where === "home");
    return `<div class="epanel-h">Page: ${esc(pg.name)}</div><div class="epanel-body stack-sm">
      <div class="tiny muted">Select a section on the canvas or in Layers to edit it.</div>
      <div class="section-label" style="margin-top:6px">Sections on this page (${pg.blocks.filter((b) => !b.hidden).length} shown)</div>
      ${pg.blocks.filter((b) => !SECTIONS[b.type].struct).map((b) => { const i = pg.blocks.indexOf(b); return `<label class="rcard between"><span class="tiny">${esc(SECTIONS[b.type].name)}</span><span class="tgl"><input type="checkbox" ${b.hidden ? "" : "checked"} data-sechide="${i}"><i></i></span></label>`; }).join("")}
      <div class="section-label" style="margin-top:8px">Readiness for this page</div>
      ${pageChecks.length ? pageChecks.map((c) => `<div class="health-item ${chk.blockers.indexOf(c) >= 0 ? "blocker" : "warn"}">${ic(chk.blockers.indexOf(c) >= 0 ? "alert" : "info")}<div class="tiny">${esc(c.msg)}</div></div>`).join("") : `<div class="tiny help-ok">${ic("check")} Nothing outstanding.</div>`}
      ${advActive() && pg.kind === "standard" ? `<div class="section-label" style="margin-top:8px">Page SEO</div>
        <div class="field"><label class="lbl">Search title</label><input class="inp" value="${esc(pg.name)} · ${esc(OWNER.biz)}"></div>
        <div class="field"><label class="lbl">Search description</label><textarea class="ta"></textarea></div>` : ""}
    </div>`;
  }
  function advPanelInline(type, idx) {
    const M = { enquiry: ["Enquiry form", "Turns a website visitor into a lead in your CRM — name, phone, budget, move-in — tagged “Website”. The section preview on the canvas shows what visitors would see."],
      visit: ["Visit booking", "Visitors book a viewing themselves in the slots you allow. Every booking lands in Scheduled Visits."],
      bookcta: ["Booking request", "Visitors request a bed from a move-in date; you approve or decline."] };
    const m = M[type] || ["This section", "Part of Advanced."];
    return `<div class="advlock">
      <div class="al-head">${ic("lock")} ${esc(m[0])} — part of Advanced</div>
      <p>${esc(m[1])}</p>
      <div class="al-actions"><button class="btn btn-sm btn-primary" data-go="upgrade">See what Advanced includes</button>
      <button class="btn btn-sm btn-ghost" data-secdel="${idx}">Remove this section</button></div></div>`;
  }
  function srcNote(where) { return `<div class="note-src">${ic("link")} From ManagR · <a>${esc(where)}</a> · can’t be typed here</div>`; }
  function boundField(label, value, where) {
    return `<div class="bound-field"><div class="tiny muted">${esc(label)}</div><div class="bv">${esc(value)}</div>
      <div class="row">${frommgr()}<a>Edit in ManagR →</a></div>
      <div class="tiny dim" style="margin-top:2px">Managed in ${esc(where)}</div></div>`;
  }

  function inspTabBody(b, tab) {
    if (tab === "visibility") return inspVisibility(b);
    if (tab === "data") return inspData(b);
    if (tab === "layout") return inspLayout(b);
    return inspContent(b);
  }
  function inspVisibility(b) {
    return `<label class="rcard between"><span class="tiny"><b>Show this section</b></span><span class="tgl"><input type="checkbox" ${b.hidden ? "" : "checked"} data-sechide="${S.sel.block}"><i></i></span></label>
      <div class="section-label" style="margin-top:8px">Show on</div>
      ${["desktop", "tablet", "mobile"].map((bp) => `<label class="rcard between"><span class="tiny">${bp[0].toUpperCase() + bp.slice(1)}</span><span class="tgl"><input type="checkbox" ${b.visibility[bp] !== false ? "checked" : ""} data-visbp="${bp}"><i></i></span></label>`).join("")}
      ${b.type === "offer" ? `<div class="section-label" style="margin-top:8px">Schedule</div><div class="row"><input class="inp" type="date"><input class="inp" type="date"></div><div class="help">Banner hides itself outside these dates.</div>` : ""}
      <div class="tiny muted" style="margin-top:8px">${ic("info")} Hiding on a breakpoint keeps the section — it just doesn’t render at that size.</div>`;
  }
  function inspData(b) {
    const rows = {
      hero: [["Background photo", "Shree Residency — exterior", "Properties → Photos"]],
      properties: [["Property name, area, rent, rooms", "3 approved properties", "Properties"], ["Availability shown on cards", S.availOn ? "On · " + S.availLevel : "Off", "Live availability"]],
      featured: [["Property details", publicProps()[0] ? publicProps()[0].name : "—", "Properties"]],
      highlights: [["Feature options", "Meals, CCTV, WiFi, Laundry, Metro, Backup", "Properties → Amenities"]],
      about: [["Photo", "A property photo", "Properties → Photos"]],
      gallery: [["Photos", props().reduce((a, p) => a + p.photos, 0) + " property photos", "Properties → Photos"]],
      reviews: [["Reviews", publicProps().reduce((a, p) => a + p.reviews, 0) + " tenant reviews", "Tenants → Reviews"]],
      areas: [["Areas", [...new Set(props().map((p) => p.area))].join(", "), "Properties → Location"]],
      contact: [["Phone / WhatsApp / email", getInfo("phone"), "Website settings → Contact"], ["Map location", "Approximate only — exact address never shown", "—"]],
      enquiry: [["Where leads go", "Leads & CRM · tagged “Website”", "Leads & CRM"]],
      visit: [["Days, slots, rules", "From your visit settings", "Visit settings"]],
      footer: [["Contact details", getInfo("phone"), "Website settings → Contact"]]
    }[b.type];
    if (!rows) return `<div class="tiny muted">This section has no live ManagR data — everything in it is content you set.</div>`;
    return `<div class="tiny muted" style="margin-bottom:6px">These values come straight from ManagR and update on your live site automatically — they’re never part of a “publish”.</div>` +
      rows.map((r) => boundField(r[0], r[1], r[2])).join("") +
      ((b.type === "properties") ? `<button class="btn btn-sm btn-block" style="margin-top:8px" data-go="availability">Configure availability →</button>` : "");
  }
  function inspLayout(b) {
    const variants = {
      hero: ["Image on top", "Image left", "Image right", "Image background", "Text only"],
      properties: ["Photo cards", "Compact list", "2 per row", "3 per row"],
      about: ["Text + photo", "Photo + text", "Text only"],
      gallery: ["Grid", "Rows", "Masonry"],
      highlights: ["3 across", "2 across", "Icon list"],
      contact: ["Stacked", "Two columns"]
    }[b.type] || ["Default"];
    const cur = b.layout && variants.indexOf(b.layout) >= 0 ? b.layout : variants[0];
    const dense = b.dense || "comfortable";
    return `<div class="section-label">Layout</div>
      <div class="wrapline">${variants.map((v) => `<button class="btn btn-sm ${v === cur ? "btn-primary" : ""}" data-layout="${esc(v)}">${esc(v)}</button>`).join("")}</div>
      <div class="section-label" style="margin-top:var(--s3)">Spacing around this section</div>
      <div class="seg" style="width:100%">${["Comfortable", "Compact", "Roomy"].map((d) => `<button class="${dense === d.toLowerCase() ? "on" : ""}" data-density="${d.toLowerCase()}">${d}</button>`).join("")}</div>
      <div class="tiny muted" style="margin-top:var(--s2)">Colours, fonts and corners come from your <a data-open-theme style="color:var(--accent)">theme</a> — not set per section.</div>
      <div class="tiny dim" style="margin-top:var(--s2)">${ic("info")} Layout and spacing apply on every screen size. To hide this section on phones, use the <b>Visibility</b> tab.</div>`;
  }
  function inspContent(b) {
    const d = sectionData(b);
    const t = (key, label, ph, hint) => `<div class="field"><label class="lbl">${esc(label)}</label><input class="inp" data-field="${key}" value="${esc(d[key] || "")}" placeholder="${esc(ph || "")}">${hint ? `<div class="help">${hint}</div>` : ""}</div>`;
    const ta = (key, label, ph) => `<div class="field"><label class="lbl">${esc(label)}</label><textarea class="ta" data-field="${key}" placeholder="${esc(ph || "")}">${esc(d[key] || "")}</textarea></div>`;
    const bpNote = S.device !== "desktop" ? `<p class="tiny dim" style="margin-bottom:var(--s3)">${ic("info")} You’re viewing the ${S.device} layout. Your wording and layout apply on every screen — only the <b>Visibility</b> tab (show / hide) can differ per screen.</p>` : "";
    return bpNote + inspContentBody(b, d, t, ta);
  }
  function more(label, body) { return `<details class="more"><summary>${esc(label)}</summary><div class="more-body stack-sm">${body}</div></details>`; }
  function inspContentBody(b, d, t, ta) {
    const chk = (l, on, attr) => `<label class="rcard"><input type="checkbox" ${on ? "checked" : ""} ${attr || ""}><span class="rc-body">${esc(l)}</span></label>`;
    switch (b.type) {
      case "header": return t("logotext", "Business name shown", OWNER.biz) +
        `<div class="field" style="margin-top:var(--s3)"><label class="lbl">Logo</label><div class="row">${S.globals.header.logo ? `<div class="ph" style="width:44px;min-height:30px">LOGO</div>` : `<div class="ph" style="width:44px;min-height:30px">S</div>`}
          ${advActive() ? `<button class="btn btn-sm" data-leftmode="assets">Choose a logo</button>` : `<span class="chip chip-adv">${ic("lock")} Advanced</span>`}</div>
          <div class="help">No logo is fine — visitors see a clean “S” mark. Never a broken image.</div></div>
        ${more("Menu links & buttons", `
          <div class="field"><label class="lbl">Which links appear in the menu</label>${["Properties", "About", "Contact", "FAQ", "Gallery"].map((l) => chk(l, S.globals.header.links.indexOf(l) >= 0, `data-hdrlink="${l}"`)).join("")}
          <div class="help">Only pages you’ve created can be linked. Order follows your page order.</div></div>
          ${toggleRow("Show a Call button in the menu", S.globals.header.call, "data-hdrcall")}
          ${toggleRow("Keep the menu visible as visitors scroll", S.globals.header.sticky, "data-hdrsticky")}`)}`;
      case "hero": return t("headline", "Main heading", getInfo("headline"), "Leave blank to use a sensible default.") +
        t("sub", "One line under it", "Direct from owner. No brokerage.") +
        `<div class="field" style="margin-top:var(--s3)"><label class="lbl">Main button does</label><select class="sel" data-field="btnAction"><option>Start a phone call</option><option>Open WhatsApp</option><option>Scroll down to properties</option><option>Nothing (hide the button)</option></select></div>` +
        more("Picture & button wording", `
          <div class="field"><label class="lbl">Background picture</label><select class="sel" data-field="bg"><option value="photo" ${d.bg !== "plain" ? "selected" : ""}>Use one of my property photos</option><option value="upload" ${!advActive() ? "disabled" : ""}>Upload a picture${advActive() ? "" : " — Advanced"}</option><option value="plain" ${d.bg === "plain" ? "selected" : ""}>Plain colour, no picture</option></select></div>
          ${t("btn", "Button wording", "Call now")}`);
      case "properties": return `
        <div class="field"><label class="lbl">Which properties to show</label><select class="sel"><option>All ${publicProps().length} approved properties</option><option>Pick specific ones…</option></select></div>
        ${frommgr("Properties")}
        <div class="field" style="margin-top:var(--s3)"><label class="lbl">Order them by</label><select class="sel"><option>Newest first</option><option>Ones I’ve featured first</option><option>Most beds available first</option></select></div>
        ${more("Card style & count", `
          ${stepRow("Show at most this many", "6")}
          <div class="field"><label class="lbl">Card style</label><div class="seg" style="width:100%"><button class="on">With photo</button><button>Compact</button></div></div>
          <button class="btn btn-sm btn-block" data-open-propfilter>See the “pick specific” screen (search &amp; filters for many buildings)</button>`)}`;
      case "highlights": return `<div class="field"><label class="lbl">Choose from features on your properties</label>${["Meals included", "CCTV", "WiFi", "Laundry", "Walk to metro", "Power backup"].map((l, i) => chk(l, i < 3)).join("")}</div>
        ${frommgr("Properties → Amenities")}
        ${more("Write your own", `<button class="btn btn-sm">${ic("plus")} Add a custom highlight</button><div class="help">Pick a simple icon and type a short label.</div>`)}`;
      case "about": return ta("text", "Your story, in a few lines", getInfo("about")) +
        `<div class="field" style="margin-top:var(--s3)"><label class="lbl">Photo beside it</label><select class="sel"><option>One of my property photos</option><option ${advActive() ? "" : "disabled"}>Upload a photo${advActive() ? "" : " — Advanced"}</option></select></div>`;
      case "richtext": return ta("text", "Free text — house rules, meal menu, anything", "Type here…");
      case "faq": return `<div class="list">${(d.items || ["What’s the rent?", "Are meals included?", "Notice period?"]).map((q) => `<div class="list-row"><span class="grow">${esc(q)}</span><button class="btn btn-ico btn-sm" aria-label="Edit">${ic("edit")}</button><button class="btn btn-ico btn-sm" aria-label="Remove">${ic("x")}</button></div>`).join("")}</div>
        <button class="btn btn-sm" style="margin-top:var(--s2)">${ic("plus")} Add a question</button>
        ${more("Common questions to add in one tap", `<div class="wrapline">${["Is there a curfew?", "Is a deposit required?", "Can I visit first?", "Are guests allowed?"].map((q) => `<button class="chip chip-lg">+ ${q}</button>`).join("")}</div>`)}`;
      case "gallery": return `<div class="field"><label class="lbl">Which photos to show</label>
        <p class="sub" style="margin:4px 0 8px">${props().reduce((a, p) => a + p.photos, 0)} photos available across your properties.</p>
        ${frommgr("Properties → Photos")}
        <button class="btn btn-sm btn-block" style="margin-top:8px" data-leftmode="assets">Choose photos</button></div>
        ${more("Arrangement", `<div class="seg" style="width:100%"><button class="on">Grid</button><button>Rows</button></div>`)}`;
      case "offer": return t("text", "Offer text", "₹1,000 off this month") +
        `<div class="row" style="margin-top:var(--s3);gap:var(--s3)"><div class="field grow"><label class="lbl">Show from</label><input class="inp" type="date"></div><div class="field grow"><label class="lbl">Hide after</label><input class="inp" type="date"></div></div>
        <div class="help">The banner shows and hides itself on these dates.</div>
        ${more("Colour", `<div class="wrapline">${["#b5651d", "#227a52", "#c0392b"].map((c) => `<button class="btn btn-ico" style="background:${c};border-color:${c}" aria-label="colour"></button>`).join("")}</div>`)}`;
      case "contact": return `<div class="field"><label class="lbl">Which ways to contact you show</label>
        ${["Phone number", "WhatsApp", "Email", "Approximate map", "Opening hours"].map((l, i) => chk(l, i !== 2)).join("")}</div>
        <div class="callout callout-info tiny" style="margin-top:var(--s3)">${ic("shield")} The map is always the general area only — your exact street address is never shown, on any plan.</div>`;
      case "wacta": return t("text", "Button wording", "Chat with us");
      case "trust": return `<div class="callout tiny">This banner reads “Direct from owner · No brokerage”. It’s fixed wording because it performs well — you can hide the section but not reword it.</div>`;
      case "areas": return `<div class="field"><label class="lbl">Areas to list</label>${[...new Set(props().map((p) => p.area))].map((a) => chk(a, true)).join("")}</div>${frommgr("Properties → Location")}`;
      case "reviews": return `<div class="field"><label class="lbl">Which reviews to feature</label>
        <p class="sub" style="margin:4px 0 8px">${publicProps().reduce((a, p) => a + p.reviews, 0)} tenant reviews available.</p>
        ${frommgr("Tenants → Reviews")}</div>`;
      case "featured": return `<div class="field"><label class="lbl">Property to spotlight</label><select class="sel">${publicProps().map((p) => `<option>${esc(p.name)}</option>`).join("")}</select></div>${frommgr("Properties")}`;
      case "enquiry": return `<div class="field"><label class="lbl">What the form asks for</label>
        ${["Name", "Phone number"].map((l) => `<label class="rcard"><input type="checkbox" checked disabled><span class="rc-body">${l}<span class="rc-sub">always asked</span></span></label>`).join("")}
        ${["What they’re looking for", "Move-in date", "Budget"].map((l) => chk(l, true)).join("")}</div>
        <div class="bound-field" style="margin-top:var(--s3)"><div class="tiny muted">Enquiries go to</div><div class="bv">Leads &amp; CRM — tagged “Website”</div>${frommgr()}</div>
        ${toggleRow("Floating “Enquire” button on mobile", true)}`;
      case "visit": return `<div class="field"><label class="lbl">Properties that accept visits</label>${publicProps().map((p) => chk(p.name, true)).join("")}</div>
        <button class="btn btn-sm btn-block" style="margin-top:var(--s2)" data-go="visits">${ic("calendar")} Set the days, times &amp; rules →</button>`;
      case "footer": return `<div class="field"><label class="lbl">Details shown in the footer</label>${["Phone number", "WhatsApp", "Email", "Office area", "Instagram link"].map((l) => chk(l, S.globals.footer.fields.indexOf(l.split(" ")[0]) >= 0 || l === "Phone number" || l === "WhatsApp", `data-footfield="${l.split(" ")[0]}"`)).join("")}</div>
        ${advActive() ? toggleRow("Show “Powered by ManagR”", S.globals.footer.powered, "data-footpowered") : `<div class="advlock" style="margin-top:var(--s3);padding:var(--s3)"><div class="al-head">${ic("lock")} Hide “Powered by ManagR”</div><p style="font-size:12px">Available on Advanced. On Basic it stays on.</p></div>`}`;
      default: return `<div class="tiny muted">This section has no wording to change — use the Layout and Visibility tabs.</div>`;
    }
  }

  /* ---------- status bar + mobile bars ---------- */
  function editorStatus() {
    const pg = page();
    const chk = siteCheck();
    const r = respIssues();
    return `<span>${esc(pg.name)} page · ${pg.blocks.filter((b) => !b.hidden).length} sections shown</span>
      <button data-go="health">${chk.blockers.length ? `${ic("alert")} ${chk.blockers.length} to fix before publishing` : chk.warnings.length ? `${ic("info")} ${chk.warnings.length} to review` : `${ic("check")} Ready to publish`}</button>
      <button data-open-responsive>${r.length ? `${ic("tablet")} ${r.length} phone-layout issue${r.length > 1 ? "s" : ""}` : `${ic("tablet")} Phone layout looks good`}</button>
      <span class="right"></span>
      <button class="qa" data-cmd>${ic("search")} Quick actions <span class="dim">(Ctrl-K)</span></button>`;
  }
  function mobileBar() {
    const b = (m, label, icon) => `<button data-leftmode-m="${m}" class="${S.leftMode === m && S._mpanelOpen ? "on" : ""}">${ic(icon)}${label}</button>`;
    return b("layers", "Sections", "layers") + b("add", "Add", "plus") +
      `<button data-open-theme>${ic("sparkle")}Design</button>
       <button data-toggle-mode>${ic(S.editMode ? "eye" : "edit")}${S.editMode ? "Preview" : "Edit"}</button>
       <button data-publish>${ic("check")}Publish</button>`;
  }
  function mobileFloat() {
    if (!S.sel || S.sel.block == null) return "";
    const b = page().blocks[S.sel.block]; const d = SECTIONS[b.type];
    const canStruct = !d.struct && !structureLocked();
    return `<span class="nm">${esc(d.name)}${b.hidden ? " · hidden" : ""}</span>
      ${canStruct ? `<button data-secmove="${S.sel.block},-1" aria-label="Move up">${ic("cu")}</button><button data-secmove="${S.sel.block},1" aria-label="Move down">${ic("cd")}</button>` : ""}
      <button class="wide" data-msettings>${ic("edit")} Edit this</button>
      <button data-deselect aria-label="Done">${ic("check")}</button>`;
  }

  /* ---------- editor actions ---------- */
  function selectBlock(i, sub) {
    if (S.sel && S.sel.block === i && S.sel.sub === (sub == null ? undefined : sub) && sub == null) { S.sel = null; }
    else S.sel = { page: S.currentPage, block: i, sub: sub == null ? undefined : sub };
    save(); renderEditor();
  }
  function moveBlock(i, dir) {
    if (structureLocked()) return openLock("reorder");
    const arr = page().blocks; const j = i + dir;
    if (j < 1 || j > arr.length - 2) return;
    if (SECTIONS[arr[i].type].struct) return;
    snapshot();
    arr.splice(j, 0, arr.splice(i, 1)[0]);
    if (S.sel && S.sel.block === i) S.sel.block = j;
    markSaved(); renderEditor(); toast("Moved " + SECTIONS[arr[j].type].name);
  }
  function reorderTo(from, to) {
    if (structureLocked()) return;
    const arr = page().blocks;
    if (to < 1 || to > arr.length - 2 || from === to) return;
    snapshot();
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    S.sel = null; markSaved(); renderEditor();
  }
  function hideBlock(i) {
    if (structureLocked()) return openLock("hide");
    snapshot(); const b = page().blocks[i]; b.hidden = !b.hidden;
    markSaved(); renderEditor(); toast(b.hidden ? "Hid " + SECTIONS[b.type].name : "Showing " + SECTIONS[b.type].name, () => { b.hidden = !b.hidden; save(); renderEditor(); });
  }
  function dupBlock(i) {
    if (structureLocked()) return openLock("add");
    snapshot(); const b = clone(page().blocks[i]); b.id = uid();
    page().blocks.splice(i + 1, 0, b); markSaved(); renderEditor(); toast("Duplicated");
  }
  function delBlock(i) {
    const b = page().blocks[i];
    if (SECTIONS[b.type].struct) return;
    if (structureLocked() && !sectionLocked(b.type)) return openLock("remove");
    snapshot(); const removed = clone(b);
    page().blocks.splice(i, 1);
    if (S.sel && S.sel.block === i) S.sel = null;
    markSaved(); renderEditor();
    toast("Removed " + SECTIONS[b.type].name, () => { page().blocks.splice(i, 0, removed); save(); renderEditor(); });
  }
  function addBlock(type) {
    if (structureLocked()) return openLock("add");
    const d = SECTIONS[type];
    if (d.solo && page().blocks.some((b) => b.type === type)) { toast("Already on this page"); return; }
    snapshot();
    const footIdx = page().blocks.findIndex((b) => b.type === "footer");
    const at = footIdx < 0 ? page().blocks.length : footIdx;
    page().blocks.splice(at, 0, mkBlock(type));
    S.sel = { page: S.currentPage, block: at }; S.leftMode = "layers";
    markSaved(); closeOverlay(); renderEditor();
    toast(`Added ${d.name}`);
  }
  function setLeftMode(m) { S.leftMode = m; S._mpanelOpen = true; save(); renderEditor(); }
  function setDevice(dev) { S.device = dev; save(); renderEditor(); }
  function toggleMode() { S.editMode = !S.editMode; if (!S.editMode) S.sel = null; save(); renderEditor(); }
  function setInspTab(t) { S.inspTab = t; renderEditor(); }
  function setPage(id) { S.currentPage = id; S.sel = null; save(); renderEditor(); closeOverlay(); }

  /* ============================================================================
     PART 3 · OVERLAYS
     ========================================================================== */
  function openOverlay(html, opts) {
    opts = opts || {};
    const ov = $("#ov");
    ov.className = "ov on" + (opts.sheet ? " as-modal" : "");
    ov.innerHTML = opts.sheet
      ? `<div class="sheet ${opts.full ? "sheet-full" : ""} ${opts.wide ? "sheet-wide" : ""}"><div class="sheet-grip"></div>${html}</div>`
      : `<div class="modal">${html}</div>`;
  }
  function closeOverlay() { $("#ov").className = "ov"; $("#ov").innerHTML = ""; }

  function openLock(feature) {
    const M = {
      reorder: ["Rearranging sections", "Change the order sections appear on your page."],
      hide: ["Hiding sections", "Turn a section off without deleting it."],
      remove: ["Removing sections", "Take a section off your page."],
      add: ["Adding & duplicating sections", "Add sections like FAQ, Gallery, Offer banner, Enquiry, Visit booking."],
      pages: ["Extra pages", "Add About, Gallery, FAQ or Contact pages."],
      brand: ["Your logo, colours & fonts", "Make the site properly yours."]
    };
    const m = M[feature] || ["This", "Part of Advanced."];
    openOverlay(`<div class="modal-h"><b>${esc(m[0])} — Advanced</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b stack-sm"><div class="tiny">${esc(m[1])}</div>
      <div class="tiny muted">Basic keeps a fixed, safe layout you can’t break. Advanced unlocks the full editor, your branding, extra pages, and the Advanced sections. <b>Nothing you’ve set is lost when you upgrade or if Advanced later lapses.</b></div></div>
      <div class="modal-f"><button class="btn" data-close>Maybe later</button><button class="btn btn-primary" data-go="upgrade" data-close>See Advanced</button></div>`);
  }

  /* ---------- pages ---------- */
  function openPagePick() {
    openOverlay(`<div class="sheet-h"><div><b>Pages</b><div class="tiny muted">Jump to a page to edit it</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b"><div class="list">${S.pages.map((p) => `<button class="list-row" data-page-open="${p.id}"><span class="navrow-ico">${pageIcon(p)}</span><span class="grow tiny"><b>${esc(p.name)}</b>${p.home ? " · home" : ""}${p.hidden ? " · hidden" : ""}</span>${S.currentPage === p.id ? ic("check") : ""}</button>`).join("")}</div>
      ${advActive() ? `<button class="btn btn-sm btn-block" style="margin-top:9px" data-add-page>${ic("plus")} Add page</button>` : `<div class="callout callout-adv tiny" style="margin-top:9px">${ic("lock")} Extra pages are part of Advanced.</div>`}</div>`, { sheet: true });
  }
  function openPageMenu(id) {
    const p = S.pages.find((x) => x.id === id);
    openOverlay(`<div class="sheet-h"><b>${esc(p.name)}</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b list">
        <button class="list-row" data-page-rename="${id}">${ic("edit")} Rename</button>
        <button class="list-row" data-page-sethome="${id}">${ic("home")} Set as home page</button>
        <label class="list-row"><span class="grow">${ic("globe")} Show in navigation</span><span class="tgl"><input type="checkbox" ${p.inNav ? "checked" : ""} data-page-nav="${id}"><i></i></span></label>
        <label class="list-row"><span class="grow">${ic("eye-off")} Hidden (link only)</span><span class="tgl"><input type="checkbox" ${p.hidden ? "checked" : ""} data-page-hide="${id}"><i></i></span></label>
        <button class="list-row" data-page-dup="${id}">${ic("dup")} Duplicate page</button>
        <button class="list-row" data-page-del="${id}" style="color:var(--stop)">${ic("trash")} Delete page</button>
      </div>`, { sheet: true });
  }
  function openAddPage() {
    if (!advActive()) return openLock("pages");
    openOverlay(`<div class="sheet-h"><div><b>Add a page</b><div class="tiny muted">Each page is a fresh section stack you compose</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b"><div class="list">${[["about", "About", ["header", "about", "highlights", "contact", "footer"]], ["gallery", "Gallery", ["header", "gallery", "contact", "footer"]], ["faq", "FAQ", ["header", "faq", "contact", "footer"]], ["contact", "Contact", ["header", "contact", "footer"]], ["blank", "Blank page", ["header", "footer"]]].map((x) => `<button class="list-row" data-newpage="${x[0]}"><span class="grow tiny"><b>${x[1]}</b> <span class="muted">${x[2].filter((t) => !SECTIONS[t].struct).join(", ") || "empty"}</span></span>${ic("plus")}</button>`).join("")}</div></div>`, { sheet: true });
  }
  function makePage(kind) {
    if (!advActive()) return;
    snapshot();
    const names = { about: "About", gallery: "Gallery", faq: "FAQ", contact: "Contact", blank: "New page" };
    const layouts = { about: ["header", "about", "highlights", "contact", "footer"], gallery: ["header", "gallery", "contact", "footer"], faq: ["header", "faq", "contact", "footer"], contact: ["header", "contact", "footer"], blank: ["header", "footer"] };
    const id = kind + "-" + uid();
    const p = { id, name: names[kind], slug: kind === "blank" ? "page" : kind, kind: "standard", home: false, hidden: false, inNav: true, blocks: layouts[kind].map((t) => mkBlock(t)) };
    S.pages.splice(S.pages.length - 1, 0, p);
    S.currentPage = id; S.sel = null; markSaved(); closeOverlay(); renderEditor(); toast(`Added ${p.name} page`);
  }
  function pageAction(kind, id) {
    const idx = S.pages.findIndex((p) => p.id === id); const p = S.pages[idx];
    snapshot();
    if (kind === "sethome") { S.pages.forEach((x) => x.home = false); p.home = true; p.inNav = true; toast(`${p.name} is now the home page`); }
    if (kind === "dup") { const c = clone(p); c.id = "cp-" + uid(); c.name = p.name + " copy"; c.home = false; c.slug = (p.slug || "page") + "-copy"; c.blocks.forEach((b) => b.id = uid()); S.pages.splice(idx + 1, 0, c); toast("Page duplicated"); }
    if (kind === "del") {
      if (p.home) { toast("Can’t delete the home page"); closeOverlay(); return; }
      S.pages.splice(idx, 1); if (S.currentPage === id) S.currentPage = "home"; toast(`Deleted ${p.name}`, () => { S.pages.splice(idx, 0, p); save(); renderEditor(); });
    }
    if (kind === "rename") { const n = prompt("Page name", p.name); if (n) p.name = n.trim(); }
    markSaved(); closeOverlay(); renderEditor();
  }

  /* ---------- theme + template + brand ---------- */
  let designTab = "template";
  function openTheme() {
    if (brandingLocked() && designTab !== "template") designTab = "template";
    const tabs = [["template", "Template"], ["theme", "Theme"], ["brand", "Brand"]];
    let body;
    if (designTab === "template") body = designTemplate();
    else if (!advActive()) body = advPanel("Themes & branding", "Pick a complete look, then fine-tune colour and fonts from safe presets.", "Basic uses the ManagR palette and a generated mark.");
    else if (designTab === "theme") body = designTheme();
    else body = designBrand();
    openOverlay(`<div class="sheet-h"><div><b>Design</b><div class="tiny muted">Template = arrangement · Theme = look · Brand = your details</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="tabbar" style="padding:0 var(--s4);margin-bottom:0">${tabs.map((t) => `<button class="${designTab === t[0] ? "on" : ""}" data-designtab="${t[0]}">${esc(t[1])}</button>`).join("")}</div>
      <div class="sheet-b">${body}</div>`, { sheet: true, wide: true });
  }
  function designTemplate() {
    return `<p class="tiny muted" style="margin-bottom:10px">A template sets the <b>section arrangement</b>. Applying keeps your text where the section type stays.</p>` +
      Object.keys(TEMPLATES).map((k) => { const t = TEMPLATES[k];
        return `<div class="card between" style="margin-bottom:9px"><div><b>${t.name}</b><div class="tiny muted">${t.blurb}</div>
          <div class="tiny mono dim" style="margin-top:4px">${t.blocks.filter((b) => !SECTIONS[b].struct).join(" → ")}</div></div>
          <button class="btn btn-sm" data-apply-template="${k}">Preview &amp; apply</button></div>`; }).join("") +
      `<div class="tiny muted">${ic("info")} You can always rearrange afterward. Template + theme are independent.</div>`;
  }
  function designTheme() {
    return Object.keys(THEMES).map((k) => { const t = THEMES[k]; const on = S.theme === k;
      return `<div class="card between" style="margin-bottom:9px"><div class="row"><div class="ph" style="width:44px;min-height:44px;border-color:${t.accent}">Aa</div>
        <div><b>${t.name}${on ? ` <span class="chip chip-ok">Current</span>` : ""}</b><div class="tiny muted">${t.blurb}</div></div></div>
        ${on ? "" : `<button class="btn btn-sm" data-apply-theme="${k}">Preview &amp; apply</button>`}</div>`; }).join("");
  }
  function designBrand() {
    return `<div class="field"><label class="lbl">Accent colour</label><div class="wrapline">${ACCENTS.map((c, i) => `<button class="btn btn-ico btn-sm" data-accent="${c}" style="background:${c};border-color:${c};${THEMES[S.theme].accent === c ? "outline:2px solid #000;outline-offset:2px" : ""}"></button>`).join("")}</div><div class="help">Curated palettes only — each keeps text readable. No hex, no colour wheel.</div></div>
      <div class="field"><label class="lbl">Font pairing</label><select class="sel"><option>Sans — clean</option><option>Serif headings — warm</option><option>Rounded — friendly</option></select></div>
      <div class="field"><label class="lbl">Corners</label><div class="wrapline"><button class="btn btn-sm">Square</button><button class="btn btn-sm btn-primary">Soft</button><button class="btn btn-sm">Round</button></div></div>
      <div class="field"><label class="lbl">Logo</label><div class="row"><div class="ph" style="width:44px;min-height:30px">S</div><button class="btn btn-sm" data-asset-upload>Upload logo</button></div><div class="help">No logo → a generated “S” mark. Never broken.</div></div>
      <div class="callout callout-info tiny" style="margin-top:10px">${ic("info")} Every section is built to survive a brand-colour swap — try the visitor-site colour switch in the prototype bar.</div>`;
  }
  function openApplyTheme(k) {
    const t = THEMES[k];
    openOverlay(`<div class="modal-h"><b>Apply “${t.name}” theme?</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b stack-sm"><div class="ph" style="min-height:80px;border-color:${t.accent}">${t.name.toUpperCase()} PREVIEW</div>
      <div class="tiny"><b>Changes:</b> colours, fonts, corner style, card style, spacing — across every page.</div>
      <div class="tiny muted"><b>Stays the same:</b> your sections, their order, all your text, your logo, and all ManagR data.</div></div>
      <div class="modal-f"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-do-theme="${k}">Apply</button></div>`);
  }
  function openApplyTemplate(k) {
    const t = TEMPLATES[k];
    const cur = S.pages[0].blocks.map((b) => b.type);
    const add = t.blocks.filter((x) => cur.indexOf(x) < 0).map((x) => SECTIONS[x].name);
    const rem = cur.filter((x) => t.blocks.indexOf(x) < 0 && !SECTIONS[x].struct).map((x) => SECTIONS[x].name);
    openOverlay(`<div class="modal-h"><b>Apply “${t.name}” template?</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b stack-sm">
      <div class="tiny">This changes the <b>Home page</b> layout only.</div>
      ${add.length ? `<div class="tiny"><b>Added:</b> ${add.join(", ")}</div>` : ""}
      ${rem.length ? `<div class="tiny help-warn"><b>Removed:</b> ${rem.join(", ")} <span class="muted">(recoverable via Undo &amp; Version history)</span></div>` : ""}
      <div class="tiny muted">Text is kept for every section type that stays. Your theme, other pages and data are untouched.</div></div>
      <div class="modal-f"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-do-template="${k}">Apply template</button></div>`);
  }
  function applyTemplate(k) {
    snapshot();
    const t = TEMPLATES[k];
    const old = S.pages[0].blocks;
    S.pages[0].blocks = t.blocks.map((type) => {
      const prev = old.find((b) => b.type === type);
      return prev ? prev : mkBlock(type);
    });
    S.sel = null; markSaved(); closeOverlay(); renderEditor(); toast(`Applied ${t.name} template`);
  }

  /* ---------- responsive checker ---------- */
  function openResponsive() {
    const issues = respIssues();
    openOverlay(`<div class="sheet-h"><div><b>Responsive check</b><div class="tiny muted">Scans your draft for layout problems on smaller screens</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b">
        ${issues.length === 0 ? `<div class="empty"><h4>${ic("check")} Looks good</h4>No responsive problems found on this page.</div>`
          : issues.map((i) => `<div class="card" style="margin-bottom:8px"><div class="between"><b class="tiny">${esc(i.msg)}</b><span class="chip chip-warn">${i.bp}</span></div>
            <div class="row" style="margin-top:7px"><button class="btn btn-sm" data-resp-jump="${i.where}">Jump to it</button>${i.fix ? `<button class="btn btn-sm btn-primary" data-resp-fix="${esc(i.msg)}">${esc(i.fix)}</button>` : ""}<button class="btn btn-sm btn-ghost" data-resp-dismiss="${esc(i.msg)}">Dismiss</button></div></div>`).join("")}
        <div class="callout callout-info tiny" style="margin-top:8px">${ic("info")} Editing on Tablet or Mobile makes an <b>override</b> just for that size. Desktop stays the base; smaller screens inherit it unless you change something.</div>
      </div>
      <div class="sheet-f"><button class="btn" data-close>Close</button></div>`, { sheet: true, wide: true });
  }

  /* ---------- publish ---------- */
  function publishSummary() {
    if (!S.published) return { sections: page().blocks.length, theme: true, pages: S.pages.length, first: true };
    const a = S.published, b = { pages: S.pages, theme: S.theme, globals: S.globals };
    let secChanges = 0;
    a.pages.forEach((pp, pi) => {
      const cur = S.pages[pi]; if (!cur) return;
      if (JSON.stringify(pp.blocks) !== JSON.stringify(cur.blocks)) secChanges++;
    });
    return { sections: secChanges, theme: a.theme !== S.theme, pages: a.pages.length !== S.pages.length, globals: JSON.stringify(a.globals) !== JSON.stringify(S.globals) };
  }
  function openPublish() {
    if (!canPublish()) { openOverlay(`<div class="modal-h"><b>Can’t publish</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div><div class="modal-b tiny">Your role (${S.role}) can edit the draft but not publish. Ask an Owner or a Website manager to publish.</div><div class="modal-f"><button class="btn btn-primary" data-close>OK</button></div>`); return; }
    if (!draftDirty()) { openOverlay(`<div class="modal-h"><b>Nothing to publish</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div><div class="modal-b tiny muted">Your draft already matches your live site.</div><div class="modal-f"><button class="btn btn-primary" data-close>OK</button></div>`); return; }
    const chk = siteCheck();
    const sum = publishSummary();
    if (chk.blockers.length) {
      openOverlay(`<div class="modal-h"><b>${chk.blockers.length} thing${chk.blockers.length > 1 ? "s" : ""} to fix before publishing</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
        <div class="modal-b">${chk.blockers.map((x) => `<div class="health-item blocker">${ic("alert")}<div class="tiny">${esc(x.msg)}</div><button class="jump" data-health-jump="${x.where}" data-close>Fix →</button></div>`).join("")}
        <div class="tiny muted" style="margin-top:8px">Your live site is unchanged while you sort these out.</div></div>
        <div class="modal-f"><button class="btn btn-primary" data-close>OK</button></div>`);
      return;
    }
    const parts = [];
    if (sum.sections) parts.push(`${sum.sections} section change${sum.sections > 1 ? "s" : ""}`);
    if (sum.theme) parts.push("1 theme change");
    if (sum.pages) parts.push("page changes");
    if (sum.globals) parts.push("header/footer changes");
    openOverlay(`<div class="modal-h"><b>${chk.warnings.length ? `Ready to publish · ${chk.warnings.length} warning${chk.warnings.length > 1 ? "s" : ""}` : "Ready to publish"}</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b stack-sm">
        <div class="tiny">Publishing to <span class="mono">${esc(url())}</span> — visitors see this immediately.</div>
        <div class="card" style="padding:10px"><div class="tiny"><b>Changed:</b> ${parts.join(" · ") || "minor edits"}</div>
          <div class="tiny help-ok" style="margin-top:3px">${ic("check")} No data changes — rent, rooms and availability always come straight from ManagR.</div></div>
        ${chk.warnings.length ? `<div class="callout callout-warn tiny">${chk.warnings.map((w) => `• ${esc(w.msg)}`).join("<br>")}</div>` : ""}
      </div>
      <div class="modal-f"><button class="btn" data-close>Keep editing</button><button class="btn btn-primary" data-do-publish>${chk.warnings.length ? "Publish anyway" : "Publish now"}</button></div>`);
  }
  function doPublish() {
    closeOverlay();
    if (S._pubFail) {
      openOverlay(`<div class="modal-h"><b>Couldn’t publish</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
        <div class="modal-b stack-sm"><div class="callout callout-stop tiny">${ic("alert")} <b>Network problem.</b> We couldn’t reach the publishing service. Your live site is unchanged — nothing was half-published.</div>
        <div class="tiny muted">Check your connection and try again. Your draft is safe.</div></div>
        <div class="modal-f"><button class="btn" data-close>Close</button><button class="btn btn-primary" data-do-publish>Try again</button></div>`);
      return;
    }
    const vsum = verSummary();   // compute the change summary BEFORE we overwrite the published baseline
    S.published = { pages: clone(S.pages), theme: S.theme, globals: clone(S.globals) };
    S.versions.unshift({ id: "v" + uid(), kind: "published", ts: Date.now(), summary: vsum, isLive: true,
      snap: { pages: clone(S.pages), theme: S.theme, globals: clone(S.globals) } });
    S.versions.forEach((v, i) => { if (i > 0) v.isLive = false; });
    S.versions = S.versions.slice(0, 12);
    save(); renderEditor();
    openOverlay(`<div class="modal-h"><b>${ic("check")} Published</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b tiny">Your live site is updated. Bound data (rent, rooms, availability) keeps updating on its own.</div>
      <div class="modal-f"><button class="btn" data-close>Back to editor</button><button class="btn btn-primary" data-open-live data-close>View live</button></div>`);
  }
  function verSummary() {
    const s = publishSummary();
    const p = [];
    if (s.sections) p.push("sections");
    if (s.theme) p.push("theme");
    if (s.globals) p.push("header/footer");
    return p.length ? p.map((x) => x[0].toUpperCase() + x.slice(1)).join(" + ") : "Minor edits";
  }
  function openPublishMenu() {
    openOverlay(`<div class="sheet-h"><b>Publish</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b list">
        <button class="list-row" data-publish data-close>${ic("check")} Publish changes</button>
        <button class="list-row" data-open-responsive data-close>${ic("tablet")} Check site (readiness &amp; responsive)</button>
        <button class="list-row" data-open-live data-close>${ic("play")} Preview draft as a visitor</button>
        <button class="list-row" data-versions data-close>${ic("history")} Version history</button>
        <button class="list-row" data-discard data-close>${ic("refresh")} Discard all draft changes</button>
      </div>`, { sheet: true });
  }
  function openDiscard() {
    openOverlay(`<div class="modal-h"><b>Discard draft changes?</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b tiny">Your current draft is saved to version history first, then reset to match your live site. Your live site is not affected.</div>
      <div class="modal-f"><button class="btn" data-close>Keep draft</button><button class="btn btn-danger" data-do-discard>Discard</button></div>`);
  }
  let verRows = [];
  function openVersions() {
    verRows = [];
    verRows.push({ kind: "draft", label: draftDirty() ? "Current draft — unpublished edits" : "Current draft — matches your live site", ts: "now", live: false });
    S.versions.forEach((v) => {
      verRows.push({ kind: "published", live: !!v.isLive, snap: v.snap, ts: relTime(v.ts),
        label: v.isLive ? "Live — " + (v.summary || "current version") : (v.summary || "A published version") });
    });
    openOverlay(`<div class="sheet-h"><div><b>Version history</b><div class="tiny muted">What your site looked like over time</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b">${verRows.map((r, i) => `<div class="ver ${r.kind}"><span class="marker"></span>
        <div class="meta"><b class="tiny">${esc(r.label)}${r.live ? ` <span class="chip chip-ok">live</span>` : ""}</b><div class="tiny muted">${r.ts}</div></div>
        <div class="acts">${r.kind === "published" ? `<button class="btn btn-sm" data-ver-preview="${i}">Preview</button>` : ""}${r.kind === "published" && !r.live && r.snap ? `<button class="btn btn-sm" data-ver-restore="${i}">Restore</button>` : ""}</div></div>`).join("")}
      <div class="callout callout-info tiny" style="margin-top:10px">${ic("info")} <b>Preview</b> opens that version as visitors would have seen it. <b>Restore</b> brings it back as your draft (your current draft is saved first). Nothing goes live until you publish.</div></div>`, { sheet: true, wide: true });
  }
  function relTime(ts) { const m = Math.round((Date.now() - ts) / 60000); return m < 1 ? "just now" : m < 60 ? m + "m ago" : m < 1440 ? Math.round(m / 60) + "h ago" : Math.round(m / 1440) + "d ago"; }

  /* ---------- mobile more + section settings ---------- */
  function openEditorMore() {
    openOverlay(`<div class="sheet-h"><b>More</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b list">
        <button class="list-row" data-leftmode-m="pages" data-close>${ic("pages")} Pages</button>
        <button class="list-row" data-leftmode-m="assets" data-close>${ic("image")} Assets</button>
        <button class="list-row" data-open-responsive data-close>${ic("tablet")} Responsive check</button>
        <button class="list-row" data-open-settings data-close>${ic("settings")} Website settings</button>
        <button class="list-row" data-versions data-close>${ic("history")} Version history</button>
        <button class="list-row" data-undo>${ic("undo")} Undo</button>
        <button class="list-row" data-discard data-close>${ic("refresh")} Discard draft changes</button>
        <button class="list-row" data-open-live data-close>${ic("play")} Preview as visitor</button>
      </div>`, { sheet: true });
  }
  function openMobileSettings() {
    if (!S.sel || S.sel.block == null) return;
    const b = page().blocks[S.sel.block]; const d = SECTIONS[b.type];
    const tab = S.inspTab || "content";
    const tabName = { content: "Content", layout: "Layout", data: "ManagR data", visibility: "Visibility" };
    const body = sectionLocked(b.type) ? advPanelInline(b.type, S.sel.block)
      : (d.needs && needsData(b.type)) ? `<div class="callout callout-warn"><h4>Can’t show this yet</h4><div class="tiny">${b.type === "reviews" ? "You have no tenant reviews yet. It will appear on its own when you do." : "None of your public properties have photos yet."}</div><button class="btn btn-sm" style="margin-top:8px" data-sechide="${S.sel.block}" data-close>Hide this section for now</button></div>`
      : `<div class="insp-tabs" style="position:static">${INSP_TABS.map((t) => `<button class="${tab === t[0] ? "on" : ""}" data-insptab="${t[0]}">${tabName[t[0]]}</button>`).join("")}</div><div class="stack-sm" style="margin-top:var(--s4)">${inspTabBody(b, tab)}</div>`;
    openOverlay(`<div class="sheet-h">
        <div><div class="sh-title">${esc(d.name)}</div><div class="sh-sub">${b.hidden ? "Hidden" : "Shown"} on your site${b.global ? " · appears on every page" : ""}</div></div>
        <button class="btn btn-ico btn-sm" data-close aria-label="Close">${ic("x")}</button></div>
      ${!d.struct && !sectionLocked(b.type) ? `<div class="row" style="padding:8px var(--s4);border-bottom:1px solid var(--line-2);gap:8px">
        <button class="btn btn-sm btn-ghost grow" data-sechide="${S.sel.block}" data-close>${ic(b.hidden ? "eye" : "eye-off")} ${b.hidden ? "Show" : "Hide"}</button>
        ${d.dup ? `<button class="btn btn-sm btn-ghost grow" data-secdup="${S.sel.block}" data-close>${ic("dup")} Duplicate</button>` : ""}
        <button class="btn btn-sm btn-ghost grow" data-secdel="${S.sel.block}" data-close style="color:var(--stop)">${ic("trash")} Remove</button></div>` : ""}
      <div class="sheet-b">${body}</div>
      <div class="sheet-f"><button class="btn btn-primary" data-close>Done</button></div>`, { sheet: true, full: true });
  }

  /* ---------- command menu ---------- */
  const CMDS = [
    ["Add a section", () => setLeftMode("add"), "layers"],
    ["Go to a page", () => openPagePick(), "pages"],
    ["Open Theme & Brand", () => openTheme(), "sparkle"],
    ["Run the site check", () => go("health"), "heart"],
    ["Responsive check", () => openResponsive(), "tablet"],
    ["Preview as a visitor", () => go("live"), "play"],
    ["Publish", () => openPublish(), "check"],
    ["Version history", () => openVersions(), "history"],
    ["Live availability settings", () => go("availability"), "eye"],
    ["Visit settings", () => go("visits"), "calendar"],
    ["Switch device — Mobile", () => setDevice("mobile"), "phone-d"],
    ["Switch device — Desktop", () => setDevice("desktop"), "monitor"],
    ["Back to ManagR", () => go("home"), "home"]
  ];
  let cmdSel = 0;
  function openCmd() {
    $("#cmd").classList.add("on"); cmdSel = 0;
    $("#cmdInput").value = ""; renderCmd("");
    setTimeout(() => $("#cmdInput").focus(), 30);
  }
  function renderCmd(q) {
    const list = CMDS.filter((c) => c[0].toLowerCase().indexOf(q.toLowerCase()) >= 0);
    $("#cmdList").innerHTML = list.map((c, i) => `<button class="cmd-item ${i === cmdSel ? "on" : ""}" data-cmd-run="${CMDS.indexOf(c)}">${ic(c[2])}<span>${c[0]}</span></button>`).join("") || `<div class="cmd-item dim">No match</div>`;
  }

  /* ---------- misc overlays ---------- */
  function openSample() {
    openOverlay(`<div class="sheet-h"><div><b>A sample website</b><div class="tiny muted">Demo owner — yours uses your real properties</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b"><div class="ph" style="min-height:260px">SAMPLE SITE — header · hero · property cards · highlights · contact · footer</div></div>
      <div class="sheet-f"><button class="btn btn-primary" data-close>Got it</button></div>`, { sheet: true });
  }
  function openQR() {
    openOverlay(`<div class="sheet-h"><div><b>Website QR code</b><div class="tiny muted">Print it, stick it on the gate</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b center"><div class="ph" style="width:150px;height:150px;margin:0 auto">QR</div><div class="mono tiny" style="margin-top:8px">${esc(url())}</div></div>
      <div class="sheet-f"><button class="btn" data-close>${ic("download")} Download</button><button class="btn btn-primary" data-close>${ic("wa")} Share</button></div>`, { sheet: true });
  }
  function openPropFilter() {
    const many = Array.from({ length: 12 }, (_, i) => i < ALL_PROPS.length ? ALL_PROPS[i] : { id: "x" + i, name: "Property " + (i + 1), area: ["Andheri West", "Powai", "Bandra", "Kurla"][i % 4], status: i % 5 === 0 ? "review" : "live", photos: i % 3 });
    openOverlay(`<div class="sheet-h"><div><b>Choose properties</b><div class="tiny muted">Search &amp; filter — built for owners with many buildings</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b">
        <div class="row" style="border:1px solid var(--line);border-radius:var(--r)">${ic("search")}<input class="inp" placeholder="Search properties…" style="border:0"></div>
        <div class="wrapline" style="margin:8px 0"><button class="btn btn-sm btn-primary">All</button><button class="btn btn-sm">Live</button><button class="btn btn-sm">Under review</button><button class="btn btn-sm">Has photos</button><button class="btn btn-sm">Available now</button></div>
        <div class="list">${many.map((p) => `<label class="list-row"><input type="checkbox" ${p.status === "live" ? "checked" : ""}><span class="grow tiny"><b>${esc(p.name)}</b> <span class="muted">${p.area}</span></span>${p.status === "review" ? `<span class="chip chip-warn">review</span>` : p.photos ? `<span class="chip chip-ok">photos</span>` : `<span class="chip">no photos</span>`}</label>`).join("")}</div>
      </div>
      <div class="sheet-f"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-close>Use selected</button></div>`, { sheet: true, full: true });
  }
  function openAddrHelp() {
    openOverlay(`<div class="modal-h"><b>Changing your web address</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-b tiny stack-sm"><div>Your address is <b>permanent by design</b> — it gets printed on boards and shared in WhatsApp groups. Changing it would break links people can’t fix.</div>
      <div>If you genuinely need a change (e.g. a typo caught on day one), ManagR support can do it once, manually.</div></div>
      <div class="modal-f"><button class="btn" data-close>Close</button><button class="btn btn-primary" data-close>${ic("wa")} Message support</button></div>`);
  }

  /* ---------- coach marks (first-run) ---------- */
  function maybeCoach() {
    $("#coachRoot").innerHTML = "";
    if (S.onboarded || S.view !== "editor" || !canEdit()) return;
    if (!window.matchMedia("(min-width:1000px)").matches) { coachMobile(); return; }
    const steps = [
      { sel: "#eCanvas .sec", pos: "right", text: "This is your website. Click any section on the canvas to edit it." },
      { sel: `#erail [data-leftmode="add"]`, pos: "right", text: "Use <b>Add section</b> to bring in FAQ, Gallery, Enquiry and more." },
      { sel: `#etop [data-toggle-mode]`, pos: "bottom", text: "Switch to <b>Preview</b> to see it as a visitor. Your edits stay in a draft." },
      { sel: `#etop [data-publish]`, pos: "bottom", text: "Nothing reaches visitors until you <b>Publish</b>." }
    ];
    let i = 0;
    function show() {
      const st = steps[i]; const t = $(st.sel);
      if (!t) { finish(); return; }
      const r = t.getBoundingClientRect();
      const c = document.createElement("div"); c.className = "coach";
      c.innerHTML = `<div>${st.text}</div><div class="between"><span class="tiny dim">${i + 1}/${steps.length}</span><div><button data-coach-skip>Skip</button> <button class="go" data-coach-next>${i === steps.length - 1 ? "Done" : "Next"}</button></div></div>`;
      $("#coachRoot").innerHTML = ""; $("#coachRoot").appendChild(c);
      const cr = c.getBoundingClientRect();
      const inspW = 300;
      let top = r.top, left = st.pos === "right" ? r.right + 10 : r.left;
      if (st.pos === "bottom") { top = r.bottom + 8; left = Math.min(r.left, window.innerWidth - cr.width - 10); }
      if (left + cr.width > window.innerWidth - inspW - 10) left = Math.max(50, r.left - cr.width - 10);
      c.style.top = Math.max(8, Math.min(top, window.innerHeight - cr.height - 40)) + "px";
      c.style.left = Math.max(8, Math.min(left, window.innerWidth - cr.width - 10)) + "px";
      c.querySelector("[data-coach-next]").onclick = () => { i++; if (i >= steps.length) finish(); else show(); };
      c.querySelector("[data-coach-skip]").onclick = finish;
    }
    function finish() { S.onboarded = true; save(); $("#coachRoot").innerHTML = ""; }
    show();
  }
  function coachMobile() {
    const c = document.createElement("div"); c.className = "coach"; c.style.left = "8px"; c.style.right = "8px"; c.style.bottom = "116px"; c.style.maxWidth = "none";
    c.innerHTML = `<div><b>Your website</b><br>Tap a section to edit it · <b>Add</b> for more sections · <b>Preview</b> to see it as a visitor · edits stay in a draft until you <b>Publish</b>.</div>
      <div class="between"><span></span><button class="go" data-coach-next>Got it</button></div>`;
    $("#coachRoot").appendChild(c);
    c.querySelector("[data-coach-next]").onclick = () => { S.onboarded = true; save(); $("#coachRoot").innerHTML = ""; };
  }

  /* ============================================================================
     PART 4 · VISITOR SITE
     ========================================================================== */
  function renderVisitor() {
    const badge = S._verSnap ? `<span class="badge">PREVIEW · older version</span>`
      : V.testMode ? `<span class="badge">PREVIEW · test mode</span>` : "";
    $("#vbar").innerHTML = `<button class="btn btn-ico btn-sm" data-vs-exit aria-label="Close" style="color:#fff">${ic("x")}</button>
      <span class="u mono">${esc(url())}${V.route === "detail" ? "/p/" + V.prop : ""}</span>${badge}`;
    // when previewing a saved version, render from its snapshot then restore the draft
    const keep = S._verSnap ? { p: S.pages, t: S.theme, g: S.globals } : null;
    if (keep) { S.pages = S._verSnap.pages; S.theme = S._verSnap.theme; S.globals = S._verSnap.globals; }
    const map = { list: vsHome, detail: vsDetail, page: vsPage, enquiry: vsEnquiry, visit: vsVisit,
      "visit-done": vsVisitDone, request: vsRequest, "request-done": vsRequestDone };
    $("#vscroll").innerHTML = `<div class="vwrap">${(map[V.route] || vsHome)()}${vsFab()}</div>`;
    if (keep) { S.pages = keep.p; S.theme = keep.t; S.globals = keep.g; }
  }
  function vsExit() {
    $("#vshell").classList.remove("on");
    S._verSnap = null;
    go(S.view === "live" && S._returnTo ? S._returnTo : "editor");
  }
  function vsNav() {
    const pages = S.pages.filter((p) => p.kind === "standard" && (p.home || (p.inNav && !p.hidden)));
    if (pages.length < 2 || !advActive()) return "";
    return `<div class="v-nav">${pages.map((p) => `<a class="${(V.route === "list" && p.home) || (V.route === "page" && V.pageId === p.id) ? "on" : ""}" data-vs-page="${p.home ? "" : p.id}">${esc(p.name)}</a>`).join("")}</div>`;
  }
  function vsTop() {
    return `<div class="v-topbar"><b>${S.globals.header.logo ? "LOGO" : esc(OWNER.biz)}</b>
      ${S.globals.header.call ? `<span class="s-btn fill">${ic("phone")} Call</span>` : ""}</div>${vsNav()}`;
  }
  function vsFab() {
    if (!advActive() || V.route !== "list" && V.route !== "detail") return "";
    const hasEnq = S.pages[0].blocks.some((b) => b.type === "enquiry" && !b.hidden);
    return hasEnq ? `<button class="v-fab" data-vs="enquiry">${ic("inbox")} Enquire</button>` : "";
  }
  function vsHome() {
    const P = publicProps();
    if (!S.siteLive) return vsTop() + `<div class="v-sec center"><div class="ph" style="min-height:56px">—</div>
      <h3 style="margin-top:10px">Temporarily unavailable</h3><p class="tiny muted">This website is offline right now. Please check back soon.</p></div>`;
    if (!P.length) return vsTop() + `<div class="v-sec center"><h3>New listings coming soon</h3><p class="tiny muted">Call us in the meantime.</p>
      <span class="s-btn fill" style="margin-top:8px">${ic("phone")} Call</span></div>`;
    return vsTop() +
      `<div class="v-sec"><div class="v-h1">${esc(getInfo("headline"))}</div>
        <p class="tiny muted" style="margin:4px 0 8px">${esc(getInfo("about"))}</p>
        <span class="v-trust">${ic("shield")} Direct from owner · No brokerage</span></div>
      <div class="v-sec"><div class="v-h2">Our properties</div>${P.map((p) => {
        const total = p.rooms.reduce((a, r) => a + r.freeNow, 0);
        const av = (S.availOn && advActive() && !staleProp(p) && S.availLevel === "property")
          ? (total ? `<div class="s-avail">${S.availNumbers === "vague" ? "Available now" : total + " beds available"}</div>` : `<div class="s-avail full">Full${S.availFromDate ? " — from 15 Sep" : ""}</div>`)
          : "";
        return `<div class="v-card" data-vs-prop="${p.id}"><div class="ph">${p.photos ? "PHOTO" : "NO PHOTO"}</div>
          <div class="b"><b>${esc(p.name)}</b><div class="tiny muted">${esc(p.area)} · approximate</div>
          <div style="font-weight:800;margin-top:3px">${p.from} <span class="tiny muted">/mo onwards</span></div>
          <div class="wrapline" style="margin-top:3px">${p.sharing.map((s) => `<span class="chip tiny">${s}</span>`).join("")}</div>${av}</div></div>`;
      }).join("")}
      ${S.availOn && advActive() ? `<div class="tiny help-ok" style="margin-top:6px">${ic("check")} Availability updated today</div>` : ""}</div>` +
      contactBlock();
  }
  function vsDetail() {
    const p = ALL_PROPS.find((x) => x.id === V.prop) || ALL_PROPS[0];
    if (p.status !== "live") return vsTop() + `<div class="v-sec center"><h3>This property isn’t available right now</h3>
      <p class="tiny muted">It may be full or under review. See the others, or call us.</p>
      <button class="btn btn-sm" style="margin-top:8px" data-vs="list">See all properties</button></div>` + contactBlock();
    const lvl = S.availOn && advActive() && !staleProp(p) ? S.availLevel : null;
    let head = "";
    if (lvl === "property") {
      const total = p.rooms.reduce((a, r) => a + r.freeNow, 0);
      head = `<div class="v-sec"><div class="callout ${total ? "callout-ok" : "callout-warn"}"><b>${total ? (S.availNumbers === "vague" ? "Available now" : total + " beds available now") : "Fully booked — next free 15 Sep"}</b><div class="tiny">Availability updated today</div></div></div>`;
    }
    return vsTop() +
      `<div class="v-sec"><div class="ph" style="min-height:120px">PHOTO GALLERY</div>
        <div class="v-h1" style="margin-top:8px">${esc(p.name)}</div><div class="tiny muted">${esc(p.area)} · approximate location</div></div>` +
      head +
      `<div class="v-sec"><div class="v-h2">Room types</div>${p.rooms.map((r) => {
        let tag = "";
        if (lvl === "roomtype") tag = r.freeNow ? `<span class="chip chip-ok">${S.availNumbers === "vague" ? "Available" : r.freeNow + " bed" + (r.freeNow > 1 ? "s" : "") + " now"}</span>` : `<span class="chip chip-warn">Full — next free ${r.from || "—"}</span>`;
        return `<div class="v-rt"><div class="between"><div><b>${r.t}</b><div class="tiny muted">${r.rent} · deposit ${r.dep}</div></div>${tag}</div>
          ${lvl === "bed" ? `<div class="bedgrid" style="margin-top:8px">${p.beds.slice(0, 8).map((x) => `<div class="bed ${x ? "free" : "taken"}">${x ? "Free" : "•"}</div>`).join("")}</div><div class="tiny muted" style="margin-top:4px">No names, ever. Blocked beds show as unavailable with no reason.</div>` : ""}</div>`;
      }).join("")}</div>
      <div class="v-sec"><div class="v-h2">Amenities</div><div class="wrapline">${["WiFi", "Meals", "CCTV", "Laundry", "Power backup"].map((a) => `<span class="chip">${a}</span>`).join("")}</div></div>
      <div class="v-sec"><div class="v-h2">House rules</div><div class="tiny muted">Gate 11 PM · No smoking indoors · ID proof at move-in</div></div>
      <div class="v-sec"><div class="v-h2">Location</div><div class="ph" style="min-height:90px">MAP — APPROXIMATE AREA ONLY</div>
        <div class="tiny muted" style="margin-top:4px">The exact address is shared when you contact the owner.</div></div>
      ${advActive() ? `<div class="v-sec stack-sm">
        <button class="btn btn-primary btn-block" data-vs="visit">Book a visit</button>
        <button class="btn btn-block" data-vs="request">Request this room</button>
        <button class="btn btn-block btn-ghost" data-vs="enquiry">Send an enquiry</button></div>` : ""}
      <div class="v-sticky"><a class="btn btn-primary">${ic("phone")} Call owner</a><a class="btn">${ic("wa")} WhatsApp</a></div>`;
  }
  function vsPage() {
    const p = S.pages.find((x) => x.id === V.pageId);
    if (!p) return vsHome();
    return vsTop() + p.blocks.filter((b) => !b.hidden && !SECTIONS[b.type].struct).map((b) => `<div class="v-sec">${siteSection(b, liveTheme().accent)}</div>`).join("") + contactBlock();
  }
  function contactBlock() {
    return `<div class="v-sec"><div class="v-h2">Contact</div>
      <div class="tiny">${ic("phone")} ${getInfo("phone")} &nbsp; ${ic("wa")} WhatsApp${getInfo("email") ? " &nbsp; " + ic("mail") + " " + esc(getInfo("email")) : ""}</div>
      <div class="tiny muted" style="margin-top:4px">${OWNER.area.split(",")[0]} area (approximate)</div>
      ${S.globals.footer.powered || !advActive() ? `<div class="s-powered" style="margin-top:8px">Powered by ManagR</div>` : ""}</div>`;
  }
  function vsEnquiry() {
    if (V._enqDup) return `<div class="v-sec"><div class="callout callout-warn"><b>You already sent an enquiry</b><div class="tiny">On 3 Sep. The owner has it and usually replies on WhatsApp within a day.</div></div>
      <div class="row" style="margin-top:12px"><button class="btn" data-vs="detail">Back</button><button class="btn btn-primary grow" data-vs-enq-send>Send another anyway</button></div></div>`;
    return `<div class="v-sec"><div class="v-h2">Send an enquiry</div><p class="tiny muted">The owner usually replies on WhatsApp within a day.</p>
      <div class="field"><label class="lbl">Name *</label><input class="inp" id="eq_name"></div>
      <div class="field"><label class="lbl">Phone *</label><input class="inp" id="eq_phone" inputmode="tel"></div>
      <div class="field"><label class="lbl">Looking for</label><select class="sel"><option>Any</option><option>Double sharing</option><option>Private room</option></select></div>
      <div class="field"><label class="lbl">Move-in</label><input class="inp" type="date"></div>
      <div class="field"><label class="lbl">Budget</label><input class="inp" placeholder="₹"></div>
      <div id="eq_err"></div>
      <button class="btn btn-primary btn-block" style="margin-top:10px" data-vs-enq-send>Send enquiry</button>
      ${V.testMode ? `<div class="callout callout-warn tiny" style="margin-top:8px">${ic("info")} Preview — this won’t send a real enquiry.</div>` : `<div class="callout tiny" style="margin-top:8px">${ic("info")} Becomes a lead in the owner’s CRM, tagged “Website”.</div>`}</div>`;
  }
  function vsVisit() {
    const steps = ["Room", "Date", "Time", "Your details"];
    const step = V.step || 0;
    const head = `<div class="v-step">Step ${step + 1} of ${steps.length} · ${steps[step]}</div>`;
    let body, canNext = true;
    if (step === 0) body = `<div class="v-h2">What are you looking for?</div>${["Any room", "Double sharing", "Private room"].map((o) => `<label class="rcard"><input type="radio" name="lk" ${o === "Any room" ? "checked" : ""} data-vs-look="${o}"> ${o}</label>`).join("")}`;
    else if (step === 1) {
      const full = [11, 12, 18];
      body = `<div class="v-h2">Pick a date</div><div class="cal">${Array.from({ length: 21 }, (_, i) => { const d = i + 8; const none = full.indexOf(d) >= 0 || [3, 4].indexOf(i) >= 0; return `<button ${none ? "disabled" : ""} class="${none ? "" : "has"} ${V.date === d ? "on" : ""}" data-vs-date="${d}">${d}</button>`; }).join("")}</div>
        <div class="tiny muted" style="margin-top:6px">Greyed days are full. Dots = slots open.</div>
        ${V.date && full.indexOf(V.date) >= 0 ? `<div class="callout callout-warn tiny" style="margin-top:8px">No times left on the ${V.date}th — the next open day is highlighted. <button class="btn btn-sm" data-vs-date="16">Jump to 16th</button></div>` : ""}`;
      canNext = V.date && [11, 12, 18, undefined].indexOf(V.date) < 0;
    } else if (step === 2) {
      const sameDay = V.date === 8;
      body = `<div class="v-h2">Pick a time${V.date ? " · " + V.date + " Sep" : ""}</div><div class="slotgrid">${["9:00", "10:00", "11:00", "4:00", "5:00", "6:00"].map((t, i) => `<button ${i === 2 ? "disabled" : ""} class="${V.time === t ? "on" : ""}" data-vs-time="${t}">${t}</button>`).join("")}</div>
        <div class="callout tiny" style="margin-top:10px">Video walkthrough also available — <a>switch</a></div>`;
      canNext = !!V.time;
    } else {
      const sameDay = V.date === 8;
      body = `<div class="v-h2">Your details</div><div class="field"><label class="lbl">Name *</label><input class="inp"></div><div class="field"><label class="lbl">Phone *</label><input class="inp" inputmode="tel"></div>
        <div class="callout tiny" style="margin-top:8px">${ic("info")} ${sameDay ? "Same-day visit — we’ll text a one-time code to confirm it’s really you." : "You’re booked straight away. No code needed."}</div>`;
    }
    return `<div class="v-sec">${head}<div style="margin-top:10px">${body}</div>
      <div class="row" style="margin-top:14px">${step > 0 ? `<button class="btn" data-vs-step="${step - 1}">Back</button>` : `<button class="btn" data-vs="detail">Back</button>`}
        <button class="btn btn-primary grow" ${canNext ? "" : 'aria-disabled="true"'} data-vs-step="${step < 3 ? step + 1 : "done"}">${step < 3 ? "Continue" : "Confirm visit"}</button></div>
      ${V.testMode ? `<div class="tiny muted center" style="margin-top:8px">Preview — no real booking is made.</div>` : ""}</div>`;
  }
  function vsVisitDone() {
    if (V._raced) return `<div class="v-sec"><div class="callout callout-warn"><b>That time was just taken</b><div class="tiny">Someone booked the ${V.time || "5:00"} slot a moment ago. Here are nearby times on the same day:</div></div>
      <div class="slotgrid" style="margin-top:10px">${["10:00", "11:00", "4:00", "6:00"].map((t) => `<button data-vs-retime="${t}">${t}</button>`).join("")}</div>
      <button class="btn btn-block" style="margin-top:10px" data-vs-step="1">Pick another day</button></div>`;
    return `<div class="v-sec"><div class="callout callout-ok"><b>${ic("check")} Visit booked</b><div class="tiny">Fri ${V.date || 14} Sep · ${V.time || "5:00"} PM · ${esc(OWNER.biz)}</div></div>
      <div class="wa-bubble" style="margin-top:12px">✅ We’ve sent the details to your WhatsApp — the owner’s number and directions to the approximate area.</div>
      <div class="stack-sm" style="margin-top:12px"><button class="btn btn-block">${ic("calendar")} Add to calendar</button><button class="btn btn-block">${ic("pin")} Directions (approximate)</button><button class="btn btn-block btn-ghost">${ic("wa")} Message owner</button></div>
      <div class="row" style="margin-top:12px"><button class="btn btn-sm" data-vs-step="1">Reschedule</button><button class="btn btn-sm btn-ghost">Cancel</button></div>
      <div class="callout tiny" style="margin-top:12px">${ic("info")} WhatsApp reminder the day before. If the property fills up first, the owner will message you.</div>
      <button class="btn btn-primary btn-block" style="margin-top:14px" data-vs="list">Back to properties</button></div>`;
  }
  function vsRequest() {
    const p = ALL_PROPS.find((x) => x.id === V.prop) || ALL_PROPS[0];
    const chosen = V.reqRoom || "Double sharing";
    const room = p.rooms.find((r) => r.t === chosen) || p.rooms[0];
    const unavailable = !room.freeNow && room.from;
    return `<div class="v-sec"><div class="v-h2">Request a bed</div>
      <div class="field"><label class="lbl">Room type</label><select class="sel" data-vs-reqroom>${p.rooms.map((r) => `<option ${r.t === chosen ? "selected" : ""}>${r.t}</option>`).join("")}</select></div>
      <div class="field"><label class="lbl">Move-in date</label><input class="inp" type="date" value="2026-02-01"></div>
      ${unavailable
        ? `<div class="callout callout-warn stack-sm" style="margin-top:10px"><b>${chosen} is full on 1 Feb</b><div class="tiny">The next bed in this room type is free from <b>${room.from}</b>.</div>
           <button class="btn btn-sm btn-primary" data-vs-step="req-ok">Request for ${room.from}</button><button class="btn btn-sm" data-vs="detail">Pick another room</button></div>`
        : `<div class="callout callout-ok tiny" style="margin-top:10px">A bed can be ready by your date.</div>
           <div class="callout tiny" style="margin-top:8px;border-style:dashed">— Payment step goes here later. Not enabled yet. —</div>
           <button class="btn btn-primary btn-block" style="margin-top:10px" data-vs-step="req-ok">Send request</button>`}
      ${V.testMode ? `<div class="tiny muted center" style="margin-top:8px">Preview — no real request is sent.</div>` : ""}</div>`;
  }
  function vsRequestDone() {
    return `<div class="v-sec"><div class="callout callout-ok"><b>${ic("check")} Request sent</b><div class="tiny">Waiting for ${esc(OWNER.biz)} to confirm. They usually respond within a day.</div></div>
      <div class="wa-bubble" style="margin-top:12px">📩 We’ve messaged your WhatsApp. You’ll hear back there when the owner approves or declines.</div>
      <div class="callout tiny" style="margin-top:12px">What happens next: owner reviews → approves &amp; holds the bed (or declines with a reason) → you get a WhatsApp with the next step.</div>
      <button class="btn btn-primary btn-block" style="margin-top:14px" data-vs="list">Back to properties</button></div>`;
  }

  /* ============================================================================
     PART 5 · EVENTS
     ========================================================================== */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-nav],[data-go],[data-devgo],[data-devset],[data-close],[data-open-live],[data-vs-exit],[data-vs],[data-vs-prop],[data-vs-page],[data-vs-step],[data-vs-date],[data-vs-time],[data-vs-retime],[data-vs-look],[data-vs-enq-send],[data-sel],[data-canvas-sel],[data-secmove],[data-sechide],[data-secdup],[data-secdel],[data-addsec],[data-leftmode],[data-leftmode-m],[data-toggle-mode],[data-device],[data-publish],[data-publish-menu],[data-do-publish],[data-editor-more],[data-discard],[data-do-discard],[data-versions],[data-ver-preview],[data-ver-restore],[data-undo],[data-redo],[data-apply-theme],[data-do-theme],[data-apply-template],[data-do-template],[data-designtab],[data-accent],[data-msettings],[data-deselect],[data-insptab],[data-layout],[data-density],[data-toggle-live],[data-copy],[data-share],[data-open-qr],[data-open-sample],[data-settab],[data-setup],[data-setup-approve],[data-setup-later],[data-setup-finish],[data-do-upgrade],[data-add-page],[data-newpage],[data-page-open],[data-page-menu],[data-page-rename],[data-page-sethome],[data-page-dup],[data-page-del],[data-open-pagepick],[data-open-theme],[data-open-responsive],[data-resp-jump],[data-resp-fix],[data-resp-dismiss],[data-cmd],[data-cmd-run],[data-health-jump],[data-health-dismiss],[data-restore-checks],[data-open-propfilter],[data-open-addr-help],[data-open-settings],[data-asset-upload],[data-req-approve],[data-req-decline],[data-coach-next],[data-coach-skip]");
    if (!t) return;
    const A = (k) => t.getAttribute(k);

    if (A("data-nav")) return go(A("data-nav"));
    if (t.hasAttribute("data-close") && !A("data-go") && !A("data-health-jump") && !t.hasAttribute("data-open-live") && !t.hasAttribute("data-do-publish") && !t.hasAttribute("data-publish") && !t.hasAttribute("data-versions") && !t.hasAttribute("data-discard") && !t.hasAttribute("data-open-responsive") && !t.hasAttribute("data-open-settings") && !A("data-leftmode-m")) return closeOverlay();
    if (A("data-go")) { if (t.hasAttribute("data-close")) closeOverlay(); return go(A("data-go")); }
    if (A("data-devgo")) { if (A("data-devgo") === "live") { S._returnTo = "home"; V = { route: "list", prop: "p1", step: 0, testMode: true }; } return go(A("data-devgo")); }

    if (A("data-devset")) {
      const [k, v] = A("data-devset").split(":");
      S[k] = (v === "true") ? true : (v === "false") ? false : v;
      if (k === "plan" && advActive()) S.setup = "done";
      save(); render(); return;
    }

    if (t.hasAttribute("data-open-live")) { if (t.hasAttribute("data-close")) closeOverlay(); S._returnTo = S.view === "editor" ? "editor" : "home"; V = { route: "list", prop: "p1", step: 0, testMode: true }; return go("live"); }
    if (t.hasAttribute("data-open-settings")) { closeOverlay(); return go("settings"); }
    if (t.hasAttribute("data-vs-exit")) return vsExit();
    if (A("data-vs")) { V.route = A("data-vs"); if (V.route === "detail" && !V.prop) V.prop = "p1"; V._enqDup = false; if (V.route === "visit") { V.step = 0; V.date = null; V.time = null; V._raced = false; } if (V.route === "request") { V.reqRoom = null; } return renderVisitor(); }
    if (A("data-vs-prop") != null) { V.prop = A("data-vs-prop"); V.route = "detail"; return renderVisitor(); }
    if (A("data-vs-page") != null) { const id = A("data-vs-page"); if (!id) { V.route = "list"; } else { V.route = "page"; V.pageId = id; } return renderVisitor(); }
    if (A("data-vs-date")) { V.date = +A("data-vs-date"); return renderVisitor(); }
    if (A("data-vs-time")) { if (t.disabled) return; V.time = A("data-vs-time"); return renderVisitor(); }
    if (A("data-vs-retime")) { V.time = A("data-vs-retime"); V._raced = false; V.route = "visit-done"; return renderVisitor(); }
    if (A("data-vs-look")) { V.look = A("data-vs-look"); return; }
    if (A("data-vs-step")) {
      const s = A("data-vs-step");
      if (s === "done") { V._raced = (V.time === "5:00" && V.date === 9); V.route = "visit-done"; }
      else if (s === "req-ok") { V.route = "request-done"; }
      else { V.step = +s; if (V.route === "visit-done") V.route = "visit"; }
      return renderVisitor();
    }
    if (t.hasAttribute("data-vs-enq-send")) {
      if (V._enqDup) { V._enqDup = false; }
      const name = $("#eq_name"), phone = $("#eq_phone"), err = $("#eq_err");
      if (name && (!name.value.trim() || !phone.value.trim())) {
        [name, phone].forEach((f) => f && (f.value.trim() ? f.removeAttribute("aria-invalid") : f.setAttribute("aria-invalid", "true")));
        if (err) err.innerHTML = `<div class="help help-err">${ic("alert")} Please add your name and phone so the owner can reply to you.</div>`;
        (!name.value.trim() ? name : phone).focus();
        return;
      }
      if (name && phone && phone.value.trim() === "9990000000") { V._enqDup = true; return renderVisitor(); }
      openOverlay(`<div class="modal-h"><b>${ic("check")} Enquiry ${V.testMode ? "(test — not sent)" : "sent"}</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
        <div class="modal-b tiny">${V.testMode ? "In the live site this would create a lead in Leads &amp; CRM tagged “Website”, and the owner replies on WhatsApp." : "The owner has it and usually replies on WhatsApp within a day. It’s now a lead in their CRM."}</div>
        <div class="modal-f"><button class="btn btn-primary" data-close>Done</button></div>`);
      return;
    }

    /* --- editor --- */
    if (A("data-sel") != null) { const [b, sub] = A("data-sel").split(":"); return selectBlock(+b, sub != null ? +sub : undefined); }
    if (A("data-canvas-sel") != null && S.editMode) return selectBlock(+A("data-canvas-sel"));
    if (A("data-secmove")) { const [i, d] = A("data-secmove").split(",").map(Number); return moveBlock(i, d); }
    if (A("data-sechide") != null) { if (t.closest(".sheet")) { const i = +A("data-sechide"); page().blocks[i].hidden = !page().blocks[i].hidden; save(); renderEditor(); return; } return hideBlock(+A("data-sechide")); }
    if (A("data-secdup") != null) return dupBlock(+A("data-secdup"));
    if (A("data-secdel") != null) return delBlock(+A("data-secdel"));
    if (A("data-addsec")) return addBlock(A("data-addsec"));
    if (A("data-leftmode")) return setLeftMode(A("data-leftmode"));
    if (A("data-leftmode-m")) { if (t.hasAttribute("data-close")) closeOverlay(); const m = A("data-leftmode-m"); if (m === "add") { setLeftMode("add"); openAddMobile(); } else if (m === "layers") openLayersMobile(); else { setLeftMode(m); openLeftMobile(); } return; }
    if (t.hasAttribute("data-toggle-mode")) return toggleMode();
    if (A("data-device")) return setDevice(A("data-device"));
    if (t.hasAttribute("data-publish")) { publishSummary._last = publishSummary(); return openPublish(); }
    if (t.hasAttribute("data-publish-menu")) return openPublishMenu();
    if (t.hasAttribute("data-do-publish")) return doPublish();
    if (t.hasAttribute("data-editor-more")) return openEditorMore();
    if (t.hasAttribute("data-discard")) { closeOverlay(); return openDiscard(); }
    if (t.hasAttribute("data-do-discard")) { snapshot(); S.pages = S.published ? clone(S.published.pages) : freshPages(); S.theme = S.published ? S.published.theme : "modern"; S.globals = S.published ? clone(S.published.globals) : clone(DEFAULT.globals); S.sel = null; save(); closeOverlay(); renderEditor(); toast("Draft reset to your live site"); return; }
    if (t.hasAttribute("data-versions")) { closeOverlay(); return openVersions(); }
    if (A("data-ver-preview") != null) {
      const rp = verRows[+A("data-ver-preview")];
      closeOverlay(); S._returnTo = "editor";
      S._verSnap = rp && rp.snap ? clone(rp.snap) : null;
      V = { route: "list", prop: "p1", step: 0, testMode: true, ver: !!S._verSnap };
      return go("live");
    }
    if (A("data-ver-restore") != null) {
      const rr = verRows[+A("data-ver-restore")];
      if (rr && rr.snap) { snapshot(); S.pages = clone(rr.snap.pages); S.theme = rr.snap.theme; S.globals = clone(rr.snap.globals); S.sel = null; save(); markSaved(); }
      closeOverlay(); renderEditor();
      toast(rr && rr.snap ? "Restored as your draft — publish when you’re ready" : "Nothing to restore");
      return;
    }
    if (t.hasAttribute("data-undo")) return undo();
    if (t.hasAttribute("data-redo")) return redo();
    if (A("data-apply-theme")) return openApplyTheme(A("data-apply-theme"));
    if (A("data-do-theme")) { snapshot(); S.theme = A("data-do-theme"); markSaved(); closeOverlay(); render(); toast("Theme applied to your draft"); return; }
    if (A("data-apply-template")) return openApplyTemplate(A("data-apply-template"));
    if (A("data-do-template")) return applyTemplate(A("data-do-template"));
    if (A("data-designtab")) { designTab = A("data-designtab"); return openTheme(); }
    if (A("data-accent")) { snapshot(); S.theme = Object.keys(THEMES).find((k) => THEMES[k].accent === A("data-accent")) || S.theme; THEMES[S.theme].accent = A("data-accent"); markSaved(); openTheme(); render(); return; }
    if (t.hasAttribute("data-msettings")) return openMobileSettings();
    if (t.hasAttribute("data-deselect")) { S.sel = null; save(); renderEditor(); return; }
    if (A("data-insptab")) { setInspTab(A("data-insptab")); if (t.closest(".sheet")) openMobileSettings(); return; }
    if (A("data-layout") != null) { const bl = page().blocks[S.sel && S.sel.block]; if (bl) { snapshot(); bl.layout = A("data-layout"); markSaved(); renderEditor(); if (t.closest(".sheet")) openMobileSettings(); toast("Layout: " + A("data-layout")); } return; }
    if (A("data-density") != null) { const bd = page().blocks[S.sel && S.sel.block]; if (bd) { snapshot(); bd.dense = A("data-density"); markSaved(); renderEditor(); if (t.closest(".sheet")) openMobileSettings(); } return; }
    if (t.hasAttribute("data-open-theme")) { closeOverlay(); return openTheme(); }
    if (t.hasAttribute("data-open-responsive")) { closeOverlay(); return openResponsive(); }
    if (A("data-resp-jump")) { closeOverlay(); jumpTo(A("data-resp-jump")); return; }
    if (A("data-resp-fix")) { S.dismissedChecks.push(A("data-resp-fix")); save(); toast("Fixed — stacked on mobile"); openResponsive(); return; }
    if (A("data-resp-dismiss")) { S.dismissedChecks.push(A("data-resp-dismiss")); save(); openResponsive(); return; }
    if (t.hasAttribute("data-cmd")) return openCmd();
    if (A("data-cmd-run") != null) { $("#cmd").classList.remove("on"); CMDS[+A("data-cmd-run")][1](); return; }

    /* --- pages --- */
    if (A("data-open-pagepick")) return openPagePick();
    if (A("data-page-open")) return setPage(A("data-page-open"));
    if (A("data-page-menu")) return openPageMenu(A("data-page-menu"));
    if (A("data-page-sethome")) return pageAction("sethome", A("data-page-sethome"));
    if (A("data-page-dup")) return pageAction("dup", A("data-page-dup"));
    if (A("data-page-del")) return pageAction("del", A("data-page-del"));
    if (A("data-page-rename")) return pageAction("rename", A("data-page-rename"));
    if (t.hasAttribute("data-add-page")) { closeOverlay(); return openAddPage(); }
    if (A("data-newpage")) return makePage(A("data-newpage"));

    /* --- health / responsive jump --- */
    if (A("data-health-jump")) { if (t.hasAttribute("data-close")) closeOverlay(); return jumpTo(A("data-health-jump")); }
    if (A("data-health-dismiss")) { S.dismissedChecks.push(A("data-health-dismiss")); save(); renderApp(); return; }
    if (t.hasAttribute("data-restore-checks")) { S.dismissedChecks = []; save(); renderApp(); return; }

    /* --- home / settings --- */
    if (t.hasAttribute("data-toggle-live")) { S.siteLive = !S.siteLive; save(); render(); return; }
    if (t.hasAttribute("data-copy")) { try { navigator.clipboard.writeText("https://" + url()); } catch (e) {} toast("Link copied"); return; }
    if (t.hasAttribute("data-share")) { window.open("https://wa.me/?text=" + encodeURIComponent("https://" + url()), "_blank"); return; }
    if (t.hasAttribute("data-open-qr")) return openQR();
    if (t.hasAttribute("data-open-sample")) return openSample();
    if (t.hasAttribute("data-open-propfilter")) return openPropFilter();
    if (t.hasAttribute("data-open-addr-help")) return openAddrHelp();
    if (t.hasAttribute("data-asset-upload")) { openOverlay(`<div class="modal-h"><b>Upload an image</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div><div class="modal-b stack-sm"><div class="ph" style="min-height:80px">DROP OR CHOOSE A FILE</div><div class="tiny muted">Prototype: uploads aren’t wired. States handled: uploading · done · unsupported format · too large (>5 MB) · too small for this slot · failed → retry.</div></div><div class="modal-f"><button class="btn btn-primary" data-close>OK</button></div>`); return; }
    if (A("data-settab")) { setTab = A("data-settab"); return renderApp(); }
    if (t.hasAttribute("data-req-approve")) { toast("Approved — lead created, bed held until move-in"); return; }
    if (t.hasAttribute("data-req-decline")) { openOverlay(`<div class="modal-h"><b>Decline request</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div><div class="modal-b"><div class="field"><label class="lbl">Reason (sent to the visitor)</label><textarea class="ta" placeholder="e.g. that room type is full for the next few months"></textarea></div></div><div class="modal-f"><button class="btn" data-close>Cancel</button><button class="btn btn-danger" data-close>Decline &amp; notify</button></div>`); return; }

    /* --- setup --- */
    if (t.hasAttribute("data-setup-approve")) { S.setup = "unlocked"; save(); toast("Property approved"); renderApp(); return; }
    if (A("data-setup")) { S.setup = A("data-setup"); save(); renderApp(); if (S.setup === "address") bindAddress(); if (S.setup === "confirm") bindConfirm(); return; }
    if (t.hasAttribute("data-setup-later")) { toast("Set it up any time from the Website tab"); return; }
    if (t.hasAttribute("data-setup-finish")) {
      if (A("data-setup-finish") === "save") { S.info.headline = ($("#i_head") || {}).value || ""; S.info.about = ($("#i_about") || {}).value || ""; S.info.email = ($("#i_email") || {}).value || ""; S.info.office = ($("#i_office") || {}).value || ""; const ph = ($("#i_phone") || {}).value || ""; S.info.phone = ph === OWNER.phone ? "" : ph; }
      S.setup = "done"; save(); go("home");
      openOverlay(`<div class="modal-h"><b>${ic("check")} Your website is live</b></div>
        <div class="modal-b stack-sm">
          <p>Anyone with this link can see it now:</p>
          <div class="statstrip"><div class="ss-row"><span class="ss-v mono grow truncate">${esc(url())}</span>
            <span class="row" style="flex:none"><button class="btn btn-ico btn-sm" data-copy aria-label="Copy">${ic("copy")}</button><button class="btn btn-ico btn-sm" data-open-qr aria-label="QR">${ic("grid")}</button><button class="btn btn-ico btn-sm" data-share aria-label="Share">${ic("wa")}</button></span></div></div>
          <p class="tiny muted">${ic("info")} It shows your approved properties automatically. Nothing else to set up — but you can change the wording and look in the editor whenever you like.</p>
        </div>
        <div class="modal-f"><button class="btn" data-open-live data-close>See it</button><button class="btn btn-primary" data-go="editor" data-close>Make it yours in the editor</button></div>`);
      return;
    }
    if (t.hasAttribute("data-do-upgrade")) { S.plan = "advanced"; save(); toast("Advanced unlocked — nothing to redo"); go("editor"); return; }
    if (t.hasAttribute("data-coach-next") || t.hasAttribute("data-coach-skip")) { S.onboarded = true; save(); $("#coachRoot").innerHTML = ""; return; }
  });

  /* field edits (inspector + globals) */
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "addSearch") { filterAdd(t.value); return; }
    if (t.id === "cmdInput") { cmdSel = 0; renderCmd(t.value); return; }
    if ((t.id === "eq_name" || t.id === "eq_phone") && t.value.trim()) { t.removeAttribute("aria-invalid"); return; }
    if (!S.sel || S.sel.block == null) return;
    const b = page().blocks[S.sel.block]; if (!b) return;
    const d = sectionData(b);
    if (t.hasAttribute("data-field")) { d[t.getAttribute("data-field")] = t.value; scheduleFieldSave(); }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches && t.matches("[data-avail-on]")) { S.availOn = t.checked; save(); S.view === "editor" ? renderEditor() : renderApp(); return; }
    if (t.matches && t.matches("[data-avail-level]")) { if (t.checked) { S.availLevel = t.getAttribute("data-avail-level"); save(); renderApp(); } return; }
    if (t.matches && t.matches("[data-avail-num]")) { if (t.checked) { S.availNumbers = t.getAttribute("data-avail-num"); save(); renderApp(); } return; }
    if (t.matches && t.matches("[data-avail-from]")) { S.availFromDate = t.checked; save(); return; }
    if (!S.sel || S.sel.block == null) { globalToggles(t); return; }
    const b = page().blocks[S.sel.block]; if (!b) return;
    if (t.hasAttribute("data-visbp")) { snapshot(); b.visibility[t.getAttribute("data-visbp")] = t.checked; markSaved(); renderEditor(); return; }
    if (t.hasAttribute("data-field")) { sectionData(b)[t.getAttribute("data-field")] = t.value; scheduleFieldSave(); }
    globalToggles(t);
  });
  function globalToggles(t) {
    if (t.hasAttribute("data-hdrlink")) { snapshot(); const l = t.getAttribute("data-hdrlink"); const a = S.globals.header.links; const i = a.indexOf(l); if (t.checked && i < 0) a.push(l); if (!t.checked && i >= 0) a.splice(i, 1); markSaved(); renderEditor(); }
    if (t.hasAttribute("data-hdrcall")) { snapshot(); S.globals.header.call = t.checked; markSaved(); renderEditor(); }
    if (t.hasAttribute("data-hdrsticky")) { S.globals.header.sticky = t.checked; markSaved(); }
    if (t.hasAttribute("data-footpowered")) { snapshot(); S.globals.footer.powered = t.checked; markSaved(); renderEditor(); }
    if (t.hasAttribute("data-footfield")) { snapshot(); const l = t.getAttribute("data-footfield"); const a = S.globals.footer.fields; const i = a.indexOf(l); if (t.checked && i < 0) a.push(l); if (!t.checked && i >= 0) a.splice(i, 1); markSaved(); }
  }
  let fieldTimer;
  function scheduleFieldSave() { markSaved(); clearTimeout(fieldTimer); fieldTimer = setTimeout(() => { snapshot(); save(); renderCanvasOnly(); }, 400); }
  function renderCanvasOnly() { if (S.view === "editor") { $("#eCanvas").innerHTML = canvas(); $("#eCanvas").className = "ecanvas " + (S.editMode ? "editmode" : "previewmode"); $("#estatus").innerHTML = editorStatus(); } }
  function filterAdd(q) {
    $$("#eLeft [data-addsec]").forEach((el) => {
      const name = el.textContent.toLowerCase();
      el.style.display = name.indexOf(q.toLowerCase()) >= 0 ? "" : "none";
    });
  }

  function jumpTo(where) {
    const routes = { availability: "availability", visits: "visits", plan: "plan", settings: "settings", responsive: "editor", home: "home" };
    if (where === "responsive") { go("editor"); setTimeout(openResponsive, 60); return; }
    if (routes[where]) { go(routes[where]); return; }
    // section jump inside editor
    go("editor");
    setTimeout(() => {
      const idx = S.pages[0].blocks.findIndex((b) => b.type === where);
      if (idx >= 0) { S.currentPage = "home"; S.sel = { page: "home", block: idx }; save(); renderEditor(); const el = $(`#eCanvas [data-canvas-sel="${idx}"]`); if (el) el.scrollIntoView({ block: "center" }); }
    }, 60);
  }

  /* --- drag reorder (desktop layers) --- */
  let dragI = null;
  document.addEventListener("dragstart", (e) => { const r = e.target.closest("[data-drag]"); if (!r) return; dragI = +r.getAttribute("data-drag"); r.classList.add("dragging"); });
  document.addEventListener("dragover", (e) => { const r = e.target.closest(".navrow[data-drag]"); if (!r) return; e.preventDefault(); $$(".navrow.dragover").forEach((x) => x.classList.remove("dragover")); r.classList.add("dragover"); });
  document.addEventListener("drop", (e) => { const r = e.target.closest(".navrow[data-drag]"); if (!r || dragI == null) return; e.preventDefault(); reorderTo(dragI, +r.getAttribute("data-drag")); dragI = null; });
  document.addEventListener("dragend", () => { $$(".dragging,.dragover").forEach((x) => x.classList.remove("dragging", "dragover")); dragI = null; });

  /* --- keyboard --- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeOverlay(); $("#cmd").classList.remove("on"); $("#sideNav").classList.remove("open"); $("#scrim").classList.remove("open"); return; }
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); if (S.view === "editor") openCmd(); return; }
    if ($("#cmd").classList.contains("on")) {
      const items = $$(".cmd-item[data-cmd-run]");
      if (e.key === "ArrowDown") { e.preventDefault(); cmdSel = Math.min(cmdSel + 1, items.length - 1); renderCmd($("#cmdInput").value); }
      if (e.key === "ArrowUp") { e.preventDefault(); cmdSel = Math.max(cmdSel - 1, 0); renderCmd($("#cmdInput").value); }
      if (e.key === "Enter" && items[cmdSel]) { items[cmdSel].click(); }
      return;
    }
    if (S.view !== "editor" || !canEdit()) return;
    if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    if (mod && e.key === "Enter") { e.preventDefault(); publishSummary._last = publishSummary(); openPublish(); }
    if (e.key.toLowerCase() === "p" && !mod) { toggleMode(); }
    if (S.sel && S.sel.block != null) {
      if (e.key === "Backspace" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); delBlock(S.sel.block); }
      if (mod && e.key.toLowerCase() === "d") { e.preventDefault(); dupBlock(S.sel.block); }
      if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); moveBlock(S.sel.block, -1); }
      if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); moveBlock(S.sel.block, 1); }
    }
  });

  /* --- mobile panels --- */
  function openLayersMobile() {
    openOverlay(`<div class="sheet-h"><div><b>Sections · ${esc(page().name)}</b><div class="tiny muted">${structureLocked() ? "Fixed on Basic" : "Reorder, hide, remove"}</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b"><div class="list">${page().blocks.map((b, i) => { const d = SECTIONS[b.type];
        return `<div class="list-row"><span class="grow tiny ${b.hidden ? "dim" : ""}">${ic(d.ico)} ${esc(d.name)}</span>
          ${d.struct || structureLocked() ? `<span class="chip chip-off tiny">${d.struct ? "fixed" : "🔒"}</span>` :
            `<button class="btn btn-ico btn-sm" data-secmove="${i},-1">${ic("cu")}</button><button class="btn btn-ico btn-sm" data-secmove="${i},1">${ic("cd")}</button><button class="btn btn-ico btn-sm" data-sechide="${i}">${ic(b.hidden ? "eye" : "eye-off")}</button>${d.dup ? `<button class="btn btn-ico btn-sm" data-secdup="${i}">${ic("dup")}</button>` : ""}<button class="btn btn-ico btn-sm" data-secdel="${i}">${ic("trash")}</button>`}</div>`;
      }).join("")}</div>
      <button class="btn btn-sm btn-block" style="margin-top:9px" data-leftmode-m="add" data-close>${ic("plus")} Add section</button></div>`, { sheet: true, full: true });
  }
  function openAddMobile() {
    const present = page().blocks.map((b) => b.type);
    openOverlay(`<div class="sheet-h"><div><b>Add a section</b><div class="tiny muted">Every section is pre-designed and can’t break on a phone</div></div><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div>
      <div class="sheet-b">${structureLocked() ? `<div class="callout callout-adv stack-sm"><div class="row">${ic("lock")} <b>Adding sections is part of Advanced</b></div><div class="tiny">Basic keeps a fixed, safe layout.</div><button class="btn btn-sm btn-primary" data-go="upgrade" data-close>See Advanced</button></div>`
        : ADD_CATS.map((cat) => `<div class="navgroup-h">${cat}</div>` + Object.keys(SECTIONS).filter((tp) => SECTIONS[tp].cat === cat).map((tp) => { const d = SECTIONS[tp]; const added = d.solo && present.indexOf(tp) >= 0; const adv = d.advanced && !advActive();
          return `<button class="list-row" data-addsec="${tp}" ${added ? "disabled" : ""} data-close style="border:1px solid var(--line-2);border-radius:var(--r);margin-bottom:5px"><span class="navrow-ico">${ic(d.ico)}</span><span class="grow"><b class="tiny">${d.name}</b><div class="tiny muted">${sectionBlurb(tp)}</div></span>${added ? `<span class="chip">Added</span>` : adv ? `<span class="chip chip-adv">${ic("lock")}</span>` : `<span class="chip chip-ok">+</span>`}</button>`; }).join("")).join("")}</div>`, { sheet: true, full: true });
  }
  function openLeftMobile() {
    const html = S.leftMode === "pages" ? pagesPanel() : S.leftMode === "assets" ? assetsPanel() : layersPanel();
    openOverlay(`<div class="sheet-h"><b>${S.leftMode === "pages" ? "Pages" : "Assets"}</b><button class="btn btn-ico btn-sm" data-close>${ic("x")}</button></div><div class="sheet-b">${html}</div>`, { sheet: true, full: true });
  }

  /* menu / scrim */
  $("#menuBtn").addEventListener("click", () => { $("#sideNav").classList.toggle("open"); $("#scrim").classList.toggle("open"); });
  $("#scrim").addEventListener("click", () => { $("#sideNav").classList.remove("open"); $("#scrim").classList.remove("open"); });
  $("#ov").addEventListener("click", (e) => { if (e.target.id === "ov") closeOverlay(); });
  $("#cmd").addEventListener("click", (e) => { if (e.target.id === "cmd") $("#cmd").classList.remove("on"); });

  /* dev */
  $("#devTog").addEventListener("click", () => $("#dev").classList.toggle("open"));
  $("#devReset").addEventListener("click", () => { try { localStorage.removeItem("managr_builder_v2"); } catch (e) {} location.reload(); });

  /* ============================================================================
     PART 6 · DEV BAR + address logic + BOOT
     ========================================================================== */
  const JUMPS = [
    ["home", "Website home"], ["editor", "Editor"], ["health", "Site health"], ["settings", "Website settings"],
    ["availability", "Availability settings"], ["visits", "Visit settings"], ["enquiries", "Enquiries"],
    ["requests", "Booking requests"], ["analytics", "Analytics"], ["plan", "Plan"], ["upgrade", "Upgrade offer"],
    ["scheduled", "Scheduled Visits"], ["loading", "Loading state"], ["live", "Visitor site"]
  ];
  function renderDev() {
    $("#devJump").innerHTML = JUMPS.map((j) => `<button data-devgo="${j[0]}" class="${S.view === j[0] ? "on" : ""}">${j[1]}</button>`).join("");
    const seg = (key, opts) => `<div class="dev-seg">${opts.map((o) => `<button data-devset="${key}:${o[0]}" class="${String(S[key]) === String(o[0]) ? "on" : ""}">${o[1]}</button>`).join("")}</div>`;
    $("#devToggles").innerHTML =
      `<h5>Plan</h5>${seg("plan", [["basic", "Basic"], ["trial", "Trial"], ["advanced", "Advanced"], ["expiring", "Expiring"], ["payment_failed", "Pay-fail"], ["lapsed", "Lapsed"]])}
       <h5>Role</h5>${seg("role", [["owner", "Owner"], ["manager", "Manager"], ["staff", "Staff"]])}
       <h5>Connection</h5>${seg("conn", [["online", "Online"], ["offline", "Offline"]])}
       <h5>Site</h5>${seg("siteLive", [[true, "Live"], [false, "Offline"]])}
       <h5>Setup stage</h5>${seg("setup", [["done", "Done"], ["locked", "Locked"], ["unlocked", "Unlocked"], ["address", "Address"]])}
       <h5>Published properties</h5>${seg("propMode", [["none", "None"], ["one", "One"], ["many", "Many"]])}
       <h5>Availability</h5>${seg("availOn", [[true, "On"], [false, "Off"]])}${seg("availStale", [[false, "Fresh"], [true, "Stale"]])}
       <h5>Publish</h5>${seg("_pubFail", [[false, "OK"], [true, "Fails"]])}`;
  }

  /* address field */
  const RESERVED = ["admin", "api", "www", "managr", "bedr", "help", "support", "app", "test", "new"];
  const TAKEN = ["shreeresidency", "urbanstay", "greennest", "zolo"];
  function bindAddress() {
    const inp = $("#addr"); if (!inp) return;
    let st = "empty";
    const upd = () => {
      const raw = inp.value.trim(); const lo = raw.toLowerCase(); const slug = lo.replace(/[^a-z0-9-]/g, "");
      const echo = $("#addrEcho"), hint = $("#addrHint"), icoEl = $("#addrIco"), sug = $("#addrSug"), next = $("#addrNext");
      sug.innerHTML = ""; icoEl.textContent = "";
      if (!raw) { st = "empty"; hint.textContent = "Type the name you’d like — try your business name."; hint.className = "help"; sug.innerHTML = `<button class="chip chip-lg" data-fill="shreeresidency">${ic("sparkle")} Use “shreeresidency”</button>`; }
      else if (raw !== lo || /[^a-z0-9-]/.test(raw)) { st = "invalid"; hint.textContent = "Use lowercase letters, numbers and hyphens only — no spaces or symbols."; hint.className = "help help-err"; icoEl.textContent = "✕"; }
      else if (slug.length < 3) { st = "short"; hint.textContent = "A little longer, please — at least 3 letters."; hint.className = "help help-warn"; }
      else if (RESERVED.indexOf(slug) >= 0) { st = "reserved"; hint.textContent = `Sorry, “${slug}” is a word we keep reserved. Try something else.`; hint.className = "help help-err"; icoEl.textContent = "✕"; }
      else {
        st = "checking"; hint.textContent = "Checking if it’s free…"; hint.className = "help"; icoEl.innerHTML = `<span class="tiny">…</span>`;
        clearTimeout(upd._t); upd._t = setTimeout(() => {
          if (inp.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") !== slug) return;
          if (TAKEN.indexOf(slug) >= 0) { st = "taken"; hint.textContent = "That one’s taken. How about:"; hint.className = "help help-warn"; icoEl.textContent = "✕"; sug.innerHTML = [slug + "-andheri", slug + "-pg", slug + "1"].map((x) => `<button class="chip chip-lg" data-fill="${x}">${x}</button>`).join(" "); }
          else { st = "ok"; hint.textContent = `${ic("check")} ${slug}.${DOMAIN} is available.`; hint.innerHTML = `${ic("check")} <b>${slug}.${DOMAIN}</b> is available`; hint.className = "help help-ok"; icoEl.textContent = "✓"; S._pendingSlug = slug; }
          next.setAttribute("aria-disabled", st === "ok" ? "false" : "true");
        }, 700);
      }
      echo.textContent = `https://${slug || "your-name"}.${DOMAIN}`;
      next.setAttribute("aria-disabled", st === "ok" ? "false" : "true");
    };
    inp.addEventListener("input", upd); upd();
    $("#screen").addEventListener("click", function h(e) { const f = e.target.closest("[data-fill]"); if (f) { inp.value = f.getAttribute("data-fill"); upd(); } });
    $("#addrNext").addEventListener("click", () => { if (st === "ok") { S.slug = S._pendingSlug; S.setup = "confirm"; save(); renderApp(); bindConfirm(); } });
  }
  function bindConfirm() {
    const ck = $("#permck"); if (!ck) return;
    ck.addEventListener("change", () => $("#claimBtn").setAttribute("aria-disabled", ck.checked ? "false" : "true"));
    $("#claimBtn").addEventListener("click", () => { if (ck.checked) { S.setup = "info"; save(); renderApp(); } });
  }
  const _renderApp = renderApp;
  renderApp = function () { _renderApp(); if (S.view === "home" && S.setup === "address") bindAddress(); if (S.view === "home" && S.setup === "confirm") bindConfirm(); };

  /* connection sim */
  function applyConn() { flashSave(S.conn === "offline" ? "offline" : "saved"); }

  /* ---------------- BOOT ---------------- */
  snapshot();
  if (!S.published) { S.published = { pages: clone(S.pages), theme: S.theme, globals: clone(S.globals) }; save(); }
  if (!S.versions.length) {
    S.versions.push({ id: "v-genesis", kind: "published", ts: Date.now() - 12096e5, summary: "Site created", isLive: true,
      snap: { pages: clone(S.pages), theme: S.theme, globals: clone(S.globals) } });
    save();
  }
  const hv = location.hash.replace("#/", "");
  if (hv) S.view = hv;
  applyConn();
  render();
})();

