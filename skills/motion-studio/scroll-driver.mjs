#!/usr/bin/env node
// scroll-driver.mjs — synthetic scroll → time mapping.
//
// Run inside render.mjs when a scene declares ScrollTriggers. Drives the
// window with a synthetic scrollTop so the master timeline's scrubbed tweens
// advance, then lets the seek loop do its per-frame tl.time() capture.
//
// Usage:
//   import { driveScroll } from "../../skills/motion-studio/scroll-driver.mjs";
//   await driveScroll(page, { duration, fps, viewportH, docH });
//
// Strategy:
//   1. Pause every ScrollTrigger
//   2. For each frame f in [0, duration*fps]:
//        progress = f / (duration * fps)
//        scrollTop = progress * (docH - viewportH)
//        await page.evaluate((y) => window.scrollTo(0, y), scrollTop)
//        tl.time(f / fps)
//   3. ScrollTrigger refreshes fire; scrubbed tweens land at the right state
//
// Caveats:
//   - Scrub tweens are still time-driven underneath; scrollTop only nudges
//     them. For full correctness, a future v2 can call ScrollTrigger.update()
//     directly with a fake scrollY.
//   - This is for **time-driven renders with scrub**. True scroll-bound
//     recipes (Brutalist Scroll, Cinematic Pinned Scrub) still need Phase 2.

export async function driveScroll(page, { duration, fps, viewportH, docH }) {
  const totalFrames = Math.ceil(duration * fps);
  for (let f = 0; f < totalFrames; f++) {
    const progress = f / Math.max(1, totalFrames - 1);
    const y = progress * Math.max(0, docH - viewportH);
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.evaluate((t) => window.__studio.tl?.time?.(t), f / fps);
    await sleep(16);
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}