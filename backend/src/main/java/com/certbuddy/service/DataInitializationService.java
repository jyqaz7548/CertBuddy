package com.certbuddy.service;

import com.certbuddy.entity.Certification;
import com.certbuddy.entity.Question;
import com.certbuddy.repository.CertificationRepository;
import com.certbuddy.repository.QuestionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 애플리케이션 시작 시 초기 데이터를 삽입하는 서비스
 * 
 * 사용 방법:
 * 1. application.properties에 다음 설정 추가:
 *    data.init.enabled=true
 * 
 * 2. 서버 실행 시 자동으로 데이터 삽입
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Order(1)
public class DataInitializationService implements CommandLineRunner {
    
    private final CertificationRepository certificationRepository;
    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;
    
    @Override
    @Transactional
    public void run(String... args) {
        // application.properties에서 초기화 활성화 여부 확인
        // 여기서는 간단하게 데이터가 없을 때만 삽입하도록 구현
        if (certificationRepository.count() == 0) {
            log.info("초기 데이터 삽입 시작...");
            initializeCertifications();
            log.info("자격증 데이터 삽입 완료");
        } else {
            log.info("자격증 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
        }
        
        if (questionRepository.count() == 0) {
            log.info("문제 데이터 삽입 시작...");
            initializeQuestions();
            log.info("문제 데이터 삽입 완료");
        } else {
            log.info("문제 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
        }
    }
    
    private void initializeCertifications() {
        List<Certification> certifications = Arrays.asList(
            Certification.builder().name("자동화설비기능사").description("자동화설비 관련 자격증").build(),
            Certification.builder().name("전기기능사").description("전기 관련 자격증").build(),
            Certification.builder().name("프로그래밍기능사").description("프로그래밍 관련 자격증").build(),
            Certification.builder().name("전자기능사").description("전자 관련 자격증").build(),
            Certification.builder().name("컴활1급").description("컴퓨터활용능력 1급").build(),
            Certification.builder().name("전산응용기계제도기능사").description("전산응용기계제도 관련 자격증").build(),
            Certification.builder().name("3D프린터운용기능사").description("3D프린터 운용 관련 자격증").build(),
            Certification.builder().name("정보기기운용기능사").description("정보기기 운용 관련 자격증").build(),
            Certification.builder().name("웹디자인개발기능사").description("웹디자인 개발 관련 자격증").build()
        );
        
        certificationRepository.saveAll(certifications);
    }
    
    private void initializeQuestions() {
        // 자격증 ID 매핑 (이름으로 찾기)
        Map<String, Long> certIdMap = new HashMap<>();
        certificationRepository.findAll().forEach(cert -> {
            certIdMap.put(cert.getName(), cert.getId());
        });
        
        List<Question> questions = new ArrayList<>();
        
        // 자동화설비기능사 문제들
        Long cert1Id = certIdMap.get("자동화설비기능사");
        if (cert1Id != null) {
            questions.addAll(createAutomationQuestions(cert1Id));
        }
        
        // 전기기능사 문제들 (간단한 예시)
        Long cert2Id = certIdMap.get("전기기능사");
        if (cert2Id != null) {
            questions.addAll(createElectricQuestions(cert2Id));
        }
        
        // 프로그래밍기능사 문제들 (간단한 예시)
        Long cert3Id = certIdMap.get("프로그래밍기능사");
        if (cert3Id != null) {
            questions.addAll(createProgrammingQuestions(cert3Id));
        }
        
        // 전자기능사 문제들 (간단한 예시)
        Long cert4Id = certIdMap.get("전자기능사");
        if (cert4Id != null) {
            questions.addAll(createElectronicsQuestions(cert4Id));
        }
        
        // 정보기기운용기능사 문제들 (간단한 예시)
        Long cert8Id = certIdMap.get("정보기기운용기능사");
        if (cert8Id != null) {
            questions.addAll(createInfoDeviceQuestions(cert8Id));
        }
        
        // 전산응용기계제도기능사 문제들 (간단한 예시)
        Long cert9Id = certIdMap.get("전산응용기계제도기능사");
        if (cert9Id != null) {
            questions.addAll(createCADQuestions(cert9Id));
        }
        
        // 컴활1급 문제들 (간단한 예시)
        Long cert10Id = certIdMap.get("컴활1급");
        if (cert10Id != null) {
            questions.addAll(createComputerQuestions(cert10Id));
        }
        
        questionRepository.saveAll(questions);
    }
    
    // 자동화설비기능사 문제 생성
    private List<Question> createAutomationQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        // 문제 1
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.OX)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("선반 작업 시 발생한 칩(Chip)은 기계가 작동 중일 때 손으로 즉시 제거해야 안전하다.")
                .choices(convertChoicesToJson(Arrays.asList("O", "X")))
                .answer("X")
                .explanation("칩은 매우 날카롭고 뜨거우며, 회전하는 기계에 손이 말려들어갈 위험이 있으므로 반드시 기계를 정지시킨 후 브러시나 갈고리 등을 사용하여 제거해야 합니다.")
                .build());
        
