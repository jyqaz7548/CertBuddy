package com.certbuddy.service;

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
        // 일차별 완료 상태 조회
        List<QuestionSession> completedSessions = questionSessionRepository
                .findByUserIdAndCertificationId(userId, certificationId).stream()
                .filter(s -> s.getStatus() == QuestionSession.SessionStatus.COMPLETED)
                .collect(Collectors.toList());
        
        Set<Integer> completedDays = completedSessions.stream()
                .map(QuestionSession::getSpecificDay)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        // 간단한 구현: 30일 기준
        int totalDays = 30;
        double progressPercentage = (completedDays.size() / (double) totalDays) * 100;
        
        Map<Integer, Boolean> dayStatuses = new HashMap<>();
        for (int day = 1; day <= totalDays; day++) {
            dayStatuses.put(day, completedDays.contains(day));
        }
        
        return CertificationProgressResponse.builder()
                .certificationId(certificationId)
                .totalDays(totalDays)
                .completedDays(completedDays.size())
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
        
        // 복습 문제 확인
        List<ReviewQuestion> reviewQuestions = reviewQuestionRepository
                .findByUserIdAndNextReviewDateLessThanEqual(userId, LocalDateTime.now());
        
        boolean hasReviewQuestions = !reviewQuestions.isEmpty();
        
        // 오늘 복습 완료 여부 (간단한 구현)
        boolean isReviewCompleted = false; // TODO: 복습 세션 완료 여부 확인
        
        return TodayLearningStatusResponse.builder()
                .isLearningCompleted(isLearningCompleted)
                .isReviewCompleted(isReviewCompleted)
                .hasReviewQuestions(hasReviewQuestions)
                .reviewCount(reviewQuestions.size())
                .build();
    }
    
    // 일차별 완료 상태 조회
    public Map<Integer, Boolean> getDayStatuses(Long certificationId, Long userId) {
        List<QuestionSession> completedSessions = questionSessionRepository
                .findByUserIdAndCertificationId(userId, certificationId).stream()
                .filter(s -> s.getStatus() == QuestionSession.SessionStatus.COMPLETED)
                .collect(Collectors.toList());
        
        Set<Integer> completedDays = completedSessions.stream()
                .map(QuestionSession::getSpecificDay)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        Map<Integer, Boolean> dayStatuses = new HashMap<>();
        for (int day = 1; day <= 30; day++) {
            dayStatuses.put(day, completedDays.contains(day));
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
        
        QuestionSession session = QuestionSession.builder()
                .user(user)
                .certification(certification)
                .specificDay(specificDay)
                .isRelearning(isRelearning != null ? isRelearning : false)
                .status(QuestionSession.SessionStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();
        
        session = questionSessionRepository.save(session);
        
        return mapToQuestionSessionResponse(session);
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
    public QuestionSessionResponse completeQuestionSession(Long sessionId, Map<Long, Boolean> results, Long userId) {
        QuestionSession session = questionSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다"));
        
        int totalQuestions = results.size();
        long correctAnswers = results.values().stream().filter(Boolean::booleanValue).count();
        
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
            reviewQuestions = reviewQuestionRepository
                    .findByUserIdAndNextReviewDateLessThanEqual(userId, LocalDateTime.now());
        }
        
        return reviewQuestions.stream()
                .map(ReviewQuestion::getQuestion)
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }
    
    // 복습 문제 추가
    @Transactional
    public void addReviewQuestion(Long userId, Long questionId, Long certificationId) {
        if (reviewQuestionRepository.existsByUserIdAndQuestionId(userId, questionId)) {
            throw new RuntimeException("이미 복습 문제에 추가된 항목입니다");
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
            reviewQuestion.setNextReviewDate(LocalDateTime.now().plusDays(reviewQuestion.getReviewCount() * 2));
        } else {
            reviewQuestion.setNextReviewDate(LocalDateTime.now().plusDays(1));
        }
        
        reviewQuestionRepository.save(reviewQuestion);
    }
    
    // 복습 세션 시작
    @Transactional
    public QuestionSessionResponse startReviewSession(Long userId, Long certificationId) {
        // 복습 문제를 일반 문제 세션으로 시작
        return startQuestionSession(certificationId, userId, null, true);
    }
    
    // 복습 세션 완료
    @Transactional
    public QuestionSessionResponse completeReviewSession(Long sessionId, Map<Long, Boolean> results, Long userId) {
        // 일반 세션 완료와 동일하지만 보너스 XP 추가
        completeQuestionSession(sessionId, results, userId);
        
        // 복습 보너스 XP 추가
        QuestionSession session = questionSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다"));
        
        int reviewBonusXp = 50; // 복습 보너스
        session.setXpEarned(session.getXpEarned() + reviewBonusXp);
        
        User user = session.getUser();
        user.setTotalXp(user.getTotalXp() + reviewBonusXp);
        userRepository.save(user);
        
        session = questionSessionRepository.save(session);
        
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
                .build();
    }
}

