@echo off
echo JWT Secret Key 생성 중...
echo.

cd backend
mvn exec:java -Dexec.mainClass="com.certbuddy.util.JwtSecretGenerator" -Dexec.classpathScope=compile

pause

