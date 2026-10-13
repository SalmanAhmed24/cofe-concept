"use client";

import { useEffect, type RefObject } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type { SplitText as SPLIT } from "gsap/SplitText";

export type GSAPKit = { gsap: typeof GSAP; ScrollTrigger: typeof ST; SplitText: typeof SPLIT };

let kit: Promise<GSAPKit> | null = null;

/**
 * GSAP + ScrollTrigger + SplitText are code-split and fetched once, after first
 * paint. Every scroll animation on the page is set up in idle time anyway, so none
 * of that JavaScript needs to sit in the critical path.
 */
export function loadGSAP(): Promise<GSAPKit> {
  kit ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(([g, st, sp]) => {
    const gsap = g.gsap;
    gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
    gsap.defaults({ ease: "power3.out" });
    return { gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText };
  });
  return kit;
}

let refreshTimer = 0;
/** One debounced ScrollTrigger.refresh() after a burst of deferred setups (pins shift later triggers). */
function scheduleRefresh(k: GSAPKit) {
  clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => k.ScrollTrigger.refresh(), 250);
}

export function onIdle(cb: () => void, timeout = 3000) {
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") {
    const id = ric(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 300);
  return () => clearTimeout(id);
}

/**
 * Like @gsap/react's useGSAP, but the setup runs in its own idle-time task with a
 * scoped gsap.context (auto-reverted on unmount) instead of inside React's commit.
 * Splitting setups into separate idle tasks keeps the main thread free during load.
 */
export function useIdleGSAP(setup: (k: GSAPKit) => void | (() => void), scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    let cancelIdle = () => {};
    // GSAP is fetched on first interaction (or after a grace period), then each
    // component's setup runs in its *own* idle task so they never pile into one long task.
    whenEngaged()
      .then(loadGSAP)
      .then((k) => {
        if (cancelled) return;
        cancelIdle = onIdle(() => {
          if (cancelled || !scope.current) return;
          ctx = k.gsap.context(() => setup(k), scope.current);
          scheduleRefresh(k);
        });
      });
    return () => {
      cancelled = true;
      cancelIdle();
      ctx?.revert();
    };
    // setup is intentionally captured once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Resolves on the visitor's first real interaction (move, touch, wheel, scroll, key). */
let interacted: Promise<void> | null = null;
export function firstInteraction(): Promise<void> {
  interacted ??= new Promise((resolve) => {
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    const done = () => {
      events.forEach((ev) => window.removeEventListener(ev, done));
      document.documentElement.classList.add("has-interacted");
      resolve();
    };
    events.forEach((ev) => window.addEventListener(ev, done, { once: true, passive: true }));
  });
  return interacted;
}

/** First interaction, or a grace period for visitors who just watch the hero. */
export function whenEngaged(graceMs = 8000): Promise<void> {
  return Promise.race([firstInteraction(), new Promise<void>((r) => setTimeout(r, graceMs))]);
}
