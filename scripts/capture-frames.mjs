import puppeteer from "puppeteer-core";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, normalize, join, extname } from "node:path";
import { existsSync } from "node:fs";
const ROOT = "/Users/glt/Desktop/特效特效特效/gsap-transform";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json" };
const server = createServer(async (req, res) => {
  const p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }
  try { res.setHeader("Content-Type", MIME[extname(p)] || "application/octet-stream"); res.end(await readFile(p)); }
  catch { res.statusCode = 404; res.end(); }
});
const s = await new Promise(r => server.listen(0, "127.0.0.1", r));
const exe = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => { window.__RENDERING = true; });
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
const client = await page.target().createCDPSession();
await client.send("Emulation.setEmulatedMedia", { media: "", features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
await page.goto(`http://127.0.0.1:${s.address().port}/projects/kimi-k26/s01.html`, { waitUntil: "domcontentloaded" });
await page.addStyleTag({ content: "#devtools,#export-btn,#export-status{display:none!important}" });
await page.waitForFunction(() => window.__studio?.tl, { timeout: 30000 });
await page.evaluate(() => window.__studio.tl.timeScale(0));
for (const t of [0.5, 1.5, 2.5]) {
  await page.evaluate((tt) => window.__studio.tl.time(tt), t);
  await new Promise(r => setTimeout(r, 60));
  await page.screenshot({ path: `/Users/glt/Desktop/特效特效特效/gsap-transform/test kimi/s01_t${String(t).replace(".", "_")}.png` });
  console.log(`captured t=${t}`);
}
await browser.close(); server.close();
