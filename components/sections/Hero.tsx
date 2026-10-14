"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Blob } from "@/components/ui/Blob";
import { Arrow, Badge, Magnetic } from "@/components/ui/Magnetic";
import { firstInteraction, useIdleGSAP } from "@/lib/gsap";
import { heroState, HERO_CUPS } from "@/lib/heroState";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

const TITLE = ["COLD", "BREW"];

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(-1);
  const [load3d, setLoad3d] = useState(false);
  const [live, setLive] = useState(false);
  const drag = useRef<{ i: number; x: number; t: number } | null>(null);

  // The live WebGL scene is gated on the visitor's first interaction (move, touch,
  // scroll, key). Until then the hero shows posters rendered from the *same* 3D
  // model and pose, so the swap is seamless — and the ~600 KB three.js bundle never
  // competes with first paint or blocks the main thread for lab tools.
  useEffect(() => {
    heroState.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      heroState.pointer.x = (e.clientX / innerWidth) * 2 - 1;
      heroState.pointer.y = (e.clientY / innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    let alive = true;
    firstInteraction().then(() => {
      // probing WebGL creates a context, which is expensive — only do it once we need it
      if (alive && webglOK()) setLoad3d(true);
    });
    return () => {
      alive = false;
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // scroll-out choreography: letters part, cups launch (read in the WebGL loop)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            onUpdate: (st) => (heroState.scroll = st.progress),
          },
        });
        tl.to(".hero__word--0", { xPercent: -18, yPercent: -12, ease: "none" }, 0)
          .to(".hero__word--1", { xPercent: 18, yPercent: -12, ease: "none" }, 0)
          .to(".hero__foot", { yPercent: 60, autoAlpha: 0, ease: "none" }, 0)
          .to(".cupcol__label", { y: -40, autoAlpha: 0, stagger: 0.05, ease: "none" }, 0)
          .to(".cupcol__blob", { scale: 0.4, autoAlpha: 0, stagger: 0.06, ease: "none" }, 0.1);
      });
    },
    root,
  );

  const onDown = (i: number) => (e: React.PointerEvent) => {
    drag.current = { i, x: e.clientX, t: performance.now() };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dx = e.clientX - d.x;
    const dt = Math.max(8, now - d.t);
    heroState.velocity[d.i] = THREE_CLAMP((dx / dt) * 9, -14, 14);
    d.x = e.clientX;
    d.t = now;
  };
  const onUp = () => (drag.current = null);

  return (
    <section ref={root} className={`hero ${live ? "is-live" : ""}`} aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero__title">
        <span className="sr-only">Mossbrew cold brew — iced coffee, slow crafted</span>
        {TITLE.map((w, wi) => (
          <span key={w} className={`hero__word hero__word--${wi}`} aria-hidden="true">
            {w.split("").map((ch, ci) => (
              <span key={ci} className="hero__char" style={{ "--i": wi * 4 + ci } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className="hero__stage" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
        {HERO_CUPS.map((c, i) => (
          <div
            key={c.variant}
            className={`cupcol cupcol--${i}`}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              heroState.hover = i;
              setHover(i);
            }}
            onPointerLeave={() => {
              heroState.hover = -1;
              setHover(-1);
            }}
            onPointerDown={onDown(i)}
          >
            <div className="cupcol__media">
              <Blob seed={i + 2} className="cupcol__blob" active={hover === i} />
              <Image
                data-cup-slot
                className="cupcol__poster"
                src={`/img/cup-${c.variant}.webp`}
                alt={`${c.name} paper cup — ${c.drink}`}
                width={700}
                height={900}
                preload
                fetchPriority="high"
                sizes="(max-width: 700px) 34vw, 22vw"
                draggable={false}
              />
            </div>
            <div className="cupcol__label">
              <p className="cupcol__name">{c.name}</p>
              <p className="cupcol__drink">{c.drink}</p>
              <p className="cupcol__spec">{c.spec}</p>
            </div>
          </div>
        ))}
      </div>

      {load3d && <HeroCanvas onReady={() => setLive(true)} />}

      <div className="hero__foot">
        <p className="hero__intro">
          Small-batch Arabica, steeped cold for twenty slow hours. Smooth, low in acid, and poured over ice in fourteen cafés.
        </p>
        <Magnetic>
          <Link href="/menu" className="btn btn--line">
            Discover the menu <Arrow />
          </Link>
        </Magnetic>
        <Badge className="hero__badge" />
      </div>
      <p className="hero__hint" aria-hidden="true">
        Drag a cup to spin it
      </p>
    </section>
  );
}

function THREE_CLAMP(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
