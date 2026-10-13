"use client";

import { useRef } from "react";
import { firstInteraction, useIdleGSAP } from "@/lib/gsap";
import { Sparkle } from "./Magnetic";

/**
 * Infinite ticker. GSAP drives the loop; scroll velocity speeds it up, flips its
 * direction with the scroll direction, and adds a subtle skew.
 */
export function Marquee({ items, reverse = false, className }: { items: string[]; reverse?: boolean; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const track = root.current!.querySelector<HTMLElement>(".marquee__track")!;
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      // park far into the repeat cycle so negative timeScale can run 'backwards' indefinitely
      loop.totalTime(38 * 500);
      if (reverse) loop.timeScale(-1);
      // stay still until the visitor engages — a perpetually moving band would never
      // let the page "visually settle" (Speed Index) and costs frames during load
      loop.pause();
      firstInteraction().then(() => loop.play());
      let dir = reverse ? -1 : 1;
      let settle: gsap.core.Tween | null = null;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          dir = (self.direction === 1 ? 1 : -1) * (reverse ? -1 : 1);
          gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 300, 5)), duration: 0.2, overwrite: true });
          gsap.to(track, { skewX: gsap.utils.clamp(-8, 8, -v / 220), duration: 0.3, overwrite: "auto" });
          settle?.kill();
          settle = gsap.delayedCall(0.25, () => {
            gsap.to(loop, { timeScale: dir, duration: 0.8 });
            gsap.to(track, { skewX: 0, duration: 0.8 });
          });
        },
      });
    },
    root,
  );
  const row = (k: string) => (
    <div className="marquee__group" key={k} aria-hidden={k === "b"}>
      {items.map((t) => (
        <span className="marquee__item" key={t}>
          {t}
          <Sparkle size={22} className="marquee__star" />
        </span>
      ))}
    </div>
  );
  return (
    <div ref={root} className={`marquee ${className ?? ""}`}>
      <div className="marquee__track">{[row("a"), row("b")]}</div>
    </div>
  );
}
