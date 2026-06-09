---
name: motion-anti-slop
description: Deterministic anti-slop checks for GSAP motion. Use when the user asks to audit, review, lint, or detect AI-generated motion tells in animation code; when the user says "this feels generic", "this feels AI-built", "remove the slop", or asks for a motion-quality pass before shipping. Catches default ease abuse (back.out, elastic, bounce), default duration tells (0.3 / 0.5 universal), choreography problems (every section parallax, hover lift+scale+shadow combo, eyebrow on every section), accessibility breakage (missing prefers-reduced-motion, killed scrub/pin, infinite background loops). Pair with motion-design-taste for the why and motion-craft /audit for the workflow trigger.
license: MIT
---

# Motion Anti-Slop Checks

A deterministic checklist of motion-specific AI tells. Run before declaring any animated frontend done. Each rule has a detection signature, a wrong example, and a fix.

## When to Use This Skill

Apply during a final pass on any GSAP-animated interface, or whenever the user says "this feels AI-built", "audit the motion", "remove the slop". Designed to be runnable mechanically — every rule has an explicit detection cue.

**Related skills:** [motion-design-taste](../motion-design-taste/SKILL.md) for the rationale; [motion-craft](../motion-craft/SKILL.md) for the `/audit` and `/critique` commands; [gsap-core](../gsap-core/SKILL.md), [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md), [gsap-performance](../gsap-performance/SKILL.md) for API context.

## How to Read Each Rule

- **Tell** — short name.
- **Detect** — what to look for.
- **Wrong** — minimal failing snippet.
- **Fix** — minimal corrected snippet.
- **Severity** — `block` (must fix before shipping) or `warn` (fix unless brief justifies).

Severity `block` rules are Pre-Flight Failures (see [motion-design-taste](../motion-design-taste/SKILL.md) Section 8).

## Group A — Duration Tells

### A1. Universal 0.3 s / 0.5 s default

- **Detect:** more than 70% of tweens share a single duration value.
- **Wrong:** every `gsap.to`/`from` in the file uses `duration: 0.5`.
- **Fix:** durations vary by role and follow the motion mode band: Restrained 0.2-0.5, Expressive 0.4-0.9, Cinematic 0.6-1.4. Hero text gets longer durations; supporting reveals get shorter.
- **Severity:** `warn`.

### A2. 2-second entrance on body content

- **Detect:** `duration > 1.4` on tweens not inside a pinned ScrollTrigger or hero timeline.
- **Wrong:** `gsap.from(".feature-row", { y: 60, duration: 2 });`
- **Fix:** keep body in 0.4-0.9 s; reserve >1.4 s for hero and pinned scenes only.
- **Severity:** `warn`.

### A3. Restated duration in nested timeline

- **Detect:** every child tween in a timeline repeats the same `duration` that is already in `defaults`.
- **Fix:** rely on `gsap.timeline({ defaults: { duration } })`. See [gsap-timeline](../gsap-timeline/SKILL.md).
- **Severity:** `warn`.

### A4. Forever-running decorative tween

- **Detect:** `repeat: -1` on a decorative element with no narrative purpose (rotating blob, drifting particle, looping marquee).
- **Fix:** remove, or gate behind `prefers-reduced-motion: no-preference` and pause off-screen via `ScrollTrigger`.
- **Severity:** `block`.

## Group B — Ease Tells

### B1. `back.out(1.7)` as default ease

- **Detect:** `back.*` appears in `gsap.defaults`, `timeline({ defaults })`, or on more than 2 entrance tweens.
- **Wrong:**

```javascript
gsap.defaults({ ease: "back.out(1.7)" });
gsap.from(".item", { y: 30, stagger: 0.08 });
```

- **Fix:** default to `power2.out` / `power3.out` / `expo.out`. Reserve `back.*` for one branded character moment per page (logo unlock, success confetti).
- **Severity:** `block`.

### B2. `elastic` on hover

- **Detect:** `elastic.*` inside any pointer-event handler.
- **Wrong:** `gsap.to(card, { scale: 1.05, ease: "elastic.out(1, 0.3)", duration: 0.6 });`
- **Fix:** hover uses `power2.out` and **one** property change (`y: -2` OR `scale: 1.02`, not both).
- **Severity:** `block`.

