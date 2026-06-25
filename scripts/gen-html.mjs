// gen-html.mjs — generate index.html for each shot's state.json.
// Unlike the default generator, this writes a fully styled Kimi-style
// 1920x1080 stage with all the layer selectors used in the shots.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SHOTS_DIR = resolve(ROOT, "projects", "kimi-k26", "shots");

function escape(s) { return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function renderLayer(l) {
  const cls = l.selector.replace(/^\./, "");
  // SVG-path layers need <svg>
  if (l.type === "svg-path") {
    return `  <svg class="${cls}" data-layer-id="${escape(l.id)}" viewBox="0 0 100 100"></svg>`;
  }
  if (l.type === "container" || l.type === "group") {
    return `  <div class="${cls}" data-layer-id="${escape(l.id)}">${escape(l.content ?? "")}</div>`;
  }
  return `  <div class="${cls}" data-layer-id="${escape(l.id)}">${escape(l.content ?? "")}</div>`;
}

function layerCss(l, w, h) {
  const cls = l.selector.replace(/^\./, "");
  const s = l.selector;
  let css = `position: absolute;`;
  if (/headline|h1/.test(s)) css += ` top: 30%; left: 0; right: 0; text-align: center; font-family: 'Fraunces', serif; font-size: 96px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.05; color: #fff;`;
  else if (/sub|caption/.test(s)) css += ` top: 60%; left: 0; right: 0; text-align: center; font-size: 28px; color: rgba(255,255,255,0.7);`;
  else if (/eyebrow/.test(s)) css += ` top: 22%; left: 0; right: 0; text-align: center; color: var(--accent); letter-spacing: 0.3em; text-transform: uppercase; font-size: 18px;`;
  else if (/h2/.test(s)) css += ` top: 12%; left: 0; right: 0; text-align: center; font-family: 'Fraunces', serif; font-size: 56px; color: rgba(255,255,255,0.95);`;
  else if (/wordmark/.test(s)) css += ` bottom: 18%; left: 50%; transform: translateX(-50%); font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.3em; color: #fff;`;
  else if (/tagline/.test(s)) css += ` bottom: 12%; left: 50%; transform: translateX(-50%); font-size: 14px; color: rgba(255,255,255,0.5); letter-spacing: 0.2em;`;
  else if (/k-glyph|k-mark/.test(s)) css += ` top: 38%; left: 50%; transform: translateX(-50%); width: 120px; height: 120px; background: #fff; border-radius: 24px;`;
  else if (/bg-shape/.test(s)) css += ` inset: 0; background: radial-gradient(circle at 50% 50%, rgba(125,249,255,0.10), transparent 60%);`;
  else if (/\.card\.vision/.test(s)) css += ` top: 38%; left: 8%; width: 480px; padding: 40px; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; font-family: 'Fraunces', serif; font-size: 64px; color: #fff;`;
  else if (/\.card\.code/.test(s)) css += ` top: 38%; left: 50%; transform: translateX(-50%); width: 480px; height: 220px; padding: 40px; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;`;
  else if (/\.code-in/.test(s)) css += ` font-family: 'Fraunces', serif; font-size: 64px; color: #fff;`;
  else if (/\.code-out/.test(s)) css += ` position: absolute; right: 0; top: 0; padding: 8px 16px; background: var(--red); color: #fff; font-family: 'Inter', sans-serif; font-weight: 800; font-size: 36px; letter-spacing: 0.05em;`;
  else if (/\.card\.swarm/.test(s)) css += ` top: 38%; right: 8%; width: 480px; padding: 40px; border: 1px solid rgba(125,249,255,0.4); border-radius: 16px; font-family: 'Fraunces', serif; font-size: 64px; color: var(--accent);`;
  else if (/video-frame/.test(s)) css += ` top: 20%; left: 50%; transform: translateX(-50%); width: 720px; height: 405px; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; background:
      linear-gradient(135deg, #1a1a24 0%, #2a1a2a 50%, #1a2a3a 100%);
      background-size: 200% 200%;`;
  else if (/\.label/.test(s)) css += ` top: 70%; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 16px; color: rgba(255,255,255,0.6); letter-spacing: 0.1em;`;
  else if (/scroll-text/.test(s)) css += ` top: 0; right: 8%; width: 560px; padding-top: 100vh; font-family: 'JetBrains Mono', monospace; font-size: 18px; line-height: 1.8; color: rgba(255,255,255,0.55); white-space: pre-wrap;`;
  else if (/line-1/.test(s)) css += ` top: 35%; left: 12%; font-family: 'Fraunces', serif; font-size: 88px; color: #fff;`;
  else if (/line-2/.test(s)) css += ` top: 48%; left: 12%; font-family: 'Inter', sans-serif; font-size: 32px; color: rgba(255,255,255,0.7); letter-spacing: 0.1em;`;
  else if (/badge/.test(s)) css += ` width: 160px; height: 50px; border: 1px solid rgba(255,255,255,0.3); border-radius: 12px;`;
  else if (/chat-chrome/.test(s)) css += ` top: 18%; left: 50%; transform: translateX(-50%); width: 1100px; min-height: 600px; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; background: #14141C; padding: 32px;`;
  else if (/prompt/.test(s)) css += ` width: 100%; padding: 20px 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; font-family: 'Inter', sans-serif; font-size: 22px; color: #fff; background: rgba(255,255,255,0.04);`;
  else if (/agents/.test(s)) css += ` margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;`;
  else if (/send/.test(s)) css += ` position: absolute; right: 32px; bottom: 32px; width: 48px; height: 48px; border-radius: 50%; background: var(--accent);`;
  else if (/card-1/.test(s)) css += ` padding: 24px; border: 1px solid rgba(125,249,255,0.3); border-radius: 16px; background: rgba(20,20,28,0.7);`;
  else if (/card-2/.test(s)) css += ` padding: 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; background: rgba(20,20,28,0.7);`;
  else if (/card-3/.test(s)) css += ` padding: 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; background: rgba(20,20,28,0.7);`;
  else if (/name-\d/.test(s)) css += ` font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; color: var(--accent); margin-bottom: 12px;`;
  else if (/prog-\d/.test(s)) css += ` margin-top: 16px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: rgba(255,255,255,0.6);`;
  else if (/chart-1/.test(s)) css += ` display: inline-block; width: 280px; height: 280px; margin: 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; background: linear-gradient(180deg, rgba(125,249,255,0.15), transparent), #14141C;`;
  else if (/chart-2/.test(s)) css += ` display: inline-block; width: 280px; height: 280px; margin: 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; background: linear-gradient(180deg, rgba(255,61,90,0.15), transparent), #14141C;`;
  else if (/chart-3/.test(s)) css += ` display: inline-block; width: 280px; height: 280px; margin: 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; background: linear-gradient(180deg, rgba(154,160,166,0.15), transparent), #14141C;`;
  else if (/label-\d/.test(s)) css += ` padding: 20px; font-family: 'Inter', sans-serif; font-size: 16px; color: rgba(255,255,255,0.7);`;
  else css += ` inset: 0;`;
  return `    .${cls} { ${css} }\n`;
}

function indexHtml(state, sceneFile = "scene.js") {
  const layersCss = state.layers.map(l => layerCss(l, state.width, state.height)).join("");
  const body = state.layers.map(renderLayer).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escape(state.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"></noscript>
  <style>
    :root {
      --accent: ${escape(state.accent ?? "#7DF9FF")};
      --red: #FF3D5A;
    }
    html, body { margin: 0; padding: 0; background: #0A0A0F; color: #fff; font-family: 'Inter', sans-serif; overflow: hidden; }
    .stage {
      position: relative;
      width: ${state.width}px;
      height: ${state.height}px;
      background: #0A0A0F;
      overflow: hidden;
    }
${layersCss}
  </style>
</head>
<body>
  <div class="stage">
${body}
  </div>
  <div id="devtools"></div>
  <script type="module" src="./${sceneFile}"></script>
</body>
</html>
`;
}

async function main() {
  const fs = await import("node:fs/promises");
  const files = (await fs.readdir(SHOTS_DIR)).filter(f => f.endsWith(".json"));
  for (const f of files) {
    const state = JSON.parse(await readFile(resolve(SHOTS_DIR, f), "utf8"));
    const slug = f.replace(".json", "");
    const html = indexHtml(state, `${slug}.scene.js`);
    await writeFile(resolve(SHOTS_DIR, f.replace(".json", ".html")), html);
    console.log(`OK  ${f.replace(".json", ".html")}`);
  }

  // Mirror shots to project root so they sit next to each other for concatenation.
  const ROOT = resolve(__dirname, "..", "projects", "kimi-k26");
  for (const f of files) {
    const slug = f.replace(".json", "");
    const srcHtml = resolve(SHOTS_DIR, `${slug}.html`);
    const dstHtml = resolve(ROOT, `${slug}.html`);
    await writeFile(dstHtml, await readFile(srcHtml));
  }
  console.log(`OK  mirrored to projects/kimi-k26/`);
}

main().catch(e => { console.error(e); process.exit(1); });