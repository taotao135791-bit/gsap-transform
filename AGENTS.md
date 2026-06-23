# GSAP — Hard Rules for AI Coding Agents

This file is the **single source of truth** for hard rules. It is read directly by **OpenAI Codex** (`AGENTS.md`), and via `@AGENTS.md` import pointers by **Claude Code** (`CLAUDE.md`) and **Google Gemini / Antigravity** (`GEMINI.md`). It tells you the rules to follow when generating GSAP-based motion.

> Editing or contributing new SKILLs to this repo? → see [CONTRIBUTING.md](./CONTRIBUTING.md). This file is for **using** the skills, not for editing them.

---

## What this skill set gives you

A two-layer system. Always traverse it in this order:

1. **Design Layer** — read FIRST, before any GSAP code is written.
   - `skills/motion-design-taste/` — brief inference, three dials (`MOTION_INTENSITY`, `DESIGN_VARIANCE`, `VISUAL_DENSITY`), motion mode (Restrained / Expressive / Cinematic), routing decision table.
   - `skills/motion-recipes/` — eight clone-able aesthetic × motion combos.
   - `skills/motion-anti-slop/` — 32+ deterministic block / warn rules in seven groups (A–G).
   - `skills/motion-craft/` — ten commands (`/init`, `/shape`, `/animate`, `/polish`, `/audit`, `/critique`, `/quieter`, `/bolder`, `/adapt`, `/export`).
2. **API Layer** — read AFTER design direction is set, when you need implementation depth.
   - `skills/gsap-core/`, `skills/gsap-timeline/`, `skills/gsap-scrolltrigger/`, `skills/gsap-plugins/`, `skills/gsap-utils/`, `skills/gsap-react/`, `skills/gsap-frameworks/`, `skills/gsap-performance/`.

The cross-skill index is `skills/llms.txt`. Read it first if you do not know which skill to load.

---

## Hard rules (apply to every GSAP code generation)

### 1. Always declare a Design Read before code
Output one line in the form:
> "Reading this as: **\<page kind\>** for **\<audience\>**, with a **\<vibe\>** language, leaning toward **\<aesthetic family\>** and **\<motion language\>**."

Then pick a motion mode (Restrained / Expressive / Cinematic) and let `duration`, `ease`, `stagger` inherit the band from `motion-design-taste` Section 5.

### 2. Avoid the LLM-default slop pool
Without explicit brief direction, do **not** reach for:
- `Inter` for everything (use `motion-design-taste` Section 4 font pools by aesthetic family)
- AI-purple gradients on dark mesh
- Centered hero with H1 over a glowing radial blur
- `back.out(1.7)` / `elastic.*` / `bounce.*` as default ease — these are **branded character moments**, allowed at most once per page (Anti-Slop B1, B2, B3)
- Parallax on every section — earn one or two; the rest hold still (Anti-Slop C4)
- Hover stack of `y:-8 + scale:1.05 + heavier shadow` — pick **one** signal (Anti-Slop C3)

### 3. Accessibility is non-negotiable
Every page wraps GSAP work in `gsap.matchMedia()` with at least:
```js
gsap.matchMedia().add({
  isMotionOK: "(prefers-reduced-motion: no-preference)",
  isReduced:  "(prefers-reduced-motion: reduce)"
}, (ctx) => {
  if (!ctx.conditions.isMotionOK) {
    // paint end state, skip motion
    return;
  }
  // ... motion code
});
```
Shipping without this is a Pre-Flight Failure (Anti-Slop D1).

### 4. Imports and registration
- `import { gsap } from "gsap"` (npm install `gsap` — all plugins are free, no Club membership / `.npmrc` / auth token needed since the Webflow acquisition).
- For browser-native ESM (no bundler), use `esm.sh` with **default imports** for plugins:
  ```js
  import { gsap }        from "https://esm.sh/gsap@3.15.0";
  import ScrollTrigger   from "https://esm.sh/gsap@3.15.0/ScrollTrigger";
  import MorphSVGPlugin  from "https://esm.sh/gsap@3.15.0/MorphSVGPlugin";
  ```
  **Never** use named imports for plugins from `esm.sh` — they may resolve to `undefined` (Anti-Slop G4). **Never** use `cdn.jsdelivr.net/npm/gsap/<Plugin>.js` for browser-native ESM — the module graph breaks (Anti-Slop G3).
- Register every plugin once with `gsap.registerPlugin(ScrollTrigger, ...)` before use.

