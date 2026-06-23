/**
 * HEARTH cookware — 15s vertical promo (example /studio artifact).
 *
 * One master timeline on window.__studio: GSDevTools scrubs it in the browser,
 * render.mjs seeks it frame-by-frame. Multi-beat, fully time-driven (no scroll,
 * no pointer tweens) so every frame is seek-recordable.
 *
 * Design layer: motion-design-taste (Expressive→Cinematic), motion-recipes (Editorial Kinetic).
 * API layer: gsap-timeline, gsap-plugins (SplitText).
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
// G4: SplitText is a plugin — DEFAULT import from esm.sh.
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
      // Reduced-motion: show the intro beat only, at its end state.
      gsap.set(".beat--intro", { autoAlpha: 1, y: 0 });
      gsap.set([".beat--f1", ".beat--f2", ".beat--f3", ".beat--logo"], { autoAlpha: 0 });
      window.__studio = { gsap, tl: gsap.timeline(), duration: () => 0 };
      window.dispatchEvent(new Event("__studio:ready"));
      return;
    }

    // G6.5: fonts before SplitText measures the headline.
    document.fonts.ready.then(() => {
      const split = SplitText.create(".beat--intro .headline", {
        type: "lines",
        mask: "lines",
        linesClass: "line"
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // --- Intro (eyebrow + masked headline reveal) ---
      tl.set(".beat--intro", { autoAlpha: 1 })
        .fromTo(".beat--intro .eyebrow", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .from(split.lines, { yPercent: 110, stagger: 0.1, duration: 1.0 }, "<0.1")
        .to({}, { duration: 0.9 })                                       // hold
        .to(".beat--intro", { autoAlpha: 0, y: -24, duration: 0.5 });    // leave

      // --- Feature beats 01–03 (same choreography, varied content) ---
      document.querySelectorAll(".beat--f1, .beat--f2, .beat--f3").forEach((beat) => {
        tl.fromTo(beat, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.55 })
          .from(beat.querySelector(".fnum"), { autoAlpha: 0, y: 18, duration: 0.5 }, "<0.05")
          .to({}, { duration: 1.6 })                                     // hold
          .to(beat, { autoAlpha: 0, y: -30, duration: 0.45 });
      });

      // --- Logo lockup (tail) ---
      tl.fromTo(".beat--logo", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.8 })
        .from(".beat--logo .tagline", { autoAlpha: 0, y: 10, duration: 0.5 }, "<0.2")
        .to({}, { duration: 1.4 });                                      // tail hold

      window.__studio = { gsap, tl, duration: () => tl.duration() };
      window.dispatchEvent(new Event("__studio:ready"));
    });
  }
);
