# ECHO BREACH

NEXUS 연구시설은 파괴 직전의 순간을 반복하고 있습니다. 기체 **ECHO-07**은 이전 시간선의 이동·조준·사격·대시 기록을 Echo로 전송해 각 구역의 **Chrono Anchor**를 파괴하고 생존자를 구해야 합니다.

저장소: https://github.com/lsm7179/demogame2026

GitHub Pages 배포 주소(활성화 후): https://lsm7179.github.io/demogame2026/

## 실행

외부 의존성이 없습니다. 이 폴더에서 정적 서버를 실행합니다.

```sh
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. 최신 데스크톱 Chrome, Firefox, Safari를 권장합니다.

## 조작

- WASD: 이동
- 마우스: 조준 / 왼쪽 버튼: 사격 또는 Charge Lance 충전
- Space: 대시
- R: 현재 루프 조기 기록
- Esc: 일시정지
- M: 음소거

## 캠페인 흐름

타이틀에서 새 캠페인 또는 계속하기를 선택하고 난이도와 해금된 스테이지를 고릅니다. 스테이지 최초 클리어 시 Chrono Crystal을 분석해 중복되지 않는 업그레이드 후보 3개 중 하나를 획득합니다. Stage 4와 5는 이후 확장을 위한 잠금 카드와 데이터만 포함합니다.

## 플레이 가능한 스테이지

- **Stage 1 — AWAKENING:** 고정 릴레이 3개로 Echo 동기화의 기본을 익힙니다.
- **Stage 2 — SPLIT CURRENT:** Echo가 스위치를 사격해 중앙 장벽을 여는 동안 플레이어가 건너가 이동 릴레이를 처리합니다.
- **Stage 3 — RESCUE WINDOW:** 일부 적이 탈출선을 노립니다. 호위 사격 기록과 Anchor 공격 역할을 나누며, 탈출선이 파괴돼도 스테이지는 계속됩니다.

## 난이도

- **STORY:** 25초, 6루프, 적 탄속 80%, 받는 피해 70%, 빠른 대시, 느린 릴레이 감소, 긴 보호막 개방.
- **OPERATIVE:** 20초, 5루프, 기존 프로토타입 표준 밸런스.
- **PARADOX:** 18초, 5루프, 적 탄속·조합·릴레이 감소 강화, 짧은 보호막 개방, 점수 배율 1.35.

## 업그레이드

SPLIT SHOT, PULSE CANNON, CHARGE LANCE, ECHO AMPLIFIER, EXTENDED MEMORY, RECORD OVERRIDE, REINFORCED HULL, VECTOR THRUSTER, EMERGENCY REWIND를 구현했습니다. 사격 이벤트에는 발사 당시 무기·각도·탄 수·피해·관통·충전량이 저장되어 Echo가 같은 공격을 재생합니다.

## 저장

`echoBreachCampaign` 키에 버전 2 형식으로 난이도, 최고 해금 스테이지, 스테이지별 최고 랭크/점수, 업그레이드, 음소거, 캠페인 유무를 저장합니다. 파싱 실패, 잘못된 필드, 다른 버전은 안전한 기본값으로 복구합니다. 새 캠페인은 확인 후 난이도를 선택할 때 새 시간선을 확정합니다.

## 파일 구조

- `index.html`: 캠페인 메뉴, 브리핑, 전투 HUD, 결과와 업그레이드 화면
- `style.css`: 반응형 SF 인터페이스
- `game.js`: 데이터, 저장, 전투, Echo 기록/재생, 스테이지 규칙
- `README.md`: 실행 및 기능 안내
- `DESIGN.md`: 시스템과 밸런스 설계

## 알려진 제한사항과 다음 후보

모바일 조작, 게임패드, 배경 음악, Stage 4 적 Echo, Stage 5 다부위 보스는 아직 없습니다. 실제 플레이 데이터에 따라 릴레이 감소율, Stage 2 스위치 유지량, Stage 3 탈출선 체력, 랭크 임계값을 조정해야 합니다.

개발 및 출시 전 검증은 `DEVELOPMENT_CHECKLIST.md`, 현재 확인된 품질 상태는 `QA_REPORT.md`를 참고하세요.
