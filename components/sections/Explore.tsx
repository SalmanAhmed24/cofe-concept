import Image from "next/image";
import Link from "next/link";
import { asset, type AssetName } from "@/lib/img";
import { InView } from "@/components/ui/InView";
import { RevealTitle } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Magnetic";

const CARDS: { href: string; kicker: string; title: string; img: AssetName; tone: string }[] = [
  { href: "/craft", kicker: "Sourcing & method", title: "Our craft", img: "beans", tone: "mint" },
  { href: "/gallery", kicker: "Coffee & sweets", title: "Gallery", img: "g-donut-pink", tone: "cream" },
  { href: "/reviews", kicker: "From our guests", title: "Reviews", img: "g-latte", tone: "caramel" },
];

/** Home-page signposts into the other pages. */
export function Explore() {
  return (
    <section className="explore" aria-labelledby="explore-title">
      <p className="eyebrow">Keep exploring</p>
      <RevealTitle className="title explore__title" id="explore-title">
        There&apos;s more in the cup
      </RevealTitle>
      <ul className="explore__grid">
        {CARDS.map((c, i) => (
          <InView as="li" key={c.href} delay={i * 0.1}>
            <Link href={c.href} className={`xcard xcard--${c.tone}`}>
              <span className="xcard__kicker">{c.kicker}</span>
              <span className="xcard__title">{c.title}</span>
              <span className="xcard__img">
                <Image {...asset(c.img)} alt="" sizes="(max-width: 760px) 60vw, 22vw" />
              </span>
              <span className="xcard__go" aria-hidden="true">
                <Arrow size={18} />
              </span>
            </Link>
          </InView>
        ))}
      </ul>
    </section>
  );
}
