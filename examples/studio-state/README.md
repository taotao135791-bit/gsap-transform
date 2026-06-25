# `examples/studio-state/`

State-driven studio examples. Each folder is generated from a template via the
new `state.json` pipeline (NOT hand-written scene.js). Demonstrates that the
chatcut edit loop works end-to-end:

```bash
# Edit state.json (e.g. move a beat, add a layer)
# Then regenerate scene.js:
node scripts/state-to-scene.mjs examples/studio-state/product-hero-reveal
# Then preview or render:
cd examples/studio-state/product-hero-reveal
node serve.mjs                       # browser preview w/ GSDevTools
node render.mjs --preset vertical --dry-run
```

| Folder | Source template | Demonstrates |
|---|---|---|
| `product-hero-reveal/` | `templates/product-hero-reveal/` | `splitReveal` (SplitText plugin), `fadeUp`, `scaleIn`, `slideInLeft`, accent color, multi-beat timeline |

## How this differs from `examples/studio/`

| | `examples/studio/` | `examples/studio-state/` |
|---|---|---|
| Source | hand-written `scene.js` | generated from `state.json` |
| Edits | the agent edits source code | the agent edits state.json |
| Seek contract | yes (G6) | yes (G6) |
| `window.__studio.state` | partial | full read/write/query |
| Rebuild on edit | manual | automatic (re-render `state-to-scene.mjs`) |

The two coexist: hand-written scene.js is still supported for power users and
for the cinematic / video-grammar recipes where state.json doesn't yet express
camera moves, BPM sync, and match cuts.