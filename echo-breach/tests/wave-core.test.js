const test = require("node:test");
const assert = require("node:assert/strict");
const WaveCore = require("../wave-core.js");

test("zone waves expand into delayed role groups without mutating data", () => {
  const zone = {
    id: "lab",
    spawnPoints: [{ x: 1, y: 2 }],
    waveGroups: [
      { delay: 0.8, enemies: ["chaser", "shooter"] },
      { delay: 5, enemies: ["blocker"], elite: true },
    ],
  };
  const warnings = WaveCore.expandZoneWaves(zone);
  assert.deepEqual(
    warnings.map((item) => item.type),
    ["chaser", "shooter", "blocker"]
  );
  assert.equal(warnings[2].elite, true);
  assert.equal(warnings[0].armed, false);
  assert.equal(zone.waveGroups[0].enemies.length, 2);
});

test("off-zone warnings remain frozen until the player enters their zone", () => {
  const waiting = { zoneId: "lab", activationDelay: 1, armed: false };
  assert.deepEqual(WaveCore.tickWarning(waiting, 0.5, "entry"), waiting);
  const armed = WaveCore.tickWarning(waiting, 0.25, "lab");
  assert.equal(armed.armed, true);
  assert.equal(armed.timer, 0.75);
  assert.equal(WaveCore.tickWarning(armed, 0.75, "entry").timer, 0);
});

test("rescue waves preserve their shuttle target through warning expansion", () => {
  const [warning] = WaveCore.expandZoneWaves({
    id: "hangar",
    spawnPoints: [{ x: 10, y: 20 }],
    waveGroups: [{ delay: 1, enemies: ["chaser"], targetShuttle: true }],
  });
  assert.equal(warning.targetShuttle, true);
  assert.equal(warning.zoneId, "hangar");
});

test("monster tempo scales normal waves, spaces spawns, and shortens boss staging", () => {
  const options = {
    spawnDelayMultiplier: 0.25,
    bossSpawnDelayMultiplier: 0.4,
    minimumSpawnInterval: 0.08,
    isBoss: (type) => type === "boss",
  };
  const zone = {
    id: "tempo",
    spawnPoints: [{ x: 10, y: 20 }],
    waveGroups: [
      { delay: 4, enemies: ["chaser", "shooter"] },
      { delay: 7, enemies: ["boss"] },
    ],
  };
  const warnings = WaveCore.expandZoneWaves(zone, options);
  assert.equal(warnings[0].activationDelay, 1);
  assert.equal(warnings[1].activationDelay, 1.08);
  assert.ok(Math.abs(warnings[2].activationDelay - 2.8) < 1e-9);
});
