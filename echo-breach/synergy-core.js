(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SynergyCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const config = Object.freeze({
    crossfireWindow: 0.3,
    crossfireCooldown: 0.8,
    crossfireBonusDamage: 6,
    chainWindow: 1.2,
    chainRadius: 76,
    chainDamage: 10,
    convergenceEchoes: 2,
    convergenceMultiplier: 1.15,
  });
  function registerHit(state = {}, byEcho, now) {
    const next = { ...state, [byEcho ? "echoHitAt" : "playerHitAt"]: now };
    const crossfire =
      Number.isFinite(next.echoHitAt) &&
      Number.isFinite(next.playerHitAt) &&
      Math.abs(next.echoHitAt - next.playerHitAt) <= config.crossfireWindow &&
      now - (next.lastCrossfireAt ?? -Infinity) >= config.crossfireCooldown;
    if (crossfire) next.lastCrossfireAt = now;
    return { state: next, crossfire };
  }
  function registerKill(state = {}, byEcho, now) {
    const team = byEcho ? "echo" : "player";
    const chain =
      state.lastKillTeam &&
      state.lastKillTeam !== team &&
      now - state.lastKillAt <= config.chainWindow;
    return { state: { lastKillTeam: team, lastKillAt: now }, chain: Boolean(chain) };
  }
  function convergenceMultiplier(echoCount) {
    return echoCount >= config.convergenceEchoes ? config.convergenceMultiplier : 1;
  }
  return Object.freeze({ config, registerHit, registerKill, convergenceMultiplier });
});
