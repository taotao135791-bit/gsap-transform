---
applyTo: "**/*"
---

# motion-primitives — animation verbs instructions

When the agent writes motion in a `/studio` project, it must use **primitives** from `skills/motion-primitives/`, not raw GSAP calls.

Available: `fadeUp`, `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`, `splitReveal`, `typewriter`, `scrambleText`, `morphTo`, `drawOn`, `parallaxY`, `staggerIn`, `loopPulse`, `shake`, `cameraPush`, `hold`.

Each primitive declares:
- `name`
- `layerTypes` (which layer.type values it accepts)
- `defaultArgs`
- `antiSlop` (which Group G/S rules it would trip)
- `apply(target, args, ctx)` — wraps the GSAP call

Adding a primitive = new file in `skills/motion-primitives/{name}.js`, export from `index.js`, add to `PRIMITIVE_NAMES` in `skills/motion-state/runtime.mjs`, add a test in `tests/motion-primitives/`.
