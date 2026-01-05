# CertBuddy 프로젝트 발표 대본

## 발표 시간: 약 7-9분

---

## [1단계] 인사 및 프로젝트 소개 (30초)

안녕하세요. 오늘 발표할 프로젝트는 **CertBuddy**입니다.

CertBuddy는 자격증 학습을 위한 플래시카드 기반 학습 앱입니다. 
대학생들이 자신의 학과에 맞는 자격증을 효율적으로 학습할 수 있도록 돕는 것이 목표입니다.

기존의 자격증 학습 앱들과 달리, CertBuddy는 **데이터 기반 추천 시스템**과 **학습 과학 기반의 복습 시스템**을 통해 더욱 효과적인 학습을 제공합니다.

---

## [2단계] 핵심 기능 소개 (3-4분)

### 기능 1: 학과 기반 지능형 자격증 추천 시스템 (2분)

첫 번째 핵심 기능은 **학과 기반 지능형 자격증 추천 시스템**입니다.

기존 앱들은 단순히 인기 자격증을 추천하거나, 사용자가 직접 검색해야 했습니다. 
하지만 CertBuddy는 **같은 학과 선배들의 실제 취득 데이터를 분석**하여 개인화된 추천을 제공합니다.

**구체적인 작동 방식:**

1단계: **데이터 수집**
- 사용자의 학과 정보를 받아서, 같은 학과 학생들을 데이터베이스에서 조회합니다
- `List<User> sameDepartmentUsers`에 같은 학과 학생들의 User 객체들을 저장합니다
- 예를 들어, 컴퓨터공학과 학생이면 컴퓨터공학과에 속한 모든 학생들의 정보가 리스트에 담깁니다

2단계: **자격증 취득 횟수 집계**
- 각 학생을 순회하면서(`for (User user : sameDepartmentUsers)`) 그 학생이 취득한 자격증들을 조회합니다
- `Map<Long, Integer> certificationCountMap`을 만들어서, 자격증 ID를 키로, 취득한 학생 수를 값으로 저장합니다
- 예를 들어, 정보처리기사 자격증을 10명이 취득했다면, `certificationCountMap.put(정보처리기사ID, 10)`이 됩니다

3단계: **취득 비율 계산**
- 전체 같은 학과 학생 수를 기준으로 각 자격증의 취득 비율을 계산합니다
- `certificationCountMap.forEach()`를 사용하여 각 자격증별로 `(취득 학생 수 / 전체 학생 수)`를 계산합니다
- 예를 들어, 전체 100명 중 30명이 정보처리기사를 취득했다면 비율은 0.3, 즉 30%가 됩니다
- 이 비율을 `Map<Long, Double> certificationRatioMap`에 저장합니다

4단계: **정렬 및 필터링**
- 취득 비율을 기준으로 내림차순 정렬합니다 (가장 많이 취득한 자격증이 위로)
- Stream API의 `sorted()` 메서드를 사용하여 비율이 높은 순서대로 정렬합니다
- 최소 취득 비율 10% 이상인 자격증만 필터링하고, 상위 3개만 선택합니다
- `filter(entry -> entry.getValue() >= 0.1).limit(3)`을 통해 조건에 맞는 자격증만 추출합니다

5단계: **응답 데이터 생성**
- 최종적으로 선택된 자격증 ID 목록을 `List<Long>`으로 추출합니다
- 이 ID들을 사용하여 데이터베이스에서 자격증 상세 정보를 조회합니다
- `CertificationResponse` DTO 객체를 생성하여 자격증 정보와 함께 취득 비율도 함께 반환합니다

이를 통해 사용자는 자신의 전공과 관련성이 높은 자격증을 효율적으로 찾을 수 있습니다.

*(데모 화면 보여주기)*
보시는 것처럼, 컴퓨터공학과 학생에게는 정보처리기사, 컴활, SQLD 등이 추천되고, 
각 자격증 옆에는 같은 학과 학생들의 취득 비율이 표시됩니다.

