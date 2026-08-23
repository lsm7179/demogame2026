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
