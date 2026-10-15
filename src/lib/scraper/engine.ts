import { cleanPrice, looksPrice, norm, PRICE_RE } from "./price";
import type { Blueprint, Listing, OosModel, ScrapeResult } from "./types";

const PRICE_HINT =
  '[class*="price" i], [class*="amount" i], [class*="money" i], [class*="cost" i], [itemprop="price"], [data-price], [data-price-amount]';

const HIJACK_SEL =
  '[class*="recommend" i],[id*="recommend" i],[class*="upsell" i],[class*="up-sell" i],[class*="related" i],[id*="related" i],[class*="recently" i],[class*="cross-sell" i],[class*="crosssell" i],[class*="also-like" i],[class*="you-may" i],[class*="wishlist" i],[data-recommendations]';

const OOS_WORDS = [
  "outofstock", "soldout", "unavailable", "notavailable", "discontinued", "currentlyunavailable",
  "agotado", "epuise", "ausverkauft", "esaurito", "غيرمتوفر", "غيرمتاح", "نفذ", "نفد", "نفدت",
  "مباع", "soldout", "comingsoon",
];

const OOS_RE = new RegExp(OOS_WORDS.join("|"), "i");
const HARD_OOS = /^(outofstock|out-of-stock|out_of_stock|soldout|sold-out|unavailable|discontinued)$/i;
const HARD_IN = /^(instock|in-stock|in_stock|available|orderable|backorder|preorder|lowstock)$/i;
const BUY_RE = /(addtocart|addtobag|buynow|buyitnow|اطلب|اضف|السلة|اشتري|شراء)/i;

const TITLE_SELS = [
  "[itemprop='name']",
  "h2 a",
  "h3 a",
  "h4 a",
  "h2",
  "h3",
  "h4",
  ".product-title a",
  ".name a",
  "a[href]",
];

type Raw = Listing & { card: Element | null; tokens: string[]; hardOos: boolean; hardIn: boolean; score: number };

function qsAll(root: ParentNode, sel: string): Element[] {
  try {
    return Array.from(root.querySelectorAll(sel));
  } catch {
    return [];
  }
}

function qs(root: ParentNode, sel: string): Element | null {
  try {
    return root.querySelector(sel);
  } catch {
    return null;
  }
}

function textOf(el: Element | null): string {
  return el ? norm(el.textContent) : "";
}

function keyOf(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064b-\u0652\u0640]/g, "")
    .replace(/[^0-9a-z\u00c0-\uffff]+/g, "");
}

function junkTitle(t: string): boolean {
  t = norm(t);
  if (t.length < 4 || t.length > 240) return true;
  if (looksPrice(t) || /^[\d\s./-]+$/.test(t)) return true;
  if (/^(add to cart|buy now|sold out|out of stock|view|shop now|next|previous)$/i.test(t)) return true;
  return false;
}

export function inHijackZone(el: Element | null): boolean {
  if (!el || !el.closest) return false;
  try {
    const m = el.closest(HIJACK_SEL);
    if (!m || m === document.body || m === document.documentElement) return false;
    return true;
  } catch {
    return false;
  }
}

function inChrome(el: Element | null): boolean {
  if (!el?.closest) return false;
  try {
    return !!el.closest("header, nav, footer, [role='navigation'], .site-header");
  } catch {
    return false;
  }
}

function classTokens(el: Element): string[] {
  const raw = typeof el.className === "string" ? el.className : el.getAttribute("class") || "";
  return raw.split(/\s+/).filter((c) => c && c.length < 40);
}

