---
name: motion-primitives
description: A library of 16 high-level animation verbs (fadeUp, splitReveal, morphTo, staggerIn...) that wrap GSAP calls behind a uniform contract. Every motion beat in state.json names a primitive; the scene.js generator turns state into tl.from/to calls via these verbs. Anti-slop rules are baked into each primitive's metadata. Pair with motion-state and motion-studio.
license: MIT
---

# Motion Primitives

GSAP is the engine. Primitives are the **verbs an agent uses** to drive it.

Without primitives, the agent has to write `tl.fromTo(el, {y: 24, autoAlpha: 0}, {y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out"})`. With them, it writes `{ primitive: "fadeUp", args: { y: 24 } }` and the runtime does the right thing.

## The contract

```js
// motion-primitives/fadeUp.js
export default {
  name: "fadeUp",
  layerTypes: ["any"],
  defaultArgs: { y: 24, duration: 0.5, ease: "expo.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { autoAlpha: 0, y: args.y },
      { autoAlpha: 1, y: 0, duration: args.duration, ease: args.ease },
      ctx.beat.at || 0
    );
  }
};
```

`ctx` = `{ tl, gsap, beat, state, at(pos) }`. Primitives return the GSAP tween so callers can chain.

## v1 catalog (16)

| Verb | Layer | Use case |
|---|---|---|
| `fadeUp` | any | Default entrance |
| `fadeIn` | any | Plain fade |
| `scaleIn` | any | Pop entrance (CTA, logo) |
| `slideInLeft` / `slideInRight` | any | Lateral entrance |
| `splitReveal` | text | Masked line reveal (needs SplitText + `document.fonts.ready`) |
| `typewriter` | text | Char-by-char typing |
| `scrambleText` | text | Letters scramble then resolve (needs ScrambleText) |
| `morphTo` | svg-path | Path morph (needs MorphSVGPlugin) |
| `drawOn` | svg-path | Stroke draw (needs DrawSVGPlugin) |
| `parallaxY` | any | Time-driven parallax (no scroll in v1) |
| `staggerIn` | group / container | Children fade up in sequence |
| `loopPulse` | any | Infinite gentle pulse |
| `shake` | any | Error / rejected cue |
| `cameraPush` | container | Slow zoom/pan (virtual camera) |
| `hold` | any | Empty gap — leave breathing room |

## Why primitives

1. **LLM-friendly.** Output schema is small and named; agents don't accidentally pass `ease: "back.out(2)"` on a logo if the primitive's defaults don't include it.
2. **Anti-slop encoded.** Each primitive declares which anti-slop rules it would trip; the runtime can refuse to apply if the context violates.
3. **Round-trippable.** state.json → scene.js → render → state.json (the schema survives). Raw GSAP does not round-trip.
4. **Composable.** A primitive can call another primitive internally (e.g. `splitReveal` could compose `fadeUp`).

## When to load

- **Generating a `/studio` project** → load this + `motion-state` + `motion-studio`.
- **The agent is about to call `tl.from / tl.to` directly** → **stop**. Use a primitive instead. If none fits, **add a primitive** to this skill — do not bypass.
- **Reviewing / auditing** → load `motion-anti-slop` Group G6 (the seek-contract group) which validates primitive usage at render time.

## How to add a new primitive

1. Create `skills/motion-primitives/{name}.js`. Follow the contract above.
2. Export it from `skills/motion-primitives/index.js`.
3. Add it to `PRIMITIVE_NAMES` and `PRIMITIVE_LAYER_TYPES` in `skills/motion-state/runtime.mjs`.
4. Add the primitive to the catalog table above.
5. Run `node scripts/verify-consistency.mjs` to confirm the new primitive is exported and all templates still validate.

## Limitations

- All primitives are **time-driven**. Scroll- and pointer-driven versions ship in Phase 2 (see SPEC.md §2.6).
- `splitReveal`, `morphTo`, `drawOn`, `scrambleText` require plugins. `scene.js` generator registers them automatically when the state.json uses the corresponding primitive.
- No async primitives in v1 (no asset preload gating). v2.
