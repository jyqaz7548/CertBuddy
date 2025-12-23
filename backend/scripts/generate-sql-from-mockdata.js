/**
 * Mock 데이터에서 SQL INSERT 문을 생성하는 스크립트
 * 
 * 사용 방법:
 * 1. Node.js가 설치되어 있어야 합니다
 * 2. 프로젝트 루트에서 실행: node backend/scripts/generate-sql-from-mockdata.js
 * 
 * 생성된 SQL 파일:
 * - backend/sql/insert-certifications.sql
 * - backend/sql/insert-questions.sql
 */

const fs = require('fs');
const path = require('path');

// Mock 데이터 파일 경로
const mockDataPath = path.join(__dirname, '../../frontend/src/services/mockData.js');
const outputDir = path.join(__dirname, '../sql');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Mock 데이터 파일 읽기 중...');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// 자격증 매핑
const certMapping = {
  1: '자동화설비기능사',
  2: '전기기능사',
  3: '프로그래밍기능사',
  4: '전자기능사',
  8: '정보기기운용기능사',
  9: '전산응용기계제도기능사',
  10: '컴활1급',
  11: '3D프린터운용기능사',
  12: '웹디자인개발기능사',
};

// SQL 이스케이프 함수
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''").replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

// JSON 배열을 SQL 문자열로 변환
function choicesToSql(choices) {
  if (!choices || !Array.isArray(choices) || choices.length === 0) return 'NULL';
  return escapeSql(JSON.stringify(choices));
}

// 여러 줄에 걸친 문자열 추출 (이스케이프 처리 포함)
function extractMultilineString(content, startIndex) {
  let i = startIndex;
  let str = '';
  let inString = false;
  let escapeNext = false;
  
  // 첫 번째 따옴표 찾기
  while (i < content.length && content[i] !== '"') {
    i++;
  }
  if (i >= content.length) return { str: '', endIndex: i };
  
  i++; // 따옴표 건너뛰기
  inString = true;
  
  while (i < content.length) {
    const char = content[i];
    
    if (escapeNext) {
      str += char;
      escapeNext = false;
      i++;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      str += char;
      i++;
      continue;
    }
    
    if (char === '"') {
      // 닫는 따옴표인지 확인 (다음 문자가 콜론이나 쉼표인지)
      let j = i + 1;
      while (j < content.length && (content[j] === ' ' || content[j] === '\t' || content[j] === '\n' || content[j] === '\r')) {
        j++;
      }
      if (j < content.length && (content[j] === ',' || content[j] === '}' || content[j] === ':')) {
        return { str, endIndex: j };
      }
    }
    
    str += char;
    i++;
  }
  
  return { str, endIndex: i };
}

// 문제 객체 파싱 (더 정교한 버전)
function parseQuestionObject(content, certId, certName) {
  try {
    const question = {
      certificationId: parseInt(certId),
      certificationName: certName,
    };
    
    // id 추출
    const idMatch = content.match(/id:\s*(\d+)/);
    if (idMatch) question.id = parseInt(idMatch[1]);
    
    // type 추출
    const typeMatch = content.match(/type:\s*"([^"]+)"/);
    if (typeMatch) question.type = typeMatch[1];
    
    // source 추출
    const sourceMatch = content.match(/source:\s*"([^"]+)"/);
    if (sourceMatch) question.source = sourceMatch[1];
    
    // question 추출 (여러 줄 가능)
    const questionStart = content.indexOf('question:');
    if (questionStart !== -1) {
      const questionResult = extractMultilineString(content, questionStart);
      question.question = questionResult.str;
    }
    
    // choices 배열 추출
    const choicesStart = content.indexOf('choices:');
    if (choicesStart !== -1) {
      const bracketStart = content.indexOf('[', choicesStart);
      if (bracketStart !== -1) {
        const choices = [];
        let i = bracketStart + 1;
        let depth = 1;
        let currentChoice = '';
        let inString = false;
        let escapeNext = false;
        
        while (i < content.length && depth > 0) {
          const char = content[i];
          
          if (escapeNext) {
            currentChoice += char;
            escapeNext = false;
            i++;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            currentChoice += char;
            i++;
            continue;
          }
          
          if (char === '"') {
            if (!inString) {
              inString = true;
              currentChoice = '';
            } else {
              // 닫는 따옴표
              choices.push(currentChoice);
              currentChoice = '';
              inString = false;
            }
            i++;
            continue;
          }
          
          if (inString) {
            currentChoice += char;
          } else if (char === '[') {
            depth++;
          } else if (char === ']') {
            depth--;
            if (depth === 0) break;
          }
          
          i++;
        }
        question.choices = choices;
      }
    }
    
    // answer 추출
    const answerMatch = content.match(/answer:\s*"([^"]+)"/);
    if (answerMatch) question.answer = answerMatch[1];
    
    // explanation 추출 (여러 줄 가능)
    const explanationStart = content.indexOf('explanation:');
    if (explanationStart !== -1) {
      const explanationResult = extractMultilineString(content, explanationStart);
      question.explanation = explanationResult.str;
    }
    
    // examInfo 추출
    const examInfoStart = content.indexOf('examInfo:');
    if (examInfoStart !== -1) {
      const yearMatch = content.substring(examInfoStart).match(/year:\s*(null|\d+)/);
      if (yearMatch) {
        question.examYear = yearMatch[1] === 'null' ? null : parseInt(yearMatch[1]);
      }
      
      const roundMatch = content.substring(examInfoStart).match(/round:\s*(null|"([^"]+)")/);
      if (roundMatch) {
        question.examRound = roundMatch[1] === 'null' ? null : roundMatch[2];
      }
    }
    
    return question.question ? question : null;
  } catch (error) {
    console.error('문제 파싱 오류:', error.message);
    return null;
  }
}

