import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

export default function XpResultScreen({ route, navigation }) {
  const { 
    isReview = false,
    totalQuestions = 0,
    correctAnswers = 0,
    wrongAnswers = 0,
    xpEarned = 0,
    bonusXp = 0,
    todayMaxXp = 0,
  } = route?.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;
  const [displayXp, setDisplayXp] = useState(0);

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

    // XP 카운트업 애니메이션
    // 복습 모드에서는 xpEarned만 사용, 일반 학습 모드에서는 xpEarned 사용
    const totalXp = isReview ? xpEarned : xpEarned;
    const listener = xpAnim.addListener(({ value }) => {
      setDisplayXp(Math.floor(value));
    });

    Animated.timing(xpAnim, {
      toValue: totalXp,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      xpAnim.removeListener(listener);
    });

    return () => {
      xpAnim.removeListener(listener);
    };
  }, []);

  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

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
        {/* 완료 아이콘 */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎉</Text>
        </View>

        {/* 제목 */}
        <Text style={styles.title}>
          {isReview ? '복습 완료!' : '학습 완료!'}
        </Text>

        {/* 정확도 */}
        <View style={styles.accuracyContainer}>
          <Text style={styles.accuracyValue}>{accuracy}%</Text>
          <Text style={styles.accuracyLabel}>정확도</Text>
        </View>

        {/* 결과 요약 */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>총 문제</Text>
            <Text style={styles.summaryValue}>{totalQuestions}문제</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>정답</Text>
            <Text style={[styles.summaryValue, styles.correctValue]}>
              {correctAnswers}개
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>오답</Text>
            <Text style={[styles.summaryValue, styles.wrongValue]}>
              {wrongAnswers}개
            </Text>
          </View>
        </View>

        {/* XP 획득 */}
        <View style={styles.xpContainer}>
          {isReview ? (
            // 복습 모드: 보너스 XP로 표시
            <>
              <View style={styles.xpDetail}>
                <Text style={styles.xpDetailLabel}>보너스 XP</Text>
                <Text style={styles.xpDetailValue}>
                  +{totalQuestions * 5}XP
                </Text>
              </View>
              {wrongAnswers > 0 && (
                <View style={styles.xpDetail}>
                  <Text style={styles.xpDetailLabel}>차감</Text>
                  <Text style={[styles.xpDetailValue, styles.penaltyValue]}>
                    -{wrongAnswers * 5}XP
                  </Text>
                </View>
              )}
              <View style={styles.totalXpContainer}>
                <Text style={styles.totalXpLabel}>보너스 XP</Text>
                <Text style={[styles.totalXpValue, styles.bonusValue]}>
                  +{displayXp}XP
                </Text>
              </View>
            </>
          ) : (
            // 일반 학습 모드
            <>
              <View style={styles.xpDetail}>
                <Text style={styles.xpDetailLabel}>기본 XP</Text>
                <Text style={styles.xpDetailValue}>+{totalQuestions * 10}XP</Text>
              </View>
              {wrongAnswers > 0 && (
                <View style={styles.xpDetail}>
                  <Text style={styles.xpDetailLabel}>차감</Text>
                  <Text style={[styles.xpDetailValue, styles.penaltyValue]}>
                    -{wrongAnswers * 10}XP
                  </Text>
                </View>
              )}
              <View style={styles.totalXpContainer}>
                <Text style={styles.totalXpLabel}>획득한 XP</Text>
                <Text style={styles.totalXpValue}>
                  +{displayXp}XP
                </Text>
              </View>
            </>
          )}
        </View>

        {/* 완료 버튼 */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>확인</Text>
        </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  accuracyContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  accuracyValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  accuracyLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  correctValue: {
    color: '#34C759',
  },
  wrongValue: {
    color: '#FF3B30',
  },
  xpContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  xpDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpDetailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  xpDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  penaltyValue: {
    color: '#FF3B30',
  },
  bonusValue: {
    color: '#34C759',
    fontSize: 18,
  },
  totalXpContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  totalXpLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  totalXpValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

