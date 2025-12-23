// Mock 데이터 - 프론트엔드 개발용
// 백엔드가 준비되면 이 파일을 삭제하고 실제 API를 사용합니다

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock 사용자 데이터
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    name: '테스트 사용자',
    school: '테스트대학교',
    department: '컴퓨터공학과',
    grade: 3,
    totalXp: 1250,
    streak: 7,
  },
];

// Mock 자격증 데이터 (추천 자격증 기능용)
// 현재는 빈 배열로 설정되어 있음. 나중에 기업 기반 선배 자격증 데이터로 채울 예정
const mockCertifications = [];

// 튜토리얼용 기업 목록
const mockCompanies = [
  { id: 1, name: '세메스' },
  { id: 2, name: 'LH 공사' },
  { id: 3, name: 'AD 테크놀로지' },
  { id: 4, name: '한국항공우주산업' },
  { id: 5, name: '에이로봇' },
  { id: 6, name: '모르겠습니다' },
];

// 튜토리얼용 자격증 목록
const mockTutorialCertifications = [
  { id: 1, name: '자동화설비기능사' },
  { id: 2, name: '전기기능사' },
  { id: 3, name: '프로그래밍기능사' },
  { id: 4, name: '전자기능사' },
  { id: 5, name: '컴활' },
  { id: 6, name: '모르겠습니다' },
  { id: 7, name: '정보처리기능사' },
  { id: 8, name: '정보기기운용기능사' },
];

// 이름 모자이크 처리 함수 (성만 보이고 나머지는 OO로 표시)
const maskName = (fullName) => {
  if (!fullName || fullName.length === 0) return '';
  if (fullName.length === 1) return fullName;
  if (fullName.length === 2) return fullName.charAt(0) + 'O';
  return fullName.charAt(0) + 'O'.repeat(fullName.length - 1);
};

// 실제 친구 데이터 (같은 학과 기반 추천용)
const mockFriendsData = [
  {
    id: 1,
    name: '백인선',
    department: '정보통신과',
    grade: 2,
    certifications: [3, 2, 5], // 프로그래밍기능사, 전기기능사, 컴활
  },
  {
    id: 2,
    name: '이윤솔',
    department: '소프트웨어과',
    grade: 2,
    certifications: [3, 8, 9, 10], // 프로그래밍기능사, 정보기기운용기능사, ITQ 엑셀, ITQ 한글
  },
  {
    id: 3,
    name: '장승원',
    department: '소프트웨어과',
    grade: 2,
    certifications: [7, 8], // 정보처리기능사, 정보기기운용기능사
  },
  {
    id: 4,
    name: '이소울',
    department: '소프트웨어과',
    grade: 2,
    certifications: [7], // 정보처리기능사
  },
];

// 학과별 자격증 선택 통계 (Mock 데이터)
// 실제로는 서버에서 같은 학과+학년 사용자들의 선택 데이터를 집계
const mockDepartmentCertStats = {
  '로봇설계과': {
    1: [
      { certificationId: 1, name: '자동화설비기능사', percentage: 45 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 15 },
    ],
    2: [
      { certificationId: 1, name: '자동화설비기능사', percentage: 48 },
      { certificationId: 2, name: '전기기능사', percentage: 28 },
      { certificationId: 5, name: '컴활', percentage: 18 },
    ],
    3: [
      { certificationId: 1, name: '자동화설비기능사', percentage: 50 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 12 },
    ],
  },
  '로봇제어과': {
    1: [
      { certificationId: 2, name: '전기기능사', percentage: 45 },
      { certificationId: 4, name: '전자기능사', percentage: 30 },
      { certificationId: 1, name: '자동화설비기능사', percentage: 15 },
    ],
    2: [
      { certificationId: 2, name: '전기기능사', percentage: 48 },
      { certificationId: 4, name: '전자기능사', percentage: 28 },
      { certificationId: 1, name: '자동화설비기능사', percentage: 16 },
    ],
    3: [
      { certificationId: 2, name: '전기기능사', percentage: 50 },
      { certificationId: 4, name: '전자기능사', percentage: 30 },
      { certificationId: 1, name: '자동화설비기능사', percentage: 12 },
    ],
  },
  '로봇소프트웨어과': {
    1: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 40 },
      { certificationId: 7, name: '정보처리기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 20 },
    ],
    2: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 42 },
      { certificationId: 7, name: '정보처리기능사', percentage: 28 },
      { certificationId: 5, name: '컴활', percentage: 22 },
    ],
    3: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 45 },
      { certificationId: 7, name: '정보처리기능사', percentage: 30 },
      { certificationId: 5, name: '컴활', percentage: 15 },
    ],
  },
  '로봇정보통신과': {
    1: [
      { certificationId: 4, name: '전자기능사', percentage: 40 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 20 },
    ],
    2: [
      { certificationId: 4, name: '전자기능사', percentage: 42 },
      { certificationId: 2, name: '전기기능사', percentage: 28 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 22 },
    ],
    3: [
      { certificationId: 4, name: '전자기능사', percentage: 45 },
      { certificationId: 2, name: '전기기능사', percentage: 30 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 17 },
    ],
  },
  // 실제 친구 데이터 기반 통계
  '정보통신과': {
    2: [
      { certificationId: 3, name: '프로그래밍기능사', percentage: 100 },
      { certificationId: 2, name: '전기기능사', percentage: 100 },
      { certificationId: 5, name: '컴활1급', percentage: 100 },
    ],
  },
  '소프트웨어과': {
    2: [
      { certificationId: 8, name: '정보기기운용기능사', percentage: 67 },
      { certificationId: 7, name: '정보처리기능사', percentage: 67 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 33 },
      { certificationId: 9, name: 'ITQ 엑셀', percentage: 33 },
      { certificationId: 10, name: 'ITQ 한글', percentage: 33 },
    ],
  },
  '로봇소프트웨어과': {
    2: [
      { certificationId: 8, name: '정보기기운용기능사', percentage: 67 },
      { certificationId: 7, name: '정보처리기능사', percentage: 67 },
      { certificationId: 3, name: '프로그래밍기능사', percentage: 33 },
      { certificationId: 9, name: 'ITQ 엑셀', percentage: 33 },
      { certificationId: 10, name: 'ITQ 한글', percentage: 33 },
    ],
  },
};

// Mock 플래시카드 데이터 (현재는 비어있음, 필요시 추가)
const mockFlashCards = {};