---

### 기능 2: 간격 반복 복습 시스템 (1분 30초)

두 번째 핵심 기능은 **간격 반복 복습 시스템**입니다.

학습 과학 연구에 따르면, 정보를 장기 기억으로 전환하기 위해서는 적절한 시점에 반복 학습이 필요합니다. 
CertBuddy는 이 원리를 적용하여 **틀린 문제를 자동으로 복습 일정에 추가**합니다.

**구체적인 작동 방식:**

1단계: **틀린 문제 감지**
- 사용자가 문제를 풀고 답안을 제출하면, 프론트엔드에서 정답과 비교합니다
- `isCorrect` 플래그가 `false`인 경우, 즉 틀린 문제를 자동으로 감지합니다
- 틀린 문제의 ID와 자격증 ID를 함께 저장합니다

2단계: **복습 카드 자동 생성**
- 틀린 문제가 감지되면, `ReviewCard` 엔티티를 생성합니다
- `ReviewCard`에는 다음 정보가 저장됩니다:
  - `user`: 사용자 정보
  - `flashCard`: 틀린 문제의 플래시카드 정보
  - `nextReviewDate`: 다음 복습 날짜 (현재 날짜 + 1일로 설정)
  - `reviewCount`: 복습 횟수 (초기값 0)
- 데이터베이스에 저장하여 사용자별 복습 리스트를 관리합니다

3단계: **복습 일정 조회**
- 사용자가 복습 탭에 접근하면, `nextReviewDate`가 오늘 날짜 이하인 복습 카드들을 조회합니다
- `reviewCardRepository.findByUserIdAndNextReviewDateLessThanEqual(userId, LocalDateTime.now())`를 사용하여
  복습이 필요한 카드만 필터링합니다
- 이렇게 조회된 복습 카드들을 `List<FlashCardResponse>`로 변환하여 반환합니다

4단계: **복습 완료 처리**
- 사용자가 복습을 완료하면, 복습 횟수를 증가시키고 다음 복습 날짜를 업데이트합니다
- 향후 고도화를 위해 복습 횟수와 정답 여부에 따라 복습 간격을 동적으로 조정할 수 있도록 설계했습니다

이를 통해 사용자는 수동으로 복습할 문제를 관리할 필요 없이, 
앱이 최적의 시점에 복습을 제안하여 학습 효율을 극대화할 수 있습니다.

*(데모 화면 보여주기)*
학습을 완료하면 틀린 문제들이 자동으로 복습 리스트에 추가되고, 
복습 탭에서 언제 복습해야 하는지 확인할 수 있습니다.

---

### 기능 3: 게이미피케이션 시스템 (1분 30초)

세 번째 핵심 기능은 **게이미피케이션 시스템**입니다.

학습 지속성을 높이기 위해 XP와 스트릭 시스템을 도입했습니다.

**XP 시스템의 작동 방식:**

1단계: **XP 계산**
- 프론트엔드에서 학습 세션을 완료할 때, 맞춘 문제 수와 틀린 문제 수를 계산합니다
- 맞춘 문제당 10XP를 부여하고, 틀린 문제당 10XP를 차감합니다
- 예를 들어, 10문제 중 8문제를 맞추고 2문제를 틀렸다면: `(10 * 10) - (2 * 10) = 80XP`를 획득합니다

2단계: **XP 업데이트**
- 학습 세션 완료 API 호출 시, 계산된 XP를 백엔드로 전송합니다
- 백엔드에서 `user.setTotalXp(user.getTotalXp() + request.getXpEarned())`를 통해
  사용자의 총 XP에 획득한 XP를 더합니다
- 데이터베이스에 저장하여 사용자의 누적 XP를 영구적으로 관리합니다

**스트릭 시스템의 작동 방식:**

