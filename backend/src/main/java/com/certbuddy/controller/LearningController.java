package com.certbuddy.controller;

import com.certbuddy.dto.request.AddReviewCardRequest;
import com.certbuddy.dto.request.CompleteSessionRequest;
import com.certbuddy.dto.request.LearningSessionRequest;
import com.certbuddy.dto.response.ApiResponse;
import com.certbuddy.dto.response.FlashCardResponse;
import com.certbuddy.dto.response.LearningSessionResponse;
import com.certbuddy.entity.Certification;
import com.certbuddy.service.LearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {
    
    private final LearningService learningService;
    
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Certification>>> getRecommendations(
            @RequestParam(required = false) String school,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer grade,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {
        try {
            // Authentication이 있으면 그것을 우선 사용, 없으면 파라미터 사용
            Long finalUserId = null;
            if (authentication != null) {
                try {
                    finalUserId = getUserIdFromAuthentication(authentication);
                } catch (Exception e) {
                    // 인증 실패 시 파라미터 사용
                    finalUserId = userId;
                }
            } else {
                finalUserId = userId;
            }
            List<Certification> certifications = learningService.getRecommendations(school, department, grade, finalUserId);
            return ResponseEntity.ok(ApiResponse.success(certifications));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/cards/{certificationId}")
    public ResponseEntity<ApiResponse<List<FlashCardResponse>>> getFlashCards(
            @PathVariable Long certificationId) {
        try {
            List<FlashCardResponse> flashCards = learningService.getFlashCards(certificationId);
            return ResponseEntity.ok(ApiResponse.success(flashCards));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/sessions")
    public ResponseEntity<ApiResponse<LearningSessionResponse>> startLearningSession(
            @Valid @RequestBody LearningSessionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            LearningSessionResponse response = learningService.startLearningSession(request.getCertificationId(), userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<ApiResponse<LearningSessionResponse>> completeLearningSession(
            @PathVariable Long sessionId,
            @Valid @RequestBody CompleteSessionRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            LearningSessionResponse response = learningService.completeLearningSession(sessionId, userId, request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/review")
    public ResponseEntity<ApiResponse<List<FlashCardResponse>>> getReviewCards(
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<FlashCardResponse> reviewCards = learningService.getReviewCards(userId);
            return ResponseEntity.ok(ApiResponse.success(reviewCards));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/review")
    public ResponseEntity<ApiResponse<Void>> addReviewCard(
            @Valid @RequestBody AddReviewCardRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            learningService.addReviewCard(userId, request);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    private Long getUserIdFromAuthentication(Authentication authentication) {
        // Authentication에서 사용자 이메일을 가져와서 User ID를 조회
        String email = authentication.getName();
        return learningService.getUserIdByEmail(email);
    }
}

