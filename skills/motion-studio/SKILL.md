---
name: motion-studio
description: The delivery shell that turns a generated or hand-written GSAP scene into a previewable, tunable, multi-resolution video artifact. Use when the user wants to produce a self-contained "preview project" they can open in a browser, scrub on a timeline, and render to mp4/webm/mov — i.e. when the goal is a video file, not a web page. Default agent path is state.json -> generated scene.js -> preview/render shell; hand-written scenes are an escape hatch. Provides the seek contract, GSDevTools timeline UI (hidden during render), and resolution presets (1080p / 4k / vertical / square). Trigger words: preview project, render video, export mp4, render to video, GSDevTools timeline, multi-resolution, vertical video, /studio, effect video, promo video, video artifact, chatcut-style.
license: MIT
---

# Motion Studio (Video Delivery Shell)

The layer that turns an animated GSAP scene into a **video artifact**: a self-contained folder the user opens in a browser, scrubs on a timeline, tunes by chat, and renders to a multi-resolution mp4. This is the bridge from "GSAP web animation" to "the user gets an .mp4" — the missing end of the pipeline that `/export` ([motion-craft](../motion-craft/SKILL.md)) only sketched.

It is a **delivery shell**, not a design skill. Aesthetic direction still comes from [motion-design-taste](../motion-design-taste/SKILL.md); editable timeline state comes from [motion-state](../motion-state/SKILL.md) and [motion-primitives](../motion-primitives/SKILL.md); GSAP API details come from the `gsap-*` skills. Motion Studio owns only the preview/export mechanics.

## When to Use This Skill

Apply when the user wants the output as a **video file** (mp4 / webm / mov), or describes the work as a promo / spot / sting / reel / title sequence rather than a scrollable page. The canonical entry point is the [`/studio`](../motion-craft/SKILL.md) command, which loads this skill together with the design layer.

**Related skills:** [motion-design-taste](../motion-design-taste/SKILL.md) for the aesthetic brain; [motion-state](../motion-state/SKILL.md) and [motion-primitives](../motion-primitives/SKILL.md) for the default state workflow; [motion-anti-slop](../motion-anti-slop/SKILL.md) Group **G6** for the seek-contract checks; [gsap-timeline](../gsap-timeline/SKILL.md) and [gsap-plugins](../gsap-plugins/SKILL.md) (SplitText, MorphSVG, GSDevTools) for the API; [motion-craft](../motion-craft/SKILL.md) `/studio` for the command that orchestrates this skill.

## Section 1 — The preview-project artifact

Every `/studio` run produces one folder, e.g. `projects/cookware-promo/`. The default path starts from `state.json`, then `scripts/state-to-scene.mjs` generates the choreography file. The shell files are stable scaffolding.

| File | Responsibility | Edit during tuning? |
|---|---|---|
| `state.json` | Default source of truth: duration, fps, layers, beats, primitive refs, assets. | **Yes — default tuning surface** |
| `index.html` | Static shell: fonts, `--accent` lock, `.stage`, `#devtools` mount, Export button, `.js`/`.no-js` gate, dev `?ar=` preview, the GSDevTools-mount inline module. **No choreography.** | Rarely (only fonts/accent/copy) |
| `scene.js` | Generated GSAP choreography. Exposes `window.__studio = { gsap, tl, duration }`. Wrapped in `gsap.matchMedia`. | Generated artifact; escape-hatch edits require explicit choice |
| `render.mjs` | Node CLI: drives the timeline frame-by-frame in headless Chrome and encodes to video. Copied verbatim from the template. | Never |
| `package.json` | Declares `puppeteer-core` + `@ffmpeg-installer/ffmpeg`. Copied verbatim. | Never |

## Section 2 — The seek contract (load-bearing)

