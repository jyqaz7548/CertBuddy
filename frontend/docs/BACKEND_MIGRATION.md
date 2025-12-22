# 백엔드 전환 가이드

현재 프로젝트는 Mock 데이터를 사용하고 있으며, **단 한 줄의 코드 변경**으로 실제 백엔드 API로 전환할 수 있습니다.

## 🎯 전환 방법

### 1단계: 각 서비스 파일의 `USE_MOCK_API` 플래그 변경

각 서비스 파일에서 `USE_MOCK_API = true`를 `false`로 변경하면 됩니다.

#### 변경할 파일 목록:

1. **`src/services/questionService.js`**
```javascript
// 변경 전
const USE_MOCK_API = true;

// 변경 후
const USE_MOCK_API = false;
```

2. **`src/services/learningService.js`**
```javascript
const USE_MOCK_API = false; // true → false
```

3. **`src/services/authService.js`**
```javascript
const USE_MOCK_API = false; // true → false
```

4. **`src/services/friendService.js`** (있는 경우)
```javascript
const USE_MOCK_API = false; // true → false
```

### 2단계: API 베이스 URL 설정

`src/constants/config.js` 파일에서 백엔드 서버 주소를 설정합니다.

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.xxx:8080'  // 로컬 개발 서버 (xxx를 본인 IP로 변경)
  : 'https://api.certbuddy.com';  // 프로덕션 서버
```

**참고**: Expo 앱에서는 `localhost` 대신 컴퓨터의 실제 IP 주소를 사용해야 합니다.
- Windows: `ipconfig` 명령어로 IPv4 주소 확인
- Mac/Linux: `ifconfig` 또는 `ip addr` 명령어로 IP 확인

## 📋 백엔드 API 엔드포인트 요구사항

백엔드가 구현해야 할 API 엔드포인트:

### 문제 관련 API

#### 1. 문제 목록 조회
```
GET /api/questions?certificationId={certificationId}
```

**응답 예시:**
```json
[
  {
    "id": 1,
    "type": "BLANK",
    "source": "AI_GENERATED",
    "question": "도체의 전기 저항은 도체의 길이에 비례하고, 도체의 [   ]에 반비례합니다.",
    "choices": ["단면적", "무게", "부피", "온도"],
    "answer": "단면적",
    "explanation": "전기 저항은 전자의 흐름을 방해하는 정도입니다...",
    "examInfo": {
      "year": null,
      "round": null
    }
  }
]
```

#### 2. 문제 세션 시작
```
POST /api/questions/sessions
Body: {
  "certificationId": 1,
  "userId": 1
}
```

**응답 예시:**
```json
{
  "sessionId": "session_1234567890",
  "questions": [...],
  "startedAt": "2024-01-01T00:00:00Z"
}
```

#### 3. 답안 제출
```
POST /api/questions/sessions/{sessionId}/answers
Body: {
  "questionId": 1,
  "selectedAnswer": "단면적",
  "isCorrect": true
}
```

**응답 예시:**
```json
{
  "success": true,
  "isCorrect": true,
  "correctAnswer": "단면적"
}
```

#### 4. 학습 세션 완료
```
POST /api/questions/sessions/{sessionId}/complete
Body: {
  "results": [
    {
      "questionId": 1,
      "selectedAnswer": "단면적",
      "isCorrect": true
    }
  ]
}
```

**응답 예시:**
```json
{
  "success": true,
  "totalQuestions": 6,
  "correctAnswers": 5,
  "xpEarned": 50
}
```

### 인증 관련 API

#### 1. 로그인
```
POST /api/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. 회원가입
```
POST /api/auth/register
Body: {
  "email": "test@example.com",
  "password": "password123",
  "name": "홍길동",
  ...
}
```

### 학습 관련 API

기존 `learningService.js`에서 사용하는 엔드포인트들:
- `GET /api/learning/recommendations`
- `GET /api/learning/cards/{certificationId}`
- `POST /api/learning/sessions`
- `POST /api/learning/sessions/{sessionId}/complete`
- `GET /api/learning/review`
- `POST /api/learning/review`

## 🔐 인증 처리

모든 API 요청에는 JWT 토큰이 자동으로 포함됩니다.

- **요청 헤더**: `Authorization: Bearer {token}`
- 토큰은 `AsyncStorage`의 `authToken` 키에 저장됩니다.
- 토큰 만료 시 (401 응답) 자동으로 로그아웃 처리됩니다.

## ✅ 전환 체크리스트

- [ ] 모든 서비스 파일의 `USE_MOCK_API`를 `false`로 변경
- [ ] `config.js`의 `API_BASE_URL`을 백엔드 서버 주소로 설정
- [ ] 백엔드 서버가 실행 중인지 확인
- [ ] 네트워크 연결 확인 (같은 Wi-Fi 또는 개발 서버 접근 가능)
- [ ] CORS 설정 확인 (백엔드에서 React Native 앱의 요청 허용)
- [ ] 인증 토큰이 올바르게 전달되는지 확인

## 🐛 문제 해결

### 네트워크 오류 발생 시
1. 백엔드 서버가 실행 중인지 확인
2. `API_BASE_URL`이 올바른지 확인
3. 방화벽 설정 확인
4. 같은 네트워크에 연결되어 있는지 확인

### 인증 오류 발생 시
1. 로그인 후 토큰이 저장되는지 확인
2. 토큰이 요청 헤더에 포함되는지 확인
3. 백엔드의 JWT 설정 확인

### 데이터 형식 오류 시
1. 백엔드 응답 형식이 프론트엔드에서 기대하는 형식과 일치하는지 확인
2. `questionService.js`의 응답 처리 로직 확인

## 📝 참고사항

- Mock 데이터는 `src/services/mockData.js`에 정의되어 있습니다.
- Mock API 서비스는 `src/services/mockApiService.js`에 구현되어 있습니다.
- 실제 백엔드 전환 후에도 Mock 파일들은 유지해도 됩니다 (테스트용).
- 필요시 Mock 파일들을 삭제해도 됩니다.

## 🚀 빠른 전환 예시

```bash
# 1. 모든 서비스 파일에서 USE_MOCK_API를 false로 변경
# (각 파일에서 한 줄씩 변경)

# 2. config.js에서 API 주소 설정
# API_BASE_URL = 'http://192.168.0.100:8080'

# 3. 앱 재시작
npm start
```

이제 실제 백엔드 API를 사용합니다! 🎉

