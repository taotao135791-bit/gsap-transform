# Contributing to gsap-transform

This file is for contributors editing this skill repository. For how agents
should use the skills, see [AGENTS.md](./AGENTS.md).

GSAP Transform is a community, third-party, agent-oriented GSAP motion skill
system. Do not present it as an official GreenSock or Webflow project.

## Product Model

All docs, skills, and adapters should describe the same three-layer system:

1. **Design Layer** — brief reading, Design Read, dials, motion mode,
   anti-slop, video grammar.
2. **State Layer** — `state.json` as source of truth, reusable primitives, and
   templates as state skeletons.
3. **API Layer** — concrete GSAP APIs, plugins, framework lifecycle, and
   performance details.

Default agent workflow:

```text
Brief / product context
  -> Design Read
  -> motion dials
  -> state.json edits
  -> primitives
  -> generated scene
  -> preview/render
  -> anti-slop check
```

Generated `scene.js` / `scene.mjs` files are not the default source of truth.
Hand-written scenes can exist as an escape hatch, but do not document them as
the normal agent editing path.

## Repository Structure

- `skills/{name}/SKILL.md` — one skill per directory.
- `skills/llms.txt` — cross-skill index and loading order.
- `templates/{slug}/state.json` — reusable state skeletons.
- `skills/motion-primitives/` — reusable motion verbs.
- `skills/motion-state/` — state schema and runtime.
- `.github/instructions/{skill}.instructions.md` — GitHub Copilot adapters.
- `.cursor/rules/{skill}.mdc` — Cursor adapters.
- `.windsurf/rules/gsap.md` and `.windsurfrules` — Windsurf hard rules.

## SKILL.md Requirements

Frontmatter:

- `name` is required, lowercase, hyphenated, and must match the directory name.
- `description` is required and should explain when to use the skill.
- `license` is optional.

Body:

- Keep instructions focused on agent behavior.
- Put long references in `references/` or scripts and link to them.
- Keep product wording aligned with the three-layer model.

## Adding Or Editing Skills

When adding a new skill:

1. Create `skills/{name}/SKILL.md`.
2. Update `skills/llms.txt`.
3. Add `.cursor/rules/{skill}.mdc`.
4. Add `.github/instructions/{skill}.instructions.md`.
5. Update README files if the skill changes the public product surface.
6. Update Windsurf rules if the skill changes hard rules.
7. Run `npm run verify` and `npm test`.

When editing an existing skill, update the same adapters if the skill contract,
trigger surface, or hard rules changed.

## State And Template Rules

New templates must include a valid `state.json` with:

- `schemaVersion`
- `duration`
- `fps`
- `width`
- `height`
- `layers`
- `beats`
- primitive references that exist
- layer references that exist

Templates are reusable state skeletons, not just demos.

Do not make generated `scene.js` the source of truth for normal agent work.

## Primitive Rules

New primitives must have:

- a stable name
- clear params/default args
- registry export in `skills/motion-primitives/index.js`
- validator alignment in the State Layer where needed
- docs and adapter updates when the public contract changes
- tests

Do not rewrite primitives wholesale to satisfy a narrow test.

## Adapter Coverage

Every skill should have:

| Surface | File |
|---|---|
| Skill source | `skills/{name}/SKILL.md` |
| Cursor | `.cursor/rules/{skill}.mdc` |
| GitHub Copilot | `.github/instructions/{skill}.instructions.md` |

Windsurf has two files and they must stay synchronized:

- `.windsurf/rules/gsap.md`
- `.windsurfrules`

The consistency gate checks adapter coverage and Windsurf parity.

## Validation

Before opening a PR, run:

```bash
npm run verify
npm test
```

Do not lower verification or test standards to make a change pass.

`npm run verify` checks skill metadata, adapter coverage, Windsurf sync, GSAP
ESM import safety, primitive barrel coverage, and template presence.

`npm test` should cover behavior that this repository actually supports.

## Non-Goals For Contributions

- Do not make this look official.
- Do not expand the repo with large studio tooling unless that is the explicit
  task.
- Do not add generated scenes as the default editing surface.
- Do not claim tests, reports, or render features exist until they are present
  and verified.

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [skills CLI](https://github.com/vercel-labs/skills)
- [Cursor Rules MDC format](https://docs.cursor.com/context/rules)
- [GitHub Copilot custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