1단계: **학습 날짜 확인**
- 학습 세션을 완료할 때, `LocalDateTime.now()`로 현재 날짜와 시간을 가져옵니다
- 사용자의 `lastStudyDate`와 비교하여 오늘 날짜인지 확인합니다

2단계: **스트릭 증가 로직**
- `if (user.getLastStudyDate() == null || user.getLastStudyDate().toLocalDate().isBefore(now.toLocalDate()))`
  조건을 확인합니다:
  - `lastStudyDate`가 null이면 (첫 학습) 스트릭을 1로 설정
  - `lastStudyDate`가 오늘보다 이전 날짜면 (연속 학습) 스트릭을 1 증가
  - 오늘 이미 학습했다면 스트릭은 증가하지 않음 (중복 학습 방지)

3단계: **학습 날짜 업데이트**
- 스트릭을 업데이트한 후, `user.setLastStudyDate(now)`로 마지막 학습 날짜를 오늘로 업데이트합니다
- 이를 통해 다음 학습 시 연속 학습 여부를 정확히 판단할 수 있습니다

이를 통해 정확도가 높을수록 더 많은 XP를 획득할 수 있고, 
매일 학습하는 습관을 형성할 수 있습니다.

*(데모 화면 보여주기)*
홈 화면에서 현재 XP와 스트릭을 확인할 수 있고, 
학습을 완료하면 실시간으로 XP와 스트릭이 업데이트됩니다.

---

## [3단계] 기술 스택 및 아키텍처 (1분)

CertBuddy는 다음과 같은 기술 스택으로 구성되어 있습니다.

**프론트엔드:**
- React Native와 Expo를 사용하여 iOS와 Android를 동시에 지원합니다
- React Navigation을 통해 직관적인 네비게이션을 구현했습니다
- AsyncStorage를 사용하여 로컬 데이터를 관리합니다

**백엔드:**
- Spring Boot를 사용하여 RESTful API를 구현했습니다
- JWT 토큰 기반 인증 시스템을 구축했습니다
- MariaDB를 사용하여 사용자 데이터와 학습 이력을 저장합니다

**아키텍처:**
- MVC 패턴을 따르며, Controller, Service, Repository 계층으로 분리하여 유지보수성을 높였습니다
- 트랜잭션 관리를 통해 데이터 일관성을 보장합니다

---

## [4단계] 핵심 로직 하이라이트 (2분)

코드 레벨에서 몇 가지 핵심 로직을 단계별로 자세히 보여드리겠습니다.

**첫 번째, 추천 시스템의 핵심 로직입니다:**

**1단계: 같은 학과 학생 조회**
```java
List<User> sameDepartmentUsers = userRepository.findByDepartment(department);
```
- `List<User>` 타입의 리스트에 같은 학과 학생들의 User 객체들을 저장합니다
- 예를 들어, "컴퓨터공학과"를 입력하면 컴퓨터공학과에 속한 모든 학생 정보가 리스트에 담깁니다

**2단계: 각 학생의 자격증 취득 횟수 집계**
```java
Map<Long, Integer> certificationCountMap = new HashMap<>();
int totalUsers = sameDepartmentUsers.size();

for (User user : sameDepartmentUsers) {
    List<UserCertification> acquiredCerts = userCertificationRepository
            .findByUserIdAndType(user.getId(), UserCertification.CertificationType.ACQUIRED);
    
    for (UserCertification uc : acquiredCerts) {
        Long certId = uc.getCertification().getId();
        certificationCountMap.put(certId, certificationCountMap.getOrDefault(certId, 0) + 1);
    }
}
```
- 바깥쪽 `for`문: `sameDepartmentUsers` 리스트의 각 학생을 순회합니다
- 안쪽 `for`문: 각 학생이 취득한 자격증(`UserCertification`) 리스트를 순회합니다
- `certificationCountMap`: 자격증 ID를 키로, 취득한 학생 수를 값으로 저장하는 Map입니다
- `getOrDefault(certId, 0) + 1`: 이미 존재하면 기존 값에 1을 더하고, 없으면 0에서 시작하여 1을 더합니다
- 예: 정보처리기사 자격증을 10명이 취득했다면 `{정보처리기사ID: 10}` 형태로 저장됩니다

