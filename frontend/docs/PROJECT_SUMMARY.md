# CertBuddy 프로젝트 요약 및 AI 프롬프트 가이드

## 📋 프로젝트 개요

**CertBuddy**는 자격증 학습을 위한 모바일 앱입니다. 플래시카드 방식이 아닌 **객관식 문제 풀이 중심**의 학습 앱입니다.

### 핵심 특징
- ✅ 객관식 문제 풀이 (O/X, 빈칸 채우기)
- ✅ 실전 기출 문제 표시 (REAL_CBT)
- ✅ 게이미피케이션 (XP 시스템, 스트릭)
- ✅ 자동 복습 시스템 (틀린 문제 자동 추가)
- ✅ 복습 보너스 XP

---

## 🎯 현재까지 구현된 기능

### 1. 인증 시스템 ✅
- 로그인/회원가입 완료
- JWT 토큰 기반 인증 (Mock)
- 사용자 정보 관리 (Context API)

### 2. 홈 화면 ✅
- 총 XP 및 연속 학습 스트릭 표시
- "오늘의 학습 시작하기" 버튼
- "오늘의 복습 시작하기" 버튼 (복습 문제 있을 때만 활성화)
- 실시간 XP 업데이트

### 3. 학습 모드 ✅
- **문제 풀이 화면 (QuestionScreen)**
  - 문제 번호 표시 (예: 3 / 7)
  - 문제 유형 표시 (O/X, 빈칸 채우기)
  - REAL_CBT 문제 라벨 및 examInfo 표시
  - 선택지 버튼 UI (OX: O/X, BLANK: 4지선다)
  - 즉시 정답/오답 피드백 (초록색/빨간색)
  - 해설 표시 (스크롤 가능)
  - 실시간 예상 XP 표시
- **XP 계산**
  - 기본 XP: 문제당 10XP
  - 틀린 문제당 10XP 차감
  - 모두 틀리면 0XP
- **복습 리스트 자동 추가**
  - 틀린 문제는 자동으로 복습 리스트에 추가
- **학습 완료 처리**
  - 모두 틀리면: "학습 복습 필요" 경고 화면
  - 일부 이상 맞추면: XP 결과 화면 표시

### 4. 복습 모드 ✅
- **복습 문제 목록**
  - 틀린 문제만 표시
  - 문제 미리보기 (번호, 유형, 기출 여부)
- **복습 문제 풀이**
  - QuestionScreen 재사용
  - 정답 1번만 맞추면 완료 처리
- **복습 XP 계산**
  - 기본 XP: 문제당 5XP (일반 학습의 절반)
  - 틀린 문제당 5XP 차감
  - 모두 틀리면 0XP
  - 복습 XP는 "보너스 XP"로 표시
- **복습 완료 처리**
  - 모두 틀리면: "복습 필요" 경고 화면
  - 일부 이상 맞추면: 보너스 XP 결과 화면

### 5. XP 시스템 ✅
- **학습 XP**
  - 문제당 10XP, 틀리면 10XP 차감
  - 최소 0XP 보장
- **복습 보너스 XP**
  - 문제당 5XP, 틀리면 5XP 차감
  - "보너스 XP"로 별도 표시
- **XP 결과 화면**
  - 애니메이션 효과 (페이드인, 스케일, 카운트업)
  - 정확도 표시
  - 결과 요약 (총 문제, 정답, 오답)
  - XP 상세 내역 (기본 XP, 차감, 최종 XP)
- **실시간 XP 업데이트**
  - 홈 화면 포커스 시 자동 갱신
  - AuthContext의 refreshUser() 함수 사용

### 6. 자격증별 문제 분리 ✅
- **문제 데이터 구조**
  - 자격증 ID별로 문제 분리
  - certificationId: 2 = 전기기능사
  - certificationId: 7 = 정보처리기능사
- **문제 조회**
  - certificationId에 따라 해당 자격증의 문제만 반환
  - 복습 문제는 모든 자격증에서 조회

### 7. 예외 처리 ✅
- **복습 필요 화면 (ReviewNeededScreen)**
  - 모두 틀렸을 때 경고 화면 표시
  - 복습하기 버튼 (복습 화면으로 이동)
  - 확인 버튼 (홈으로 돌아가기)
  - 학습/복습 모드에 따른 메시지 변경

