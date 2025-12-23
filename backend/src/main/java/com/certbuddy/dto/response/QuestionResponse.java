package com.certbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    private Long id;
    private Long certificationId;
    private String type;
    private String source;
    private String question;
    private List<String> choices;
    private String answer;
    private String explanation;
    private Integer examYear;
    private String examRound;
}