// Mock 문제 데이터 (자격증별로 분리)
// certificationId: 1 = 자동화설비기능사, 2 = 전기기능사
const mockQuestions = {
  1: [ // 자동화설비기능사
    {
      id: 1,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "선반 작업 시 발생한 칩(Chip)은 기계가 작동 중일 때 손으로 즉시 제거해야 안전하다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "칩은 매우 날카롭고 뜨거우며, 회전하는 기계에 손이 말려들어갈 위험이 있으므로 반드시 기계를 정지시킨 후 브러시나 갈고리 등을 사용하여 제거해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 2,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "CNC 선반 프로그래밍에서 공구를 급속 이송(위치 결정)시킬 때 사용하는 G 코드는 무엇인가?",
      choices: [
        "G00",
        "G01",
        "G02",
        "G03"
      ],
      answer: "G00",
      explanation: "G00은 급속 위치 결정(급송), G01은 직선 보간(절삭 이송), G02는 시계 방향 원호 보간, G03은 반시계 방향 원호 보간입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 3,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "유압 장치에서 작동유의 온도가 상승하면 점도는 낮아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "일반적으로 액체(작동유)는 온도가 상승하면 분자 운동이 활발해져 점도가 낮아(묽어)집니다. 반대로 기체는 온도가 오르면 점도가 높아지는 경향이 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 4,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기계 제도에서 물체의 보이지 않는 부분의 형상을 나타낼 때 사용하는 선의 명칭은 무엇인가?",
      choices: [
        "외형선",
        "숨은선",
        "중심선",
        "파단선"
      ],
      answer: "숨은선",
      explanation: "물체의 보이지 않는 부분은 점선 또는 파선 형태의 '숨은선'으로 표현합니다. 외형선은 보이는 부분, 중심선은 도형의 중심, 파단선은 불규칙한 경계를 나타냅니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 5,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "PLC 시퀀스 제어에서 두 개의 입력 접점이 직렬로 연결되어, 두 입력이 모두 ON일 때만 출력이 발생하는 논리 회로는?",
      choices: [
        "OR 회로",
        "AND 회로",
        "NOT 회로",
        "NAND 회로"
      ],
      answer: "AND 회로",
      explanation: "직렬 연결은 AND 논리(논리곱)에 해당하며, 모든 조건이 만족(1)되어야 결과가 출력됩니다. 병렬 연결은 OR 논리에 해당합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 6,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "CNC공작기계에 사용되는 좌표계 중에서 절대 좌표계의 기준이 되며, 프로그램 원점과 동일한 지점에 위치하는 좌표계는?",
      choices: [
        "기계 좌표계",
        "상대 좌표계",
        "측정 좌표계",
        "공작물 좌표계"
      ],
      answer: "공작물 좌표계",
      explanation: "공작물 좌표계(G54~G59)는 가공 프로그램을 작성할 때 기준이 되는 좌표계로, 일반적으로 프로그램 원점과 일치시켜 사용합니다. 기계 좌표계는 기계 원점을 기준으로 하는 고정된 좌표계입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 7,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "연삭 숫돌의 입자가 무디거나 눈이 메워졌을 때, 숫돌의 표면을 깎아내어 예리한 날을 생성하는 작업을 '드레싱(Dressing)'이라고 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "드레싱(Dressing)은 눈메움이나 무딤 현상이 발생했을 때 새로운 절삭날을 생성하는 작업이며, 트루잉(Truing)은 숫돌의 형상을 수정하거나 편심을 잡는 작업입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 8,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 나사의 종류를 표시하는 기호가 잘못 짝지어진 것은?",
      choices: [
        "M : 미터 나사",
        "R : 관용 테이퍼 수나사",
        "Tr : 미터 사다리꼴 나사",
        "UNC : 유니파이 가는 나사"
      ],
      answer: "UNC : 유니파이 가는 나사",
      explanation: "UNC는 유니파이 보통 나사(Coarse)를 의미하며, 유니파이 가는 나사(Fine)는 UNF로 표기합니다. 나머지는 올바른 표기입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 9,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "공압 장치는 유압 장치에 비해 힘(출력)이 매우 크고, 속도 제어가 정밀하다는 장점이 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "공압은 공기의 압축성 때문에 정밀한 속도 제어가 어렵고 유압에 비해 큰 힘을 내기 어렵습니다. 큰 힘과 정밀한 제어는 유압 장치의 특징입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 10,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속 물체가 센서의 검출면에 접근할 때 발생하는 와전류 손실을 이용하여 물체의 유무를 감지하는 센서는?",
      choices: [
        "광전 센서",
        "유도형 근접 센서",
        "정전 용량형 센서",
        "리미트 스위치"
      ],
      answer: "유도형 근접 센서",
      explanation: "유도형(고주파 발진형) 근접 센서는 자성체(금속)에만 반응하며 와전류 손실 원리를 이용합니다. 정전 용량형은 금속, 비금속 모두 감지 가능합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 11,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "자동화 시스템의 5대 요소 중, 제어부의 명령을 받아 실제로 일을 수행(동작)하는 구동 기기에 해당하는 것은?",
      choices: [
        "센서(Sensor)",
        "프로세서(Processor)",
        "액추에이터(Actuator)",
        "소프트웨어(Software)"
      ],
      answer: "액추에이터(Actuator)",
      explanation: "액추에이터는 전기, 유압, 공압 등의 에너지를 기계적인 움직임으로 변환하는 구동 장치(모터, 실린더 등)를 말합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 12,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전동기 과부하 보호용 계전기는?",
      choices: [
        "한시계전기",
        "파워계전기",
        "리드계전기",
        "열동형계전기"
      ],
      answer: "열동형계전기",
      explanation: "열동형 계전기(Thermal Relay)는 전류가 과하게 흐를 때 발생하는 열을 이용하여 바이메탈을 휘게 만들어 회로를 차단함으로써 전동기를 소손으로부터 보호합니다.",
      examInfo: {
        year: 2014,
        round: "4회"
      }
    },
    {
      id: 13,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "3각법 투상도에서 평면도는 정면도의 위쪽에 배치된다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "제3각법에서는 눈 -> 투상면 -> 물체의 순서로 배치되므로, 정면도를 기준으로 평면도는 위쪽, 우측면도는 오른쪽에 배치됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 14,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "밀링 머신에서 공작물의 이송 방향과 커터의 회전 방향이 같은 방향으로 진행되는 절삭 방법은?",
      choices: [
        "상향 절삭",
        "하향 절삭",
        "정면 절삭",
        "측면 절삭"
      ],
      answer: "하향 절삭",
      explanation: "하향 절삭(Down milling)은 커터의 회전 방향과 공작물 이송 방향이 같습니다. 가공면이 깨끗하지만 백래시 제거 장치가 필요합니다. 상향 절삭은 방향이 반대입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 15,
      certificationId: 1,
      type: "OX",
      source: "AI_GENERATED",
      question: "시퀀스 제어 회로에서 자기유지 회로를 해제하기 위해서는 주로 b접점(NC) 스위치를 직렬로 연결하여 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "자기유지 회로는 한 번 신호를 주면 계속 동작 상태를 유지하는데, 이를 끊어주기(Reset/Stop) 위해서는 평소에 닫혀 있다가 누르면 열리는 b접점 스위치를 직렬로 연결합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 16,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "기하공차 기호 중에서 '평행도'를 나타내는 기호는?",
      choices: [
        "⊥",
        "∥",
        "◎",
        "∠"
      ],
      answer: "∥",
      explanation: "∥는 평행도, ⊥는 직각도, ◎는 동심도, ∠는 경사도를 나타내는 기하공차 기호입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 17,
      certificationId: 1,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "산업용 로봇의 동작 형태 중 X, Y, Z 3개의 직선 운동 축으로 구성되어 직육면체 형태의 작업 영역을 가지는 로봇은?",
      choices: [
        "직교 좌표 로봇",
        "원통 좌표 로봇",
        "수직 다관절 로봇",
        "스카라(SCARA) 로봇"
      ],
      answer: "직교 좌표 로봇",
      explanation: "직교 좌표 로봇(Cartesian coordinate robot)은 서로 직각인 3개의 축(X, Y, Z)을 따라 직선 운동을 하며 작업 공간이 직육면체입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 18,
      certificationId: 1,
      type: "BLANK",
      source: "REAL_CBT",
      question: "공작기계의 기본 운동이 아닌 것은?",
      choices: [
        "절삭 운동",
        "공작물 착탈 운동",
        "위치조정 운동",
        "이송 운동"
      ],
      answer: "공작물 착탈 운동",
      explanation: "공작기계의 3대 기본 운동은 절삭 운동(주운동), 이송 운동, 위치조정(깊이조절) 운동입니다. 공작물을 붙이고 떼는 착탈 운동은 보조적인 준비 작업에 해당합니다.",
      examInfo: {
        year: 2015,
        round: "2회"
      }
    }
  ],
  2: [ // 전기기능사
    {
      id: 1,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "일반적인 금속 도체(구리 등)는 온도가 상승하면 전기 저항도 함께 증가한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "도체(금속)는 온도가 올라가면 내부 원자의 진동이 심해져 전자의 이동을 방해하므로 저항이 증가합니다. 이를 '정(+)의 온도 계수'를 가진다고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 2,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "플레밍의 왼손 법칙은 전동기(모터)의 원리를 설명합니다. 엄지는 힘(F)의 방향, 검지는 자계(B)의 방향, 그렇다면 중지는 무엇의 방향을 가리킬까요?",
      choices: [
        "전류 (I)",
        "전압 (V)",
        "저항 (R)",
        "속도 (v)"
      ],
      answer: "전류 (I)",
      explanation: "플레밍의 왼손 법칙에서 각 손가락은 다음과 같습니다. 엄지=힘(Force/전동기의 회전 방향), 검지=자계(Magnetic Field), 중지=전류(Current). 'FBI'로 외우면 쉽습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 3,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전기력선은 전위가 낮은 곳에서 시작하여 전위가 높은 곳으로 향한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전기력선은 물이 높은 곳에서 낮은 곳으로 흐르듯, 전위가 높은 곳(+극)에서 시작하여 전위가 낮은 곳(-극)으로 향합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 4,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "변압기는 전자기 유도 현상을 이용해 전압과 전류의 크기를 바꿀 수 있는 기기입니다. 하지만 1차측과 2차측 사이에서 절대 변하지 않는 요소는 무엇일까요?",
      choices: [
        "전압",
        "전류",
        "주파수",
        "임피던스"
      ],
      answer: "주파수",
      explanation: "변압기는 전압과 전류를 변환시켜주지만, 전원(입력)의 주파수는 변환 과정에서 바뀌지 않고 그대로 출력측으로 전달됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 5,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 회로에서 코일(인덕터)이나 콘덴서(커패시터)가 전류의 흐름을 방해하는 성질을 무엇이라고 합니까?",
      choices: [
        "리액턴스",
        "컨덕턴스",
        "서셉턴스",
        "어드미턴스"
      ],
      answer: "리액턴스",
      explanation: "저항(Resistance) 외에 코일이나 콘덴서에 의해 발생하는 교류 저항 성분을 리액턴스(Reactance)라고 하며, 단위는 옴(Ω)을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 6,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전류가 흐르면 열이 발생하는 현상(줄열)을 이용하지 '않는' 장치는 다음 중 무엇입니까?",
      choices: [
        "전기 다리미",
        "전기 밥솥",
        "백열 전구",
        "전기 도금조"
      ],
      answer: "전기 도금조",
      explanation: "전기 다리미, 밥솥, 백열 전구는 전류의 열작용을 이용합니다. 반면 전기 도금은 전류의 '화학 작용'을 이용하는 대표적인 예입니다.",
      examInfo: {
        year: 2015,
        round: "2회"
      }
    },
    {
      id: 7,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "회로에 흐르는 전류(I)의 크기는 전압(V)에 비례하고, [   ]에 반비례한다는 법칙을 '옴의 법칙'이라고 합니다.",
      choices: [
        "저항",
        "전력",
        "주파수",
        "인덕턴스"
      ],
      answer: "저항",
      explanation: "옴의 법칙(I = V/R)에 따르면 전류는 전압이 클수록 세지고, 흐름을 방해하는 저항이 클수록 약해집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 8,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "저항을 '직렬'로 연결할수록 전체 합성 저항값은 작아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "저항을 직렬로 연결하는 것은 전자가 지나가야 할 길이 길어지는 것과 같습니다. 따라서 저항을 더할수록 전체 저항값은 커집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 9,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "플레밍의 왼손 법칙이 전동기(모터)의 원리라면, 플레밍의 [   ] 법칙은 발전기의 원리를 설명합니다.",
      choices: [
        "오른손",
        "양손",
        "왼발",
        "오른발"
      ],
      answer: "오른손",
      explanation: "전동기는 전기를 써서 움직이므로 '우발좌전(발전기=오른손, 전동기=왼손)'으로 암기하면 편리합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 10,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "콘덴서(커패시터)를 [   ]로 연결하면, 저항을 직렬 연결한 것처럼 전체 용량이 증가합니다.",
      choices: [
        "병렬",
        "직렬",
        "교차",
        "개방"
      ],
      answer: "병렬",
      explanation: "콘덴서는 저항과 반대로 계산합니다. 콘덴서를 병렬로 연결하면 전하를 담을 수 있는 면적이 넓어지는 효과가 있어 용량이 커집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 11,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "일반적인 정현파 교류에서 '실효값'은 최대값을 √2로 나눈 값과 같다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "교류 전압이나 전류의 크기를 나타낼 때 주로 실효값을 사용하며, 정현파의 경우 실효값 = 최대값 / √2 (약 0.707배) 관계가 성립합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 12,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 '전기장의 세기'를 나타내는 단위로 올바른 것은 무엇입니까?",
      choices: [
        "V/m",
        "A/m",
        "C/m",
        "W/m"
      ],
      answer: "V/m",
      explanation: "전기장의 세기는 단위 길이당 전위차를 의미하므로 V/m(볼트 퍼 미터)를 단위로 사용합니다. (참고: A/m는 자기장의 세기)",
      examInfo: {
        year: 2015,
        round: "1회"
      }
    },
    {
      id: 13,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "회로의 접속점(노드)으로 들어오는 전류의 합과 나가는 전류의 합은 같다는 법칙을 '키르히호프의 [   ] 법칙'이라고 합니다.",
      choices: [
        "제1 (전류)",
        "제2 (전압)",
        "제3 (저항)",
        "제4 (전력)"
      ],
      answer: "제1 (전류)",
      explanation: "키르히호프의 제1법칙(KCL)은 전하량 보존 법칙에 기반하며, 회로의 어떤 지점에서든 들어온 전류의 총량과 나간 전류의 총량은 같다는 원리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 14,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "반도체나 전해액 같은 물질은 금속과 달리, 온도가 올라가면 전기 저항이 오히려 감소한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "일반적인 금속은 온도가 오르면 저항이 커지지만(정특성), 반도체나 탄소, 전해액 등은 온도가 오르면 저항이 작아지는 '부(-)성 저항 특성'을 가집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 15,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전동기(모터)는 [   ] 에너지를 기계적 회전 에너지로 변환해 주는 장치입니다. 빈칸에 들어갈 말은?",
      choices: [
        "전기",
        "화학",
        "열",
        "원자력"
      ],
      answer: "전기",
      explanation: "전동기는 전기를 공급받아 회전력을 만들어내는 기계입니다. 반대로 기계적 에너지를 전기 에너지로 바꾸는 장치는 발전기입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 16,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "콘덴서(커패시터)를 '직렬'로 연결하면 전체 합성 용량은 가장 작은 콘덴서의 용량보다도 작아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "콘덴서의 직렬 연결 계산식은 저항의 병렬 연결 식과 같습니다. 따라서 직렬로 연결할수록 전체 용량은 줄어듭니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 17,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 전력에서 전압과 전류의 위상차 때문에 실제로 일하는 전력(유효 전력)의 비율을 나타내는 것을 무엇이라고 합니까?",
      choices: [
        "역률",
        "효율",
        "부하율",
        "수용률"
      ],
      answer: "역률",
      explanation: "역률(Power Factor)은 전체 공급된 전력(피상 전력) 중에서 실제로 유효하게 사용된 전력(유효 전력)의 비율을 뜻합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 18,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전선의 피복이 벗겨지지 않은 상태에서, 전기가 새지 않고 잘 차단되어 있는지 확인하는 '절연 저항' 측정에 사용되는 계측기는?",
      choices: [
        "메거 (절연저항계)",
        "전류계",
        "전압계",
        "주파수계"
      ],
      answer: "메거 (절연저항계)",
      explanation: "절연 저항을 측정할 때는 높은 전압을 가해 미세한 누설 전류를 측정하는 '메거(Megger)'를 사용합니다.",
      examInfo: {
        year: 2016,
        round: "1회"
      }
    },
    {
      id: 19,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "폐회로(닫힌 회로) 내에서 전원 전압의 합과 전압 강하의 합은 같다는 법칙을 '키르히호프의 [   ] 법칙'이라고 합니다.",
      choices: [
        "제1 (전류)",
        "제2 (전압)",
        "제3 (에너지)",
        "제4 (주파수)"
      ],
      answer: "제2 (전압)",
      explanation: "키르히호프의 제2법칙(KVL)은 에너지 보존 법칙에 기반하며, 회로 한 바퀴를 돌 때 전압 상승과 전압 강하의 합이 0이 된다는 원리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 20,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "자석의 외부에서 자기력선은 항상 S극에서 나와서 N극으로 들어가는 방향이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "자기력선은 자석의 '외부'에서는 N극에서 나와 S극으로 들어가고, 자석의 '내부'에서는 S극에서 N극으로 향하여 폐곡선을 이룹니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 21,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 회로에서 저항(R)과 리액턴스(X)를 합친, 전류의 흐름을 방해하는 전체 저항 성분을 [   ](이)라고 합니다.",
      choices: [
        "임피던스",
        "어드미턴스",
        "서셉턴스",
        "컨덕턴스"
      ],
      answer: "임피던스",
      explanation: "임피던스(Z)는 교류 회로의 전체 저항값으로, 단위는 옴(Ω)을 사용합니다. 기호로는 Z = R + jX 형태로 표현합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 22,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "직류 발전기에 있는 '정류자'는 전기자에서 만들어진 교류 기전력을 직류로 변환해주는 역할을 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "발전기 내부(전기자)에서는 기본적으로 교류가 생성되지만, 정류자와 브러시를 거치면서 외부 회로에는 직류가 출력됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 23,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "4개의 저항을 다이아몬드 꼴로 연결하고, 대각선 방향의 저항 곱이 서로 같을 때 전류가 흐르지 않는 원리를 이용해 미지 저항을 측정하는 회로는?",
      choices: [
        "휘스톤 브리지",
        "배율기",
        "분류기",
        "전위차계"
      ],
      answer: "휘스톤 브리지",
      explanation: "휘스톤 브리지는 평형 상태(마주 보는 저항의 곱이 같음)를 이용하여 중간 저항값을 정밀하게 측정하는 장치입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 24,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 코일이 가지는 성질인 '인덕턴스(L)'의 단위로 올바른 것은 무엇입니까?",
      choices: [
        "옴 (Ω)",
        "헨리 (H)",
        "패럿 (F)",
        "쿨롱 (C)"
      ],
      answer: "헨리 (H)",
      explanation: "인덕턴스의 단위는 헨리(H)를 사용합니다. 참고로 옴(Ω)은 저항, 패럿(F)은 정전용량(콘덴서), 쿨롱(C)은 전하량의 단위입니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 25,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "자기장 내에서 도체가 힘을 받아 움직이는 방향을 결정하는 법칙으로, 왼손의 엄지(힘), 검지(자계), 중지(전류)를 사용하는 법칙은?",
      choices: [
        "플레밍의 왼손 법칙",
        "플레밍의 오른손 법칙",
        "앙페르의 오른나사 법칙",
        "렌츠의 법칙"
      ],
      answer: "플레밍의 왼손 법칙",
      explanation: "전동기(모터)의 원리인 힘의 방향을 찾을 때는 왼손을 사용합니다. (우발좌전: 발전기는 오른손, 전동기는 왼손)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 26,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "교류 회로에서 '공진'이란, 유도성 리액턴스(XL)와 용량성 리액턴스(XC)의 크기가 같아져서 허수부가 사라지는 상태를 말한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "공진 상태가 되면 XL = XC가 되어 서로 상쇄되므로, 회로의 임피던스는 최소(직렬 공진) 또는 최대(병렬 공진)가 되고 전압과 전류가 동상이 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 27,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 회로에서 과전류가 흐를 때, 스스로 녹아서 끊어짐으로써 회로를 보호하는 안전장치는 무엇입니까?",
      choices: [
        "퓨즈",
        "스위치",
        "변압기",
        "콘덴서"
      ],
      answer: "퓨즈",
      explanation: "퓨즈는 녹는점이 낮은 금속으로 만들어져 있어, 과도한 전류가 흐르면 발생하는 열에 의해 녹아 끊어지면서 회로를 차단합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 28,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "3상 교류 전력을 결선할 때, Y결선(성형 결선)에서는 선간 전압이 상전압보다 √3배 더 크다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "Y결선에서는 선전류와 상전류가 같고, 선간 전압은 상전압의 √3배입니다. (반대로 △결선은 전압이 같고 선전류가 √3배 큽니다.)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 29,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "반도체 소자 중 하나로, 한쪽 방향으로만 전류를 흐르게 하고 반대 방향은 차단하는 '정류 작용'을 하는 부품은?",
      choices: [
        "다이오드",
        "트랜지스터",
        "저항",
        "코일"
      ],
      answer: "다이오드",
      explanation: "다이오드(Diode)는 P형 반도체와 N형 반도체를 접합한 소자로, 순방향으로만 전류를 통과시키는 정류 특성을 가집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 30,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "전압계의 측정 범위를 넓히기 위해 전압계와 '직렬'로 연결하여 사용하는 저항기를 무엇이라고 합니까?",
      choices: [
        "배율기",
        "분류기",
        "변압기",
        "전류계"
      ],
      answer: "배율기",
      explanation: "전압계의 측정 범위를 확대하려면 저항을 직렬로 연결하여 전압을 분배시켜야 합니다. 이를 배율기라 하며, 전류계 범위를 넓히는 분류기(병렬 연결)와 구별해야 합니다.",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 31,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "자기장 속에서 도체가 움직이거나 자기장이 변할 때, 도체에 전압이 유도되는 현상을 무엇이라고 합니까?",
      choices: [
        "전자기 유도",
        "정전 유도",
        "자기 포화",
        "히스테리시스"
      ],
      answer: "전자기 유도",
      explanation: "전자기 유도는 코일 내부를 통과하는 자속이 변할 때 기전력(전압)이 발생하는 현상으로, 발전기와 변압기의 기본 원리입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 32,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전력량(Wh)은 전력(W)에 사용한 시간(h)을 곱한 값과 같다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "전력량은 일정 시간 동안 사용한 전기에너지를 의미하며, 전력(W) × 시간(h)으로 계산합니다. (1Wh = 3600J)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 33,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 '비정현파' 교류를 구성하는 성분이 '아닌' 것은 무엇입니까?",
      choices: [
        "삼각파",
        "직류분",
        "기본파",
        "고조파"
      ],
      answer: "삼각파",
      explanation: "푸리에 급수에 따르면 비정현파는 '직류분 + 기본파 + 고조파'의 합으로 표현됩니다. 삼각파는 비정현파의 한 종류(파형)일 뿐 구성 요소가 아닙니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 34,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "납축전지의 전해액으로는 '묽은 황산'을 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "납축전지는 양극에 과산화납, 음극에 납, 그리고 전해액으로 비중 약 1.2~1.3 정도의 묽은 황산을 사용하는 2차 전지입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 35,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 기기 철심 재료로 '규소 강판'을 사용하는 주된 이유는 무엇을 줄이기 위해서입니까?",
      choices: [
        "히스테리시스손",
        "와류손",
        "동손",
        "기계손"
      ],
      answer: "히스테리시스손",
      explanation: "철심에 규소를 섞으면 히스테리시스 손실이 줄어들고, 철심을 얇게 썰어 적층(성층)하면 와류손(맴돌이 전류 손실)이 줄어듭니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 36,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 자석의 성질인 '자화'가 가장 잘 일어나는 강자성체 물질에 속하지 '않는' 것은?",
      choices: [
        "니켈",
        "코발트",
        "철",
        "구리"
      ],
      answer: "구리",
      explanation: "강자성체는 자석에 잘 붙는 물질로 철, 니켈, 코발트, 망간 등이 있습니다. 구리는 반자성체(또는 상자성체)에 속하여 자석에 잘 붙지 않습니다.",
      examInfo: {
        year: 2016,
        round: "4회"
      }
    },
    {
      id: 37,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전하(전기량)의 단위는 무엇이며, 기호 C로 표시합니까?",
      choices: [
        "쿨롱 (Coulomb)",
        "헨리 (Henry)",
        "패럿 (Farad)",
        "와트 (Watt)"
      ],
      answer: "쿨롱 (Coulomb)",
      explanation: "전하의 양을 나타내는 단위는 쿨롱(C)입니다. 1A의 전류가 1초 동안 흐를 때 이동한 전하량을 1C라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 38,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전지를 '직렬'로 연결하면 전체 전압은 변하지 않고, 사용할 수 있는 용량(시간)만 늘어난다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전지를 직렬로 연결하면 전압이 더해져 높아집니다. 전압은 그대로 두고 용량을 늘리려면 '병렬'로 연결해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 39,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "유도 전동기에서 회전 자계의 속도(동기 속도)와 실제 회전자의 속도 차이를 비율로 나타낸 것을 무엇이라고 합니까?",
      choices: [
        "슬립 (Slip)",
        "역률 (Power Factor)",
        "효율 (Efficiency)",
        "토크 (Torque)"
      ],
      answer: "슬립 (Slip)",
      explanation: "유도 전동기는 구조상 회전자가 동기 속도보다 조금 늦게 돕니다. 이 속도 차이의 비율을 슬립이라고 하며, 정지 시 1, 동기 속도 회전 시 0이 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 40,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "'정류기(Rectifier)'는 직류(DC) 전원을 교류(AC) 전원으로 변환해 주는 장치이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "정류기는 교류(AC)를 직류(DC)로 바꾸는 장치입니다. 반대로 직류를 교류로 바꾸는 장치는 '인버터(Inverter)'라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 41,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "물질마다 전류의 흐름을 방해하는 정도가 다릅니다. 길이 1m, 단면적 1m²인 물질이 가지는 고유한 저항값을 무엇이라고 합니까?",
      choices: [
        "고유 저항 (저항률)",
        "컨덕턴스",
        "절연 저항",
        "접촉 저항"
      ],
      answer: "고유 저항 (저항률)",
      explanation: "물질의 종류에 따라 정해지는 저항의 기준값을 고유 저항(또는 비저항)이라고 하며, 단위는 Ω·m를 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 42,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "직선 도선에 전류가 흐를 때, 도선 주위에 생기는 자기장의 방향을 결정하는 법칙은 무엇입니까?",
      choices: [
        "앙페르의 오른나사 법칙",
        "렌츠의 법칙",
        "플레밍의 왼손 법칙",
        "패러데이의 법칙"
      ],
      answer: "앙페르의 오른나사 법칙",
      explanation: "전류가 흐르는 방향으로 나사를 진행시킬 때, 나사를 돌리는 방향이 곧 자기장의 방향이라는 법칙입니다. (오른손 엄지가 전류, 나머지 손가락이 자기장)",
      examInfo: {
        year: 2017,
        round: "1회"
      }
    },
    {
      id: 43,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "금속관 공사에서 전선을 연결할 때는 관 내부에서 전선을 접속(연결)해도 된다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전선관(금속관, 합성수지관 등) 내부에서는 전선의 접속점을 만들면 안 됩니다. 접속은 반드시 정크션 박스(Junction Box)나 아울렛 박스 내에서 해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 44,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "1차 전지(건전지 등)와 달리 충전하여 재사용할 수 있는 전지를 무엇이라고 합니까?",
      choices: [
        "2차 전지",
        "연료 전지",
        "태양 전지",
        "볼타 전지"
      ],
      answer: "2차 전지",
      explanation: "화학 에너지를 전기 에너지로 바꾸는 것을 방전, 반대로 전기를 가해 화학 에너지로 저장하는 것을 충전이라 하며, 충방전이 가능한 전지를 2차 전지(축전지)라고 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 45,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 '전압'의 단위로 사용되는 것은 무엇입니까?",
      choices: [
        "V (볼트)",
        "A (암페어)",
        "W (와트)",
        "Hz (헤르츠)"
      ],
      answer: "V (볼트)",
      explanation: "전압은 전기적인 위치 에너지의 차이(전위차)를 의미하며 단위는 볼트(V)입니다. (A:전류, W:전력, Hz:주파수)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 46,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "동기 발전기는 일정한 속도(동기 속도)로 회전하며 교류 전력을 생산하는 기기이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "동기 발전기는 회전자가 고정된 주파수와 동기화된 속도로 회전하며 전력을 생산합니다. 발전소에서 사용하는 대부분의 대형 발전기가 이에 해당합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 47,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "도체에 흐르는 전류를 방해하는 성질을 '저항'이라고 합니다. 이 저항의 단위 기호는 무엇일까요?",
      choices: [
        "Ω (옴)",
        "F (패럿)",
        "H (헨리)",
        "J (줄)"
      ],
      answer: "Ω (옴)",
      explanation: "독일의 물리학자 옴의 이름을 따서 저항의 단위로 옴(Ω)을 사용합니다. 1Ω은 1V 전압을 걸었을 때 1A의 전류가 흐르는 저항값입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 48,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "조명 설비에서 광원으로부터 나오는 빛의 총량을 나타내는 '광속'의 단위는 무엇입니까?",
      choices: [
        "루멘 (lm)",
        "럭스 (lx)",
        "칸델라 (cd)",
        "니트 (nt)"
      ],
      answer: "루멘 (lm)",
      explanation: "광속(Luminous Flux)은 광원에서 나오는 빛의 총량을 뜻하며 루멘(lm)을 씁니다. (럭스: 조도, 칸델라: 광도, 니트: 휘도)",
      examInfo: {
        year: 2017,
        round: "2회"
      }
    },
    {
      id: 49,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 전기에서 1초 동안 반복되는 사이클의 횟수를 주파수(Hz)라고 하며, 1개의 사이클이 완성되는 데 걸리는 시간을 [   ]라고 합니다.",
      choices: [
        "주기",
        "파장",
        "진폭",
        "위상"
      ],
      answer: "주기",
      explanation: "주파수(f)와 주기(T)는 역수 관계입니다(T=1/f). 예를 들어 60Hz 전기는 1초에 60번 진동하며, 주기는 1/60초입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 50,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "회로에 흐르는 전류를 측정하기 위해서 전류계는 부하와 반드시 '병렬'로 연결해야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "전류계는 회로를 끊고 그 사이에 연결하여 전류가 통과하도록 '직렬'로 연결해야 합니다. (전압계는 병렬로 연결)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 51,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "변압기는 1차 코일에 흐르는 전류가 변할 때, 철심을 통해 2차 코일에 기전력이 유도되는 [   ] 현상을 이용한 기기입니다.",
      choices: [
        "상호 유도",
        "정전 유도",
        "자기 포화",
        "와류 손실"
      ],
      answer: "상호 유도",
      explanation: "변압기는 전자기 유도 중에서도, 한쪽 코일의 자기장 변화가 인접한 다른 코일에 전압을 유도하는 '상호 유도 작용'을 원리로 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 52,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "3상 교류 회로에서 '델타(△) 결선'을 하면, 선간 전압과 상전압의 크기는 서로 같다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "델타(△) 결선에서는 선간 전압과 상전압이 같습니다(Vl = Vp). 반면 선전류는 상전류보다 √3배 큽니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 53,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전기 기기의 금속제 외함에 접지(Grounding)를 하는 주된 목적은 기기의 성능을 높이기 위해서이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "접지의 가장 주된 목적은 누전 시 전류를 대지로 흘려보내 인체의 '감전 사고를 방지'하고 기기를 보호하는 것입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 54,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "금속 전선관 공사를 할 때, 관을 구부려 원하는 모양(굴곡)을 만들기 위해 사용하는 공구는 무엇입니까?",
      choices: [
        "히키 (Hickey)",
        "오스터 (Oster)",
        "리머 (Reamer)",
        "클리퍼 (Clipper)"
      ],
      answer: "히키 (Hickey)",
      explanation: "금속관을 구부릴(벤딩) 때는 히키(Hickey)나 파이프 벤더를 사용합니다. (오스터: 나사 내기, 리머: 관 입구 다듬기, 클리퍼: 굵은 전선 절단)",
      examInfo: {
        year: 2016,
        round: "2회"
      }
    },
    {
      id: 55,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전류계의 측정 범위를 넓히기 위해 전류계와 '병렬'로 연결하여 사용하는 저항기를 무엇이라고 합니까?",
      choices: [
        "분류기",
        "배율기",
        "변압기",
        "유도기"
      ],
      answer: "분류기",
      explanation: "큰 전류가 흐를 때 전류계가 타지 않도록, 저항(분류기)을 병렬로 연결하여 전류를 나누어 흐르게 하는 원리입니다. (배율기는 전압계와 직렬)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 56,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "직류 전동기가 회전할 때 발생하는 '역기전력'은 회전 속도가 빠를수록 작아진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "직류 전동기의 역기전력(E)은 회전 속도(N)와 자속(Φ)에 비례합니다. 즉, 회전 속도가 빨라질수록 역기전력도 커집니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 57,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "평행판 콘덴서의 정전용량(C)은 극판의 면적이 넓을수록 커지고, 극판 사이의 [   ]이/가 멀어질수록 작아집니다.",
      choices: [
        "간격",
        "전압",
        "전류",
        "저항"
      ],
      answer: "간격",
      explanation: "정전용량 C = ε(A/d)입니다. 즉, 유전율(ε)과 면적(A)에는 비례하고, 극판 간격(d)에는 반비례합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 58,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속 전선관을 절단한 후, 전선의 피복이 손상되지 않도록 관의 안쪽 날카로운 부분을 다듬는 데 사용하는 공구는?",
      choices: [
        "리머 (Reamer)",
        "오스터 (Oster)",
        "노크아웃 펀치",
        "파이프 렌치"
      ],
      answer: "리머 (Reamer)",
      explanation: "금속관 절단면의 거친 부분을 매끄럽게 다듬는 공구를 리머라고 합니다. (오스터는 나사산을 낼 때 사용)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 59,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "코일(인덕터)은 흐르는 전류가 급격히 변하는 것을 막으려는 성질(유도 기전력 발생)을 가지고 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "코일은 전류가 변하면 그 변화를 방해하는 방향으로 유도 기전력을 만들어냅니다. 이를 렌츠의 법칙이라고 하며, 평활 회로 등에 이용됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 60,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "복도나 계단처럼 2개의 장소에서 전등 1개를 켜고 끌 수(점멸) 있도록 배선할 때 필요한 스위치는?",
      choices: [
        "3로 스위치",
        "단로 스위치",
        "4로 스위치",
        "타임 스위치"
      ],
      answer: "3로 스위치",
      explanation: "2개소 점멸 회로에는 '3로 스위치' 2개가 필요합니다. (참고: 3개소 이상에서 제어하려면 3로 스위치 사이에 4로 스위치를 추가합니다.)",
      examInfo: {
        year: 2015,
        round: "4회"
      }
    },
    {
      id: 61,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속관 공사에서 관을 서로 연결하거나 관과 부속품을 연결할 때 사용하는 '커플링(Coupling)'은 관의 바깥지름보다 약 몇 배 이상 깊게 끼워야 할까요?",
      choices: [
        "1.2배",
        "2.5배",
        "3.0배",
        "0.8배"
      ],
      answer: "1.2배",
      explanation: "관의 연결 부분은 튼튼해야 하므로, 커플링 안쪽으로 관의 바깥지름의 약 1.2배 이상 깊이까지 삽입하여 접속해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 62,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "납축전지의 용량을 나타내는 단위는 Ah(암페어 아워)를 사용한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "축전지 용량은 '방전 전류(A) × 방전 시간(h)'으로 나타내며 단위는 Ah입니다. (예: 100Ah는 1A로 100시간, 또는 10A로 10시간 쓸 수 있는 양)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 63,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "3상 유도 전동기의 회전 방향을 반대로 바꾸려면, 전원선 3가닥(R, S, T) 중 [   ]가닥의 연결을 서로 바꾸면 됩니다.",
      choices: [
        "2",
        "1",
        "3",
        "모든"
      ],
      answer: "2",
      explanation: "3상 전원 중 임의의 2선(예: R과 S, 또는 S와 T)을 서로 바꿔 연결하면 회전 자계의 방향이 반대가 되어 모터가 역회전합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 64,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "전기 기기 내부에서 절연유(기름)의 온도 상승이나 가스 발생 등을 감지하여 변압기 고장을 보호하는 계전기는?",
      choices: [
        "부흐홀츠 계전기",
        "차동 계전기",
        "과전류 계전기",
        "지락 계전기"
      ],
      answer: "부흐홀츠 계전기",
      explanation: "부흐홀츠 계전기는 유입 변압기 내부 고장 시 발생하는 가스나 유류의 흐름을 감지하여 동작하는 기계적 보호 장치입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 65,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "가공 전선로의 지지물(전봇대 등)을 세울 때, 땅에 묻히는 깊이는 일반적으로 지지물 전체 길이의 1/6 이상이어야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "전주가 넘어지지 않도록 충분히 깊게 묻어야 하며, 표준 깊이는 전장(전체 길이)의 6분의 1 이상입니다. (단, 15m 초과 시에는 2.5m 이상)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 66,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 전선 접속 시 전선의 전기 저항을 증가시키지 않기 위해 사용하는 접속 기구가 '아닌' 것은?",
      choices: [
        "와이어 스트리퍼",
        "슬리브",
        "와이어 커넥터",
        "터미널 러그"
      ],
      answer: "와이어 스트리퍼",
      explanation: "와이어 스트리퍼는 전선의 피복을 벗기는 공구입니다. 슬리브, 커넥터, 터미널 러그는 전선을 접속(연결)할 때 사용하는 자재입니다.",
      examInfo: {
        year: 2017,
        round: "3회"
      }
    },
    {
      id: 67,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "금속관 공사에서 전선의 피복 손상을 방지하기 위해 관 끝부분에 끼우는 부속품은 무엇입니까?",
      choices: [
        "부싱 (Bushing)",
        "로크 너트",
        "커플링",
        "노멀 밴드"
      ],
      answer: "부싱 (Bushing)",
      explanation: "금속관 절단면의 날카로운 부분으로부터 전선 피복을 보호하기 위해 관 끝단에 부싱을 끼웁니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 68,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "단상 유도 전동기 중 기동 토크가 가장 큰 것은 '반발 기동형'이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "단상 유도 전동기의 기동 토크 크기 순서는 '반발 기동형 > 반발 유도형 > 콘덴서 기동형 > 분상 기동형 > 셰이딩 코일형'입니다. (암기팁: 반콘분셰)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 69,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "변압기의 철심(Core)은 규소 강판을 겹쳐서 만듭니다. 이렇게 얇은 판을 여러 장 겹치는(성층) 이유는 무엇을 줄이기 위해서일까요?",
      choices: [
        "와류손 (맴돌이 전류 손실)",
        "히스테리시스손",
        "동손",
        "유전체손"
      ],
      answer: "와류손 (맴돌이 전류 손실)",
      explanation: "철심 내부에서 맴도는 전류(와전류)로 인한 열 손실을 줄이기 위해 절연된 얇은 강판을 겹쳐서 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 70,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "반도체 소자인 SCR(실리콘 제어 정류기)의 단자 3개는 애노드(A), 캐소드(K), 그리고 [   ]입니다.",
      choices: [
        "게이트 (G)",
        "베이스 (B)",
        "컬렉터 (C)",
        "이미터 (E)"
      ],
      answer: "게이트 (G)",
      explanation: "SCR은 애노드와 캐소드 사이에 전압을 걸고, 게이트(Gate)에 신호를 주어 전류를 흐르게 하는 3단자 사이리스터입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 71,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "가공 전선로에서 지지물(전주)을 보호하기 위해 설치하는 '지선(Stay Wire)'의 안전율은 2.5 이상이어야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "지선은 전주가 쓰러지지 않도록 지탱하는 중요한 설비이므로 안전율을 2.5 이상으로 하여 충분히 튼튼하게 설치해야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 72,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "주택이나 아파트 등 저압 옥내 배선 공사에서 사용할 수 '없는' 전선 굵기(단면적)는?",
      choices: [
        "1.5㎟",
        "2.5㎟",
        "4.0㎟",
        "6.0㎟"
      ],
      answer: "1.5㎟",
      explanation: "저압 옥내 배선에는 일반적으로 단면적 2.5㎟ 이상의 연동선(또는 이와 동등 이상의 세기 및 굵기)을 사용해야 합니다.",
      examInfo: {
        year: 2016,
        round: "4회"
      }
    },
    {
      id: 73,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "가공 전선로에서 지지물과 전선 사이를 절연하고 전선을 지지하는 역할을 하는 것은 무엇입니까?",
      choices: [
        "애자",
        "완금",
        "지선",
        "변압기"
      ],
      answer: "애자",
      explanation: "애자(Insulator)는 전기가 통하지 않는 절연체로 만들어져, 전선이 지지물(전봇대)을 통해 땅으로 누전되는 것을 막아줍니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 74,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "변압기는 2차측(부하측)을 개방(Open)한 상태에서 1차측에 정격 전압을 가하면 '무부하 시험'을 할 수 있다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "무부하 시험은 2차측에 아무것도 연결하지 않은 상태에서 진행하며, 이를 통해 변압기의 철손(히스테리시스손+와류손)과 여자 전류를 알 수 있습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 75,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "교류 회로에서 유효전력(P)과 무효전력(Pr)을 벡터 합한 전체 전력을 [   ] 전력이라고 합니다.",
      choices: [
        "피상",
        "순시",
        "최대",
        "평균"
      ],
      answer: "피상",
      explanation: "피상 전력(Pa)은 전압과 전류의 실효값을 단순히 곱한 값으로, 단위는 VA(볼트암페어)를 사용합니다. (Pa = √(P² + Pr²))",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 76,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전기 기기 외함의 접지 공사 시, 접지선은 가스관이나 수도관과 함께 묶어서 시공하는 것이 원칙이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "가스관은 폭발 위험이 있어 접지극으로 사용할 수 없습니다. 수도관은 특정 조건(저항값 등)을 만족할 때만 제한적으로 사용 가능합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 77,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 빛을 받으면 전기가 발생하는 '광전 효과'를 이용한 다이오드는 무엇입니까?",
      choices: [
        "포토 다이오드",
        "제너 다이오드",
        "발광 다이오드 (LED)",
        "터널 다이오드"
      ],
      answer: "포토 다이오드",
      explanation: "포토 다이오드는 빛 에너지를 전기 에너지로 변환하는 센서 역할을 합니다. 반대로 LED는 전기를 빛으로 바꿉니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 78,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "3상 동기 발전기를 병렬 운전할 때 반드시 같지 않아도 되는 조건은?",
      choices: [
        "용량",
        "주파수",
        "위상",
        "전압의 크기"
      ],
      answer: "용량",
      explanation: "병렬 운전 조건은 전압의 크기, 위상, 주파수, 파형이 같아야 합니다. 하지만 발전기 각각의 용량이나 전류 크기는 달라도 운전할 수 있습니다.",
      examInfo: {
        year: 2017,
        round: "3회"
      }
    },
    {
      id: 79,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "3상 4선식 배전 방식에서, 전압선(Line)과 중성선(Neutral) 사이의 전압을 [   ] 전압이라고 합니다.",
      choices: [
        "상",
        "선간",
        "대지",
        "단자"
      ],
      answer: "상",
      explanation: "3상 4선식에서 각 전압선과 중성선 사이를 연결하면 상전압(220V)을 얻을 수 있고, 전압선끼리 연결하면 선간 전압(380V)을 얻습니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 80,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "금속 덕트 공사 시, 덕트 내부에는 전선의 접속점이 있어도 무방하다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "금속관 공사와 마찬가지로 금속 덕트 내부에서도 전선의 접속점을 만들면 안 됩니다. 점검 및 유지보수가 어렵고 화재 위험이 있기 때문입니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 81,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 전선의 굵기를 결정할 때 고려해야 할 3요소에 해당하지 '않는' 것은?",
      choices: [
        "가격",
        "허용 전류",
        "전압 강하",
        "기계적 강도"
      ],
      answer: "가격",
      explanation: "전선을 선정할 때는 안전하게 흘릴 수 있는 '허용 전류', 전기가 오면서 떨어지는 '전압 강하', 그리고 끊어지지 않는 '기계적 강도'를 최우선으로 고려합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 82,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "교류 회로에서 '어드미턴스(Admittance)'는 전류가 흐르기 쉬운 정도를 나타내며, 임피던스(Z)의 역수이다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "임피던스가 전류를 방해하는 전체 저항이라면, 어드미턴스(Y)는 반대로 전류를 잘 흐르게 하는 성질입니다. (Y = 1/Z, 단위: 모[℧] 또는 지멘스[S])",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 83,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "단위 시간(1초) 동안 이동한 전하의 양(Q/t)을 무엇이라고 정의합니까?",
      choices: [
        "전류",
        "전압",
        "전력",
        "저항"
      ],
      answer: "전류",
      explanation: "전류(I)는 전하의 흐름입니다. 1초 동안 1쿨롱(C)의 전하가 이동하면 1암페어(A)의 전류가 흐르는 것입니다. (I = Q/t)",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 84,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 반도체 소자를 이용한 '정류 회로'에서 가장 이상적인(효율이 좋은) 파형은?",
      choices: [
        "삼상 전파 정류",
        "단상 반파 정류",
        "단상 전파 정류",
        "삼상 반파 정류"
      ],
      answer: "삼상 전파 정류",
      explanation: "맥동률(Ripple Factor)이 작을수록 직류에 가깝고 효율이 좋습니다. 순서는 '삼상 전파 > 삼상 반파 > 단상 전파 > 단상 반파' 순으로 성능이 좋습니다.",
      examInfo: {
        year: 2017,
        round: "4회"
      }
    },
    {
      id: 85,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "다음 중 '전선'을 보호하고 전선을 정리하기 위해 사용하는 '금속제'의 함(Box)으로, 내부에서 전선을 접속할 수 '없는' 것은?",
      choices: [
        "풀 박스 (Pull Box)",
        "정크션 박스",
        "아웃렛 박스",
        "스위치 박스"
      ],
      answer: "풀 박스 (Pull Box)",
      explanation: "풀 박스는 전선의 배관 길이가 길거나 굴곡이 많을 때 전선을 쉽게 당기기(Pull) 위해 설치하는 함입니다. 원칙적으로 접속점이 없어야 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 86,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "RLC 직렬 회로에서 유도성 리액턴스(XL)가 용량성 리액턴스(XC)보다 크면, 전체 회로는 '콘덴서'와 같은 성질을 가진다.",
      choices: [
        "O",
        "X"
      ],
      answer: "X",
      explanation: "XL(코일 성분)이 XC(콘덴서 성분)보다 크면, 전체 회로는 '유도성(코일)' 성질을 가지게 되어 전류가 전압보다 뒤지는 지상 회로가 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 87,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "직류 발전기에서 전기자가 회전하면서 만든 교류를 직류로 바꾸어 주는 핵심 부품은 '정류자'와 [   ]입니다.",
      choices: [
        "브러시",
        "계자",
        "철심",
        "베어링"
      ],
      answer: "브러시",
      explanation: "정류자는 회전하면서 극성을 바꿔주고, 브러시는 정류자에 접촉하여 발생된 전기를 외부 회로로 전달하는 역할을 합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 88,
      certificationId: 2,
      type: "OX",
      source: "AI_GENERATED",
      question: "전선의 색상을 구분할 때, 보호 도체(PE, 접지선)는 반드시 '녹색과 노란색'이 섞인 색을 사용해야 한다.",
      choices: [
        "O",
        "X"
      ],
      answer: "O",
      explanation: "KEC(한국전기설비규정)에 따라 보호 도체(접지선)는 녹색-노란색 교차 무늬를 사용해야 하며, 중성선(N)은 파란색을 사용합니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 89,
      certificationId: 2,
      type: "BLANK",
      source: "AI_GENERATED",
      question: "물질 내에서 자속이 통과하기 어려운 정도를 나타내는 '자기 저항'의 단위는 무엇입니까?",
      choices: [
        "AT/Wb",
        "Wb/m²",
        "H/m",
        "AT/m"
      ],
      answer: "AT/Wb",
      explanation: "자기 저항(R)은 기자력(F)을 자속(Φ)으로 나눈 값입니다. 기자력의 단위 AT(암페어턴)와 자속의 단위 Wb(웨버)를 사용하여 AT/Wb가 됩니다.",
      examInfo: {
        year: null,
        round: null
      }
    },
    {
      id: 90,
      certificationId: 2,
      type: "BLANK",
      source: "REAL_CBT",
      question: "다음 중 전선을 접속할 때 사용하는 '쥐꼬리 접속' 후에 접속 부분을 보호하고 절연하기 위해 사용하는 부품은?",
      choices: [
        "와이어 커넥터",
        "터미널 러그",
        "링 슬리브",
        "케이블 타이"
      ],
      answer: "와이어 커넥터",
      explanation: "박스 내에서 가는 전선을 꼬아서 접속(쥐꼬리 접속)한 후에는, 풀리지 않게 고정하고 절연 처리를 하기 위해 와이어 커넥터를 씌웁니다.",
      examInfo: {
        year: 2015,
        round: "1회"
      }
    }
  ]
};

