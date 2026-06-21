---
name: motion-graphics
description: Design layer for GSAP-driven ad films and motion graphics that read as After-Effects-grade (大厂风广告片). Use when the user asks for 广告片 / MG / 动效宣传片 / 宣传片 / 动画宣传片, or in English: ad film, brand film, promo, bumper, logo sting, motion graphics, motion-graphics promo, cinematic ad, AE replacement, "make this look like a real ad not a slideshow", or "indistinguishable from After Effects". Runs a guided chooser resolving archetype (Kinetic Typography / Flat-Vector Morph / UI-Product Reveal / Hybrid CGI-Composite), delivery (web-live vs video-render), and reachability tier (pure-GSAP vs hybrid). Sets film-scoped dials (SCENE_INTENSITY, CAMERA_LANGUAGE, TEXTURE_GRADE, SOUND_DESIGN, DELIVERY). Provides the PPT-to-Cinematic craft playbook (camera, depth, motion blur, choreography overlap, grain/grade, pacing) and an honest GSAP-vs-AE capability map. Pair with motion-design-taste (web pages), motion-anti-slop, motion-craft, gsap-plugins (export pipeline), gsap-timeline.
license: MIT
---

# Motion Graphics — Ad-Film Design Layer

The design layer for **linear film / motion-graphics / ad output** that should read as studio-grade, not slideshow-grade. Sits beside [motion-design-taste](../motion-design-taste/SKILL.md): that skill shapes **web pages** (landing pages, portfolios, scroll stories); this one shapes **films** (15–30s brand films, MG 宣传片, logo stings, product reveal ads). They are mutually exclusive at entry — a brief is either a page or a film, never both.

## When to Use This Skill

Load this skill **instead of** motion-design-taste when the deliverable is a linear, time-based piece with a defined start and end — not a scrollable page. The signals:

- The brief names a **film / video / ad** outcome: 广告片, MG, 动效宣传片, 宣传片, 动画宣传片, ad film, brand film, promo, bumper, TVC, logo sting, product reveal, cinematic ad, "make it look like a real ad", "indistinguishable from AE".
- The deliverable is a **video file** (`.mp4` / `.mov` / `.webm`) or a self-playing web hero with a fixed duration (not scroll-driven).
- The user says the current output "looks like a PPT / slideshow / 太平淡" and wants immersion.

If the brief is a **web page** (landing, portfolio, scroll story, app surface), route OUT to [motion-design-taste](../motion-design-taste/SKILL.md) — this skill's dials and craft are film-scoped and do not apply to pages.

**Related skills:** [motion-design-taste](../motion-design-taste/SKILL.md) (web); [motion-craft](../motion-craft/SKILL.md) (`/init` routes film briefs here); [gsap-timeline](../gsap-timeline/SKILL.md) (master timeline choreography); [gsap-plugins](../gsap-plugins/SKILL.md) (SplitText, MorphSVG, DrawSVG, MotionPath, **and the export-to-video pipeline**); [gsap-performance](../gsap-performance/SKILL.md). Film anti-slop overrides live in [references/film-anti-slop.md](./references/film-anti-slop.md); the hybrid stack (GSAP + WebGL + AE) lives in [references/hybrid-stack.md](./references/hybrid-stack.md).

## Section 1 — The Guided Chooser (run on every entry)

This is the onboarding flow. Run it before any code. It resolves three axes and outputs a one-line **Film Read**. It is a decision tree, not a questionnaire — ask **at most one question**, only when two archetypes genuinely tie.

**Step 0 — Confirm film intent.** Scan the brief for the film triggers above. If it is a web page, exit to motion-design-taste.

**Step 1 — Pick the archetype.** Map the brief's hero moment:

| Brief signal | Archetype |
|---|---|
| slogan / 标语 / manifesto / word-mark / kinetic type / "字体动画" | **(i) Kinetic Typography Brand Film** |
| logo morph / icon transform / 形变 / 扁平动画 / "MG宣传片" / explainer | **(ii) Flat-Vector Morph Brand Film** |
| app launch / 产品发布 / UI demo / feature showcase / device hero | **(iii) UI / Product Reveal** |
| CGI / 3D / 粒子 / particle / explosion / "大片" / cinematic product hero | **(iv) Hybrid CGI-Composite** |

If two tie (e.g. "字体动画" + "产品发布"), ask exactly one question: *"Which is the hero moment — the type or the product?"* Otherwise declare and proceed.

