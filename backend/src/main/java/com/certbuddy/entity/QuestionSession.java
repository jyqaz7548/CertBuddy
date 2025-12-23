package com.certbuddy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;
    
    private Integer specificDay; // 특정 일차 (null이면 전체)
    
    @Builder.Default
    private Boolean isRelearning = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SessionStatus status = SessionStatus.IN_PROGRESS;
    
    @Column(name = "total_questions")
    @Builder.Default
    private Integer totalQuestions = 0;
    
    @Column(name = "correct_answers")
    @Builder.Default
    private Integer correctAnswers = 0;
    
    @Column(name = "xp_earned")
    @Builder.Default
    private Integer xpEarned = 0;
    
    @Column(name = "started_at")
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum SessionStatus {
        IN_PROGRESS, COMPLETED, ABANDONED
    }
}

