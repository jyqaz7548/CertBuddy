# CertBuddy 개발 플로우차트

## 전체 시스템 아키텍처 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                    앱 시작 (App.js)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AuthContext 초기화                                       │  │
│  │  - AsyncStorage에서 authToken 확인                        │  │
│  │  - 토큰 있으면: GET /api/users/me → 사용자 정보 로드      │  │
│  │  - 토큰 없으면: 로그인 화면으로                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────┴───────────────────┐
        │                                         │
        ▼                                         ▼
┌───────────────┐                      ┌───────────────┐
│  인증 화면     │                      │  메인 화면     │
│  (Auth Flow)  │                      │  (Main Flow)  │
└───────┬───────┘                      └───────┬───────┘
        │                                         │
        │                                         │
┌───────▼───────────────────────────────────────▼───────┐
│              로그인/회원가입 API 호출                   │
│  ┌─────────────────────────────────────────────────┐  │
│  │ POST /api/auth/login                             │  │
│  │ POST /api/auth/register                         │  │
│  │                                                  │  │
│  │  백엔드 처리:                                     │  │
│  │  1. Controller → Service → Repository           │  │
│  │  2. JWT 토큰 생성                                │  │
│  │  3. User 엔티티 저장 (MariaDB)                   │  │
│  │  4. 응답: { token, user }                        │  │
│  │                                                  │  │
│  │  프론트엔드 처리:                                 │  │
│  │  1. AsyncStorage에 token 저장                    │  │
│  │  2. AuthContext에 user 상태 업데이트             │  │
│  │  3. 메인 화면으로 네비게이션                      │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              메인 화면 (하단 탭 네비게이션)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   홈     │ │  학습     │ │  복습     │ │  친구     │  │
│  └────┬─────┘ └────┬──────┘ └────┬──────┘ └────┬──────┘  │
│       │            │              │             │         │
│       └────────────┴──────────────┴─────────────┘         │
│                            │                              │
│                            ▼                              │
│              ┌─────────────────────────┐                 │
│              │   학습 플로우 시작       │                 │
│              │   (핵심 사이클)          │                 │
│              └───────────┬─────────────┘                 │
└──────────────────────────┼──────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  [1단계] 자격증 선택                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ GET /api/learning/recommendations                  │ │
│  │ → 백엔드: CertificationRepository.findAll()       │ │
│  │ → 응답: 자격증 목록                                │ │
│  └───────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  [2단계] 일차 선택                                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │ GET /api/learning/certifications/{id}/days         │ │
│  │ → 백엔드: QuestionSessionRepository 조회           │ │
│  │ → 완료된 일차 확인                                  │ │
│  │ → 응답: 일차별 진행 상태                            │ │
│  └───────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  [3단계] 학습 세션 시작                                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ POST /api/learning/sessions                       │ │
│  │ Body: { certificationId, day }                     │ │
│  │                                                    │ │
│  │  백엔드 처리:                                       │ │
│  │  1. LearningService.startSession()                 │ │
│  │  2. FlashCardRepository.findByCertificationAndDay │ │
│  │  3. LearningSession 엔티티 생성                    │ │
│  │  4. 응답: { sessionId, questions[] }               │ │
│  └───────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  [4단계] 문제 풀이 (내부 루프) ⬇️                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  [루프 시작]                                        │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ 1. 플래시카드 표시                            │ │ │
│  │  │ 2. 사용자 답변 입력                           │ │ │
│  │  │ 3. 정답 확인                                  │ │ │
│  │  │ 4. 결과 저장 (로컬 상태)                      │ │ │
│  │  │ 5. 다음 문제로                                │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  [루프 반복: 모든 문제 완료까지]                   │ │
│  └───────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  [5단계] 학습 세션 완료                                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ POST /api/learning/sessions/{sessionId}/complete   │ │
│  │ Body: { results: [{ questionId, isCorrect }] }    │ │
│  │                                                    │ │
│  │  백엔드 처리:                                       │ │
│  │  1. LearningService.completeSession()              │ │
│  │  2. XP 계산 (맞춘 문제 수 * 10)                    │ │
│  │  3. User.totalXp 업데이트                          │ │
│  │  4. 스트릭 업데이트 (연속 학습일)                   │ │
│  │  5. ReviewCard 생성 (틀린 문제만)                 │ │
│  │  6. LearningSession.status = COMPLETED            │ │
│  │  7. User.lastStudyDate 업데이트                    │ │
│  │  8. 응답: { xpEarned, totalXp, streak }           │ │
│  │                                                    │ │
│  │  프론트엔드 처리:                                   │ │
│  │  1. AuthContext.refreshUser() 호출                 │ │
│  │  2. 사용자 정보 갱신                                │ │
│  │  3. XpResultScreen 표시                            │ │
│  └───────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  [6단계] 결과 화면                                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │ - 획득 XP 표시                                     │ │
│  │ - 스트릭 업데이트 표시                              │ │
│  │ - 복습 필요 여부 확인                               │ │
│  │                                                    │ │
│  │  복습 필요 시:                                      │ │
│  │  → ReviewNeededScreen으로 이동                     │ │
│  │                                                    │ │
│  │  복습 불필요 시:                                    │ │
│  │  → 홈 화면으로 이동                                 │ │
│  └───────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  홈 화면으로   │
                    │  (사이클 완료) │
                    └───────┬───────┘
                            │
                            │ [새로운 학습 시작 가능]
                            │
                            └───────────────┐
                                            │
                            ┌───────────────▼───────────────┐
                            │   다시 [1단계]로 돌아가기        │
                            │   (무한 반복 가능)              │
                            └───────────────────────────────┘
