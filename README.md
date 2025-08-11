# 개인화 책 추천 웹사이트 (kgbook-recommend)

이 프로젝트는 사용자의 컨텍스트와 알라딘 API를 활용하여 개인화된 책을 추천해주는 웹 서비스입니다.

## 📚 주요 기능

### 1. 책 보기 기능
- 알라딘 API를 활용한 다양한 도서 조회 (베스트셀러, 신간, 검색 등)
- 상세한 책 정보 및 메타데이터 제공

### 2. 관련 책 추천 기능
- 현재 보고 있는 책과 관련된 도서 추천
- 사용자의 개인화된 정보 기반 맞춤 추천

### 3. AI 채팅을 통한 자유 추천
- 자연어 대화를 통해 원하는 스타일과 주제의 책 추천
- 사용자 상황과 컨텍스트를 고려한 인터랙티브한 추천 경험

## 🏛️ 프로젝트 아키텍처

이 프로젝트는 세 가지 주요 컴포넌트로 구성된 모노레포 구조입니다.

### MCP 서버 (aladin-mcp-server)
- **직접 구현한 커스텀 MCP 서버**: 프로젝트 요구사항에 맞춰 Streamable HTTP 방식으로 개발
- **벡터 검색 기능**: 알라딘의 19,000개 이상 카테고리를 벡터화하여 PostgreSQL pgvector로 저장
- **지능적 카테고리 매칭**: AI가 정확하지 않은 분야를 요청해도 유사한 카테고리를 찾아 적절한 도서 추천 가능
- **알라딘 API 연동**: 도서 데이터 조회 및 검색 기능 제공

### 웹 서버 (kgbook-recommend-web)
- **Nuxt.js 풀스택 개발**: 개발 편의성을 위해 백엔드와 프론트엔드를 통합 구현
- **LangChain REACT Agent**: 채팅 및 책 추천 기능의 핵심 AI 엔진
- **MCP Client 통합**: LangChain MCP Adapter를 사용하여 MCP 도구들을 AI Agent의 도구로 활용
- **인터랙티브 UI**: 사용자 친화적인 책 추천 및 채팅 인터페이스 제공

### 인프라 (infra)
- **Docker Compose 기반**: 모든 리소스(웹서버, MCP 서버, DB)를 단일 명령어로 실행
- **PostgreSQL with pgvector**: 벡터 검색을 위한 확장 플러그인 포함
- **자동화된 초기화**: init SQL을 통해 카테고리 데이터 자동 삽입

## 🚀 배포 및 실행

### 환경변수 설정
배포 전 각 컴포넌트의 환경변수 설정이 필요합니다:

```bash
# MCP 서버 환경변수 설정
cd aladin-mcp-server
cp .env.template .env
# .env 파일에서 알라딘 API 키 및 데이터베이스 정보 설정

# 웹 프로젝트 환경변수 설정
cd ../kgbook-recommend-web
cp .env.example .env
# .env 파일에서 필요한 환경변수 설정
```

### 원클릭 배포
Docker가 설치되어 있다면, **단일 명령어로 전체 시스템을 배포**할 수 있습니다.

```bash
# infra 디렉터리로 이동
cd infra

# 모든 서비스 (웹서버, MCP 서버, DB)를 빌드하고 실행
docker compose -f infra.yaml up --build -d
```

### 포함된 기능
- **자동 데이터베이스 초기화**: PostgreSQL 컨테이너 실행 시 알라딘 카테고리 데이터 자동 삽입
- **벡터 검색 환경 구성**: pgvector 확장 자동 설치 및 설정
- **서비스 간 네트워킹**: 각 컴포넌트 간 통신을 위한 Docker 네트워크 자동 구성

각 서비스에 대한 자세한 내용은 해당 디렉터리의 `README.md` 파일을 참고해주세요.

## 💻 기술 스택

- **Frontend**: Nuxt.js, Vue.js, Tailwind CSS
- **Backend**: Express, TypeScript, Node.js
- **Database**: PostgreSQL with `pgvector`
- **Infrastructure**: Docker, Docker Compose
- **Package Manager**: pnpm

## ⚖️ git convention

- 브랜치는 `issue/<issue-number>` 형식으로 생성합니다.

## 😎 프로젝트 목표
- [x] docker 기반으로 서비스 배포
- [x] mcp server 이해 및 구현
- [x] 유사도 검색 사용
- [x] nuxt를 활용하여 mcp server, mcp client 연동
  - [x] langchainjs를 이용
