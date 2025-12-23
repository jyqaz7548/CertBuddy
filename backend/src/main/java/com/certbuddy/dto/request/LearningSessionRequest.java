package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LearningSessionRequest {
    @NotNull(message = "자격증 ID는 필수입니다")
    private Long certificationId;
}

