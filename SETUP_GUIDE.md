# MoodyGo! - 환경변수 설정 가이드

MoodyGo!를 완전히 작동시키기 위해서는 다음 API 키들을 설정해야 합니다.

## 필수 설정: OpenAI API 키

### 1단계: OpenAI 계정 생성 및 API 키 발급

1. [OpenAI Platform](https://platform.openai.com/)에 접속합니다.
2. 계정이 없다면 회원가입을 진행합니다.
3. 로그인 후 왼쪽 메뉴에서 **API Keys**를 클릭합니다.
4. **Create new secret key** 버튼을 클릭합니다.
5. 키 이름을 입력합니다 (예: "MoodyGo").
6. 생성된 키(`sk-...`로 시작하는 긴 문자열)를 복사합니다.
   - **주의**: 이 화면을 닫으면 키를 다시 볼 수 없습니다. 반드시 안전한 곳에 저장하세요.

### 2단계: 크레딧 충전 (필요한 경우)

- OpenAI API를 사용하려면 계정에 크레딧이 필요합니다.
- [Billing 페이지](https://platform.openai.com/account/billing/overview)에서 최소 $5 이상 충전하는 것을 권장합니다.

### 3단계: 환경변수 설정

Manus 관리 UI에서 다음과 같이 설정합니다:

1. 프로젝트 관리 UI의 **Settings** 탭을 엽니다.
2. **Secrets** 섹션으로 이동합니다.
3. **OPENAI_API_KEY** 필드에 발급받은 API 키를 입력합니다.
4. **저장**을 클릭합니다.

## 선택사항: YouTube API 키 (영상 검색 기능)

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

## 환경변수 확인

설정이 완료되면 다음과 같이 작동합니다:

- **OPENAI_API_KEY만 설정된 경우**: 감정에 맞는 곡을 추천받지만, YouTube 영상 검색은 작동하지 않습니다.
- **OPENAI_API_KEY + YOUTUBE_API_KEY 모두 설정된 경우**: 완전한 기능으로 작동하며, 추천받은 곡이 YouTube에서 자동으로 검색되어 재생됩니다.

## 문제 해결

### "OpenAI API 키가 설정되지 않았습니다" 오류

- 환경변수가 올바르게 설정되었는지 확인하세요.
- API 키가 유효한지 확인하세요 (OpenAI 대시보드에서 확인 가능).
- 서버를 재시작해 보세요.

### "곡 추천에 실패했습니다" 오류

- OpenAI API 크레딧이 충분한지 확인하세요.
- 네트워크 연결을 확인하세요.
- OpenAI 서비스 상태를 확인하세요 ([status.openai.com](https://status.openai.com/)).

### YouTube 영상이 재생되지 않음

- YouTube API 키가 올바르게 설정되었는지 확인하세요.
- YouTube API 할당량을 확인하세요 (Google Cloud Console에서 확인 가능).
- 곡명이 YouTube에 존재하는지 확인하세요.

## 보안 주의사항

- **API 키를 절대 공개하지 마세요**. 코드에 하드코딩하거나 공개 저장소에 커밋하지 마세요.
- Manus 관리 UI를 통해 환경변수로만 관리하세요.
- API 키가 유출된 경우 즉시 OpenAI/Google Cloud 대시보드에서 재생성하세요.

## 추가 정보

- [OpenAI API 문서](https://platform.openai.com/docs/)
- [YouTube Data API 문서](https://developers.google.com/youtube/v3)
- [MoodyGo! GitHub](https://github.com/your-repo/moodygo)
