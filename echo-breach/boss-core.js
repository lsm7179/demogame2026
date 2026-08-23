(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.BossCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function registerShieldHit(state, byEcho, time, config) {
    const next = { ...state, [byEcho ? "lastEchoHit" : "lastPlayerHit"]: time };
    const synced =
      Number.isFinite(next.lastEchoHit) &&
      Number.isFinite(next.lastPlayerHit) &&
      Math.abs(next.lastEchoHit - next.lastPlayerHit) <= config.shieldSyncWindow;
    if (synced) next.shieldOpenUntil = time + config.shieldOpenSeconds;
    return { state: next, opened: synced };
  }
  function shieldOpen(state, time) {
    return (state.shieldOpenUntil || 0) > time;
  }
  function phaseFor(hp, maxHp, config) {
    if (Array.isArray(config.phaseThresholds)) {
      const ratio = hp / Math.max(1, maxHp);
      return 1 + config.phaseThresholds.filter((threshold) => ratio <= threshold).length;
    }
    return hp / Math.max(1, maxHp) <= (config.phaseThreshold ?? 0) ? 2 : 1;
  }
  function attackProfile(config, phase) {
    const index = Math.max(0, phase - 1);
    if (config.attackCooldowns)
      return {
        cooldown: config.attackCooldowns[index] ?? config.attackCooldowns.at(-1),
        projectileCount: config.projectileCounts[index] ?? config.projectileCounts.at(-1),
        projectileSpeed: config.projectileSpeeds[index] ?? config.projectileSpeeds.at(-1),
        projectileDamage: config.projectileDamages[index] ?? config.projectileDamages.at(-1),
        telegraphSeconds: config.telegraphSeconds,
      };
    return {
      cooldown:
        phase === 2 ? config.phaseTwoCooldown || config.attackCooldown : config.attackCooldown,
      projectileCount:
        phase === 2
          ? config.phaseTwoProjectileCount || config.projectileCount
          : config.projectileCount,
      projectileSpeed: config.projectileSpeed,
      projectileDamage: config.projectileDamage,
      telegraphSeconds: config.telegraphSeconds,
    };
  }
  return Object.freeze({ registerShieldHit, shieldOpen, phaseFor, attackProfile });
});
