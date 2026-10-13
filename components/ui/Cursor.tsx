"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** Mint follower dot that swells over anything interactive. Fine pointers only. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"idle" | "link" | "drag">("idle");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const mq = matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    setEnabled(mq.matches);
    if (!mq.matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setMode(t.closest(".cupcol") ? "drag" : t.closest("a,button") ? "link" : "idle");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <m.div
      className={`cursor cursor--${mode}`}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
      animate={{ scale: mode === "idle" ? 0.2 : mode === "link" ? 0.55 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <span>{mode === "drag" ? "drag" : ""}</span>
    </m.div>
  );
}
