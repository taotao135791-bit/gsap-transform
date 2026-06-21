# Film Anti-Slop Overrides

Reference for [motion-graphics](../SKILL.md). The web [motion-anti-slop](../../motion-anti-slop/SKILL.md) rules are tuned for **web page UX** — short durations, restraint, "parallax earns one section", no bouncy defaults. Several of those rules are **correct for web and wrong for film**. This document defines the `mode: film` overrides.

Load this when the [motion-graphics](../SKILL.md) chooser has declared a Film Read. It does **not** change any severity in `motion-anti-slop/SKILL.md` — the web rules stay exactly as written for web work. It layers a film-mode interpretation on top.

## How to read each override

- **Rule** — the web Anti-Slop ID and name.
- **Web behavior** — what the web rule says (unchanged).
- **Film-mode status** — allowed / allowed-with-discipline / stays.
- **Disciplined film version** — the condition under which the previously-banned pattern becomes correct in film.

## Group A — Duration Tells

### A2. Body-content duration > 1.4 s

- **Web behavior:** `warn` — reserve >1.4 s for hero and pinned scenes only.
- **Film-mode status:** **Allowed.** Film scenes are 2–6 s by nature; the 1.4 s web cap does not apply.
- **Disciplined version:** duration follows the `SCENE_INTENSITY` band (2–6 s), and a long duration must be attached to a `.stage` camera move or a master-timeline beat — not a flat body-content tween that just slides for 3 s.

### A4. Forever-running decorative tween

- **Web behavior:** `block` — remove rotating blobs / drifting particles / looping marquees with no narrative purpose.
- **Film-mode status:** **Overridden for grain/texture only.** Animated SVG `<feTurbulence>` grain (opacity loop) is *required* for `TEXTURE_GRADE: filmic | graded` — static grain reads as a slideshow.
- **Disciplined version:** the override applies **only** to grain/atmosphere layers. A pointless rotating blob is still banned. For `DELIVERY: web-live`, still gate grain behind `prefers-reduced-motion`; for `video-render` it is baked into frames, so no runtime concern.

## Group B — Ease Tells

### B1. `back.out(1.7)` as default ease

- **Web behavior:** `block` — reserve `back.*` for one branded character moment per page.
- **Film-mode status:** **Allowed with discipline.** A single overshoot on a logo lockup or impact beat is exactly the "branded character moment" the web rule already permits — film just uses that permission more deliberately.
- **Disciplined version:** `back.out(1.4)` (gentler than 1.7) for **at most one** moment per film. The default ease across the rest of the timeline is still `power3.out` / `expo.out` / a `CustomEase` brand curve. Putting `back.out` on every entrance stays banned.

### B2. `elastic` on hover

- **Web behavior:** `block`.
- **Film-mode status:** **N/A** for `video-render` (no pointer events). **Stays `block`** for a `web-live` film variant with interactive hotspots.

## Group C — Stagger and Choreography Tells

### C4. Parallax on every section

- **Web behavior:** `block` — parallax earns one or two sections; the rest hold still.
- **Film-mode status:** **Allowed with discipline.** Film *wants* depth everywhere — flat single-plane is the #1 slideshow tell (see [SKILL.md](../SKILL.md) Section 6, lever ★2/★4).
- **Disciplined version:** parallax layers must use **≥3 distinct speeds** (real depth: bg slow, mid medium, fg fast). Copy-pasting the same drift rate across layers is the failure mode — that collapses to "everything moves the same way", which is still a slideshow. The disciplined `block` becomes: *"parallax with no speed differentiation"* = warn.

## Group D — Accessibility Tells

### D1. Missing `prefers-reduced-motion` branch

- **Web behavior:** `block` — ship without it = Pre-Flight Failure.
- **Film-mode status:** **Stays `block` for `DELIVERY: web-live`.** **N/A for `video-render`** — a video file has no user motion preference; reduced-motion is handled at the player/media-query level, not in the animation.

## Group G — Wiring & Loading Tells

### G3. `cdn.jsdelivr.net` single-file for browser ESM

- **Web behavior:** `block` — use `esm.sh` instead.
- **Film-mode status:** **Stays `block`.** Mode-independent: film demos also use `esm.sh`.

### G4. Named import on an esm.sh plugin

- **Web behavior:** `block` — `Draggable`/`InertiaPlugin` resolve to `undefined`.
- **Film-mode status:** **Stays `block`.** Default import for every plugin, regardless of mode.

## Rules that never change in film mode

These web rules apply identically to film — do not override them:

- **E1** (animate layout properties) — film still animates transforms, not `width`/`height`/`top`/`left`.
- **F5/F6** (single accent lock, computed-color match) — film inherits motion-design-taste Section 4 / Anti-Slop F6.
- **G1/G2** (`gsap.from(autoAlpha:0)` on CSS-hidden element; CSS `transform` as start state) — film uses `gsap.set` / `gsap.fromTo` the same way.
- **G5** (MotionPath / DrawSVG need `<path>`, not `<circle>`) — critical for archetypes (ii)/(iii).

## Running the film audit

When auditing a film piece, walk [motion-anti-slop](../../motion-anti-slop/SKILL.md) Groups A–G, but apply this document's film-mode status to A2, A4, B1, C4, and (for web-live) D1. A `block` here means the film-specific discipline was violated (e.g. `back.out` on every beat, or parallax with no depth differentiation), not that the underlying web pattern appeared.
