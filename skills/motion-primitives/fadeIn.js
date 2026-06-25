import { mergeArgs, position } from "./_contract.js";

export default {
  name: "fadeIn",
  layerTypes: ["any"],
  defaultArgs: { duration: 0.6, ease: "power2.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: args.duration, ease: args.ease },
      position(ctx)
    );
  }
};