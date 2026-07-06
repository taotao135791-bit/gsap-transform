# GSAP Transform — Repository-wide instructions for GitHub Copilot

This repository is a third-party, community, agent-oriented GSAP motion skill
system. Do not describe it as an official GreenSock or Webflow project.

Use the three-layer product path:

```text
Design Layer -> State Layer -> API Layer
```

Before writing GSAP code for any landing page, portfolio, hero, scroll story, or
renderable motion artifact, declare a one-line **Design Read**, pick a motion
mode (Restrained / Expressive / Cinematic), and set the motion dials. Then edit
`state.json` through the State Layer before reaching for raw GSAP API details.

`state.json` is the default source of truth. Generated `scene.js` / `scene.mjs`
files are artifacts. Hand-written scenes are an escape hatch, not the normal
agent workflow.

When writing or suggesting GSAP code in this repository:

- **Imports:** Use `import { gsap } from "gsap"` for npm projects. Register plugins once with `gsap.registerPlugin(ScrollTrigger)` before use.
- **Sequencing:** Prefer `gsap.timeline()` for multi-step animations instead of chained `delay` values. Use the position parameter (e.g. `"+=0.5"`, `"<"`, `"label"`) to place tweens on the timeline.
- **Transforms:** Prefer GSAP transform properties (`x`, `y`, `scale`, `rotation`, `xPercent`, `yPercent`) over animating raw CSS `transform` or layout properties (`top`, `left`, `width`, `height`) for movement and scale — better performance and consistent order of operations.
- **Opacity:** Prefer `autoAlpha` over `opacity` for fade in/out so elements get `visibility: hidden` at 0 and do not block clicks.
- **from() / fromTo():** `gsap.from()` animates from the given values to the element’s current state. When **multiple from() or fromTo()** tweens target the same property of the same element, set **immediateRender: false** on the later one(s) so the first tween’s end state is not overwritten before it runs.
- **Scroll-based animation:** When scroll-driven or scroll-linked animation is requested, use ScrollTrigger (register the plugin, then use `scrollTrigger: { trigger, start, end, scrub }` or attach to a timeline). Do **not** put a ScrollTrigger on a tween that is a child of a timeline — put it on the timeline or a top-level tween.
- **ScrollTrigger:** Use **scrub** for scroll-linked progress or **toggleActions** for discrete play/reverse, not both. Call **ScrollTrigger.refresh()** after DOM/layout changes that affect trigger positions. Create ScrollTriggers in top-to-bottom page order or set **refreshPriority** so they refresh in that order.
- **React:** In React projects, prefer `useGSAP()` (from `@gsap/react`) or `gsap.context()` with cleanup so animations and ScrollTriggers are reverted when the component unmounts.
- **Cleanup:** When elements are removed or routes change (e.g. SPAs), kill associated ScrollTrigger instances or revert SplitText/Draggable so nothing runs on stale elements. Use **clearProps** when a tween should not leave inline styles after it completes (e.g. so CSS classes can take over).

**More detail:** `skills/llms.txt` is the cross-skill index. The Design Layer
sets taste and dials, the State Layer edits `state.json` using primitives and
templates, and the API Layer supplies GSAP implementation depth.
