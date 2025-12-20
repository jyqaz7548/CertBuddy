import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { mockAuthService } from './mockApiService';

// Mock 모드 활성화 여부 (백엔드 준비되면 false로 변경)
const USE_MOCK_API = true;

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
    return response.data;
  },

  register: async (userData) => {
    if (USE_MOCK_API) {
      return await mockAuthService.register(userData);
    }
    
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (userId) => {
    if (USE_MOCK_API) {
      return await mockAuthService.getCurrentUser(userId);
    }
    
    const response = await api.get('/api/users/me');
    return response.data;
  },
};

