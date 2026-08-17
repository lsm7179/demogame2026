(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.EchoCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function shortestAngleDelta(from, to) {
    return ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  }

  function interpolatePose(samples, elapsed) {
    if (!Array.isArray(samples) || samples.length === 0) return null;

    let index = 0;
    while (index + 1 < samples.length && samples[index + 1].t <= elapsed) index++;

    const start = samples[index];
    const end = samples[Math.min(index + 1, samples.length - 1)];
    const fraction = start === end ? 0 : clamp((elapsed - start.t) / (end.t - start.t), 0, 1);

    return {
      x: start.x + (end.x - start.x) * fraction,
      y: start.y + (end.y - start.y) * fraction,
      angle: start.a + shortestAngleDelta(start.a, end.a) * fraction,
      sampleIndex: index,
    };
  }

  function collectDueEvents(events, eventIndex, elapsed, epsilon = 0.008) {
    const due = [];
    let nextIndex = eventIndex;
    while (nextIndex < events.length && events[nextIndex].t <= elapsed + epsilon) {
      due.push(events[nextIndex]);
      nextIndex++;
    }
    return { events: due, nextIndex };
  }

  function shouldSample(elapsed, nextSample, force = false, epsilon = 1e-6) {
    return force || elapsed + epsilon >= nextSample;
  }

  function appendRecording(recordings, recording, maxEchoes) {
    const next = recordings.concat(recording);
    if (next.length > maxEchoes) next.shift();
    return next;
  }

  function canAutoFire({ mode, paused, mouseInside, alive }) {
    return mode === "playing" && !paused && mouseInside && alive;
  }

  return {
    appendRecording,
    canAutoFire,
    collectDueEvents,
    interpolatePose,
    shortestAngleDelta,
    shouldSample,
  };
});
