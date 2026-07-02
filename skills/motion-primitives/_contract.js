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

// Mode-aware ease normalization (motion-design-taste §6).
// Given a MOTION_INTENSITY dial (1-10), returns the band's default entrance ease.
// Returns null when `mi` is absent so callers can skip normalization entirely
// (preserving each primitive's own defaultArgs.ease — non-breaking opt-in).
//   Restrained  (1-4) → power2.out
//   Expressive (5-7) → power3.out
//   Cinematic  (8-10) → expo.out
export function bandFromIntensity(mi) {
  if (typeof mi !== "number" || mi < 1 || mi > 10) return null;
  if (mi <= 4) return { mode: "Restrained",  ease: "power2.out" };
  if (mi <= 7) return { mode: "Expressive", ease: "power3.out" };
  return { mode: "Cinematic",  ease: "expo.out" };
}

// A primitive is an "entrance" (eligible for mode-aware ease override) when its
// default ease is an `.out` ease — this naturally selects fadeUp/fadeIn/scaleIn/
// slideIn*/splitReveal/staggerIn and excludes linear ("none"), inOut transitions
// (morph/draw/camera), and hardcoded-ease primitives (loopPulse/shake/typewriter).
export function isEntrancePrimitive(primitive) {
  const e = primitive?.defaultArgs?.ease;
  return typeof e === "string" && /\.out$/.test(e);
}