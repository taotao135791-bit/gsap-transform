import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { at, summary, validate } from "../skills/motion-state/runtime.mjs";

async function loadTemplateState(slug = "product-hero-reveal") {
  const raw = await readFile(`templates/${slug}/state.json`, "utf8");
  return JSON.parse(raw);
}

test("a real template state validates", async () => {
  const state = await loadTemplateState();
  assert.doesNotThrow(() => validate(state));

  const info = summary(state);
  assert.equal(info.schemaVersion, 1);
  assert.equal(info.beatCount, state.beats.length);
  assert.equal(info.layerCount, state.layers.length);
});

test("missing top-level required field fails validation", async () => {
  const state = await loadTemplateState();
  delete state.duration;

  assert.throws(
    () => validate(state),
    /duration must be a positive number/
  );
});

test("beat missing required primitive fails validation", async () => {
  const state = await loadTemplateState();
  delete state.beats[0].primitive;

  assert.throws(
    () => validate(state),
    /unknown primitive/
  );
});

test("beat referencing a missing layer fails validation", async () => {
  const state = await loadTemplateState();
  state.beats[0].layerId = "missingLayer";

  assert.throws(
    () => validate(state),
    /layerId missingLayer not found/
  );
});

test("beat start outside total duration fails validation", async () => {
  const state = await loadTemplateState();
  state.beats[0].at = state.duration + 1;

  assert.throws(
    () => validate(state),
    /out of/
  );
});

test("overlapping beats on the same layer fail unless allowed", async () => {
  const state = await loadTemplateState();
  state.beats[1].layerId = state.beats[0].layerId;
  state.beats[1].at = state.beats[0].at + 0.1;

  assert.throws(
    () => validate(state),
    /Anti-slop S2/
  );
});

test("at returns active beats for a time", async () => {
  const state = await loadTemplateState();
  const active = at(state, 1.0);

  assert.ok(active.some((beat) => beat.id === "b3"));
});
