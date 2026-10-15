import { cp, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const esbuild = require("/tmp/esbuild-tool/node_modules/esbuild");

const root = "/workspace";
const src = path.join(root, "extension-src");
const out = path.join(root, "extension");

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, "icons"), { recursive: true });

await esbuild.build({
  entryPoints: [path.join(src, "content.ts")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "chrome120",
  outfile: path.join(out, "content.js"),
  legalComments: "none",
});

await cp(path.join(src, "manifest.json"), path.join(out, "manifest.json"));
await cp(path.join(src, "popup.html"), path.join(out, "popup.html"));
await cp(path.join(src, "popup.css"), path.join(out, "popup.css"));
await cp(path.join(src, "popup.js"), path.join(out, "popup.js"));
await cp(path.join(src, "background.js"), path.join(out, "background.js"));
await cp(path.join(src, "INSTALL.txt"), path.join(out, "INSTALL.txt"));
await cp(path.join(src, "icons"), path.join(out, "icons"), { recursive: true });

console.log("extension built at", out);