function evidence(card: Element): { score: number; hardOos: boolean; hardIn: boolean; why: string[]; tokens: string[] } {
  let score = 0;
  let hardOos = false;
  let hardIn = false;
  const why: string[] = [];
  const tokens = new Set<string>();

  const nodes: Element[] = [card, ...qsAll(card, "*").slice(0, 180)];
  for (const el of nodes) {
    for (const tok of classTokens(el)) tokens.add(tok);
    for (const attr of Array.from(el.attributes)) {
      const n = attr.name.toLowerCase();
      const v = attr.value.trim();
      const kv = keyOf(v);
      if (n === "data-inventory-status" || n === "data-stock-status") {
        if (HARD_IN.test(kv)) hardIn = true;
        if (/^(outofstock|soldout|unavailable|nostock)$/.test(kv)) {
          hardOos = true;
          score += 4;
          why.push("@" + n);
        }
      }
      if ((n === "class" || n === "id") && HARD_OOS.test(v)) {
        hardOos = true;
        score += 4;
        why.push(n + '="' + v + '"');
      }
      if ((n === "class" || n === "id") && HARD_IN.test(v)) hardIn = true;
      if (/schema\.org\/InStock/i.test(v)) hardIn = true;
      if (/schema\.org\/OutOfStock/i.test(v)) {
        hardOos = true;
        score += 3;
        why.push("schema.org");
      }
    }
  }

  const badges = qsAll(card, "span,div,p,b,strong,em,small,button,a");
  for (const el of badges) {
    if (el.children.length > 3) continue;
    const t = textOf(el);
    if (!t || t.length > 48) continue;
    const k = keyOf(t);
    if (OOS_RE.test(k) || /soldout|outofstock|unavailable|نفذ|غيرمتوفر|comingsoon/.test(k)) {
      hardOos = true;
      score += 3;
      why.push('badge "' + t.slice(0, 32) + '"');
      break;
    }
  }

  const buys = qsAll(card, "a,button,[role='button']");
  for (const el of buys) {
    const label = keyOf(
      [el.getAttribute("aria-label") || "", textOf(el), typeof el.className === "string" ? el.className : ""].join(" "),
    );
    if (!label) continue;
    if (OOS_RE.test(label) || /soldout|outofstock/.test(label)) {
      hardOos = true;
      score += 3;
      why.push("buy control says sold out");
      break;
    }
    if (BUY_RE.test(label)) {
      const disabled =
        (el as HTMLButtonElement).disabled ||
        el.getAttribute("aria-disabled") === "true" ||
        /(^|[\s_-])disabled([\s_-]|$)/i.test(typeof el.className === "string" ? el.className : "");
      if (disabled) {
        score += 2;
        why.push("add to cart disabled");
      }
    }
  }

  if (qs(card, '[class*="waitlist" i], input[name*="notify" i]')) {
    hardOos = true;
    score += 3;
    why.push("notify / waitlist");
  }

  return { score, hardOos, hardIn, why: why.slice(0, 4), tokens: Array.from(tokens) };
}

function listing(partial: Partial<Listing> & { title: string; card: Element | null }): Raw {
  const ev = partial.card ? evidence(partial.card) : { score: 0, hardOos: false, hardIn: false, why: [], tokens: [] };
  const oos = partial.oos || (!ev.hardIn && (ev.hardOos || ev.score >= 2));
  return {
    title: partial.title,
    price: partial.price || "N/A",
    oos,
    url: partial.url || "",
    rating: partial.rating || "",
    reviews: partial.reviews || "",
    why: partial.why || ev.why.join("; "),
    card: partial.card,
    tokens: ev.tokens,
    hardOos: ev.hardOos || !!partial.oos,
    hardIn: ev.hardIn,
    score: ev.score,
  };
}

function unique(items: Raw[]): Raw[] {
  const map = new Map<string, Raw>();
  const out: Raw[] = [];
  for (const it of items) {
    const k = (it.url || it.title).toLowerCase();
    const prev = map.get(k);
    if (prev) {
      if (it.oos) prev.oos = true;
      if (!prev.rating && it.rating) prev.rating = it.rating;
      if (!prev.reviews && it.reviews) prev.reviews = it.reviews;
      if (!prev.why && it.why) prev.why = it.why;
      continue;
    }
    map.set(k, it);
    out.push(it);
  }
  return out;
}

function findTitleEl(card: Element): Element | null {
  for (const sel of TITLE_SELS) {
    const el = qs(card, sel);
    if (el && !junkTitle(textOf(el))) return el;
  }
  const img = card.querySelector("img[alt]");
  if (img && !junkTitle(norm(img.getAttribute("alt")))) return img;
  return null;
}

function findPriceEl(card: Element): Element | null {
  for (const el of qsAll(card, PRICE_HINT)) {
    if (looksPrice(textOf(el))) return el;
    const attr = el.getAttribute("content") || el.getAttribute("data-price") || el.getAttribute("data-price-amount");
    if (attr && looksPrice(attr)) return el;
  }
  for (const el of qsAll(card, "span,div,p,b,strong,small")) {
    if (el.childElementCount > 3) continue;
    const t = textOf(el);
    if (t.length <= 56 && looksPrice(t)) return el;
  }
  return null;
}

