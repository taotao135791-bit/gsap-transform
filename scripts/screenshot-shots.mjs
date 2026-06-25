// test-screenshots.mjs — open each shot HTML in browser and capture
// a screenshot at multiple time points.

import puppeteer from "puppeteer-core";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, normalize, join, extname } from "node:path";
import { existsSync, readdirSync } from "node:fs";

const ROOT = "/Users/glt/Desktop/特效特效特效/gsap-transform";
const SHOTS_DIR = resolve(ROOT, "test kimi/v2/shots");
const OUT_DIR = resolve(ROOT, "test kimi/v2/previews");
await mkdir(OUT_DIR, { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json" };

// serve from project root so /test%20kimi/... resolves
const server = createServer(async (req, res) => {
  const p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }
  try {
    res.setHeader("Content-Type", MIME[extname(p)] || "application/octet-stream");
    res.end(await readFile(p));
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
const exe = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(exe)) { console.error("Chrome not found"); process.exit(1); }

const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ["--no-sandbox"] });

const shots = readdirSync(SHOTS_DIR).filter(f => f.endsWith(".html")).sort();

for (const shot of shots) {
  console.log(`\n=== ${shot} ===`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on("pageerror", e => console.error(`  [pageerror] ${e.message}`));
  await page.goto(`${base}/test kimi/v2/shots/${shot}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  // capture at 4 time points: 0.2s, 1.0s, 2.5s, 4.5s
  for (const [label, t] of [["t0", 0.2], ["t1", 1.0], ["t2", 2.5], ["t3", 4.5]]) {
    await new Promise(r => setTimeout(r, t * 1000 - (label === "t0" ? 0 : 0)));
    const out = resolve(OUT_DIR, shot.replace(".html", `_${label}.png`));
    await page.screenshot({ path: out });
    console.log(`  ✓ ${label} → ${out.split("/").pop()}`);
  }
  await page.close();
}

await browser.close();
server.close();
console.log("\nDone.");