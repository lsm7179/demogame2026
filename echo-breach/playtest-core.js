(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PlaytestCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_RUNS = 50;

  function createRun(meta = {}) {
    return {
      version: 2,
      startedAt: meta.startedAt || new Date().toISOString(),
      stageId: meta.stageId || "unknown",
      difficulty: meta.difficulty || "operative",
      loadout: { weapon: null, armor: null, relic: null, ...(meta.loadout || {}) },
      upgrades: Array.isArray(meta.upgrades) ? [...meta.upgrades] : [],
      movementDistance: 0,
      idleSeconds: 0,
      playerShots: 0,
      echoShots: 0,
      damageSources: {},
      zoneSeconds: {},
      rewardChoices: [],
    };
  }

  function addDamageSource(run, source, amount) {
    const next = { ...run, damageSources: { ...run.damageSources } };
    const key = source || "unknown";
    next.damageSources[key] = (next.damageSources[key] || 0) + Math.max(0, Number(amount) || 0);
    return next;
  }

  function addSample(run, sample) {
    const dt = Math.max(0, Number(sample.dt) || 0);
    const next = { ...run, zoneSeconds: { ...run.zoneSeconds } };
    next.movementDistance += Math.max(0, Number(sample.distance) || 0);
    if ((Number(sample.speed) || 0) < 12) next.idleSeconds += dt;
    if (sample.zoneId)
      next.zoneSeconds[sample.zoneId] = (next.zoneSeconds[sample.zoneId] || 0) + dt;
    return next;
  }

  function finishRun(run, result) {
    const coreHits = Math.max(0, Number(result.totalCoreHits) || 0);
    return {
      ...run,
      finishedAt: result.finishedAt || new Date().toISOString(),
      outcome: result.win ? "clear" : "failed",
      activeSeconds: Math.max(0, Number(result.activeSeconds) || 0),
      loops: Math.max(1, Number(result.loops) || 1),
      echoes: Math.max(0, Number(result.echoes) || 0),
      kills: Math.max(0, Number(result.kills) || 0),
      damageTaken: Math.max(0, Number(result.damageTaken) || 0),
      score: Math.max(0, Number(result.score) || 0),
      coreDamage: Math.max(0, Number(result.coreDamage) || 0),
      echoCoreRatio: coreHits ? Math.max(0, Number(result.echoCoreHits) || 0) / coreHits : 0,
      bestCombo: Math.max(0, Number(result.bestCombo) || 0),
      overloads: Math.max(0, Number(result.overloads) || 0),
      deathCause: result.deathCause || null,
    };
  }

  function normalizeRuns(raw, maxRuns = MAX_RUNS) {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((run) => run && typeof run === "object" && typeof run.stageId === "string")
      .slice(-Math.max(1, maxRuns))
      .map((run) => JSON.parse(JSON.stringify(run)));
  }

  function summarizeRuns(runs) {
    const valid = normalizeRuns(runs).filter((run) => Number.isFinite(run.activeSeconds));
    const total = valid.length;
    const clears = valid.filter((run) => run.outcome === "clear");
    const average = (items, field) =>
      items.length
        ? items.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) / items.length
        : 0;
    const deathCauses = {};
    for (const run of valid)
      if (run.deathCause) deathCauses[run.deathCause] = (deathCauses[run.deathCause] || 0) + 1;
    return {
      runs: total,
      clears: clears.length,
      clearRate: total ? clears.length / total : 0,
      averageClearSeconds: average(clears, "activeSeconds"),
      averageLoops: average(valid, "loops"),
      averageEchoes: average(valid, "echoes"),
      averageDamageTaken: average(valid, "damageTaken"),
      averageIdleSeconds: average(valid, "idleSeconds"),
      deathCauses,
    };
  }

  return {
    MAX_RUNS,
    createRun,
    addDamageSource,
    addSample,
    finishRun,
    normalizeRuns,
    summarizeRuns,
  };
});
