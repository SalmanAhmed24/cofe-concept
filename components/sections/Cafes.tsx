import Image from "next/image";
import { asset, type AssetName } from "@/lib/img";
import { RevealTitle } from "@/components/ui/Reveal";
import { CafesFX } from "./fx";

const CAFES = [
  { no: "01", name: "Old Town", line: "Flagship & roastery", hours: "7am – 10pm", img: "cup-classic", tone: "mint" },
  { no: "02", name: "Riverside", line: "Terrace on the water", hours: "7am – 9pm", img: "cup-ripple", tone: "cream" },
  { no: "03", name: "Canal Yard", line: "Cold brew tap room", hours: "8am – 11pm", img: "cup-double", tone: "forest" },
  { no: "04", name: "North Market", line: "Grab-and-go kiosk", hours: "6am – 6pm", img: "cup-tilt", tone: "mint" },
  { no: "05", name: "The Arcade", line: "Under the glass roof", hours: "8am – 9pm", img: "cup-ripple", tone: "cream" },
];

/** Horizontal, pinned café gallery on desktop; native swipe with scroll-snap on touch / small screens. */
export function Cafes() {
  return (
    <CafesFX id="cafes" className="cafes" aria-labelledby="cafes-title">
      <div className="cafes__head">
        <p className="eyebrow">Cafés · 04</p>
        <RevealTitle className="title cafes__title" id="cafes-title">
          Fourteen cafés. One slow ritual.
        </RevealTitle>
        <div className="cafes__progress" aria-hidden="true">
          <span />
        </div>
      </div>
      <div className="cafes__viewport">
        <div className="cafes__track">
          {CAFES.map((c) => (
            <article key={c.no} className={`cafe cafe--${c.tone}`}>
              <span className="cafe__no">{c.no}</span>
              <h3 className="cafe__name">{c.name}</h3>
              <p className="cafe__line">{c.line}</p>
              <div className="cafe__img">
                <Image {...asset(c.img as AssetName)} alt="" sizes="(max-width: 900px) 150px, 200px" />
              </div>
              <p className="cafe__hours">
                <span>Open daily</span>
                {c.hours}
              </p>
            </article>
          ))}
          <article className="cafe cafe--more">
            <h3 className="cafe__name">+9 more</h3>
            <p className="cafe__line">New doors opening this winter. Sign up below to hear first.</p>
            <a className="btn btn--solid" href="#newsletter">
              Get the news
            </a>
          </article>
        </div>
      </div>
    </CafesFX>
  );
}
