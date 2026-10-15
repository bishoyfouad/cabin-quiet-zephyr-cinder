"use strict";
(() => {
  // src/lib/scraper/price.ts
  var CURRENCY = "(?:(?<![A-Za-z\\u0600-\\u06FF])(?:EGP|USD|SAR|AED|EUR|GBP|CAD|AUD|QAR|KWD|BHD|OMR|TRY|INR|LE|L\\.E\\.?|\u062C\u0646\u064A\u0647\u0627\u062A|\u062C\u0646\u064A\u0647\u064A\u0646|\u062C\u0646\u064A\u0647\u064B\u0627|\u062C\u0646\u064A\u0647\u0622|\u062C\u0646\u064A\u0647\u0627|\u062C\u0646\u064A\u0629\u0627\u062A|\u062C\u0646\u064A\u0627\u062A|\u062C\u0646\u064A\u0629\u064B\u0627|\u062C\u0646\u064A\u0629\u0622|\u062C\u0646\u064A\u0647|\u062C\u0646\u064A\u0629|\u062C\u0646\u064A\u0647\\s*\u0645\u0635\u0631\u064A|\u062C\u0646\u064A\u0647\\s*\u0645\u0635\u0631\u0649|\u062C\u0646\u064A\u0647\\s*\u0645\u0635\u0631\u064A\u064B\u0627|\u062C\u0646\u064A\u0629\\s*\u0645\u0635\u0631\u064A|\u062C\u0646\u064A\u0629\\s*\u0645\u0635\u0631\u0649|\u062C\\.\u0645\\.|\u062C\\.\u0645|\u062C\\s*\u0645|\u062C\u0645|\u0642\u0631\u0648\u0634|\u0642\u0631\u0634|\u0631\u064A\u0627\u0644|\u062F\u0631\u0647\u0645|\u062F\u064A\u0646\u0627\u0631)(?![A-Za-z\\u0600-\\u06FF])|E\xA3|\xA3E|US\\$|\\$|\u20AC|\xA3|\xA5|\u20B9|\u062F\\.\u0625|\u0631\\.\u0633|\u062C\\.\u0645)";
  var NUMBER = "(?:\\d{1,3}(?:[,\\s]\\d{3})+(?:[.,]\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?)";
  var PRICE_RE = new RegExp(
    "(?:" + CURRENCY + "\\s*" + NUMBER + "|" + NUMBER + "\\s*" + CURRENCY + "|" + NUMBER + "\\s*(?:EGP|SAR|AED|USD)+)",
    "i"
  );
  var DUP_CURRENCY = /(EGP|USD|SAR|AED|EUR|GBP|CAD|AUD|QAR|KWD|BHD|OMR|TRY|INR|LE|جنيه|جنية)\1/gi;
  function norm(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }
  function prepPriceText(t) {
    return String(t || "").replace(/[\u0660-\u0669]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48)).replace(/[\u06F0-\u06F9]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48)).replace(/\s+/g, " ").replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/(\d)([A-Za-z])/g, "$1 $2").replace(DUP_CURRENCY, "$1").replace(/(EGP|USD|SAR|AED|EUR|GBP|LE)(?=\s*\1)/gi, "").replace(/(جنيه|جنية)\s*(?:مصري|مصرى|مصريًا)/g, "$1").trim();
  }
  function looksPrice(t) {
    const s = prepPriceText(norm(t));
    if (s.length < 2 || s.length > 80 || /%/.test(s) || /^[0-5][.,]\d$/.test(s)) return false;
    return PRICE_RE.test(s);
  }
  function cleanPrice(t) {
    const s = prepPriceText(norm(t));
    const m = s.match(PRICE_RE);
    const out = m ? norm(m[0]) : s.slice(0, 56);
    return out.replace(/(EGP|SAR|AED|USD)(?:\1)+/gi, "$1").replace(/(\d)([A-Za-z])/g, "$1 $2");
  }

  // src/lib/scraper/engine.ts
  var PRICE_HINT = '[class*="price" i], [class*="amount" i], [class*="money" i], [class*="cost" i], [itemprop="price"], [data-price], [data-price-amount]';
  var HIJACK_SEL = '[class*="recommend" i],[id*="recommend" i],[class*="upsell" i],[class*="up-sell" i],[class*="related" i],[id*="related" i],[class*="recently" i],[class*="cross-sell" i],[class*="crosssell" i],[class*="also-like" i],[class*="you-may" i],[class*="wishlist" i],[data-recommendations]';
  var OOS_WORDS = [
    "outofstock",
    "soldout",
    "unavailable",
    "notavailable",
    "discontinued",
    "currentlyunavailable",
    "agotado",
    "epuise",
    "ausverkauft",
    "esaurito",
    "\u063A\u064A\u0631\u0645\u062A\u0648\u0641\u0631",
    "\u063A\u064A\u0631\u0645\u062A\u0627\u062D",
    "\u0646\u0641\u0630",
    "\u0646\u0641\u062F",
    "\u0646\u0641\u062F\u062A",
    "\u0645\u0628\u0627\u0639",
    "soldout",
    "comingsoon"
  ];
  var OOS_RE = new RegExp(OOS_WORDS.join("|"), "i");
  var HARD_OOS = /^(outofstock|out-of-stock|out_of_stock|soldout|sold-out|unavailable|discontinued)$/i;
  var HARD_IN = /^(instock|in-stock|in_stock|available|orderable|backorder|preorder|lowstock)$/i;
  var BUY_RE = /(addtocart|addtobag|buynow|buyitnow|اطلب|اضف|السلة|اشتري|شراء)/i;
  var TITLE_SELS = [
    "[itemprop='name']",
    "h2 a",
    "h3 a",
    "h4 a",
    "h2",
    "h3",
    "h4",
    ".product-title a",
    ".name a",
    "a[href]"
  ];
  function qsAll(root2, sel) {
    try {
      return Array.from(root2.querySelectorAll(sel));
    } catch {
      return [];
    }
  }
  function qs(root2, sel) {
    try {
      return root2.querySelector(sel);
    } catch {
      return null;
    }
  }
  function textOf(el) {
    return el ? norm(el.textContent) : "";
  }
  function keyOf(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\u064b-\u0652\u0640]/g, "").replace(/[^0-9a-z\u00c0-\uffff]+/g, "");
  }
  function junkTitle(t) {
    t = norm(t);
    if (t.length < 4 || t.length > 240) return true;
    if (looksPrice(t) || /^[\d\s./-]+$/.test(t)) return true;
    if (/^(add to cart|buy now|sold out|out of stock|view|shop now|next|previous)$/i.test(t)) return true;
    return false;
  }
  function inHijackZone(el) {
    if (!el || !el.closest) return false;
    try {
      const m = el.closest(HIJACK_SEL);
      if (!m || m === document.body || m === document.documentElement) return false;
      return true;
    } catch {
      return false;
    }
  }
  function inChrome(el) {
    if (!el?.closest) return false;
    try {
      return !!el.closest("header, nav, footer, [role='navigation'], .site-header");
    } catch {
      return false;
    }
  }
  function classTokens(el) {
    const raw = typeof el.className === "string" ? el.className : el.getAttribute("class") || "";
    return raw.split(/\s+/).filter((c) => c && c.length < 40);
  }
  function evidence(card) {
    let score = 0;
    let hardOos = false;
    let hardIn = false;
    const why = [];
    const tokens = /* @__PURE__ */ new Set();
    const nodes = [card, ...qsAll(card, "*").slice(0, 180)];
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
        [el.getAttribute("aria-label") || "", textOf(el), typeof el.className === "string" ? el.className : ""].join(" ")
      );
      if (!label) continue;
      if (OOS_RE.test(label) || /soldout|outofstock/.test(label)) {
        hardOos = true;
        score += 3;
        why.push("buy control says sold out");
        break;
      }
      if (BUY_RE.test(label)) {
        const disabled = el.disabled || el.getAttribute("aria-disabled") === "true" || /(^|[\s_-])disabled([\s_-]|$)/i.test(typeof el.className === "string" ? el.className : "");
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
  function listing(partial) {
    const ev = partial.card ? evidence(partial.card) : { score: 0, hardOos: false, hardIn: false, why: [], tokens: [] };
    const oos = partial.oos || !ev.hardIn && (ev.hardOos || ev.score >= 2);
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
      score: ev.score
    };
  }
  function unique(items) {
    const map = /* @__PURE__ */ new Map();
    const out = [];
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
  function findTitleEl(card) {
    for (const sel of TITLE_SELS) {
      const el = qs(card, sel);
      if (el && !junkTitle(textOf(el))) return el;
    }
    const img = card.querySelector("img[alt]");
    if (img && !junkTitle(norm(img.getAttribute("alt")))) return img;
    return null;
  }
  function findPriceEl(card) {
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
  function priceFrom(el, fallbackRoot) {
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
  function hrefOf(el) {
    if (!el) return "";
    if (el.tagName === "A") return el.href || el.getAttribute("href") || "";
    const a = el.querySelector("a[href]");
    return a ? a.href || a.getAttribute("href") || "" : "";
  }
  function skipCard(el) {
    return inHijackZone(el) || inChrome(el);
  }
  function scrapeAmazon(root2) {
    const items = [];
    for (const card of qsAll(root2, 'div[data-asin]:not([data-asin=""])')) {
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
  function scrapeNoon(root2) {
    const items = [];
    let cards = qsAll(root2, '[data-qa="plp-grid"] [data-qa="plp-product-box"]');
    if (!cards.length) cards = qsAll(root2, '[data-qa="plp-product-box"]');
    for (const card of cards) {
      if (skipCard(card)) continue;
      const titleEl = qs(card, '[data-qa="plp-product-box-name"], [data-qa$="product-box-name"]');
      const title = norm(titleEl && (titleEl.getAttribute("title") || titleEl.textContent) || "");
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
  function scrapeDubaiPhone(root2) {
    const items = [];
    for (const card of qsAll(root2, "article.nf-product-card, .nf-product-card")) {
      if (skipCard(card)) continue;
      const titleEl = qs(card, ".dp-product-title, h3, a[href]");
      const title = textOf(titleEl);
      if (junkTitle(title)) continue;
      let price = "N/A";
      const numEl = qsAll(card, '[class*="tabular-nums"]').find((e) => /^[\d٠-٩][\d,.٠-٩\s]*$/.test(textOf(e)));
      if (numEl) {
        const row2 = numEl.closest("div");
        const rowText = textOf(row2);
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
  function scrapeShopify(root2) {
    const items = [];
    const cards = qsAll(
      root2,
      ".product-card, [data-product-card], .card-wrapper, .grid-product, .product-item, .t4s-product"
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
  function scrapeWoo(root2) {
    const items = [];
    for (const card of qsAll(root2, "li.product, ul.products li.product, .product.type-product")) {
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
  function scrapeSharaf(root2) {
    return scrapeGeneric(root2, ".ais-Hits-item, .ais-InfiniteHits-item");
  }
  function scrapeDubizzle(root2) {
    const items = [];
    for (const card of qsAll(root2, 'li[aria-label="Listing"]')) {
      if (skipCard(card)) continue;
      const titleEl = qs(card, '[aria-label="Title"]');
      const title = textOf(titleEl);
      if (junkTitle(title)) continue;
      const box = qs(card, '[aria-label="Price"]');
      items.push(listing({ title, price: priceFrom(box), card, url: hrefOf(card) }));
    }
    return unique(items);
  }
  function scrapeSigma(root2) {
    const items = [];
    for (const a of qsAll(root2, 'a.line-clamp-2[href*="/item?id="], a[href*="/item?id="]')) {
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
          url: a.href || a.getAttribute("href") || ""
        })
      );
    }
    return unique(items);
  }
  function scrapeGeneric(root2, sel) {
    const items = [];
    for (const card of qsAll(root2, sel)) {
      if (skipCard(card)) continue;
      const titleEl = findTitleEl(card);
      const title = titleEl?.tagName === "IMG" ? norm(titleEl.getAttribute("alt")) : textOf(titleEl);
      if (junkTitle(title)) continue;
      items.push(listing({ title, price: priceFrom(findPriceEl(card)), card, url: hrefOf(titleEl) || hrefOf(card) }));
    }
    return unique(items);
  }
  function scrapeJsonLd(root2) {
    const items = [];
    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node !== "object") return;
      const rec = node;
      const t = rec["@type"];
      const type = (typeof t === "string" ? t : Array.isArray(t) ? t.join(",") : "").toLowerCase();
      if (type.includes("product") && typeof rec.name === "string" && !junkTitle(rec.name)) {
        const offers = Array.isArray(rec.offers) ? rec.offers : rec.offers ? [rec.offers] : [];
        let price = "N/A";
        let oos = false;
        for (const o of offers) {
          if (!o || typeof o !== "object") continue;
          const offer = o;
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
    for (const s of qsAll(root2, 'script[type="application/ld+json"], template.jsonld')) {
      const raw = s.tagName === "TEMPLATE" ? s.innerHTML : s.textContent || "";
      try {
        walk(JSON.parse(raw || "null"));
      } catch {
      }
    }
    return items;
  }
  function classSig(el) {
    const classes = classTokens(el).filter((c) => !/^(flex|grid|block|hidden|relative|absolute)$/i.test(c)).filter((c) => !/exhausted|sold|oos|disabled|unavailable|out-of-stock/i.test(c)).slice(0, 4).sort();
    return el.tagName.toLowerCase() + (classes.length ? "." + classes.join(".") : "");
  }
  function compile(root2) {
    const priceEls = [];
    for (const el of qsAll(root2, PRICE_HINT)) {
      if (looksPrice(textOf(el)) && !inHijackZone(el)) priceEls.push(el);
    }
    if (priceEls.length < 2) {
      for (const el of qsAll(root2, "span,div,p,b,strong")) {
        if (el.childElementCount > 3 || inHijackZone(el)) continue;
        const t = textOf(el);
        if (t.length <= 56 && looksPrice(t)) priceEls.push(el);
      }
    }
    const clusters = [];
    const consider = (cards, signature, score) => {
      const clean = cards.filter((c) => !skipCard(c));
      if (clean.length < 2) return;
      if (/recommend|upsell|related/i.test(signature)) return;
      clusters.push({ cards: clean, score, signature });
    };
    for (const anchor of priceEls) {
      let node = anchor;
      let depth = 0;
      while (node && node !== root2 && depth < 8) {
        const parent = node.parentElement;
        if (!parent) break;
        const sig = classSig(node);
        const siblings = Array.from(parent.children).filter((c) => c.tagName === node.tagName && classSig(c) === sig);
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
      const ld = scrapeJsonLd(root2);
      return {
        items: ld.map((x) => listing({ title: x.title, price: looksPrice(x.price) ? cleanPrice(x.price) : x.price, oos: x.oos, card: null, why: x.oos ? "json-ld" : "" })),
        blueprint: ld.length ? { card: "", title: "Product.name", price: "Offer.price", note: "JSON-LD Product nodes" } : null
      };
    }
    const titleSels = [];
    const priceSels = [];
    for (const c of best.cards) {
      const t = findTitleEl(c);
      if (t) titleSels.push(guessSel(t));
      const p = findPriceEl(c);
      if (p) priceSels.push(guessSel(p));
    }
    const titleSel = mode(titleSels) || "h2, h3, a[href]";
    const priceSel = mode(priceSels) || PRICE_HINT;
    const items = [];
    for (const card of qsAll(root2, best.signature.split("|")[0] || best.signature)) {
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
        note: "Compiled from source \xB7 " + best.signature + " \xD7 " + best.cards.length
      }
    };
  }
  function guessSel(el) {
    const tag = el.tagName.toLowerCase();
    const classes = classTokens(el).slice(0, 2);
    if (classes.length) return tag + "." + classes.join(".");
    if (/^h[1-6]$/.test(tag)) return tag;
    return tag;
  }
  function mode(values) {
    if (!values.length) return void 0;
    const counts = /* @__PURE__ */ new Map();
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
  function detectPlatform(root2, host) {
    const h = host.toLowerCase();
    if (h.includes("amazon.") || qs(root2, "div[data-asin] h2")) return "amazon";
    if (h.includes("noon.com") || qs(root2, '[data-qa="plp-product-box"]')) return "noon";
    if (h.includes("dubizzle") || qs(root2, 'li[aria-label="Listing"]')) return "dubizzle";
    if (h.includes("sigma-computer") || qsAll(root2, 'a[href*="/item?id="]').length >= 2) return "sigma";
    if (h.includes("dubaiphone") || qs(root2, ".nf-product-card")) return "dubaiphone";
    if (h.includes("samsung.") || qs(root2, ".pd21-product-card__item, .pd21-product-finder")) return "samsung";
    if (h.includes("sharafdg") || qs(root2, ".ais-Hits-item, .ais-InfiniteHits-item, .ais-Pagination")) return "sharaf";
    if (h.includes("vodafone") || qs(root2, ".vf-product-card, [class*='vf-product']")) return "vodafone";
    if (qs(root2, ".yalla-product-card, [data-yalla-product-id]")) return "yalla";
    const view = (root2 instanceof Document ? root2 : root2.ownerDocument)?.defaultView;
    if (view?.Shopify?.shop || qs(root2, "meta[name='shopify-checkout-api-token'], script#shopify-features, [data-shopify], .product-card, [data-product-card]"))
      return "shopify";
    if (qs(root2, ".woocommerce, .woocommerce-loop-product__title, ul.products li.product")) return "woocommerce";
    if (qs(root2, "div.product-thumb")) return "opencart";
    if (qs(root2, "article.product-miniature")) return "prestashop";
    if (qs(root2, "li.product-item, .product-item-info")) return "magento";
    if (qs(root2, ".ut2-gl__item")) return "cscart";
    if (qs(root2, 'script[type="application/ld+json"], template.jsonld')) return "json-ld";
    return "unknown";
  }
  var SPEC = {
    samsung: ".pd21-product-card__item",
    sharaf: ".ais-Hits-item, .ais-InfiniteHits-item",
    vodafone: ".vf-product-card, [data-product-code]",
    yalla: "article.yalla-product-card, .yalla-product-card",
    opencart: "div.product-thumb, .product-layout",
    prestashop: "article.product-miniature",
    magento: "li.product-item, .product-item-info",
    cscart: ".ut2-gl__item"
  };
  function collect(root2, platform) {
    const scrapers = {
      amazon: () => scrapeAmazon(root2),
      noon: () => scrapeNoon(root2),
      dubizzle: () => scrapeDubizzle(root2),
      dubaiphone: () => scrapeDubaiPhone(root2),
      sigma: () => scrapeSigma(root2),
      shopify: () => scrapeShopify(root2),
      woocommerce: () => scrapeWoo(root2),
      sharaf: () => scrapeSharaf(root2)
    };
    let items = scrapers[platform] ? scrapers[platform]() : SPEC[platform] ? scrapeGeneric(root2, SPEC[platform]) : [];
    let blueprint = null;
    let used = platform;
    if (items.length < 2) {
      const compiled = compile(root2);
      if (compiled.items.length > items.length) {
        items = compiled.items;
        blueprint = compiled.blueprint;
        used = compiled.blueprint?.card ? "compiled" : platform === "json-ld" ? "json-ld" : "compiled";
      }
    }
    return { items, blueprint, platform: used };
  }
  function learn(items, host, prev) {
    const conf = items.filter((x) => x.hardOos && !x.hardIn && x.card);
    const ok = items.filter((x) => !x.hardOos && !x.oos && x.card);
    if (conf.length < 2 || ok.length < 2) return { model: prev, fresh: [] };
    const freq = /* @__PURE__ */ new Map();
    const oos = /* @__PURE__ */ new Map();
    const inst = /* @__PURE__ */ new Map();
    for (const x of items) for (const t of x.tokens) freq.set(t, (freq.get(t) || 0) + 1);
    for (const x of conf) for (const t of x.tokens) oos.set(t, (oos.get(t) || 0) + 1);
    for (const x of ok) for (const t of x.tokens) inst.set(t, (inst.get(t) || 0) + 1);
    const rules = [];
    const neg = [];
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
  function applyModel(items, model) {
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
  function applyJsonLd(items, root2) {
    const ld = scrapeJsonLd(root2);
    const forced = /* @__PURE__ */ new Map();
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
  function countSkipped(root2) {
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
      "[class*='related'] .tile"
    ].join(",");
    return qsAll(root2, sel).filter((el) => inHijackZone(el)).length;
  }
  function scrapePage(root2, host, prev, includeOos) {
    const detected = detectPlatform(root2, host);
    const collected = collect(root2, detected);
    applyJsonLd(collected.items, root2);
    const learned = learn(collected.items, host, prev);
    applyModel(collected.items, learned.model);
    const soldOut = collected.items.filter((it) => it.oos).length;
    const pool = includeOos ? collected.items : collected.items.filter((it) => !it.oos);
    const items = pool.map((it) => ({
      title: it.title,
      price: it.price,
      oos: it.oos,
      url: it.url,
      rating: it.rating,
      reviews: it.reviews,
      why: it.why
    }));
    return {
      platform: collected.platform,
      blueprint: collected.blueprint,
      items,
      soldOut,
      skippedZone: countSkipped(root2),
      model: learned.model,
      learned: learned.fresh
    };
  }
  function findLoadMore(root2) {
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
      'button[class*="show-more" i]'
    ];
    for (const sel of sels) {
      const el = qs(root2, sel);
      if (!el || inHijackZone(el) || inChrome(el)) continue;
      if (el.disabled || el.getAttribute("aria-disabled") === "true") continue;
      if (el.classList.contains("is-hidden") || el.closest(".aok-hidden, .disabled, .ias-noneleft")) continue;
      return el;
    }
    return null;
  }
  function findNextHref(root2) {
    const ais = qs(root2, ".ais-Pagination-item--next:not(.ais-Pagination-item--disabled) a[href]");
    if (ais) {
      const href2 = ais.getAttribute("href");
      if (href2 && href2 !== "#" && !/^javascript:/i.test(href2)) return href2;
    }
    const labeled = qs(
      root2,
      'a[rel="next"][href], link[rel="next"][href], a.s-pagination-next[href], a.next.page-numbers[href], a.pagination__next[href], ul.pagination a.next[href], nav.woocommerce-pagination a.next[href], a[aria-label*="\u0627\u0644\u062A\u0627\u0644\u064A"][href]'
    );
    if (!labeled) return null;
    if (labeled.getAttribute("aria-disabled") === "true") return null;
    if (labeled.closest(".disabled, .ais-Pagination-item--disabled")) return null;
    const href = labeled.getAttribute("href");
    if (!href || href === "#" || /^javascript:/i.test(href)) return null;
    return href;
  }
  function findClickNext(root2) {
    const sigma = qs(root2, '[data-scope="pagination"][data-part="next-trigger"]');
    if (sigma && sigma.getAttribute("aria-disabled") !== "true" && !sigma.hasAttribute("disabled")) return sigma;
    const aisBtn = qs(root2, ".ais-Pagination-item--next:not(.ais-Pagination-item--disabled) button");
    if (aisBtn && aisBtn.getAttribute("aria-disabled") !== "true") return aisBtn;
    const dub = qs(root2, 'div[title="Next"]');
    const parent = dub?.parentElement;
    if (parent && parent.tagName === "A" && parent.getAttribute("aria-disabled") !== "true") return parent;
    return null;
  }
  function detectAdvance(root2) {
    if (findLoadMore(root2)) return { kind: "load-more" };
    const href = findNextHref(root2);
    if (href) return { kind: "next", href };
    if (findClickNext(root2)) return { kind: "click-next" };
    if (qs(root2, "[data-infinite-scroll]")) return { kind: "scroll" };
    return { kind: "done" };
  }
  function mergeListings(existing, incoming) {
    const map = /* @__PURE__ */ new Map();
    const out = [];
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
  function toMarkdown(items, source, platform, model) {
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
      if (withRev) c.push(it.rating ? it.rating + "\u2605" : "\u2014", esc(it.reviews || "\u2014"));
      if (withOos) c.push(it.oos ? "sold out" : "in stock");
      return "| " + c.join(" | ") + " |";
    });
    return header + rows.join("\n") + "\n";
  }
  function esc(s) {
    return String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
  }
  function toCsv(items) {
    const headers = ["title", "price", "stock", "rating", "reviews", "url", "why"];
    const lines = [headers.join(",")];
    for (const it of items) {
      lines.push(
        [it.title, it.price, it.oos ? "sold out" : "in stock", it.rating, it.reviews, it.url, it.why].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")
      );
    }
    return lines.join("\n");
  }

  // extension-src/content.ts
  var KEY = "odsJob";
  function blank() {
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
      ownerTab: null
    };
  }
  var job = blank();
  var generation = 0;
  var stopRequested = false;
  var hostEl = null;
  var collapsed = false;
  function storageOn() {
    try {
      return typeof chrome !== "undefined" && !!chrome.storage?.session;
    } catch {
      return false;
    }
  }
  function shownItems() {
    return job.includeOos ? job.items : job.items.filter((it) => !it.oos);
  }
  function publicState(file) {
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
      file
    };
  }
  async function persist() {
    if (!storageOn()) return;
    try {
      await chrome.storage.session.set({ [KEY]: job });
    } catch {
    }
  }
  function whoAmI() {
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
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function fileBase() {
    const host = (job.host || location.hostname || "listings").replace(/[^\w.-]+/g, "_");
    return "open-data-scraper-" + host;
  }
  function exportText(format) {
    const rows = shownItems();
    if (format === "csv") {
      return { name: fileBase() + ".csv", text: toCsv(rows), mime: "text/csv" };
    }
    return {
      name: fileBase() + ".md",
      text: toMarkdown(rows, job.source || location.href, job.platform || "listings", job.model),
      mime: "text/markdown"
    };
  }
  function triggerDownload(name, text, mime) {
    const blob = new Blob([text], { type: mime + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.documentElement.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2e3);
  }
  function applyResult(res, addedBase) {
    job.items = mergeListings(job.items, res.items).slice(0, 2e3);
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
      job.includeOos = event.target.checked;
      void persist();
      render();
    });
    document.documentElement.appendChild(hostEl);
    render();
  }
  function render() {
    if (!hostEl?.shadowRoot) return;
    const root2 = hostEl.shadowRoot;
    const rows = shownItems();
    const toggle = root2.getElementById("toggle");
    const body = root2.getElementById("body");
    const status = root2.getElementById("status");
    const meta = root2.getElementById("meta");
    const list = root2.getElementById("rows");
    const oos = root2.getElementById("oos");
    if (toggle) toggle.textContent = "Open Data Scraper" + (rows.length ? " \xB7 " + rows.length : "");
    if (body) body.hidden = collapsed;
    if (status) status.textContent = job.status;
    if (meta) {
      const bits = [job.platform || "this page", rows.length + " shown", job.soldOut + " sold out"];
      if (job.blueprint) bits.push(job.blueprint);
      if (job.learned.length) bits.push("learned " + job.learned.slice(0, 4).join(", "));
      meta.textContent = bits.join(" \xB7 ");
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
    if (!/stopped$/.test(job.status)) job.status += " \xB7 stopped";
    void persist();
    showPanel();
    render();
  }
  async function scrapeOnce(includeOos) {
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
    job.status = (job.platform || "page") + " \xB7 " + n + " shown \xB7 " + job.soldOut + " sold out \xB7 " + job.skipped + " upsell rows skipped";
    await persist();
    showPanel();
    collapsed = false;
    render();
    return publicState();
  }
  async function loop(gen) {
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
      job.status = "Page " + job.pages + " \xB7 +" + added + " \xB7 " + shownItems().length + " shown \xB7 " + (job.platform || "page");
      await persist();
      render();
      if (gen !== generation || stopRequested) return;
      if (advance.kind === "done") {
        job.status += " \xB7 end of listing";
        break;
      }
      if (job.pages >= job.maxPages) {
        job.status += " \xB7 page limit";
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
          job.status += " \xB7 next page already seen";
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
        job.status += " \xB7 no new rows";
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
    if (stopRequested && !/stopped$/.test(job.status)) job.status += " \xB7 stopped";
    await persist();
    render();
  }
  async function startCrawl(includeOos, maxPages) {
    const gen = ++generation;
    stopRequested = false;
    job = blank();
    job.active = true;
    job.includeOos = includeOos;
    job.maxPages = Math.max(1, Math.min(30, maxPages || 8));
    job.host = location.hostname;
    job.source = location.href;
    job.ownerTab = await whoAmI();
    job.status = "Crawling\u2026";
    await persist();
    showPanel();
    collapsed = false;
    render();
    await loop(gen);
    return publicState();
  }
  async function onMessage(msg) {
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
  var PANEL_CSS = `
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
  var PANEL_HTML = `
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
      learned: res.learned
    };
  }
  var root = globalThis;
  root.__ods = { snapshot };
  function listen() {
    if (!storageOn() || !chrome.runtime?.onMessage) return;
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      onMessage(msg).then(sendResponse).catch((err) => sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) }));
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
  });
})();
