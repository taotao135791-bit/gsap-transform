/**
 * AURORA Studio — cinematic title sequence (example /studio + video-grammar artifact).
 *
 * Demonstrates the video-grammar vocabulary on the master timeline that render.mjs seeks:
 *   - `.camera` wrapper: PUSH (dolly in) + PULL (dolly out) via GSAP transforms (§2)
 *   - shot types: WS open → CU on the title → WS logo (§1)
 *   - MATCH CUT (§3): composition stays (centered big type), content swaps — the one hero transition
 *   - beat-synced pacing at 120 BPM, every cut lands on a beat (§4)
 *
 * One ease family (power3.inOut); one camera move per shot (V1); one hero transition (V2).
 */
import { gsap } from "https://esm.sh/gsap@3.15.0";
// G4: SplitText is a plugin — DEFAULT import from esm.sh.
import SplitText from "https://esm.sh/gsap@3.15.0/SplitText";

gsap.registerPlugin(SplitText);

const BPM = 120;
const beat = 60 / BPM; // 0.5s per beat — beat-synced pacing (video-grammar §4)
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
      gsap.set(".shot-logo", { autoAlpha: 1 });
      gsap.set([".shot-1", ".shot-2"], { autoAlpha: 0 });
      window.__studio = { gsap, tl: gsap.timeline(), duration: () => 0 };
      window.dispatchEvent(new Event("__studio:ready"));
      return;
    }

    document.fonts.ready.then(() => {
      const split = SplitText.create(".shot-1 .title", {
        type: "lines",
        mask: "lines",
        linesClass: "line"
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } })
        .set(camera, { scale: 1 })                              // WS open (shot type §1)
        .set(".shot-1", { autoAlpha: 1 })                       // reveal the open shot (CSS .js hides it)
        .set([".shot-2", ".shot-logo"], { autoAlpha: 0 })

        // beats 0–2: WS title reveal + hold
        .from(split.lines, { yPercent: 110, stagger: 0.08, duration: beat * 1.5 }, 0)
        .to({}, { duration: beat * 0.5 })                        // hold to beat 2

        // beat 4: PUSH (dolly in) to CU on the title — one camera move, no stack (V1)
        .to(camera, { scale: 2.2, yPercent: -4, duration: beat * 1.5 }, beat * 4)
        .to({}, { duration: beat * 0.5 })                        // hold CU to beat 6

        // beat 6: MATCH CUT (§3) — composition stays (centered big type), content swaps.
        // The camera does NOT move across the cut; that is what makes it a match cut.
        .set(".shot-1", { autoAlpha: 0 }, beat * 6)
        .set(".shot-2", { autoAlpha: 1 }, beat * 6)
        .from(".shot-2 .big", { autoAlpha: 0, scale: 0.92, duration: beat * 0.5 }, beat * 6)
        .from(".shot-2 .sub", { autoAlpha: 0, y: 12, duration: beat * 0.5 }, beat * 6.2)
        .to({}, { duration: beat * 1.8 })                        // hold shot-2

        // beat 10: hard cut → logo + PULL back to WS (camera move, the inverse of the push)
        .set(".shot-2", { autoAlpha: 0 }, beat * 10)
        .set(".shot-logo", { autoAlpha: 1 }, beat * 10)
        .to(camera, { scale: 1, yPercent: 0, duration: beat * 2 }, beat * 10)
        .from(".shot-logo .tag", { autoAlpha: 0, y: 10, duration: beat * 0.6 }, beat * 10.4)
        .to({}, { duration: beat * 2 });                         // tail hold on logo

      window.__studio = { gsap, tl, duration: () => tl.duration() };
      window.dispatchEvent(new Event("__studio:ready"));
    });
  }
);
