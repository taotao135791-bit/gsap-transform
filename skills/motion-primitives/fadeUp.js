import { mergeArgs, position } from "./_contract.js";

export default {
  name: "fadeUp",
  layerTypes: ["any"],
  defaultArgs: { y: 24, duration: 0.5, ease: "expo.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    const tl = ctx.tl.fromTo(target,
      { autoAlpha: 0, y: args.y },
      {
        autoAlpha: 1, y: 0,
        duration: args.duration, ease: args.ease
      },
      position(ctx)
    );
    return tl;
  }
};