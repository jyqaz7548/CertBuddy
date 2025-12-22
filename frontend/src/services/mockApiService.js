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

// Mock 문제 서비스
export const mockQuestionService = {
  // 문제 목록 조회 (자격증별)
  getQuestions: async (certificationId) => {
    await delay(500);
    
    // 현재는 전기기능사 예시 데이터만 있음
    // 실제로는 certificationId에 따라 필터링
    return mockData.questions || [];
  },

  // 문제 세션 시작 (학습 시작)
  startQuestionSession: async (certificationId, userId) => {
    await delay(300);
    
    const questions = await mockQuestionService.getQuestions(certificationId);
    
    return {
      sessionId: `session_${Date.now()}`,
      questions,
      startedAt: new Date().toISOString(),
    };
  },

  // 문제 답안 제출 및 결과 저장
  submitAnswer: async (sessionId, questionId, selectedAnswer, isCorrect) => {
    await delay(300);
    
    // Mock에서는 단순히 성공 응답만 반환
    // 실제 백엔드에서는 DB에 저장
    return {
      success: true,
      isCorrect,
      correctAnswer: null, // 실제로는 서버에서 반환
    };
  },

  // 학습 세션 완료
  completeQuestionSession: async (sessionId, results, userId) => {
    await delay(500);
    
    // XP 계산: 문제당 10XP, 틀리면 10XP씩 차감
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    
    // 기본 XP: 문제당 10XP
    const baseXp = totalQuestions * 10;
    // 틀린 문제당 10XP 차감 (문제당 XP 전체 차감)
    const penaltyXp = wrongAnswers * 10;
    // 최종 XP (최소 0XP)
    const xpEarned = Math.max(0, baseXp - penaltyXp);
    
    // 오늘 학습한 XP를 저장 (복습 보너스 계산용, userId별로 저장)
    const todayLearningXp = await mockData.loadFromStorage(
      'mock_today_learning_xp',
      {}
    );
    const userKey = `user_${userId}`;
    if (!todayLearningXp[userKey]) {
      todayLearningXp[userKey] = [];
    }
    todayLearningXp[userKey].push({
      sessionId,
      xp: xpEarned,
      date: new Date().toISOString().split('T')[0], // 오늘 날짜
    });
    await mockData.saveToStorage('mock_today_learning_xp', todayLearningXp);
    
    // 사용자 XP 업데이트
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const user = users.find(u => u.id === userId);
    if (user) {
      user.totalXp = (user.totalXp || 0) + xpEarned;
      user.streak = (user.streak || 0) + 1;
      await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
    }
    
    return {
      success: true,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      baseXp,
      penaltyXp,
      xpEarned,
      sessionId,
    };
  },

  // 복습 문제 목록 조회
  getReviewQuestions: async (userId) => {
    await delay(400);
    
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    
    const userReviewQuestions = reviewQuestions.filter(
      rq => rq.userId === userId && !rq.isCompleted
    );
    
    // 문제 ID로 실제 문제 데이터 가져오기
    const allQuestions = mockData.questions || [];
    const questions = userReviewQuestions
      .map(rq => allQuestions.find(q => q.id === rq.questionId))
      .filter(q => q !== undefined);
    
    return questions;
  },

  // 복습 문제 추가 (틀린 문제를 복습 리스트에 추가)
  addReviewQuestion: async (userId, questionId) => {
    await delay(300);
    
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    
    // 이미 존재하는지 확인
    const existing = reviewQuestions.find(
      rq => rq.userId === userId && rq.questionId === questionId && !rq.isCompleted
    );
    
    if (existing) {
      return { success: true, message: '이미 복습 리스트에 추가되어 있습니다' };
    }
    
    const newReviewQuestion = {
      id: reviewQuestions.length + 1,
      userId,
      questionId,
      createdAt: new Date().toISOString(),
      lastReviewedAt: null,
      reviewCount: 0,
      isCompleted: false,
    };
    
    reviewQuestions.push(newReviewQuestion);
    await mockData.saveToStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      reviewQuestions
    );
    
    return { success: true, reviewQuestion: newReviewQuestion };
  },

  // 복습 문제 완료 처리
  completeReviewQuestion: async (userId, questionId, isCorrect) => {
    await delay(300);
    
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    
    const reviewQuestion = reviewQuestions.find(
      rq => rq.userId === userId && rq.questionId === questionId && !rq.isCompleted
    );
    
    if (reviewQuestion) {
      reviewQuestion.lastReviewedAt = new Date().toISOString();
      reviewQuestion.reviewCount = (reviewQuestion.reviewCount || 0) + 1;
      
      // 정답을 맞췄으면 바로 완료 처리 (1번만 맞추면 완료)
      if (isCorrect) {
        reviewQuestion.isCompleted = true;
      }
      
      await mockData.saveToStorage(
        mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
        reviewQuestions
      );
    }
    
    return { success: true };
  },

  // 복습 세션 시작
  startReviewSession: async (userId) => {
    await delay(300);
    
    const questions = await mockQuestionService.getReviewQuestions(userId);
    
    return {
      sessionId: `review_session_${Date.now()}`,
      questions,
      startedAt: new Date().toISOString(),
      isReview: true,
    };
  },

  // 복습 세션 완료 (보너스 XP 지급)
  completeReviewSession: async (sessionId, results, userId) => {
    await delay(500);
    
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    
    // 복습 모드 XP 계산: 문제당 5XP (일반 학습의 절반), 틀릴 때마다 그 문제의 XP를 차감
    const baseXp = totalQuestions * 5; // 일반 학습의 절반
    const penaltyXp = wrongAnswers * 5; // 틀린 문제당 5XP 차감 (문제당 XP 전체 차감)
    const xpEarned = Math.max(0, baseXp - penaltyXp);
    
    // 사용자 XP 업데이트
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const user = users.find(u => u.id === userId);
    if (user && xpEarned > 0) {
      user.totalXp = (user.totalXp || 0) + xpEarned;
      await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
    }
    
    return {
      success: true,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      baseXp,
      penaltyXp,
      xpEarned,
      bonusXp: xpEarned, // 복습 XP를 보너스 XP로 표시
    };
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
