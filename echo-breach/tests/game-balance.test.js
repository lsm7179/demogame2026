"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const GameBalance = require("../game-balance.js");

test("automatic fire cadence matches the v0.2.0 balance contract", () => {
  assert.equal(GameBalance.baseFireInterval, 0.22);
  assert.ok(Math.abs(1 / GameBalance.baseFireInterval - 4.5454545) < 1e-6);
});

test("Split Shot retains three projectiles at 45 percent damage each", () => {
  assert.deepEqual(GameBalance.splitShot, {
    projectileCount: 3,
    spread: 0.16,
    damageMultiplier: 0.45,
  });
  assert.equal(
    GameBalance.splitShot.projectileCount * GameBalance.splitShot.damageMultiplier,
    1.35
  );
});

test("Charge Lance automatically releases at the full-charge duration", () => {
  assert.equal(GameBalance.chargeLance.fullChargeSeconds, 1.25);
});
