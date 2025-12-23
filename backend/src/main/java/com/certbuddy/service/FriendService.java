package com.certbuddy.service;

import com.certbuddy.dto.response.FriendResponse;
import com.certbuddy.entity.Friend;
import com.certbuddy.entity.User;
import com.certbuddy.repository.FriendRepository;
import com.certbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {
    
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
    
    public List<FriendResponse> getFriends(Long userId) {
        List<Friend> friends = friendRepository.findByUserIdAndStatus(userId, Friend.FriendStatus.ACCEPTED);
        return friends.stream()
                .map(friend -> mapToFriendResponse(friend.getFriend(), Friend.FriendStatus.ACCEPTED.name()))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public FriendResponse addFriend(Long userId, Long friendId) {
        if (userId.equals(friendId)) {
            throw new RuntimeException("자기 자신을 친구로 추가할 수 없습니다");
        }
        
        if (friendRepository.existsByUserIdAndFriendId(userId, friendId)) {
            throw new RuntimeException("이미 친구 요청이 존재합니다");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("친구를 찾을 수 없습니다"));
        
        Friend friendRequest = Friend.builder()
                .user(user)
                .friend(friend)
                .status(Friend.FriendStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();
        
        friendRepository.save(friendRequest);
        
        return mapToFriendResponse(friend, Friend.FriendStatus.PENDING.name());
    }
    
    @Transactional
    public FriendResponse acceptFriendRequest(Long userId, Long friendId) {
        Friend friendRequest = friendRepository.findByFriendIdAndUserId(friendId, userId)
                .orElseThrow(() -> new RuntimeException("친구 요청을 찾을 수 없습니다"));
        
        if (friendRequest.getStatus() != Friend.FriendStatus.PENDING) {
            throw new RuntimeException("이미 처리된 요청입니다");
        }
        
        friendRequest.setStatus(Friend.FriendStatus.ACCEPTED);
        friendRequest.setAcceptedAt(LocalDateTime.now());
        friendRepository.save(friendRequest);
        
        return mapToFriendResponse(friendRequest.getUser(), Friend.FriendStatus.ACCEPTED.name());
    }
    
    public List<FriendResponse> getFriendRequests(Long userId) {
        List<Friend> requests = friendRepository.findByFriendIdAndStatus(userId, Friend.FriendStatus.PENDING);
        return requests.stream()
                .map(request -> mapToFriendResponse(request.getUser(), Friend.FriendStatus.PENDING.name()))
                .collect(Collectors.toList());
    }
    
    public List<FriendResponse> getRanking(Long userId) {
        // 간단한 구현: 모든 친구를 XP 순으로 정렬
        List<Friend> friends = friendRepository.findByUserIdAndStatus(userId, Friend.FriendStatus.ACCEPTED);
        return friends.stream()
                .map(friend -> mapToFriendResponse(friend.getFriend(), Friend.FriendStatus.ACCEPTED.name()))
                .sorted((a, b) -> b.getTotalXp().compareTo(a.getTotalXp()))
                .collect(Collectors.toList());
    }
    
    public FriendResponse searchUserByCode(String userCode) {
        User user = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return mapToFriendResponse(user, null);
    }
    
    public List<FriendResponse> getRecommendedUsers(Long userId, String department, Integer grade) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> department == null || department.equals(u.getDepartment()))
                .filter(u -> grade == null || grade.equals(u.getGrade()))
                .collect(java.util.stream.Collectors.toList());
        
        return users.stream()
                .map(user -> mapToFriendResponse(user, null))
                .collect(Collectors.toList());
    }
    
    private FriendResponse mapToFriendResponse(User user, String status) {
        return FriendResponse.builder()
                .id(user.getId())
                .userId(user.getId())
                .name(user.getName())
                .department(user.getDepartment())
                .grade(user.getGrade())
                .totalXp(user.getTotalXp())
                .streak(user.getStreak())
                .userCode(user.getUserCode())
                .status(status)
                .build();
    }
}

