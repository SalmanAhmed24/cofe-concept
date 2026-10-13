"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cup, CUP_POSE } from "./Cup";
import { Lights } from "./Lights";
import { heroState, HERO_CUPS } from "@/lib/heroState";
import type { CupVariant } from "./cupTextures";

type Slot = { x: number; y: number; s: number };

/** world-height the studio camera sees: posters were rendered with exactly this framing */
const STUDIO_H = 2 * CUP_POSE.z * Math.tan(THREE.MathUtils.degToRad(CUP_POSE.fov / 2));

/**
 * Maps each DOM poster box (img[data-cup-slot]) into world space so the live
 * WebGL cups sit pixel-perfectly on top of the static posters they replace.
 */
function useSlots(host: HTMLElement) {
  const size = useThree((s) => s.size);
  const [slots, setSlots] = useState<Slot[]>([]);
  useLayoutEffect(() => {
    const measure = () => {
      const c = host.getBoundingClientRect();
      const k = (2 * CUP_POSE.z * Math.tan(THREE.MathUtils.degToRad(CUP_POSE.fov / 2))) / c.height;
      const els = Array.from(host.parentElement!.querySelectorAll<HTMLElement>("[data-cup-slot]"));
      setSlots(
        els.map((el) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - c.left;
          const cy = r.top + r.height / 2 - c.top;
          return { x: (cx - c.width / 2) * k, y: -(cy - c.height / 2) * k, s: (r.height * k) / STUDIO_H };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, [host, size.width, size.height]);
  return slots;
}

function Cups({ host, onReady }: { host: HTMLElement; onReady: () => void }) {
  const slots = useSlots(host);
  const outer = useRef<(THREE.Group | null)[]>([]);
  const inner = useRef<(THREE.Group | null)[]>([]);
  const anim = useRef(HERO_CUPS.map(() => ({ rot: 0, lift: 0, tx: 0, tz: 0 })));
  const frames = useRef(0);
  const readyFired = useRef(false);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    if (!slots.length) return;
    if (!readyFired.current && ++frames.current > 2) {
      readyFired.current = true;
      onReady();
    }
    const t = state.clock.elapsedTime;
    const { pointer, scroll, hover, velocity, reducedMotion } = heroState;
    // ease the spin in over the first second so it starts exactly at the poster pose
    const ramp = Math.min(1, Math.max(0, (t - 0.6) / 1.4));
    slots.forEach((slot, i) => {
      const o = outer.current[i];
      const n = inner.current[i];
      if (!o || !n) return;
      const a = anim.current[i];
      const hovered = hover === i;
      const spin = reducedMotion ? 0 : (0.42 + (hovered ? 1.1 : 0)) * ramp;
      a.rot += (spin + velocity[i]) * dt;
      velocity[i] *= Math.exp(-dt * 2.2);
      a.lift = THREE.MathUtils.damp(a.lift, hovered ? 1 : 0, 6, dt);
      a.tx = THREE.MathUtils.damp(a.tx, -pointer.y * 0.14, 3, dt);
      a.tz = THREE.MathUtils.damp(a.tz, -pointer.x * 0.1, 3, dt);

      const float = reducedMotion ? 0 : Math.sin(t * 1.3 + i * 1.7) * 0.035 * ramp;
      const s = slot.s * (1 + a.lift * 0.05);
      const fly = scroll * scroll * (3.2 + i * 0.9) * slot.s * 2.2;
      o.position.set(
        slot.x + CUP_POSE.position[0] * s + (i - 1) * scroll * 0.6 * slot.s,
        slot.y + CUP_POSE.position[1] * s + (a.lift * 0.14 + float) * slot.s + fly,
        0,
      );
      o.scale.setScalar(s);
      o.rotation.set(CUP_POSE.rotation[0] + a.tx * ramp + scroll * 0.5, 0, a.tz * ramp + (i - 1) * scroll * 0.7);
      n.rotation.y = a.rot + scroll * (i - 1) * 2;
    });
  });

  return (
    <>
      {HERO_CUPS.map((c, i) => (
        <group key={c.variant} ref={(el) => void (outer.current[i] = el)} visible={slots.length > 0}>
          <group ref={(el) => void (inner.current[i] = el)}>
            <Cup variant={c.variant as CupVariant} />
          </group>
        </group>
      ))}
    </>
  );
}

/** Stops rendering while the hero is off-screen — saves battery & main thread. */
function VisibilityLoop({ host }: { host: HTMLElement }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setFrameloop(e.isIntersecting ? "always" : "never"));
    io.observe(host);
    return () => io.disconnect();
  }, [host, setFrameloop]);
  return null;
}

export default function HeroCanvas({ onReady }: { onReady: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    setHost(hostRef.current);
    const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-display");
    document.fonts.load(`80px ${fam}`).finally(() => setFontsReady(true));
  }, []);

  return (
    <div ref={hostRef} className="hero__canvas" aria-hidden="true">
      {host && fontsReady && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, CUP_POSE.z], fov: CUP_POSE.fov }}
          style={{ pointerEvents: "none" }}
        >
          <Suspense fallback={null}>
            <Lights />
            <Cups host={host} onReady={onReady} />
            <VisibilityLoop host={host} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