`render.mjs` cannot introspect arbitrary GSAP code. It needs a single, stable surface to drive. Every preview project MUST satisfy these five requirements — they are enforced by [motion-anti-slop](../motion-anti-slop/SKILL.md) **Group G6** and are the difference between a renderable artifact and a broken one.

1. **Default-import every plugin from esm.sh — including `GSDevTools`.**
   ```js
   import { gsap } from "https://esm.sh/gsap@3.15.0";            // gsap itself: named
   import SplitText  from "https://esm.sh/gsap@3.15.0/SplitText"; // plugins: DEFAULT (Anti-Slop G4)
   import GSDevTools from "https://esm.sh/gsap@3.15.0/GSDevTools";
   ```
   GSDevTools *feels* like tooling, but it is a plugin — `import { GSDevTools }` may resolve to `undefined` (G6.3).

2. **Wrap all motion in `gsap.matchMedia()`** with `isMotionOK` / `isReduced` branches ([motion-design-taste](../motion-design-taste/SKILL.md) §7). `render.mjs` forces `prefers-reduced-motion: no-preference` so the motion branch always runs.

3. **Expose the contract** after the scene is built:
   ```js
   window.__studio = { gsap, tl, duration: () => tl.duration() };
   window.dispatchEvent(new Event("__studio:ready"));
   ```
   `tl` is the **single master `gsap.timeline()`**. `render.mjs` reads `duration()` and seeks `tl`. This is the only surface it touches.

4. **Gate `GSDevTools.create()` on `!window.__RENDERING`.** The shell (index.html inline module), not scene.js, calls it:
   ```js
   if (window.__RENDERING || !window.__studio?.tl) return;
   gsap.registerPlugin(GSDevTools);
   GSDevTools.create({ animation: window.__studio.tl, container: "#devtools" });
   ```
   `render.mjs` sets `window.__RENDERING = true` via `evaluateOnNewDocument` **before** `goto`, so GSDevTools never mounts during capture. (Why not a URL param? Browsers cache modules and drop query strings on reload. Why not an env var? The browser cannot read Node env. `evaluateOnNewDocument` is the only value guaranteed true for the whole seek loop.)

5. **Gate `SplitText` on `document.fonts.ready`** (G6.5). SplitText measures line boxes; a webfont swap after measurement reflows lines and breaks the mask reveal.

## Section 3 — Rendering (`render.mjs`)

```bash
npm install                       # first time: puppeteer-core + @ffmpeg-installer/ffmpeg
node render.mjs --preset vertical # → output.mp4 (1080×1920)
```

`render.mjs` uses **puppeteer-core** with the **system Chrome** (no Chromium download). It does **NOT** use the `gsap.updateRoot` ticker-hijack from [gsap-plugins](../gsap-plugins/SKILL.md) §"Exporting GSAP motion as video" — that method assumes the tween lives on `gsap.globalTimeline`, which is **false** for a master timeline built inside `gsap.matchMedia()` (the tl lives in the matchMedia context, not on the root). Instead it seeks the timeline directly:

```text
start a local HTTP server          # file:// blocks ES-module scene.js via CORS — must serve over http://
launch system Chrome (headless)
evaluateOnNewDocument(() => window.__RENDERING = true)          # hide GSDevTools for the whole session
setViewport(width, height, deviceScaleFactor)                   # the target aspect ratio
CDP Emulation.setEmulatedMedia(prefers-reduced-motion: no-preference)  # force the motion branch
goto http://127.0.0.1:PORT/index.html  →  waitForFunction("window.__studio.tl")
inject CSS: #devtools,#export-btn,#export-status { display:none }   # strip ALL dev chrome from frames
tl.timeScale(0)                                                 # freeze the timeline so the ticker can't drift it
for f in 0..duration*fps:
    tl.time(f / fps)        # absolute seek; evaluate returns undefined, NEVER the tl object
    sleep ~16ms             # let the compositor paint (NOT requestAnimationFrame — see R-G4)
    page.screenshot(omitBackground?)
ffmpeg encode frames → mp4 | webm | mov
```

