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

  return Object.freeze({ CONFIG, collectShots, playbackTime, samplePose });
});
