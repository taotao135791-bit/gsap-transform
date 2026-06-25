// parallaxY — time-driven vertical parallax (no scroll).
// In v1 this is just a y translation; scroll-driven parallax is Phase 2.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "parallaxY",
  layerTypes: ["any"],
  defaultArgs: { distance: -60, duration: 2.0, ease: "none" },
  antiSlop: [],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { y: -args.distance / 2 },
      { y: args.distance / 2, duration: args.duration, ease: args.ease },
      position(ctx)
    );
  }
};