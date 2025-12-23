package com.certbuddy.repository;

import com.certbuddy.entity.QuestionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionSessionRepository extends JpaRepository<QuestionSession, Long> {
    List<QuestionSession> findByUserId(Long userId);
    Optional<QuestionSession> findByIdAndUserId(Long id, Long userId);
    List<QuestionSession> findByUserIdAndStatus(Long userId, QuestionSession.SessionStatus status);
    List<QuestionSession> findByUserIdAndCertificationId(Long userId, Long certificationId);
}

