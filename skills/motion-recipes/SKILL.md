---
name: motion-recipes
description: A library of aesthetic-times-motion recipes for GSAP. Use when the user asks for a specific look (editorial, brutalist, liquid glass, bento, minimal, cinematic, kinetic typography, grid-break) or when the agent has done the brief inference and now needs a concrete starting pattern. Each recipe is a self-contained pairing of a visual direction (typography, color, layout) with a motion language (durations, eases, staggers, scroll behavior) and a minimal GSAP code skeleton that can be cloned and adapted. Pair with motion-design-taste for the upstream Design Read and motion-anti-slop for the downstream audit.
license: MIT
---

# Motion Recipes

Eight ready-to-clone pairings of an aesthetic direction with a motion language. Pick one after the Design Read in [motion-design-taste](../motion-design-taste/SKILL.md), adapt the skeleton to the brief, then run [motion-anti-slop](../motion-anti-slop/SKILL.md) before shipping.

## When to Use This Skill

Apply after the Design Read in [motion-design-taste](../motion-design-taste/SKILL.md) when the brief lands close to one of the eight recipes below, or when the user names a recipe by keyword ("brutalist", "editorial kinetic", "liquid glass", "bento"). Each recipe is a closed system — pick one, do not mix two recipes in the same project.

**Related skills:** [motion-design-taste](../motion-design-taste/SKILL.md) for dials and rules; [motion-anti-slop](../motion-anti-slop/SKILL.md) for the deterministic check; [gsap-core](../gsap-core/SKILL.md), [gsap-timeline](../gsap-timeline/SKILL.md), [gsap-scrolltrigger](../gsap-scrolltrigger/SKILL.md), [gsap-plugins](../gsap-plugins/SKILL.md), [gsap-performance](../gsap-performance/SKILL.md) for API depth.

## How Each Recipe Is Organised

- **Best for** — brief signals that should pull this recipe.
- **Dials** — the three dials from [motion-design-taste](../motion-design-taste/SKILL.md) (`MOTION_INTENSITY` / `DESIGN_VARIANCE` / `VISUAL_DENSITY`).
- **Type & color** — typography pool and palette starting point.
- **Layout** — distinguishing structural moves.
- **Motion language** — duration band, ease family, stagger range, scroll behavior.
- **Skeleton** — a minimal GSAP code starting point, ready to clone.
- **Plugins** — which GSAP plugins are required.
- **Do not** — recipe-specific traps.

## Skeleton Conventions (read before cloning)

- **All skeletons assume the entire GSAP setup is wrapped in `gsap.matchMedia()`** with `(prefers-reduced-motion: reduce)` handled. The skeletons omit the wrapper for brevity; do **not** ship without it. See [motion-design-taste](../motion-design-taste/SKILL.md) Section 7 and [motion-anti-slop](../motion-anti-slop/SKILL.md) D1.
- **All skeletons use bundler-style imports** (`import { gsap } from "gsap"`). For static HTML demos with no bundler, swap to `https://esm.sh/gsap@<version>` per [gsap-plugins](../gsap-plugins/SKILL.md) "Browser-native ESM CDN".
- **No `back.*` / `elastic.*` defaults** appear in any skeleton; do not add them when adapting.
- **Cleanup** is the caller's responsibility — use `useGSAP` ([gsap-react](../gsap-react/SKILL.md)) or `gsap.context()` + `ctx.revert()` ([gsap-frameworks](../gsap-frameworks/SKILL.md)) when the recipe is dropped into a component.

## Recipe 1 — Editorial Kinetic

- **Best for:** premium consumer brand, agency landing, fashion / arts editorial, manifesto launch with a single hero quote that needs weight.
- **Dials:** `MOTION_INTENSITY: 7` / `DESIGN_VARIANCE: 7` / `VISUAL_DENSITY: 3`.
- **Type & color:** display sans (PP Neue Montreal, Söhne Breit, GT Walsheim Display) for headline; body in a refined neutral sans (Inter Display, ABC Diatype). Single accent against bone or off-black. No mixed-family emphasis.
- **Layout:** asymmetric grid, oversized headline (8-10 vw), tight tracking, body copy capped at `max-w-[60ch]`, generous whitespace. Headline can break across multiple lines with deliberate line-by-line reveal.
- **Motion language:** Expressive — duration 0.7-1.0 s, ease `expo.out` / `power3.out`, stagger 0.05-0.08 s. Mask-based line reveal on hero; subtle parallax on a single supporting image. No bouncing, no scrub on every section.
- **Plugins:** [SplitText](../gsap-plugins/SKILL.md), ScrollTrigger.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

