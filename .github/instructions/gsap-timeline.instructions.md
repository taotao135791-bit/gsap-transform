---
applyTo: "**/*.{js,jsx,ts,tsx,mjs,vue,svelte,astro}"
---

# GSAP timelines — path-specific instructions

When generating multi-step or sequenced animations:

- Use `gsap.timeline()` for any sequence of two or more tweens. Avoid chained `delay` values.
- Position parameter forms:
  - **Numeric**: `0.5` (start at 0.5s on the timeline)
  - **Absolute label**: `"start"`, `"reveal"`
  - **Relative**: `"+=0.3"` (after the previous tween's end), `"-=0.2"` (overlap with previous)
  - **Previous-tween-relative**: `"<"` (at the start of previous), `"<0.1"` (0.1s after previous start), `">"` (at end of previous)
- Add labels with `tl.addLabel("intro", 0)` and reference them in subsequent positions: `tl.to(el, {...}, "intro+=0.2")`.
- Nested timelines: build a child timeline, then `parent.add(child, "label")`. The child plays in the parent's coordinate space; use `child.duration()` if you need to know its length.
- Set defaults on the master timeline so every child inherits unless overridden:
  ```js
  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.4 } });
  ```
- Cleanup: kill the timeline when the component unmounts or the route changes (`tl.kill()` or use `useGSAP` / `gsap.context`).
