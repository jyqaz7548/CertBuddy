import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { mockAuthService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = false; // 백엔드 연동 완료

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK_API) {
      return await mockAuthService.login(email, password);
    }
    
    const response = await api.post('/api/auth/login', { email, password });
    // 백엔드 응답: { success: true, message: "...", data: { token: "...", user: {...} } }
    if (response.data.success && response.data.data) {
      return response.data.data; // { token, user } 반환
    }
    throw new Error(response.data.message || '로그인에 실패했습니다.');
  },

  register: async (userData) => {
    if (USE_MOCK_API) {
      return await mockAuthService.register(userData);
    }
    
    const response = await api.post('/api/auth/register', userData);
    // 백엔드 응답: { success: true, message: "...", data: { token: "...", user: {...} } }
    if (response.data.success && response.data.data) {
      return response.data.data; // { token, user } 반환
    }
    throw new Error(response.data.message || '회원가입에 실패했습니다.');
  },

  getCurrentUser: async (userId) => {
    if (USE_MOCK_API) {
      return await mockAuthService.getCurrentUser(userId);
    }
    
    const response = await api.get('/api/users/me');
    // 백엔드 응답: { success: true, message: "...", data: { id, email, name, ... } }
    if (response.data.success && response.data.data) {
      return response.data.data; // user 객체 반환
    }
    throw new Error(response.data.message || '사용자 정보를 가져오는데 실패했습니다.');
  },
};

