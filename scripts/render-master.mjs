#!/usr/bin/env node
// render-master.mjs — render all 12 shots to mp4 then concat with ffmpeg.
//
// Output: projects/kimi-k26/output.mp4 (60s, 1080p, 30fps)

import { execSync, spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, readdirSync, statSync } from "node:fs";
import { resolve, basename } from "node:path";

const PROJECT = resolve("projects/kimi-k26");
const SHOTS = [
  { slug: "s01", duration: 3.0  },
  { slug: "s02", duration: 4.5  },
  { slug: "s03", duration: 5.0  },
  { slug: "s04", duration: 5.0  },
  { slug: "s05", duration: 4.0  },
  { slug: "s06", duration: 4.0  },
  { slug: "s07", duration: 7.0  },
  { slug: "s08", duration: 7.0  },
  { slug: "s09", duration: 5.5  },
  { slug: "s10", duration: 4.0  },
  { slug: "s11", duration: 5.0  },
  { slug: "s12", duration: 0.5  }
];

function run(cmd, args, opts = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit", ...opts });
    p.on("exit", code => code === 0 ? res() : rej(new Error(`${cmd} exit ${code}`)));
  });
}

async function renderShot(slug) {
  const out = resolve(PROJECT, `${slug}.mp4`);
  if (existsSync(out)) {
    console.log(`\n=== ${slug} (cached) → ${basename(out)} ===`);
    return;
  }
  console.log(`\n=== ${slug} → ${basename(out)} ===`);
  await run("node", [
    `${PROJECT}/render-shot.mjs`,
    "--preset", "1080p",
    "--input", `${slug}.html`,
    "--fps", "30",
    "--out", slug
  ]);
}

async function main() {
  // 1. render each shot to mp4
  for (const s of SHOTS) {
    await renderShot(s.slug);
  }
  // 2. concat with ffmpeg concat demuxer
  const concatList = resolve(PROJECT, "concat.txt");
  writeFileSync(concatList,
    SHOTS.map(s => `file '${s.slug}.mp4'`).join("\n") + "\n");
  const master = resolve(PROJECT, "output.mp4");
  console.log(`\n=== Concatenating → ${basename(master)} ===`);
  await run("ffmpeg", [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatList,
    "-c", "copy",
    master
  ]);
  console.log(`\n✓ ${master}`);
}

main().catch(e => { console.error(e); process.exit(1); });