**3단계: 취득 비율 계산**
```java
Map<Long, Double> certificationRatioMap = new HashMap<>();
certificationCountMap.forEach((certId, count) -> {
    double ratio = (double) count / totalUsers;
    certificationRatioMap.put(certId, ratio);
});
```
- `certificationCountMap.forEach()`: Map의 각 엔트리를 순회합니다
- `(certId, count)`: 자격증 ID와 취득 학생 수를 받아옵니다
- `ratio = count / totalUsers`: 취득 학생 수를 전체 학생 수로 나누어 비율을 계산합니다
- 예: 전체 100명 중 30명이 취득했다면 `ratio = 0.3` (30%)이 됩니다
- 계산된 비율을 `certificationRatioMap`에 저장합니다

**4단계: 정렬 및 필터링**
```java
List<Map.Entry<Long, Double>> sortedCertifications = certificationRatioMap.entrySet().stream()
    .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue())) // 비율 내림차순
    .collect(Collectors.toList());

final double MIN_RATIO = 0.1; // 최소 10% 이상
final int MAX_RECOMMENDATIONS = 3; // 최대 3개

List<Map.Entry<Long, Double>> recommendedCerts = sortedCertifications.stream()
    .filter(entry -> entry.getValue() >= MIN_RATIO) // 최소 10% 이상
    .limit(MAX_RECOMMENDATIONS) // 상위 3개
    .collect(Collectors.toList());
```
- `entrySet().stream()`: Map의 엔트리들을 Stream으로 변환합니다
- `sorted()`: 비율 값을 기준으로 내림차순 정렬합니다 (높은 비율이 먼저)
- `filter()`: 비율이 0.1(10%) 이상인 것만 필터링합니다
- `limit(3)`: 상위 3개만 선택합니다
- `collect(Collectors.toList())`: 최종 결과를 List로 수집합니다

---

**두 번째, 학습 세션 완료 시 XP 및 스트릭 업데이트 로직입니다:**

**1단계: XP 업데이트**
```java
User user = session.getUser();
user.setTotalXp(user.getTotalXp() + request.getXpEarned());
```
- `session.getUser()`: 현재 학습 세션의 사용자 객체를 가져옵니다
- `request.getXpEarned()`: 프론트엔드에서 계산된 획득 XP를 받아옵니다
- `user.getTotalXp()`: 사용자의 기존 총 XP를 가져옵니다
- `setTotalXp()`: 기존 XP에 획득한 XP를 더하여 새로운 총 XP를 설정합니다
- 예: 기존 1000XP에 80XP를 획득했다면 → 1080XP로 업데이트됩니다

**2단계: 스트릭 업데이트 (연속 학습일 체크)**
```java
LocalDateTime now = LocalDateTime.now();
if (user.getLastStudyDate() == null || 
    user.getLastStudyDate().toLocalDate().isBefore(now.toLocalDate())) {
    user.setStreak(user.getStreak() + 1);
}
user.setLastStudyDate(now);
```
- `LocalDateTime.now()`: 현재 날짜와 시간을 가져옵니다
- 조건문 설명:
  - `user.getLastStudyDate() == null`: 마지막 학습 날짜가 null이면 (첫 학습)
  - `user.getLastStudyDate().toLocalDate().isBefore(now.toLocalDate())`: 마지막 학습 날짜가 오늘보다 이전이면 (연속 학습)
- 조건이 참이면: `user.setStreak(user.getStreak() + 1)`로 스트릭을 1 증가시킵니다
- `user.setLastStudyDate(now)`: 마지막 학습 날짜를 오늘로 업데이트합니다
- 예: 어제 학습했고 오늘 다시 학습하면 → 스트릭이 1 증가하고, 오늘 날짜로 업데이트됩니다

