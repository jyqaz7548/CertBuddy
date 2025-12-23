package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningSessionResponse {
    private Long id;
    private Long userId;
    private Long certificationId;
    private Integer cardsStudied;
    private Integer xpEarned;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}

