# Mock 데이터 마이그레이션 가이드

Mock 데이터에 있는 자격증과 문제 데이터를 데이터베이스로 옮기는 방법입니다.

## 방법 1: SQL 스크립트 자동 생성 (권장) ⭐

Mock 데이터에서 자동으로 SQL INSERT 문을 생성하는 방법입니다.

### 준비

1. **Node.js 설치 확인:**
   ```bash
   node --version
   ```

2. **SQL 생성 스크립트 실행:**
   
   **Windows:**
   ```bash
   backend\scripts\run-sql-generation.bat
   ```
   
   **Linux/Mac:**
   ```bash
   chmod +x backend/scripts/run-sql-generation.sh
   ./backend/scripts/run-sql-generation.sh
   ```
   
   **또는 직접 실행:**
   ```bash
   node backend/scripts/generate-sql-from-mockdata.js
   ```

3. **생성된 SQL 파일 확인:**
   - `backend/sql/insert-certifications.sql` - 자격증 데이터
   - `backend/sql/insert-questions.sql` - 문제 데이터

### 데이터베이스에 삽입

1. **데이터베이스 연결:**
   ```bash
   mysql -u root -p certbuddy
   ```

2. **자격증 데이터 삽입:**
   ```sql
   source backend/sql/insert-certifications.sql;
   ```

3. **문제 데이터 삽입:**
   ```sql
   source backend/sql/insert-questions.sql;
   ```

4. **데이터 확인:**
   ```sql
   SELECT COUNT(*) FROM certifications;
   SELECT COUNT(*) FROM questions;
   SELECT c.name, COUNT(q.id) as question_count
   FROM certifications c
   LEFT JOIN questions q ON c.id = q.certification_id
   GROUP BY c.id, c.name;
   ```

### 주의사항

- SQL 파일이 매우 클 수 있습니다 (10,000개 이상의 문제)
- 배치로 나누어 실행되므로 순차적으로 실행하세요
- 실행 전에 데이터베이스 백업을 권장합니다

## 방법 2: 자동 초기화 (기본 데이터만)

애플리케이션 시작 시 자동으로 데이터를 삽입합니다.

### 설정

`backend/src/main/resources/application.properties`에 다음 설정이 이미 포함되어 있습니다:

```properties
spring.jpa.hibernate.ddl-auto=update
```

이 설정으로 인해 서버 실행 시 자동으로 테이블이 생성되고, `DataInitializationService`가 데이터가 없을 때 자동으로 초기 데이터를 삽입합니다.

### 실행

1. **데이터베이스가 비어있는 상태에서 서버 실행:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **로그 확인:**
   ```
   초기 데이터 삽입 시작...
   자격증 데이터 삽입 완료
   문제 데이터 삽입 시작...
   문제 데이터 삽입 완료
   ```

3. **데이터 확인:**
   ```sql
   SELECT * FROM certifications;
   SELECT COUNT(*) FROM questions;
   ```

## 방법 3: SQL 스크립트로 직접 삽입

### 자격증 데이터 삽입

```sql
-- 자격증 데이터 삽입
INSERT INTO certifications (name, description, created_at) VALUES
('자동화설비기능사', '자동화설비 관련 자격증', NOW()),
('전기기능사', '전기 관련 자격증', NOW()),
('프로그래밍기능사', '프로그래밍 관련 자격증', NOW()),
('전자기능사', '전자 관련 자격증', NOW()),
('컴활1급', '컴퓨터활용능력 1급', NOW()),
('전산응용기계제도기능사', '전산응용기계제도 관련 자격증', NOW()),
('3D프린터운용기능사', '3D프린터 운용 관련 자격증', NOW()),
('정보기기운용기능사', '정보기기 운용 관련 자격증', NOW()),
('웹디자인개발기능사', '웹디자인 개발 관련 자격증', NOW());
```

### 문제 데이터 삽입 예시