function priceFrom(el: Element | null, fallbackRoot?: Element | null): string {
  if (el) {
    const t = textOf(el);
    if (looksPrice(t)) return cleanPrice(t);
    const attr = el.getAttribute("content") || el.getAttribute("data-price") || el.getAttribute("data-price-amount");
    if (attr && looksPrice(attr)) return cleanPrice(attr);
  }
  if (fallbackRoot) {
    const t = textOf(fallbackRoot);
    if (looksPrice(t)) return cleanPrice(t);
  }
  return "N/A";
}

function hrefOf(el: Element | null): string {
  if (!el) return "";
  if (el.tagName === "A") return (el as HTMLAnchorElement).href || el.getAttribute("href") || "";
  const a = el.querySelector("a[href]");
  return a ? (a as HTMLAnchorElement).href || a.getAttribute("href") || "" : "";
}

function skipCard(el: Element): boolean {
  return inHijackZone(el) || inChrome(el);
}

function scrapeAmazon(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  for (const card of qsAll(root, 'div[data-asin]:not([data-asin=""])')) {
    if (skipCard(card)) continue;
    const hidden = card.closest(".a-carousel-card");
    if (hidden?.getAttribute("aria-hidden") === "true") continue;
    const titleNode = qs(card, "h2 span, h2, .a-size-medium");
    const title = textOf(titleNode);
    if (junkTitle(title)) continue;
    const off = qs(card, ".a-price .a-offscreen");
    let rating = "";
    let reviews = "";
    const alt = qs(card, ".a-icon-alt");
    const rm = textOf(alt).match(/\d+(?:[.,]\d+)?/);
    if (rm) rating = rm[0].replace(",", ".");
    for (const a of qsAll(card, "a[aria-label]")) {
      const l = a.getAttribute("aria-label") || "";
      if (/out of 5|stars/i.test(l)) continue;
      const m = l.match(/^\s*([\d.,]+)/);
      if (m) {
        reviews = m[1];
        break;
      }
    }
    items.push(listing({ title, price: priceFrom(off, card), card, url: hrefOf(card), rating, reviews }));
  }
  return unique(items);
}

function scrapeNoon(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  let cards = qsAll(root, '[data-qa="plp-grid"] [data-qa="plp-product-box"]');
  if (!cards.length) cards = qsAll(root, '[data-qa="plp-product-box"]');
  for (const card of cards) {
    if (skipCard(card)) continue;
    const titleEl = qs(card, '[data-qa="plp-product-box-name"], [data-qa$="product-box-name"]');
    const title = norm((titleEl && (titleEl.getAttribute("title") || titleEl.textContent)) || "");
    if (junkTitle(title)) continue;
    const box = qs(card, '[data-qa="plp-product-box-price"], [data-qa$="product-box-price"]');
    let price = "N/A";
    if (box) {
      const cur = qs(box, '[class*="currency"]');
      const amt = qs(box, '[class*="amount"]');
      if (amt) price = cleanPrice((cur ? textOf(cur) + " " : "") + textOf(amt));
      else if (looksPrice(textOf(box))) price = cleanPrice(textOf(box));
    }
    items.push(listing({ title, price, card, url: hrefOf(card) }));
  }
  return unique(items);
}

function scrapeDubaiPhone(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  for (const card of qsAll(root, "article.nf-product-card, .nf-product-card")) {
    if (skipCard(card)) continue;
    const titleEl = qs(card, ".dp-product-title, h3, a[href]");
    const title = textOf(titleEl);
    if (junkTitle(title)) continue;
    let price = "N/A";
    const numEl = qsAll(card, '[class*="tabular-nums"]').find((e) => /^[\d٠-٩][\d,.٠-٩\s]*$/.test(textOf(e)));
    if (numEl) {
      const row = numEl.closest("div");
      const rowText = textOf(row);
      price = looksPrice(rowText) ? cleanPrice(rowText) : textOf(numEl);
    }
    const row = listing({ title, price, card, url: hrefOf(card) });
    if (price === "N/A") {
      row.oos = true;
      row.hardOos = true;
      row.why = row.why ? row.why + "; no price (coming soon)" : "no price (coming soon)";
    }
    items.push(row);
  }
  return unique(items);
}

function scrapeShopify(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  const cards = qsAll(
    root,
    ".product-card, [data-product-card], .card-wrapper, .grid-product, .product-item, .t4s-product",
  );
  for (const card of cards) {
    if (skipCard(card)) continue;
    const titleEl = qs(card, ".product-card__title, .card__heading, h3, h2, a[href*='/products/']");
    const title = textOf(titleEl);
    if (junkTitle(title)) continue;
    const priceEl = qs(card, ".price-item--sale, .price, .money, .product-card__price");
    let price = priceFrom(priceEl);
    const was = qs(card, "s, del, .price-item--compare");
    if (was && looksPrice(textOf(was))) price += " (was " + cleanPrice(textOf(was)) + ")";
    items.push(listing({ title, price, card, url: hrefOf(titleEl) || hrefOf(card) }));
  }
  return unique(items);
}

