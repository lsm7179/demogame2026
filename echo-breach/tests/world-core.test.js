const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../world-core.js");
const worlds = require("../world-data.js");

const viewport = { width: 1280, height: 720 };

test("screen and world coordinate transforms round-trip after camera movement", () => {
  const camera = { x: 1130, y: 210 };
  const view = { ox: 20, oy: 15, scale: 0.75 };
  const world = core.screenToWorld({ x: 395, y: 240 }, camera, view);
  assert.deepEqual(core.worldToScreen(world, camera, view), { x: 395, y: 240 });
});

test("camera follows smoothly and remains inside the continuous world", () => {
  const world = worlds.awakening;
  const start = core.cameraForFocus(world.playerStart, world, viewport);
  assert.deepEqual(start, { x: 0, y: 180 });
  const followed = core.updateCamera(start, { x: 2500, y: 540 }, 1 / 60, world, viewport);
  assert.ok(followed.x > 0 && followed.x < 1860);
  assert.ok(followed.y >= 0 && followed.y <= world.height - viewport.height);
  assert.deepEqual(core.cameraForFocus({ x: 9999, y: 9999 }, world, viewport), {
    x: world.width - viewport.width,
    y: world.height - viewport.height,
  });
});

test("Stage 1 continuous world is larger than the viewport and fully data driven", () => {
  const world = worlds.awakening;
  assert.equal(world.mode, "continuous");
  assert.ok(world.width > viewport.width * 2);
  assert.ok(world.height > viewport.height);
  assert.equal(world.zones.length, 3);
  assert.equal(world.switches.length, 1);
  assert.equal(world.shortcuts.length, 1);
  assert.equal(world.objective.relayPositions.length, 2);
  assert.ok(world.zones.every((zone) => zone.waves.length === zone.spawnPoints.length));
});

test("continuous loop reset restores transient actors but preserves cumulative state", () => {
  const persistent = { coreHp: 430, score: 900, overdriveGauge: 55 };
  const reset = core.resetContinuousLoop(persistent, worlds.awakening);
  assert.deepEqual(reset.persistent, persistent);
  assert.notEqual(reset.persistent, persistent);
  assert.deepEqual(reset.transient.playerStart, worlds.awakening.playerStart);
  assert.equal(reset.transient.enemies.length, 13);
  assert.ok(reset.transient.switches.every((item) => item.charge === 0));
  assert.ok(reset.transient.relays.every((item) => item.charge === 0 && !item.active));
});

test("zone lookup tracks player depth without camera state", () => {
  assert.equal(core.zoneAt(worlds.awakening.zones, { x: 200, y: 540 }).id, "containment-hall");
  assert.equal(core.zoneAt(worlds.awakening.zones, { x: 1700, y: 540 }).id, "infested-lab");
  assert.equal(core.zoneAt(worlds.awakening.zones, { x: 3300, y: 540 }).id, "anchor-chamber");
});
