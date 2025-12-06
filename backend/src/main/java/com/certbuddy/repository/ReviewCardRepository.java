package com.certbuddy.repository;

import com.certbuddy.entity.ReviewCard;
import com.certbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewCardRepository extends JpaRepository<ReviewCard, Long> {
    List<ReviewCard> findByUser(User user);
    boolean existsByUserIdAndFlashCardId(Long userId, Long flashCardId);
}