function scrapeWoo(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  for (const card of qsAll(root, "li.product, ul.products li.product, .product.type-product")) {
    if (skipCard(card)) continue;
    const titleEl = qs(card, ".woocommerce-loop-product__title a, .woocommerce-loop-product__title, h2 a, h2");
    const title = textOf(titleEl);
    if (junkTitle(title)) continue;
    const neu = qs(card, "ins .woocommerce-Price-amount, ins .amount");
    const old = qs(card, "del .woocommerce-Price-amount, del .amount");
    const normal = qs(card, ".woocommerce-Price-amount, .amount, .price");
    let price = priceFrom(neu || normal);
    if (neu && old && looksPrice(textOf(old))) price += " (was " + cleanPrice(textOf(old)) + ")";
    items.push(listing({ title, price, card, url: hrefOf(card) }));
  }
  return unique(items);
}

function scrapeSharaf(root: ParentNode): Raw[] {
  return scrapeGeneric(root, ".ais-Hits-item, .ais-InfiniteHits-item");
}

function scrapeDubizzle(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  for (const card of qsAll(root, 'li[aria-label="Listing"]')) {
    if (skipCard(card)) continue;
    const titleEl = qs(card, '[aria-label="Title"]');
    const title = textOf(titleEl);
    if (junkTitle(title)) continue;
    const box = qs(card, '[aria-label="Price"]');
    items.push(listing({ title, price: priceFrom(box), card, url: hrefOf(card) }));
  }
  return unique(items);
}

function scrapeSigma(root: ParentNode): Raw[] {
  const items: Raw[] = [];
  for (const a of qsAll(root, 'a.line-clamp-2[href*="/item?id="], a[href*="/item?id="]')) {
    if (skipCard(a)) continue;
    const title = textOf(a);
    if (junkTitle(title)) continue;
    const card = a.closest(".rounded-2xl") || a.parentElement?.parentElement || a;
    if (card !== a && skipCard(card)) continue;
    items.push(
      listing({
        title,
        price: priceFrom(findPriceEl(card)),
        card,
        url: (a as HTMLAnchorElement).href || a.getAttribute("href") || "",
      }),
    );
  }
  return unique(items);
}

function scrapeGeneric(root: ParentNode, sel: string): Raw[] {
  const items: Raw[] = [];
  for (const card of qsAll(root, sel)) {
    if (skipCard(card)) continue;
    const titleEl = findTitleEl(card);
    const title = titleEl?.tagName === "IMG" ? norm(titleEl.getAttribute("alt")) : textOf(titleEl);
    if (junkTitle(title)) continue;
    items.push(listing({ title, price: priceFrom(findPriceEl(card)), card, url: hrefOf(titleEl) || hrefOf(card) }));
  }
  return unique(items);
}

function scrapeJsonLd(root: ParentNode): { title: string; price: string; oos: boolean }[] {
  const items: { title: string; price: string; oos: boolean }[] = [];
  const walk = (node: unknown) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node !== "object") return;
    const rec = node as Record<string, unknown>;
    const t = rec["@type"];
    const type = (typeof t === "string" ? t : Array.isArray(t) ? t.join(",") : "").toLowerCase();
    if (type.includes("product") && typeof rec.name === "string" && !junkTitle(rec.name)) {
      const offers = Array.isArray(rec.offers) ? rec.offers : rec.offers ? [rec.offers] : [];
      let price = "N/A";
      let oos = false;
      for (const o of offers) {
        if (!o || typeof o !== "object") continue;
        const offer = o as Record<string, unknown>;
        const av = String(offer.availability || "");
        if (/outofstock|soldout|discontinued/i.test(av)) oos = true;
        const p = offer.price ?? offer.lowPrice;
        if (p != null && price === "N/A") {
          price = (offer.priceCurrency ? String(offer.priceCurrency) + " " : "") + String(p);
        }
      }
      if (/outofstock|soldout/i.test(String(rec.availability || ""))) oos = true;
      items.push({ title: norm(rec.name), price, oos });
    }
    if (rec["@graph"]) walk(rec["@graph"]);
    if (rec.itemListElement) walk(rec.itemListElement);
    if (rec.item) walk(rec.item);
  };
  for (const s of qsAll(root, 'script[type="application/ld+json"], template.jsonld')) {
    const raw = s.tagName === "TEMPLATE" ? (s as HTMLTemplateElement).innerHTML : s.textContent || "";
    try {
      walk(JSON.parse(raw || "null"));
    } catch {
      /* ignore malformed blocks */
    }
  }
  return items;
}

