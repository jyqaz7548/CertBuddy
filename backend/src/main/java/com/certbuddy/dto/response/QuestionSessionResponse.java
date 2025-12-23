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
public class QuestionSessionResponse {
    private Long id;
    private Long userId;
    private Long certificationId;
    private Integer specificDay;
    private Boolean isRelearning;
    private String status;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer xpEarned;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}

