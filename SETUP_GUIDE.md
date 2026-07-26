# MoodyGo! - 환경변수 설정 가이드

MoodyGo!는 **완전히 무료**로 작동합니다! 외부 API 비용이 전혀 없습니다. 🎉

## 🎵 작동 방식

**MoodyGo!는 다음과 같이 작동합니다:**

1. **감정 선택**: 사용자가 5가지 감정 중 하나를 선택합니다 (우울함, 신남, 즐거움, 차분함, 설렘)
2. **곡 추천**: 로컬 데이터베이스에서 해당 감정에 맞는 곡을 랜덤하게 추천합니다
3. **YouTube 검색** (선택사항): YouTube API 키가 있으면 추천받은 곡을 YouTube에서 검색합니다
4. **재생**: YouTube 플레이어에서 곡을 재생합니다

## 💰 비용

- **기본 기능**: 완전 무료 ✅
- **YouTube 검색**: 선택사항 (YouTube API 키 필요)

## 🔧 필수 설정: 없음!

기본 기능은 **아무것도 설정할 필요가 없습니다**. 그냥 사용하시면 됩니다!

## 📺 선택사항: YouTube API 키 (영상 검색 기능)

YouTube API 키를 설정하면 추천받은 곡을 YouTube에서 자동으로 검색하여 영상 ID를 가져옵니다.

### 1단계: Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 새 프로젝트를 생성합니다:
   - 상단의 프로젝트 선택 드롭다운을 클릭합니다.
   - **새 프로젝트** 버튼을 클릭합니다.
   - 프로젝트 이름을 입력합니다 (예: "MoodyGo").
   - **만들기**를 클릭합니다.

### 2단계: YouTube Data API v3 활성화

1. 왼쪽 메뉴에서 **API 및 서비스** → **라이브러리**를 클릭합니다.
2. 검색창에 "YouTube Data API v3"을 입력합니다.
3. 결과에서 **YouTube Data API v3**를 클릭합니다.
4. **활성화** 버튼을 클릭합니다.

### 3단계: API 키 생성

1. 왼쪽 메뉴에서 **API 및 서비스** → **사용자 인증 정보**를 클릭합니다.
2. **+ 사용자 인증 정보 만들기** 버튼을 클릭합니다.
3. **API 키**를 선택합니다.
4. 생성된 API 키(`AIza...`로 시작하는 문자열)를 복사합니다.

### 4단계: 환경변수 설정

Manus 관리 UI에서 다음과 같이 설정합니다:

1. 프로젝트 관리 UI의 **Settings** 탭을 엽니다.
2. **Secrets** 섹션으로 이동합니다.
3. **YOUTUBE_API_KEY** 필드에 발급받은 API 키를 입력합니다.
4. **저장**을 클릭합니다.

## 🎵 포함된 곡 목록

MoodyGo!에는 감정별로 다양한 곡들이 미리 등록되어 있습니다:

### 우울함 (Sad)
- Someone Like You - Adele
- The Night We Met - Lord Huron
- Skinny Love - Bon Iver
- Hurt - Johnny Cash
- Black - Pearl Jam
- 그 외 5곡

### 신남 (Excited)
- Uptown Funk - Mark Ronson ft. Bruno Mars
- Shut Up and Dance - Walk the Moon
- Don't Stop Me Now - Queen
- Walking on Sunshine - Katrina & The Waves
- Good as Hell - Lizzo
- 그 외 5곡

### 즐거움 (Happy)
- Walking on Sunshine - Katrina & The Waves
- Good as Hell - Lizzo
- Don't Stop Me Now - Queen
- Sunshine - Fleetwood Mac
- Three Little Birds - Bob Marley
- 그 외 5곡

### 차분함 (Calm)
- Weightless - Marconi Union
- Clair de Lune - Claude Debussy
- Nuvole Bianche - Ludovico Einaudi
- Gymnopédie No. 1 - Erik Satie
- River Flows in You - Yiruma
- 그 외 5곡

### 설렘 (Romantic)
- Perfect - Ed Sheeran
- All of Me - John Legend
- Thinking Out Loud - Ed Sheeran
- Make You Feel My Love - Adele
- Kiss Me - Sixpence None the Richer
- 그 외 5곡

## 🚀 사용 방법

1. 랜딩 페이지에서 **"시작하기"** 버튼을 클릭합니다.
2. 플레이어 페이지에서 5가지 감정 중 하나를 선택합니다.
3. 해당 감정에 맞는 곡이 추천됩니다.
4. **"다른 곡 추천받기"** 버튼을 클릭하면 같은 감정에서 다른 곡을 추천받습니다.
5. **이전/다음 버튼**으로 추천 히스토리를 탐색할 수 있습니다.

## 🎨 기술 스택

- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11
- **곡 데이터**: 로컬 데이터베이스 (비용 없음)
- **YouTube 검색**: YouTube Data API v3 (선택사항)

## 💡 특징

- **완전 무료**: 외부 API 비용 없음
- **빠른 응답**: 로컬 데이터베이스 사용
- **안정적**: 외부 서비스 의존성 최소화
- **확장 가능**: 곡 목록을 쉽게 추가할 수 있음
- **깔끔한 UI**: 브랜드 컬러 #ff7a00으로 통일된 디자인

## 🆘 문제 해결

### 곡이 추천되지 않음
- 페이지를 새로고침하고 다시 시도해 보세요.
- 브라우저 개발자 도구의 콘솔에서 오류 메시지를 확인해 보세요.

### YouTube 영상이 재생되지 않음
- YouTube API 키가 올바르게 설정되었는지 확인하세요.
- YouTube API 할당량을 확인하세요 (Google Cloud Console에서 확인 가능).
- 곡명이 YouTube에 존재하는지 확인하세요.

## 📝 곡 목록 추가 방법

`server/routers.ts` 파일의 `MOOD_SONGS` 객체에 곡을 추가할 수 있습니다:

```typescript
const MOOD_SONGS: Record<string, Array<{ title: string; artist: string }>> = {
  sad: [
    { title: "곡 제목", artist: "아티스트명" },
    // 더 많은 곡 추가...
  ],
  // 다른 감정들...
};
```

## 📞 지원

문제가 발생하면 프로젝트 관리 UI에서 로그를 확인하거나, 개발자 도구의 콘솔을 확인해 주세요.

---

**MoodyGo!를 즐겨주세요! 🎵**
