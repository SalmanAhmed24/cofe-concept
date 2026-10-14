import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Creations } from "@/components/sections/Creations";
import { Explore } from "@/components/sections/Explore";
import { Benefits } from "@/components/sections/Benefits";
import { Chill } from "@/components/sections/Chill";
import { Marquee } from "@/components/ui/Marquee";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const BAND_A = ["Classic cold brews", "Iced latte creations", "Cold coffee mocktails"];
const BAND_B = ["Refreshing coffee coolers", "Flavourful iced specialities", "Nitro on tap"];

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <div className="bands" aria-label="What we pour">
        <Marquee items={BAND_A} />
        <Marquee items={BAND_B} reverse className="marquee--mint" />
      </div>
      <Creations moreLink />
      <Explore />
      <Benefits />
      <Chill />
    </main>
  );
}
