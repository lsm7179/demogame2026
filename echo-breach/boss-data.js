(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.BossData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return Object.freeze({
    "rift-warden": Object.freeze({
      id: "rift-warden",
      tier: "midboss",
      shieldSyncWindow: 0.35,
      shieldOpenSeconds: 3.2,
      attackCooldown: 2.8,
      telegraphSeconds: 0.75,
      projectileCount: 5,
      projectileSpeed: 185,
      projectileDamage: 10,
      dashSpeed: 520,
      dashSeconds: 0.34,
      patternSets: Object.freeze([Object.freeze(["charge", "fan", "echo-fan"])]),
    }),
    "chrono-abomination": Object.freeze({
      id: "chrono-abomination",
      tier: "boss",
      shieldSyncWindow: 0.35,
      shieldOpenSeconds: 4,
      phaseThreshold: 0.5,
      attackCooldown: 3.1,
      phaseTwoCooldown: 2.25,
      telegraphSeconds: 0.9,
      projectileCount: 8,
      phaseTwoProjectileCount: 12,
      projectileSpeed: 205,
      projectileDamage: 11,
      patternSets: Object.freeze([
        Object.freeze(["pursuit-fan", "radial"]),
        Object.freeze(["rift-ring", "safe-sector"]),
      ]),
    }),
    "prime-weaver": Object.freeze({
      id: "prime-weaver",
      tier: "final-boss",
      shieldSyncWindow: 0.4,
      shieldOpenSeconds: 3.6,
      phaseThresholds: Object.freeze([0.68, 0.34]),
      attackCooldowns: Object.freeze([3.2, 2.55, 2.05]),
      projectileCounts: Object.freeze([8, 12, 16]),
      projectileSpeeds: Object.freeze([190, 215, 235]),
      projectileDamages: Object.freeze([10, 11, 12]),
      telegraphSeconds: 0.95,
      patternSets: Object.freeze([
        Object.freeze(["barrier-lines", "fan"]),
        Object.freeze(["corrupt-summon", "memory-volley"]),
        Object.freeze(["convergence-burst", "safe-sector"]),
      ]),
    }),
  });
});
