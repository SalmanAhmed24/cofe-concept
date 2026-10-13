/**
 * Tiny mutable store shared between the DOM layer (hover, drag, scroll — owned by
 * GSAP/Framer/pointer handlers) and the WebGL layer (read every frame in useFrame).
 * Plain object on purpose: no React re-renders in the hot path.
 */
export const heroState = {
  hover: -1,
  /** extra angular velocity per cup added by dragging (rad/s) */
  velocity: [0, 0, 0],
  /** normalised pointer, -1..1 */
  pointer: { x: 0, y: 0 },
  /** 0 → 1 as the hero scrolls out */
  scroll: 0,
  /** 0 → 1 intro progress, driven by GSAP */
  intro: 0,
  reducedMotion: false,
};

export const HERO_CUPS = [
  { variant: "classic", name: "Classic Cup", drink: "Caramel Cold Brew", spec: "350 ml · 12 oz · $5.40" },
  { variant: "ripple", name: "Ripple Wall", drink: "Oat Vanilla Latte", spec: "350 ml · 12 oz · $5.90" },
  { variant: "double", name: "Double Wall", drink: "Mocha Madness", spec: "450 ml · 16 oz · $6.20" },
] as const;