**Step 2 — Infer DELIVERY (never ask).** Output is a video file → `video-render`. Output is an embedded `<video>` or live web hero → `web-live`. Ambiguous → default `video-render` (ad films ship as files).

**Step 3 — Derive reachability tier (never ask).** Archetypes (i)/(ii)/(iii) → `pure-gsap` (GSAP reaches the pro look directly). Archetype (iv) → `hybrid` (GSAP choreographs; WebGL/Canvas renders particle/shader layers; AE/Blender pre-renders CGI as alpha-video plates that GSAP drives). State this honestly in the Read.

**Step 4 — Output the Film Read.** Format:

> **"Film Read: \<archetype\>, delivery \<web-live | video-render\>, tier \<pure-gsap | hybrid: GSAP choreographs + \<WebGL | AE\> renders\>, leaning SCENE_INTENSITY \<n\> / CAMERA_LANGUAGE \<none | subtle | cinematic\> / TEXTURE_GRADE \<flat | filmic | graded\> / SOUND_DESIGN \<none | diegetic | full-score\>."**

Examples:
- *"Film Read: Kinetic Typography Brand Film, delivery video-render, tier pure-gsap, leaning SCENE_INTENSITY 8 / CAMERA_LANGUAGE cinematic / TEXTURE_GRADE filmic / SOUND_DESIGN full-score."*
- *"Film Read: Hybrid CGI-Composite, delivery video-render, tier hybrid (GSAP choreographs + Blender renders CGI plates), leaning SCENE_INTENSITY 9 / CAMERA_LANGUAGE cinematic / TEXTURE_GRADE graded / SOUND_DESIGN full-score."*

