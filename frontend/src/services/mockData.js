// Mock 데이터 - 프론트엔드 개발용
// 백엔드가 준비되면 이 파일을 삭제하고 실제 API를 사용합니다

import AsyncStorage from '@react-native-async-storage/async-storage';

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
  },
];

// Mock 자격증 데이터
const mockCertifications = [
  {
    id: 1,
    name: '정보처리기사',
    category: 'IT',
    description: '정보처리 관련 국가기술자격증',
    recommendedSchools: ['공과대학'],
    recommendedDepartments: ['컴퓨터공학과', '정보통신공학과'],
  },
  {
    id: 2,
    name: 'SQLD',
    category: 'IT',
    description: 'SQL 개발자 자격증',
    recommendedSchools: ['공과대학'],
    recommendedDepartments: ['컴퓨터공학과', '데이터과학과'],
  },
  {
    id: 3,
    name: '컴퓨터활용능력',
    category: 'IT',
    description: '컴퓨터 활용 능력 자격증',
  },
  {
    id: 4,
    name: '네트워크관리사',
    category: 'IT',
    description: '네트워크 관리 전문가 자격증',
  },
];

// 튜토리얼용 기업 목록
const mockCompanies = [
  { id: 1, name: '대기업(삼성, LG 등)' },
  { id: 2, name: 'IT 기업(네이버, 카카오 등)' },
  { id: 3, name: '공기업' },
  { id: 4, name: '스타트업' },
  { id: 5, name: '모르겠습니다' },
];

// 튜토리얼용 자격증 목록
const mockTutorialCertifications = [
  { id: 1, name: '정보처리기사' },
  { id: 2, name: 'SQLD' },
  { id: 3, name: '컴퓨터활용능력' },
  { id: 4, name: '네트워크관리사' },
  { id: 5, name: '모르겠습니다' },
];

// 학과별 자격증 선택 통계 (Mock 데이터)
// 실제로는 서버에서 같은 학과+학년 사용자들의 선택 데이터를 집계
const mockDepartmentCertStats = {
  '로봇설계과': {
    1: [
      { certificationId: 1, name: '정보처리기사', percentage: 42 },
      { certificationId: 2, name: 'SQLD', percentage: 31 },
      { certificationId: 3, name: '컴퓨터활용능력', percentage: 19 },
    ],
    2: [
      { certificationId: 1, name: '정보처리기사', percentage: 45 },
      { certificationId: 2, name: 'SQLD', percentage: 28 },
      { certificationId: 3, name: '컴퓨터활용능력', percentage: 22 },
    ],
    3: [
      { certificationId: 1, name: '정보처리기사', percentage: 48 },
      { certificationId: 2, name: 'SQLD', percentage: 30 },
      { certificationId: 3, name: '컴퓨터활용능력', percentage: 15 },
    ],
  },
  '로봇제어과': {
    1: [
      { certificationId: 1, name: '정보처리기사', percentage: 40 },
      { certificationId: 2, name: 'SQLD', percentage: 35 },
      { certificationId: 4, name: '네트워크관리사', percentage: 18 },
    ],
    2: [
      { certificationId: 1, name: '정보처리기사', percentage: 43 },
      { certificationId: 2, name: 'SQLD', percentage: 32 },
      { certificationId: 4, name: '네트워크관리사', percentage: 20 },
    ],
    3: [
      { certificationId: 1, name: '정보처리기사', percentage: 46 },
      { certificationId: 2, name: 'SQLD', percentage: 30 },
      { certificationId: 4, name: '네트워크관리사', percentage: 17 },
    ],
  },
  '로봇소프트웨어과': {
    1: [
      { certificationId: 1, name: '정보처리기사', percentage: 50 },
      { certificationId: 2, name: 'SQLD', percentage: 28 },
      { certificationId: 3, name: '컴퓨터활용능력', percentage: 15 },
    ],
    2: [
      { certificationId: 1, name: '정보처리기사', percentage: 52 },
      { certificationId: 2, name: 'SQLD', percentage: 26 },
      { certificationId: 3, name: '컴퓨터활용능력', percentage: 16 },
    ],
    3: [
      { certificationId: 1, name: '정보처리기사', percentage: 55 },
      { certificationId: 2, name: 'SQLD', percentage: 25 },
      { certificationId: 3, name: '컴퓨터활용능력', percentage: 13 },
    ],
  },
  '로봇정보통신과': {
    1: [
      { certificationId: 1, name: '정보처리기사', percentage: 38 },
      { certificationId: 4, name: '네트워크관리사', percentage: 35 },
      { certificationId: 2, name: 'SQLD', percentage: 20 },
    ],
    2: [
      { certificationId: 1, name: '정보처리기사', percentage: 40 },
      { certificationId: 4, name: '네트워크관리사', percentage: 33 },
      { certificationId: 2, name: 'SQLD', percentage: 21 },
    ],
    3: [
      { certificationId: 1, name: '정보처리기사', percentage: 42 },
      { certificationId: 4, name: '네트워크관리사', percentage: 32 },
      { certificationId: 2, name: 'SQLD', percentage: 19 },
    ],
  },
};

