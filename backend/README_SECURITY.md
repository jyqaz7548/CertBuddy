# 보안 가이드

## ⚠️ 중요: 민감한 정보 보호

이 프로젝트의 `application.properties` 파일은 **절대 Git에 커밋하면 안 됩니다!**

### 왜 안 되나요?

`application.properties` 파일에는 다음과 같은 민감한 정보가 포함됩니다:
- 데이터베이스 비밀번호
- JWT 시크릿 키
- 기타 API 키 및 인증 정보

이런 정보가 공개 저장소에 노출되면:
- 데이터베이스가 해킹당할 수 있습니다
- JWT 토큰이 위조될 수 있습니다
- 전체 시스템이 위험에 노출됩니다

### 올바른 사용 방법

1. **예시 파일 복사:**
   ```bash
   # Windows
   copy src\main\resources\application.properties.example src\main\resources\application.properties
   
   # Mac/Linux
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

2. **실제 값으로 수정:**
   - `application.properties` 파일을 열어서
   - 데이터베이스 비밀번호와 JWT 시크릿 키를 실제 값으로 변경

3. **Git 상태 확인:**
   ```bash
   git status
   ```
   `application.properties` 파일이 목록에 나타나지 않아야 합니다.

### .gitignore 확인

프로젝트 루트의 `.gitignore` 파일에 다음이 포함되어 있는지 확인하세요:

```
backend/src/main/resources/application.properties
backend/src/main/resources/application-dev.properties
```

### 이미 커밋했다면?

만약 실수로 `application.properties`를 커밋했다면:

1. **즉시 비밀번호와 키 변경:**
   - 데이터베이스 비밀번호 변경
   - JWT 시크릿 키 재생성
   - 모든 사용자 토큰 무효화

2. **Git 히스토리에서 제거:**
   ```bash
   git rm --cached backend/src/main/resources/application.properties
   git commit -m "Remove application.properties from tracking"
   ```

3. **강제 푸시 (주의!):**
   ```bash
   git push --force
   ```
   ⚠️ 팀과 협의 후 진행하세요!

### 예시 파일 사용

- `application.properties.example` - 예시 파일 (Git에 커밋됨)
- `application-dev.properties.example` - 개발 환경 예시 파일

이 파일들은 실제 비밀번호 없이 템플릿만 제공합니다.

### 환경 변수 사용 (선택사항)

더 안전한 방법으로 환경 변수를 사용할 수도 있습니다:

```properties
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

환경 변수 설정:
```bash
# Windows
set DB_PASSWORD=your_password
set JWT_SECRET=your_jwt_secret

# Mac/Linux
export DB_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret
```

### 프로덕션 환경

프로덕션 환경에서는:
- 환경 변수 사용
- 시크릿 관리 서비스 사용 (AWS Secrets Manager, Azure Key Vault 등)
- CI/CD 파이프라인에서 자동으로 주입

---

**기억하세요: 보안은 개발의 첫 번째 우선순위입니다!**

