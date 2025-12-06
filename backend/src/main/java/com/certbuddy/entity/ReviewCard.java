package com.certbuddy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_card_id", nullable = false)
    private FlashCard flashCard;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 1;

    @Column(name = "last_reviewed_at")
    @Builder.Default
    private LocalDateTime lastReviewedAt = LocalDateTime.now();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

