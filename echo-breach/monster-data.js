(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MonsterData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  return Object.freeze({
    chaser: Object.freeze({
      name: "RIFT HOUND",
      role: "pursuer",
      radius: 15,
      hp: 30,
      speed: 92,
      score: 120,
      color: "#f03b56",
      accent: "#ff9a7d",
    }),
    shooter: Object.freeze({
      name: "SPORE CASTER",
      role: "artillery",
      radius: 18,
      hp: 46,
      speed: 62,
      score: 180,
      color: "#ba2949",
      accent: "#ffd0df",
    }),
    blocker: Object.freeze({
      name: "ANCHOR BRUTE",
      role: "interceptor",
      radius: 23,
      hp: 95,
      speed: 48,
      score: 240,
      color: "#871d3b",
      accent: "#ff6685",
    }),
  });
});
