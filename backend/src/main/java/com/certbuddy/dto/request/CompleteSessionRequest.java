package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteSessionRequest {
    @NotNull(message = "학습한 카드 수는 필수입니다")
    private Integer cardsStudied;
    
    @NotNull(message = "획득한 XP는 필수입니다")
    private Integer xpEarned;
}

