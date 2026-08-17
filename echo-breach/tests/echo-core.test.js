"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const EchoCore = require("../echo-core.js");

const EPSILON = 1e-9;

test("snapshot scheduling is elapsed-time based", () => {
  assert.equal(EchoCore.shouldSample(0.049, 0.05), false);
  assert.equal(EchoCore.shouldSample(0.05, 0.05), true);
  assert.equal(EchoCore.shouldSample(0.049, 0.05, true), true);
  assert.equal(EchoCore.shouldSample(0.05 - 5e-7, 0.05), true);
});

test("position and aim interpolate between neighboring time samples", () => {
  const samples = [
    { t: 0, x: 10, y: 30, a: 0 },
    { t: 0.1, x: 30, y: 50, a: Math.PI / 2 },
  ];

  const pose = EchoCore.interpolatePose(samples, 0.05);
  assert.equal(pose.x, 20);
  assert.equal(pose.y, 40);
  assert.ok(Math.abs(pose.angle - Math.PI / 4) < EPSILON);
  assert.equal(pose.sampleIndex, 0);
});

test("replay pose depends on elapsed time rather than update frequency", () => {
  const samples = [
    { t: 0, x: 0, y: 0, a: 0 },
    { t: 0.05, x: 10, y: 5, a: 0.2 },
    { t: 0.1, x: 20, y: 20, a: 0.4 },
  ];

  const direct = EchoCore.interpolatePose(samples, 0.075);
  [0.016, 0.033, 0.051, 0.075].forEach((elapsed) => EchoCore.interpolatePose(samples, elapsed));
  const afterIrregularUpdates = EchoCore.interpolatePose(samples, 0.075);

  assert.deepEqual(afterIrregularUpdates, direct);
  assert.equal(direct.x, 15);
  assert.ok(Math.abs(direct.y - 12.5) < EPSILON);
});

test("aim interpolation takes the shortest path across the angle seam", () => {
  const degrees = (value) => (value * Math.PI) / 180;
  const pose = EchoCore.interpolatePose(
    [
      { t: 0, x: 0, y: 0, a: degrees(350) },
      { t: 1, x: 0, y: 0, a: degrees(10) },
    ],
    0.5
  );

  assert.ok(Math.abs(Math.sin(pose.angle)) < EPSILON);
  assert.ok(Math.cos(pose.angle) > 0.999999);
});

test("shot and dash events fire once when their recorded time becomes due", () => {
  const chargeProfile = {
    weapon: "charge",
    a: 1.2,
    count: 1,
    spread: 0,
    damage: 24,
    pierce: 5,
    size: 8,
    speed: 800,
    charge: 1,
  };
  const events = [
    { t: 0.1, type: "dash", x: 1, y: 0 },
    { t: 0.2, type: "shot", profile: chargeProfile },
  ];

  const first = EchoCore.collectDueEvents(events, 0, 0.095);
  assert.deepEqual(
    first.events.map((event) => event.type),
    ["dash"]
  );
  assert.equal(first.nextIndex, 1);

  const second = EchoCore.collectDueEvents(events, first.nextIndex, 0.192);
  assert.deepEqual(
    second.events.map((event) => event.type),
    ["shot"]
  );
  assert.equal(second.events[0].profile, chargeProfile);
  assert.equal(second.nextIndex, 2);

  const noDuplicates = EchoCore.collectDueEvents(events, second.nextIndex, 1);
  assert.deepEqual(noDuplicates.events, []);
  assert.equal(noDuplicates.nextIndex, 2);
});

test("completed recordings retain only the newest Echo slots", () => {
  const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const next = EchoCore.appendRecording(original, { id: 5 }, 4);

  assert.deepEqual(next, [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]);
  assert.deepEqual(original, [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
});

test("empty recordings return no replay pose", () => {
  assert.equal(EchoCore.interpolatePose([], 1), null);
});

test("automatic fire only runs during live play with the pointer inside", () => {
  const ready = { mode: "playing", paused: false, mouseInside: true, alive: true };
  assert.equal(EchoCore.canAutoFire(ready), true);
  assert.equal(EchoCore.canAutoFire({ ...ready, mode: "loopTransition" }), false);
  assert.equal(EchoCore.canAutoFire({ ...ready, paused: true }), false);
  assert.equal(EchoCore.canAutoFire({ ...ready, mouseInside: false }), false);
  assert.equal(EchoCore.canAutoFire({ ...ready, alive: false }), false);
});
