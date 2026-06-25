// render-all-shots.mjs — render every shot's state.json to mp4 via
// skills/motion-studio/templates/render.mjs (patched in projects/kimi-k26/render-shot.mjs).
//
// Strategy: for each s01..s12, set up a symlink so the local server
// can find it under the right URL, then run a render in dry-run mode
// (we just want to confirm the seek loop works end-to-end).

import { execSync, spawn } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT = "projects/kimi-k26";

function render(shot) {
  console.log(`\n=== Rendering ${shot} ===`);
  try {
    execSync(
      `node ${PROJECT}/render-shot.mjs --preset 1080p --input ${shot}.html --fps 30 --dry-run`,
      { stdio: "inherit", timeout: 90_000 }
    );
    return true;
  } catch (e) {
    console.error(`FAILED ${shot}: ${e.message.slice(0, 200)}`);
    return false;
  }
}

let pass = 0, fail = 0;
for (let i = 1; i <= 12; i++) {
  const shot = `s${String(i).padStart(2, "0")}`;
  if (render(shot)) pass++; else fail++;
}
console.log(`\n${pass} pass / ${fail} fail`);