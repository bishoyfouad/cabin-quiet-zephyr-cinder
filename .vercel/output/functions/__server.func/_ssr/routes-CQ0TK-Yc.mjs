import { i as __toESM } from "../_runtime.mjs";
import { d as require_react_dom, q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Download, i as Play, n as Square, r as ScanSearch } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CQ0TK-Yc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
var CATALOGS = [
	{
		id: "amazon",
		name: "Amazon",
		host: "www.amazon.eg",
		detail: "ASIN cards, ratings, next link. Upsell carousel is ignored."
	},
	{
		id: "noon",
		name: "Noon",
		host: "www.noon.com",
		detail: "Split Arabic currency, Eastern digits, نفذ badges."
	},
	{
		id: "dubai",
		name: "DubaiPhone",
		host: "www.dubaiphone.net",
		detail: "Price split across spans. Infinite scroll. Coming soon has no price."
	},
	{
		id: "shopify",
		name: "Shopify",
		host: "demo.myshopify.com",
		detail: "Load more, duplicate EGP, disabled add-to-cart."
	},
	{
		id: "sharaf",
		name: "Sharaf DG",
		host: "www.sharafdg.com",
		detail: "Algolia hit list and next control."
	},
	{
		id: "woo",
		name: "WooCommerce",
		host: "woo.example",
		detail: "Loop titles, sale price, inventory attribute."
	},
	{
		id: "unknown",
		name: "Unknown shop",
		host: "atelier.example",
		detail: "Compiled selectors, JSON-LD stock, learned sold-out class."
	}
];
function StoreStage({ catalog, page, revealed, paste, stageRef }) {
	const host = CATALOGS.find((c) => c.id === catalog)?.host || "pasted.local";
	if (catalog === "paste") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: stageRef,
		className: "stage",
		"data-host": host,
		dangerouslySetInnerHTML: { __html: paste || "<p class='empty-paste'>Paste a listing page, then detect.</p>" }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: stageRef,
		className: "stage",
		"data-host": host,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBody, {
			catalog,
			page,
			revealed
		})
	});
}
function StageBody({ catalog, page, revealed }) {
	if (catalog === "amazon") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Amazon, { page });
	if (catalog === "noon") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Noon, { page });
	if (catalog === "dubai") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dubai, { revealed });
	if (catalog === "shopify") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shopify, { revealed });
	if (catalog === "sharaf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sharaf, { page });
	if (catalog === "woo") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Woo, { page });
	if (catalog === "unknown") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unknown, { page });
	return null;
}
function Amazon({ page }) {
	const pages = [[
		[
			"B001",
			"Kindle Paperwhite 16GB",
			"EGP 4,299",
			"4.6",
			"12040",
			false
		],
		[
			"B002",
			"Sony WH-1000XM5",
			"EGP 14,990",
			"4.7",
			"8321",
			false
		],
		[
			"B003",
			"Anker 65W charger",
			"EGP 1,299",
			"4.4",
			"2104",
			false
		],
		[
			"B004",
			"Echo Dot 5th gen",
			"EGP 1,799",
			"",
			"",
			true
		],
		[
			"B005",
			"Logitech Lift mouse",
			"EGP 2,150",
			"4.3",
			"640",
			false
		],
		[
			"B006",
			"Philips air fryer",
			"EGP 3,450",
			"4.1",
			"90",
			true
		]
	], [
		[
			"B007",
			"Samsung T7 1TB",
			"EGP 3,890",
			"4.8",
			"15002",
			false
		],
		[
			"B008",
			"Baseus cable 2m",
			"EGP 189",
			"4.2",
			"733",
			false
		],
		[
			"B009",
			"TP-Link Archer AX55",
			"EGP 2,640",
			"4.5",
			"980",
			false
		],
		[
			"B010",
			"Oral-B iO 3",
			"EGP 2,990",
			"4.0",
			"410",
			false
		]
	]];
	const rows = pages[Math.min(page, pages.length - 1)] || [];
	const last = page >= pages.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shop amazon",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "site-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "amazon.eg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Electronics" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid",
				children: rows.map(([id, title, price, rating, reviews, oos]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-asin": id,
					className: "amz-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/dp/" + id,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title })
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "a-price",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "a-offscreen",
								children: price
							})
						}),
						rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "a-icon-alt",
							children: [rating, " out of 5 stars"]
						}) : null,
						reviews ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							"aria-label": reviews + " ratings",
							children: reviews
						}) : null,
						oos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "oos-badge",
							children: "Currently unavailable"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "In stock" })
					]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "recommend",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Customers also bought" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-asin": "UPSELL1",
					className: "amz-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sponsored cable kit" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "a-price",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "a-offscreen",
							children: "EGP 99"
						})
					})]
				})]
			}),
			last ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				rel: "next",
				href: "?page=" + (page + 2),
				children: "Next"
			})
		]
	});
}
function Noon({ page }) {
	const pages = [[
		[
			"Galaxy A55",
			"ج.م",
			"21,500",
			false
		],
		[
			"iPhone 13",
			"جنيه",
			"٢١٥٠٠",
			false
		],
		[
			"Redmi Note 13",
			"ج.م",
			"12,499",
			true
		],
		[
			"OPPO Reno 11",
			"EGP",
			"18,990",
			false
		]
	], [
		[
			"Pixel 8a",
			"ج.م",
			"24,000",
			false
		],
		[
			"Nothing Phone 2a",
			"ج.م",
			"16,750",
			false
		],
		[
			"Realme 12",
			"ج.م",
			"10,200",
			true
		]
	]];
	const rows = pages[Math.min(page, pages.length - 1)] || [];
	const last = page >= pages.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "site-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "noon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mobiles" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-qa": "plp-grid",
				className: "grid",
				children: rows.map(([title, cur, amt, oos]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-qa": "plp-product-box",
					className: "noon-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-qa": "plp-product-box-name",
							title,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/p/" + encodeURIComponent(title),
								children: title
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-qa": "plp-product-box-price",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "currency",
								children: cur
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "amount",
								children: amt
							})]
						}),
						oos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نفذ" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "متوفر" })
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "recommend",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-qa": "plp-product-box",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-qa": "plp-product-box-name",
						title: "Upsell case",
						children: "Upsell case"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-qa": "plp-product-box-price",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "currency",
							children: "ج.م"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "amount",
							children: "199"
						})]
					})]
				})
			}),
			last ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				rel: "next",
				href: "?page=" + (page + 2),
				children: "التالي"
			})
		]
	});
}
var DUBAI = [
	[
		"iPhone 15 128GB",
		"215,500",
		false
	],
	[
		"Galaxy S24",
		"189,000",
		false
	],
	[
		"Pixel 8",
		"142,000",
		false
	],
	[
		"Xperia 10",
		"",
		true
	],
	[
		"iPad 10th",
		"98,500",
		false
	],
	[
		"Watch SE",
		"41,200",
		false
	],
	[
		"Buds FE",
		"12,900",
		false
	],
	[
		"Z Flip 5",
		"210,000",
		false
	]
];
function Dubai({ revealed }) {
	const shown = DUBAI.slice(0, revealed * 4);
	const more = shown.length < DUBAI.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shop",
		"data-infinite-scroll": more ? "1" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "site-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "dubaiphone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid",
				children: shown.map(([title, num, soon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "nf-product-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "dp-product-title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/shop/" + encodeURIComponent(title),
								children: title
							})
						}),
						num ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "price-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: num
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EGP" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EGP" })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Coming soon" }),
						soon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "soon",
							children: "Soon"
						}) : null
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "recommend",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "nf-product-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "dp-product-title",
						children: "Recommended cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "price-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: "350"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EGP" })]
					})]
				})
			})
		]
	});
}
var SHOPIFY = [
	[
		"Linen shirt",
		"/products/linen-shirt",
		"1,250 EGP EGP",
		false
	],
	[
		"Wool coat",
		"/products/wool-coat",
		"4,800 EGP",
		false
	],
	[
		"Canvas tote",
		"/products/canvas-tote",
		"640 EGP",
		true
	],
	[
		"Silk scarf",
		"/products/silk-scarf",
		"890 EGP",
		false
	],
	[
		"Leather belt",
		"/products/leather-belt",
		"1,100 EGP",
		false
	],
	[
		"Cotton trousers",
		"/products/cotton-trousers",
		"1,750 EGP",
		false
	],
	[
		"Cap",
		"/products/cap",
		"420 EGP",
		true
	],
	[
		"Knit vest",
		"/products/knit-vest",
		"1,540 EGP",
		false
	]
];
function Shopify({ revealed }) {
	const shown = SHOPIFY.slice(0, revealed * 4);
	const more = shown.length < SHOPIFY.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
				name: "shopify-checkout-api-token",
				content: "demo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "site-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Northroom" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Collection" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid",
				children: shown.map(([title, href, price, oos]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "product-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "product-card__title",
								children: title
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "price",
							children: price
						}),
						oos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: true,
							className: "sold-out",
							children: "Sold out"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							children: "Add to cart"
						})
					]
				}, href))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "recommend",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "product-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/products/gift-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "product-card__title",
							children: "Recommended gift card"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "price",
						children: "500 EGP"
					})]
				})
			}),
			more ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "load-more",
				children: "Load more"
			}) : null
		]
	});
}
function Sharaf({ page }) {
	const pages = [[
		[
			"LG 55 inch TV",
			"AED 1,899",
			false
		],
		[
			"Dyson V15",
			"AED 2,499",
			false
		],
		[
			"Bose SoundLink",
			"AED 699",
			true
		],
		[
			"Ninja blender",
			"AED 549",
			false
		]
	], [
		[
			"iPad Air",
			"AED 2,299",
			false
		],
		[
			"Kindle Scribe",
			"AED 1,199",
			false
		],
		[
			"GoPro Hero",
			"AED 1,499",
			false
		]
	]];
	const rows = pages[Math.min(page, pages.length - 1)] || [];
	const last = page >= pages.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "site-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sharaf DG" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hits" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid",
				children: rows.map(([title, price, oos]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "ais-Hits-item",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/product/" + encodeURIComponent(title),
							children: title
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "price",
							children: price
						}),
						oos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Out of stock" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "In stock" })
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "ais-Pagination",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: last ? "ais-Pagination-item--next ais-Pagination-item--disabled" : "ais-Pagination-item--next",
					children: last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "?page_number=" + (page + 2),
						children: "Next"
					})
				})
			})
		]
	});
}
function Woo({ page }) {
	const pages = [[
		[
			"Ceramic pour-over",
			"EGP 640",
			false,
			false
		],
		[
			"Stoneware mug",
			"EGP 220",
			true,
			false
		],
		[
			"Oak tray",
			"EGP 890",
			false,
			true
		],
		[
			"Linen napkin set",
			"EGP 310",
			false,
			false
		]
	], [[
		"Brass spoon",
		"EGP 180",
		false,
		false
	], [
		"Glass carafe",
		"EGP 470",
		false,
		false
	]]];
	const rows = pages[Math.min(page, pages.length - 1)] || [];
	const last = page >= pages.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shop woocommerce",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "site-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Kiln" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "products grid",
				children: rows.map(([title, price, sale, attr]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "product",
					"data-inventory-status": attr ? "outofstock" : "instock",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "woocommerce-loop-product__title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/product/" + encodeURIComponent(title),
							children: title
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "price",
						children: sale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("del", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "woocommerce-Price-amount",
							children: "EGP 280"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ins", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "woocommerce-Price-amount",
							children: price
						}) })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "woocommerce-Price-amount",
							children: price
						})
					})]
				}, title))
			}),
			last ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "next page-numbers",
				href: "/page/" + (page + 2),
				children: "Next"
			})
		]
	});
}
function Unknown({ page }) {
	const pages = [[
		[
			"Clay cup",
			"890 EGP",
			""
		],
		[
			"Ash bowl",
			"640 EGP",
			""
		],
		[
			"Night lamp",
			"1,450 EGP",
			"exhausted"
		],
		[
			"Oak stool",
			"3,200 EGP",
			""
		],
		[
			"Linen overshirt",
			"1,100 EGP",
			""
		],
		[
			"Wool throw",
			"2,040 EGP",
			"exhausted"
		],
		[
			"Brass hook",
			"260 EGP",
			""
		],
		[
			"Stone plate",
			"480 EGP",
			""
		]
	], [
		[
			"Ink poster",
			"320 EGP",
			""
		],
		[
			"Cedar box",
			"1,780 EGP",
			"exhausted"
		],
		[
			"Glass tumbler",
			"210 EGP",
			""
		],
		[
			"Hemp tote",
			"540 EGP",
			""
		]
	]];
	const rows = pages[Math.min(page, pages.length - 1)] || [];
	const last = page >= pages.length - 1;
	const ld = page === 0 ? JSON.stringify({
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: [{
			"@type": "Product",
			name: "Linen overshirt",
			offers: {
				price: "1100",
				priceCurrency: "EGP",
				availability: "https://schema.org/OutOfStock"
			}
		}]
	}) : "";
	const cards = rows.map(([title, price, flag]) => {
		const badge = flag && page === 0 ? "<span class=\"badge\">Sold out</span>" : "";
		return "<article class=\"" + (flag ? "tile exhausted" : "tile") + "\"><h3><a href=\"/goods/" + encodeURIComponent(title) + "\">" + title + "</a></h3><span class=\"cost\">" + price + "</span>" + badge + "</article>";
	}).join("");
	const next = last ? "" : "<a rel=\"next\" href=\"?page=" + (page + 2) + "\">Next</a>";
	const html = (ld ? "<template class=\"jsonld\">" + ld + "</template>" : "") + "<header class=\"site-header\"><strong>Atelier</strong><span>All goods</span></header><div class=\"catalog grid\">" + cards + "</div><aside class=\"recommend\"><article class=\"tile\"><h3>Related candle</h3><span class=\"cost\">190 EGP</span></article><article class=\"tile\"><h3>Related soap</h3><span class=\"cost\">95 EGP</span></article></aside>" + next;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "shop",
		dangerouslySetInnerHTML: { __html: html }
	});
}
/** Egyptian, Arabic, and Latin price parsing ported from Harvest. */
var CURRENCY = "(?:(?<![A-Za-z\\u0600-\\u06FF])(?:EGP|USD|SAR|AED|EUR|GBP|CAD|AUD|QAR|KWD|BHD|OMR|TRY|INR|LE|L\\.E\\.?|جنيهات|جنيهين|جنيهًا|جنيهآ|جنيها|جنيةات|جنيات|جنيةًا|جنيةآ|جنيه|جنية|جنيه\\s*مصري|جنيه\\s*مصرى|جنيه\\s*مصريًا|جنية\\s*مصري|جنية\\s*مصرى|ج\\.م\\.|ج\\.م|ج\\s*م|جم|قروش|قرش|ريال|درهم|دينار)(?![A-Za-z\\u0600-\\u06FF])|E£|£E|US\\$|\\$|€|£|¥|₹|د\\.إ|ر\\.س|ج\\.م)";
var NUMBER = "(?:\\d{1,3}(?:[,\\s]\\d{3})+(?:[.,]\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?)";
var PRICE_RE = new RegExp("(?:" + CURRENCY + "\\s*" + NUMBER + "|" + NUMBER + "\\s*" + CURRENCY + "|" + NUMBER + "\\s*(?:EGP|SAR|AED|USD)+)", "i");
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
	return (m ? norm(m[0]) : s.slice(0, 56)).replace(/(EGP|SAR|AED|USD)(?:\1)+/gi, "$1").replace(/(\d)([A-Za-z])/g, "$1 $2");
}
var PRICE_HINT = "[class*=\"price\" i], [class*=\"amount\" i], [class*=\"money\" i], [class*=\"cost\" i], [itemprop=\"price\"], [data-price], [data-price-amount]";
var HIJACK_SEL = "[class*=\"recommend\" i],[id*=\"recommend\" i],[class*=\"upsell\" i],[class*=\"up-sell\" i],[class*=\"related\" i],[id*=\"related\" i],[class*=\"recently\" i],[class*=\"cross-sell\" i],[class*=\"crosssell\" i],[class*=\"also-like\" i],[class*=\"you-may\" i],[class*=\"wishlist\" i],[data-recommendations]";
var OOS_RE = new RegExp([
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
	"غيرمتوفر",
	"غيرمتاح",
	"نفذ",
	"نفد",
	"نفدت",
	"مباع",
	"soldout",
	"comingsoon"
].join("|"), "i");
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
function qsAll(root, sel) {
	try {
		return Array.from(root.querySelectorAll(sel));
	} catch {
		return [];
	}
}
function qs(root, sel) {
	try {
		return root.querySelector(sel);
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
	return (typeof el.className === "string" ? el.className : el.getAttribute("class") || "").split(/\s+/).filter((c) => c && c.length < 40);
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
				why.push(n + "=\"" + v + "\"");
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
			why.push("badge \"" + t.slice(0, 32) + "\"");
			break;
		}
	}
	const buys = qsAll(card, "a,button,[role='button']");
	for (const el of buys) {
		const label = keyOf([
			el.getAttribute("aria-label") || "",
			textOf(el),
			typeof el.className === "string" ? el.className : ""
		].join(" "));
		if (!label) continue;
		if (OOS_RE.test(label) || /soldout|outofstock/.test(label)) {
			hardOos = true;
			score += 3;
			why.push("buy control says sold out");
			break;
		}
		if (BUY_RE.test(label)) {
			if (el.disabled || el.getAttribute("aria-disabled") === "true" || /(^|[\s_-])disabled([\s_-]|$)/i.test(typeof el.className === "string" ? el.className : "")) {
				score += 2;
				why.push("add to cart disabled");
			}
		}
	}
	if (qs(card, "[class*=\"waitlist\" i], input[name*=\"notify\" i]")) {
		hardOos = true;
		score += 3;
		why.push("notify / waitlist");
	}
	return {
		score,
		hardOos,
		hardIn,
		why: why.slice(0, 4),
		tokens: Array.from(tokens)
	};
}
function listing(partial) {
	const ev = partial.card ? evidence(partial.card) : {
		score: 0,
		hardOos: false,
		hardIn: false,
		why: [],
		tokens: []
	};
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
function scrapeAmazon(root) {
	const items = [];
	for (const card of qsAll(root, "div[data-asin]:not([data-asin=\"\"])")) {
		if (skipCard(card)) continue;
		if (card.closest(".a-carousel-card")?.getAttribute("aria-hidden") === "true") continue;
		const title = textOf(qs(card, "h2 span, h2, .a-size-medium"));
		if (junkTitle(title)) continue;
		const off = qs(card, ".a-price .a-offscreen");
		let rating = "";
		let reviews = "";
		const rm = textOf(qs(card, ".a-icon-alt")).match(/\d+(?:[.,]\d+)?/);
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
		items.push(listing({
			title,
			price: priceFrom(off, card),
			card,
			url: hrefOf(card),
			rating,
			reviews
		}));
	}
	return unique(items);
}
function scrapeNoon(root) {
	const items = [];
	let cards = qsAll(root, "[data-qa=\"plp-grid\"] [data-qa=\"plp-product-box\"]");
	if (!cards.length) cards = qsAll(root, "[data-qa=\"plp-product-box\"]");
	for (const card of cards) {
		if (skipCard(card)) continue;
		const titleEl = qs(card, "[data-qa=\"plp-product-box-name\"], [data-qa$=\"product-box-name\"]");
		const title = norm(titleEl && (titleEl.getAttribute("title") || titleEl.textContent) || "");
		if (junkTitle(title)) continue;
		const box = qs(card, "[data-qa=\"plp-product-box-price\"], [data-qa$=\"product-box-price\"]");
		let price = "N/A";
		if (box) {
			const cur = qs(box, "[class*=\"currency\"]");
			const amt = qs(box, "[class*=\"amount\"]");
			if (amt) price = cleanPrice((cur ? textOf(cur) + " " : "") + textOf(amt));
			else if (looksPrice(textOf(box))) price = cleanPrice(textOf(box));
		}
		items.push(listing({
			title,
			price,
			card,
			url: hrefOf(card)
		}));
	}
	return unique(items);
}
function scrapeDubaiPhone(root) {
	const items = [];
	for (const card of qsAll(root, "article.nf-product-card, .nf-product-card")) {
		if (skipCard(card)) continue;
		const title = textOf(qs(card, ".dp-product-title, h3, a[href]"));
		if (junkTitle(title)) continue;
		let price = "N/A";
		const numEl = qsAll(card, "[class*=\"tabular-nums\"]").find((e) => /^[\d٠-٩][\d,.٠-٩\s]*$/.test(textOf(e)));
		if (numEl) {
			const rowText = textOf(numEl.closest("div"));
			price = looksPrice(rowText) ? cleanPrice(rowText) : textOf(numEl);
		}
		const row = listing({
			title,
			price,
			card,
			url: hrefOf(card)
		});
		if (price === "N/A") {
			row.oos = true;
			row.hardOos = true;
			row.why = row.why ? row.why + "; no price (coming soon)" : "no price (coming soon)";
		}
		items.push(row);
	}
	return unique(items);
}
function scrapeShopify(root) {
	const items = [];
	const cards = qsAll(root, ".product-card, [data-product-card], .card-wrapper, .grid-product, .product-item, .t4s-product");
	for (const card of cards) {
		if (skipCard(card)) continue;
		const titleEl = qs(card, ".product-card__title, .card__heading, h3, h2, a[href*='/products/']");
		const title = textOf(titleEl);
		if (junkTitle(title)) continue;
		let price = priceFrom(qs(card, ".price-item--sale, .price, .money, .product-card__price"));
		const was = qs(card, "s, del, .price-item--compare");
		if (was && looksPrice(textOf(was))) price += " (was " + cleanPrice(textOf(was)) + ")";
		items.push(listing({
			title,
			price,
			card,
			url: hrefOf(titleEl) || hrefOf(card)
		}));
	}
	return unique(items);
}
function scrapeWoo(root) {
	const items = [];
	for (const card of qsAll(root, "li.product, ul.products li.product, .product.type-product")) {
		if (skipCard(card)) continue;
		const title = textOf(qs(card, ".woocommerce-loop-product__title a, .woocommerce-loop-product__title, h2 a, h2"));
		if (junkTitle(title)) continue;
		const neu = qs(card, "ins .woocommerce-Price-amount, ins .amount");
		const old = qs(card, "del .woocommerce-Price-amount, del .amount");
		const normal = qs(card, ".woocommerce-Price-amount, .amount, .price");
		let price = priceFrom(neu || normal);
		if (neu && old && looksPrice(textOf(old))) price += " (was " + cleanPrice(textOf(old)) + ")";
		items.push(listing({
			title,
			price,
			card,
			url: hrefOf(card)
		}));
	}
	return unique(items);
}
function scrapeSharaf(root) {
	return scrapeGeneric(root, ".ais-Hits-item, .ais-InfiniteHits-item");
}
function scrapeDubizzle(root) {
	const items = [];
	for (const card of qsAll(root, "li[aria-label=\"Listing\"]")) {
		if (skipCard(card)) continue;
		const title = textOf(qs(card, "[aria-label=\"Title\"]"));
		if (junkTitle(title)) continue;
		const box = qs(card, "[aria-label=\"Price\"]");
		items.push(listing({
			title,
			price: priceFrom(box),
			card,
			url: hrefOf(card)
		}));
	}
	return unique(items);
}
function scrapeGeneric(root, sel) {
	const items = [];
	for (const card of qsAll(root, sel)) {
		if (skipCard(card)) continue;
		const titleEl = findTitleEl(card);
		const title = titleEl?.tagName === "IMG" ? norm(titleEl.getAttribute("alt")) : textOf(titleEl);
		if (junkTitle(title)) continue;
		items.push(listing({
			title,
			price: priceFrom(findPriceEl(card)),
			card,
			url: hrefOf(titleEl) || hrefOf(card)
		}));
	}
	return unique(items);
}
function scrapeJsonLd(root) {
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
		if ((typeof t === "string" ? t : Array.isArray(t) ? t.join(",") : "").toLowerCase().includes("product") && typeof rec.name === "string" && !junkTitle(rec.name)) {
			const offers = Array.isArray(rec.offers) ? rec.offers : rec.offers ? [rec.offers] : [];
			let price = "N/A";
			let oos = false;
			for (const o of offers) {
				if (!o || typeof o !== "object") continue;
				const offer = o;
				const av = String(offer.availability || "");
				if (/outofstock|soldout|discontinued/i.test(av)) oos = true;
				const p = offer.price ?? offer.lowPrice;
				if (p != null && price === "N/A") price = (offer.priceCurrency ? String(offer.priceCurrency) + " " : "") + String(p);
			}
			if (/outofstock|soldout/i.test(String(rec.availability || ""))) oos = true;
			items.push({
				title: norm(rec.name),
				price,
				oos
			});
		}
		if (rec["@graph"]) walk(rec["@graph"]);
		if (rec.itemListElement) walk(rec.itemListElement);
		if (rec.item) walk(rec.item);
	};
	for (const s of qsAll(root, "script[type=\"application/ld+json\"], template.jsonld")) {
		const raw = s.tagName === "TEMPLATE" ? s.innerHTML : s.textContent || "";
		try {
			walk(JSON.parse(raw || "null"));
		} catch {}
	}
	return items;
}
function classSig(el) {
	const classes = classTokens(el).filter((c) => !/^(flex|grid|block|hidden|relative|absolute)$/i.test(c)).filter((c) => !/exhausted|sold|oos|disabled|unavailable|out-of-stock/i.test(c)).slice(0, 4).sort();
	return el.tagName.toLowerCase() + (classes.length ? "." + classes.join(".") : "");
}
function compile(root) {
	const priceEls = [];
	for (const el of qsAll(root, PRICE_HINT)) if (looksPrice(textOf(el)) && !inHijackZone(el)) priceEls.push(el);
	if (priceEls.length < 2) for (const el of qsAll(root, "span,div,p,b,strong")) {
		if (el.childElementCount > 3 || inHijackZone(el)) continue;
		const t = textOf(el);
		if (t.length <= 56 && looksPrice(t)) priceEls.push(el);
	}
	const clusters = [];
	const consider = (cards, signature, score) => {
		const clean = cards.filter((c) => !skipCard(c));
		if (clean.length < 2) return;
		if (/recommend|upsell|related/i.test(signature)) return;
		clusters.push({
			cards: clean,
			score,
			signature
		});
	};
	for (const anchor of priceEls) {
		let node = anchor;
		let depth = 0;
		while (node && node !== root && depth < 8) {
			const parent = node.parentElement;
			if (!parent) break;
			const sig = classSig(node);
			const siblings = Array.from(parent.children).filter((c) => c.tagName === node.tagName && classSig(c) === sig);
			if (siblings.length >= 2) consider(siblings, sig, siblings.length * 4 - depth);
			node = parent;
			depth += 1;
		}
	}
	clusters.sort((a, b) => b.score - a.score);
	const best = clusters[0];
	if (!best) {
		const ld = scrapeJsonLd(root);
		return {
			items: ld.map((x) => listing({
				title: x.title,
				price: looksPrice(x.price) ? cleanPrice(x.price) : x.price,
				oos: x.oos,
				card: null,
				why: x.oos ? "json-ld" : ""
			})),
			blueprint: ld.length ? {
				card: "",
				title: "Product.name",
				price: "Offer.price",
				note: "JSON-LD Product nodes"
			} : null
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
	for (const card of qsAll(root, best.signature.split("|")[0] || best.signature)) {
		if (skipCard(card)) continue;
		if (classSig(card) !== best.signature && !card.matches(best.signature)) continue;
		const titleEl = qs(card, titleSel) || findTitleEl(card);
		const title = titleEl?.tagName === "IMG" ? norm(titleEl.getAttribute("alt")) : textOf(titleEl);
		if (junkTitle(title)) continue;
		const pEl = qs(card, priceSel) || findPriceEl(card);
		items.push(listing({
			title,
			price: priceFrom(pEl),
			card,
			url: hrefOf(titleEl) || hrefOf(card)
		}));
	}
	return {
		items: unique(items),
		blueprint: {
			card: best.signature,
			title: titleSel,
			price: priceSel,
			note: "Compiled from source · " + best.signature + " × " + best.cards.length
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
	for (const [k, c] of counts) if (c > n) {
		best = k;
		n = c;
	}
	return best;
}
function detectPlatform(root, host) {
	const h = host.toLowerCase();
	if (h.includes("amazon.") || qs(root, "div[data-asin] h2")) return "amazon";
	if (h.includes("noon.com") || qs(root, "[data-qa=\"plp-product-box\"]")) return "noon";
	if (h.includes("dubizzle") || qs(root, "li[aria-label=\"Listing\"]")) return "dubizzle";
	if (h.includes("dubaiphone") || qs(root, ".nf-product-card")) return "dubaiphone";
	if (h.includes("samsung.") || qs(root, ".pd21-product-card__item")) return "samsung";
	if (h.includes("sharafdg") || qs(root, ".ais-Hits-item, .ais-InfiniteHits-item")) return "sharaf";
	if (h.includes("vodafone") || qs(root, ".vf-product-card")) return "vodafone";
	if (qs(root, ".yalla-product-card, [data-yalla-product-id]")) return "yalla";
	if (qs(root, "meta[name='shopify-checkout-api-token'], .product-card, [data-product-card]")) return "shopify";
	if (qs(root, ".woocommerce, .woocommerce-loop-product__title, ul.products li.product")) return "woocommerce";
	if (qs(root, "div.product-thumb")) return "opencart";
	if (qs(root, "article.product-miniature")) return "prestashop";
	if (qs(root, "li.product-item, .product-item-info")) return "magento";
	if (qs(root, ".ut2-gl__item")) return "cscart";
	if (qs(root, "script[type=\"application/ld+json\"], template.jsonld")) return "json-ld";
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
function collect(root, platform) {
	const scrapers = {
		amazon: () => scrapeAmazon(root),
		noon: () => scrapeNoon(root),
		dubizzle: () => scrapeDubizzle(root),
		dubaiphone: () => scrapeDubaiPhone(root),
		shopify: () => scrapeShopify(root),
		woocommerce: () => scrapeWoo(root),
		sharaf: () => scrapeSharaf(root)
	};
	let items = scrapers[platform] ? scrapers[platform]() : SPEC[platform] ? scrapeGeneric(root, SPEC[platform]) : [];
	let blueprint = null;
	let used = platform;
	if (items.length < 2) {
		const compiled = compile(root);
		if (compiled.items.length > items.length) {
			items = compiled.items;
			blueprint = compiled.blueprint;
			used = compiled.blueprint?.card ? "compiled" : platform === "json-ld" ? "json-ld" : "compiled";
		}
	}
	return {
		items,
		blueprint,
		platform: used
	};
}
function learn(items, host, prev) {
	const conf = items.filter((x) => x.hardOos && !x.hardIn && x.card);
	const ok = items.filter((x) => !x.hardOos && !x.oos && x.card);
	if (conf.length < 2 || ok.length < 2) return {
		model: prev,
		fresh: []
	};
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
		if (oRate >= .6 && iRate <= .15 && (freq.get(t) || 0) <= items.length * .6 && t.length > 2) rules.push(t);
	}
	for (const [t, n] of inst) if (n / ok.length >= .6 && !oos.has(t)) neg.push(t);
	if (prev) {
		for (const t of prev.rules) if (!rules.includes(t)) rules.push(t);
		for (const t of prev.neg) if (!neg.includes(t)) neg.push(t);
	}
	const fresh = rules.filter((t) => !prev?.rules.includes(t));
	if (!rules.length) return {
		model: prev,
		fresh: []
	};
	return {
		model: {
			host,
			rules,
			neg
		},
		fresh
	};
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
		} else if (neg) it.score -= 1;
		if (!it.hardIn && it.score >= 2) it.oos = true;
	}
}
function applyJsonLd(items, root) {
	const ld = scrapeJsonLd(root);
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
function countSkipped(root) {
	return qsAll(root, [
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
	].join(",")).filter((el) => inHijackZone(el)).length;
}
function scrapePage(root, host, prev, includeOos) {
	const collected = collect(root, detectPlatform(root, host));
	applyJsonLd(collected.items, root);
	const learned = learn(collected.items, host, prev);
	applyModel(collected.items, learned.model);
	const soldOut = collected.items.filter((it) => it.oos).length;
	const items = (includeOos ? collected.items : collected.items.filter((it) => !it.oos)).map((it) => ({
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
		skippedZone: countSkipped(root),
		model: learned.model,
		learned: learned.fresh
	};
}
function findLoadMore(root) {
	const el = qs(root, "button.load-more, a.load-more, [data-load-more], button[class*=\"load-more\" i], .pd21-product-finder__view-more");
	if (!el || inHijackZone(el) || inChrome(el)) return null;
	if (el.disabled || el.getAttribute("aria-disabled") === "true") return null;
	if (el.classList.contains("is-hidden")) return null;
	return el;
}
function findNextHref(root) {
	const ais = qs(root, ".ais-Pagination-item--next:not(.ais-Pagination-item--disabled) a[href]");
	if (ais) return ais.getAttribute("href");
	const labeled = qs(root, "a[rel=\"next\"][href], a.next.page-numbers[href], a.pagination__next[href], a.next[href], a[aria-label*=\"التالي\"][href]");
	if (!labeled) return null;
	if (labeled.getAttribute("aria-disabled") === "true") return null;
	if (labeled.closest(".disabled, .ais-Pagination-item--disabled")) return null;
	return labeled.getAttribute("href");
}
function detectAdvance(root) {
	if (findLoadMore(root)) return { kind: "load-more" };
	const href = findNextHref(root);
	if (href) return {
		kind: "next",
		href
	};
	if (qs(root, "[data-infinite-scroll]")) return { kind: "scroll" };
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
	if (model?.rules.length) header += "**Learned sold-out markers:** " + model.rules.slice(0, 8).map((r) => "`" + r + "`").join(" ") + "\n\n";
	const cols = [
		"#",
		"Title",
		"Price"
	].concat(withRev ? ["Rating", "Reviews"] : [], withOos ? ["Stock"] : []);
	header += "| " + cols.join(" | ") + " |\n|" + cols.map(() => "---").join("|") + "|\n";
	const rows = items.map((it, i) => {
		const c = [
			String(i + 1),
			esc(it.title),
			esc(it.price)
		];
		if (withRev) c.push(it.rating ? it.rating + "★" : "—", esc(it.reviews || "—"));
		if (withOos) c.push(it.oos ? "sold out" : "in stock");
		return "| " + c.join(" | ") + " |";
	});
	return header + rows.join("\n") + "\n";
}
function esc(s) {
	return String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}
function toCsv(items) {
	const lines = [[
		"title",
		"price",
		"stock",
		"rating",
		"reviews",
		"url",
		"why"
	].join(",")];
	for (const it of items) lines.push([
		it.title,
		it.price,
		it.oos ? "sold out" : "in stock",
		it.rating,
		it.reviews,
		it.url,
		it.why
	].map((v) => "\"" + String(v).replace(/"/g, "\"\"") + "\"").join(","));
	return lines.join("\n");
}
var PASTE_SAMPLE = `<div class="catalog">
  <article class="tile"><h3><a href="/p/cedar-chair">Cedar chair</a></h3><span class="cost">2,400 EGP</span></article>
  <article class="tile"><h3><a href="/p/ash-bench">Ash bench</a></h3><span class="cost">3,150 EGP</span></article>
  <article class="tile exhausted"><h3><a href="/p/oak-table">Oak table</a></h3><span class="cost">8,900 EGP</span><span class="badge">Sold out</span></article>
</div>
<aside class="recommend"><article class="tile"><h3>Related cushion</h3><span class="cost">420 EGP</span></article></aside>`;
function Home() {
	const stageRef = (0, import_react.useRef)(null);
	const stopRef = (0, import_react.useRef)(false);
	const [catalog, setCatalog] = (0, import_react.useState)("amazon");
	const [page, setPage] = (0, import_react.useState)(0);
	const [revealed, setRevealed] = (0, import_react.useState)(1);
	const [paste, setPaste] = (0, import_react.useState)(PASTE_SAMPLE);
	const [includeOos, setIncludeOos] = (0, import_react.useState)(false);
	const [maxPages, setMaxPages] = (0, import_react.useState)(8);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("Idle. Pick a store, then detect or crawl.");
	const [items, setItems] = (0, import_react.useState)([]);
	const [platform, setPlatform] = (0, import_react.useState)("");
	const [blueprint, setBlueprint] = (0, import_react.useState)(null);
	const [model, setModel] = (0, import_react.useState)(null);
	const [skipped, setSkipped] = (0, import_react.useState)(0);
	const [soldOut, setSoldOut] = (0, import_react.useState)(0);
	const [passes, setPasses] = (0, import_react.useState)(0);
	const host = CATALOGS.find((c) => c.id === catalog)?.host || "pasted.local";
	const visible = includeOos ? items : items.filter((it) => !it.oos);
	function resetView(next) {
		stopRef.current = true;
		setCatalog(next);
		setPage(0);
		setRevealed(1);
		setItems([]);
		setPlatform("");
		setBlueprint(null);
		setModel(null);
		setSkipped(0);
		setSoldOut(0);
		setPasses(0);
		setRunning(false);
		setStatus("Idle. Pick a store, then detect or crawl.");
	}
	function readStage(prev) {
		const root = stageRef.current;
		if (!root) return null;
		return scrapePage(root, host, prev, true);
	}
	function detect() {
		stopRef.current = true;
		setRunning(false);
		const res = readStage(null);
		if (!res) return;
		setItems(res.items);
		setPlatform(res.platform);
		setBlueprint(res.blueprint);
		setModel(res.model);
		setSkipped(res.skippedZone);
		setSoldOut(res.soldOut);
		setPasses(1);
		const kept = includeOos ? res.items.length : res.items.filter((it) => !it.oos).length;
		setStatus(res.platform + " · " + kept + " shown · " + res.soldOut + " sold out · " + res.skippedZone + " upsell rows skipped");
	}
	async function crawl() {
		stopRef.current = false;
		setRunning(true);
		setItems([]);
		setPasses(0);
		let merged = [];
		let learned = null;
		let seenBp = null;
		let plat = "";
		let pageN = 0;
		let shown = 1;
		let pass = 0;
		const cap = Math.max(1, Math.min(20, maxPages || 1));
		(0, import_react_dom.flushSync)(() => {
			setPage(0);
			setRevealed(1);
		});
		while (!stopRef.current && pass < cap) {
			await wait(pass === 0 ? 40 : 420);
			if (stopRef.current) break;
			(0, import_react_dom.flushSync)(() => {
				setPage(pageN);
				setRevealed(shown);
			});
			const res = readStage(learned);
			if (!res) break;
			pass += 1;
			learned = res.model;
			seenBp = seenBp || res.blueprint;
			plat = res.platform;
			const before = merged.length;
			merged = mergeListings(merged, res.items);
			const added = merged.length - before;
			setItems(merged.slice());
			setPlatform(plat);
			setBlueprint(seenBp);
			setModel(learned);
			setSkipped(res.skippedZone);
			setSoldOut(merged.filter((it) => it.oos).length);
			setPasses(pass);
			const advance = stageRef.current ? detectAdvance(stageRef.current) : { kind: "done" };
			const kept = includeOos ? merged.length : merged.filter((it) => !it.oos).length;
			setStatus("Pass " + pass + " · +" + added + " · " + kept + " shown · " + plat + (advance.kind === "done" ? " · end" : " · " + advance.kind));
			if (advance.kind === "done") break;
			if (advance.kind === "next") pageN += 1;
			else shown += 1;
		}
		setRunning(false);
		if (stopRef.current) setStatus((s) => s.replace(/ · end$/, "") + " · stopped");
	}
	function download(filename, text, type) {
		const blob = new Blob([text], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}
	function exportMd() {
		const rows = includeOos ? items : items.filter((it) => !it.oos);
		download(host.replace(/\W+/g, "_") + "-listings.md", toMarkdown(rows, "https://" + host + "/", platform || "listings", model), "text/markdown");
	}
	function exportCsv() {
		const rows = includeOos ? items : items.filter((it) => !it.oos);
		download(host.replace(/\W+/g, "_") + "-listings.csv", toCsv(rows), "text/csv");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-faint uppercase",
							children: "Local extractor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-4xl leading-none font-medium tracking-tight text-fg",
							children: "Open Data Scraper"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: "The list walker, plus store parsers, Arabic prices, sold-out learning, and automatic next, load-more, and scroll."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-3 gap-2 text-center sm:min-w-72",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Shown",
							value: String(visible.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Sold out",
							value: String(soldOut)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Passes",
							value: String(passes)
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-4 lg:grid-cols-[13.5rem_minmax(0,1fr)_22rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible",
						children: [CATALOGS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => resetView(c.id),
							className: "min-h-11 shrink-0 rounded-lg border px-3 py-2 text-left transition-colors duration-150 lg:w-full " + (catalog === c.id ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg hover:bg-surface-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs leading-snug " + (catalog === c.id ? "text-accent-fg/80" : "text-faint"),
								children: c.host
							})]
						}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => resetView("paste"),
							className: "min-h-11 shrink-0 rounded-lg border px-3 py-2 text-left lg:w-full " + (catalog === "paste" ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg hover:bg-surface-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium",
								children: "Pasted HTML"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs " + (catalog === "paste" ? "text-accent-fg/80" : "text-faint"),
								children: "Compile any grid"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium text-fg",
									children: "Page being read"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-faint",
									children: host
								})]
							}),
							catalog === "paste" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: paste,
								onChange: (e) => setPaste(e.target.value),
								spellCheck: false,
								className: "mb-3 h-28 w-full resize-y rounded-lg border border-line bg-surface-2 p-3 font-mono text-xs leading-relaxed text-fg outline-none focus:border-accent",
								"aria-label": "HTML to scrape"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm leading-relaxed text-muted",
								children: CATALOGS.find((c) => c.id === catalog)?.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreStage, {
								catalog,
								page,
								revealed,
								paste,
								stageRef
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: detect,
										disabled: running,
										className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-3 text-sm font-medium text-accent-fg transition-opacity duration-150 hover:opacity-90 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Detect"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void crawl(),
										disabled: running,
										className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 px-3 text-sm font-medium text-fg hover:bg-bg disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Crawl"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											stopRef.current = true;
										},
										className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-fg hover:bg-surface-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Stop"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center justify-between gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Include sold-out rows" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: includeOos,
									onChange: (e) => setIncludeOos(e.target.checked),
									className: "size-4 accent-accent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Max passes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 20,
									value: maxPages,
									onChange: (e) => setMaxPages(Number(e.target.value)),
									className: "h-11 w-20 rounded-lg border border-line bg-bg px-2 text-fg outline-none focus:border-accent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								"aria-live": "polite",
								children: status
							}),
							platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-faint",
								children: [
									"Parser ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: platform
									}),
									skipped ? " · " + skipped + " recommendation rows left out" : ""
								]
							}) : null,
							blueprint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "overflow-x-auto rounded-lg bg-bg p-3 font-mono text-xs leading-relaxed text-muted",
								children: blueprint.note + "\ncard  " + blueprint.card + "\ntitle " + blueprint.title + "\nprice " + blueprint.price
							}) : null,
							model?.rules.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-relaxed text-muted",
								children: ["Learned sold-out markers: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: model.rules.slice(0, 6).join(", ")
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: exportMd,
									disabled: !visible.length,
									className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line text-sm text-fg hover:bg-surface-2 disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Markdown"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: exportCsv,
									disabled: !visible.length,
									className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line text-sm text-fg hover:bg-surface-2 disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
										className: "size-4",
										"aria-hidden": "true"
									}), "CSV"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-[28rem] overflow-auto rounded-lg border border-line",
								children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "p-4 text-sm text-faint",
									children: "No rows yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full border-collapse text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "sticky top-0 bg-surface-2 text-xs text-faint",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Title"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Price"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Stock"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-line align-top",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-fg",
														children: it.title
													}),
													it.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-faint",
														children: [
															it.rating,
															" · ",
															it.reviews || "no count"
														]
													}) : null,
													it.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-faint",
														children: it.why
													}) : null
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 whitespace-nowrap tabular-nums text-fg",
												children: it.price
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 whitespace-nowrap " + (it.oos ? "text-sold" : "text-ok"),
												children: it.oos ? "Sold out" : "In stock"
											})
										]
									}, (it.url || it.title) + it.price)) })]
								})
							})
						]
					})
				]
			})]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-surface px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs tracking-wide text-faint uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-display text-2xl leading-none tabular-nums text-fg",
			children: value
		})]
	});
}
function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
//#endregion
export { Home as component };
