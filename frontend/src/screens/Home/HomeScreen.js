import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { questionService } from '../../services/questionService';
import { learningService } from '../../services/learningService';
import { friendService } from '../../services/friendService';
import { mockData } from '../../services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);
  const [recommendedCerts, setRecommendedCerts] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [topUser, setTopUser] = useState(null);
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

  // 친구 랭킹 로드
  const loadRanking = async () => {
    try {
      const rankingList = await friendService.getRanking(user?.id || 1);
      setRanking(rankingList);
      
      // 1등 찾기 (본인이 아닌 경우만)
      const topUserInfo = rankingList.find(u => u.rank === 1 && !u.isMe);
      if (topUserInfo) {
        setTopUser(topUserInfo);
      } else if (rankingList.length > 0 && rankingList[0].rank === 1) {
        // 본인이 1등인 경우
        setTopUser(rankingList[0]);
      }
      
      // 내 등수 찾기
      const myRankInfo = rankingList.find(u => u.isMe || u.id === user?.id);
      if (myRankInfo) {
        setMyRank(myRankInfo.rank);
      }
    } catch (error) {
      console.error('랭킹 로딩 실패:', error);
    }
  };

  // 화면이 포커스될 때마다 상태 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadTodayStatus();
      loadRecommendations();
      loadRanking();
      // XP 업데이트를 위해 사용자 정보 갱신
      if (refreshUser) {
        refreshUser();
      }
    }, [user?.id, user?.school, user?.department, refreshUser])
  );

  const handleStartReview = async () => {
    try {
      const userId = user?.id || 1;
      const reviewQuestions = await questionService.getReviewQuestions(userId);

      if (!reviewQuestions || reviewQuestions.length === 0) {
        // 복습할 문제가 없음
        return;
      }

      // 자격증별로 그룹화
      const certIdSet = new Set(reviewQuestions.map(q => q.certificationId).filter(Boolean));
      const certIds = Array.from(certIdSet);

      // 자격증 이름 매핑
      const getCertName = (id) => {
        const found = mockData.tutorialCertifications.find(c => c.id === id);
        return found ? found.name : `자격증 ${id}`;
      };

      if (certIds.length <= 1) {
        const firstCertId = certIds[0] || null;
        navigation.navigate('Question', {
          isReview: true,
          certificationId: firstCertId,
        });
        return;
      }

      // 여러 자격증이 있을 경우 선택지 제공
      const buttons = certIds.slice(0, 3).map(id => ({
        text: getCertName(id),
        onPress: () => {
          navigation.navigate('Question', {
            isReview: true,
            certificationId: id,
          });
        },
      }));

      // Alert는 3개까지만 버튼 지원하므로 3개 초과 시 첫 번째로 이동
      if (certIds.length > 3) {
        buttons.push({
          text: '기타(첫 자격증으로 진행)',
          onPress: () => {
            navigation.navigate('Question', {
              isReview: true,
              certificationId: certIds[0],
            });
          },
        });
      }

      buttons.push({ text: '취소', style: 'cancel' });

      Alert.alert('복습할 자격증을 선택하세요', '', buttons);
    } catch (error) {
      console.error('복습 시작 실패:', error);
      navigation.navigate('Question', {
        isReview: true,
      });
    }
  };

  const handleCertificationSelect = (certificationId, certificationName) => {
    // 자격증 선택 시 일차 선택 화면으로 이동
    navigation.navigate('DaySelect', {
      certificationId: certificationId,
      certificationName: certificationName,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {user?.name || '사용자'}님, 오늘도 화이팅! 💪
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

      {/* 오늘의 학습 버튼 */}
      {todayStatus.isLearningCompleted &&
      (!todayStatus.hasReviewQuestions || todayStatus.isReviewCompleted || reviewCount === 0) ? (
        // 오늘의 학습 완료 + 복습도 완료 혹은 없음 = 완료 상태
        <TouchableOpacity
          style={styles.startButtonCompleted}
          onPress={() => navigation.navigate('Learning')}
        >
          <Text style={styles.startButtonText}>추가 학습하기</Text>
          <Text style={styles.startButtonSubtext}>오늘의 학습을 완료했습니다!</Text>
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
      ) : todayStatus.isLearningCompleted ? (
        // 학습 완료 + 복습도 완료
        <View style={styles.reviewButtonCompleted}>
          <Text style={styles.reviewButtonTextCompleted}>
            ✓ 복습을 완료했습니다
          </Text>
          <Text style={styles.reviewButtonSubtextCompleted}>
            모든 복습 문제를 완료했습니다
          </Text>
        </View>
      ) : (
        // 학습 미완료 + 복습 문제 없음
        <View style={styles.reviewButtonCompleted}>
          <Text style={styles.reviewButtonTextCompleted}>
            복습할 문제가 없습니다
          </Text>
          <Text style={styles.reviewButtonSubtextCompleted}>
            오늘의 학습을 시작해주세요
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
                onPress={() => handleCertificationSelect(cert.id, cert.name)}
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

      {/* 친구 랭킹 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>친구 랭킹</Text>
        
        {/* 1등 표시 */}
        {topUser && (
          <View style={styles.topRankCard}>
            <View style={styles.topRankLeft}>
              <View style={styles.topRankBadge}>
                <View style={styles.profileImageContainer}>
                  <Text style={styles.profileImageText}>
                    {topUser.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.crownOverlay}>
                  <FontAwesome5 name="crown" size={16} color="#FFD700" solid />
                </View>
              </View>
              <View style={styles.topRankInfo}>
                <Text style={styles.topRankLabel}>1등</Text>
                <Text style={styles.topRankName}>{topUser.name}</Text>
                <Text style={styles.topRankDepartment}>
                  {topUser.department}
                </Text>
              </View>
            </View>
            <View style={styles.topRankRight}>
              <View style={styles.topRankStats}>
                <View style={styles.statItem}>
                  <Ionicons name="trophy" size={16} color="#FFD700" />
                  <Text style={styles.topRankStatText}>
                    {topUser.totalXp.toLocaleString()} XP
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="flame" size={16} color="#FF6B6B" />
                  <Text style={styles.topRankStatText}>
                    {topUser.streak}일
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 내 등수 표시 */}
        {myRank !== null && (
          <View style={styles.myRankCard}>
            <View style={styles.myRankLeft}>
              <View style={styles.myRankBadge}>
                <View style={styles.profileImageContainer}>
                  <Text style={styles.profileImageText}>
                    {(user?.name || '나').charAt(0)}
                  </Text>
                </View>
                <View style={styles.rankBadgeOverlay}>
                  <Text style={styles.rankNumberSmall}>{myRank}</Text>
                </View>
              </View>
              <View style={styles.myRankInfo}>
                <View style={styles.myRankNameRow}>
                  <Text style={styles.myRankName}>{user?.name || '나'}</Text>
                  <View style={styles.meBadge}>
                    <Text style={styles.meBadgeText}>나</Text>
                  </View>
                </View>
                <Text style={styles.myRankDepartment}>
                  {user?.department}
                </Text>
              </View>
            </View>
            <View style={styles.myRankRight}>
              <View style={styles.myRankStats}>
                <View style={styles.statItem}>
                  <Ionicons name="trophy" size={16} color="#FFD700" />
                  <Text style={styles.myRankStatText}>
                    {user?.totalXp?.toLocaleString() || 0} XP
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="flame" size={16} color="#FF6B6B" />
                  <Text style={styles.myRankStatText}>
                    {user?.streak || 0}일
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 전체 랭킹 보기 버튼 */}
        {ranking.length > 0 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Friends', { initialTab: 'ranking' })}
          >
            <Text style={styles.viewAllButtonText}>
              전체 랭킹 보기 ({ranking.length}명)
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titleContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
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
  // 친구 랭킹 스타일
  topRankCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  topRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topRankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    position: 'relative',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankBadgeOverlay: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  crownOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topRankInfo: {
    flex: 1,
  },
  topRankLabel: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginBottom: 4,
  },
  topRankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  topRankDepartment: {
    fontSize: 14,
    color: '#666',
  },
  topRankRight: {
    alignItems: 'flex-end',
  },
  topRankStats: {
    gap: 8,
  },
  topRankStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  myRankCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  myRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  myRankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    position: 'relative',
  },
  rankNumberSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  myRankInfo: {
    flex: 1,
  },
  myRankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  myRankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  meBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  meBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  myRankDepartment: {
    fontSize: 14,
    color: '#666',
  },
  myRankRight: {
    alignItems: 'flex-end',
  },
  myRankStats: {
    gap: 8,
  },
  myRankStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
});

