# CertBuddy 프로젝트 설정 가이드

## 프로젝트 초기 설정 완료 ✅

프론트엔드와 백엔드의 기본 구조가 생성되었습니다.

## 다음 단계

### 1. 프론트엔드 설정

```bash
cd frontend
npm install
```

**주의사항:**
- Node.js 16 이상 필요
- Expo CLI가 설치되어 있어야 함 (`npm install -g expo-cli`)

### 2. 백엔드 설정

```bash
cd backend
# Maven Wrapper가 없다면 Maven 설치 필요
./mvnw clean install
```

**주의사항:**
- Java 17 이상 필요
- MySQL 8.0 이상 필요
- `application.properties`에서 데이터베이스 연결 정보 수정 필요

### 3. 데이터베이스 설정

1. MySQL에 데이터베이스 생성:
```sql
CREATE DATABASE certbuddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. `backend/src/main/resources/application.properties` 파일에서 데이터베이스 정보 수정:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. JWT 시크릿 키 변경 (프로덕션 환경):
```properties
jwt.secret=your-very-secure-secret-key-here
```

### 4. 프로젝트 실행

#### 백엔드 실행
```bash
cd backend
./mvnw spring-boot:run
```
서버가 `http://localhost:8080`에서 실행됩니다.

#### 프론트엔드 실행
```bash
cd frontend
npm start
```
Expo 개발 서버가 시작되면, 모바일 앱에서 QR 코드를 스캔하거나 에뮬레이터에서 실행할 수 있습니다.

## 현재 구현된 기능

### 프론트엔드
- ✅ 기본 네비게이션 구조 (인증/메인)
- ✅ 로그인/회원가입 화면 (UI만)
- ✅ 홈 화면 (대시보드 레이아웃)
- ✅ 학습 화면 (플래시카드 UI)
- ✅ 복습/친구/마이페이지 화면 (기본 구조)
- ✅ 인증 컨텍스트 (상태 관리)
- ✅ API 서비스 레이어

### 백엔드
- ✅ Spring Boot 프로젝트 구조
- ✅ JWT 기반 인증 설정
- ✅ CORS 설정
- ✅ 엔티티 모델 (User, Certification, FlashCard, LearningSession, ReviewCard, Friend)
- ✅ Repository 레이어
- ✅ 인증 API (회원가입/로그인)
- ✅ DTO 구조

## 아직 구현되지 않은 기능

### 프론트엔드
- ⏳ API 연동 (실제 백엔드와 통신)
- ⏳ 플래시카드 데이터 로딩
- ⏳ XP/스트릭 업데이트 로직
- ⏳ 복습 카드 기능
- ⏳ 친구 기능

### 백엔드
- ⏳ JWT 필터 (인증 미들웨어)
- ⏳ 사용자 정보 조회 API
- ⏳ 학습 관련 API
- ⏳ 플래시카드 조회 API
- ⏳ 친구/랭킹 API
- ⏳ 샘플 데이터

## 다음 개발 단계 제안

1. **데이터베이스 스키마 문서 작성** - 테이블 구조 상세 정의
2. **API 엔드포인트 문서 작성** - REST API 명세
3. **JWT 필터 구현** - 인증 미들웨어 추가
4. **사용자 API 구현** - 사용자 정보 조회/수정
5. **학습 API 구현** - 플래시카드 조회, 학습 세션 관리
6. **프론트엔드 API 연동** - 실제 백엔드와 통신
7. **샘플 데이터 생성** - 테스트용 데이터 준비

## 문제 해결

### 프론트엔드 실행 오류
- `npm install`이 실패하면 Node.js 버전 확인
- Expo CLI가 없다면 `npm install -g expo-cli` 실행

### 백엔드 실행 오류
- Java 버전 확인: `java -version` (17 이상 필요)
- MySQL 연결 오류: `application.properties`의 데이터베이스 정보 확인
- 포트 충돌: 8080 포트가 사용 중이면 `server.port` 변경

### 데이터베이스 연결 오류
- MySQL 서비스가 실행 중인지 확인
- 데이터베이스가 생성되었는지 확인
- 사용자 권한 확인

