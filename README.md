# Mossbrew — cold coffee house (Next.js)

Award-style marketing site for a fictional cold-brew café chain.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · three.js + React Three Fiber/drei (hero) · GSAP 3 (ScrollTrigger, SplitText) · Framer Motion 12 (LazyMotion) · Lenis

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | What's there |
| --- | --- |
| `/` | 3D cup hero, marquee bands, signature drinks, explore cards, benefits, "Ready to chill" |
| `/menu` | Signature cold drinks + full menu board (cold bar, hot bar, sweet counter) |
| `/craft` | Sourcing & brewing story, stats, benefits |
| `/cafes` | Pinned horizontal café gallery + A–Z list of all fourteen cafés |
| `/gallery` | Coffee & dessert gallery with filters and a keyboard-friendly lightbox |
| `/reviews` | Live Google reviews (see below) |

Shared layout keeps the nav, footer, smooth scroll and cursor across routes; `app/template.tsx` adds a mint wipe + fade on client-side navigation (but never on the first page load, so LCP isn't delayed). On screens ≥ 900px only the link row shows; below that, the burger and full-screen menu take over.

## Google reviews

`/reviews` fetches your real reviews server-side from the Places API (New) and re-validates every 6 hours. Copy `.env.example` to `.env.local` and set:

```
GOOGLE_PLACES_API_KEY=…
GOOGLE_PLACE_ID=…
```

Until both are set the page shows a clearly labelled setup notice with placeholder skeletons — no invented reviews. Google returns up to 5 reviews per place; the page links out to "See all on Google Maps" and "Write a review", and keeps Google's author/source attribution.

## How it's put together

| Area | Notes |
| --- | --- |
| **Hero** (`components/sections/Hero.tsx`, `components/three/*`) | Three procedurally-modelled paper cups (classic print, corrugated ripple wall, botanical double wall) built from lathe/cylinder geometry with canvas-painted sleeves — no downloaded models. They spin like the reference video, tilt toward the cursor, lift on hover, can be dragged to spin with inertia, and launch off-screen on scroll. Morphing blobs behind each cup are Framer Motion path animations. |
| **Posters → live 3D** | The page first shows WebP posters rendered from the *same* 3D model and pose, so first paint is instant. The ~600 KB WebGL bundle loads on the visitor's first interaction, and the live canvas is positioned pixel-for-pixel over the posters before cross-fading. |
| **GSAP** (`lib/gsap.ts`) | Code-split and loaded on engagement; each section's ScrollTrigger setup runs in its own idle task with a scoped `gsap.context`. Includes SplitText heading reveals, a pinned horizontal café gallery (desktop), parallax, counters, velocity-reactive marquees and the "Ready to chill" finale. |
| **Framer Motion** | `LazyMotion` + `m` components: nav hide/show, circular-reveal mobile menu, magnetic buttons, cursor follower, in-view reveals, blob morphs, form feedback. |
| **Server/client split** | Creations, Craft, Cafés, Benefits and Chill render as server components; animation lives in small client shells (`components/sections/fx.tsx`, `components/ui/InView.tsx`). |
| **Accessibility** | Semantic landmarks, skip link, labelled controls, focus-visible styles, AA contrast, `prefers-reduced-motion` respected everywhere (no Lenis, no spin, instant reveals). |

## Regenerating the product renders

All imagery in `public/img` — cups, iced drinks, beans, and the gallery's lattes, espresso, affogato, donuts, macarons, cake, cupcakes and cookies (`components/three/Treats.tsx`) — is rendered from in-repo 3D models:

```bash
npm run dev -- -p 3100          # studio route is dev-only (/studio?scene=…)
node scripts/render.mjs          # or: node scripts/render.mjs cup-classic iced-mocha
node scripts/dims.mjs            # refresh lib/imageDims.json (prevents layout shift)
```

`render.mjs` needs `playwright` and `sharp` available to Node.

## Content

Brand name, cafés, prices and copy are placeholders — swap them in the section components.
