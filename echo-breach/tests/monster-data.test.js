"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const monsters = require("../monster-data.js");

test("monster archetypes preserve the established combat balance", () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(monsters).map(([id, m]) => [id, [m.radius, m.hp, m.speed, m.score]])
    ),
    {
      chaser: [15, 30, 92, 120],
      shooter: [18, 46, 62, 180],
      blocker: [23, 95, 48, 240],
    }
  );
});

test("monster roles and silhouettes are unique", () => {
  const values = Object.values(monsters);
  assert.equal(new Set(values.map((m) => m.name)).size, values.length);
  assert.equal(new Set(values.map((m) => m.role)).size, values.length);
  assert.equal(new Set(values.map((m) => m.radius)).size, values.length);
});
