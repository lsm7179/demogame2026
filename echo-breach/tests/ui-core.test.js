const test = require("node:test");
const assert = require("node:assert/strict");
const ui = require("../ui-core.js");

test("minimap stays in the upper-right and scales down on small screens", () => {
  assert.deepEqual(ui.getMinimapRect({ width: 1280, height: 720 }), {
    x: 978,
    y: 22,
    w: 280,
    h: 128,
  });
  const compact = ui.getMinimapRect({ width: 640, height: 480 });
  assert.ok(compact.w <= 190);
  assert.equal(compact.x + compact.w + 10, 640);
});

test("world entities project into readable minimap bounds", () => {
  const rect = { x: 900, y: 20, w: 300, h: 120 };
  const world = { width: 3900, height: 1080 };
  assert.deepEqual(ui.projectToMinimap({ x: 1950, y: 540 }, world, rect), {
    x: 1050,
    y: 80,
  });
  assert.deepEqual(ui.projectToMinimap({ x: 9999, y: -50 }, world, rect), {
    x: 1200,
    y: 20,
  });
});

test("offscreen markers clamp to safe HUD edges and retain direction", () => {
  const marker = ui.offscreenMarker({ x: 1500, y: 360 }, { width: 1280, height: 720 });
  assert.equal(marker.visible, false);
  assert.equal(marker.x, 1258);
  assert.equal(marker.y, 360);
  assert.equal(marker.angle, 0);
});

test("objective alerts remain compact and situation driven", () => {
  assert.equal(
    ui.objectiveAlert({ anchor: true, shieldOpen: false, activeRelays: 1, requiredRelays: 2 }),
    "릴레이 동기화 1/2"
  );
  assert.equal(ui.objectiveAlert({ anchor: false, gateClosed: true }), "Echo 스위치로 지름길 개방");
});

test("release UI icons use a consistent inline SVG vocabulary", () => {
  for (const kind of ["weapon", "armor", "relic", "awakening", "split", "rescue"]) {
    const icon = ui.iconSvg(kind, "표식");
    assert.match(icon, /^<svg/);
    assert.match(icon, /viewBox="0 0 24 24"/);
    assert.match(icon, /stroke-width="1.7"/);
    assert.doesNotMatch(icon, /<text|emoji/i);
  }
});
