(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AudioCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCENES = Object.freeze({
    combat: Object.freeze({ bpm: 92, notes: Object.freeze([55, 65.41, 73.42, 49]) }),
    tension: Object.freeze({ bpm: 108, notes: Object.freeze([55, 58.27, 46.25, 61.74]) }),
    boss: Object.freeze({ bpm: 124, notes: Object.freeze([41.2, 49, 43.65, 55]) }),
  });

  const clamp01 = (value, fallback) =>
    Number.isFinite(Number(value)) ? Math.max(0, Math.min(1, Number(value))) : fallback;

  function normalizeSettings(raw) {
    return {
      music: clamp01(raw?.music, 0.42),
      effects: clamp01(raw?.effects, 0.72),
    };
  }

  function sceneFor({ bossAlive = false, zoneIndex = 0, zoneCount = 1 } = {}) {
    if (bossAlive) return "boss";
    return zoneIndex >= Math.max(1, zoneCount - 1) ? "tension" : "combat";
  }

  function beatDuration(scene) {
    return 60 / (SCENES[scene]?.bpm || SCENES.combat.bpm);
  }

  function noteFor(scene, beat) {
    const notes = SCENES[scene]?.notes || SCENES.combat.notes;
    return notes[Math.abs(Math.trunc(beat)) % notes.length];
  }

  return Object.freeze({ SCENES, beatDuration, normalizeSettings, noteFor, sceneFor });
});
