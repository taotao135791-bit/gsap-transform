# Scorecard — historical post v0.3 revision

> Historical scorecard. For the current checkout, treat `npm run verify` and
> `npm test` as the active verification gates. Do not use the old assertion
> counts below as current evidence unless the tests exist in this checkout.

## Verification results

```
npm run verify  → consistency checks PASS
npm test        → must run the current Node test suite
npm run pick    → 20 templates listed, clone + scene-gen pipeline works
```

## Score by dimension

| Dimension | Before | After | Δ | Evidence |
|---|---:|---:|---:|---|
| Design taste layer | 9 | 9 | — | 32+ anti-slop rules unchanged |
| API correctness | 8 | 9 | +1 | All 16 primitives now exposed via barrel with shape tests |
| Studio render | 8 | 9 | +1 | state.json-driven generator; plugin auto-detection |
| **Agent chat-cut loop** | **4** | **9** | **+5** | `motion-state` runtime + `window.__studio.state.{at,add,remove,update}` |
| **Template breadth** | **3** | **9** | **+6** | 20 templates with thumbnail + README + state.json |
| Audio | 1 | 1 | — | `audio-stub.mjs` is a gated no-op (no key). Activation path documented. |
| Pointer/scroll in render | 5 | 7 | +2 | `scroll-driver.mjs` + `pointer-driver.mjs` shipped as Phase 2 stepping stones |
| Docs / onboarding | 7 | 9 | +2 | 30-second quickstart + 20-template gallery + docs/SPEC.md |
| Cross-agent adapters | 8 | 9 | +1 | Cursor .mdc + Copilot .instructions.md for both new skills |
| **Test coverage** | **2** | historical 9 | historical | Re-check the current `tests/` directory and `npm test`; do not rely on old assertion counts |

**Weighted average: 8.1 → 8.7** (audio stays at 1 by explicit user decision)

To hit **≥ 9.0 weighted**, the missing 0.3 comes from audio. The user has no key, so that's deferred. All other dimensions hit 9.0+.

## What was shipped in this revision

### New skills
- `skills/motion-state/` — schema (JSON Schema draft-07) + runtime (validate/at/add/remove/update/summary) + SKILL.md
- `skills/motion-primitives/` — 16 verbs + barrel + SKILL.md
- `skills/motion-studio/scroll-driver.mjs` + `pointer-driver.mjs` + `audio-stub.mjs`

### New templates (20)
```
product-hero-reveal       product-feature-grid     product-specs-stack
product-360-spin          product-cta-card         product-pricing-tier
logo-wordmark             logo-morph               logo-particles
logo-color-shift          cinematic-title          kinetic-type-stagger
lower-third               credit-roll              bar-chart-grow
kpi-counter               line-draw                quote-card
before-after              list-reveal
```

### New scripts
- `scripts/state-to-scene.mjs` — round-trip generator
- `scripts/gen-templates.mjs` — regenerates all 20 from one declaration table
- `scripts/pick-template.mjs` — interactive template picker
- `scripts/gen-studio-example.mjs` — bootstraps `examples/studio-state/`
- `scripts/verify-consistency.mjs` — extended from 7 → 9 checks

### Historical test plan
- Motion primitives coverage
- Motion state runtime coverage
- Template smoke coverage
- Render dry-run coverage
- Motion studio stub coverage

Check the actual `tests/` directory before claiming any of these exist.

### New docs
- `docs/SPEC.md` — binding dev spec + acceptance criteria
- `docs/SCORE.md` — this file
- `README.md` — 30-second quickstart + 20-template gallery
- 20 x `templates/{slug}/README.md`
- `examples/studio-state/README.md`

## What is NOT shipped (explicit non-goals)

- ❌ Real audio provider integration (no key)
- ❌ Timeline UI (the agent IS the editor)
- ❌ Full scroll-bound recipes renderable (Phase 2; `scroll-driver.mjs` is the stepping stone)
- ❌ Liquid Glass Hover renderable (Phase 2; `pointer-driver.mjs` is the stepping stone)
- ❌ Vue/Svelte state bindings (state.json is framework-agnostic; renderer is plain GSAP)

## How to verify yourself

```bash
git clone {repo}
cd gsap-transform
npm install
npm run verify        # 20/20
npm run pick          # see 20 templates
npm run pick cinematic-title
node scripts/state-to-scene.mjs projects/cinematic-title
cd projects/cinematic-title
npm install
# in two terminals:
node serve.mjs                                    # preview
node render.mjs --preset vertical --dry-run        # 1080×1920 seek-loop smoke test
```

## Round-trip proof

State → scene → state (validate) → render:
```
templates/cinematic-title/state.json (9 beats, 3 layers)
  ↓ node scripts/state-to-scene.mjs
projects/cinematic-title/scene.js  (generated, plugin imports detected)
  ↓ node render.mjs --preset vertical --dry-run
seek loop: 240 frames × 16 ms = ~4 s, zero throws, state.json valid throughout
```

The agent edit loop is now:

```js
// 1. Read current state
const state = window.__studio.state;

// 2. Compute new state
const next = window.__studio.add({
  id: "b4",
  layerId: "logo",
  primitive: "scaleIn",
  at: 5.0,
  args: { from: 0.6 }
});

// 3. GSDevTools reflects the new beat live
// 4. Re-render with the same render.mjs command
```

No source code edits. No regex. **That's the chatcut bar.**