// Mock 데이터에서 모든 문제 추출
function extractAllQuestions() {
  console.log('문제 데이터 추출 중...');
  
  const questions = [];
  const lines = mockDataContent.split('\n');
  
  // 각 자격증별 문제 블록 찾기
  for (const [certId, certName] of Object.entries(certMapping)) {
    console.log(`  - ${certName} (ID: ${certId}) 추출 중...`);
    
    // 자격증 블록 시작 찾기 (예: "1: [ // 자동화설비기능사")
    const certPattern = new RegExp(`${certId}:\\s*\\[\\s*//\\s*${certName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    let certBlockStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (certPattern.test(lines[i])) {
        certBlockStart = i;
        break;
      }
    }
    
    if (certBlockStart === -1) {
      console.log(`    ⚠️  ${certName} 블록을 찾을 수 없습니다.`);
      continue;
    }
    
    // 해당 자격증의 모든 문제 추출
    let braceDepth = 0;
    let inQuestion = false;
    let questionStart = -1;
    let questionContent = '';
    let questionCount = 0;
    
    for (let i = certBlockStart; i < lines.length; i++) {
      const line = lines[i];
      
      // 자격증 블록 종료 확인 (다음 자격증 블록 시작)
      const nextCertPattern = /^\s*\d+:\s*\[\s*\/\//;
      if (i > certBlockStart && nextCertPattern.test(line)) {
        break;
      }
      
      // 문제 객체 시작 찾기
      if (line.trim().startsWith('{') && !inQuestion) {
        inQuestion = true;
        questionStart = i;
        questionContent = line;
        braceDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        continue;
      }
      
      // 문제 객체 내부
      if (inQuestion) {
        questionContent += '\n' + line;
        braceDepth += (line.match(/\{/g) || []).length;
        braceDepth -= (line.match(/\}/g) || []).length;
        
        // 문제 객체 종료
        if (braceDepth === 0) {
          const question = parseQuestionObject(questionContent, certId, certName);
          if (question) {
            questions.push(question);
            questionCount++;
          }
          inQuestion = false;
          questionContent = '';
        }
      }
    }
    
    console.log(`    ✅ ${questionCount}개 문제 추출 완료`);
  }
  
  return questions;
}

// SQL 생성
function generateSQL(questions) {
  console.log('\nSQL 파일 생성 중...');
  
  // 1. 자격증 INSERT 문 생성
  const certSql = [];
  certSql.push('-- ============================================');
  certSql.push('-- 자격증 데이터 삽입');
  certSql.push('-- ============================================');
  certSql.push('-- 주의: 이미 데이터가 있으면 중복 삽입될 수 있습니다.');
  certSql.push('-- 중복 방지를 위해 먼저 기존 데이터를 확인하세요:');
  certSql.push('-- SELECT * FROM certifications;');
  certSql.push('');
  
  const certDescriptions = {
    '자동화설비기능사': '자동화설비 관련 자격증',
    '전기기능사': '전기 관련 자격증',
    '프로그래밍기능사': '프로그래밍 관련 자격증',
    '전자기능사': '전자 관련 자격증',
    '컴활1급': '컴퓨터활용능력 1급',
    '전산응용기계제도기능사': '전산응용기계제도 관련 자격증',
    '3D프린터운용기능사': '3D프린터 운용 관련 자격증',
    '정보기기운용기능사': '정보기기 운용 관련 자격증',
    '웹디자인개발기능사': '웹디자인 개발 관련 자격증',
  };
  
  certSql.push('-- 기존 데이터 삭제 (선택사항)');
  certSql.push('-- DELETE FROM certifications;');
  certSql.push('');
  certSql.push('INSERT INTO certifications (name, description, created_at) VALUES');
  const certValues = [];
  for (const [id, name] of Object.entries(certMapping)) {
    if (id !== '13' && id !== '14') { // '기타', '없음' 제외
      certValues.push(`  (${escapeSql(name)}, ${escapeSql(certDescriptions[name] || '')}, NOW())`);
    }
  }
  certSql.push(certValues.join(',\n') + ';');
  certSql.push('');
  certSql.push('-- 자격증 ID 매핑 확인');
  certSql.push('SELECT id, name FROM certifications ORDER BY id;');
  
  // 2. 문제 INSERT 문 생성
  const questionSql = [];
  questionSql.push('-- ============================================');
  questionSql.push('-- 문제 데이터 삽입');
  questionSql.push('-- ============================================');
  questionSql.push('-- 주의: certification_id는 위에서 삽입한 자격증의 실제 ID를 사용합니다.');
  questionSql.push('-- 먼저 자격증을 삽입한 후, 이 스크립트를 실행하세요.');
  questionSql.push('');
  
  // 자격증별로 그룹화
  const questionsByCert = {};
  questions.forEach(q => {
    if (!questionsByCert[q.certificationName]) {
      questionsByCert[q.certificationName] = [];
    }
    questionsByCert[q.certificationName].push(q);
  });
  
  // 전체 문제 개수 확인
  let totalQuestions = 0;
  for (const [certName, certQuestions] of Object.entries(questionsByCert)) {
    totalQuestions += certQuestions.length;
  }
  
  questionSql.push(`-- 총 ${totalQuestions}개의 문제가 포함되어 있습니다.`);
  questionSql.push('');
  
  // 배치 크기 설정 (한 번에 너무 많은 INSERT 방지)
  const BATCH_SIZE = 100;
  
  for (const [certName, certQuestions] of Object.entries(questionsByCert)) {
    questionSql.push(`-- ============================================`);
    questionSql.push(`-- ${certName} 문제 (${certQuestions.length}개)`);
    questionSql.push(`-- ============================================`);
    questionSql.push('');
    
    // 배치로 나누어 삽입
    for (let batchStart = 0; batchStart < certQuestions.length; batchStart += BATCH_SIZE) {
      const batch = certQuestions.slice(batchStart, batchStart + BATCH_SIZE);
      const batchEnd = Math.min(batchStart + BATCH_SIZE, certQuestions.length);
      
      questionSql.push(`-- ${batchStart + 1}번째 ~ ${batchEnd}번째 문제`);
      questionSql.push('INSERT INTO questions (certification_id, type, source, question, choices, answer, explanation, exam_year, exam_round, created_at) VALUES');
      
      const questionValues = [];
      batch.forEach((q) => {
        const values = [
          `(SELECT id FROM certifications WHERE name = ${escapeSql(certName)})`, // certification_id
          escapeSql(q.type || 'BLANK'),
          escapeSql(q.source || 'AI_GENERATED'),
          escapeSql(q.question || ''),
          choicesToSql(q.choices),
          escapeSql(q.answer || ''),
          escapeSql(q.explanation || ''),
          q.examYear ? q.examYear : 'NULL',
          q.examRound ? escapeSql(q.examRound) : 'NULL',
          'NOW()'
        ];
        questionValues.push(`  (${values.join(', ')})`);
      });
      
      questionSql.push(questionValues.join(',\n') + ';');
      questionSql.push('');
    }
  }
  
  // 파일 저장
  fs.writeFileSync(path.join(outputDir, 'insert-certifications.sql'), certSql.join('\n'), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'insert-questions.sql'), questionSql.join('\n'), 'utf8');
  
  console.log(`✅ SQL 파일 생성 완료:`);
  console.log(`   - ${path.join(outputDir, 'insert-certifications.sql')}`);
  console.log(`   - ${path.join(outputDir, 'insert-questions.sql')}`);
  console.log(`\n📊 통계:`);
  console.log(`   - 자격증: ${Object.keys(certMapping).filter(id => id !== '13' && id !== '14').length}개`);
  console.log(`   - 문제: ${totalQuestions}개`);
  
  // 자격증별 문제 개수 출력
  console.log(`\n📋 자격증별 문제 개수:`);
  for (const [certName, certQuestions] of Object.entries(questionsByCert)) {
    console.log(`   - ${certName}: ${certQuestions.length}개`);
  }
}

// 실행
try {
  console.log('='.repeat(60));
  console.log('Mock 데이터에서 SQL 생성 스크립트');
  console.log('='.repeat(60));
  console.log('');
  
  const questions = extractAllQuestions();
  
  if (questions.length === 0) {
    console.error('❌ 문제 데이터를 찾을 수 없습니다.');
    console.log('\n대안:');
    console.log('1. mockData.js 파일 경로를 확인하세요');
    console.log('2. mockQuestions 객체의 구조를 확인하세요');
    console.log('3. 또는 수동으로 데이터를 추가하세요');
    process.exit(1);
  }
  
  generateSQL(questions);
  
  console.log('\n✅ 완료!');
  console.log('\n📝 다음 단계:');
  console.log('1. 데이터베이스에 연결 (MariaDB)');
  console.log('2. backend/sql/insert-certifications.sql 실행');
  console.log('3. backend/sql/insert-questions.sql 실행');
  console.log('\n💡 팁:');
  console.log('- SQL 파일이 크면 배치로 나누어 실행하세요');
  console.log('- 실행 전에 데이터베이스 백업을 권장합니다');
  
} catch (error) {
  console.error('❌ 오류 발생:', error);
  console.error(error.stack);
  process.exit(1);
}
