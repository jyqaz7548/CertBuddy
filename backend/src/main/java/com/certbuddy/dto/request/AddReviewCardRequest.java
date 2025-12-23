package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddReviewCardRequest {
    @NotNull(message = "플래시카드 ID는 필수입니다")
    private Long flashCardId;
}

