import Image from "next/image";
import Link from "next/link";
import { asset, type AssetName } from "@/lib/img";
import { Sparkle } from "@/components/ui/Magnetic";

/**
 * Inner-page masthead: giant split-letter title (CSS rise, no JS needed for first
 * paint), breadcrumb, lede, and a rendered product on a mint disc.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  img,
  crumb,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  img: AssetName;
  crumb: string;
}) {
  const words = title.split(" ");
  let i = 0;
  return (
    <header className="phead">
      <nav aria-label="Breadcrumb" className="phead__crumbs">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{crumb}</span>
      </nav>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="phead__title" aria-label={title}>
        {words.map((w, wi) => (
          <span key={wi} className="phead__word" aria-hidden="true">
            {w.split("").map((ch) => (
              <span key={i} className="hero__char" style={{ "--i": i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="phead__lede">{lede}</p>
      <div className="phead__art" aria-hidden="true">
        <span className="phead__disc" />
        <Sparkle className="phead__spark" size={36} />
        <Image {...asset(img)} alt="" priority sizes="(max-width: 860px) 40vw, 22vw" />
      </div>
    </header>
  );
}