        // 문제 2
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("CNC 선반 프로그래밍에서 공구를 급속 이송(위치 결정)시킬 때 사용하는 G 코드는 무엇인가?")
                .choices(convertChoicesToJson(Arrays.asList("G00", "G01", "G02", "G03")))
                .answer("G00")
                .explanation("G00은 급속 위치 결정(급송), G01은 직선 보간(절삭 이송), G02는 시계 방향 원호 보간, G03은 반시계 방향 원호 보간입니다.")
                .build());
        
        // 문제 3
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.OX)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("유압 장치에서 작동유의 온도가 상승하면 점도는 낮아진다.")
                .choices(convertChoicesToJson(Arrays.asList("O", "X")))
                .answer("O")
                .explanation("일반적으로 액체(작동유)는 온도가 상승하면 분자 운동이 활발해져 점도가 낮아(묽어)집니다.")
                .build());
        
        // 문제 4
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("기계 제도에서 물체의 보이지 않는 부분의 형상을 나타낼 때 사용하는 선의 명칭은 무엇인가?")
                .choices(convertChoicesToJson(Arrays.asList("외형선", "숨은선", "중심선", "파단선")))
                .answer("숨은선")
                .explanation("물체의 보이지 않는 부분은 점선 또는 파선 형태의 '숨은선'으로 표현합니다.")
                .build());
        
        // 문제 5
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("PLC 시퀀스 제어에서 두 개의 입력 접점이 직렬로 연결되어, 두 입력이 모두 ON일 때만 출력이 발생하는 논리 회로는?")
                .choices(convertChoicesToJson(Arrays.asList("OR 회로", "AND 회로", "NOT 회로", "NAND 회로")))
                .answer("AND 회로")
                .explanation("직렬 연결은 AND 논리(논리곱)에 해당하며, 모든 조건이 만족되어야 결과가 출력됩니다.")
                .build());
        
        return questions;
    }
    
    // 전기기능사 문제 생성 (간단한 예시)
    private List<Question> createElectricQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.OX)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("전기 회로에서 전압과 전류는 항상 비례 관계이다.")
                .choices(convertChoicesToJson(Arrays.asList("O", "X")))
                .answer("X")
                .explanation("옴의 법칙에 따르면 전압 = 전류 × 저항이므로, 저항이 일정할 때만 전압과 전류가 비례합니다.")
                .build());
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("직류 전압을 측정할 때 사용하는 계기는?")
                .choices(convertChoicesToJson(Arrays.asList("전압계", "전류계", "전력계", "저항계")))
                .answer("전압계")
                .explanation("직류 전압을 측정할 때는 전압계를 사용합니다.")
                .build());
        
        return questions;
    }
    
    // 프로그래밍기능사 문제 생성 (간단한 예시)
    private List<Question> createProgrammingQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("다음 중 변수의 값을 변경할 수 없는 데이터 타입은?")
                .choices(convertChoicesToJson(Arrays.asList("int", "const", "var", "let")))
                .answer("const")
                .explanation("const는 상수로 선언되어 한 번 할당된 값을 변경할 수 없습니다.")
                .build());
        
        return questions;
    }
    
    // 전자기능사 문제 생성 (간단한 예시)
    private List<Question> createElectronicsQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("반도체 소자 중 전류를 한 방향으로만 흐르게 하는 소자는?")
                .choices(convertChoicesToJson(Arrays.asList("트랜지스터", "다이오드", "저항", "콘덴서")))
                .answer("다이오드")
                .explanation("다이오드는 전류를 한 방향으로만 흐르게 하는 정류 작용을 합니다.")
                .build());
        
        return questions;
    }
    
    // 정보기기운용기능사 문제 생성 (간단한 예시)
    private List<Question> createInfoDeviceQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("컴퓨터의 중앙처리장치를 의미하는 약어는?")
                .choices(convertChoicesToJson(Arrays.asList("CPU", "GPU", "RAM", "SSD")))
                .answer("CPU")
                .explanation("CPU는 Central Processing Unit의 약자로 중앙처리장치를 의미합니다.")
                .build());
        
        return questions;
    }
    
    // 전산응용기계제도기능사 문제 생성 (간단한 예시)
    private List<Question> createCADQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("CAD 소프트웨어에서 선을 그릴 때 사용하는 명령어는?")
                .choices(convertChoicesToJson(Arrays.asList("LINE", "CIRCLE", "RECTANGLE", "ARC")))
                .answer("LINE")
                .explanation("LINE 명령어는 직선을 그리는 기본 명령어입니다.")
                .build());
        
        return questions;
    }
    
    // 컴활1급 문제 생성 (간단한 예시)
    private List<Question> createComputerQuestions(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .certification(cert)
                .type(Question.QuestionType.BLANK)
                .source(Question.QuestionSource.AI_GENERATED)
                .question("엑셀에서 셀의 합계를 구하는 함수는?")
                .choices(convertChoicesToJson(Arrays.asList("SUM", "AVG", "MAX", "MIN")))
                .answer("SUM")
                .explanation("SUM 함수는 선택한 셀들의 합계를 구하는 함수입니다.")
                .build());
        
        return questions;
    }
    
    // 선택지 리스트를 JSON 문자열로 변환
    private String convertChoicesToJson(List<String> choices) {
        try {
            return objectMapper.writeValueAsString(choices);
        } catch (Exception e) {
            log.error("선택지 JSON 변환 실패", e);
            return "[]";
        }
    }
}

