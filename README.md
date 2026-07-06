# GSAP Transform

Motion Director for Coding Agents.

GSAP Transform is a community, third-party, agent-oriented GSAP motion skill
system. It helps coding agents read motion taste, edit motion state, and
generate previewable or renderable GSAP animation artifacts.

This repository is not published by GreenSock, Webflow, or any official GSAP
team.

[中文版 README_CN.md](./README_CN.md)

## What This Is

GSAP Transform is a skill system for coding agents such as Codex, Cursor,
Claude Code, Gemini, Copilot, and Windsurf.

It gives agents a default motion workflow:

```text
Brief / product context
  -> Design Read
  -> motion dials
  -> state.json edits
  -> primitives
  -> generated scene
  -> preview/render
  -> anti-slop check
```

## What This Is Not

- Not an official GreenSock project.
- Not an official Webflow integration.
- Not a replacement for the GSAP docs.
- Not a general video editor.
- Not a promise that taste is automatic.
- Not a mandate to hand-edit generated `scene.js`.

## Why This Exists

Coding agents often default to the same motion cliches:

- `Inter` everywhere
- AI-purple gradients on dark mesh
- centered hero with three cards below
- `back.out(1.7)` as the default ease
- parallax on every section
- hover lift, scale, and shadow all at once
- no `prefers-reduced-motion` branch

GSAP is powerful. Agents need a stronger product and motion direction before
they start writing GSAP calls.

## Architecture

### Design Layer

Loads first. It reads the brief, product context, and brand context before any
GSAP code is written.

Includes:

| Skill | Role |
|---|---|
| `motion-design-taste` | Design Read, motion dials, motion mode, routing |
| `motion-anti-slop` | deterministic checks against generic AI motion |
| `video-grammar` | video-native shot, camera, transition, and pacing rules |

The Design Layer sets:

- `MOTION_INTENSITY`
- `DESIGN_VARIANCE`
- `VISUAL_DENSITY`

It decides which State and API skills the agent should load.

### State Layer

The default editing layer. It turns motion into data that can be read, changed,
validated, regenerated, previewed, and rendered.

Includes:

| Asset | Role |
|---|---|
| `motion-state` | `state.json` schema and runtime |
| `motion-primitives` | reusable motion verbs such as `fadeUp`, `splitReveal`, `cameraPush` |
| `templates/` | reusable `state.json` skeletons |
| `state.json` workflow | the default source of truth |

By default, agents edit `state.json`, not generated `scene.js`.

`scene.js` / `scene.mjs` are generated artifacts. Advanced users can still use
hand-written scenes as an escape hatch, but that is not the normal agent path.

### API Layer

Loads after Design and State when implementation depth is needed.

Includes:

| Skill | Role |
|---|---|
| `gsap-core` | tweens, transforms, `autoAlpha`, `matchMedia` |
| `gsap-timeline` | sequencing, labels, position parameter |
| `gsap-scrolltrigger` | scroll-linked motion, pinning, scrub, cleanup |
| `gsap-plugins` | SplitText, MorphSVG, DrawSVG, MotionPath, Flip, Draggable, and more |
| `gsap-react` | React lifecycle and `useGSAP` |
| `gsap-frameworks` | Vue, Nuxt, Svelte lifecycle and cleanup |
| `gsap-performance` | transforms, batching, `will-change`, render safety |

API skills are implementation depth. They are not the product entry point.

## Quickstart

```bash
git clone https://github.com/taotao135791-bit/gsap-transform.git
cd gsap-transform
npm run verify
npm test
npm run pick product-hero-reveal
node scripts/state-to-scene.mjs projects/product-hero-reveal
cd projects/product-hero-reveal
npm install
node serve.mjs
node render.mjs --preset vertical --dry-run
```

`npm run pick product-hero-reveal` clones a real template into
`projects/product-hero-reveal/` and runs the generator.

The edit loop is:

```bash
# edit projects/{slug}/state.json
node scripts/state-to-scene.mjs projects/{slug}
# refresh the preview
```

## Agent Workflow

Agents should use this order:

1. Read the brief and declare a Design Read.
2. Set `MOTION_INTENSITY`, `DESIGN_VARIANCE`, and `VISUAL_DENSITY`.
3. Pick or adapt a template state.
4. Edit `state.json`.
5. Use primitives for beats.
6. Generate `scene.js`.
7. Preview or render.
8. Run anti-slop checks.
9. Run `npm run verify` and `npm test` after repository changes.

## Templates

Templates live under `templates/{slug}/`.

Each template is a reusable `state.json` skeleton with a README. The shipped
templates are starting states for agent work, not just demos.

Pick one:

```bash
npm run pick product-hero-reveal
```

List available templates:

```bash
node scripts/pick-template.mjs
```

## State Workflow

The state contract is described in [docs/SPEC.md](./docs/SPEC.md).

Core fields include:

- `schemaVersion`
- `duration`
- `fps`
- `width`
- `height`
- `layers`
- `beats`
- optional `assets`

Each beat names a primitive and a target layer. Unknown primitives, missing
layers, bad timing, and incompatible layer types should fail validation.

## Adapter Coverage

This repository ships agent-specific adapters in addition to
`skills/{name}/SKILL.md`.

| Agent | Adapter file(s) |
|---|---|
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md`, `.claude-plugin/` |
| Gemini / Antigravity | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/{skill}.instructions.md` |
| Cursor | `.cursor/rules/{skill}.mdc`, `.cursor-plugin/` |
| Windsurf | `.windsurf/rules/gsap.md`, `.windsurfrules` |

When a skill changes, update its adapters in the same change.

## Validation

Run:

```bash
npm run verify
npm test
```

`npm run verify` checks cross-adapter consistency, skill metadata, primitive
coverage, template presence, and Windsurf parity.

`npm test` runs the Node test suite for primitives, state validation, and
templates.

## Common Failure Modes

- Editing generated `scene.js` as the default workflow.
- Skipping the Design Layer and going directly to GSAP API calls.
- Treating `state.json` as optional for normal agent edits.
- Adding a primitive without updating registry, docs, and tests.
- Adding a template with an invalid or unvalidated `state.json`.
- Updating a skill without updating Cursor, Copilot, and Windsurf adapters.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

Keep the product path small and verifiable:

```text
Design Layer -> State Layer -> API Layer
```

Do not lower verification standards to make a change look green.

## License

MIT
