import type { RefObject } from "react";

export type CatalogId = "amazon" | "noon" | "dubai" | "shopify" | "sharaf" | "woo" | "unknown" | "paste";

export type Catalog = {
  id: CatalogId;
  name: string;
  host: string;
  detail: string;
};

export const CATALOGS: Catalog[] = [
  { id: "amazon", name: "Amazon", host: "www.amazon.eg", detail: "ASIN cards, ratings, next link. Upsell carousel is ignored." },
  { id: "noon", name: "Noon", host: "www.noon.com", detail: "Split Arabic currency, Eastern digits, نفذ badges." },
  { id: "dubai", name: "DubaiPhone", host: "www.dubaiphone.net", detail: "Price split across spans. Infinite scroll. Coming soon has no price." },
  { id: "shopify", name: "Shopify", host: "demo.myshopify.com", detail: "Load more, duplicate EGP, disabled add-to-cart." },
  { id: "sharaf", name: "Sharaf DG", host: "www.sharafdg.com", detail: "Algolia hit list and next control." },
  { id: "woo", name: "WooCommerce", host: "woo.example", detail: "Loop titles, sale price, inventory attribute." },
  { id: "unknown", name: "Unknown shop", host: "atelier.example", detail: "Compiled selectors, JSON-LD stock, learned sold-out class." },
];

type Props = {
  catalog: CatalogId;
  page: number;
  revealed: number;
  paste: string;
  stageRef: RefObject<HTMLDivElement | null>;
};

export function StoreStage({ catalog, page, revealed, paste, stageRef }: Props) {
  const host = CATALOGS.find((c) => c.id === catalog)?.host || "pasted.local";
  if (catalog === "paste") {
    return (
      <div
        ref={stageRef}
        className="stage"
        data-host={host}
        dangerouslySetInnerHTML={{ __html: paste || "<p class='empty-paste'>Paste a listing page, then detect.</p>" }}
      />
    );
  }
  return (
    <div ref={stageRef} className="stage" data-host={host}>
      <StageBody catalog={catalog} page={page} revealed={revealed} />
    </div>
  );
}

function StageBody({ catalog, page, revealed }: { catalog: CatalogId; page: number; revealed: number }) {
  if (catalog === "amazon") return <Amazon page={page} />;
  if (catalog === "noon") return <Noon page={page} />;
  if (catalog === "dubai") return <Dubai revealed={revealed} />;
  if (catalog === "shopify") return <Shopify revealed={revealed} />;
  if (catalog === "sharaf") return <Sharaf page={page} />;
  if (catalog === "woo") return <Woo page={page} />;
  if (catalog === "unknown") return <Unknown page={page} />;
  return null;
}

function Amazon({ page }: { page: number }) {
  const pages: [string, string, string, string, string, boolean][][] = [
    [
      ["B001", "Kindle Paperwhite 16GB", "EGP 4,299", "4.6", "12040", false],
      ["B002", "Sony WH-1000XM5", "EGP 14,990", "4.7", "8321", false],
      ["B003", "Anker 65W charger", "EGP 1,299", "4.4", "2104", false],
      ["B004", "Echo Dot 5th gen", "EGP 1,799", "", "", true],
      ["B005", "Logitech Lift mouse", "EGP 2,150", "4.3", "640", false],
      ["B006", "Philips air fryer", "EGP 3,450", "4.1", "90", true],
    ],
    [
      ["B007", "Samsung T7 1TB", "EGP 3,890", "4.8", "15002", false],
      ["B008", "Baseus cable 2m", "EGP 189", "4.2", "733", false],
      ["B009", "TP-Link Archer AX55", "EGP 2,640", "4.5", "980", false],
      ["B010", "Oral-B iO 3", "EGP 2,990", "4.0", "410", false],
    ],
  ];
  const rows = pages[Math.min(page, pages.length - 1)] || [];
  const last = page >= pages.length - 1;
  return (
    <div className="shop amazon">
      <header className="site-header">
        <strong>amazon.eg</strong>
        <span>Electronics</span>
      </header>
      <div className="grid">
        {rows.map(([id, title, price, rating, reviews, oos]) => (
          <div key={id} data-asin={id} className="amz-card">
            <h2>
              <a href={"/dp/" + id}>
                <span>{title}</span>
              </a>
            </h2>
            <span className="a-price">
              <span className="a-offscreen">{price}</span>
            </span>
            {rating ? <span className="a-icon-alt">{rating} out of 5 stars</span> : null}
            {reviews ? <a aria-label={reviews + " ratings"}>{reviews}</a> : null}
            {oos ? <span className="oos-badge">Currently unavailable</span> : <span>In stock</span>}
          </div>
        ))}
      </div>
      <aside className="recommend">
        <p>Customers also bought</p>
        <div data-asin="UPSELL1" className="amz-card">
          <h2>
            <span>Sponsored cable kit</span>
          </h2>
          <span className="a-price">
            <span className="a-offscreen">EGP 99</span>
          </span>
        </div>
      </aside>
      {last ? null : (
        <a rel="next" href={"?page=" + (page + 2)}>
          Next
        </a>
      )}
    </div>
  );
}

