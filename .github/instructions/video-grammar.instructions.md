---
applyTo: "**/*"
---

# video-grammar — effect-video aesthetic instructions

Load this **in addition to** motion-design-taste when the artifact is a rendered video (mp4/webm/mov) from `/studio` — promos, spots, title sequences, reels. motion-design-taste still owns the page (dials, modes, type, color); video-grammar owns shots, camera, transitions, pacing, aspect.

When building a `/studio` scene that renders as video, follow `skills/video-grammar/SKILL.md`:

- Put all shot content inside ONE `.camera` wrapper; the master timeline animates the camera (`scale`/`xPercent`/`yPercent`), and content animates inside. Keep those two animation surfaces separate.
- Shot type = camera scale (WS 1.0 → CU 2.2 → ECU 3.0+). Open on a WS hold ≥ 1 beat before the first move.
- ONE camera move per shot (V1). Cut (hard or one signature transition) between moves.
- At most ONE hero transition (whip pan / morph / match cut / glitch) per video; the rest are hard cuts (V2).
- Snap every shot boundary + hero reveal to `beat = 60/bpm` (V3). Bands: Restrained 60–80, Expressive 90–110, Cinematic 120–140.
- The same scene must render acceptably at 16:9, 9:16, and 1:1 via `.camera` offset — titles inside the aspect safe area (V4).
- `rotationY`/`rotationX` (orbit) only on opaque backgrounds — breaks under `--transparent` (V5).
- Camera ease family: `power2.inOut` / `power3.inOut`; `none` for hard cuts; never `back.*`/`elastic.*` on a camera.

Run motion-anti-slop Group V before declaring a video scene done.
