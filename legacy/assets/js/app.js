/* ============================================================================
   ManagR — Owner Website Setup (Flow A) · prototype logic
   Plain JS, no framework. State is mock ManagR/dashboard data the builder reads.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- config / mock data ---------------------------------------- */
  const DOMAIN = "managr.in";
  const BUSINESS = "Shree Residency";
  const SUGGESTED = "shreeresidency";
  const ACCOUNT = { phone: "88576 15102", email: "niraj.rawool@example.com" };

  const RESERVED = new Set(["admin","api","www","app","apps","managr","bedr","help","support","login","signup","register","account","accounts","dashboard","settings","static","assets","cdn","mail","email","blog","status","about","contact","owner","owners","test","root","billing","pay","payments","pricing","terms","privacy","me","new"]);
  const TAKEN = new Set(["shreeresidency","urbanstay","rawool","skylinepg","zolostays","stanza","sunriseresidency","pgmumbai","test123","greenview"]);

  const PROP = {
    name: "Shree Residency", area: "Andheri West, Mumbai", areaShort: "Andheri West",
    from: "₹8,000", sharing: ["Double", "Triple"],
    rooms: [
      { t: "Triple sharing", rent: "₹8,000/mo", dep: "₹16,000" },
      { t: "Double sharing", rent: "₹11,000/mo", dep: "₹22,000" },
      { t: "Private room", rent: "₹17,000/mo", dep: "₹34,000" }
    ],
    amenities: ["WiFi", "CCTV", "Meals included", "Laundry", "Power backup", "Housekeeping"],
    rules: ["Gate closes 11:00 PM", "No smoking indoors", "ID proof required at move-in"]
  };

  const SAMPLE = {
    name: "Sunrise Residency",
    headline: "Sunrise Residency — PG stays in Kandivali",
    about: "Family-run PG for students and working professionals. Home-cooked meals, two minutes from the station.",
    phone: "98•••••• 01",
    properties: [
      { name: "Sunrise Residency — Boys", area: "Kandivali West", from: "₹7,500", sharing: ["Triple", "Double"],
        rooms: [{ t: "Triple sharing", rent: "₹7,500/mo", dep: "₹15,000" }, { t: "Double sharing", rent: "₹9,500/mo", dep: "₹19,000" }],
        amenities: ["WiFi", "Meals included", "CCTV", "Laundry"], rules: ["Gate closes 11 PM", "No smoking", "ID proof required"] },
      { name: "Sunrise Residency — Girls", area: "Kandivali West", from: "₹8,500", sharing: ["Double", "Private"],
        rooms: [{ t: "Double sharing", rent: "₹8,500/mo", dep: "₹17,000" }, { t: "Private room", rent: "₹14,000/mo", dep: "₹28,000" }],
        amenities: ["WiFi", "Meals included", "CCTV", "Warden", "Housekeeping"], rules: ["Gate closes 10:30 PM", "Visitors till 8 PM", "ID proof required"] }
    ]
  };

  const FALLBACK = {
    headline: BUSINESS + " — PG & Hostel stays in " + PROP.areaShort,
    about: "Comfortable, well-managed shared accommodation. Direct from the owner — no brokerage."
  };

  const BRANDS = [
    { name: "BEDR coral", v: "#F7553D" },
    { name: "Deep navy", v: "#0F5584" },
    { name: "Warm green", v: "#0F9D6B" },
    { name: "Violet", v: "#6D4AFF" }
  ];

  const SCREENS = [
    { id: "locked",   label: "1 · Locked (no property)", shell: "app" },
    { id: "unlocked", label: "2 · Property approved",    shell: "app" },
    { id: "address",  label: "3 · Choose address",       shell: "wizard", step: 1 },
    { id: "confirm",  label: "4 · Confirm address",      shell: "wizard", step: 2 },
    { id: "info",     label: "5 · Basic information",    shell: "wizard", step: 3 },
    { id: "live",     label: "6 · Website is live",      shell: "wizard", step: 4 },
    { id: "steady",   label: "7 · Steady state",         shell: "app" },
    { id: "empty",    label: "8 · Live but empty",       shell: "app" },
    { id: "loading",  label: "— Loading state",          shell: "app" },
    { id: "visitor",  label: "↗ Visitor site",           shell: "visitor" }
  ];

  /* ---------- state ---------------------------------------------------- */
  const DEFAULT_STATE = {
    approved: false, claimed: false, slug: "", published: true, live: true,
    infoDone: false, info: { headline: "", about: "", phone: "", email: "", office: "" },
    brand: BRANDS[0].v, screen: null
  };
  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem("managr_web_proto");
      if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
    } catch (e) {}
    return Object.assign({}, DEFAULT_STATE);
  }
  function save() { try { localStorage.setItem("managr_web_proto", JSON.stringify(S)); } catch (e) {} }

  /* ---------- helpers ------------------------------------------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ic = (n) => '<svg class="icon" aria-hidden="true"><use href="#ic-' + n + '"/></svg>';

  function fullUrl() { return (S.slug || SUGGESTED) + "." + DOMAIN; }
  function fullUrlHttps() { return "https://" + fullUrl(); }
  function getInfo(k) {
    if (k === "phone") return S.info.phone || ACCOUNT.phone;
    if (k === "email") return S.info.email || "";
    if (k === "office") return S.info.office || "";
    return S.info[k] || FALLBACK[k] || "";
  }

  function toast(msg, okIcon) {
    const root = $("#toastRoot");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = (okIcon === false ? "" : ic("check")) + "<span>" + esc(msg) + "</span>";
    root.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(6px)"; }, 2200);
    setTimeout(() => t.remove(), 2600);
  }

  function copy(text) {
    const done = () => toast("Link copied");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const i = document.createElement("textarea");
    i.value = text; i.style.position = "fixed"; i.style.opacity = "0";
    document.body.appendChild(i); i.select();
    try { document.execCommand("copy"); done(); } catch (e) { toast("Copy failed", false); }
    i.remove();
  }
  function waShare(text) { window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener"); }

  /* ---------- overlay / sheet --------------------------------------- */
  function openSheet(id) {
    const o = $('[data-sheet="' + id + '"]');
    if (o) o.classList.add("is-open");
  }
  function closeSheets() { $$(".overlay.is-open").forEach((o) => { if (!o.id) o.classList.remove("is-open"); }); }

  /* ---------- router ------------------------------------------------ */
  function screenDef(id) { return SCREENS.filter((s) => s.id === id)[0]; }

  function validFor(id) {
    if (id === "address" || id === "confirm") return S.approved;
    if (id === "info" || id === "live") return S.claimed;
    return true;
  }
  function computeDefault() {
    if (S.claimed) return "steady";
    if (S.approved) return "unlocked";
    return "locked";
  }

  function showScreen(id, opts) {
    opts = opts || {};
    const def = screenDef(id) || screenDef("locked");
    id = def.id;

    if (id === "visitor") { openVisitor(); return; }

    $("#visitorShell").classList.remove("is-active");
    closeSheets();

    const app = $("#appShell"), wiz = $("#wizard");
    if (def.shell === "wizard") {
      app.style.display = "none";
      wiz.classList.add("is-active");
      setActive($("#wizard .wizard__body"), id);
      renderWizardChrome(id);
      $("#wizard .wizard__body").scrollTop = 0;
    } else {
      wiz.classList.remove("is-active");
      app.style.display = "";
      setActive($("#dashboardContent"), id);
      if (id === "steady") renderWebsiteHome($("#whSteady"), {});
      if (id === "empty") renderWebsiteHome($("#whEmpty"), { publishedView: false });
      window.scrollTo(0, 0);
      $("#dashboardContent").scrollTop = 0;
      closeNav();
    }

    if (id !== "loading" && id !== "empty") { S.screen = id; save(); }
    syncChrome();
    markDevCurrent(id);
    if (id === "live") onLiveEnter();
    if (id === "info") onInfoEnter();
    if (id === "address") onAddressEnter();
    if (id === "confirm") {
      var cs = S.pendingSlug || S.slug || SUGGESTED;
      $("#confirmEcho").innerHTML = "https://<b>" + esc(cs) + "</b><wbr>." + DOMAIN.replace(".", "<wbr>.");
    }
  }
  function setActive(container, id) {
    $$(".screen", container).forEach((s) => s.classList.toggle("is-active", s.getAttribute("data-screen") === id));
  }

  function syncChrome() {
    $("#appbarPlan").textContent = "Basic · Free";
    $("#navPlanBadge").textContent = "Free";
  }

  /* ---------- wizard chrome --------------------------------------- */
  function renderWizardChrome(id) {
    const step = screenDef(id).step || 1;
    const dots = [1, 2, 3, 4].map((n) =>
      '<span class="stepper__dot ' + (n < step ? "is-done" : n === step ? "is-current" : "") + '"></span>').join("");
    $("#wizStepper").innerHTML = dots;
    $("#wizStepLabel").textContent = "Step " + step + " of 4";

    const back = $("#wizBack");
    back.style.visibility = (id === "address" || id === "confirm") ? "visible" : "hidden";

    const acts = $("#wizActions");
    if (id === "address") {
      acts.innerHTML = '<button class="btn btn--primary" id="addrContinue" aria-disabled="true">Continue</button>';
      $("#addrContinue").addEventListener("click", () => { if (addrState.state === "available") { S.pendingSlug = addrState.slug; save(); showScreen("confirm"); } });
      refreshAddrContinue();
    } else if (id === "confirm") {
      acts.innerHTML = '<button class="btn btn--primary" id="claimBtn" aria-disabled="true">' + ic("lock") + ' Claim this address</button>';
      $("#claimBtn").addEventListener("click", claimAddress);
      $("#confirmCheck").checked = false;
    } else if (id === "info") {
      acts.innerHTML = '<button class="btn btn--link" id="skipInfo">Skip for now</button>' +
                       '<button class="btn btn--primary" id="finishInfo">Finish &amp; go live</button>';
      $("#skipInfo").addEventListener("click", () => openSheet("sheet-skip"));
      $("#finishInfo").addEventListener("click", () => { readInfoForm(); finishSetup(); });
    } else if (id === "live") {
      acts.innerHTML = '<button class="btn btn--primary" id="toDash">Go to my website</button>';
      $("#toDash").addEventListener("click", () => showScreen("steady"));
    }
  }

  /* ---------- Screen 3: choose address --------------------------- */
  let addrState = { state: "empty" };
  let checkToken = 0;

  function slugify(raw) {
    return String(raw).toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  }
  function suggestions(base) {
    return [base + "-mumbai", base + "-pg", base + "1"].filter((s) => !TAKEN.has(s) && !RESERVED.has(s)).slice(0, 3);
  }
  function validateAddr(raw) {
    if (!raw) return { state: "empty" };
    const lower = raw.toLowerCase();
    if (raw !== lower || /[^a-z0-9-]/.test(raw)) return { state: "invalid", fix: slugify(raw) };
    const slug = slugify(raw);
    if (slug.length < 3) return { state: "short", slug: slug };
    if (RESERVED.has(slug)) return { state: "reserved", slug: slug, sug: suggestions(slug) };
    return { state: "pending", slug: slug };
  }

  function onAddressEnter() {
    $("#addrInput").value = S.pendingSlug || "";
    handleAddrInput(true);
  }

  function handleAddrInput(silent) {
    const raw = $("#addrInput").value.trim();
    const v = validateAddr(raw);

    if (v.state === "pending") {
      addrState = { state: "checking", slug: v.slug };
      renderAddr();
      const my = ++checkToken;
      clearTimeout(handleAddrInput._t);
      handleAddrInput._t = setTimeout(() => {
        if (my !== checkToken) return;
        if ($("#addrInput").value.trim().toLowerCase() !== raw.toLowerCase()) return;
        addrState = TAKEN.has(v.slug)
          ? { state: "taken", slug: v.slug, sug: suggestions(v.slug) }
          : { state: "available", slug: v.slug };
        renderAddr();
      }, 900);
    } else {
      checkToken++;
      addrState = v;
      renderAddr();
    }
  }

  function echoHtml(slug) {
    return "https://<b>" + esc(slug || "your-name") + "</b>." + DOMAIN;
  }

  function renderAddr() {
    const f = $("#urlField"), st = $("#addrStatus"), hint = $("#addrHint"), sug = $("#addrSuggest");
    const s = addrState;
    f.classList.remove("is-available", "is-error");
    st.innerHTML = ""; sug.innerHTML = "";
    hint.className = "field__hint";

    let echoSlug = s.slug || "";

    if (s.state === "empty") {
      hint.textContent = "Choose your web address to continue.";
      sug.innerHTML = '<button class="suggest-chip" data-suggest="' + SUGGESTED + '">' + ic("sparkles") + " Use " + esc(SUGGESTED) + "</button>";
      echoSlug = "";
    } else if (s.state === "invalid") {
      f.classList.add("is-error");
      st.innerHTML = ic("x");
      hint.className = "field__hint field__hint--error";
      hint.textContent = "Use only lowercase letters, numbers and hyphens — no spaces or symbols.";
      if (s.fix && s.fix.length >= 3) sug.innerHTML = '<button class="suggest-chip" data-suggest="' + esc(s.fix) + '">' + ic("check") + " Use " + esc(s.fix) + "</button>";
      echoSlug = s.fix || "";
    } else if (s.state === "short") {
      f.classList.add("is-error");
      st.innerHTML = ic("alert");
      hint.className = "field__hint field__hint--error";
      hint.textContent = "A bit short — use at least 3 characters.";
    } else if (s.state === "reserved") {
      f.classList.add("is-error");
      st.innerHTML = ic("x");
      hint.className = "field__hint field__hint--error";
      hint.textContent = "“" + esc(s.slug) + "” is a reserved word and can’t be used.";
      renderSug(sug, s.sug);
    } else if (s.state === "checking") {
      st.innerHTML = '<span class="spinner"></span>';
      hint.textContent = "Checking availability…";
    } else if (s.state === "taken") {
      f.classList.add("is-error");
      st.innerHTML = ic("x");
      hint.className = "field__hint field__hint--error";
      hint.textContent = "Someone already has this address. Try one of these:";
      renderSug(sug, s.sug);
    } else if (s.state === "available") {
      f.classList.add("is-available");
      st.innerHTML = ic("check-circle");
      hint.className = "field__hint field__hint--ok";
      hint.textContent = esc(s.slug + "." + DOMAIN) + " is available.";
    }

    $("#addrEcho").innerHTML = echoHtml(echoSlug);
    refreshAddrContinue();
  }
  function renderSug(container, list) {
    if (!list || !list.length) return;
    container.innerHTML = list.map((s) => '<button class="suggest-chip" data-suggest="' + esc(s) + '" style="margin:4px 6px 0 0">' + esc(s) + "</button>").join("");
  }
  function refreshAddrContinue() {
    const b = $("#addrContinue");
    if (b) b.setAttribute("aria-disabled", addrState.state === "available" ? "false" : "true");
  }

  /* ---------- Screen 4: confirm ---------------------------------- */
  function claimAddress() {
    if (!$("#confirmCheck").checked) return;
    S.slug = S.pendingSlug || addrState.slug;
    S.claimed = true; S.live = true; S.published = true;
    save();
    toast("Address claimed");
    showScreen("info");
  }

  /* ---------- Screen 5: basic info ------------------------------ */
  function onInfoEnter() {
    $("#fbHeadline").textContent = FALLBACK.headline;
    $("#fbAbout").textContent = FALLBACK.about;
    $("#fHeadline").value = S.info.headline || "";
    $("#fAbout").value = S.info.about || "";
    $("#fPhone").value = S.info.phone || ACCOUNT.phone;
    $("#fEmail").value = S.info.email || ACCOUNT.email;
    $("#fOffice").value = S.info.office || "";
  }
  function readInfoForm() {
    const ph = $("#fPhone").value.trim();
    S.info.headline = $("#fHeadline").value.trim();
    S.info.about = $("#fAbout").value.trim();
    S.info.phone = ph === ACCOUNT.phone ? "" : ph;   // unchanged prefill == account fallback
    S.info.email = $("#fEmail").value.trim();
    S.info.office = $("#fOffice").value.trim();
    save();
  }
  function finishSetup() { S.infoDone = true; save(); showScreen("live"); }

  /* ---------- Screen 6: live ---------------------------------- */
  function onLiveEnter() {
    renderCopybar($("#liveCopybar"));
    spawnConfetti();
  }
  function spawnConfetti() {
    const box = $("#confetti");
    if (!box) return;
    box.innerHTML = "";
    const cols = ["#F7553D", "#00BC7D", "#155DFC", "#FF6900", "#8200DB", "#FEE685"];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = cols[i % cols.length];
      s.style.animationDelay = (Math.random() * 250) + "ms";
      s.style.transform = "rotate(" + (Math.random() * 90) + "deg)";
      box.appendChild(s);
    }
    setTimeout(() => { box.innerHTML = ""; }, 2200);
  }

  function renderCopybar(container) {
    container.innerHTML =
      '<span class="copybar__url">' + esc(fullUrl()) + "</span>" +
      '<div class="copybar__actions">' +
      '<button class="btn btn--icon btn--sm" data-copy aria-label="Copy link">' + ic("copy") + "</button>" +
      '<button class="btn btn--icon btn--sm" data-openurl aria-label="Open website">' + ic("external") + "</button>" +
      "</div>";
  }

  /* ---------- Screens 7 & 8: website home -------------------- */
  function renderWebsiteHome(root, o) {
    o = o || {};
    const published = (o.publishedView !== undefined) ? o.publishedView : S.published;
    const live = S.live;

    const statusPill = live
      ? '<span class="pill pill--success pill--dot">Live</span>'
      : '<span class="pill pill--neutral pill--dot">Offline</span>';

    const emptyWarn = (live && !published) ? (
      '<div class="notice notice--warning">' + ic("alert") +
      '<div><p class="notice__title">Your website is live, but has no properties to show</p>' +
      '<p class="notice__body t-caption">“Shree Residency” was unpublished on 2 Sept and is being reviewed again. ' +
      'Visitors currently see a short “properties coming soon” message instead of your list. ' +
      'Nothing is broken — your properties come back automatically as soon as one is approved.</p>' +
      '<div class="notice__actions">' +
      '<button class="btn btn--outline btn--sm">' + ic("building") + " View in Properties</button>" +
      '<button class="btn btn--subtle btn--sm" data-toggle-live>' + ic("power") + " Take website offline until it’s ready</button>" +
      "</div></div></div>"
    ) : "";

    const propsBlock = published ? (
      '<div class="card"><div class="card__header"><h2 class="card__title--sm">On your website</h2>' +
      '<a class="card__action">Manage in Properties ' + ic("chevron-right") + "</a></div>" +
      '<div class="wh-props"><div class="prop-row">' +
      '<span class="prop-row__thumb">' + ic("building") + "</span>" +
      '<div class="prop-row__meta"><b>' + esc(PROP.name) + "</b><span>" + esc(PROP.area) + "</span></div>" +
      '<span class="pill pill--success pill--sm pill--dot">Live</span></div></div>' +
      '<p class="freshness" style="margin-top:12px">' + ic("refresh") + " Details synced from your dashboard just now</p></div>"
    ) : (
      '<div class="card"><div class="card__header"><h2 class="card__title--sm">On your website</h2>' +
      '<a class="card__action">Manage in Properties ' + ic("chevron-right") + "</a></div>" +
      '<div class="empty"><span class="empty__icon">' + ic("building") + "</span>" +
      '<p class="empty__title">No properties showing yet</p>' +
      '<p class="empty__text">Approved properties appear here automatically. This isn’t an error — it just means none are approved right now.</p></div></div>'
    );

    root.innerHTML =
      '<div class="stack">' +

      '<div class="page-head"><div>' +
      '<h1 class="page-head__title">Website</h1>' +
      '<p class="page-head__desc">Your public site, built from your dashboard.</p>' +
      "</div></div>" +

      emptyWarn +

      '<div class="card"><div class="status-card">' +
      '<div class="status-card__left">' + statusPill +
      '<div><b class="t-body-strong">' + (live ? "Visible to everyone" : "Hidden from visitors") + "</b>" +
      '<div class="t-caption t-muted">' + (live ? "Anyone with your link can see it" : "Visitors see a short “temporarily unavailable” message") + "</div></div></div>" +
      '<label class="switch"><input type="checkbox" data-toggle-live ' + (live ? "checked" : "") + '><span class="switch__track"></span></label>' +
      "</div></div>" +

      '<div class="card"><p class="section-label t-micro">Your link</p>' +
      '<div class="copybar" data-copybar></div>' +
      '<div class="cluster" style="margin-top:12px">' +
      '<button class="btn btn--outline btn--sm" data-open="sheet-qr">' + ic("qr") + " QR code</button>" +
      '<button class="btn btn--outline btn--sm" data-share-wa>' + ic("whatsapp") + " Share</button>" +
      '<button class="btn btn--outline btn--sm" data-openurl>' + ic("external") + " Open</button>" +
      "</div></div>" +

      '<div><p class="section-label t-micro">Last 7 days</p>' +
      '<div class="count-row">' +
      statCard("eye", "24", "Visitors") +
      statCard("phone", "6", "Calls") +
      statCard("whatsapp", "9", "WhatsApp taps") +
      "</div>" +
      '<p class="freshness" style="margin-top:8px">' + ic("check-circle") + " Updated today</p></div>" +

      '<div class="card"><div class="card__header"><h2 class="card__title--sm">Website information</h2>' +
      '<button class="btn btn--link" data-edit-info>' + ic("edit") + " Edit</button></div>" +
      infoKv() +
      '<p class="t-caption t-muted" style="margin-top:12px">' + ic("info") +
      ' Rent, rooms and amenities come from your dashboard and can’t be changed here.</p></div>' +

      propsBlock +

      '<div class="card"><div class="adv-nudge">' +
      '<span class="adv-nudge__ic">' + ic("sparkles") + "</span>" +
      '<div><b class="t-body-strong">Let people book a visit themselves</b>' +
      '<p class="t-caption t-muted" style="margin:4px 0 8px">6 people called you from your website this week. With Advanced they can pick a slot without calling.</p>' +
      '<button class="btn btn--outline btn--sm" data-open="sheet-advanced">See what’s in Advanced</button></div>' +
      "</div></div>" +

      "</div>";

    renderCopybar($("[data-copybar]", root));
  }

  function statCard(icon, value, label) {
    return '<div class="card"><div class="stat"><div class="stat__top">' +
      '<span class="stat__value">' + esc(value) + "</span>" +
      '<span class="stat__icon">' + ic(icon) + "</span></div>" +
      '<span class="stat__label">' + esc(label) + "</span></div></div>";
  }
  function infoKv() {
    const row = (label, val, fb) =>
      '<div class="kv__row"><span class="kv__label">' + esc(label) + "</span>" +
      '<span class="kv__value ' + (fb ? "kv__value--fallback" : "") + '">' + esc(val) + "</span></div>";
    const emailVal = S.info.email || "Hidden";
    const officeVal = S.info.office || "Hidden";
    return '<div class="kv">' +
      row("Headline", getInfo("headline"), !S.info.headline) +
      row("About", getInfo("about"), !S.info.about) +
      row("Phone", getInfo("phone"), !S.info.phone) +
      row("Email", emailVal, !S.info.email) +
      row("Office area", officeVal, !S.info.office) +
      "</div>";
  }

  /* ---------- Visitor site ---------------------------------- */
  let vsData, vsView = "list";

  function ownerSiteData() {
    return {
      name: BUSINESS,
      headline: getInfo("headline"),
      about: getInfo("about"),
      phone: getInfo("phone"),
      properties: S.published ? [PROP] : []
    };
  }

  function vsListHtml(d, opts) {
    opts = opts || {};
    const cards = d.properties.length ? d.properties.map((p, i) =>
      '<article class="vs-card" ' + (opts.interactive ? 'data-vs-prop="' + i + '"' : "") + '>' +
      '<div class="vs-card__photo">' + ic("image") + "</div>" +
      '<div class="vs-card__b"><b>' + esc(p.name) + "</b>" +
      '<div class="vs-area">' + ic("map-pin") + " " + esc(p.area) + "</div>" +
      '<div class="vs-rent">' + esc(p.from) + ' <span>/ month onwards</span></div>' +
      '<div class="vs-sharing">' + p.sharing.map((s) => '<span class="pill pill--sm">' + esc(s) + " sharing</span>").join("") + "</div>" +
      "</div></article>").join("")
      : '<div class="vs-empty">' + ic("building") + "<p>Properties coming soon.</p><p style=\"font-size:11px;margin-top:4px\">Check back shortly or call us directly.</p></div>";

    return (
      '<div class="vs-topbar"><div class="vs-brand"><span class="vs-brand__mark">' + esc(d.name.slice(0, 1)) + "</span>" + esc(d.name) + "</div>" +
      '<a class="vs-call">' + ic("phone") + " Call</a></div>" +
      '<div class="vs-hero"><h1>' + esc(d.headline) + "</h1><p>" + esc(d.about) + "</p>" +
      '<div class="vs-trust">' + ic("shield") + " Direct from owner · No brokerage</div></div>" +
      '<div class="vs-section"><h2>Our properties</h2><div class="vs-cards">' + cards + "</div></div>" +
      vsFooterHtml(d)
    );
  }
  function vsDetailHtml(d, p) {
    return (
      '<div class="vs-topbar"><div class="vs-brand"><span class="vs-brand__mark">' + esc(d.name.slice(0, 1)) + "</span>" + esc(d.name) + "</div>" +
      '<a class="vs-call">' + ic("phone") + " Call</a></div>" +
      '<div class="vs-section"><div class="vs-cards"><div class="vs-card__photo" style="height:150px;border-radius:14px">' + ic("image") + "</div></div>" +
      '<div class="row" style="gap:6px;margin-top:8px">' +
      '<span class="vs-card__photo" style="height:52px;width:70px;border-radius:8px">' + ic("image") + "</span>" +
      '<span class="vs-card__photo" style="height:52px;width:70px;border-radius:8px">' + ic("image") + "</span>" +
      '<span class="vs-card__photo" style="height:52px;width:70px;border-radius:8px">' + ic("image") + "</span></div>" +
      '<h1 style="font-size:19px;font-weight:700;margin-top:12px">' + esc(p.name) + "</h1>" +
      '<div class="vs-area" style="color:#62748e;font-size:12px;margin-top:2px">' + ic("map-pin") + " " + esc(p.area) + "</div></div>" +

      '<div class="vs-section"><h2>Room types</h2>' +
      p.rooms.map((r) => '<div class="vs-roomtype"><div><b>' + esc(r.t) + "</b><br><span>Deposit " + esc(r.dep) + "</span></div><div style=\"text-align:right\"><b>" + esc(r.rent) + "</b></div></div>").join("") + "</div>" +

      '<div class="vs-section"><h2>Amenities</h2><div class="vs-amen">' +
      p.amenities.map((a) => '<span class="pill pill--sm">' + esc(a) + "</span>").join("") + "</div></div>" +

      '<div class="vs-section"><h2>House rules</h2><div class="stack stack--xs">' +
      p.rules.map((r) => '<div class="row" style="gap:8px"><span style="color:#90a1b9">' + ic("check") + "</span><span>" + esc(r) + "</span></div>").join("") + "</div></div>" +

      '<div class="vs-section"><h2>Location</h2><div class="vs-map"><span class="vs-map__pin">' + ic("map-pin") + "</span></div>" +
      '<p class="vs-map__note">Approximate location. The exact address is shared once you contact the owner.</p></div>' +

      vsFooterHtml(d) +
      '<div class="vs-sticky"><a class="btn btn--call">' + ic("phone") + ' Call owner</a><a class="btn btn--wa">' + ic("whatsapp") + " WhatsApp</a></div>"
    );
  }
  function vsFooterHtml(d) {
    return '<div class="vs-footer"><div class="vs-fcontact">' +
      '<span>' + ic("phone") + " " + esc(d.phone) + "</span>" +
      (getInfo("office") ? '<span>' + ic("map-pin") + " " + esc(getInfo("office")) + "</span>" : "") +
      '<span style="margin-top:6px">' + esc(d.about) + "</span></div>" +
      '<p class="vs-powered">Powered by ManagR</p></div>';
  }

  function fillPreview(node, mode) {
    const d = mode === "sample" ? SAMPLE : ownerSiteData();
    node.innerHTML = vsListHtml(d, { interactive: false });
  }

  function openVisitor() {
    vsData = ownerSiteData(); vsView = "list";
    $("#visitorUrl").textContent = fullUrlHttps();
    renderVisitor();
    $("#visitorShell").classList.add("is-active");
    $("#appShell").style.display = "none";
    $("#wizard").classList.remove("is-active");
    markDevCurrent("visitor");
  }
  function renderVisitor(prop) {
    const scroll = $("#visitorScroll");
    if (vsView === "detail" && prop) scroll.innerHTML = vsDetailHtml(vsData, prop);
    else scroll.innerHTML = vsListHtml(vsData, { interactive: true });
    scroll.scrollTop = 0;
    $("#visitorBackList").hidden = vsView !== "detail";
  }
  function closeVisitor() {
    $("#visitorShell").classList.remove("is-active");
    $("#appShell").style.display = "";
    showScreen(S.screen || computeDefault());
  }

  /* ---------- QR ------------------------------------------- */
  function buildQR() {
    const box = $("#qrCode");
    box.innerHTML = "";
    $("#qrUrl").textContent = fullUrlHttps();
    const url = fullUrlHttps();
    if (window.QRCode) {
      try {
        new window.QRCode(box, { text: url, width: 200, height: 200, colorDark: "#0F172B", colorLight: "#FFFFFF", correctLevel: window.QRCode.CorrectLevel.M });
        return;
      } catch (e) {}
    }
    fakeQR(box, url);
  }
  function fakeQR(box, str) {
    const N = 25, cv = document.createElement("canvas");
    cv.width = cv.height = N * 8;
    const g = cv.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
    let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    g.fillStyle = "#0F172B";
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const finder = (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
      if (finder) { const fx = x % (N - 7), fy = y % (N - 7); const inRing = (fx === 0 || fx === 6 || fy === 0 || fy === 6); const inCore = (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); if (inRing || inCore) g.fillRect(x * 8, y * 8, 8, 8); continue; }
      if (rnd() > 0.55) g.fillRect(x * 8, y * 8, 8, 8);
    }
    box.appendChild(cv);
    box._img = cv.toDataURL("image/png");
    const note = document.createElement("p");
    note.className = "t-caption t-muted"; note.style.marginTop = "4px";
    note.textContent = "Preview pattern — connect to the internet for a scannable code.";
    box.parentNode.appendChild(note);
  }
  function qrDataUrl() {
    const box = $("#qrCode");
    const img = box.querySelector("img");
    if (img) return img.src;
    const cv = box.querySelector("canvas");
    if (cv) return cv.toDataURL("image/png");
    return box._img || "";
  }

  /* ---------- nav / sidebar ------------------------------- */
  function openNav() { $("#sidebar").classList.add("is-open"); $("#navBackdrop").classList.add("is-open"); }
  function closeNav() { $("#sidebar").classList.remove("is-open"); $("#navBackdrop").classList.remove("is-open"); }

  /* ---------- dev toolbar -------------------------------- */
  function buildDev() {
    $("#devScreens").innerHTML = SCREENS.map((s) => '<button data-devscreen="' + s.id + '">' + esc(s.label) + "</button>").join("");
    $("#devBrand").innerHTML = BRANDS.map((b) => '<button data-devbrand="' + b.v + '" title="' + esc(b.name) + '" style="background:' + b.v + '"></button>').join("");
    syncDev();
  }
  function syncDev() {
    $$('[data-state]').forEach((i) => { i.checked = !!S[i.getAttribute("data-state")]; });
    $$('[data-devbrand]').forEach((b) => b.classList.toggle("is-on", b.getAttribute("data-devbrand") === S.brand));
    document.documentElement.style.setProperty("--site-brand", S.brand);
  }
  function markDevCurrent(id) {
    $$('[data-devscreen]').forEach((b) => b.classList.toggle("is-current", b.getAttribute("data-devscreen") === id));
  }

  /* ---------- events ------------------------------------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open],[data-close-sheet],[data-close-nav],[data-go],[data-later],[data-copy],[data-openurl],[data-share-wa],[data-suggest],[data-vs-prop],[data-toggle-live],[data-edit-info],[data-devscreen],[data-devbrand]");
    if (!t) return;

    if (t.hasAttribute("data-open")) return openSheet(t.getAttribute("data-open"));
    if (t.hasAttribute("data-close-sheet")) return closeSheets();
    if (t.hasAttribute("data-close-nav")) return closeNav();
    if (t.hasAttribute("data-later")) { toast("No problem — set it up anytime from the Website tab"); return; }
    if (t.hasAttribute("data-copy")) return copy(fullUrlHttps());
    if (t.hasAttribute("data-openurl")) return showScreen("visitor");
    if (t.hasAttribute("data-share-wa")) return waShare(getInfo("headline") + "\n" + fullUrlHttps());

    if (t.hasAttribute("data-go")) {
      const to = t.getAttribute("data-go").split(":")[1];
      return showScreen(to);
    }
    if (t.hasAttribute("data-suggest")) {
      $("#addrInput").value = t.getAttribute("data-suggest");
      $("#addrInput").focus();
      return handleAddrInput();
    }
    if (t.hasAttribute("data-vs-prop")) {
      vsView = "detail";
      return renderVisitor(vsData.properties[+t.getAttribute("data-vs-prop")]);
    }
    if (t.hasAttribute("data-toggle-live")) {
      S.live = !S.live; save();
      renderWebsiteHome($("#whSteady"), {});
      renderWebsiteHome($("#whEmpty"), { publishedView: false });
      syncDev();
      toast(S.live ? "Website is live" : "Website taken offline");
      return;
    }
    if (t.hasAttribute("data-edit-info")) {
      $("#eHeadline").value = S.info.headline; $("#eAbout").value = S.info.about;
      $("#ePhone").value = S.info.phone || ACCOUNT.phone; $("#eEmail").value = S.info.email;
      $("#eOffice").value = S.info.office;
      return openSheet("sheet-editinfo");
    }
    if (t.hasAttribute("data-devscreen")) {
      const id = t.getAttribute("data-devscreen");
      const def = screenDef(id);
      if (def.shell === "wizard" && !validFor(id)) {
        // make the state consistent so the wizard screen makes sense
        S.approved = true;
        if (id === "info" || id === "live") { S.claimed = true; S.slug = S.slug || SUGGESTED; }
        save(); syncDev();
      }
      if (id === "steady" || id === "empty") { S.approved = true; S.claimed = true; S.slug = S.slug || SUGGESTED; save(); syncDev(); }
      return showScreen(id);
    }
    if (t.hasAttribute("data-devbrand")) {
      S.brand = t.getAttribute("data-devbrand"); save(); syncDev();
      return;
    }
  });

  // overlay backdrop click closes sheet
  $$('.overlay:not(#navBackdrop)').forEach((o) => o.addEventListener("click", (e) => { if (e.target === o) closeSheets(); }));
  $("#navBackdrop").addEventListener("click", closeNav);

  $("#menuBtn").addEventListener("click", openNav);
  $("#addrInput").addEventListener("input", () => handleAddrInput());
  $("#confirmCheck").addEventListener("change", (e) => {
    const b = $("#claimBtn"); if (b) b.setAttribute("aria-disabled", e.target.checked ? "false" : "true");
  });

  $("#addPropertyBtn").addEventListener("click", () => openSheet("sheet-submitted"));
  $("#simApprove").addEventListener("click", () => { S.approved = true; save(); syncDev(); closeSheets(); toast("“Shree Residency” approved"); showScreen("unlocked"); });
  $("#skipConfirm").addEventListener("click", () => { closeSheets(); finishSetup(); });
  $("#leaveConfirm").addEventListener("click", () => { closeSheets(); showScreen(S.approved ? "unlocked" : "locked"); });

  $("#wizBack").addEventListener("click", () => {
    const cur = $("#wizard .screen.is-active").getAttribute("data-screen");
    if (cur === "confirm") showScreen("address");
    else if (cur === "address") { S.approved ? showScreen("unlocked") : showScreen("locked"); }
  });
  $("#wizClose").addEventListener("click", () => {
    if (S.claimed) showScreen("steady");
    else openSheet("sheet-leave");
  });

  $("#liveWhatsapp").addEventListener("click", () => waShare(getInfo("headline") + "\n" + fullUrlHttps()));
  $("#liveOpen").addEventListener("click", () => showScreen("visitor"));

  $("#editInfoSave").addEventListener("click", () => {
    S.info.headline = $("#eHeadline").value.trim();
    S.info.about = $("#eAbout").value.trim();
    S.info.phone = $("#ePhone").value.trim() === ACCOUNT.phone ? "" : $("#ePhone").value.trim();
    S.info.email = $("#eEmail").value.trim();
    S.info.office = $("#eOffice").value.trim();
    save(); closeSheets();
    renderWebsiteHome($("#whSteady"), {}); renderWebsiteHome($("#whEmpty"), { publishedView: false });
    toast("Saved");
  });

  $("#visitorClose").addEventListener("click", closeVisitor);
  $("#visitorBackList").addEventListener("click", () => { vsView = "list"; renderVisitor(); });

  // QR sheet lifecycle
  const qrOverlay = $('[data-sheet="sheet-qr"]');
  new MutationObserver(() => { if (qrOverlay.classList.contains("is-open")) buildQR(); })
    .observe(qrOverlay, { attributes: true, attributeFilter: ["class"] });
  $("#qrDownload").addEventListener("click", () => {
    const u = qrDataUrl(); if (!u) return;
    const a = document.createElement("a"); a.href = u; a.download = "managr-website-qr.png"; a.click();
  });
  $("#qrShare").addEventListener("click", () => waShare("Scan to visit " + BUSINESS + "\n" + fullUrlHttps()));

  // dev
  $("#devToggle").addEventListener("click", () => $("#dev").classList.toggle("is-open"));
  $("#devReset").addEventListener("click", () => { try { localStorage.removeItem("managr_web_proto"); } catch (e) {} location.reload(); });
  $$('[data-state]').forEach((i) => i.addEventListener("change", () => {
    S[i.getAttribute("data-state")] = i.checked;
    if (i.getAttribute("data-state") === "approved" && !i.checked) { S.claimed = false; }
    save();
    const cur = $("#dev [data-devscreen].is-current");
    renderWebsiteHome($("#whSteady"), {}); renderWebsiteHome($("#whEmpty"), { publishedView: false });
    if (cur) showScreen(cur.getAttribute("data-devscreen"));
  }));

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSheets(); closeNav(); } });

  /* ---------- boot -------------------------------------- */
  buildDev();
  $$('[data-visitor-preview]').forEach((n) => fillPreview(n, n.getAttribute("data-visitor-preview")));
  const boot = (S.screen && validFor(S.screen)) ? S.screen : computeDefault();
  showScreen(boot);

  // keep mini/sample previews fresh when info changes via steady edit
  window.addEventListener("focus", () => $$('[data-visitor-preview]').forEach((n) => fillPreview(n, n.getAttribute("data-visitor-preview"))));
})();
