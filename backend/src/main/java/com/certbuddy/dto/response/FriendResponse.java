package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendResponse {
    private Long id;
    private Long userId;
    private String name;
    private String department;
    private Integer grade;
    private Integer totalXp;
    private Integer streak;
    private String userCode;
    private String status;
}

