// API 기본 URL
// 개발 환경
// 주의: Expo 앱에서는 localhost 대신 컴퓨터의 실제 IP 주소를 사용해야 합니다
// Windows에서 IP 주소 확인: ipconfig (IPv4 주소 확인)
// Mac/Linux에서 IP 주소 확인: ifconfig 또는 ip addr
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080'  // 웹 브라우저나 에뮬레이터의 경우
  // ? 'http://192.168.0.xxx:8080'  // 실제 기기에서 테스트할 경우: xxx를 본인 IP로 변경
  : 'https://api.certbuddy.com';  // 프로덕션 서버

// 앱 설정
export const APP_CONFIG = {
  MIN_STUDY_TIME: 5,  // 최소 학습 시간 (분)
  MAX_STUDY_TIME: 15, // 최대 학습 시간 (분)
  XP_PER_CARD: 10,    // 카드당 XP
  STREAK_REWARD: 50,  // 스트릭 보너스 XP
};

