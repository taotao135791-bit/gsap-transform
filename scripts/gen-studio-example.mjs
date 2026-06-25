// Bootstrap one state-driven example: pick a template, generate, copy render.mjs.

import { spawn } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const STUDIO_TPL = resolve(ROOT, "skills", "motion-studio", "templates");
const TARGET = resolve(ROOT, "examples", "studio-state", "product-hero-reveal");

await mkdir(TARGET, { recursive: true });

function run(cmd, args, cwd) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit", cwd });
    p.on("exit", code => code === 0 ? res() : rej(new Error(`exit ${code}`)));
  });
}

await run("node", [resolve(ROOT, "scripts/pick-template.mjs"), "product-hero-reveal"], ROOT);

// Move generated files from projects/ → examples/studio-state/
const SRC = resolve(ROOT, "projects", "product-hero-reveal");
for (const f of ["state.json", "scene.js", "index.html", "render.mjs", "serve.mjs", "package.json"]) {
  await copyFile(resolve(SRC, f), resolve(TARGET, f));
}

console.log(`OK  examples/studio-state/product-hero-reveal/`);