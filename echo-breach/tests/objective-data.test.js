"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const objectives = require("../objective-data.js");

test("playable stage objectives are valid and fully positioned", () => {
  for (const id of ["awakening", "split-current", "rescue-window"]) {
    assert.equal(objectives.isValid(objectives[id]), true, id);
    assert.equal(objectives[id].relayCount, 2, id);
    assert.equal(objectives[id].requiredRelays, 2, id);
    assert.equal(objectives[id].relayHitsToActivate, 7, id);
  }
});

test("objective validation supports one through four relays", () => {
  for (let count = 1; count <= 4; count++)
    assert.equal(
      objectives.isValid({
        relayCount: count,
        requiredRelays: count,
        relayPositions: Array.from({ length: count }, () => ({ x: 0, y: 0 })),
      }),
      true
    );
});

test("objective validation rejects impossible relay requirements", () => {
  assert.equal(
    objectives.isValid({ relayCount: 2, requiredRelays: 3, relayPositions: [{}, {}] }),
    false
  );
});

test("Prime Anchor uses two seven-hit subcores", () => {
  const prime = objectives["prime-anchor"];
  assert.equal(objectives.isValid(prime), true);
  assert.equal(prime.relayCount, 2);
  assert.equal(prime.requiredRelays, 2);
  assert.equal(prime.relayHitsToActivate, 7);
});

test("a subcore activates on exactly the seventh cumulative hit", () => {
  const config = objectives.awakening;
  let hits = 0;
  let progress;
  for (let index = 0; index < 6; index++) {
    progress = objectives.registerRelayHit(config, hits);
    hits = progress.hits;
  }
  assert.equal(progress.active, false);
  assert.equal(progress.charge, (config.relayChargeMax * 6) / 7);
  progress = objectives.registerRelayHit(config, hits);
  assert.equal(progress.hits, 7);
  assert.equal(progress.charge, config.relayChargeMax);
  assert.equal(progress.active, true);
});