If auto-detection cannot find Chrome, set `CHROME_PATH=/path/to/chrome`. puppeteer-core **never** downloads Chromium — that property is non-negotiable.

### Rendering gotchas (each one bit us in testing — all are baked into render.mjs)

- **R-G1 — `file://` blocks ES modules.** `<script type="module" src="./scene.js">` fails with "origin null" CORS under `file://`. render.mjs serves the project over `http://127.0.0.1` so modules load. (Consequence: the user cannot preview by double-clicking index.html either — see §7.)
- **R-G2 — `gsap.updateRoot()` cannot drive a `gsap.matchMedia()` timeline.** A timeline built inside `matchMedia().add()` lives in that context, not on `gsap.globalTimeline`; `updateRoot(t)` advances the root but leaves the tl parked at its end state. Seek the tl itself with `tl.time(t)`.
- **R-G3 — never let an `evaluate` return the `tl` object.** `tl.time()` / `tl.pause()` / `tl.timeScale()` return the tl (a circular GSAP object). Puppeteer tries to JSON-serialize it back to Node and the call hangs until `protocolTimeout` (30 s). Always use a block body that returns `undefined`: `() => { window.__studio.tl.time(t); }`.
- **R-G4 — don't wait on `requestAnimationFrame` inside `evaluate`.** rAF does not fire reliably under headless CDP, so the promise never resolves and the call times out. Use a host-side `setTimeout` instead. The timeline is frozen (`timeScale(0)`), so the delay cannot drift the playhead.

## Section 4 — Resolution presets & formats

See [references/presets.md](./references/presets.md) for the full table. Summary:

- **Presets** (`--preset`): `1080p` (default) · `4k` (1080p CSS viewport + `deviceScaleFactor:2`) · `vertical` (9:16) · `square` (1:1).
- **Formats** (`--format`): `mp4` (H.264, no alpha) · `webm` (VP9, alpha) · `mov` (ProRes 4444, alpha).
- **`--transparent`** strips every background and disables 3D compositing — pair with `webm`/`mov`, never `mp4`. `rotationY`/`rotationX` cannot be captured in transparent mode ([gsap-plugins](../gsap-plugins/SKILL.md) §3D artifact).

## Section 5 — Scroll → time mapping

`render.mjs` seeks the master timeline with `tl.time(t)` — i.e. **time**, not scroll position. A `ScrollTrigger` with `scrub` therefore never progresses in a render (scroll never happens).

- **Phase 1 (now):** `/studio` only accepts **time-driven** recipes — [Editorial Kinetic](../motion-recipes/SKILL.md), Minimal Fade, Kinetic Type Stagger, Bento Flip (entrance only), Grid Break Overlap (entrance only). If the brief selects a scroll-bound recipe (Brutalist Scroll, Cinematic Pinned Scrub), `/studio` warns and falls back to a time-driven one.
- **Phase 2:** a synthetic scroll driver will map `tl.progress()` so pinned/scrubbed scenes become renderable.

When converting a recipe's scroll beat to a time beat, replace `scrollTrigger: { scrub }` with an absolute position on the master timeline: `tl.to(el, {...}, "<0.4")`. Hold durations replace scroll distances.

## Section 6 — Mouse-tween limitation

`quickTo` / `Draggable` / `pointermove`-driven tweens do **not** advance under `gsap.updateRoot(t)` — their setters fire on DOM events that never occur in headless capture ([motion-craft](../motion-craft/SKILL.md) §/export limitations, [gsap-plugins](../gsap-plugins/SKILL.md) §Limitations).

- **Phase 1:** `/studio` **refuses** [Liquid Glass Hover](../motion-recipes/SKILL.md) (it is built on `quickTo` magnetic CTAs — interactive-only, no video form).
- **Phase 2:** a `--pointer-path` flag will inject synthetic `pointermove` events at deterministic times between seeks.

