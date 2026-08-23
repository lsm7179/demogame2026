# ECHO BREACH QA 보고서

검증일: 2026-08-23

## v0.7.1 한국어 선택 문구 회귀

- PASS: 업그레이드 9종과 장비 9종 한국어 이름·설명 누락 검사
- PASS: 18개 기본 설명의 한 문장·58자 이하 규칙 검사
- PASS: 영문 업그레이드 문구와 누락 언어의 한국어 fallback 검사
- PASS: 설명 영역 2줄 제한과 업그레이드/장비 카드별 고정 높이 적용
- PASS: 기존 전투·장비 수치 객체와 저장 스키마 변경 없음
- PASS: Chrome에서 기본 한국어 음소거, 장비 슬롯·빈 상태, 일시정지 도움말 표시
- PASS: Chrome 콘솔 오류·경고 없음

실제로 확인하지 않아 PASS로 기록하지 않은 항목:

- 모든 장비 조합을 획득한 실제 보상 화면의 전체 수동 순회
- 향후 완성될 전체 영문 장비 번역

## v0.7.0 HUD와 시각 완성도 회귀

- PASS: 미니맵 위치·투영·화면 밖 표식·상황별 목표 알림 순수 함수 테스트
- PASS: 전체 Node 자동 테스트 63개 및 `npm run check`
- PASS: Chrome에서 타이틀, 스테이지 선택 카드, Stage 1 브리핑과 실제 전투 렌더링
- PASS: 전투 HUD의 상단 루프 정보, 좌측 하단 생존, 하단 장비, 우측 하단 Overdrive, 우측 상단 미니맵 배치
- PASS: 미니맵의 플레이어·Echo·적·릴레이·Anchor 개별 표식 및 화면 밖 Anchor 방향 표시
- PASS: 720×520 뷰포트에서 HUD 영역 DOM 경계 교차 0건
- PASS: 브라우저 콘솔 오류·경고 없음
- PASS: 기존 저장 스키마 3 및 전투 밸런스 수치 변경 없음

실제로 확인하지 않아 PASS로 기록하지 않은 항목:

- 모든 장비 이름 조합에서 툴팁과 긴 텍스트의 실기기 가독성
- 실제 Overdrive, 모든 Anchor 단계와 파괴 연출의 장시간 플레이 체감
- Firefox/Safari의 `color-mix()` 표현 차이

## v0.6.0 Stage 1 연속 월드 회귀

- PASS: 3900×1080 월드, 세 구역, 벽, 13개 적 배치, 스위치와 지름길 데이터 검증
- PASS: 카메라 이동 이후 `screenToWorld`/`worldToScreen` 왕복 좌표와 월드 경계 고정
- PASS: 루프 초기화 시 적·릴레이·스위치 복원 및 누적 Anchor 상태 보존 순수 함수 검증
- PASS: 로컬 브라우저에서 타이틀 → 난이도 → Stage 1 브리핑 → 전투 진입
- PASS: 첫 루프 종료 후 Echo 1개 생성과 월드 좌표 사격 재생
- PASS: HUD 고정, Stage 1 구역 목표 문구, 미니맵, 자동 사격 렌더링
- PASS: 브라우저 콘솔 오류·경고 없음
- PASS: Node 자동 테스트 58개, 포맷, 문법과 diff 검사

실제로 확인하지 않아 PASS로 기록하지 않은 항목:

- 수동 WASD 장시간 이동으로 세 구역과 지름길을 모두 통과하는 완주
- 실제 전투에서 이전 Echo보다 매 루프 더 깊이 전진하는 밸런스
- 여러 Echo와 최종 Anchor를 파괴하는 전체 흐름
- Stage 2·3 수동 완주 회귀(기존 데이터·자동 테스트는 통과)

## v0.5.0 장비 시스템 회귀