function classSig(el: Element): string {
  const classes = classTokens(el)
    .filter((c) => !/^(flex|grid|block|hidden|relative|absolute)$/i.test(c))
    .filter((c) => !/exhausted|sold|oos|disabled|unavailable|out-of-stock/i.test(c))
    .slice(0, 4)
    .sort();
  return el.tagName.toLowerCase() + (classes.length ? "." + classes.join(".") : "");
}

function compile(root: ParentNode): { items: Raw[]; blueprint: Blueprint | null } {
  const priceEls: Element[] = [];
  for (const el of qsAll(root, PRICE_HINT)) {
    if (looksPrice(textOf(el)) && !inHijackZone(el)) priceEls.push(el);
  }
  if (priceEls.length < 2) {
    for (const el of qsAll(root, "span,div,p,b,strong")) {
      if (el.childElementCount > 3 || inHijackZone(el)) continue;
      const t = textOf(el);
      if (t.length <= 56 && looksPrice(t)) priceEls.push(el);
    }
  }

  type Cluster = { cards: Element[]; score: number; signature: string };
  const clusters: Cluster[] = [];
  const consider = (cards: Element[], signature: string, score: number) => {
    const clean = cards.filter((c) => !skipCard(c));
    if (clean.length < 2) return;
    if (/recommend|upsell|related/i.test(signature)) return;
    clusters.push({ cards: clean, score, signature });
  };

  for (const anchor of priceEls) {
    let node: Element | null = anchor;
    let depth = 0;
    while (node && node !== root && depth < 8) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      const sig = classSig(node);
      const siblings = Array.from(parent.children).filter((c) => c.tagName === node!.tagName && classSig(c) === sig);
      if (siblings.length >= 2) {
        consider(siblings, sig, siblings.length * 4 - depth);
      }
      node = parent;
      depth += 1;
    }
  }

  clusters.sort((a, b) => b.score - a.score);
  const best = clusters[0];
  if (!best) {
    const ld = scrapeJsonLd(root);
    return {
      items: ld.map((x) => listing({ title: x.title, price: looksPrice(x.price) ? cleanPrice(x.price) : x.price, oos: x.oos, card: null, why: x.oos ? "json-ld" : "" })),
      blueprint: ld.length
        ? { card: "", title: "Product.name", price: "Offer.price", note: "JSON-LD Product nodes" }
        : null,
    };
  }

  const titleSels: string[] = [];
  const priceSels: string[] = [];
  for (const c of best.cards) {
    const t = findTitleEl(c);
    if (t) titleSels.push(guessSel(t));
    const p = findPriceEl(c);
    if (p) priceSels.push(guessSel(p));
  }
  const titleSel = mode(titleSels) || "h2, h3, a[href]";
  const priceSel = mode(priceSels) || PRICE_HINT;
  const items: Raw[] = [];
  for (const card of qsAll(root, best.signature.split("|")[0] || best.signature)) {
    if (skipCard(card)) continue;
    if (classSig(card) !== best.signature && !card.matches(best.signature)) continue;
    const titleEl = qs(card, titleSel) || findTitleEl(card);
    const title = titleEl?.tagName === "IMG" ? norm(titleEl.getAttribute("alt")) : textOf(titleEl);
    if (junkTitle(title)) continue;
    const pEl = qs(card, priceSel) || findPriceEl(card);
    items.push(listing({ title, price: priceFrom(pEl), card, url: hrefOf(titleEl) || hrefOf(card) }));
  }
  const applied = unique(items);
  return {
    items: applied,
    blueprint: {
      card: best.signature,
      title: titleSel,
      price: priceSel,
      note: "Compiled from source · " + best.signature + " × " + best.cards.length,
    },
  };
}

function guessSel(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const classes = classTokens(el).slice(0, 2);
  if (classes.length) return tag + "." + classes.join(".");
  if (/^h[1-6]$/.test(tag)) return tag;
  return tag;
}

function mode(values: string[]): string | undefined {
  if (!values.length) return undefined;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  let best = values[0];
  let n = 0;
  for (const [k, c] of counts) {
    if (c > n) {
      best = k;
      n = c;
    }
  }
  return best;
}

