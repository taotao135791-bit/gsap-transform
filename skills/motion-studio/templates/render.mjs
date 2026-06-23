#!/usr/bin/env node
/**
 * Motion Studio — render.mjs
 *
 * Seeks the scene's master timeline frame-by-frame in headless Chrome and encodes
 * the PNG sequence to video. Reuses the ticker-hijack from gsap-plugins/SKILL.md
 * §"Exporting GSAP motion as video" and motion-craft /export.
 *
 * ES modules cannot load from file:// (Chrome CORS blocks origin "null"), so this
 * script starts a tiny local HTTP server and loads the scene over http://localhost.
 *
 * Usage:
 *   npm install                       # first time: puppeteer-core + @ffmpeg-installer/ffmpeg
 *   node render.mjs [options]
 *
 * Options:
 *   --preset <name>     1080p | 4k | vertical | square   (default 1080p)
 *   --format <name>     mp4 | webm | mov                 (default mp4)
 *   --fps <n>           frame rate                       (default 60)
 *   --transparent       remove backgrounds + keep alpha  (use with webm/mov)
 *   --out <name>        output basename                  (default "output")
 *   --input <file>      html entry                       (default "index.html")
 *   --verbose           print browser console output
 *   CHROME_PATH env     path to system Chrome (if auto-detect fails)
 */
import puppeteer from "puppeteer-core";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, rm, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { resolve, dirname, join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".woff2": "font/woff2"
};

// Serve the project dir over http so ES-module scene.js can load (file:// blocks it).
function startServer(root) {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let p = normalize(join(root, pathname));
      if (!p.startsWith(root)) { res.statusCode = 403; return res.end("forbidden"); }
      if (!extname(p)) p = join(p, "index.html");          // directory → index.html
      const data = await readFile(p);
      res.setHeader("Content-Type", MIME[extname(p)] || "application/octet-stream");
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end("not found");
    }
  });
  return new Promise((resolveFn) => server.listen(0, "127.0.0.1", () => resolveFn(server)));
}

// ---------- resolution presets ----------
const PRESETS = {
  "1080p":  { width: 1920, height: 1080, scale: 1 },
  "4k":     { width: 1920, height: 1080, scale: 2 },   // CSS viewport 1080p, deviceScaleFactor renders 4K
  vertical: { width: 1080, height: 1920, scale: 1 },
  square:   { width: 1080, height: 1080, scale: 1 }
};

function parseArgs(argv) {
  const a = { preset: "1080p", format: "mp4", fps: 60, transparent: false, out: "output", input: "index.html", verbose: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === "--preset") { a.preset = v; i++; }
    else if (k === "--format") { a.format = v; i++; }
    else if (k === "--fps") { a.fps = parseInt(v, 10); i++; }
    else if (k === "--transparent") { a.transparent = true; }
    else if (k === "--out") { a.out = v; i++; }
    else if (k === "--input") { a.input = v; i++; }
    else if (k === "--verbose") { a.verbose = true; }
  }
  return a;
}

