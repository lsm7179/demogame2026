"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const GameBalance = require("../game-balance.js");

test("automatic fire cadence matches the v0.2.0 balance contract", () => {
  assert.equal(GameBalance.baseFireInterval, 0.22);
  assert.ok(Math.abs(1 / GameBalance.baseFireInterval - 4.5454545) < 1e-6);
});

test("Split Shot fires two projectiles at 70 percent damage and plus-minus five degrees", () => {
  assert.equal(GameBalance.splitShot.projectileCount, 2);
  assert.equal(GameBalance.splitShot.damageMultiplier, 0.7);
  assert.ok(Math.abs(GameBalance.splitShot.spread / 2 - (5 * Math.PI) / 180) < 1e-12);
  assert.equal(GameBalance.splitShot.projectileCount * GameBalance.splitShot.damageMultiplier, 1.4);
});

test("Charge Lance automatically releases at the full-charge duration", () => {
  assert.equal(GameBalance.chargeLance.fullChargeSeconds, 1.25);
});

test("Temporal Overdrive uses the configured eight-second combat modifiers", () => {
  assert.deepEqual(GameBalance.overdrive, {
    maxGauge: 100,
    duration: 8,
    playerFireRateMultiplier: 1.25,
    echoDamageMultiplier: 1.3,
    anchorDamageMultiplier: 1.5,
    pickupLife: 12,
    pickupRadius: 135,
  });
});
