# ECHO BREACH

NEXUS 연구시설은 파괴 직전의 순간을 반복하고 있습니다. 인간 요원 **ECHO-07**은 이전 시간선의 이동·조준·자동 사격·대시 기록을 Echo로 전송해 각 구역의 **Chrono Anchor**를 파괴하고 생존자를 구해야 합니다.

저장소: https://github.com/lsm7179/demogame2026

GitHub Pages 배포 주소(활성화 후): https://lsm7179.github.io/demogame2026/

## 실행

외부 의존성이 없습니다. 이 폴더에서 정적 서버를 실행합니다.

```sh
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. 최신 데스크톱 Chrome, Firefox, Safari를 권장합니다.

## 개발 검사

저장소 루트에서 의존성을 설치하고 전체 검사를 실행합니다.

```sh
npm ci
npm run check
```

- `npm run format`: ECHO BREACH 소스와 문서 포맷
- `npm run format:check`: 포맷 변경 필요 여부 검사
- `npm test`: Echo 핵심 시간 기록·재생 회귀 테스트
- `npm run release:check`: 패키지, 게임 버전, 저장 스키마와 Pages 배포 범위 검사
- `npm run check`: 위 검사와 JavaScript 문법 검사를 한 번에 실행

## 조작

- WASD: 이동
- 마우스: 조준 방향 지정 / Canvas 안에서 자동 사격
- Space: 대시
- R: 현재 루프 조기 기록
- Esc: 일시정지
- M: 음소거

왼쪽 버튼은 현재 전투 기능에 사용하지 않습니다. 포인터가 게임 영역을 벗어나면 마지막 조준 방향은 유지되지만 자동 사격은 중단됩니다.

## 캠페인 흐름

타이틀에서 새 캠페인 또는 계속하기를 선택하고 난이도와 해금된 스테이지를 고릅니다. 일반방은 35%, 정예방은 75%, Chrono Anchor는 100% 확률로 소유하지 않은 장비 후보를 최대 3개 제공합니다. Stage 1에서는 연속 전진을 끊지 않도록 중간 구역 장비 선택을 생략하고 Anchor 파괴 후 보상을 제공합니다. 스테이지 최초 클리어는 `결과 → 장비 → Chrono Crystal 업그레이드 → 구역 지도` 순서로 진행됩니다. Stage 4와 5는 이후 확장을 위한 잠금 카드와 데이터만 포함합니다.

## 플레이 가능한 스테이지

- **Stage 1 — AWAKENING:** 3900×1080 연속 월드에서 CONTAINMENT HALL, INFESTED LAB, ANCHOR CHAMBER를 화면 전환 없이 돌파합니다. Echo는 이전 루프의 전체 월드 경로를 재생하며, 스위치를 맡은 Echo가 중앙 지름길을 여는 동안 현재 플레이어가 더 깊이 전진해 릴레이 2개와 Anchor를 공략합니다.
- **Stage 2 — SPLIT CURRENT:** 스위치 제어실의 Echo가 사격을 계속해야 중앙 통로가 열리고 반대편 Anchor실로 진입할 수 있습니다.
- **Stage 3 — RESCUE WINDOW:** 탈출선 격납고를 호위하는 기록을 남긴 뒤 연결 통로를 지나 릴레이실과 Anchor 제어실을 공략합니다.

ECHO-07과 Echo는 머리·몸통·좌우 다리가 구분되는 8방향 탑다운 인간 요원으로 표현됩니다. 몸의 방향은 8방향으로 읽히지만 총기는 실제 마우스 조준각을 유지하며, 보행·사격 반동·대시 기울기·피격 움찔 애니메이션을 사용합니다. 시간 오염체는 추격형 **RIFT HOUND**, 원거리형 **SPORE CASTER**, 릴레이 차단형 **ANCHOR BRUTE**로 역할과 외형이 구분됩니다.

감속을 거는 **CHRONO LEECH**, 릴레이 감소를 강화하는 **CORE GUARD**, 사망 후 적과 플레이어 모두를 공격하는 **RIFT BLOATER**도 등장합니다. 처치 시 Chrono Shard가 드롭되며 게이지 100에서 8초 Overdrive가 발동합니다. Anchor는 체력에 따라 5단계로 변하고 플레이어와 Echo가 0.25초 안에 함께 명중하면 Temporal Overload가 발생합니다.

## 난이도

- **STORY:** 25초, 6루프, 적 탄속 80%, 받는 피해 70%, 빠른 대시, 느린 릴레이 감소, 긴 보호막 개방.
- **OPERATIVE:** 20초, 5루프, 기존 프로토타입 표준 밸런스.
- **PARADOX:** 18초, 5루프, 적 탄속·조합·릴레이 감소 강화, 짧은 보호막 개방, 점수 배율 1.35.

## 업그레이드

SPLIT SHOT, PULSE CANNON, CHARGE LANCE, ECHO AMPLIFIER, EXTENDED MEMORY, RECORD OVERRIDE, REINFORCED HULL, VECTOR THRUSTER, EMERGENCY REWIND를 구현했습니다. 사격 이벤트에는 발사 당시 무기·각도·탄 수·피해·관통·충전량이 저장되어 Echo가 같은 공격을 재생합니다.

## 장비

장비는 캠페인 modifier인 업그레이드와 별개이며 같은 슬롯 장비를 고르면 교체됩니다. 선택 화면에서는 장착하거나 `SKIP CACHE`를 고를 수 있고 전투·루프·Overdrive 시간은 정지합니다.

- **Weapon:** PHASE CARBINE(표준), BREACH SHOTGUN(근거리 5발), PULSE RIFLE(관통 2)
- **Armor:** CHRONO VEST(루프 보호막 25), VECTOR HARNESS(짧은 대시 2회), HUNTER COAT(속도·Shard 반경 증가/체력 감소)
- **Temporal Relic:** ECHO LENS(Echo 중심 화력), MEMORY CORE(최대 3초 지원 사격), PARADOX RING(Overload 강화)
- 희귀도 가중치는 COMMON 65, RARE 28, LEGENDARY 7입니다.
- Shotgun은 Split Shot·Charge Lance, Pulse Rifle은 Pulse Cannon과 비호환이며 후보 단계에서 제외됩니다. 기존 업그레이드는 삭제하지 않습니다.
- Echo 사격 이벤트는 장비 ID만 참조하지 않고 당시 탄 수, 확산, 피해, 탄속, 사거리, 관통, 코어 보정과 시각 프로필을 깊은 복사합니다. 장비 교체 후에도 기존 Echo의 무장은 변하지 않습니다.

## 저장

`echoBreachCampaign` 키에 버전 3 형식으로 기존 진행과 `loadout`, `equipmentOwned`를 저장합니다. 스키마 2 저장은 랭크·점수·해금·업그레이드·난이도를 유지한 채 빈 장비 상태로 명시적으로 마이그레이션됩니다. 잘못된 장비 ID, 슬롯 불일치와 중복은 제거됩니다. 새 캠페인은 확인 후 난이도를 선택할 때 장비와 업그레이드를 함께 초기화합니다.

## 파일 구조

- `index.html`: 캠페인 메뉴, 브리핑, 전투 HUD, 결과와 업그레이드 화면
- `style.css`: 반응형 SF 인터페이스
- `game.js`: 데이터, 저장, 전투, Echo 기록/재생, 스테이지 규칙
- `game-balance.js`: 자동 사격과 무기 핵심 밸런스 상수
- `monster-data.js`: 시간 오염 몬스터 역할과 기존 전투 수치
- `room-data.js`: Stage 2~3 방, 벽, 통로와 Stage 1 이전 구조의 회귀 데이터
- `world-data.js`: Stage 1 연속 월드 크기, 구역, 벽, 적 웨이브, 스위치, 지름길과 Anchor 배치
- `world-core.js`: 카메라 추적, 화면/월드 좌표 변환, 구역 판정과 루프 초기화 순수 함수
- `ui-core.js`: 반응형 미니맵 배치, 월드 투영, 화면 밖 표식과 상황 알림 순수 함수
- `collision-core.js`: 원형 액터의 축별 벽 슬라이딩과 고속 이동 충돌
- `objective-data.js`: 릴레이 수·필요 수·위치·충전과 Anchor 목표
- `temporal-core.js`: Shard, Overdrive, Anchor 단계와 Overload 순수 판정
- `echo-core.js`: 브라우저와 Node 테스트가 공유하는 순수 Echo 시간 로직
- `equipment-data.js`: 9개 장비, 희귀도, 보상 확률과 안전 제한값
- `equipment-core.js`: loadout, 후보, 장착, 저장 마이그레이션과 발사 프로필 순수 함수
- `version.json`: 공개 게임 버전과 저장 스키마 버전
- `manifest.webmanifest`: 설치·출시 메타데이터
- `README.md`: 실행 및 기능 안내
- `DESIGN.md`: 시스템과 밸런스 설계
- `QA_BASELINE.md`: 기술 부채 정리 전 회귀 기준값
- `tests/`: Node 내장 테스트 러너 기반 자동 회귀 테스트

## 알려진 제한사항과 다음 후보

모바일 조작, 게임패드, 배경 음악, Stage 4 적 Echo, Stage 5 다부위 보스는 아직 없습니다. 실제 플레이 데이터에 따라 릴레이 감소율, Stage 2 스위치 유지량, Stage 3 탈출선 체력, 랭크 임계값을 조정해야 합니다.

전투 HUD는 상단 시간선 정보, 좌측 하단 생존 상태, 하단 장비, 우측 하단 Overdrive, 우측 상단 전술 미니맵으로 분리됩니다. 미니맵은 플레이어·Echo·적·릴레이·Anchor를 형태와 색으로 함께 구분하며, 작은 화면에서는 HUD 크기와 간격을 축소합니다. 운영체제에서 동작 감소를 요청하면 화면 흔들림과 시간 왜곡이 완화됩니다.

개발 및 출시 전 검증은 `DEVELOPMENT_CHECKLIST.md`, 현재 확인된 품질 상태는 `QA_REPORT.md`를 참고하세요.
