const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../equipment-data.js");
const core = require("../equipment-core.js");

const base = { damage: 12, fireInterval: 0.22, speed: 760, range: 1064, size: 3 };

test("shotgun snapshots remain shotgun profiles after equipping a rifle", () => {
  const live = core.buildFireProfile(base, { weapon: "breach-shotgun" }, [], data);
  const recorded = core.snapshotFireProfile(live);
  const next = core.buildFireProfile(base, { weapon: "pulse-rifle" }, [], data);
  assert.equal(recorded.weaponId, "breach-shotgun");
  assert.equal(recorded.count, 5);
  assert.equal(next.weaponId, "pulse-rifle");
  assert.equal(next.count, 1);
});

test("rifle snapshots preserve penetration after switching to carbine", () => {
  const recorded = core.snapshotFireProfile(
    core.buildFireProfile(base, { weapon: "pulse-rifle" }, [], data)
  );
  core.buildFireProfile(base, { weapon: "phase-carbine" }, [], data);
  assert.equal(recorded.pierce, 2);
  assert.equal(recorded.fireType, "rifle");
});

test("fire event snapshots deeply copy visual data and survive later mutations", () => {
  const profile = {
    damage: 12,
    count: 1,
    visualProfile: { color: "#fff", icon: "A", profile: "carbine" },
  };
  const shot = core.snapshotFireProfile(profile);
  profile.damage = 999;
  profile.visualProfile.color = "#000";
  assert.equal(shot.damage, 12);
  assert.equal(shot.visualProfile.color, "#fff");
  assert.doesNotThrow(() => JSON.stringify(shot));
});

test("legacy shot events receive safe default replay fields", () => {
  const legacy = core.snapshotFireProfile({ damage: 8, count: 2, spread: 0.1 });
  assert.equal(legacy.weaponId, null);
  assert.equal(legacy.speed, 760);
  assert.equal(legacy.range, 1064);
  assert.equal(legacy.echoBaseDamage, 8);
  assert.equal(legacy.coreDamageMultiplier, 1);
});

test("Echo damage applies recorded damage, Echo ratio, and Overdrive exactly once", () => {
  const profile = { damage: 11.04, echoBaseDamage: 12 };
  assert.equal(core.calculateProjectileDamage(profile), 11.04);
  assert.equal(
    core.calculateProjectileDamage(profile, {
      isEcho: true,
      echoRatio: 0.65 * 1.25,
      overdriveEchoMultiplier: 1.3,
    }),
    12 * (0.65 * 1.25) * 1.3
  );
});