function Noon({ page }: { page: number }) {
  const pages: [string, string, string, boolean][][] = [
    [
      ["Galaxy A55", "ج.م", "21,500", false],
      ["iPhone 13", "جنيه", "٢١٥٠٠", false],
      ["Redmi Note 13", "ج.م", "12,499", true],
      ["OPPO Reno 11", "EGP", "18,990", false],
    ],
    [
      ["Pixel 8a", "ج.م", "24,000", false],
      ["Nothing Phone 2a", "ج.م", "16,750", false],
      ["Realme 12", "ج.م", "10,200", true],
    ],
  ];
  const rows = pages[Math.min(page, pages.length - 1)] || [];
  const last = page >= pages.length - 1;
  return (
    <div className="shop">
      <header className="site-header">
        <strong>noon</strong>
        <span>Mobiles</span>
      </header>
      <div data-qa="plp-grid" className="grid">
        {rows.map(([title, cur, amt, oos]) => (
          <div key={title} data-qa="plp-product-box" className="noon-card">
            <div data-qa="plp-product-box-name" title={title}>
              <a href={"/p/" + encodeURIComponent(title)}>{title}</a>
            </div>
            <div data-qa="plp-product-box-price">
              <span className="currency">{cur}</span>
              <span className="amount">{amt}</span>
            </div>
            {oos ? <span>نفذ</span> : <span>متوفر</span>}
          </div>
        ))}
      </div>
      <aside className="recommend">
        <div data-qa="plp-product-box">
          <div data-qa="plp-product-box-name" title="Upsell case">
            Upsell case
          </div>
          <div data-qa="plp-product-box-price">
            <span className="currency">ج.م</span>
            <span className="amount">199</span>
          </div>
        </div>
      </aside>
      {last ? null : (
        <a rel="next" href={"?page=" + (page + 2)}>
          التالي
        </a>
      )}
    </div>
  );
}

const DUBAI: [string, string, boolean][] = [
  ["iPhone 15 128GB", "215,500", false],
  ["Galaxy S24", "189,000", false],
  ["Pixel 8", "142,000", false],
  ["Xperia 10", "", true],
  ["iPad 10th", "98,500", false],
  ["Watch SE", "41,200", false],
  ["Buds FE", "12,900", false],
  ["Z Flip 5", "210,000", false],
];