- PASS: 장비 9종의 고유 ID, 슬롯, 희귀도, 필수 필드와 불변 데이터
- PASS: 빈 loadout, 슬롯 교체, 잘못된 ID/슬롯 복구, 원본 불변성
- PASS: 주입 RNG 후보 재현, 중복·소유·현재 장착·비호환 제외, 후보 부족/없음
- PASS: 기본/Carbine, Shotgun 5발·32°, Rifle 관통 2와 최종 발사 프로필
- PASS: Vest 보호막 우선 흡수, Harness 2충전 상한, Coat 체력·속도·Shard 반경
- PASS: Lens 피해 순서, Memory 중복 3초 상한, Ring Overload 피해·쿨다운
- PASS: Shotgun/Rifle Echo 프로필 깊은 스냅샷과 구형 이벤트 기본값
- PASS: 저장 스키마 2→3 진행 보존, 장비 정규화와 중복 제거
- PASS: 실제 브라우저에서 기본 무장 전투, 장비 후보 3개, 슬롯·희귀도·교체 정보, 선택 중 20.0초 정지, 장착 후 전투 복귀, 새로고침 후 loadout 복구
- PASS: 실제 브라우저에서 Chrono Vest 선택 후 다음 루프 보호막 25, Room 2 진입과 Echo 생성, 콘솔 오류·경고 없음
- PASS: 저장된 장비 loadout으로 Stage 2와 Stage 3 전투 진입, 게이트/탈출선 HUD 진행 및 콘솔 오류·경고 없음

실제로 확인하지 않아 PASS로 기록하지 않은 항목:

- Stage 1~3 장비 포함 완주와 Anchor 결과→장비→업그레이드 전체 수동 흐름
- Pulse Rifle이 적·릴레이를 연속 관통하는 장면과 벽 정지 장면
- Memory Core 연장 Echo와 Paradox Ring Overload의 실전 발동
- 9개 장비를 각각 장착한 장시간 밸런스 및 프레임 성능
- Safari/Firefox 및 GitHub Pages 배포본

## 기술 부채 정리 결과

- PASS: `npm ci` 기반 재현 가능한 개발 환경
- PASS: `npm run check` 전체 검사
- PASS: Prettier 포맷 검사
- PASS: `echo-core.js`, `game.js` JavaScript 문법 검사
- PASS: Echo 순수 코어 회귀 테스트 7개
- PASS: 패키지 버전, 게임 버전, 저장 스키마 버전 일치
- PASS: GitHub Pages가 계속 `echo-breach/`만 배포하는지 자동 검사
- PASS: PR 검증 GitHub Actions 워크플로 추가
- PASS: 최종 브라우저 회귀 테스트에서 콘솔 오류·경고 없음
- PASS: 타이틀 → 계속하기 → Stage 1 브리핑 → 전투 → R 기록 → Echo 1개 재생
- PASS: 대시, 일시정지, 음소거 입력 재검증

자동 테스트 범위:

- 시간 기반 스냅샷 판정
- 위치와 조준 보간
- 불규칙 업데이트 간격에서 동일한 재생 결과
- 각도 경계의 최단 보간
- 사격·대시 이벤트의 정확한 단회 배출
- Charge Lance 사격 프로필 보존
- 최신 Echo 기록 4개 제한
- 자동 사격의 playing·일시정지·Canvas 이탈·사망 조건

## v0.2.0 자동 사격 회귀

- PASS: 기본 발사 간격 0.22초
- PASS: 마우스 클릭 없이 조준 방향으로 자동 사격
- PASS: 실제 발사 이벤트만 기존 Echo 이벤트 배열에 기록
- PASS: R 종료 후 다음 루프에서 Echo 1개 생성
- PASS: Charge Lance 자동 충전·완충 발사 경로
- PASS: Split Shot 3발 유지, 개별 피해 45%
- PASS: 브라우저 콘솔 오류·경고 없음

## 확인한 항목

- PASS: `game.js` JavaScript 문법 검사
- PASS: `index.html`에서 `style.css`, `game.js` 상대 경로 사용
- PASS: 로컬 정적 서버에서 타이틀 화면 부팅
- PASS: 새 캠페인 → 난이도 선택 → 스테이지 선택 → 브리핑 → 전투 진입
- PASS: STORY / OPERATIVE / PARADOX 카드 렌더링
- PASS: Stage 1~3 카드와 Stage 4~5 잠금 상태 렌더링
- PASS: Stage 1 전투 HUD와 20초 타이머 시작
- PASS: 위 흐름에서 브라우저 콘솔 오류·경고 없음
- PASS: localStorage 접근이 `try/catch`로 보호됨
- PASS: 탭 비활성화와 blur 시 자동 일시정지 처리 존재
- PASS: 고정 시간 간격 업데이트와 프레임 delta 제한 존재

