/**
 * Editorial Kinetic — GSAP showcase
 *
 * Design layer: motion-design-taste (Expressive mode), motion-recipes (Editorial Kinetic).
 * API layer: gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins (SplitText).
 *
 * Motion language:
 *   - duration band 0.6–1.0 s
 *   - ease family: expo.out / power3.out (no back.* / elastic.*)
 *   - stagger 0.05–0.08 s
 *   - line-mask reveal on hero, autoAlpha+y on supporting reveals
 *   - prefers-reduced-motion respected via gsap.matchMedia
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
// Plugins use DEFAULT imports from esm.sh (Anti-Slop G4) — named plugin imports may resolve to undefined.
import ScrollTrigger from "https://esm.sh/gsap@3.15.0/ScrollTrigger";
import SplitText from "https://esm.sh/gsap@3.15.0/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const mm = gsap.matchMedia();

mm.add(
  {
    isMotionOK: "(prefers-reduced-motion: no-preference)",
    isReduced: "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { isMotionOK } = ctx.conditions;

    if (!isMotionOK) {
      // Reduced-motion: jump to end state, no scroll-driven motion.
      // Selectors mirror the .js CSS gates (.js .hero .eyebrow / .js .hero .meta / .js .reveal).
      gsap.set([".hero .eyebrow", ".hero .meta", ".feature .reveal", ".hero h1"], { autoAlpha: 1, y: 0 });
      return;
    }

    // Hero: line-masked reveal of the display headline.
    document.fonts.ready.then(() => {
      const split = SplitText.create(".hero h1", {
        type: "lines",
        mask: "lines",
        linesClass: "line"
      });

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".eyebrow", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .from(split.lines, { yPercent: 110, stagger: 0.08, duration: 0.95 }, "<0.1")
        .fromTo(".hero .meta", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.5");
    });

    // Section reveals — fromTo so the JS-gated CSS opacity:0 has an explicit end state.
    gsap.utils.toArray(".feature .reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reset" }
        }
      );
    });

    // Numbered marker: subtle entrance reveal (toggleActions, not a scrub-driven parallax).
    gsap.utils.toArray(".feature .num").forEach((num) => {
      gsap.from(num, {
        yPercent: 30,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: num, start: "top 85%", toggleActions: "play none none reset" }
      });
    });

    // Quote: word-stagger entrance, plays once on enter.
    const qSplit = SplitText.create(".quote blockquote", {
      type: "words, chars",
      mask: "words"
    });
    gsap.from(qSplit.chars, {
      yPercent: 100,
      stagger: 0.018,
      duration: 0.85,
      ease: "expo.out",
      scrollTrigger: { trigger: ".quote", start: "top 70%", once: true }
    });
  }
);
