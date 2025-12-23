package com.certbuddy.util;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * JWT Secret Key 생성 유틸리티
 * 
 * 사용 방법:
 * 1. 이 클래스를 실행하면 랜덤한 JWT Secret Key가 생성됩니다.
 * 2. 생성된 키를 application.properties의 jwt.secret에 복사하세요.
 */
public class JwtSecretGenerator {
    
    public static void main(String[] args) {
        try {
            // 256비트 (32바이트) Secret Key 생성
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            keyGenerator.init(256);
            SecretKey secretKey = keyGenerator.generateKey();
            
            // Base64로 인코딩
            String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
            
            System.out.println("========================================");
            System.out.println("생성된 JWT Secret Key:");
            System.out.println(encodedKey);
            System.out.println("========================================");
            System.out.println("\n이 키를 application.properties의 jwt.secret에 복사하세요.");
            System.out.println("예: jwt.secret=" + encodedKey);
            
        } catch (NoSuchAlgorithmException e) {
            System.err.println("알고리즘을 찾을 수 없습니다: " + e.getMessage());
        }
    }
}

