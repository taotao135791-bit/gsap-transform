# GSAP Transform Specification

This is the current product and technical contract for GSAP Transform.

GSAP Transform is a third-party, community, agent-oriented GSAP motion skill
system. It helps coding agents read motion taste, edit motion state, and
generate previewable or renderable GSAP animation artifacts.

It is not an official GreenSock or Webflow project.

## 1. Product Goal

The goal is to help coding agents produce GSAP motion artifacts that are:

- better directed by product and brand context
- editable as state instead of opaque source code
- generated from reusable motion primitives
- previewable in a browser
- renderable through the existing studio shell
- verifiable through consistency checks and tests

The product path is:

```text
Brief
  -> Design Read
  -> motion dials
  -> state.json
  -> primitive beats
  -> generated scene
  -> preview/render
  -> validation
```

## 2. Non-Goals

This repository is not:

- a replacement for official GSAP documentation
- an official Webflow integration
- an After Effects, Rive, or Spline replacement
- a general video editor
- an automatic guarantee of good taste
- a place to make generated `scene.js` the normal source of truth

## 3. Three-Layer Architecture

### Design Layer

The Design Layer loads first. It reads the brief, product context, and brand
context before code is written.

Primary skills:

- `motion-design-taste`
- `motion-anti-slop`
- `video-grammar`

Responsibilities:

- output a Design Read
- set `MOTION_INTENSITY`, `DESIGN_VARIANCE`, and `VISUAL_DENSITY`
- choose a motion mode: Restrained, Expressive, or Cinematic
- avoid default AI aesthetics
- decide whether State/API/delivery helpers are needed
- run final anti-slop checks

### State Layer

The State Layer is the default editing surface.

Primary assets:

- `motion-state`
- `motion-primitives`
- `templates/`
- `state.json` workflow

Responsibilities:

- treat `state.json` as the default source of truth
- let agents query, add, remove, and update timeline beats
- express animation beats through reusable primitives
- validate state before generating a scene
- generate `scene.js` / `scene.mjs` as artifacts

Hand-written scenes are allowed as an escape hatch for advanced users or
historical examples, but they are not the default agent workflow.

### API Layer

The API Layer loads after Design and State when implementation depth is needed.

Current API skills:

- `gsap-core`
- `gsap-timeline`
- `gsap-scrolltrigger`
- `gsap-plugins`
- `gsap-utils`
- `gsap-react`
- `gsap-frameworks`
- `gsap-performance`

Responsibilities:

- supply concrete GSAP API usage
- handle timelines, plugins, ScrollTrigger, framework lifecycle, and cleanup
- keep implementation aligned with accessibility and performance constraints
- avoid bypassing Design and State with raw GSAP as the first move

## 4. Agent Workflow

Recommended path:

```text
Brief
  -> Design Read
  -> state.json
  -> primitive beats
  -> generated scene
  -> preview/render
  -> validation
```

Concrete commands:

```bash
npm run pick product-hero-reveal
node scripts/state-to-scene.mjs projects/product-hero-reveal
cd projects/product-hero-reveal
node serve.mjs
node render.mjs --preset vertical --dry-run
```

For tuning:

```bash
# edit projects/{slug}/state.json
node scripts/state-to-scene.mjs projects/{slug}
```

## 5. `state.json` Contract

The schema lives at `skills/motion-state/schema.json`.

Required top-level fields:

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | integer | currently `1` |
| `duration` | number | total seconds, greater than `0` |
| `fps` | integer | `24`, `30`, or `60` |
| `width` | integer | canvas width in pixels |
| `height` | integer | canvas height in pixels |
| `layers` | array | targetable layer definitions |
| `beats` | array | timeline beats |

Optional top-level fields:

| Field | Type | Notes |
|---|---|---|
| `accent` | string | hex color like `#FF5A1F` |
| `slug` | string | template/project slug |
| `title` | string | human label |
| `industry` | string | template grouping |
| `motionIntensity` | number | optional `1` to `10` dial |
| `fonts` | object | map of font names to URLs |
| `assets` | array | `{ id, url }` records |

Layer fields:

