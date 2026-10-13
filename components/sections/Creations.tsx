import Image from "next/image";
import { asset, type AssetName } from "@/lib/img";
import { InView } from "@/components/ui/InView";
import { RevealTitle } from "@/components/ui/Reveal";
import { Sparkle } from "@/components/ui/Magnetic";

const DRINKS = [
  {
    img: "iced-classic" as AssetName,
    name: "Classic Cold Brew",
    note: "Twenty hours, single-origin Huila, a cloud of cold milk. The one that started it all.",
    price: "5.40",
    tag: "Bestseller",
  },
  {
    img: "iced-vanilla" as AssetName,
    name: "Vanilla Iced Latte",
    note: "Madagascan vanilla, caramelised at the bar, layered over oat milk and double espresso.",
    price: "5.90",
    tag: "Oat by default",
  },
  {
    img: "iced-mocha" as AssetName,
    name: "Mocha Madness",
    note: "70% dark chocolate ganache, cold brew concentrate and a slow drizzle down the glass.",
    price: "6.20",
    tag: "New",
  },
];

export function Creations() {
  return (
    <section id="menu" className="creations" aria-labelledby="menu-title">
      <p className="eyebrow eyebrow--dark">The cold bar · 01</p>
      <RevealTitle className="title title--dark creations__title" id="menu-title">
        Discover our iced coffee creations
      </RevealTitle>

      <div className="creations__grid">
        {DRINKS.map((d, i) => (
          <InView as="article" key={d.name} className="drink" delay={i * 0.12}>
            <div className="drink__media">
              <span className="drink__disc" />
              <div
                className="drink__img"
                // glasses share a size; the straw version is taller overall
                style={{ "--h": `${(asset(d.img).height / 1598) * 78}%` } as React.CSSProperties}
              >
                <Image {...asset(d.img)} alt={`${d.name} in a tall glass over ice`} sizes="(max-width: 760px) 55vw, 18vw" />
              </div>
              <span className="drink__spark">
                <Sparkle size={26} />
              </span>
              <span className="drink__tag">{d.tag}</span>
            </div>
            <h3 className="drink__name">{d.name}</h3>
            <p className="drink__note">{d.note}</p>
            <button className="buy" type="button" aria-label={`Add ${d.name} to order, $${d.price}`}>
              <span className="buy__label">Add to order</span>
              <span className="buy__price">${d.price}</span>
            </button>
          </InView>
        ))}
      </div>
    </section>
  );
}
