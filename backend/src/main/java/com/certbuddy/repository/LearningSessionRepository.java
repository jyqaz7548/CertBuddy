package com.certbuddy.repository;

import com.certbuddy.entity.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {
    List<LearningSession> findByUserId(Long userId);
    Optional<LearningSession> findByIdAndUserId(Long id, Long userId);
    List<LearningSession> findByUserIdAndStatus(Long userId, LearningSession.SessionStatus status);
}

