---
applyTo: "**/*"
---

# motion-craft — command workflow instructions

When the user invokes a slash command in the `/motion-craft <subcommand>` family, follow that command's exact Sequence and Output contract from `skills/motion-craft/SKILL.md`. State the affected scope before working ("Working on the hero section only" / "Working across all sections").

| Command | Trigger phrases | Output |
|---|---|---|
| `/motion-craft init` | "set up motion for this project" | `MOTION.md` brief at project root + Design Read |
| `/motion-craft shape` | "plan motion before coding", "storyboard this" | beat list + selected recipe + dial values |
| `/motion-craft animate` | "implement the animations" | GSAP code conforming to recipe and motion mode |
| `/motion-craft polish` | "polish this", "final pass" | tightened durations / eases / staggers + reduced-motion branch |
| `/motion-craft audit` | "audit", "lint", "remove the slop" | structured report from motion-anti-slop |
| `/motion-craft critique` | "design review" | qualitative review (does motion serve content?) |
| `/motion-craft quieter` | "tone this down" | one-step reduction along Restrained → Expressive → Cinematic |
| `/motion-craft bolder` | "amplify", "boring" | one-step amplification with discipline |
| `/motion-craft adapt` | "make it accessible", "responsive" | `gsap.matchMedia` + breakpoint-aware motion |
| `/motion-craft export` | "export as transparent video", "render to webm" | `capture.js` (Puppeteer) + FFmpeg commands |

**Universal conventions** (see `skills/motion-craft/SKILL.md`):
- Every command begins by reading project state: existing GSAP imports, tween count, ScrollTrigger count, presence of `gsap.matchMedia`.
- Every command ending in code MUST run an internal pass against `motion-anti-slop` block-severity rules before returning.
- Never ask multi-question dumps; if a clarifier is needed, exactly ONE question.

Composable: `init` → `shape` → `animate` → `polish` → `audit`.
