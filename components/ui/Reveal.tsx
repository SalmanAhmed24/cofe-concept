"use client";

import { useRef, type ReactNode } from "react";
import { useIdleGSAP } from "@/lib/gsap";

/** Heading whose words rise out of masked lines as it scrolls into view (GSAP SplitText). */
export function RevealTitle({
  as: Tag = "h2",
  children,
  className,
  id,
}: {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current!;
      let split: { revert(): void } | null = null;
      document.fonts.ready.then(() => {
        split = SplitText.create(el, {
          type: "lines,words",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 115,
              rotate: 4,
              duration: 1,
              stagger: 0.06,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
      });
      return () => split?.revert();
    },
    ref,
  );
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}

/** Parallax helper: moves children on scroll at the given speed. */
export function Parallax({ children, speed = 0.2, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIdleGSAP(
    ({ gsap, ScrollTrigger, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { yPercent: speed * 100 },
          {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    ref,
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