---

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── screens/
│   │   ├── Auth/              # 로그인, 회원가입
│   │   ├── Home/              # 홈 화면
│   │   ├── Learning/          # 학습 관련
│   │   │   ├── LearningScreen.js      # 학습 시작 화면
│   │   │   ├── QuestionScreen.js      # 문제 풀이 화면
│   │   │   ├── XpResultScreen.js       # XP 결과 화면
│   │   │   └── ReviewNeededScreen.js  # 복습 필요 화면
│   │   ├── Review/            # 복습 화면 (현재 사용 안 함)
│   │   ├── Friends/           # 친구 화면 (미완성)
│   │   ├── Profile/           # 마이페이지
│   │   └── Tutorial/          # 튜토리얼
│   ├── services/
│   │   ├── questionService.js    # 문제 관련 API
│   │   ├── learningService.js    # 학습 관련 API
│   │   ├── authService.js        # 인증 API
│   │   ├── mockApiService.js     # Mock API 구현
│   │   └── mockData.js           # Mock 데이터
│   ├── store/
│   │   └── AuthContext.js        # 인증 상태 관리
│   └── navigation/
│       ├── MainNavigator.js      # 메인 네비게이션
│       └── AuthNavigator.js      # 인증 네비게이션
```

---

## 🔑 핵심 데이터 구조

### 문제 데이터
```javascript
{
  id: number,
  certificationId: number,  // 2 = 전기기능사, 7 = 정보처리기능사
  type: "OX" | "BLANK",
  source: "AI_GENERATED" | "REAL_CBT",
  question: string,
  choices: string[],
  answer: string,
  explanation: string,
  examInfo: { year: number | null, round: string | null }
}
```

### 문제 데이터 구조 (자격증별)
```javascript
mockQuestions = {
  2: [...],  // 전기기능사 문제
  7: [...],  // 정보처리기능사 문제
}
```

### 사용자 데이터
```javascript
{
  id: number,
  email: string,
  name: string,
  school: string,
  department: string,
  grade: number,
  totalXp: number,
  streak: number
}
```

---

## 🎮 주요 기능 흐름

### 학습 흐름
1. 홈 화면 → "오늘의 학습 시작하기" 클릭
2. LearningScreen → "문제 풀이 시작" 클릭
3. QuestionScreen → 문제 풀이
   - 문제 선택 → 즉시 피드백
   - 틀리면 자동으로 복습 리스트 추가
   - 실시간 예상 XP 표시
4. 마지막 문제 완료
   - 모두 틀림 → ReviewNeededScreen (복습 필요)
   - 일부 이상 맞춤 → XpResultScreen (XP 결과)
5. 홈으로 복귀 → XP 자동 업데이트

### 복습 흐름
1. 홈 화면 → "오늘의 복습 시작하기" 클릭 (복습 문제 있을 때만)
2. QuestionScreen (복습 모드) → 복습 문제 풀이
   - 정답 1번만 맞추면 완료 처리
3. 마지막 문제 완료
   - 모두 틀림 → ReviewNeededScreen (복습 필요)
   - 일부 이상 맞춤 → XpResultScreen (보너스 XP 결과)
4. 홈으로 복귀 → XP 자동 업데이트

---

## 🚀 다음에 구현해야 할 기능

### 우선순위 높음
1. **자격증 선택 기능**
   - 홈 화면 또는 학습 화면에서 자격증 선택
   - 선택한 자격증의 문제만 표시
   - 자격증별 학습 진행률 추적

2. **홈 화면 기능 완성**
   - 추천 자격증 리스트 표시 및 클릭 가능
   - 친구 랭킹 Top3 표시

3. **친구 화면 구현**
   - 친구 목록 표시
   - 친구 추가 기능
   - 친구 랭킹 전체 보기

### 우선순위 중간
4. **마이페이지 개선**
   - 학습 통계 (총 문제 수, 정확도 등)
   - 자격증별 학습 현황

5. **문제 데이터 확장**
   - 더 많은 자격증 문제 추가
   - 더 많은 문제 유형 (ORDER 등)

### 우선순위 낮음
6. **푸시 알림**
   - 복습 알림
   - 일일 학습 알림

7. **학습 통계**
   - 주간/월간 학습 그래프
   - 자격증별 정확도 추적

---

## 💻 기술 스택

- **프론트엔드**: React Native + Expo
- **네비게이션**: React Navigation (Tab + Stack)
- **상태 관리**: Context API
- **로컬 저장소**: AsyncStorage
- **HTTP 클라이언트**: Axios
- **백엔드**: Spring Boot (예정)
- **데이터베이스**: MySQL (예정)

---

## 🔄 Mock API → 실제 API 전환 방법

각 서비스 파일에서 `USE_MOCK_API` 플래그만 `false`로 변경하면 됩니다.

```javascript
// src/services/questionService.js
const USE_MOCK_API = false; // true → false로 변경
```

자세한 내용은 `frontend/docs/BACKEND_MIGRATION.md` 참조

---

## 📝 AI에게 설명할 때 사용할 프롬프트 템플릿

```
CertBuddy는 자격증 학습을 위한 모바일 앱입니다.

## 현재 구현 상태
- 인증, 홈, 학습/복습, XP 시스템 완료
- 자격증별 문제 분리 완료 (전기기능사, 정보처리기능사)
- 문제 풀이, 복습, XP 계산, 예외 처리 모두 구현됨

## 데이터 구조
- 문제: certificationId별로 분리 (2=전기기능사, 7=정보처리기능사)
- XP: 학습(10XP/문제, 틀리면-10XP), 복습(5XP/문제, 틀리면-5XP)
- 복습: 틀린 문제 자동 추가, 정답 1번만 맞추면 완료

## 다음 구현할 기능
[구체적인 기능 설명]

이 기능을 구현하려면 어떻게 해야 할까요?
```

---

## 🎯 자격증 ID 매핑

- **2**: 전기기능사
- **7**: 정보처리기능사

추가 자격증은 이 매핑에 따라 문제 데이터를 추가하면 됩니다.

