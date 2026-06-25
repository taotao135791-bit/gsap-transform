// splitReveal — masked line-by-line reveal of a text element.
// Requires SplitText plugin registered in scene.js.
// Anti-slop G6.5: gated on document.fonts.ready (handled in scene.js, not here).

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "splitReveal",
  layerTypes: ["text"],
  defaultArgs: { direction: "up", stagger: 0.06, duration: 0.6, ease: "expo.out", splitBy: "lines" },
  antiSlop: ["G6.5", "B1"],
  apply(target, args, ctx) {
    const gsap = ctx.gsap;
    // Use gsap.SplitText (after registerPlugin) OR ctx.gsap.SplitText fallback.
    const SplitTextCtor = gsap.SplitText || ctx.SplitText;
    if (!SplitTextCtor) {
      throw new Error("splitReveal requires SplitText plugin (imported & registered in scene.js)");
    }
    const split = new SplitTextCtor(target, { type: args.splitBy });
    const y = args.direction === "down" ? -args.stagger * 100 : 60;
    const tween = ctx.tl.fromTo(split[args.splitBy],
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: args.duration,
        ease: args.ease, stagger: args.stagger },
      position(ctx)
    );
    tween.eventCallback("onStart", () => {
      gsap.set(target, { autoAlpha: 1 });
    });
    return tween;
  }
};