"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

export type IcedVariant = "classic" | "vanilla" | "mocha" | "latte";

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

const PALETTE: Record<IcedVariant, { top: string; mid: string; bottom: string; swirl: string; drizzle?: string; cream: number }> = {
  classic: { top: "#e9d3b3", mid: "#8a4a22", bottom: "#4a220e", swirl: "#f1e2c8", cream: 0.18 },
  vanilla: { top: "#f4e6cc", mid: "#c58a4f", bottom: "#8a4f22", swirl: "#fff3dc", drizzle: "#b5651d", cream: 0.3 },
  mocha: { top: "#efe2cd", mid: "#6b3a22", bottom: "#2e150b", swirl: "#f6eadb", drizzle: "#24100a", cream: 0.22 },
  latte: { top: "#f6ecdc", mid: "#e2c39b", bottom: "#9a5a2b", swirl: "#fffaf0", drizzle: "#7a3d18", cream: 0.55 },
};

/** Paints a marbled "milk hitting cold brew" texture onto a canvas. */
function liquidTexture(variant: IcedVariant) {
  const p = PALETTE[variant];
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  const r = rng([...variant].reduce((h, ch) => h * 31 + ch.charCodeAt(0), 7));
  const g = ctx.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, p.top);
  g.addColorStop(p.cream, p.top);
  g.addColorStop(Math.min(0.95, p.cream + 0.25), p.mid);
  g.addColorStop(1, p.bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);

  const W = c.width;
  // soft radial "puff" drawn three times so the texture wraps seamlessly around the glass
  const puff = (x: number, y: number, rad: number, color: string, a: number) => {
    for (const ox of [-W, 0, W]) {
      const gr = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, rad);
      gr.addColorStop(0, color);
      gr.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
      ctx.globalAlpha = a;
      ctx.fillStyle = gr;
      ctx.fillRect(x + ox - rad, y - rad, rad * 2, rad * 2);
    }
  };
  const toRGBA = (hex: string, a = 1) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };
  // milk plumes: tendrils that billow down from the cream layer and thin out
  for (let k = 0; k < 11; k++) {
    let x = r() * W;
    let y = c.height * p.cream * (0.6 + r() * 0.5);
    let rad = 46 + r() * 50;
    const drift = (r() - 0.5) * 3;
    const steps = 40 + Math.floor(r() * 50);
    for (let s2 = 0; s2 < steps; s2++) {
      puff(x, y, rad, toRGBA(p.swirl, 0.9), 0.025 + 0.07 * (1 - s2 / steps));
      x += Math.sin(s2 * 0.18 + k) * 7 + drift;
      y += 4 + r() * 6;
      rad = Math.max(10, rad * (0.985 + r() * 0.02));
      if (r() > 0.97) rad *= 1.35; // billow
    }
  }
  // ice-shadow darkening near the top of the coffee, depth falloff at the bottom
  const shade = ctx.createLinearGradient(0, 0, 0, c.height);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(0.75, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(20,8,2,0.35)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, c.height);
  // syrup drizzle clinging to the glass
  if (p.drizzle) {
    ctx.filter = "blur(1.2px)";
    ctx.strokeStyle = p.drizzle;
    for (let i = 0; i < 10; i++) {
      const x = 40 + r() * (c.width - 80);
      ctx.lineWidth = 3 + r() * 5;
      ctx.globalAlpha = 0.55 + r() * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + (r() - 0.5) * 60, 200, x + (r() - 0.5) * 80, 380, x + (r() - 0.5) * 40, 260 + r() * 500);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.filter = "none";
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

const GLASS = { h: 2.7, rt: 0.86, rb: 0.7 };

type Props = ThreeElements["group"] & { variant: IcedVariant; straw?: boolean };

export function IcedGlass({ variant, straw = variant === "classic", ...props }: Props) {
  const map = useMemo(() => liquidTexture(variant), [variant]);
  const ice = useMemo(() => {
    const r = rng(5 + variant.length);
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + r();
      const rad = 0.2 + r() * 0.36;
      return {
        p: [Math.cos(a) * rad, GLASS.h / 2 - 0.32 + r() * 0.3, Math.sin(a) * rad] as [number, number, number],
        r: [r() * 1.4, r() * 3, r() * 1.4] as [number, number, number],
        s: 0.36 + r() * 0.1,
      };
    });
  }, [variant]);
  const liquidH = GLASS.h * 0.88;
  const topR = GLASS.rb + (GLASS.rt - GLASS.rb) * 0.9;

  return (
    <group {...props} dispose={null}>
      {/* liquid */}
      <mesh position={[0, -GLASS.h / 2 + liquidH / 2 + 0.14, 0]}>
        <cylinderGeometry args={[topR * 0.965, GLASS.rb * 0.95, liquidH - 0.12, 96, 1, true]} />
        <meshPhysicalMaterial map={map} roughness={0.42} clearcoat={0.15} envMapIntensity={0.35} />
      </mesh>
      <mesh position={[0, -GLASS.h / 2 + liquidH + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[topR * 0.965, 64]} />
        <meshStandardMaterial color={PALETTE[variant].top} roughness={0.5} />
      </mesh>
      {/* ice */}
      {ice.map((c, i) => (
        <RoundedBox key={i} args={[c.s, c.s, c.s]} radius={0.07} smoothness={3} position={c.p} rotation={c.r}>
          <meshPhysicalMaterial color="#f2fbff" roughness={0.08} transparent opacity={0.62} clearcoat={1} envMapIntensity={1.6} />
        </RoundedBox>
      ))}
      {/* glass wall */}
      <mesh>
        <cylinderGeometry args={[GLASS.rt, GLASS.rb, GLASS.h, 96, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.04}
          transparent
          opacity={0.16}
          clearcoat={1}
          envMapIntensity={2.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* glass lip */}
      <mesh position={[0, GLASS.h / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GLASS.rt, 0.018, 8, 96]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.5} envMapIntensity={2} />
      </mesh>
      {/* thick glass base */}
      <mesh position={[0, -GLASS.h / 2 + 0.07, 0]}>
        <cylinderGeometry args={[GLASS.rb * 0.99, GLASS.rb, 0.14, 64]} />
        <meshPhysicalMaterial color="#e9f7f2" roughness={0.05} transparent opacity={0.45} envMapIntensity={2} />
      </mesh>
      {straw && (
        <mesh position={[0.28, GLASS.h / 2 + 0.2, -0.1]} rotation={[0.1, 0, -0.2]}>
          <cylinderGeometry args={[0.055, 0.055, 2.4, 24]} />
          <meshStandardMaterial color="#2fd69c" roughness={0.35} />
        </mesh>
      )}
    </group>
  );
}
