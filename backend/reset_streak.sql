-- 연속학습(streak)이 켜져있는 모든 사용자의 streak을 0으로 리셋
-- 사용법: MariaDB에 접속하여 이 쿼리를 실행하세요

USE certbuddy;

-- 1단계: 현재 streak이 0보다 큰 사용자 확인 (실행 전 확인용)
SELECT id, email, name, streak 
FROM users 
WHERE streak > 0;

-- 2단계: streak을 0으로 리셋
UPDATE users 
SET streak = 0 
WHERE streak > 0;

-- 3단계: 결과 확인 (모든 streak이 0이 되었는지 확인)
SELECT id, email, name, streak 
FROM users 
WHERE streak > 0;

