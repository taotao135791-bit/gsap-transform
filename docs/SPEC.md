# SPEC — K2.6 Promo Reconstruction (v2)

> **Goal of this revision:** the previous deliverable (56.2s rendered mp4) was a **surface clone** — it got the dark-canvas-and-serif aesthetic right but missed every **silky technique** that makes the K2.5 source reel feel professional. This revision rebuilds 12 shots as **browser-first standalone HTMLs** using the 8 missing techniques.

---

## 1. The 8 techniques we missed (and now must ship)

Read against the K2.5 source keyframes:

| # | Technique | Source location | What we shipped before | What this revision does |
|---|---|---|---|---|
| T1 | `perspective` + `rotateY/rotateX` 3D tilt | K01 (cards), K03 (browser chrome), K05 (pill), K08 (cards) | none — flat layout | every container gets `perspective: 1200–1800px`, cards `rotateY ±10–22deg` |
| T2 | `backdrop-filter: blur() saturate()` glass | K01 (cards), K03 (chrome), K07 (chat) | solid backgrounds | glass cards `backdrop-filter: blur(20px) saturate(180%)` |
| T3 | `letter-spacing` tightening | K02 (manifesto), K08 (CTA), K11 (verdict) | none — static spacing | text fades in with `letterSpacing: 0.4em → -0.02em` |
| T4 | `box-shadow` long shadows for lift | K01, K03, K05, K07, K08 | none — flat | `0 60px 120px rgba(0,0,0,0.5)` + accent glow |
| T5 | `clip-path: inset()` chart draw-in | K07 (charts) | static SVG | charts `clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)` (wipe up) |
| T6 | Multi-layer `radial-gradient` bokeh drift | K02, K11 | none — flat bg | 3 drifting orbs with continuous sine loop |
| T7 | Real 3D mascot ball (with highlight) | K01, K05, K08, K12 | none — flat circle | multi-layer gradient sphere with inset highlight + box-shadow glow |
| T8 | Real UI surfaces (chat, agent cards, checklist, pill) | K05, K06, K07, K08 | mostly placeholder text | real DOM structures with names + status + progress bars |

---

## 2. Architecture (binding)

### 2.1 Browser-first, no build step

- **Each shot is one standalone `.html`** in `test kimi/v2/shots/`.
- Open it directly in Chrome (`file://` works — no HTTP server needed; esm.sh handles CORS for the GSAP import).
- GSAP comes from `https://esm.sh/gsap@3.15.0` (default-import).
- Google Fonts (Fraunces + Inter + JetBrains Mono) is the only external asset.
- **Zero bundling, zero npm install, zero state.json pipeline.** The point is *see it now*.

### 2.2 Master `index.html`

- `test kimi/v2/shots/index.html` — gallery of 12 shots, each with title, technique tags, link.
- Open this in browser to scan all 12; click into any shot.

### 2.3 No video render

- v1 = browser playback. No mp4, no ffmpeg, no puppeteer-driven concat.
- (v3 of the master promo will keep the mp4 path in `test kimi/K2.6-Promo-v1.mp4`; this v2 is HTML-only.)

---

## 3. File map (binding)

```
test kimi/v2/
├── shots/
│   ├── index.html                     # gallery
│   ├── 01-three-cards.html            # T1 T2 T4 T7
│   ├── 02-manifesto.html              # T3 T6
│   ├── 03-kimi-universe.html          # T1 T2 T4
│   ├── 04-scale-out.html              # T1 T4 (glow)
│   ├── 05-subagent.html               # T1 T2 T7
│   ├── 06-256k-parallax.html          # T3 + parallax
│   ├── 07-chat-swarm.html             # T4 T8 (real chat UI)
│   ├── 08-three-agents.html           # T1 T4 T8 (real checklist)
│   ├── 09-charts.html                 # T5 (real SVG charts)
│   ├── 10-multimodal.html             # T1 T4 (tilted video frame)
│   ├── 11-verdict.html                # T3 (letter-spacing + shake)
│   └── 12-cta.html                    # T3 T7 (earth + glow)
└── previews/                          # puppeteer captures, used for QA
    ├── 01-three-cards_t{0,1,2,3}.png
    └── ...
```

---

## 4. Style guide (binding for every shot)

### 4.1 Palette

| Token | Hex | Usage |
|---|---|---|
| BG | `#0B0B12` | stage background, body |
| FG | `#FFFFFF` | primary text |
| FG-DIM | `rgba(255,255,255,0.55)` | subtitles, captions |
| ACCENT | `#4A9EFF` | cyan-blue, links, eyebrows, primary highlight |
| RED | `#FF3D5A` | K2.5 source accent — used **once**, in shot 11 (verdict gradient) |
| GREEN | `#4ADE80` | success / done states (checklist) |
| MASCOT-BLUE | `radial-gradient(#4A9EFF, #1a4a8a)` | 3D mascot ball |
| MASCOT-HIGHLIGHT | `rgba(255,255,255,0.85)` | specular dot on mascot |

Single-accent lock: ACCENT for everything bright except:
- Shot 11 verdict = gradient text (RED→WHITE) — only place RED is used.
- Shot 08 cards: left = blue, middle = white-border, right = green-border (signals workflow state).

### 4.2 Type

| Family | Weight | Use |
|---|---|---|
| Fraunces (serif) | 500/600 | hero text, shot titles, "manifesto" big type, "256K", "kimi.com" |
| Inter | 400/500/600/700 | UI chrome, prompts, agent card titles, list items |
| JetBrains Mono | 400/500 | eyebrows (uppercase 0.2em letter-spaced), timestamps, file paths, code snippets |
| Inter 800 | 800 | SCALE / OUT block letterforms |

