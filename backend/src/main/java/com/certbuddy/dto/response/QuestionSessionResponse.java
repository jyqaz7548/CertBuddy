package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionSessionResponse {
    private Long id;
    private Long sessionId; // 프론트엔드 호환성을 위한 별칭 (id와 동일)
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
    private List<QuestionResponse> questions; // 문제 목록
}

