"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const TemporalCore = require("../temporal-core.js");
const balance = require("../game-balance.js");

test("Chrono Shards fill and automatically trigger Overdrive", () => {
  const state = TemporalCore.collectShard(
    { overdriveGauge: 92, overdriveTimer: 0 },
    10,
    balance.overdrive
  );
  assert.equal(state.overdriveGauge, 0);
  assert.equal(state.overdriveTimer, 8);
  assert.equal(TemporalCore.tickOverdrive(state, 8).overdriveTimer, 0);
});

test("anchor phases cross each threshold once in order", () => {
  assert.deepEqual(
    [1, 0.74, 0.49, 0.24, 0].map((ratio) => TemporalCore.anchorPhase(ratio, balance.anchorPhases)),
    ["armored", "cracked", "unstable", "critical", "collapsed"]
  );
});

test("Temporal Overload requires both hit window and cooldown", () => {
  const input = { now: 5, playerHitAt: 4.9, echoHitAt: 4.72, lastOverloadAt: 2, shieldOpen: true };
  assert.equal(TemporalCore.canTemporalOverload(input, balance.overload), true);
  assert.equal(
    TemporalCore.canTemporalOverload({ ...input, echoHitAt: 4.5 }, balance.overload),
    false
  );
  assert.equal(
    TemporalCore.canTemporalOverload({ ...input, lastOverloadAt: 4.5 }, balance.overload),
    false
  );
  assert.equal(
    TemporalCore.canTemporalOverload({ ...input, shieldOpen: false }, balance.overload),
    false
  );
});
