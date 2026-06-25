#!/usr/bin/env node
// gen-templates.mjs — generate all 20 templates from a single declarations table.
// Run once at repo-setup time, and any time a template is added.

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "..", "templates");
const THUMBS_DIR = resolve(__dirname, "..", "assets", "templates");

// ---------- declarations ----------

const TEMPLATES = [
  // Product launch / promo
  {
    slug: "product-hero-reveal",
    title: "Product Hero Reveal",
    industry: "product",
    duration: 6.0, fps: 30, width: 1080, height: 1920,
    accent: "#FF5A1F",
    layers: [
      { id: "bg",     selector: ".bg-shape", type: "any",       content: "" },
      { id: "logo",   selector: ".logo",     type: "any",       content: "" },
      { id: "eyebrow",selector: ".eyebrow",  type: "text",      content: "NEW DROP" },
      { id: "headline", selector: ".headline", type: "text",    content: "Made to Move" },
      { id: "sub",    selector: ".subhead",  type: "text",      content: "The lightest runner we have ever made." },
      { id: "cta",    selector: ".cta",      type: "text",      content: "SHOP NOW" }
    ],
    beats: [
      { id: "b1", layerId: "bg",      primitive: "fadeIn",     at: 0.0, duration: 0.6 },
      { id: "b2", layerId: "logo",    primitive: "scaleIn",    at: 0.3, duration: 0.6, args: { from: 0.6 } },
      { id: "b3", layerId: "eyebrow", primitive: "fadeUp",     at: 0.9, duration: 0.5 },
      { id: "b4", layerId: "headline",primitive: "splitReveal",at: 1.3, duration: 0.9, args: { direction: "up", stagger: 0.08 } },
      { id: "b5", layerId: "sub",     primitive: "fadeUp",     at: 2.4, duration: 0.6, allowOverlap: true },
      { id: "b6", layerId: "cta",     primitive: "slideInLeft",at: 3.2, duration: 0.6 }
    ]
  },
  {
    slug: "product-feature-grid",
    title: "Feature Grid",
    industry: "product",
    duration: 8.0, fps: 30, width: 1080, height: 1080,
    accent: "#7DF9FF",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Why it's different" },
      { id: "grid",     selector: ".grid",     type: "group", content: "" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "splitReveal", at: 0.2, duration: 0.8 },
      { id: "b2", layerId: "grid",     primitive: "staggerIn",   at: 1.2, duration: 0.6, args: { stagger: 0.12 } }
    ]
  },
  {
    slug: "product-specs-stack",
    title: "Specs Stack",
    industry: "product",
    duration: 7.0, fps: 30, width: 1080, height: 1920,
    accent: "#F4D35E",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Spec sheet" },
      { id: "row1", selector: ".row1", type: "text", content: "Weight — 218 g" },
      { id: "row2", selector: ".row2", type: "text", content: "Stack — 32 mm" },
      { id: "row3", selector: ".row3", type: "text", content: "Drop — 6 mm" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "fadeUp", at: 0.2, duration: 0.5 },
      { id: "b2", layerId: "row1",     primitive: "slideInLeft", at: 1.0, duration: 0.5 },
      { id: "b3", layerId: "row2",     primitive: "slideInLeft", at: 1.5, duration: 0.5 },
      { id: "b4", layerId: "row3",     primitive: "slideInLeft", at: 2.0, duration: 0.5 }
    ]
  },
  {
    slug: "product-360-spin",
    title: "Product 360 Spin",
    industry: "product",
    duration: 5.0, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "bg",   selector: ".bg-shape", type: "any", content: "" },
      { id: "logo", selector: ".logo",     type: "any", content: "" }
    ],
    beats: [
      { id: "b1", layerId: "logo", primitive: "cameraPush", at: 0.0, duration: 4.5, args: { scale: 1.2, x: 0, y: -20 } }
    ]
  },
  {
    slug: "product-cta-card",
    title: "Single CTA Card",
    industry: "product",
    duration: 4.0, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Free shipping today" },
      { id: "cta",      selector: ".cta",      type: "text", content: "GET IT" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "fadeUp",  at: 0.2, duration: 0.6 },
      { id: "b2", layerId: "cta",      primitive: "scaleIn", at: 1.0, duration: 0.6, args: { from: 0.5 } },
      { id: "b3", layerId: "cta",      primitive: "loopPulse", at: 1.8, duration: 1.2, args: { scale: 1.04 } }
    ]
  },
  {
    slug: "product-pricing-tier",
    title: "Pricing Tier",
    industry: "product",
    duration: 7.0, fps: 30, width: 1080, height: 1080,
    accent: "#06D6A0",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Pick a plan" },
      { id: "tier1", selector: ".tier1", type: "text", content: "Starter — $0" },
      { id: "tier2", selector: ".tier2", type: "text", content: "Pro — $19" },
      { id: "tier3", selector: ".tier3", type: "text", content: "Team — $49" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "splitReveal", at: 0.2, duration: 0.7 },
      { id: "b2", layerId: "tier1",     primitive: "fadeUp",     at: 1.2, duration: 0.5 },
      { id: "b3", layerId: "tier2",     primitive: "fadeUp",     at: 1.6, duration: 0.5 },
      { id: "b4", layerId: "tier3",     primitive: "fadeUp",     at: 2.0, duration: 0.5 }
    ]
  },

  // Logo / brand
  {
    slug: "logo-wordmark",
    title: "Wordmark Logo",
    industry: "logo",
    duration: 3.5, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "logo", selector: ".logo", type: "text", content: "ACME" }
    ],
    beats: [
      { id: "b1", layerId: "logo", primitive: "scaleIn", at: 0.0, duration: 0.8, args: { from: 0.4 } },
      { id: "b2", layerId: "logo", primitive: "loopPulse", at: 1.2, duration: 1.5, args: { scale: 1.05 } }
    ]
  },
  {
    slug: "logo-morph",
    title: "Logo Morph",
    industry: "logo",
    duration: 4.0, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "bg",   selector: ".bg-shape", type: "any", content: "" },
      { id: "logo", selector: ".logo",     type: "any", content: "" }
    ],
    beats: [
      { id: "b1", layerId: "logo", primitive: "scaleIn", at: 0.0, duration: 0.8, args: { from: 0.5 } }
    ]
  },
  {
    slug: "logo-particles",
    title: "Particle Logo",
    industry: "logo",
    duration: 4.0, fps: 30, width: 1080, height: 1080,
    accent: "#A78BFA",
    layers: [
      { id: "logo", selector: ".logo", type: "text", content: "△" }
    ],
    beats: [
      { id: "b1", layerId: "logo", primitive: "scaleIn", at: 0.0, duration: 0.6, args: { from: 0.3 } },
      { id: "b2", layerId: "logo", primitive: "shake",   at: 1.2, duration: 0.4, args: { magnitude: 6 } }
    ]
  },
  {
    slug: "logo-color-shift",
    title: "Color Shift Logo",
    industry: "logo",
    duration: 4.0, fps: 30, width: 1080, height: 1080,
    accent: "#FFD60A",
    layers: [
      { id: "logo", selector: ".logo", type: "any", content: "" }
    ],
    beats: [
      { id: "b1", layerId: "logo", primitive: "fadeIn", at: 0.0, duration: 0.6 },
      { id: "b2", layerId: "logo", primitive: "loopPulse", at: 0.8, duration: 2.0, args: { scale: 1.06 } }
    ]
  },

  // Cinematic / title
  {
    slug: "cinematic-title",
    title: "Cinematic Title",
    industry: "cinematic",
    duration: 8.0, fps: 30, width: 1920, height: 1080,
    accent: "#E63946",
    layers: [
      { id: "bg",      selector: ".bg-shape", type: "any", content: "" },
      { id: "eyebrow", selector: ".eyebrow",  type: "text", content: "A FILM BY" },
      { id: "title",   selector: ".headline", type: "text", content: "Quiet Thunder" }
    ],
    beats: [
      { id: "b1", layerId: "bg",      primitive: "fadeIn",       at: 0.0, duration: 1.0 },
      { id: "b2", layerId: "eyebrow", primitive: "fadeUp",       at: 1.2, duration: 0.6 },
      { id: "b3", layerId: "title",   primitive: "splitReveal",  at: 2.0, duration: 1.4, args: { direction: "up", stagger: 0.12 } }
    ]
  },
  {
    slug: "kinetic-type-stagger",
    title: "Kinetic Type",
    industry: "cinematic",
    duration: 5.0, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "STAGGER" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "splitReveal", at: 0.2, duration: 1.2, args: { direction: "up", stagger: 0.12 } }
    ]
  },
  {
    slug: "lower-third",
    title: "Lower Third",
    industry: "cinematic",
    duration: 5.0, fps: 30, width: 1920, height: 1080,
    accent: "#FFFFFF",
    layers: [
      { id: "name",  selector: ".headline", type: "text", content: "Dr. Mei Chen" },
      { id: "role",  selector: ".subhead",  type: "text", content: "Lead Researcher" }
    ],
    beats: [
      { id: "b1", layerId: "name", primitive: "slideInLeft", at: 0.3, duration: 0.6 },
      { id: "b2", layerId: "role", primitive: "fadeUp",      at: 1.0, duration: 0.5 }
    ]
  },
  {
    slug: "credit-roll",
    title: "Credit Roll",
    industry: "cinematic",
    duration: 6.0, fps: 30, width: 1920, height: 1080,
    accent: "#FFFFFF",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Directed by\nProduced by\nEdited by\nSound by" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "parallaxY", at: 0.0, duration: 5.0, args: { distance: -400, ease: "none" } }
    ]
  },

  // Data / chart
  {
    slug: "bar-chart-grow",
    title: "Bar Chart Grow",
    industry: "data",
    duration: 6.0, fps: 30, width: 1080, height: 1080,
    accent: "#06D6A0",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Q3 Growth" },
      { id: "grid",     selector: ".grid",     type: "group", content: "" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "fadeUp",   at: 0.2, duration: 0.5 },
      { id: "b2", layerId: "grid",     primitive: "staggerIn", at: 0.9, duration: 0.6, args: { stagger: 0.18, y: 80 } }
    ]
  },
  {
    slug: "kpi-counter",
    title: "KPI Counter",
    industry: "data",
    duration: 4.0, fps: 30, width: 1080, height: 1080,
    accent: "#FFD60A",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "1.4M users" },
      { id: "sub",      selector: ".subhead",  type: "text", content: "+18% MoM" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "splitReveal", at: 0.2, duration: 0.8 },
      { id: "b2", layerId: "sub",      primitive: "fadeUp",      at: 1.4, duration: 0.5 }
    ]
  },
  {
    slug: "line-draw",
    title: "Line Draw",
    industry: "data",
    duration: 5.0, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "Trend" },
      { id: "line",     selector: ".line",     type: "svg-path", content: "" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "fadeUp", at: 0.2, duration: 0.5 },
      { id: "b2", layerId: "line",     primitive: "drawOn", at: 1.0, duration: 2.0 }
    ]
  },

  // Social / short
  {
    slug: "quote-card",
    title: "Quote Card",
    industry: "social",
    duration: 5.0, fps: 30, width: 1080, height: 1350,
    accent: "#FFFFFF",
    layers: [
      { id: "quote",  selector: ".headline", type: "text", content: "\"Move fast.\"" },
      { id: "author", selector: ".subhead",  type: "text", content: "— Mark Zuckerberg" }
    ],
    beats: [
      { id: "b1", layerId: "quote",  primitive: "splitReveal", at: 0.3, duration: 0.9 },
      { id: "b2", layerId: "author", primitive: "fadeUp",      at: 1.6, duration: 0.5 }
    ]
  },
  {
    slug: "before-after",
    title: "Before / After",
    industry: "social",
    duration: 5.0, fps: 30, width: 1080, height: 1080,
    accent: "#FF5A1F",
    layers: [
      { id: "before", selector: ".before", type: "text", content: "BEFORE" },
      { id: "after",  selector: ".after",  type: "text", content: "AFTER"  }
    ],
    beats: [
      { id: "b1", layerId: "before", primitive: "fadeIn",     at: 0.2, duration: 0.6 },
      { id: "b2", layerId: "after",  primitive: "slideInLeft",at: 1.4, duration: 0.7, args: { distance: 200 } }
    ]
  },
  {
    slug: "list-reveal",
    title: "List Reveal",
    industry: "social",
    duration: 6.0, fps: 30, width: 1080, height: 1350,
    accent: "#7DF9FF",
    layers: [
      { id: "headline", selector: ".headline", type: "text", content: "3 things" },
      { id: "row1", selector: ".row1", type: "text", content: "First" },
      { id: "row2", selector: ".row2", type: "text", content: "Second" },
      { id: "row3", selector: ".row3", type: "text", content: "Third" }
    ],
    beats: [
      { id: "b1", layerId: "headline", primitive: "fadeUp",     at: 0.2, duration: 0.5 },
      { id: "b2", layerId: "row1",     primitive: "slideInLeft", at: 1.0, duration: 0.5 },
      { id: "b3", layerId: "row2",     primitive: "slideInLeft", at: 1.5, duration: 0.5 },
      { id: "b4", layerId: "row3",     primitive: "slideInLeft", at: 2.0, duration: 0.5 }
    ]
  }
];

