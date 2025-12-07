# 백엔드 서버 실행 가이드

## 사전 준비사항

### 1. Java 설치 확인
```bash
java -version
```
- **필수**: Java 17 이상이 설치되어 있어야 합니다
- Java가 없다면: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) 또는 [OpenJDK](https://openjdk.org/) 설치

### 2. MySQL 설치 및 실행 확인
```bash
# MySQL 서비스 상태 확인 (Windows)
# 서비스 관리자에서 MySQL 확인

# MySQL 서비스 상태 확인 (Linux/Mac)
sudo systemctl status mysql
# 또는
brew services list  # Mac의 경우
```

### 3. 데이터베이스 생성
MySQL에 접속하여 데이터베이스를 생성합니다:

```sql
CREATE DATABASE certbuddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

또는 개발용 데이터베이스:
```sql
CREATE DATABASE certbuddy_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 데이터베이스 연결 정보 설정
`backend/src/main/resources/application.properties` 파일을 열어서 데이터베이스 정보를 수정합니다:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/certbuddy?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root          # 본인의 MySQL 사용자명
spring.datasource.password=your_password # 본인의 MySQL 비밀번호
```

---

## 서버 실행 방법

### 방법 1: Maven이 설치된 경우 (권장)

```bash
cd backend
mvn spring-boot:run
```

### 방법 2: Maven Wrapper 사용 (Maven 설치 불필요)

먼저 Maven Wrapper를 생성합니다:
```bash
cd backend
mvn wrapper:wrapper
```

그 다음 실행:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### 방법 3: IDE에서 실행 (IntelliJ IDEA / Eclipse)

1. `backend/src/main/java/com/certbuddy/CertBuddyApplication.java` 파일을 엽니다
2. `main` 메서드 옆의 실행 버튼을 클릭합니다
3. 또는 `Run` → `Run 'CertBuddyApplication'` 선택

---

## 서버 실행 확인

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
Started CertBuddyApplication in X.XXX seconds
```

서버는 기본적으로 **http://localhost:8080** 에서 실행됩니다.

### 서버 상태 확인

브라우저나 터미널에서 다음 명령어로 확인:

```bash
# Windows
curl http://localhost:8080

# 또는 브라우저에서
# http://localhost:8080 접속
```

---

## 개발 프로파일 사용 (선택사항)

개발 환경에서는 `application-dev.properties`를 사용할 수 있습니다:

```bash
# Maven으로 실행 시
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 또는 IDE에서 실행 시
# Run Configuration → VM options에 추가:
-Dspring.profiles.active=dev
```

개발 프로파일 설정:
- 데이터베이스: `certbuddy_dev`
- `ddl-auto=create-drop` (서버 종료 시 테이블 삭제)

---

## 포트 변경

기본 포트(8080)가 사용 중인 경우, `application.properties`에서 변경:

```properties
server.port=8081  # 원하는 포트 번호
```

**주의**: 포트를 변경하면 프론트엔드의 `src/constants/config.js`에서도 API URL을 수정해야 합니다.

---

## 문제 해결

### 1. 포트가 이미 사용 중인 경우
```
Port 8080 is already in use
```
**해결**: 다른 포트로 변경하거나, 8080 포트를 사용하는 프로세스를 종료

### 2. MySQL 연결 실패
```
Communications link failure
```
**해결**:
- MySQL 서비스가 실행 중인지 확인
- `application.properties`의 데이터베이스 연결 정보 확인
- 데이터베이스가 생성되었는지 확인

### 3. Java 버전 오류
```
Unsupported class file major version
```
**해결**: Java 17 이상으로 업그레이드

### 4. Maven 명령어를 찾을 수 없는 경우
```
'mvn' is not recognized as an internal or external command
```
**해결**: 
- Maven 설치: https://maven.apache.org/download.cgi
- 또는 Maven Wrapper 사용 (방법 2 참고)

---

## 서버 종료

터미널에서 실행한 경우:
- `Ctrl + C`를 눌러 서버를 종료합니다

---

## API 테스트

서버가 실행되면 다음 엔드포인트로 테스트할 수 있습니다:

### 회원가입
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "테스트",
  "school": "테스트대학교",
  "department": "컴퓨터공학과",
  "grade": 1
}
```

### 로그인
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Postman이나 curl을 사용하여 테스트할 수 있습니다.
