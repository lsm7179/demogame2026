const test = require("node:test");
const assert = require("node:assert/strict");
const SynergyCore = require("../synergy-core.js");

test("crossfire requires opposite timelines and respects its cooldown", () => {
  const player = SynergyCore.registerHit({}, false, 1);
  const echo = SynergyCore.registerHit(player.state, true, 1.2);
  assert.equal(echo.crossfire, true);
  assert.equal(SynergyCore.registerHit(echo.state, false, 1.25).crossfire, false);
});

test("timeline chain requires alternating kill sources", () => {
  const player = SynergyCore.registerKill({}, false, 2);
  assert.equal(SynergyCore.registerKill(player.state, false, 2.4).chain, false);
  assert.equal(SynergyCore.registerKill(player.state, true, 2.8).chain, true);
});

test("anchor convergence activates at two Echoes and stays capped", () => {
  assert.equal(SynergyCore.convergenceMultiplier(1), 1);
  assert.equal(SynergyCore.convergenceMultiplier(2), 1.15);
  assert.equal(SynergyCore.convergenceMultiplier(4), 1.15);
});
