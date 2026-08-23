# ECHO BREACH — Campaign Prototype Design

## 핵심 판타지와 서사

NEXUS의 Chrono Anchor가 각 구역을 파괴 직전의 순간에 고정했다. 생존자는 같은 20초에 갇혀 있고 방어 시스템은 매번 복원된다. ECHO-07만 기억과 전투 기록을 전달한다. Echo는 분신이 아니라 이전 시간선의 행동 데이터이며, Anchor 파괴는 시간 정상화와 구조를 위한 명확한 행동이다. 브리핑과 결과의 1~3줄 통신만으로 전달한다.

## 상태 흐름

`title → difficulty → stageSelect → briefing → playing → loopTransition → result → equipmentSelect → upgradeSelect`가 최초 클리어 흐름이다. 일반/정예 방 보상은 `playing → equipmentSelect → playing`으로 복귀한다. `pause`, `recordOverride`는 전투의 일시적 분기다. 장비 선택 중 시뮬레이션은 정지하고 RAF는 하나만 유지한다.

## 난이도 CONFIG

| 난이도    | 루프 | 최대 | 적 탄속 | 받는 피해 | 대시 CD | 릴레이 감소 | 보호막 | 점수 |
| --------- | ---: | ---: | ------: | --------: | ------: | ----------: | -----: | ---: |
| STORY     | 25초 |    6 |    0.80 |      0.70 |    0.82 |        0.60 |  6.2초 | 0.80 |
| OPERATIVE | 20초 |    5 |    1.00 |      1.00 |    1.00 |        1.00 |  5.3초 | 1.00 |
| PARADOX   | 18초 |    5 |    1.18 |      1.08 |    1.00 |        1.35 |  4.4초 | 1.35 |

게임 로직은 선택 난이도의 수치만 읽으며 난이도별 분기문을 사용하지 않는다. STORY의 안내 문구만 UI 계층에서 상세화된다.

## Echo 기록 규칙

위치와 조준은 50ms 간격으로 기록하고 시간 기준으로 보간한다. Canvas 안에 마우스가 있는 동안 ECHO-07은 0.22초 간격으로 조준 방향에 자동 사격한다. 실제 발사 이벤트만 `weapon, angle, count, spread, damage, pierce, size, speed, charge`와 함께 보존한다. 대시는 방향과 시각 이벤트를 기록한다. Charge Lance는 자동 충전 후 완충 시 발사되므로 Echo의 충전 완료 결과와 발사 시간이 동일하다. Echo 피해 배율은 기본 65%, Amplifier 보유 시 80%다.

## 스테이지별 Echo 판단

### Stage 1 — AWAKENING

3900×1080 월드의 세 구역을 전환 화면 없이 연결한다. 첫 루프의 Echo가 입구 전투를 반복하는 동안 현재 플레이어가 더 깊이 전진하고, INFESTED LAB의 시간 스위치를 과거 사격에 맡기면 중앙 지름길이 열린다. 마지막에는 누적된 전체 경로의 Echo가 릴레이와 Anchor 협공에 합류한다.

### Stage 2 — SPLIT CURRENT

중앙 장벽은 탄환과 실체 이동을 막는다. 왼쪽 스위치가 42% 이상 충전된 동안에만 통로가 열린다. 첫 기록의 Echo를 장치 조작자로 두고 현재 플레이어가 오른쪽으로 건너간다. 릴레이 하나는 도달 가능한 범위 안에서 수평 90px, 수직 28px로 이동한다.

### Stage 3 — RESCUE WINDOW

적 셋 중 하나는 탈출선을 목표로 삼는다. 탈출선 피해와 생존자 수는 루프 사이에 유지된다. 파괴되면 구조 보상만 잃고 적이 플레이어를 다시 목표로 삼아 Anchor 공략은 계속할 수 있다. 먼저 호위 사격을 기록하고 이후 현재 기체가 릴레이를 맡는 역할 분리가 핵심이다.

## 업그레이드 규칙

무기 업그레이드 세 개는 상호 비호환이다. Split Shot은 중심 기준 좌우 5도의 2발·개별 70%로 총 잠재 피해 140%다. Pulse Cannon은 발사 간격 162%·피해 155%·3회 관통, Charge Lance는 1.25초 자동 충전과 완충 관통을 제공한다. Amplifier는 현재 피해 92%와 Echo 80%, Extended Memory는 기록 종료 후 2초 지원 사격, Record Override는 저장/폐기 선택을 제공한다. Hull은 +35 HP/-7% 속도, Thruster는 거리 -12%인 2회 충전, Emergency Rewind는 스테이지 1회 2초 전 위치와 30% 체력 복귀다.

## 장비 규칙과 현재 수치

장비는 `weapon`, `armor`, `relic` 세 슬롯이며 업그레이드를 삭제하거나 대체하지 않는다. Weapon이 기본 발사 프로필을 정한 뒤 호환되는 Upgrade modifier를 한 번 적용한다. Shotgun+Split/Charge, Pulse Rifle+Pulse Cannon은 후보에서 제외한다.

| 장비           | 희귀도    | 핵심 수치                                                       |
| -------------- | --------- | --------------------------------------------------------------- |
| Phase Carbine  | COMMON    | 1발, 피해/간격/탄속/사거리 ×1                                   |
| Breach Shotgun | RARE      | 5발, 총 32°, 발당 ×0.34, 간격 ×1.55, 사거리 ×0.55, Anchor ×0.82 |
| Pulse Rifle    | RARE      | 피해 ×1.35, 간격 ×1.45, 탄속 ×1.25, 사거리 ×1.2, 관통 2         |
| Chrono Vest    | COMMON    | 새 루프 보호막 25                                               |
| Vector Harness | RARE      | 대시 2회, 거리 ×0.88; Thruster 중복 시 재충전 ×0.9              |
| Hunter Coat    | LEGENDARY | 속도 ×1.1, Shard 반경 ×1.45, 최대 HP ×0.88                      |
| Echo Lens      | RARE      | 현재 피해 ×0.92, Echo 배율 ×1.25                                |
| Memory Core    | LEGENDARY | 기록 종료 후 2초; Extended Memory와 최대 3초                    |
| Paradox Ring   | LEGENDARY | Overload 피해 ×1.35, 쿨다운 ×0.85(최소 0.7초)                   |

