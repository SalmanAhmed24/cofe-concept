"use client";

import { m } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

// The first page a visitor lands on paints immediately (no entrance fade that
// would delay LCP); every client-side navigation after that gets the transition.
let hasMounted = false;

export default function Template({ children }: { children: ReactNode }) {
  // decided once per mount; identical on server and during hydration
  const [animate] = useState(() => typeof window !== "undefined" && hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <>
      {animate && (
        <m.div
          className="page-wipe"
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
      <m.div
        initial={animate ? { opacity: 0, y: 40 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: animate ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </>
  );
}
