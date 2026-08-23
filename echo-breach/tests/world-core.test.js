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

test("camera recovery never propagates non-finite coordinates into rendering", () => {
  const world = worlds.awakening;
  assert.deepEqual(core.clampCamera({ x: NaN, y: Infinity }, world, viewport), { x: 0, y: 0 });
  const recovered = core.updateCamera(
    { x: NaN, y: Infinity },
    { x: 1800, y: 540 },
    1 / 60,
    world,
    viewport,
    world.cameraFollowRate
  );
  assert.ok(Number.isFinite(recovered.x));
  assert.ok(Number.isFinite(recovered.y));
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

test("Stage 2 is a continuous gate world with a reachable moving relay", () => {
  const world = worlds["split-current"];
  assert.equal(world.mode, "continuous");
  assert.ok(world.width > viewport.width * 3);
  assert.equal(world.switches[0].gateId, "split-gate");
  assert.ok(world.walls.some((wall) => wall.id === "split-gate" && wall.gate));
  assert.equal(world.objective.movingRelayIndex, 1);
  const movingRelay = world.objective.relayPositions[world.objective.movingRelayIndex];
  assert.ok(movingRelay.x > 0 && movingRelay.x < world.width);
  assert.ok(movingRelay.y > 0 && movingRelay.y < world.height);
});

test("Stage 3 keeps rescue and hazard rules inside one continuous world", () => {
  const world = worlds["rescue-window"];
  assert.equal(world.mode, "continuous");
  assert.equal(world.shuttle.survivors, 12);
  assert.ok(world.shuttle.hp > 0);
  assert.ok(world.hazards.length >= 3);
  assert.ok(
    world.zones.some((zone) =>
      zone.waveGroups.some((group) => group.targetShuttle && group.enemies.length > 0)
    )
  );
  assert.ok(
    world.hazards.every(
      (hazard) =>
        hazard.x >= 0 &&
        hazard.y >= 0 &&
        hazard.x + hazard.w <= world.width &&
        hazard.y + hazard.h <= world.height
    )
  );
});
