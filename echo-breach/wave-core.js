(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WaveCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function expandZoneWaves(zone) {
    const groups = zone.waveGroups || [{ delay: 0.7, enemies: zone.waves || [] }];
    let spawnIndex = 0;
    return groups.flatMap((group, groupIndex) =>
      group.enemies.map((type, enemyIndex) => ({
        ...zone.spawnPoints[spawnIndex++ % zone.spawnPoints.length],
        type,
        zoneId: zone.id,
        groupId: `${zone.id}-${groupIndex}`,
        activationDelay: Math.max(0.45, (group.delay || 0) + enemyIndex * 0.18),
        armed: false,
        elite: Boolean(group.elite),
        targetShuttle: Boolean(group.targetShuttle),
      }))
    );
  }
  function tickWarning(warning, dt, activeZoneId) {
    if (!warning.armed && warning.zoneId && warning.zoneId !== activeZoneId) return { ...warning };
    const armed = true;
    const timer = Math.max(0, (warning.timer ?? warning.activationDelay ?? 0.7) - dt);
    return { ...warning, armed, timer };
  }
  return Object.freeze({ expandZoneWaves, tickWarning });
});
