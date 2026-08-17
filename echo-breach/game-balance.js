(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.GameBalance = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  return Object.freeze({
    baseFireInterval: 0.22,
    splitShot: Object.freeze({
      projectileCount: 2,
      spread: (10 * Math.PI) / 180,
      damageMultiplier: 0.7,
    }),
    chargeLance: Object.freeze({
      fullChargeSeconds: 1.25,
    }),
  });
});