export function detectPlatform(root: ParentNode, host: string): string {
  const h = host.toLowerCase();
  if (h.includes("amazon.") || qs(root, "div[data-asin] h2")) return "amazon";
  if (h.includes("noon.com") || qs(root, '[data-qa="plp-product-box"]')) return "noon";
  if (h.includes("dubizzle") || qs(root, 'li[aria-label="Listing"]')) return "dubizzle";
  if (h.includes("sigma-computer") || qsAll(root, 'a[href*="/item?id="]').length >= 2) return "sigma";
  if (h.includes("dubaiphone") || qs(root, ".nf-product-card")) return "dubaiphone";
  if (h.includes("samsung.") || qs(root, ".pd21-product-card__item, .pd21-product-finder")) return "samsung";
  if (h.includes("sharafdg") || qs(root, ".ais-Hits-item, .ais-InfiniteHits-item, .ais-Pagination")) return "sharaf";
  if (h.includes("vodafone") || qs(root, ".vf-product-card, [class*='vf-product']")) return "vodafone";
  if (qs(root, ".yalla-product-card, [data-yalla-product-id]")) return "yalla";
  const view = (root instanceof Document ? root : root.ownerDocument)?.defaultView as
    | (Window & { Shopify?: { shop?: string } })
    | null;
  if (
    view?.Shopify?.shop ||
    qs(root, "meta[name='shopify-checkout-api-token'], script#shopify-features, [data-shopify], .product-card, [data-product-card]")
  )
    return "shopify";
  if (qs(root, ".woocommerce, .woocommerce-loop-product__title, ul.products li.product")) return "woocommerce";
  if (qs(root, "div.product-thumb")) return "opencart";
  if (qs(root, "article.product-miniature")) return "prestashop";
  if (qs(root, "li.product-item, .product-item-info")) return "magento";
  if (qs(root, ".ut2-gl__item")) return "cscart";
  if (qs(root, 'script[type="application/ld+json"], template.jsonld')) return "json-ld";
  return "unknown";
}

const SPEC: Record<string, string> = {
  samsung: ".pd21-product-card__item",
  sharaf: ".ais-Hits-item, .ais-InfiniteHits-item",
  vodafone: ".vf-product-card, [data-product-code]",
  yalla: "article.yalla-product-card, .yalla-product-card",
  opencart: "div.product-thumb, .product-layout",
  prestashop: "article.product-miniature",
  magento: "li.product-item, .product-item-info",
  cscart: ".ut2-gl__item",
};

function collect(root: ParentNode, platform: string): { items: Raw[]; blueprint: Blueprint | null; platform: string } {
  const scrapers: Record<string, () => Raw[]> = {
    amazon: () => scrapeAmazon(root),
    noon: () => scrapeNoon(root),
    dubizzle: () => scrapeDubizzle(root),
    dubaiphone: () => scrapeDubaiPhone(root),
    sigma: () => scrapeSigma(root),
    shopify: () => scrapeShopify(root),
    woocommerce: () => scrapeWoo(root),
    sharaf: () => scrapeSharaf(root),
  };
  let items = scrapers[platform] ? scrapers[platform]() : SPEC[platform] ? scrapeGeneric(root, SPEC[platform]) : [];
  let blueprint: Blueprint | null = null;
  let used = platform;
  if (items.length < 2) {
    const compiled = compile(root);
    if (compiled.items.length > items.length) {
      items = compiled.items;
      blueprint = compiled.blueprint;
      used = compiled.blueprint?.card ? "compiled" : platform === "json-ld" ? "json-ld" : "compiled";
    }
  }
  return { items, blueprint, platform: used };
}

