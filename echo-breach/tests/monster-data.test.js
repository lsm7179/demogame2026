"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const monsters = require("../monster-data.js");

test("original monster archetypes preserve the established combat balance", () => {
  assert.deepEqual(
    Object.fromEntries(
      ["chaser", "shooter", "blocker"].map((id) => {
        const m = monsters[id];
        return [id, [m.radius, m.hp, m.speed, m.score]];
      })
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

test("new temporal monsters expose data-driven behavior and rewards", () => {
  assert.equal(monsters.leech.behavior, "leech");
  assert.equal(monsters["core-guard"].behavior, "guard-core");
  assert.equal(monsters.exploder.behavior, "explode");
  for (const id of ["leech", "core-guard", "exploder"]) {
    assert.ok(monsters[id].reward >= 10);
    assert.ok(monsters[id].visual);
  }
});

test("corrupted Echo is a distinct record-replay threat", () => {
  const monster = MonsterData["corrupted-echo"];
  assert.equal(monster.behavior, "corrupted-replay");
  assert.equal(monster.visual, "corrupted");
  assert.ok(monster.hp > MonsterData.shooter.hp);
});

test("relay guards fall back to the room core when a combat room has no relays", () => {
  const core = { x: 640, y: 335 };
  assert.equal(monsters.selectGuardTarget([], core, { x: 100, y: 100 }), core);
  const relays = [
    { x: 100, y: 100 },
    { x: 500, y: 500 },
  ];
  assert.equal(monsters.selectGuardTarget(relays, core, { x: 450, y: 450 }), relays[1]);
});
