package com.certbuddy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type; // OX, BLANK
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionSource source; // AI_GENERATED, REAL_CBT
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @Column(columnDefinition = "TEXT")
    private String choices; // JSON 형식으로 저장
    
    @Column(nullable = false)
    private String answer;
    
    @Column(columnDefinition = "TEXT")
    private String explanation;
    
    private Integer examYear;
    
    private String examRound;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum QuestionType {
        OX, BLANK
    }
    
    public enum QuestionSource {
        AI_GENERATED, REAL_CBT
    }
}

