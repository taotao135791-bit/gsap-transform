---
applyTo: "**/*"
---

# motion-studio — video delivery shell instructions

When the user wants the output as a **video file** (mp4/webm/mov) or a previewable "effect video" artifact, produce a self-contained preview project per `skills/motion-studio/SKILL.md`:

- Copy `skills/motion-studio/templates/{index.html,scene.js,render.mjs,serve.mjs,package.json}` → `projects/<slug>/`.
- Fill `scene.js` with **time-driven** beats; expose `window.__studio = { gsap, tl, duration }`.
- Gate `GSDevTools.create()` on `!window.__RENDERING`; default-import every plugin (incl. GSDevTools — Anti-Slop G4/G6.3); gate SplitText on `document.fonts.ready` (G6.5).
- Preview: `node serve.mjs` (NOT `file://` — ES modules are CORS-blocked at origin null). Render: `node render.mjs --preset <1080p|4k|vertical|square>` → `output.mp4`.

`render.mjs` seeks with `tl.time(t)` — NOT `gsap.updateRoot()` (a matchMedia timeline is not on globalTimeline; `updateRoot` leaves it parked at its end state). The four rendering gotchas (file:// CORS, matchMedia seek, tl-object serialization timeout, headless rAF) are baked into the script.

Tuning is chat-driven: edit **only** `scene.js`, bump the `?v=N` cache-buster, the user refreshes the preview tab.

Run motion-anti-slop Group G6 before declaring a preview project done.
