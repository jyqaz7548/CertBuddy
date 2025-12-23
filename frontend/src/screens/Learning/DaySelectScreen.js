import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { questionService } from '../../services/questionService';

export default function DaySelectScreen({ route, navigation }) {
  const { user } = useAuth();
  const certificationId = route?.params?.certificationId;
  const certificationName = route?.params?.certificationName || '자격증';
  
  const [dayStatuses, setDayStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const TOTAL_DAYS = 15;

  // 일차별 완료 상태 로드
  const loadDayStatuses = async () => {
    try {
      setLoading(true);
      
      const statuses = await questionService.getDayStatuses(
        certificationId,
        user?.id || 1
      );
      
      setDayStatuses(statuses);
    } catch (error) {
      console.error('일차별 상태 로딩 실패:', error);
      // 기본값으로 15일치 미완료 상태 생성
      const defaultStatuses = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
        day: i + 1,
        isCompleted: false,
        isLocked: i > 0, // 1일차만 잠금 해제
      }));
      setDayStatuses(defaultStatuses);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (certificationId) {
        loadDayStatuses();
      }
    }, [certificationId, user?.id])
  );

  const handleDaySelect = (day, isLocked, isCompleted, reviewCount) => {
    if (isLocked) {
      Alert.alert(
        '잠금됨',
        `${day - 1}일차 학습을 먼저 완료해주세요.`,
        [{ text: '확인' }]
      );
      return;
    }

    // 복습 문제가 있는 경우
    if (reviewCount > 0) {
      Alert.alert(
        '복습 필요',
        `${reviewCount}문제 복습이 필요합니다. 복습 하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '복습하기',
            onPress: () => {
              // 복습 화면으로 이동
              navigation.navigate('Question', {
                isReview: true,
              });
            },
          },
        ]
      );
      return;
    }

    if (isCompleted) {
      // 완료된 일차를 다시 학습하려는 경우
      Alert.alert(
        '재학습',
        `${day}일차 학습을 이미 완료했습니다. 한번 더 학습하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '학습하기',
            onPress: () => {
              // 재학습 모드로 문제 풀이 화면으로 이동
              navigation.navigate('Question', {
                certificationId: certificationId,
                specificDay: day,
                isRelearning: true, // 재학습 모드 플래그
              });
            },
          },
        ]
      );
      return;
    }

    // 문제 풀이 화면으로 이동
    navigation.navigate('Question', {
      certificationId: certificationId,
      specificDay: day, // 특정 일차 지정
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>학습 현황을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{certificationName}</Text>
        <Text style={styles.subtitle}>
          총 {TOTAL_DAYS}일 학습 과정
        </Text>

        <View style={styles.dayList}>
          {dayStatuses.map((status) => {
            const { day, isCompleted, isLocked, reviewCount = 0 } = status;
            const hasReviewQuestions = reviewCount > 0;
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCard,
                  isCompleted && !hasReviewQuestions && styles.dayCardCompleted,
                  hasReviewQuestions && styles.dayCardReviewNeeded,
                  isLocked && styles.dayCardLocked,
                ]}
                onPress={() => handleDaySelect(day, isLocked, isCompleted, reviewCount)}
                activeOpacity={isLocked ? 1 : 0.7}
              >
                <View style={styles.dayNumberContainer}>
                  <Text style={[
                    styles.dayNumber,
                    isCompleted && !hasReviewQuestions && styles.dayNumberCompleted,
                    hasReviewQuestions && styles.dayNumberReviewNeeded,
                    isLocked && styles.dayNumberLocked,
                  ]}>
                    {day}
                  </Text>
                </View>
                
                <View style={styles.dayInfo}>
                  <Text style={[
                    styles.dayTitle,
                    isCompleted && !hasReviewQuestions && styles.dayTitleCompleted,
                    hasReviewQuestions && styles.dayTitleReviewNeeded,
                    isLocked && styles.dayTitleLocked,
                  ]}>
                    {day}일차
                  </Text>
                  <Text style={[
                    styles.dayQuestions,
                    isLocked && styles.dayQuestionsLocked,
                  ]}>
                    {hasReviewQuestions ? `${reviewCount}문제 복습 필요` : '6문제'}
                  </Text>
                </View>

                <View style={styles.statusContainer}>
                  {hasReviewQuestions ? (
                    <View style={styles.reviewNeededBadge}>
                      <Text style={styles.reviewNeededBadgeText}>복습 필요</Text>
                    </View>
                  ) : isCompleted ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✓ 완료</Text>
                    </View>
                  ) : isLocked ? (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedBadgeText}>🔒 잠금</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>미완료</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  dayList: {
    gap: 12,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  dayCardLocked: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  dayCardReviewNeeded: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  dayNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayNumberCompleted: {
    color: '#fff',
  },
  dayNumberLocked: {
    color: '#fff',
  },
  dayNumberReviewNeeded: {
    color: '#fff',
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  dayTitleCompleted: {
    color: '#34C759',
  },
  dayTitleLocked: {
    color: '#8E8E93',
  },
  dayTitleReviewNeeded: {
    color: '#FF9800',
  },
  dayQuestions: {
    fontSize: 14,
    color: '#8E8E93',
  },
  dayQuestionsLocked: {
    color: '#C7C7CC',
  },
  statusContainer: {
    marginLeft: 12,
  },
  completedBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  lockedBadge: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  lockedBadgeText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  reviewNeededBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reviewNeededBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