// Mock 플래시카드 데이터
const mockFlashCards = {
  1: [ // 정보처리기사
    {
      id: 1,
      front: '데이터베이스의 3단계 스키마 구조는?',
      back: '외부 스키마, 개념 스키마, 내부 스키마',
      certificationId: 1,
    },
    {
      id: 2,
      front: '정규화의 목적은?',
      back: '데이터 중복을 제거하고 데이터 무결성을 보장하기 위함',
      certificationId: 1,
    },
    {
      id: 3,
      front: '트랜잭션의 ACID 속성은?',
      back: 'Atomicity(원자성), Consistency(일관성), Isolation(격리성), Durability(지속성)',
      certificationId: 1,
    },
  ],
  2: [ // SQLD
    {
      id: 4,
      front: 'SELECT 문의 실행 순서는?',
      back: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
      certificationId: 2,
    },
    {
      id: 5,
      front: 'JOIN의 종류는?',
      back: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN',
      certificationId: 2,
    },
  ],
};

// Mock 문제 데이터 (전기기능사 예시)
const mockQuestions = [
  {
    id: 1,
    type: "BLANK",
    source: "AI_GENERATED",
    question: "도체의 전기 저항은 도체의 길이에 비례하고, 도체의 [   ]에 반비례합니다. 빈칸에 들어갈 말은 무엇일까요?",
    choices: [
      "단면적",
      "무게",
      "부피",
      "온도"
    ],
    answer: "단면적",
    explanation: "전기 저항은 전자의 흐름을 방해하는 정도입니다. 도체의 길이가 길수록 방해가 심해져 저항이 커지고, 통로가 넓을수록(단면적이 클수록) 잘 흐르므로 저항은 작아집니다.",
    examInfo: {
      year: null,
      round: null
    }
  },
  {
    id: 2,
    type: "OX",
    source: "AI_GENERATED",
    question: "컨덕턴스(G)는 전류가 얼마나 잘 흐르는지를 나타내는 척도로, 저항(R)의 역수 관계이다.",
    choices: [
      "O",
      "X"
    ],
    answer: "O",
    explanation: "저항(R)은 흐름을 방해하는 성질이고, 컨덕턴스(G)는 흐름을 돕는 성질입니다. 따라서 둘은 G = 1/R의 역수 관계를 가집니다. 단위는 지멘스(S) 또는 모(℧)를 사용합니다.",
    examInfo: {
      year: null,
      round: null
    }
  },
  {
    id: 3,
    type: "OX",
    source: "AI_GENERATED",
    question: "동일한 크기의 저항을 여러 개 '병렬'로 연결할수록 전체 합성 저항값은 커진다.",
    choices: [
      "O",
      "X"
    ],
    answer: "X",
    explanation: "저항을 병렬로 연결하는 것은 전기가 흐를 수 있는 통로를 넓혀주는 것과 같습니다. 따라서 병렬로 연결할수록 전체 합성 저항값은 작아집니다.",
    examInfo: {
      year: null,
      round: null
    }
  },
  {
    id: 4,
    type: "BLANK",
    source: "AI_GENERATED",
    question: "전류가 흐르면 도체에서 열이 발생합니다. 이 열량은 전류의 제곱과 저항, 그리고 [   ]에 비례한다는 법칙을 '줄의 법칙'이라고 합니다.",
    choices: [
      "전압",
      "주파수",
      "시간",
      "단면적"
    ],
    answer: "시간",
    explanation: "줄의 법칙 공식은 H = 0.24I²Rt 입니다. 즉, 발생하는 열량(H)은 전류(I)의 제곱, 저항(R), 그리고 전류가 흐른 시간(t)에 비례합니다.",
    examInfo: {
      year: null,
      round: null
    }
  },
  {
    id: 5,
    type: "BLANK",
    source: "AI_GENERATED",
    question: "두 전하 사이에 작용하는 힘(흡인력 또는 반발력)의 크기는 두 전하량의 곱에 비례하고, 두 전하 사이의 [   ]의 제곱에 반비례합니다.",
    choices: [
      "거리",
      "질량",
      "속도",
      "전위차"
    ],
    answer: "거리",
    explanation: "쿨롱의 법칙에 대한 설명입니다. 자석이나 전하 사이의 힘은 거리가 멀어질수록 급격히 약해지는데, 정확히는 거리의 제곱에 반비례하여 작아집니다.",
    examInfo: {
      year: null,
      round: null
    }
  },
  {
    id: 6,
    type: "BLANK",
    source: "REAL_CBT",
    question: "물질이 평소의 중성 상태에서 전자를 잃거나 얻어서, 전기적인 성질(+전기 또는 -전기)을 띠게 되는 현상을 무엇이라고 합니까?",
    choices: [
      "방전",
      "대전",
      "분극",
      "충전"
    ],
    answer: "대전",
    explanation: "물질 내의 전자가 이동하여 전기의 균형이 깨지면서 전기를 띠게 되는 현상을 '대전'이라고 합니다. 이때 전기를 띤 물체를 대전체라고 부릅니다.",
    examInfo: {
      year: 2014,
      round: "3회"
    }
  }
];

// Mock 학습 세션 데이터
const mockLearningSessions = [];

// Mock 복습 카드 데이터
const mockReviewCards = [];

// 로컬 스토리지 키
const STORAGE_KEYS = {
  USERS: 'mock_users',
  SESSIONS: 'mock_sessions',
  REVIEW_CARDS: 'mock_review_cards',
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
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
};
