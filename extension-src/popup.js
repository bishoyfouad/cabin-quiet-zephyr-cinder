const statusEl = document.getElementById("status");
const metaEl = document.getElementById("meta");
const pageEl = document.getElementById("page");
const oosEl = document.getElementById("oos");
const maxEl = document.getElementById("max");
const mdBtn = document.getElementById("md");
const csvBtn = document.getElementById("csv");

let poll = 0;

function blocked(url) {
  return !url || /^(chrome|edge|about|devtools|view-source|chrome-extension):/i.test(url) || url.startsWith("https://chromewebstore.google.com") || url.startsWith("https://chrome.google.com/webstore");
}

async function tab() {
  const [current] = await chrome.tabs.query({ active: true, currentWindow: true });
  return current;
}

async function send(msg) {
  const current = await tab();
  if (!current?.id || blocked(current.url || "")) {
    throw new Error("This page is blocked. Open a normal product listing first.");
  }
  pageEl.textContent = current.url || current.title || "This tab";
  try {
    return await chrome.tabs.sendMessage(current.id, msg);
  } catch {
    await chrome.scripting.executeScript({ target: { tabId: current.id }, files: ["content.js"] });
    return chrome.tabs.sendMessage(current.id, msg);
  }
}

function paint(state) {
  if (!state) return;
  statusEl.textContent = state.error || state.status || "Ready.";
  const bits = [];
  if (state.platform) bits.push(state.platform);
  if (typeof state.count === "number") bits.push(state.count + " shown");
  if (typeof state.soldOut === "number") bits.push(state.soldOut + " sold out");
  if (state.pages) bits.push(state.pages + " pages");
  if (state.learned?.length) bits.push("learned " + state.learned.join(", "));
  metaEl.textContent = bits.join(" · ");
  const hasRows = (state.count || 0) > 0;
  mdBtn.disabled = !hasRows;
  csvBtn.disabled = !hasRows;
  if (typeof state.includeOos === "boolean" && document.activeElement !== oosEl) oosEl.checked = state.includeOos;
  if (state.active && !poll) poll = setInterval(() => refresh().catch(() => {}), 800);
  if (!state.active && poll) {
    clearInterval(poll);
    poll = 0;
  }
}

async function refresh() {
  const state = await send({ type: "GET" });
  paint(state);
}

async function save(format) {
  const state = await send({ type: "EXPORT", format });
  paint(state);
  if (!state?.file?.text) return;
  const blob = new Blob([state.file.text], { type: state.file.mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    await chrome.downloads.download({ url, filename: state.file.name, saveAs: false });
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.download = state.file.name;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

document.getElementById("scrape").addEventListener("click", async () => {
  statusEl.textContent = "Reading this page…";
  try {
    paint(await send({ type: "SCRAPE", includeOos: oosEl.checked }));
  } catch (err) {
    statusEl.textContent = err.message || String(err);
  }
});

document.getElementById("crawl").addEventListener("click", async () => {
  statusEl.textContent = "Starting crawl…";
  try {
    paint(await send({ type: "CRAWL", includeOos: oosEl.checked, maxPages: Number(maxEl.value) || 8 }));
  } catch (err) {
    statusEl.textContent = err.message || String(err);
  }
});

document.getElementById("stop").addEventListener("click", async () => {
  try {
    paint(await send({ type: "STOP" }));
  } catch (err) {
    statusEl.textContent = err.message || String(err);
  }
});

oosEl.addEventListener("change", async () => {
  try {
    paint(await send({ type: "OPTIONS", includeOos: oosEl.checked }));
  } catch {
    /* page not ready */
  }
});

mdBtn.addEventListener("click", () => save("md").catch((err) => (statusEl.textContent = err.message || String(err))));
csvBtn.addEventListener("click", () => save("csv").catch((err) => (statusEl.textContent = err.message || String(err))));

refresh().catch((err) => {
  statusEl.textContent = err.message || "Open a product listing, then scrape or crawl.";
});
