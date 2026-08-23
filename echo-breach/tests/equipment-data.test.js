const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../equipment-data.js");

test("nine equipment definitions have unique valid ids, slots, and rarities", () => {
  assert.equal(data.items.length, 9);
  assert.equal(new Set(data.items.map((item) => item.id)).size, 9);
  for (const item of data.items) {
    assert.ok(data.slots.includes(item.slot));
    assert.ok(data.rarities.includes(item.rarity));
    assert.ok(item.name && item.description && item.visual.icon);
    assert.ok(Array.isArray(item.statSummary));
    for (const id of item.incompatible)
      assert.ok(data.items.some((candidate) => candidate.id === id));
  }
});

test("equipment data and nested balance records are immutable", () => {
  const shotgun = data.items.find((item) => item.id === "breach-shotgun");
  assert.ok(Object.isFrozen(data.items));
  assert.ok(Object.isFrozen(shotgun));
  assert.ok(Object.isFrozen(shotgun.fireProfile));
  assert.ok(Object.isFrozen(data.rarityWeights));
  assert.ok(Object.isFrozen(data.limits));
});

test("weapon profiles preserve their intended combat roles", () => {
  const byId = Object.fromEntries(data.items.map((item) => [item.id, item]));
  assert.equal(byId["phase-carbine"].fireProfile.projectileCount, 1);
  assert.equal(byId["breach-shotgun"].fireProfile.projectileCount, 5);
  assert.equal(byId["breach-shotgun"].fireProfile.spreadDegrees, 32);
  assert.equal(byId["breach-shotgun"].modifiers.damageMultiplier, 0.34);
  assert.equal(byId["breach-shotgun"].fireProfile.rangeMultiplier, 0.55);
  assert.equal(byId["pulse-rifle"].fireProfile.pierce, 2);
  assert.equal(byId["pulse-rifle"].modifiers.fireIntervalMultiplier, 1.45);
});
