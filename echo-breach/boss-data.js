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
    }),
  });
});
