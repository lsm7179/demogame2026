"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const layouts = require("../room-data.js");

const starts = {
  awakening: { x: 640, y: 630 },
  "split-current": { x: 220, y: 630 },
  "rescue-window": { x: 640, y: 630 },
};

function blocked(layout, x, y, radius = 15) {
  return layout.walls.some(
    (w) =>
      !w.gate &&
      x + radius > w.x &&
      x - radius < w.x + w.w &&
      y + radius > w.y &&
      y - radius < w.y + w.h
  );
}

function reachable(layout, start, goal) {
  const step = 20;
  const key = (x, y) => `${x},${y}`;
  const snap = (v) => Math.round(v / step) * step;
  const queue = [{ x: snap(start.x), y: snap(start.y) }];
  const seen = new Set([key(queue[0].x, queue[0].y)]);
  while (queue.length) {
    const p = queue.shift();
    if (Math.hypot(p.x - goal.x, p.y - goal.y) < 35) return true;
    for (const [dx, dy] of [
      [step, 0],
      [-step, 0],
      [0, step],
      [0, -step],
    ]) {
      const n = { x: p.x + dx, y: p.y + dy };
      const k = key(n.x, n.y);
      if (n.x < 40 || n.x > 1240 || n.y < 40 || n.y > 680 || seen.has(k)) continue;
      if (blocked(layout, n.x, n.y)) continue;
      seen.add(k);
      queue.push(n);
    }
  }
  return false;
}

test("all playable stages define distinct connected rooms", () => {
  for (const id of ["awakening", "split-current", "rescue-window"]) {
    const layout = layouts[id];
    assert.ok(layout.rooms.length >= 3, `${id} needs at least three rooms`);
    assert.equal(new Set(layout.rooms.map((room) => room.id)).size, layout.rooms.length);
    assert.ok(!blocked(layout, starts[id].x, starts[id].y), `${id} start is clear`);
    for (const spawn of layout.spawnPoints)
      assert.ok(
        reachable(layout, starts[id], spawn),
        `${id} spawn ${spawn.x},${spawn.y} reachable`
      );
  }
});

test("Stage 2 keeps one temporal gate between both halves", () => {
  const layout = layouts["split-current"];
  assert.equal(layout.walls.filter((wall) => wall.gate).length, 1);
  assert.ok(reachable(layout, starts["split-current"], { x: 990, y: 335 }));
});

test("Stage 1 advances through three ordered combat rooms", () => {
  const encounters = layouts.awakening.encounters;
  assert.deepEqual(
    encounters.map((room) => room.id),
    ["containment-hall", "infested-lab", "anchor-chamber"]
  );
  assert.deepEqual(
    encounters.map((room) => room.objective),
    ["eliminate", "elite", "anchor"]
  );
});

test("room transition clears transient combat and Echo objects", () => {
  const next = layouts.advanceRoomState(
    {
      roomIndex: 0,
      loop: 4,
      score: 900,
      overdrive: 44,
      recordings: [1],
      echoes: [1],
      bullets: [1],
      enemies: [1],
      particles: [1],
      pickups: [1],
    },
    3
  );
  assert.equal(next.roomIndex, 1);
  assert.equal(next.loop, 1);
  assert.equal(next.score, 900);
  assert.equal(next.overdrive, 44);
  for (const key of ["recordings", "echoes", "bullets", "enemies", "particles", "pickups"])
    assert.deepEqual(next[key], []);
});
