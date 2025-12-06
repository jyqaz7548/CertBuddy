package com.certbuddy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "flash_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String front; // 카드 앞면 (문제/용어)

    @Column(nullable = false, columnDefinition = "TEXT")
    private String back; // 카드 뒷면 (정답/설명)

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

