"use client";

import { useEffect } from "react";
import { loadGSAP, onIdle, whenEngaged } from "@/lib/gsap";

/**
 * Lenis inertial scrolling, driven by GSAP's ticker so ScrollTrigger stays in
 * lock-step. Loaded once the visitor engages — native scrolling works until then.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let teardown: (() => void) | undefined;
    let cancelled = false;
    let cancelIdle = () => {};
    whenEngaged().then(() => {
      if (!cancelled) cancelIdle = onIdle(() => void start());
    });
    const start = async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), loadGSAP()]);
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -20 } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const lock = new MutationObserver(() => {
        if (document.documentElement.classList.contains("menu-open")) lenis.stop();
        else lenis.start();
      });
      lock.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      // content-visibility sections get their real height lazily; keep triggers honest
      let lastH = document.body.scrollHeight;
      let t = 0;
      const ro = new ResizeObserver(() => {
        clearTimeout(t);
        t = window.setTimeout(() => {
          const h = document.body.scrollHeight;
          if (Math.abs(h - lastH) > 4) {
            lastH = h;
            ScrollTrigger.refresh();
          }
        }, 200);
      });
      ro.observe(document.body);
      teardown = () => {
        ro.disconnect();
        clearTimeout(t);
        lock.disconnect();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };
    return () => {
      cancelled = true;
      cancelIdle();
      teardown?.();
    };
  }, []);
  return null;
}
