package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuestionAnswerRequest {
    @NotNull(message = "문제 ID는 필수입니다")
    private Long questionId;
    
    @NotNull(message = "선택한 답안은 필수입니다")
    private String selectedAnswer;
    
    @NotNull(message = "정답 여부는 필수입니다")
    private Boolean isCorrect;
}

