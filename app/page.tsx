import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Creations } from "@/components/sections/Creations";
import { Craft } from "@/components/sections/Craft";
import { Cafes } from "@/components/sections/Cafes";
import { Benefits } from "@/components/sections/Benefits";
import { Chill } from "@/components/sections/Chill";
import { Footer } from "@/components/sections/Footer";
import { Marquee } from "@/components/ui/Marquee";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/ui/MotionProvider";

const BAND_A = ["Classic cold brews", "Iced latte creations", "Cold coffee mocktails"];
const BAND_B = ["Refreshing coffee coolers", "Flavourful iced specialities", "Nitro on tap"];

export default function Home() {
  return (
    <MotionProvider>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main id="main">
        <div id="top" />
        <Hero />
        <div className="bands" aria-label="What we pour">
          <Marquee items={BAND_A} />
          <Marquee items={BAND_B} reverse className="marquee--mint" />
        </div>
        <Creations />
        <Craft />
        <Cafes />
        <Benefits />
        <Chill />
      </main>
      <Footer />
    </MotionProvider>
  );
}
