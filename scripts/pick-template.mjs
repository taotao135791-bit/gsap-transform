#!/usr/bin/env node
// pick-template.mjs — clone a template into projects/<slug>/
//
// Usage:
//   node scripts/pick-template.mjs                          # interactive list
//   node scripts/pick-template.mjs <slug>                   # clone that one
//   node scripts/pick-template.mjs <slug> --industry product # filter
//
// What it does:
//   1. Reads templates/<slug>/state.json + README.md
//   2. Runs scripts/state-to-scene.mjs to produce projects/<slug>/scene.js + index.html
//   3. Copies render.mjs + serve.mjs + package.json from skills/motion-studio/templates/
//      (so the project is renderable out-of-the-box)

import { readdir, readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TEMPLATES_DIR = resolve(ROOT, "templates");
const PROJECTS_DIR = resolve(ROOT, "projects");
const STUDIO_TEMPLATES = resolve(ROOT, "skills", "motion-studio", "templates");

async function listTemplates() {
  const entries = await readdir(TEMPLATES_DIR, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const state = JSON.parse(await readFile(resolve(TEMPLATES_DIR, e.name, "state.json"), "utf8"));
    out.push({ slug: e.name, ...state });
  }
  return out;
}

async function pickInteractive(filter) {
  const all = await listTemplates();
  const filtered = filter
    ? all.filter(t => t.industry === filter || t.slug.includes(filter))
    : all;
  console.log("\nAvailable templates:\n");
  for (const t of filtered) {
    console.log(`  ${t.slug.padEnd(28)} ${t.industry.padEnd(10)} ${t.duration}s  ${t.beats.length} beats  — ${t.title}`);
  }
  console.log(`\nUsage: node scripts/pick-template.mjs <slug>\n`);
}

async function clone(slug) {
  const src = resolve(TEMPLATES_DIR, slug);
  const dst = resolve(PROJECTS_DIR, slug);

  await mkdir(dst, { recursive: true });

  // copy state.json + README + thumbnail
  await copyFile(resolve(src, "state.json"), resolve(dst, "state.json"));
  await copyFile(resolve(src, "README.md"),  resolve(dst, "README.md"));

  // copy scaffold files from motion-studio templates
  for (const f of ["render.mjs", "serve.mjs", "package.json"]) {
    await copyFile(resolve(STUDIO_TEMPLATES, f), resolve(dst, f));
  }

  // generate scene.js + index.html via state-to-scene.mjs
  await runNode(resolve(__dirname, "state-to-scene.mjs"), [dst]);

  console.log(`\nProject ready at projects/${slug}/`);
  console.log(`  Preview:  cd projects/${slug} && npm run preview`);
  console.log(`  Render:   cd projects/${slug} && node render.mjs --preset vertical --dry-run`);
}

function runNode(scriptPath, args) {
  return new Promise((res, rej) => {
    const p = spawn(process.execPath, [scriptPath, ...args], { stdio: "inherit" });
    p.on("exit", code => code === 0 ? res() : rej(new Error(`exit ${code}`)));
  });
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find(a => !a.startsWith("--"));
  const flag = args.find(a => a.startsWith("--industry="));
  const filter = flag ? flag.split("=")[1] : null;

  if (!slug) return pickInteractive(filter);

  const all = await listTemplates();
  if (!all.find(t => t.slug === slug)) {
    console.error(`Unknown template: ${slug}`);
    console.error(`Available: ${all.map(t => t.slug).join(", ")}`);
    process.exit(2);
  }
  await clone(slug);
}

main().catch(err => { console.error(err); process.exit(1); });