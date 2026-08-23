(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AudioCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCENES = Object.freeze({
    combat: Object.freeze({ bpm: 92, notes: Object.freeze([55, 65.41, 73.42, 49]) }),
    blockade: Object.freeze({ bpm: 104, notes: Object.freeze([46.25, 55, 51.91, 43.65]) }),
    tension: Object.freeze({ bpm: 108, notes: Object.freeze([55, 58.27, 46.25, 61.74]) }),
    boss: Object.freeze({ bpm: 124, notes: Object.freeze([41.2, 49, 43.65, 55]) }),
  });
  const CUES = Object.freeze({
    barrier: Object.freeze([
      Object.freeze({ type: "square", frequency: 140, duration: 0.16, volume: 0.045, slide: 260 }),
      Object.freeze({
        type: "sine",
        frequency: 420,
        duration: 0.28,
        volume: 0.045,
        slide: 180,
        delay: 0.07,
      }),
    ]),
    bossPhase: Object.freeze([
      Object.freeze({ type: "sawtooth", frequency: 92, duration: 0.34, volume: 0.065, slide: -35 }),
      Object.freeze({
        type: "square",
        frequency: 220,
        duration: 0.18,
        volume: 0.04,
        slide: 330,
        delay: 0.09,
      }),
    ]),
    echoJoin: Object.freeze([
      Object.freeze({ type: "sine", frequency: 330, duration: 0.2, volume: 0.04, slide: 330 }),
      Object.freeze({
        type: "triangle",
        frequency: 660,
        duration: 0.24,
        volume: 0.03,
        slide: -160,
        delay: 0.06,
      }),
    ]),
  });

  const clamp01 = (value, fallback) =>
    Number.isFinite(Number(value)) ? Math.max(0, Math.min(1, Number(value))) : fallback;

  function normalizeSettings(raw) {
    return {
      music: clamp01(raw?.music, 0.42),
      effects: clamp01(raw?.effects, 0.72),
    };
  }

  function sceneFor({ bossAlive = false, blocked = false, zoneIndex = 0, zoneCount = 1 } = {}) {
    if (bossAlive) return "boss";
    if (blocked) return "blockade";
    return zoneIndex >= Math.max(1, zoneCount - 1) ? "tension" : "combat";
  }

  function beatDuration(scene) {
    return 60 / (SCENES[scene]?.bpm || SCENES.combat.bpm);
  }

  function noteFor(scene, beat) {
    const notes = SCENES[scene]?.notes || SCENES.combat.notes;
    return notes[Math.abs(Math.trunc(beat)) % notes.length];
  }

  return Object.freeze({ CUES, SCENES, beatDuration, normalizeSettings, noteFor, sceneFor });
});
