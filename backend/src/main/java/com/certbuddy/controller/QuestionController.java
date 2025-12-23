package com.certbuddy.controller;

import com.certbuddy.dto.request.*;
import com.certbuddy.dto.response.*;
import com.certbuddy.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    
    private final QuestionService questionService;
    
    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getAvailableCertifications() {
        try {
            List<CertificationResponse> certifications = questionService.getAvailableCertifications();
            return ResponseEntity.ok(ApiResponse.success(certifications));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/certifications/{certificationId}/progress")
    public ResponseEntity<ApiResponse<CertificationProgressResponse>> getCertificationProgress(
            @PathVariable Long certificationId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CertificationProgressResponse progress = questionService.getCertificationProgress(certificationId, userId);
            return ResponseEntity.ok(ApiResponse.success(progress));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/today-status")
    public ResponseEntity<ApiResponse<TodayLearningStatusResponse>> getTodayLearningStatus(
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            TodayLearningStatusResponse status = questionService.getTodayLearningStatus(userId);
            return ResponseEntity.ok(ApiResponse.success(status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/certifications/{certificationId}/days")
    public ResponseEntity<ApiResponse<Map<Integer, Boolean>>> getDayStatuses(
            @PathVariable Long certificationId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            Map<Integer, Boolean> dayStatuses = questionService.getDayStatuses(certificationId, userId);
            return ResponseEntity.ok(ApiResponse.success(dayStatuses));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getQuestions(
            @RequestParam Long certificationId) {
        try {
            List<QuestionResponse> questions = questionService.getQuestions(certificationId);
            return ResponseEntity.ok(ApiResponse.success(questions));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/sessions")
    public ResponseEntity<ApiResponse<QuestionSessionResponse>> startQuestionSession(
            @Valid @RequestBody StartQuestionSessionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            QuestionSessionResponse response = questionService.startQuestionSession(
                    request.getCertificationId(),
                    userId,
                    request.getSpecificDay(),
                    request.getIsRelearning()
            );
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/sessions/{sessionId}/answers")
    public ResponseEntity<ApiResponse<Void>> submitAnswer(
            @PathVariable Long sessionId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        try {
            questionService.submitAnswer(sessionId, request.getQuestionId(), 
                    request.getSelectedAnswer(), request.getIsCorrect());
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<ApiResponse<QuestionSessionResponse>> completeQuestionSession(
            @PathVariable Long sessionId,
            @Valid @RequestBody CompleteQuestionSessionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            QuestionSessionResponse response = questionService.completeQuestionSession(
                    sessionId, request.getResults(), userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/review")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getReviewQuestions(
            @RequestParam(required = false) Long certificationId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<QuestionResponse> questions = questionService.getReviewQuestions(userId, certificationId);
            return ResponseEntity.ok(ApiResponse.success(questions));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/review")
    public ResponseEntity<ApiResponse<Void>> addReviewQuestion(
            @Valid @RequestBody AddReviewQuestionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            questionService.addReviewQuestion(userId, request.getQuestionId(), request.getCertificationId());
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/review/{questionId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeReviewQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody CompleteReviewQuestionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            questionService.completeReviewQuestion(userId, questionId, request.getIsCorrect());
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/review/sessions")
    public ResponseEntity<ApiResponse<QuestionSessionResponse>> startReviewSession(
            @Valid @RequestBody StartReviewSessionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            QuestionSessionResponse response = questionService.startReviewSession(userId, request.getCertificationId());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/review/sessions/{sessionId}/complete")
    public ResponseEntity<ApiResponse<QuestionSessionResponse>> completeReviewSession(
            @PathVariable Long sessionId,
            @Valid @RequestBody CompleteQuestionSessionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            QuestionSessionResponse response = questionService.completeReviewSession(
                    sessionId, request.getResults(), userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    private Long getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        return questionService.getUserIdByEmail(email);
    }
}

