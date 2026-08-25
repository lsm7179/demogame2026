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
    replayMoveSpeed: 135,
    maxFrameDistance: 9,
    pathPadding: 34,
    spawnOffset: 18,
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

  function createLocalReplayTransform(
    samples,
    spawn,
    bounds,
    sequence = 0,
    padding = CONFIG.pathPadding
  ) {
    if (!Array.isArray(samples) || samples.length === 0 || !spawn || !bounds) return null;
    const source = samples[0];
    const angle = (Math.max(0, sequence) % 6) * (Math.PI / 3);
    const offsetRadius = sequence > 0 ? CONFIG.spawnOffset : 0;
    const minX = bounds.x + padding;
    const maxX = bounds.x + bounds.w - padding;
    const minY = bounds.y + padding;
    const maxY = bounds.y + bounds.h - padding;
    const originX = Math.max(minX, Math.min(maxX, spawn.x + Math.cos(angle) * offsetRadius));
    const originY = Math.max(minY, Math.min(maxY, spawn.y + Math.sin(angle) * offsetRadius));
    let negativeX = 0;
    let positiveX = 0;
    let negativeY = 0;
    let positiveY = 0;
    for (const sample of samples) {
      const dx = sample.x - source.x;
      const dy = sample.y - source.y;
      negativeX = Math.min(negativeX, dx);
      positiveX = Math.max(positiveX, dx);
      negativeY = Math.min(negativeY, dy);
      positiveY = Math.max(positiveY, dy);
    }
    const ratios = [1];
    if (negativeX < 0) ratios.push((originX - minX) / -negativeX);
    if (positiveX > 0) ratios.push((maxX - originX) / positiveX);
    if (negativeY < 0) ratios.push((originY - minY) / -negativeY);
    if (positiveY > 0) ratios.push((maxY - originY) / positiveY);
    return {
      sourceX: source.x,
      sourceY: source.y,
      originX,
      originY,
      scale: Math.max(0, Math.min(...ratios)),
    };
  }

  function localReplayTarget(pose, transform) {
    if (!pose || !transform) return null;
    return {
      x: transform.originX + (pose.x - transform.sourceX) * transform.scale,
      y: transform.originY + (pose.y - transform.sourceY) * transform.scale,
      angle: pose.angle,
    };
  }

  function movementStep(current, target, dt, speed = CONFIG.replayMoveSpeed) {
    if (!current || !target || !Number.isFinite(dt) || dt <= 0) return { x: 0, y: 0 };
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.001) return { x: 0, y: 0 };
    const travel = Math.min(distance, speed * dt, CONFIG.maxFrameDistance);
    return { x: (dx / distance) * travel, y: (dy / distance) * travel };
  }

  return Object.freeze({
    CONFIG,
    collectShots,
    createLocalReplayTransform,
    localReplayTarget,
    movementStep,
    playbackTime,
    samplePose,
  });
});
