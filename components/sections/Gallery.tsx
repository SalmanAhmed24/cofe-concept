"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { asset, type AssetName } from "@/lib/img";

type Cat = "coffee" | "dessert";
type Shot = { img: AssetName; title: string; cat: Cat; tone: string };

const SHOTS: Shot[] = [
  { img: "g-latte", title: "Heart latte", cat: "coffee", tone: "mint" },
  { img: "g-donut-pink", title: "Strawberry sprinkle donut", cat: "dessert", tone: "forest" },
  { img: "iced-classic", title: "Classic cold brew", cat: "coffee", tone: "cream" },
  { img: "g-macarons", title: "Macaron trio", cat: "dessert", tone: "caramel" },
  { img: "g-espresso", title: "Morning espresso", cat: "coffee", tone: "cream" },
  { img: "g-cake", title: "Six-layer chocolate cake", cat: "dessert", tone: "mint" },
  { img: "cup-double", title: "Double wall to-go", cat: "coffee", tone: "caramel" },
  { img: "g-cupcake", title: "Raspberry cupcake", cat: "dessert", tone: "cream" },
  { img: "iced-mocha", title: "Mocha madness", cat: "coffee", tone: "forest" },
  { img: "g-cookies", title: "Chunk cookies", cat: "dessert", tone: "mint" },
  { img: "g-rosetta", title: "Rosetta flat white", cat: "coffee", tone: "caramel" },
  { img: "g-donut-choc", title: "Double choc donut", cat: "dessert", tone: "cream" },
  { img: "g-affogato", title: "Affogato", cat: "dessert", tone: "forest" },
  { img: "iced-vanilla", title: "Vanilla iced latte", cat: "coffee", tone: "mint" },
  { img: "g-cupcake-mint", title: "Mint cream cupcake", cat: "dessert", tone: "caramel" },
  { img: "cup-tilt", title: "Caramel cold brew to-go", cat: "coffee", tone: "cream" },
  { img: "beans", title: "This week's roast", cat: "coffee", tone: "forest" },
  { img: "iced-latte", title: "Sweet cream latte", cat: "coffee", tone: "caramel" },
  { img: "cup-ripple", title: "Ripple wall cup", cat: "coffee", tone: "mint" },
];

const FILTERS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "coffee", label: "Coffee" },
  { id: "dessert", label: "Desserts" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Gallery() {
  const [filter, setFilter] = useState<"all" | Cat>("all");
  const [open, setOpen] = useState<number | null>(null);
  const shots = useMemo(() => SHOTS.filter((s) => filter === "all" || s.cat === filter), [filter]);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + shots.length) % shots.length)), [shots.length]);

  useEffect(() => {
    if (open === null) return;
    document.documentElement.classList.add("menu-open"); // pauses smooth scroll + locks body
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open, close, step]);

  const current = open !== null ? shots[open] : null;

  return (
    <section className="gallery" aria-label="Photo gallery">
      <div className="gallery__filters" role="group" aria-label="Filter photos">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className={`chip ${filter === f.id ? "is-on" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
            <span className="chip__count">{f.id === "all" ? SHOTS.length : SHOTS.filter((s) => s.cat === f.id).length}</span>
          </button>
        ))}
      </div>

      <ul className="gallery__grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {shots.map((s, i) => (
            <m.li
              key={s.img}
              className="shot-wrap"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.55, ease, delay: Math.min(i, 8) * 0.03 }}
            >
              <button
                type="button"
                className={`shot shot--${s.tone}`}
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-haspopup="dialog"
              >
                {/* the caption names the button; the picture itself is decorative here */}
                <Image {...asset(s.img)} alt="" sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw" />
                <span className="shot__cap">
                  <span>{s.cat === "coffee" ? "Coffee" : "Dessert"}</span>
                  {s.title}
                </span>
              </button>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {current && (
          <m.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <m.figure
              key={current.img}
              className={`lightbox__fig shot--${current.tone}`}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease }}
            >
              <Image {...asset(current.img)} alt={current.title} sizes="(max-width: 900px) 90vw, 60vw" />
              <figcaption>
                {current.title}
                <span>
                  {(open ?? 0) + 1} / {shots.length}
                </span>
              </figcaption>
            </m.figure>
            <button type="button" className="lightbox__btn lightbox__close" ref={closeBtn} onClick={close} aria-label="Close">
              ✕
            </button>
            <button type="button" className="lightbox__btn lightbox__prev" onClick={() => step(-1)} aria-label="Previous photo">
              ←
            </button>
            <button type="button" className="lightbox__btn lightbox__next" onClick={() => step(1)} aria-label="Next photo">
              →
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
