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
