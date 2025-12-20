# CertBuddy

자격증 학습을 위한 플래시카드 기반 학습 앱

## 개발 전략

이 프로젝트는 **프론트엔드 우선 개발(Frontend-First Development)** 전략을 사용합니다.

### 현재 상태

- ✅ 프론트엔드 기본 구조 완성
- ✅ Mock API 서비스 구현 완료
- ✅ 백엔드 코드 정리 완료

### 개발 순서

1. **프론트엔드 완성** (Mock 데이터 사용) ← 현재 단계
2. API 스펙 정의
3. 백엔드 개발
4. 통합 및 테스트

---

## 시작하기

### 프론트엔드 실행

```bash
cd frontend
npm install
npx expo start
```

### Mock API 사용

현재 모든 API 호출은 Mock 데이터를 사용합니다. 각 서비스 파일에서 `USE_MOCK_API = true`로 설정되어 있습니다.

백엔드가 준비되면:
1. 각 서비스 파일에서 `USE_MOCK_API = false`로 변경
2. `API_BASE_URL`을 실제 백엔드 주소로 변경

---

## 프로젝트 구조

```
├── frontend/          # React Native + Expo 프론트엔드
│   ├── src/
│   │   ├── screens/   # 화면 컴포넌트
│   │   ├── services/  # API 서비스 (Mock 포함)
│   │   ├── store/     # 상태 관리
│   │   └── navigation/ # 네비게이션
│   └── ...
├── backend/           # Spring Boot 백엔드 (현재 정리됨)
└── docs/             # 문서
    ├── FRONTEND_FIRST_DEVELOPMENT.md
    └── NEW_DEVELOPMENT_PLAN.md
```

---

## 문서

- [프론트엔드 우선 개발 가이드](./docs/FRONTEND_FIRST_DEVELOPMENT.md)
- [새로운 개발 계획](./docs/NEW_DEVELOPMENT_PLAN.md)

---

## 주요 기능

- 사용자 인증 (로그인/회원가입)
- 자격증 추천
- 플래시카드 학습
- 복습 시스템
- XP 및 스트릭 추적
- 친구 랭킹

---

## 기술 스택

### 프론트엔드
- React Native
- Expo
- React Navigation
- AsyncStorage

### 백엔드 (예정)
- Spring Boot
- MySQL
- JWT

---

## 라이선스

MIT
