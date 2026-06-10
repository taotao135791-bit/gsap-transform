```text
   ██████╗ ███████╗ █████╗ ██████╗
  ██╔════╝ ██╔════╝██╔══██╗██╔══██╗
  ██║  ███╗███████╗███████║██████╔╝
  ██║   ██║╚════██║██╔══██║██╔═══╝
  ╚██████╔╝███████║██║  ██║██║
   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝

  Motion Design Skills
  ──●────●────●────●────●────●──
  不是文档搬运。是让 agent 做出来的东西，不像 AI 做的。
```

[中文版 README_CN.md →](./README_CN.md)

# GSAP Motion Design Skills

> 用一套规则让 AI agent 停止产出千篇一律的 `Inter` + 紫色渐变 + `back.out(1.7)` + 居中 hero。

Two layers: a **Design Layer** that teaches agents *taste* (brief inference, dials, recipes, anti-slop rules), and an **API Layer** that teaches agents *correct GSAP implementation*. The first layer fires before any code is written; the second fires when code is written.

---

## Why this exists

Every AI coding agent trained on the same SaaS templates. Ask for "an animated landing page" and you get:

- `Inter` for everything
- AI-purple gradients on a dark mesh
- centered hero with three equal cards below
- `back.out(1.7)` on every entrance
- parallax on every section, scrub on every block
- no `prefers-reduced-motion` branch

This is the slop pool. The GSAP API is powerful; the design direction given to the agent is not. **This skill set solves the direction problem.**

---

## The two-layer architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGN LAYER (load FIRST — before any code)                    │
│                                                                 │
│  motion-design-taste   → brief inference, 3 dials, motion mode  │
│  motion-recipes        → 8 clone-able aesthetic × motion combos │
│  motion-anti-slop      → 32 deterministic block/warn checks     │
│  motion-craft          → 9 commands (/init /shape /animate ...)  │
└─────────────────────────────────────────────────────────────────┘
                          ↓ routes to
