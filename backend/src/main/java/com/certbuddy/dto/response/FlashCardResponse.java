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
public class FlashCardResponse {
    private Long id;
    private Long questionId;
    private Long certificationId;
    private String question;
    private String answer;
    private String explanation;
    private List<String> choices;
    private String type;
}

