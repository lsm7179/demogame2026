const test = require("node:test");
const assert = require("node:assert/strict");
const AudioCore = require("../audio-core.js");

test("audio settings recover safely and clamp persisted volume", () => {
  assert.deepEqual(AudioCore.normalizeSettings(null), { music: 0.42, effects: 0.72 });
  assert.deepEqual(AudioCore.normalizeSettings({ music: 2, effects: -1 }), {
    music: 1,
    effects: 0,
  });
});

test("music scenes follow combat depth and boss presence", () => {
  assert.equal(AudioCore.sceneFor({ zoneIndex: 0, zoneCount: 3 }), "combat");
  assert.equal(AudioCore.sceneFor({ zoneIndex: 2, zoneCount: 3 }), "tension");
  assert.equal(AudioCore.sceneFor({ bossAlive: true, zoneIndex: 0, zoneCount: 3 }), "boss");
});

test("procedural score timing is deterministic", () => {
  assert.ok(AudioCore.beatDuration("boss") < AudioCore.beatDuration("combat"));
  assert.equal(AudioCore.noteFor("combat", 0), AudioCore.noteFor("combat", 4));
});