### B3. `bounce.out` on entrance

- **Detect:** `bounce.*` on a tween that is not a loader / playful 404 / explicit branded moment.
- **Fix:** entrance reveals use `power3.out` or `expo.out`.
- **Severity:** `warn`.

### B4. Easing on a scrubbed scroll animation

- **Detect:** a tween or timeline tied to ScrollTrigger `scrub: true | <number>` has any ease other than `none`.
- **Wrong:**

```javascript
gsap.to(".panel", { x: 500, ease: "power2.out", scrollTrigger: { scrub: true } });
```

- **Fix:** scrubbed scroll animations must use `ease: "none"` so scroll position and progress map 1:1. See [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md).
- **Severity:** `block`.

### B5. Mismatched ease across a single timeline

- **Detect:** a single timeline mixes `power2`, `back.out(1.7)`, `elastic.out`, `expo.inOut` with no compositional reason.
- **Fix:** pick one ease family for the timeline and let `defaults: { ease }` carry it.
- **Severity:** `warn`.

## Group C — Stagger and Choreography Tells

### C1. Universal stagger 0.1

- **Detect:** every staggered tween in the file uses `stagger: 0.1`.
- **Fix:** vary by mode (Restrained 0.03-0.06, Expressive 0.05-0.12, Cinematic 0.03-0.1) and use `from: "edges" | "center" | "random"` when it serves the composition.
- **Severity:** `warn`.

### C2. Stagger on a list of one

- **Detect:** `stagger:` declared on a tween whose target resolves to a single element.
- **Fix:** drop the `stagger`. It is dead config.
- **Severity:** `warn`.

### C3. Hover lift+scale+shadow three-piece combo

- **Detect:** card hover applies all three of `y: -8` (or similar lift), `scale: 1.03+`, and a heavier shadow at once.
- **Wrong:**

```javascript
card.addEventListener("mouseenter", () => {
  gsap.to(card, { y: -8, scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", duration: 0.3 });
});
```

- **Fix:** pick **one** signal — lift OR scale OR shadow. Modest values (`y: -2`, `scale: 1.02`, or a tinted shadow already present in resting state).
- **Severity:** `block`.

### C4. Every section gets parallax

- **Detect:** more than 50% of sections on the page have a ScrollTrigger with `scrub` and a `y / yPercent` move.
- **Fix:** parallax earns one or two sections; the rest hold still. Reserve scrub for hero, a feature reveal, or a pinned scene.
- **Severity:** `block`.

### C5. Scrub on a section that is also using `toggleActions`

- **Detect:** the same `scrollTrigger` config has both `scrub` and `toggleActions`.
- **Fix:** pick one behavior. If both are set, scrub wins; the `toggleActions` is dead config and signals confusion.
- **Severity:** `warn`.

### C6. Pinned section pinning the whole hero text including the CTA

- **Detect:** a pinned hero hides the CTA off the initial viewport because the pinned content is taller than `100dvh`.
- **Fix:** keep the hero in `min-h-[100dvh]`; pin the *next* section if a long pinned scene is needed.
- **Severity:** `block`.

### C7. ScrollTrigger inside a child of a timeline

- **Detect:** `gsap.timeline().to(".x", { scrollTrigger: {...} })`.
- **Fix:** ScrollTrigger lives on the timeline itself or on a top-level tween, never on a child.

```javascript
// wrong
gsap.timeline().to(".panel", { x: 100, scrollTrigger: { trigger: ".panel", scrub: true } });
// fix
gsap.timeline({ scrollTrigger: { trigger: ".panel", scrub: true } }).to(".panel", { x: 100 });
```

- **Severity:** `block`.

### C8. Animated background gradient running in the corner forever

- **Detect:** a non-content layer with `repeat: -1`, `yoyo: true`, animating `background-position` or transform indefinitely.
- **Fix:** remove. The eye locks onto motion; perpetual background motion drains attention from content. If atmosphere is needed, use a static gradient with grain texture.
- **Severity:** `block`.

### C9. Magnetic cursor without `quickTo`

