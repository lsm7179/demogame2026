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
  function patternFor(config, phase, attackIndex = 0) {
    const set = config.patternSets?.[Math.max(0, phase - 1)] || ["radial"];
    return set[Math.max(0, attackIndex) % set.length];
  }
  function movementPose(config, elapsed, phase = 1) {
    const movement = config?.movement;
    const points = movement?.phasePoints?.[Math.max(0, phase - 1)] || movement?.points;
    if (!points?.length) return null;
    if (points.length === 1)
      return { x: points[0].x, y: points[0].y, moving: false, preparing: false, target: points[0] };
    const hold = Math.max(0, movement.holdSeconds || 0);
    const speed = Math.max(1, movement.moveSpeed || 1);
    const segments = points.map((point, index) => {
      const next = points[(index + 1) % points.length];
      return { point, next, travel: Math.hypot(next.x - point.x, next.y - point.y) / speed };
    });
    const cycle = segments.reduce((sum, segment) => sum + hold + segment.travel, 0);
    let cursor = ((Math.max(0, elapsed) % cycle) + cycle) % cycle;
    for (const segment of segments) {
      if (cursor < hold) {
        return {
          x: segment.point.x,
          y: segment.point.y,
          moving: false,
          preparing: hold - cursor <= (movement.warningSeconds || 0),
          target: segment.next,
        };
      }
      cursor -= hold;
      if (cursor <= segment.travel) {
        const progress = segment.travel > 0 ? cursor / segment.travel : 1;
        const eased = progress * progress * (3 - 2 * progress);
        return {
          x: segment.point.x + (segment.next.x - segment.point.x) * eased,
          y: segment.point.y + (segment.next.y - segment.point.y) * eased,
          moving: true,
          preparing: false,
          target: segment.next,
        };
      }
      cursor -= segment.travel;
    }
    return { x: points[0].x, y: points[0].y, moving: false, preparing: false, target: points[1] };
  }
  return Object.freeze({
    registerShieldHit,
    shieldOpen,
    phaseFor,
    attackProfile,
    patternFor,
    movementPose,
  });
});
