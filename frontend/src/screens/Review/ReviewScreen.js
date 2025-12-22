import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { questionService } from '../../services/questionService';
import { useAuth } from '../../store/AuthContext';

export default function ReviewScreen({ navigation }) {
  const { user } = useAuth();
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReviewQuestions();
  }, []);

  const loadReviewQuestions = async () => {
    try {
      setLoading(true);
      const questions = await questionService.getReviewQuestions(user?.id || 1);
      setReviewQuestions(questions);
    } catch (error) {
      console.error('복습 문제 로딩 실패:', error);
      setReviewQuestions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadReviewQuestions();
  };

  const handleStartReview = () => {
    if (reviewQuestions.length === 0) {
      return;
    }
    
    // 복습 모드로 QuestionScreen 이동
    navigation.navigate('Question', {
      isReview: true,
    });
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'OX':
        return 'O/X';
      case 'BLANK':
        return '빈칸';
      case 'ORDER':
        return '순서';
      default:
        return '문제';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>복습 문제를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>복습 모드</Text>
          <Text style={styles.subtitle}>
            틀렸던 문제를 다시 풀어보세요
          </Text>
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviewQuestions.length}</Text>
            <Text style={styles.statLabel}>복습할 문제</Text>
          </View>
        </View>

        {/* 복습 문제가 없는 경우 */}
        {reviewQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>복습할 문제가 없습니다</Text>
            <Text style={styles.emptySubtitle}>
              문제를 풀다가 틀린 문제가 있으면{'\n'}
              자동으로 복습 리스트에 추가됩니다
            </Text>
            <TouchableOpacity
              style={styles.startLearningButton}
              onPress={() => navigation.navigate('Learning')}
            >
              <Text style={styles.startLearningButtonText}>학습 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 복습 문제 목록 */}
            <View style={styles.questionsSection}>
              <Text style={styles.sectionTitle}>복습 문제 목록</Text>
              {reviewQuestions.map((question, index) => (
                <TouchableOpacity
                  key={question.id}
                  style={styles.questionCard}
                  onPress={handleStartReview}
                >
                  <View style={styles.questionCardHeader}>
                    <View style={styles.questionNumber}>
                      <Text style={styles.questionNumberText}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.questionTypeBadge}>
                      <Text style={styles.questionTypeText}>
                        {getTypeLabel(question.type)}
                      </Text>
                    </View>
                    {question.source === 'REAL_CBT' && (
                      <View style={styles.realCbtBadge}>
                        <Text style={styles.realCbtText}>기출</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.questionPreview} numberOfLines={2}>
                    {question.question}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 시작 버튼 */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartReview}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>
                복습 시작하기 ({reviewQuestions.length}문제)
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  startLearningButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startLearningButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  questionTypeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questionTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  realCbtBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  realCbtText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  questionPreview: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
