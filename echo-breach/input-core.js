(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.InputCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function stick(x = 0, y = 0, deadzone = 0.18) {
    const length = Math.hypot(x, y);
    if (length <= deadzone) return { x: 0, y: 0, active: false };
    const magnitude = Math.min(1, (length - deadzone) / (1 - deadzone));
    return { x: (x / length) * magnitude, y: (y / length) * magnitude, active: true };
  }

  function gamepadState(gamepad, deadzone = 0.18) {
    if (!gamepad) return null;
    return {
      move: stick(gamepad.axes?.[0], gamepad.axes?.[1], deadzone),
      aim: stick(gamepad.axes?.[2], gamepad.axes?.[3], deadzone),
      dash: Boolean(gamepad.buttons?.[0]?.pressed || gamepad.buttons?.[5]?.pressed),
      pause: Boolean(gamepad.buttons?.[9]?.pressed),
      navX: (gamepad.buttons?.[15]?.pressed ? 1 : 0) - (gamepad.buttons?.[14]?.pressed ? 1 : 0),
      navY: (gamepad.buttons?.[13]?.pressed ? 1 : 0) - (gamepad.buttons?.[12]?.pressed ? 1 : 0),
    };
  }

  return Object.freeze({ gamepadState, stick });
});
