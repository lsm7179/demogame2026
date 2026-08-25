(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WaveCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function spawnDelayFor({
    baseDelay = 0.7,
    enemyIndex = 0,
    isBoss = false,
    spawnDelayMultiplier = 1,
    minimumSpawnInterval = 0.08,
  }) {
    if (isBoss) return Math.max(0.45, baseDelay + enemyIndex * 0.18);
    const interval = Math.max(minimumSpawnInterval, 0.18 * spawnDelayMultiplier);
    return Math.max(minimumSpawnInterval, baseDelay * spawnDelayMultiplier + enemyIndex * interval);
  }

  function expandZoneWaves(zone, options = {}) {
    const groups = zone.waveGroups || [{ delay: 0.7, enemies: zone.waves || [] }];
    let spawnIndex = 0;
    return groups.flatMap((group, groupIndex) =>
      group.enemies.map((type, enemyIndex) => {
        const isBoss = Boolean(options.isBoss?.(type));
        return {
          ...zone.spawnPoints[spawnIndex++ % zone.spawnPoints.length],
          type,
          zoneId: zone.id,
          groupId: `${zone.id}-${groupIndex}`,
          activationDelay: spawnDelayFor({
            baseDelay: group.delay || 0,
            enemyIndex,
            isBoss,
            spawnDelayMultiplier: options.spawnDelayMultiplier,
            minimumSpawnInterval: options.minimumSpawnInterval,
          }),
          armed: false,
          elite: Boolean(group.elite),
          targetShuttle: Boolean(group.targetShuttle),
        };
      })
    );
  }
  function tickWarning(warning, dt, activeZoneId) {
    if (!warning.armed && warning.zoneId && warning.zoneId !== activeZoneId) return { ...warning };
    const armed = true;
    const timer = Math.max(0, (warning.timer ?? warning.activationDelay ?? 0.7) - dt);
    return { ...warning, armed, timer };
  }
  return Object.freeze({ expandZoneWaves, spawnDelayFor, tickWarning });
});
