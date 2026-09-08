import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { horizontalReach, orbitTarget } from "../src/spatial.ts";

test("travel does not change reach or load moment for the same arm pose", () => {
  const chassis = new Vector3(0, 0.2, 0);
  const tip = new Vector3(3, 2, 4);
  for (const offset of [new Vector3(20, 0, -15), new Vector3(-24, -2, 17)]) {
    assert.equal(horizontalReach(tip.clone().add(offset), chassis.clone().add(offset)), 5);
  }
  assert.equal(horizontalReach(chassis, chassis), 0);
});

test("orbit target follows the full chassis translation, including terrain height", () => {
  const chassis = new Vector3(0, 0.2, 0);
  const tip = new Vector3(3, 2, 4);
  const offset = new Vector3(20, -2, -15);
  const initial = orbitTarget(chassis, tip);
  const moved = orbitTarget(chassis.clone().add(offset), tip.clone().add(offset));
  assert.ok(moved.distanceTo(initial.add(offset)) < 1e-12);
  assert.deepEqual(chassis.toArray(), [0, 0.2, 0]);
  assert.deepEqual(tip.toArray(), [3, 2, 4]);
});
