package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayStatusResponse {
    private Integer day;
    private Boolean isCompleted;
    private Boolean isLocked;
    private Integer reviewCount;
}

