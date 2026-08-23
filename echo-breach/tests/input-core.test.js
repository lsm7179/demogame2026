const test = require("node:test");
const assert = require("node:assert/strict");
const InputCore = require("../input-core.js");

test("stick deadzone removes drift and preserves direction", () => {
  assert.deepEqual(InputCore.stick(0.05, 0.05), { x: 0, y: 0, active: false });
  const right = InputCore.stick(1, 0);
  assert.deepEqual(right, { x: 1, y: 0, active: true });
});

test("standard gamepad mapping exposes movement, aim, dash, and pause", () => {
  const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
  buttons[0].pressed = true;
  buttons[9].pressed = true;
  buttons[15].pressed = true;
  const state = InputCore.gamepadState({ axes: [0.8, 0, 0, -1], buttons });
  assert.equal(state.move.active, true);
  assert.equal(state.aim.y, -1);
  assert.equal(state.dash, true);
  assert.equal(state.pause, true);
  assert.equal(state.navX, 1);
});