### 5. Transforms and opacity
- Prefer GSAP transform aliases (`x`, `y`, `scale`, `rotation`, `xPercent`, `yPercent`) over animating raw CSS `transform` or layout properties (`top`, `left`, `width`, `height`).
- Prefer `autoAlpha` over raw `opacity` so 0-state also gets `visibility: hidden` and does not block clicks.
- Don't write CSS `transform` on elements you plan to animate with GSAP — GSAP's transform system does not parse pre-existing CSS transforms as the start state (Anti-Slop G2). Use `gsap.set()` or `fromTo()` to declare the start state.
- `gsap.from(autoAlpha:0)` on an element that is **already** `opacity:0` in CSS animates 0 → 0 (no motion). Use `gsap.fromTo()` with explicit start state instead (Anti-Slop G1).

### 6. Sequencing
- Use `gsap.timeline()` with the position parameter (`"+=0.5"`, `"<"`, `"<0.1"`, labels) instead of chained `delay` values.
- Multiple `from()` / `fromTo()` tweens targeting the same property of the same element: set `immediateRender: false` on the later one(s) so the first tween's end state is not overwritten before it runs.

### 7. ScrollTrigger
- Pick **scrub** OR **toggleActions**, not both.
- Call `ScrollTrigger.refresh()` after DOM/layout changes that affect trigger positions.
- Create ScrollTriggers in top-to-bottom page order, or set `refreshPriority` to control refresh order.
- Never put a ScrollTrigger on a tween that is a child of a timeline — put it on the timeline or a top-level tween.
- Under `prefers-reduced-motion: reduce`, do **not** use scrub or pin (Anti-Slop D2).

### 8. SVG plugins
- `MotionPath` and `DrawSVG` accept `<path>` elements only — **not** `<circle>`, `<rect>`, `<ellipse>` (Anti-Slop G5). Convert other shapes to a `<path>` first.
- `MorphSVG` writes to the `<path>` element's `d` attribute, not to inline CSS. `clearProps` does **not** restore the original `d` — capture `originalPath = element.getAttribute("d")` at load time and restore manually in any reset function.

### 9. React / framework lifecycle
- React: prefer `useGSAP()` from `@gsap/react`, with a `scope` ref (selectors limited to that subtree) and rely on its automatic cleanup. Use `contextSafe` to wrap `onComplete` callbacks so they no-op after unmount.
- Vue / Nuxt / Svelte: create tweens and ScrollTriggers in `onMounted` / `onMount`; revert / kill them in `onUnmounted` / `onDestroy` to avoid stale-element animation.

### 10. Single accent lock
The brief produces one accent color. Lock it. Verify at smoke-test that all uses (CTA bg, eyebrow color, focus ring, link color, etc.) `getComputedStyle()` return the same `rgb(...)` (Anti-Slop F6).

### 11. Motion Studio seek contract
Every preview project produced by `/studio` (`skills/motion-studio/`) must:
- expose `window.__studio = { gsap, tl, duration }` and dispatch `__studio:ready`;
- gate `GSDevTools.create()` on `!window.__RENDERING`;
- import every plugin — **including GSDevTools** — as a **default** import from esm.sh (Anti-Slop G4 / G6.3);
- gate `SplitText` on `document.fonts.ready` (G6.5);
- keep the scene **time-driven** (no `ScrollTrigger scrub`, no `quickTo`/pointer tweens) so `render.mjs`'s `tl.time(t)` seek captures every frame.

Render with `node render.mjs --preset <1080p|4k|vertical|square>`; preview with `node serve.mjs` (NOT `file://` — ES modules are CORS-blocked at origin null). A timeline built inside `gsap.matchMedia()` is NOT on `gsap.globalTimeline`, so `gsap.updateRoot()` cannot drive it — seek the tl directly.

---

## When the user invokes a slash command

`/motion-craft init`, `/motion-craft shape`, `/motion-craft animate`, `/motion-craft polish`, `/motion-craft audit`, `/motion-craft critique`, `/motion-craft quieter`, `/motion-craft bolder`, `/motion-craft adapt`, `/motion-craft export`, `/motion-craft studio` — load `skills/motion-craft/SKILL.md` and follow that command's exact Sequence and Output contract.

---

## Smoke-test before shipping

After generating any animated page, the user should be able to verify in 30 seconds:
1. Open in browser, no console error / warn.
2. Single accent verified: `getComputedStyle(ctaButton).backgroundColor === getComputedStyle(eyebrow).color`.
3. Toggle OS Reduce Motion on → animation skips, end state painted.
4. Run through `motion-anti-slop` Group A–G checklist; no `block`-severity items.

If browser tooling is unavailable, state the limitation and produce the strongest static review you can (`motion-craft` Step 6).
