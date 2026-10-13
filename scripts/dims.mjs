// Writes lib/imageDims.json with the intrinsic size of every rendered asset (avoids CLS).
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
let sharp;
try { sharp = require("sharp"); } catch { sharp = require("/opt/npm-tools/node_modules/sharp"); }
const out = {};
for (const f of fs.readdirSync("public/img").filter((f) => f.endsWith(".webp")).sort()) {
  const m = await sharp(`public/img/${f}`).metadata();
  out[f.replace(".webp", "")] = { w: m.width, h: m.height };
}
fs.writeFileSync("lib/imageDims.json", JSON.stringify(out, null, 2) + "\n");
console.log(out);
