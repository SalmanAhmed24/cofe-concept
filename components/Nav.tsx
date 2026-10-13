"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#craft", label: "Our craft" },
  { href: "#cafes", label: "Cafés" },
  { href: "#why", label: "Why cold" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={`logo ${className ?? ""}`} aria-label="Mossbrew home">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(-28 12 12)" fill="currentColor" />
        <path d="M9 3.6c4 3.6-1.8 11.4 6 16.8" stroke="var(--forest)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
      <span>MOSSBREW</span>
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !open);
    setSolid(y > 40);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <m.header
        className={`nav ${solid ? "nav--solid" : ""}`}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo />
        <nav aria-label="Primary" className="nav__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <a href="#cafes" className="nav__cta">
            Find a café
          </a>
          <button
            className={`burger ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.href}>
                  <m.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {l.label}
                  </m.a>
                </li>
              ))}
            </ul>
            <m.p className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0 }}>
              Open daily 7am — 9pm · hello@mossbrew.coffee
            </m.p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
