package com.certbuddy.dto.request;

import lombok.Data;
import java.util.Map;

@Data
public class CompleteQuestionSessionRequest {
    private Map<Long, Boolean> results; // questionId -> isCorrect
}

