(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ZoneObjectiveCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function createProgress(world) {
    return Object.fromEntries(
      world.zones.map((zone, index) => [
        zone.id,
        { active: index === 0, entered: false, complete: false, elapsed: 0 },
      ])
    );
  }

  function entitiesInZone(entities, zone, predicate = () => true) {
    return entities.filter(
      (entity) =>
        predicate(entity) &&
        (entity.zoneId === zone.id ||
          (entity.x >= zone.x &&
            entity.x <= zone.x + zone.w &&
            entity.y >= zone.y &&
            entity.y <= zone.y + zone.h))
    );
  }

  function thresholdForEscort(config, difficultyId) {
    return config.minSurvivors?.[difficultyId] ?? config.minSurvivors?.operative ?? 1;
  }

  function evaluate(zone, record, gate, context, dt) {
    const entered = record.entered || context.currentZoneId === zone.id;
    const elapsed = record.elapsed + (entered && !record.complete ? dt : 0);
    const living = entitiesInZone(context.enemies, zone, (enemy) => enemy.alive);
    const pending = entitiesInZone(context.warnings, zone);
    let complete = record.complete;

    if (zone.objective === "advance") complete ||= entered && context.player.x >= gate.x - 120;
    if (zone.objective === "eliminate")
      complete ||= entered && living.length + pending.length === 0;
    if (zone.objective === "elite")
      complete ||=
        entered &&
        !living.some((enemy) => enemy.elite || enemy.boss) &&
        !pending.some((enemy) => enemy.elite || context.monsters[enemy.type]?.boss);
    if (zone.objective === "switch") {
      const device = context.switches.find((item) => item.id === gate.switchId);
      complete = Boolean(device && device.charge >= (device.threshold || 42));
    }
    if (zone.objective === "escort") {
      const minimum = thresholdForEscort(gate, context.difficultyId);
      complete ||=
        entered &&
        context.shuttle?.survivors >= minimum &&
        !living.some((enemy) => enemy.targetShuttle) &&
        !pending.some((enemy) => enemy.targetShuttle);
    }
    if (zone.objective === "survive") {
      const corruptions = living.filter((enemy) => enemy.type === "corrupted-echo");
      const pendingCorruptions = pending.filter((enemy) => enemy.type === "corrupted-echo");
      complete ||=
        entered &&
        (elapsed >= (gate.surviveSeconds || 10) ||
          (elapsed >= 1 && corruptions.length + pendingCorruptions.length === 0));
    }
    if (zone.objective === "synchronize") {
      const devices = context.switches.filter((item) => item.syncGroup === gate.syncGroup);
      const active = devices.filter((item) => item.charge >= (item.threshold || 60));
      const sources = new Set(active.flatMap((item) => item.hitSources || []));
      complete ||=
        entered &&
        active.length >= (gate.requiredDevices || devices.length) &&
        sources.has("player") &&
        sources.has("echo");
    }
    return { active: record.active, entered, complete, elapsed };
  }

  function tick(progress, world, context, dt) {
    const next = {};
    for (let index = 0; index < world.zones.length; index++) {
      const zone = world.zones[index];
      const previousComplete = index === 0 || next[world.zones[index - 1].id].complete;
      const record = { ...(progress[zone.id] || {}), active: previousComplete };
      const gate = world.progressionGates?.find((item) => item.zoneId === zone.id);
      next[zone.id] = gate && previousComplete ? evaluate(zone, record, gate, context, dt) : record;
    }
    return next;
  }

  function shortStatus(zone, record, gate, context) {
    if (!zone || !record) return "구역 진입";
    if (record.complete) return "봉쇄 해제";
    if (zone.objective === "advance") return "다음 봉쇄선으로 이동";
    if (zone.objective === "eliminate") return "필수 오염체 제거";
    if (zone.objective === "elite") return "RIFT WARDEN 처치";
    if (zone.objective === "switch") return "Echo로 시간 스위치 유지";
    if (zone.objective === "escort") {
      const minimum = thresholdForEscort(gate, context.difficultyId);
      return `구조선 방어 · 생존자 ${context.shuttle?.survivors || 0}/${minimum}`;
    }
    if (zone.objective === "survive")
      return `오염 기록 생존 · ${Math.max(0, (gate.surviveSeconds || 10) - record.elapsed).toFixed(1)}초`;
    if (zone.objective === "synchronize")
      return `수렴 장치 동시 활성화 · Echo ${gate.requiredEchoes || 1}+`;
    if (zone.objective === "final-boss") return "PRIME WEAVER 처치";
    return "릴레이 동기화 후 Anchor 파괴";
  }

  return Object.freeze({ createProgress, shortStatus, tick });
});
