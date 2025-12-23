# 프론트엔드-백엔드 연동 가이드

프론트엔드와 백엔드를 연동하는 방법입니다.

## ✅ 완료된 작업

다음 파일들이 실제 백엔드 API를 사용하도록 설정되었습니다:

- `frontend/src/services/authService.js` - 인증 API
- `frontend/src/services/learningService.js` - 학습 API
- `frontend/src/services/friendService.js` - 친구 API
- `frontend/src/services/questionService.js` - 문제 API

모든 서비스 파일에서 `USE_MOCK_API = false`로 변경되었습니다.

## 📱 실제 기기에서 테스트하기

Expo 앱을 실제 기기에서 테스트할 때는 `localhost` 대신 컴퓨터의 실제 IP 주소를 사용해야 합니다.

### 1. IP 주소 확인

**Windows:**
```bash
ipconfig
```
출력에서 "IPv4 주소"를 찾으세요. 예: `192.168.0.100`

**Mac/Linux:**
```bash
ifconfig
# 또는
ip addr
```

### 2. API URL 설정 변경

`frontend/src/constants/config.js` 파일을 열어서:

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080'  // 에뮬레이터/시뮬레이터용
  // ? 'http://192.168.0.100:8080'  // 실제 기기용: 위 줄 주석 처리하고 본인 IP로 변경
  : 'https://api.certbuddy.com';
```

**실제 기기에서 테스트할 때:**
1. `'http://localhost:8080'` 줄을 주석 처리
2. `'http://192.168.0.100:8080'` 줄의 주석을 해제하고 본인 IP로 변경

예시:
```javascript
export const API_BASE_URL = __DEV__ 
  // ? 'http://localhost:8080'  // 에뮬레이터/시뮬레이터용
  ? 'http://192.168.0.100:8080'  // 실제 기기용: 본인 IP로 변경
  : 'https://api.certbuddy.com';
```

### 3. 백엔드 CORS 설정 확인

`backend/src/main/resources/application.properties` 파일에서 CORS 설정을 확인하세요:

```properties
spring.web.cors.allowed-origins=http://localhost:19006,http://localhost:8081
```

실제 기기에서 테스트할 때는 Expo가 사용하는 포트를 추가해야 할 수 있습니다. 하지만 일반적으로 `*` (모든 origin 허용)은 개발 환경에서만 사용하세요.

### 4. 방화벽 확인

백엔드 서버가 실행 중인 컴퓨터의 방화벽에서 포트 8080이 열려있는지 확인하세요.

**Windows:**
1. Windows Defender 방화벽 설정 열기
2. 고급 설정 > 인바운드 규칙
3. 포트 8080에 대한 규칙이 있는지 확인 (없으면 추가)

**Mac:**
시스템 설정 > 네트워크 > 방화벽에서 포트 8080 허용

## 🔍 테스트 방법

### 1. 백엔드 서버 실행 확인

```bash
cd backend
mvn spring-boot:run
```

서버가 `http://localhost:8080`에서 실행되는지 확인하세요.

### 2. 프론트엔드 앱 실행

```bash
cd frontend
npm start
```

### 3. 회원가입/로그인 테스트

1. 앱에서 회원가입 시도
2. 성공하면 데이터베이스에 사용자가 생성되었는지 확인
3. 로그인 시도
4. JWT 토큰이 제대로 저장되고 사용되는지 확인

### 4. 네트워크 오류 해결

**문제: "서버에 연결할 수 없습니다"**

1. 백엔드 서버가 실행 중인지 확인
2. IP 주소가 올바른지 확인
3. 컴퓨터와 기기가 같은 Wi-Fi 네트워크에 연결되어 있는지 확인
4. 방화벽 설정 확인

**문제: CORS 오류**

브라우저 콘솔에 CORS 관련 에러가 나타나면:
1. 백엔드 CORS 설정 확인
2. `application.properties`에서 허용된 origin 확인

## 📝 백엔드 응답 형식

백엔드는 모든 응답을 다음과 같은 형식으로 반환합니다:

```json
{
  "success": true,
  "message": "성공",
  "data": {
    // 실제 데이터
  }
}
```

프론트엔드 서비스 파일에서는 자동으로 `data` 필드를 추출하여 반환합니다.

## 🔐 인증 토큰

로그인/회원가입 성공 시:
- JWT 토큰이 `AsyncStorage`에 저장됩니다
- 이후 모든 API 요청에 자동으로 토큰이 포함됩니다
- 토큰이 만료되면 자동으로 로그아웃 처리됩니다

## 다음 단계

1. ✅ 프론트엔드-백엔드 연동 완료
2. ✅ 실제 기기에서 테스트 준비 완료
3. ⏭️ IP 주소 입력 후 테스트 진행

---

**문제가 발생하면:**
- 서버 로그 확인
- 브라우저/앱 콘솔 확인
- 네트워크 연결 확인