**3단계: 데이터베이스 저장**
```java
userRepository.save(user);
session = learningSessionRepository.save(session);
```
- `userRepository.save(user)`: 업데이트된 사용자 정보를 데이터베이스에 저장합니다
- `learningSessionRepository.save(session)`: 학습 세션 상태를 COMPLETED로 업데이트하고 저장합니다
- `@Transactional` 어노테이션으로 두 작업이 모두 성공하거나 모두 실패하도록 보장합니다

이러한 로직들을 통해 사용자 경험을 향상시키고, 데이터의 정확성과 일관성을 보장합니다.

---

## [5단계] 마무리 및 기대 효과 (30초)

CertBuddy는 다음과 같은 기대 효과를 제공합니다:

1. **개인화된 학습 경험**: 학과 기반 추천으로 관련성 높은 자격증 발견
2. **효율적인 학습**: 간격 반복 알고리즘으로 장기 기억 강화
3. **지속적인 동기 부여**: 게이미피케이션을 통한 학습 습관 형성

앞으로 더 많은 자격증 데이터를 추가하고, 
친구 기능과 랭킹 시스템을 확장하여 사회적 학습 환경을 구축할 예정입니다.

감사합니다.

---

## [참고] 질문 대응 시나리오

### Q1: 다른 학습 앱과의 차별점은 무엇인가요?
**A:** 가장 큰 차별점은 **데이터 기반 추천 시스템**입니다. 단순히 인기 자격증을 보여주는 것이 아니라, 같은 학과 선배들의 실제 취득 데이터를 분석하여 개인화된 추천을 제공합니다. 또한 **간격 반복 복습 시스템**을 통해 학습 과학 원리를 적용하여 장기 기억 강화를 돕습니다.

### Q2: 추천 시스템의 정확도는 어떻게 보장하나요?
**A:** 최소 취득 비율 10% 이상의 자격증만 추천하도록 필터링하고, 상위 3개만 추천하여 관련성이 높은 자격증만 제공합니다. 또한 사용자 수가 충분하지 않은 경우 추천을 제공하지 않아 정확도를 보장합니다.

### Q3: 복습 시스템의 알고리즘은 어떻게 작동하나요?
**A:** 현재는 기본적인 간격 반복 알고리즘을 구현했습니다. 틀린 문제는 다음 날 복습하도록 설정되며, 향후 복습 횟수와 정답률에 따라 복습 간격을 동적으로 조정하는 고도화된 알고리즘을 추가할 예정입니다.

### Q4: 모바일 앱의 성능은 어떤가요?
**A:** React Native를 사용하여 네이티브 앱 수준의 성능을 제공하며, AsyncStorage를 활용한 로컬 캐싱으로 오프라인 환경에서도 기본 기능을 사용할 수 있습니다. 또한 백엔드 API는 트랜잭션 관리를 통해 데이터 일관성을 보장합니다.

### Q5: 향후 개발 계획은 무엇인가요?
**A:** 
1. 친구 기능 및 랭킹 시스템 확장
2. 복습 알고리즘 고도화 (SM-2 알고리즘 적용)
3. 더 많은 자격증 데이터 추가
4. 학습 통계 및 분석 기능
5. 소셜 기능 (함께 학습하기, 스터디 그룹)

---

## 발표 팁

1. **자연스러운 톤**: 너무 딱딱하지 않게, 대화하듯이 발표하세요
2. **데모 준비**: 실제 앱 화면을 보여주면 더욱 효과적입니다
3. **시간 관리**: 핵심 기능 3가지는 반드시 포함하고, 시간이 부족하면 기술 스택 부분을 간략히 설명하세요
4. **시각 자료**: 코드는 간단히 보여주고, 전체 흐름을 설명하는 것이 좋습니다
5. **질문 대비**: 위의 질문 대응 시나리오를 숙지하여 자신감 있게 답변하세요

