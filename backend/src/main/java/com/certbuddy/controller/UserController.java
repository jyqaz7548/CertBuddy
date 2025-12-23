package com.certbuddy.controller;

import com.certbuddy.dto.response.ApiResponse;
import com.certbuddy.dto.response.FriendResponse;
import com.certbuddy.dto.response.UserResponse;
import com.certbuddy.service.AuthService;
import com.certbuddy.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final AuthService authService;
    private final FriendService friendService;
    
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
}

