// Mock API 서비스 - 백엔드 없이 프론트엔드 개발용
// 실제 백엔드가 준비되면 이 파일을 삭제하고 실제 API 서비스를 사용합니다

import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockData } from './mockData';

// 간단한 지연 시뮬레이션 (네트워크 요청 느낌)
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 자격증 ID로 카테고리 반환 (간단한 매핑)
const getCategoryFromId = (id) => {
  if (id === 5) return '국가기술'; // 컴활은 국가기술자격증
  if (id === 9 || id === 10) return 'ITQ';
  if (id >= 1 && id <= 8) return '기능사';
  return '자격증';
};

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
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const paddedId = String(newUserId).padStart(4, '0');
    const newUser = {
      id: newUserId,
      email: userData.email,
      name: userData.name,
      school: userData.school || '',
      department: userData.department || '',
      grade: parseInt(userData.grade, 10) || 1,
      totalXp: 0,
      streak: 0,
      userCode: `CERT-${paddedId}`, // 고유 코드 생성
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
        userCode: newUser.userCode,
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
    
    // 사용자 코드가 없으면 생성
    if (!user.userCode) {
      const paddedId = String(user.id).padStart(4, '0');
      user.userCode = `CERT-${paddedId}`;
      // 저장
      const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].userCode = user.userCode;
        await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
      }
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
      userCode: user.userCode,
    };
  },
};

