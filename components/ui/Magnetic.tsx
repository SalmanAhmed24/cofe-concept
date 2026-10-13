"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";

/** Wraps a CTA so it gently follows the cursor (fine pointers only). */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <m.div
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}

export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" className="arrow">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 0 C21.5 13 27 18.5 40 20 C27 21.5 21.5 27 20 40 C18.5 27 13 21.5 0 20 C13 18.5 18.5 13 20 0Z" fill="currentColor" />
    </svg>
  );
}

export function Badge({ className }: { className?: string }) {
  return (
    <div className={`badge ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="badge__ring">
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
        <text fontSize="10.5" letterSpacing="2.6" fill="currentColor" fontWeight="700">
          <textPath href="#badge-circle">100% ARABICA ✦ SLOW STEEPED ✦ 20 HOURS ✦</textPath>
        </text>
      </svg>
      <span className="badge__core">
        <b>100%</b>
        <i>Original</i>
      </span>
    </div>
  );
}
