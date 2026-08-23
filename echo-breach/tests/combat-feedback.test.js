const test = require("node:test");
const assert = require("node:assert/strict");
const CombatFeedback = require("../combat-feedback.js");

test("strong existing projectile profiles receive critical feedback without damage changes", () => {
  assert.equal(CombatFeedback.isCriticalImpact({ damage: 12, charge: 0 }, 12), false);
  assert.equal(CombatFeedback.isCriticalImpact({ damage: 16, charge: 0 }, 12), true);
  assert.equal(CombatFeedback.isCriticalImpact({ damage: 12, charge: 1 }, 12), true);
});

test("critical reactions are stronger and elite roles are data driven", () => {
  const normal = CombatFeedback.impactReaction(false);
  const critical = CombatFeedback.impactReaction(true);
  assert.ok(critical.stun > normal.stun);
  assert.ok(critical.knockback > normal.knockback);
  assert.equal(CombatFeedback.isElite({ type: "blocker" }), true);
  assert.equal(CombatFeedback.isElite({ type: "chaser" }), false);
});