// Mock 학습 세션 데이터
const mockLearningSessions = [];

// Mock 복습 카드 데이터
const mockReviewCards = [];

// 로컬 스토리지 키
const STORAGE_KEYS = {
  USERS: 'mock_users',
  SESSIONS: 'mock_sessions',
  REVIEW_CARDS: 'mock_review_cards',
  LEARNING_START_DATE: 'learning_start_date', // 사용자별 학습 시작 날짜
};

// AsyncStorage에서 데이터 로드 (비동기)
const loadFromStorage = async (key, defaultValue = []) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// AsyncStorage에 데이터 저장 (비동기)
const saveToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// 초기화: AsyncStorage에 Mock 데이터 저장 (처음 한 번만)
const initializeMockData = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      await saveToStorage(STORAGE_KEYS.USERS, mockUsers);
      await saveToStorage(STORAGE_KEYS.SESSIONS, mockLearningSessions);
      await saveToStorage(STORAGE_KEYS.REVIEW_CARDS, mockReviewCards);
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

// 앱 시작 시 초기화
initializeMockData();

export const mockData = {
  users: mockUsers,
  certifications: mockCertifications,
  flashCards: mockFlashCards,
  questions: mockQuestions,
  learningSessions: mockLearningSessions,
  reviewCards: mockReviewCards,
  companies: mockCompanies,
  tutorialCertifications: mockTutorialCertifications,
  departmentCertStats: mockDepartmentCertStats,
  friendsData: mockFriendsData,
  maskName,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
};
