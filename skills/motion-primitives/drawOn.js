// drawOn — DrawSVG stroke-on. Requires DrawSVGPlugin.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "drawOn",
  layerTypes: ["svg-path"],
  defaultArgs: { duration: 1.0, ease: "expo.inOut" },
  antiSlop: ["G5"],
  apply(target, args, ctx) {
    if (!ctx.gsap.DrawSVGPlugin && !ctx.DrawSVGPlugin) {
      throw new Error("drawOn requires DrawSVGPlugin");
    }
    return ctx.tl.fromTo(target,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: args.duration, ease: args.ease },
      position(ctx)
    );
  }
};