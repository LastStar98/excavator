import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { bearingSinkage, compressionLimit, compressionIncrement, granularDischarge, shearStrengthKPa } from "../src/soil-physics.ts";
import { SoilStream } from "../src/soil-stream.ts";

test("bearing responds to load, contact area and soil without unbounded sinkage", () => {
  const dry = { wetness: 0.15, looseSpoil: 0, hardpack: 0 };
  const wet = { ...dry, wetness: 0.9 };
  const hard = { ...dry, hardpack: 0.9 };
  const sink = bearingSinkage(20000 * 9.81, 3.65, 0.5, dry);
  assert.ok(sink > 0.01 && sink < 0.08);
  assert.ok(bearingSinkage(25000 * 9.81, 3.65, 0.5, dry) > sink);
  assert.ok(bearingSinkage(20000 * 9.81, 7.3, 0.5, dry) < sink);
  assert.ok(bearingSinkage(20000 * 9.81, 3.65, 0.5, wet) > sink);
  assert.ok(bearingSinkage(20000 * 9.81, 3.65, 0.5, hard) < sink);
  assert.equal(bearingSinkage(0, 3.65, 0.5, dry), 0);
});

test("ten minutes of repeated compaction converges and is timestep independent", () => {
  const limit = compressionLimit({ wetness: 0.9, hardpack: 0, looseSpoil: 0.5 });
  const run = (dt: number, seconds: number) => {
    let used = 0;
    for (let i = 0; i < Math.round(seconds / dt); i++) used += compressionIncrement(used, limit, dt * 0.08);
    return used;
  };
  assert.ok(Math.abs(run(1 / 30, 10) - run(1 / 120, 10)) < 1e-10);
  assert.ok(run(1 / 60, 600) <= limit && limit <= 0.22);
  assert.ok(run(1 / 60, 600) - run(1 / 60, 60) < 1e-8);
});

test("granular flow needs downhill gravity, drains progressively and respects volume", () => {
  assert.equal(granularDischarge(1, 0, 1, 1 / 60), 0);
  assert.equal(granularDischarge(1, -1, 1, 1 / 60), 0);
  assert.ok(granularDischarge(1, 1, 1, 1 / 60) > 0);
  assert.ok(granularDischarge(1, -2.8, 1, 1 / 60) > 0, "inverted bucket must release soil even when its lip slopes backwards");
  assert.ok(granularDischarge(1, 1, 1, 1 / 60) < 0.04);
  assert.equal(granularDischarge(0.001, 1, 1, 1), 0.001);
  assert.ok(shearStrengthKPa(1, 5, 0.55) > shearStrengthKPa(0.1, 5, 0.55));
});

test("stream follows gravity, retains airborne volume, and deposits only at contact", () => {
  for (const dt of [1 / 30, 1 / 60, 1 / 120]) {
    const stream = new SoilStream();
    stream.emit(new Vector3(0, 3, 0), new Vector3(1, 0, 0), new Vector3(0, 0, 1), 0.6, 1 / 60);
    let deposited = 0;
    let firstContact = 0;
    for (let step = 0; step < Math.round(2 / dt); step++) {
      stream.update(dt, (packet) => {
        if (packet.position.y > 0) return false;
        if (!firstContact) firstContact = (step + 1) * dt;
        deposited += packet.volume;
        assert.ok(packet.position.x > 0.75);
        return true;
      });
      assert.ok(Math.abs(deposited + stream.volume - 0.6) < 1e-10);
      if ((step + 1) * dt < 0.7) assert.equal(deposited, 0);
    }
    assert.ok(Math.abs(firstContact - Math.sqrt(6 / 9.81)) <= dt);
    assert.ok(Math.abs(deposited - 0.6) < 1e-10);
    assert.equal(stream.mesh.count, 0);
  }
});

test("stream saturation applies backpressure without teleporting or discarding soil", () => {
  const stream = new SoilStream();
  for (let i = 0; i < stream.capacity; i++) stream.emit(new Vector3(0, 5, 0), new Vector3(), new Vector3(0, 0, 1), 0.01, 1 / 240);
  assert.equal(stream.available, 0);
  assert.equal(stream.emit(new Vector3(), new Vector3(), new Vector3(), 1, 1 / 60), 0);
  assert.ok(Math.abs(stream.volume - 3.84) < 1e-10);
  stream.clear();
  assert.equal(stream.volume, 0);
  assert.equal(stream.mesh.count, 0);
});
