// audio-stub.mjs — gated no-op for audio-driven motion.
//
// The user explicitly does not have an audio key yet (per their dev brief).
// This stub exists so:
//   1. Primitives that *would* use BPM can read `window.__studio.bpm` and
//      fall back to 120 if the audio feature flag is off.
//   2. When the user later provides an audio key + provider, the same call
//      sites work — no scene.js rewrites needed.
//
// Usage in scene.js (auto-injected by state-to-scene.mjs):
//   import { bpm, beatAt } from "../../skills/motion-studio/audio-stub.mjs";
//
//   const bpmValue = await bpm();     // 120 default; real value when key set
//   const frame = beatAt(t, bpmValue); // frame number at which beat t falls
//
// Activation:
//   Set environment variables (read once at module load):
//     AUDIO_PROVIDER  = "suno" | "elevenlabs" | "udio"
//     AUDIO_API_KEY   = "..."
//   When both are set, the stub's `enabled` flag flips to true and BPM can
//   be sourced from the provider. Otherwise everything is no-op.

const enabled = Boolean(process.env.AUDIO_PROVIDER && process.env.AUDIO_API_KEY);

export function isEnabled() {
  return enabled;
}

export async function bpm() {
  if (!enabled) return 120; // Phase 1 default — every "beat" lands on a 0.5s grid
  // v2: query provider for track BPM. Stub for now.
  return 120;
}

export function beatAt(seconds, _bpmValue) {
  const b = _bpmValue ?? 120;
  return Math.floor(seconds * (b / 60));
}

export function gridAt(seconds, gridSeconds = 0.5) {
  return Math.round(seconds / gridSeconds) * gridSeconds;
}

// To activate:
//   1. Set AUDIO_PROVIDER + AUDIO_API_KEY in env
//   2. Replace the `bpm()` body with a real provider call
//   3. No scene.js changes — primitives already use bpm()