const split = SplitText.create(".hero-headline", {
  type: "lines, words",
  mask: "lines",
  linesClass: "line"
});

gsap.timeline({ defaults: { ease: "expo.out" } })
  .from(".eyebrow", { autoAlpha: 0, y: 12, duration: 0.5 })
  .from(split.lines, { yPercent: 110, stagger: 0.08, duration: 0.9 }, "<0.1")
  .from(".hero-meta", { autoAlpha: 0, y: 8, duration: 0.5 }, "<0.4");
```

- **Do not:** stack a serif word inside a sans headline for emphasis; use `back.out` on the line reveal; add a glowing radial gradient behind the hero.

## Recipe 2 — Brutalist Scroll

- **Best for:** design studio portfolio, indie launch, manifesto, "anti-template" agency site.
- **Dials:** `MOTION_INTENSITY: 8` / `DESIGN_VARIANCE: 9` / `VISUAL_DENSITY: 4`.
- **Type & color:** mono + grotesque (JetBrains Mono + Söhne Breit, Geist Mono + Cabinet Grotesk). High contrast — true off-black on bone, OR neon yellow on ink. One saturated accent. Sharp corners, no border-radius.
- **Layout:** raw borders, exposed grid lines, oversized typography, intentional misalignment, big numbered section markers, clip-path edges. Sections sit on top of each other with hard break lines.
- **Motion language:** Cinematic — pinned scenes that snap, hard `power4.out` reveals, no easing on scrub, occasional `Flip` for layout state changes. Section transitions land hard, not soft.
- **Plugins:** ScrollTrigger, [Flip](../gsap-plugins/SKILL.md), optionally Observer.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(ScrollTrigger, Flip);

gsap.timeline({
  scrollTrigger: { trigger: ".scene", start: "top top", end: "+=1500", pin: true, scrub: 0.6 }
})
  .to(".panel-bg", { yPercent: -40, ease: "none" })
  .from(".big-number", { yPercent: 100, ease: "none" }, "<")
  .from(".scene-title", { xPercent: -10, autoAlpha: 0, ease: "none" }, "<0.2");

// layout state change between two grids:
const state = Flip.getState(".tile");
document.querySelector(".grid").classList.toggle("dense");
Flip.from(state, { duration: 0.6, ease: "power4.inOut", absolute: true });
```

- **Do not:** soften corners (radius > 0 breaks the look); add drop shadows; use any `back.*` or `elastic.*` ease; add a marquee that loops the same word.

## Recipe 3 — Liquid Glass Hover

- **Best for:** premium consumer hardware, dark-tech SaaS, AI / ML product page, cards that need to feel touch-responsive.
- **Dials:** `MOTION_INTENSITY: 7` / `DESIGN_VARIANCE: 6` / `VISUAL_DENSITY: 4`.
- **Type & color:** clean sans display (Geist, Söhne) on a near-black canvas tinted toward navy or graphite. Single saturated accent for one CTA. Glass surfaces use layered borders + backdrop-filter, never plain `rgba(255,255,255,0.1)`.
- **Layout:** card grid where each card is a glass surface; pointer-driven highlight ring follows cursor; magnetic CTA buttons. Backdrop layer with subtle blurred photography.
- **Motion language:** Expressive — magnetic cursor via `quickTo`, single-property hover (`y: -2` only), 200-300 ms restoration. Glass highlight tracks cursor inside the card.
- **Plugins:** [Inertia](../gsap-plugins/SKILL.md) optional for throw-style buttons, ScrollTrigger for entrance.
- **Skeleton:**

```javascript
import { gsap } from "gsap";

document.querySelectorAll(".magnetic-cta").forEach((btn) => {
  const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
  const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
  const rect = () => btn.getBoundingClientRect();

  btn.addEventListener("mousemove", (e) => {
    const r = rect();
    xTo((e.clientX - r.left - r.width / 2) * 0.25);
    yTo((e.clientY - r.top - r.height / 2) * 0.25);
  });
  btn.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
});

// glass card highlight
document.querySelectorAll(".glass-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});
```

- **Do not:** combine `y: -8` + `scale: 1.05` + heavier shadow on hover (Anti-Slop C3); animate `width` / `height` for the glass surface; loop a background gradient forever.

## Recipe 4 — Bento Flip

