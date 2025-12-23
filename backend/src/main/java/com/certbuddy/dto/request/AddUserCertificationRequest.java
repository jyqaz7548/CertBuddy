package com.certbuddy.dto.request;

import lombok.Data;

@Data
public class AddUserCertificationRequest {
    private Long certificationId; // 자격증 ID (선택)
    private String certificationName; // 자격증 이름 (선택, ID가 없으면 이름으로 찾음)
}

