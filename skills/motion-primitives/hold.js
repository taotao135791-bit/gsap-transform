// hold — explicit empty gap on the master timeline. Useful for leaving breathing room.

import { position } from "./_contract.js";

export default {
  name: "hold",
  layerTypes: ["any"],
  defaultArgs: { duration: 0.5 },
  antiSlop: [],
  apply(_target, args, ctx) {
    return ctx.tl.to({}, { duration: args.duration }, position(ctx));
  }
};