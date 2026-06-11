/**
 * Liquid Glass Hover — GSAP showcase
 *
 * Design layer: motion-design-taste (Expressive mode), motion-recipes (Liquid Glass Hover).
 * API layer: gsap-core (quickTo), gsap-scrolltrigger (entrance), gsap-performance.
 *
 * Motion language:
 *   - magnetic CTA via gsap.quickTo (no new tween per pointer event)
 *   - card spotlight tracks cursor via CSS custom properties (no GSAP needed)
 *   - single-property hover signal — no lift+scale+shadow combo
 *   - prefers-reduced-motion respected via gsap.matchMedia
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
// Plugins use DEFAULT imports from esm.sh (Anti-Slop G4) — named plugin imports may resolve to undefined.
import ScrollTrigger from "https://esm.sh/gsap@3.15.0/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    isMotionOK: "(prefers-reduced-motion: no-preference)",
    isReduced: "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { isMotionOK } = ctx.conditions;

    // Glass-card spotlight — works for everyone, no motion required.
    document.querySelectorAll(".glass-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });

    if (!isMotionOK) {
      // Reduced-motion: instant reveal, no magnetic offset, no entrance.
      gsap.set(".reveal", { autoAlpha: 1, y: 0 });
      return;
    }

    // Entrance — fromTo so GSAP owns both start and end (CSS .js .reveal sets opacity:0 as fallback).
    gsap.fromTo(
      ".hero .reveal",
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.08 }
    );

    ScrollTrigger.batch(".card-grid .reveal", {
      start: "top 85%",
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: { each: 0.07, from: "edges" },
            overwrite: true
          }
        )
    });

    // Magnetic CTAs — one quickTo per axis, reused on every event.
    document.querySelectorAll(".magnetic-cta").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });

      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.25;
        const dy = (e.clientY - r.top - r.height / 2) * 0.25;
        xTo(dx);
        yTo(dy);
      });

      btn.addEventListener("pointerleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }
);
