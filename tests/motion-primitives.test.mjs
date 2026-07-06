import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { get, primitiveNames, primitives } from "../skills/motion-primitives/index.js";
import { PRIMITIVE_NAMES } from "../skills/motion-state/runtime.mjs";

test("primitive registry exposes core primitives", () => {
  for (const name of ["fadeUp", "splitReveal", "cameraPush"]) {
    const primitive = get(name);
    assert.equal(primitive.name, name);
    assert.equal(typeof primitive.apply, "function");
  }
});

test("unknown primitive throws a clear error", () => {
  assert.throws(
    () => get("notARealPrimitive"),
    /unknown primitive: notARealPrimitive/
  );
});

test("primitive barrel matches state runtime primitive list", () => {
  assert.deepEqual([...primitiveNames].sort(), [...PRIMITIVE_NAMES].sort());
  assert.deepEqual(Object.keys(primitives).sort(), [...PRIMITIVE_NAMES].sort());
});

test("primitive documentation names the registry primitives", async () => {
  const doc = await readFile("skills/motion-primitives/SKILL.md", "utf8");
  for (const name of ["fadeUp", "splitReveal", "cameraPush"]) {
    assert.match(doc, new RegExp(`\\\`${name}\\\``));
  }
});
