package com.certbuddy.repository;

import com.certbuddy.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUserId(Long userId);
    List<Friend> findByFriendId(Long friendId);
    Optional<Friend> findByUserIdAndFriendId(Long userId, Long friendId);
    List<Friend> findByUserIdAndStatus(Long userId, Friend.FriendStatus status);
    List<Friend> findByFriendIdAndStatus(Long friendId, Friend.FriendStatus status);
    Optional<Friend> findByFriendIdAndUserId(Long friendId, Long userId);
    boolean existsByUserIdAndFriendId(Long userId, Long friendId);
}

