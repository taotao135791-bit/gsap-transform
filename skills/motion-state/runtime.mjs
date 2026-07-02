// Pure runtime for state.json. No DOM, no GSAP — easy to unit-test.
// Used by: scene.js generator, render.mjs (read duration/fps), tests.
//
// Public API:
//   validate(state)         → throws on schema/anti-slop violation
//   at(state, t)            → beats active at time t (half-open interval; instantaneous beats match at exact start)
//   add(state, beat)        → returns new state with beat appended (validates)
//   remove(state, beatId)   → returns new state with beat removed
//   summary(state)          → { beatCount, layerCount, duration, ... }

const SCHEMA_VERSION = 1;
const MAX_BEATS = 200;

export const PRIMITIVE_NAMES = [
  "fadeUp", "fadeIn", "scaleIn", "slideInLeft", "slideInRight",
  "splitReveal", "typewriter", "scrambleText",
  "morphTo", "drawOn",
  "parallaxY", "staggerIn",
  "loopPulse", "shake", "cameraPush", "hold"
];

// Layer-type requirements per primitive (mirrors each primitive's `layerTypes`).
// Used by validate() to enforce Anti-Slop G5 (svg-path for morphTo/drawOn) and
// general type safety. "any" matches every layer type. Keep in sync with the
// `layerTypes` field declared on each primitive in skills/motion-primitives/.
export const PRIMITIVE_LAYER_TYPES = {
  fadeUp: ["any"], fadeIn: ["any"], scaleIn: ["any"],
  slideInLeft: ["any"], slideInRight: ["any"],
  splitReveal: ["text"], typewriter: ["text"], scrambleText: ["text"],
  morphTo: ["svg-path"], drawOn: ["svg-path"],
  parallaxY: ["any"], staggerIn: ["group", "container"],
  loopPulse: ["any"], shake: ["any"], cameraPush: ["container"], hold: ["any"]
};

// ---------- validation ----------

