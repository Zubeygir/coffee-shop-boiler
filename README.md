# Zubo Cafe

A single-page site for a fictional Istanbul coffee shop, built around one idea: a 3D takeaway cup that the scroll
carries down the page. It drops into the hero, the headline breaks around it, and on scroll it travels into the story
section, spins to show its logo, lifts its lid and lets the text wrap its silhouette.

**Live:** [zubo-cafe.vercel.app](https://zubo-cafe.vercel.app/)

## Stack

- **Next.js 16** (App Router, fully static) · **React 19** · **TypeScript**
- **Tailwind CSS v4** with a reset theme: only the design system's own colors, type roles and spacing exist
- **three.js** via **@react-three/fiber**, **drei** and **maath**
- **Lenis** for smooth scrolling and the page's single animation loop

## How the cup works

- **Layout owns the cup.** Each section renders an invisible, `aria-hidden` slot (`CupSlot`). Every frame the
  canvas reads the slots' rects and maps them to world space, so the cup always matches the layout: no hard-coded
  positions, and responsive behavior comes from CSS alone.
- **Pure choreography.** `src/components/cup/choreography.ts` has no React or three.js imports. It turns slot rects
  and the scroll position into a pose (position, scale, rotation, lid, steam) and holds every number from the spec.
  Only the transition progress is damped, so the cup never trails behind its text.
- **One frame loop.** `SmoothScroll` (Lenis) owns the only `requestAnimationFrame`: it moves the scroll, then the
  canvas renders against that same position (`frameloop="never"` + `advance()`). With native scrolling the canvas
  landed a frame late and the cup shook against the text.
- **Text wraps the cup.** In the story section the cup's projected silhouette is a `shape-outside` polygon, so the
  paragraph follows the tapering cup body.
- **Canvas on top, never in the way.** The canvas sits above the HTML with `pointer-events: none`, which lets the
  headline slide out from behind the cup.

## Details

- **Intro:** on a cold load the cup drops in with a critically damped spring (no bounce), then the headline slides
  out from behind it. Reloads, anchors and mid-page loads skip straight to the current state.
- **Reduced motion:** no drop, no spin, no idle bob, no wheel inertia; the scroll-driven travel stays.
- **No WebGL:** no cup, and the layout is unchanged.
- **Performance:** three.js loads in its own chunk after first paint; rendering pauses while the menu and footer
  are on screen; no allocations per frame; the canvas resolution is capped by a pixel budget on large screens.
- **Accessibility:** WCAG 2.2 AA colors, visible focus everywhere, skip link, and the split hero headline reads as
  one sentence to screen readers.
- **Content:** all copy lives in one typed file, `src/content/site.ts`. The UI is in Turkish (`lang="tr"`).

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

### Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL for canonical, Open Graph, robots and sitemap. `.env.local` sets `http://localhost:3000`; set the production URL in your hosting provider's environment settings. |

## Project structure

```
src/
  app/              layout, page, error / 404, OG image, robots, sitemap
  components/
    layout/         Header, SmoothScroll (Lenis + frame loop)
    sections/       Hero, Reveal (story), Menu, Contact
    cup/            canvas, rig, model, steam, lighting, latte art, choreography
  content/site.ts   all copy
  styles/           theme tokens, base, utilities (type roles, motion)
docs/               architecture, design language, page design, cup spec, rollout plan
```

## Docs

- [Architecture](docs/architecture.md)
- [Design language](docs/design-language.md)
- [Page design and copy](docs/design.md)
- [3D cup scroll spec](docs/3d-cup-scroll-spec.md)
- [Rollout plan](docs/website-rollout-plan.md)

## Credits

- Typeface: [Archivo](https://fonts.google.com/specimen/Archivo) (variable, width axis)
- Menu photos: AI-generated
- The café, its address and phone number are fictional.
