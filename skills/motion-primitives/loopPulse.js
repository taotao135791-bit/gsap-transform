// loopPulse — gentle scale pulse. Use sparingly (Anti-Slop recommends
// at most one pulse per page). The repeat count defaults to 3 so the
// timeline has a finite duration; callers can pass args.repeat to override.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "loopPulse",
  layerTypes: ["any"],
  defaultArgs: { scale: 1.06, duration: 1.2, repeatDelay: 0.4, repeat: 3 },
  antiSlop: [],
  apply(target, args, ctx) {
    return ctx.tl.fromTo(target,
      { scale: 1 },
      { scale: args.scale, duration: args.duration / 2,
        yoyo: true, repeat: args.repeat, repeatDelay: args.repeatDelay, ease: "sine.inOut" },
      position(ctx)
    );
  }
};