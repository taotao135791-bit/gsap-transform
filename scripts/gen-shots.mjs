// gen-shots.mjs — generate the 12 state.json files for the K2.6 promo,
// one per shot. Each shot is a self-contained state.json with its own
// duration, layers, and beats. Final shot durations are sized so the
// timeline equals the state's duration (hold beats pad where needed).

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "projects", "kimi-k26", "shots");

const ACCENT = "#7DF9FF";
const RED    = "#FF3D5A";
const BG     = "#0A0A0F";

function makeState({ title, duration, width = 1920, height = 1080, layers, beats }) {
  return {
    schemaVersion: 1,
    title,
    duration,
    fps: 30,
    width,
    height,
    accent: ACCENT,
    layers: layers.map(l => ({ ...l })),
    beats:  beats.map(b => ({ ...b }))
  };
}

// S01 Black → Logo
const S01 = makeState({
  title: "S01 Black → Logo",
  duration: 2.0,
  layers: [
    { id: "k_glyph", selector: ".k-glyph", type: "any",  content: "" },
    { id: "wordmark",selector: ".wordmark",type: "text", content: "KIMI" }
  ],
  beats: [
    { id: "b1", layerId: "k_glyph", primitive: "scaleIn",  at: 0.2, duration: 1.4, args: { from: 0.4 } },
    { id: "b2", layerId: "wordmark",primitive: "fadeUp",   at: 1.2, duration: 0.8 }
  ]
});

// S02 Manifesto
const S02 = makeState({
  title: "S02 Manifesto",
  duration: 4.5,
  layers: [
    { id: "eyebrow", selector: ".eyebrow",  type: "text", content: "K2.6 · MULTIMODAL · 256K" },
    { id: "h1",      selector: ".h1",       type: "text", content: "Code that thinks ahead." }
  ],
  beats: [
    { id: "b1", layerId: "eyebrow", primitive: "fadeUp",       at: 0.3, duration: 0.6 },
    { id: "b2", layerId: "h1",      primitive: "splitReveal",  at: 0.9, duration: 2.4,
      args: { direction: "up", stagger: 0.10, splitBy: "lines", duration: 2.4 } },
    { id: "hold", layerId: "h1",     primitive: "hold",         at: 3.3, duration: 1.2 }
  ]
});

// S03 Three pillars
const S03 = makeState({
  title: "S03 Three Pillars",
  duration: 5.0,
  layers: [
    { id: "vision", selector: ".card.vision", type: "text", content: "VISION" },
    { id: "code",   selector: ".card.code",   type: "any",  content: "" },
    { id: "code_in",selector: ".code-in",     type: "text", content: "CODE" },
    { id: "code_out",selector: ".code-out",   type: "text", content: "OUT" },
    { id: "swarm",  selector: ".card.swarm",  type: "text", content: "SWARM" }
  ],
  beats: [
    { id: "b1", layerId: "vision",   primitive: "staggerIn",  at: 0.3, duration: 1.0, args: { y: 30, stagger: 0.15 } },
    { id: "b2", layerId: "code_in",  primitive: "fadeIn",     at: 0.9, duration: 0.8, allowOverlap: true },
    { id: "b3", layerId: "code_out", primitive: "fadeIn",     at: 1.6, duration: 0.6, allowOverlap: true },
    { id: "b4", layerId: "swarm",    primitive: "staggerIn",  at: 2.4, duration: 1.4, args: { y: 30, stagger: 0.15 }, allowOverlap: true },
    { id: "hold", layerId: "swarm",   primitive: "hold",       at: 3.8, duration: 1.2 }
  ]
});

// S04 Multimodal video-in
const S04 = makeState({
  title: "S04 Multimodal Video In",
  duration: 5.0,
  layers: [
    { id: "frame",   selector: ".video-frame", type: "any",  content: "" },
    { id: "label",   selector: ".label",       type: "text", content: "frame_0142 · 1080p · 30fps" },
    { id: "caption", selector: ".caption",     type: "text", content: "Video in. Insight out." }
  ],
  beats: [
    { id: "b1", layerId: "frame",   primitive: "scaleIn",    at: 0.2, duration: 1.6, args: { from: 0.7 } },
    { id: "b2", layerId: "label",   primitive: "fadeUp",     at: 1.6, duration: 0.8 },
    { id: "b3", layerId: "caption", primitive: "splitReveal",at: 2.6, duration: 1.8, args: { direction: "up", stagger: 0.10, duration: 1.8 } },
    { id: "hold", layerId: "caption",primitive: "hold",       at: 4.4, duration: 0.6 }
  ]
});

