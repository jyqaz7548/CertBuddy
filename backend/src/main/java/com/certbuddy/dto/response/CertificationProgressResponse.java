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
    private Double progressPercentage;
    private Map<Integer, Boolean> dayStatuses; // day -> completed
}