```sql
-- 자동화설비기능사 문제 예시
-- 먼저 자격증 ID 확인
SELECT id FROM certifications WHERE name = '자동화설비기능사';

-- 문제 삽입 (certification_id는 위에서 확인한 ID로 변경)
INSERT INTO questions (certification_id, type, source, question, choices, answer, explanation, created_at) VALUES
(1, 'OX', 'AI_GENERATED', '선반 작업 시 발생한 칩(Chip)은 기계가 작동 중일 때 손으로 즉시 제거해야 안전하다.', 
 '["O", "X"]', 'X', 
 '칩은 매우 날카롭고 뜨거우며, 회전하는 기계에 손이 말려들어갈 위험이 있으므로 반드시 기계를 정지시킨 후 브러시나 갈고리 등을 사용하여 제거해야 합니다.', 
 NOW()),
(1, 'BLANK', 'AI_GENERATED', 'CNC 선반 프로그래밍에서 공구를 급속 이송(위치 결정)시킬 때 사용하는 G 코드는 무엇인가?',
 '["G00", "G01", "G02", "G03"]', 'G00',
 'G00은 급속 위치 결정(급송), G01은 직선 보간(절삭 이송), G02는 시계 방향 원호 보간, G03은 반시계 방향 원호 보간입니다.',
 NOW());
```

## 방법 4: Mock 데이터에서 전체 추출 (고급)

Mock 데이터 파일에서 모든 문제를 추출하여 SQL 스크립트를 생성하는 방법입니다.

### 스크립트 생성

`backend/scripts/extract-mock-data.js` 파일을 생성하여 Mock 데이터를 SQL로 변환할 수 있습니다.

하지만 가장 간단한 방법은 **방법 1 (자동 초기화)**을 사용하는 것입니다.

## Mock 데이터 구조

### 자격증 (9개)
1. 자동화설비기능사 (certificationId: 1)
2. 전기기능사 (certificationId: 2)
3. 프로그래밍기능사 (certificationId: 3)
4. 전자기능사 (certificationId: 4)
5. 정보기기운용기능사 (certificationId: 8)
6. 전산응용기계제도기능사 (certificationId: 9)
7. 컴활1급 (certificationId: 10)
8. 3D프린터운용기능사 (certificationId: 11)
9. 웹디자인개발기능사 (certificationId: 12)

### 문제 데이터
- 각 자격증별로 약 1,000개 이상의 문제가 포함되어 있습니다
- 총 약 10,000개 이상의 문제 데이터
- OX 문제와 빈칸 채우기(BLANK) 문제 포함
- AI 생성 문제와 실제 CBT 문제 포함

## 확인 방법

### 데이터베이스에서 확인

```sql
-- 자격증 개수 확인
SELECT COUNT(*) FROM certifications;

-- 문제 개수 확인
SELECT COUNT(*) FROM questions;

-- 자격증별 문제 개수 확인
SELECT c.name, COUNT(q.id) as question_count
FROM certifications c
LEFT JOIN questions q ON c.id = q.certification_id
GROUP BY c.id, c.name;
```

### API로 확인

```bash
# 문제가 있는 자격증 목록 조회
curl http://localhost:8080/api/questions/certifications

# 특정 자격증의 문제 목록 조회
curl http://localhost:8080/api/questions?certificationId=1
```

## 주의사항

1. **중복 삽입 방지**: `DataInitializationService`는 데이터가 없을 때만 삽입합니다.
2. **데이터 수정**: 초기 데이터를 수정하려면 `DataInitializationService.java` 파일을 수정하세요.
3. **전체 Mock 데이터 추가**: Mock 데이터의 모든 문제를 추가하려면 각 메서드를 확장해야 합니다.

## 다음 단계

초기 데이터가 삽입되면:
1. ✅ 앱에서 자격증 목록이 표시되는지 확인
2. ✅ 문제 학습이 정상 작동하는지 확인
3. ✅ 데이터베이스에 데이터가 저장되는지 확인

---

**추가 문제 데이터가 필요하면:**
- `DataInitializationService.java`의 각 메서드에 문제를 추가하세요
- 또는 SQL 스크립트로 직접 삽입하세요

