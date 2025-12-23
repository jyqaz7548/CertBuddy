package com.certbuddy.repository;

import com.certbuddy.entity.ReviewCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCardRepository extends JpaRepository<ReviewCard, Long> {
    List<ReviewCard> findByUserId(Long userId);
    Optional<ReviewCard> findByUserIdAndFlashCardId(Long userId, Long flashCardId);
    List<ReviewCard> findByUserIdAndNextReviewDateLessThanEqual(Long userId, LocalDateTime date);
    boolean existsByUserIdAndFlashCardId(Long userId, Long flashCardId);
}

