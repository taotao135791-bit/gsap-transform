# GSAP skills — reference examples

Minimal demos that follow the skills exactly: transforms, autoAlpha, timelines, ScrollTrigger, and framework-specific patterns (useGSAP in React, onMount/onUnmount with gsap.context in Vue/Nuxt).

## Vanilla (HTML + JS)

- **examples/vanilla/** — single HTML page + ES module.
- Uses GSAP from CDN (ESM). Open with a local server that supports ES modules (e.g. `npx serve examples/vanilla` from repo root).
- Patterns: `gsap.to()` with `x`/`autoAlpha`, `gsap.timeline()` with defaults and position parameter, ScrollTrigger on the timeline.

## React

- **examples/react/** — Vite + React + `@gsap/react`.
- From repo root: `cd examples/react && npm install && npm run dev`.
- Patterns: `useGSAP()` with `scope: containerRef`, refs for targets, no selectors without scope; cleanup is automatic on unmount.

These examples are intended as reference implementations for AI agents and for quick manual verification of the skill patterns.

## Showcase — design, state, and API integration

Full pages that demonstrate the older hand-written scene escape hatch and the
current three-layer thinking: a Design Read drives the direction, state or
recipe choices define the timeline, GSAP API skills implement details, and
`motion-anti-slop` rules are applied. Each showcase has its own `README.md`
listing the design decisions and API skills used.

- **examples/showcase/editorial-kinetic/** — Editorial Kinetic recipe. SplitText line-mask reveal, sequenced timeline, single burnt-orange accent on bone paper. Plugins: ScrollTrigger, SplitText.
- **examples/showcase/brutalist-scroll/** — Brutalist Scroll recipe. Pinned scrubbed hero scene, neon-yellow accent, `Flip` density toggle. Plugins: ScrollTrigger, Flip.
- **examples/showcase/liquid-glass-hover/** — Liquid Glass Hover recipe. Magnetic CTA buttons via `gsap.quickTo`, cursor-tracking spotlight on glass cards, single-signal hover. Plugins: ScrollTrigger.

Each showcase runs from a static directory:

```bash
npx serve examples/showcase/{name}
```

Then open the printed local URL.

## Vue

- **examples/vue/** — Vite + Vue 3 + `<script setup>`.
- From repo root: `cd examples/vue && npm install && npm run dev`.
- Patterns: `gsap.context(() => {}, scope)` via `<script setup>`, `onMounted`/`onUnmounted` cleanup, ScrollTrigger on timeline, autoAlpha, stagger.

## Nuxt

- **examples/nuxt/** — Nuxt 4 with GSAP re-usable composable.
- From repo root: `cd examples/nuxt && npm install && npm run dev`.
- Patterns: GSAP as reusable composable (`useGSAP.ts`), for gsap access, lazy-loading plugins, `gsap.context(() => {}, scope)` cleanup.
