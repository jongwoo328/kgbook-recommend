# 프론트엔드 (kgbook-recommend-web)

이 디렉터리는 Nuxt.js를 사용하여 구축된 개인화 책 추천 서비스의 프론트엔드 프로젝트입니다.

## ✨ 주요 기능

- 사용자를 위한 직관적인 UI/UX 제공, 다크모드 지원
- 책 검색 및 상세 정보 조회
- 베스트 셀러, 주목할 만한 신간, AI 기반 개인화된 책 추천 조회
- 화면에 표시 중인 웹 페이지 기반으로 채팅을 통한 책 추천

## 🚀 로컬 개발 환경 설정

Docker를 사용하지 않고 프론트엔드 서버만 단독으로 실행할 경우 아래의 절차를 따릅니다.

1.  **의존성 설치**
    pnpm을 사용하여 필요한 패키지를 설치합니다.

    ```bash
    pnpm install
    ```

2.  **환경 변수 설정**
    `.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 필요한 환경 변수를 설정합니다. 주로 백엔드 API 서버의 주소를 지정합니다.

    ```bash
    cp .env.example .env
    ```

3.  **개발 서버 실행**
    아래 명령어를 실행하면 Nuxt.js 개발 서버가 시작됩니다.
    aladin-mcp-server를 실행해야 정상 동작합니다.

    ```bash
    cd ../aladin-mcp-server
    pnpm dev
    
    cd ../kgbook-recommend
    pnpm dev
    ```
    서버가 실행되면 `http://localhost:8000` 에서 웹사이트를 확인할 수 있습니다.

빌드 결과물은 `.output` 디렉터리에 생성됩니다.

## 📂 주요 디렉터리 구조

- **`/api`**: 프론트에서 api 호출 함수
- **`/components`**: 재사용 가능한 UI 컴포넌트
- **`/pages`**: 웹사이트의 각 페이지
- **`/composables`**: 상태 관리 및 공통 로직 (Vue Composition API)
- **`/layouts`**: 페이지의 전체적인 레이아웃
- **`/server`**: Nuxt.js의 서버 엔진(Nitro) 관련 API 라우트 및 미들웨어
- **`/assets`**: CSS, 이미지 등 정적 에셋
- **`/public`**: 빌드 시 그대로 복사될 정적 파일
- **`/shared`**: 프론트, 서버 nuxt 전반에서 모두 사용하는 type 정의
- **`/types`**: 프론트에서 사용하는 type 정의
- **`/lib`**: util 함수 정의

