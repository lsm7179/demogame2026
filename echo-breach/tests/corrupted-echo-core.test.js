const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../corrupted-echo-core.js");

test("corrupted Echo pose replays recorded world coordinates by elapsed time", () => {
  const pose = core.samplePose(
    [
      { t: 0, x: 100, y: 200, a: 0 },
      { t: 2, x: 300, y: 400, a: Math.PI / 2 },
    ],
    1
  );
  assert.equal(pose.x, 200);
  assert.equal(pose.y, 300);
  assert.ok(Math.abs(pose.angle - Math.PI / 4) < 0.001);
});

test("corrupted Echo stops at its final recorded pose instead of extrapolating forever", () => {
  const samples = [
    { t: 0, x: 100, y: 500, a: 0 },
    { t: 1, x: 180, y: 420, a: -0.5 },
  ];
  assert.deepEqual(core.samplePose(samples, 20), {
    x: 180,
    y: 420,
    angle: -0.5,
  });
});

test("corrupted Echo converts absolute recordings into a scaled local path", () => {
  const samples = [
    { t: 0, x: 100, y: 500, a: 0 },
    { t: 1, x: 1100, y: -500, a: -0.5 },
  ];
  const bounds = { x: 900, y: 80, w: 1150, h: 920 };
  const transform = core.createLocalReplayTransform(samples, { x: 1500, y: 540 }, bounds, 0, 30);
  const first = core.localReplayTarget(core.samplePose(samples, 0), transform);
  const last = core.localReplayTarget(core.samplePose(samples, 1), transform);
  assert.deepEqual(first, { x: 1500, y: 540, angle: 0 });
  assert.ok(last.x >= bounds.x + 30 && last.x <= bounds.x + bounds.w - 30);
  assert.ok(last.y >= bounds.y + 30 && last.y <= bounds.y + bounds.h - 30);
  assert.ok(transform.scale < 1);
});

test("local replay transforms are deterministic and separate spawn order", () => {
  const samples = [
    { t: 0, x: 0, y: 0 },
    { t: 2, x: 400, y: 100 },
  ];
  const spawn = { x: 1300, y: 500 };
  const bounds = { x: 900, y: 80, w: 1150, h: 920 };
  const first = core.createLocalReplayTransform(samples, spawn, bounds, 2);
  const repeated = core.createLocalReplayTransform(samples, spawn, bounds, 2);
  const next = core.createLocalReplayTransform(samples, spawn, bounds, 3);
  assert.deepEqual(first, repeated);
  assert.notDeepEqual(first, next);
});

test("corrupted Echo movement is speed limited without teleporting", () => {
  const step = core.movementStep({ x: 100, y: 100 }, { x: 1000, y: 100 }, 1, 135);
  assert.deepEqual(step, { x: core.CONFIG.maxFrameDistance, y: 0 });
  assert.deepEqual(core.movementStep({ x: 0, y: 0 }, { x: 3, y: 4 }, 1, 135), { x: 3, y: 4 });
});

test("live corruption waits two seconds while completed recordings replay immediately", () => {
  assert.equal(core.playbackTime(1, false), -1);
  assert.equal(core.playbackTime(3, false), 1);
  assert.equal(core.playbackTime(3, true), 3);
});

test("hostile shot playback is cursor based and burst limited", () => {
  const events = [
    { t: 0.1, type: "dash" },
    { t: 0.2, type: "shot", angle: 0 },
    { t: 0.3, type: "shot", angle: 1 },
    { t: 0.4, type: "shot", angle: 2 },
  ];
  const result = core.collectShots(events, 0, 1, 2);
  assert.equal(result.shots.length, 2);
  assert.equal(result.nextIndex, 4);
  assert.equal(core.collectShots(events, result.nextIndex, 1, 2).shots.length, 0);
});