function learn(items: Raw[], host: string, prev: OosModel | null): { model: OosModel | null; fresh: string[] } {
  const conf = items.filter((x) => x.hardOos && !x.hardIn && x.card);
  const ok = items.filter((x) => !x.hardOos && !x.oos && x.card);
  if (conf.length < 2 || ok.length < 2) return { model: prev, fresh: [] };
  const freq = new Map<string, number>();
  const oos = new Map<string, number>();
  const inst = new Map<string, number>();
  for (const x of items) for (const t of x.tokens) freq.set(t, (freq.get(t) || 0) + 1);
  for (const x of conf) for (const t of x.tokens) oos.set(t, (oos.get(t) || 0) + 1);
  for (const x of ok) for (const t of x.tokens) inst.set(t, (inst.get(t) || 0) + 1);
  const rules: string[] = [];
  const neg: string[] = [];
  for (const [t, n] of oos) {
    const oRate = n / conf.length;
    const iRate = (inst.get(t) || 0) / ok.length;
    if (oRate >= 0.6 && iRate <= 0.15 && (freq.get(t) || 0) <= items.length * 0.6 && t.length > 2) rules.push(t);
  }
  for (const [t, n] of inst) {
    if (n / ok.length >= 0.6 && !oos.has(t)) neg.push(t);
  }
  if (prev) {
    for (const t of prev.rules) if (!rules.includes(t)) rules.push(t);
    for (const t of prev.neg) if (!neg.includes(t)) neg.push(t);
  }
  const fresh = rules.filter((t) => !prev?.rules.includes(t));
  if (!rules.length) return { model: prev, fresh: [] };
  return { model: { host, rules, neg }, fresh };
}

function applyModel(items: Raw[], model: OosModel | null) {
  if (!model) return;
  for (const it of items) {
    if (it.hardIn || it.hardOos) continue;
    const hit = it.tokens.some((t) => model.rules.includes(t));
    const neg = it.tokens.some((t) => model.neg.includes(t));
    if (hit) {
      it.score += 2;
      it.oos = true;
      it.why = it.why ? it.why + "; learned marker" : "learned marker " + model.rules.filter((t) => it.tokens.includes(t))[0];
    } else if (neg) {
      it.score -= 1;
    }
    if (!it.hardIn && it.score >= 2) it.oos = true;
  }
}

function applyJsonLd(items: Raw[], root: ParentNode) {
  const ld = scrapeJsonLd(root);
  const forced = new Map<string, boolean>();
  for (const row of ld) {
    const k = keyOf(row.title);
    if (k.length > 6 && row.oos) forced.set(k, true);
  }
  for (const it of items) {
    const k = keyOf(it.title);
    if (k && forced.has(k) && !it.hardIn) {
      it.oos = true;
      it.hardOos = true;
      it.why = it.why ? it.why + "; json-ld availability" : "json-ld availability";
    }
  }
}

export function countSkipped(root: ParentNode): number {
  const sel = [
    ".recommend article",
    ".recommend .product-card",
    ".recommend [data-asin]",
    ".recommend [data-qa='plp-product-box']",
    ".recommend .ais-Hits-item",
    ".recommend li.product",
    ".recommend .nf-product-card",
    ".upsell article",
    "[class*='recommend'] .tile",
    "[class*='related'] .tile",
  ].join(",");
  return qsAll(root, sel).filter((el) => inHijackZone(el)).length;
}

export function scrapePage(root: ParentNode, host: string, prev: OosModel | null, includeOos: boolean): ScrapeResult {
  const detected = detectPlatform(root, host);
  const collected = collect(root, detected);
  applyJsonLd(collected.items, root);
  const learned = learn(collected.items, host, prev);
  applyModel(collected.items, learned.model);
  const soldOut = collected.items.filter((it) => it.oos).length;
  const pool = includeOos ? collected.items : collected.items.filter((it) => !it.oos);
  const items: Listing[] = pool.map((it) => ({
    title: it.title,
    price: it.price,
    oos: it.oos,
    url: it.url,
    rating: it.rating,
    reviews: it.reviews,
    why: it.why,
  }));
  return {
    platform: collected.platform,
    blueprint: collected.blueprint,
    items,
    soldOut,
    skippedZone: countSkipped(root),
    model: learned.model,
    learned: learned.fresh,
  };
}

export function findLoadMore(root: ParentNode): HTMLElement | null {
  const sels = [
    ".s-show-more-results-button input.a-button-input",
    ".s-show-more-results-button",
    ".pd21-product-finder__view-more",
    ".js-pfv2-view-more",
    ".ias-trigger:not(.ias-noneleft)",
    "button.load-more",
    "a.load-more",
    "[data-load-more]:not([data-is-prev])",
    "[data-action='load-more']",
    'button[class*="load-more" i]',
    'a[class*="load-more" i]',
    'button[class*="loadmore" i]',
    'button[class*="view-more" i]',
    'button[class*="show-more" i]',
  ];
  for (const sel of sels) {
    const el = qs(root, sel);
    if (!el || inHijackZone(el) || inChrome(el)) continue;
    if ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true") continue;
    if (el.classList.contains("is-hidden") || el.closest(".aok-hidden, .disabled, .ias-noneleft")) continue;
    return el as HTMLElement;
  }
  return null;
}

