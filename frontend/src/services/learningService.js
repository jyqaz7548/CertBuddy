import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { mockLearningService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const learningService = {
  // 추천 자격증 조회
  getRecommendations: async (school, department) => {
    if (USE_MOCK_API) {
      return await mockLearningService.getRecommendations(school, department);
    }
    
    const response = await api.get('/api/learning/recommendations', {
      params: { school, department },
    });
    return response.data;
  },

  // 플래시카드 조회
  getFlashCards: async (certificationId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.getFlashCards(certificationId);
    }
    
    const response = await api.get(`/api/learning/cards/${certificationId}`);
    return response.data;
  },

  // 학습 세션 시작
  startLearningSession: async (certificationId, userId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.startLearningSession(certificationId, userId);
    }
    
    const response = await api.post('/api/learning/sessions', {
      certificationId,
      userId,
    });
    return response.data;
  },

  // 학습 세션 완료
  completeLearningSession: async (sessionId, cardsStudied, xpEarned) => {
    if (USE_MOCK_API) {
      return await mockLearningService.completeLearningSession(sessionId, cardsStudied, xpEarned);
    }
    
    const response = await api.post(`/api/learning/sessions/${sessionId}/complete`, {
      cardsStudied,
      xpEarned,
    });
    return response.data;
  },

  // 복습 카드 조회
  getReviewCards: async (userId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.getReviewCards(userId);
    }
    
    const response = await api.get('/api/learning/review', {
      params: { userId },
    });
    return response.data;
  },

  // 복습 카드 추가
  addReviewCard: async (userId, flashCardId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.addReviewCard(userId, flashCardId);
    }
    
    const response = await api.post('/api/learning/review', {
      userId,
      flashCardId,
    });
    return response.data;
  },
};