function findChrome() {
  const env = process.env.CHROME_PATH;
  if (env && existsSync(env)) return env;
  const known = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  for (const p of known) if (existsSync(p)) return p;
  for (const bin of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    try {
      const out = execFileSync("which", [bin], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      if (out && existsSync(out)) return out;
    } catch {}
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv);
  const preset = PRESETS[args.preset];
  if (!preset) { console.error(`Unknown --preset: ${args.preset}. Valid: ${Object.keys(PRESETS).join(", ")}`); process.exit(1); }
  if (!["mp4", "webm", "mov"].includes(args.format)) { console.error(`Unknown --format: ${args.format}. Valid: mp4 | webm | mov`); process.exit(1); }
  if (args.transparent && args.format === "mp4") {
    console.warn("warning: mp4 has no alpha channel — use --format webm or mov for transparency.");
  }

  const executablePath = findChrome();
  if (!executablePath) {
    console.error("Could not find Chrome. Set CHROME_PATH=/path/to/chrome and retry.\n(puppeteer-core drives your SYSTEM Chrome — it never downloads Chromium.)");
    process.exit(1);
  }

  const inputPath = resolve(__dirname, args.input);
  if (!existsSync(inputPath)) { console.error(`Not found: ${inputPath}`); process.exit(1); }
  const framesDir = resolve(__dirname, "frames");
  const outFile = resolve(__dirname, `${args.out}.${args.format}`);

  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const resLabel = preset.scale > 1 ? `${preset.width * preset.scale}×${preset.height * preset.scale}` : `${preset.width}×${preset.height}`;
  console.log(`▶ ${args.preset} → ${resLabel} @ ${args.fps}fps${args.transparent ? " (transparent)" : ""}`);

  const server = await startServer(__dirname);
  const base = `http://127.0.0.1:${server.address().port}/`;

  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    page.on("pageerror", (e) => console.error(`  [pageerror] ${e.message}`));
    if (args.verbose) page.on("console", (m) => console.log(`  [browser:${m.type()}] ${m.text()}`));

    // Hide GSDevTools for the whole session + force the motion branch regardless of OS setting (R6).
    await page.evaluateOnNewDocument(() => { window.__RENDERING = true; });
    await page.setViewport({ width: preset.width, height: preset.height, deviceScaleFactor: preset.scale });

    const client = await page.target().createCDPSession();
    await client.send("Emulation.setEmulatedMedia", { media: "", features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
    if (args.transparent) {
      await client.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
    }

    await page.goto(base + args.input, { waitUntil: "networkidle0" });
    // Hide all dev-only chrome (GSDevTools mount, Export button + status) from every rendered
    // frame — belt-and-suspenders alongside the window.__RENDERING gate in index.html.
    await page.addStyleTag({ content: "#devtools,#export-btn,#export-status{display:none!important}" });
    if (args.transparent) {
      // Strip every background and disable 3D compositing (transparent-render ghost — R4).
      await page.addStyleTag({
        content: "html,body,*{background:transparent!important} .stage{box-shadow:none!important} *{perspective:none!important;transform-style:flat!important}"
      });
    }
    await page.waitForFunction(() => window.__studio && window.__studio.tl, { timeout: 30000 });

    const duration = await page.evaluate(() => window.__studio.duration());
    if (!duration || duration <= 0) { console.error("Timeline duration is 0 — nothing to render."); process.exit(1); }

    const totalFrames = Math.max(1, Math.ceil(duration * args.fps));
    console.log(`  timeline ${duration.toFixed(2)}s → ${totalFrames} frames`);

    // Freeze the master timeline (timeScale 0) so the auto-ticker cannot drift the playhead between
    // our per-frame seek and the screenshot. (pause() can stall under CDP; timeScale(0) is safe.)
    await page.evaluate(() => { window.__studio.tl.timeScale(0); });

    // Seek the master timeline directly with tl.time(t) each frame. tl.time() is an absolute seek,
    // so the auto-ticker cannot desync frames (every frame re-pins the playhead to t before the shot).
    // NOTE: seek the tl itself, NOT gsap.updateRoot() — a timeline built inside gsap.matchMedia()
    // is NOT on gsap.globalTimeline, so updateRoot cannot reach it. (The /export ticker-hijack in
    // gsap-plugins assumes the tween is on globalTimeline; that holds for a loose tween but not for
    // a matchMedia-wrapped master timeline.) See motion-studio/SKILL.md.

    for (let f = 0; f < totalFrames; f++) {
      const t = f / args.fps;
      await page.evaluate((tt) => { window.__studio.tl.time(tt); }, t);
      // Yield one tick so the browser composites the new inline styles. The timeline is frozen
      // (timeScale 0), so this delay cannot drift the playhead. (requestAnimationFrame inside an
      // evaluate can fail to fire under headless CDP and time out the call — use a host-side sleep.)
      await new Promise((r) => setTimeout(r, 16));
      const padded = String(f).padStart(5, "0");
      await page.screenshot({ path: join(framesDir, `f${padded}.png`), omitBackground: args.transparent, type: "png" });
      if (f % 10 === 0 || f === totalFrames - 1) process.stdout.write(`\r  frame ${f + 1}/${totalFrames}`);
    }
    console.log("");
  } finally {
    await browser.close();
    server.close();
  }

  // ---------- encode ----------
  const codec =
    args.format === "mp4"  ? ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18"]
    : args.format === "webm" ? ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", "0", "-crf", "20"]
    :                          ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"];
  const ffArgs = ["-y", "-framerate", String(args.fps), "-i", join(framesDir, "f%05d.png"), ...codec, outFile];

  console.log("▶ encoding with ffmpeg…");
  try {
    await execFileAsync(ffmpegInstaller.path, ffArgs, { maxBuffer: 20 * 1024 * 1024 });
  } catch (e) {
    console.error("ffmpeg failed:\n" + (e.stderr || e.message));
    process.exit(1);
  }

  await rm(framesDir, { recursive: true, force: true });
  console.log(`✓ ${outFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
