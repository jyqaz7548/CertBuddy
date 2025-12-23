// MockData에서 사용자 및 취득 자격증 데이터를 SQL로 변환하는 스크립트
const fs = require('fs');
const path = require('path');

// MockData에서 친구 데이터 (mockFriendsData)
const mockFriendsData = [
  {
    id: 1,
    name: '백OO',
    department: '정보통신과',
    grade: 2,
    certifications: [3, 2, 5], // 프로그래밍기능사, 전기기능사, 컴활1급
  },
  {
    id: 2,
    name: '이OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [3, 8], // 프로그래밍기능사, 정보기기운용기능사
  },
  {
    id: 3,
    name: '장OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [7, 8], // 전자기능사, 정보기기운용기능사
  },
  {
    id: 4,
    name: '이OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [7], // 전자기능사
  },
  {
    id: 5,
    name: '유OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [], // 자격증 없음
  },
  {
    id: 6,
    name: '김OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [], // 자격증 없음
  },
  {
    id: 7,
    name: '한OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [], // 자격증 없음
  },
  {
    id: 8,
    name: '최OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [3, 2], // 프로그래밍기능사, 전기기능사
  },
  {
    id: 9,
    name: '이OO',
    department: '설계과',
    grade: 2,
    certifications: [9, 11], // 전산응용기계제도기능사, 3D프린터운용기능사
  },
];

// MockData의 자격증 ID를 실제 자격증 이름으로 매핑
// mockTutorialCertifications 기준
const mockCertIdToName = {
  1: '자동화설비기능사',
  2: '전기기능사',
  3: '프로그래밍기능사',
  4: '전자기능사',
  5: '컴활1급',
  7: '프로그래밍기능사', // MockData 주석 기준: id: 3, 4의 certifications [7] 주석이 "프로그래밍기능사"
  8: '정보기기운용기능사',
  9: '전산응용기계제도기능사',
  11: '3D프린터운용기능사',
};

// 실제 DB의 자격증 이름을 ID로 변환하는 SQL 서브쿼리 사용
// INSERT 시 SELECT로 자격증 ID를 찾아서 사용

// 사용자 생성 SQL
function generateUsersSQL() {
  const sql = [];
  sql.push('-- MockData에서 생성된 사용자 데이터');
  sql.push('-- 주의: 이미 존재하는 사용자 ID와 충돌하지 않도록 확인하세요');
  sql.push('');
  
  let userId = 100; // 기존 사용자와 충돌하지 않도록 높은 ID 사용
  
  mockFriendsData.forEach((friend, index) => {
    const userCode = `CERT-${String(userId).padStart(4, '0')}`;
    const email = `friend${friend.id}@example.com`;
    const password = '$2a$10$dummy.hash.for.testing.purposes.only'; // 테스트용 해시
    
    sql.push(`INSERT INTO users (id, email, password, name, school, department, grade, total_xp, streak, user_code, created_at, updated_at) VALUES`);
    sql.push(`  (${userId}, '${email}', '${password}', '${friend.name}', '서울로봇고등학교', '${friend.department}', ${friend.grade}, 0, 0, '${userCode}', NOW(), NOW());`);
    sql.push('');
    
    userId++;
  });
  
  return sql.join('\n');
}

// 취득한 자격증 생성 SQL
function generateUserCertificationsSQL() {
  const sql = [];
  sql.push('-- MockData에서 생성된 취득 자격증 데이터');
  sql.push('-- 주의: users 테이블에 해당 사용자가 먼저 생성되어 있어야 합니다');
  sql.push('-- 주의: certifications 테이블에 해당 자격증이 존재해야 합니다');
  sql.push('');
  
  let userId = 100; // users SQL과 동일한 ID 시작점
  let userCertId = 1;
  
  mockFriendsData.forEach((friend) => {
    friend.certifications.forEach((certMockId) => {
      const certName = mockCertIdToName[certMockId];
      if (certName) {
        // 자격증 이름으로 ID를 찾아서 INSERT
        sql.push(`INSERT INTO user_certifications (id, user_id, certification_id, type, created_at, updated_at)`);
        sql.push(`SELECT ${userCertId}, ${userId}, c.id, 'ACQUIRED', NOW(), NOW()`);
        sql.push(`FROM certifications c`);
        sql.push(`WHERE c.name = '${certName}'`);
        sql.push(`LIMIT 1;`);
        sql.push('');
        userCertId++;
      }
    });
    userId++;
  });
  
  return sql.join('\n');
}

// SQL 파일 생성
const usersSQL = generateUsersSQL();
const userCertsSQL = generateUserCertificationsSQL();

const outputDir = path.join(__dirname, '..', 'sql');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'insert-mock-users.sql'),
  usersSQL,
  'utf8'
);

fs.writeFileSync(
  path.join(outputDir, 'insert-mock-user-certifications.sql'),
  userCertsSQL,
  'utf8'
);

console.log('✅ SQL 파일 생성 완료:');
console.log('  - sql/insert-mock-users.sql');
console.log('  - sql/insert-mock-user-certifications.sql');
console.log('');
console.log('⚠️  주의사항:');
console.log('  1. users 테이블에 이미 존재하는 ID와 충돌하지 않는지 확인하세요');
console.log('  2. certification_id가 실제 DB의 자격증 ID와 일치하는지 확인하세요');
console.log('  3. password는 테스트용 더미 해시입니다. 실제 사용 시 변경이 필요합니다');

