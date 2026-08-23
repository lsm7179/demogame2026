(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.WorldData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const awakening = {
    mode: "continuous",
    width: 3900,
    height: 1080,
    cameraFollowRate: 7.5,
    playerStart: { x: 130, y: 540 },
    zones: [
      {
        id: "containment-hall",
        name: "CONTAINMENT HALL",
        x: 40,
        y: 80,
        w: 1080,
        h: 920,
        objective: "eliminate",
        waves: ["chaser", "leech", "shooter", "chaser"],
        waveGroups: [
          { delay: 0.8, rhythm: "skirmish", enemies: ["chaser", "leech"] },
          { delay: 5.2, rhythm: "pressure", enemies: ["shooter", "chaser"] },
        ],
        spawnPoints: [
          { x: 520, y: 310 },
          { x: 610, y: 760 },
          { x: 920, y: 280 },
          { x: 980, y: 790 },
        ],
      },
      {
        id: "infested-lab",
        name: "INFESTED LAB",
        x: 1120,
        y: 80,
        w: 1400,
        h: 920,
        objective: "elite",
        waves: ["blocker", "exploder", "chaser", "shooter", "exploder"],
        waveGroups: [
          { delay: 0.7, rhythm: "burst", enemies: ["chaser", "exploder"] },
          { delay: 4.5, rhythm: "pressure", enemies: ["shooter", "exploder"] },
          { delay: 8.2, rhythm: "elite", enemies: ["blocker"], elite: true },
          { delay: 11.2, rhythm: "midboss", enemies: ["rift-warden"], elite: true },
        ],
        spawnPoints: [
          { x: 1360, y: 280 },
          { x: 1590, y: 760 },
          { x: 1900, y: 520 },
          { x: 2260, y: 250 },
          { x: 2340, y: 820 },
        ],
      },
      {
        id: "anchor-chamber",
        name: "ANCHOR CHAMBER",
        x: 2520,
        y: 80,
        w: 1340,
        h: 920,
        objective: "anchor",
        waves: ["core-guard", "shooter", "chaser", "blocker"],
        waveGroups: [
          { delay: 0.8, rhythm: "defense", enemies: ["shooter", "chaser"] },
          { delay: 5.4, rhythm: "elite", enemies: ["core-guard", "blocker"], elite: true },
          { delay: 9.2, rhythm: "boss", enemies: ["chrono-abomination"], elite: true },
        ],
        spawnPoints: [
          { x: 2780, y: 250 },
          { x: 2810, y: 820 },
          { x: 3300, y: 180 },
          { x: 3310, y: 900 },
        ],
      },
    ],
    walls: [
      { x: 430, y: 80, w: 28, h: 300 },
      { x: 430, y: 700, w: 28, h: 300 },
      { x: 835, y: 260, w: 250, h: 28 },
      { x: 835, y: 792, w: 250, h: 28 },
      { x: 1120, y: 80, w: 30, h: 300 },
      { x: 1120, y: 700, w: 30, h: 300 },
      { x: 1450, y: 400, w: 330, h: 28 },
      { x: 1450, y: 650, w: 330, h: 28 },
      { x: 2050, y: 80, w: 35, h: 280 },
      { id: "temporal-shortcut", x: 2050, y: 360, w: 35, h: 220, gate: true },
      { x: 2050, y: 580, w: 35, h: 240 },
      { x: 2290, y: 180, w: 28, h: 280 },
      { x: 2290, y: 680, w: 28, h: 260 },
      { x: 2520, y: 80, w: 30, h: 300 },
      { x: 2520, y: 700, w: 30, h: 300 },
      { x: 2920, y: 80, w: 28, h: 240 },
      { x: 2920, y: 760, w: 28, h: 240 },
    ],
    switches: [
      {
        id: "shortcut-switch",
        x: 1640,
        y: 260,
        r: 31,
        gateId: "temporal-shortcut",
        threshold: 42,
        gain: 16,
        decay: 13,
      },
    ],
    shortcuts: [
      {
        id: "temporal-shortcut",
        name: "ECHO BYPASS",
        description: "Echo가 북쪽 스위치를 사격하면 중앙 지름길이 열린다.",
      },
    ],
    objective: {
      core: { x: 3490, y: 540 },
      relayPositions: [
        { x: 3140, y: 300 },
        { x: 3140, y: 780 },
      ],
      relayCount: 2,
      requiredRelays: 2,
      relayChargeMax: 100,
      relayGain: 12,
      relayDecay: 8,
      shieldOpenSeconds: 5.3,
      movingRelayIndex: -1,
    },
  };

  function freezeWorld(world) {
    return Object.freeze({
      ...world,
      playerStart: Object.freeze({ ...world.playerStart }),
      zones: Object.freeze(
        world.zones.map((zone) =>
          Object.freeze({
            ...zone,
            waves: Object.freeze(zone.waves.slice()),
            waveGroups: Object.freeze(
              (zone.waveGroups || []).map((group) =>
                Object.freeze({ ...group, enemies: Object.freeze(group.enemies.slice()) })
              )
            ),
            spawnPoints: Object.freeze(
              zone.spawnPoints.map((point) => Object.freeze({ ...point }))
            ),
          })
        )
      ),
      walls: Object.freeze(world.walls.map((wall) => Object.freeze({ ...wall }))),
      switches: Object.freeze(world.switches.map((item) => Object.freeze({ ...item }))),
      shortcuts: Object.freeze(world.shortcuts.map((item) => Object.freeze({ ...item }))),
      objective: Object.freeze({
        ...world.objective,
        core: Object.freeze({ ...world.objective.core }),
        relayPositions: Object.freeze(
          world.objective.relayPositions.map((point) => Object.freeze({ ...point }))
        ),
      }),
    });
  }

  return Object.freeze({ awakening: freezeWorld(awakening) });
});
