# 프론트엔드 우선 개발 가이드

## 개발 전략

이 프로젝트는 **프론트엔드 우선 개발(Frontend-First Development)** 전략을 사용합니다.

### 개발 순서

1. ✅ **프론트엔드 완성** (Mock 데이터 사용)
2. ⏳ **API 스펙 정의** (프론트엔드 요구사항 기반)
3. ⏳ **백엔드 개발** (API 스펙에 맞춰 구현)
4. ⏳ **통합 및 테스트**

---

## 현재 상태

### ✅ 완료된 작업
- 프론트엔드 기본 구조
- Mock API 서비스 구현
- 모든 화면 컴포넌트

### ⏳ 다음 단계
- 프론트엔드 기능 완성
- API 스펙 문서 작성
- 백엔드 재구축

---

## Mock API 사용 방법

### Mock 모드 활성화/비활성화

각 서비스 파일에서 `USE_MOCK_API` 플래그를 변경:

```javascript
// frontend/src/services/authService.js
const USE_MOCK_API = true;  // Mock 사용
// const USE_MOCK_API = false;  // 실제 API 사용
```

### Mock 데이터 위치

- `frontend/src/services/mockApiService.js` - Mock API 구현
- `frontend/src/services/mockData.js` - Mock 데이터 정의

### Mock 데이터 저장

Mock 데이터는 브라우저의 `localStorage`에 저장됩니다:
- `mock_users` - 사용자 데이터
- `mock_sessions` - 학습 세션 데이터
- `mock_review_cards` - 복습 카드 데이터

---

## 프론트엔드 개발 체크리스트

### Phase 1: UI/UX 완성
- [ ] 로그인/회원가입 화면 완성
- [ ] 홈 화면 완성 (대시보드)
- [ ] 학습 화면 완성 (플래시카드)
- [ ] 복습 화면 완성
- [ ] 마이페이지 완성
- [ ] 친구 화면 완성

### Phase 2: 기능 구현 (Mock 데이터)
- [ ] 인증 플로우 (로그인/회원가입)
- [ ] 학습 세션 관리
- [ ] XP/스트릭 계산
- [ ] 복습 카드 관리
- [ ] 친구 랭킹 표시

### Phase 3: API 스펙 정의
- [ ] API 엔드포인트 목록 작성
- [ ] Request/Response 스키마 정의
- [ ] 에러 처리 규칙 정의

---

## 백엔드 개발 준비

프론트엔드가 완성되면:

1. **API 스펙 문서 작성**
   - `docs/api/API_SPEC.md` 파일 생성
   - 프론트엔드에서 사용하는 모든 API 명세

2. **데이터베이스 스키마 설계**
   - `docs/database/SCHEMA.md` 파일 생성
   - ERD 작성

3. **백엔드 프로젝트 생성**
   - Spring Boot 프로젝트 초기화
   - API 스펙에 맞춰 구현

---

## Mock API에서 실제 API로 전환

백엔드가 준비되면:

1. 각 서비스 파일에서 `USE_MOCK_API = false`로 변경
2. `API_BASE_URL`을 실제 백엔드 주소로 변경
3. Mock 관련 파일 삭제:
   - `mockApiService.js`
   - `mockData.js`

---

## 현재 Mock API 목록

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/users/me` - 사용자 정보 조회

### 학습
- `GET /api/learning/recommendations` - 추천 자격증
- `GET /api/learning/cards/{certId}` - 플래시카드 조회
- `POST /api/learning/sessions` - 학습 세션 시작
- `POST /api/learning/sessions/{id}/complete` - 학습 완료
- `GET /api/learning/review` - 복습 카드 조회
- `POST /api/learning/review` - 복습 카드 추가

### 친구
- `GET /api/friends` - 친구 목록
- `GET /api/friends/ranking` - 친구 랭킹

---

## 개발 팁

1. **Mock 데이터 수정**: `mockData.js`에서 데이터를 수정하면 앱에 즉시 반영됩니다
2. **로컬 스토리지 초기화**: 브라우저 개발자 도구에서 `localStorage.clear()` 실행
3. **에러 테스트**: Mock API에서 의도적으로 에러를 발생시켜 에러 처리 테스트 가능
