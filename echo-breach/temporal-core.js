(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.TemporalCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function collectShard(state, value, config) {
    if (state.overdriveTimer > 0)
      return {
        ...state,
        overdriveGauge: Math.min(config.maxGauge, state.overdriveGauge + value * 0.25),
      };
    const gauge = state.overdriveGauge + value;
    if (gauge < config.maxGauge) return { ...state, overdriveGauge: gauge };
    return { ...state, overdriveGauge: 0, overdriveTimer: config.duration };
  }

  function tickOverdrive(state, dt) {
    return { ...state, overdriveTimer: Math.max(0, state.overdriveTimer - dt) };
  }

  function anchorPhase(ratio, phases) {
    let id = "armored";
    for (const phase of phases) if (ratio <= phase.threshold) id = phase.id;
    return ratio <= 0 ? "collapsed" : id;
  }

  function canTemporalOverload(
    { now, playerHitAt, echoHitAt, lastOverloadAt, shieldOpen },
    config
  ) {
    return (
      shieldOpen &&
      Math.abs(playerHitAt - echoHitAt) <= config.window &&
      now - lastOverloadAt >= config.cooldown
    );
  }

  return Object.freeze({ collectShard, tickOverdrive, anchorPhase, canTemporalOverload });
});
