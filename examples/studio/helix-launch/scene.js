/**
 * Helix — Linear-style launch reel (刁钻甲方 test).
 *
 * Restrained motion mode (motion-design-taste §6.A): 0.35–0.5 s durations, power2.out,
 * small staggers, NO bounce/elastic. One disciplined camera moment (video-grammar §2):
 * a single gentle push scale 1 → 1.15 over the features shot — that is the only camera
 * move in the whole video (V1: one move per shot, one move total earned).
 *
 * Beat-synced at 75 BPM (Restrained band 60–80).
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
// G4: SplitText is a plugin — DEFAULT import from esm.sh.
import SplitText from "https://esm.sh/gsap@3.15.0/SplitText";

gsap.registerPlugin(SplitText);

const BPM = 75;
const beat = 60 / BPM; // 0.8s — Restrained pacing band
const camera = ".camera";

const mm = gsap.matchMedia();

mm.add(
  {
    isMotionOK: "(prefers-reduced-motion: no-preference)",
    isReduced:  "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { isMotionOK } = ctx.conditions;

    if (!isMotionOK) {
      gsap.set([".topbar", ".shot-cta"], { autoAlpha: 1, y: 0 });
      gsap.set([".shot-intro", ".shot-features"], { autoAlpha: 0 });
      window.__studio = { gsap, tl: gsap.timeline(), duration: () => 0 };
      window.dispatchEvent(new Event("__studio:ready"));
      return;
    }

    document.fonts.ready.then(() => {
      const split = SplitText.create(".shot-intro .headline", {
        type: "lines",
        mask: "lines",
        linesClass: "line"
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } }) // Restrained ease family — no back/elastic
        .set(camera, { scale: 1 })
        .set([".shot-features", ".shot-cta"], { autoAlpha: 0 })
        .set(".shot-intro", { autoAlpha: 1 })

        // beat 0: topbar + eyebrow settle in (short, restrained)
        .fromTo(".topbar", { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0)
        .fromTo(".shot-intro .eyebrow", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.1)
        // headline masked reveal (0.5 s, small stagger — not the 0.1 default)
        .from(split.lines, { yPercent: 110, stagger: 0.06, duration: 0.5 }, 0.3)
        .to({}, { duration: beat * 2 }) // hold

        // beat 3: HARD CUT → features list, rows reveal with restrained stagger
        .set(".shot-intro", { autoAlpha: 0 }, beat * 3)
        .set(".shot-features", { autoAlpha: 1 }, beat * 3)
        .from(".features li", { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.45 }, beat * 3)

        // THE ONE camera moment: a gentle push scale 1 → 1.15 (video-grammar §2, V1).
        // Only camera move in the whole video; power2.inOut so it has dolly weight.
        .to(camera, { scale: 1.15, duration: beat * 2, ease: "power2.inOut" }, beat * 4.5)
        .to({}, { duration: beat }) // hold

        // beat 8: HARD CUT → CTA; camera settles back to 1 as the logo lands
        .set(".shot-features", { autoAlpha: 0 }, beat * 8)
        .set(".shot-cta", { autoAlpha: 1 }, beat * 8)
        .to(camera, { scale: 1, duration: beat * 1.5, ease: "power2.inOut" }, beat * 8)
        .fromTo(".shot-cta .cta", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, beat * 8.3)
        .to({}, { duration: beat * 2 }); // tail hold

      window.__studio = { gsap, tl, duration: () => tl.duration() };
      window.dispatchEvent(new Event("__studio:ready"));
    });
  }
);
