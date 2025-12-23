-- MockData에서 생성된 취득 자격증 데이터
-- 주의: users 테이블에 해당 사용자가 먼저 생성되어 있어야 합니다
-- 주의: certifications 테이블에 해당 자격증이 존재해야 합니다

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 1, 100, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '프로그래밍기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 2, 100, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '전기기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 3, 100, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '컴활1급'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 4, 101, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '프로그래밍기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 5, 101, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '정보기기운용기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 6, 102, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '프로그래밍기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 7, 102, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '정보기기운용기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 8, 103, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '프로그래밍기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 9, 107, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '프로그래밍기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 10, 107, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '전기기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 11, 108, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '전산응용기계제도기능사'
LIMIT 1;

INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)
SELECT 12, 108, c.id, 'ACQUIRED', NOW(), NOW()
FROM certifications c
WHERE c.name = '3D프린터운용기능사'
LIMIT 1;
