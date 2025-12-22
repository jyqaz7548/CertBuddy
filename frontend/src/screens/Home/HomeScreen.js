import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { questionService } from '../../services/questionService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);

  const loadReviewCount = async () => {
    try {
      const questions = await questionService.getReviewQuestions(user?.id || 1);
      setReviewCount(questions.length);
    } catch (error) {
      console.error('복습 문제 개수 로딩 실패:', error);
    }
  };

  // 화면이 포커스될 때마다 복습 개수 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadReviewCount();
    }, [user?.id])
  );

  const handleStartReview = () => {
    navigation.navigate('Question', {
      isReview: true,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          안녕하세요, {user?.name || '사용자'}님! 👋
        </Text>
      </View>

      {/* XP 및 스트릭 표시 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>총 XP</Text>
          <Text style={styles.statValue}>{user?.totalXp || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>연속 학습</Text>
          <Text style={styles.statValue}>{user?.streak || 0}일</Text>
        </View>
      </View>

      {/* 오늘의 학습 시작 버튼 */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Learning')}
      >
        <Text style={styles.startButtonText}>오늘의 학습 시작하기</Text>
      </TouchableOpacity>

      {/* 오늘의 복습 시작 버튼 */}
      {reviewCount > 0 ? (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={handleStartReview}
        >
          <Text style={styles.reviewButtonText}>
            오늘의 복습 시작하기 ({reviewCount}문제)
          </Text>
          <Text style={styles.reviewButtonSubtext}>
            복습 완료 시 보너스 XP 획득!
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.reviewButtonDisabled}>
          <Text style={styles.reviewButtonTextDisabled}>
            오늘의 복습 시작하기
          </Text>
          <Text style={styles.reviewButtonSubtextDisabled}>
            복습할 문제가 없습니다
          </Text>
        </View>
      )}

      {/* 추천 자격증 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추천 자격증</Text>
        <Text style={styles.sectionSubtitle}>
          {user?.school} {user?.department} 학생에게 추천
        </Text>
        {/* TODO: 추천 자격증 리스트 */}
      </View>

      {/* 친구 랭킹 Top3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>친구 랭킹</Text>
        {/* TODO: 친구 랭킹 리스트 */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  startButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewButton: {
    backgroundColor: '#34C759',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
  },
  reviewButtonDisabled: {
    backgroundColor: '#E5E5E5',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButtonTextDisabled: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewButtonSubtextDisabled: {
    color: '#8E8E93',
    fontSize: 13,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
});

