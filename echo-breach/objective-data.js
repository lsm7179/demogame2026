(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ObjectiveData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function objective(type, core, relayPositions, movingRelayIndex = -1) {
    return Object.freeze({
      type,
      core: Object.freeze(core),
      relayCount: relayPositions.length,
      requiredRelays: relayPositions.length,
      relayPositions: Object.freeze(relayPositions.map((p) => Object.freeze({ ...p }))),
      movingRelayIndex,
      relayChargeMax: 100,
      relayHitsToActivate: 7,
      relayGain: 100 / 7,
      relayDecay: 8,
      shieldOpenSeconds: 5.3,
    });
  }

  const data = {
    awakening: objective("anchor", { x: 640, y: 335 }, [
      { x: 820, y: 440 },
      { x: 460, y: 440 },
    ]),
    "split-current": objective(
      "gate",
      { x: 990, y: 335 },
      [
        { x: 770, y: 170 },
        { x: 1060, y: 500 },
      ],
      1
    ),
    "rescue-window": objective("rescue", { x: 640, y: 250 }, [
      { x: 430, y: 210 },
      { x: 850, y: 210 },
    ]),
    "corrupted-record": objective("anchor", { x: 640, y: 335 }, [
      { x: 430, y: 210 },
      { x: 850, y: 460 },
    ]),
    "prime-anchor": objective("anchor", { x: 640, y: 335 }, [
      { x: 420, y: 190 },
      { x: 860, y: 190 },
    ]),
  };

  function isValid(config) {
    return (
      config.relayCount >= 1 &&
      config.relayCount <= 4 &&
      config.requiredRelays >= 1 &&
      config.requiredRelays <= config.relayCount &&
      config.relayPositions.length === config.relayCount
    );
  }

  function registerRelayHit(config, currentHits = 0) {
    const hitsRequired = Math.max(1, config.relayHitsToActivate || 7);
    const hits = Math.min(hitsRequired, Math.max(0, currentHits) + 1);
    return Object.freeze({
      hits,
      charge: (config.relayChargeMax * hits) / hitsRequired,
      active: hits >= hitsRequired,
    });
  }

  return Object.freeze({ ...data, isValid, registerRelayHit });
});
