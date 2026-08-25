(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.RoomData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const layouts = {
    awakening: {
      encounters: [
        {
          id: "containment-hall",
          name: "CONTAINMENT HALL",
          objective: "elite",
          playerStart: { x: 120, y: 360 },
          exit: { x: 1175, y: 360, r: 42 },
          walls: [
            { x: 360, y: 45, w: 18, h: 220 },
            { x: 360, y: 455, w: 18, h: 220 },
            { x: 820, y: 45, w: 18, h: 220 },
            { x: 820, y: 455, w: 18, h: 220 },
          ],
          waves: ["chaser", "leech", "shooter", "rift-warden"],
          spawnPoints: [
            { x: 520, y: 150 },
            { x: 620, y: 570 },
            { x: 1040, y: 180 },
            { x: 1060, y: 550 },
          ],
        },
        {
          id: "anchor-chamber",
          name: "ANCHOR CHAMBER",
          objective: "anchor",
          playerStart: { x: 640, y: 630 },
          exit: null,
          walls: [
            { x: 25, y: 490, w: 480, h: 18 },
            { x: 775, y: 490, w: 480, h: 18 },
            { x: 412, y: 45, w: 18, h: 185 },
            { x: 412, y: 350, w: 18, h: 140 },
            { x: 850, y: 45, w: 18, h: 185 },
            { x: 850, y: 350, w: 18, h: 140 },
          ],
          waves: ["core-guard", "shooter", "chaser", "blocker"],
          spawnPoints: [
            { x: 95, y: 90 },
            { x: 1180, y: 90 },
            { x: 100, y: 430 },
            { x: 1180, y: 430 },
          ],
        },
      ],
      rooms: [
        { id: "entry", name: "ENTRY LOCK", x: 505, y: 500, w: 270, h: 190 },
        { id: "west-relay", name: "RELAY WEST", x: 35, y: 45, w: 385, h: 445 },
        { id: "anchor", name: "ANCHOR LAB", x: 430, y: 45, w: 420, h: 445 },
        { id: "east-relay", name: "RELAY EAST", x: 860, y: 45, w: 385, h: 445 },
      ],
      walls: [
        { x: 25, y: 490, w: 480, h: 18 },
        { x: 775, y: 490, w: 480, h: 18 },
        { x: 412, y: 45, w: 18, h: 185 },
        { x: 412, y: 350, w: 18, h: 140 },
        { x: 850, y: 45, w: 18, h: 185 },
        { x: 850, y: 350, w: 18, h: 140 },
      ],
      spawnPoints: [
        { x: 95, y: 90 },
        { x: 1180, y: 90 },
        { x: 100, y: 430 },
        { x: 1180, y: 430 },
      ],
    },
    "split-current": {
      rooms: [
        { id: "switch", name: "SWITCH CONTROL", x: 35, y: 45, w: 570, h: 630 },
        { id: "gate", name: "BREACH CHANNEL", x: 605, y: 280, w: 70, h: 160 },
        { id: "anchor", name: "ANCHOR CONDUIT", x: 675, y: 45, w: 570, h: 630 },
      ],
      walls: [
        { x: 620, y: 45, w: 40, h: 235 },
        { x: 620, y: 440, w: 40, h: 235 },
        { x: 620, y: 280, w: 40, h: 160, gate: true },
      ],
      spawnPoints: [
        { x: 95, y: 90 },
        { x: 540, y: 100 },
        { x: 735, y: 620 },
        { x: 1180, y: 620 },
      ],
    },
    "rescue-window": {
      rooms: [
        { id: "west", name: "EVAC WEST", x: 35, y: 45, w: 455, h: 430 },
        { id: "anchor", name: "ANCHOR CONTROL", x: 500, y: 45, w: 280, h: 430 },
        { id: "east", name: "EVAC EAST", x: 790, y: 45, w: 455, h: 430 },
        { id: "hangar", name: "SURVIVOR HANGAR", x: 500, y: 500, w: 280, h: 190 },
      ],
      walls: [
        { x: 25, y: 480, w: 475, h: 18 },
        { x: 780, y: 480, w: 475, h: 18 },
        { x: 490, y: 45, w: 18, h: 165 },
        { x: 490, y: 330, w: 18, h: 150 },
        { x: 772, y: 45, w: 18, h: 165 },
        { x: 772, y: 330, w: 18, h: 150 },
      ],
      spawnPoints: [
        { x: 90, y: 90 },
        { x: 1190, y: 90 },
        { x: 100, y: 420 },
        { x: 1180, y: 420 },
      ],
    },
  };

  function advanceRoomState(state, roomCount) {
    if (state.roomIndex >= roomCount - 1) return null;
    return {
      ...state,
      roomIndex: state.roomIndex + 1,
      loop: 1,
      roomCleared: false,
      recordings: [],
      echoes: [],
      bullets: [],
      enemies: [],
      particles: [],
      pickups: [],
    };
  }
  function beginRoomTransition(state, duration = 0.4) {
    if (state.mode !== "playing") return state;
    return { ...state, mode: "roomTransition", roomTransition: duration };
  }
  function tickRoomTransition(state, dt) {
    if (state.mode !== "roomTransition") return { state, ready: false };
    const roomTransition = Math.max(0, state.roomTransition - dt);
    return { state: { ...state, roomTransition }, ready: roomTransition === 0 };
  }

  const frozenLayouts = Object.fromEntries(
    Object.entries(layouts).map(([id, layout]) => [
      id,
      Object.freeze({
        rooms: Object.freeze(layout.rooms.map(Object.freeze)),
        walls: Object.freeze(layout.walls.map(Object.freeze)),
        spawnPoints: Object.freeze(layout.spawnPoints.map(Object.freeze)),
        encounters: layout.encounters
          ? Object.freeze(
              layout.encounters.map((encounter) =>
                Object.freeze({
                  ...encounter,
                  playerStart: Object.freeze(encounter.playerStart),
                  exit: encounter.exit ? Object.freeze(encounter.exit) : null,
                  walls: Object.freeze(encounter.walls.map(Object.freeze)),
                  waves: Object.freeze(encounter.waves),
                  spawnPoints: Object.freeze(encounter.spawnPoints.map(Object.freeze)),
                })
              )
            )
          : null,
      }),
    ])
  );
  return Object.freeze({
    ...frozenLayouts,
    advanceRoomState,
    beginRoomTransition,
    tickRoomTransition,
  });
});
