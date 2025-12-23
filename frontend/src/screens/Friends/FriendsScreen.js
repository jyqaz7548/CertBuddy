import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { friendService } from '../../services/friendService';
import { Ionicons } from '@expo/vector-icons';

export default function FriendsScreen({ navigation, route }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(
    route?.params?.initialTab || 'friends'
  ); // 'friends' or 'ranking'
  const [friends, setFriends] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 친구 추가 모달 관련 상태
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // 친구 목록 로드
  const loadFriends = async () => {
    try {
      setLoading(true);
      const friendsList = await friendService.getFriends(user?.id || 1);
      setFriends(friendsList);
    } catch (error) {
      console.error('친구 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 친구 랭킹 로드
  const loadRanking = async () => {
    try {
      const rankingList = await friendService.getRanking(user?.id || 1);
      setRanking(rankingList);
    } catch (error) {
      console.error('랭킹 로딩 실패:', error);
    }
  };

  // 친구 요청 목록 로드
  const loadFriendRequests = async () => {
    try {
      const requests = await friendService.getFriendRequests(user?.id || 1);
      setFriendRequests(requests);
    } catch (error) {
      console.error('친구 요청 로딩 실패:', error);
    }
  };

  // 화면이 포커스될 때마다 데이터 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadFriends();
      loadRanking();
      loadFriendRequests();
    }, [user?.id])
  );

  // 친구 추가 모달 열기
  const handleAddFriend = () => {
    setShowAddFriendModal(true);
    loadRecommendedUsers();
  };

  // 추천 사용자 로드
  const loadRecommendedUsers = async () => {
    if (!user?.department || !user?.grade) return;
    
    try {
      setLoadingRecommendations(true);
      const recommended = await friendService.getRecommendedUsers(
        user.id || 1,
        user.department,
        user.grade
      );
      setRecommendedUsers(recommended);
    } catch (error) {
      console.error('추천 사용자 로딩 실패:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // 고유 코드로 사용자 검색
  const handleSearchUser = async () => {
    if (!searchCode.trim()) {
      Alert.alert('알림', '고유 코드를 입력해주세요.');
      return;
    }

    try {
      setSearching(true);
      setSearchedUser(null);
      const user = await friendService.searchUserByCode(searchCode.trim());
      setSearchedUser(user);
    } catch (error) {
      Alert.alert('오류', error.message || '사용자를 찾을 수 없습니다.');
      setSearchedUser(null);
    } finally {
      setSearching(false);
    }
  };

  // 검색된 사용자에게 친구 요청 보내기
  const handleSendFriendRequest = async (friendId) => {
    try {
      await friendService.addFriend(user?.id || 1, friendId);
      Alert.alert('성공', '친구 요청을 보냈습니다.');
      setSearchedUser(null);
      setSearchCode('');
      setShowAddFriendModal(false);
      loadFriendRequests();
    } catch (error) {
      Alert.alert('오류', error.message || '친구 요청 전송에 실패했습니다.');
    }
  };

  // 추천 사용자에게 친구 요청 보내기
  const handleAddRecommendedFriend = async (friendId) => {
    try {
      await friendService.addFriend(user?.id || 1, friendId);
      Alert.alert('성공', '친구 요청을 보냈습니다.');
      loadRecommendedUsers();
      loadFriendRequests();
    } catch (error) {
      Alert.alert('오류', error.message || '친구 요청 전송에 실패했습니다.');
    }
  };

  // 친구 요청 수락
  const handleAcceptRequest = async (friendId) => {
    try {
      await friendService.acceptFriendRequest(user?.id || 1, friendId);
      Alert.alert('성공', '친구 요청을 수락했습니다.');
      loadFriends();
      loadFriendRequests();
    } catch (error) {
      Alert.alert('오류', error.message || '친구 요청 수락에 실패했습니다.');
    }
  };

  if (loading && activeTab === 'friends') {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>친구 목록을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>친구</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFriend}
        >
          <Ionicons name="person-add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* 친구 추가 모달 */}
      <Modal
        visible={showAddFriendModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddFriendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>친구 추가</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddFriendModal(false);
                  setSearchCode('');
                  setSearchedUser(null);
                }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* 고유 코드 검색 섹션 */}
              <View style={styles.searchSection}>
                <Text style={styles.sectionTitle}>고유 코드로 검색</Text>
                <Text style={styles.sectionSubtitle}>
                  친구의 고유 코드를 입력하세요 (예: CERT-0001)
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="CERT-0001"
                    value={searchCode}
                    onChangeText={setSearchCode}
                    autoCapitalize="characters"
                    placeholderTextColor="#C7C7CC"
                  />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearchUser}
                    disabled={searching}
                  >
                    {searching ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="search" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* 검색 결과 */}
                {searchedUser && (
                  <View style={styles.searchedUserCard}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {searchedUser.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.searchedUserInfo}>
                      <Text style={styles.searchedUserName}>{searchedUser.name}</Text>
                      <Text style={styles.searchedUserDetails}>
                        {searchedUser.department} · {searchedUser.grade}학년
                      </Text>
                      <Text style={styles.searchedUserCode}>
                        {searchedUser.userCode}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addButtonSmall}
                      onPress={() => handleSendFriendRequest(searchedUser.id)}
                    >
                      <Text style={styles.addButtonSmallText}>추가</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* 추천 사용자 섹션 */}
              <View style={styles.recommendationSection}>
                <Text style={styles.sectionTitle}>
                  같은 학과 추천 ({user?.department} {user?.grade}학년)
                </Text>
                {loadingRecommendations ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#007AFF" />
                  </View>
                ) : recommendedUsers.length === 0 ? (
                  <Text style={styles.emptyText}>
                    추천할 사용자가 없습니다
                  </Text>
                ) : (
                  recommendedUsers.map((recommendedUser) => (
                    <View key={recommendedUser.id} style={styles.recommendedUserCard}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {recommendedUser.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.recommendedUserInfo}>
                        <Text style={styles.recommendedUserName}>
                          {recommendedUser.name}
                        </Text>
                        <Text style={styles.recommendedUserCode}>
                          {recommendedUser.userCode}
                        </Text>
                        <View style={styles.recommendedUserStats}>
                          <View style={styles.statItem}>
                            <Ionicons name="trophy" size={14} color="#FFD700" />
                            <Text style={styles.statTextSmall}>
                              {recommendedUser.totalXp} XP
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Ionicons name="flame" size={14} color="#FF6B6B" />
                            <Text style={styles.statTextSmall}>
                              {recommendedUser.streak}일
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.addButtonSmall}
                        onPress={() => handleAddRecommendedFriend(recommendedUser.id)}
                      >
                        <Text style={styles.addButtonSmallText}>추가</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
            친구 목록
          </Text>
          {friendRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friendRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ranking' && styles.tabActive]}
          onPress={() => setActiveTab('ranking')}
        >
          <Text style={[styles.tabText, activeTab === 'ranking' && styles.tabTextActive]}>
            랭킹
          </Text>
        </TouchableOpacity>
      </View>

      {/* 내용 영역 */}
      <ScrollView style={styles.content}>
        {activeTab === 'friends' ? (
          <>
            {/* 친구 요청 섹션 */}
            {friendRequests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>친구 요청</Text>
                {friendRequests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {request.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.requestDetails}>
                        <Text style={styles.requestName}>{request.name}</Text>
                        <Text style={styles.requestDepartment}>
                          {request.department} {request.school}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAcceptRequest(request.friendId)}
                      >
                        <Text style={styles.acceptButtonText}>수락</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* 친구 목록 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                친구 목록 ({friends.length})
              </Text>
              {friends.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={64} color="#C7C7CC" />
                  <Text style={styles.emptyText}>친구가 없습니다</Text>
                  <Text style={styles.emptySubtext}>
                    친구를 추가하여 함께 학습하세요!
                  </Text>
                </View>
              ) : (
                friends.map((friend) => (
                  <TouchableOpacity
                    key={friend.id}
                    style={styles.friendCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {friend.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <Text style={styles.friendDepartment}>
                        {friend.department} · {friend.grade}학년
                      </Text>
                      <View style={styles.friendStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="trophy" size={16} color="#FFD700" />
                          <Text style={styles.statText}>{friend.totalXp} XP</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="flame" size={16} color="#FF6B6B" />
                          <Text style={styles.statText}>{friend.streak}일</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        ) : (
          /* 랭킹 섹션 */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>친구 랭킹</Text>
            {ranking.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyText}>랭킹 데이터가 없습니다</Text>
              </View>
            ) : (
              ranking.map((user, index) => (
                <View
                  key={user.id}
                  style={[
                    styles.rankingCard,
                    user.isMe && styles.rankingCardMe,
                  ]}
                >
                  <View style={styles.rankingLeft}>
                    <View style={styles.rankBadge}>
                      {user.rank <= 3 ? (
                        <Ionicons
                          name={
                            user.rank === 1
                              ? 'trophy'
                              : user.rank === 2
                              ? 'medal'
                              : 'ribbon'
                          }
                          size={24}
                          color={
                            user.rank === 1
                              ? '#FFD700'
                              : user.rank === 2
                              ? '#C0C0C0'
                              : '#CD7F32'
                          }
                        />
                      ) : (
                        <Text style={styles.rankNumber}>{user.rank}</Text>
                      )}
                    </View>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.rankingInfo}>
                      <View style={styles.rankingNameRow}>
                        <Text style={styles.rankingName}>{user.name}</Text>
                        {user.isMe && (
                          <View style={styles.meBadge}>
                            <Text style={styles.meBadgeText}>나</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.rankingDepartment}>
                        {user.department}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankingRight}>
                    <View style={styles.rankingStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="trophy" size={16} color="#FFD700" />
                        <Text style={styles.rankingStatText}>
                          {user.totalXp.toLocaleString()} XP
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="flame" size={16} color="#FF6B6B" />
                        <Text style={styles.rankingStatText}>
                          {user.streak}일
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
    textAlign: 'center',
  },
  friendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  friendDepartment: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  friendStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestDetails: {
    marginLeft: 12,
    flex: 1,
  },
  requestName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  requestDepartment: {
    fontSize: 14,
    color: '#8E8E93',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rankingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankingCardMe: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  rankingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  rankingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  rankingName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  meBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  meBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  rankingDepartment: {
    fontSize: 14,
    color: '#8E8E93',
  },
  rankingRight: {
    alignItems: 'flex-end',
  },
  rankingStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rankingStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalBody: {
    padding: 20,
  },
  searchSection: {
    marginBottom: 30,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  searchedUserCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchedUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchedUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  searchedUserDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  searchedUserCode: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  recommendationSection: {
    marginTop: 20,
  },
  recommendedUserCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  recommendedUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recommendedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  recommendedUserCode: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  recommendedUserStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statTextSmall: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  addButtonSmall: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonSmallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