- **Detect:** mousemove / pointermove handler creates a fresh tween every event (`gsap.to(el, { x, y, duration })` inside the listener).
- **Fix:** create one `gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" })` and one for `y`, call them inside the listener. See [gsap-performance](../gsap-performance/SKILL.md).
- **Severity:** `block`.

### C10. Marquee that loops the same word

- **Detect:** infinite-repeat marquee whose visible text is one or two words ("DESIGN DESIGN DESIGN…").
- **Fix:** marquees need rhythm — alternate words, glyphs, brand items, real content. Or remove the marquee.
- **Severity:** `warn`.

### C11. Eyebrow + chip + label stack on every section

- **Detect:** more than `ceil(sectionCount / 3)` sections start with the same eyebrow pattern (small uppercase wide-tracking label above the headline).
- **Fix:** drop the eyebrow on most sections. Section position on the page already categorizes it. See [motion-design-taste](../motion-design-taste/SKILL.md) Section 5.
- **Severity:** `warn`.

## Group D — Accessibility and Cleanup Tells

### D1. Missing `prefers-reduced-motion` branch

- **Detect:** project ships GSAP animation but never calls `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` condition, and never checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- **Fix:** wrap entrance reveals, scrub, pin, marquees in a `gsap.matchMedia({ isReduced, isMotionOK })` block. See [motion-design-taste](../motion-design-taste/SKILL.md) Section 7 and [gsap-core](../gsap-core/SKILL.md) `gsap.matchMedia()`.
- **Severity:** `block`.

### D2. Reduced-motion branch keeps scrub / pin / marquee

- **Detect:** the `(prefers-reduced-motion: reduce)` branch still creates ScrollTrigger with `scrub` or `pin`, or still starts a marquee.
- **Fix:** under reduced motion, replace scrub with `toggleActions: "play none none none"` (or skip), drop pin, stop marquees, set entrance state to its end state via `gsap.set`.
- **Severity:** `block`.

### D3. Selector without scope in a component

- **Detect:** inside a React / Vue / Svelte component, GSAP targets selectors like `".box"` without `scope` on `useGSAP` or without `gsap.context(callback, ref)`.
- **Fix:** pass the container ref. See [gsap-react](../gsap-react/SKILL.md) and [gsap-frameworks](../gsap-frameworks/SKILL.md).
- **Severity:** `block`.

### D4. Missing cleanup on unmount

- **Detect:** a `useEffect` creates a ScrollTrigger and never returns a cleanup; or a Vue `onMounted` creates `gsap.context` without a matching `onUnmounted` `ctx.revert()`.
- **Fix:** use `useGSAP` (auto cleanup) or return `() => ctx.revert()`. ScrollTriggers running on stale elements after unmount is broken work.
- **Severity:** `block`.

### D5. SSR-time GSAP execution

- **Detect:** `gsap.to`, `gsap.timeline`, or `ScrollTrigger.create` runs at module top level in a Next.js / Nuxt / SvelteKit app, outside any client lifecycle.
- **Fix:** move into `useGSAP` / `onMounted` / `onMount`. See [gsap-react](../gsap-react/SKILL.md), [gsap-frameworks](../gsap-frameworks/SKILL.md).
- **Severity:** `block`.

### D6. Plugin used without `registerPlugin`

- **Detect:** `ScrollTrigger`, `SplitText`, `Flip`, `Draggable`, `MorphSVGPlugin`, `MotionPathPlugin`, `Inertia`, `useGSAP` referenced without a corresponding `gsap.registerPlugin(...)`.
- **Fix:** register at app top level (or once before first use). See [gsap-plugins](../gsap-plugins/SKILL.md).
- **Severity:** `block`.

### D7. JS-gated initial state without a fallback gate

- **Detect:** the page has CSS rules that hide entrance elements at load time (`.reveal { opacity: 0 }`, `.hero h1 { opacity: 0 }`, `display: none`, etc.) **and** there is no `.js` / `.no-js` discriminator on `<html>` and no `<noscript>` fallback. If GSAP fails to load (CDN outage, ad-blocker, network error), the page becomes a permanent blank surface for those elements.
- **Not applicable when:** the page never sets a CSS-level hidden start state — e.g. all entrances use `gsap.from(...)` whose start is provided by GSAP itself, with no `.reveal { opacity: 0 }` rule. In that case GSAP failure leaves elements at their natural state, which is still readable, so no `.js` gate is required.
- **Fix:** gate the initial-hidden CSS behind a `.js` class on `<html>`, set in an inline `<script>` at the top of `<head>`:

