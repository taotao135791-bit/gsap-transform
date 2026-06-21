# Hybrid Stack — When GSAP Alone Is Not Enough

Reference for [motion-graphics](../SKILL.md) archetype (iv) Hybrid CGI-Composite, and for any film brief that names **particles, real 3D, VFX, or compositing**. Read this before promising "indistinguishable from After Effects".

The honest framing: **GSAP is a timeline engine that animates DOM/SVG/JS objects in a browser. It is not a particle system, not a 3D renderer, not a compositor, not a color grader, and not a DAW.** For the parts of an ad film that need those, GSAP *choreographs* (it drives the master timeline and tells other renderers what frame to show) while a different layer *renders*.

## 1. GSAP vs AE/Blender capability boundary

| Capability | GSAP-reachable? | If no, what renders it |
|---|---|---|
| Kinetic typography / SplitText reveals | ✅ Yes (native) | — |
| Flat-vector shape morph | ✅ Yes | `MorphSVGPlugin` |
| UI / product reveal, device hero | ✅ Yes | `Flip`, transforms |
| Logo sting / 2D brand motion | ✅ Yes | timeline + SplitText + MorphSVG |
| Camera choreography (push-in, parallax) | ✅ Yes (faked in 2D) | `.stage` wrapper, multi-layer parallax |
| **Particles** (sparks, confetti, dust clouds) | ❌ No | WebGL: three.js / regl / OGL, or Canvas 2D |
| **Real 3D** (lit geometry, reflections, DoF) | ❌ No | three.js / Blender / Cinema 4D |
| **Compositing / VFX** (mattes, roto, light wraps) | ❌ No | After Effects / Nuke |
| **Color grading** (film LUT, log→display) | ⚠️ Partial | CSS `filter` stack for light grade; full LUT = AE / DaVinci |
| **Audio** (music, foley, mix) | ❌ No | DAW / FFmpeg; GSAP only emits sync markers |
| Motion blur | ⚠️ Partial | CSS `filter: blur()` is fake/cheap; true optical blur = render at 2× FPS or AE |

## 2. Reachability tiers

| Tier | Meaning | Examples |
|---|---|---|
| **GSAP-reachable** | Pro look in pure GSAP | kinetic type, flat morph, UI reveal, logo sting |
| **needs-WebGL** | GSAP choreographs; Canvas/WebGL renders the heavy layer | particles, shaders, fluid, GPU instancing |
| **needs-AE-or-3D** | Pre-render in Blender/AE/C4D as ProRes 4444-alpha plates; GSAP drives `currentTime` | product CGI, character animation, complex 3D camera moves |
| **needs-compositing** | AE/Nuke/DaVinci pass *after* export | final grade, optical flow, roto, audio mix |

A single film often crosses all four — e.g. a product reveal with a particle burst and a final grade: GSAP orchestrates, WebGL does the burst, Blender does the product, DaVinci grades the export.

## 3. The three-layer architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1 — GSAP master timeline (conductor)                  │
│   • camera moves on .stage, text reveals, UI transitions    │
│   • drives Layer 2 uniforms and Layer 3 <video>.currentTime │
│   • emits beat markers for audio sync                       │
└───────────────┬─────────────────────────────────────────────┘
                │ onUpdate writes shared state
┌───────────────▼─────────────────────┐  ┌─────────────────────┐
│ Layer 2 — WebGL / Canvas (renderer) │  │ Layer 3 — pre-render│
│   • particles, shaders, fluid       │  │   CGI plates        │
│   • reads uniforms GSAP writes      │  │  • <video> alpha    │
│   • own RAF render loop             │  │  • GSAP drives       │
└─────────────────────────────────────┘  │    currentTime       │
                                         └─────────────────────┘
                ↓ export via gsap-plugins ticker-hijack
┌─────────────────────────────────────────────────────────────┐
│ Post — compositor pass (optional): grade / roto / audio mix │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1 → Layer 2 (GSAP drives WebGL)

GSAP cannot tween a shader uniform directly, but it can tween a plain JS object whose values the render loop reads each frame:

