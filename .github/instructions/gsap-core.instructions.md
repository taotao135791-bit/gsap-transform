---
applyTo: "**/*.{js,jsx,ts,tsx,mjs,vue,svelte,astro,html}"
---

# GSAP core API — path-specific instructions

When generating GSAP code:

- Imports: `import { gsap } from "gsap"` or named plugin imports `import { ScrollTrigger } from "gsap/ScrollTrigger"`. All plugins are free since the Webflow acquisition; no `.npmrc` / auth token / Club membership.
- Sequencing: prefer `gsap.timeline()` with the **position parameter** (`"+=0.5"`, `"<"`, `"label"`). Avoid chained `delay`.
- Transforms: prefer GSAP aliases (`x`, `y`, `scale`, `rotation`, `xPercent`, `yPercent`) over raw CSS `transform` or layout properties (`top`, `left`, `width`, `height`).
- Opacity: prefer **`autoAlpha`** over `opacity` so 0-state also receives `visibility: hidden` and does not block clicks.
- `gsap.from(autoAlpha:0)` on an element that is already `opacity:0` in CSS animates 0 → 0 (no motion). Use `gsap.fromTo()` with explicit start state.
- Multiple `from()` / `fromTo()` tweens on the same property of the same element: set **`immediateRender: false`** on the later one(s).
- Wrap every project in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` and `(prefers-reduced-motion: reduce)` branches; paint the end state in the reduced branch.
- Prefer GSAP-owned start states via `gsap.set()` / `fromTo()`. Don't write CSS `transform` on elements you plan to animate — GSAP's transform system does not parse pre-existing CSS transforms as the start state.
