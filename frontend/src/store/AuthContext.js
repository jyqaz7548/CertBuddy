import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱 시작 시 저장된 토큰 확인
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // TODO: 토큰으로 사용자 정보 조회
        // const userData = await authService.getCurrentUser();
        // setUser(userData);
      }
    } catch (error) {
      console.error('Load user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      await AsyncStorage.setItem('authToken', response.token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      await AsyncStorage.setItem('authToken', response.token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      // 네트워크 에러인 경우 더 자세한 메시지 제공
      if (error.message?.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        return { 
          success: false, 
          error: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.' 
        };
      }
      // 서버 에러 응답이 있는 경우
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      return { success: false, error: error.message || '회원가입에 실패했습니다.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

