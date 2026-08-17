(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.GameBalance = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  return Object.freeze({
    baseFireInterval: 0.22,
    splitShot: Object.freeze({
      projectileCount: 3,
      spread: 0.16,
      damageMultiplier: 0.45,
    }),
    chargeLance: Object.freeze({
      fullChargeSeconds: 1.25,
    }),
  });
});
