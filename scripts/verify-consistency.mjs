#!/usr/bin/env node
/**
 * Consistency gate for the gsap-transform repo.
 *
 * The 6 agent adapters (AGENTS.md, CLAUDE.md, GEMINI.md, .cursor/rules/,
 * .github/instructions/, .windsurfrules + .windsurf/rules/) are hand-written
 * prose, so they cannot be byte-compared — instead this script checks the
 * invariants that have historically drifted:
 *
 *   1. exactly one gsap version string is referenced everywhere
 *   2. examples comply with Anti-Slop G4 (default imports for esm.sh plugins)
 *   3. the motion-craft command list is identical in every file that states it
 *   4. every skills/<name>/SKILL.md has name + description frontmatter,
 *      and name matches its directory
 *   5. CLAUDE.md / GEMINI.md are real files (not symlinks) and @import AGENTS.md
 *   6. every skill has a matching Cursor rule and Copilot instructions file
 *   7. .windsurfrules and .windsurf/rules/gsap.md carry the same hard-rule body
 *   8. State + Primitives layer integrity (state.json schema, primitives barrel)
 *   9. ≥ 20 templates exist
 *
 * Run: node scripts/verify-consistency.mjs   (exit 1 on any failure)
 */
import { readFileSync, readdirSync, lstatSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(p.startsWith("/") ? p : join(ROOT, p), "utf8");
const failures = [];
const fail = (msg) => failures.push(msg);
const ok = (msg) => console.log(`  ok  ${msg}`);

// ---------------------------------------------------------------- 1. version
{
  const sources = [
    "AGENTS.md",
    ".windsurfrules",
    ".windsurf/rules/gsap.md",
    ...readdirSync(join(ROOT, "skills"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `skills/${d.name}/SKILL.md`),
    ...existsSync(join(ROOT, ".cursor/rules")) ? readdirSync(join(ROOT, ".cursor/rules")).map((f) => `.cursor/rules/${f}`) : [],
    ...existsSync(join(ROOT, ".github/instructions")) ? readdirSync(join(ROOT, ".github/instructions")).map((f) => `.github/instructions/${f}`) : [],
    ".github/copilot-instructions.md",
  ];
  const versions = new Set();
  for (const file of sources) {
    if (!existsSync(join(ROOT, file))) continue;
    for (const m of read(file).matchAll(/gsap@(\d+\.\d+\.\d+)/g)) versions.add(m[1]);
  }
  if (versions.size === 1) ok(`single gsap version pinned everywhere: ${[...versions][0]}`);
  else fail(`gsap version drift: found ${[...versions].join(", ") || "none"}`);
}

// --------------------------------------------------- 2. G4 compliance in examples
{
  let hits = 0;
  const walk = (dir) => {
    if (!existsSync(join(ROOT, dir))) return;
    for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel);
      else if (/\.(js|mjs|jsx|ts|tsx|vue|html)$/.test(e.name)) {
        const src = read(rel);
        const bad = src.match(/import\s*\{[^}]*\}\s*from\s*["']https:\/\/esm\.sh\/gsap@[\d.]+\/\w+["']/g);
        if (bad) {
          hits += bad.length;
          fail(`G4 violation (named esm.sh plugin import) in ${rel}: ${bad[0].trim()}`);
        }
      }
    }
  };
  walk("examples");
  walk("templates");
  walk("skills/primitives"); // generated scene.js can live in projects/; primitives themselves are pure JS — skip via filter
  if (hits === 0) ok("examples/templates comply with Anti-Slop G4 (default imports for esm.sh plugins)");
}

// --------------------------------------------------- 3. motion-craft command list
{
  const CANONICAL = ["init", "shape", "animate", "polish", "audit", "critique", "quieter", "bolder", "adapt", "studio", "export"];
  const expectCount = String(CANONICAL.length);
  const checks = [
    ["skills/llms.txt", /Eleven commands: ([a-z, ]+)\./],
    ["skills/motion-craft/SKILL.md", /\(init[^)]*\)/],
  ];
  for (const [file, re] of checks) {
    if (!existsSync(join(ROOT, file))) continue;
    const src = read(file);
    const m = src.match(re);
    if (!m) { fail(`${file}: command list not found (pattern ${re})`); continue; }
    const found = m[0].match(/[a-z]+/g).filter((w) => CANONICAL.includes(w));
    const missing = CANONICAL.filter((c) => !found.includes(c));
    if (missing.length) fail(`${file}: command list missing [${missing.join(", ")}]`);
    else ok(`${file}: all ${expectCount} motion-craft commands listed`);
  }
  for (const file of ["README.md", "README_CN.md"]) {
    if (!existsSync(join(ROOT, file))) continue;
    const src = read(file);
    if (/(?<!\d)9 (commands|命令|个命令)/.test(src)) fail(`${file}: still says 9 commands (canonical is ${expectCount})`);
    else ok(`${file}: no stale "9 commands" wording`);
  }
}

