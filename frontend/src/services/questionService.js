import api from './apiService';
import { mockQuestionService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = true;

export const questionService = {
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
  startQuestionSession: async (certificationId, userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.startQuestionSession(certificationId, userId);
    }
    
    const response = await api.post('/api/questions/sessions', {
      certificationId,
      userId,
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

  // 복습 문제 목록 조회
  getReviewQuestions: async (userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.getReviewQuestions(userId);
    }
    
    const response = await api.get('/api/questions/review', {
      params: { userId },
    });
    return response.data;
  },

  // 복습 문제 추가 (틀린 문제를 복습 리스트에 추가)
  addReviewQuestion: async (userId, questionId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.addReviewQuestion(userId, questionId);
    }
    
    const response = await api.post('/api/questions/review', {
      userId,
      questionId,
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

  // 복습 세션 시작
  startReviewSession: async (userId) => {
    if (USE_MOCK_API) {
      return await mockQuestionService.startReviewSession(userId);
    }
    
    const response = await api.post('/api/questions/review/sessions', {
      userId,
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

