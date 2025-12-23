package com.certbuddy.repository;

import com.certbuddy.entity.ReviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewQuestionRepository extends JpaRepository<ReviewQuestion, Long> {
    List<ReviewQuestion> findByUserId(Long userId);
    Optional<ReviewQuestion> findByUserIdAndQuestionId(Long userId, Long questionId);
    List<ReviewQuestion> findByUserIdAndNextReviewDateLessThanEqual(Long userId, LocalDateTime date);
    List<ReviewQuestion> findByUserIdAndCertificationId(Long userId, Long certificationId);
    boolean existsByUserIdAndQuestionId(Long userId, Long questionId);
}

