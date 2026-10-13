"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { firstInteraction } from "@/lib/gsap";

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

/** Smooth closed blob through N jittered radial points (Catmull-Rom → cubic Bézier). */
function blobPath(seed: number, n = 7, wobble = 0.16) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rad = 50 * (1 - wobble + r() * wobble * 2);
    return [50 + Math.cos(a) * rad, 50 + Math.sin(a) * rad];
  });
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}

/** The liquid, ever-morphing blob that sits behind each hero cup (as in the reference video). */
export function Blob({ seed = 1, className, active = false }: { seed?: number; className?: string; active?: boolean }) {
  const reduce = useReducedMotion();
  // start morphing on first interaction, so per-frame path interpolation never
  // competes with hydration / first paint
  const [awake, setAwake] = useState(false);
  useEffect(() => {
    let alive = true;
    firstInteraction().then(() => alive && setAwake(true));
    return () => {
      alive = false;
    };
  }, []);
  const frames = useMemo(() => {
    const f = [0, 1, 2, 3].map((k) => blobPath(seed * 31 + k * 7));
    return [...f, f[0]];
  }, [seed]);
  return (
    <m.svg
      viewBox="-4 -4 108 108"
      className={className}
      aria-hidden="true"
      animate={{ scale: active ? 1.12 : 1, rotate: active ? 12 : 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
    >
      <m.path
        initial={{ d: frames[0] }}
        animate={{ d: reduce || !awake ? frames[0] : frames }}
        transition={{ duration: 9 + (seed % 3), repeat: Infinity, ease: "easeInOut" }}
        fill="currentColor"
      />
    </m.svg>
  );
}
