"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { nearestOpenPoint, overlaps, moveCircle } = require("../collision-core.js");

const bounds = { minX: 15, maxX: 300, minY: 15, maxY: 220 };
const wall = { x: 120, y: 30, w: 20, h: 160, open: false };

test("a fast dash cannot tunnel through a closed wall", () => {
  const actor = { x: 70, y: 100, r: 15 };
  const result = moveCircle(actor, 180, 0, [wall], bounds);
  assert.equal(result.blockedX, true);
  assert.equal(actor.x, wall.x - actor.r);
  assert.equal(overlaps(actor, wall), false);
});

test("diagonal movement slides along a wall without getting stuck", () => {
  const actor = { x: 100, y: 70, r: 15 };
  moveCircle(actor, 60, 80, [wall], bounds);
  assert.equal(actor.x, wall.x - actor.r);
  assert.ok(actor.y > 130);
  assert.equal(overlaps(actor, wall), false);
});

test("vertical contact resolves on the vertical axis", () => {
  const horizontal = { x: 40, y: 100, w: 180, h: 20, open: false };
  const actor = { x: 80, y: 70, r: 15 };
  moveCircle(actor, 0, 70, [horizontal], bounds);
  assert.equal(actor.y, horizontal.y - actor.r);
  assert.equal(overlaps(actor, horizontal), false);
});

test("a stationary actor is expelled when a gate closes around it", () => {
  const actor = { x: 130, y: 100, r: 15 };
  moveCircle(actor, 0, 0, [wall], bounds);
  assert.equal(overlaps(actor, wall), false);
});

test("open walls never block movement", () => {
  const actor = { x: 70, y: 100, r: 15 };
  moveCircle(actor, 180, 0, [{ ...wall, open: true }], bounds);
  assert.ok(Math.abs(actor.x - 250) < 1e-9);
});

test("targets inside walls resolve to the nearest deterministic open point", () => {
  const target = nearestOpenPoint({ x: 130, y: 100 }, [wall], bounds, 15);
  assert.deepEqual(target, { x: 105, y: 100 });
  assert.deepEqual(nearestOpenPoint({ x: 130, y: 100 }, [wall], bounds, 15), target);
  assert.equal(overlaps({ ...target, r: 15 }, wall), false);
});