```

## 데이터 흐름 상세

### 인증 플로우
```
[프론트엔드]
LoginScreen
  ↓
authService.login()
  ↓
apiService (axios)
  ↓ (HTTP POST)
[백엔드]
AuthController.login()
  ↓
AuthService.login()
  ├─ UserRepository.findByEmail()
  ├─ PasswordEncoder.matches()
  └─ JwtUtil.generateToken()
  ↓
User 엔티티 조회 (MariaDB)
  ↓
응답: { token, user }
  ↓ (HTTP Response)
[프론트엔드]
AsyncStorage.setItem('authToken')
AuthContext.setUser()
  ↓
메인 화면으로 네비게이션
```

### 학습 세션 플로우
```
[프론트엔드]
QuestionScreen
  ↓
questionService.startQuestionSession()
  ↓
POST /api/learning/sessions
  ↓ (HTTP Request with JWT Token)
[백엔드]
LearningController.startSession()
  ↓
LearningService.startSession()
  ├─ FlashCardRepository.findByCertificationAndDay()
  ├─ LearningSession 엔티티 생성
  └─ LearningSessionRepository.save()
  ↓
MariaDB INSERT (learning_sessions)
MariaDB SELECT (flash_cards)
  ↓
응답: { sessionId, questions[] }
  ↓ (HTTP Response)
[프론트엔드]
문제 풀이 루프 시작
  ↓
[문제 풀이 반복]
  ↓
questionService.completeSession()
  ↓
POST /api/learning/sessions/{id}/complete
  ↓ (HTTP Request)
[백엔드]
LearningService.completeSession()
  ├─ XP 계산
  ├─ User.totalXp 업데이트
  ├─ User.streak 업데이트
  ├─ ReviewCard 생성 (틀린 문제)
  └─ LearningSession.status = COMPLETED
  ↓
MariaDB UPDATE (users)
MariaDB INSERT (review_cards)
MariaDB UPDATE (learning_sessions)
  ↓
응답: { xpEarned, totalXp, streak }
  ↓ (HTTP Response)
[프론트엔드]
AuthContext.refreshUser()
XpResultScreen 표시
```

## 상태 관리 흐름

### 전역 상태 (Context API)
```
AuthContext
  ├─ user: User 객체
  ├─ isLoading: boolean
  ├─ login(): Promise
  ├─ register(): Promise
  ├─ logout(): void
  └─ refreshUser(): Promise
```

### 로컬 상태 (각 화면)
```
HomeScreen
  ├─ certifications: []
  ├─ userStats: {}
  └─ loading: boolean

QuestionScreen
  ├─ questions: []
  ├─ currentIndex: number
  ├─ results: []
  ├─ sessionId: number
  └─ loading: boolean
```

## API 엔드포인트 매핑

### 인증
- `POST /api/auth/login` → `AuthController.login()`
- `POST /api/auth/register` → `AuthController.register()`

### 학습
- `GET /api/learning/recommendations` → `LearningController.getRecommendations()`
- `GET /api/learning/certifications/{id}/days` → `LearningController.getDays()`
- `POST /api/learning/sessions` → `LearningController.startSession()`
- `POST /api/learning/sessions/{id}/complete` → `LearningController.completeSession()`

### 복습
- `GET /api/learning/review` → `LearningController.getReviewCards()`
- `POST /api/learning/review/{id}/complete` → `LearningController.completeReview()`

## 데이터베이스 스키마 관계

```
users (사용자)
  ├─ id (PK)
  ├─ email
  ├─ total_xp
  ├─ streak
  └─ last_study_date
      │
      ├─ learning_sessions (학습 세션)
      │   ├─ id (PK)
      │   ├─ user_id (FK → users.id)
      │   ├─ certification_id (FK → certifications.id)
      │   ├─ status
      │   └─ completed_at
      │
      └─ review_cards (복습 카드)
          ├─ id (PK)
          ├─ user_id (FK → users.id)
          ├─ question_id (FK → flash_cards.id)
          └─ next_review_date

certifications (자격증)
  └─ id (PK)
      │
      └─ flash_cards (플래시카드)
          ├─ id (PK)
          ├─ certification_id (FK → certifications.id)
          ├─ day
          ├─ question
          └─ answer
```

## 에러 처리 플로우

```
API 호출
  ↓
에러 발생?
  ├─ 401 Unauthorized
  │   └─ AsyncStorage.removeItem('authToken')
  │   └─ 로그인 화면으로 리다이렉트
  │
  ├─ 403 Forbidden
  │   └─ 권한 없음 메시지 표시
  │
  ├─ 404 Not Found
  │   └─ 리소스 없음 메시지 표시
  │
  ├─ 500 Server Error
  │   └─ 서버 오류 메시지 표시
  │
  └─ Network Error
      └─ 네트워크 연결 오류 메시지 표시
```

## 개발 시 주의사항

1. **토큰 관리**: 모든 API 요청에 JWT 토큰 자동 추가 (apiService 인터셉터)
2. **상태 동기화**: 학습 완료 후 `refreshUser()` 호출 필수
3. **에러 처리**: 모든 API 호출에 try-catch 적용
4. **로딩 상태**: 사용자 경험을 위해 로딩 인디케이터 표시
5. **데이터 검증**: 프론트엔드와 백엔드 양쪽에서 검증 수행