## Section 7 — The tuning loop (conversational micro-tuning)

The user tunes by **chat**, not by editing code:

> user: "make the headline slower"
> → agent edits `state.json`
> → runs `node scripts/state-to-scene.mjs projects/{slug}`
> → user refreshes the browser tab — the new choreography + GSDevTools timeline update live.

Rules for the agent during tuning:

- **Default to editing `state.json`.** `scene.js` is generated from it.
- **Direct scene edits require an explicit escape hatch.** If you do, clearly state that the file is no longer purely generated.
- **Refresh after regeneration.** If browser module caching bites, bump `?v=` in index.html.
- **No build step.** Refreshing the `node serve.mjs` browser tab *is* the hot reload. Do NOT double-click `index.html` — ES modules are blocked under `file://` (R-G1); run `npm run preview` (or `node serve.mjs`) and open the printed URL.

## Section 8 — GSDevTools hiding (three layers)

GSDevTools is a DOM overlay; if it reaches a frame, every PNG is corrupted. Defense in depth:

1. `window.__RENDERING = true` before `goto` → `GSDevTools.create()` is never called (canonical).
2. `render.mjs` injects CSS hiding **all** dev chrome — `#devtools, #export-btn, #export-status { display:none }` — belt-and-suspenders. The `__RENDERING` gate covers GSDevTools; the Export button + status overlay are hidden here too (they are dev affordances, not part of the video).
3. Screenshots use full-viewport `page.screenshot()`; if both above failed, the overlay sits bottom-center and could be cropped — but this should never trigger.

GSDevTools is dev-only in production web pages too ([gsap-plugins](../gsap-plugins/SKILL.md) "Do not ship GSDevTools"). In the studio it is allowed because the artifact is a dev tool itself — but it must never reach a rendered frame.

## Limitations (state these to the user)

- **Silent renders only** — no audio / J-cuts in Phase 1.
- **Pointer tweens not recordable** — see §6.
- **Scroll-bound recipes not renderable** until Phase 2 — see §5.
- **`gsap.matchMedia` viewport conditions lock to the render viewport** — `render.mjs` sets the viewport to the preset size; do not branch on width inside scene.js.
- **`repeat: -1` tweens never auto-stop** under the ticker hijack — `/studio` wraps infinite loops in an explicit start/end on the master timeline.

## Best Practices

- ✅ Produce **one master timeline** and expose it via `window.__studio`; never let multiple top-level tweens dangle (the showcase pattern lets them dangle — the studio pattern must collect them).
- ✅ Re-run [motion-anti-slop](../motion-anti-slop/SKILL.md) Group **G6** after every generated-scene change.
- ✅ When the user asks for a different aspect ratio, re-render with a new `--preset`; do **not** rewrite the scene. The same generated scene must look acceptable across presets (use `clamp()` / `vmin` units).
- ✅ Capture `originalPath = el.getAttribute("d")` for any MorphSVG target and restore it before a re-render — `clearProps` does not restore `d` ([gsap-plugins](../gsap-plugins/SKILL.md) §MorphSVG reset).

## Do Not

- ❌ Ship a preview project without the `window.__studio` contract — `render.mjs` will time out (G6.1).
- ❌ Call `GSDevTools.create()` unconditionally — it corrupts every frame (G6.2).
- ❌ Use `import { GSDevTools }` (named) — it may resolve to `undefined` (G6.3).
- ❌ Use `quickTo` / `Draggable` / pointer tweens in a render-target scene (Phase 1) — they will not move (G6.4).
- ❌ Call `SplitText.create` before `document.fonts.ready` (G6.5).
- ❌ Add `ScrollTrigger` scrub to a scene meant to be rendered — scroll never happens under the ticker hijack.
- ❌ Download Chromium — `puppeteer-core` drives the system Chrome; keep `executablePath` discovery in `render.mjs`.