// S05 256K context — parallax
const S05 = makeState({
  title: "S05 256K Context",
  duration: 4.0,
  layers: [
    { id: "scrolltext", selector: ".scroll-text", type: "text",
      content: "function plan() { return strategy(256000) }\n// K2.6 holds the long arc in working memory\n// every reference, every test, every file\n// 256K tokens. One model. End-to-end reasoning.\nconst k = new Kimi({ model: \"k2.6\" });\nawait k.run(longTask);" },
    { id: "h2", selector: ".h2", type: "text", content: "256K" },
    { id: "sub", selector: ".sub", type: "text", content: "tokens of working memory" }
  ],
  beats: [
    { id: "b1", layerId: "scrolltext", primitive: "parallaxY", at: 0.0, duration: 4.0,
      args: { distance: -420, ease: "none" } },
    { id: "b2", layerId: "h2",         primitive: "scaleIn",   at: 0.6, duration: 1.2, args: { from: 0.6 } },
    { id: "b3", layerId: "sub",        primitive: "fadeUp",    at: 1.8, duration: 0.8 }
  ]
});

// S06 Build a swarm
const S06 = makeState({
  title: "S06 Build a Swarm",
  duration: 4.0,
  layers: [
    { id: "eyebrow", selector: ".eyebrow", type: "text", content: "ONE PROMPT" },
    { id: "h1",      selector: ".h1",      type: "text", content: "Build a swarm." }
  ],
  beats: [
    { id: "b1", layerId: "eyebrow", primitive: "fadeUp",       at: 0.4, duration: 0.6 },
    { id: "b2", layerId: "h1",      primitive: "splitReveal",  at: 1.0, duration: 2.4,
      args: { direction: "up", stagger: 0.12, duration: 2.4 } },
    { id: "hold", layerId: "h1",     primitive: "hold",         at: 3.4, duration: 0.6 }
  ]
});

// S07 Swarm UI
const S07 = makeState({
  title: "S07 Swarm UI",
  duration: 7.0,
  layers: [
    { id: "chrome",     selector: ".chat-chrome", type: "any",  content: "" },
    { id: "prompt",     selector: ".prompt",      type: "text", content: "Plan a product launch for a matcha brand" },
    { id: "agents",     selector: ".agents",      type: "group", content: "" },
    { id: "send",       selector: ".send",        type: "any",  content: "" }
  ],
  beats: [
    { id: "b1", layerId: "chrome", primitive: "fadeIn",     at: 0.2, duration: 0.8 },
    { id: "b2", layerId: "prompt", primitive: "typewriter", at: 1.0, duration: 2.0, args: { cps: 18 } },
    { id: "b3", layerId: "agents", primitive: "staggerIn",  at: 3.2, duration: 1.0,
      args: { y: 24, stagger: 0.15, duration: 0.6 } },
    { id: "b4", layerId: "send",   primitive: "loopPulse",  at: 4.5, duration: 2.0,
      args: { scale: 1.05 } }
  ]
});

// S08 Parallel tasks
const S08 = makeState({
  title: "S08 Parallel Tasks",
  duration: 7.0,
  layers: [
    { id: "h2",     selector: ".h2",     type: "text", content: "3 agents · 1 task" },
    { id: "card1",  selector: ".card-1", type: "any",  content: "" },
    { id: "card2",  selector: ".card-2", type: "any",  content: "" },
    { id: "card3",  selector: ".card-3", type: "any",  content: "" },
    { id: "name1",  selector: ".name-1", type: "text", content: "Designer" },
    { id: "name2",  selector: ".name-2", type: "text", content: "Copywriter" },
    { id: "name3",  selector: ".name-3", type: "text", content: "Researcher" },
    { id: "prog1",  selector: ".prog-1", type: "text", content: "████████  4/5" },
    { id: "prog2",  selector: ".prog-2", type: "text", content: "██████    3/5" },
    { id: "prog3",  selector: ".prog-3", type: "text", content: "██████████ 5/5" }
  ],
  beats: [
    { id: "b1", layerId: "h2",     primitive: "fadeUp",      at: 0.2, duration: 0.8 },
    { id: "b2", layerId: "card1",  primitive: "slideInLeft", at: 0.9, duration: 0.8, args: { distance: 80 } },
    { id: "b3", layerId: "card2",  primitive: "slideInLeft", at: 1.4, duration: 0.8, args: { distance: 80 }, allowOverlap: true },
    { id: "b4", layerId: "card3",  primitive: "slideInLeft", at: 1.9, duration: 0.8, args: { distance: 80 }, allowOverlap: true },
    { id: "b5", layerId: "name1",  primitive: "fadeUp",      at: 2.8, duration: 0.6 },
    { id: "b6", layerId: "name2",  primitive: "fadeUp",      at: 3.2, duration: 0.6, allowOverlap: true },
    { id: "b7", layerId: "name3",  primitive: "fadeUp",      at: 3.6, duration: 0.6, allowOverlap: true },
    { id: "b8", layerId: "prog1",  primitive: "fadeIn",      at: 4.6, duration: 0.8 },
    { id: "b9", layerId: "prog2",  primitive: "fadeIn",      at: 5.0, duration: 0.8, allowOverlap: true },
    { id: "ba", layerId: "prog3",  primitive: "fadeIn",      at: 5.4, duration: 0.8, allowOverlap: true },
    { id: "hold", layerId: "prog3",primitive: "hold",        at: 6.2, duration: 0.8 }
  ]
});

