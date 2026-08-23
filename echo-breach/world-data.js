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

  const splitCurrent = {
    mode: "continuous",
    width: 4100,
    height: 1080,
    cameraFollowRate: 7.5,
    playerStart: { x: 130, y: 540 },
    zones: [
      {
        id: "long-range-approach",
        name: "장거리 접근로",
        x: 40,
        y: 80,
        w: 1250,
        h: 920,
        objective: "advance",
        waves: ["shooter", "chaser", "shooter"],
        waveGroups: [
          { delay: 0.8, rhythm: "range", enemies: ["shooter", "chaser"] },
          { delay: 5.5, rhythm: "crossfire", enemies: ["shooter"] },
        ],
        spawnPoints: [
          { x: 650, y: 250 },
          { x: 820, y: 790 },
          { x: 1120, y: 520 },
        ],
      },
      {
        id: "echo-gate",
        name: "Echo 게이트",
        x: 1290,
        y: 80,
        w: 1370,
        h: 920,
        objective: "switch",
        waves: ["leech", "shooter", "blocker"],
        waveGroups: [
          { delay: 0.7, rhythm: "skirmish", enemies: ["leech", "shooter"] },
          { delay: 6, rhythm: "elite", enemies: ["blocker"], elite: true },
        ],
        spawnPoints: [
          { x: 1580, y: 760 },
          { x: 1920, y: 260 },
          { x: 2420, y: 760 },
        ],
      },
      {
        id: "conduit-anchor",
        name: "전도체 앵커",
        x: 2660,
        y: 80,
        w: 1400,
        h: 920,
        objective: "anchor",
        waves: ["shooter", "core-guard", "exploder"],
        waveGroups: [
          { delay: 0.8, rhythm: "range", enemies: ["shooter", "exploder"] },
          { delay: 5.5, rhythm: "elite", enemies: ["core-guard"], elite: true },
        ],
        spawnPoints: [
          { x: 2920, y: 240 },
          { x: 3000, y: 820 },
          { x: 3540, y: 180 },
        ],
      },
    ],
    walls: [
      { x: 520, y: 80, w: 30, h: 330 },
      { x: 520, y: 670, w: 30, h: 330 },
      { x: 1290, y: 80, w: 32, h: 350 },
      { x: 1290, y: 650, w: 32, h: 350 },
      { x: 2140, y: 80, w: 42, h: 360 },
      { id: "split-gate", x: 2140, y: 440, w: 42, h: 200, gate: true },
      { x: 2140, y: 640, w: 42, h: 360 },
      { x: 2660, y: 80, w: 32, h: 350 },
      { x: 2660, y: 650, w: 32, h: 350 },
      { x: 3230, y: 370, w: 300, h: 28 },
      { x: 3230, y: 682, w: 300, h: 28 },
    ],
    switches: [
      {
        id: "split-switch",
        x: 1680,
        y: 270,
        r: 31,
        gateId: "split-gate",
        threshold: 48,
        gain: 16,
        decay: 15,
      },
    ],
    shortcuts: [
      { id: "split-gate", name: "분리 전류 게이트", description: "Echo 사격으로 통로를 유지한다." },
    ],
    objective: {
      core: { x: 3710, y: 540 },
      relayPositions: [
        { x: 3370, y: 270 },
        { x: 3370, y: 810 },
      ],
      relayCount: 2,
      requiredRelays: 2,
      relayChargeMax: 100,
      relayGain: 12,
      relayDecay: 8,
      shieldOpenSeconds: 5.3,
      movingRelayIndex: 1,
    },
  };

  const rescueWindow = {
    mode: "continuous",
    width: 4200,
    height: 1080,
    cameraFollowRate: 7.5,
    playerStart: { x: 130, y: 540 },
    shuttle: { x: 2050, y: 540, hp: 260, survivors: 12 },
    hazards: [
      { id: "rift-floor-a", x: 1120, y: 110, w: 330, h: 310, damage: 9, interval: 0.8 },
      { id: "rift-floor-b", x: 1520, y: 660, w: 390, h: 280, damage: 9, interval: 0.8 },
      { id: "rift-floor-c", x: 2480, y: 180, w: 360, h: 260, damage: 11, interval: 0.75 },
    ],
    zones: [
      {
        id: "evac-approach",
        name: "구조 접근로",
        x: 40,
        y: 80,
        w: 1300,
        h: 920,
        objective: "advance",
        waves: ["chaser", "exploder", "leech"],
        waveGroups: [
          { delay: 0.8, rhythm: "hazard", enemies: ["chaser", "leech"] },
          { delay: 5.4, rhythm: "burst", enemies: ["exploder"] },
        ],
        spawnPoints: [
          { x: 650, y: 250 },
          { x: 820, y: 800 },
          { x: 1180, y: 520 },
        ],
      },
      {
        id: "survivor-hangar",
        name: "생존자 격납고",
        x: 1340,
        y: 80,
        w: 1400,
        h: 920,
        objective: "escort",
        waves: ["chaser", "shooter", "blocker", "exploder"],
        waveGroups: [
          { delay: 0.7, rhythm: "escort", enemies: ["chaser", "shooter"], targetShuttle: true },
          { delay: 5, rhythm: "pressure", enemies: ["blocker", "exploder"], targetShuttle: true },
        ],
        spawnPoints: [
          { x: 1590, y: 220 },
          { x: 1660, y: 850 },
          { x: 2430, y: 220 },
          { x: 2500, y: 850 },
        ],
      },
      {
        id: "rescue-anchor",
        name: "구조 앵커",
        x: 2740,
        y: 80,
        w: 1420,
        h: 920,
        objective: "anchor",
        waves: ["core-guard", "shooter", "chaser"],
        waveGroups: [
          { delay: 0.8, rhythm: "defense", enemies: ["shooter", "chaser"] },
          { delay: 5.2, rhythm: "elite", enemies: ["core-guard"], elite: true },
        ],
        spawnPoints: [
          { x: 3010, y: 230 },
          { x: 3090, y: 830 },
          { x: 3620, y: 180 },
        ],
      },
    ],
    walls: [
      { x: 610, y: 80, w: 30, h: 310 },
      { x: 610, y: 690, w: 30, h: 310 },
      { x: 1340, y: 80, w: 32, h: 340 },
      { x: 1340, y: 660, w: 32, h: 340 },
      { x: 1840, y: 330, w: 420, h: 28 },
      { x: 1840, y: 722, w: 420, h: 28 },
      { x: 2740, y: 80, w: 32, h: 340 },
      { x: 2740, y: 660, w: 32, h: 340 },
      { x: 3260, y: 390, w: 300, h: 28 },
      { x: 3260, y: 662, w: 300, h: 28 },
    ],
    switches: [],
    shortcuts: [],
    objective: {
      core: { x: 3790, y: 540 },
      relayPositions: [
        { x: 3440, y: 280 },
        { x: 3440, y: 800 },
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

  const corruptedRecord = {
    mode: "continuous",
    width: 4400,
    height: 1080,
    cameraFollowRate: 7.5,
    playerStart: { x: 130, y: 540 },
    zones: [
      {
        id: "memory-intake",
        name: "기록 유입구",
        x: 40,
        y: 80,
        w: 1320,
        h: 920,
        objective: "advance",
        waves: ["leech", "shooter", "corrupted-echo"],
        waveGroups: [
          { delay: 0.8, rhythm: "memory", enemies: ["leech", "shooter"] },
          { delay: 5.2, rhythm: "corruption", enemies: ["corrupted-echo"], elite: true },
        ],
        spawnPoints: [
          { x: 620, y: 250 },
          { x: 810, y: 800 },
          { x: 1180, y: 540 },
        ],
      },
      {
        id: "mirror-vault",
        name: "거울 기록고",
        x: 1360,
        y: 80,
        w: 1480,
        h: 920,
        objective: "survive",
        waves: ["corrupted-echo", "blocker", "corrupted-echo"],
        waveGroups: [
          { delay: 0.7, rhythm: "mirror", enemies: ["corrupted-echo", "blocker"] },
          { delay: 6.4, rhythm: "mirror", enemies: ["corrupted-echo"], elite: true },
        ],
        spawnPoints: [
          { x: 1630, y: 230 },
          { x: 2050, y: 820 },
          { x: 2600, y: 260 },
        ],
      },
      {
        id: "record-anchor",
        name: "기록 앵커",
        x: 2840,
        y: 80,
        w: 1520,
        h: 920,
        objective: "anchor",
        waves: ["core-guard", "corrupted-echo", "exploder"],
        waveGroups: [
          { delay: 0.8, rhythm: "defense", enemies: ["core-guard", "exploder"] },
          { delay: 5.5, rhythm: "corruption", enemies: ["corrupted-echo"], elite: true },
        ],
        spawnPoints: [
          { x: 3110, y: 220 },
          { x: 3330, y: 820 },
          { x: 3860, y: 180 },
        ],
      },
    ],
    walls: [
      { x: 600, y: 80, w: 30, h: 330 },
      { x: 600, y: 670, w: 30, h: 330 },
      { x: 1360, y: 80, w: 32, h: 350 },
      { x: 1360, y: 650, w: 32, h: 350 },
      { x: 1880, y: 250, w: 300, h: 28 },
      { x: 2140, y: 802, w: 300, h: 28 },
      { x: 2840, y: 80, w: 32, h: 350 },
      { x: 2840, y: 650, w: 32, h: 350 },
      { x: 3450, y: 360, w: 280, h: 28 },
      { x: 3450, y: 692, w: 280, h: 28 },
    ],
    switches: [],
    shortcuts: [],
    objective: {
      core: { x: 4020, y: 540 },
      relayPositions: [
        { x: 3650, y: 260 },
        { x: 3650, y: 820 },
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

  const primeAnchor = {
    mode: "continuous",
    width: 4700,
    height: 1120,
    cameraFollowRate: 7.8,
    playerStart: { x: 130, y: 560 },
    hazards: [
      { id: "prime-rift-a", x: 1240, y: 160, w: 280, h: 260, damage: 10, interval: 0.8 },
      { id: "prime-rift-b", x: 1890, y: 710, w: 340, h: 250, damage: 10, interval: 0.8 },
    ],
    zones: [
      {
        id: "ai-causeway",
        name: "중앙 AI 진입로",
        x: 40,
        y: 80,
        w: 1420,
        h: 960,
        objective: "advance",
        waves: ["shooter", "corrupted-echo", "blocker"],
        waveGroups: [
          { delay: 0.8, rhythm: "gauntlet", enemies: ["shooter", "blocker"] },
          { delay: 5.2, rhythm: "memory", enemies: ["corrupted-echo"], elite: true },
        ],
        spawnPoints: [
          { x: 650, y: 260 },
          { x: 920, y: 850 },
          { x: 1300, y: 550 },
        ],
      },
      {
        id: "convergence-array",
        name: "수렴 배열",
        x: 1460,
        y: 80,
        w: 1540,
        h: 960,
        objective: "synchronize",
        waves: ["core-guard", "exploder", "corrupted-echo"],
        waveGroups: [
          { delay: 0.7, rhythm: "convergence", enemies: ["core-guard", "exploder"] },
          { delay: 6, rhythm: "memory", enemies: ["corrupted-echo"], elite: true },
        ],
        spawnPoints: [
          { x: 1740, y: 230 },
          { x: 2210, y: 880 },
          { x: 2760, y: 250 },
        ],
      },
      {
        id: "prime-chamber",
        name: "PRIME CHAMBER",
        x: 3000,
        y: 80,
        w: 1660,
        h: 960,
        objective: "final-boss",
        waves: ["prime-weaver", "core-guard", "corrupted-echo"],
        waveGroups: [
          { delay: 0.9, rhythm: "boss", enemies: ["prime-weaver"], elite: true },
          { delay: 4.8, rhythm: "support", enemies: ["core-guard", "corrupted-echo"] },
        ],
        spawnPoints: [
          { x: 3910, y: 560 },
          { x: 3290, y: 220 },
          { x: 3360, y: 900 },
        ],
      },
    ],
    walls: [
      { x: 650, y: 80, w: 30, h: 350 },
      { x: 650, y: 690, w: 30, h: 350 },
      { x: 1460, y: 80, w: 32, h: 370 },
      { x: 1460, y: 670, w: 32, h: 370 },
      { x: 2030, y: 300, w: 320, h: 28 },
      { x: 2030, y: 792, w: 320, h: 28 },
      { x: 3000, y: 80, w: 32, h: 370 },
      { x: 3000, y: 670, w: 32, h: 370 },
      { x: 3620, y: 320, w: 300, h: 28 },
      { x: 3620, y: 772, w: 300, h: 28 },
    ],
    switches: [],
    shortcuts: [],
    objective: {
      core: { x: 4320, y: 560 },
      relayPositions: [
        { x: 3760, y: 220 },
        { x: 3760, y: 900 },
        { x: 4140, y: 560 },
      ],
      relayCount: 3,
      requiredRelays: 3,
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
      hazards: Object.freeze((world.hazards || []).map((item) => Object.freeze({ ...item }))),
      shuttle: world.shuttle ? Object.freeze({ ...world.shuttle }) : null,
      objective: Object.freeze({
        ...world.objective,
        core: Object.freeze({ ...world.objective.core }),
        relayPositions: Object.freeze(
          world.objective.relayPositions.map((point) => Object.freeze({ ...point }))
        ),
      }),
    });
  }

  return Object.freeze({
    awakening: freezeWorld(awakening),
    "split-current": freezeWorld(splitCurrent),
    "rescue-window": freezeWorld(rescueWindow),
    "corrupted-record": freezeWorld(corruptedRecord),
    "prime-anchor": freezeWorld(primeAnchor),
  });
});
