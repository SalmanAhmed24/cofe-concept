# Mossbrew — cold coffee house (Next.js)

Award-style marketing site for a fictional cold-brew café chain.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · three.js + React Three Fiber/drei (hero) · GSAP 3 (ScrollTrigger, SplitText) · Framer Motion 12 (LazyMotion) · Lenis

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

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

All imagery in `public/img` is rendered from the in-repo 3D models:

```bash
npm run dev -- -p 3100          # studio route is dev-only (/studio?scene=…)
node scripts/render.mjs          # or: node scripts/render.mjs cup-classic iced-mocha
node scripts/dims.mjs            # refresh lib/imageDims.json (prevents layout shift)
```

`render.mjs` needs `playwright` and `sharp` available to Node.

## Content

Brand name, cafés, prices and copy are placeholders — swap them in the section components.
