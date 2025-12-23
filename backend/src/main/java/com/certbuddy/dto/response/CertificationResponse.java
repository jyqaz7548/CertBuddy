package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationResponse {
    private Long id;
    private String name;
    private String description;
    private String department; // 추천 기준 학과 (추천 자격증용)
    private Double acquisitionRate; // 취득 비율 (0.0 ~ 1.0, 추천 자격증용)
}

