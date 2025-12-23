import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

export default function ReviewNeededScreen({ route, navigation }) {
  const { isReview = false, certificationId = null } = route?.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 페이드인 애니메이션
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleReview = () => {
    // 복습 리스트에 추가하고 복습 화면으로 이동 (현재 화면을 교체)
    navigation.replace('Question', {
      isReview: true,
      certificationId: certificationId, // 특정 자격증의 복습 문제만 가져오기 위해 전달
    });
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 경고 아이콘 */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        {/* 제목 */}
        <Text style={styles.title}>
          {isReview ? '복습 필요' : '학습 복습 필요'}
        </Text>

        {/* 설명 */}
        <Text style={styles.description}>
          {isReview
            ? '모든 문제를 틀렸습니다.\n다시 복습해보세요!'
            : '모든 문제를 틀렸습니다.\n복습 리스트에 추가하여 다시 학습해보세요!'}
        </Text>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={handleReview}
            activeOpacity={0.8}
          >
            <Text style={styles.reviewButtonText}>
              {isReview ? '다시 복습하기' : '복습하기'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  reviewButton: {
    backgroundColor: '#FF9500',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#E5E5E5',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
});

