// Pure runtime for state.json. No DOM, no GSAP — easy to unit-test.
// Used by: scene.js generator, render.mjs (read duration/fps), tests.
//
// Public API:
//   validate(state)         → throws on schema/anti-slop violation
//   at(state, t)            → beats overlapping t (open interval)
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

  const ids = new Set();
  for (const layer of state.layers) {
    if (ids.has(layer.id)) throw new Error(`duplicate layer id: ${layer.id}`);
    ids.add(layer.id);
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(layer.id)) {
      throw new Error(`bad layer id: ${layer.id}`);
    }
  }
  const layerIds = new Set(state.layers.map(l => l.id));

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
    const end = b.at + (b.duration ?? 0);
    return t >= start && t < end;
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
  const next = {
    ...state,
    layers: [...state.layers],
    beats: [...state.beats, beat]
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
    beats: state.beats.map(b => b.id === beatId ? { ...b, ...patch } : b)
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