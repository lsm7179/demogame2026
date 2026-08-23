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
    if (anchor && shieldOpen) return "시간 앵커 노출";
    if (anchor) return `릴레이 동기화 ${activeRelays}/${requiredRelays}`;
    if (gateClosed) return "Echo 스위치로 지름길 개방";
    return `${zoneName || "NEXUS"} · 전진`;
  }

  const iconPaths = Object.freeze({
    weapon: '<path d="M3 13h7l3-3h7v4h-7l-3-2H3z"/><path d="M9 13l-2 6h4l3-6"/>',
    armor:
      '<path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/><path d="M8 8h8v6l-4 3-4-3z"/>',
    relic: '<path d="M12 2l5 5-2 5 2 5-5 5-5-5 2-5-2-5z"/><path d="M12 7v10M9.5 12h5"/>',
    awakening:
      '<path d="M12 3a9 9 0 109 9"/><path d="M12 7a5 5 0 105 5"/><path d="M12 10v4M10 12h4"/>',
    split: '<path d="M4 5h7v5H7l-3 3M20 19h-7v-5h4l3-3"/><path d="M11 7l2 10"/>',
    rescue: '<path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><path d="M12 8v8M8 12h8"/>',
    corrupted: '<path d="M12 2l9 10-9 10L3 12z"/><path d="M8 8l8 8M16 8l-8 8"/>',
    prime: '<path d="M7 4h10l5 8-5 8H7l-5-8z"/><path d="M8 12h8M12 8v8"/>',
  });

  function iconSvg(kind, label = "") {
    const path = iconPaths[kind] || iconPaths.relic;
    return `<svg class="ui-icon" viewBox="0 0 24 24" role="img" aria-label="${label}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter">${path}</svg>`;
  }

  return Object.freeze({
    HUD_LAYOUT,
    getMinimapRect,
    iconSvg,
    objectiveAlert,
    offscreenMarker,
    projectToMinimap,
  });
});
