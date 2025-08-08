# 개인화 책 추천 웹사이트 (kgbook-recommend)

이 프로젝트는 사용자의 컨텍스트와 알라딘 API를 활용하여 개인화된 책을 추천해주는 웹 서비스입니다.

## 📚 주요 기능

- **컨텍스트 기반 추천**: 사용자가 제공하는 문맥(예: 현재 페이지 정보, 사용자의 개인화된 정보)을 기반으로 채팅을 통해 유사한 책을 추천합니다.
- **알라딘 API 연동**: 알라딘의 방대한 도서 데이터를 활용하여 다양한 방식의 책 추천을 제공합니다.
- **웹 인터페이스**: 사용자가 쉽게 추천 결과를 확인하고 상호작용할 수 있는 Nuxt.js 기반의 웹 페이지를 제공합니다.

## 🏛️ 프로젝트 아키텍처

이 프로젝트는 세 가지 주요 컴포넌트로 구성된 모노레포 구조입니다.

- **`kgbook-recommend-web/`**: Nuxt.js로 구현된 프론트엔드 웹 애플리케이션입니다. 사용자에게 보여지는 모든 화면과 인터페이스를 담당합니다.
- **`aladin-mcp-server/`**: Express 기반의 백엔드 서버입니다. 알라딘 API와의 통신, 데이터베이스 연동, 추천 로직 등 핵심 비즈니스 로직을 처리합니다.
- **`infra/`**: Docker Compose를 이용한 인프라 관리 디렉터리입니다. PostgreSQL 데이터베이스 설정, 전체 서비스 빌드 및 배포 스크립트를 포함합니다.

## 🚀 시작하기

Docker가 설치되어 있다면, 아래 명령어로 전체 프로젝트를 한 번에 실행할 수 있습니다.

```bash
# infra 디렉터리로 이동
cd infra

# Docker Compose를 사용하여 모든 서비스 (웹, 서버, DB)를 실행합니다.
# infra.yaml 파일에 정의된 구성에 따라 컨테이너가 생성되고 실행됩니다.
docker compose -f infra.yaml up --build -d
```

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
