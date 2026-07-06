# Contributing to gsap-transform

This file is for developers contributing to this skill repository (adding new SKILLs, editing existing ones). For guidance on **how AI agents should write GSAP code**, see [AGENTS.md](./AGENTS.md).

## Repo structure

- **skills/** — Each subdirectory is one skill. The CLI and agents discover skills by scanning `skills/` for directories that contain `SKILL.md`.
- **Skill directory name** must exactly match the `name` in that skill's frontmatter (e.g. `skills/gsap-core/` ↔ `name: gsap-core`).
- **Two layers**:
  - **Design Layer** (`motion-design-taste`, `motion-recipes`, `motion-anti-slop`, `motion-craft`) — aesthetic direction, motion language, anti-slop checks, command-style workflow.
  - **API Layer** (`gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-frameworks`, `gsap-performance`) — correct GSAP API usage, plugins, framework integration, performance.

## SKILL.md requirements

- **Frontmatter (YAML):**
  - `name` (required): lowercase, hyphens only, max 64 chars, must match parent directory name.
  - `description` (required): what the skill does and when to use it; include trigger terms so agents know when to apply it. Max 1024 chars.
  - `license` (optional): e.g. `MIT` if the skill is under the repo license.
- **Body:** Markdown instructions. Keep under ~600 lines; put long reference material in `references/` or `scripts/` and link from SKILL.md.

## Conventions

- Write descriptions in **third person** (e.g. "Use when…" not "You can use when…").
- Be concise; avoid restating general GSAP docs. Focus on correct API usage, pitfalls, and cleanup.
- When adding a new skill: create `skills/<skill-name>/SKILL.md`, then update:
  - `README.md` "Skills" table and `Structure` section
  - `README_CN.md` corresponding tables
  - `skills/llms.txt` index
  - Marketplace JSON files: `.claude-plugin/marketplace.json`, `.cursor-plugin/marketplace.json`
  - Per-agent path-triggered files (if applicable):
    - `.cursor/rules/<skill>.mdc` — Cursor project-level rule with `globs:` frontmatter
    - `.github/instructions/<skill>.instructions.md` — GitHub Copilot path-scoped instruction with `applyTo:` frontmatter

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

## Per-agent adapter files

When a new SKILL is added or an existing SKILL's API surface changes, update these adapter files in addition to `SKILL.md`:

| File | Purpose | Convention |
|---|---|---|
| `.cursor/rules/<skill>.mdc` | Cursor project-level rule, auto-attached when files matching `globs` are open | Frontmatter: `description`, `globs`, optional `alwaysApply`. Body: short summary + link to `skills/<skill>/SKILL.md` |
| `.github/instructions/<skill>.instructions.md` | GitHub Copilot path-scoped instruction | Frontmatter: `applyTo` (glob array). Body: 6-12 short bullet rules |
| `.claude-plugin/marketplace.json` | Claude Code marketplace listing | Update `description` if the skill scope changes |
| `.cursor-plugin/marketplace.json` | Cursor remote-rule marketplace listing | Update `description` if the skill scope changes |
| `.windsurf/rules/gsap.md` | Windsurf rule (current format) | Append a short rule for the new skill if it changes hard rules |
| `.windsurfrules` | Windsurf single-file rule (legacy fallback) | Keep the rule body identical to `.windsurf/rules/gsap.md` — CI compares them |

After editing any adapter, run the consistency gate locally before opening a PR:

```bash
node scripts/verify-consistency.mjs
```

It enforces: a single pinned gsap version across all files, Anti-Slop G4 compliance in `examples/`, an identical motion-craft command list everywhere, valid SKILL.md frontmatter, real (non-symlink) `CLAUDE.md` / `GEMINI.md` pointer files, full per-skill adapter coverage, and Windsurf legacy/current parity. The same script runs in CI (`.github/workflows/verify-consistency.yml`) on every push and PR.

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [skills CLI (discovery, install)](https://github.com/vercel-labs/skills)
- [Cursor Rules MDC format](https://docs.cursor.com/context/rules)
- [GitHub Copilot custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
