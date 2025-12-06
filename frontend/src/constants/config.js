// API 기본 URL
// 개발 환경
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080'  // 로컬 개발 서버
  : 'https://api.certbuddy.com';  // 프로덕션 서버

// 앱 설정
export const APP_CONFIG = {
  MIN_STUDY_TIME: 5,  // 최소 학습 시간 (분)
  MAX_STUDY_TIME: 15, // 최대 학습 시간 (분)
  XP_PER_CARD: 10,    // 카드당 XP
  STREAK_REWARD: 50,  // 스트릭 보너스 XP
};

