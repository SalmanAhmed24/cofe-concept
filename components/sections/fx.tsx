"use client";

/**
 * Client "effect shells" for otherwise server-rendered sections: each renders the
 * <section> and attaches its GSAP ScrollTrigger choreography (deferred, scoped).
 * Keeping the markup in server components means far less to hydrate.
 */
import { useRef, type ComponentPropsWithoutRef } from "react";
import { useIdleGSAP } from "@/lib/gsap";

type SectionProps = ComponentPropsWithoutRef<"section">;

export function CraftFX(props: SectionProps) {
  const root = useRef<HTMLElement>(null);
  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // discs grow in, sparkles spin with scroll
        gsap.utils.toArray<HTMLElement>(".feature__disc").forEach((disc) => {
          gsap.from(disc, {
            scale: 0.4,
            duration: 1.3,
            ease: "elastic.out(1, 0.6)",
            scrollTrigger: { trigger: disc, start: "top 80%", once: true },
          });
        });
        gsap.to(".feature__spark", {
          rotate: 180,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        gsap.from(".feature__bowl", {
          rotate: -14,
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ".feature--beans", start: "top bottom", end: "center center", scrub: 1 },
        });
        gsap.from(".feature__glass", {
          rotate: 10,
          xPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: ".feature--brew", start: "top bottom", end: "center center", scrub: 1 },
        });
      });
      // number counters (run even with reduced motion, instantly)
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.utils.toArray<HTMLElement>(".stat__num").forEach((el) => {
        const end = Number(el.dataset.value);
        const obj = { v: 0 };
        if (!reduce) el.textContent = "0";
        gsap.to(obj, {
          v: end,
          duration: reduce ? 0 : 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        });
      });
    },
    root,
  );
  return <section ref={root} {...props} />;
}

export function CafesFX(props: SectionProps) {
  const root = useRef<HTMLElement>(null);
  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current!.querySelector<HTMLElement>(".cafes__track")!;
        const distance = () => el.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".cafe__img").forEach((img) => {
          gsap.fromTo(
            img,
            { rotate: -10, xPercent: 18 },
            {
              rotate: 8,
              xPercent: -18,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
        gsap.to(".cafes__progress span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
    },
    root,
  );
  return <section ref={root} {...props} />;
}

export function ChillFX(props: SectionProps) {
  const root = useRef<HTMLElement>(null);
  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "center center", scrub: 1 },
        });
        tl.from(".chill__char", { yPercent: 110, stagger: { each: 0.04, from: "center" }, ease: "power2.out" }, 0)
          .from(".chill__disc", { scale: 0, ease: "back.out(1.6)" }, 0.1)
          .from(".chill__cup", { yPercent: 70, rotate: -30, scale: 0.6, ease: "power3.out" }, 0.15);
        gsap.to(".chill__cup", {
          rotate: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "center center", end: "bottom top", scrub: 1 },
        });
        gsap.utils.toArray<HTMLElement>(".chill__float").forEach((el, i) => {
          gsap.to(el, {
            y: (i % 2 ? -1 : 1) * 120,
            rotate: (i % 2 ? -1 : 1) * 90,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        });
      });
    },
    root,
  );
  return <section ref={root} {...props} />;
}
