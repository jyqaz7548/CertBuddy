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
        
        // 상대방이 나에게 보낸 친구 요청도 수락된 것은 친구로 표시
        List<Friend> receivedFriends = friendRepository.findByFriendIdAndStatus(userId, Friend.FriendStatus.ACCEPTED);
        
        // 두 리스트 합치기 (중복 제거)
        java.util.Set<Long> friendIds = new java.util.HashSet<>();
        java.util.List<FriendResponse> result = new java.util.ArrayList<>();
        
        for (Friend friend : friends) {
            if (friendIds.add(friend.getFriend().getId())) {
                result.add(mapToFriendResponse(friend.getFriend(), Friend.FriendStatus.ACCEPTED.name(), null));
            }
        }
        
        for (Friend friend : receivedFriends) {
            if (friendIds.add(friend.getUser().getId())) {
                result.add(mapToFriendResponse(friend.getUser(), Friend.FriendStatus.ACCEPTED.name(), null));
            }
        }
        
        return result;
    }
    
    @Transactional
    public FriendResponse addFriend(Long userId, Long friendId) {
        if (userId.equals(friendId)) {
            throw new RuntimeException("자기 자신을 친구로 추가할 수 없습니다");
        }
        
        // 이미 친구 요청이 존재하는지 확인 (양방향)
        if (friendRepository.existsByUserIdAndFriendId(userId, friendId)) {
            throw new RuntimeException("이미 친구 요청을 보냈습니다");
        }
        
        if (friendRepository.existsByUserIdAndFriendId(friendId, userId)) {
            throw new RuntimeException("상대방이 이미 친구 요청을 보냈습니다. 친구 요청 목록을 확인해주세요.");
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
        
        return mapToFriendResponse(friend, Friend.FriendStatus.PENDING.name(), null);
    }
    
    @Transactional
    public FriendResponse acceptFriendRequest(Long userId, Long friendId) {
        // friendId는 친구 요청을 보낸 사람의 ID
        // userId는 현재 로그인한 사용자 (요청을 받은 사람)
        Friend friendRequest = friendRepository.findByUserIdAndFriendId(friendId, userId)
                .orElseThrow(() -> new RuntimeException("친구 요청을 찾을 수 없습니다"));
        
        if (friendRequest.getStatus() != Friend.FriendStatus.PENDING) {
            throw new RuntimeException("이미 처리된 요청입니다");
        }
        
        friendRequest.setStatus(Friend.FriendStatus.ACCEPTED);
        friendRequest.setAcceptedAt(LocalDateTime.now());
        friendRepository.save(friendRequest);
        
        return mapToFriendResponse(friendRequest.getUser(), Friend.FriendStatus.ACCEPTED.name(), null);
    }
    
    public List<FriendResponse> getFriendRequests(Long userId) {
        // 나에게 온 친구 요청 목록 (내가 friend인 경우)
        List<Friend> requests = friendRepository.findByFriendIdAndStatus(userId, Friend.FriendStatus.PENDING);
        return requests.stream()
                .map(request -> {
                    // friendId는 요청을 보낸 사람의 ID (수락 시 이 ID로 API 호출)
                    FriendResponse response = mapToFriendResponse(request.getUser(), Friend.FriendStatus.PENDING.name(), request.getUser().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<FriendResponse> getRanking(Long userId) {
        // 나와 내 친구들 모두를 XP 순으로 정렬
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        // 친구 목록 가져오기 (수정 가능한 리스트로 복사)
        List<FriendResponse> allUsers = new java.util.ArrayList<>(getFriends(userId));
        
        // 나도 추가
        FriendResponse myResponse = mapToFriendResponse(currentUser, null, null);
        myResponse.setIsMe(true);
        allUsers.add(myResponse);
        
        // XP 순으로 정렬
        allUsers.sort((a, b) -> {
            int xpA = a.getTotalXp() != null ? a.getTotalXp() : 0;
            int xpB = b.getTotalXp() != null ? b.getTotalXp() : 0;
            return Integer.compare(xpB, xpA);
        });
        
        // 순위 부여
        for (int i = 0; i < allUsers.size(); i++) {
            allUsers.get(i).setRank(i + 1);
        }
        
        return allUsers;
    }
    
    public FriendResponse searchUserByCode(String userCode) {
        User user = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return mapToFriendResponse(user, null, null);
    }
    
    public List<FriendResponse> getRecommendedUsers(Long userId, String department, Integer grade) {
        // 이미 친구이거나 친구 요청이 있는 사용자 ID 수집
        java.util.Set<Long> excludeUserIds = new java.util.HashSet<>();
        excludeUserIds.add(userId); // 본인 제외
        
        // 내가 보낸 친구 요청
        List<Friend> sentRequests = friendRepository.findByUserId(userId);
        for (Friend f : sentRequests) {
            excludeUserIds.add(f.getFriend().getId());
        }
        
        // 나에게 온 친구 요청
        List<Friend> receivedRequests = friendRepository.findByFriendId(userId);
        for (Friend f : receivedRequests) {
            excludeUserIds.add(f.getUser().getId());
        }
        
        List<User> users = userRepository.findAll().stream()
                .filter(u -> !excludeUserIds.contains(u.getId()))
                .filter(u -> department == null || department.equals(u.getDepartment()))
                .filter(u -> grade == null || grade.equals(u.getGrade()))
                .collect(java.util.stream.Collectors.toList());
        
        return users.stream()
                .map(user -> mapToFriendResponse(user, null, null))
                .collect(Collectors.toList());
    }
    
    private FriendResponse mapToFriendResponse(User user, String status, Long friendId) {
        return FriendResponse.builder()
                .id(user.getId())
                .userId(user.getId())
                .friendId(friendId != null ? friendId : user.getId())
                .name(user.getName())
                .department(user.getDepartment())
                .school(user.getSchool())
                .grade(user.getGrade())
                .totalXp(user.getTotalXp() != null ? user.getTotalXp() : 0)
                .streak(user.getStreak() != null ? user.getStreak() : 0)
                .userCode(user.getUserCode())
                .status(status)
                .isMe(false)
                .build();
    }
}

