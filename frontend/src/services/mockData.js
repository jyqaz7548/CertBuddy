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
// certificationId: 2 = 전기기능사
const mockQuestions = {
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
