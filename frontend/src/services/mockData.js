// Mock 데이터 - 프론트엔드 개발용
// 백엔드가 준비되면 이 파일을 삭제하고 실제 API를 사용합니다

import AsyncStorage from '@react-native-async-storage/async-storage';

// 사용자 고유 코드 생성 함수 (예: CERT-1234)
const generateUserCode = (userId) => {
  // 4자리 숫자로 변환 (예: 1 -> 0001, 123 -> 0123)
  const paddedId = String(userId).padStart(4, '0');
  return `CERT-${paddedId}`;
};

// Mock 사용자 데이터
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    name: '테스트 사용자',
    school: '테스트대학교',
    department: '컴퓨터공학과',
    grade: 3,
    totalXp: 1250,
    streak: 7,
    userCode: 'CERT-0001', // 고유 코드
  },
  // 친구 데이터에 사용될 사용자들 (mockFriendsData 기반)
  {
    id: 2,
    email: 'friend1@example.com',
    name: '이OO',
    school: '테스트대학교',
    department: '로봇소프트웨어과',
    grade: 2,
    totalXp: 850,
    streak: 5,
    userCode: 'CERT-0002',
  },
  {
    id: 3,
    email: 'friend2@example.com',
    name: '장OO',
    school: '테스트대학교',
    department: '로봇소프트웨어과',
    grade: 2,
    totalXp: 1200,
    streak: 10,
    userCode: 'CERT-0003',
  },
  {
    id: 4,
    email: 'friend3@example.com',
    name: '최OO',
    school: '테스트대학교',
    department: '로봇소프트웨어과',
    grade: 2,
    totalXp: 950,
    streak: 8,
    userCode: 'CERT-0004',
  },
];

// Mock 자격증 데이터 (추천 자격증 기능용)
// 현재는 빈 배열로 설정되어 있음. 나중에 기업 기반 선배 자격증 데이터로 채울 예정
const mockCertifications = [];

// 튜토리얼용 기업 목록
const mockCompanies = [
  { id: 1, name: '세메스' },
  { id: 2, name: 'LH 공사' },
  { id: 3, name: 'AD 테크놀로지' },
  { id: 4, name: '한국항공우주산업' },
  { id: 5, name: '에이로봇' },
  { id: 6, name: '모르겠습니다' },
];

// 튜토리얼용 자격증 목록 (취득한 자격증, 취득하고 싶은 자격증)
const mockTutorialCertifications = [
  { id: 2, name: '전기기능사' },
  { id: 4, name: '전자기능사' },
  { id: 9, name: '전산응용기계제도기능사' },
  { id: 1, name: '자동화설비기능사' },
  { id: 10, name: '컴활1급' },
  { id: 3, name: '프로그래밍기능사' },
  { id: 11, name: '3D프린터운용기능사' },
  { id: 12, name: '웹디자인개발기능사' },
  { id: 8, name: '정보기기운용기능사' },
  { id: 13, name: '기타' },
  { id: 14, name: '없음' },
];

// 이름 모자이크 처리 함수 (성만 보이고 나머지는 OO로 표시)
const maskName = (fullName) => {
  if (!fullName || fullName.length === 0) return '';
  if (fullName.length === 1) return fullName;
  if (fullName.length === 2) return fullName.charAt(0) + 'O';
  return fullName.charAt(0) + 'O'.repeat(fullName.length - 1);
};

// 실제 친구 데이터 (같은 학과 기반 추천용)
const mockFriendsData = [
  {
    id: 1,
    name: '백OO',
    department: '정보통신과',
    grade: 2,
    certifications: [3, 2, 5], // 프로그래밍기능사, 전기기능사, 컴활
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
    certifications: [7, 8], // 프로그래밍기능사, 정보기기운용기능사
  },
  {
    id: 4,
    name: '이OO',
    department: '로봇소프트웨어과',
    grade: 2,
    certifications: [7], // 프로그래밍기능사
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

// 친구 데이터를 기반으로 실제 통계 계산 함수
const calculateDepartmentStats = () => {
  const stats = {};
  
  // 친구 데이터를 학과별, 학년별로 그룹화
  const deptGroups = {};
  mockFriendsData.forEach(friend => {
    const key = `${friend.department}_${friend.grade}`;
    if (!deptGroups[key]) {
      deptGroups[key] = {
        department: friend.department,
        grade: friend.grade,
        friends: [],
      };
    }
    deptGroups[key].friends.push(friend);
  });
  
  // 각 그룹별로 통계 계산
  Object.values(deptGroups).forEach(group => {
    const { department, grade, friends } = group;
    const totalFriends = friends.length;
    
    // 각 친구별로 보유한 자격증 이름 목록 (같은 이름은 하나로 통합)
    const friendCertNames = {};
    friends.forEach(friend => {
      friendCertNames[friend.id] = new Set();
      friend.certifications.forEach(certId => {
        const certInfo = mockTutorialCertifications.find(c => c.id === certId);
        if (certInfo) {
          friendCertNames[friend.id].add(certInfo.name);
        }
      });
    });
    
    // 자격증 이름별로 몇 명이 가지고 있는지 카운트
    const certCountsByName = {};
    Object.values(friendCertNames).forEach(certNames => {
      certNames.forEach(certName => {
        if (!certCountsByName[certName]) {
          certCountsByName[certName] = 0;
        }
        certCountsByName[certName]++;
      });
    });
    
    // 퍼센테이지 계산 (이름 기준으로 통합)
    const gradeStats = [];
    const processedNames = new Set(); // 이미 처리한 이름 추적
    Object.keys(certCountsByName).forEach(certName => {
      // 같은 이름이 이미 처리되었으면 스킵
      if (processedNames.has(certName)) {
        return;
      }
      
      const count = certCountsByName[certName];
      const percentage = Math.round((count / totalFriends) * 100);
      // 가장 작은 ID를 대표 ID로 사용 (일관성 유지)
      const certInfo = mockTutorialCertifications.find(c => c.name === certName);
      if (certInfo) {
        gradeStats.push({
          certificationId: certInfo.id,
          name: certName,
          percentage: percentage,
        });
        processedNames.add(certName);
      }
    });
    
    // 퍼센테이지 순으로 정렬
    gradeStats.sort((a, b) => b.percentage - a.percentage);
    
    // stats에 저장
    if (!stats[department]) {
      stats[department] = {};
    }
    stats[department][grade] = gradeStats;
  });
  
  return stats;
};

// 학과별 자격증 선택 통계 (친구 데이터 기반으로 실제 계산)
// 실제로는 서버에서 같은 학과+학년 사용자들의 선택 데이터를 집계
const mockDepartmentCertStats = {
  // 친구 데이터가 없는 학과는 기본값 유지
  '로봇설계과': {
    1: [
      { certificationId: 1, name: '자동화설비기능사', percentage: 45 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 15 },
    ],
    2: [
      { certificationId: 1, name: '자동화설비기능사', percentage: 48 },
      { certificationId: 2, name: '전기기능사', percentage: 28 },
      { certificationId: 5, name: '컴활', percentage: 18 },
    ],
    3: [
      { certificationId: 1, name: '자동화설비기능사', percentage: 50 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 12 },
    ],
  },
  '로봇제어과': {
    1: [
      { certificationId: 2, name: '전기기능사', percentage: 45 },
      { certificationId: 4, name: '전자기능사', percentage: 30 },
      { certificationId: 1, name: '자동화설비기능사', percentage: 15 },
    ],
    2: [
      { certificationId: 2, name: '전기기능사', percentage: 48 },
      { certificationId: 4, name: '전자기능사', percentage: 28 },
      { certificationId: 1, name: '자동화설비기능사', percentage: 16 },
    ],
    3: [
      { certificationId: 2, name: '전기기능사', percentage: 50 },
      { certificationId: 4, name: '전자기능사', percentage: 30 },
      { certificationId: 1, name: '자동화설비기능사', percentage: 12 },
    ],
  },
  // '로봇소프트웨어과'는 calculateDepartmentStats()로 계산된 값 사용
  '로봇정보통신과': {
    1: [
      { certificationId: 4, name: '전자기능사', percentage: 40 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 20 },
    ],
    2: [
      { certificationId: 4, name: '전자기능사', percentage: 42 },
      { certificationId: 2, name: '전기기능사', percentage: 28 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 22 },
    ],
    3: [
      { certificationId: 4, name: '전자기능사', percentage: 45 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 17 },
    ],
  },
  // 실제 친구 데이터 기반 통계 (계산된 값)
  '정보통신과': {
    2: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 100 },
      { certificationId: 2, name: '전기기능사', percentage: 100 },
      { certificationId: 5, name: '컴활', percentage: 100 },
    ],
  },
};

// 친구 데이터 기반으로 실제 통계 계산 및 병합
// 계산된 통계가 우선되도록 덮어쓰기
const calculatedStats = calculateDepartmentStats();
Object.keys(calculatedStats).forEach(dept => {
  if (!mockDepartmentCertStats[dept]) {
    mockDepartmentCertStats[dept] = {};
  }
  Object.keys(calculatedStats[dept]).forEach(grade => {
    // 계산된 통계로 덮어쓰기 (하드코딩된 값보다 우선)
    mockDepartmentCertStats[dept][grade] = calculatedStats[dept][grade];
  });
});

// Mock 플래시카드 데이터 (현재는 비어있음, 필요시 추가)
const mockFlashCards = {};

