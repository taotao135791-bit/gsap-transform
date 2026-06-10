/**
 * Brutalist Scroll — GSAP showcase
 *
 * Design layer: motion-design-taste (Cinematic mode), motion-recipes (Brutalist Scroll).
 * API layer: gsap-core, gsap-scrolltrigger, gsap-plugins (Flip).
 *
 * Motion language:
 *   - pinned scene with scrub: 0.6, ease: "none" everywhere on the scrub
 *   - sharp power4.out off-scrub
 *   - Flip on a layout density toggle
 *   - prefers-reduced-motion respected via gsap.matchMedia
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
import { ScrollTrigger } from "https://esm.sh/gsap@3.15.0/ScrollTrigger";
import { Flip } from "https://esm.sh/gsap@3.15.0/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

const grid = document.querySelector("#grid");
const toggleBtn = document.querySelector("#toggle");

const mm = gsap.matchMedia();

mm.add(
  {
    isMotionOK: "(prefers-reduced-motion: no-preference)",
    isReduced: "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { isMotionOK } = ctx.conditions;

    if (!isMotionOK) {
      // Reduced-motion: no pin, no scrub, no Flip — instant state changes.
      toggleBtn.addEventListener("click", () => grid.classList.toggle("dense"));
      return;
    }

    // Pinned scene — vertical scroll drives horizontal-style movement of the big number
    // and the scene title. ease: "none" is mandatory on a scrubbed timeline.
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#scene",
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true
        },
        defaults: { ease: "none" }
      })
      .to(".big-number", { xPercent: -45, yPercent: -10 }, 0)
      .to(".scene-title", { yPercent: -20, autoAlpha: 0.92 }, 0)
      .from(".scene-meta div", { autoAlpha: 0, x: 30, stagger: 0.05 }, 0);

    // Manifesto reveal — sharp, off-scrub, Cinematic ease.
    gsap.from(".manifesto h2", {
      yPercent: 30,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power4.out",
      scrollTrigger: { trigger: ".manifesto", start: "top 75%", toggleActions: "play none none reset" }
    });
    gsap.from(".manifesto p", {
      autoAlpha: 0,
      y: 18,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: ".manifesto", start: "top 70%", toggleActions: "play none none reset" }
    });

    // Tile entrance via ScrollTrigger.batch.
    ScrollTrigger.batch(".tile", {
      start: "top 88%",
      onEnter: (els) =>
        gsap.from(els, {
          autoAlpha: 0,
          y: 24,
          duration: 0.55,
          ease: "power4.out",
          stagger: { each: 0.05, from: "edges" },
          overwrite: true
        })
    });

    // Density toggle — Flip captures the layout state, swap the class, animate diff.
    toggleBtn.addEventListener("click", () => {
      const state = Flip.getState(".tile");
      grid.classList.toggle("dense");
      Flip.from(state, {
        duration: 0.6,
        ease: "power4.inOut",
        absolute: true,
        nested: true,
        stagger: 0.02
      });
    });
  }
);
