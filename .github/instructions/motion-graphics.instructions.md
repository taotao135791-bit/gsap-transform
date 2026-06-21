---
applyTo: "**/*.{html,jsx,tsx,vue,svelte,astro,md,mdx}"
---

# motion-graphics — path-specific instructions

When the deliverable is a **linear film / motion-graphics / ad** (广告片 / MG / 动效宣传片 / ad film / brand film / promo / logo sting / cinematic ad / "looks like a slideshow"), load `skills/motion-graphics/SKILL.md` INSTEAD of `motion-design-taste`. The two are mutually exclusive: page brief → motion-design-taste; film brief → motion-graphics.

| Step | What to do |
|---|---|
| **Run the chooser** | Pick archetype (Kinetic Typography / Flat-Vector Morph / UI-Product Reveal / Hybrid CGI-Composite), infer delivery (`web-live` vs `video-render`), derive tier (`pure-gsap` vs `hybrid`). Output a one-line **Film Read**. |
| **Set film dials** | `SCENE_INTENSITY` / `CAMERA_LANGUAGE` / `TEXTURE_GRADE` / `SOUND_DESIGN` / `DELIVERY`. These are film-scoped — never pass them to the web skills. |
| **De-slideshow top 3** | (1) Sound — tie to `onComplete`/beat markers, silent = warn. (2) Camera motion on a `.stage` wrapper. (3) Motion blur via `filter: blur()` on fast moves. |
| **Scene timing** | 2–6 s per scene (film) — overrides the web 1.4 s cap (Anti-Slop A2 is film-overridden). |
| **Anti-slop** | Apply `skills/motion-graphics/references/film-anti-slop.md` — A2/B1/C4/A4 flip to allowed-with-discipline; D1(web-live)/G3/G4 stay. |
| **Export** | For `video-render`, use the `gsap-plugins` ticker-hijack pipeline (ProRes 4444 / VP9), never screen recording. |

**Honesty boundary:** GSAP reaches a pro look for kinetic type / flat-vector morph / UI reveal / logo stings. It cannot do particles / real 3D / compositing / VFX / grading / audio — there GSAP choreographs while WebGL/Canvas or AE/Blender renders. See `skills/motion-graphics/references/hybrid-stack.md`.

For full guidance: `skills/motion-graphics/SKILL.md`.
