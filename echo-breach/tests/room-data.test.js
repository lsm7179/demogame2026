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
  for (const [id, layout] of Object.entries(layouts)) {
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
