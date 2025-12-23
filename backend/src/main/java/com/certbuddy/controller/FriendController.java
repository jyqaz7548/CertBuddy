package com.certbuddy.controller;

import com.certbuddy.dto.response.ApiResponse;
import com.certbuddy.dto.response.FriendResponse;
import com.certbuddy.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {
    
    private final FriendService friendService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<FriendResponse>>> getFriends(
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<FriendResponse> friends = friendService.getFriends(userId);
            return ResponseEntity.ok(ApiResponse.success(friends));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{friendId}")
    public ResponseEntity<ApiResponse<FriendResponse>> addFriend(
            @PathVariable Long friendId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            FriendResponse response = friendService.addFriend(userId, friendId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{friendId}/accept")
    public ResponseEntity<ApiResponse<FriendResponse>> acceptFriendRequest(
            @PathVariable Long friendId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            FriendResponse response = friendService.acceptFriendRequest(userId, friendId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<FriendResponse>>> getFriendRequests(
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<FriendResponse> requests = friendService.getFriendRequests(userId);
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/ranking")
    public ResponseEntity<ApiResponse<List<FriendResponse>>> getRanking(
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<FriendResponse> ranking = friendService.getRanking(userId);
            return ResponseEntity.ok(ApiResponse.success(ranking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<FriendResponse>>> getRecommendedUsers(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer grade,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<FriendResponse> recommendations = friendService.getRecommendedUsers(userId, department, grade);
            return ResponseEntity.ok(ApiResponse.success(recommendations));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<FriendResponse>> searchUserByCode(
            @RequestParam String userCode) {
        try {
            FriendResponse response = friendService.searchUserByCode(userCode);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    private Long getUserIdFromAuthentication(Authentication authentication) {
        // Authentication에서 사용자 이메일을 가져와서 User ID를 조회
        String email = authentication.getName();
        return friendService.getUserIdByEmail(email);
    }
}