```html
<html class="no-js">
  <head>
    <script>document.documentElement.className = "js";</script>
  </head>
</html>
```

```css
/* hidden only when JS is active; falls back to visible if GSAP never runs */
.js .reveal { opacity: 0; }
```

- **Severity:** `block` for any page that hides entrance elements via CSS at load time. Pages that let GSAP own the start state via `gsap.from` / `gsap.fromTo` (no CSS hidden rule) do not trigger this rule.

## Group E — Performance Tells

### E1. Animating layout properties for movement

- **Detect:** `width`, `height`, `top`, `left`, `margin`, `padding` on a `gsap.to` / `from` tween for movement or scale.
- **Fix:** use `x`, `y`, `xPercent`, `yPercent`, `scale`, `scaleX`, `scaleY`. See [gsap-performance](../gsap-performance/SKILL.md).
- **Severity:** `block` (drops well below 60fps on mid-range devices).

### E2. `will-change` everywhere

- **Detect:** `will-change: transform` (or `will-change: *`) on more than ~10% of elements, or on never-animated elements.
- **Fix:** apply only to elements that are actually animating, and remove after the animation if it stops.
- **Severity:** `warn`.

### E3. Hundreds of simultaneous tweens for a list

- **Detect:** a `forEach` loop that creates one `gsap.to` per item for hundreds of items, instead of using `stagger` or `ScrollTrigger.batch`.
- **Fix:** one tween + `stagger`, or `ScrollTrigger.batch` with `onEnter`. See [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md).
- **Severity:** `warn`.

### E4. `ScrollTrigger.refresh()` on every scroll / resize

- **Detect:** `ScrollTrigger.refresh()` called inside `onUpdate` or a scroll listener.
- **Fix:** call only after layout actually changes (content load, font load, route change). Resize is auto-handled (debounced 200ms).
- **Severity:** `warn`.

## Group F — Composition Tells

### F1. Two CTAs with the same intent

- **Detect:** "Get in touch" + "Contact us" + "Let's talk" + "Start a project" on one page; or "Try free" + "Get started" + "Sign up free".
- **Fix:** pick one label per intent and use it everywhere (nav, hero, footer).
- **Severity:** `block`.

### F2. CTA wraps to two lines at desktop

- **Detect:** primary CTA renders 2+ lines at >=1024 px viewport.
- **Fix:** shorten to ≤ 3 words, OR widen the button. See [motion-design-taste](../motion-design-taste/SKILL.md) Section 5.
- **Severity:** `block`.

### F3. Centered hero when `DESIGN_VARIANCE > 4`

- **Detect:** hero uses `text-center` / `items-center justify-center` while the project's `DESIGN_VARIANCE` dial is above 4.
- **Fix:** split (50/50), left-aligned content + right asset, asymmetric whitespace, or scroll-pinned structure. Centered hero is reserved for editorial / manifesto / launch-announcement briefs.
- **Severity:** `warn`.

### F4. Three consecutive image-text-split sections

- **Detect:** 3 sections in a row use the same image-left-text-right (or mirrored) pattern.
- **Fix:** break with a full-width section, vertical-stack section, marquee, bento grid, or different layout family.
- **Severity:** `warn`.

### F5. Color drift across page

- **Detect:** accent color in section 1 differs from accent color in section 7 (e.g. rose CTA, then teal status badge).
- **Fix:** lock one accent for the whole page; use neutrals for differentiation, not new accents.
- **Severity:** `block`.

### F6. Declared accent overridden by CSS specificity (computed color mismatch)

- **Detect:** the project declares a single accent token (e.g. `--accent: #b8732a`) and assigns it to an element via a low-specificity selector, but a more-specific or later-defined sibling rule overrides it. The page "declares" one accent but **renders** another. Mechanically: `getComputedStyle(el).color` for the supposed accent element does not equal the declared accent token.
- **Wrong:**