export function validate(state) {
  if (!state || typeof state !== "object") throw new Error("state must be an object");
  if (state.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`schemaVersion must be ${SCHEMA_VERSION}, got ${state.schemaVersion}`);
  }
  for (const k of ["duration", "fps", "width", "height"]) {
    if (typeof state[k] !== "number" || !(state[k] > 0)) {
      throw new Error(`${k} must be a positive number`);
    }
  }
  if (![24, 30, 60].includes(state.fps)) throw new Error(`fps must be 24|30|60`);
  if (!Array.isArray(state.layers)) throw new Error("layers must be an array");
  if (!Array.isArray(state.beats)) throw new Error("beats must be an array");
  if (state.motionIntensity !== undefined &&
      (typeof state.motionIntensity !== "number" || state.motionIntensity < 1 || state.motionIntensity > 10)) {
    throw new Error(`motionIntensity must be a number in [1,10], got ${state.motionIntensity}`);
  }
  // Optional string fields (mirror schema.json type constraints).
  for (const k of ["slug", "title", "industry"]) {
    if (state[k] !== undefined && typeof state[k] !== "string") {
      throw new Error(`${k} must be a string`);
    }
  }
  // Accent color format (mirror schema.json pattern).
  if (state.accent !== undefined) {
    if (typeof state.accent !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(state.accent)) {
      throw new Error(`accent must be a hex color like "#FF5A1F", got ${JSON.stringify(state.accent)}`);
    }
  }
  // Fonts: optional object whose values are string URLs.
  if (state.fonts !== undefined) {
    if (typeof state.fonts !== "object" || Array.isArray(state.fonts)) {
      throw new Error("fonts must be an object");
    }
    for (const [k, v] of Object.entries(state.fonts)) {
      if (typeof v !== "string") {
        throw new Error(`fonts.${k} must be a string (URL)`);
      }
    }
  }
  // Assets: optional array of { id, url } (mirror schema.json).
  if (state.assets !== undefined) {
    if (!Array.isArray(state.assets)) {
      throw new Error("assets must be an array");
    }
    if (state.assets.length > 50) {
      throw new Error(`assets count ${state.assets.length} > 50`);
    }
    const assetIds = new Set();
    for (const asset of state.assets) {
      if (!asset || typeof asset !== "object") {
        throw new Error("each asset must be an object");
      }
      if (typeof asset.id !== "string" || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(asset.id)) {
        throw new Error(`bad asset id: ${asset?.id}`);
      }
      if (assetIds.has(asset.id)) throw new Error(`duplicate asset id: ${asset.id}`);
      assetIds.add(asset.id);
      if (typeof asset.url !== "string" || !asset.url) {
        throw new Error(`asset ${asset.id}: url must be a non-empty string`);
      }
    }
  }

  const ids = new Set();
  for (const layer of state.layers) {
    if (ids.has(layer.id)) throw new Error(`duplicate layer id: ${layer.id}`);
    ids.add(layer.id);
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(layer.id)) {
      throw new Error(`bad layer id: ${layer.id}`);
    }
  }
  const layerIds = new Set(state.layers.map(l => l.id));
  const layerTypeById = new Map(state.layers.map(l => [l.id, l.type]));

  if (state.beats.length > MAX_BEATS) {
    throw new Error(`Anti-slop S5: beats count ${state.beats.length} > ${MAX_BEATS}`);
  }
  const beatIds = new Set();
  for (const beat of state.beats) {
    if (beatIds.has(beat.id)) throw new Error(`duplicate beat id: ${beat.id}`);
    beatIds.add(beat.id);
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(beat.id)) {
      throw new Error(`bad beat id: ${beat.id}`);
    }
    if (!layerIds.has(beat.layerId)) {
      throw new Error(`beat ${beat.id}: layerId ${beat.layerId} not found`);
    }
    if (!PRIMITIVE_NAMES.includes(beat.primitive)) {
      throw new Error(`beat ${beat.id}: unknown primitive ${beat.primitive}`);
    }
    // Anti-Slop G5 / type safety: primitive must be applied to a compatible layer.
    const allowedTypes = PRIMITIVE_LAYER_TYPES[beat.primitive];
    const beatLayerType = layerTypeById.get(beat.layerId);
    if (allowedTypes && !allowedTypes.includes("any") && !allowedTypes.includes(beatLayerType)) {
      throw new Error(
        `beat ${beat.id}: primitive "${beat.primitive}" requires layer type [${allowedTypes.join("|")}] ` +
        `but layer "${beat.layerId}" is "${beatLayerType}"`
      );
    }
    if (typeof beat.at !== "number" || beat.at < 0 || beat.at > state.duration) {
      throw new Error(`beat ${beat.id}: at=${beat.at} out of [0, ${state.duration}]`);
    }
    if (beat.duration !== undefined && (typeof beat.duration !== "number" || beat.duration <= 0)) {
      throw new Error(`beat ${beat.id}: duration must be positive`);
    }
  }

  // Anti-slop S2: overlap check
  const byLayer = new Map();
  for (const beat of state.beats) {
    if (!byLayer.has(beat.layerId)) byLayer.set(beat.layerId, []);
    byLayer.get(beat.layerId).push(beat);
  }
  for (const [lid, beats] of byLayer) {
    const sorted = [...beats].sort((a, b) => a.at - b.at);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      const prevEnd = prev.at + (prev.duration ?? 0);
      if (cur.at < prevEnd && !cur.allowOverlap && !prev.allowOverlap) {
        throw new Error(
          `Anti-slop S2: beats ${prev.id} and ${cur.id} overlap on layer ${lid} ` +
          `(${prev.at}..${prevEnd} vs ${cur.at}..${cur.at + (cur.duration ?? 0)})`
        );
      }
    }
  }
}

// ---------- queries ----------

export function at(state, t) {
  if (typeof t !== "number") throw new Error("t must be a number");
  return state.beats.filter(b => {
    const start = b.at;
    const dur = b.duration ?? 0;
    // Instantaneous beats (no duration) match only at their exact start time.
    // Beats with duration match on a half-open interval [start, start+dur).
    if (dur === 0) return t === start;
    return t >= start && t < start + dur;
  });
}

export function getBeat(state, id) {
  return state.beats.find(b => b.id === id) ?? null;
}

export function getLayer(state, id) {
  return state.layers.find(l => l.id === id) ?? null;
}

// ---------- mutations (return new state, never mutate) ----------

export function add(state, beat) {
  // Shallow-copy the beat so the caller cannot mutate state by reference.
  // For deep args immutability, callers should pass structuredClone(beat).
  const next = {
    ...state,
    layers: [...state.layers],
    beats: [...state.beats, { ...beat }]
  };
  validate(next);
  return next;
}

export function remove(state, beatId) {
  const next = {
    ...state,
    beats: state.beats.filter(b => b.id !== beatId)
  };
  validate(next);
  return next;
}

export function update(state, beatId, patch) {
  const next = {
    ...state,
    beats: state.beats.map(b => {
      if (b.id !== beatId) return b;
      const merged = { ...b, ...patch };
      // Deep-merge args so partial arg updates don't clobber existing args.
      if (b.args && patch.args) {
        merged.args = { ...b.args, ...patch.args };
      }
      return merged;
    })
  };
  validate(next);
  return next;
}

// ---------- summary ----------

export function summary(state) {
  return {
    schemaVersion: state.schemaVersion,
    duration: state.duration,
    fps: state.fps,
    width: state.width,
    height: state.height,
    beatCount: state.beats.length,
    layerCount: state.layers.length,
    primitives: [...new Set(state.beats.map(b => b.primitive))].sort()
  };
}