# CertBuddy 아키텍처 설계

## 시스템 아키텍처

```
┌─────────────────┐
│  React Native   │
│   (Expo) App    │
└────────┬────────┘
         │ REST API
         │ (HTTPS)
┌────────▼────────┐
│  Spring Boot    │
│   Backend API   │
└────────┬────────┘
         │
┌────────▼────────┐
│     MySQL       │
│   Database      │
└─────────────────┘
```

## 폴더 구조

### Frontend (React Native + Expo)
```
frontend/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── common/     # 공통 컴포넌트 (Button, Card 등)
│   │   └── learning/   # 학습 관련 컴포넌트 (FlashCard 등)
│   ├── screens/        # 화면 컴포넌트
│   │   ├── Auth/       # 로그인, 회원가입
│   │   ├── Home/       # 홈 화면
│   │   ├── Learning/   # 학습 화면
│   │   ├── Review/     # 복습 화면
│   │   ├── Friends/    # 친구 화면
│   │   └── Profile/    # 마이페이지
│   ├── navigation/     # 네비게이션 설정
│   ├── services/       # API 서비스
│   ├── store/          # 상태 관리 (Context API / Redux)
│   ├── utils/          # 유틸리티 함수
│   └── constants/      # 상수 정의
├── assets/             # 이미지, 폰트 등
├── App.js              # 앱 진입점
└── package.json
```

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/certbuddy/
│   ├── CertBuddyApplication.java
│   ├── config/         # 설정 클래스
│   ├── controller/     # REST 컨트롤러
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── LearningController.java
│   │   ├── FlashCardController.java
│   │   ├── FriendController.java
│   │   └── RankingController.java
│   ├── service/        # 비즈니스 로직
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── LearningService.java
│   │   ├── FlashCardService.java
│   │   ├── FriendService.java
│   │   └── RankingService.java
│   ├── repository/     # 데이터 접근 계층
│   │   ├── UserRepository.java
│   │   ├── FlashCardRepository.java
│   │   ├── LearningSessionRepository.java
│   │   └── FriendRepository.java
│   ├── entity/         # JPA 엔티티
│   │   ├── User.java
│   │   ├── FlashCard.java
│   │   ├── LearningSession.java
│   │   ├── ReviewCard.java
│   │   └── Friend.java
│   ├── dto/            # 데이터 전송 객체
│   │   ├── request/
│   │   └── response/
│   └── exception/      # 예외 처리
├── src/main/resources/
│   ├── application.properties
│   └── application-dev.properties
└── pom.xml
```

## 데이터베이스 설계

### 주요 테이블

1. **users** - 사용자 정보
2. **certifications** - 자격증 정보
3. **flash_cards** - 플래시카드
4. **learning_sessions** - 학습 세션
5. **review_cards** - 복습 카드
6. **friends** - 친구 관계
7. **user_xp** - 사용자 XP 및 스트릭

자세한 스키마는 `docs/database/SCHEMA.md` 참조

## API 설계

### 인증 관련
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 사용자 관련
- `GET /api/users/me` - 내 정보 조회
- `PUT /api/users/me` - 내 정보 수정

### 학습 관련
- `GET /api/learning/recommendations` - 추천 자격증 조회
- `GET /api/learning/cards/{certId}` - 플래시카드 조회
- `POST /api/learning/sessions` - 학습 세션 시작
- `POST /api/learning/sessions/{sessionId}/complete` - 학습 완료
- `GET /api/learning/review` - 복습 카드 조회

### 친구 관련
- `GET /api/friends` - 친구 목록
- `POST /api/friends/{userId}` - 친구 추가
- `GET /api/friends/ranking` - 친구 랭킹

자세한 API 명세는 `docs/api/API.md` 참조

## 개발 원칙

1. **확장 가능성**: 기능 추가가 용이하도록 모듈화
2. **간단함**: 과도하게 복잡한 구조 지양
3. **직관성**: 코드 구조가 명확하고 이해하기 쉬워야 함
4. **MVP 우선**: 핵심 기능부터 구현 후 확장

