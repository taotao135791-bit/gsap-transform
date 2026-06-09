# Guidance for AI Agents Working in This Repo

This repository contains **GSAP (GreenSock Animation Platform) skills** for AI coding agents, organised as a **two-layer system**:

- **Design Layer** (`skills/motion-design-taste`, `skills/motion-recipes`, `skills/motion-anti-slop`, `skills/motion-craft`) — aesthetic direction, motion language, anti-slop checks, command-style workflow.
- **API Layer** (`skills/gsap-core`, `skills/gsap-timeline`, `skills/gsap-scrolltrigger`, `skills/gsap-plugins`, `skills/gsap-utils`, `skills/gsap-react`, `skills/gsap-frameworks`, `skills/gsap-performance`) — correct GSAP API usage, plugins, framework integration, performance.

When editing or adding skills, follow these rules.

## Repo structure

- **skills/** — Each subdirectory is one skill. The CLI and agents discover skills by scanning `skills/` for directories that contain `SKILL.md`.
- **Skill directory name** must exactly match the `name` in that skill’s frontmatter (e.g. `skills/gsap-core/` ↔ `name: gsap-core`).

## SKILL.md requirements

- **Frontmatter (YAML):**
  - `name` (required): lowercase, hyphens only, max 64 chars, must match parent directory name.
  - `description` (required): what the skill does and when to use it; include trigger terms so agents know when to apply it. Max 1024 chars.
  - `license` (optional): e.g. `MIT` if the skill is under the repo license.
- **Body:** Markdown instructions. Keep under ~600 lines; put long reference material in `references/` or `scripts/` and link from SKILL.md.

## Conventions

- Write descriptions in **third person** (e.g. "Use when…" not "You can use when…").
- Be concise; avoid restating general GSAP docs. Focus on correct API usage, pitfalls, and cleanup.
- When adding a new skill: create `skills/<skill-name>/SKILL.md`, then update README.md "Skills" table, the `Structure` section, `skills/llms.txt`, and the marketplace JSON files under `.claude-plugin/` and `.cursor-plugin/` if needed.

## Cross-layer linking

- Every API-layer SKILL.md must end its `description` with a "Pair with motion-design-taste…" sentence so agents always reach for the design layer first. Two acceptable forms; pick one per skill and stay consistent inside that description:
  - **Compact:** `Pair with motion-design-taste for aesthetic direction before implementing.`
  - **Detailed (current convention for gsap-core):** `Pair with motion-design-taste, motion-recipes, motion-anti-slop, motion-craft for aesthetic direction.`
- Every API-layer SKILL.md must extend its `Related skills` line with: `For aesthetic direction, recipes, and anti-slop checks use the design-layer skills: motion-design-taste, motion-recipes, motion-anti-slop, motion-craft.`
- Design-layer SKILLs route to API-layer SKILLs through a decision table (see `motion-design-taste` Section 9). Do **not** restate API rules in the design layer.
- Design-layer SKILLs reference each other by relative path (`../motion-design-taste/SKILL.md`).

## When to write which layer

- Adding a **new GSAP API surface** (new plugin, new framework integration, new performance technique) → write or extend an **API-layer** SKILL. Keep it API-focused; do not include aesthetic recommendations.
- Adding a **new aesthetic direction**, **new motion language**, **new anti-slop rule**, or **new workflow command** → write or extend a **Design-layer** SKILL. Reference API skills for implementation depth instead of duplicating.
- A new **recipe** (aesthetic × motion combo with a code skeleton) belongs in `skills/motion-recipes/SKILL.md`, not as a new directory.

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [skills CLI (discovery, install)](https://github.com/vercel-labs/skills)