```css
:root { --accent: #b8732a; --mute: rgba(247,243,235,0.62); }
.eyebrow      { color: var(--accent); }   /* specificity (0,1,0) */
.hero p       { color: var(--mute);   }   /* specificity (0,1,1) — wins, eyebrow renders mute */
```

- **Fix:** raise the accent rule's specificity, OR scope the competing rule out:

```css
/* option A: raise the accent rule */
.hero p.eyebrow { color: var(--accent); }

/* option B: scope the competing rule out */
.hero p:not(.eyebrow) { color: var(--mute); }
```

- **Detect at smoke-test:** for every element that should carry the accent, run `getComputedStyle(el).color` and compare against the resolved value of the accent token. Any mismatch is an F6 hit.
- **Severity:** `block`. Treated as a sibling of F5: F5 catches "two different accents declared", F6 catches "one accent declared but not actually rendered".

## Group G — Wiring & Loading Tells

These rules catch behavioral and infrastructure bugs that silently disable animations even when the rest of the code is well-formed. They are not performance issues (Group E) and not composition issues (Group F).

### G1. `gsap.from(autoAlpha: 0)` on a CSS-hidden element (zero-amplitude animation)

- **Detect:** the target element has a CSS rule that already sets `opacity: 0` / `visibility: hidden` (e.g. `.reveal { opacity: 0 }`), and the tween is `gsap.from(el, { autoAlpha: 0, ... })`.
- **Wrong:**

```css
.reveal { opacity: 0; }
```
```javascript
gsap.from(".reveal", { autoAlpha: 0, y: 14, duration: 0.5 });
// end state is read from CSS as opacity:0 → animation runs 0 → 0, invisible.
```

- **Fix:** use `gsap.fromTo` so both ends are explicit, OR remove the CSS `opacity: 0` and let GSAP own visibility.

```javascript
gsap.fromTo(".reveal", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 });
```

- **Severity:** `block`.

### G2. CSS `transform` used as the start state of a GSAP transform-alias tween

- **Detect:** a CSS rule sets `transform: translateY(...)` / `translateX(...)` / `scale(...)` / `rotate(...)` on the target, and a GSAP tween uses the corresponding alias (`y`, `x`, `xPercent`, `scale`, `rotation`) expecting the CSS value as its start.
- **Wrong:**

```css
.reveal { transform: translateY(14px); }
```
```javascript
gsap.to(".reveal", { y: 0, duration: 0.5 });
// GSAP's transform system is independent of CSS transform; current y is read as 0, target is 0 → no movement.
```

- **Fix:** drop the CSS transform on the start state and let GSAP own it via `gsap.set` or `gsap.fromTo`.

```javascript
gsap.fromTo(".reveal", { y: 14 }, { y: 0, duration: 0.5 });
```

- **Severity:** `block`.

### G3. Single-file `cdn.jsdelivr.net/npm/gsap/<file>.js` for browser-native ESM

- **Detect:** static HTML demo (no bundler) imports GSAP plugins via `https://cdn.jsdelivr.net/npm/gsap@<v>/<Plugin>.js`.
- **Why it bites:** these single-file paths can fail intermittently in browsers (e.g. `ERR_CONNECTION_CLOSED` on `SplitText.js`) while `curl` succeeds. One failed plugin kills the whole ESM module graph and silently disables every GSAP tween in the page.
- **Fix:** use `https://esm.sh/gsap@<version>` and `https://esm.sh/gsap@<version>/<Plugin>` for browser-native ESM. See [gsap-plugins](../gsap-plugins/SKILL.md) "Browser-native ESM CDN".
- **Severity:** `block` for static HTML demos.

### G4. Named import on a GSAP plugin in browser-native ESM

- **Detect:** static HTML demo (no bundler) imports a GSAP plugin via named import: `import { Draggable } from "https://esm.sh/gsap@<v>/Draggable"`. The identifier `Draggable` resolves to `undefined`, and any subsequent `Draggable.create(...)` throws a `TypeError` that is often swallowed by GSAP's own try/catch.
- **Why it bites:** GSAP plugins ship as `export { Plugin as default }` in the npm source. The esm.sh facade *attempts* to re-export named identifiers via `export *`, but the result is **inconsistent across plugins**: `ScrollTrigger` / `SplitText` / `MorphSVGPlugin` happen to work; `Draggable` / `InertiaPlugin` consistently resolve to `undefined`. Class-style plugins (`Draggable.create`, `Flip.getState`, `SplitText.create`, `CustomEase.create`) silently break with no console error.
- **Wrong:**

