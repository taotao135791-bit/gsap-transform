# Liquid Glass Hover — GSAP Showcase

Dark-tech hardware/SaaS product surface rendered with the **Liquid Glass Hover** recipe. Magnetic CTA buttons via `gsap.quickTo`, cursor-tracking spotlight on glass cards, and a single-signal hover treatment.

## Run

```bash
npx serve examples/showcase/liquid-glass-hover
# then open the printed local URL
```

ES modules require a local server (cannot open `index.html` directly via `file://`).

## Design Layer decisions

- **Design Read** — dark-tech product surface for design-conscious technical buyers; premium-consumer / hardware vibe; Expressive motion.
- **Dials** — `MOTION_INTENSITY: 7` / `DESIGN_VARIANCE: 6` / `VISUAL_DENSITY: 4`.
- **Recipe** — [motion-recipes](../../../skills/motion-recipes/SKILL.md) Recipe 3, *Liquid Glass Hover*.
- **Type & color** — Geist / Söhne / Inter Display sans on a near-black graphite canvas; one electric-blue accent (`#4cc9ff`) locked from CTA to icon to spotlight glow; glass surfaces via `backdrop-filter: blur saturate`.
- **Motion mode** — Expressive: `quickTo` for cursor-driven motion (no new tween per event), `power3.out` for entrance, single-property hover via spotlight gradient (not lift+scale+shadow).

## API Layer skills used

- [gsap-core](../../../skills/gsap-core/SKILL.md) — `gsap.set`, `gsap.to`, autoAlpha + y entrances.
- [gsap-scrolltrigger](../../../skills/gsap-scrolltrigger/SKILL.md) — `ScrollTrigger.batch` for the card grid entrance.
- [gsap-performance](../../../skills/gsap-performance/SKILL.md) — `gsap.quickTo` reused per pointer event on the magnetic CTA (no per-event tween).

## Anti-Slop checks

- B1 (`back.out` default) — `power3.out` only; no `back.*` / `elastic.*`.
- C3 (hover lift+scale+shadow combo) — hover is one signal: a cursor-tracking spotlight gradient. No `y: -8` + `scale: 1.05` + heavier shadow stack.
- C9 (magnetic cursor without `quickTo`) — both axes are driven by reused `gsap.quickTo` instances.
- D1 (missing `prefers-reduced-motion`) — under reduced motion, the entrance is instant and magnetic offsets are skipped (the spotlight still works because it is CSS-only, which is fine for non-vestibular concerns).
- F5 (color drift) — the electric-blue accent appears identical in CTA, icon, and spotlight; no rogue teal or violet.
