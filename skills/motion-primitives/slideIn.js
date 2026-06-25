import { mergeArgs, position } from "./_contract.js";

export default {
  name: "slideInLeft",
  layerTypes: ["any"],
  defaultArgs: { distance: 120, duration: 0.6, ease: "expo.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { autoAlpha: 0, x: -args.distance },
      { autoAlpha: 1, x: 0, duration: args.duration, ease: args.ease },
      position(ctx)
    );
  }
};

export const slideInRight = {
  name: "slideInRight",
  layerTypes: ["any"],
  defaultArgs: { distance: 120, duration: 0.6, ease: "expo.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { autoAlpha: 0, x: args.distance },
      { autoAlpha: 1, x: 0, duration: args.duration, ease: args.ease },
      position(ctx)
    );
  }
};