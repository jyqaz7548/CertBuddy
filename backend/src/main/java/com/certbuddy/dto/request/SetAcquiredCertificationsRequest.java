package com.certbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SetAcquiredCertificationsRequest {
    @NotNull(message = "자격증 이름 목록은 필수입니다")
    private List<String> certificationNames; // 자격증 이름 목록
}

