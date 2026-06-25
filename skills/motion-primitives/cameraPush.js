// cameraPush — slow scale + translate on a container (virtual "camera" move).

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "cameraPush",
  layerTypes: ["container"],
  defaultArgs: { scale: 1.15, x: 0, y: -40, duration: 3.0, ease: "expo.inOut" },
  antiSlop: [],
  apply(target, args, ctx) {
    return ctx.tl.to(target, {
      scale: args.scale, x: args.x, y: args.y,
      duration: args.duration, ease: args.ease
    }, position(ctx));
  }
};