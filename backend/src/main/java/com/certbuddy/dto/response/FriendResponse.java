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
    private Long friendId; // 친구 요청에서 요청을 보낸 사람 ID (수락 시 필요)
    private String name;
    private String department;
    private String school;
    private Integer grade;
    private Integer totalXp;
    private Integer streak;
    private String userCode;
    private String status; // PENDING, ACCEPTED, SENT (내가 보낸 요청)
    private Integer rank; // 랭킹용
    private Boolean isMe; // 랭킹에서 본인 표시용
}

