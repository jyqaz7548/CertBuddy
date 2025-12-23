package com.certbuddy.service;

import com.certbuddy.dto.response.CertificationResponse;
import com.certbuddy.entity.Certification;
import com.certbuddy.entity.User;
import com.certbuddy.entity.UserCertification;
import com.certbuddy.repository.CertificationRepository;
import com.certbuddy.repository.UserCertificationRepository;
import com.certbuddy.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;
    private final UserCertificationRepository userCertificationRepository;
    private final EntityManager entityManager;
    
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
    
    // 취득한 자격증 목록 조회
    public List<CertificationResponse> getAcquiredCertifications(Long userId) {
        List<UserCertification> userCerts = userCertificationRepository
                .findByUserIdAndType(userId, UserCertification.CertificationType.ACQUIRED);
        
        return userCerts.stream()
                .map(uc -> CertificationResponse.builder()
                        .id(uc.getCertification().getId())
                        .name(uc.getCertification().getName())
                        .description(uc.getCertification().getDescription())
                        .build())
                .collect(Collectors.toList());
    }
    
    // 취득한 자격증 추가
    @Transactional
    public void addAcquiredCertification(Long userId, Long certificationId, String certificationName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        Certification certification;
        if (certificationId != null) {
            certification = certificationRepository.findById(certificationId)
                    .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다"));
        } else if (certificationName != null && !certificationName.isEmpty()) {
            certification = certificationRepository.findByName(certificationName)
                    .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다: " + certificationName));
        } else {
            throw new RuntimeException("자격증 ID 또는 이름이 필요합니다");
        }
        
        // 이미 추가되어 있는지 확인
        if (userCertificationRepository.findByUserIdAndCertificationId(userId, certification.getId())
                .filter(uc -> uc.getType() == UserCertification.CertificationType.ACQUIRED)
                .isPresent()) {
            return; // 이미 추가되어 있으면 무시
        }
        
        // 기존에 WANTED 타입으로 등록되어 있으면 삭제
        userCertificationRepository.findByUserIdAndCertificationId(userId, certification.getId())
                .ifPresent(userCertificationRepository::delete);
        
        UserCertification userCertification = UserCertification.builder()
                .user(user)
                .certification(certification)
                .type(UserCertification.CertificationType.ACQUIRED)
                .build();
        
        userCertificationRepository.save(userCertification);
    }
    
    // 취득한 자격증 삭제
    @Transactional
    public void removeAcquiredCertification(Long userId, Long certificationId) {
        userCertificationRepository.findByUserIdAndCertificationId(userId, certificationId)
                .filter(uc -> uc.getType() == UserCertification.CertificationType.ACQUIRED)
                .ifPresent(userCertificationRepository::delete);
    }
    
    // 취득한 자격증 일괄 설정 (기존 것 삭제 후 새로 추가)
    @Transactional
    public void setAcquiredCertifications(Long userId, List<String> certificationNames) {
        // 기존 취득한 자격증 삭제
        List<UserCertification> existingCerts = userCertificationRepository
                .findByUserIdAndType(userId, UserCertification.CertificationType.ACQUIRED);
        userCertificationRepository.deleteAll(existingCerts);
        
        // 삭제 후 즉시 DB에 반영 (flush) - 이후 insert와 충돌 방지
        entityManager.flush();
        
        // 새로 추가 (자격증 이름으로 찾기)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        // 중복 이름 제거
        Set<String> uniqueCertNames = new HashSet<>();
        
        for (String certName : certificationNames) {
            if (certName == null || certName.isEmpty() || certName.equals("없음") || certName.equals("기타")) {
                continue; // 유효하지 않은 이름은 건너뛰기
            }
            
            // 이미 처리한 자격증 이름은 건너뛰기
            if (!uniqueCertNames.add(certName)) {
                continue;
            }
            
            Certification certification = certificationRepository.findByName(certName)
                    .orElseThrow(() -> new RuntimeException("자격증을 찾을 수 없습니다: " + certName));
            
            UserCertification userCertification = UserCertification.builder()
                    .user(user)
                    .certification(certification)
                    .type(UserCertification.CertificationType.ACQUIRED)
                    .build();
            
            userCertificationRepository.save(userCertification);
        }
    }
}