No font fallback to system-ui. All three families loaded via Google Fonts in every shot.

### 4.3 Motion vocabulary (binding)

| Beat | Easing | Default duration |
|---|---|---|
| Entrance | `expo.out` | 0.9–1.6s |
| Card / 3D tilt unwind | `expo.out` | 1.4s |
| Continuous float | `sine.inOut` | 2.4–4s, yoyo, repeat -1 |
| Hover / interactive | (out of scope for v2 — pure entrance + idle) |
| **Forbidden** | `back.out`, `elastic`, `bounce` (Anti-Slop B1–B3) |
| **Forbidden** | `back.out(1.7)` as default — used at most once per shot if at all |

### 4.4 Composition

- Stage is always `100vw × 100vh`; CSS `position: absolute` for every animated element.
- Negative space is **intentional** — at least 40% of the stage is empty per frame.
- Every shot has exactly **one hero** (the biggest / most-moving element) + 1–2 supporting elements.

---

## 5. Per-shot acceptance criteria

Each shot must:

1. Load in Chrome with **zero console errors** (open DevTools, check Console).
2. Animate on **page load** (no manual trigger) — `gsap.timeline()` autoplays.
3. Use **at least 2** of the 8 techniques (T1–T8).
4. Have a **single hero** that ends up centered or near-centered when the timeline completes.
5. Honor `@media (prefers-reduced-motion: reduce)` — timeline should skip to end state. (Not required in v2 but flagged in §8.)
6. Show the master index link (`<a href="index.html">← all shots</a>`) bottom-right.

---

## 6. Verification gates

### 6.1 Manual browser smoke-test (every commit)

```bash
# Each shot's HTML loads without console errors.
open test/kimi/v2/shots/01-three-cards.html
# Watch: cards fly in with rotateY unwind, mascot glows, hero text letter-spaces tight.
# After 3 seconds: idle — gentle float, no abrupt motion.
```

### 6.2 Puppeteer capture (already wired)

`scripts/screenshot-shots.mjs` captures 4 frames per shot at t=0.2s / 1.0s / 2.5s / 4.5s. Output: `test kimi/v2/previews/<slug>_t{0,1,2,3}.png`.

```bash
cd projects/kimi-k26 && node ../../scripts/screenshot-shots.mjs
# 48 PNGs total (12 shots × 4 timestamps)
```

### 6.3 Visual diff gate

After capture, every shot must have at least one PNG where **none of the 8 hero elements are at zero opacity** — i.e. the animation has reached its main composition. That means **t2 (2.5s) and t3 (4.5s) screenshots must show the hero element fully rendered.** Used for visual QA on this delivery.

---

## 7. Anti-slop rules (binding)

These come from `skills/motion-anti-slop` but are repeated here for shot authors:

| Rule | Severity | Apply as |
|---|---|---|
| Anti-Slop B1 | block | Never use `back.out(1.7)` as default ease |
| Anti-Slop B2 | block | Never use `elastic.*` anywhere |
| Anti-Slop B3 | block | Never use `bounce.*` anywhere |
| Anti-Slop C1 | block | Never use `Inter` for hero text — always Fraunces |
| Anti-Slop C3 | block | Hover stack forbidden (not relevant in v2 — no hover) |
| Anti-Slop F6 | block | Single-accent lock — ACCENT `#4A9EFF` everywhere bright, RED only in shot 11 |
| New S-rule: code snippet length | warn | Each shot's `<script>` block < 80 lines |

---

## 8. Out of scope (v2)

| Feature | Status | Why |
|---|---|---|
| Audio / BPM sync | gated no-op | user has no key (per dev brief) |
| Real mp4 render | not in v2 | browser-first delivery; v1 mp4 still ships at `test kimi/K2.6-Promo-v1.mp4` |
| Scroll-driven scenes | not in v2 | all scenes are time-driven entrance + idle |
| Pointer-driven scenes | not in v2 | pointer-driven (Liquid Glass) is a future shot |
| `prefers-reduced-motion` branch | not in v2 | would require branch on every timeline; document for v3 |
| Interactive tweens | not in v2 | pure entrance + idle loop |

---

## 9. Acceptance sign-off checklist

- [ ] 12 standalone HTMLs in `test kimi/v2/shots/`
- [ ] 1 gallery `index.html`
- [ ] Each shot uses ≥ 2 of T1–T8 techniques
- [ ] Each shot loads in Chrome with zero console errors
- [ ] Each shot has a single hero at t=2.5s+
- [ ] No `back.out(1.7)` / `elastic` / `bounce` used as default
- [ ] Inter used only for UI chrome, Fraunces for hero text
- [ ] RED used only in shot 11
- [ ] Puppeteer capture produces 48 PNGs

---

## 10. Where this fits in the larger system

| Layer | What | Where |
|---|---|---|
| Design Layer | anti-slop rules, recipes | `skills/motion-anti-slop/`, `skills/motion-recipes/` |
| State Layer | state.json + runtime | `skills/motion-state/` (this revision does NOT use — by design; v2 is browser-first) |
| API Layer | GSAP API correctness | `skills/gsap-*` |
| **Delivery Layer (v2)** | **self-contained HTML per shot** | **`test kimi/v2/shots/`** |

The v2 deliverables are **explicitly NOT** consumed by `state-to-scene.mjs` or `motion-studio`. They live alongside the v1 mp4 path. v3 will hook them back into the state-driven pipeline if the user wants.