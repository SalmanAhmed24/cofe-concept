// Renders the procedural 3D models to transparent WebP images used by the site.
// Usage: (dev server running on :3100)  node scripts/render.mjs [scene ...]
// Requires playwright + sharp (globally available in the build environment).
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const tryReq = (m) => {
  try { return require(m); } catch { return require(`/opt/npm-tools/node_modules/${m}`); }
};
const { chromium } = tryReq("playwright");
const sharp = tryReq("sharp");

const BASE = process.env.STUDIO_URL ?? "http://localhost:3100/studio";
const OUT = path.resolve("public/img");
fs.mkdirSync(OUT, { recursive: true });

const SCENES = {
  "cup-classic": { w: 700, h: 900 },
  "cup-ripple": { w: 700, h: 900 },
  "cup-double": { w: 700, h: 900 },
  "cup-tilt": { w: 900, h: 900 },
  "iced-classic": { w: 700, h: 1000 },
  "iced-vanilla": { w: 700, h: 1000 },
  "iced-mocha": { w: 700, h: 1000 },
  "iced-latte": { w: 700, h: 1000 },
  beans: { w: 1100, h: 800 },
  bean: { w: 300, h: 300 },
  ice: { w: 300, h: 300 },
};

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SCENES);
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ deviceScaleFactor: 2 });
page.on("pageerror", (e) => console.error("pageerror:", e.message));
page.on("console", (m) => m.type() === "error" && console.error("console:", m.text().slice(0, 300)));
for (const name of wanted) {
  const { w, h } = SCENES[name];
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${BASE}?scene=${name}&w=${w}&h=${h}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
  const dataUrl = await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
  const png = Buffer.from(dataUrl.split(",")[1], "base64");
  const file = path.join(OUT, `${name}.webp`);
  const img = name.startsWith("cup-") && name !== "cup-tilt" ? sharp(png) : sharp(png).trim({ threshold: 1 });
  await img.webp({ quality: 86, alphaQuality: 90, effort: 6 }).toFile(file);
  const meta = await sharp(file).metadata();
  console.log(`${name} -> ${meta.width}x${meta.height} ${(fs.statSync(file).size / 1024).toFixed(0)}KB`);
}
await browser.close();
