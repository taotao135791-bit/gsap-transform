// morphTo — MorphSVG to a target path. Requires MorphSVGPlugin.
// target is the SOURCE <path>; args.to is a path-d string OR selector of another <path>.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "morphTo",
  layerTypes: ["svg-path"],
  defaultArgs: { to: "", duration: 0.8, ease: "expo.inOut" },
  antiSlop: ["G5"],
  apply(target, args, ctx) {
    if (!ctx.gsap.MorphSVGPlugin && !ctx.MorphSVGPlugin) {
      throw new Error("morphTo requires MorphSVGPlugin");
    }
    const to = args.to.startsWith("#") || args.to.startsWith(".")
      ? document.querySelector(args.to)
      : null;
    return ctx.tl.to(target, {
      duration: args.duration,
      ease: args.ease,
      morphSVG: to ? to : { shape: args.to, type: "rotational" }
    }, position(ctx));
  }
};