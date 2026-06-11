---
applyTo: "**/*.{js,jsx,ts,tsx,mjs,vue,svelte,astro,html}"
---

# GSAP plugins — path-specific instructions

When using GSAP plugins (SplitText, MorphSVG, DrawSVG, MotionPath, Flip, Draggable, Inertia, Observer, CustomEase, CustomWiggle, ScrambleText, ScrollSmoother, Physics2D):

- Register every plugin once: `gsap.registerPlugin(SplitText, MorphSVGPlugin, ...)`. Without registration, the plugin is silently dropped in production builds.
- All plugins are **free** since Webflow acquisition. Install from `gsap` npm package; no `.npmrc` / auth token / Club membership.

**Browser-native ESM CDN (no bundler):**
- Use `https://esm.sh/gsap@3.15.0` for the core, `https://esm.sh/gsap@3.15.0/<PluginName>` for plugins.
- **Always use default imports** for plugins from `esm.sh` (`import ScrollTrigger from "...";`). Named imports may resolve to `undefined`.
- Do NOT use `cdn.jsdelivr.net/npm/gsap/<Plugin>.js` — module graph breaks in browsers.

**Plugin-specific:**
- **MotionPath** and **DrawSVG**: accept `<path>` elements only. Convert `<circle>`, `<rect>`, `<ellipse>` to a `<path>` first.
- **MorphSVG**: writes to the SVG `<path>` `d` attribute, not inline CSS. `clearProps` does not restore `d`. Capture the original `d` at load time and restore it manually in any reset function.
- **SplitText**: revert before re-running on the same element (`splitInstance.revert()`); otherwise nested splits accumulate.
- **Flip**: `Flip.getState(els)` → DOM change → `Flip.from(state, {...})` for layout transitions.
- **Draggable** + **InertiaPlugin**: use `type: "x"` (or `"x,y"`, or `"rotation"`) and `inertia: true` for momentum.

**Exporting motion as transparent video** is documented in `skills/gsap-plugins/SKILL.md` "Exporting GSAP SVG motion as video" section (Puppeteer + FFmpeg, ProRes 4444 alpha or VP9 alpha WebM).
