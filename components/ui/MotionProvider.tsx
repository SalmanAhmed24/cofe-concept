"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Framer Motion's animation engine is code-split: components render with the tiny
// `m` shell first and the features arrive asynchronously right after hydration.
const loadFeatures = () => import("./motionFeatures").then((r) => r.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
