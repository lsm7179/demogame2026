(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CollisionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function overlaps(circle, wall) {
    if (wall.open) return false;
    const x = clamp(circle.x, wall.x, wall.x + wall.w);
    const y = clamp(circle.y, wall.y, wall.y + wall.h);
    const dx = circle.x - x;
    const dy = circle.y - y;
    return dx * dx + dy * dy < circle.r * circle.r;
  }

  function separate(circle, wall, preferredAxis) {
    if (!overlaps(circle, wall)) return null;
    const candidates = [
      { axis: "x", value: wall.x - circle.r, distance: Math.abs(circle.x - (wall.x - circle.r)) },
      {
        axis: "x",
        value: wall.x + wall.w + circle.r,
        distance: Math.abs(circle.x - (wall.x + wall.w + circle.r)),
      },
      { axis: "y", value: wall.y - circle.r, distance: Math.abs(circle.y - (wall.y - circle.r)) },
      {
        axis: "y",
        value: wall.y + wall.h + circle.r,
        distance: Math.abs(circle.y - (wall.y + wall.h + circle.r)),
      },
    ].sort((a, b) => {
      if (a.axis === preferredAxis && b.axis !== preferredAxis) return -1;
      if (b.axis === preferredAxis && a.axis !== preferredAxis) return 1;
      return a.distance - b.distance;
    });
    const correction = candidates[0];
    circle[correction.axis] = correction.value;
    return correction.axis;
  }

  function moveCircle(circle, dx, dy, walls, bounds) {
    const result = { blockedX: false, blockedY: false };
    const maxStep = Math.max(2, circle.r * 0.45);
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / maxStep));
    const sx = dx / steps;
    const sy = dy / steps;

    for (let step = 0; step < steps; step++) {
      circle.x = clamp(circle.x + sx, bounds.minX, bounds.maxX);
      if ((sx < 0 && circle.x === bounds.minX) || (sx > 0 && circle.x === bounds.maxX))
        result.blockedX = true;
      for (const wall of walls) {
        const axis = separate(circle, wall, "x");
        if (axis === "x") result.blockedX = true;
        if (axis === "y") result.blockedY = true;
      }

      circle.y = clamp(circle.y + sy, bounds.minY, bounds.maxY);
      if ((sy < 0 && circle.y === bounds.minY) || (sy > 0 && circle.y === bounds.maxY))
        result.blockedY = true;
      for (const wall of walls) {
        const axis = separate(circle, wall, "y");
        if (axis === "x") result.blockedX = true;
        if (axis === "y") result.blockedY = true;
      }
    }
    return result;
  }

  function nearestOpenPoint(point, walls, bounds, radius) {
    const circle = {
      x: clamp(point.x, bounds.minX, bounds.maxX),
      y: clamp(point.y, bounds.minY, bounds.maxY),
      r: radius,
    };
    for (let pass = 0; pass <= walls.length; pass += 1) {
      const wall = walls.find((item) => overlaps(circle, item));
      if (!wall) break;
      separate(circle, wall);
      circle.x = clamp(circle.x, bounds.minX, bounds.maxX);
      circle.y = clamp(circle.y, bounds.minY, bounds.maxY);
    }
    return { x: circle.x, y: circle.y };
  }

  return Object.freeze({ nearestOpenPoint, overlaps, moveCircle });
});