```javascript
import { Draggable }     from "https://esm.sh/gsap@3.15.0/Draggable";
import { InertiaPlugin } from "https://esm.sh/gsap@3.15.0/InertiaPlugin";
// Draggable === undefined; Draggable.create(...) throws silently.
```

- **Fix:** use **default import** for every GSAP plugin in browser-native ESM. This matches the npm source and works regardless of CDN normalisation:

```javascript
import Draggable     from "https://esm.sh/gsap@3.15.0/Draggable";
import InertiaPlugin from "https://esm.sh/gsap@3.15.0/InertiaPlugin";
import ScrollTrigger from "https://esm.sh/gsap@3.15.0/ScrollTrigger";
// ...etc.
```

Only `gsap` itself uses named import (`import { gsap } from "..."`); every plugin uses default. See [gsap-plugins](../gsap-plugins/SKILL.md) "Use `default` import for every plugin".
- **Detect at smoke-test:** in the browser console, check `typeof window.__YourDebug.Draggable === "function"`. If it is `"undefined"`, the import resolution failed.
- **Severity:** `block` for any browser-native ESM page that uses class-style plugins.

### G5. MotionPath / DrawSVG given a non-`<path>` SVG primitive

- **Detect:** the page authors `motionPath.path` or `drawSVG`-target as a `<circle>`, `<rect>`, `<ellipse>`, `<polygon>`, `<polyline>`, or `<line>` element. The plugin warns `Expecting a <path> element or an SVG path data string` and the tween silently does nothing — and worse, on a master timeline this often disables every subsequent tween in the timeline.
- **Why it bites:** GSAP's path-following plugins (MotionPath, DrawSVG) compute stroke length / position from `<path>` `d` attribute exclusively. Other SVG primitives have geometry but no `d`. The warning is easy to miss in a busy console.
- **Wrong:**

```html
<circle id="orbit" cx="0" cy="0" r="42" />
```
```javascript
gsap.to("#sun", { motionPath: { path: "#orbit" } });
// silently fails; warning in console
```

- **Fix:** author the SVG as `<path>` from the start, **or** convert primitives in place before tweens run:

```html
<path id="orbit" d="M 42 0 A 42 42 0 1 1 -41.999 0 A 42 42 0 1 1 42 0 Z" />
```
```javascript
// or, with primitives already in DOM:
MotionPathPlugin.convertToPath("#orbit");  // also: MorphSVGPlugin.convertToPath("#orbit")
```

- **Detect at smoke-test:** for any tween that uses `motionPath` or `drawSVG`, run `document.querySelector(target).tagName === "path"` and confirm. After the tween runs, check `el.getAttribute("transform")` (MotionPath) or `el.style.strokeDasharray` (DrawSVG) is non-empty.
- **Severity:** `block`.

## How to Run This Skill

1. Open the changed files. Walk Groups A → G in order.
2. Mark each `block` failure as a Pre-Flight Failure; the work is not shippable until each is fixed.
3. Mark each `warn` failure as a polish item; fix unless the brief explicitly justifies the choice.
4. After fixes, re-walk Groups A and B (the most-defaulted areas) and Group G (the silent-failure tells — G1–G5).

## Best Practices

- ✅ Run this skill after the implementation pass and again after `polish`.
- ✅ When fixing a `block` rule, also re-read the relevant section in [motion-design-taste](../motion-design-taste/SKILL.md) to absorb the rationale.
- ✅ Treat the rules as a checklist, not a discussion. Either the code passes or it does not.

## Do Not

- ❌ Argue against a `block` rule by case unless the brief explicitly justifies the override.
- ❌ Add new rules silently; if a new tell appears, propose it as an addition to this skill.
- ❌ Use this skill in place of the design layer; rules here are diagnostics, not direction.
