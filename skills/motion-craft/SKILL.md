---
name: motion-craft
description: A command-style workflow for building, polishing, and auditing GSAP motion. Use when the user invokes /motion-craft <subcommand>, or asks for a structured pass on an animated interface (init, shape, animate, polish, audit, critique, quieter, bolder, adapt, export). Sequences the design layer (motion-design-taste, motion-recipes, motion-anti-slop) and the GSAP API skills into a repeatable ten-command flow that maps to the user's intent. Pair with motion-design-taste, motion-recipes, motion-anti-slop, and the gsap-* API skills.
license: MIT
---

# Motion Craft (Command Workflow)

A ten-command workflow that orchestrates the rest of the motion-design layer: nine build/refine commands — `init`, `shape`, `animate`, `polish`, `audit`, `critique`, `quieter`, `bolder`, `adapt` — plus the `/export` utility for rendering animations to transparent video. Use when the user wants a structured pass instead of a single ad-hoc generation, or when the user asks to export motion as a video file.

## When to Use This Skill

Apply when the user invokes a `/motion-craft <command>` style call, when the user asks for a phased / staged build of an animated interface, or when the conversation already produced a draft and the user wants a follow-up pass ("polish this", "tone it down", "make it bolder", "add reduced-motion").

**Related skills:** [motion-design-taste](../motion-design-taste/SKILL.md) for direction; [motion-recipes](../motion-recipes/SKILL.md) for clone-able patterns; [motion-anti-slop](../motion-anti-slop/SKILL.md) for deterministic checks; [gsap-core](../gsap-core/SKILL.md), [gsap-timeline](../gsap-timeline/SKILL.md), [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md), [gsap-plugins](../gsap-plugins/SKILL.md), [gsap-utils](../gsap-utils/SKILL.md), [gsap-react](../gsap-react/SKILL.md), [gsap-frameworks](../gsap-frameworks/SKILL.md), [gsap-performance](../gsap-performance/SKILL.md) for API depth.

## Command Index

| Command | Triggered when the user says… | Output |
|---|---|---|
| **init** | "set up motion for this project", "start an animated landing", "/motion-craft init" | A `MOTION.md` brief at project root + a Design Read |
| **shape** | "plan the motion before coding", "storyboard this hero", "/motion-craft shape" | A storyboard of beats + selected recipe + dial values |
| **animate** | "implement the animations", "add motion to this section", "/motion-craft animate" | GSAP code that conforms to the chosen recipe and motion mode |
| **polish** | "polish this", "final pass", "make it feel finished" | Tightened durations / eases / staggers + reduced-motion branch |
| **audit** | "audit the motion", "lint this animation", "remove the slop" | A structured report from [motion-anti-slop](../motion-anti-slop/SKILL.md) with block / warn items |
| **critique** | "critique this", "what is wrong with this animation", "design review" | A qualitative review focused on whether motion serves content |
| **quieter** | "tone this down", "too much motion", "calm this" | One-step reduction along Restrained → Expressive → Cinematic |
| **bolder** | "make it bolder", "amplify", "boring" | One-step amplification along the same scale, with discipline |
| **adapt** | "make it accessible", "mobile responsive", "reduced motion" | Add prefers-reduced-motion + breakpoint-aware motion via `gsap.matchMedia` |
| **export** | "export as transparent video", "render to webm", "png sequence", "/motion-craft export" | A `capture.js` script (Puppeteer) + FFmpeg commands for WebM VP9 alpha or ProRes 4444 |

Each command runs with a clear input contract, a sequence of skill calls, and an output contract. Commands are **invokable directly** (`/motion-craft polish the hero`) or **composable** (`init` → `shape` → `animate` → `polish` → `audit`).

## Universal Conventions

- Every command states the affected scope before working ("Working on the hero section only" / "Working across all sections").
- Every command begins by reading the project state: existing GSAP imports, tween count, ScrollTrigger count, presence of `gsap.matchMedia`.
- Every command that ends in code MUST run an internal pass against [motion-anti-slop](../motion-anti-slop/SKILL.md) `block`-severity rules before returning.
- Commands never ask multi-question dumps; if a clarifier is needed, it is exactly one question.

## /motion-craft init

**Trigger:** project start, no `MOTION.md` exists, no GSAP code exists.

**Input contract:** the user's brief in natural language.

**Sequence:**
1. Load [motion-design-taste](../motion-design-taste/SKILL.md). Read Sections 1 (Brief Inference) and 2 (Three Dials).
2. Output a one-line **Design Read**.
3. Set the three dials (`MOTION_INTENSITY`, `DESIGN_VARIANCE`, `VISUAL_DENSITY`) based on the brief.
4. Pick one **motion mode** from Section 6 (Restrained / Expressive / Cinematic).
5. Pick one **recipe** from [motion-recipes](../motion-recipes/SKILL.md).
6. Write `MOTION.md` at project root with:

