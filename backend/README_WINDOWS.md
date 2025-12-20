# Windows에서 백엔드 서버 실행하기

## 문제: `dir mvnw*`로 파일을 찾을 수 없는 경우

### 해결 방법 1: Maven 설치 (권장)

1. Maven 다운로드: https://maven.apache.org/download.cgi
2. 압축 해제 후 `C:\Program Files\Apache\maven` 같은 경로에 설치
3. 환경 변수 설정:
   - 시스템 속성 → 고급 → 환경 변수
   - `PATH`에 `C:\Program Files\Apache\maven\bin` 추가
4. 새 CMD 창을 열고 확인:
   ```cmd
   mvn -v
   ```
5. 서버 실행:
   ```cmd
   cd backend
   mvn spring-boot:run
   ```

### 해결 방법 2: IDE에서 실행 (가장 쉬움)

#### IntelliJ IDEA
1. 프로젝트를 IntelliJ IDEA에서 엽니다
2. `backend/src/main/java/com/certbuddy/CertBuddyApplication.java` 파일을 엽니다
3. `main` 메서드 옆의 실행 버튼(▶)을 클릭합니다

#### Eclipse
1. 프로젝트를 Eclipse에서 엽니다
2. `backend/src/main/java/com/certbuddy/CertBuddyApplication.java` 파일을 엽니다
3. 우클릭 → `Run As` → `Java Application`

### 해결 방법 3: Maven Wrapper 수동 생성

Maven이 설치되어 있다면:

```cmd
cd backend
mvn wrapper:wrapper
```

그 다음:
```cmd
.\mvnw.cmd spring-boot:run
```

### 해결 방법 4: start-server.bat 사용

`backend` 폴더에 `start-server.bat` 파일이 있다면:

```cmd
cd backend
start-server.bat
```

## Maven이 PATH에 없는 경우

이전에 `mvn -v`가 작동했다면, Maven이 설치되어 있지만 현재 터미널 세션의 PATH에 없을 수 있습니다.

**해결책:**
1. 새 CMD 창을 열어보세요
2. 또는 Maven이 설치된 전체 경로를 사용:
   ```cmd
   "C:\Program Files\Apache\maven\bin\mvn.cmd" spring-boot:run
   ```

## 빠른 확인

```cmd
REM Java 확인
java -version

REM Maven 확인 (설치된 경우)
where mvn

REM Maven Wrapper 확인
cd backend
dir mvnw*
```
