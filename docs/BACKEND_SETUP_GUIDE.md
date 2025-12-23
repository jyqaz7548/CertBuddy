# CertBuddy 백엔드 개발 가이드

## 📋 목차
1. [개요](#개요)
2. [환경 설정](#환경-설정)
3. [데이터베이스 설정](#데이터베이스-설정)
4. [프로젝트 구조](#프로젝트-구조)
5. [실행 방법](#실행-방법)
6. [API 엔드포인트](#api-엔드포인트)
7. [프론트엔드 연동](#프론트엔드-연동)
8. [다음 단계](#다음-단계)

## 개요

CertBuddy 백엔드는 Spring Boot 3.1.5와 MariaDB를 사용하여 개발되었습니다. 프론트엔드에서 사용하던 mockData를 실제 데이터베이스와 API로 대체하는 것이 목표입니다.

## 환경 설정

### 필수 요구사항
- Java 17 이상
- Maven 3.6 이상
- MariaDB 10.5 이상

### 1. MariaDB 설치 및 데이터베이스 생성

```sql
-- MariaDB에 접속하여 데이터베이스 생성
CREATE DATABASE certbuddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 (선택사항)
CREATE USER 'certbuddy'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON certbuddy.* TO 'certbuddy'@'localhost';
FLUSH PRIVILEGES;
```

### 2. JWT Secret Key 생성

JWT 토큰 서명에 사용할 Secret Key를 생성해야 합니다. 다음 방법 중 하나를 사용하세요:

#### 방법 1: 제공된 스크립트 사용 (권장)

**Windows:**
```bash
cd backend
generate-jwt-secret.bat
```

**Mac/Linux:**
```bash
cd backend
chmod +x generate-jwt-secret.sh
./generate-jwt-secret.sh
```

#### 방법 2: Java 코드 직접 실행

```bash
cd backend
mvn exec:java -Dexec.mainClass="com.certbuddy.util.JwtSecretGenerator" -Dexec.classpathScope=compile
```

#### 방법 3: 온라인 생성기 사용

1. [RandomKeygen](https://randomkeygen.com/) 또는 유사한 사이트 방문
2. "CodeIgniter Encryption Keys" 섹션에서 키 선택
3. 최소 32자 이상의 키 사용

#### 방법 4: OpenSSL 사용 (Mac/Linux)

```bash
openssl rand -base64 32
```

생성된 키를 복사해 두세요.

### 3. application.properties 설정

**⚠️ 중요: 보안을 위해 `application.properties` 파일은 Git에 커밋되지 않습니다!**

1. **예시 파일 복사:**
   ```bash
   cd backend/src/main/resources
   copy application.properties.example application.properties
   ```
   
   또는 Mac/Linux:
   ```bash
   cd backend/src/main/resources
   cp application.properties.example application.properties
   ```

2. **`application.properties` 파일을 열어 다음을 수정하세요:**
   ```properties
   # 데이터베이스 연결 정보 수정
   spring.datasource.url=jdbc:mariadb://localhost:3306/certbuddy?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_DATABASE_PASSWORD  # 실제 비밀번호로 변경
   
   # JWT 시크릿 키 (위에서 생성한 키로 변경!)
   jwt.secret=YOUR_JWT_SECRET_KEY_HERE  # 생성한 키로 변경
   ```

**보안 주의사항:**
- `application.properties` 파일은 절대 Git에 커밋하지 마세요
- 데이터베이스 비밀번호와 JWT 시크릿 키는 절대 공개 저장소에 올리면 안 됩니다
- `.gitignore` 파일에 이미 설정되어 있어 자동으로 무시됩니다

### 3. Maven 의존성 설치

```bash
cd backend
mvn clean install
```

## 데이터베이스 설정

### 자동 테이블 생성

`spring.jpa.hibernate.ddl-auto=update` 설정으로 인해 애플리케이션 실행 시 자동으로 테이블이 생성됩니다.

생성되는 테이블:
- `users` - 사용자 정보
- `certifications` - 자격증 정보
- `questions` - 문제 정보
- `flash_cards` - 플래시카드 정보
- `learning_sessions` - 학습 세션 정보
- `review_cards` - 복습 카드 정보
- `friends` - 친구 관계 정보
- `user_certifications` - 사용자-자격증 관계 정보

### 초기 데이터 입력

애플리케이션 실행 후 다음 SQL을 실행하여 기본 자격증 데이터를 입력할 수 있습니다:

```sql
-- 자격증 데이터 예시
INSERT INTO certifications (name, description, created_at) VALUES
('자동화설비기능사', '자동화설비 관련 자격증', NOW()),
('전기기능사', '전기 관련 자격증', NOW()),
('프로그래밍기능사', '프로그래밍 관련 자격증', NOW()),
('전자기능사', '전자 관련 자격증', NOW());
```

## 프로젝트 구조

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/certbuddy/
│   │   │   ├── config/          # 설정 클래스 (Security, JWT, CORS)
│   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   ├── request/     # 요청 DTO
│   │   │   │   └── response/    # 응답 DTO
│   │   │   ├── entity/          # JPA 엔티티
│   │   │   ├── repository/      # JPA 리포지토리
│   │   │   └── service/         # 비즈니스 로직 서비스
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## 실행 방법

### 1. IDE에서 실행
- IntelliJ IDEA 또는 Eclipse에서 `CertBuddyApplication.java`를 실행

### 2. Maven으로 실행
```bash
cd backend
mvn spring-boot:run
```

### 3. JAR 파일로 실행
```bash
cd backend
mvn clean package
java -jar target/certbuddy-backend-1.0.0.jar
```

서버가 정상적으로 실행되면 `http://localhost:8080`에서 접근할 수 있습니다.

### 4. 서버 정상 작동 확인

서버가 정상적으로 실행되었는지 확인하는 방법:

#### 간단한 확인 (브라우저)
브라우저에서 다음 URL을 열어보세요:
```
http://localhost:8080/api/auth/login
```
응답이 오면 서버가 정상 작동 중입니다.

#### 자동 테스트 스크립트 실행
```bash
# Windows
cd backend
test-server.bat

# Mac/Linux
cd backend
chmod +x test-server.sh
./test-server.sh
```

#### 수동 테스트 (curl)
```bash
# 회원가입 테스트
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name":"테스트","school":"테스트학교","department":"테스트학과","grade":1}'
```

**자세한 테스트 방법은 `docs/TESTING_GUIDE.md`를 참고하세요.**

## API 엔드포인트

### 인증 (Authentication)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 사용자 (User)
- `GET /api/users/me` - 현재 사용자 정보 조회
- `GET /api/users/search?userCode={code}` - 사용자 코드로 검색

### 학습 (Learning)
- `GET /api/learning/recommendations` - 추천 자격증 조회
- `GET /api/learning/cards/{certificationId}` - 플래시카드 조회
- `POST /api/learning/sessions` - 학습 세션 시작
- `POST /api/learning/sessions/{sessionId}/complete` - 학습 세션 완료
- `GET /api/learning/review` - 복습 카드 조회
- `POST /api/learning/review` - 복습 카드 추가

### 친구 (Friend)
- `GET /api/friends` - 친구 목록 조회
- `POST /api/friends/{friendId}` - 친구 추가 요청
- `POST /api/friends/{friendId}/accept` - 친구 요청 수락
- `GET /api/friends/requests` - 친구 요청 목록 조회
- `GET /api/friends/ranking` - 친구 랭킹 조회
- `GET /api/friends/recommendations` - 추천 사용자 조회
- `GET /api/friends/search?userCode={code}` - 사용자 코드로 검색

### 인증 헤더
대부분의 API는 JWT 토큰 인증이 필요합니다:
```
Authorization: Bearer {JWT_TOKEN}
```

## 프론트엔드 연동

### 1. 프론트엔드 설정 변경

`frontend/src/services/` 디렉토리의 각 서비스 파일에서 `USE_MOCK_API`를 `false`로 변경:

```javascript
// authService.js, learningService.js, friendService.js
const USE_MOCK_API = false; // true에서 false로 변경
```

### 2. API 기본 URL 확인

`frontend/src/constants/config.js`에서 API 기본 URL이 올바른지 확인:

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080'  // 또는 실제 IP 주소
  : 'https://api.certbuddy.com';
```

### 3. Expo 앱에서 테스트 시

Expo 앱을 실제 기기에서 테스트할 경우, `localhost` 대신 컴퓨터의 실제 IP 주소를 사용해야 합니다:

```bash
# Windows에서 IP 주소 확인
ipconfig

# Mac/Linux에서 IP 주소 확인
ifconfig
# 또는
ip addr
```

예: `http://192.168.0.100:8080`

## 다음 단계

### 1. 초기 데이터 마이그레이션
- mockData.js에 있던 자격증, 문제 데이터를 데이터베이스에 입력하는 스크립트 작성

### 2. 비즈니스 로직 개선
- 추천 알고리즘 구현
- 스트릭 계산 로직 개선
- 복습 카드 스케줄링 알고리즘 (예: Anki 알고리즘)

### 3. 에러 처리 개선
- 커스텀 예외 클래스 생성
- 전역 예외 핸들러 추가

### 4. 테스트 작성
- 단위 테스트
- 통합 테스트
- API 테스트

### 5. 보안 강화
- JWT 시크릿 키 환경 변수로 관리
- 비밀번호 정책 강화
- Rate Limiting 추가

### 6. 성능 최적화
- 데이터베이스 인덱스 추가
- 쿼리 최적화
- 캐싱 전략 수립

## 보안 주의사항

### ⚠️ Git에 커밋하면 안 되는 파일들

다음 파일들은 민감한 정보를 포함하고 있어 `.gitignore`에 추가되어 있습니다:

- `backend/src/main/resources/application.properties` - 데이터베이스 비밀번호, JWT 시크릿 키 포함
- `backend/src/main/resources/application-dev.properties` - 개발 환경 설정

**대신 사용하는 파일:**
- `application.properties.example` - 예시 파일 (Git에 커밋됨)
- `application-dev.properties.example` - 개발 환경 예시 파일

**처음 설정할 때:**
```bash
# Windows
copy backend\src\main\resources\application.properties.example backend\src\main\resources\application.properties

# Mac/Linux
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

그 다음 `application.properties` 파일을 열어 실제 값으로 수정하세요.

**자세한 내용은 `backend/README_SECURITY.md` 파일을 참고하세요.**

## 문제 해결

### 데이터베이스 연결 오류
- MariaDB가 실행 중인지 확인
- 데이터베이스 이름, 사용자명, 비밀번호가 올바른지 확인
- 방화벽 설정 확인

### 포트 충돌
- 8080 포트가 사용 중이면 `application.properties`에서 `server.port` 변경

### JWT 토큰 오류
- JWT 시크릿 키가 충분히 길고 복잡한지 확인 (최소 256비트 권장)
- Secret Key 생성 방법은 위의 "JWT Secret Key 생성" 섹션 참조
- `generate-jwt-secret.bat` (Windows) 또는 `generate-jwt-secret.sh` (Mac/Linux) 스크립트 실행

## 참고 자료

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Spring Security 공식 문서](https://spring.io/projects/spring-security)
- [MariaDB 공식 문서](https://mariadb.com/kb/en/documentation/)