```markdown
# Motion Brief

**Design Read:** <one line>

## Dials
- MOTION_INTENSITY: <n>
- DESIGN_VARIANCE: <n>
- VISUAL_DENSITY: <n>

## Motion Mode
<Restrained | Expressive | Cinematic>

## Recipe
<recipe name from motion-recipes>

## Plugins to register
<comma-separated list>

## Anti-default reminders
- <list 3-5 specific to this brief>

## Reduced-motion fallback
<one-paragraph plan>
```

**Output contract:** `MOTION.md` file + a 3-line summary message in chat. Subsequent commands read `MOTION.md` instead of re-inferring.

## /motion-craft shape

**Trigger:** before writing GSAP code, the agent and user agree on what the motion should *do* per scene.

**Sequence:**
1. Read `MOTION.md`.
2. List the page's sections (or the targeted scope).
3. For each scene, write a 2-4 line beat list. Example for a hero:
   - Beat 1: eyebrow fades in (autoAlpha + y: 12, 0.4 s)
   - Beat 2: headline lines reveal masked, stagger 0.08 s
   - Beat 3: hero image scales subtle 1.02 → 1, 0.9 s, scrub-bound
   - Beat 4: CTA fades in 0.4 s after headline finishes
4. Identify which **plugins** and which **API skills** each scene needs ([gsap-timeline](../gsap-timeline/SKILL.md), [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md), [gsap-plugins](../gsap-plugins/SKILL.md), …).
5. Flag any scene that violates the dials (e.g. a pinned scene in a Restrained mode page).

**Output contract:** a beat list per scene + plugin/skill matrix. No code yet.

## /motion-craft animate

**Trigger:** after `init` and (optionally) `shape`, generate the GSAP code.

**Sequence:**
1. Read `MOTION.md` and any beat list from `shape`.
2. Clone the recipe skeleton from [motion-recipes](../motion-recipes/SKILL.md).
3. For each scene, write the timeline / tween using the API skill identified in `shape`:
   - sequencing → [gsap-timeline](../gsap-timeline/SKILL.md)
   - scroll-driven → [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md)
   - text/SVG/drag/flip → [gsap-plugins](../gsap-plugins/SKILL.md)
   - React → [gsap-react](../gsap-react/SKILL.md) (use `useGSAP` with `scope`)
   - Vue / Nuxt / Svelte → [gsap-frameworks](../gsap-frameworks/SKILL.md) (use `gsap.context` + lifecycle)
   - mouse follower / many elements → [gsap-performance](../gsap-performance/SKILL.md) (`quickTo`, `batch`)
4. Wire the `prefers-reduced-motion` branch via `gsap.matchMedia` from the start (do not retrofit later).
5. Run `block`-severity rules from [motion-anti-slop](../motion-anti-slop/SKILL.md) once before returning the code.
6. **Browser smoke-test before declaring done.** Open the page in a real browser, watch the console for errors, and verify at least one tween actually moves. Common silent failures to check for: a hidden CSS state (`.reveal { opacity: 0 }`) blocking a `gsap.from(autoAlpha: 0)` (Anti-Slop G1), a CSS `transform` not being read as a GSAP start state (Anti-Slop G2), a CDN module path that 404s and breaks the whole ESM graph (Anti-Slop G3), a named import on an esm.sh GSAP plugin that resolves to `undefined` (Anti-Slop G4), a `<circle>` / `<rect>` passed to MotionPath or DrawSVG (Anti-Slop G5), and — visually equally damaging — a declared single accent silently overridden by CSS specificity (Anti-Slop F6); for each supposed accent element, run `getComputedStyle(el).color` and confirm it matches the declared accent token. **When iterating in dev**, browsers cache `<script type="module" src="./main.js">` aggressively and ignore changes — add a cache-buster query (`./main.js?v=N`) and bump `N` on every meaningful change so the smoke-test reflects the latest code, not yesterday's. **If browser tooling is unavailable** in the agent's environment, do not skip this step — instead, output an explicit verification checklist (URL, expected DOM mutations, expected `transform` / `opacity` / accent-color values) and ask the user to run `npx serve <dir>` and report back what they see. Returning code without either path is a Pre-Flight Failure.

**Output contract:** runnable GSAP code that imports only what it uses, registers plugins, scopes selectors, and cleans up on unmount. No `back.*` / `elastic.*` defaults. No selector strings without scope inside a component.

## /motion-craft polish

**Trigger:** the implementation works but feels generic or rough.