| Field | Type | Notes |
|---|---|---|
| `id` | string | unique layer id |
| `selector` | string | selector used by generated scene |
| `type` | enum | `any`, `text`, `svg-path`, `container`, `group`, `image` |
| `content` | string | optional generated HTML content |

Beat fields:

| Field | Type | Notes |
|---|---|---|
| `id` | string | unique beat id |
| `layerId` | string | must reference an existing layer |
| `primitive` | string | must exist in the primitive registry |
| `at` | number | start time in seconds |
| `duration` | number | optional but expected for templates |
| `args` | object | primitive params |
| `allowOverlap` | boolean | permits same-layer overlap when intentional |

Runtime validation currently enforces:

- `schemaVersion: 1`
- positive `duration`, `width`, `height`
- `fps` in `24 | 30 | 60`
- valid layer ids
- known primitive names
- layer references exist
- primitive/layer type compatibility
- `at` inside `[0, duration]`
- positive beat durations when present
- duplicate layer/beat ids are rejected
- same-layer overlap is rejected unless `allowOverlap: true`
- beats count is at most `200`

## 6. Primitive Contract

Primitive source lives in `skills/motion-primitives/`.

Each primitive must have:

- stable `name`
- supported `layerTypes`
- `defaultArgs`
- clear params
- `apply(target, args, ctx)` that can be consumed by the generator
- docs for user-facing behavior
- registry export from `skills/motion-primitives/index.js`
- State Layer alignment when layer type or validation changes
- tests

Unknown primitives must throw a clear error. The current registry error is:

```text
unknown primitive: {name}
```

Current primitive names are defined in both:

- `skills/motion-primitives/index.js`
- `skills/motion-state/runtime.mjs`

These lists must stay synchronized.

## 7. Template Contract

Templates live under `templates/{slug}/`.

Each template should include at least:

- `state.json`
- reasonable `duration`
- valid `fps`
- `width` and `height`
- layers
- beats
- primitive refs that exist
- layer refs that exist
- beat timings that fit within total duration

Existing templates may also include README files and thumbnails. This spec does
not require every template to add extra brief or shotlist files.

## 8. Studio Artifact Contract

The existing preview/render shell is a delivery mechanism, not the source of
truth.

A generated project can contain:

| File | Contract |
|---|---|
| `state.json` | default editable source of truth |
| `scene.js` | generated GSAP artifact |
| `index.html` | preview shell |
| `render.mjs` | render CLI |
| `serve.mjs` | local preview server |
| `package.json` | project render dependencies/scripts |

The generated scene must expose the studio seek surface:

```js
window.__studio = { gsap, tl, duration };
window.dispatchEvent(new Event("__studio:ready"));
```

`render.mjs` seeks the timeline directly with `tl.time(t)`.

Do not document a quality report generator, large studio CLI, or product launch
film template as existing behavior unless it is actually implemented.

## 9. Adapter Coverage Contract

When a skill changes, update the matching adapters.

Required surfaces:

| Surface | File |
|---|---|
| Skill source | `skills/{name}/SKILL.md` |
| GitHub Copilot | `.github/instructions/{skill}.instructions.md` |
| Cursor | `.cursor/rules/{skill}.mdc` |
| Windsurf current | `.windsurf/rules/gsap.md` |
| Windsurf legacy | `.windsurfrules` |

`CLAUDE.md` and `GEMINI.md` should keep importing `AGENTS.md` instead of
duplicating hard rules.

## 10. Validation And CI Expectations

Local validation:

```bash
npm run verify
npm test
```

CI should run both commands.

`npm run verify` checks cross-adapter consistency, skill metadata, Windsurf
parity, GSAP ESM import safety, State/Primitive integrity, and template
presence.

`npm test` should cover real behavior. It must not be a 0-test false positive.

## 11. Future Work

Possible future work, not implemented by this spec:

- flagship `product-launch-film` template
- `quality_report.md` generator
- stronger `studio` CLI
- richer schema validation
- visual regression or snapshot testing
- broader render dry-run coverage

Do not claim these as shipped until they exist and are verified.
