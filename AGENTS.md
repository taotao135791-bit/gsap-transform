# GSAP Transform — Hard Rules for AI Coding Agents

This file is the source of truth for coding agents using this repository.
Claude Code and Gemini import it through `CLAUDE.md` and `GEMINI.md`.

GSAP Transform is a third-party, community, agent-oriented GSAP motion skill
system. It is not an official GreenSock or Webflow project.

Before changing or generating motion, read `skills/llms.txt`.

## Product Path

Always traverse the three-layer system in this order:

1. **Design Layer** — decide motion taste before code.
   - `skills/motion-design-taste/`
   - `skills/motion-anti-slop/`
   - `skills/video-grammar/` when the artifact is video-like
2. **State Layer** — edit the motion timeline as data.
   - `skills/motion-state/`
   - `skills/motion-primitives/`
   - `templates/{slug}/state.json`
3. **API Layer** — use GSAP implementation details only after direction and
   state are clear.
   - `skills/gsap-core/`
   - `skills/gsap-timeline/`
   - `skills/gsap-scrolltrigger/`
   - `skills/gsap-plugins/`
   - `skills/gsap-react/`
   - `skills/gsap-frameworks/`
   - `skills/gsap-performance/`

Default workflow:

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

## Design Read

Before writing GSAP code, output one line:

> Reading this as: **{page kind}** for **{audience}**, with a **{vibe}**
> language, leaning toward **{aesthetic family}** and **{motion language}**.

Then pick a motion mode:

- Restrained
- Expressive
- Cinematic

Let `duration`, `ease`, and `stagger` inherit from the selected mode.

## State Is The Default Source

- `state.json` is the default source of truth.
- `scene.js` / `scene.mjs` are generated artifacts.
- Do not hand-edit generated `scene.js` as the normal agent workflow.
- After editing `state.json`, regenerate:

```bash
node scripts/state-to-scene.mjs projects/{slug}
```

Hand-written scenes are allowed only as an explicit escape hatch for advanced
users or historical examples.

## Avoid LLM-Default Motion

Without explicit brief direction, do not reach for:

- `Inter` for everything
- AI-purple gradients on dark mesh
- centered hero over glowing radial blur
- `back.out(1.7)`, `elastic.*`, or `bounce.*` as default easing
- parallax on every section
- hover lift + scale + shadow all at once

## Accessibility

Every generated GSAP page or preview project must wrap motion in
`gsap.matchMedia()` with a reduced-motion branch:

```js
gsap.matchMedia().add({
  isMotionOK: "(prefers-reduced-motion: no-preference)",
  isReduced: "(prefers-reduced-motion: reduce)"
}, (ctx) => {
  if (!ctx.conditions.isMotionOK) {
    // Paint the end state and skip motion.
    return;
  }
  // Motion code.
});
```

Under `prefers-reduced-motion: reduce`, do not use scrub or pin.

## Imports And Registration

- Use `import { gsap } from "gsap"` for npm projects.
- For browser-native ESM, use `esm.sh` with default plugin imports:

```js
import { gsap } from "https://esm.sh/gsap@3.15.0";
import ScrollTrigger from "https://esm.sh/gsap@3.15.0/ScrollTrigger";
```

- Register every plugin once with `gsap.registerPlugin(...)`.
- Do not use named plugin imports from `esm.sh`.
- Do not use `cdn.jsdelivr.net/npm/gsap/{Plugin}.js` for browser-native ESM.

## GSAP Implementation Rules

- Prefer GSAP transform aliases (`x`, `y`, `scale`, `rotation`, `xPercent`,
  `yPercent`) over raw CSS `transform` or layout properties.
- Prefer `autoAlpha` over raw `opacity`.
- Do not write CSS `transform` on elements that GSAP will animate; use
  `gsap.set()` or `fromTo()` to declare start state.
- Use `gsap.timeline()` and the position parameter instead of chained delays.
- If multiple `from()` / `fromTo()` tweens target the same property, set
  `immediateRender: false` on later tweens.
- For ScrollTrigger, choose scrub or `toggleActions`, not both.
- Never put a ScrollTrigger on a tween that is a child of a timeline.

## Repository Change Rules

- If you edit a skill, update the matching adapters:
  - `.github/instructions/{skill}.instructions.md`
  - `.cursor/rules/{skill}.mdc`
  - Windsurf rules when the hard rule surface changes
- If you edit a template, keep its `state.json` valid.
- If you add a primitive, update the registry, docs, and tests.
- Do not lower `npm run verify` or `npm test` standards to make a change pass.

Before declaring repository work done, run:

```bash
npm run verify
npm test
```

## Slash Commands

When the user invokes `/motion-craft <subcommand>`, load
`skills/motion-craft/SKILL.md` and follow that command's sequence and output
contract. The default product path still goes through Design Layer and State
Layer before API implementation.

## Smoke Test

Before shipping an animated artifact:

1. Open in browser and check for console errors.
2. Verify single accent usage where applicable.
3. Toggle OS Reduce Motion and confirm motion skips to a valid end state.
4. Run `motion-anti-slop` checks; no block-severity item should remain.
