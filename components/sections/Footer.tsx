"use client";

import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { LINKS, Logo } from "@/components/Nav";
import { Arrow } from "@/components/ui/Magnetic";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/", d: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-1.5a1 1 0 100 2 1 1 0 000-2z" },
  { label: "TikTok", href: "https://www.tiktok.com/", d: "M14 3c.4 2.6 2 4.2 4.6 4.4V11a8 8 0 01-4.6-1.5V16a5.5 5.5 0 11-5.5-5.5c.3 0 .6 0 .9.1v3.4a2.2 2.2 0 102 2.1V3H14z" },
  { label: "Facebook", href: "https://www.facebook.com/", d: "M14 8h3V4.2h-3c-2.6 0-4 1.6-4 4.2V11H7.5v3.8H10V21h4v-6.2h2.8l.5-3.8H14V9c0-.6.4-1 1-1z" },
];

export function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="footer">
      <div className="footer__top" id="newsletter">
        <div>
          <h2 className="footer__title">Cold news, warm hearts</h2>
          <p className="footer__lede">One email a month: seasonal drinks, new cafés and the occasional free cup.</p>
        </div>
        <form
          className="signup"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
          <button type="submit" aria-label="Subscribe">
            <Arrow size={18} />
          </button>
          <AnimatePresence>
            {sent && (
              <m.p className="signup__ok" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                You&apos;re on the list. See you at the bar.
              </m.p>
            )}
          </AnimatePresence>
        </form>
      </div>
      {/* decorative wordmark drawn via ::before so it stays out of the accessibility tree */}
      <div className="footer__mark" aria-hidden="true" data-text="MOSSBREW" />
      <div className="footer__bar">
        <Logo className="logo--dark" />
        <nav aria-label="Footer" className="footer__links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <ul className="footer__social">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d={s.d} fill="currentColor" fillRule="evenodd" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="footer__copy">© {new Date().getFullYear()} Mossbrew Coffee Co.</p>
      </div>
    </footer>
  );
}
