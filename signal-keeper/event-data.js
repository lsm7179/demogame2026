// 사건은 이 파일에서만 편집합니다. effect는 해결했을 때의 보조 효과입니다.
const SIGNAL_EVENTS = [
  { id:"ward-oxygen", zone:"NORTH", title:"병동 산소 경보", description:"산소 공급을 복구하세요", icon:"✚", energyCost:1, duration:8, rescued:18, stabilityEffect:2, failureEffect:9, weight:12, minimumPhase:0, effect:"northDamage", mini:"nodes" },
  { id:"apartment-lift", zone:"NORTH", title:"아파트 승강기", description:"고립 주민을 구조하세요", icon:"▣", energyCost:2, duration:9, rescued:30, stabilityEffect:1, failureEffect:11, weight:10, minimumPhase:0, effect:"northDamage", mini:"nodes" },
  { id:"rescue-drone", zone:"NORTH", title:"구조 드론 충전", description:"다음 구조를 지원합니다", icon:"✦", energyCost:2, duration:10, rescued:22, stabilityEffect:2, failureEffect:7, weight:7, minimumPhase:1, effect:"northShield", mini:"nodes" },
  { id:"rail-switch", zone:"CENTRAL", title:"철도 선로 전환", description:"열차 충돌을 막으세요", icon:"⇄", energyCost:2, duration:8, rescued:34, stabilityEffect:1, failureEffect:12, weight:10, minimumPhase:0, effect:"traffic", mini:"frequency" },
  { id:"radio-relay", zone:"CENTRAL", title:"재난 통신 중계", description:"경보망을 되살리세요", icon:"◉", energyCost:1, duration:9, rescued:16, stabilityEffect:2, failureEffect:8, weight:11, minimumPhase:0, effect:"comms", mini:"frequency" },
  { id:"city-hall-data", zone:"CENTRAL", title:"행정 데이터 백업", description:"대피 명단을 보존하세요", icon:"▤", energyCost:3, duration:11, rescued:42, stabilityEffect:3, failureEffect:5, weight:5, minimumPhase:1, effect:"crossShield", mini:"frequency" },
  { id:"substation-cool", zone:"SOUTH", title:"변전소 냉각", description:"전력망 과열을 막으세요", icon:"ϟ", energyCost:2, duration:8, rescued:28, stabilityEffect:2, failureEffect:13, weight:10, minimumPhase:0, effect:"fastCharge", mini:"nodes" },
  { id:"factory-valve", zone:"SOUTH", title:"산업 밸브 차단", description:"유해 누출을 차단하세요", icon:"▲", energyCost:3, duration:10, rescued:38, stabilityEffect:1, failureEffect:14, weight:7, minimumPhase:1, effect:"capacity", mini:"nodes" },
  { id:"shelter-lights", zone:"SOUTH", title:"대피소 조명", description:"대피 경로를 밝히세요", icon:"⌂", energyCost:1, duration:9, rescued:17, stabilityEffect:2, failureEffect:7, weight:10, minimumPhase:0, effect:"none", mini:"nodes" },
  { id:"ambulance-route", zone:"NORTH", title:"구급차 우선 신호", description:"응급차 길을 여세요", icon:"✚", energyCost:2, duration:8, rescued:32, stabilityEffect:1, failureEffect:12, weight:8, minimumPhase:2, effect:"northDamage", mini:"nodes" },
  { id:"mobile-network", zone:"CENTRAL", title:"이동통신 기지국", description:"연락망을 확보하세요", icon:"⌁", energyCost:2, duration:9, rescued:27, stabilityEffect:2, failureEffect:11, weight:8, minimumPhase:2, effect:"comms", mini:"frequency" },
  { id:"generator-prime", zone:"SOUTH", title:"비상 발전기 기동", description:"전력 2를 즉시 회복", icon:"⚡", energyCost:1, duration:9, rescued:15, stabilityEffect:2, failureEffect:9, weight:8, minimumPhase:2, effect:"fastCharge", mini:"nodes" },
];

if (typeof window !== "undefined") window.SIGNAL_EVENTS = SIGNAL_EVENTS;
if (typeof module !== "undefined") module.exports = SIGNAL_EVENTS;