- **Best for:** product feature showcase, dashboard preview, AI tool capabilities grid.
- **Dials:** `MOTION_INTENSITY: 6` / `DESIGN_VARIANCE: 7` / `VISUAL_DENSITY: 5`.
- **Type & color:** clean sans (Geist, Inter Display) for body; large numerical or label type for tile titles. One accent across all tiles, neutrals fill backgrounds. Tile colors vary tint but stay within the same palette.
- **Layout:** asymmetric tile grid (CSS Grid `grid-template-areas` with mixed cell sizes), no card-inside-card. Tile corner-radius locked to one value. Bento has rhythm: at least 3 tile sizes.
- **Motion language:** Expressive — entrance via `ScrollTrigger.batch` with stagger from "edges" or "random"; click on a tile triggers `Flip` to expand to a detail view.
- **Plugins:** ScrollTrigger, [Flip](../gsap-plugins/SKILL.md).
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(ScrollTrigger, Flip);

ScrollTrigger.batch(".tile", {
  start: "top 85%",
  onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 24, stagger: { each: 0.06, from: "edges" }, duration: 0.55, ease: "power3.out" })
});

function expandTile(tile) {
  const state = Flip.getState(".tile, .tile-detail");
  tile.classList.add("is-expanded");
  Flip.from(state, { duration: 0.6, ease: "power3.inOut", absolute: true, nested: true });
}
```

- **Do not:** make every tile the same size (Bento needs rhythm — see [motion-design-taste](../motion-design-taste/SKILL.md) Section 5); leave a blank tile to "fill" a grid cell; mix two corner-radius scales across tiles.

## Recipe 5 — Minimal Fade

- **Best for:** B2B SaaS landing (Linear-style), public-sector service, accessibility-critical site, content-heavy editorial.
- **Dials:** `MOTION_INTENSITY: 3` / `DESIGN_VARIANCE: 5` / `VISUAL_DENSITY: 3`.
- **Type & color:** Geist or Inter (Inter is fine here — see override in [motion-design-taste](../motion-design-taste/SKILL.md) Section 3). Cool neutral palette, one restrained accent (electric blue, emerald). White or zinc-50 canvas.
- **Layout:** centered or left-aligned, generous gutters, max one accent per section, no parallax, no scrub. Hierarchy from typography weight, not color.
- **Motion language:** Restrained — duration 0.3-0.5 s, ease `power2.out`, stagger 0.04 s. Entrance reveals only; no perpetual motion.
- **Plugins:** ScrollTrigger only.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    autoAlpha: 0,
    y: 8,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reset" }
  });
});
```

- **Do not:** add scrub anywhere; pin sections; use `back.*` or `elastic.*`; default to `Fraunces` because the brief sounds creative.

## Recipe 6 — Cinematic Pinned Scrub

- **Best for:** product origin story, hero feature scene, flagship landing page that earns one long pinned moment.
- **Dials:** `MOTION_INTENSITY: 9` / `DESIGN_VARIANCE: 8` / `VISUAL_DENSITY: 3`.
- **Type & color:** display sans with character (Migra Sans, GT Walsheim Display, PP Neue Montreal). Cinematic palette — deep neutral background, one warm or cool accent for highlight moments. Real photography or generated imagery in layers.
- **Layout:** one full-viewport pinned scene with 3-5 narrative beats. Layered backgrounds, foreground figure, on-top text. Each beat reveals or transforms a single primary element.
- **Motion language:** Cinematic — `ease: "none"` on scrub, beat-to-beat transitions inside the timeline, multi-layer parallax. Long pinned distance (`+=2000` to `+=4000`) only when the narrative justifies it.
- **Plugins:** ScrollTrigger; optionally [SplitText](../gsap-plugins/SKILL.md) for beat headlines, [MorphSVG](../gsap-plugins/SKILL.md) for symbolic shape transitions.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scene",
    start: "top top",
    end: "+=2400",
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true
  },
  defaults: { ease: "none" }
});

tl.to(".bg-far", { yPercent: -25 }, 0)
  .to(".bg-near", { yPercent: -10 }, 0)
  .from(".beat-1", { autoAlpha: 0, y: 30 }, 0.05)
  .to(".beat-1", { autoAlpha: 0 }, 0.25)
  .from(".beat-2", { autoAlpha: 0, y: 30 }, 0.30)
  .to(".beat-2", { autoAlpha: 0 }, 0.55)
  .from(".beat-3", { autoAlpha: 0, y: 30 }, 0.60);
