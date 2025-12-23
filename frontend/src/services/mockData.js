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

// Mock 문제 데이터 (자격증별로 분리)
// certificationId: 2 = 전기기능사
const mockQuestions = {
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
