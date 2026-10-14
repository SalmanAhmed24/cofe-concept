"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/craft", label: "Our craft" },
  { href: "/cafes", label: "Cafés" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
];

/** Breakpoint where the full link row replaces the burger + overlay menu. Keep in sync with CSS. */
const DESKTOP = "(min-width: 900px)";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`logo ${className ?? ""}`} aria-label="Mossbrew home">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(-28 12 12)" fill="currentColor" />
        <path d="M9 3.6c4 3.6-1.8 11.4 6 16.8" stroke="var(--forest)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
      <span>MOSSBREW</span>
    </Link>
  );
}

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !open);
    setSolid(y > 40);
  });

  // close the overlay on navigation…
  useEffect(() => setOpen(false), [pathname]);

  // …and whenever the viewport grows into desktop, so the two navs never coexist
  useEffect(() => {
    const mq = matchMedia(DESKTOP);
    const check = () => mq.matches && setOpen(false);
    mq.addEventListener("change", check);
    window.addEventListener("resize", check, { passive: true });
    return () => {
      mq.removeEventListener("change", check);
      window.removeEventListener("resize", check);
    };
  }, []);

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
          {LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link key={l.href} href={l.href} className={`nav__link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                <span data-text={l.label}>{l.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="nav__actions">
          <Link href="/cafes" className="nav__cta">
            Find a café
          </Link>
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
              {[{ href: "/", label: "Home" }, ...LINKS].map((l, i) => (
                <li key={l.href}>
                  <m.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={pathname === l.href ? "is-active" : undefined}
                      aria-current={pathname === l.href ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </m.div>
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
