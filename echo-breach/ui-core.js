(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.UiCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const HUD_LAYOUT = Object.freeze({
    minimap: Object.freeze({ desktop: Object.freeze({ w: 280, h: 128, margin: 22 }) }),
    markerPadding: 22,
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getMinimapRect(viewport, layout = HUD_LAYOUT) {
    const compact = viewport.width < 760;
    const width = compact ? Math.min(190, viewport.width * 0.42) : layout.minimap.desktop.w;
    const height = compact ? 82 : layout.minimap.desktop.h;
    const margin = compact ? 10 : layout.minimap.desktop.margin;
    return { x: viewport.width - width - margin, y: margin, w: width, h: height };
  }

  function projectToMinimap(point, world, rect) {
    return {
      x: rect.x + clamp(point.x / world.width, 0, 1) * rect.w,
      y: rect.y + clamp(point.y / world.height, 0, 1) * rect.h,
    };
  }

  function offscreenMarker(point, viewport, padding = HUD_LAYOUT.markerPadding) {
    const visible =
      point.x >= 0 && point.x <= viewport.width && point.y >= 0 && point.y <= viewport.height;
    return {
      visible,
      x: clamp(point.x, padding, viewport.width - padding),
      y: clamp(point.y, padding, viewport.height - padding),
      angle: Math.atan2(point.y - viewport.height / 2, point.x - viewport.width / 2),
    };
  }

  function objectiveAlert({
    zoneName,
    anchor,
    shieldOpen,
    activeRelays,
    requiredRelays,
    gateClosed,
  }) {
    if (anchor && shieldOpen) return "ANCHOR EXPOSED";
    if (anchor) return `SYNC RELAYS ${activeRelays}/${requiredRelays}`;
    if (gateClosed) return "ECHO SWITCH // SHORTCUT";
    return `${zoneName || "NEXUS"} // ADVANCE`;
  }

  return Object.freeze({
    HUD_LAYOUT,
    getMinimapRect,
    objectiveAlert,
    offscreenMarker,
    projectToMinimap,
  });
});
