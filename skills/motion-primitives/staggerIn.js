// staggerIn — fadeUp across a group's children.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "staggerIn",
  layerTypes: ["group", "container"],
  defaultArgs: { y: 24, stagger: 0.08, duration: 0.5, ease: "expo.out" },
  antiSlop: ["G1"],
  apply(target, args, ctx) {
    if (!target) return ctx.tl;
    const children = target.children?.length ? Array.from(target.children) : [target];
    return ctx.tl.fromTo(children,
      { autoAlpha: 0, y: args.y },
      { autoAlpha: 1, y: 0,
        duration: args.duration, ease: args.ease, stagger: args.stagger },
      position(ctx)
    );
  }
};