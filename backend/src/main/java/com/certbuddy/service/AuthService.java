package com.certbuddy.service;

import com.certbuddy.config.JwtUtil;
import com.certbuddy.dto.request.LoginRequest;
import com.certbuddy.dto.request.RegisterRequest;
import com.certbuddy.dto.response.AuthResponse;
import com.certbuddy.dto.response.UserResponse;
import com.certbuddy.entity.User;
import com.certbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    private static final AtomicLong userCounter = new AtomicLong(0);
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
        }
        
        // 사용자 코드 생성
        long nextId = userCounter.incrementAndGet();
        String userCode = String.format("CERT-%04d", nextId);
        
        // 중복 체크 및 재생성
        while (userRepository.existsByUserCode(userCode)) {
            nextId = userCounter.incrementAndGet();
            userCode = String.format("CERT-%04d", nextId);
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .school(request.getSchool())
                .department(request.getDepartment())
                .grade(request.getGrade())
                .totalXp(0)
                .streak(0)
                .userCode(userCode)
                .createdAt(LocalDateTime.now())
                .build();
        
        user = userRepository.save(user);
        
        String token = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        String token = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }
    
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        return mapToUserResponse(user);
    }
    
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .school(user.getSchool())
                .department(user.getDepartment())
                .grade(user.getGrade())
                .totalXp(user.getTotalXp())
                .streak(user.getStreak())
                .userCode(user.getUserCode())
                .build();
    }
}

