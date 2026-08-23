const test = require("node:test");
const assert = require("node:assert/strict");
const PlaytestCore = require("../playtest-core.js");

test("playtest runs collect movement, idle time, zones, and damage immutably", () => {
  const original = PlaytestCore.createRun({
    stageId: "awakening",
    loadout: { weapon: "phase-carbine" },
  });
  const sampled = PlaytestCore.addSample(original, {
    dt: 1,
    distance: 20,
    speed: 0,
    zoneId: "entry",
  });
  const damaged = PlaytestCore.addDamageSource(sampled, "rift-hound", 12);
  assert.equal(original.movementDistance, 0);
  assert.equal(damaged.movementDistance, 20);
  assert.equal(damaged.idleSeconds, 1);
  assert.equal(damaged.zoneSeconds.entry, 1);
  assert.equal(damaged.damageSources["rift-hound"], 12);
});

test("finished playtests preserve combat contribution metrics", () => {
  const result = PlaytestCore.finishRun(PlaytestCore.createRun({ stageId: "awakening" }), {
    win: true,
    activeSeconds: 64,
    loops: 4,
    echoes: 3,
    kills: 18,
    damageTaken: 22,
    totalCoreHits: 20,
    echoCoreHits: 8,
  });
  assert.equal(result.outcome, "clear");
  assert.equal(result.echoCoreRatio, 0.4);
  assert.equal(result.echoes, 3);
});

test("run normalization caps corrupted history and summary remains deterministic", () => {
  const runs = [
    null,
    ...Array.from({ length: 55 }, (_, index) => ({
      stageId: "awakening",
      activeSeconds: index,
      outcome: index % 2 ? "clear" : "failed",
      loops: 2,
      echoes: 1,
    })),
  ];
  const normalized = PlaytestCore.normalizeRuns(runs);
  const summary = PlaytestCore.summarizeRuns(normalized);
  assert.equal(normalized.length, 50);
  assert.equal(summary.runs, 50);
  assert.equal(summary.clears, 25);
  assert.equal(summary.clearRate, 0.5);
});
