---
applyTo: "**/*"
---

# motion-studio — video delivery shell instructions

When the user wants the output as a **video file** (mp4/webm/mov) or a previewable "effect video" artifact, produce a self-contained preview project per `skills/motion-studio/SKILL.md`:

- Default path: pick or create `projects/{slug}/state.json`, then run `node scripts/state-to-scene.mjs projects/{slug}`.
- Copy shell files from `skills/motion-studio/templates/` only when a project scaffold is missing.
- Generated `scene.js` must expose `window.__studio = { gsap, tl, duration }`.
- Gate `GSDevTools.create()` on `!window.__RENDERING`; default-import every plugin (incl. GSDevTools — Anti-Slop G4/G6.3); gate SplitText on `document.fonts.ready` (G6.5).
- Preview: `node serve.mjs` (NOT `file://` — ES modules are CORS-blocked at origin null). Render: `node render.mjs --preset vertical` or another supported preset.

`render.mjs` seeks with `tl.time(t)` — NOT `gsap.updateRoot()` (a matchMedia timeline is not on globalTimeline; `updateRoot` leaves it parked at its end state). The four rendering gotchas (file:// CORS, matchMedia seek, tl-object serialization timeout, headless rAF) are baked into the script.

Tuning is chat-driven through `state.json` by default: edit state, regenerate `scene.js`, and refresh the preview tab. Direct scene edits require an explicit user-chosen escape hatch.

Run motion-anti-slop Group G6 before declaring a preview project done.
