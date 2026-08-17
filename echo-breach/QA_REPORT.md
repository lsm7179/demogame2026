# ECHO BREACH QA 보고서

검증일: 2026-08-17

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
