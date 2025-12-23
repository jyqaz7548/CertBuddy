import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { questionService } from '../../services/questionService';
import { learningService } from '../../services/learningService';

export default function HomeScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);
  const [recommendedCerts, setRecommendedCerts] = useState([]);
  const [todayStatus, setTodayStatus] = useState({
    isLearningCompleted: false,
    isReviewCompleted: false,
    hasReviewQuestions: false,
  });

  const loadTodayStatus = async () => {
    try {
      const status = await questionService.getTodayLearningStatus(user?.id || 1);
      setTodayStatus(status);
      setReviewCount(status.reviewCount || 0);
    } catch (error) {
      console.error('오늘 학습 상태 로딩 실패:', error);
    }
  };

  const loadReviewCount = async () => {
    try {
      const questions = await questionService.getReviewQuestions(user?.id || 1);
      setReviewCount(questions.length);
    } catch (error) {
      console.error('복습 문제 개수 로딩 실패:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      // department만 있어도 추천 가능 (학년 무관)
      if (user?.department) {
        // 같은 학과 학생들의 자격증 기반 추천
        // TODO: 나중에 튜토리얼에서 선택한 기업의 선배 자격증 내역을 우선 표시하도록 확장
        // 1. AsyncStorage에서 selectedCompanyId 조회
        // 2. 기업 기반 선배 자격증 추천 API 호출
        // 3. 있으면 그것을 우선 표시, 없으면 학과 기반 추천 표시
        const recommendations = await learningService.getRecommendations(
          user.school || '',
          user.department,
          user.grade
        );
        setRecommendedCerts(recommendations);
      }
    } catch (error) {
      console.error('추천 자격증 로딩 실패:', error);
    }
  };

  // 화면이 포커스될 때마다 상태 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadTodayStatus();
      loadRecommendations();
      // XP 업데이트를 위해 사용자 정보 갱신
      if (refreshUser) {
        refreshUser();
      }
    }, [user?.id, user?.school, user?.department, refreshUser])
  );

  const handleStartReview = () => {
    navigation.navigate('Question', {
      isReview: true,
    });
  };

  const handleCertificationSelect = (certificationId) => {
    // 자격증 선택 시 문제 풀이 화면으로 이동
    navigation.navigate('Question', {
      certificationId: certificationId,
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

      {/* 오늘의 학습 버튼 - 학습 완료 + 복습 없음일 때만 "추가 학습하기" */}
      {todayStatus.isLearningCompleted && reviewCount === 0 ? (
        // 오늘의 학습 완료 + 복습 문제 없음 = 추가 학습하기
        <TouchableOpacity
          style={styles.startButtonCompleted}
          onPress={() => navigation.navigate('Learning')}
        >
          <Text style={styles.startButtonText}>추가 학습하기</Text>
          <Text style={styles.startButtonSubtext}>✓ 오늘의 학습 완료!</Text>
        </TouchableOpacity>
      ) : todayStatus.isLearningCompleted && reviewCount > 0 ? (
        // 오늘의 학습 완료했지만 복습 문제가 남아있음
        <View style={styles.startButtonPending}>
          <Text style={styles.startButtonTextPending}>오늘의 학습 완료</Text>
          <Text style={styles.startButtonSubtextPending}>
            복습을 완료하면 추가 학습이 가능합니다
          </Text>
        </View>
      ) : (
        // 오늘의 학습 시작 전
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Learning')}
        >
          <Text style={styles.startButtonText}>오늘의 학습 시작하기</Text>
        </TouchableOpacity>
      )}

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
        <View style={styles.reviewButtonCompleted}>
          <Text style={styles.reviewButtonTextCompleted}>
            ✓ 오늘의 복습 완료!
          </Text>
          <Text style={styles.reviewButtonSubtextCompleted}>
            모든 복습 문제를 완료했습니다
          </Text>
        </View>
      )}

      {/* 추천 자격증 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추천 자격증</Text>
        <Text style={styles.sectionSubtitle}>
          {user?.department} 학생들이 많이 취득한 자격증이에요
        </Text>
        {recommendedCerts.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.certScrollView}
            contentContainerStyle={styles.certScrollContent}
          >
            {recommendedCerts.map((cert) => (
              <TouchableOpacity
                key={cert.id}
                style={styles.certCard}
                onPress={() => handleCertificationSelect(cert.id)}
                activeOpacity={0.7}
              >
                <View style={styles.certCardHeader}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certCategory}>{cert.category || '자격증'}</Text>
                </View>
                <Text style={styles.certDescription} numberOfLines={2}>
                  {cert.description || '자격증 설명이 없습니다.'}
                </Text>
                <View style={styles.certCardFooter}>
                  <Text style={styles.certActionText}>학습 시작하기 →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              추천 자격증이 없습니다.
            </Text>
          </View>
        )}
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
  startButtonCompleted: {
    backgroundColor: '#34C759',
    margin: 15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonPending: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButtonTextPending: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4,
  },
  startButtonSubtextPending: {
    color: '#FF9800',
    fontSize: 13,
    marginTop: 4,
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
  reviewButtonCompleted: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  reviewButtonTextCompleted: {
    color: '#34C759',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewButtonSubtextCompleted: {
    color: '#34C759',
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
  certScrollView: {
    marginHorizontal: -5,
  },
  certScrollContent: {
    paddingHorizontal: 5,
    gap: 12,
  },
  certCard: {
    width: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  certCardHeader: {
    marginBottom: 10,
  },
  certName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  certCategory: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  certDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
    flex: 1,
  },
  certCardFooter: {
    marginTop: 'auto',
  },
  certActionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

