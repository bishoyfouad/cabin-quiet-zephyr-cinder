import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { EXTENSION_ZIP_BASE64, EXTENSION_ZIP_NAME } from "@/lib/extension-zip";
import { previewPathPrefix } from "@/lib/preview-path-prefix";

export const Route = createFileRoute("/")({ component: Home });

const STEPS = [
  "Unzip the download. Open the folder named open-data-scraper. It contains manifest.json.",
  "Open chrome://extensions and turn on Developer mode.",
  "Click Load unpacked and choose the open-data-scraper folder.",
  "Open a real catalog page, click the extension icon, then Scrape or Crawl.",
];

const COVERAGE = [
  ["Store parsers", "Amazon, Noon, DubaiPhone, Sigma, Dubizzle, Shopify, WooCommerce, Sharaf DG, Samsung, Vodafone, Yalla, OpenCart, PrestaShop, Magento, CS-Cart"],
  ["Unknown shops", "Builds a card, title, and price blueprint from the page itself"],
  ["Sold out", "Badges, disabled add-to-cart, stock attributes, JSON-LD, and a marker learned on the next page"],
  ["Prices", "Arabic and Egyptian currencies, Eastern digits, doubled EGP collapsed"],
  ["Noise", "Recommendation, upsell, and related strips are skipped"],
  ["Paging", "Next link, Algolia, Sigma next, load-more, and infinite scroll. The crawl keeps going after the popup closes"],
  ["Export", "Markdown and CSV of the rows you kept"],
];

function zipUrl(): string {
  if (typeof window === "undefined") return "/open-data-scraper.zip";
  const known = previewPathPrefix(window.location.hostname, window.location.pathname);
  const fromPath = window.location.pathname.match(/^\/hds-[a-z0-9]+-\d+-[a-z0-9]+/i)?.[0];
  const prefix = known || fromPath || "";
  return `${prefix}/open-data-scraper.zip`;
}

function saveBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = EXTENSION_ZIP_NAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function bundledZip(): Blob {
  const binary = atob(EXTENSION_ZIP_BASE64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "application/zip" });
}

function Home() {
  const [note, setNote] = useState("The button saves the zip in your browser. It does not open a new page.");

  async function downloadZip() {
    setNote("Preparing the zip…");
    try {
      const res = await fetch(zipUrl());
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      if (blob.size < 1000) throw new Error("empty");
      saveBlob(blob);
    } catch {
      saveBlob(bundledZip());
    }
    setNote("If Chrome did not show a download, check the downloads bar or the file attached in the chat.");
  }

  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <header className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-faint uppercase">Chrome extension</p>
          <h1 className="mt-2 font-display text-4xl leading-none font-medium tracking-tight">Open Data Scraper</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Load this into Chrome. It reads the product listing you already have open and downloads the rows. It does not run inside this page. Chrome will ask to read the sites you visit. That is how it can see the listing.
          </p>
          <button
            type="button"
            onClick={() => void downloadZip()}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            <Download className="size-4" aria-hidden="true" />
            Download open-data-scraper.zip
          </button>
          <p className="mt-3 text-sm leading-relaxed text-muted" aria-live="polite">
            {note}
          </p>
        </header>

        <section>
          <h2 className="font-display text-2xl font-medium">Install</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 rounded-lg border border-line bg-surface px-3 py-3">
                <span className="font-display text-xl leading-none text-faint">{i + 1}</span>
                <span className="text-sm leading-relaxed text-fg">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium">What the extension does</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-line">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {COVERAGE.map(([name, detail]) => (
                  <tr key={name} className="border-t border-line first:border-t-0">
                    <th className="w-32 bg-surface px-3 py-3 align-top font-medium text-fg">{name}</th>
                    <td className="px-3 py-3 text-muted">{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-sm leading-relaxed text-faint">
          Sold-out rows stay out of the file unless you check Include sold-out rows. Uninstall from chrome://extensions with Remove.
        </p>
      </div>
    </main>
  );
}
