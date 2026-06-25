#!/usr/bin/env node
// pointer-driver.mjs — synthetic pointermove events for `quickTo` / Draggable.
//
// Renders where the scene uses `quickTo` / Draggable / pointermove tweens
// (e.g. Liquid Glass Hover — currently refused in Phase 1) need synthetic
// pointer events because real DOM events do not fire under headless capture.
//
// Usage inside render.mjs:
//   import { drivePointer } from "../../skills/motion-studio/pointer-driver.mjs";
//   await drivePointer(page, { duration, fps, path: [...] });
//
// path: [{ x, y, at }, ...]   — keyframes the pointer should visit at time `at`
// Any gap between path keyframes is interpolated linearly.

export async function drivePointer(page, { duration, fps, path }) {
  if (!path?.length) return;
  const totalFrames = Math.ceil(duration * fps);
  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    const point = samplePath(path, t);
    if (!point) continue;
    await page.evaluate(({ x, y, type }) => {
      const ev = new PointerEvent(type, {
        clientX: x, clientY: y, bubbles: true, pointerType: "mouse"
      });
      window.dispatchEvent(ev);
      document.dispatchEvent(ev);
    }, { x: point.x, y: point.y, type: "pointermove" });
    await sleep(16);
  }
}

function samplePath(path, t) {
  // Find the segment that contains t.
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = (t - a.at) / Math.max(0.0001, b.at - a.at);
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
  }
  return path[0];
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}