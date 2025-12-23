package com.certbuddy.service;

import com.certbuddy.dto.request.QuestionAnswerRequest;
import com.certbuddy.dto.response.*;
import com.certbuddy.entity.*;
import com.certbuddy.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final CertificationRepository certificationRepository;
    private final QuestionSessionRepository questionSessionRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final ReviewQuestionRepository reviewQuestionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
    
    // 문제가 있는 자격증 목록 조회
    public List<CertificationResponse> getAvailableCertifications() {
        // 문제가 있는 자격증만 반환
        List<Long> certIdsWithQuestions = questionRepository.findAll().stream()
                .map(q -> q.getCertification().getId())
                .distinct()
                .collect(Collectors.toList());
        
        return certificationRepository.findAllById(certIdsWithQuestions).stream()
                .map(cert -> CertificationResponse.builder()
                        .id(cert.getId())
                        .name(cert.getName())
                        .description(cert.getDescription())
                        .build())
                .collect(Collectors.toList());
    }
    
    // 자격증별 학습률 조회
    public CertificationProgressResponse getCertificationProgress(Long certificationId, Long userId) {
        // 일차별 완료 상태 조회 (재학습 제외)
        List<QuestionSession> completedSessions = questionSessionRepository
                .findByUserIdAndCertificationId(userId, certificationId).stream()
                .filter(s -> s.getStatus() == QuestionSession.SessionStatus.COMPLETED)
                .filter(s -> !s.getIsRelearning()) // 재학습 세션 제외
                .collect(Collectors.toList());
        
        Set<Integer> completedDays = completedSessions.stream()
                .map(QuestionSession::getSpecificDay)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        // 프론트엔드와 동일하게 15일 기준
        int totalDays = 15;
        double progress = completedDays.size() / (double) totalDays; // 0.0 ~ 1.0 범위
        double progressPercentage = progress * 100; // 백분율
        
        Map<Integer, Boolean> dayStatuses = new HashMap<>();
        for (int day = 1; day <= totalDays; day++) {
            dayStatuses.put(day, completedDays.contains(day));
        }
        
        return CertificationProgressResponse.builder()
                .certificationId(certificationId)
                .totalDays(totalDays)
                .completedDays(completedDays.size())
                .progress(progress) // 프론트엔드 호환성을 위해 추가
                .progressPercentage(progressPercentage)
                .dayStatuses(dayStatuses)
                .build();
    }
    
    // 오늘 학습 완료 여부 확인
    public TodayLearningStatusResponse getTodayLearningStatus(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        
        // 오늘 완료한 학습 세션 확인
        List<QuestionSession> todaySessions = questionSessionRepository.findByUserId(userId).stream()
                .filter(s -> s.getStatus() == QuestionSession.SessionStatus.COMPLETED)
                .filter(s -> s.getCompletedAt() != null)
                .filter(s -> s.getCompletedAt().isAfter(startOfDay) && s.getCompletedAt().isBefore(endOfDay))
                .collect(Collectors.toList());
        
        boolean isLearningCompleted = !todaySessions.isEmpty();
        
        // 복습 문제 확인: 미완료 복습 문제만 조회
        // 완료된 복습 문제는 nextReviewDate가 1년 이상 미래인 것으로 간주
        List<ReviewQuestion> allReviewQuestions = reviewQuestionRepository.findByUserId(userId);
        LocalDateTime oneYearLater = LocalDateTime.now().plusYears(1);
        
        // 완료되지 않은 복습 문제만 필터링
        List<ReviewQuestion> activeReviewQuestions = allReviewQuestions.stream()
                .filter(rq -> rq.getNextReviewDate() == null || rq.getNextReviewDate().isBefore(oneYearLater))
                .collect(Collectors.toList());
        
        boolean hasReviewQuestions = !activeReviewQuestions.isEmpty();
        
        // 복습 완료 여부: 복습 문제가 없을 때만 완료
        // 틀린 문제가 있으면 복습이 필요하므로 복습 완료로 표시하지 않음
        boolean isReviewCompleted = !hasReviewQuestions;
        
        return TodayLearningStatusResponse.builder()
                .isLearningCompleted(isLearningCompleted)
                .isReviewCompleted(isReviewCompleted)
                .hasReviewQuestions(hasReviewQuestions)
                .reviewCount(activeReviewQuestions.size()) // 미완료 복습 문제 개수만 반환
                .build();
    }
    
    // 일차별 완료 상태 조회
    public List<DayStatusResponse> getDayStatuses(Long certificationId, Long userId) {
        final int TOTAL_DAYS = 15;
        
        // 완료된 학습 세션들
        List<QuestionSession> completedSessions = questionSessionRepository
                .findByUserIdAndCertificationId(userId, certificationId).stream()
                .filter(s -> s.getStatus() == QuestionSession.SessionStatus.COMPLETED && !s.getIsRelearning())
                .collect(Collectors.toList());
        
        // 완료된 일차들 추출
        Set<Integer> completedDays = completedSessions.stream()
                .map(QuestionSession::getSpecificDay)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        // 각 일차별 복습 문제 수 계산 (미완료 복습 문제만)
        Map<Integer, Integer> dayReviewCounts = new HashMap<>();
        List<ReviewQuestion> allReviewQuestions = reviewQuestionRepository
                .findByUserIdAndCertificationId(userId, certificationId);
        
        // 완료된 복습 문제 필터링 (nextReviewDate가 1년 이상 미래인 것은 완료로 간주)
        LocalDateTime oneYearLater = LocalDateTime.now().plusYears(1);
        List<ReviewQuestion> reviewQuestions = allReviewQuestions.stream()
                .filter(rq -> rq.getNextReviewDate() == null || rq.getNextReviewDate().isBefore(oneYearLater))
                .collect(Collectors.toList());
        
        // 해당 자격증의 모든 문제를 ID 순서로 가져오기
        List<Question> allQuestions = questionRepository.findByCertificationId(certificationId)
                .stream()
                .sorted(Comparator.comparing(Question::getId))
                .collect(Collectors.toList());
        
        // 문제 ID를 인덱스로 변환하는 맵 생성
        Map<Long, Integer> questionIdToIndex = new HashMap<>();
        for (int i = 0; i < allQuestions.size(); i++) {
            questionIdToIndex.put(allQuestions.get(i).getId(), i);
        }
        
        // 각 일차별 문제 수 계산 (하루에 6문제씩)
        for (ReviewQuestion rq : reviewQuestions) {
            Long questionId = rq.getQuestion().getId();
            Integer questionIndex = questionIdToIndex.get(questionId);
            if (questionIndex != null) {
                // 문제 인덱스를 일차로 변환 (1일차: 0-5, 2일차: 6-11, ...)
                int day = (questionIndex / 6) + 1;
                if (day >= 1 && day <= TOTAL_DAYS) {
                    dayReviewCounts.put(day, dayReviewCounts.getOrDefault(day, 0) + 1);
                }
            }
        }
        
        // 각 일차별 상태 생성
        List<DayStatusResponse> dayStatuses = new ArrayList<>();
        for (int day = 1; day <= TOTAL_DAYS; day++) {
            boolean isCompleted = completedDays.contains(day);
            int reviewCount = dayReviewCounts.getOrDefault(day, 0);
            
            // 복습 문제가 있으면 완료 처리하지 않음
            boolean hasReviewQuestions = reviewCount > 0;
            boolean actuallyCompleted = isCompleted && !hasReviewQuestions;
            
            // 이전 일차가 완료되었거나 1일차인 경우 잠금 해제
            boolean isLocked = false;
            if (day > 1) {
                // 이전 일차의 완료 상태와 복습 문제 수 확인
                boolean previousDayCompleted = completedDays.contains(day - 1);
                int previousDayReviewCount = dayReviewCounts.getOrDefault(day - 1, 0);
                // 이전 일차가 완료되었고 복습 문제가 없어야 잠금 해제
                boolean previousDayActuallyCompleted = previousDayCompleted && previousDayReviewCount == 0;
                isLocked = !previousDayActuallyCompleted;
            }
            
            dayStatuses.add(DayStatusResponse.builder()
                    .day(day)
                    .isCompleted(actuallyCompleted)
                    .isLocked(isLocked)
                    .reviewCount(reviewCount)
                    .build());
        }
        
        return dayStatuses;
    }
    
    // 문제 목록 조회 (자격증별)
    public List<QuestionResponse> getQuestions(Long certificationId) {
        List<Question> questions = questionRepository.findByCertificationId(certificationId);
        
        return questions.stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }
    
    // 문제 세션 시작
    @Transactional
    public QuestionSessionResponse startQuestionSession(Long certificationId, Long userId, 
                                                       Integer specificDay, Boolean isRelearning) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        // 특정 일차가 지정된 경우 해당 일차의 문제만 가져오기 (하루에 6문제)
        List<QuestionResponse> questions;
        if (specificDay != null && specificDay > 0) {
            List<Question> allQuestions = questionRepository.findByCertificationId(certificationId)
                    .stream()
                    .sorted(Comparator.comparing(Question::getId))
                    .collect(Collectors.toList());
            
            // 일차별 문제 범위 계산 (1일차: 0-5, 2일차: 6-11, ...)
            int startIndex = (specificDay - 1) * 6;
            int endIndex = Math.min(startIndex + 6, allQuestions.size());
            
            questions = allQuestions.subList(startIndex, endIndex).stream()
                    .map(this::mapToQuestionResponse)
                    .collect(Collectors.toList());
        } else {
            // 전체 문제 가져오기
            questions = getQuestions(certificationId);
        }
        
        QuestionSession session = QuestionSession.builder()
                .user(user)
                .certification(certification)
                .specificDay(specificDay)
                .isRelearning(isRelearning != null ? isRelearning : false)
                .status(QuestionSession.SessionStatus.IN_PROGRESS)
                .totalQuestions(questions.size())
                .startedAt(LocalDateTime.now())
                .build();
        
        session = questionSessionRepository.save(session);
        
        QuestionSessionResponse response = mapToQuestionSessionResponse(session);
        response.setQuestions(questions);
        
        return response;
    }
    
    // 문제 답안 제출 및 결과 저장
    @Transactional
    public QuestionAnswer submitAnswer(Long sessionId, Long questionId, String selectedAnswer, Boolean isCorrect) {
        QuestionSession session = questionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다"));
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다"));
        
        QuestionAnswer answer = QuestionAnswer.builder()
                .session(session)
                .question(question)
                .selectedAnswer(selectedAnswer)
                .isCorrect(isCorrect)
                .answeredAt(LocalDateTime.now())
                .build();
        
        return questionAnswerRepository.save(answer);
    }
    
    // 학습 세션 완료
    @Transactional
    public QuestionSessionResponse completeQuestionSession(Long sessionId, List<QuestionAnswerRequest> results, Long userId) {
        QuestionSession session = questionSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다"));
        
        int totalQuestions = results.size();
        long correctAnswers = results.stream().filter(QuestionAnswerRequest::getIsCorrect).count();
        
        // 각 답안을 DB에 저장
        for (QuestionAnswerRequest result : results) {
            Question question = questionRepository.findById(result.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다"));
            
            QuestionAnswer answer = QuestionAnswer.builder()
                    .session(session)
                    .question(question)
                    .selectedAnswer(result.getSelectedAnswer())
                    .isCorrect(result.getIsCorrect())
                    .answeredAt(LocalDateTime.now())
                    .build();
            questionAnswerRepository.save(answer);
            
            // 틀린 문제는 복습 문제로 추가 (중복 체크는 addReviewQuestion 내부에서 처리)
            if (!result.getIsCorrect()) {
                addReviewQuestion(userId, result.getQuestionId(), session.getCertification().getId());
            }
        }
        
        // XP 계산 (간단한 구현: 문제당 10XP, 정답률에 따라 보너스)
        int baseXp = totalQuestions * 10;
        int bonusXp = (int) (correctAnswers * 5); // 정답당 5XP 보너스
        int totalXp = baseXp + bonusXp;
        
        session.setTotalQuestions(totalQuestions);
        session.setCorrectAnswers((int) correctAnswers);
        session.setXpEarned(totalXp);
        session.setStatus(QuestionSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        
        // 사용자 XP 업데이트
        User user = session.getUser();
        user.setTotalXp(user.getTotalXp() + totalXp);
        user.setLastStudyDate(LocalDateTime.now()); // 마지막 학습일 업데이트
        user.setStreak(user.getStreak() + 1); // 스트릭 증가 (TODO: 연속 학습 여부 확인 로직 추가 필요)
        userRepository.save(user);
        
        session = questionSessionRepository.save(session);
        
        return mapToQuestionSessionResponse(session);
    }
    
    // 복습 문제 목록 조회
    public List<QuestionResponse> getReviewQuestions(Long userId, Long certificationId) {
        List<ReviewQuestion> reviewQuestions;
        
        if (certificationId != null) {
            reviewQuestions = reviewQuestionRepository.findByUserIdAndCertificationId(userId, certificationId);
        } else {
            // certificationId가 없으면 모든 복습 문제 조회 (홈화면과 일관성 유지)
            reviewQuestions = reviewQuestionRepository.findByUserId(userId);
        }
        
        // 완료된 복습 문제 필터링 (nextReviewDate가 1년 이상 미래인 것은 완료로 간주)
        LocalDateTime oneYearLater = LocalDateTime.now().plusYears(1);
        List<QuestionResponse> activeReviewQuestions = reviewQuestions.stream()
                .filter(rq -> rq.getNextReviewDate() == null || rq.getNextReviewDate().isBefore(oneYearLater))
                .map(ReviewQuestion::getQuestion)
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
        
        return activeReviewQuestions;
    }
    
    // 복습 문제 추가
    @Transactional
    public void addReviewQuestion(Long userId, Long questionId, Long certificationId) {
        // 이미 복습 문제로 등록된 경우 중복 추가 방지
        if (reviewQuestionRepository.existsByUserIdAndQuestionId(userId, questionId)) {
            return; // 이미 추가되어 있으면 무시
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다"));
        
        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        ReviewQuestion reviewQuestion = ReviewQuestion.builder()
                .user(user)
                .question(question)
                .certification(certification)
                .nextReviewDate(LocalDateTime.now().plusDays(1))
                .reviewCount(0)
                .build();
        
        reviewQuestionRepository.save(reviewQuestion);
    }
    
    // 복습 문제 완료 처리
    @Transactional
    public void completeReviewQuestion(Long userId, Long questionId, Boolean isCorrect) {
        ReviewQuestion reviewQuestion = reviewQuestionRepository
                .findByUserIdAndQuestionId(userId, questionId)
                .orElseThrow(() -> new RuntimeException("복습 문제를 찾을 수 없습니다"));
        
        reviewQuestion.setReviewCount(reviewQuestion.getReviewCount() + 1);
        reviewQuestion.setLastReviewedAt(LocalDateTime.now());
        
        // 간단한 알고리즘: 정답이면 다음 복습일을 늘리고, 오답이면 다음날로 설정
        if (isCorrect) {
            // 정답을 맞추면 복습 완료로 간주 (매우 먼 미래로 설정하여 복습 목록에서 제외)
            // 복습 세션 완료 시에는 여러 번 맞춘 경우를 고려하지만, 개별 문제 완료 시에는 한 번만 맞춰도 완료 처리
            reviewQuestion.setNextReviewDate(LocalDateTime.now().plusYears(10));
        } else {
            reviewQuestion.setNextReviewDate(LocalDateTime.now().plusDays(1));
        }
        
        reviewQuestionRepository.save(reviewQuestion);
    }
    
    // 복습 세션 시작
    @Transactional
    public QuestionSessionResponse startReviewSession(Long userId, Long certificationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        // 복습 문제 조회 (미완료 복습 문제만)
        List<ReviewQuestion> reviewQuestions;
        Certification certification;
        
        // 완료된 복습 문제 필터링 (nextReviewDate가 1년 이상 미래인 것은 완료로 간주)
        LocalDateTime oneYearLater = LocalDateTime.now().plusYears(1);
        
        if (certificationId != null) {
            // 특정 자격증의 복습 문제만 조회
            List<ReviewQuestion> allReviewQuestions = reviewQuestionRepository.findByUserIdAndCertificationId(userId, certificationId);
            reviewQuestions = allReviewQuestions.stream()
                    .filter(rq -> rq.getNextReviewDate() == null || rq.getNextReviewDate().isBefore(oneYearLater))
                    .collect(Collectors.toList());
            if (reviewQuestions.isEmpty()) {
                throw new RuntimeException("해당 자격증에 대한 복습할 문제가 없습니다");
            }
            certification = certificationRepository.findById(certificationId)
                    .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        } else {
            // certificationId가 없으면 모든 복습 문제 조회
            List<ReviewQuestion> allReviewQuestions = reviewQuestionRepository.findByUserId(userId);
            reviewQuestions = allReviewQuestions.stream()
                    .filter(rq -> rq.getNextReviewDate() == null || rq.getNextReviewDate().isBefore(oneYearLater))
                    .collect(Collectors.toList());
            if (reviewQuestions.isEmpty()) {
                throw new RuntimeException("복습할 문제가 없습니다");
            }
            // 첫 번째 복습 문제의 자격증 정보 사용
            certification = reviewQuestions.get(0).getCertification();
        }
        
        // 복습 문제를 QuestionResponse로 변환
        List<QuestionResponse> questions = reviewQuestions.stream()
                .map(ReviewQuestion::getQuestion)
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
        
        // 복습 세션 생성
        QuestionSession session = QuestionSession.builder()
                .user(user)
                .certification(certification)
                .specificDay(null)
                .isRelearning(true) // 복습 세션임을 표시
                .status(QuestionSession.SessionStatus.IN_PROGRESS)
                .totalQuestions(questions.size())
                .startedAt(LocalDateTime.now())
                .build();
        
        session = questionSessionRepository.save(session);
        
        QuestionSessionResponse response = mapToQuestionSessionResponse(session);
        response.setQuestions(questions);
        
        return response;
    }
    
    // 복습 세션 완료
    @Transactional
    public QuestionSessionResponse completeReviewSession(Long sessionId, List<QuestionAnswerRequest> results, Long userId) {
        QuestionSession session = questionSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        if (session.getStatus() == QuestionSession.SessionStatus.COMPLETED) {
            throw new RuntimeException("이미 완료된 세션입니다.");
        }

        // 답안 저장 (복습 문제는 이미 completeReviewQuestion에서 처리되었으므로 여기서는 답안만 저장)
        int correctCount = 0;
        for (QuestionAnswerRequest result : results) {
            Question question = questionRepository.findById(result.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다."));

            // 답안 저장
            QuestionAnswer answer = QuestionAnswer.builder()
                    .session(session)
                    .question(question)
                    .selectedAnswer(result.getSelectedAnswer())
                    .isCorrect(result.getIsCorrect())
                    .answeredAt(LocalDateTime.now())
                    .build();
            questionAnswerRepository.save(answer);

            if (result.getIsCorrect()) {
                correctCount++;
            }
            // 복습 문제 완료 처리는 이미 completeReviewQuestion에서 처리되었으므로 여기서는 하지 않음
        }

        session.setCorrectAnswers(correctCount);
        session.setTotalQuestions(results.size());
        session.setStatus(QuestionSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());

        // 복습 보너스 XP 계산 및 사용자 XP 업데이트
        int baseXp = correctCount * 5; // 맞춘 문제당 5XP
        int reviewBonusXp = 50; // 복습 보너스
        int totalXp = baseXp + reviewBonusXp;
        session.setXpEarned(totalXp);
        user.setTotalXp(user.getTotalXp() + totalXp);
        user.setLastStudyDate(LocalDateTime.now()); // 마지막 학습일 업데이트

        questionSessionRepository.save(session);
        userRepository.save(user);

        return mapToQuestionSessionResponse(session);
    }
    
    // Helper methods
    private QuestionResponse mapToQuestionResponse(Question question) {
        List<String> choices = null;
        try {
            if (question.getChoices() != null) {
                choices = objectMapper.readValue(question.getChoices(), new TypeReference<List<String>>() {});
            }
        } catch (Exception e) {
            choices = List.of();
        }
        
        return QuestionResponse.builder()
                .id(question.getId())
                .certificationId(question.getCertification().getId())
                .type(question.getType().name())
                .source(question.getSource().name())
                .question(question.getQuestion())
                .choices(choices)
                .answer(question.getAnswer())
                .explanation(question.getExplanation())
                .examYear(question.getExamYear())
                .examRound(question.getExamRound())
                .build();
    }
    
    private QuestionSessionResponse mapToQuestionSessionResponse(QuestionSession session) {
        return QuestionSessionResponse.builder()
                .id(session.getId())
                .sessionId(session.getId()) // 프론트엔드 호환성을 위해 id와 동일한 값 설정
                .userId(session.getUser().getId())
                .certificationId(session.getCertification().getId())
                .specificDay(session.getSpecificDay())
                .isRelearning(session.getIsRelearning())
                .status(session.getStatus().name())
                .totalQuestions(session.getTotalQuestions())
                .correctAnswers(session.getCorrectAnswers())
                .xpEarned(session.getXpEarned())
                .startedAt(session.getStartedAt())
                .completedAt(session.getCompletedAt())
                .questions(null) // 문제 목록은 startQuestionSession에서 별도로 설정
                .build();
    }
}

