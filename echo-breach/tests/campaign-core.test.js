const test = require("node:test");
const assert = require("node:assert/strict");
const CampaignCore = require("../campaign-core.js");

test("only a Stage 5 victory enters the campaign ending", () => {
  assert.equal(CampaignCore.isFinalVictory(5, true), true);
  assert.equal(CampaignCore.isFinalVictory(4, true), false);
  assert.equal(CampaignCore.isFinalVictory(5, false), false);
});

test("campaign summary ignores damaged records and preserves best scores", () => {
  assert.deepEqual(
    CampaignCore.summarize({
      a: { rank: "S", score: 1000 },
      b: { rank: "B", score: 500 },
      bad: null,
    }),
    { cleared: 2, totalScore: 1500, sRanks: 1, rankPoints: 6 }
  );
});
