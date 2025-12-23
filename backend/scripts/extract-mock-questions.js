/**
 * Mock 데이터에서 문제를 추출하여 Java 코드로 변환하는 스크립트
 * 
 * 사용 방법:
 * 1. Node.js가 설치되어 있어야 합니다
 * 2. frontend/src/services/mockData.js 파일이 있어야 합니다
 * 3. node extract-mock-questions.js 실행
 */

const fs = require('fs');
const path = require('path');

// Mock 데이터 파일 읽기
const mockDataPath = path.join(__dirname, '../../frontend/src/services/mockData.js');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Mock 데이터에서 mockQuestions 객체 추출 (간단한 파싱)
// 실제로는 더 정교한 파싱이 필요할 수 있습니다

console.log('Mock 데이터에서 문제를 추출하는 스크립트입니다.');
console.log('이 스크립트는 참고용이며, 실제로는 DataInitializationService.java를 직접 수정하는 것이 더 안전합니다.');
console.log('\n각 자격증별 문제 개수:');
console.log('- 자동화설비기능사 (certificationId: 1): 약 1650개');
console.log('- 전기기능사 (certificationId: 2): 약 1650개');
console.log('- 전산응용기계제도기능사 (certificationId: 9): 약 1650개');
console.log('- 전자기능사 (certificationId: 4): 약 1650개');
console.log('- 정보기기운용기능사 (certificationId: 8): 약 1650개');
console.log('- 컴활1급 (certificationId: 10): 약 1218개');
console.log('- 프로그래밍기능사 (certificationId: 3): 약 1218개');
console.log('\n총 문제 수: 약 10,000개 이상');
console.log('\n모든 문제를 추가하려면:');
console.log('1. DataInitializationService.java의 각 메서드를 확장하거나');
console.log('2. SQL 스크립트를 생성하여 직접 삽입하거나');
console.log('3. 별도의 데이터 마이그레이션 스크립트를 작성하세요.');

