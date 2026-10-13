import Image from "next/image";
import { asset, type AssetName } from "@/lib/img";
import { InView } from "@/components/ui/InView";
import { RevealTitle } from "@/components/ui/Reveal";

const ROWS = [
  { text: "Beat the heat and stay energised with slow-steeped iced coffee.", img: "ice", alt: "" },
  { text: "Our iced coffees are more than a drink — they’re a social ritual.", img: "cup-tilt", alt: "" },
  { text: "Sealed lids & double walls, made for on-the-go enjoyment.", img: "cup-double", alt: "" },
  { text: "Up to 67% less acidity, so it’s gentle from first sip to last.", img: "bean", alt: "" },
];

export function Benefits() {
  return (
    <section id="why" className="benefits" aria-labelledby="why-title">
      <p className="eyebrow eyebrow--dark">Why cold · 05</p>
      <RevealTitle className="title title--dark benefits__title" id="why-title">
        Benefits of going cold
      </RevealTitle>
      <ul className="benefits__list">
        {ROWS.map((r, i) => (
          <InView as="li" key={r.text} className="benefit" x={i % 2 ? 80 : -80} y={0} delay={i * 0.05}>
            <span className="benefit__fill" />
            <span className="benefit__check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M5 12.5l4.2 4L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="benefit__text">{r.text}</p>
            <span className="benefit__icon">
              <Image {...asset(r.img as AssetName)} alt={r.alt} sizes="80px" />
            </span>
          </InView>
        ))}
      </ul>
    </section>
  );
}
