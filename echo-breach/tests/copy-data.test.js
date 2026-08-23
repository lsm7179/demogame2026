const test = require("node:test");
const assert = require("node:assert/strict");
const copy = require("../copy-data.js");

const upgradeIds = [
  "split-shot",
  "pulse-cannon",
  "charge-lance",
  "echo-amplifier",
  "extended-memory",
  "record-override",
  "reinforced-hull",
  "vector-thruster",
  "emergency-rewind",
];
const equipmentIds = [
  "phase-carbine",
  "breach-shotgun",
  "pulse-rifle",
  "chrono-vest",
  "vector-harness",
  "hunter-coat",
  "echo-lens",
  "memory-core",
  "paradox-ring",
];

test("Korean is the default locale and covers every upgrade and equipment item", () => {
  assert.equal(copy.defaultLocale, "ko");
  for (const id of upgradeIds) {
    const entry = copy.text("upgrades", id);
    assert.ok(entry?.name && entry?.description && entry?.detail, id);
    assert.match(entry.description, /[가-힣]/, id);
  }
  for (const id of equipmentIds) {
    const entry = copy.text("equipment", id);
    assert.ok(entry?.name && entry?.description && entry?.stats?.length, id);
    assert.match(entry.description, /[가-힣]/, id);
    assert.ok(entry.pros && entry.cons, id);
  }
});

test("choice descriptions are concise single-sentence copy", () => {
  const entries = [
    ...Object.values(copy.locales.ko.upgrades),
    ...Object.values(copy.locales.ko.equipment),
  ];
  for (const entry of entries) {
    assert.ok(entry.description.length <= 58, entry.description);
    assert.equal((entry.description.match(/[.!?。](?=\s|$)/g) || []).length, 1, entry.description);
  }
});

test("missing localized entries fall back to Korean and unknown ids stay safe", () => {
  assert.equal(copy.text("upgrades", "split-shot", "en").name, "SPLIT SHOT");
  assert.equal(copy.text("equipment", "phase-carbine", "en").name, "위상 카빈");
  assert.equal(copy.text("equipment", "missing", "ko"), null);
});
