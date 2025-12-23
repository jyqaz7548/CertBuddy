package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationProgressResponse {
    private Long certificationId;
    private Integer totalDays;
    private Integer completedDays;
    private Double progress; // 0.0 ~ 1.0 범위 (프론트엔드 호환성)
    private Double progressPercentage; // 백분율
    private Map<Integer, Boolean> dayStatuses; // day -> completed
}

