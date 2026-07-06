---
applyTo: "**/*"
---

# motion-state — state.json contract instructions

When the user asks the agent to edit a motion project's timeline (add a beat, change a duration, move something), the agent must operate on **`state.json`** — NOT on raw `scene.js`.

The state runtime is in `skills/motion-state/runtime.mjs`. Import it (Node) or read it from `window.__studio` (browser).

Every state mutation must call `validate(state)` before returning. Schema is in `skills/motion-state/schema.json`.

**Group S anti-slop rules** (all enforced by `validate`):
- S1: `at` must be in `[0, state.duration]`
- S2: two beats on the same layer cannot overlap unless `allowOverlap: true`
- S4: `schemaVersion: 1` is required
- S5: total beats ≤ 200

After editing state.json, regenerate scene.js:

```bash
node scripts/state-to-scene.mjs projects/{slug}
```

Render from the project directory with `node render.mjs --preset vertical` or another supported preset.
