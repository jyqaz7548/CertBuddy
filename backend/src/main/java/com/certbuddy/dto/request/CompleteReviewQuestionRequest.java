package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteReviewQuestionRequest {
    @NotNull(message = "정답 여부는 필수입니다")
    private Boolean isCorrect;
}