┌─────────────────────────────────────────────────────────────────┐
│  API LAYER (load AFTER — when writing GSAP code)                │
│                                                                 │
│  gsap-core · gsap-timeline · gsap-scrolltrigger · gsap-plugins  │
│  gsap-utils · gsap-react · gsap-frameworks · gsap-performance   │
└─────────────────────────────────────────────────────────────────┘
```

The Design Layer reads the user's brief, outputs a one-line **Design Read**, sets three dials (`MOTION_INTENSITY`, `DESIGN_VARIANCE`, `VISUAL_DENSITY`), picks a motion mode (Restrained / Expressive / Cinematic), and routes the agent to the right API skills. It also runs 32+ anti-slop checks before shipping.

---

## Workflow (the 5-step path agents actually follow)

```
1. motion-design-taste    "Reading this as: agency landing, cinematic mode, 8/8/3."
2. motion-recipes         Clone the Editorial Kinetic skeleton.
3. gsap-* API skills      Load gsap-scrolltrigger + gsap-plugins (SplitText).
4. motion-anti-slop       Walk A→G. Fix every block failure.
5. motion-craft /audit    Structured report. → /polish → /adapt.
```

No step is optional. Skipping step 1 is how slop happens.

---

## Installing

### npx skills (recommended)

```bash
npx skills add https://github.com/greensock/gsap-skills
```

Works with Cursor, Claude Code, Codex, Windsurf, Copilot, Google Antigravity, and [40+ agents](https://github.com/vercel-labs/skills#supported-agents).

### Claude Code

```
/plugin marketplace add greensock/gsap-skills
```

### Cursor

**Settings → Rules → Add Rule → Remote Rule (Github)** → `greensock/gsap-skills`.

### Manual copy

| Agent | Skill Directory |
|-------|-----------------|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| OpenCode | `~/.config/opencode/skills/` |
| OpenAI Codex | `~/.codex/skills/` |
| Google Antigravity | `~/.gemini/antigravity/skills/` |
| Pi | `~/.pi/agent/skills/` |
| Qoder | `~/.qoder/skills/` |

---

## Skills index — from the user's problem, not the SKILL name

### "I need aesthetic direction before coding"

| Load | What it does |
|------|-------------|
| **motion-design-taste** | Brief inference → Design Read → 3 dials → motion mode → routes to API skills |
| **motion-recipes** | 8 ready-to-clone pairings: Editorial Kinetic / Brutalist Scroll / Liquid Glass Hover / Bento Flip / Minimal Fade / Cinematic Pinned Scrub / Kinetic Type Stagger / Grid Break Overlap |
| **motion-anti-slop** | 32+ deterministic anti-slop rules in 7 groups (A→G). Each has a detect signature, wrong snippet, fix snippet, and block/warn severity |
| **motion-craft** | 9 commands: `/init` `/shape` `/animate` `/polish` `/audit` `/critique` `/quieter` `/bolder` `/adapt` |

### "I need correct GSAP implementation"

| Load | Covers |
|------|--------|
| **gsap-core** | `to` / `from` / `fromTo` / `set`, easing, stagger, `matchMedia`, transform aliases, `autoAlpha` |
| **gsap-timeline** | sequencing, position parameter, labels, nesting |
| **gsap-scrolltrigger** | pin, scrub, batch, refresh, containerAnimation, scrollerProxy |
| **gsap-plugins** | SplitText, MorphSVG, DrawSVG, MotionPath, Flip, Draggable, Inertia, Observer, CustomEase, ScrambleText, Physics2D, and more |
| **gsap-utils** | clamp, mapRange, interpolate, distribute, snap, wrap, toArray, pipe |
| **gsap-react** | `useGSAP` hook, scope, contextSafe, SSR |
| **gsap-frameworks** | Vue, Nuxt, Svelte lifecycle + cleanup |
| **gsap-performance** | `quickTo`, transform-only, `will-change`, batch vs loop |

---

## What the Design Layer actually prevents (examples)

| Without this skill set | With it |
|---|---|
| `ease: "back.out(1.7)"` on every entrance | Reserved for one branded moment; default `expo.out` / `power3.out` per motion mode band |
| `Inter` + slate-900 everywhere | Design Read picks a font pool; `Inter` is only allowed when the brief says "Linear-style" |
| Purple gradient hero with glowing radial | Accent is inferred from the brief; palette alternatives enforced when default-reaching for beige+brass or AI-purple |
| No `prefers-reduced-motion` | Every project wrapped in `gsap.matchMedia()`; shipping without it is a Pre-Flight Failure |
| `parallax` on every section | Parallax earns one or two sections; the rest hold still (Anti-Slop C4) |
| Hover `y: -8` + `scale: 1.05` + heavier shadow | Pick one signal — lift OR scale OR shadow (Anti-Slop C3) |
| `cdn.jsdelivr.net/npm/gsap/<Plugin>.js` for browser ESM | `esm.sh` with default import for every plugin (Anti-Slop G3 + G4) |

---

## Structure

```
gsap-skills/
  README.md / README_CN.md
  AGENTS.md
  skills/
    # Design Layer
    motion-design-taste/  SKILL.md
    motion-recipes/       SKILL.md
    motion-anti-slop/     SKILL.md
    motion-craft/         SKILL.md
    # API Layer
    gsap-core/            SKILL.md
    gsap-timeline/        SKILL.md
    gsap-scrolltrigger/   SKILL.md
    gsap-plugins/         SKILL.md
    gsap-utils/           SKILL.md
    gsap-react/           SKILL.md
    gsap-performance/     SKILL.md
    gsap-frameworks/      SKILL.md
  examples/
    vanilla/ react/ vue/ nuxt/
    showcase/
      editorial-kinetic/
      brutalist-scroll/
      liquid-glass-hover/
```

---

## GSAP is free

> Every plugin — SplitText, MorphSVG, DrawSVG, Flip, Draggable, all of them — is **100% free** since Webflow's acquisition of GSAP. Install from the public `gsap` npm package. No `.npmrc`, no auth token, no Club membership.

---

## License

MIT
