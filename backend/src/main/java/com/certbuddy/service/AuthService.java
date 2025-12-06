package com.certbuddy.service;

import com.certbuddy.dto.request.LoginRequest;
import com.certbuddy.dto.request.RegisterRequest;
import com.certbuddy.dto.response.AuthResponse;
import com.certbuddy.dto.response.UserResponse;
import com.certbuddy.entity.User;
import com.certbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
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
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(user);
        UserResponse userResponse = mapToUserResponse(user);

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다");
        }

        String token = jwtService.generateToken(user);
        UserResponse userResponse = mapToUserResponse(user);

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
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
                .build();
    }
}

