// typewriter — types out text char-by-char at `cps` chars/sec.

import { mergeArgs, position } from "./_contract.js";

export default {
  name: "typewriter",
  layerTypes: ["text"],
  defaultArgs: { cps: 28, startFrom: "blank" },
  antiSlop: [],
  apply(target, args, ctx) {
    const original = (target.textContent ?? "");
    const dur = original.length / args.cps;
    const proxy = { n: 0 };
    if (args.startFrom === "blank") target.textContent = "";
    return ctx.tl.to(proxy, {
      n: original.length,
      duration: dur,
      ease: "none",
      onUpdate: () => { target.textContent = original.slice(0, Math.floor(proxy.n)); }
    }, position(ctx));
  }
};