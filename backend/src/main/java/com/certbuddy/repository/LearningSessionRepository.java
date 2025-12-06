package com.certbuddy.repository;

import com.certbuddy.entity.LearningSession;
import com.certbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {
    List<LearningSession> findByUser(User user);
    List<LearningSession> findByUserAndIsCompleted(User user, Boolean isCompleted);
}

