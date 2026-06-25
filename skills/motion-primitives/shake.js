// shake — short directional shake. Good for error / rejected-state cues.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "shake",
  layerTypes: ["any"],
  defaultArgs: { magnitude: 8, duration: 0.45 },
  antiSlop: [],
  apply(target, args, ctx) {
    const tl = ctx.tl;
    const m = args.magnitude;
    const start = position(ctx);
    tl.to(target, { x: -m, duration: args.duration / 6, ease: "power2.out" }, start);
    tl.to(target, { x:  m, duration: args.duration / 6, ease: "power2.inOut" }, "<");
    tl.to(target, { x: -m * 0.7, duration: args.duration / 6, ease: "power2.inOut" }, "<");
    tl.to(target, { x:  m * 0.7, duration: args.duration / 6, ease: "power2.inOut" }, "<");
    tl.to(target, { x: -m * 0.3, duration: args.duration / 6, ease: "power2.inOut" }, "<");
    tl.to(target, { x: 0, duration: args.duration / 6, ease: "power2.out" }, "<");
    return tl;
  }
};