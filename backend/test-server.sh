#!/bin/bash

echo "========================================"
echo "CertBuddy 백엔드 서버 테스트"
echo "========================================"
echo ""

echo "[1/4] 서버 연결 확인 중..."
if curl -s http://localhost:8080/api/auth/login > /dev/null 2>&1; then
    echo "✓ 서버가 실행 중입니다!"
else
    echo "✗ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요."
    exit 1
fi

echo ""
echo "[2/4] 회원가입 테스트 중..."
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name":"테스트 사용자","school":"테스트 학교","department":"테스트 학과","grade":1}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "[3/4] 로그인 테스트 중..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "[4/4] 테스트 완료!"
echo ""
echo "========================================"
echo "테스트 결과:"
echo "- 서버가 정상적으로 응답하면 성공입니다"
echo "- HTTP Status: 200 또는 400이면 정상 작동 중입니다"
echo "========================================"

