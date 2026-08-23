const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../equipment-data.js");
const core = require("../equipment-core.js");

const baseStats = {
  maxHp: 100,
  speed: 265,
  playerDamage: 12,
  echoRatio: 0.65,
  dashCharges: 1,
  dashTime: 0.14,
  dashCd: 1.35,
  shardRadius: 135,
  overloadCooldown: 1.2,
};
const baseFire = {
  damage: 12,
  echoBaseDamage: 12,
  fireInterval: 0.22,
  speed: 760,
  range: 1064,
  size: 3,
};

test("empty loadouts normalize invalid ids and wrong slots safely", () => {
  assert.deepEqual(core.createEmptyLoadout(), { weapon: null, armor: null, relic: null });
  assert.deepEqual(
    core.normalizeLoadout({ weapon: "chrono-vest", armor: "missing", relic: "echo-lens" }, data),
    { weapon: null, armor: null, relic: "echo-lens" }
  );
});

test("equipping replaces one slot without mutating the original loadout", () => {
  const original = { weapon: "phase-carbine", armor: "chrono-vest", relic: null };
  const next = core.equipItem(original, "pulse-rifle", data);
  assert.deepEqual(original, { weapon: "phase-carbine", armor: "chrono-vest", relic: null });
  assert.deepEqual(next, { weapon: "pulse-rifle", armor: "chrono-vest", relic: null });
  assert.deepEqual(core.equipItem(next, "echo-lens", data), {
    weapon: "pulse-rifle",
    armor: "chrono-vest",
    relic: "echo-lens",
  });
  assert.deepEqual(core.equipItem(next, "missing", data), next);
  assert.equal(core.unequipSlot(next, "weapon").weapon, null);
});

test("incompatible equipment and upgrade combinations are rejected", () => {
  const shotgun = { weapon: "breach-shotgun", armor: null, relic: null };
  assert.equal(core.validateLoadout(shotgun, data, ["split-shot"]).valid, false);
  assert.deepEqual(
    core.equipItem(core.createEmptyLoadout(), "breach-shotgun", data, ["charge-lance"]),
    core.createEmptyLoadout()
  );
  assert.equal(
    core.validateLoadout({ weapon: "pulse-rifle" }, data, ["pulse-cannon"]).valid,
    false
  );
});

test("equipment candidates are unique, reproducible, filtered, and shortage safe", () => {
  const args = {
    items: data.items,
    loadout: { weapon: "phase-carbine", armor: null, relic: null },
    ownedItems: ["chrono-vest"],
    upgrades: ["charge-lance"],
    count: 3,
    rarityWeights: data.rarityWeights,
  };
  const first = core.getEquipmentCandidates({ ...args, rng: () => 0.42 });
  const second = core.getEquipmentCandidates({ ...args, rng: () => 0.42 });
  assert.deepEqual(
    first.map((item) => item.id),
    second.map((item) => item.id)
  );
  assert.equal(first.length, 3);
  assert.equal(new Set(first.map((item) => item.id)).size, 3);
  assert.ok(
    !first.some((item) => ["phase-carbine", "chrono-vest", "breach-shotgun"].includes(item.id))
  );
  assert.deepEqual(core.getEquipmentCandidates({ ...args, items: [], rng: () => 0 }), []);
  assert.equal(
    core.getEquipmentCandidates({
      ...args,
      items: data.items.slice(0, 1),
      loadout: {},
      ownedItems: [],
      rng: () => 0,
    }).length,
    1
  );
});

test("rarity weights control deterministic candidate selection", () => {
  const candidates = core.getEquipmentCandidates({
    items: data.items,
    loadout: {},
    ownedItems: [],
    count: 1,
    rarityWeights: { common: 0, rare: 0, legendary: 1 },
    rng: () => 0,
  });
  assert.equal(candidates[0].rarity, "legendary");
});

test("room reward chances and one-time claims are deterministic", () => {
  assert.equal(
    core.shouldOfferEquipmentReward("normal", data.rewards, () => 0.34),
    true
  );
  assert.equal(
    core.shouldOfferEquipmentReward("normal", data.rewards, () => 0.35),
    false
  );
  assert.equal(
    core.shouldOfferEquipmentReward("anchor", data.rewards, () => 0.999),
    true
  );
  const first = core.claimEquipmentReward({
    loadout: core.createEmptyLoadout(),
    ownedItems: [],
    itemId: "phase-carbine",
    equipmentData: data,
  });
  const duplicate = core.claimEquipmentReward({
    loadout: first.loadout,
    ownedItems: first.ownedItems,
    itemId: "phase-carbine",
    equipmentData: data,
  });
  assert.equal(first.selected, true);
  assert.equal(duplicate.selected, false);
  assert.deepEqual(duplicate.ownedItems, ["phase-carbine"]);
});