// --------------------------------------------------- 4. SKILL.md frontmatter
{
  const dirs = readdirSync(join(ROOT, "skills"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  let allGood = true;
  for (const dir of dirs) {
    const p = `skills/${dir}/SKILL.md`;
    if (!existsSync(join(ROOT, p))) { fail(`${p} missing`); allGood = false; continue; }
    const src = read(p);
    const fm = src.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { fail(`${p}: no frontmatter`); allGood = false; continue; }
    const name = fm[1].match(/^name:\s*(\S+)/m)?.[1];
    const hasDesc = /^description:\s*\S/m.test(fm[1]);
    if (name !== dir) { fail(`${p}: frontmatter name "${name}" != directory "${dir}"`); allGood = false; }
    if (!hasDesc) { fail(`${p}: missing description`); allGood = false; }
  }
  if (allGood) ok(`all ${dirs.length} SKILL.md files have valid frontmatter (name matches directory)`);
}

// --------------------------------------------------- 5. pointer files, not symlinks
{
  for (const file of ["CLAUDE.md", "GEMINI.md"]) {
    if (!existsSync(join(ROOT, file))) continue;
    const st = lstatSync(join(ROOT, file));
    if (st.isSymbolicLink()) { fail(`${file} is a symlink — breaks Windows checkouts and zip downloads`); continue; }
    if (!/^@AGENTS\.md$/m.test(read(file))) { fail(`${file}: missing "@AGENTS.md" import line`); continue; }
    ok(`${file} is a real file importing @AGENTS.md`);
  }
}

// --------------------------------------------------- 6. adapter coverage per skill
{
  if (!existsSync(join(ROOT, ".cursor/rules")) || !existsSync(join(ROOT, ".github/instructions"))) {
    ok("adapter dirs not present in this checkout — skipping adapter coverage check");
  } else {
    const skills = readdirSync(join(ROOT, "skills"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    let covered = true;
    for (const s of skills) {
      if (!existsSync(join(ROOT, `.cursor/rules/${s}.mdc`))) { fail(`missing Cursor rule .cursor/rules/${s}.mdc`); covered = false; }
      if (!existsSync(join(ROOT, `.github/instructions/${s}.instructions.md`))) { fail(`missing Copilot file .github/instructions/${s}.instructions.md`); covered = false; }
    }
    if (covered) ok(`all ${skills.length} skills have Cursor (.mdc) and Copilot (.instructions.md) adapters`);
  }
}

// --------------------------------------------------- 7. windsurf legacy/current sync
{
  if (!existsSync(join(ROOT, ".windsurfrules")) || !existsSync(join(ROOT, ".windsurf/rules/gsap.md"))) {
    ok("windsurf files not present — skipping");
  } else {
    const strip = (s) =>
      s
        .replace(/^---\n[\s\S]*?\n---\n/, "")
        .replace(/^> Legacy single-file format[^\n]*\n/m, "")
        .replace(/\s+/g, " ")
        .trim();
    if (strip(read(".windsurfrules")) === strip(read(".windsurf/rules/gsap.md")))
      ok(".windsurfrules and .windsurf/rules/gsap.md carry the same rule body");
    else fail(".windsurfrules and .windsurf/rules/gsap.md have drifted — edit both together");
  }
}

// --------------------------------------------------- 8. State layer integrity
{
  const schemaPath = join(ROOT, "skills/motion-state/schema.json");
  if (!existsSync(schemaPath)) fail("skills/motion-state/schema.json missing");
  else {
    try {
      JSON.parse(read("skills/motion-state/schema.json"));
      ok("skills/motion-state/schema.json is valid JSON");
    } catch (e) { fail(`skills/motion-state/schema.json invalid JSON: ${e.message}`); }
  }
  const rtPath = join(ROOT, "skills/motion-state/runtime.mjs");
  if (!existsSync(rtPath)) fail("skills/motion-state/runtime.mjs missing");
  else {
    const rt = read("skills/motion-state/runtime.mjs");
    for (const fn of ["validate", "at", "add", "remove", "update", "summary"]) {
      if (!rt.includes(`export function ${fn}`)) fail(`runtime.mjs missing export ${fn}`);
      else ok(`runtime.mjs exports ${fn}`);
    }
  }
  const idxPath = join(ROOT, "skills/motion-primitives/index.js");
  if (!existsSync(idxPath)) fail("skills/motion-primitives/index.js missing");
  else {
    const idx = read("skills/motion-primitives/index.js");
    const expected = [
      "fadeUp", "fadeIn", "scaleIn", "slideInLeft", "slideInRight",
      "splitReveal", "typewriter", "scrambleText",
      "morphTo", "drawOn",
      "parallaxY", "staggerIn",
      "loopPulse", "shake", "cameraPush", "hold"
    ];
    let count = 0;
    for (const name of expected) {
      // default import:  `import <name> from` or `import <name>,`
      // named import:   `, { <name> }` or `{ <name> }`
      const ok = new RegExp(`import\\s+${name}\\b`).test(idx)
              || new RegExp(`\\{\\s*${name}\\b`).test(idx);
      if (!ok) fail(`primitives/index.js missing import of ${name}`);
      else count++;
    }
    ok(`${count}/${expected.length} primitives exported from index.js`);
  }
}

// --------------------------------------------------- 9. templates ≥ 20
{
  const dir = join(ROOT, "templates");
  if (!existsSync(dir)) fail("templates/ missing");
  else {
    const entries = readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory());
    let valid = 0;
    for (const e of entries) {
      const p = join(dir, e.name, "state.json");
      if (!existsSync(p)) { fail(`templates/${e.name}/state.json missing`); continue; }
      try {
        const s = JSON.parse(readFileSync(p, "utf8"));
        if (s.schemaVersion !== 1) { fail(`templates/${e.name}/state.json schemaVersion=${s.schemaVersion}`); continue; }
        if (!Array.isArray(s.layers) || !Array.isArray(s.beats)) { fail(`templates/${e.name}/state.json bad shape`); continue; }
        valid++;
      } catch (err) { fail(`templates/${e.name}/state.json invalid: ${err.message}`); }
    }
    ok(`${valid} templates with valid state.json`);
    if (valid < 20) fail(`only ${valid} templates; need ≥ 20 per SPEC.md §4`);
  }
}

// ---------------------------------------------------------------- report
console.log("");
if (failures.length) {
  console.error(`FAILED — ${failures.length} consistency problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("All consistency checks passed.");
