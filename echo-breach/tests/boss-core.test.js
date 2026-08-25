const test = require("node:test");
const assert = require("node:assert/strict");
const BossCore = require("../boss-core.js");
const BossData = require("../boss-data.js");

test("boss shields require player and Echo hits inside the configured window", () => {
  const config = BossData["rift-warden"];
  const first = BossCore.registerShieldHit({}, false, 2, config);
  assert.equal(first.opened, false);
  const synced = BossCore.registerShieldHit(first.state, true, 2.3, config);
  assert.equal(synced.opened, true);
  assert.equal(BossCore.shieldOpen(synced.state, 5), true);
  assert.equal(BossCore.shieldOpen(synced.state, 6), false);
});

test("final boss phase two changes pattern without hidden attacks", () => {
  const config = BossData["chrono-abomination"];
  assert.equal(BossCore.phaseFor(260, 520, config), 2);
  const first = BossCore.attackProfile(config, 1);
  const second = BossCore.attackProfile(config, 2);
  assert.ok(second.projectileCount > first.projectileCount);
  assert.ok(second.cooldown < first.cooldown);
  assert.ok(second.telegraphSeconds >= 0.7);
});

test("Prime Weaver exposes three telegraphed phases through data", () => {
  const config = BossData["prime-weaver"];
  assert.equal(BossCore.phaseFor(760, 760, config), 1);
  assert.equal(BossCore.phaseFor(500, 760, config), 2);
  assert.equal(BossCore.phaseFor(250, 760, config), 3);
  const phases = [1, 2, 3].map((phase) => BossCore.attackProfile(config, phase));
  assert.ok(phases[2].projectileCount > phases[1].projectileCount);
  assert.ok(phases[2].cooldown < phases[0].cooldown);
  assert.ok(phases.every((profile) => profile.telegraphSeconds >= 0.9));
});

test("boss movement follows deterministic time paths without player input", () => {
  const config = BossData["rift-warden"];
  const atStart = BossCore.movementPose(config, 0, 1);
  const repeated = BossCore.movementPose(config, 0, 1);
  const beforeMove = BossCore.movementPose(config, config.movement.holdSeconds - 0.2, 1);
  const inTransit = BossCore.movementPose(config, config.movement.holdSeconds + 0.5, 1);
  assert.deepEqual(atStart, repeated);
  assert.equal(atStart.x, -150);
  assert.equal(beforeMove.preparing, true);
  assert.equal(inTransit.moving, true);
  assert.ok(inTransit.x > -150 && inTransit.x < 150);
});

test("Prime Weaver movement paths vary by phase but remain reproducible", () => {
  const config = BossData["prime-weaver"];
  const elapsed = config.movement.holdSeconds + 0.8;
  const phaseOne = BossCore.movementPose(config, elapsed, 1);
  const phaseTwo = BossCore.movementPose(config, elapsed, 2);
  assert.deepEqual(phaseTwo, BossCore.movementPose(config, elapsed, 2));
  assert.notDeepEqual({ x: phaseOne.x, y: phaseOne.y }, { x: phaseTwo.x, y: phaseTwo.y });
});
