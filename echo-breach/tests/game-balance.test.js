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

test("regular monster health scales to 70 percent and boss health scales to 60 percent", () => {
  assert.equal(GameBalance.monsterTempo.monsterHpMultiplier, 0.7);
  assert.equal(GameBalance.monsterTempo.bossHpMultiplier, 0.6);
  assert.equal(GameBalance.scaledMonsterHp(95, false), 66.5);
  assert.equal(GameBalance.scaledMonsterHp(280, true), 168);
  assert.equal(GameBalance.scaledMonsterHp(520, true), 312);
  assert.equal(GameBalance.scaledMonsterHp(760, true), 456);
});

test("boss staging uses the faster capped spawn timing", () => {
  assert.equal(GameBalance.monsterTempo.bossSpawnDelayMultiplier, 0.15);
  assert.equal(GameBalance.monsterTempo.minimumBossSpawnDelay, 0.25);
  assert.equal(GameBalance.monsterTempo.maximumBossSpawnDelay, 2);
  assert.equal(GameBalance.monsterTempo.spawnDelayMultiplier, 0.25);
});

test("player combat gains thirty percent damage, projectile size, and enemy hurtbox", () => {
  assert.deepEqual(GameBalance.playerCombat, {
    damageMultiplier: 1.3,
    projectileSizeMultiplier: 1.3,
    enemyHurtboxMultiplier: 1.3,
  });
  assert.equal(GameBalance.playerProjectileHitRadius(3.9, 20), 29.9);
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
