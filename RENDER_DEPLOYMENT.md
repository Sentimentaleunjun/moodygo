# Render 배포 가이드

MoodyGo!를 Render에 배포하는 완벽한 가이드입니다.

## 📋 사전 준비

1. **GitHub 계정** - 코드를 저장할 저장소 필요
2. **Render 계정** - [render.com](https://render.com)에서 가입
3. **Manus 프로젝트** - 이미 준비됨

## 🚀 배포 단계

### 1단계: GitHub에 코드 내보내기

#### 방법 A: Manus 관리 UI 사용 (권장)
1. Manus 프로젝트 관리 UI 열기
2. 우측 상단의 **More** (⋯) 메뉴 클릭
3. **GitHub** 옵션 선택
4. GitHub 계정으로 로그인
5. 새 저장소 생성 또는 기존 저장소 선택
6. 코드가 자동으로 푸시됨

#### 방법 B: 수동으로 푸시
```bash
cd /home/ubuntu/moodygo
git remote add github https://github.com/YOUR_USERNAME/moodygo.git
git push github main
```

### 2단계: Render 계정 생성 및 로그인

1. [render.com](https://render.com) 방문
2. **Sign Up** 클릭
3. GitHub 계정으로 로그인 (권장)
4. Render 대시보드 접속

### 3단계: Render에서 새 서비스 생성

1. Render 대시보드에서 **New +** 클릭
2. **Web Service** 선택
3. **Deploy from a Git repository** 선택
4. GitHub 저장소 연결 (moodygo)
5. 다음 설정 입력:
   - **Name**: `moodygo`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Free (또는 원하는 플랜)

### 4단계: 데이터베이스 생성

#### PostgreSQL 데이터베이스 생성
1. Render 대시보드에서 **New +** 클릭
2. **PostgreSQL** 선택
3. 다음 설정 입력:
   - **Name**: `moodygo-db`
   - **Database**: `moodygo`
   - **User**: `moodygo_user`
   - **Plan**: Free (또는 원하는 플랜)
4. **Create Database** 클릭
5. 생성 완료 후 **Internal Database URL** 복사

### 5단계: 환경변수 설정

Web Service에서 **Environment** 탭으로 이동하여 다음 변수 추가:

```
DATABASE_URL=postgresql://moodygo_user:PASSWORD@HOST:5432/moodygo
DRIZZLE_DATABASE_URL=postgresql://moodygo_user:PASSWORD@HOST:5432/moodygo
NODE_ENV=production
JWT_SECRET=YOUR_RANDOM_SECRET_KEY
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
VITE_APP_TITLE=MoodyGo! - AI 감정 기반 음악 추천 플레이어
OWNER_NAME=은준 조
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY (선택사항)
```

**DATABASE_URL 구성:**
- PostgreSQL 대시보드에서 **Internal Database URL** 복사
- 형식: `postgresql://user:password@host:5432/database`

### 6단계: 데이터베이스 마이그레이션

1. Render 대시보드에서 Web Service 선택
2. **Shell** 탭 클릭
3. 다음 명령 실행:
```bash
pnpm drizzle-kit migrate
```

### 7단계: 배포 확인

1. Render 대시보드에서 배포 상태 확인
2. 배포 완료 후 제공된 URL로 접속
3. 웹사이트가 정상 작동하는지 확인

## 🔧 환경변수 상세 설명

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | ✅ |
| `DRIZZLE_DATABASE_URL` | Drizzle ORM용 DB 연결 문자열 | ✅ |
| `NODE_ENV` | 실행 환경 (production) | ✅ |
| `JWT_SECRET` | 세션 토큰 서명 키 (임의 생성) | ✅ |
| `OAUTH_SERVER_URL` | Manus OAuth 서버 URL | ✅ |
| `VITE_OAUTH_PORTAL_URL` | Manus 로그인 포털 URL | ✅ |
| `VITE_APP_TITLE` | 웹사이트 제목 | ✅ |
| `OWNER_NAME` | 소유자 이름 | ✅ |
| `YOUTUBE_API_KEY` | YouTube 검색용 API 키 | ❌ |

## 🐛 문제 해결

### 배포 실패
- **Build logs** 확인: Render 대시보드에서 배포 로그 확인
- **환경변수** 확인: 모든 필수 변수가 설정되었는지 확인
- **Node 버전** 확인: 22.13.0 이상 필요

### 데이터베이스 연결 오류
- **DATABASE_URL** 형식 확인
- PostgreSQL 대시보드에서 **Internal Database URL** 다시 복사
- Render 콘솔에서 `pnpm drizzle-kit migrate` 실행

### 웹사이트 접속 불가
- Render 대시보드에서 **Logs** 확인
- 포트 설정 확인 (기본값: 3000)
- 환경변수 재설정 후 재배포

## 📊 모니터링

Render 대시보드에서 다음을 모니터링할 수 있습니다:
- **Metrics**: CPU, 메모리, 네트워크 사용량
- **Logs**: 실시간 서버 로그
- **Events**: 배포 및 서비스 이벤트

## 💰 비용

- **Free Plan**: 월 $0 (제한사항 있음)
- **Starter Plan**: 월 $7부터
- **PostgreSQL Free**: 월 $0 (90일 미사용 시 삭제)

## 🔐 보안 주의사항

1. **API 키 보호**: GitHub에 API 키를 커밋하지 마세요
2. **환경변수 관리**: Render 대시보드에서만 관리
3. **HTTPS**: Render가 자동으로 HTTPS 제공
4. **정기 백업**: PostgreSQL 데이터 정기 백업 권장

## 📝 추가 정보

- [Render 공식 문서](https://render.com/docs)
- [PostgreSQL 가이드](https://render.com/docs/databases)
- [Node.js 배포 가이드](https://render.com/docs/deploy-node-express-app)

## ✅ 배포 체크리스트

- [ ] GitHub 저장소 생성 및 코드 푸시
- [ ] Render 계정 생성
- [ ] Web Service 생성
- [ ] PostgreSQL 데이터베이스 생성
- [ ] 환경변수 설정
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 배포 완료 및 테스트
- [ ] 도메인 설정 (선택사항)

---

**배포 완료 후 문제가 발생하면 Render 대시보드의 Logs를 확인하세요!**