// ---------- file generators ----------

function readme(t) {
  return `# ${t.title}

| | |
|---|---|
| Industry | ${t.industry} |
| Duration | ${t.duration}s |
| Size | ${t.width}×${t.height} |
| Beats | ${t.beats.length} |
| Accent | \`${t.accent}\` |

**Best for:** ${bestFor(t.industry)}

## How to use

\`\`\`bash
node scripts/pick-template.mjs ${t.slug}
node projects/${t.slug}/render.mjs --preset vertical --dry-run
\`\`\`

## Recipe link

This template composes primitives from [motion-primitives](../../skills/primitives/SKILL.md). The state contract is in [motion-state](../../skills/state/SKILL.md).
`;
}

function bestFor(industry) {
  return ({
    product:   "Hero reveal on a product page or paid social.",
    logo:      "Brand identity intro / outro.",
    cinematic: "Open / close of a film, talk show, podcast intro.",
    data:      "Quarterly recap, KPI dashboard reel, investor update.",
    social:    "Instagram / TikTok quote or list post."
  })[industry] ?? "Generic motion.";
}

function thumbnail(t) {
  // 320×180 SVG with accent dot + title.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">
  <rect width="320" height="180" fill="#0B0B0F"/>
  <rect x="20" y="20" width="40" height="40" rx="10" fill="${t.accent}"/>
  <text x="20" y="100" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#fff">${escape(t.title)}</text>
  <text x="20" y="124" font-family="system-ui, sans-serif" font-size="12" fill="#888">${escape(t.industry)} · ${t.duration}s · ${t.width}×${t.height}</text>
  <text x="20" y="160" font-family="system-ui, sans-serif" font-size="11" fill="${t.accent}">${t.beats.length} beats</text>
</svg>
`;
}

function escape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function writeTemplate(t) {
  const dir = resolve(TEMPLATES_DIR, t.slug);
  await mkdir(dir, { recursive: true });
  const fullState = { schemaVersion: 1, ...t };
  await writeFile(resolve(dir, "state.json"), JSON.stringify(fullState, null, 2));
  await writeFile(resolve(dir, "README.md"), readme(t));

  await mkdir(THUMBS_DIR, { recursive: true });
  await writeFile(resolve(THUMBS_DIR, `${t.slug}.svg`), thumbnail(t));
}

async function main() {
  for (const t of TEMPLATES) {
    await writeTemplate(t);
    console.log(`OK  templates/${t.slug}`);
  }
  console.log(`\nGenerated ${TEMPLATES.length} templates.`);
}

main().catch(err => { console.error(err); process.exit(1); });