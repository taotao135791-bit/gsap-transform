---
name: video-grammar
description: The video-native aesthetic layer — shot types, virtual camera moves, transitions, and beat-synced pacing for GSAP scenes rendered as video. Load ALONGSIDE motion-design-taste when the artifact is a rendered mp4/webm/mov (not a scrollable page) — /studio scenes, promos, title sequences, stings, reels. Adds a `.camera` wrapper vocabulary (push/pull/pan/tilt as GSAP transforms on one wrapper), shot discipline (one camera move per shot), transition budget (one hero transition per video), BPM→frame pacing, and aspect-ratio safe areas. Pair with motion-studio (the render/seek contract) and motion-recipes (Kinetic Type Stagger / Minimal Fade as video-native bases). Trigger words: shot, close-up, macro, push in, dolly, pull back, pan, tilt, pedestal, orbit, match cut, whip pan, morph, transition, beat-sync, BPM, title sequence, lower third, 9:16 safe area, effect video, promo, reel, sting.
license: MIT
---

# Video Grammar (Effect-Video Aesthetic Layer)

The aesthetic layer for **video**, sitting beside [motion-design-taste](../motion-design-taste/SKILL.md). motion-design-taste owns the page (the three dials, the three motion modes, typography, color, layout). video-grammar owns what a page never has: **shot framing, virtual camera movement, transitions between shots, beat-synced pacing, and aspect-ratio composition**. The dials and motion modes still apply — a Cinematic-mode video (MOTION_INTENSITY 8-10) earns more camera moves than a Restrained one.

This is what turns output from "an animated web page rendered to mp4" into "an effect video." A page has no concept of a shot or a camera; a video is made of them.

## When to Use This Skill

Load this skill **in addition to** [motion-design-taste](../motion-design-taste/SKILL.md) when the artifact is a rendered video (mp4/webm/mov) produced by [`/studio`](../motion-craft/SKILL.md) via [motion-studio](../motion-studio/SKILL.md) — promos, spots, title sequences, stings, reels, product launches. Do NOT load it for scrollable web pages; it adds vocabulary a page brief doesn't need.

**Related skills:** [motion-design-taste](../motion-design-taste/SKILL.md) (dials + modes, still apply), [motion-studio](../motion-studio/SKILL.md) (`.camera` wrapper lives in its template; render seek contract), [motion-recipes](../motion-recipes/SKILL.md) (Kinetic Type Stagger, Minimal Fade as video-native bases), [gsap-plugins](../gsap-plugins/SKILL.md) (MorphSVG for shape transitions, SplitText for title reveals), [motion-anti-slop](../motion-anti-slop/SKILL.md) Group **V** (the video-specific checks).

## Section 0 — The `.camera` wrapper (the one idea everything builds on)

A video frames a subject. In GSAP-that-renders-to-video, framing is done by a **single `.camera` wrapper** that holds every shot's content; the master timeline animates the *camera* (scale + translate), the shot's content animates *inside* it. Two layers, never mixed:

```html
<main class="stage">              <!-- the stage IS the output frame; overflow: hidden -->
  <div class="camera">            <!-- the virtual camera; GSAP animates scale/x/y here -->
    <section class="shot shot-1"> ... </section>
    <section class="shot shot-2"> ... </section>
  </div>
</main>
```

```js
const camera = document.querySelector(".camera");
const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
tl.to(camera, { scale: 1, duration: 1.5 }, 0)                         // WS hold
  .to(camera, { scale: 2.2, xPercent: 8, yPercent: -4, duration: 1.2 }, 1.6)  // push to CU
  .set(".shot-1", { autoAlpha: 0 }, 3.0)                              // match cut → shot-2
  .to(camera, { scale: 1.4, xPercent: 0, duration: 0.0 }, 3.0);
```

Why one wrapper, not per-shot transforms: if every element drives its own scale, the eye can't tell what's moving — everything moves at once (the classic "AI slop" feel). One camera + content inside it reads as *a camera moving through a scene*, which is what cameras do.

**GSAP rule:** animate the camera with transform aliases (`scale`, `x`, `y`, `xPercent`, `yPercent`), never raw CSS `transform` (Anti-Slop G2). Declare the camera's start state with `gsap.set` or `fromTo`, not CSS.

## Section 1 — Shot types (framing = camera scale + offset)

