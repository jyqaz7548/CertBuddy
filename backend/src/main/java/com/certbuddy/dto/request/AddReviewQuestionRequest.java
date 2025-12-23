package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddReviewQuestionRequest {
    @NotNull(message = "문제 ID는 필수입니다")
    private Long questionId;
    
    @NotNull(message = "자격증 ID는 필수입니다")
    private Long certificationId;
}

