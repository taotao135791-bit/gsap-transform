#!/usr/bin/env node
/**
 * Motion Studio — serve.mjs (dev preview server)
 *
 * ES-module scene.js cannot load from file:// (Chrome CORS blocks origin "null"), so preview the
 * project over http://. Zero dependencies — Node built-ins only.
 *
 * Usage:  node serve.mjs            then open the printed URL in your browser.
 *         PORT=4321 node serve.mjs  to pick a port.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { statSync } from "node:fs";
import { join, normalize, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIME = {
  ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript",
  ".css":"text/css", ".json":"application/json", ".svg":"image/svg+xml",
  ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".woff2":"font/woff2"
};

const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let p = normalize(join(__dirname, pathname));
    if (!p.startsWith(__dirname)) { res.statusCode = 403; return res.end("forbidden"); }
    if (!extname(p) || statSync(p).isDirectory()) p = join(p, "index.html");
    const data = await readFile(p);
    res.setHeader("Content-Type", MIME[extname(p)] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`▶ motion-studio preview:  http://127.0.0.1:${PORT}/   (Ctrl+C to stop)`);
  console.log(`  GSDevTools timeline appears at the bottom. Press the Export button for render hints.`);
});