**Sequence:**
1. Read the current file. Count tweens, durations, eases, stagger values.
2. Apply this checklist:
   - Replace any unique-default duration (every tween 0.5 s) with a per-role band — hero longer, supporting reveals shorter (Anti-Slop A1).
   - Move `duration` and `ease` off children into the timeline `defaults` (Anti-Slop A3).
   - Replace any `back.*` / `elastic.*` / `bounce.*` default with `power2.out` / `power3.out` / `expo.out` (Anti-Slop B1, B2, B3).
   - Add `ease: "none"` to every scrubbed tween (Anti-Slop B4).
   - Vary stagger across sections; consider `from: "edges" | "center"` instead of bare numbers (Anti-Slop C1).
   - Reduce hover signal to **one** property change (Anti-Slop C3).
   - Verify a `prefers-reduced-motion` branch exists (Anti-Slop D1).
3. Re-read with the Pre-Flight Check from [motion-design-taste](../motion-design-taste/SKILL.md) Section 8.

**Output contract:** the same code with tightened durations / eases / staggers, a stated rationale per change.

## /motion-craft audit

**Trigger:** structured quality gate before shipping or after a large change.

**Sequence:**
1. Walk Groups A → F of [motion-anti-slop](../motion-anti-slop/SKILL.md) in order.
2. For each rule, mark `pass`, `block`, or `warn`.
3. Aggregate:

```markdown
## Motion Audit Report

### Block (must fix)
- A4: forever-running gradient blob in `.bg-glow` (file:src/components/Hero.tsx:42)
- D1: missing prefers-reduced-motion branch (project-wide)

### Warn (fix unless brief justifies)
- A1: 12 of 14 tweens use duration: 0.5
- F4: 3 consecutive image-text-split sections (Features, Pricing, Testimonials)

### Pass
- B4: scrubbed tweens correctly use ease: "none"
- D6: all plugins registered
```

4. Suggest the next command (usually `polish` or `quieter`).

**Output contract:** the report. Do not auto-fix in `audit` — fixing belongs to `polish` / `adapt` / `quieter` / `bolder`.

## /motion-craft critique

**Trigger:** qualitative review — "is this motion *good*?", not just "does it pass rules?".

**Sequence:**
1. Read `MOTION.md` to understand intent.
2. Read the code to understand what was actually built.
3. Score on four axes (each 1-5):
   - **Service to content** — does motion direct the eye to what matters, or distract?
   - **Restraint** — does the motion stop when it should, or run forever in the background?
   - **Coherence** — does every animation share an ease family and rhythm, or is the page a jumble?
   - **Memorability** — is there one moment a user would describe to a colleague, or is everything generic?
4. Write 1-2 sentences per axis, naming exact file paths and line ranges where possible.
5. Suggest the next command.

**Output contract:** a 4-axis critique. No code changes.

## /motion-craft quieter

**Trigger:** "this is too much", "tone down", "feels busy".

**Sequence:**
1. Read `MOTION.md` and current code.
2. Step the motion mode down by one band (Cinematic → Expressive → Restrained). Update `MOTION.md`.
3. Apply the new band's defaults:
   - Shorten durations to the lower band.
   - Switch eases to `power2.out` / `power1.out`.
   - Reduce stagger to the lower range.
   - Drop pinning from any non-essential scene.
   - Remove parallax from all sections except (at most) one.
   - Convert scrubbed reveals to `toggleActions: "play none none reset"` where the scrub is decorative, not narrative.
4. Run `polish`'s checklist as a tail step.

**Output contract:** the same code, calmer.

## /motion-craft bolder

**Trigger:** "this is too quiet", "boring", "lift it".

**Sequence:**
1. Read `MOTION.md` and current code.
2. Step the motion mode up by one band (Restrained → Expressive → Cinematic). Update `MOTION.md`.
3. Apply the new band's affordances **with discipline** — `bolder` is not "add bounce to everything":
   - Add **one** pinned scene if the page earns it.
   - Add **one** kinetic moment (SplitText line reveal on hero, magnetic CTA, MorphSVG icon transition) — not all three.
   - Increase stagger thoughtfulness (`from: "edges" | "center" | "random"`).
   - Use a stronger ease family (`expo.out`, `power3.out`).
   - Keep the page's color and typography rules unchanged.
4. Run `audit` immediately after to catch any reintroduced defaults.

**Output contract:** the same code, with one or two intentional motion moments added — not blanket amplification.

## /motion-craft adapt

**Trigger:** "make this accessible", "add reduced motion", "responsive motion", "mobile breakpoint".

**Sequence:**
1. Wrap all GSAP setup in `gsap.matchMedia()` with named conditions:

