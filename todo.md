# MoodyGo! - AI 감정 기반 음악 추천 플레이어

## 프로젝트 개요
감정을 선택하면 ChatGPT API가 어울리는 노래를 추천하고, YouTube에서 고음질로 재생하는 웹 애플리케이션

## 기능 목록

### Phase 2: 랜딩 페이지 및 기본 UI 컴포넌트
- [x] 랜딩 페이지 구현 (타이핑 애니메이션 헤드라인, 시작하기 버튼)
- [x] 감정 선택 UI 컴포넌트 (우울함, 신남, 즐거움, 차분함, 설렘)
- [x] 플레이어 카드 UI 컴포넌트 (곡 제목, 아티스트, 상태 배지)
- [x] 브랜드 컬러 (#ff7a00) 일관성 유지
- [x] 반응형 레이아웃 (좌측 감정 패널, 우측 플레이어 영역)

### Phase 3: ChatGPT API 백엔드 엔드포인트
- [x] OpenAI API 키 환경변수 설정 (OPENAI_API_KEY)
- [x] 감정 기반 노래 추천 엔드포인트 구현 (`/api/trpc/music.recommend`)
- [x] ChatGPT 프롬프트 엔지니어링 (곡명, 아티스트 추출)
- [x] 에러 처리 및 로깅
- [x] 추천 히스토리 관리 (DB 저장 선택사항)

### Phase 4: YouTube IFrame 플레이어 통합
- [x] YouTube IFrame API 통합
- [x] YouTube 영상 검색 로직 (곡명 + 아티스트로 검색)
- [x] 플레이어 임베드 및 재생 제어
- [x] 로딩 상태 UI (스켈레톤, 스피너)
- [x] 에러 상태 UI (재시도 버튼)

### Phase 4: 프론트엔드 로직
- [x] 감정 선택 시 ChatGPT 추천 요청
- [x] 다른 곡 추천받기 버튼 (같은 감정에서 새 곡 요청)
- [x] 이전/다음 버튼 (추천 히스토리 탐색)
- [x] 상태 배지 업데이트 (재생 중, 로딩, 오류)
- [x] 화면 전환 애니메이션 (랜딩 → 플레이어)

### Phase 5: 통합 테스트 및 최종 조정
- [x] E2E 테스트 (감정 선택 → 곡 추천 → 재생)
- [x] 에러 시나리오 테스트 (API 오류, 네트워크 오류)
- [x] UI/UX 최적화 (로딩 시간, 반응성)
- [x] 브라우저 호환성 확인

### Phase 6: 최종 배포 및 문서화
- [x] OpenAI API 키 설정 가이드 작성
- [x] 환경변수 설정 방법 안내
- [x] 프로젝트 체크포인트 생성
- [x] 사용자에게 최종 결과물 전달

## 브랜드 가이드
- 브랜드명: MoodyGo!
- 브랜드 컬러: #ff7a00 (오렌지)
- 폰트: Plus Jakarta Sans
- 로고 아이콘: fa-solid fa-headphones-simple

## 기술 스택
- Frontend: React 19 + Tailwind CSS 4 + shadcn/ui
- Backend: Express 4 + tRPC 11
- Database: MySQL (선택사항 - 추천 히스토리 저장)
- APIs: OpenAI ChatGPT, YouTube IFrame API
- 인증: Manus OAuth

## 주요 제약사항
- OpenAI API 키는 환경변수로만 관리 (하드코딩 금지)
- 감정 카테고리는 좌측 사이드 패널에 고정 배치
- 기존 디자인 스타일 유지
- 오렌지 컬러 (#ff7a00) 일관성 유지