function Dubai({ revealed }: { revealed: number }) {
  const shown = DUBAI.slice(0, revealed * 4);
  const more = shown.length < DUBAI.length;
  return (
    <div className="shop" data-infinite-scroll={more ? "1" : undefined}>
      <header className="site-header">
        <strong>dubaiphone</strong>
        <span>Shop</span>
      </header>
      <div className="grid">
        {shown.map(([title, num, soon]) => (
          <article key={title} className="nf-product-card">
            <h3 className="dp-product-title">
              <a href={"/shop/" + encodeURIComponent(title)}>{title}</a>
            </h3>
            {num ? (
              <div className="price-row">
                <span className="tabular-nums">{num}</span>
                <span>EGP</span>
                <span>EGP</span>
              </div>
            ) : (
              <p>Coming soon</p>
            )}
            {soon ? <span className="soon">Soon</span> : null}
          </article>
        ))}
      </div>
      <aside className="recommend">
        <article className="nf-product-card">
          <h3 className="dp-product-title">Recommended cover</h3>
          <div className="price-row">
            <span className="tabular-nums">350</span>
            <span>EGP</span>
          </div>
        </article>
      </aside>
    </div>
  );
}

const SHOPIFY: [string, string, string, boolean][] = [
  ["Linen shirt", "/products/linen-shirt", "1,250 EGP EGP", false],
  ["Wool coat", "/products/wool-coat", "4,800 EGP", false],
  ["Canvas tote", "/products/canvas-tote", "640 EGP", true],
  ["Silk scarf", "/products/silk-scarf", "890 EGP", false],
  ["Leather belt", "/products/leather-belt", "1,100 EGP", false],
  ["Cotton trousers", "/products/cotton-trousers", "1,750 EGP", false],
  ["Cap", "/products/cap", "420 EGP", true],
  ["Knit vest", "/products/knit-vest", "1,540 EGP", false],
];

function Shopify({ revealed }: { revealed: number }) {
  const shown = SHOPIFY.slice(0, revealed * 4);
  const more = shown.length < SHOPIFY.length;
  return (
    <div className="shop">
      <meta name="shopify-checkout-api-token" content="demo" />
      <header className="site-header">
        <strong>Northroom</strong>
        <span>Collection</span>
      </header>
      <div className="grid">
        {shown.map(([title, href, price, oos]) => (
          <div key={href} className="product-card">
            <a href={href}>
              <h3 className="product-card__title">{title}</h3>
            </a>
            <span className="price">{price}</span>
            {oos ? (
              <button type="button" disabled className="sold-out">
                Sold out
              </button>
            ) : (
              <button type="button">Add to cart</button>
            )}
          </div>
        ))}
      </div>
      <aside className="recommend">
        <div className="product-card">
          <a href="/products/gift-card">
            <h3 className="product-card__title">Recommended gift card</h3>
          </a>
          <span className="price">500 EGP</span>
        </div>
      </aside>
      {more ? (
        <button type="button" className="load-more">
          Load more
        </button>
      ) : null}
    </div>
  );
}

function Sharaf({ page }: { page: number }) {
  const pages: [string, string, boolean][][] = [
    [
      ["LG 55 inch TV", "AED 1,899", false],
      ["Dyson V15", "AED 2,499", false],
      ["Bose SoundLink", "AED 699", true],
      ["Ninja blender", "AED 549", false],
    ],
    [
      ["iPad Air", "AED 2,299", false],
      ["Kindle Scribe", "AED 1,199", false],
      ["GoPro Hero", "AED 1,499", false],
    ],
  ];
  const rows = pages[Math.min(page, pages.length - 1)] || [];
  const last = page >= pages.length - 1;
  return (
    <div className="shop">
      <header className="site-header">
        <strong>Sharaf DG</strong>
        <span>Hits</span>
      </header>
      <ul className="grid">
        {rows.map(([title, price, oos]) => (
          <li key={title} className="ais-Hits-item">
            <h3>
              <a href={"/product/" + encodeURIComponent(title)}>{title}</a>
            </h3>
            <span className="price">{price}</span>
            {oos ? <span>Out of stock</span> : <span>In stock</span>}
          </li>
        ))}
      </ul>
      <ul className="ais-Pagination">
        <li className={last ? "ais-Pagination-item--next ais-Pagination-item--disabled" : "ais-Pagination-item--next"}>
          {last ? <span>Next</span> : <a href={"?page_number=" + (page + 2)}>Next</a>}
        </li>
      </ul>
    </div>
  );
}

