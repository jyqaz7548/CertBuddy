package com.certbuddy.repository;

import com.certbuddy.entity.UserCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCertificationRepository extends JpaRepository<UserCertification, Long> {
    List<UserCertification> findByUserId(Long userId);
    Optional<UserCertification> findByUserIdAndCertificationId(Long userId, Long certificationId);
    List<UserCertification> findByUserIdAndType(Long userId, UserCertification.CertificationType type);
    List<UserCertification> findByCertificationId(Long certificationId);
}

