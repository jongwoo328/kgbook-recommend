# 인프라 (infra)

이 디렉터리는 `kgbook-recommend` 프로젝트의 전체 인프라를 관리하기 위한 파일들을 포함합니다. Docker Compose를 사용하여 개발 및 배포 환경을 구성하고, 데이터베이스 초기화 스크립트를 관리합니다.

## 🐳 Docker Compose

`infra.yaml` 파일은 프로젝트의 모든 서비스(웹, 서버, 데이터베이스)를 컨테이너로 실행하기 위한 Docker Compose 설정 파일입니다.

### 서비스 구성

- **`postgres`**: PostgreSQL 데이터베이스 서비스. `pgvector` 확장이 포함된 이미지를 사용합니다.
- **`aladin-mcp-server`**: 백엔드 API 서버 서비스.
- **`kgbook-recommend-web`**: 프론트엔드 웹 애플리케이션 서비스.

### 사용법

- **전체 서비스 시작**:
  ```bash
  # --build 플래그를 사용하여 이미지를 새로 빌드하고, -d 플래그로 백그라운드에서 실행합니다.
  docker compose -f infra.yaml up --build -d
  ```

- **전체 서비스 중지**:
  ```bash
  docker compose -f infra.yaml down
  ```

- **특정 서비스 재시작**:
  ```bash
  docker compose -f infra.yaml restart <service_name>
  ```

## 🗄️ 데이터베이스 스크립트

`scripts/` 디렉터리에는 데이터베이스를 설정하고 초기 데이터를 삽입하는 SQL 파일들이 있습니다.

- **`01-create-database.sql`**: 데이터베이스와 역할을 생성합니다.
- **`02-init-database.sql`**: 테이블 스키마를 생성하고 `vector` 확장을 활성화합니다.
- **`include-vector-data_*.sql`**: 책 데이터와 임베딩된 벡터 데이터를 데이터베이스에 삽입합니다.

이 스크립트들은 `postgres` 서비스가 처음 시작될 때 `/docker-entrypoint-initdb.d` 경로에 마운트되어 자동으로 실행됩니다. 데이터베이스를 초기 상태로 되돌리고 싶다면, Docker 볼륨을 삭제한 후 컨테이너를 다시 시작하면 됩니다.

```bash
# 모든 컨테이너 중지
docker compose -f infra.yaml down

# postgres가 사용하는 볼륨 삭제 (볼륨 이름은 infra.yaml 파일에 정의되어 있음)
docker volume rm infra_postgres_data

# 서비스 다시 시작
docker compose -f infra.yaml up --build -d
```
