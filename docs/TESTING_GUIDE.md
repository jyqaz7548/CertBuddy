# 백엔드 서버 테스트 가이드

서버가 정상적으로 작동하는지 확인하는 방법입니다.

## 1. 서버 실행 확인

### 서버 로그 확인

서버를 실행하면 다음과 같은 로그가 나타나야 합니다:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)

Started CertBuddyApplication in X.XXX seconds
```

**정상적인 경우:**
- `Started CertBuddyApplication` 메시지가 보임
- 에러 메시지가 없음
- 포트 8080에서 리스닝 중

**문제가 있는 경우:**
- 데이터베이스 연결 오류
- 포트 충돌 (이미 사용 중)
- JWT 시크릿 키 오류

## 2. 간단한 연결 테스트

### 브라우저로 확인

브라우저에서 다음 URL을 열어보세요:
```
http://localhost:8080/api/auth/login
```

**예상 결과:**
- `{"success":false,"message":"..."}` 형태의 JSON 응답
- 또는 `405 Method Not Allowed` (정상 - GET 요청은 허용되지 않음)

### curl로 확인 (Windows)

```bash
curl http://localhost:8080/api/auth/login
```

### curl로 확인 (Mac/Linux)

```bash
curl http://localhost:8080/api/auth/login
```

## 3. 자동 테스트 스크립트 실행

### Windows

```bash
cd backend
test-server.bat
```

### Mac/Linux

```bash
cd backend
chmod +x test-server.sh
./test-server.sh
```

이 스크립트는 다음을 테스트합니다:
1. 서버 연결 확인
2. 회원가입 API 테스트
3. 로그인 API 테스트

## 4. 수동 API 테스트

### 방법 1: curl 사용

#### 회원가입 테스트

**Windows (CMD):**
```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test1234\",\"name\":\"테스트\",\"school\":\"테스트학교\",\"department\":\"테스트학과\",\"grade\":1}"
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name":"테스트","school":"테스트학교","department":"테스트학과","grade":1}'
```

**성공 응답 예시:**
```json
{
  "success": true,
  "message": "성공",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "테스트",
      "userCode": "CERT-0001",
      ...
    }
  }
}
```

#### 로그인 테스트

**Windows (CMD):**
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test1234\"}"
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### 방법 2: Postman 사용

1. **Postman 설치** (https://www.postman.com/downloads/)

2. **회원가입 요청:**
   - Method: `POST`
   - URL: `http://localhost:8080/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "test1234",
       "name": "테스트",
       "school": "테스트학교",
       "department": "테스트학과",
       "grade": 1
     }
     ```

3. **로그인 요청:**
   - Method: `POST`
   - URL: `http://localhost:8080/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "test1234"
     }
     ```

### 방법 3: 브라우저 개발자 도구 사용

1. 브라우저에서 `F12` 눌러 개발자 도구 열기
2. Console 탭에서 다음 코드 실행:

```javascript
// 회원가입 테스트
fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test1234',
    name: '테스트',
    school: '테스트학교',
    department: '테스트학과',
    grade: 1
  })
})
.then(response => response.json())
.then(data => console.log('회원가입 결과:', data))
.catch(error => console.error('에러:', error));
```

## 5. 예상되는 응답 코드

### 성공 (200 OK)
- 회원가입 성공
- 로그인 성공
- 데이터 조회 성공

### 클라이언트 오류 (400 Bad Request)
- 이메일 형식 오류
- 비밀번호 길이 부족
- 필수 필드 누락
- 이미 존재하는 이메일 (회원가입 시)

### 인증 오류 (401 Unauthorized)
- 잘못된 비밀번호
- 만료된 토큰
- 토큰 없이 보호된 리소스 접근

### 서버 오류 (500 Internal Server Error)
- 데이터베이스 연결 실패
- 서버 내부 오류

## 6. 문제 해결

### 서버가 시작되지 않는 경우

1. **포트 충돌 확인:**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Mac/Linux
   lsof -i :8080
   ```

2. **데이터베이스 연결 확인:**
   - MariaDB가 실행 중인지 확인
   - `application.properties`의 데이터베이스 정보 확인

3. **로그 확인:**
   - 콘솔에 나타나는 에러 메시지 확인
   - `logs/` 디렉토리 확인 (있다면)

### API가 응답하지 않는 경우

1. **CORS 오류 확인:**
   - 브라우저 콘솔에서 CORS 관련 에러 확인
   - `application.properties`의 CORS 설정 확인

2. **요청 형식 확인:**
   - Content-Type이 `application/json`인지 확인
   - JSON 형식이 올바른지 확인

3. **서버 로그 확인:**
   - 서버 콘솔에 에러 메시지가 있는지 확인

## 7. 다음 단계

서버가 정상 작동하면:

1. ✅ 프론트엔드에서 `USE_MOCK_API = false`로 변경
2. ✅ 프론트엔드 앱에서 실제 API 테스트
3. ✅ 데이터베이스에 데이터가 제대로 저장되는지 확인
4. ✅ JWT 토큰이 제대로 생성되고 검증되는지 확인

---

**도움이 필요하면:**
- 서버 로그를 확인하세요
- `docs/BACKEND_SETUP_GUIDE.md`를 참고하세요
- `backend/README_SECURITY.md`를 확인하세요

