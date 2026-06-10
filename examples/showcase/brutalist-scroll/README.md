# Brutalist Scroll — GSAP Showcase

Indie studio launch page rendered with the **Brutalist Scroll** recipe. Pinned hero scene with scrubbed translation, plus a click-to-toggle Flip layout transition.

## Run

```bash
npx serve examples/showcase/brutalist-scroll
# then open the printed local URL
```

ES modules require a local server (cannot open `index.html` directly via `file://`).

## Design Layer decisions

- **Design Read** — indie studio launch page for a design-conscious audience; brutalist anti-template language; Cinematic motion.
- **Dials** — `MOTION_INTENSITY: 8` / `DESIGN_VARIANCE: 9` / `VISUAL_DENSITY: 4`.
- **Recipe** — [motion-recipes](../../../skills/motion-recipes/SKILL.md) Recipe 2, *Brutalist Scroll*.
- **Type & color** — grotesque + mono pairing, true off-black on bone, single neon-yellow accent applied without sentiment, sharp corners, exposed grid lines.
- **Motion mode** — Cinematic: pinned scene with `scrub: 0.6`, `ease: "none"` on the scrub, `power4.out` / `power3.out` off-scrub.

## API Layer skills used

- [gsap-core](../../../skills/gsap-core/SKILL.md) — autoAlpha, transforms, `gsap.utils`.
- [gsap-scrolltrigger](../../../skills/gsap-scrolltrigger/SKILL.md) — pin + scrub on the hero, `toggleActions` for sections, `ScrollTrigger.batch` for tiles.
- [gsap-plugins](../../../skills/gsap-plugins/SKILL.md) — `Flip.getState` + `Flip.from` for the density toggle.

## Anti-Slop checks

- B1 (`back.out` default) — `power4.out` / `power4.inOut` only; no `back.*` / `elastic.*`.
- B4 (ease on scrubbed tween) — `defaults: { ease: "none" }` on the pinned timeline.
- C4 (parallax on every section) — only the hero is pinned/scrubbed; the rest of the page holds still.
- C7 (ScrollTrigger inside child of timeline) — ScrollTrigger lives on the outer `gsap.timeline`, not on a child tween.
- D1 (missing `prefers-reduced-motion`) — under reduced motion, pin + scrub + Flip are skipped; the toggle still works as an instant class flip.
- E1 (animating layout properties) — movements use `xPercent` / `yPercent` / `y`; the density change uses Flip (which animates transforms), not raw layout properties.
