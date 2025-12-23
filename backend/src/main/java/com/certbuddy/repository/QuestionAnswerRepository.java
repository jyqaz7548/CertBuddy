package com.certbuddy.repository;

import com.certbuddy.entity.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
    List<QuestionAnswer> findBySessionId(Long sessionId);
    List<QuestionAnswer> findByQuestionId(Long questionId);
    List<QuestionAnswer> findBySessionIdAndQuestionId(Long sessionId, Long questionId);
}

