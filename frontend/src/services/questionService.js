import api from './apiService';
import { mockQuestionService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = true;

export const questionService = {
  // 문제가 있는 자격증 목록 조회
  getAvailableCertifications: async () => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getAvailableCertifications();
    }
    
    const response = await api.get('/api/questions/certifications');
    return response.data;
  },

  // 자격증별 학습률 조회
  getCertificationProgress: async (certificationId, userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getCertificationProgress(certificationId, userId);
    }
    
    const response = await api.get(`/api/questions/certifications/${certificationId}/progress`, {
      params: { userId },
    });
    return response.data;
  },

  // 오늘 학습 완료 여부 확인
  getTodayLearningStatus: async (userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getTodayLearningStatus(userId);
    }
    
    const response = await api.get('/api/questions/today-status', {
      params: { userId },
    });
    return response.data;
  },

  // 일차별 완료 상태 조회
  getDayStatuses: async (certificationId, userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getDayStatuses(certificationId, userId);
    }
    
    const response = await api.get(`/api/questions/certifications/${certificationId}/days`, {
      params: { userId },
    });
    return response.data;
  },

  // 문제 목록 조회 (자격증별)
  getQuestions: async (certificationId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getQuestions(certificationId);
    }
    
    const response = await api.get(`/api/questions`, {
      params: { certificationId },
    });
    return response.data;
  },

  // 문제 세션 시작 (학습 시작)
  startQuestionSession: async (certificationId, userId, specificDay = null, isRelearning = false) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.startQuestionSession(certificationId, userId, specificDay, isRelearning);
    }
    
    const response = await api.post('/api/questions/sessions', {
      certificationId,
      userId,
      specificDay,
      isRelearning,
    });
    return response.data;
  },

  // 문제 답안 제출 및 결과 저장
  submitAnswer: async (sessionId, questionId, selectedAnswer, isCorrect) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.submitAnswer(sessionId, questionId, selectedAnswer, isCorrect);
    }
    
    const response = await api.post(`/api/questions/sessions/${sessionId}/answers`, {
      questionId,
      selectedAnswer,
      isCorrect,
    });
    return response.data;
  },

  // 학습 세션 완료
  completeQuestionSession: async (sessionId, results, userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.completeQuestionSession(sessionId, results, userId);
    }
    
    const response = await api.post(`/api/questions/sessions/${sessionId}/complete`, {
      results,
      userId,
    });
    return response.data;
  },

  // 복습 문제 목록 조회 (자격증별 필터 가능)
  getReviewQuestions: async (userId, certificationId = null) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getReviewQuestions(userId, certificationId);
    }
    
    const response = await api.get('/api/questions/review', {
      params: { userId, certificationId },
    });
    return response.data;
  },

  // 복습 문제 추가 (틀린 문제를 복습 리스트에 추가)
  addReviewQuestion: async (userId, questionId, certificationId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.addReviewQuestion(userId, questionId, certificationId);
    }
    
    const response = await api.post('/api/questions/review', {
      userId,
      questionId,
      certificationId,
    });
    return response.data;
  },

  // 복습 문제 완료 처리
  completeReviewQuestion: async (userId, questionId, isCorrect) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.completeReviewQuestion(userId, questionId, isCorrect);
    }
    
    const response = await api.post(`/api/questions/review/${questionId}/complete`, {
      userId,
      isCorrect,
    });
    return response.data;
  },

  // 복습 세션 시작 (자격증별 필터 가능)
  startReviewSession: async (userId, certificationId = null) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.startReviewSession(userId, certificationId);
    }
    
    const response = await api.post('/api/questions/review/sessions', {
      userId,
      certificationId,
    });
    return response.data;
  },

  // 복습 세션 완료 (보너스 XP 지급)
  completeReviewSession: async (sessionId, results, userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.completeReviewSession(sessionId, results, userId);
    }
    
    const response = await api.post(`/api/questions/review/sessions/${sessionId}/complete`, {
      results,
      userId,
    });
    return response.data;
  },
};