## 이번 검증에서 확인하지 못한 항목

- 실제 조작으로 Stage 1~3 완주
- Echo 위치·사격·대시의 장시간 동기 정확도
- 9개 업그레이드 각각의 전투 동작
- 세 난이도 전체 밸런스
- Safari와 Firefox 실기기 호환성
- 30분 이상 반복 플레이 시 메모리와 성능
- GitHub Pages 실제 배포 URL

## v0.3.0 룸·캐릭터 회귀

- PASS: 인간 요원과 Echo가 동일 렌더 경로에서 보행·반동 애니메이션 사용
- PASS: 몬스터 3종의 기존 반경·체력·속도·점수 수치 고정 테스트
- PASS: Stage 1~3 출발점과 모든 적 생성 지점의 통로 도달 가능성 테스트
- PASS: Stage 2에 시간 게이트가 정확히 하나 존재하며 개방 후 Anchor실 도달 가능
- PASS: 로컬 정적 서버에서 신규 데이터 스크립트 200 응답 및 Stage 1 전투 렌더링
- PASS: 고속 대시 벽 관통, 대각선 슬라이딩, 수직 충돌과 닫히는 게이트 배출 회귀 테스트

## v0.4.0 진행·보상 회귀

- PASS: Stage 1 세 방 순서와 방 전환 시 Echo·총알·적·파티클·픽업 정리
- PASS: 1~4개 릴레이 구성 검증 및 Stage 1~3 기본 2개 확인
- PASS: Split Shot 2발 × 70%, 중심 기준 좌우 5도 확인
- PASS: 신규 몬스터 behavior/reward/visual 데이터 검증
- PASS: Shard 100 도달 시 Overdrive 발동·8초 종료 확인
- PASS: Anchor 단계와 Temporal Overload 시간창·쿨다운 순수 판정

## 발견한 위험

### RESOLVED — 유지보수하기 어려운 압축 소스

Prettier를 도입하고 포맷팅만 포함하는 별도 커밋에서 `game.js`, `style.css`, `index.html`과 문서를 읽을 수 있는 형태로 정리했다. 원본을 같은 설정으로 포맷한 예상 결과와 바이트 단위 비교 후 커밋했다.

### RESOLVED — Echo 자동 회귀 테스트 부재

시간 판정, 보간, 이벤트 배출과 기록 제한을 `echo-core.js` 순수 모듈로 추출하고 Node 내장 테스트 러너 기반 회귀 스위트를 추가했다. 저장 스키마와 출시 버전 일관성은 별도 릴리스 검사에서 확인한다.

### P1 — Stage 1~3 완주 검증 필요

메뉴와 전투 부팅은 확인했지만 실제 완주와 업그레이드 조합은 아직 검증하지 않았다. 공개 배포 전 사람이 각 난이도로 체크리스트를 수행해야 한다.

### P2 — 접근성 보강 필요

Canvas 전투는 시각 효과 중심이며 모션 감소 설정, 키보드 포커스 스타일과 색각 보조 표현을 추가 검토해야 한다.

### RESOLVED — 출시 메타데이터 부재

favicon, 설명·Open Graph 메타 태그, 웹 앱 매니페스트, `version.json`, 변경 기록과 서드파티 고지를 추가했다. 별도 이미지 에셋을 만들지 않아 Open Graph 이미지는 아직 없다.

## 다음 검증 우선순위

1. OPERATIVE 기준 Stage 1~3 수동 완주
2. 업그레이드별 통합 전투 회귀 테스트
3. Chrome·Safari·Firefox 교차 브라우저 테스트
4. 30분 반복 플레이 성능·메모리 검사
5. GitHub Pages 실배포 후 시크릿 창 검증
