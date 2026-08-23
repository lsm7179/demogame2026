(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CopyData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ko = {
    upgrades: {
      "split-shot": {
        name: "분열 사격",
        description: "탄환을 2발 발사하지만 각 피해가 30% 감소합니다.",
        detail: "좌우 5°",
      },
      "pulse-cannon": {
        name: "펄스 캐논",
        description: "피해가 55% 증가하고 3회 관통하지만 연사가 38% 느려집니다.",
        detail: "관통 3",
      },
      "charge-lance": {
        name: "차지 랜스",
        description: "1.25초마다 적과 릴레이를 관통하는 충전탄을 발사합니다.",
        detail: "자동 충전",
      },
      "echo-amplifier": {
        name: "Echo 증폭기",
        description: "Echo 피해가 65%에서 80%로 증가하지만 내 피해가 8% 감소합니다.",
        detail: "Echo 강화",
      },
      "extended-memory": {
        name: "기억 연장",
        description: "기록 종료 후 Echo가 마지막 방향으로 2초간 사격합니다.",
        detail: "지속 +2초",
      },
      "record-override": {
        name: "기록 재정의",
        description: "루프 종료 시 현재 기록을 저장하거나 폐기할 수 있습니다.",
        detail: "기록 선택",
      },
      "reinforced-hull": {
        name: "강화 장갑",
        description: "최대 체력이 35 증가하지만 이동 속도가 7% 감소합니다.",
        detail: "체력 +35",
      },
      "vector-thruster": {
        name: "벡터 추진기",
        description: "대시를 2회 저장하지만 대시 거리가 12% 감소합니다.",
        detail: "대시 2회",
      },
      "emergency-rewind": {
        name: "비상 되감기",
        description: "스테이지당 1회, 치명상 시 2초 전 위치에서 생존합니다.",
        detail: "1회 발동",
      },
    },
    equipment: {
      "phase-carbine": {
        name: "위상 카빈",
        description: "중거리에서 표준 피해로 1발씩 자동 사격합니다.",
        stats: ["1발", "표준 연사", "표준 사거리"],
        pros: "안정적인 중거리 전투",
        cons: "특화 효과 없음",
      },
      "breach-shotgun": {
        name: "브리치 샷건",
        description: "32° 범위에 5발을 발사하지만 연사가 55% 느리고 사거리가 45% 짧습니다.",
        stats: ["5발", "발당 피해 34%", "코어 피해 82%"],
        pros: "근거리 다수 공격",
        cons: "짧은 사거리·느린 연사",
      },
      "pulse-rifle": {
        name: "펄스 라이플",
        description: "피해가 35% 증가하고 2회 관통하지만 연사가 45% 느려집니다.",
        stats: ["관통 2", "탄속 +25%", "사거리 +20%"],
        pros: "일렬 목표 관통",
        cons: "벽 관통 불가",
      },
      "chrono-vest": {
        name: "크로노 조끼",
        description: "매 루프 시작 시 피해를 25 흡수하는 보호막을 얻습니다.",
        stats: ["보호막 25", "루프마다 충전"],
        pros: "루프 생존력 증가",
        cons: "소진 후 추가 방어 없음",
      },
      "vector-harness": {
        name: "벡터 하네스",
        description: "대시를 2회 저장하지만 대시 거리가 12% 감소합니다.",
        stats: ["대시 2회", "거리 -12%"],
        pros: "연속 회피",
        cons: "짧은 대시 거리",
      },
      "hunter-coat": {
        name: "헌터 코트",
        description: "이동 속도 10%와 Shard 흡수 반경 45%를 얻지만 최대 체력이 12% 감소합니다.",
        stats: ["이동 +10%", "흡수 반경 +45%", "체력 -12%"],
        pros: "빠른 자원 회수",
        cons: "낮은 최대 체력",
      },
      "echo-lens": {
        name: "Echo 렌즈",
        description: "Echo 피해가 25% 증가하지만 내 피해가 8% 감소합니다.",
        stats: ["Echo 피해 +25%", "내 피해 -8%"],
        pros: "Echo 협공 강화",
        cons: "현재 화력 감소",
      },
      "memory-core": {
        name: "메모리 코어",
        description: "기록 종료 후 Echo가 마지막 위치에서 2초간 사격합니다.",
        stats: ["지속 +2초", "중복 상한 3초"],
        pros: "사격선 유지",
        cons: "연장 중 이동 불가",
      },
      "paradox-ring": {
        name: "패러독스 링",
        description: "Overload 피해가 35% 증가하고 재사용 대기가 15% 감소합니다.",
        stats: ["피해 +35%", "대기 -15%", "최소 0.7초"],
        pros: "동시 타격 강화",
        cons: "단독 사격 효과 없음",
      },
    },
    ui: {
      upgradeHelp: "캠페인 동안 유지할 강화 1개를 선택합니다.",
      equipmentHelp: "장비 1개를 선택해 장착하거나 건너뜁니다.",
      pauseHelp: "ESC: 복귀 · R: 루프 기록 · M: 음소거",
      emptyDescription: "효과 설명이 없습니다.",
      none: "없음",
      current: "현재",
      advantage: "장점",
      drawback: "단점",
      incompatible: "사용 불가",
      slots: { weapon: "무기", armor: "방어구", relic: "시간 유물" },
      categories: { WEAPON: "무기", TIME: "시간", HULL: "기체" },
      rarities: { common: "일반", rare: "희귀", epic: "영웅", legendary: "전설" },
    },
  };

  const en = {
    upgrades: {
      "split-shot": {
        name: "SPLIT SHOT",
        description: "Fires 2 shots; each deals 30% less damage.",
        detail: "±5°",
      },
      "pulse-cannon": {
        name: "PULSE CANNON",
        description: "Deals 55% more damage and pierces 3; fires 38% slower.",
        detail: "Pierce 3",
      },
      "charge-lance": {
        name: "CHARGE LANCE",
        description: "Fires a piercing charged shot every 1.25 seconds.",
        detail: "Auto charge",
      },
      "echo-amplifier": {
        name: "ECHO AMPLIFIER",
        description: "Raises Echo damage to 80%; lowers your damage by 8%.",
        detail: "Echo boost",
      },
      "extended-memory": {
        name: "EXTENDED MEMORY",
        description: "Echo fires from its final position for 2 extra seconds.",
        detail: "+2 seconds",
      },
      "record-override": {
        name: "RECORD OVERRIDE",
        description: "Choose to save or discard each completed loop.",
        detail: "Record choice",
      },
      "reinforced-hull": {
        name: "REINFORCED HULL",
        description: "Gain 35 max health; lose 7% move speed.",
        detail: "+35 health",
      },
      "vector-thruster": {
        name: "VECTOR THRUSTER",
        description: "Store 2 dashes; each dash travels 12% less.",
        detail: "2 dashes",
      },
      "emergency-rewind": {
        name: "EMERGENCY REWIND",
        description: "Once per stage, survive lethal damage at your position 2 seconds ago.",
        detail: "Once per stage",
      },
    },
    equipment: {},
    ui: {},
  };

  const locales = Object.freeze({ ko: Object.freeze(ko), en: Object.freeze(en) });
  function text(group, id, locale = "ko") {
    return locales[locale]?.[group]?.[id] || locales.ko[group]?.[id] || null;
  }

  return Object.freeze({ defaultLocale: "ko", locales, text });
});
