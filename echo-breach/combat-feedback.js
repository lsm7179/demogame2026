(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CombatFeedback = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const config = Object.freeze({
    criticalDamageRatio: 1.3,
    criticalCharge: 0.9,
    normalStun: 0.055,
    criticalStun: 0.11,
    normalKnockback: 6,
    criticalKnockback: 13,
    eliteTypes: Object.freeze(["blocker", "core-guard"]),
    comboFeedbackThreshold: 3,
    strongComboThreshold: 5,
  });
  function isCriticalImpact(profile, baseDamage) {
    return (
      (Number(profile?.charge) || 0) >= config.criticalCharge ||
      (Number(profile?.damage) || 0) >= Math.max(1, baseDamage) * config.criticalDamageRatio
    );
  }
  function impactReaction(critical) {
    return critical
      ? { stun: config.criticalStun, knockback: config.criticalKnockback }
      : { stun: config.normalStun, knockback: config.normalKnockback };
  }
  function isElite(enemy) {
    return Boolean(enemy?.elite || config.eliteTypes.includes(enemy?.type));
  }
  return Object.freeze({ config, isCriticalImpact, impactReaction, isElite });
});
