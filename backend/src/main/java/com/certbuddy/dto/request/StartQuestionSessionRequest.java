package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartQuestionSessionRequest {
    @NotNull(message = "자격증 ID는 필수입니다")
    private Long certificationId;
    
    private Integer specificDay; // 특정 일차 (선택사항)
    
    private Boolean isRelearning = false;
}

