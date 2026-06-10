# Editorial Kinetic — GSAP Showcase

Solo brand manifesto rendered with the **Editorial Kinetic** recipe. Pure HTML + GSAP from CDN; no build step.

## Run

```bash
npx serve examples/showcase/editorial-kinetic
# then open the printed local URL
```

ES modules require a local server (cannot open `index.html` directly via `file://`).

## Design Layer decisions

- **Design Read** — solo brand manifesto for design-conscious readers; Expressive motion language.
- **Dials** — `MOTION_INTENSITY: 7` / `DESIGN_VARIANCE: 7` / `VISUAL_DENSITY: 3`.
- **Recipe** — [motion-recipes](../../../skills/motion-recipes/SKILL.md) Recipe 1, *Editorial Kinetic*.
- **Type & color** — display sans + serif italic for emphasis on the same family heritage; bone paper background, single burnt-orange accent locked across the whole page.
- **Motion mode** — Expressive: durations 0.5-0.95 s, eases `expo.out` / `power3.out`, stagger 0.05-0.08 s.

## API Layer skills used

- [gsap-core](../../../skills/gsap-core/SKILL.md) — autoAlpha, transform aliases, `gsap.utils.toArray`.
- [gsap-timeline](../../../skills/gsap-timeline/SKILL.md) — sequence eyebrow → headline lines → meta with position parameter.
- [gsap-scrolltrigger](../../../skills/gsap-scrolltrigger/SKILL.md) — `toggleActions: "play none none reset"` for section reveals; `once: true` for the quote.
- [gsap-plugins](../../../skills/gsap-plugins/SKILL.md) — `SplitText` with `mask: "lines"` and `mask: "words"`.

## Anti-Slop checks

- A1 (universal duration default) — durations vary by role.
- B1 (`back.out` default) — `expo.out` / `power3.out` only.
- B4 (ease on scrubbed tween) — no scrubbing on this page.
- C4 (parallax on every section) — only one numbered marker drifts; everything else holds still.
- D1 (missing `prefers-reduced-motion`) — `gsap.matchMedia` branches reveal vs. instant set.
- F5 (color drift) — burnt orange used everywhere it appears, never substituted.
