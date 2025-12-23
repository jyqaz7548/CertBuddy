package com.certbuddy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;
    
    @Column(name = "next_review_date")
    private LocalDateTime nextReviewDate;
    
    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;
    
    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