Then set the [dials](#section-5--film-dials) and proceed to the matching archetype in Section 4.

## Section 2 — Honesty Constraints (read before promising "AE replacement")

Two truths the brief often gets wrong. Encode them in every output.

**2.A — Web and video are interchangeable as a *delivery format*, not as a *fidelity ceiling*.** A GSAP scene can be rendered to a clean video file via the [gsap-plugins](../gsap-plugins/SKILL.md) export pipeline (ticker hijack → frame-accurate PNG → ProRes 4444 / VP9). That is *not* screen recording — it captures every frame exactly. So "deliver as video" is always an option. **But recording does not raise the browser's render ceiling.** The video is exactly as rich as what Chromium can render in real time. Offline AE/Blender renders are not bounded by a browser, so their ceiling is structurally higher for particles, real 3D, optical compositing. Recording faithfully captures where the ceiling is; it does not lift it.

**2.B — GSAP reaches a pro look for a subset, not the whole of AE.** GSAP can produce genuinely studio-grade **kinetic typography, flat-vector morph, UI/product reveal, logo stings, 2D brand motion**. It **cannot** (structurally — no skill tuning fixes this) do **particle systems, real 3D with lighting, optical compositing/VFX, motion tracking, film grading, or audio**. For those, GSAP *choreographs* while WebGL/Canvas or AE/Blender *renders*. The full capability map and the hybrid architecture are in [references/hybrid-stack.md](./references/hybrid-stack.md). Never imply to the user that pure GSAP replaces AE for particle/3D/VFX work — that is the one dishonest promise this skill refuses to make.

## Section 3 — Why "It Looks Like PPT" (the diagnosis)

"Looks like a slideshow" is a specific, fixable failure mode — and it is the most common note on AI-generated motion graphics. The causes, in priority order, are the absence of **camera motion, depth, motion blur, sound, choreography overlap, and texture**. The web skills ([motion-design-taste](../motion-design-taste/SKILL.md), [motion-anti-slop](../motion-anti-slop/SKILL.md)) actually *encourage* several of these absences — flat single-plane, short durations, "parallax earns one section", "no back.out defaults". Those rules are correct for web UX and **wrong for film**. Section 6 is the fix; [references/film-anti-slop.md](./references/film-anti-slop.md) is the override.

## Section 4 — The Four Archetypes

Each archetype is a closed system. Pick one per film; do not splice two motion skeletons. Scene timing is **2–6 s per scene** (film), explicitly overriding Anti-Slop A2's 1.4 s web cap.

### (i) Kinetic Typography Brand Film

- **Best for:** slogan / manifesto reveals, brand anthems, word-mark stings. Highest GSAP reachability — SplitText is built for this.
- **Default dials:** `SCENE_INTENSITY 8 / CAMERA_LANGUAGE cinematic / TEXTURE_GRADE filmic / SOUND_DESIGN full-score`.
- **Camera grammar:** slow push-in on `.stage` (`scale 1.0 → 1.08`); parallax between the text-mask layer and the background grain layer.
- **Scene timing:** 2.5–4 s scenes; 12–18 s total.
- **Sound:** typewriter ticks on per-word stagger; sub-bass impact on the line-final; riser into the logo lockup.
- **Texture:** animated SVG `<feTurbulence>` grain (opacity nudged by GSAP); filmic `filter: contrast(1.05) saturate(1.1)`.
- **Plugins:** `SplitText`, `CustomEase`, optionally `ScrollTrigger` only for a web-live scroll variant.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("film", "0.2, 0.8, 0.2, 1");

const split = SplitText.create(".line", { type: "lines, words", mask: "lines" });
const tl = gsap.timeline({ defaults: { ease: "film" } });
tl.to(".stage", { scale: 1.08, duration: 4, ease: "none" }, 0)              // camera push-in
  .from(split.words, { yPercent: 120, rotation: 4, stagger: 0.05, duration: 0.7 }, 0.2)
  .fromTo(".word", { filter: "blur(8px)" }, { filter: "blur(0px)", duration: 0.5 }, "<") // motion blur on settle
  .to(".grain", { opacity: 0.08, duration: 0.1, repeat: -1, yoyo: true }, 0);            // living grain
```

- **Do NOT:** center every line; put `back.out` on every word (one overshoot moment max); leave grain static (static grain = slideshow).

### (ii) Flat-Vector Morph Brand Film

- **Best for:** MG 宣传片, logo assembly/morph, icon-to-product transitions, 2D explainer ads.
- **Default dials:** `SCENE_INTENSITY 7 / CAMERA_LANGUAGE subtle / TEXTURE_GRADE flat / SOUND_DESIGN diegetic`.
- **Camera grammar:** subtle drift (`xPercent ±2`, `yPercent ±1`); whip-pan between scenes via `rotation` on a `.stage` wrapper.
- **Scene timing:** 2–4 s scenes; 10–20 s total.
- **Sound:** morph "swoosh" on DrawSVG completion; soft pop on shape-lock.
- **Texture:** flat fills (this archetype wants flat); one accent locked (inherits motion-design-taste Section 4 one-accent rule).
- **Plugins:** `MorphSVGPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`, `Flip` (scene-to-scene layout morph).
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

const tl = gsap.timeline();
tl.fromTo(".shape-a", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" })
  .to(".shape-a", { morphSVG: ".shape-b", duration: 1.0, ease: "power3.inOut" })
  .to(".stage", { xPercent: -2, duration: 4, ease: "none" }, 0)             // camera drift
  .from(".icon", { scale: 0.6, filter: "blur(6px)", duration: 0.5, ease: "back.out(1.4)" }, "-=0.3"); // ONE branded overshoot
```

- **Do NOT:** target `<circle>` / `<rect>` with MorphSVG/DrawSVG (Anti-Slop G5 stays — convert with `MorphSVGPlugin.convertToPath`); forget to restore the original `d` on reset (`clearProps` does not work — capture `ORIGINAL_D` and restore manually, per [gsap-plugins](../gsap-plugins/SKILL.md) export section).

### (iii) UI / Product Reveal

- **Best for:** app-launch ads, product feature showcase, SaaS promo, device hero films.
- **Default dials:** `SCENE_INTENSITY 6 / CAMERA_LANGUAGE cinematic / TEXTURE_GRADE filmic / SOUND_DESIGN diegetic`.
- **Camera grammar:** orbit/parallax around a mockup; the device is `.stage`, content layers parallax *inside* it.
- **Scene timing:** 3–6 s scenes; 15–25 s total.
- **Sound:** UI ticks, notification chimes synced to on-screen state; soft pad bed.
- **Texture:** subtle device reflection (animated `linear-gradient` sheen); `filter: brightness(1.02)` lift on the hero beat.
- **Plugins:** `ScrollTrigger` (as a **time driver** via ticker hijack in video-render, not scroll), `SplitText` (UI labels), `MotionPathPlugin` (cursor trace), `Flip` (in-mockup state transitions).
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const tl = gsap.timeline();
tl.to(".device", { yPercent: -4, scale: 1.03, duration: 5, ease: "none" }, 0)   // camera orbit
  .from(".screen-content", { yPercent: 30, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, 0.5)
  .to(".cursor", { motionPath: { path: "#trace", align: "#trace" }, duration: 2, ease: "none" }, 1)
  .fromTo(".reveal", { filter: "blur(10px)", scale: 1.05 }, { filter: "blur(0px)", scale: 1, duration: 0.6 }, "-=0.5");
```

- **Do NOT:** center the device dead-center and busy (motion-design-taste F3 anti-center bias still applies); animate `width` / `height` of UI elements (Anti-Slop E1 stays — transforms only).

### (iv) Hybrid CGI-Composite (honestly flagged)

- **Best for:** cinematic product heroes, particle/VFX shots, "indistinguishable from AE" asks where the brief names CGI / particles / explosions.
- **Default dials:** `SCENE_INTENSITY 9 / CAMERA_LANGUAGE cinematic / TEXTURE_GRADE graded / SOUND_DESIGN full-score`.
- **Camera grammar:** full cinematic virtual rig (`.stage` with `perspective`, layer `rotationY`/`rotationX`). **Caveat:** `rotationY`/`rotationX` **cannot** be captured in transparent-video export (Chromium 3D-compositing artifact — see [gsap-plugins](../gsap-plugins/SKILL.md)); render those passes with an opaque background, or render the 3D in Blender/AE instead.
- **Scene timing:** 3–6 s scenes; 15–30 s total.
- **Sound:** full score + foley; the GSAP timeline emits beat markers a DAW or `capture.js` aligns audio to.
- **GSAP role = conductor only.** The visual heavy lifting is **not** GSAP — see [references/hybrid-stack.md](./references/hybrid-stack.md).
- **Skeleton (GSAP drives pre-rendered CGI `<video>` + a WebGL particle layer + a virtual camera):**

```javascript
import { gsap } from "gsap";
const tl = gsap.timeline();
tl.to(cgiPlate, { currentTime: 2.0, duration: 2.0, ease: "none" }, 0)   // drive pre-rendered CGI frame-by-frame
  .to(particleCanvas, { opacity: 1, duration: 1.5 }, 0.5)               // WebGL layer crossfade
  .to(".stage", { scale: 1.1, duration: 5, ease: "power2.inOut" }, 0)   // virtual camera
  .add(() => emitBeat("impact"), 2.0);                                  // audio-sync marker
```

- **Do NOT:** claim GSAP renders the particles/3D (it does not); attempt `rotationY` capture in the transparent export pass; ship without a hybrid-stack handoff plan.

## Section 5 — Film Dials

> **Scope clause — these five dials are film-scoped. They are NOT aliases for, and must never be passed to, the web skills.** [motion-design-taste](../motion-design-taste/SKILL.md) and its siblings read only `MOTION_INTENSITY` / `DESIGN_VARIANCE` / `VISUAL_DENSITY`. The film dials gate only what happens inside a film scene.

| Dial | Values | Gates |
|---|---|---|
| **SCENE_INTENSITY** | 1–10 | Scene duration band + ease strength + layer count. 1–3: 2–3 s quiet scenes, `power2.out`. 4–7: 3–4 s, `power3.out` / `expo.out`. 8–10: 4–6 s, `CustomEase` brand curve, multi-layer parallax + grain. |
| **CAMERA_LANGUAGE** | `none` \| `subtle` \| `cinematic` | `none`: static stage (rare, text-only beats). `subtle`: `xPercent`/`yPercent ±2` drift. `cinematic`: push-in (`scale 1.0 → 1.08`), orbit, ≥3 parallax depth layers. **`cinematic` forces a `.stage` wrapper and depth layers** — without camera motion the film reads as a slideshow. |
| **TEXTURE_GRADE** | `flat` \| `filmic` \| `graded` | `flat`: solid fills only (archetype ii). `filmic`: animated SVG grain (`feTurbulence`) + CSS `filter: contrast/saturate`. `graded`: full `filter` stack + grain, often paired with pre-graded CGI plates. |
| **SOUND_DESIGN** | `none` \| `diegetic` \| `full-score` | `none`: silent (rare — see Section 7). `diegetic`: UI ticks / morph swooshes on tween `onComplete`. `full-score`: music bed + foley; the timeline emits beat markers via a helper for DAW / `capture.js` alignment. |
| **DELIVERY** | `web-live` \| `video-render` | `web-live`: runs in browser, must still respect `prefers-reduced-motion` (Anti-Slop D1 stays in force). `video-render`: exported via the [gsap-plugins](../gsap-plugins/SKILL.md) ticker-hijack pipeline to ProRes 4444 / VP9. |

**Baseline preset:** `SCENE_INTENSITY 7 / CAMERA_LANGUAGE cinematic / TEXTURE_GRADE filmic / SOUND_DESIGN diegetic / DELIVERY video-render`. Override conversationally from the chooser; never ask the user to "edit a config".

## Section 6 — PPT → Cinematic Craft Playbook (the core value)

The diagnosis table. The three ★ items are the highest-leverage fixes — addressing sound, camera motion, and motion blur alone moves output from "slideshow" to "ad" more than everything else combined.

| # | Symptom (slideshow) | Film做法 | Concrete GSAP technique |
|---|---|---|---|
| ★1 | Silent | Sound tied to motion beats | `onComplete` / `onUpdate` emit beat markers; set `SOUND_DESIGN: diegetic` or `full-score`. Sound carries ~40% of perceived quality. |
| ★2 | Static frame, no camera | Virtual camera on a `.stage` wrapper | `gsap.to(".stage", { scale: 1.08, duration: 4, ease: "none" })`; `CAMERA_LANGUAGE: cinematic` forces this. |
| ★3 | Hard cuts, no motion blur | Motion blur on fast moves | `gsap.fromTo(el, { filter: "blur(8px)" }, { filter: "blur(0px)", duration: 0.5 })` around the move. |
| 4 | Flat single layer, no depth | Multi-layer parallax (≥3 z-layers) | bg grain (slow), mid content, fg accent (fast) — different `yPercent` speeds on the master timeline. |
| 5 | No anticipation / overshoot | Anticipation + ONE overshoot | small `-=` pre-move before the beat; `back.out(1.4)` allowed for ONE branded moment (Anti-Slop B1 overridden in film mode). |
| 6 | Sequential, not overlapping | Overlap via position parameter | `"<0.2"`, `">-0.3"`; beats bleed into each other — never hard-cut. |
| 7 | Flat fills, no grain / grade | Texture + grade | animated SVG `feTurbulence` grain; CSS `filter: contrast(1.05) saturate(1.1)`. |
| 8 | No holds / pacing | Holds and pacing | `tl.to(el, {}, "+=0.4")` empty hold; pacing is rhythm, not constant motion. |
| 9 | Centered-busy composition | Asymmetric framing | inherits motion-design-taste F3; rule of thirds, negative space, one focal point per beat. |
| 10 | No transition language | Match-cuts / morphs between scenes | `MorphSVGPlugin` (archetype ii), `Flip` (iii), whip-pan `rotation` on `.stage`. |

> **If you fix only three things, fix sound, camera motion, and motion blur. The rest is refinement.**

## Section 7 — Sound Design & Pacing

A silent film is physiologically incapable of reading as an ad, regardless of visual craft. This is the single most under-invested lever in AI motion graphics.

- **`SOUND_DESIGN: none` is a Pre-Flight warning** unless the brief explicitly wants silence.
- **Diegetic sync:** tie whooshes/impacts to tween callbacks — `onComplete` fires the sound at the exact frame the motion lands. For word-level sync, fire on the per-item stagger via a function-based `onComplete`.
- **Full-score sync:** the master timeline emits named beat markers (a small `add(() => emitBeat(name), position)` helper). For `web-live`, drive a Web Audio buffer from those markers; for `video-render`, export a beat-marker EDL alongside the PNG sequence and mux audio in FFmpeg.
- **Pacing = holds, not motion.** A 15 s piece with motion in every frame is exhausting; insert `tl.to({}, {}, "+=0.4")` empty holds so the eye can rest between beats. The pauses are what make it feel intentional.

## Section 8 — Film Anti-Slop (web rules overridden for film)

The web [motion-anti-slop](../motion-anti-slop/SKILL.md) rules A2 (>1.4 s), B1 (`back.out` default), C4 (parallax everywhere), A4 (forever decorative) are **correct for web UX and wrong for film**. In film mode they flip to "allowed-with-discipline". The full override table — what flips, what stays, and the disciplined version of each — is in [references/film-anti-slop.md](./references/film-anti-slop.md). Summary:

| Web rule | In film mode |
|---|---|
| **A2** (>1.4 s duration) | **Allowed** — film scenes are 2–6 s; duration follows the SCENE_INTENSITY band. |
| **B1** (`back.out` default) | **Allowed, disciplined** — `back.out(1.4)` for ONE branded moment; default still `power3.out` / `expo.out`. |
| **C4** (parallax everywhere) | **Allowed, disciplined** — film wants depth; layers must use ≥3 distinct speeds (real depth), not copied drift. |
| **A4** (forever decorative tween) | **Overridden for grain only** — animated `feTurbulence` grain is required for filmic texture. |
| **D1 / G3 / G4** | **Stay** — web-live still needs `matchMedia`; esm.sh default imports are mode-independent. |

## Section 9 — Hybrid Stack & Export Bridge

For archetype (iv), or any brief naming particles / 3D / VFX, GSAP is the **conductor**, not the renderer. The full architecture — GSAP timeline choreographs → WebGL/Canvas renders particle/shader layers → AE/Blender pre-renders CGI as ProRes 4444-alpha plates that GSAP drives via `currentTime` — plus the GSAP-vs-AE capability map and handoff format specs, is in [references/hybrid-stack.md](./references/hybrid-stack.md).

**Export to video:** regardless of tier, `DELIVERY: video-render` uses the [gsap-plugins](../gsap-plugins/SKILL.md) "Exporting GSAP SVG motion as video" pipeline (ticker hijack → frame-accurate PNG → ProRes 4444 / VP9). Film deltas vs. that section: render at 30/60 FPS (not 60 only), expect longer timelines, and emit the audio beat-marker EDL described in Section 7. **Never use screen recording (OBS / QuickTime)** — it drops frames and has no motion blur; only the ticker-hijack pipeline is frame-accurate.

## Section 10 — Film Pre-Flight (run before shipping)

Run mechanically before declaring done. A single failure means the film is not shippable.

1. **Film Read** declared in one line (archetype + delivery + tier + dials).
2. **Five film dials** stated explicitly; scope clause respected; none passed to the web skills.
3. **Camera motion** present whenever `CAMERA_LANGUAGE: subtle | cinematic` (a `.stage` move exists).
4. **Motion blur** on fast moves (★3).
5. **Sound** is not `none` unless the brief justifies it (★1 — warn if silent).
6. **Scene timing** in the 2–6 s band (A2 overridden correctly, not silently ignored).
7. **Depth / parallax** layers use ≥3 distinct speeds whenever `CAMERA_LANGUAGE: cinematic`.
8. **Holds / pacing** — at least one `+=` empty hold in the master timeline.
9. **Anti-Slop overrides applied correctly** — film-mode rules (A2/B1/C4/A4) flipped per Section 8, not ignored; web-only rules (D1 for web-live, G3/G4 always) still enforced.
10. **Hybrid honesty** — for archetype (iv), the GSAP-vs-AE boundary is stated; GSAP is not claiming to render particles/3D.
11. **Export plan** — for `video-render`, the gsap-plugins ticker-hijack pipeline is referenced; the 3D-compositing-artifact and MorphSVG-`d`-reset caveats acknowledged where relevant.
12. **Reduced-motion** — for `web-live`, a `gsap.matchMedia()` branch exists (Anti-Slop D1 stays in force).

## Best Practices

- ✅ Run the **Guided Chooser** and output a one-line **Film Read** before any code.
- ✅ Fix **sound, camera motion, motion blur** first — they are 80% of the de-slideshow effect.
- ✅ Use a `.stage` wrapper for camera moves; animate the *world*, not the pieces.
- ✅ Keep one accent locked (inherits motion-design-taste Section 4); keep one focal point per beat.
- ✅ For `video-render`, use the ticker-hijack pipeline, never screen recording.

## Do Not

- ❌ Promise pure-GSAP "AE replacement" for particles / 3D / VFX / compositing / grading — it is structurally impossible; route to the hybrid stack.
- ❌ Apply the web anti-slop web-only rules (A2's 1.4 s cap, no-parallax-everywhere, no-`back.out`) to film without the Section 8 override.
- ❌ Pass the film dials to `motion-design-taste` or any web skill — they are film-scoped.
- ❌ Ship a silent film without an explicit `SOUND_DESIGN: none` justification.
- ❌ Splice two archetype motion skeletons into one film; each archetype is a closed system.