| Shot | Abbr | camera `scale` | What it's for |
|---|---|---|---|
| Extreme Wide | EWS | 0.7–0.85 | establish place; subject tiny in environment |
| Wide | WS | 1.0 | establish subject + context (default open) |
| Medium | MS | 1.3 | subject + immediate action |
| Medium Close-Up | MCU | 1.6 | face / product + emotion |
| Close-Up | CU | 2.2 | detail, intensity |
| Extreme Close-Up | ECU | 3.0–4.0 | texture, macro, single element |
| Insert | — | 2.5–3.5 | a specific detail/object held momentarily |

Offset the camera (`xPercent`/`yPercent`) so the subject sits on a rule-of-thirds line, not dead center every time. A push from WS to CU is the single most useful move in a product video.

**Discipline:** one hero subject per shot. A CU of two things at once is two shots that haven't been cut.

## Section 2 — Camera moves (the vocabulary)

All achieved by tweening the `.camera` wrapper's transform. One move per shot (Anti-Slop **V1**).

| Move | GSAP | Note |
|---|---|---|
| **Push (dolly in)** | `scale: 1 → 1.4–2.2`, slight `yPercent` to hold subject | the workhorse; reveals importance |
| **Pull (dolly out)** | `scale: 2.2 → 1` | reveals context; use at act breaks |
| **Pan** | `xPercent: -10 → 10` | lateral; follows motion or surveys |
| **Tilt** | `yPercent: -8 → 8` | vertical; reveals height |
| **Pedestal** | `y` only, scale fixed | boom up/down without angle change |
| **Truck** | `x` only, scale fixed | lateral without angle change |
| **Parallax-as-dolly** | foreground + background layers move at differential `x` rates | fake depth with 2 layers (extends motion-design-taste's parallax to video) |
| **Orbit** | `rotationY` | **opaque background only** — breaks under transparent render (Anti-Slop **V5**, [gsap-plugins](../gsap-plugins/SKILL.md) §3D artifact) |

Eases for camera moves: `power2.inOut` / `power3.inOut` for push/pull (accelerate in, decelerate out — feels like real dolly weight). `none` only for hard cuts between shots. Never `back.*`/`elastic.*` on a camera (cameras don't bounce).

## Section 3 — Transitions (between shots)

| Transition | How | Budget |
|---|---|---|
| **Hard cut** | `gsap.set(".shot-A", {autoAlpha:0}); gsap.set(".shot-B",{autoAlpha:1})` on the same frame | unlimited — the default |
| **Match cut** | shot-B's hero element shares shot-A's screen position + shape; cut swaps content, keeps composition | one or two per video |
| **Crossfade** | `autoAlpha` overlap on two layered shots | sparingly; softens a cut |
| **Whip pan** | fast `xPercent` on camera + `filter: blur(8px)` mid-swish, cut at peak blur | **one hero moment max** |
| **Morph** | [MorphSVG](../gsap-plugins/SKILL.md) `d` swap; capture original `d`, restore before re-render | one hero moment max |
| **Wipe** | `clipPath` animation on shot-B revealing over shot-A | one hero moment max |
| **Glitch** | [ScrambleText](../gsap-plugins/SKILL.md) + brief `filter` (hue-rotate/blur) on a hard cut | one hero moment max |

**The one-hero-transition rule (V2):** a video gets at most ONE signature transition (the whip-pan, the morph, the match-cut on the beat). The rest are hard cuts. Stacking whip + morph + glitch in one 15s video is the loudest "AI tried too hard" tell.

## Section 4 — Pacing & beat-sync

Reveals that land exactly on a beat read as professional; landing 2-3 frames late reads as amateur.

```js
const FPS = 60;
const beat = (bpm) => 60 / bpm;              // seconds per beat — at 120 BPM, 0.5s = 30 frames
// place a reveal on beat 3 of a 120 BPM track:
tl.to(".headline", { ... }, beat(120) * 3);  // = 1.5s, frame 90
```

Pacing bands by motion MODE (reuses [motion-design-taste](../motion-design-taste/SKILL.md) §6):

| Mode | BPM | Feel |
|---|---|---|
| Restrained | 60–80 | calm, premium, editorial |
| Expressive | 90–110 | confident, brand-forward |
| Cinematic | 120–140 | kinetic, high-craft, awwwards |

Snap every shot boundary and every hero reveal to a beat boundary. If a shot wants to land at 1.47s but the nearest beat is 1.50s, move it to 1.50s. Off-beat landings > 3 frames are an Anti-Slop **V3** warning.

## Section 5 — Aspect-ratio composition (safe areas)

The same `scene.js` must look right at 16:9, 9:16, and 1:1 (the user re-renders with a different `--preset`, see [motion-studio](../motion-studio/SKILL.md) §4). Composition rule:

| Aspect | Title safe area | Hero subject zone |
|---|---|---|
| 16:9 (`1080p`/`4k`) | middle 80% horizontally, avoid bottom 8% (lower-third band) | rule-of-thirds intersection |
| 9:16 (`vertical`) | middle 60% vertically; reserve top 12% (status/UI overlay) + bottom 15% (caption) | upper-middle third |
| 1:1 (`square`) | centered, 70% box | dead center or thirds |

Achieve this with the `.camera` offset (§1) and `clamp()`-sized content — NOT by rewriting the scene per preset. A title that sits outside the 9:16 safe area is an Anti-Slop **V4** block.

## Section 6 — Title card & lower-third packaging

**Title card** (open or punctuate a video):
- 1.5–2.5s hold, single line, mask reveal (clone [motion-recipes](../motion-recipes/SKILL.md) Kinetic Type Stagger skeleton).
- Same `--accent` as the rest of the video (hard rule #10). Title treatment is not a place to introduce a second color.

**Lower-third** (name / role / product label):
- 0.6s in (autoAlpha + x: 24 → 0, `power3.out`), 2.0s hold, 0.4s out.
- Sits in the lower-third band of the active aspect (§5). One per shot; never two stacked.

## Section 7 — Anti-Slop Group V (video-specific; enforced before shipping)

These extend [motion-anti-slop](../motion-anti-slop/SKILL.md) Groups A–G. Severity `block` = Pre-Flight Failure.

### V1. Multiple camera moves stacked in one shot
- **Detect:** a single shot's `.camera` tweens scale AND xPercent AND yPercent (or push + pan + tilt) simultaneously with no cut between them.
- **Fix:** one move per shot. Cut (hard or transition) between moves.
- **Severity:** `block`.

### V2. More than one hero transition per video
- **Detect:** two or more of {whip pan, morph, glitch, wipe-as-effect} appear in one rendered video.
- **Fix:** keep one as the signature; demote the rest to hard cuts.
- **Severity:** `block`.

### V3. Reveal lands > 3 frames off the nearest beat (when BPM is declared)
- **Detect:** a hero reveal's start time differs from the nearest `beat(bpm)` boundary by more than 3 frames (50 ms @ 60 fps).
- **Fix:** snap the reveal to the beat boundary.
- **Severity:** `warn`.

### V4. Title or hero text outside the aspect safe area
- **Detect:** at the target preset's aspect, a title/hero element's bounding box crosses the safe-area margin (§5).
- **Fix:** move it inside via `.camera` offset or reflow; re-render and confirm.
- **Severity:** `block`.

### V5. `rotationY` / `rotationX` (orbit) on a transparent render
- **Detect:** a `rotationY`/`rotationX` tween on a scene rendered with `--transparent`.
- **Fix:** orbit only on opaque backgrounds; under transparency it produces the grey compositing ghost ([gsap-plugins](../gsap-plugins/SKILL.md) §3D artifact).
- **Severity:** `block` for transparent renders.

## Best Practices

- ✅ Put ALL shot content inside one `.camera` wrapper; animate the camera and the content as two separate layers.
- ✅ Open on a WS (scale 1) hold for ≥ 1 beat before the first move — give the eye time to land.
- ✅ Snap shot boundaries + hero reveals to beat boundaries (§4).
- ✅ Use one ease family for all camera moves (`power2.inOut` / `power3.inOut`); reserve `none` for hard cuts.
- ✅ Re-render at 16:9 AND 9:16 before shipping; both must pass V4.
- ✅ Run [motion-anti-slop](../motion-anti-slop/SKILL.md) Group V after every `scene.js` edit.

## Do Not

- ❌ Animate `transform` via CSS on `.camera` — GSAP owns it (G2). Use `gsap.set` / `fromTo` for the start state.
- ❌ Stack camera moves in one shot (V1) — that is the "everything moves at once" AI tell.
- ❌ Use two hero transitions in one video (V2).
- ❌ Put a `quickTo`/pointer tween in a rendered scene — it won't move under `tl.time` seek (motion-studio G6.4); script a synthetic path instead.
- ❌ Use `rotationY`/`rotationX` on a `--transparent` render (V5).
- ❌ Forget that the same scene renders at 16:9, 9:16, and 1:1 — design the `.camera` framing to survive all three (V4).
