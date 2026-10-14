import Image from "next/image";
import Link from "next/link";
import { asset, type AssetName } from "@/lib/img";
import { Arrow, Magnetic, Sparkle } from "@/components/ui/Magnetic";
import { ChillFX } from "./fx";

const WORDS = ["READY", "TO", "CHILL"];

export function Chill() {

  return (
    <ChillFX className="chill" aria-labelledby="chill-title">
      <h2 id="chill-title" className="chill__title" aria-label="Ready to chill">
        {WORDS.map((w) => (
          <span key={w} className="chill__word" aria-hidden="true">
            {w.split("").map((c, i) => (
              <span className="chill__char" key={i}>
                {c}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <div className="chill__stage">
        <span className="chill__disc" />
        <div className="chill__cup">
          <Image {...asset("cup-tilt")} alt="Mossbrew classic cup tilting mid-air" sizes="(max-width: 700px) 50vw, 24vw" />
        </div>
        <Image className="chill__float chill__float--a" {...asset("ice")} alt="" sizes="80px" />
        <Image className="chill__float chill__float--b" {...asset("bean")} alt="" sizes="60px" />
        <Image className="chill__float chill__float--c" {...asset("ice")} alt="" sizes="60px" />
        <Sparkle className="chill__spark" size={40} />
      </div>
      <div className="chill__foot">
        <p>Embark on a journey of cool, coffee-infused bliss — fourteen cafés and counting.</p>
        <Magnetic>
          <Link href="/cafes" className="btn btn--line">
            Find your café <Arrow />
          </Link>
        </Magnetic>
        <p>Browse the cold bar and treat yourself to a refreshing escape.</p>
      </div>
    </ChillFX>
  );
}
