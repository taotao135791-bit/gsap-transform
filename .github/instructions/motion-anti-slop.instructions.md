---
applyTo: "**/*.{html,jsx,tsx,vue,svelte,astro,js,ts,mjs}"
---

# motion-anti-slop — path-specific instructions

Before shipping any GSAP code (or when the user asks "audit", "lint", "review", "this feels generic", "this feels AI-built"), walk through these seven groups. Any **block**-severity item must be fixed.

**A. Duration tells** — defaults too short (<200ms) or too long (>1.2s) for the motion mode.

**B. Ease abuse** —
- `back.out(1.7)`, `elastic.*`, `bounce.*` as **default** ease. Only ONE branded character moment per page (block).

**C. Choreography** —
- C3: hover stack `y:-8 + scale:1.05 + heavier shadow` — pick ONE signal (warn).
- C4: parallax on every section — earn one or two; rest hold still (warn).
- C9: per-event `gsap.to` on mousemove/scroll — use `gsap.quickTo` instead (block).

**D. Accessibility** —
- D1: missing `gsap.matchMedia()` with `prefers-reduced-motion` branch (block — Pre-Flight Failure).
- D2: scrub or pin under reduced-motion (block).
- D7: JS-gated initial state (only set hidden via JS; with JS off, all hidden) (block).

**E. Performance** — animating layout properties (`top`, `left`, `width`, `height`) instead of transforms (block).

**F. Composition** —
- F5: AI-purple default + slate-900 (warn).
- F6: single accent leak — declared accent doesn't match all uses (`getComputedStyle` mismatch) (block).

**G. Wiring & loading silent failures** —
- G1: `gsap.from(autoAlpha:0)` on CSS-hidden element animates 0 → 0 (block).
- G2: pre-existing CSS `transform` on element animated by GSAP — start state ignored (block).
- G3: `cdn.jsdelivr.net/npm/gsap/<Plugin>.js` for browser ESM — module graph breaks (block).
- G4: named imports of GSAP plugins from `esm.sh` resolve to `undefined` — use **default imports** (block).
- G5: MotionPath / DrawSVG on `<circle>` / `<rect>` / `<ellipse>` — only `<path>` accepted (block).

For full detect/fix snippets: `skills/motion-anti-slop/SKILL.md`.
