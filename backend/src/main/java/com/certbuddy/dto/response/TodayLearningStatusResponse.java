package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodayLearningStatusResponse {
    private Boolean isLearningCompleted;
    private Boolean isReviewCompleted;
    private Boolean hasReviewQuestions;
    private Integer reviewCount;
}