// S09 Output render
const S09 = makeState({
  title: "S09 Output Render",
  duration: 5.5,
  layers: [
    { id: "eyebrow", selector: ".eyebrow", type: "text", content: "DELIVERED IN MINUTES" },
    { id: "chart1",  selector: ".chart-1",  type: "any",  content: "" },
    { id: "chart2",  selector: ".chart-2",  type: "any",  content: "" },
    { id: "chart3",  selector: ".chart-3",  type: "any",  content: "" },
    { id: "label1",  selector: ".label-1", type: "text", content: "Brand tone guide" },
    { id: "label2",  selector: ".label-2", type: "text", content: "Launch brief" },
    { id: "label3",  selector: ".label-3", type: "text", content: "Market scan" }
  ],
  beats: [
    { id: "b1", layerId: "eyebrow", primitive: "fadeUp",     at: 0.2, duration: 0.6 },
    { id: "b2", layerId: "chart1",  primitive: "scaleIn",    at: 1.0, duration: 0.8, args: { from: 0.7 } },
    { id: "b3", layerId: "chart2",  primitive: "scaleIn",    at: 1.4, duration: 0.8, args: { from: 0.7 }, allowOverlap: true },
    { id: "b4", layerId: "chart3",  primitive: "scaleIn",    at: 1.8, duration: 0.8, args: { from: 0.7 }, allowOverlap: true },
    { id: "b5", layerId: "label1",  primitive: "fadeUp",     at: 3.4, duration: 0.6 },
    { id: "b6", layerId: "label2",  primitive: "fadeUp",     at: 3.8, duration: 0.6, allowOverlap: true },
    { id: "b7", layerId: "label3",  primitive: "fadeUp",     at: 4.2, duration: 0.6, allowOverlap: true },
    { id: "hold", layerId: "label3", primitive: "hold",       at: 4.8, duration: 0.7 }
  ]
});

// S10 Verdict
const S10 = makeState({
  title: "S10 Verdict",
  duration: 4.0,
  layers: [
    { id: "k_mark", selector: ".k-mark", type: "any",  content: "" },
    { id: "h1",     selector: ".h1",     type: "text", content: "K2.6" },
    { id: "sub",    selector: ".sub",    type: "text", content: "now live" }
  ],
  beats: [
    { id: "b1", layerId: "k_mark", primitive: "scaleIn", at: 0.4, duration: 1.0, args: { from: 0.4 } },
    { id: "b2", layerId: "h1",     primitive: "scaleIn", at: 1.2, duration: 0.8, args: { from: 0.7 } },
    { id: "b3", layerId: "sub",    primitive: "fadeUp",  at: 2.4, duration: 0.8 },
    { id: "b4", layerId: "k_mark", primitive: "shake",   at: 1.8, duration: 0.4, args: { magnitude: 4 } },
    { id: "hold", layerId: "sub",   primitive: "hold",    at: 3.2, duration: 0.8 }
  ]
});

// S11 CTA
const S11 = makeState({
  title: "S11 CTA",
  duration: 5.0,
  layers: [
    { id: "line1", selector: ".line-1", type: "text", content: "kimi.com" },
    { id: "line2", selector: ".line-2", type: "text", content: "App · API · Code" },
    { id: "badge1",selector: ".badge-1", type: "any", content: "" },
    { id: "badge2",selector: ".badge-2", type: "any", content: "" }
  ],
  beats: [
    { id: "b1", layerId: "line1",  primitive: "slideInLeft", at: 0.4, duration: 1.0, args: { distance: 80 } },
    { id: "b2", layerId: "line2",  primitive: "slideInLeft", at: 1.4, duration: 1.0, args: { distance: 80 } },
    { id: "b3", layerId: "badge1", primitive: "fadeUp",      at: 3.0, duration: 0.8 },
    { id: "b4", layerId: "badge2", primitive: "fadeUp",      at: 3.4, duration: 0.8, allowOverlap: true },
    { id: "hold", layerId: "badge2",primitive: "hold",       at: 4.2, duration: 0.8 }
  ]
});

// S12 Black out
const S12 = makeState({
  title: "S12 Black Out",
  duration: 0.5,
  layers: [
    { id: "void", selector: ".void", type: "any", content: "" }
  ],
  beats: [
    { id: "h1", layerId: "void", primitive: "hold", at: 0, duration: 0.5 }
  ]
});

const SHOTS = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12];

await mkdir(OUT, { recursive: true });
const PROJECT = resolve(__dirname, "..", "projects", "kimi-k26");
for (let i = 0; i < SHOTS.length; i++) {
  const slug = `s${String(i + 1).padStart(2, "0")}`;
  const json = JSON.stringify(SHOTS[i], null, 2);
  await writeFile(resolve(OUT, `${slug}.json`), json);
  await writeFile(resolve(PROJECT, `${slug}.json`), json);
  console.log(`OK  ${slug}.json  (${SHOTS[i].duration}s, ${SHOTS[i].beats.length} beats)`);
}
const total = SHOTS.reduce((s, x) => s + x.duration, 0);
console.log(`\nTotal: ${total.toFixed(1)}s across ${SHOTS.length} shots.`);