import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

import { PRIMITIVE_NAMES, validate } from "../skills/motion-state/runtime.mjs";

test("all template state files are parseable and validate", async (t) => {
  const entries = await readdir("templates", { withFileTypes: true });
  const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

  assert.ok(slugs.length >= 20);

  for (const slug of slugs) {
    await t.test(slug, async () => {
      const raw = await readFile(`templates/${slug}/state.json`, "utf8");
      const state = JSON.parse(raw);

      assert.doesNotThrow(() => validate(state));
      assert.equal(typeof state.duration, "number");
      assert.ok(state.duration > 0);
      assert.ok([24, 30, 60].includes(state.fps));
      assert.ok(Array.isArray(state.layers));
      assert.ok(state.layers.length > 0);
      assert.ok(Array.isArray(state.beats));
      assert.ok(state.beats.length > 0);

      const layerIds = new Set(state.layers.map((layer) => layer.id));

      for (const beat of state.beats) {
        assert.equal(typeof beat.at, "number", `${slug}:${beat.id} missing at`);
        assert.equal(typeof beat.duration, "number", `${slug}:${beat.id} missing duration`);
        assert.equal(typeof beat.primitive, "string", `${slug}:${beat.id} missing primitive`);
        assert.ok(PRIMITIVE_NAMES.includes(beat.primitive), `${slug}:${beat.id} unknown primitive`);
        assert.ok(layerIds.has(beat.layerId), `${slug}:${beat.id} missing layer ${beat.layerId}`);
        assert.ok(
          beat.at + beat.duration <= state.duration + 1e-9,
          `${slug}:${beat.id} exceeds duration`
        );
      }
    });
  }
});