// Mock 문제 데이터 (자격증별로 분리)
// certificationId: 1 = 자동화설비기능사, 2 = 전기기능사
const mockQuestions = {
  1: [ // 자동화설비기능사
    {
      id: 1,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "선반 작업 시 발생한 칩(Chip)은 기계가 작동 중일 때 손으로 즉시 제거해야 안전하다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "칩은 매우 날카롭고 뜨거우며, 회전하는 기계에 손이 말려들어갈 위험이 있으므로 반드시 기계를 정지시킨 후 브러시나 갈고리 등을 사용하여 제거해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 2,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "CNC 선반 프로그래밍에서 공구를 급속 이송(위치 결정)시킬 때 사용하는 G 코드는 무엇인가?",
      choices: [
        "G00",
        "G01",
        "G02",
        "G03"
      ],
      answer: "G00",
      explanation: "G00은 급속 위치 결정(급송), G01은 직선 보간(절삭 이송), G02는 시계 방향 원호 보간, G03은 반시계 방향 원호 보간입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 3,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유압 장치에서 작동유의 온도가 상승하면 점도는 낮아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "일반적으로 액체(작동유)는 온도가 상승하면 분자 운동이 활발해져 점도가 낮아(묽어)집니다. 반대로 기체는 온도가 오르면 점도가 높아지는 경향이 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 4,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기계 제도에서 물체의 보이지 않는 부분의 형상을 나타낼 때 사용하는 선의 명칭은 무엇인가?",
      choices: [
        "외형선",
        "숨은선",
        "중심선",
        "파단선"
      ],
      answer: "숨은선",
      explanation: "물체의 보이지 않는 부분은 점선 또는 파선 형태의 '숨은선'으로 표현합니다. 외형선은 보이는 부분, 중심선은 도형의 중심, 파단선은 불규칙한 경계를 나타냅니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 5,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "PLC 시퀀스 제어에서 두 개의 입력 접점이 직렬로 연결되어, 두 입력이 모두 ON일 때만 출력이 발생하는 논리 회로는?",
      choices: [
        "OR 회로",
        "AND 회로",
        "NOT 회로",
        "NAND 회로"
      ],
      answer: "AND 회로",
      explanation: "직렬 연결은 AND 논리(논리곱)에 해당하며, 모든 조건이 만족(1)되어야 결과가 출력됩니다. 병렬 연결은 OR 논리에 해당합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 6,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "CNC공작기계에 사용되는 좌표계 중에서 절대 좌표계의 기준이 되며, 프로그램 원점과 동일한 지점에 위치하는 좌표계는?",
      choices: [
        "기계 좌표계",
        "상대 좌표계",
        "측정 좌표계",
        "공작물 좌표계"
      ],
      answer: "공작물 좌표계",
      explanation: "공작물 좌표계(G54~G59)는 가공 프로그램을 작성할 때 기준이 되는 좌표계로, 일반적으로 프로그램 원점과 일치시켜 사용합니다. 기계 좌표계는 기계 원점을 기준으로 하는 고정된 좌표계입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 7,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "연삭 숫돌의 입자가 무디거나 눈이 메워졌을 때, 숫돌의 표면을 깎아내어 예리한 날을 생성하는 작업을 '드레싱(Dressing)'이라고 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "드레싱(Dressing)은 눈메움이나 무딤 현상이 발생했을 때 새로운 절삭날을 생성하는 작업이며, 트루잉(Truing)은 숫돌의 형상을 수정하거나 편심을 잡는 작업입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 8,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 나사의 종류를 표시하는 기호가 잘못 짝지어진 것은?",
      choices: [
        "M : 미터 나사",
        "R : 관용 테이퍼 수나사",
        "Tr : 미터 사다리꼴 나사",
        "UNC : 유니파이 가는 나사"
      ],
      answer: "UNC : 유니파이 가는 나사",
      explanation: "UNC는 유니파이 보통 나사(Coarse)를 의미하며, 유니파이 가는 나사(Fine)는 UNF로 표기합니다. 나머지는 올바른 표기입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 9,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "공압 장치는 유압 장치에 비해 힘(출력)이 매우 크고, 속도 제어가 정밀하다는 장점이 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "공압은 공기의 압축성 때문에 정밀한 속도 제어가 어렵고 유압에 비해 큰 힘을 내기 어렵습니다. 큰 힘과 정밀한 제어는 유압 장치의 특징입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 10,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속 물체가 센서의 검출면에 접근할 때 발생하는 와전류 손실을 이용하여 물체의 유무를 감지하는 센서는?",
      choices: [
        "광전 센서",
        "유도형 근접 센서",
        "정전 용량형 센서",
        "리미트 스위치"
      ],
      answer: "유도형 근접 센서",
      explanation: "유도형(고주파 발진형) 근접 센서는 자성체(금속)에만 반응하며 와전류 손실 원리를 이용합니다. 정전 용량형은 금속, 비금속 모두 감지 가능합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 11,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "자동화 시스템의 5대 요소 중, 제어부의 명령을 받아 실제로 일을 수행(동작)하는 구동 기기에 해당하는 것은?",
      choices: [
        "센서(Sensor)",
        "프로세서(Processor)",
        "액추에이터(Actuator)",
        "소프트웨어(Software)"
      ],
      answer: "액추에이터(Actuator)",
      explanation: "액추에이터는 전기, 유압, 공압 등의 에너지를 기계적인 움직임으로 변환하는 구동 장치(모터, 실린더 등)를 말합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 12,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전동기 과부하 보호용 계전기는?",
      choices: [
        "한시계전기",
        "파워계전기",
        "리드계전기",
        "열동형계전기"
      ],
      answer: "열동형계전기",
      explanation: "열동형 계전기(Thermal Relay)는 전류가 과하게 흐를 때 발생하는 열을 이용하여 바이메탈을 휘게 만들어 회로를 차단함으로써 전동기를 소손으로부터 보호합니다.",
      examInfo: {
        year: 2014,
        round: "4회"
      }
    },
    {
      id: 13,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "3각법 투상도에서 평면도는 정면도의 위쪽에 배치된다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "제3각법에서는 눈 -> 투상면 -> 물체의 순서로 배치되므로, 정면도를 기준으로 평면도는 위쪽, 우측면도는 오른쪽에 배치됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 14,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "밀링 머신에서 공작물의 이송 방향과 커터의 회전 방향이 같은 방향으로 진행되는 절삭 방법은?",
      choices: [
        "상향 절삭",
        "하향 절삭",
        "정면 절삭",
        "측면 절삭"
      ],
      answer: "하향 절삭",
      explanation: "하향 절삭(Down milling)은 커터의 회전 방향과 공작물 이송 방향이 같습니다. 가공면이 깨끗하지만 백래시 제거 장치가 필요합니다. 상향 절삭은 방향이 반대입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 15,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "시퀀스 제어 회로에서 자기유지 회로를 해제하기 위해서는 주로 b접점(NC) 스위치를 직렬로 연결하여 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "자기유지 회로는 한 번 신호를 주면 계속 동작 상태를 유지하는데, 이를 끊어주기(Reset/Stop) 위해서는 평소에 닫혀 있다가 누르면 열리는 b접점 스위치를 직렬로 연결합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 16,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기하공차 기호 중에서 '평행도'를 나타내는 기호는?",
      choices: [
        "⊥",
        "∥",
        "◎",
        "∠"
      ],
      answer: "∥",
      explanation: "∥는 평행도, ⊥는 직각도, ◎는 동심도, ∠는 경사도를 나타내는 기하공차 기호입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 17,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "산업용 로봇의 동작 형태 중 X, Y, Z 3개의 직선 운동 축으로 구성되어 직육면체 형태의 작업 영역을 가지는 로봇은?",
      choices: [
        "직교 좌표 로봇",
        "원통 좌표 로봇",
        "수직 다관절 로봇",
        "스카라(SCARA) 로봇"
      ],
      answer: "직교 좌표 로봇",
      explanation: "직교 좌표 로봇(Cartesian coordinate robot)은 서로 직각인 3개의 축(X, Y, Z)을 따라 직선 운동을 하며 작업 공간이 직육면체입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 18,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "공작기계의 기본 운동이 아닌 것은?",
      choices: [
        "절삭 운동",
        "공작물 착탈 운동",
        "위치조정 운동",
        "이송 운동"
      ],
      answer: "공작물 착탈 운동",
      explanation: "공작기계의 3대 기본 운동은 절삭 운동(주운동), 이송 운동, 위치조정(깊이조절) 운동입니다. 공작물을 붙이고 떼는 착탈 운동은 보조적인 준비 작업에 해당합니다.",
      examInfo: {
        year: 2015,
        round: "2회"
      }
    },
    {
      id: 19,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "V-벨트 전동 장치에서 V-벨트의 단면 형상은 사각형이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "V-벨트의 단면 형상은 사다리꼴이며, 풀리의 V홈에 끼워져 쐐기 작용을 통해 마찰력을 높여 동력을 전달합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 20,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "유압 시스템에서 오일 탱크(Oil Tank)의 역할로 옳지 않은 것은?",
      choices: [
        "작동유의 저장",
        "작동유의 냉각",
        "작동유 내 기포 및 불순물 제거",
        "작동유의 압력 생성"
      ],
      answer: "작동유의 압력 생성",
      explanation: "오일 탱크는 작동유를 저장하고, 열을 방출하며, 기포와 이물질을 제거하는 역할을 합니다. 압력을 생성하는 것은 유압 펌프의 역할입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 21,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "나사의 호칭 지름은 수나사의 경우 바깥지름을 기준으로 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "수나사의 호칭 지름은 나사산의 가장 높은 부분인 바깥지름(대경)을 기준으로 표기합니다. 암나사는 암나사의 골지름에 해당하는 수나사의 바깥지름을 호칭으로 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 22,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "PLC 프로그램 명령어 중 'LD(Load)' 명령어의 기능으로 옳은 것은?",
      choices: [
        "모선의 시작(A접점 연결)",
        "직렬 연결",
        "병렬 연결",
        "출력 코일 구동"
      ],
      answer: "모선의 시작(A접점 연결)",
      explanation: "LD(Load) 명령어는 래더 다이어그램에서 모선(Bus bar)의 시작 부분에 A접점을 연결할 때 사용합니다. B접점 시작은 LD NOT을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 23,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 자동화 시스템에서 '피드백 제어(Feedback Control)'의 필수 구성 요소가 아닌 것은?",
      choices: [
        "목표값(설정부)",
        "비교부",
        "개방 루프",
        "검출부(센서)"
      ],
      answer: "개방 루프",
      explanation: "피드백 제어(폐루프 제어)는 출력값을 검출하여 목표값과 비교한 뒤 오차를 수정하는 방식입니다. 개방 루프(Open Loop)는 피드백 없이 입력만으로 제어하는 방식이므로 피드백 제어의 요소가 아닙니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 24,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 운동용 나사에 해당하는 것은?",
      choices: [
        "미터가는나사",
        "유니파이나사",
        "볼나사",
        "관용나사"
      ],
      answer: "볼나사",
      explanation: "볼나사, 사다리꼴나사, 사각나사 등은 동력을 전달하거나 부품을 이동시키는 운동용 나사입니다. 미터나사, 유니파이나사, 관용나사는 주로 체결용 나사입니다.",
      examInfo: {
        year: 2006,
        round: "4회"
      }
    },
    {
      id: 25,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "금속 재료의 기계적 성질 중 재료가 파괴되지 않고 가늘고 길게 늘어나는 성질을 '연성'이라고 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "연성(Ductility)은 재료가 탄성 한계를 넘어 파괴되지 않고 길게 늘어나는 성질입니다. 넓게 펴지는 성질은 전성(Malleability)이라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 26,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "공압 실린더의 속도를 제어할 때 실린더에서 배출되는 공기의 양을 조절하여 속도를 제어하는 방식은?",
      choices: [
        "미터 인(Meter-in) 회로",
        "미터 아웃(Meter-out) 회로",
        "블리드 오프(Bleed-off) 회로",
        "시퀀스 회로"
      ],
      answer: "미터 아웃(Meter-out) 회로",
      explanation: "미터 아웃 방식은 배기 측 유량을 제어하여 속도를 조절하는 방식으로, 공압 실린더의 속도를 안정적으로 제어할 때 가장 많이 사용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 27,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "센서 선정 시 감지 거리, 응답 속도, 사용 환경(온도, 습도 등)은 고려하지 않아도 된다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "센서를 선정할 때는 감지 대상 물체의 재질, 크기뿐만 아니라 감지 거리, 응답 속도, 설치 장소의 환경 조건 등을 반드시 고려해야 오작동을 막을 수 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 28,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 회로에서 전류의 흐름을 방해하여 전압을 낮추거나 전류를 제한하는 소자는 무엇인가?",
      choices: [
        "커패시터(콘덴서)",
        "인덕터(코일)",
        "저항기(Resistor)",
        "다이오드"
      ],
      answer: "저항기(Resistor)",
      explanation: "저항기는 전류의 흐름을 억제하여 전압 강하를 유도하거나 전류 크기를 조절하는 역할을 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 29,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기계 가공 도면에서 표면 거칠기 기호 중 가장 거친 표면(주조, 단조 상태 그대로)을 의미하는 것은?",
      choices: [
        "x",
        "y",
        "z",
        "w (또는 ~)"
      ],
      answer: "w (또는 ~)",
      explanation: "표면 거칠기 기호에서 물결무늬(~) 또는 w는 가공하지 않은 면(주조, 압연 등)이나 가장 거친 가공면을 의미합니다. (x, y, z 순으로 정밀해짐)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 30,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 비경화 테이퍼 핀의 호칭 지름을 나타내는 부분은?",
      choices: [
        "가장 가는 쪽의 지름",
        "가장 굵은 쪽의 지름",
        "중간 부분의 지름",
        "핀 구멍 지름"
      ],
      answer: "가장 가는 쪽의 지름",
      explanation: "테이퍼 핀의 호칭 지름은 테이퍼의 작은 쪽(가는 쪽) 지름으로 표시합니다.",
      examInfo: {
        year: 2013,
        round: "4회"
      }
    },
    {
      id: 31,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "직류(DC) 모터는 주파수를 변화시켜 회전 속도를 제어한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "직류(DC) 모터는 전압(전기자 전압)이나 전류(계자 전류)를 제어하여 속도를 조절합니다. 주파수 제어(인버터 사용)는 교류(AC) 유도 전동기 속도 제어에 주로 사용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 32,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "CAD 시스템에서 3차원 모델링 방식 중 물체의 표면뿐만 아니라 내부의 부피, 질량 정보까지 포함하는 가장 완벽한 모델링 방식은?",
      choices: [
        "와이어 프레임 모델링",
        "서피스 모델링",
        "솔리드 모델링",
        "2D 드래프팅"
      ],
      answer: "솔리드 모델링",
      explanation: "솔리드 모델링(Solid Modeling)은 속이 꽉 찬 입체로 표현하며 부피, 무게중심, 관성모멘트 등의 물리적 성질을 계산할 수 있는 방식입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 33,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유량 제어 밸브는 회로 내의 압력을 일정하게 유지하거나 최고 압력을 제한하는 역할을 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "압력을 조절하는 것은 '압력 제어 밸브'(릴리프 밸브 등)입니다. 유량 제어 밸브는 흐르는 유체 양을 조절하여 액추에이터의 속도를 제어합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 34,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "치수 기입 시 치수 숫자를 기입할 자리가 부족할 때 인출선을 사용하여 기입하거나, 치수 보조선 사이에 점(dot)을 찍어 나타낼 수 있다.",
      choices: [
        "치수선",
        "지시선",
        "파단선",
        "해칭선"
      ],
      answer: "지시선",
      explanation: "좁은 공간에 치수나 가공 방법 등을 기입할 때는 '지시선(Leader line)'을 끌어내어 기입합니다. 점은 화살표를 그릴 공간이 없을 때 대신 사용하기도 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 35,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "서보 모터(Servo Motor)의 특징으로 가장 거리가 먼 것은?",
      choices: [
        "정밀한 위치 제어가 가능하다.",
        "속도 응답성이 빠르다.",
        "피드백 제어를 하지 않는다.",
        "광범위한 속도 변속이 가능하다."
      ],
      answer: "피드백 제어를 하지 않는다.",
      explanation: "서보 모터는 엔코더 등을 통해 위치와 속도 정보를 검출하고 이를 컨트롤러로 보내 오차를 보정하는 '피드백 제어(Closed Loop)'를 기본으로 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 36,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 밀링 머신으로 가공하기에 가장 부적합한 것은?",
      choices: [
        "평면 가공",
        "기어 가공",
        "홈 가공",
        "원통 외경 선삭"
      ],
      answer: "원통 외경 선삭",
      explanation: "원통 외경 선삭은 공작물을 회전시키고 바이트를 이송하여 깎는 '선반(Lathe)' 가공의 대표적인 작업입니다. 밀링은 평면, 홈, 기어 등을 가공합니다.",
      examInfo: {
        year: 2011,
        round: "2회"
      }
    },
    {
      id: 37,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "스퍼 기어(Spur Gear)는 두 축이 서로 평행할 때 동력을 전달하는 가장 일반적인 기어이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "스퍼 기어(평기어)는 축이 평행한 상태에서 사용되며, 제작이 쉽고 효율이 좋아 가장 널리 사용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 38,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 전자의 이동 방향과 전류의 흐름 방향에 대한 설명으로 옳은 것은?",
      choices: [
        "둘 다 (+)에서 (-)로 흐른다.",
        "둘 다 (-)에서 (+)로 흐른다.",
        "전자는 (+)→(-), 전류는 (-)→(+)로 흐른다.",
        "전류는 (+)→(-), 전자는 (-)→(+)로 흐른다."
      ],
      answer: "전류는 (+)→(-), 전자는 (-)→(+)로 흐른다.",
      explanation: "관습적으로 전류는 양(+)극에서 음(-)극으로 흐른다고 정의하지만, 실제 전하를 운반하는 전자는 음(-)극에서 양(+)극으로 이동합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 39,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유압 펌프에서 '기어 펌프'는 구조가 복잡하고 고압용으로만 사용된다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "기어 펌프는 구조가 가장 간단하고 가격이 저렴하며, 주로 저압~중압용으로 사용됩니다. 고압용으로는 피스톤 펌프(플런저 펌프)가 적합합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 40,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "PLC 입출력 모듈 중 트랜지스터 출력 방식의 특징으로 옳은 것은?",
      choices: [
        "교류(AC) 부하만 제어 가능하다.",
        "직류(DC) 부하 제어에 적합하며 응답 속도가 빠르다.",
        "기계적 수명이 짧다.",
        "부하 전류 용량이 릴레이 방식보다 매우 크다."
      ],
      answer: "직류(DC) 부하 제어에 적합하며 응답 속도가 빠르다.",
      explanation: "트랜지스터 출력은 무접점 방식으로 DC 부하 전용이며, 릴레이 방식에 비해 응답 속도가 매우 빠르고 수명이 깁니다. AC 제어는 트라이악이나 릴레이를 씁니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 41,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기계 제도의 치수 보조 기호 중 정사각형의 한 변의 길이를 나타낼 때 치수 숫자 앞에 붙이는 기호는?",
      choices: [
        "R",
        "Ø",
        "SØ",
        "□"
      ],
      answer: "□",
      explanation: "정사각형 변의 길이는 '□' 기호를, 지름은 'Ø', 반지름은 'R', 구의 지름은 'SØ'를 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 42,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전해연마 가공에 대한 설명으로 틀린 것은?",
      choices: [
        "가공면에 방향성이 있다.",
        "내부식성과 내마모성이 향상된다.",
        "가공 표면에 변질층이 생기지 않는다.",
        "복잡한 형상의 제품도 전해연마가 가능하다."
      ],
      answer: "가공면에 방향성이 있다.",
      explanation: "전해연마는 전기화학적으로 표면을 녹여 매끄럽게 만드는 가공법으로, 기계적 가공흔이나 방향성이 남지 않고 광택이 나는 매끄러운 면을 얻을 수 있습니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 43,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "나사의 리드(Lead)는 나사가 1회전했을 때 축 방향으로 이동한 거리를 의미한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "리드(L)는 나사를 한 바퀴 돌렸을 때 전진하는 거리입니다. 한 줄 나사에서는 리드와 피치가 같지만, 여러 줄 나사에서는 '리드 = 줄 수 × 피치'입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 44,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 공유압 회로에서 압축 공기나 유압유의 역류를 방지하고 한쪽 방향으로만 흐르게 하는 밸브는?",
      choices: [
        "셔틀 밸브",
        "체크 밸브",
        "감압 밸브",
        "릴리프 밸브"
      ],
      answer: "체크 밸브",
      explanation: "체크 밸브(Check Valve)는 유체를 한쪽 방향으로만 흐르게 하고 반대 방향의 흐름은 차단하여 역류를 방지하는 역할을 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 45,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "PLC의 래더 다이어그램(Ladder Diagram)은 릴레이 제어 회로를 사다리 모양의 기호로 표현한 프로그래밍 언어이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "래더 다이어그램(LD)은 전기 시퀀스 회로도와 유사한 사다리 형태로, 직관적이고 이해하기 쉬워 가장 널리 사용되는 PLC 언어입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 46,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 기계적인 접촉 없이 빛을 이용하여 물체의 유무를 감지하는 센서는?",
      choices: [
        "리미트 스위치",
        "마이크로 스위치",
        "광전 센서",
        "열전대"
      ],
      answer: "광전 센서",
      explanation: "광전 센서(Photoelectric Sensor)는 투광부에서 빛을 쏘고 수광부에서 이를 받아 물체에 의한 빛의 차단이나 반사를 이용해 검출하는 비접촉 센서입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 47,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속 재료를 가열했다가 급격히 냉각시켜 경도(단단함)를 높이는 열처리 방법은?",
      choices: [
        "풀림(Annealing)",
        "불림(Normalizing)",
        "담금질(Quenching)",
        "뜨임(Tempering)"
      ],
      answer: "담금질(Quenching)",
      explanation: "담금질(퀜칭)은 고온으로 가열 후 물이나 기름에 급랭시켜 재료를 단단하게(경화) 만드는 열처리입니다. 하지만 취성(깨짐)이 생기므로 보통 뜨임 처리를 후속으로 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 48,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "센터리스 연삭의 특징으로 틀린 것은?",
      choices: [
        "긴 축 재료의 연삭이 가능하다.",
        "대형, 중량물의 연삭에 적합하다.",
        "속이 빈 원통의 외면 연삭에 편리하다.",
        "연속 작업이 가능하여 대량 생산에 적합하다."
      ],
      answer: "대형, 중량물의 연삭에 적합하다.",
      explanation: "센터리스 연삭기는 센터나 척을 사용하지 않고 조정 숫돌과 지지대로 공작물을 지지하므로, 대형 중량물보다는 가늘고 긴 축이나 소형 핀 등의 대량 생산에 훨씬 유리합니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 49,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "키(Key)는 축과 회전체(기어, 풀리 등)를 고정하여 회전력을 전달하는 기계 요소이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "키(Key)는 축과 보스 사이에 끼워져 헛돌지 않게 하고 동력을 전달하는 결합용 기계 요소입니다. (평행키, 반달키, 묻힘키 등)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 50,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "도면에서 치수를 기입할 때, 치수의 기준이 되는 점, 선, 면을 무엇이라 하는가?",
      choices: [
        "데이텀(Datum)",
        "피치(Pitch)",
        "공차(Tolerance)",
        "스케일(Scale)"
      ],
      answer: "데이텀(Datum)",
      explanation: "데이텀(Datum)은 가공이나 치수 측정의 기준이 되는 이론적으로 정확한 점, 직선, 평면 등을 의미하며 기하공차 적용 시 중요한 기준이 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 51,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유압유의 점도가 너무 높으면 유동 저항이 커져 동력 손실이 발생하고 압력이 상승할 수 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "점도가 지나치게 높으면 끈적임 때문에 흐름이 원활하지 않아 마찰 저항과 동력 손실이 커지고 펌프 흡입 불량(캐비테이션) 등의 원인이 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 52,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 자동화 시스템에서 디지털 신호를 아날로그 신호로 변환해 주는 장치는?",
      choices: [
        "A/D 변환기",
        "D/A 변환기",
        "증폭기(Amplifier)",
        "필터(Filter)"
      ],
      answer: "D/A 변환기",
      explanation: "디지털(Digital)을 아날로그(Analog)로 변환하는 것은 'D/A 변환기(DAC)'입니다. 반대는 'A/D 변환기(ADC)'입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 53,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 시퀀스 회로에서, 비상 정지 버튼(Emergency Stop)은 안전을 위해 어떤 접점을 사용하는가?",
      choices: [
        "a접점 (NO)",
        "b접점 (NC)",
        "c접점 (전환)",
        "무접점"
      ],
      answer: "b접점 (NC)",
      explanation: "비상 정지 스위치는 평소에 회로가 연결되어 있다가, 누르거나 단선 시 즉시 전원을 차단해야 하므로 안전상 'b접점(Normally Closed)'을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 54,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 M10×1.5 탭을 가공하기 위한 드릴링 작업 기초구멍으로 적합한 지름은?",
      choices: [
        "6.5mm",
        "7.5mm",
        "8.5mm",
        "9.5mm"
      ],
      answer: "8.5mm",
      explanation: "탭 기초 구멍 지름은 보통 '호칭 지름 - 피치'로 계산합니다. 10mm - 1.5mm = 8.5mm가 적합한 드릴 지름입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 55,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "밀링 머신에서 분할대(Dividing Head)는 원주를 등분하거나 기어를 가공할 때 공작물을 일정한 각도로 회전시키는 장치이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "분할대는 공작물을 정확한 각도로 회전시켜 등분할 수 있게 해주는 부속 장치로, 기어 가공, 드릴 홈 가공 등에 필수적입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 56,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "유압 회로에서 펌프의 토출 압력이 설정 압력 이상으로 올라가지 않도록 제어하여 회로를 보호하는 밸브는?",
      choices: [
        "감압 밸브",
        "릴리프 밸브",
        "시퀀스 밸브",
        "카운터 밸런스 밸브"
      ],
      answer: "릴리프 밸브",
      explanation: "릴리프 밸브(Relief Valve)는 회로 내 압력이 설정치보다 높아지면 탱크로 귀환시켜 과부하를 방지하는 대표적인 안전 밸브입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 57,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "베어링의 안지름 번호가 '04'일 때, 베어링의 안지름은 20mm이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "베어링 안지름 번호가 04 이상인 경우 번호에 5를 곱하여 안지름을 구합니다. 04 × 5 = 20mm입니다. (00:10mm, 01:12mm, 02:15mm, 03:17mm는 예외)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 58,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "PLC 프로그램에서 입력 신호가 ON되는 순간 1스캔(Scan) 동안만 ON 신호를 출력하는 명령어는?",
      choices: [
        "미분 명령 (PLS/펄스)",
        "적분 명령",
        "타이머 명령",
        "카운터 명령"
      ],
      answer: "미분 명령 (PLS/펄스)",
      explanation: "입력 신호의 상승 에지(Rising Edge)나 하강 에지(Falling Edge)를 검출하여 한 번만 짧게 신호를 보내는 것을 미분(펄스) 명령이라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 59,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 전선을 접속할 때 사용하는 공구가 아닌 것은?",
      choices: [
        "와이어 스트리퍼",
        "압착 펜치(터미널 압착기)",
        "니퍼",
        "마이크로미터"
      ],
      answer: "마이크로미터",
      explanation: "마이크로미터는 길이나 두께를 정밀하게 측정하는 측정기기입니다. 전선 접속 작업에는 스트리퍼(피복 제거), 압착 펜치, 니퍼(절단) 등이 사용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 60,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "내경과 중심이 같도록 외경을 가공할 때 사용하는 선반의 부속장치는?",
      choices: [
        "면판",
        "돌리개",
        "맨드릴",
        "방진구"
      ],
      answer: "맨드릴",
      explanation: "맨드릴(Mandrel, 심봉)은 이미 뚫려 있는 구멍을 기준으로 하여 외경을 동심원상으로 가공할 때 구멍에 끼워 사용하는 축입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 61,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "공압 액추에이터는 유압 액추에이터에 비해 화재의 위험이 적고 청결한 작업 환경을 유지하기 쉽다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "공압은 공기를 사용하므로 누출되어도 오염이 없고 인화성이 없어 화재 위험이 적습니다. 반면 유압은 기름 누유 시 오염과 화재 위험이 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 62,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기계 재료 중 '주철(Cast Iron)'의 가장 큰 특징으로, 진동을 잘 흡수하는 성질은 무엇인가?",
      choices: [
        "연성",
        "전성",
        "감쇠능(Damping Capacity)",
        "크리프(Creep)"
      ],
      answer: "감쇠능(Damping Capacity)",
      explanation: "주철은 흑연이 포함되어 있어 진동을 흡수하는 능력인 감쇠능이 뛰어납니다. 그래서 공작기계의 베드(Bed)나 몸체 재료로 많이 쓰입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 63,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "서보 모터 제어 방식 중 '개방 루프 제어(Open Loop Control)'는 엔코더와 같은 검출기로부터 피드백 신호를 받아 오차를 보정한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "피드백 신호를 받아 오차를 보정하는 방식은 '폐루프 제어(Closed Loop Control)'입니다. 개방 루프는 피드백 없이 지령만 내리는 방식(예: 스테핑 모터)입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 64,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "도면에서 치수선, 치수 보조선, 지시선, 해칭선 등에 주로 사용되는 선의 종류는?",
      choices: [
        "가는 실선",
        "굵은 실선",
        "숨은선(파선)",
        "1점 쇄선"
      ],
      answer: "가는 실선",
      explanation: "외형선은 굵은 실선을 사용하고, 치수선/보조선/지시선/해칭선 등은 도면을 명확히 하기 위해 '가는 실선'을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 65,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 자동화 시스템의 입력 장치(센서, 스위치 등)에 해당하지 않는 것은?",
      choices: [
        "푸시 버튼 스위치",
        "솔레노이드 밸브",
        "리미트 스위치",
        "근접 센서"
      ],
      answer: "솔레노이드 밸브",
      explanation: "솔레노이드 밸브는 제어 신호를 받아 유로를 개폐하는 '출력 장치(구동기)'에 해당합니다. 나머지는 신호를 보내는 입력 장치입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 66,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 그림과 같은 치수 기입법의 명칭은? (기준점에서 계단식으로 치수 기입)",
      choices: [
        "직렬 치수 기입법",
        "누진 치수 기입법",
        "좌표 치수 기입법",
        "병렬 치수 기입법"
      ],
      answer: "누진 치수 기입법",
      explanation: "한 개의 기준점(Datum)에서 출발하여 연속적으로 치수를 누적하여 기입하는 방식을 누진 치수 기입법이라고 합니다. 기준점 표시(○)가 특징입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 67,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유도 전동기의 회전 속도를 제어하는 가변 전압 가변 주파수 장치를 '인버터(Inverter)'라고 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "인버터(VVVF)는 주파수와 전압을 변화시켜 교류(AC) 모터의 속도를 효율적으로 제어하는 장치입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 68,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속의 기계적 성질 중 외부의 힘에 의해 변형되었다가 힘을 제거하면 원래의 모양으로 되돌아가는 성질은?",
      choices: [
        "소성",
        "탄성",
        "전성",
        "취성"
      ],
      answer: "탄성",
      explanation: "탄성(Elasticity)은 고무줄이나 스프링처럼 힘을 제거하면 원상 복구되는 성질입니다. 반대로 영구 변형이 남는 성질은 소성(Plasticity)입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 69,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "기어(Gear) 제도 시, 이끝원(바깥지름)은 가는 실선으로 그린다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "기어 제도에서 이끝원(바깥지름)은 '굵은 실선'으로, 피치원은 '가는 1점 쇄선'으로, 이뿌리원은 '가는 실선'(단면 시 굵은 실선)으로 그립니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 70,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "시퀀스 제어에서 B접점(Normally Closed)의 동작 설명으로 옳은 것은?",
      choices: [
        "평소에는 열려 있다가 조작하면 닫힌다.",
        "평소에는 닫혀 있다가 조작하면 열린다.",
        "한 번 조작하면 영구적으로 닫힌다.",
        "전원이 들어오면 무조건 열린다."
      ],
      answer: "평소에는 닫혀 있다가 조작하면 열린다.",
      explanation: "B접점(NC)은 평상시에 연결(Closed)되어 있어 전류가 흐르다가, 스위치를 누르거나 작동시키면 회로가 끊어지는(Open) 접점입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 71,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 CNC 선반 가공 시 절삭 속도(v)를 구하는 공식은? (D: 공작물 지름, N: 회전수)",
      choices: [
        "v = πDN / 1000",
        "v = 1000 / πDN",
        "v = πD / 1000N",
        "v = N / πD"
      ],
      answer: "v = πDN / 1000",
      explanation: "절삭 속도 v(m/min)는 π × 지름(D) × 회전수(N) ÷ 1000으로 계산합니다. (단위 환산을 위해 1000으로 나눔)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 72,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "그림과 같이 키 홈, 구멍 등 해당 부분 모양만을 도시하는 것으로 충분한 경우 사용하는 투상도로 투상 관계를 나타내기 위하여 주된 그림에 중심선, 기준선, 치수 보조선 등을 연결하여 나타내는 투상도는?",
      choices: [
        "회전 투상도",
        "부분 투상도",
        "국부 투상도",
        "보조 투상도"
      ],
      answer: "국부 투상도",
      explanation: "국부 투상도는 대상물의 구멍, 홈 등 필요한 국소 부분만의 모양을 도시할 때 사용합니다. 전체를 그릴 필요가 없을 때 효율적입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 73,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "밀링 머신에서 공작물은 고정되어 있고, 공구(커터)가 회전하며 절삭한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "밀링은 회전하는 공구에 공작물을 이송시켜 가공하는 방식이고, 선반은 회전하는 공작물에 공구를 이송시켜 가공하는 방식입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 74,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "유압 회로에서 작동유 내의 불순물을 제거하여 기기를 보호하는 부품은?",
      choices: [
        "오일 쿨러",
        "스트레이너(필터)",
        "어큐뮬레이터",
        "압력계"
      ],
      answer: "스트레이너(필터)",
      explanation: "스트레이너(Strainer)나 필터는 작동유에 섞인 금속 가루나 먼지 등의 이물질을 걸러내어 펌프와 밸브 고장을 예방합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 75,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 PLC 출력 모듈에서 '릴레이 출력 방식'의 장점이 아닌 것은?",
      choices: [
        "AC, DC 부하 모두 사용 가능하다.",
        "과전압, 과전류에 비교적 강하다.",
        "응답 속도가 매우 빠르다.",
        "전압 강하가 적다."
      ],
      answer: "응답 속도가 매우 빠르다.",
      explanation: "릴레이 출력은 기계적 접점을 사용하므로 트랜지스터(SSR) 방식에 비해 응답 속도가 느리고 기계적 수명에 한계가 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 76,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "나사의 피치(Pitch)는 나사산과 바로 이웃하는 나사산 사이의 축 방향 거리이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "피치는 나사산의 마루에서 이웃한 마루까지, 또는 골에서 골까지의 축 방향 거리를 말합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 77,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 자동화 시스템에서 제어 신호를 증폭하거나, 전기적 신호를 기계적 움직임으로 변환해 주는 장치는?",
      choices: [
        "센서",
        "컨트롤러",
        "솔레노이드",
        "엔코더"
      ],
      answer: "솔레노이드",
      explanation: "솔레노이드는 전기에너지를 자기로 바꾸고, 그 힘으로 플런저를 움직여 밸브를 여닫거나 직선 운동을 만드는 구동기(액추에이터)입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 78,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "압력수두+위치수두+속도수두=일정\"의 식과 가장 관계가 깊은 것은?",
      choices: [
        "연속 법칙",
        "파스칼 원리",
        "베르누이 정리",
        "보일-샤를의 법칙"
      ],
      answer: "베르누이 정리",
      explanation: "베르누이 정리는 이상 유체가 흐를 때 에너지 보존 법칙에 따라 압력 에너지, 위치 에너지, 운동 에너지의 합이 항상 일정하다는 법칙입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 79,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "공압 시스템에서 공기 압축기로부터 나온 압축 공기의 온도를 낮추고 수분을 제거하기 위해 '애프터 쿨러(After Cooler)'를 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "압축된 공기는 고온이므로 애프터 쿨러를 통과시켜 냉각시키고, 이 과정에서 응축된 수분을 제거하여 배관 부식을 방지합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 80,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 연삭 숫돌의 3요소에 해당하지 않는 것은?",
      choices: [
        "숫돌 입자",
        "결합제",
        "기공",
        "입도"
      ],
      answer: "입도",
      explanation: "연삭 숫돌의 3요소는 입자(Abrasive), 결합제(Bond), 기공(Pore)입니다. 입도는 입자의 크기를 나타내는 성질 중 하나입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 81,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기계 제도에서 단면도(Section View)를 그릴 때, 절단된 면을 나타내기 위해 45도 각도로 긋는 가는 실선은?",
      choices: [
        "파단선",
        "해칭선",
        "중심선",
        "지시선"
      ],
      answer: "해칭선",
      explanation: "해칭(Hatching)은 단면도의 절단면을 표시하기 위해 빗금(가는 실선)을 긋는 것을 말하며, 재질에 따라 모양을 달리하기도 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 82,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "서보 모터의 엔코더(Encoder)는 모터의 회전 속도와 위치 정보를 검출하는 센서이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "엔코더는 회전각이나 위치 변화를 펄스 신호로 변환하여 제어기에 피드백해 주는 핵심 센서입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 83,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 회로에서 전압(V), 전류(I), 저항(R)의 관계를 나타낸 옴의 법칙(Ohm's Law) 공식으로 옳은 것은?",
      choices: [
        "V = I × R",
        "I = V × R",
        "R = V × I",
        "V = R / I"
      ],
      answer: "V = I × R",
      explanation: "옴의 법칙에 따르면 전압(V)은 전류(I)와 저항(R)의 곱과 같습니다. (V=IR, I=V/R, R=V/I)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 84,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "PLC 제어와 릴레이 제어의 비교 설명으로 틀린 것은?",
      choices: [
        "PLC는 제어 내용 변경이 쉽다.",
        "릴레이 제어는 배선 작업이 복잡하다.",
        "PLC는 소형화 및 신뢰성이 높다.",
        "릴레이 제어는 접점 수명에 제한이 없다."
      ],
      answer: "릴레이 제어는 접점 수명에 제한이 없다.",
      explanation: "릴레이는 기계적 접점을 사용하므로 아크 발생, 마모 등으로 인해 수명에 한계가 있습니다. 반면 PLC는 반도체 소자를 이용하므로 수명이 깁니다.",
      examInfo: {
        year: 2014,
        round: "3회"
      }
    },
    {
      id: 85,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유압 장치에서 '캐비테이션(Cavitation)' 현상은 압력이 너무 높아져서 배관이 파열되는 현상을 말한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "캐비테이션(공동 현상)은 국부적인 압력 저하로 인해 기포가 발생하고, 이 기포가 터지면서 소음, 진동, 침식을 유발하는 현상입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 86,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 축과 보스를 결합하여 회전력을 전달하며, 축 방향으로 이동이 가능한 키(Key)는?",
      choices: [
        "묻힘 키",
        "반달 키",
        "스플라인",
        "안장 키"
      ],
      answer: "스플라인",
      explanation: "스플라인(Spline)은 축에 여러 개의 키 홈을 파서 큰 동력을 전달할 수 있으며, 축 방향으로 보스가 미끄러져 이동할 수 있는 것이 특징입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 87,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "CNC 프로그램에서 보조 프로그램 호출 명령어는 M98이고, 보조 프로그램 종료 후 메인 프로그램 복귀 명령어는 M99이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "M98은 보조 프로그램 호출(Call), M99는 보조 프로그램 종료 및 메인 프로그램으로 복귀(Return)를 의미하는 M코드입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 88,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "공압 회로에서 실린더가 전진 끝단이나 후진 끝단에 도달했음을 감지하여 다음 동작 신호를 보내는 스위치는?",
      choices: [
        "푸시 버튼 스위치",
        "리미트 스위치",
        "토글 스위치",
        "셀렉터 스위치"
      ],
      answer: "리미트 스위치",
      explanation: "리미트 스위치(Limit Switch)는 기계적 움직임의 한계 위치나 특정 위치를 검출하여 전기 신호를 보내는 접촉식 센서입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 89,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 KS 재료 기호 'SM45C'의 설명으로 올바른 것은?",
      choices: [
        "회주철 45종",
        "기계구조용 탄소강, 탄소 함유량 0.45%",
        "스테인리스강 45종",
        "알루미늄 합금"
      ],
      answer: "기계구조용 탄소강, 탄소 함유량 0.45%",
      explanation: "SM은 기계구조용 탄소강(Steel Machine)을, 숫자 45C는 탄소 함유량이 약 0.45%임을 의미합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 90,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "3개의 조(Jaw)가 120도 간격으로 배치되어 있어 원형 공작물을 고정할 때 자동으로 중심이 맞춰지는 선반 척은?",
      choices: [
        "단동 척",
        "연동 척",
        "마그네틱 척",
        "콜릿 척"
      ],
      answer: "연동 척",
      explanation: "연동 척(Scroll Chuck)은 핸들을 돌리면 3개의 조가 동시에 움직여(연동) 자동으로 중심(Centering)을 잡아주므로 원형 공작물 고정에 편리합니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    }
  ],
  2: [ // 전기기능사
    {
      id: 1,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "일반적인 금속 도체(구리 등)는 온도가 상승하면 전기 저항도 함께 증가한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "도체(금속)는 온도가 올라가면 내부 원자의 진동이 심해져 전자의 이동을 방해하므로 저항이 증가합니다. 이를 '정(+)의 온도 계수'를 가진다고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 2,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "플레밍의 왼손 법칙은 전동기(모터)의 원리를 설명합니다. 엄지는 힘(F)의 방향, 검지는 자계(B)의 방향, 그렇다면 중지는 무엇의 방향을 가리킬까요?",
      choices: [
        "전류 (I)",
        "전압 (V)",
        "저항 (R)",
        "속도 (v)"
      ],
      answer: "전류 (I)",
      explanation: "플레밍의 왼손 법칙에서 각 손가락은 다음과 같습니다. 엄지=힘(Force/전동기의 회전 방향), 검지=자계(Magnetic Field), 중지=전류(Current). 'FBI'로 외우면 쉽습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 3,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전기력선은 전위가 낮은 곳에서 시작하여 전위가 높은 곳으로 향한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전기력선은 물이 높은 곳에서 낮은 곳으로 흐르듯, 전위가 높은 곳(+극)에서 시작하여 전위가 낮은 곳(-극)으로 향합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 4,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "변압기는 전자기 유도 현상을 이용해 전압과 전류의 크기를 바꿀 수 있는 기기입니다. 하지만 1차측과 2차측 사이에서 절대 변하지 않는 요소는 무엇일까요?",
      choices: [
        "전압",
        "전류",
        "주파수",
        "임피던스"
      ],
      answer: "주파수",
      explanation: "변압기는 전압과 전류를 변환시켜주지만, 전원(입력)의 주파수는 변환 과정에서 바뀌지 않고 그대로 출력측으로 전달됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 5,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 회로에서 코일(인덕터)이나 콘덴서(커패시터)가 전류의 흐름을 방해하는 성질을 무엇이라고 합니까?",
      choices: [
        "리액턴스",
        "컨덕턴스",
        "서셉턴스",
        "어드미턴스"
      ],
      answer: "리액턴스",
      explanation: "저항(Resistance) 외에 코일이나 콘덴서에 의해 발생하는 교류 저항 성분을 리액턴스(Reactance)라고 하며, 단위는 옴(Ω)을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 6,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전류가 흐르면 열이 발생하는 현상(줄열)을 이용하지 '않는' 장치는 다음 중 무엇입니까?",
      choices: [
        "전기 다리미",
        "전기 밥솥",
        "백열 전구",
        "전기 도금조"
      ],
      answer: "전기 도금조",
      explanation: "전기 다리미, 밥솥, 백열 전구는 전류의 열작용을 이용합니다. 반면 전기 도금은 전류의 '화학 작용'을 이용하는 대표적인 예입니다.",
      examInfo: {
        year: 2015,
        round: "2회"
      }
    },
    {
      id: 7,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "회로에 흐르는 전류(I)의 크기는 전압(V)에 비례하고, [   ]에 반비례한다는 법칙을 '옴의 법칙'이라고 합니다.",
      choices: [
        "저항",
        "전력",
        "주파수",
        "인덕턴스"
      ],
      answer: "저항",
      explanation: "옴의 법칙(I = V/R)에 따르면 전류는 전압이 클수록 세지고, 흐름을 방해하는 저항이 클수록 약해집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 8,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "저항을 '직렬'로 연결할수록 전체 합성 저항값은 작아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "저항을 직렬로 연결하는 것은 전자가 지나가야 할 길이 길어지는 것과 같습니다. 따라서 저항을 더할수록 전체 저항값은 커집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 9,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "플레밍의 왼손 법칙이 전동기(모터)의 원리라면, 플레밍의 [   ] 법칙은 발전기의 원리를 설명합니다.",
      choices: [
        "오른손",
        "양손",
        "왼발",
        "오른발"
      ],
      answer: "오른손",
      explanation: "전동기는 전기를 써서 움직이므로 '우발좌전(발전기=오른손, 전동기=왼손)'으로 암기하면 편리합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 10,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "콘덴서(커패시터)를 [   ]로 연결하면, 저항을 직렬 연결한 것처럼 전체 용량이 증가합니다.",
      choices: [
        "병렬",
        "직렬",
        "교차",
        "개방"
      ],
      answer: "병렬",
      explanation: "콘덴서는 저항과 반대로 계산합니다. 콘덴서를 병렬로 연결하면 전하를 담을 수 있는 면적이 넓어지는 효과가 있어 용량이 커집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 11,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "일반적인 정현파 교류에서 '실효값'은 최대값을 √2로 나눈 값과 같다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "교류 전압이나 전류의 크기를 나타낼 때 주로 실효값을 사용하며, 정현파의 경우 실효값 = 최대값 / √2 (약 0.707배) 관계가 성립합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 12,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 '전기장의 세기'를 나타내는 단위로 올바른 것은 무엇입니까?",
      choices: [
        "V/m",
        "A/m",
        "C/m",
        "W/m"
      ],
      answer: "V/m",
      explanation: "전기장의 세기는 단위 길이당 전위차를 의미하므로 V/m(볼트 퍼 미터)를 단위로 사용합니다. (참고: A/m는 자기장의 세기)",
      examInfo: {
        year: 2015,
        round: "1회"
      }
    },
    {
      id: 13,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "회로의 접속점(노드)으로 들어오는 전류의 합과 나가는 전류의 합은 같다는 법칙을 '키르히호프의 [   ] 법칙'이라고 합니다.",
      choices: [
        "제1 (전류)",
        "제2 (전압)",
        "제3 (저항)",
        "제4 (전력)"
      ],
      answer: "제1 (전류)",
      explanation: "키르히호프의 제1법칙(KCL)은 전하량 보존 법칙에 기반하며, 회로의 어떤 지점에서든 들어온 전류의 총량과 나간 전류의 총량은 같다는 원리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 14,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "반도체나 전해액 같은 물질은 금속과 달리, 온도가 올라가면 전기 저항이 오히려 감소한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "일반적인 금속은 온도가 오르면 저항이 커지지만(정특성), 반도체나 탄소, 전해액 등은 온도가 오르면 저항이 작아지는 '부(-)성 저항 특성'을 가집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 15,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전동기(모터)는 [   ] 에너지를 기계적 회전 에너지로 변환해 주는 장치입니다. 빈칸에 들어갈 말은?",
      choices: [
        "전기",
        "화학",
        "열",
        "원자력"
      ],
      answer: "전기",
      explanation: "전동기는 전기를 공급받아 회전력을 만들어내는 기계입니다. 반대로 기계적 에너지를 전기 에너지로 바꾸는 장치는 발전기입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 16,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "콘덴서(커패시터)를 '직렬'로 연결하면 전체 합성 용량은 가장 작은 콘덴서의 용량보다도 작아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "콘덴서의 직렬 연결 계산식은 저항의 병렬 연결 식과 같습니다. 따라서 직렬로 연결할수록 전체 용량은 줄어듭니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 17,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 전력에서 전압과 전류의 위상차 때문에 실제로 일하는 전력(유효 전력)의 비율을 나타내는 것을 무엇이라고 합니까?",
      choices: [
        "역률",
        "효율",
        "부하율",
        "수용률"
      ],
      answer: "역률",
      explanation: "역률(Power Factor)은 전체 공급된 전력(피상 전력) 중에서 실제로 유효하게 사용된 전력(유효 전력)의 비율을 뜻합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 18,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전선의 피복이 벗겨지지 않은 상태에서, 전기가 새지 않고 잘 차단되어 있는지 확인하는 '절연 저항' 측정에 사용되는 계측기는?",
      choices: [
        "메거 (절연저항계)",
        "전류계",
        "전압계",
        "주파수계"
      ],
      answer: "메거 (절연저항계)",
      explanation: "절연 저항을 측정할 때는 높은 전압을 가해 미세한 누설 전류를 측정하는 '메거(Megger)'를 사용합니다.",
      examInfo: {
        year: 2016,
        round: "1회"
      }
    },
    {
      id: 19,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "폐회로(닫힌 회로) 내에서 전원 전압의 합과 전압 강하의 합은 같다는 법칙을 '키르히호프의 [   ] 법칙'이라고 합니다.",
      choices: [
        "제1 (전류)",
        "제2 (전압)",
        "제3 (에너지)",
        "제4 (주파수)"
      ],
      answer: "제2 (전압)",
      explanation: "키르히호프의 제2법칙(KVL)은 에너지 보존 법칙에 기반하며, 회로 한 바퀴를 돌 때 전압 상승과 전압 강하의 합이 0이 된다는 원리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 20,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "자석의 외부에서 자기력선은 항상 S극에서 나와서 N극으로 들어가는 방향이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "자기력선은 자석의 '외부'에서는 N극에서 나와 S극으로 들어가고, 자석의 '내부'에서는 S극에서 N극으로 향하여 폐곡선을 이룹니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 21,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 회로에서 저항(R)과 리액턴스(X)를 합친, 전류의 흐름을 방해하는 전체 저항 성분을 [   ](이)라고 합니다.",
      choices: [
        "임피던스",
        "어드미턴스",
        "서셉턴스",
        "컨덕턴스"
      ],
      answer: "임피던스",
      explanation: "임피던스(Z)는 교류 회로의 전체 저항값으로, 단위는 옴(Ω)을 사용합니다. 기호로는 Z = R + jX 형태로 표현합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 22,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "직류 발전기에 있는 '정류자'는 전기자에서 만들어진 교류 기전력을 직류로 변환해주는 역할을 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "발전기 내부(전기자)에서는 기본적으로 교류가 생성되지만, 정류자와 브러시를 거치면서 외부 회로에는 직류가 출력됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 23,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "4개의 저항을 다이아몬드 꼴로 연결하고, 대각선 방향의 저항 곱이 서로 같을 때 전류가 흐르지 않는 원리를 이용해 미지 저항을 측정하는 회로는?",
      choices: [
        "휘스톤 브리지",
        "배율기",
        "분류기",
        "전위차계"
      ],
      answer: "휘스톤 브리지",
      explanation: "휘스톤 브리지는 평형 상태(마주 보는 저항의 곱이 같음)를 이용하여 중간 저항값을 정밀하게 측정하는 장치입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 24,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 코일이 가지는 성질인 '인덕턴스(L)'의 단위로 올바른 것은 무엇입니까?",
      choices: [
        "옴 (Ω)",
        "헨리 (H)",
        "패럿 (F)",
        "쿨롱 (C)"
      ],
      answer: "헨리 (H)",
      explanation: "인덕턴스의 단위는 헨리(H)를 사용합니다. 참고로 옴(Ω)은 저항, 패럿(F)은 정전용량(콘덴서), 쿨롱(C)은 전하량의 단위입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 25,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "자기장 내에서 도체가 힘을 받아 움직이는 방향을 결정하는 법칙으로, 왼손의 엄지(힘), 검지(자계), 중지(전류)를 사용하는 법칙은?",
      choices: [
        "플레밍의 왼손 법칙",
        "플레밍의 오른손 법칙",
        "앙페르의 오른나사 법칙",
        "렌츠의 법칙"
      ],
      answer: "플레밍의 왼손 법칙",
      explanation: "전동기(모터)의 원리인 힘의 방향을 찾을 때는 왼손을 사용합니다. (우발좌전: 발전기는 오른손, 전동기는 왼손)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 26,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "교류 회로에서 '공진'이란, 유도성 리액턴스(XL)와 용량성 리액턴스(XC)의 크기가 같아져서 허수부가 사라지는 상태를 말한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "공진 상태가 되면 XL = XC가 되어 서로 상쇄되므로, 회로의 임피던스는 최소(직렬 공진) 또는 최대(병렬 공진)가 되고 전압과 전류가 동상이 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 27,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 회로에서 과전류가 흐를 때, 스스로 녹아서 끊어짐으로써 회로를 보호하는 안전장치는 무엇입니까?",
      choices: [
        "퓨즈",
        "스위치",
        "변압기",
        "콘덴서"
      ],
      answer: "퓨즈",
      explanation: "퓨즈는 녹는점이 낮은 금속으로 만들어져 있어, 과도한 전류가 흐르면 발생하는 열에 의해 녹아 끊어지면서 회로를 차단합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 28,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "3상 교류 전력을 결선할 때, Y결선(성형 결선)에서는 선간 전압이 상전압보다 √3배 더 크다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "Y결선에서는 선전류와 상전류가 같고, 선간 전압은 상전압의 √3배입니다. (반대로 △결선은 전압이 같고 선전류가 √3배 큽니다.)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 29,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "반도체 소자 중 하나로, 한쪽 방향으로만 전류를 흐르게 하고 반대 방향은 차단하는 '정류 작용'을 하는 부품은?",
      choices: [
        "다이오드",
        "트랜지스터",
        "저항",
        "코일"
      ],
      answer: "다이오드",
      explanation: "다이오드(Diode)는 P형 반도체와 N형 반도체를 접합한 소자로, 순방향으로만 전류를 통과시키는 정류 특성을 가집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 30,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전압계의 측정 범위를 넓히기 위해 전압계와 '직렬'로 연결하여 사용하는 저항기를 무엇이라고 합니까?",
      choices: [
        "배율기",
        "분류기",
        "변압기",
        "전류계"
      ],
      answer: "배율기",
      explanation: "전압계의 측정 범위를 확대하려면 저항을 직렬로 연결하여 전압을 분배시켜야 합니다. 이를 배율기라 하며, 전류계 범위를 넓히는 분류기(병렬 연결)와 구별해야 합니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 31,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "자기장 속에서 도체가 움직이거나 자기장이 변할 때, 도체에 전압이 유도되는 현상을 무엇이라고 합니까?",
      choices: [
        "전자기 유도",
        "정전 유도",
        "자기 포화",
        "히스테리시스"
      ],
      answer: "전자기 유도",
      explanation: "전자기 유도는 코일 내부를 통과하는 자속이 변할 때 기전력(전압)이 발생하는 현상으로, 발전기와 변압기의 기본 원리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 32,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전력량(Wh)은 전력(W)에 사용한 시간(h)을 곱한 값과 같다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "전력량은 일정 시간 동안 사용한 전기에너지를 의미하며, 전력(W) × 시간(h)으로 계산합니다. (1Wh = 3600J)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 33,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 '비정현파' 교류를 구성하는 성분이 '아닌' 것은 무엇입니까?",
      choices: [
        "삼각파",
        "직류분",
        "기본파",
        "고조파"
      ],
      answer: "삼각파",
      explanation: "푸리에 급수에 따르면 비정현파는 '직류분 + 기본파 + 고조파'의 합으로 표현됩니다. 삼각파는 비정현파의 한 종류(파형)일 뿐 구성 요소가 아닙니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 34,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "납축전지의 전해액으로는 '묽은 황산'을 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "납축전지는 양극에 과산화납, 음극에 납, 그리고 전해액으로 비중 약 1.2~1.3 정도의 묽은 황산을 사용하는 2차 전지입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 35,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 기기 철심 재료로 '규소 강판'을 사용하는 주된 이유는 무엇을 줄이기 위해서입니까?",
      choices: [
        "히스테리시스손",
        "와류손",
        "동손",
        "기계손"
      ],
      answer: "히스테리시스손",
      explanation: "철심에 규소를 섞으면 히스테리시스 손실이 줄어들고, 철심을 얇게 썰어 적층(성층)하면 와류손(맴돌이 전류 손실)이 줄어듭니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 36,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 자석의 성질인 '자화'가 가장 잘 일어나는 강자성체 물질에 속하지 '않는' 것은?",
      choices: [
        "니켈",
        "코발트",
        "철",
        "구리"
      ],
      answer: "구리",
      explanation: "강자성체는 자석에 잘 붙는 물질로 철, 니켈, 코발트, 망간 등이 있습니다. 구리는 반자성체(또는 상자성체)에 속하여 자석에 잘 붙지 않습니다.",
      examInfo: {
        year: 2016,
        round: "4회"
      }
    },
    {
      id: 37,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전하(전기량)의 단위는 무엇이며, 기호 C로 표시합니까?",
      choices: [
        "쿨롱 (Coulomb)",
        "헨리 (Henry)",
        "패럿 (Farad)",
        "와트 (Watt)"
      ],
      answer: "쿨롱 (Coulomb)",
      explanation: "전하의 양을 나타내는 단위는 쿨롱(C)입니다. 1A의 전류가 1초 동안 흐를 때 이동한 전하량을 1C라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 38,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전지를 '직렬'로 연결하면 전체 전압은 변하지 않고, 사용할 수 있는 용량(시간)만 늘어난다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전지를 직렬로 연결하면 전압이 더해져 높아집니다. 전압은 그대로 두고 용량을 늘리려면 '병렬'로 연결해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 39,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "유도 전동기에서 회전 자계의 속도(동기 속도)와 실제 회전자의 속도 차이를 비율로 나타낸 것을 무엇이라고 합니까?",
      choices: [
        "슬립 (Slip)",
        "역률 (Power Factor)",
        "효율 (Efficiency)",
        "토크 (Torque)"
      ],
      answer: "슬립 (Slip)",
      explanation: "유도 전동기는 구조상 회전자가 동기 속도보다 조금 늦게 돕니다. 이 속도 차이의 비율을 슬립이라고 하며, 정지 시 1, 동기 속도 회전 시 0이 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 40,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "'정류기(Rectifier)'는 직류(DC) 전원을 교류(AC) 전원으로 변환해 주는 장치이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "정류기는 교류(AC)를 직류(DC)로 바꾸는 장치입니다. 반대로 직류를 교류로 바꾸는 장치는 '인버터(Inverter)'라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 41,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "물질마다 전류의 흐름을 방해하는 정도가 다릅니다. 길이 1m, 단면적 1m²인 물질이 가지는 고유한 저항값을 무엇이라고 합니까?",
      choices: [
        "고유 저항 (저항률)",
        "컨덕턴스",
        "절연 저항",
        "접촉 저항"
      ],
      answer: "고유 저항 (저항률)",
      explanation: "물질의 종류에 따라 정해지는 저항의 기준값을 고유 저항(또는 비저항)이라고 하며, 단위는 Ω·m를 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 42,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "직선 도선에 전류가 흐를 때, 도선 주위에 생기는 자기장의 방향을 결정하는 법칙은 무엇입니까?",
      choices: [
        "앙페르의 오른나사 법칙",
        "렌츠의 법칙",
        "플레밍의 왼손 법칙",
        "패러데이의 법칙"
      ],
      answer: "앙페르의 오른나사 법칙",
      explanation: "전류가 흐르는 방향으로 나사를 진행시킬 때, 나사를 돌리는 방향이 곧 자기장의 방향이라는 법칙입니다. (오른손 엄지가 전류, 나머지 손가락이 자기장)",
      examInfo: {
        year: 2017,
        round: "1회"
      }
    },
    {
      id: 43,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "금속관 공사에서 전선을 연결할 때는 관 내부에서 전선을 접속(연결)해도 된다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전선관(금속관, 합성수지관 등) 내부에서는 전선의 접속점을 만들면 안 됩니다. 접속은 반드시 정크션 박스(Junction Box)나 아울렛 박스 내에서 해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 44,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "1차 전지(건전지 등)와 달리 충전하여 재사용할 수 있는 전지를 무엇이라고 합니까?",
      choices: [
        "2차 전지",
        "연료 전지",
        "태양 전지",
        "볼타 전지"
      ],
      answer: "2차 전지",
      explanation: "화학 에너지를 전기 에너지로 바꾸는 것을 방전, 반대로 전기를 가해 화학 에너지로 저장하는 것을 충전이라 하며, 충방전이 가능한 전지를 2차 전지(축전지)라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 45,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 '전압'의 단위로 사용되는 것은 무엇입니까?",
      choices: [
        "V (볼트)",
        "A (암페어)",
        "W (와트)",
        "Hz (헤르츠)"
      ],
      answer: "V (볼트)",
      explanation: "전압은 전기적인 위치 에너지의 차이(전위차)를 의미하며 단위는 볼트(V)입니다. (A:전류, W:전력, Hz:주파수)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 46,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "동기 발전기는 일정한 속도(동기 속도)로 회전하며 교류 전력을 생산하는 기기이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "동기 발전기는 회전자가 고정된 주파수와 동기화된 속도로 회전하며 전력을 생산합니다. 발전소에서 사용하는 대부분의 대형 발전기가 이에 해당합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 47,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "도체에 흐르는 전류를 방해하는 성질을 '저항'이라고 합니다. 이 저항의 단위 기호는 무엇일까요?",
      choices: [
        "Ω (옴)",
        "F (패럿)",
        "H (헨리)",
        "J (줄)"
      ],
      answer: "Ω (옴)",
      explanation: "독일의 물리학자 옴의 이름을 따서 저항의 단위로 옴(Ω)을 사용합니다. 1Ω은 1V 전압을 걸었을 때 1A의 전류가 흐르는 저항값입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 48,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "조명 설비에서 광원으로부터 나오는 빛의 총량을 나타내는 '광속'의 단위는 무엇입니까?",
      choices: [
        "루멘 (lm)",
        "럭스 (lx)",
        "칸델라 (cd)",
        "니트 (nt)"
      ],
      answer: "루멘 (lm)",
      explanation: "광속(Luminous Flux)은 광원에서 나오는 빛의 총량을 뜻하며 루멘(lm)을 씁니다. (럭스: 조도, 칸델라: 광도, 니트: 휘도)",
      examInfo: {
        year: 2017,
        round: "2회"
      }
    },
    {
      id: 49,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 전기에서 1초 동안 반복되는 사이클의 횟수를 주파수(Hz)라고 하며, 1개의 사이클이 완성되는 데 걸리는 시간을 [   ]라고 합니다.",
      choices: [
        "주기",
        "파장",
        "진폭",
        "위상"
      ],
      answer: "주기",
      explanation: "주파수(f)와 주기(T)는 역수 관계입니다(T=1/f). 예를 들어 60Hz 전기는 1초에 60번 진동하며, 주기는 1/60초입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 50,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "회로에 흐르는 전류를 측정하기 위해서 전류계는 부하와 반드시 '병렬'로 연결해야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전류계는 회로를 끊고 그 사이에 연결하여 전류가 통과하도록 '직렬'로 연결해야 합니다. (전압계는 병렬로 연결)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 51,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "변압기는 1차 코일에 흐르는 전류가 변할 때, 철심을 통해 2차 코일에 기전력이 유도되는 [   ] 현상을 이용한 기기입니다.",
      choices: [
        "상호 유도",
        "정전 유도",
        "자기 포화",
        "와류 손실"
      ],
      answer: "상호 유도",
      explanation: "변압기는 전자기 유도 중에서도, 한쪽 코일의 자기장 변화가 인접한 다른 코일에 전압을 유도하는 '상호 유도 작용'을 원리로 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 52,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "3상 교류 회로에서 '델타(△) 결선'을 하면, 선간 전압과 상전압의 크기는 서로 같다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "델타(△) 결선에서는 선간 전압과 상전압이 같습니다(Vl = Vp). 반면 선전류는 상전류보다 √3배 큽니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 53,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전기 기기의 금속제 외함에 접지(Grounding)를 하는 주된 목적은 기기의 성능을 높이기 위해서이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "접지의 가장 주된 목적은 누전 시 전류를 대지로 흘려보내 인체의 '감전 사고를 방지'하고 기기를 보호하는 것입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 54,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "금속 전선관 공사를 할 때, 관을 구부려 원하는 모양(굴곡)을 만들기 위해 사용하는 공구는 무엇입니까?",
      choices: [
        "히키 (Hickey)",
        "오스터 (Oster)",
        "리머 (Reamer)",
        "클리퍼 (Clipper)"
      ],
      answer: "히키 (Hickey)",
      explanation: "금속관을 구부릴(벤딩) 때는 히키(Hickey)나 파이프 벤더를 사용합니다. (오스터: 나사 내기, 리머: 관 입구 다듬기, 클리퍼: 굵은 전선 절단)",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 55,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전류계의 측정 범위를 넓히기 위해 전류계와 '병렬'로 연결하여 사용하는 저항기를 무엇이라고 합니까?",
      choices: [
        "분류기",
        "배율기",
        "변압기",
        "유도기"
      ],
      answer: "분류기",
      explanation: "큰 전류가 흐를 때 전류계가 타지 않도록, 저항(분류기)을 병렬로 연결하여 전류를 나누어 흐르게 하는 원리입니다. (배율기는 전압계와 직렬)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 56,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "직류 전동기가 회전할 때 발생하는 '역기전력'은 회전 속도가 빠를수록 작아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "직류 전동기의 역기전력(E)은 회전 속도(N)와 자속(Φ)에 비례합니다. 즉, 회전 속도가 빨라질수록 역기전력도 커집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 57,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "평행판 콘덴서의 정전용량(C)은 극판의 면적이 넓을수록 커지고, 극판 사이의 [   ]이/가 멀어질수록 작아집니다.",
      choices: [
        "간격",
        "전압",
        "전류",
        "저항"
      ],
      answer: "간격",
      explanation: "정전용량 C = ε(A/d)입니다. 즉, 유전율(ε)과 면적(A)에는 비례하고, 극판 간격(d)에는 반비례합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 58,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속 전선관을 절단한 후, 전선의 피복이 손상되지 않도록 관의 안쪽 날카로운 부분을 다듬는 데 사용하는 공구는?",
      choices: [
        "리머 (Reamer)",
        "오스터 (Oster)",
        "노크아웃 펀치",
        "파이프 렌치"
      ],
      answer: "리머 (Reamer)",
      explanation: "금속관 절단면의 거친 부분을 매끄럽게 다듬는 공구를 리머라고 합니다. (오스터는 나사산을 낼 때 사용)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 59,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "코일(인덕터)은 흐르는 전류가 급격히 변하는 것을 막으려는 성질(유도 기전력 발생)을 가지고 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "코일은 전류가 변하면 그 변화를 방해하는 방향으로 유도 기전력을 만들어냅니다. 이를 렌츠의 법칙이라고 하며, 평활 회로 등에 이용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 60,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "복도나 계단처럼 2개의 장소에서 전등 1개를 켜고 끌 수(점멸) 있도록 배선할 때 필요한 스위치는?",
      choices: [
        "3로 스위치",
        "단로 스위치",
        "4로 스위치",
        "타임 스위치"
      ],
      answer: "3로 스위치",
      explanation: "2개소 점멸 회로에는 '3로 스위치' 2개가 필요합니다. (참고: 3개소 이상에서 제어하려면 3로 스위치 사이에 4로 스위치를 추가합니다.)",
      examInfo: {
        year: 2015,
        round: "4회"
      }
    },
    {
      id: 61,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속관 공사에서 관을 서로 연결하거나 관과 부속품을 연결할 때 사용하는 '커플링(Coupling)'은 관의 바깥지름보다 약 몇 배 이상 깊게 끼워야 할까요?",
      choices: [
        "1.2배",
        "2.5배",
        "3.0배",
        "0.8배"
      ],
      answer: "1.2배",
      explanation: "관의 연결 부분은 튼튼해야 하므로, 커플링 안쪽으로 관의 바깥지름의 약 1.2배 이상 깊이까지 삽입하여 접속해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 62,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "납축전지의 용량을 나타내는 단위는 Ah(암페어 아워)를 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "축전지 용량은 '방전 전류(A) × 방전 시간(h)'으로 나타내며 단위는 Ah입니다. (예: 100Ah는 1A로 100시간, 또는 10A로 10시간 쓸 수 있는 양)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 63,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "3상 유도 전동기의 회전 방향을 반대로 바꾸려면, 전원선 3가닥(R, S, T) 중 [   ]가닥의 연결을 서로 바꾸면 됩니다.",
      choices: [
        "2",
        "1",
        "3",
        "모든"
      ],
      answer: "2",
      explanation: "3상 전원 중 임의의 2선(예: R과 S, 또는 S와 T)을 서로 바꿔 연결하면 회전 자계의 방향이 반대가 되어 모터가 역회전합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 64,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 기기 내부에서 절연유(기름)의 온도 상승이나 가스 발생 등을 감지하여 변압기 고장을 보호하는 계전기는?",
      choices: [
        "부흐홀츠 계전기",
        "차동 계전기",
        "과전류 계전기",
        "지락 계전기"
      ],
      answer: "부흐홀츠 계전기",
      explanation: "부흐홀츠 계전기는 유입 변압기 내부 고장 시 발생하는 가스나 유류의 흐름을 감지하여 동작하는 기계적 보호 장치입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 65,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "가공 전선로의 지지물(전봇대 등)을 세울 때, 땅에 묻히는 깊이는 일반적으로 지지물 전체 길이의 1/6 이상이어야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "전주가 넘어지지 않도록 충분히 깊게 묻어야 하며, 표준 깊이는 전장(전체 길이)의 6분의 1 이상입니다. (단, 15m 초과 시에는 2.5m 이상)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 66,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 전선 접속 시 전선의 전기 저항을 증가시키지 않기 위해 사용하는 접속 기구가 '아닌' 것은?",
      choices: [
        "와이어 스트리퍼",
        "슬리브",
        "와이어 커넥터",
        "터미널 러그"
      ],
      answer: "와이어 스트리퍼",
      explanation: "와이어 스트리퍼는 전선의 피복을 벗기는 공구입니다. 슬리브, 커넥터, 터미널 러그는 전선을 접속(연결)할 때 사용하는 자재입니다.",
      examInfo: {
        year: 2017,
        round: "3회"
      }
    },
    {
      id: 67,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속관 공사에서 전선의 피복 손상을 방지하기 위해 관 끝부분에 끼우는 부속품은 무엇입니까?",
      choices: [
        "부싱 (Bushing)",
        "로크 너트",
        "커플링",
        "노멀 밴드"
      ],
      answer: "부싱 (Bushing)",
      explanation: "금속관 절단면의 날카로운 부분으로부터 전선 피복을 보호하기 위해 관 끝단에 부싱을 끼웁니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 68,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "단상 유도 전동기 중 기동 토크가 가장 큰 것은 '반발 기동형'이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "단상 유도 전동기의 기동 토크 크기 순서는 '반발 기동형 > 반발 유도형 > 콘덴서 기동형 > 분상 기동형 > 셰이딩 코일형'입니다. (암기팁: 반콘분셰)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 69,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "변압기의 철심(Core)은 규소 강판을 겹쳐서 만듭니다. 이렇게 얇은 판을 여러 장 겹치는(성층) 이유는 무엇을 줄이기 위해서일까요?",
      choices: [
        "와류손 (맴돌이 전류 손실)",
        "히스테리시스손",
        "동손",
        "유전체손"
      ],
      answer: "와류손 (맴돌이 전류 손실)",
      explanation: "철심 내부에서 맴도는 전류(와전류)로 인한 열 손실을 줄이기 위해 절연된 얇은 강판을 겹쳐서 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 70,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "반도체 소자인 SCR(실리콘 제어 정류기)의 단자 3개는 애노드(A), 캐소드(K), 그리고 [   ]입니다.",
      choices: [
        "게이트 (G)",
        "베이스 (B)",
        "컬렉터 (C)",
        "이미터 (E)"
      ],
      answer: "게이트 (G)",
      explanation: "SCR은 애노드와 캐소드 사이에 전압을 걸고, 게이트(Gate)에 신호를 주어 전류를 흐르게 하는 3단자 사이리스터입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 71,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "가공 전선로에서 지지물(전주)을 보호하기 위해 설치하는 '지선(Stay Wire)'의 안전율은 2.5 이상이어야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "지선은 전주가 쓰러지지 않도록 지탱하는 중요한 설비이므로 안전율을 2.5 이상으로 하여 충분히 튼튼하게 설치해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 72,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "주택이나 아파트 등 저압 옥내 배선 공사에서 사용할 수 '없는' 전선 굵기(단면적)는?",
      choices: [
        "1.5㎟",
        "2.5㎟",
        "4.0㎟",
        "6.0㎟"
      ],
      answer: "1.5㎟",
      explanation: "저압 옥내 배선에는 일반적으로 단면적 2.5㎟ 이상의 연동선(또는 이와 동등 이상의 세기 및 굵기)을 사용해야 합니다.",
      examInfo: {
        year: 2016,
        round: "4회"
      }
    },
    {
      id: 73,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "가공 전선로에서 지지물과 전선 사이를 절연하고 전선을 지지하는 역할을 하는 것은 무엇입니까?",
      choices: [
        "애자",
        "완금",
        "지선",
        "변압기"
      ],
      answer: "애자",
      explanation: "애자(Insulator)는 전기가 통하지 않는 절연체로 만들어져, 전선이 지지물(전봇대)을 통해 땅으로 누전되는 것을 막아줍니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 74,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "변압기는 2차측(부하측)을 개방(Open)한 상태에서 1차측에 정격 전압을 가하면 '무부하 시험'을 할 수 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "무부하 시험은 2차측에 아무것도 연결하지 않은 상태에서 진행하며, 이를 통해 변압기의 철손(히스테리시스손+와류손)과 여자 전류를 알 수 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 75,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 회로에서 유효전력(P)과 무효전력(Pr)을 벡터 합한 전체 전력을 [   ] 전력이라고 합니다.",
      choices: [
        "피상",
        "순시",
        "최대",
        "평균"
      ],
      answer: "피상",
      explanation: "피상 전력(Pa)은 전압과 전류의 실효값을 단순히 곱한 값으로, 단위는 VA(볼트암페어)를 사용합니다. (Pa = √(P² + Pr²))",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 76,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전기 기기 외함의 접지 공사 시, 접지선은 가스관이나 수도관과 함께 묶어서 시공하는 것이 원칙이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "가스관은 폭발 위험이 있어 접지극으로 사용할 수 없습니다. 수도관은 특정 조건(저항값 등)을 만족할 때만 제한적으로 사용 가능합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 77,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 빛을 받으면 전기가 발생하는 '광전 효과'를 이용한 다이오드는 무엇입니까?",
      choices: [
        "포토 다이오드",
        "제너 다이오드",
        "발광 다이오드 (LED)",
        "터널 다이오드"
      ],
      answer: "포토 다이오드",
      explanation: "포토 다이오드는 빛 에너지를 전기 에너지로 변환하는 센서 역할을 합니다. 반대로 LED는 전기를 빛으로 바꿉니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 78,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "3상 동기 발전기를 병렬 운전할 때 반드시 같지 않아도 되는 조건은?",
      choices: [
        "용량",
        "주파수",
        "위상",
        "전압의 크기"
      ],
      answer: "용량",
      explanation: "병렬 운전 조건은 전압의 크기, 위상, 주파수, 파형이 같아야 합니다. 하지만 발전기 각각의 용량이나 전류 크기는 달라도 운전할 수 있습니다.",
      examInfo: {
        year: 2017,
        round: "3회"
      }
    },
    {
      id: 79,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "3상 4선식 배전 방식에서, 전압선(Line)과 중성선(Neutral) 사이의 전압을 [   ] 전압이라고 합니다.",
      choices: [
        "상",
        "선간",
        "대지",
        "단자"
      ],
      answer: "상",
      explanation: "3상 4선식에서 각 전압선과 중성선 사이를 연결하면 상전압(220V)을 얻을 수 있고, 전압선끼리 연결하면 선간 전압(380V)을 얻습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 80,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "금속 덕트 공사 시, 덕트 내부에는 전선의 접속점이 있어도 무방하다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "금속관 공사와 마찬가지로 금속 덕트 내부에서도 전선의 접속점을 만들면 안 됩니다. 점검 및 유지보수가 어렵고 화재 위험이 있기 때문입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 81,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 전선의 굵기를 결정할 때 고려해야 할 3요소에 해당하지 '않는' 것은?",
      choices: [
        "가격",
        "허용 전류",
        "전압 강하",
        "기계적 강도"
      ],
      answer: "가격",
      explanation: "전선을 선정할 때는 안전하게 흘릴 수 있는 '허용 전류', 전기가 오면서 떨어지는 '전압 강하', 그리고 끊어지지 않는 '기계적 강도'를 최우선으로 고려합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 82,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "교류 회로에서 '어드미턴스(Admittance)'는 전류가 흐르기 쉬운 정도를 나타내며, 임피던스(Z)의 역수이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "임피던스가 전류를 방해하는 전체 저항이라면, 어드미턴스(Y)는 반대로 전류를 잘 흐르게 하는 성질입니다. (Y = 1/Z, 단위: 모[℧] 또는 지멘스[S])",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 83,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "단위 시간(1초) 동안 이동한 전하의 양(Q/t)을 무엇이라고 정의합니까?",
      choices: [
        "전류",
        "전압",
        "전력",
        "저항"
      ],
      answer: "전류",
      explanation: "전류(I)는 전하의 흐름입니다. 1초 동안 1쿨롱(C)의 전하가 이동하면 1암페어(A)의 전류가 흐르는 것입니다. (I = Q/t)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 84,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 반도체 소자를 이용한 '정류 회로'에서 가장 이상적인(효율이 좋은) 파형은?",
      choices: [
        "삼상 전파 정류",
        "단상 반파 정류",
        "단상 전파 정류",
        "삼상 반파 정류"
      ],
      answer: "삼상 전파 정류",
      explanation: "맥동률(Ripple Factor)이 작을수록 직류에 가깝고 효율이 좋습니다. 순서는 '삼상 전파 > 삼상 반파 > 단상 전파 > 단상 반파' 순으로 성능이 좋습니다.",
      examInfo: {
        year: 2017,
        round: "4회"
      }
    },
    {
      id: 85,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 '전선'을 보호하고 전선을 정리하기 위해 사용하는 '금속제'의 함(Box)으로, 내부에서 전선을 접속할 수 '없는' 것은?",
      choices: [
        "풀 박스 (Pull Box)",
        "정크션 박스",
        "아웃렛 박스",
        "스위치 박스"
      ],
      answer: "풀 박스 (Pull Box)",
      explanation: "풀 박스는 전선의 배관 길이가 길거나 굴곡이 많을 때 전선을 쉽게 당기기(Pull) 위해 설치하는 함입니다. 원칙적으로 접속점이 없어야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 86,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "RLC 직렬 회로에서 유도성 리액턴스(XL)가 용량성 리액턴스(XC)보다 크면, 전체 회로는 '콘덴서'와 같은 성질을 가진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "XL(코일 성분)이 XC(콘덴서 성분)보다 크면, 전체 회로는 '유도성(코일)' 성질을 가지게 되어 전류가 전압보다 뒤지는 지상 회로가 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 87,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "직류 발전기에서 전기자가 회전하면서 만든 교류를 직류로 바꾸어 주는 핵심 부품은 '정류자'와 [   ]입니다.",
      choices: [
        "브러시",
        "계자",
        "철심",
        "베어링"
      ],
      answer: "브러시",
      explanation: "정류자는 회전하면서 극성을 바꿔주고, 브러시는 정류자에 접촉하여 발생된 전기를 외부 회로로 전달하는 역할을 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 88,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전선의 색상을 구분할 때, 보호 도체(PE, 접지선)는 반드시 '녹색과 노란색'이 섞인 색을 사용해야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "KEC(한국전기설비규정)에 따라 보호 도체(접지선)는 녹색-노란색 교차 무늬를 사용해야 하며, 중성선(N)은 파란색을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 89,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "물질 내에서 자속이 통과하기 어려운 정도를 나타내는 '자기 저항'의 단위는 무엇입니까?",
      choices: [
        "AT/Wb",
        "Wb/m²",
        "H/m",
        "AT/m"
      ],
      answer: "AT/Wb",
      explanation: "자기 저항(R)은 기자력(F)을 자속(Φ)으로 나눈 값입니다. 기자력의 단위 AT(암페어턴)와 자속의 단위 Wb(웨버)를 사용하여 AT/Wb가 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 90,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 전선을 접속할 때 사용하는 '쥐꼬리 접속' 후에 접속 부분을 보호하고 절연하기 위해 사용하는 부품은?",
      choices: [
        "와이어 커넥터",
        "터미널 러그",
        "링 슬리브",
        "케이블 타이"
      ],
      answer: "와이어 커넥터",
      explanation: "박스 내에서 가는 전선을 꼬아서 접속(쥐꼬리 접속)한 후에는, 풀리지 않게 고정하고 절연 처리를 하기 위해 와이어 커넥터를 씌웁니다.",
      examInfo: {
        year: 2015,
        round: "1회"
      }
    }
  ],
  9: [ // 전산응용기계제도기능사
    {
      id: 1,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "금속 재료의 성질 중, 재료가 파괴되지 않고 가늘고 길게 늘어나는 성질을 연성(Ductility)이라고 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "연성은 금속을 잡아당겼을 때 길게 늘어나는 성질이며, 전성은 얇게 펴지는 성질입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 2,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "열처리 방법 중 담금질(Quenching)은 강을 연하게 하여 가공성을 높이기 위한 목적으로 실시한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "담금질(Quenching)은 강을 급랭시켜 경도와 강도를 높이기 위한 열처리입니다. 강을 연하게 하는 것은 풀림(Annealing)입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 3,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "탄소강에 포함된 5대 원소에 해당하지 않는 것은?",
      choices: [
        "탄소(C)",
        "규소(Si)",
        "망간(Mn)",
        "니켈(Ni)"
      ],
      answer: "니켈(Ni)",
      explanation: "탄소강의 5대 원소는 탄소(C), 규소(Si), 망간(Mn), 인(P), 황(S)입니다. 니켈(Ni)은 합금 원소로 주로 사용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 4,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "구리(Cu)와 아연(Zn)을 주성분으로 하는 합금으로, 전연성이 좋고 가공하기 쉬워 장식품이나 탄피 등에 사용되는 것은?",
      choices: [
        "황동",
        "청동",
        "주철",
        "두랄루민"
      ],
      answer: "황동",
      explanation: "구리와 아연의 합금은 황동(Brass)이며, 구리와 주석의 합금은 청동(Bronze)입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 5,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "주철의 일반적인 성질에 대한 설명으로 틀린 것은?",
      choices: [
        "주조성이 우수하다.",
        "압축 강도가 인장 강도보다 크다.",
        "충격에 강하고 인성이 크다.",
        "마찰 저항이 우수하다."
      ],
      answer: "충격에 강하고 인성이 크다.",
      explanation: "주철은 탄소 함유량이 많아 경도가 높고 압축 강도가 크지만, 인성이 부족하여 충격에 약하고 잘 깨지는 취성이 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 6,
      certificationId: 9,
      type: "BLANK",
      source: "REAL_CBT",
      question: "공구의 합금강을 담금질 및 뜨임처리하여 개선되는 재질의 특성이 아닌 것은?",
      choices: [
        "조직의 균질화",
        "경도 조절",
        "가공성 향상",
        "취성 증가"
      ],
      answer: "취성 증가",
      explanation: "공구강을 담금질 및 뜨임 처리(조질)하는 주된 목적은 인성을 부여하여 취성(깨지는 성질)을 감소시키고, 조직을 미세화/균질화하며 경도를 조절하는 것입니다. 취성 증가는 담금질만 했을 때 나타나는 현상으로, 뜨임을 통해 이를 제거해야 합니다.",
      examInfo: {
        year: 2014,
        round: "1회"
      }
    },
    {
      id: 7,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "나사의 피치(Pitch)란 나사산과 바로 이웃하는 나사산 사이의 축 방향 거리를 의미한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "피치(Pitch)는 서로 인접한 나사산과 나사산 사이의 축 방향 거리를 뜻하며, 리드(Lead)는 나사가 1회전 했을 때 축 방향으로 이동한 거리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 8,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "베어링은 회전하는 축을 지지하고 마찰을 줄여 회전을 원활하게 하는 기계요소이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "베어링은 축의 하중을 지지하며 마찰 저항을 감소시켜 기계의 회전 운동을 돕는 필수적인 기계요소입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 9,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "축과 보스 양쪽에 모두 키 홈을 가공하여 회전력을 전달하는 가장 일반적인 키는?",
      choices: [
        "안장 키",
        "성크 키(묻힘 키)",
        "납작 키",
        "접선 키"
      ],
      answer: "성크 키(묻힘 키)",
      explanation: "성크 키(Sunk Key, 묻힘 키)는 축과 보스 양쪽에 키 홈을 파서 사용하는 가장 널리 쓰이는 키입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 10,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "너트의 풀림을 방지하기 위한 방법으로 적절하지 않은 것은?",
      choices: [
        "와셔 사용",
        "로크 너트 사용",
        "분할 핀 사용",
        "캡 너트 사용"
      ],
      answer: "캡 너트 사용",
      explanation: "캡 너트는 나사 끝부분을 보호하거나 유체 누설을 방지하고 외관을 좋게 하기 위해 사용하며, 주된 목적이 풀림 방지는 아닙니다. 와셔, 로크 너트, 분할 핀은 대표적인 풀림 방지 요소입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 11,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "두 축이 평행하지도 않고 교차하지도 않는 경우에 사용되는 기어는?",
      choices: [
        "스퍼 기어",
        "베벨 기어",
        "헬리컬 기어",
        "웜 기어"
      ],
      answer: "웜 기어",
      explanation: "웜 기어(Worm Gear)는 두 축이 엇갈려 있는(평행하지도 교차하지도 않음) 경우에 사용되며 큰 감속비를 얻을 수 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 12,
      certificationId: 9,
      type: "BLANK",
      source: "REAL_CBT",
      question: "두 축이 평행하고 거리가 아주 가까울 때 각 속도의 변동 없이 토크를 전달할 경우 사용되는 커플링은?",
      choices: [
        "고정 커플링(fixed coupling)",
        "플랙시블 커플링(flexible coupling)",
        "올덤 커플링(Oldham's coupling)",
        "유니버설 커플링(universal coupling)"
      ],
      answer: "올덤 커플링(Oldham's coupling)",
      explanation: "올덤 커플링은 두 축이 평행하면서 중심선이 약간 어긋나 있을 때 등속도로 동력을 전달하는 데 적합한 커플링입니다.",
      examInfo: {
        year: 2014,
        round: "1회"
      }
    },
    {
      id: 13,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "구성인선(Built-up Edge)은 절삭 깊이가 작고 절삭 속도가 빠를 때 발생하기 쉽다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "구성인선은 연한 재료를 저속으로 가공할 때 발생하기 쉽습니다. 방지하기 위해서는 절삭 속도를 높이고(고속 절삭), 절삭 깊이를 작게 하며, 경사각을 크게 해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 14,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "선반 가공에서 공작물은 회전 운동을 하고, 바이트(공구)는 이송 운동을 하여 가공한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "선반은 공작물을 회전시키고 공구인 바이트를 이동시켜 원통형 형상을 가공하는 공작 기계입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 15,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "밀링 머신에서 커터의 회전 방향과 일감의 이송 방향이 반대인 절삭 방법은?",
      choices: [
        "상향 절삭",
        "하향 절삭",
        "정면 절삭",
        "측면 절삭"
      ],
      answer: "상향 절삭",
      explanation: "상향 절삭은 커터의 회전 방향과 공작물의 이송 방향이 반대이며, 하향 절삭은 두 방향이 같습니다. 상향 절삭은 백래시의 영향이 적다는 장점이 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 16,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "연삭 숫돌의 3요소에 해당하지 않는 것은?",
      choices: [
        "입자",
        "결합제",
        "기공",
        "입도"
      ],
      answer: "입도",
      explanation: "연삭 숫돌의 3요소는 숫돌 입자, 결합제, 기공입니다. 입도는 입자의 크기를 나타내는 성질 중 하나입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 17,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "길이 측정에 사용되는 측정기로, 어미자와 아들자가 있어 정밀한 측정이 가능한 것은?",
      choices: [
        "버니어 캘리퍼스",
        "마이크로미터",
        "다이얼 게이지",
        "블록 게이지"
      ],
      answer: "버니어 캘리퍼스",
      explanation: "버니어 캘리퍼스(Vernier Calipers)는 어미자와 아들자(버니어)의 눈금 차이를 이용해 외경, 내경, 깊이 등을 정밀하게 측정하는 기기입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 18,
      certificationId: 9,
      type: "BLANK",
      source: "REAL_CBT",
      question: "드릴링 머신에서 볼트나 너트를 체결하기 곤란한 표면을 평탄하게 가공하여 체결이 잘되도록 하는 것은?",
      choices: [
        "리밍",
        "태핑",
        "카운터 싱킹",
        "스폿 페이싱"
      ],
      answer: "스폿 페이싱",
      explanation: "스폿 페이싱(Spot Facing)은 볼트 머리나 너트가 닿는 자리의 표면을 평평하게 다듬는 작업입니다. 카운터 싱킹은 접시머리 나사를 위한 원뿔형 가공입니다.",
      examInfo: {
        year: 2014,
        round: "1회"
      }
    },
    {
      id: 19,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "기계 제도에서 보이지 않는 부분의 형상을 나타낼 때는 파선(숨은선)을 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "숨은선은 물체의 보이지 않는 부분을 표현할 때 사용하며, 파선(짧은 점선)으로 그립니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 20,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "치수선과 치수 보조선은 외형선과 구분하기 위해 굵은 실선으로 그린다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "치수선, 치수 보조선, 지시선 등은 외형선(굵은 실선)과 구분하기 위해 가는 실선으로 그립니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 21,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "도면에서 물체의 중심이나 대칭의 기준을 나타내는 데 사용되는 선은?",
      choices: [
        "외형선",
        "숨은선",
        "중심선",
        "파단선"
      ],
      answer: "중심선",
      explanation: "중심선은 물체의 중심, 회전축, 대칭축 등을 나타내며, 가는 1점 쇄선을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 22,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "제도 용지의 크기 중 A2 용지의 면적은 A3 용지의 약 몇 배인가?",
      choices: [
        "2배",
        "3배",
        "4배",
        "0.5배"
      ],
      answer: "2배",
      explanation: "A 계열 용지는 번호가 하나 작아질수록 면적이 2배가 됩니다. 즉, A2는 A3의 2배 크기입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 23,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "물체의 기본 중심선을 기준으로 1/4을 잘라내어 내부와 외부를 동시에 표시하는 단면도는?",
      choices: [
        "전 단면도",
        "한쪽 단면도(반 단면도)",
        "부분 단면도",
        "회전 단면도"
      ],
      answer: "한쪽 단면도(반 단면도)",
      explanation: "한쪽 단면도(반 단면도)는 대칭형 물체의 1/4을 절단하여 중심선을 경계로 절반은 외형, 절반은 단면으로 표시하는 방법입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 24,
      certificationId: 9,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음은 제3각법으로 도시한 물체의 투상도이다. 이 투상법에 대한 설명으로 틀린 것은?",
      choices: [
        "눈 → 투상면 → 물체의 순서로 놓고 투상한다.",
        "평면도는 정면도 위에 배치된다.",
        "물체를 제 1면각에 놓고 투상하는 방법이다.",
        "배면도의 위치는 가장 오른쪽에 배열한다."
      ],
      answer: "물체를 제 1면각에 놓고 투상하는 방법이다.",
      explanation: "제3각법은 물체를 제3면각(투상면 뒤쪽)에 놓고 투상하는 방법입니다. 제1면각에 놓고 투상하는 것은 제1각법입니다. 3각법의 배치는 눈-투상면-물체 순서가 맞습니다.",
      examInfo: {
        year: 2014,
        round: "4회"
      }
    },
    {
      id: 25,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "치수 보조 기호 'R'은 원이나 호의 지름을 나타낼 때 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "R은 반지름(Radius)을 나타내는 기호입니다. 지름은 파이(ø) 기호를 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 26,
      certificationId: 9,
      type: "OX",
      source: "AI_GENERATED",
      question: "기하공차 중 진원도는 데이텀(기준)이 필요 없는 단독 형체 공차이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "진원도, 평면도, 원통도 등 모양 공차는 데이텀(기준) 없이 단독으로 규제할 수 있는 단독 형체입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 27,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "구멍의 치수가 축의 치수보다 작아서 조립 시 항상 죔새가 발생하는 끼워맞춤은?",
      choices: [
        "헐거운 끼워맞춤",
        "중간 끼워맞춤",
        "억지 끼워맞춤",
        "상용 끼워맞춤"
      ],
      answer: "억지 끼워맞춤",
      explanation: "억지 끼워맞춤은 구멍이 축보다 작아 강제로 끼워 넣어야 하는 맞춤으로, 항상 죔새가 발생합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 28,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "IT 기본 공차 등급은 총 몇 등급으로 나누어져 있는가?",
      choices: [
        "10등급",
        "15등급",
        "18등급",
        "20등급"
      ],
      answer: "20등급",
      explanation: "IT 공차는 IT01, IT0, IT1 ~ IT18까지 총 20등급으로 구분됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 29,
      certificationId: 9,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기하공차 기호 중 '원통도(Cylindricity)'를 나타내는 기호는?",
      choices: [
        "○",
        "⌭",
        "◎",
        "⫽"
      ],
      answer: "⌭",
      explanation: "원통도는 원통 형상의 정밀도를 나타내며 기호는 ⌭입니다. ○는 진원도, ◎는 동심도, ⫽는 평행도입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 30,
      certificationId: 9,
      type: "BLANK",
      source: "REAL_CBT",
      question: "자동차의 스티어링 장치, 수치제어 공작기계의 공구대, 이송 장치 등에 사용되는 나사는?",
      choices: [
        "둥근나사",
        "볼나사",
        "유니파이나사",
        "미터나사"
      ],
      answer: "볼나사",
      explanation: "볼 나사(Ball Screw)는 나사산과 너트 사이에 강구(Ball)를 넣어 구름 접촉을 하게 한 것으로, 마찰이 적고 정밀한 이송이 가능하여 CNC 공작기계 등에 널리 쓰입니다.",
      examInfo: {
        year: 2014,
        round: "1회"
      }
    }
  ]
};

// Mock 학습 세션 데이터
const mockLearningSessions = [];

// Mock 복습 카드 데이터
const mockReviewCards = [];

// 로컬 스토리지 키
const STORAGE_KEYS = {
  USERS: 'mock_users',
  SESSIONS: 'mock_sessions',
  REVIEW_CARDS: 'mock_review_cards',
  LEARNING_START_DATE: 'learning_start_date', // 사용자별 학습 시작 날짜
  FRIEND_RELATIONS: 'mock_friend_relations', // 친구 관계
  REVIEW_QUESTIONS: 'mock_review_questions', // 복습 문제
};

// AsyncStorage에서 데이터 로드 (비동기)
const loadFromStorage = async (key, defaultValue = []) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// AsyncStorage에 데이터 저장 (비동기)
const saveToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// 초기화: AsyncStorage에 Mock 데이터 저장 (처음 한 번만)
const initializeMockData = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      await saveToStorage(STORAGE_KEYS.USERS, mockUsers);
      await saveToStorage(STORAGE_KEYS.SESSIONS, mockLearningSessions);
      await saveToStorage(STORAGE_KEYS.REVIEW_CARDS, mockReviewCards);
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

// 앱 시작 시 초기화
initializeMockData();

export const mockData = {
  users: mockUsers,
  certifications: mockCertifications,
  flashCards: mockFlashCards,
  questions: mockQuestions,
  learningSessions: mockLearningSessions,
  reviewCards: mockReviewCards,
  companies: mockCompanies,
  tutorialCertifications: mockTutorialCertifications,
  departmentCertStats: mockDepartmentCertStats,
  friendsData: mockFriendsData,
  maskName,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
};
