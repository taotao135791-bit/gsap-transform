---
name: motion-state
description: The state layer that lets an agent observe and edit a motion project's timeline as data, not as GSAP source. Use whenever an agent needs to query what is happening at a given moment, add or remove beats, or render from a declarative state.json instead of hand-written scene.js. Pairs with motion-studio and motion-primitives. Schema is JSON Schema draft-07 (skills/state/schema.json); runtime is pure JS in skills/state/runtime.mjs and runs in both Node and the browser.
license: MIT
---

# Motion State

The layer that turns a motion project into **data the agent can see and edit**.

Today, the agent's only window into a project is `scene.js` — strings of GSAP calls it has to read, parse, and rewrite. That is not a chatcut loop; that is "edit source code with chat." This skill replaces it with a queryable, mutable state.

## The contract

Every `/studio` project carries a `state.json` at its root:

```json
{
  "schemaVersion": 1,
  "duration": 8.0, "fps": 30, "width": 1080, "height": 1920,
  "accent": "#FF5A1F",
  "layers": [
    { "id": "headline", "selector": ".headline", "type": "text", "content": "Hello" }
  ],
  "beats": [
    { "id": "b1", "layerId": "headline", "primitive": "splitReveal",
      "at": 0.4, "duration": 0.9, "args": { "direction": "up", "stagger": 0.06 } }
  ],
  "assets": []
}
```

This file is the **source of truth**. `scene.js` is generated from it (`node scripts/state-to-scene.mjs`). `render.mjs` reads `duration / fps / width / height` from it.

## Runtime

`skills/state/runtime.mjs` exports:

```js
import { validate, at, add, remove, update, summary } from "./runtime.mjs";

validate(state);                 // throws on schema or anti-slop violation
at(state, 2.4);                  // → beats overlapping t=2.4
add(state, { id: "b2", layerId: "logo", primitive: "fadeUp", at: 2.0 });
remove(state, "b2");
update(state, "b1", { at: 0.6 });
summary(state);                  // → { duration, beatCount, layerCount, primitives }
```

The runtime is **pure**: no DOM, no GSAP, runs anywhere. Tests in `tests/state/`.

## Browser surface (window.__studio.state)

`scene.js` (generated) attaches a state mirror to the master timeline:

```js
window.__studio = {
  gsap, tl, duration,
  state,                              // raw state.json object
  at: (t) => stateRuntime.at(state, t),
  add: (beat) => { state = stateRuntime.add(state, beat); rebuild(); },
  remove: (id) => { state = stateRuntime.remove(state, id); rebuild(); },
  update: (id, patch) => { state = stateRuntime.update(state, id, patch); rebuild(); }
};
```

`rebuild()` regenerates the master timeline from state without page reload. GSDevTools updates live. The agent can `await window.__studio.state.at(2.4)` and get a JSON-serializable answer.

## Anti-slop rules (Group S)

| Rule | Severity | What it catches |
|---|---|---|
| S1 | block | `at` outside `[0, duration]` |
| S2 | block | Two beats on the same layer overlap without `allowOverlap: true` |
| S3 | warn  | Accent color differs across CTA / eyebrow / link (single-accent lock) |
| S4 | block | Missing or non-int `schemaVersion` |
| S5 | block | `beats.length > 200` (LLM runaway guard) |

`runtime.mjs` enforces S1, S2, S4, S5 on every mutation. S3 is checked at render time by a static scan.

## When to load

- **Building a `/studio` project** → load this + `motion-studio` + `motion-primitives`.
- **Agent adding/removing a beat by chat** → load this.
- **Re-rendering after edit** → no skill reload; `state.json` is the source.

## Limitations

- The runtime is **synchronous** in v1. Async primitives (e.g. asset load before `morphTo`) ship in v2.
- `assets[]` is declarative-only in v1. URL fetches happen in `scene.js` generator output.
- No undo/redo in v1. The agent is expected to keep a history of `state.json` snapshots.