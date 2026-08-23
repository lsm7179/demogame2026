const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../equipment-data.js");
const core = require("../equipment-core.js");

const defaults = {
  version: 3,
  difficulty: "operative",
  unlockedStage: 1,
  stages: {},
  upgrades: [],
  loadout: core.createEmptyLoadout(),
  equipmentOwned: [],
};

test("schema two saves migrate without losing campaign progress", () => {
  const migrated = core.migrateSave(
    {
      version: 2,
      difficulty: "paradox",
      unlockedStage: 3,
      stages: { awakening: { rank: "S", score: 4200 } },
      upgrades: ["split-shot"],
    },
    defaults,
    data,
    3
  );
  assert.equal(migrated.version, 3);
  assert.equal(migrated.difficulty, "paradox");
  assert.equal(migrated.unlockedStage, 3);
  assert.deepEqual(migrated.stages.awakening, { rank: "S", score: 4200 });
  assert.deepEqual(migrated.upgrades, ["split-shot"]);
  assert.deepEqual(migrated.loadout, { weapon: null, armor: null, relic: null });
  assert.deepEqual(migrated.equipmentOwned, []);
});

test("equipment save normalization removes invalid ids, duplicates, and slot mismatches", () => {
  const normalized = core.normalizeEquipmentSave(
    {
      loadout: { weapon: "chrono-vest", armor: "chrono-vest", relic: "missing" },
      equipmentOwned: ["chrono-vest", "chrono-vest", "missing", "echo-lens"],
    },
    data
  );
  assert.deepEqual(normalized.loadout, { weapon: null, armor: "chrono-vest", relic: null });
  assert.deepEqual(normalized.equipmentOwned, ["chrono-vest", "echo-lens"]);
});