```javascript
const uniforms = { uIntensity: 0, uHue: 0 };
gsap.to(uniforms, { uIntensity: 1, uHue: 0.3, duration: 2, ease: "power2.inOut",
  onUpdate: () => { particleMaterial.uniforms.uIntensity.value = uniforms.uIntensity;
                    particleMaterial.uniforms.uHue.value = uniforms.uHue; } });
```

The WebGL layer keeps its own `requestAnimationFrame` render loop; GSAP only feeds the values. Never block GSAP's ticker on a WebGL draw call.

### Layer 1 → Layer 3 (GSAP drives pre-rendered CGI)

A Blender/AE pre-render exported as ProRes 4444 alpha is loaded as a muted `<video>`; GSAP scrubs it frame-by-frame so it stays perfectly in sync with the rest of the timeline:

```javascript
const plate = document.querySelector(".cgi-plate");
plate.muted = true; plate.preload = "auto"; plate.playsInline = true;
tl.to(plate, { currentTime: 3.0, duration: 3.0, ease: "none" }, 0);  // scrub, not play()
```

Using `currentTime` (not `play()`) means the export pipeline's ticker hijack captures the exact frame every time — `play()` would race the ticker and drift.

## 4. Per-archetype decision table

| Archetype | Layer 1 GSAP | Layer 2 WebGL | Layer 3 CGI | Post |
|---|---|---|---|---|
| (i) Kinetic Typography | ✅ all | — | — | optional light grade |
| (ii) Flat-Vector Morph | ✅ all | — | — | — |
| (iii) UI / Product Reveal | ✅ all | optional (ambient particles) | optional (device beauty shot) | optional |
| (iv) Hybrid CGI-Composite | ✅ conductor | ✅ particles/shaders | ✅ hero CGI plates | ✅ grade + audio mix |

If a brief lands on (iv) and the user does not have WebGL/3D capacity, **say so honestly** and scope the film down to what (i)–(iii) can carry at pro quality, rather than faking particles with CSS.

## 5. Handoff format specs

| Handoff | Format | Notes |
|---|---|---|
| GSAP → WebGL | shared JS `uniforms` object | render loop reads it each frame; see pattern above |
| GSAP → pre-rendered video | `<video>` muted + `preload: auto`; tween `currentTime` | ProRes 4444 (`yuva444p10le`) for alpha; VP9 (`yuva420p`) for web overlay |
| Export → compositor | PNG sequence + ProRes 4444 from the gsap-plugins pipeline | hand off with an audio EDL (beat-marker list) for the final mix |
| Audio | separate WAV + beat-marker EDL (time, label) | mux in FFmpeg; never bake audio into the PNG pass |

## 6. Export bridge (pointer, not duplication)

The actual frame-accurate export mechanics — `gsap.ticker.remove(gsap.updateRoot)` + `gsap.updateRoot(time)` hijack, the 3-layer transparent background, the 3D-compositing artifact (`preserve-3d`/`perspective` ghost box), and the MorphSVG `d`-attribute reset — live in [gsap-plugins](../../gsap-plugins/SKILL.md) → "Exporting GSAP SVG motion as video". This document does not repeat them. The film deltas to apply on top:

- **FPS:** render at 30 or 60 (film), not only 60. Match the delivery spec.
- **Timeline length:** film timelines are 8–30 s — ensure the capture loop's total frames = `duration × FPS` covers the whole master timeline, including trailing holds.
- **Layer 2/3 sync:** because GSAP drives WebGL via `onUpdate` and CGI via `currentTime`, the ticker hijack freezes all three layers coherently at each frame — no drift.
- **Audio:** emit the beat-marker EDL during the same pass (Section 7 of [SKILL.md](../SKILL.md)); mux in FFmpeg after encoding the video track.

## 7. The one rule that cannot be bent

If the user's reference film is **particle-heavy / real-3D / live-action-VFX** (Apple product reveal, Nike CGI, automotive), pure GSAP **cannot** get there — no amount of craft or skill tuning changes that. The honest path is the hybrid stack above, or the honest answer that the job belongs in AE/Blender. Do not let the brief believe otherwise.
