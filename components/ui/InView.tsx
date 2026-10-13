"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Framer Motion scroll-reveal wrapper — lets the content inside stay a server component. */
export function InView({
  as = "div",
  children,
  className,
  delay = 0,
  x = 0,
  y = 70,
}: {
  as?: "div" | "article" | "li";
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Tag>
  );
}