export function findNextHref(root: ParentNode): string | null {
  const ais = qs(root, ".ais-Pagination-item--next:not(.ais-Pagination-item--disabled) a[href]");
  if (ais) {
    const href = ais.getAttribute("href");
    if (href && href !== "#" && !/^javascript:/i.test(href)) return href;
  }
  const labeled = qs(
    root,
    'a[rel="next"][href], link[rel="next"][href], a.s-pagination-next[href], a.next.page-numbers[href], a.pagination__next[href], ul.pagination a.next[href], nav.woocommerce-pagination a.next[href], a[aria-label*="التالي"][href]',
  );
  if (!labeled) return null;
  if (labeled.getAttribute("aria-disabled") === "true") return null;
  if (labeled.closest(".disabled, .ais-Pagination-item--disabled")) return null;
  const href = labeled.getAttribute("href");
  if (!href || href === "#" || /^javascript:/i.test(href)) return null;
  return href;
}

export function findClickNext(root: ParentNode): HTMLElement | null {
  const sigma = qs(root, '[data-scope="pagination"][data-part="next-trigger"]');
  if (sigma && sigma.getAttribute("aria-disabled") !== "true" && !sigma.hasAttribute("disabled")) return sigma as HTMLElement;
  const aisBtn = qs(root, ".ais-Pagination-item--next:not(.ais-Pagination-item--disabled) button");
  if (aisBtn && aisBtn.getAttribute("aria-disabled") !== "true") return aisBtn as HTMLElement;
  const dub = qs(root, 'div[title="Next"]');
  const parent = dub?.parentElement;
  if (parent && parent.tagName === "A" && parent.getAttribute("aria-disabled") !== "true") return parent as HTMLElement;
  return null;
}

export type Advance =
  | { kind: "load-more" }
  | { kind: "next"; href: string }
  | { kind: "click-next" }
  | { kind: "scroll" }
  | { kind: "done" };

export function detectAdvance(root: ParentNode): Advance {
  if (findLoadMore(root)) return { kind: "load-more" };
  const href = findNextHref(root);
  if (href) return { kind: "next", href };
  if (findClickNext(root)) return { kind: "click-next" };
  if (qs(root, "[data-infinite-scroll]")) return { kind: "scroll" };
  return { kind: "done" };
}

export function mergeListings(existing: Listing[], incoming: Listing[]): Listing[] {
  const map = new Map<string, Listing>();
  const out: Listing[] = [];
  for (const it of [...existing, ...incoming]) {
    const k = (it.url || it.title).toLowerCase();
    const prev = map.get(k);
    if (prev) {
      if (it.oos) prev.oos = true;
      if (!prev.rating && it.rating) prev.rating = it.rating;
      if (!prev.reviews && it.reviews) prev.reviews = it.reviews;
      continue;
    }
    const copy = { ...it };
    map.set(k, copy);
    out.push(copy);
  }
  return out;
}

export function toMarkdown(items: Listing[], source: string, platform: string, model: OosModel | null): string {
  const withOos = items.some((it) => it.oos);
  const withRev = items.some((it) => it.rating || it.reviews);
  let header = "# " + platform + " listings\n\n**Source:** " + source + "\n\n";
  if (model?.rules.length) {
    header += "**Learned sold-out markers:** " + model.rules.slice(0, 8).map((r) => "`" + r + "`").join(" ") + "\n\n";
  }
  const cols = ["#", "Title", "Price"].concat(withRev ? ["Rating", "Reviews"] : [], withOos ? ["Stock"] : []);
  header += "| " + cols.join(" | ") + " |\n|" + cols.map(() => "---").join("|") + "|\n";
  const rows = items.map((it, i) => {
    const c = [String(i + 1), esc(it.title), esc(it.price)];
    if (withRev) c.push(it.rating ? it.rating + "★" : "—", esc(it.reviews || "—"));
    if (withOos) c.push(it.oos ? "sold out" : "in stock");
    return "| " + c.join(" | ") + " |";
  });
  return header + rows.join("\n") + "\n";
}

function esc(s: string): string {
  return String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

export function toCsv(items: Listing[]): string {
  const headers = ["title", "price", "stock", "rating", "reviews", "url", "why"];
  const lines = [headers.join(",")];
  for (const it of items) {
    lines.push(
      [it.title, it.price, it.oos ? "sold out" : "in stock", it.rating, it.reviews, it.url, it.why]
        .map((v) => '"' + String(v).replace(/"/g, '""') + '"')
        .join(","),
    );
  }
  return lines.join("\n");
}
