package com.certbuddy.service;

import com.certbuddy.dto.request.AddReviewCardRequest;
import com.certbuddy.dto.request.CompleteSessionRequest;
import com.certbuddy.dto.response.FlashCardResponse;
import com.certbuddy.dto.response.LearningSessionResponse;
import com.certbuddy.entity.*;
import com.certbuddy.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningService {
    
    private final CertificationRepository certificationRepository;
    private final FlashCardRepository flashCardRepository;
    private final LearningSessionRepository learningSessionRepository;
    private final ReviewCardRepository reviewCardRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
    
    public List<Certification> getRecommendations(String school, String department, Integer grade, Long userId) {
        // 간단한 구현: 모든 자격증 반환 (나중에 로직 추가 가능)
        return certificationRepository.findAll();
    }
    
    public List<FlashCardResponse> getFlashCards(Long certificationId) {
        List<FlashCard> flashCards = flashCardRepository.findByCertificationId(certificationId);
        return flashCards.stream()
                .map(this::mapToFlashCardResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public LearningSessionResponse startLearningSession(Long certificationId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        
        LearningSession session = LearningSession.builder()
                .user(user)
                .certification(certification)
                .status(LearningSession.SessionStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();
        
        session = learningSessionRepository.save(session);
        
        return mapToLearningSessionResponse(session);
    }
    
    @Transactional
    public LearningSessionResponse completeLearningSession(Long sessionId, Long userId, CompleteSessionRequest request) {
        LearningSession session = learningSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("학습 세션을 찾을 수 없습니다"));
        
        session.setCardsStudied(request.getCardsStudied());
        session.setXpEarned(request.getXpEarned());
        session.setStatus(LearningSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        
        // 사용자 XP 및 스트릭 업데이트
        User user = session.getUser();
        user.setTotalXp(user.getTotalXp() + request.getXpEarned());
        
        // 스트릭 업데이트 로직 (간단한 구현)
        LocalDateTime now = LocalDateTime.now();
        if (user.getLastStudyDate() == null || 
            user.getLastStudyDate().toLocalDate().isBefore(now.toLocalDate())) {
            user.setStreak(user.getStreak() + 1);
        }
        user.setLastStudyDate(now);
        
        userRepository.save(user);
        session = learningSessionRepository.save(session);
        
        return mapToLearningSessionResponse(session);
    }
    
    public List<FlashCardResponse> getReviewCards(Long userId) {
        List<ReviewCard> reviewCards = reviewCardRepository
                .findByUserIdAndNextReviewDateLessThanEqual(userId, LocalDateTime.now());
        
        return reviewCards.stream()
                .map(ReviewCard::getFlashCard)
                .map(this::mapToFlashCardResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void addReviewCard(Long userId, AddReviewCardRequest request) {
        if (reviewCardRepository.existsByUserIdAndFlashCardId(userId, request.getFlashCardId())) {
            throw new RuntimeException("이미 복습 카드에 추가된 항목입니다");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        FlashCard flashCard = flashCardRepository.findById(request.getFlashCardId())
                .orElseThrow(() -> new RuntimeException("플래시카드를 찾을 수 없습니다"));
        
        ReviewCard reviewCard = ReviewCard.builder()
                .user(user)
                .flashCard(flashCard)
                .nextReviewDate(LocalDateTime.now().plusDays(1))
                .reviewCount(0)
                .build();
        
        reviewCardRepository.save(reviewCard);
    }
    
    private FlashCardResponse mapToFlashCardResponse(FlashCard flashCard) {
        Question question = flashCard.getQuestion();
        List<String> choices = null;
        
        try {
            if (question.getChoices() != null) {
                choices = objectMapper.readValue(question.getChoices(), new TypeReference<List<String>>() {});
            }
        } catch (Exception e) {
            // JSON 파싱 실패 시 빈 리스트
            choices = List.of();
        }
        
        return FlashCardResponse.builder()
                .id(flashCard.getId())
                .questionId(question.getId())
                .certificationId(flashCard.getCertification().getId())
                .question(question.getQuestion())
                .answer(question.getAnswer())
                .explanation(question.getExplanation())
                .choices(choices)
                .type(question.getType().name())
                .build();
    }
    
    private LearningSessionResponse mapToLearningSessionResponse(LearningSession session) {
        return LearningSessionResponse.builder()
                .id(session.getId())
                .userId(session.getUser().getId())
                .certificationId(session.getCertification().getId())
                .cardsStudied(session.getCardsStudied())
                .xpEarned(session.getXpEarned())
                .status(session.getStatus().name())
                .startedAt(session.getStartedAt())
                .completedAt(session.getCompletedAt())
                .build();
    }
}

