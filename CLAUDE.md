---
trigger: always_on
---

# Zubo Cafe – Agent Rules

Single-page coffee shop demo. The focus is a 3D takeaway cup driven by scroll. Everything else stays simple.

## Binding Documents
- [docs/architecture.md](docs/architecture.md): scope, folder structure, 3D architecture.
- [docs/design-language.md](docs/design-language.md): the design system (colors, type, components, motion). Normative.
- [docs/design.md](docs/design.md): page structure and copy.
- [docs/3d-cup-scroll-spec.md](docs/3d-cup-scroll-spec.md): cup choreography.
- [docs/website-rollout-plan.md](docs/website-rollout-plan.md): execution order.
- All design and frontend work follows the impeccable skill. If it conflicts with design-language.md, stop and ask.

## Stack
Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · framer-motion · three.js via @react-three/fiber + drei + maath · Lenis.
One rAF loop: `SmoothScroll` (Lenis) scrolls, then the canvas renders (`src/lib/frameLoop.ts`, canvas `frameloop="never"`).
Code, comments, commits: English. UI strings: Turkish, `<html lang="tr">`.

## Never
1. **No CMS, no forms, no API routes.** Content is static.
2. **No hardcoded copy in components.** Every visible string comes from `src/content/site.ts`.
3. **No `any`.** Types live in `src/types/index.ts`.
4. **No UI kit.** No shadcn, no component library; components are written for this design only.
5. **No dark mode, no shadows on UI, no rounded corners.** See design-language.md.
6. **Never move the cup canvas behind the content to fix clicks.** The canvas stays above the HTML with `pointer-events: none`.
7. **No new dependencies, no git commit/push** without explicit user approval.

## Always
- **Content:** `src/content/site.ts` (typed). Menu images at `public/menu/<slug>.webp`, rendered with `next/image`.
- **Metadata:** static `metadata` export in `src/app/layout.tsx`. `getSiteUrl()` for absolute URLs.
- **Cup architecture:**
  - Sections are server components. `CupSlot` is a plain `aria-hidden` div with `data-cup-slot`.
  - Layout owns the cup's position: the canvas reads slot rects each frame (reads only, no layout writes).
  - `choreography.ts` is pure (no React/three imports) and holds all spec numbers.
  - three.js loads via `dynamic(..., { ssr: false })`; no WebGL → no cup, layout unchanged.
- **Motion:** content is visible by default; animations enhance it. Every animation has a `prefers-reduced-motion` alternative.

## Styling
- `src/app/globals.css`: imports only.
- `src/styles/theme.css`: brand color tokens (OKLCH) in `@theme`; Tailwind's default color, radius, shadow,
  animation, font and text-size scales are reset, so only system values exist.
- `src/styles/base.css`: `@layer base` resets.
- `src/styles/utilities.css`: easing, durations, z-index scale, type roles (`type-display` … `type-label`), keyframes.
- Utility-first Tailwind. Text styles come from the `type-*` roles, never ad-hoc sizes.
