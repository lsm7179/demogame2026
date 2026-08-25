(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CorruptedEchoCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CONFIG = Object.freeze({
    liveDelay: 2,
    projectileDamage: 7,
    projectileSpeed: 210,
    maxShotsPerTick: 2,
    telegraphSeconds: 0.34,
    maxReplayDisplacement: 190,
  });

  function angleLerp(a, b, t) {
    const delta = Math.atan2(Math.sin(b - a), Math.cos(b - a));
    return a + delta * t;
  }

  function samplePose(samples, time) {
    if (!Array.isArray(samples) || samples.length === 0 || time < 0) return null;
    let right = samples.findIndex((sample) => sample.t >= time);
    if (right < 0) right = samples.length - 1;
    const b = samples[right];
    const a = samples[Math.max(0, right - 1)];
    const span = Math.max(0.0001, b.t - a.t);
    const mix = Math.max(0, Math.min(1, (time - a.t) / span));
    return {
      x: a.x + (b.x - a.x) * mix,
      y: a.y + (b.y - a.y) * mix,
      angle: angleLerp(a.a ?? a.angle ?? 0, b.a ?? b.angle ?? 0, mix),
    };
  }

  function collectShots(events, cursor, time, maxShots = CONFIG.maxShotsPerTick) {
    let nextIndex = Math.max(0, cursor || 0);
    const shots = [];
    while (nextIndex < (events?.length || 0) && events[nextIndex].t <= time) {
      const event = events[nextIndex++];
      if (event.type === "shot" && shots.length < maxShots) shots.push({ ...event });
    }
    return { shots, nextIndex };
  }

  function playbackTime(elapsed, hasCompletedRecording, liveDelay = CONFIG.liveDelay) {
    return Math.max(-1, elapsed - (hasCompletedRecording ? 0 : liveDelay));
  }

  function clampPoseToZone(pose, bounds, padding = 24) {
    if (!pose || !bounds) return pose;
    const minX = bounds.x + padding;
    const maxX = bounds.x + bounds.w - padding;
    const minY = bounds.y + padding;
    const maxY = bounds.y + bounds.h - padding;
    return {
      ...pose,
      x: Math.max(minX, Math.min(maxX, pose.x)),
      y: Math.max(minY, Math.min(maxY, pose.y)),
    };
  }

  function limitPoseDisplacement(pose, origin, maximum = CONFIG.maxReplayDisplacement) {
    if (!pose || !origin || maximum <= 0) return pose;
    const dx = pose.x - origin.x;
    const dy = pose.y - origin.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= maximum) return { ...pose };
    const scale = maximum / distance;
    return { ...pose, x: origin.x + dx * scale, y: origin.y + dy * scale };
  }

  return Object.freeze({
    CONFIG,
    clampPoseToZone,
    collectShots,
    limitPoseDisplacement,
    playbackTime,
    samplePose,
  });
});
