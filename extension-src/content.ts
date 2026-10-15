import {
  detectAdvance,
  findClickNext,
  findLoadMore,
  mergeListings,
  scrapePage,
  toCsv,
  toMarkdown,
} from "../src/lib/scraper/engine";
import type { Listing, OosModel } from "../src/lib/scraper/types";

const KEY = "odsJob";

type Job = {
  active: boolean;
  includeOos: boolean;
  maxPages: number;
  pages: number;
  items: Listing[];
  model: OosModel | null;
  platform: string;
  soldOut: number;
  skipped: number;
  learned: string[];
  blueprint: string;
  source: string;
  status: string;
  visited: string[];
  host: string;
  pending: string;
  ownerTab: number | null;
};

type InMsg =
  | { type: "GET" }
  | { type: "SCRAPE"; includeOos: boolean }
  | { type: "CRAWL"; includeOos: boolean; maxPages: number }
  | { type: "STOP" }
  | { type: "SHOW" }
  | { type: "OPTIONS"; includeOos: boolean }
  | { type: "EXPORT"; format: "md" | "csv" };

declare const chrome: {
  runtime: {
    lastError?: { message?: string };
    sendMessage: (msg: unknown, cb?: (res: { tabId?: number | null }) => void) => void;
    onMessage: {
      addListener: (
        fn: (msg: InMsg, sender: unknown, sendResponse: (res: unknown) => void) => boolean,
      ) => void;
    };
  };
  storage: {
    session: {
      get: (key: string) => Promise<Record<string, Job | undefined>>;
      set: (items: Record<string, Job>) => Promise<void>;
    };
  };
};

function blank(): Job {
  return {
    active: false,
    includeOos: false,
    maxPages: 8,
    pages: 0,
    items: [],
    model: null,
    platform: "",
    soldOut: 0,
    skipped: 0,
    learned: [],
    blueprint: "",
    source: "",
    status: "Idle. Open a product listing, then scrape or crawl.",
    visited: [],
    host: "",
    pending: "",
    ownerTab: null,
  };
}

let job = blank();
let generation = 0;
let stopRequested = false;
let hostEl: HTMLElement | null = null;
let collapsed = false;

function storageOn(): boolean {
  try {
    return typeof chrome !== "undefined" && !!chrome.storage?.session;
  } catch {
    return false;
  }
}

function shownItems(): Listing[] {
  return job.includeOos ? job.items : job.items.filter((it) => !it.oos);
}

function publicState(file?: { name: string; text: string; mime: string }) {
  const rows = shownItems();
  return {
    ok: true,
    active: job.active,
    status: job.status,
    platform: job.platform,
    count: rows.length,
    soldOut: job.items.filter((it) => it.oos).length,
    includeOos: job.includeOos,
    maxPages: job.maxPages,
    pages: job.pages,
    pageUrl: location.href,
    host: location.hostname,
    blueprint: job.blueprint,
    learned: job.learned.slice(0, 8),
    file,
  };
}

async function persist() {
  if (!storageOn()) return;
  try {
    await chrome.storage.session.set({ [KEY]: job });
  } catch {
    /* quota or disabled storage */
  }
}

function whoAmI(): Promise<number | null> {
  if (!storageOn()) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: "WHO" }, (res) => {
        if (chrome.runtime.lastError) resolve(null);
        else resolve(typeof res?.tabId === "number" ? res.tabId : null);
      });
    } catch {
      resolve(null);
    }
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fileBase(): string {
  const host = (job.host || location.hostname || "listings").replace(/[^\w.-]+/g, "_");
  return "open-data-scraper-" + host;
}

function exportText(format: "md" | "csv") {
  const rows = shownItems();
  if (format === "csv") {
    return { name: fileBase() + ".csv", text: toCsv(rows), mime: "text/csv" };
  }
  return {
    name: fileBase() + ".md",
    text: toMarkdown(rows, job.source || location.href, job.platform || "listings", job.model),
    mime: "text/markdown",
  };
}

