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
];

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
  learningSessions: mockLearningSessions,
  reviewCards: mockReviewCards,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
};
