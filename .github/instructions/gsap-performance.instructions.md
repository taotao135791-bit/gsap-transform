---
applyTo: "**/*.{js,jsx,ts,tsx,mjs,vue,svelte,astro}"
---

# GSAP performance — path-specific instructions

When frame rate matters (60fps target) or for high-frequency events (mousemove, scroll, drag):

- **High-frequency updates**: use `gsap.quickTo(target, "x", { duration: 0.5, ease: "power3" })` and call the returned function with new values. A single reused tween instance, no GC churn. Prefer this over creating `gsap.to` per pointermove.
- **Transform-only** for movement / scale / rotation. Do NOT animate `top`, `left`, `width`, `height`, `margin`, `padding` — these trigger layout, not just composite.
- Add `will-change: transform` to actively animated elements; **remove** it after the animation ends (reset inline style or toggle a class). Don't leave `will-change` on permanently — it consumes memory.
- ScrollTrigger lists: prefer **`ScrollTrigger.batch(".item", { onEnter, start })`** over a `.forEach` that creates one ScrollTrigger per item.
- Avoid `gsap.getProperty()` inside `onUpdate` callbacks of high-frequency tweens. Cache once outside.
- For thousands of objects (particles, grid dots): one `gsap.to(arrayOfTargets, { ..., stagger })` instead of one tween per element. GSAP optimizes shared tweens.
- Pin layouts at the GPU layer: `transform` only, never `position: fixed` toggling, when ScrollTrigger pins a section.
