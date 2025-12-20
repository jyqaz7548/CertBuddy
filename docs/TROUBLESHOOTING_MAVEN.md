# Maven 문제 해결 가이드

## 문제: D드라이브 CMD에서 `mvn -v`가 작동하지 않는 경우

### 원인 분석

C드라이브에서는 `mvn -v`가 작동하지만 D드라이브에서는 작동하지 않는 경우, 다음과 같은 원인이 있을 수 있습니다:

1. **환경 변수 PATH가 제대로 로드되지 않음**
2. **다른 CMD 세션 사용**
3. **Maven이 특정 경로에만 설치됨**

### 해결 방법

#### 방법 1: PATH 환경 변수 확인

```cmd
echo %PATH%
```

Maven이 설치된 경로(예: `C:\Program Files\Apache\maven\bin`)가 PATH에 포함되어 있는지 확인하세요.

#### 방법 2: Maven 전체 경로로 실행

Maven이 설치된 전체 경로를 사용하여 실행:

```cmd
"C:\Program Files\Apache\maven\bin\mvn.cmd" -v
```

또는 일반적인 설치 위치:

```cmd
"C:\apache-maven-3.x.x\bin\mvn.cmd" -v
```

#### 방법 3: 환경 변수 새로고침

1. **새 CMD 창 열기**: 기존 CMD를 닫고 새로 열어보세요
2. **시스템 재부팅**: 환경 변수 변경 후 재부팅이 필요할 수 있습니다
3. **수동으로 PATH 설정**:
   ```cmd
   set PATH=%PATH%;C:\Program Files\Apache\maven\bin
   mvn -v
   ```

#### 방법 4: Maven 설치 위치 찾기

C드라이브에서 작동하는 CMD에서:

```cmd
where mvn
```

또는:

```cmd
where.exe mvn
```

이 명령어로 Maven의 전체 경로를 확인할 수 있습니다.

#### 방법 5: D드라이브에서도 작동하도록 설정

1. **시스템 환경 변수 확인**:
   - `Win + R` → `sysdm.cpl` 입력
   - "고급" 탭 → "환경 변수" 클릭
   - "시스템 변수"에서 `Path` 선택 → "편집"
   - Maven bin 경로가 있는지 확인

2. **사용자 환경 변수 확인**:
   - "사용자 변수"에서도 `Path` 확인

### 임시 해결책: 배치 파일 생성

Maven 경로를 하드코딩한 배치 파일을 만들어 사용:

**`backend/run-maven.bat`** 파일 생성:

```batch
@echo off
REM Maven 경로를 여기에 설정하세요
set MAVEN_HOME=C:\Program Files\Apache\maven
set PATH=%MAVEN_HOME%\bin;%PATH%

cd /d "%~dp0"
mvn spring-boot:run
```

### 영구 해결책: 환경 변수 설정

1. **Maven 설치 경로 확인** (C드라이브 CMD에서):
   ```cmd
   where mvn
   ```

2. **시스템 환경 변수에 추가**:
   - 위에서 확인한 경로의 `bin` 폴더를 PATH에 추가
   - 예: `C:\Program Files\Apache\maven\bin`

3. **새 CMD 창에서 테스트**:
   ```cmd
   D:
   cd D:\GitHub\CertBuddy\backend
   mvn -v
   ```

### 빠른 확인 명령어

```cmd
REM 현재 PATH 확인
echo %PATH% | findstr maven

REM Maven 찾기
where mvn

REM Java 확인 (Maven은 Java가 필요)
java -version
```