// Mock 학습 서비스
export const mockLearningService = {
  // 추천 자격증 조회 (같은 학과 학생들의 자격증 기반, 학년 무관)
  getRecommendations: async (school, department, grade) => {
    await delay(600);
    
    const recommendations = [];
    const certMapByName = new Map(); // 이름 기준 중복 제거용
    
    // 1. 같은 학과의 모든 학년 학생들의 자격증 통계 가져오기 (학년 무관)
    if (department) {
      const deptStats = mockData.departmentCertStats[department];
      if (deptStats) {
        // 모든 학년의 통계를 합쳐서 평균 계산 (이름 기준으로 통합)
        const allStatsByName = {};
        
        Object.keys(deptStats).forEach(gradeKey => {
          const stats = deptStats[gradeKey] || [];
          stats.forEach(stat => {
            const certName = stat.name;
            if (!allStatsByName[certName]) {
              allStatsByName[certName] = {
                name: certName,
                percentages: [],
                certificationIds: new Set(), // 어떤 ID들이 이 이름에 해당하는지 추적
              };
            }
            allStatsByName[certName].percentages.push(stat.percentage);
            allStatsByName[certName].certificationIds.add(stat.certificationId);
          });
        });
        
        // 평균 퍼센트 계산하여 자격증 객체로 변환
        Object.keys(allStatsByName).forEach(certName => {
          const stat = allStatsByName[certName];
          const avgPercentage = Math.round(
            stat.percentages.reduce((sum, p) => sum + p, 0) / stat.percentages.length
          );
          // 가장 작은 ID를 대표 ID로 사용
          const minCertId = Math.min(...Array.from(stat.certificationIds));
          const certInfo = mockData.tutorialCertifications.find(c => c.id === minCertId);
          if (certInfo) {
            certMapByName.set(certName, {
              id: minCertId,
              name: certName,
              category: getCategoryFromId(minCertId),
              description: `같은 과 학생들의 ${avgPercentage}%가 취득했어요`,
              percentage: avgPercentage,
              source: 'department_stats',
            });
          }
        });
      }
    }
    
    // 2. 같은 학과 친구들의 실제 자격증도 추가 (이름 기준 중복 제거)
    if (department) {
      const sameDeptFriends = mockData.friendsData.filter(
        friend => friend.department === department
      );
      
      sameDeptFriends.forEach(friend => {
        friend.certifications.forEach(certId => {
          const certInfo = mockData.tutorialCertifications.find(c => c.id === certId);
          if (certInfo) {
            const certName = certInfo.name;
            // 이미 추가된 자격증인지 이름으로 확인
            if (!certMapByName.has(certName)) {
              const maskedName = mockData.maskName(friend.name);
              certMapByName.set(certName, {
                id: certId,
                name: certName,
                category: getCategoryFromId(certId),
                description: `${maskedName}님이 취득했어요`,
                source: 'friend',
                friendName: maskedName,
              });
            }
          }
        });
      });
    }
    
    return Array.from(certMapByName.values());
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
  // 문제가 있는 자격증 목록 조회
  getAvailableCertifications: async () => {
    await delay(300);
    
    // 문제가 있는 자격증만 필터링
    const availableCertIds = Object.keys(mockData.questions || {}).map(id => parseInt(id));
    const certifications = mockData.tutorialCertifications.filter(cert => 
      availableCertIds.includes(cert.id)
    );
    
    return certifications;
  },

  // 자격증별 학습률 조회
  getCertificationProgress: async (certificationId, userId) => {
    await delay(300);
    
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    
    // 해당 자격증의 완료된 학습 세션만 필터링
    const completedSessions = sessions.filter(s => 
      s.userId === userId && 
      s.certificationId === certificationId && 
      s.isCompleted === true &&
      s.isReview === false
    );
    
    if (completedSessions.length === 0) {
      return {
        certificationId,
        progress: 0,
        completedDays: 0,
        totalDays: 15,
      };
    }
    
    // 세션에 저장된 currentDay를 사용하여 최대 완료 일차 계산
    const completedDays = completedSessions
      .map(s => s.currentDay)
      .filter(day => day !== undefined && day !== null)
      .reduce((max, day) => Math.max(max, day), 0);
    
    // currentDay가 없는 경우 날짜 기반으로 계산 (하위 호환성)
    let calculatedDays = completedDays;
    if (calculatedDays === 0) {
      const startDateKey = `${mockData.STORAGE_KEYS.LEARNING_START_DATE}_${userId}_${certificationId}`;
      const startDateStr = await AsyncStorage.getItem(startDateKey);
      
      if (startDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        
        const completedDates = completedSessions
          .map(s => {
            if (!s.completedAt) return null;
            const completedDate = new Date(s.completedAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate;
          })
          .filter(d => d !== null);
        
        if (completedDates.length > 0) {
          const latestCompletedDate = new Date(Math.max(...completedDates.map(d => d.getTime())));
          const diffTime = latestCompletedDate.getTime() - startDate.getTime();
          calculatedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
      }
    }
    
    // 학습률 계산 (최대 15일)
    const totalDays = 15;
    const progress = Math.min(100, Math.round((calculatedDays / totalDays) * 100));
    
    return {
      certificationId,
      progress,
      completedDays: Math.min(calculatedDays, totalDays),
      totalDays,
    };
  },

  // 문제 목록 조회 (자격증별)
  getQuestions: async (certificationId) => {
    await delay(500);
    
    // 자격증 ID에 따라 해당 자격증의 문제만 반환
    // certificationId: 1 = 자동화설비기능사, 2 = 전기기능사
    return mockData.questions[certificationId] || [];
  },

  // 일차별 완료 상태 조회
  getDayStatuses: async (certificationId, userId) => {
    await delay(300);
    
    const TOTAL_DAYS = 15;
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    
    // 해당 자격증의 완료된 학습 세션들
    const completedSessions = sessions.filter(s => 
      s.userId === userId && 
      s.certificationId === certificationId && 
      s.isCompleted === true &&
      s.isReview === false
    );
    
    // 완료된 일차들 추출
    const completedDays = new Set(
      completedSessions
        .map(s => s.currentDay)
        .filter(day => day !== undefined && day !== null)
    );
    
    // 해당 자격증의 문제 목록 가져오기
    const allQuestions = await mockQuestionService.getQuestions(certificationId);
    
    // 복습 문제 목록 가져오기 (해당 자격증의 복습 문제만)
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    
    // 해당 자격증의 복습 문제만 필터링
    // 반드시 certificationId로만 필터링 (각 자격증의 문제 ID가 1부터 시작하므로 문제 ID로는 구분 불가)
    const certReviewQuestions = reviewQuestions.filter(rq => {
      // userId와 isCompleted 체크
      if (rq.userId !== userId || rq.isCompleted) {
        return false;
      }
      
      // certificationId가 반드시 있어야 함 (없으면 무시)
      if (rq.certificationId === undefined || rq.certificationId === null) {
        return false; // certificationId가 없으면 해당 자격증의 복습 문제가 아님
      }
      
      // certificationId로만 필터링
      return rq.certificationId === certificationId;
    });
    
    // 각 일차별 문제 ID 범위 계산 (하루에 6문제씩)
    const getDayQuestionIds = (day) => {
      const startId = (day - 1) * 6 + 1;
      const endId = day * 6;
      return { startId, endId };
    };
    
    // 각 일차별 복습 문제 수 계산
    const dayReviewCounts = {};
    certReviewQuestions.forEach(rq => {
      // certificationId가 이미 필터링되었으므로, 문제 ID 범위만 확인
      for (let day = 1; day <= TOTAL_DAYS; day++) {
        const { startId, endId } = getDayQuestionIds(day);
        if (rq.questionId >= startId && rq.questionId <= endId) {
          if (!dayReviewCounts[day]) {
            dayReviewCounts[day] = 0;
          }
          dayReviewCounts[day]++;
        }
      }
    });
    
    // 각 일차별 상태 생성
    const dayStatuses = [];
    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const isCompleted = completedDays.has(day);
      const reviewCount = dayReviewCounts[day] || 0;
      
      // 복습 문제가 있으면 완료 처리하지 않음
      const hasReviewQuestions = reviewCount > 0;
      const actuallyCompleted = isCompleted && !hasReviewQuestions;
      
      // 이전 일차가 완료되었거나 1일차인 경우 잠금 해제
      // 이전 일차가 완료되었고 복습 문제가 없어야 다음 일차 잠금 해제
      let isLocked = false;
      if (day > 1) {
        // 이전 일차의 완료 상태와 복습 문제 수 확인
        const previousDayCompleted = completedDays.has(day - 1);
        const previousDayReviewCount = dayReviewCounts[day - 1] || 0;
        // 이전 일차가 완료되었고 복습 문제가 없어야 잠금 해제
        const previousDayActuallyCompleted = previousDayCompleted && previousDayReviewCount === 0;
        isLocked = !previousDayActuallyCompleted;
      }
      
      dayStatuses.push({
        day,
        isCompleted: actuallyCompleted, // 복습 문제가 있으면 완료로 표시하지 않음
        isLocked,
        reviewCount, // 복습 문제 수
      });
    }
    
    return dayStatuses;
  },

  // 오늘 학습 완료 여부 확인
  getTodayLearningStatus: async (userId) => {
    await delay(200);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (시간대 문제 해결)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    
    // 오늘 완료된 학습 세션이 있는지 확인 (모든 자격증)
    // 재학습 모드가 아닌 세션만 확인
    const todayCompletedLearning = sessions.find(s => {
      if (s.userId !== userId || 
          s.isCompleted !== true || 
          s.isReview !== false ||
          (s.isRelearning && s.isRelearning === true) ||
          !s.completedAt) {
        return false;
      }
      
      // completedAt을 로컬 날짜로 변환해서 비교
      const completedDate = new Date(s.completedAt);
      const completedYear = completedDate.getFullYear();
      const completedMonth = String(completedDate.getMonth() + 1).padStart(2, '0');
      const completedDay = String(completedDate.getDate()).padStart(2, '0');
      const completedStr = `${completedYear}-${completedMonth}-${completedDay}`;
      
      return completedStr === todayStr;
    });
    
    // 복습 문제가 있는지 확인
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    const pendingReviews = reviewQuestions.filter(
      rq => rq.userId === userId && !rq.isCompleted
    );
    
    // 오늘 복습 완료 여부 확인
    const todayCompletedReview = sessions.find(s => {
      if (s.userId !== userId || 
          s.isCompleted !== true || 
          s.isReview !== true ||
          !s.completedAt) {
        return false;
      }
      
      // completedAt을 로컬 날짜로 변환해서 비교
      const completedDate = new Date(s.completedAt);
      const completedYear = completedDate.getFullYear();
      const completedMonth = String(completedDate.getMonth() + 1).padStart(2, '0');
      const completedDay = String(completedDate.getDate()).padStart(2, '0');
      const completedStr = `${completedYear}-${completedMonth}-${completedDay}`;
      
      return completedStr === todayStr;
    });
    
    return {
      isLearningCompleted: !!todayCompletedLearning,
      isReviewCompleted: pendingReviews.length === 0 || !!todayCompletedReview,
      hasReviewQuestions: pendingReviews.length > 0,
      reviewCount: pendingReviews.length,
    };
  },

  // 문제 세션 시작 (학습 시작)
  startQuestionSession: async (certificationId, userId, specificDay = null, isRelearning = false) => {
    await delay(300);
    
    // isRelearning이 명시적으로 true인지 확인
    const isRelearningMode = isRelearning === true;
    
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    
    // 특정 일차가 지정된 경우
    if (specificDay !== null && specificDay !== undefined) {
      
      // 재학습 모드가 아닐 때만 완료 여부 및 이전 일차 확인
      if (!isRelearningMode) {
        const dayCompletedSession = sessions.find(s => 
          s.userId === userId && 
          s.certificationId === certificationId && 
          s.isCompleted === true && 
          s.isReview === false &&
          s.currentDay === specificDay
        );
        
        // 이미 완료된 경우 에러
        if (dayCompletedSession) {
          throw new Error(`${specificDay}일차 학습을 이미 완료했습니다.`);
        }
        
        // 이전 일차가 완료되었는지 확인 (1일차 제외)
        if (specificDay > 1) {
          const previousDayCompleted = sessions.find(s => 
            s.userId === userId && 
            s.certificationId === certificationId && 
            s.isCompleted === true && 
            s.isReview === false &&
            s.currentDay === (specificDay - 1)
          );
          
          if (!previousDayCompleted) {
            throw new Error(`${specificDay - 1}일차 학습을 먼저 완료해주세요.`);
          }
        }
      }
      // 재학습 모드면 모든 체크를 건너뛰고 바로 진행
    } else {
      // 오늘 날짜에 완료된 학습 세션이 있는지 확인 (기존 로직)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      const todayCompletedSession = sessions.find(s => 
        s.userId === userId && 
        s.certificationId === certificationId && 
        s.isCompleted === true && 
        s.isReview === false &&
        s.completedAt &&
        s.completedAt.split('T')[0] === todayStr
      );
      
      if (todayCompletedSession) {
        throw new Error('오늘의 학습을 이미 완료했습니다. 내일 다시 학습할 수 있습니다.');
      }
    }
    
    // 모든 문제 가져오기
    const allQuestions = await mockQuestionService.getQuestions(certificationId);
    
    // 날짜 기반 문제 선택 (15일 학습 계획)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    
    let currentDay;
    
    if (specificDay) {
      // 특정 일차가 지정된 경우 해당 일차 사용
      currentDay = specificDay;
      
      // 학습 시작 날짜가 없으면 설정
      const startDateKey = `${mockData.STORAGE_KEYS.LEARNING_START_DATE}_${userId}_${certificationId}`;
      let startDateStr = await AsyncStorage.getItem(startDateKey);
      if (!startDateStr) {
        startDateStr = today.toISOString();
        await AsyncStorage.setItem(startDateKey, startDateStr);
      }
    } else {
      // 사용자별 학습 시작 날짜 가져오기 또는 설정
      const startDateKey = `${mockData.STORAGE_KEYS.LEARNING_START_DATE}_${userId}_${certificationId}`;
      let startDateStr = await AsyncStorage.getItem(startDateKey);
      
      if (!startDateStr) {
        // 처음 학습하는 경우 오늘 날짜를 시작 날짜로 저장
        startDateStr = today.toISOString();
        await AsyncStorage.setItem(startDateKey, startDateStr);
      }
      
      const startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);
      
      // 오늘까지 경과한 일수 계산 (1일차부터 시작)
      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // 15일 학습 계획이므로 최대 15일차까지만
      currentDay = Math.min(Math.max(1, diffDays), 15);
    }
    
    // 해당 일차의 문제만 선택 (하루에 6문제씩)
    // Day 1: id 1~6, Day 2: id 7~12, ..., Day 15: id 85~90
    const startId = (currentDay - 1) * 6 + 1;
    const endId = currentDay * 6;
    
    const dayQuestions = allQuestions.filter(q => {
      const questionId = q.id;
      return questionId >= startId && questionId <= endId;
    });
    
    // 문제가 없으면 (예: 15일을 넘어간 경우) 마지막 날짜의 문제 반환
    const questions = dayQuestions.length > 0 ? dayQuestions : allQuestions.slice(-6);
    
    const sessionId = `session_${Date.now()}`;
    
    // 세션 정보 저장 (전체 문제 수 추적용)
    sessions.push({
      sessionId,
      userId,
      certificationId,
      totalQuestions: questions.length,
      completedQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      isCompleted: false,
      isReview: false,
      isRelearning: isRelearningMode, // 재학습 모드 플래그
      currentDay, // 현재 일차 정보 저장
    });
    await mockData.saveToStorage(mockData.STORAGE_KEYS.SESSIONS, sessions);
    
    return {
      sessionId,
      questions,
      startedAt: new Date().toISOString(),
      currentDay, // 현재 일차 정보도 반환
      totalDays: 15, // 총 학습 일수
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
    
    // 세션 정보 조회
    const sessions = await mockData.loadFromStorage(mockData.STORAGE_KEYS.SESSIONS, []);
    const session = sessions.find(s => s.sessionId === sessionId && s.userId === userId);
    
    if (!session) {
      throw new Error('세션을 찾을 수 없습니다');
    }
    
    // 재학습 모드인지 확인
    const isRelearning = session.isRelearning || false;
    
    // XP 계산: 문제당 10XP, 틀리면 10XP씩 차감
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    
    // 재학습 모드면 XP는 0
    let xpEarned = 0;
    let baseXp = 0;
    let penaltyXp = 0;
    
    if (!isRelearning) {
      // 기본 XP: 문제당 10XP
      baseXp = totalQuestions * 10;
      // 틀린 문제당 10XP 차감 (문제당 XP 전체 차감)
      penaltyXp = wrongAnswers * 10;
      // 최종 XP (최소 0XP)
      xpEarned = Math.max(0, baseXp - penaltyXp);
    }
    
    // 세션 정보 업데이트
    session.completedQuestions = totalQuestions;
    session.correctAnswers = correctAnswers;
    session.wrongAnswers = wrongAnswers;
    session.completedAt = new Date().toISOString();
    session.isCompleted = true;
    await mockData.saveToStorage(mockData.STORAGE_KEYS.SESSIONS, sessions);
    
    // 재학습 모드가 아닐 때만 XP 저장 및 업데이트
    if (!isRelearning) {
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
        
        // 연속학습(streak) 업데이트 조건:
        // 1. 모든 문제를 다 풀었는지 확인 (results.length === session.totalQuestions)
        // 2. 틀린 문제가 없어야 함 (wrongAnswers === 0)
        // 3. 오늘 날짜를 확인하여 연속 학습인지 확인
        const allQuestionsCompleted = totalQuestions === session.totalQuestions;
        const noWrongAnswers = wrongAnswers === 0;
        
        if (allQuestionsCompleted && noWrongAnswers) {
          // 마지막 학습 날짜 확인
          const lastLearningDateKey = `last_learning_date_${userId}`;
          const lastLearningDateStr = await AsyncStorage.getItem(lastLearningDateKey);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (lastLearningDateStr) {
            const lastLearningDate = new Date(lastLearningDateStr);
            lastLearningDate.setHours(0, 0, 0, 0);
            
            const diffTime = today.getTime() - lastLearningDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              // 연속 학습: streak 증가
              user.streak = (user.streak || 0) + 1;
            } else if (diffDays === 0) {
              // 오늘 이미 학습했으면 streak 유지
              // streak은 그대로 유지
            } else {
              // 연속이 끊어짐: streak 초기화 후 1로 설정
              user.streak = 1;
            }
          } else {
            // 처음 학습하는 경우: streak 1로 설정
            user.streak = 1;
          }
          
          // 마지막 학습 날짜 업데이트
          await AsyncStorage.setItem(lastLearningDateKey, today.toISOString());
        }
        // 조건을 만족하지 않으면 streak은 업데이트하지 않음
        
        await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
      }
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

  // 복습 문제 목록 조회 (자격증별 필터 가능)
  getReviewQuestions: async (userId, certificationId = null) => {
    await delay(400);
    
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    
    const userReviewQuestions = reviewQuestions.filter(rq => {
      if (rq.userId !== userId || rq.isCompleted) return false;
      if (certificationId !== null && certificationId !== undefined) {
        return rq.certificationId === certificationId;
      }
      return true;
    });
    
    // 문제 ID로 실제 문제 데이터 가져오기 (자격증별로 안전하게 조회)
    const questions = userReviewQuestions
      .map(rq => {
        const certQuestions = mockData.questions?.[rq.certificationId] || [];
        return certQuestions.find(q => q.id === rq.questionId);
      })
      .filter(q => q !== undefined);
    
    return questions;
  },

  // 복습 문제 추가 (틀린 문제를 복습 리스트에 추가)
  addReviewQuestion: async (userId, questionId, certificationId) => {
    await delay(300);
    
    const reviewQuestions = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.REVIEW_QUESTIONS || 'mock_review_questions',
      []
    );
    
    // 이미 존재하는지 확인 (자격증별로도 확인)
    const existing = reviewQuestions.find(
      rq => rq.userId === userId && 
            rq.questionId === questionId && 
            rq.certificationId === certificationId &&
            !rq.isCompleted
    );
    
    if (existing) {
      return { success: true, message: '이미 복습 리스트에 추가되어 있습니다' };
    }
    
    const newReviewQuestion = {
      id: reviewQuestions.length + 1,
      userId,
      questionId,
      certificationId, // 자격증 ID 추가
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
  startReviewSession: async (userId, certificationId = null) => {
    await delay(300);
    
    const questions = await mockQuestionService.getReviewQuestions(userId, certificationId);
    
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
    
    if (user) {
      if (xpEarned > 0) {
        user.totalXp = (user.totalXp || 0) + xpEarned;
      }
      
      // 연속학습(streak) 업데이트 조건:
      // 1. 학습에서 틀린 문제가 있었는지 확인 (복습 문제가 있는지)
      // 2. 복습에서 모두 맞췄을 때만 (wrongAnswers === 0)
      // 3. 오늘 날짜를 확인하여 연속 학습인지 확인
      const allReviewCorrect = wrongAnswers === 0;
      const hasReviewQuestions = totalQuestions > 0; // 복습 문제가 있었는지
      
      if (allReviewCorrect && hasReviewQuestions) {
        // 마지막 학습 날짜 확인
        const lastLearningDateKey = `last_learning_date_${userId}`;
        const lastLearningDateStr = await AsyncStorage.getItem(lastLearningDateKey);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (lastLearningDateStr) {
          const lastLearningDate = new Date(lastLearningDateStr);
          lastLearningDate.setHours(0, 0, 0, 0);
          
          const diffTime = today.getTime() - lastLearningDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // 연속 학습: streak 증가
            user.streak = (user.streak || 0) + 1;
          } else if (diffDays === 0) {
            // 오늘 이미 학습했으면 streak 유지
            // streak은 그대로 유지
          } else {
            // 연속이 끊어짐: streak 초기화 후 1로 설정
            user.streak = 1;
          }
        } else {
          // 처음 학습하는 경우: streak 1로 설정
          user.streak = 1;
        }
        
        // 마지막 학습 날짜 업데이트
        await AsyncStorage.setItem(lastLearningDateKey, today.toISOString());
      }
      // 조건을 만족하지 않으면 streak은 업데이트하지 않음
      
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
    
    // AsyncStorage에서 친구 관계 조회
    const friendRelations = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      []
    );
    
    // 현재 사용자의 친구 ID 목록
    const friendIds = friendRelations
      .filter(rel => 
        (rel.userId1 === userId && rel.status === 'accepted') ||
        (rel.userId2 === userId && rel.status === 'accepted')
      )
      .map(rel => rel.userId1 === userId ? rel.userId2 : rel.userId1);
    
    // 친구 정보 가져오기
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const friends = friendIds
      .map(id => users.find(u => u.id === id))
      .filter(u => u !== undefined)
      .map(user => ({
        id: user.id,
        name: user.name,
        school: user.school,
        department: user.department,
        grade: user.grade,
        totalXp: user.totalXp || 0,
        streak: user.streak || 0,
      }));
    
    return friends;
  },

  // 친구 추가 요청
  addFriend: async (userId, friendId) => {
    await delay(500);
    
    const friendRelations = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      []
    );
    
    // 이미 친구 관계가 있는지 확인
    const existingRelation = friendRelations.find(rel =>
      (rel.userId1 === userId && rel.userId2 === friendId) ||
      (rel.userId1 === friendId && rel.userId2 === userId)
    );
    
    if (existingRelation) {
      if (existingRelation.status === 'accepted') {
        throw new Error('이미 친구입니다.');
      } else if (existingRelation.status === 'pending') {
        throw new Error('이미 친구 요청이 있습니다.');
      }
    }
    
    // 새로운 친구 요청 생성
    const newRelation = {
      id: friendRelations.length + 1,
      userId1: userId,
      userId2: friendId,
      status: 'pending', // pending, accepted, rejected
      requestedAt: new Date().toISOString(),
    };
    
    friendRelations.push(newRelation);
    await mockData.saveToStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      friendRelations
    );
    
    return { success: true, message: '친구 요청을 보냈습니다.' };
  },

  // 친구 요청 수락
  acceptFriendRequest: async (userId, friendId) => {
    await delay(500);
    
    const friendRelations = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      []
    );
    
    const relation = friendRelations.find(rel =>
      ((rel.userId1 === friendId && rel.userId2 === userId) ||
       (rel.userId1 === userId && rel.userId2 === friendId)) &&
      rel.status === 'pending'
    );
    
    if (!relation) {
      throw new Error('친구 요청을 찾을 수 없습니다.');
    }
    
    relation.status = 'accepted';
    relation.acceptedAt = new Date().toISOString();
    
    await mockData.saveToStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      friendRelations
    );
    
    return { success: true, message: '친구 요청을 수락했습니다.' };
  },

  // 친구 랭킹 조회 (친구 + 본인)
  getRanking: async (userId) => {
    await delay(500);
    
    // 친구 목록 가져오기
    const friends = await mockFriendService.getFriends(userId);
    
    // 본인 정보 가져오기
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const currentUser = users.find(u => u.id === userId);
    
    if (!currentUser) {
      return [];
    }
    
    // 친구 + 본인을 합쳐서 랭킹 생성
    const ranking = [
      ...friends,
      currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        school: currentUser.school,
        department: currentUser.department,
        grade: currentUser.grade,
        totalXp: currentUser.totalXp || 0,
        streak: currentUser.streak || 0,
        isMe: true,
      } : null,
    ]
      .filter(u => u !== null)
      .sort((a, b) => b.totalXp - a.totalXp)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));
    
    return ranking;
  },

  // 친구 요청 목록 조회
  getFriendRequests: async (userId) => {
    await delay(400);
    
    const friendRelations = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      []
    );
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    
    // 나에게 온 친구 요청 (pending 상태)
    const receivedRequests = friendRelations
      .filter(rel => rel.userId2 === userId && rel.status === 'pending')
      .map(rel => {
        const requester = users.find(u => u.id === rel.userId1);
        return requester ? {
          id: rel.id,
          friendId: requester.id,
          name: requester.name,
          school: requester.school,
          department: requester.department,
          requestedAt: rel.requestedAt,
        } : null;
      })
      .filter(r => r !== null);
    
    return receivedRequests;
  },

  // 사용자 고유 코드로 검색
  searchUserByCode: async (userCode) => {
    await delay(400);
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    
    // 고유 코드로 사용자 찾기 (대소문자 무시)
    const user = users.find(u => 
      u.userCode && u.userCode.toUpperCase() === userCode.toUpperCase()
    );
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    return {
      id: user.id,
      name: user.name,
      school: user.school,
      department: user.department,
      grade: user.grade,
      totalXp: user.totalXp || 0,
      streak: user.streak || 0,
      userCode: user.userCode,
    };
  },

  // 같은 학과/학년 사용자 추천
  getRecommendedUsers: async (userId, department, grade) => {
    await delay(500);
    
    const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
    const friendRelations = await mockData.loadFromStorage(
      mockData.STORAGE_KEYS.FRIEND_RELATIONS || 'mock_friend_relations',
      []
    );
    
    // 이미 친구이거나 친구 요청이 있는 사용자 ID 목록
    const excludedIds = new Set([userId]);
    friendRelations.forEach(rel => {
      if (rel.userId1 === userId) excludedIds.add(rel.userId2);
      if (rel.userId2 === userId) excludedIds.add(rel.userId1);
    });
    
    // 같은 학과, 같은 학년 사용자 필터링 (본인 제외, 이미 친구인 사람 제외)
    const recommended = users
      .filter(u => 
        u.id !== userId &&
        !excludedIds.has(u.id) &&
        u.department === department &&
        u.grade === grade
      )
      .map(user => ({
        id: user.id,
        name: user.name,
        school: user.school,
        department: user.department,
        grade: user.grade,
        totalXp: user.totalXp || 0,
        streak: user.streak || 0,
        userCode: user.userCode || `CERT-${String(user.id).padStart(4, '0')}`,
      }))
      .slice(0, 10); // 최대 10명
    
    return recommended;
  },
};
