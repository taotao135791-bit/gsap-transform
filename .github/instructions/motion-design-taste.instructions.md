---
applyTo: "**/*.{html,jsx,tsx,vue,svelte,astro,md,mdx}"
---

# motion-design-taste — path-specific instructions

When the user asks for an animated landing page, portfolio, hero, scroll-driven story, or any animated frontend, **before** writing GSAP code:

1. **Output a one-line Design Read.** Format:
   > "Reading this as: \<page kind\> for \<audience\>, with a \<vibe\> language, leaning toward \<aesthetic family\> and \<motion language\>."

2. **Set three dials** (1–10):
   - `MOTION_INTENSITY` — 1 = near-static, 10 = cinematic / pinned scrub / kinetic type
   - `DESIGN_VARIANCE` — 1 = symmetric / centered, 10 = asymmetric / overlapping
   - `VISUAL_DENSITY` — 1 = museum-grade whitespace, 10 = cockpit information

3. **Pick one motion mode** based on the dials:
   - **Restrained** — autoAlpha fades, short stagger, no scrub. Default for B2B SaaS, public-sector, accessibility-first audiences.
   - **Expressive** — selective parallax, SplitText reveal on hero, one branded character moment.
   - **Cinematic** — pinned scrub, multi-layer parallax, kinetic typography, scroll-driven story.

4. **Avoid these LLM defaults** unless the brief explicitly asks for them:
   - `Inter` for everything — pick from the aesthetic family's font pool
   - AI-purple gradients on dark mesh
   - Centered hero with H1 over a glowing radial blur
   - `back.out(1.7)` / `elastic.*` / `bounce.*` as default ease (only ONE branded character moment per page)
   - Parallax on every section (earn one or two; the rest hold still)
   - Hover stack of `y:-8 + scale:1.05 + heavier shadow` (pick ONE signal)

5. **Route to the right API skill** using the decision table in `skills/motion-design-taste/SKILL.md` Section 9 — based on what plugins / framework / scroll behavior the brief implies.
