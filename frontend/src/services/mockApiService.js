// Mock API 서비스 - 백엔드 없이 프론트엔드 개발용
// 실제 백엔드가 준비되면 이 파일을 삭제하고 실제 API 서비스를 사용합니다

import { mockData } from './mockData';

// 간단한 지연 시뮬레이션 (네트워크 요청 느낌)
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock 인증 서비스
export const mockAuthService = {
  // 로그인
  login: async (email, password) => {
    await delay(800);
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }
    
    // Mock에서는 비밀번호 검증 생략 (실제로는 해시 비교)
    if (password.length < 6) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }
    
    // Mock JWT 토큰 생성
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        school: user.school,
        department: user.department,
        grade: user.grade,
        totalXp: user.totalXp,
        streak: user.streak,
      },
    };
  },

  // 회원가입
  register: async (userData) => {
    await delay(1000);
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    
    // 이메일 중복 확인
    if (users.find(u => u.email === userData.email)) {
      throw new Error('이미 존재하는 이메일입니다');
    }
    
    // 새 사용자 생성
    const newUser = {
      id: users.length + 1,
      email: userData.email,
      name: userData.name,
      school: userData.school || '',
      department: userData.department || '',
      grade: parseInt(userData.grade, 10) || 1,
      totalXp: 0,
      streak: 0,
    };
    
    users.push(newUser);
    await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
    
    // Mock JWT 토큰 생성
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        school: newUser.school,
        department: newUser.department,
        grade: newUser.grade,
        totalXp: newUser.totalXp,
        streak: newUser.streak,
      },
    };
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (userId) => {
    await delay(500);
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      school: user.school,
      department: user.department,
      grade: user.grade,
      totalXp: user.totalXp,
      streak: user.streak,
    };
  },
};

// Mock 학습 서비스
export const mockLearningService = {
  // 추천 자격증 조회
  getRecommendations: async (school, department) => {
    await delay(600);
    
    return mockData.certifications.filter(cert => {
      const matchesSchool = !cert.recommendedSchools || 
        cert.recommendedSchools.some(s => school?.includes(s));
      const matchesDept = !cert.recommendedDepartments || 
        cert.recommendedDepartments.includes(department);
      
      return matchesSchool && matchesDept;
    });
  },

  // 플래시카드 조회
  getFlashCards: async (certificationId) => {
    await delay(500);
    
    return mockData.flashCards[certificationId] || [];
  },

  // 학습 세션 시작
  startLearningSession: async (certificationId, userId) => {
    await delay(300);
    
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    const newSession = {
      id: sessions.length + 1,
      userId,
      certificationId,
      startedAt: new Date().toISOString(),
      isCompleted: false,
      cardsStudied: 0,
      xpEarned: 0,
    };
    
    sessions.push(newSession);
    await mockData.saveToStorage(mockData.STORAGE_KEYS.SESSIONS, sessions);
    
    return newSession;
  },

  // 학습 세션 완료
  completeLearningSession: async (sessionId, cardsStudied, xpEarned) => {
    await delay(500);
    
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      session.isCompleted = true;
      session.completedAt = new Date().toISOString();
      session.cardsStudied = cardsStudied;
      session.xpEarned = xpEarned;
      
      // 사용자 XP 업데이트
      const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
      const user = users.find(u => u.id === session.userId);
      if (user) {
        user.totalXp = (user.totalXp || 0) + xpEarned;
        user.streak = (user.streak || 0) + 1;
        await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
      }
      
      await mockData.saveToStorage(mockData.STORAGE_KEYS.SESSIONS, sessions);
    }
    
    return session;
  },

  // 복습 카드 조회
  getReviewCards: async (userId) => {
    await delay(400);
    
    const reviewCards = await mockData.loadFromStorage(mockData.STORAGE_KEYS.REVIEW_CARDS, []);
    return reviewCards.filter(card => card.userId === userId);
  },

  // 복습 카드 추가
  addReviewCard: async (userId, flashCardId) => {
    await delay(300);
    
    const reviewCards = await mockData.loadFromStorage(mockData.STORAGE_KEYS.REVIEW_CARDS, []);
    
    // 이미 존재하는지 확인
    if (reviewCards.find(card => card.userId === userId && card.flashCardId === flashCardId)) {
      return { success: true, message: '이미 복습 리스트에 추가되어 있습니다' };
    }
    
    const newReviewCard = {
      id: reviewCards.length + 1,
      userId,
      flashCardId,
      createdAt: new Date().toISOString(),
      lastReviewedAt: null,
      reviewCount: 0,
    };
    
    reviewCards.push(newReviewCard);
    await mockData.saveToStorage(mockData.STORAGE_KEYS.REVIEW_CARDS, reviewCards);
    
    return { success: true, reviewCard: newReviewCard };
  },
};

// Mock 친구 서비스
export const mockFriendService = {
  // 친구 목록 조회
  getFriends: async (userId) => {
    await delay(600);
    
    // Mock 친구 데이터 (실제로는 DB에서 조회)
    return [
      {
        id: 2,
        name: '친구1',
        school: '테스트대학교',
        department: '컴퓨터공학과',
        totalXp: 800,
        streak: 5,
      },
      {
        id: 3,
        name: '친구2',
        school: '테스트대학교',
        department: '정보통신공학과',
        totalXp: 1200,
        streak: 10,
      },
    ];
  },

  // 친구 랭킹 조회
  getRanking: async (userId) => {
    await delay(500);
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    
    return users
      .map(user => ({
        id: user.id,
        name: user.name,
        totalXp: user.totalXp || 0,
        streak: user.streak || 0,
      }))
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, 10); // Top 10
  },
};
