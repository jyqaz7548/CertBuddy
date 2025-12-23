import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { mockFriendService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = false; // 백엔드 연동 완료

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
    return response.data.success ? response.data.data : response.data;
  },

  // 친구 추가 요청
  addFriend: async (userId, friendId) => {
    if (USE_MOCK_API) {
      return await mockFriendService.addFriend(userId, friendId);
    }
    
    const response = await api.post(`/api/friends/${friendId}`);
    return response.data.success ? response.data.data : response.data;
  },

  // 친구 요청 수락
  acceptFriendRequest: async (userId, friendId) => {
    if (USE_MOCK_API) {
      return await mockFriendService.acceptFriendRequest(userId, friendId);
    }
    
    const response = await api.post(`/api/friends/${friendId}/accept`);
    return response.data.success ? response.data.data : response.data;
  },

  // 친구 요청 목록 조회
  getFriendRequests: async (userId) => {
    if (USE_MOCK_API) {
      return await mockFriendService.getFriendRequests(userId);
    }
    
    const response = await api.get('/api/friends/requests', {
      params: { userId },
    });
    return response.data.success ? response.data.data : response.data;
  },

  // 친구 랭킹 조회
  getRanking: async (userId) => {
    if (USE_MOCK_API) {
      return await mockFriendService.getRanking(userId);
    }
    
    const response = await api.get('/api/friends/ranking', {
      params: { userId },
    });
    return response.data.success ? response.data.data : response.data;
  },

  // 사용자 고유 코드로 검색
  searchUserByCode: async (userCode) => {
    if (USE_MOCK_API) {
      return await mockFriendService.searchUserByCode(userCode);
    }
    
    const response = await api.get('/api/users/search', {
      params: { userCode },
    });
    return response.data.success ? response.data.data : response.data;
  },

  // 같은 학과/학년 사용자 추천
  getRecommendedUsers: async (userId, department, grade) => {
    if (USE_MOCK_API) {
      return await mockFriendService.getRecommendedUsers(userId, department, grade);
    }
    
    const response = await api.get('/api/friends/recommendations', {
      params: { userId, department, grade },
    });
    return response.data.success ? response.data.data : response.data;
  },
};