test("weapon equipment builds final profiles without changing the no-equipment baseline", () => {
  const plain = core.buildFireProfile(baseFire, {}, [], data);
  assert.equal(plain.count, 1);
  assert.equal(plain.damage, 12);
  assert.equal(plain.fireInterval, 0.22);
  const carbine = core.buildFireProfile(baseFire, { weapon: "phase-carbine" }, [], data);
  assert.equal(carbine.count, 1);
  assert.equal(carbine.damage, plain.damage);
  const shotgun = core.buildFireProfile(baseFire, { weapon: "breach-shotgun" }, [], data);
  assert.equal(shotgun.count, 5);
  assert.equal(shotgun.damage, 12 * 0.34);
  assert.equal(shotgun.range, 1064 * 0.55);
  const rifle = core.buildFireProfile(baseFire, { weapon: "pulse-rifle" }, [], data);
  assert.equal(rifle.pierce, 2);
  assert.equal(rifle.fireInterval, 0.22 * 1.45);
  assert.equal(rifle.speed, 760 * 1.25);
});

test("legacy weapon upgrades are applied after compatible equipment", () => {
  const split = core.buildFireProfile(baseFire, { weapon: "phase-carbine" }, ["split-shot"], data);
  assert.equal(split.count, 2);
  assert.equal(split.damage, 12 * 0.7);
  const safeShotgun = core.buildFireProfile(
    baseFire,
    { weapon: "breach-shotgun" },
    ["split-shot"],
    data
  );
  assert.equal(safeShotgun.count, 5);
  const safeRifle = core.buildFireProfile(
    baseFire,
    { weapon: "pulse-rifle" },
    ["pulse-cannon"],
    data
  );
  assert.equal(safeRifle.pierce, 2);
});

test("armor and relic stats obey caps and stacking policies", () => {
  const vest = core.buildEquipmentStats(baseStats, { armor: "chrono-vest" }, data);
  assert.equal(vest.loopShield, 25);
  const vector = core.buildEquipmentStats(baseStats, { armor: "vector-harness" }, data, [
    "vector-thruster",
  ]);
  assert.equal(vector.dashCharges, 2);
  assert.equal(vector.dashTime, 0.14 * 0.88);
  assert.equal(vector.dashCd, 1.35 * 0.9);
  const thrusterOnly = core.buildEquipmentStats(baseStats, {}, data, ["vector-thruster"]);
  assert.equal(thrusterOnly.dashTime, 0.14 * 0.88);
  const hunter = core.buildEquipmentStats(baseStats, { armor: "hunter-coat" }, data);
  assert.equal(hunter.speed, 265 * 1.1);
  assert.equal(hunter.shardRadius, 135 * 1.45);
  assert.equal(hunter.maxHp, 88);
  const lens = core.buildEquipmentStats(baseStats, { relic: "echo-lens" }, data);
  assert.equal(lens.playerDamage, 12 * 0.92);
  assert.equal(lens.echoRatio, 0.65 * 1.25);
  const memory = core.buildEquipmentStats(baseStats, { relic: "memory-core" }, data, [
    "extended-memory",
  ]);
  assert.equal(memory.memorySeconds, 3);
  const ring = core.buildEquipmentStats(baseStats, { relic: "paradox-ring" }, data);
  assert.equal(ring.overloadDamageMultiplier, 1.35);
  assert.equal(ring.overloadCooldown, 1.2 * 0.85);
});

test("shield damage is absorbed before health", () => {
  assert.deepEqual(core.applyShieldDamage(25, 100, 12), { shield: 13, hp: 100, absorbed: 12 });
  assert.deepEqual(core.applyShieldDamage(5, 100, 12), { shield: 0, hp: 93, absorbed: 5 });
});

test("Pulse penetration stops at walls and the Chrono Anchor", () => {
  assert.deepEqual(core.resolveProjectileImpact(2, "enemy"), { pierce: 1, removed: false });
  assert.deepEqual(core.resolveProjectileImpact(2, "relay"), { pierce: 1, removed: false });
  assert.deepEqual(core.resolveProjectileImpact(2, "wall"), { pierce: 0, removed: true });
  assert.deepEqual(core.resolveProjectileImpact(2, "anchor"), { pierce: 0, removed: true });
});
