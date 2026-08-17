"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const objectives = require("../objective-data.js");

test("playable stage objectives are valid and fully positioned", () => {
  for (const id of ["awakening", "split-current", "rescue-window"]) {
    assert.equal(objectives.isValid(objectives[id]), true, id);
    assert.equal(objectives[id].relayCount, 2, id);
    assert.equal(objectives[id].requiredRelays, 2, id);
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
