import Image from "next/image";
import { asset, type AssetName } from "@/lib/img";
import { Parallax, RevealTitle } from "@/components/ui/Reveal";
import { Arrow, Magnetic, Sparkle } from "@/components/ui/Magnetic";
import { CraftFX } from "./fx";

const STATS = [
  { value: 20, suffix: "h", label: "cold steep" },
  { value: 4, suffix: "°C", label: "brew temperature" },
  { value: 67, suffix: "%", label: "less acidity*" },
];

export function Craft() {

  return (
    <CraftFX id="craft" className="craft" aria-label="Our craft">
      <div className="feature feature--beans">
        <div className="feature__copy">
          <p className="eyebrow">Sourcing · 02</p>
          <RevealTitle className="title feature__title">Premium Arabica beans</RevealTitle>
          <p className="feature__text">
            We buy direct from three farms in Huila, Sidama and Chikmagalur — shade-grown, hand-picked at peak ripeness and roasted
            in-house every Tuesday. Paying 40% above Fairtrade isn&apos;t charity; it&apos;s how great coffee stays great.
          </p>
          <Magnetic>
            <a href="#cafes" className="btn btn--solid">
              Meet our farms <Arrow />
            </a>
          </Magnetic>
        </div>
        <div className="feature__media">
          <span className="feature__disc" />
          <Sparkle className="feature__spark feature__spark--a" size={56} />
          <Sparkle className="feature__spark feature__spark--b" size={22} />
          <div className="feature__bowl">
            <Image {...asset("beans")} alt="Wooden bowl heaped with dark-roasted Arabica coffee beans" sizes="(max-width: 860px) 90vw, 50vw" />
          </div>
          <Parallax speed={0.9} className="float float--bean1">
            <Image {...asset("bean")} alt="" sizes="84px" />
          </Parallax>
          <Parallax speed={-0.6} className="float float--bean2">
            <Image {...asset("bean")} alt="" sizes="84px" />
          </Parallax>
        </div>
      </div>

      <div className="feature feature--brew">
        <div className="feature__media">
          <span className="feature__disc" />
          <Sparkle className="feature__spark feature__spark--c" size={48} />
          <Sparkle className="feature__spark feature__spark--d" size={20} />
          <div className="feature__glass">
            <Image {...asset("iced-latte")} alt="Tall iced latte with cold milk swirling into espresso" sizes="(max-width: 860px) 50vw, 26vw" />
          </div>
          <Parallax speed={1.1} className="float float--ice1">
            <Image {...asset("ice")} alt="" sizes="84px" />
          </Parallax>
          <Parallax speed={-0.5} className="float float--ice2">
            <Image {...asset("ice")} alt="" sizes="84px" />
          </Parallax>
        </div>
        <div className="feature__copy">
          <p className="eyebrow">Method · 03</p>
          <RevealTitle className="title feature__title">Artisanal cold brewing</RevealTitle>
          <p className="feature__text">
            No heat, no shortcuts. Coarse-ground coffee rests in filtered water at fridge temperature for twenty hours, then runs
            through a triple paper filter. What&apos;s left is smooth, naturally sweet and never bitter.
          </p>
          <dl className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <dt className="stat__label">{s.label}</dt>
                <dd className="stat__value">
                  <span className="stat__num" data-value={s.value}>
                    {s.value}
                  </span>
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
          <p className="fineprint">*Compared with our hot-brewed house espresso, measured by titratable acidity.</p>
        </div>
      </div>
    </CraftFX>
  );
}
