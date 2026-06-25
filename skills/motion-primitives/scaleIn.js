import { mergeArgs, position } from "./_contract.js";

export default {
  name: "scaleIn",
  layerTypes: ["any"],
  defaultArgs: { from: 0.85, duration: 0.6, ease: "expo.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { autoAlpha: 0, scale: args.from, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scale: 1, duration: args.duration, ease: args.ease },
      position(ctx)
    );
  }
};