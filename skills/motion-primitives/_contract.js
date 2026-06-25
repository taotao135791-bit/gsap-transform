// Primitive contract — copy this shape for every new primitive.
//
//   export default {
//     name: "fadeUp",
//     layerTypes: ["any"],
//     defaultArgs: { y: 24, duration: 0.5, ease: "expo.out" },
//     apply(target, args, ctx) { ... return <tween or beat-meta> }
//   }
//
// `target` is the GSAP-targeted DOM element.
// `args` is beat.args merged with defaultArgs.
// `ctx`  is { tl, gsap, at(pos) → tl position param, beat, state }.
//
// The runtime wraps `tl.from / tl.to / tl.fromTo` so all 15 verbs share the
// same `at`/`duration`/`allowOverlap` semantics. Do not call tl.* directly.

export function mergeArgs(beatArgs, defaults) {
  return { ...defaults, ...(beatArgs ?? {}) };
}

export function position(ctx) {
  if (ctx.beat.at === 0) return 0;
  if (ctx.beat.at) return ctx.beat.at;
  return "<";
}