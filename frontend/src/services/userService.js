import api from './apiService';

export const userService = {
  // 취득한 자격증 목록 조회
  getAcquiredCertifications: async () => {
    const response = await api.get('/api/users/certifications/acquired');
    if (response.data.success && response.data.data) {
      return response.data.data; // CertificationResponse[] 반환
    }
    throw new Error(response.data.message || '취득한 자격증 목록을 가져오는데 실패했습니다.');
  },

  // 취득한 자격증 추가
  addAcquiredCertification: async (certificationId) => {
    const response = await api.post('/api/users/certifications/acquired', {
      certificationId,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || '자격증 추가에 실패했습니다.');
  },

  // 취득한 자격증 삭제
  removeAcquiredCertification: async (certificationId) => {
    const response = await api.delete(`/api/users/certifications/acquired/${certificationId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || '자격증 삭제에 실패했습니다.');
  },

  // 취득한 자격증 일괄 설정
  setAcquiredCertifications: async (certificationNames) => {
    const response = await api.put('/api/users/certifications/acquired', {
      certificationNames,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || '자격증 설정에 실패했습니다.');
  },
};

