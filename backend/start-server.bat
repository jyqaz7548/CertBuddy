@echo off
chcp 65001 >nul
echo ========================================
echo CertBuddy Backend Server 시작
echo ========================================
echo.

cd /d "%~dp0"

REM Maven Wrapper 파일 확인
if not exist "mvnw.cmd" (
    echo [오류] mvnw.cmd 파일을 찾을 수 없습니다.
    echo.
    echo 해결 방법:
    echo 1. Maven을 설치하세요: https://maven.apache.org/download.cgi
    echo 2. 또는 IDE(IntelliJ IDEA/Eclipse)에서 실행하세요
    echo.
    pause
    exit /b 1
)

echo Maven Wrapper를 사용하여 서버를 시작합니다...
echo.

call mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo ========================================
    echo [오류] 서버 시작 실패
    echo ========================================
    echo.
    echo 확인 사항:
    echo 1. Java 17 이상이 설치되어 있는지 확인 (java -version)
    echo 2. MySQL이 실행 중인지 확인
    echo 3. application.properties의 데이터베이스 설정 확인
    echo.
    pause
    exit /b 1
)
