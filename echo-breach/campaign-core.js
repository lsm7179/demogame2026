(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CampaignCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const RANK_VALUE = Object.freeze({ S: 4, A: 3, B: 2, C: 1 });

  function isFinalVictory(stageNumber, win, finalStage = 5) {
    return Boolean(win && stageNumber === finalStage);
  }

  function summarize(stages) {
    const records = Object.values(stages || {}).filter((record) => record && record.rank);
    return {
      cleared: records.length,
      totalScore: records.reduce((sum, record) => sum + Math.max(0, Number(record.score) || 0), 0),
      sRanks: records.filter((record) => record.rank === "S").length,
      rankPoints: records.reduce((sum, record) => sum + (RANK_VALUE[record.rank] || 0), 0),
    };
  }

  return Object.freeze({ isFinalVictory, summarize });
});
