import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { mockFriendService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const friendService = {
  // 친구 목록 조회
  getFriends: async (userId) => {
    if (USE_MOCK_API) {
      return await mockFriendService.getFriends(userId);
    }
    
    const response = await api.get('/api/friends', {
      params: { userId },
    });
    return response.data;
  },

  // 친구 랭킹 조회
  getRanking: async (userId) => {
    if (USE_MOCK_API) {
      return await mockFriendService.getRanking(userId);
    }
    
    const response = await api.get('/api/friends/ranking', {
      params: { userId },
    });
    return response.data;
  },
};