```

- **Do not:** use any ease other than `none` on the scrubbed timeline (Anti-Slop B4); pin a section that includes the primary CTA; pin more than one scene per page.

## Recipe 7 — Kinetic Type Stagger

- **Best for:** typographic brand, design conference site, motion-led portfolio, hero-only landing.
- **Dials:** `MOTION_INTENSITY: 8` / `DESIGN_VARIANCE: 8` / `VISUAL_DENSITY: 2`.
- **Type & color:** display type that has drama (Migra, Söhne Breit Kursiv, GT Sectra, Reckless Neue if a serif is genuinely justified). Two-color palette — bone + ink, or ink + accent. Type fills the canvas.
- **Layout:** headline as the hero, sometimes the only content above the fold. Word- or character-level animation on entrance and on scroll re-entry.
- **Motion language:** Cinematic — character or word stagger 0.03-0.05 s, `ease: expo.out`, mask reveal. Re-trigger on `toggleActions: "play none none reset"` so leaving and re-entering plays again.
- **Plugins:** [SplitText](../gsap-plugins/SKILL.md), ScrollTrigger.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

document.fonts.ready.then(() => {
  document.querySelectorAll(".kinetic").forEach((el) => {
    SplitText.create(el, {
      type: "words, chars",
      mask: "words",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.chars, {
          yPercent: 110,
          rotation: 4,
          stagger: 0.025,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reset" }
        });
      }
    });
  });
});
```

- **Do not:** split chars-only without `smartWrap: true` (causes mid-word line breaks); rotate every char (visual noise); use `back.*` ease on character reveal.

## Recipe 8 — Grid Break Overlap

- **Best for:** creative agency, fashion editorial, art gallery, photography portfolio.
- **Dials:** `MOTION_INTENSITY: 7` / `DESIGN_VARIANCE: 10` / `VISUAL_DENSITY: 4`.
- **Type & color:** display sans + a single typographic element that breaks the grid (extra-large numbered marker, oversized italic word, vertical text block). Editorial palette — paper neutral, one rich accent.
- **Layout:** asymmetric CSS Grid with intentional overlap (`grid-row: span 2; z-index: 2; transform: translate(-15%, 10%)`). Images and headlines occupy crossed cells. White space is a structural element.
- **Motion language:** Expressive — entrance via per-element `from: "edges"` stagger; on-scroll, overlapping elements drift on independent y-rates (mild parallax 0.85x and 1.05x). One large element per section uses `xPercent` slide.
- **Plugins:** ScrollTrigger.
- **Skeleton:**

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".overlap-section").forEach((section) => {
  const layers = gsap.utils.toArray(".layer", section);
  layers.forEach((layer, i) => {
    gsap.to(layer, {
      yPercent: i % 2 === 0 ? -8 : 4,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 }
    });
  });

  gsap.from(section.querySelectorAll(".reveal"), {
    autoAlpha: 0,
    y: 20,
    stagger: { each: 0.05, from: "edges" },
    duration: 0.6,
    ease: "power3.out",
    scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reset" }
  });
});
```

- **Do not:** apply parallax to **every** section (Anti-Slop C4); add a hover lift+scale+shadow combo on overlapping cards; let overlap break legibility — text always readable above images.

## Choosing a Recipe

| If the brief reads as… | Pick |
|---|---|
| Premium consumer brand, hero-driven, single message | Editorial Kinetic |
| Studio / agency portfolio, anti-template, raw | Brutalist Scroll |
| Hardware / dark tech SaaS, card-heavy, touch-feel | Liquid Glass Hover |
| Product features grid, dashboard preview | Bento Flip |
| B2B SaaS, public-sector, content-first | Minimal Fade |
| Origin-story page, narrative, one long pinned scene | Cinematic Pinned Scrub |
| Typographic brand, hero-only, motion-led | Kinetic Type Stagger |
| Creative editorial, gallery, magazine | Grid Break Overlap |

When the brief is hybrid, **pick one recipe as the primary** and borrow only the typography/color from a second; never combine two motion skeletons in the same project (Anti-Slop F4 / Bento mixing rule).

## Best Practices

- ✅ Pick one recipe per project; clone the skeleton, then adapt to the brief.
- ✅ Keep the motion mode and ease family of the recipe — they are tuned together.
- ✅ Run [motion-anti-slop](../motion-anti-slop/SKILL.md) after adapting to catch defaults that crept back in.

## Do Not

- ❌ Combine two recipes in the same project (Brutalist + Liquid Glass etc.); each is a closed system.
- ❌ Drop the recipe's plugins and reimplement by hand (e.g. write a SplitText replacement); use the official plugin per [gsap-plugins](../gsap-plugins/SKILL.md).
- ❌ Modify the recipe's ease family casually; if the brief justifies a change, document it and re-run the anti-slop pass.
