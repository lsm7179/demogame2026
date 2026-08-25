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

test("corrupted Echo replay remains inside its spawn zone", () => {
  const bounds = { x: 900, y: 80, w: 1150, h: 920 };
  assert.deepEqual(core.clampPoseToZone({ x: 2600, y: -300, angle: 1 }, bounds, 30), {
    x: 2020,
    y: 110,
    angle: 1,
  });
  assert.deepEqual(core.clampPoseToZone({ x: 1400, y: 500 }, bounds, 30), {
    x: 1400,
    y: 500,
  });
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
