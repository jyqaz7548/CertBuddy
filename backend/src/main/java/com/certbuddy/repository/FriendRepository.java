package com.certbuddy.repository;

import com.certbuddy.entity.Friend;
import com.certbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUserAndStatus(User user, Friend.FriendStatus status);
    Optional<Friend> findByUserAndFriend(User user, User friend);
    boolean existsByUserAndFriend(User user, User friend);
}

