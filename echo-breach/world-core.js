(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.WorldCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function clampCamera(camera, world, viewport) {
    const x = Number.isFinite(camera?.x) ? camera.x : 0;
    const y = Number.isFinite(camera?.y) ? camera.y : 0;
    return {
      x: clamp(x, 0, Math.max(0, world.width - viewport.width)),
      y: clamp(y, 0, Math.max(0, world.height - viewport.height)),
    };
  }

  function cameraForFocus(focus, world, viewport) {
    return clampCamera(
      { x: focus.x - viewport.width / 2, y: focus.y - viewport.height / 2 },
      world,
      viewport
    );
  }

  function updateCamera(camera, focus, dt, world, viewport, followRate = 7.5) {
    const target = cameraForFocus(focus, world, viewport);
    const blend = 1 - Math.exp(-Math.max(0, followRate) * Math.max(0, dt));
    return clampCamera(
      {
        x: camera.x + (target.x - camera.x) * blend,
        y: camera.y + (target.y - camera.y) * blend,
      },
      world,
      viewport
    );
  }

  function screenToWorld(point, camera, view) {
    return {
      x: (point.x - view.ox) / view.scale + camera.x,
      y: (point.y - view.oy) / view.scale + camera.y,
    };
  }

  function worldToScreen(point, camera, view) {
    return {
      x: view.ox + (point.x - camera.x) * view.scale,
      y: view.oy + (point.y - camera.y) * view.scale,
    };
  }

  function zoneAt(zones, point) {
    return (
      zones.find(
        (zone) =>
          point.x >= zone.x &&
          point.x <= zone.x + zone.w &&
          point.y >= zone.y &&
          point.y <= zone.y + zone.h
      ) || null
    );
  }

  function resetContinuousLoop(persistentState, worldData) {
    return {
      persistent: { ...persistentState },
      transient: {
        playerStart: { ...worldData.playerStart },
        enemies: worldData.zones.flatMap((zone) =>
          zone.spawnPoints.slice(0, zone.waves.length).map((point, index) => ({
            ...point,
            type: zone.waves[index],
            zoneId: zone.id,
          }))
        ),
        switches: worldData.switches.map((item) => ({ ...item, charge: 0, lastHit: -9 })),
        relays: worldData.objective.relayPositions.map((point, index) => ({
          ...point,
          index,
          charge: 0,
          active: false,
          lastHit: -9,
        })),
      },
    };
  }

  return Object.freeze({
    cameraForFocus,
    clampCamera,
    resetContinuousLoop,
    screenToWorld,
    updateCamera,
    worldToScreen,
    zoneAt,
  });
});
