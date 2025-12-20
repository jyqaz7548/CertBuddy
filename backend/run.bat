@echo off
echo Starting CertBuddy Backend Server...
echo.

REM Check if mvnw.cmd exists
if exist "mvnw.cmd" (
    echo Using Maven Wrapper...
    call mvnw.cmd spring-boot:run
) else if exist ".\mvnw.cmd" (
    echo Using Maven Wrapper (with path)...
    call .\mvnw.cmd spring-boot:run
) else (
    echo Maven Wrapper not found. Trying to use system Maven...
    mvn spring-boot:run
)

if errorlevel 1 (
    echo.
    echo ============================================
    echo Error: Failed to start the server
    echo ============================================
    echo.
    echo Please check:
    echo 1. Java is installed (java -version)
    echo 2. Maven is installed and in PATH (mvn -v)
    echo 3. MySQL is running
    echo 4. Database connection settings in application.properties
    echo.
    pause
)