function triggerDownload(name: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.documentElement.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function applyResult(res: ReturnType<typeof scrapePage>, addedBase: number) {
  job.items = mergeListings(job.items, res.items).slice(0, 2000);
  job.model = res.model;
  if (res.platform) job.platform = res.platform;
  if (res.blueprint?.note) job.blueprint = res.blueprint.note;
  for (const token of res.learned) {
    if (!job.learned.includes(token)) job.learned.push(token);
  }
  job.skipped = res.skippedZone;
  job.soldOut = job.items.filter((it) => it.oos).length;
  return job.items.length - addedBase;
}

function showPanel() {
  if (hostEl) return;
  hostEl = document.createElement("div");
  hostEl.id = "open-data-scraper-root";
  hostEl.style.cssText = "all: initial; position: fixed; z-index: 2147483646; right: 16px; bottom: 16px;";
  const shadow = hostEl.attachShadow({ mode: "open" });
  shadow.innerHTML = PANEL_HTML;
  shadow.getElementById("toggle")?.addEventListener("click", () => {
    collapsed = !collapsed;
    render();
  });
  shadow.getElementById("hide")?.addEventListener("click", () => {
    hostEl?.remove();
    hostEl = null;
  });
  shadow.getElementById("stop")?.addEventListener("click", () => stop());
  shadow.getElementById("md")?.addEventListener("click", () => {
    const file = exportText("md");
    triggerDownload(file.name, file.text, file.mime);
  });
  shadow.getElementById("csv")?.addEventListener("click", () => {
    const file = exportText("csv");
    triggerDownload(file.name, file.text, file.mime);
  });
  shadow.getElementById("oos")?.addEventListener("change", (event) => {
    job.includeOos = (event.target as HTMLInputElement).checked;
    void persist();
    render();
  });
  document.documentElement.appendChild(hostEl);
  render();
}

function render() {
  if (!hostEl?.shadowRoot) return;
  const root = hostEl.shadowRoot;
  const rows = shownItems();
  const toggle = root.getElementById("toggle");
  const body = root.getElementById("body");
  const status = root.getElementById("status");
  const meta = root.getElementById("meta");
  const list = root.getElementById("rows");
  const oos = root.getElementById("oos") as HTMLInputElement | null;
  if (toggle) toggle.textContent = "Open Data Scraper" + (rows.length ? " · " + rows.length : "");
  if (body) body.hidden = collapsed;
  if (status) status.textContent = job.status;
  if (meta) {
    const bits = [job.platform || "this page", rows.length + " shown", job.soldOut + " sold out"];
    if (job.blueprint) bits.push(job.blueprint);
    if (job.learned.length) bits.push("learned " + job.learned.slice(0, 4).join(", "));
    meta.textContent = bits.join(" · ");
  }
  if (oos) oos.checked = job.includeOos;
  if (list) {
    list.replaceChildren();
    const slice = rows.slice(0, 40);
    if (!slice.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No rows yet.";
      list.appendChild(empty);
    } else {
      for (const it of slice) {
        const row = document.createElement("div");
        row.className = "row";
        const title = document.createElement("div");
        title.className = "title";
        title.textContent = it.title;
        const price = document.createElement("div");
        price.className = "price";
        price.textContent = it.price;
        const stock = document.createElement("div");
        stock.className = it.oos ? "stock sold" : "stock";
        stock.textContent = it.oos ? "Sold out" : "In stock";
        row.append(title, price, stock);
        list.appendChild(row);
      }
      if (rows.length > slice.length) {
        const more = document.createElement("p");
        more.className = "empty";
        more.textContent = "+" + (rows.length - slice.length) + " more in the export";
        list.appendChild(more);
      }
    }
  }
}

function stop() {
  generation += 1;
  stopRequested = true;
  job.active = false;
  job.pending = "";
  if (!/stopped$/.test(job.status)) job.status += " · stopped";
  void persist();
  showPanel();
  render();
}

async function scrapeOnce(includeOos: boolean) {
  generation += 1;
  stopRequested = false;
  job = blank();
  job.includeOos = includeOos;
  job.host = location.hostname;
  job.source = location.href;
  job.ownerTab = await whoAmI();
  const res = scrapePage(document, location.hostname, null, true);
  applyResult(res, 0);
  job.pages = 1;
  job.visited = [location.href];
  job.active = false;
  const n = shownItems().length;
  job.status =
    (job.platform || "page") +
    " · " +
    n +
    " shown · " +
    job.soldOut +
    " sold out · " +
    job.skipped +
    " upsell rows skipped";
  await persist();
  showPanel();
  collapsed = false;
  render();
  return publicState();
}

async function loop(gen: number) {
  let stagnant = 0;
  while (gen === generation && !stopRequested && job.active && job.pages < job.maxPages) {
    if (job.host && location.hostname !== job.host) {
      job.status = "Stopped. This tab is no longer " + job.host + ".";
      break;
    }
    const before = job.items.length;
    let res;
    try {
      res = scrapePage(document, location.hostname, job.model, true);
    } catch (err) {
      job.status = "Scrape failed: " + (err instanceof Error ? err.message : String(err));
      break;
    }
    const added = applyResult(res, before);
    job.pages += 1;
    if (!job.visited.includes(location.href)) job.visited.push(location.href);
    const advance = detectAdvance(document);
    job.status =
      "Page " + job.pages + " · +" + added + " · " + shownItems().length + " shown · " + (job.platform || "page");
    await persist();
    render();
    if (gen !== generation || stopRequested) return;
    if (advance.kind === "done") {
      job.status += " · end of listing";
      break;
    }
    if (job.pages >= job.maxPages) {
      job.status += " · page limit";
      break;
    }
    if (advance.kind === "next") {
      let abs = "";
      try {
        abs = new URL(advance.href, location.href).href;
      } catch {
        abs = "";
      }
      if (!abs || job.visited.includes(abs)) {
        job.status += " · next page already seen";
        break;
      }
      job.pending = abs;
      job.active = true;
      await persist();
      location.assign(abs);
      return;
    }
    if (added === 0) stagnant += 1;
    else stagnant = 0;
    if (stagnant >= 2) {
      job.status += " · no new rows";
      break;
    }
    const hrefBefore = location.href;
    if (advance.kind === "load-more") findLoadMore(document)?.click();
    else if (advance.kind === "click-next") findClickNext(document)?.click();
    else window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(1500);
    if (gen !== generation) return;
    if (location.href !== hrefBefore) {
      job.pending = location.href;
      await persist();
    }
  }
  if (gen !== generation) return;
  job.active = false;
  job.pending = "";
  if (stopRequested && !/stopped$/.test(job.status)) job.status += " · stopped";
  await persist();
  render();
}

async function startCrawl(includeOos: boolean, maxPages: number) {
  const gen = ++generation;
  stopRequested = false;
  job = blank();
  job.active = true;
  job.includeOos = includeOos;
  job.maxPages = Math.max(1, Math.min(30, maxPages || 8));
  job.host = location.hostname;
  job.source = location.href;
  job.ownerTab = await whoAmI();
  job.status = "Crawling…";
  await persist();
  showPanel();
  collapsed = false;
  render();
  await loop(gen);
  return publicState();
}

async function onMessage(msg: InMsg) {
  if (!msg || typeof msg !== "object") return publicState();
  if (msg.type === "GET") return publicState();
  if (msg.type === "SHOW") {
    showPanel();
    collapsed = false;
    render();
    return publicState();
  }
  if (msg.type === "OPTIONS") {
    job.includeOos = !!msg.includeOos;
    await persist();
    render();
    return publicState();
  }
  if (msg.type === "STOP") {
    stop();
    return publicState();
  }
  if (msg.type === "SCRAPE") return scrapeOnce(!!msg.includeOos);
  if (msg.type === "CRAWL") return startCrawl(!!msg.includeOos, msg.maxPages);
  if (msg.type === "EXPORT") return publicState(exportText(msg.format === "csv" ? "csv" : "md"));
  return publicState();
}

const PANEL_CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.panel {
  width: min(380px, calc(100vw - 32px));
  max-height: min(70vh, 560px);
  display: flex;
  flex-direction: column;
  background: #1b1d18;
  color: #f3f1ea;
  border: 1px solid #31342c;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0,0,0,.35);
  font: 13px/1.4 "Segoe UI", sans-serif;
  overflow: hidden;
}
header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #24271f;
}
#toggle, #hide, button.act {
  font: inherit;
  color: #f3f1ea;
  background: transparent;
  border: 1px solid #31342c;
  border-radius: 8px;
  min-height: 36px;
  padding: 0 10px;
  cursor: pointer;
}
#toggle { flex: 1; text-align: left; font-weight: 600; }
#body { display: flex; flex-direction: column; gap: 8px; padding: 10px; min-height: 0; }
#body[hidden] { display: none; }
#status { margin: 0; color: #d7dece; }
#meta { margin: 0; color: #a3a79a; font-size: 12px; }
label { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.actions { display: flex; gap: 6px; }
.actions button { flex: 1; }
#rows { overflow: auto; max-height: 280px; display: flex; flex-direction: column; border-top: 1px solid #31342c; }
.row { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; padding: 8px 0; border-bottom: 1px solid #31342c; }
.title { color: #f3f1ea; }
.price { color: #d7dece; white-space: nowrap; }
.stock { color: #9cb48a; white-space: nowrap; font-size: 12px; }
.stock.sold { color: #d27a68; }
.empty { margin: 8px 0; color: #73786c; }
`;

const PANEL_HTML = `
<style>${PANEL_CSS}</style>
<section class="panel" role="region" aria-label="Open Data Scraper">
  <header>
    <button id="toggle" type="button">Open Data Scraper</button>
    <button id="hide" type="button">Hide</button>
  </header>
  <div id="body">
    <p id="status"></p>
    <p id="meta"></p>
    <label>Include sold-out rows <input id="oos" type="checkbox" /></label>
    <div class="actions">
      <button id="stop" class="act" type="button">Stop</button>
      <button id="md" class="act" type="button">Markdown</button>
      <button id="csv" class="act" type="button">CSV</button>
    </div>
    <div id="rows"></div>
  </div>
</section>
`;

function snapshot() {
  const res = scrapePage(document, location.hostname, null, true);
  return {
    platform: res.platform,
    titles: res.items.map((it) => it.title),
    prices: res.items.map((it) => it.price),
    oos: res.items.filter((it) => it.oos).map((it) => it.title),
    soldOut: res.soldOut,
    skipped: res.skippedZone,
    advance: detectAdvance(document).kind,
    learned: res.learned,
  };
}

const root = globalThis as unknown as { __ods?: { snapshot: typeof snapshot }; __odsBooted?: boolean };
root.__ods = { snapshot };

function listen() {
  if (!storageOn() || !chrome.runtime?.onMessage) return;
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    onMessage(msg)
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) }));
    return true;
  });
}

async function boot() {
  if (root.__odsBooted) return;
  root.__odsBooted = true;
  listen();
  if (!storageOn()) return;
  try {
    const bag = await chrome.storage.session.get(KEY);
    if (bag[KEY]) job = { ...blank(), ...bag[KEY] };
  } catch {
    return;
  }
  if (!job.active || job.host !== location.hostname) return;
  const tabId = await whoAmI();
  if (job.ownerTab != null && tabId != null && job.ownerTab !== tabId) return;
  showPanel();
  const gen = ++generation;
  await loop(gen);
}

void boot().catch(() => {
  /* never break the host page */
});