보상 확률은 일반 0.35, 정예 0.75, Anchor 1.0이며 후보 수는 3이다. 희귀도 가중치는 65/28/7이다. 소유·현재 장착·업그레이드 비호환 장비를 제외하고 주입 RNG로 가중 추첨한다.

사격 이벤트는 `weaponId`, `fireType`, `angle`, `count`, `spread`, `damage`, `echoBaseDamage`, `fireInterval`, `speed`, `range`, `pierce`, `coreDamageMultiplier`, `visualProfile`의 원시 복사본을 소유한다. 따라서 현재 loadout이나 장비 데이터 변경이 진행 중인 Echo를 바꾸지 않는다. Echo 배율은 기록 피해에 한 번만 적용하고 Overdrive가 그 뒤에 곱해진다.

## 릴레이, Anchor와 적

릴레이는 스테이지 데이터 기준 기본 2개, 필요 2개이며 100 충전, 탄환당 12, 기본 초당 8 감소다. 필요한 릴레이가 동시 완충되면 난이도별 시간만큼 보호막이 열린다. Anchor 체력은 Stage 1/2/3에서 650/720/760이며 누적 피해는 루프를 넘는다. RIFT HOUND는 이동 압박, SPORE CASTER는 원거리 사격, ANCHOR BRUTE는 릴레이 시야 방해 역할이다. LEECH는 제한된 감속, CORE GUARD는 릴레이 감소 강화, RIFT BLOATER는 경고 후 쌍방 폭발을 제공한다.

## 연속 월드와 연결형 룸 규칙

Stage 1은 CONTAINMENT HALL, INFESTED LAB, ANCHOR CHAMBER를 하나의 월드 좌표계로 잇는다. 카메라는 현재 플레이어를 부드럽게 추적하지만 기록에는 위치·조준·실제 발사·대시의 월드 값만 저장한다. 중간 구역 진입은 Echo·총알·적·Shard·Overdrive를 초기화하거나 장비 화면을 열지 않는다. 루프 종료 때만 플레이어, 적, 릴레이, 스위치와 단기 전투 상태를 시작 상태로 복원하고 기록된 Echo와 Anchor 누적 피해 등 기존 영속 정책은 유지한다. 화면 밖 개체도 동일하게 업데이트하며 미니맵과 화면 가장자리 Echo 표식으로 위치를 안내한다.

Stage 2~3은 `room-data.js`의 기존 방·벽·적 생성 지점과 전환 정책을 유지한다.

몬스터가 떨어뜨리는 Chrono Shard는 플레이어만 흡수한다. 게이지 100에서 8초 Overdrive가 자동 발동해 플레이어 연사 +25%, Echo 피해 +30%, Anchor 피해 +50%를 제공한다. Anchor는 ARMORED/CRACKED/UNSTABLE/CRITICAL/COLLAPSED 단계를 가지며 플레이어와 Echo가 0.25초 안에 명중하면 내부 쿨다운 후 Temporal Overload가 발생한다.

## 랭크

독립 `calculateRank` 함수가 성공 여부, 적은 루프, 받은 피해, 남은 시간, Echo의 코어 명중 비율, 구조 생존율, 난이도 배율을 점수화한다. 각 스테이지의 S/A/B 임계값과 비교해 S/A/B/C를 결정하고 결과 화면에 루프·피해·협공·시간 또는 구조 인원을 근거로 표시한다.

## 저장 스키마 v3

```js
{ version: 3, difficulty, unlockedStage, stages: { [stageId]: { rank, score } }, upgrades: [], loadout: { weapon, armor, relic }, equipmentOwned: [], muted, hasCampaign }
```

최고 랭크는 S>A>B>C 순으로, 점수는 최대값으로만 갱신한다. v2는 기존 진행을 보존해 v3으로 옮기며 장비만 빈 상태로 시작한다. 손상 JSON은 기본값으로 복구하고 잘못된 장비 필드는 정규화한다.

## 플레이테스트 질문

1. 브리핑만으로 Anchor를 파괴해야 하는 이유가 전달되는가?
2. Stage 2에서 Echo를 공격수가 아닌 장치 조작자로 인식하는가?
3. Stage 3에서 호위 기록과 Anchor 공략의 역할 교대가 자연스러운가?
4. 세 무기 선택이 다음 기록의 위치와 타이밍을 실제로 바꾸는가?
5. Record Override가 전략적 수정인가, 흐름 방해인가?
6. 탈출선 파괴 후에도 실패감은 남되 계속할 동기가 있는가?
7. 랭크 근거가 다음 도전을 명확하게 만드는가?
8. Shotgun 위치 선정, Rifle 사격선, Carbine 안정성이 실제로 다른 기록 전략을 만드는가?
9. Armor와 Relic 선택이 다음 방에서 체감되지만 기본 loadout을 무의미하게 만들지 않는가?

## Stage 4 전에 검증할 것

기존 Echo를 읽기 쉬운지, 기록 실패를 회복할 수 있는지, Stage 2 장벽 통과가 안정적인지, 적이 반복 경로를 과도하게 처벌하지 않는지 먼저 확인한다. 이 네 가지가 안정된 뒤에만 적 Echo가 플레이어 기록을 분석하도록 확장한다.