```javascript
const mm = gsap.matchMedia();

mm.add({
  isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  isMobile:  "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  isReduced: "(prefers-reduced-motion: reduce)"
}, (ctx) => {
  const { isDesktop, isMobile, isReduced } = ctx.conditions;
  // build the right motion per condition; return cleanup if needed
});
```

2. Under `isReduced`:
   - Disable scrub, pin, marquee.
   - Set entrance state to its end state (`gsap.set(...)`).
   - Drop magnetic cursors and parallax entirely.
3. Under `isMobile`:
   - Shorten durations by ~30%.
   - Replace pinned scenes with simple toggle reveals.
   - Drop magnetic cursors (touch device).
4. Update `MOTION.md`'s "Reduced-motion fallback" paragraph to match.

**Output contract:** the same code, wrapped in a single `matchMedia` block, with three branches.

## /motion-craft export

**Trigger:** "export this animation as a transparent video", "render to webm with alpha", "give me a png sequence", "/motion-craft export".

**Sequence:**
1. Confirm the target: which timeline / action / page section to record, and duration in seconds.
2. Generate a `capture.js` script (Node.js + Puppeteer) at the project root with these settings:
   - **Viewport:** match the animation's aspect ratio (default 1080×1080 for logo; 1920×1080 for full-page hero).
   - **Transparent background:** `omitBackground: true` + CDP `Emulation.setDefaultBackgroundColorOverride({ r:0, g:0, b:0, a:0 })`.
   - **Frame control:** pause GSAP's auto-ticker (`gsap.ticker.remove(gsap.updateRoot)`), then loop `gsap.updateRoot(frame / fps)` to seek the global timeline frame-by-frame.
   - **Output:** PNG sequence in `./frames/` (lossless, with alpha).
3. Output the FFmpeg commands for two target formats:
   - **WebM VP9 alpha** (for web `<video>` overlay):
     ```bash
     ffmpeg -framerate 60 -i frames/frame_%05d.png -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 output.webm
     ```
   - **ProRes 4444 alpha** (for After Effects / Premiere / FCPX):
     ```bash
     ffmpeg -framerate 60 -i frames/frame_%05d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov
     ```
4. If a specific action (e.g. `morph-circle`) needs to be triggered before recording, inject `await page.evaluate(() => play("morph-circle"))` before the frame loop.
5. If the animation uses `repeat: -1` (infinite), specify the exact start/end time to record.

**Output contract:** a runnable `capture.js` + two FFmpeg one-liners. The user runs:
```bash
npx serve <demo-dir> -l 4700        # start the demo
node capture.js                      # render PNG sequence
ffmpeg ...                           # encode to webm or mov
```

**Requirements:**
- The page must expose GSAP to `window` (e.g. `window.__svghero = { gsap }`) so `capture.js` can control the ticker.
- Puppeteer renders real Chromium — SVG filters (liquid, gooey), `backdrop-filter`, `clip-path` all render correctly in the PNG output.
- Mouse-driven effects (parallax, magnetic) cannot be auto-captured; only timeline-driven motion is seek-able.

**Limitations to state in the response:**
- Interactive / pointer-driven tweens (`quickTo`, `Draggable`) are not recordable via seek; suggest a scripted pointer path if needed.
- `gsap.matchMedia` conditions (e.g. viewport width) are locked to the Puppeteer viewport set in `capture.js`.

## Composing Commands

Common chains:

- **Greenfield:** `init` → `shape` → `animate` → `audit` → `polish` → `adapt`.
- **Inherited code:** `audit` → `critique` → (`quieter` | `bolder`) → `polish` → `adapt`.
- **Bug-fix scope:** `audit` → `polish` (or `adapt` / `quieter` based on what audit flags). `audit` alone never modifies code; pair it with the matching fix command.
- **Quick tone change:** (`quieter` | `bolder`) → `audit`.

Do not skip `adapt` before declaring done — accessibility is a Pre-Flight Failure if missing.

## Best Practices

- ✅ Treat `init` as the canonical place to record decisions; subsequent commands read `MOTION.md` instead of re-inferring.
- ✅ Run `audit` after every code-changing command (`animate`, `polish`, `quieter`, `bolder`, `adapt`).
- ✅ When the user says "polish", do not silently rewrite the architecture; only tighten what `polish`'s checklist authorizes.

## Do Not

- ❌ Run `animate` before `init` exists; without a Design Read and dials, motion choices are guesses.
- ❌ Use `bolder` to add bounce / elastic / glow / parallax-on-every-section; `bolder` adds one or two intentional moments, not blanket amplification.
- ❌ Use `audit` to silently fix issues; `audit` reports, `polish`/`quieter`/`bolder`/`adapt` change.
- ❌ Skip `adapt`; reduced-motion and mobile breakpoints are part of every project, not optional polish.
