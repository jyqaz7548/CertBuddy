package com.certbuddy.controller;

import com.certbuddy.dto.request.AddUserCertificationRequest;
import com.certbuddy.dto.request.SetAcquiredCertificationsRequest;
import com.certbuddy.dto.response.ApiResponse;
import com.certbuddy.dto.response.CertificationResponse;
import com.certbuddy.dto.response.FriendResponse;
import com.certbuddy.dto.response.UserResponse;
import com.certbuddy.service.AuthService;
import com.certbuddy.service.FriendService;
import com.certbuddy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final AuthService authService;
    private final FriendService friendService;
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        try {
            String email = authentication.getName();
            UserResponse response = authService.getCurrentUser(email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<FriendResponse>> searchUserByCode(@RequestParam String userCode) {
        try {
            FriendResponse response = friendService.searchUserByCode(userCode);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/certifications/acquired")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getAcquiredCertifications(
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<CertificationResponse> certifications = userService.getAcquiredCertifications(userId);
            return ResponseEntity.ok(ApiResponse.success(certifications));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/certifications/acquired")
    public ResponseEntity<ApiResponse<Void>> addAcquiredCertification(
            @Valid @RequestBody AddUserCertificationRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            userService.addAcquiredCertification(userId, request.getCertificationId(), request.getCertificationName());
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/certifications/acquired/{certificationId}")
    public ResponseEntity<ApiResponse<Void>> removeAcquiredCertification(
            @PathVariable Long certificationId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            userService.removeAcquiredCertification(userId, certificationId);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/certifications/acquired")
    public ResponseEntity<ApiResponse<Void>> setAcquiredCertifications(
            @Valid @RequestBody SetAcquiredCertificationsRequest request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            userService.setAcquiredCertifications(userId, request.getCertificationNames());
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    private Long getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserIdByEmail(email);
    }
}

