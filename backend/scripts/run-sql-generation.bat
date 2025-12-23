@echo off
echo ============================================
echo Mock 데이터에서 SQL 생성 스크립트 실행
echo ============================================
echo.

cd /d %~dp0\..
node backend\scripts\generate-sql-from-mockdata.js

pause

