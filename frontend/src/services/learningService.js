import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { mockLearningService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = false; // 백엔드 연동 완료

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const learningService = {
  // 추천 자격증 조회
  getRecommendations: async (school, department, grade, userId = null) => {
    if (USE_MOCK_API) {
      return await mockLearningService.getRecommendations(school, department, grade, userId);
    }
    
    // 백엔드에서 userId는 선택사항이므로 전달하지 않아도 됨
    const response = await api.get('/api/learning/recommendations', {
      params: { school, department, grade },
    });
    return response.data.success ? response.data.data : response.data;
  },

  // 플래시카드 조회
  getFlashCards: async (certificationId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.getFlashCards(certificationId);
    }
    
    const response = await api.get(`/api/learning/cards/${certificationId}`);
    return response.data.success ? response.data.data : response.data;
  },

  // 학습 세션 시작
  startLearningSession: async (certificationId, userId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.startLearningSession(certificationId, userId);
    }
    
    // 백엔드에서 Authentication에서 userId를 가져오므로 userId 파라미터 불필요
    const response = await api.post('/api/learning/sessions', {
      certificationId,
    });
    return response.data.success ? response.data.data : response.data;
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
    return response.data.success ? response.data.data : response.data;
  },

  // 복습 카드 조회
  getReviewCards: async (userId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.getReviewCards(userId);
    }
    
    // 백엔드에서 Authentication에서 userId를 가져오므로 userId 파라미터 불필요
    const response = await api.get('/api/learning/review');
    return response.data.success ? response.data.data : response.data;
  },

  // 복습 카드 추가
  addReviewCard: async (userId, flashCardId) => {
    if (USE_MOCK_API) {
      return await mockLearningService.addReviewCard(userId, flashCardId);
    }
    
    // 백엔드에서 Authentication에서 userId를 가져오므로 userId 파라미터 불필요
    const response = await api.post('/api/learning/review', {
      flashCardId,
    });
    return response.data.success ? response.data.data : response.data;
  },
};
