/**
 * Motion Studio — scene choreography (TEMPLATE).
 *
 * Export ONE master timeline on window.__studio so that:
 *   - index.html mounts GSDevTools on it (dev preview / scrub), and
 *   - render.mjs seeks it frame-by-frame (the window.__RENDERING path).
 *
 * Replace the placeholder beats below with the project's real choreography.
 * Keep everything TIME-DRIVEN: no ScrollTrigger, no quickTo / pointer tweens.
 * (render.mjs advances time via gsap.updateRoot; pointer-driven tweens never
 *  fire in a headless seek — see motion-studio/SKILL.md "Limitations".)
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
// G4: plugins use DEFAULT imports from esm.sh.
import SplitText from "https://esm.sh/gsap@3.15.0/SplitText";

gsap.registerPlugin(SplitText);

const mm = gsap.matchMedia();

mm.add(
  {
    isMotionOK: "(prefers-reduced-motion: no-preference)",
    isReduced:  "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { isMotionOK } = ctx.conditions;

    if (!isMotionOK) {
      // Reduced-motion: paint end state, expose a zero-duration timeline so render.mjs still completes.
      gsap.set([".eyebrow", ".headline"], { autoAlpha: 1, y: 0 });
      document.querySelector(".sub")?.classList.add("in");
      window.__studio = { gsap, tl: gsap.timeline(), duration: () => 0 };
      window.dispatchEvent(new Event("__studio:ready"));
      return;
    }

    // G6.5: wait for fonts before SplitText measures line boxes.
    document.fonts.ready.then(() => {
      const split = SplitText.create(".headline", {
        type: "lines",
        mask: "lines",
        linesClass: "line"
      });

      // ONE master timeline — this is what GSDevTools scrubs and render.mjs seeks.
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".eyebrow", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .from(split.lines, { yPercent: 110, stagger: 0.09, duration: 0.95 }, "<0.1")
        .fromTo(".sub", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.4")
        .to({}, { duration: 0.6 }); // tail hold so the last beat isn't clipped on a loop

      window.__studio = { gsap, tl, duration: () => tl.duration() };
      window.dispatchEvent(new Event("__studio:ready"));
    });
  }
);
