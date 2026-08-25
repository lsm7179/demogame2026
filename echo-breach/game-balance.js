(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.GameBalance = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const monsterTempo = Object.freeze({
    spawnDelayMultiplier: 0.25,
    bossSpawnDelayMultiplier: 0.15,
    monsterHpMultiplier: 0.7,
    bossHpMultiplier: 0.6,
    minimumSpawnInterval: 0.08,
    minimumBossSpawnDelay: 0.25,
    maximumBossSpawnDelay: 2,
  });

  function scaledMonsterHp(baseHp, isBoss = false) {
    return Math.max(
      1,
      baseHp * (isBoss ? monsterTempo.bossHpMultiplier : monsterTempo.monsterHpMultiplier)
    );
  }

  const playerCombat = Object.freeze({
    damageMultiplier: 1.3,
    projectileSizeMultiplier: 1.3,
    enemyHurtboxMultiplier: 1.3,
  });

  function playerProjectileHitRadius(projectileRadius, enemyRadius) {
    return projectileRadius + enemyRadius * playerCombat.enemyHurtboxMultiplier;
  }

  return Object.freeze({
    baseFireInterval: 0.22,
    splitShot: Object.freeze({
      projectileCount: 2,
      spread: (10 * Math.PI) / 180,
      damageMultiplier: 0.7,
    }),
    chargeLance: Object.freeze({
      fullChargeSeconds: 1.25,
    }),
    monsterTempo,
    scaledMonsterHp,
    playerCombat,
    playerProjectileHitRadius,
    overdrive: Object.freeze({
      maxGauge: 100,
      duration: 8,
      playerFireRateMultiplier: 1.25,
      echoDamageMultiplier: 1.3,
      anchorDamageMultiplier: 1.5,
      pickupLife: 12,
      pickupRadius: 135,
    }),
    overload: Object.freeze({ window: 0.25, cooldown: 1.2, bonusDamage: 28, overdriveBonus: 1.5 }),
    anchorPhases: Object.freeze([
      Object.freeze({ threshold: 0.75, id: "cracked" }),
      Object.freeze({ threshold: 0.5, id: "unstable" }),
      Object.freeze({ threshold: 0.25, id: "critical" }),
    ]),
  });
});
