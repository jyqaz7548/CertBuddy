package com.certbuddy.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CompleteQuestionSessionRequest {
    private List<QuestionAnswerRequest> results; // 문제 답안 목록
}

