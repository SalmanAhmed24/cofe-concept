import * as THREE from "three";

export type CupVariant = "classic" | "ripple" | "double";

export const CUP_COLORS: Record<CupVariant, { base: string; ink: string; lid: string }> = {
  classic: { base: "#b8622c", ink: "#f4e4c4", lid: "#131413" },
  ripple: { base: "#efe5cf", ink: "#0f3d2e", lid: "#0e1a15" },
  double: { base: "#2b1b13", ink: "#f1dfbd", lid: "#121212" },
};

/** Deterministic PRNG so every render of a cup looks identical (poster == live canvas). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function displayFont() {
  if (typeof document === "undefined") return "Impact, sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
  return v || "Impact, sans-serif";
}

function paperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number, seed = 7) {
  const r = rng(seed);
  for (let i = 0; i < 9000; i++) {
    const x = r() * w;
    const y = r() * h;
    ctx.fillStyle = r() > 0.5 ? `rgba(255,255,255,${alpha * r()})` : `rgba(0,0,0,${alpha * r()})`;
    ctx.fillRect(x, y, 1.6, 1.6);
  }
}

/** Little leaf + wordmark lockup used on every cup. */
function logo(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  // leaf / bean mark
  ctx.save();
  ctx.translate(0, -s * 0.95);
  ctx.rotate(-0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.2, s * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = s * 0.045;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.28);
  ctx.bezierCurveTo(s * 0.09, -s * 0.1, -s * 0.09, s * 0.1, 0, s * 0.28);
  ctx.stroke();
  ctx.restore();
  ctx.font = `${s * 0.95}px ${displayFont()}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MOSSBREW", 0, s * 0.05);
  ctx.font = `600 ${s * 0.13}px system-ui, sans-serif`;
  ctx.fillText("C O L D   ·   C R A F T E D", 0, s * 0.68);
  ctx.restore();
}

function drawClassic(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const c = CUP_COLORS.classic;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#c46b31");
  g.addColorStop(1, "#9c4f22");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  paperGrain(ctx, w, h, 0.08, 3);

  // cream drip running from the rim
  const r = rng(11);
  ctx.fillStyle = c.ink;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const band = h * 0.13;
  let x = 0;
  ctx.lineTo(0, band);
  while (x < w) {
    const width = 70 + r() * 120;
    const len = band + (r() > 0.45 ? 40 + r() * 190 : r() * 30);
    const x2 = Math.min(w, x + width);
    const mid = (x + x2) / 2;
    const rad = Math.min(26, (x2 - x) / 2 - 2);
    ctx.bezierCurveTo(x + 6, band, mid - rad, band + 4, mid - rad, len - rad);
    ctx.arc(mid, len - rad, rad, Math.PI, 0, true);
    ctx.bezierCurveTo(mid + rad, band + 4, x2 - 6, band, x2, band);
    x = x2;
  }
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.fill();

  // bottom wave
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let i = 0; i <= 64; i++) {
    const px = (i / 64) * w;
    ctx.lineTo(px, h * 0.9 + Math.sin((i / 64) * Math.PI * 8) * 12);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  logo(ctx, w * 0.25, h * 0.58, 130, c.ink);
  logo(ctx, w * 0.75, h * 0.58, 130, c.ink);
}

function drawRipple(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const c = CUP_COLORS.ripple;
  ctx.fillStyle = c.base;
  ctx.fillRect(0, 0, w, h);
  paperGrain(ctx, w, h, 0.05, 5);
  // thin green band + mark
  ctx.fillStyle = c.ink;
  ctx.fillRect(0, h * 0.82, w, 18);
  ctx.fillRect(0, h * 0.86, w, 6);
  for (const cx of [w * 0.25, w * 0.75]) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, h * 0.5, 120, 0, Math.PI * 2);
    ctx.fillStyle = c.ink;
    ctx.fill();
    ctx.restore();
    logo(ctx, cx, h * 0.53, 74, c.base);
  }
}

function drawDouble(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const c = CUP_COLORS.double;
  ctx.fillStyle = c.base;
  ctx.fillRect(0, 0, w, h);
  paperGrain(ctx, w, h, 0.06, 9);
  const r = rng(42);
  ctx.strokeStyle = c.ink;
  ctx.fillStyle = c.ink;
  ctx.lineCap = "round";

  // botanical coffee branches: stems, leaves and cherries
  const branch = (x: number, y: number, ang: number, len: number, depth: number) => {
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    const bend = (r() - 0.5) * len * 0.5;
    ctx.lineWidth = 5 - depth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo((x + ex) / 2 + bend, (y + ey) / 2 - bend, ex, ey);
    ctx.stroke();
    const leaves = 3 + Math.floor(r() * 3);
    for (let i = 1; i <= leaves; i++) {
      const t = i / (leaves + 1);
      const lx = x + (ex - x) * t;
      const ly = y + (ey - y) * t;
      const side = i % 2 ? 1 : -1;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(ang + side * 0.9);
      ctx.beginPath();
      ctx.ellipse(22, 0, 24, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.lineTo(42, 0);
      ctx.stroke();
      ctx.restore();
    }
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(ex + (r() - 0.5) * 26, ey + (r() - 0.5) * 26, 8 + r() * 4, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    if (depth < 2) branch(ex, ey, ang + (r() - 0.5) * 1.6, len * 0.62, depth + 1);
  };
  for (let gx = 0; gx < 9; gx++) {
    for (let gy = 0; gy < 4; gy++) {
      const x = (gx + (gy % 2) * 0.5) * (w / 9);
      const y = 200 + gy * 240;
      branch(x, y, -Math.PI / 2 + (r() - 0.5) * 1.8, 130 + r() * 50, 0);
    }
  }
  // label window
  for (const cx of [w * 0.25, w * 0.75]) {
    ctx.save();
    ctx.fillStyle = c.base;
    ctx.beginPath();
    ctx.roundRect(cx - 190, h * 0.39, 380, 250, 125);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = c.ink;
    ctx.stroke();
    ctx.restore();
    logo(ctx, cx, h * 0.53, 88, c.ink);
  }
  ctx.fillStyle = c.ink;
  ctx.fillRect(0, 0, w, 26);
  ctx.fillRect(0, h - 40, w, 40);
}

const cache = new Map<CupVariant, THREE.CanvasTexture>();

export function getCupTexture(variant: CupVariant, anisotropy = 8): THREE.CanvasTexture {
  const hit = cache.get(variant);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  if (variant === "classic") drawClassic(ctx, canvas.width, canvas.height);
  else if (variant === "ripple") drawRipple(ctx, canvas.width, canvas.height);
  else drawDouble(ctx, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.wrapS = THREE.RepeatWrapping;
  tex.offset.x = 0.25; // centre the first logo on the cup front (+z)
  cache.set(variant, tex);
  return tex;
}
