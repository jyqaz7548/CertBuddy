// API 기본 URL
// 개발 환경
// ⚠️ 실제 기기에서 테스트할 경우: 아래 IP 주소를 본인 IP로 변경하세요
// Windows에서 IP 주소 확인: ipconfig (IPv4 주소 확인)
// Mac/Linux에서 IP 주소 확인: ifconfig 또는 ip addr
export const API_BASE_URL = __DEV__ 
  ? 'http://172.30.1.93:8080'  // 실제 기기 테스트용 (현재 IP: 172.30.1.93)
  // ? 'http://localhost:8080'  // 에뮬레이터/시뮬레이터용 (위 줄 주석 처리하고 이 줄 활성화)
  : 'https://api.certbuddy.com';  // 프로덕션 서버

// 앱 설정
export const APP_CONFIG = {
  MIN_STUDY_TIME: 5,  // 최소 학습 시간 (분)
  MAX_STUDY_TIME: 15, // 최대 학습 시간 (분)
  XP_PER_CARD: 10,    // 카드당 XP
  STREAK_REWARD: 50,  // 스트릭 보너스 XP
};