function Woo({ page }: { page: number }) {
  const pages: [string, string, boolean, boolean][][] = [
    [
      ["Ceramic pour-over", "EGP 640", false, false],
      ["Stoneware mug", "EGP 220", true, false],
      ["Oak tray", "EGP 890", false, true],
      ["Linen napkin set", "EGP 310", false, false],
    ],
    [
      ["Brass spoon", "EGP 180", false, false],
      ["Glass carafe", "EGP 470", false, false],
    ],
  ];
  const rows = pages[Math.min(page, pages.length - 1)] || [];
  const last = page >= pages.length - 1;
  return (
    <div className="shop woocommerce">
      <header className="site-header">
        <strong>Kiln</strong>
        <span>Shop</span>
      </header>
      <ul className="products grid">
        {rows.map(([title, price, sale, attr]) => (
          <li key={title} className="product" data-inventory-status={attr ? "outofstock" : "instock"}>
            <h2 className="woocommerce-loop-product__title">
              <a href={"/product/" + encodeURIComponent(title)}>{title}</a>
            </h2>
            <span className="price">
              {sale ? (
                <>
                  <del>
                    <span className="woocommerce-Price-amount">EGP 280</span>
                  </del>
                  <ins>
                    <span className="woocommerce-Price-amount">{price}</span>
                  </ins>
                </>
              ) : (
                <span className="woocommerce-Price-amount">{price}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {last ? null : (
        <a className="next page-numbers" href={"/page/" + (page + 2)}>
          Next
        </a>
      )}
    </div>
  );
}

function Unknown({ page }: { page: number }) {
  const pages: [string, string, string][][] = [
    [
      ["Clay cup", "890 EGP", ""],
      ["Ash bowl", "640 EGP", ""],
      ["Night lamp", "1,450 EGP", "exhausted"],
      ["Oak stool", "3,200 EGP", ""],
      ["Linen overshirt", "1,100 EGP", ""],
      ["Wool throw", "2,040 EGP", "exhausted"],
      ["Brass hook", "260 EGP", ""],
      ["Stone plate", "480 EGP", ""],
    ],
    [
      ["Ink poster", "320 EGP", ""],
      ["Cedar box", "1,780 EGP", "exhausted"],
      ["Glass tumbler", "210 EGP", ""],
      ["Hemp tote", "540 EGP", ""],
    ],
  ];
  const rows = pages[Math.min(page, pages.length - 1)] || [];
  const last = page >= pages.length - 1;
  const ld =
    page === 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "Product",
              name: "Linen overshirt",
              offers: { price: "1100", priceCurrency: "EGP", availability: "https://schema.org/OutOfStock" },
            },
          ],
        })
      : "";
  const cards = rows
    .map(([title, price, flag]) => {
      const badge = flag && page === 0 ? '<span class="badge">Sold out</span>' : "";
      const cls = flag ? "tile exhausted" : "tile";
      return (
        '<article class="' +
        cls +
        '"><h3><a href="/goods/' +
        encodeURIComponent(title) +
        '">' +
        title +
        '</a></h3><span class="cost">' +
        price +
        "</span>" +
        badge +
        "</article>"
      );
    })
    .join("");
  const next = last ? "" : '<a rel="next" href="?page=' + (page + 2) + '">Next</a>';
  const script = ld ? '<template class="jsonld">' + ld + "</template>" : "";
  const html =
    script +
    '<header class="site-header"><strong>Atelier</strong><span>All goods</span></header><div class="catalog grid">' +
    cards +
    '</div><aside class="recommend"><article class="tile"><h3>Related candle</h3><span class="cost">190 EGP</span></article><article class="tile"><h3>Related soap</h3><span class="cost">95 EGP</span></article></aside>' +
    next;
  return <div className="shop" dangerouslySetInnerHTML={{ __html: html }} />;
}
