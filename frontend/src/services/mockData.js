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

// 튜토리얼용 자격증 목록
const mockTutorialCertifications = [
  { id: 1, name: '자동화설비기능사' },
  { id: 2, name: '전기기능사' },
  { id: 3, name: '프로그래밍기능사' },
  { id: 4, name: '전자기능사' },
  { id: 5, name: '컴활' },
  { id: 6, name: '모르겠습니다' },
  { id: 7, name: '정보처리기능사' },
  { id: 8, name: '정보기기운용기능사' },
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
    name: '백인선',
    department: '정보통신과',
    grade: 2,
    certifications: [3, 2, 5], // 프로그래밍기능사, 전기기능사, 컴활
  },
  {
    id: 2,
    name: '이윤솔',
    department: '소프트웨어과',
    grade: 2,
    certifications: [3, 8, 9, 10], // 프로그래밍기능사, 정보기기운용기능사, ITQ 엑셀, ITQ 한글
  },
  {
    id: 3,
    name: '장승원',
    department: '소프트웨어과',
    grade: 2,
    certifications: [7, 8], // 정보처리기능사, 정보기기운용기능사
  },
  {
    id: 4,
    name: '이소울',
    department: '소프트웨어과',
    grade: 2,
    certifications: [7], // 정보처리기능사
  },
];

// 학과별 자격증 선택 통계 (Mock 데이터)
// 실제로는 서버에서 같은 학과+학년 사용자들의 선택 데이터를 집계
const mockDepartmentCertStats = {
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
  '로봇소프트웨어과': {
    1: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 40 },
      { certificationId: 7, name: '정보처리기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 20 },
    ],
    2: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 42 },
      { certificationId: 7, name: '정보처리기능사', percentage: 28 },
      { certificationId: 5, name: '컴활', percentage: 22 },
    ],
    3: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 45 },
      { certificationId: 7, name: '정보처리기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 15 },
    ],
  },
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
  // 실제 친구 데이터 기반 통계
  '정보통신과': {
    2: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 100 },
      { certificationId: 2, name: '전기기능사', percentage: 100 },
      { certificationId: 5, name: '컴활1급', percentage: 100 },
    ],
  },
  '소프트웨어과': {
    2: [
      { certificationId: 8, name: '정보기기운용기능사', percentage: 67 },
      { certificationId: 7, name: '정보처리기능사', percentage: 67 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 33 },
      { certificationId: 9, name: 'ITQ 엑셀', percentage: 33 },
      { certificationId: 10, name: 'ITQ 한글', percentage: 33 },
    ],
  },
  '로봇소프트웨어과': {
    2: [
      { certificationId: 8, name: '정보기기운용기능사', percentage: 67 },
      { certificationId: 7, name: '정보처리기능사', percentage: 67 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 33 },
      { certificationId: 9, name: 'ITQ 엑셀', percentage: 33 },
      { certificationId: 10, name: 'ITQ 한글', percentage: 33 },
    ],
  },
};

// Mock 플래시카드 데이터 (현재는 비어있음, 필요시 추가)
const mockFlashCards = {};

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
  friendsData: mockFriendsData,
  maskName,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
};
