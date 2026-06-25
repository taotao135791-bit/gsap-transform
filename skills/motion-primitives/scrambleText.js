// scrambleText — scrambles then resolves to `args.text`. Requires ScrambleText plugin.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "scrambleText",
  layerTypes: ["text"],
  defaultArgs: { text: "", duration: 0.8, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  antiSlop: [],
  apply(target, args, ctx) {
    if (!ctx.gsap.ScrambleText && !ctx.ScrambleText) {
      throw new Error("scrambleText requires ScrambleText plugin");
    }
    return ctx.tl.to(target, {
      duration: args.duration,
      scrambleText: { text: args.text, chars: args.chars }
    }, position(ctx));
  }
};