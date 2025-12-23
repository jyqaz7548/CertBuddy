import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockData } from '../../services/mockData';

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [acquiredCerts, setAcquiredCerts] = useState([]);
  const [desiredCerts, setDesiredCerts] = useState([]);
  const [acquiredCertIds, setAcquiredCertIds] = useState([]);
  const [desiredCertIds, setDesiredCertIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCode, setUserCode] = useState('');
  const [showAddAcquiredModal, setShowAddAcquiredModal] = useState(false);
  const [showAddDesiredModal, setShowAddDesiredModal] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState([]);

  // 취득한 자격증 및 희망 자격증 로드
  const loadCertifications = async () => {
    try {
      setLoading(true);
      
      // AsyncStorage에서 취득/희망 자격증 가져오기
      const acquiredJson = await AsyncStorage.getItem('acquiredCertifications');
      const desiredJson = await AsyncStorage.getItem('desiredCertifications');
      
      const acquired = acquiredJson ? JSON.parse(acquiredJson) : [];
      const desired = desiredJson ? JSON.parse(desiredJson) : [];
      
      setAcquiredCertIds(acquired);
      setDesiredCertIds(desired);
      
      // 자격증 ID를 이름으로 변환
      const certMap = {};
      const tutorialCerts = mockData.tutorialCertifications || mockData.mockTutorialCertifications || [];
      tutorialCerts.forEach(cert => {
        certMap[cert.id] = cert.name;
      });
      
      // 취득한 자격증 이름 변환 (없음, 기타 제외)
      const acquiredNames = acquired
        .map(id => {
          const name = certMap[id];
          return name && name !== '없음' && name !== '기타' ? name : null;
        })
        .filter(name => name !== null);
      
      // 취득하고 싶은 자격증 이름 변환 (없음, 기타 제외)
      const desiredNames = desired
        .map(id => {
          const name = certMap[id];
          return name && name !== '없음' && name !== '기타' ? name : null;
        })
        .filter(name => name !== null);
      
      setAcquiredCerts(acquiredNames);
      setDesiredCerts(desiredNames);
      
      // 사용자 코드 가져오기
      if (user?.userCode) {
        setUserCode(user.userCode);
      } else if (user?.id) {
        const paddedId = String(user.id).padStart(4, '0');
        setUserCode(`CERT-${paddedId}`);
      }
    } catch (error) {
      console.error('자격증 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 화면이 포커스될 때마다 데이터 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadCertifications();
      refreshUser();
    }, [user?.id])
  );

  // 로그아웃 확인
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  // 고유 코드 복사
  const handleCopyCode = () => {
    // React Native에서는 Clipboard API 사용
    Alert.alert('고유 코드', `내 고유 코드: ${userCode}\n\n친구에게 공유하세요!`);
  };

  // 취득한 자격증 추가 모달 열기
  const handleAddAcquired = () => {
    setSelectedCerts([...acquiredCertIds]);
    setShowAddAcquiredModal(true);
  };

  // 취득하고 싶은 자격증 추가 모달 열기
  const handleAddDesired = () => {
    setSelectedCerts([...desiredCertIds]);
    setShowAddDesiredModal(true);
  };

  // 자격증 선택 토글
  const handleCertToggle = (certId) => {
    if (certId === 14) {
      // "없음" 선택 시 다른 선택 모두 해제
      setSelectedCerts([14]);
    } else {
      // "없음" 제거하고 선택/해제
      const filtered = selectedCerts.filter(id => id !== 14);
      if (filtered.includes(certId)) {
        setSelectedCerts(filtered.filter(id => id !== certId));
      } else {
        setSelectedCerts([...filtered, certId]);
      }
    }
  };

  // 취득한 자격증 저장
  const handleSaveAcquired = async () => {
    try {
      const filtered = selectedCerts.filter(id => id !== 14);
      if (filtered.length > 0) {
        await AsyncStorage.setItem('acquiredCertifications', JSON.stringify(filtered));
      } else {
        await AsyncStorage.removeItem('acquiredCertifications');
      }
      setShowAddAcquiredModal(false);
      loadCertifications();
    } catch (error) {
      Alert.alert('오류', '자격증 저장에 실패했습니다.');
    }
  };

  // 취득하고 싶은 자격증 저장
  const handleSaveDesired = async () => {
    try {
      const filtered = selectedCerts.filter(id => id !== 14);
      if (filtered.length > 0) {
        await AsyncStorage.setItem('desiredCertifications', JSON.stringify(filtered));
      } else {
        await AsyncStorage.removeItem('desiredCertifications');
      }
      setShowAddDesiredModal(false);
      loadCertifications();
    } catch (error) {
      Alert.alert('오류', '자격증 저장에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 프로필 헤더 */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || '사용자').charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || '사용자'}</Text>
        <Text style={styles.info}>
          {user?.school} {user?.department} {user?.grade}학년
        </Text>
        <TouchableOpacity
          style={styles.codeButton}
          onPress={handleCopyCode}
        >
          <Ionicons name="copy-outline" size={16} color="#007AFF" />
          <Text style={styles.codeText}>{userCode}</Text>
        </TouchableOpacity>
      </View>

      {/* 통계 섹션 */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
          </View>
          <Text style={styles.statValue}>{user?.totalXp?.toLocaleString() || 0}</Text>
          <Text style={styles.statLabel}>총 XP</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="flame" size={24} color="#FF6B6B" />
          </View>
          <Text style={styles.statValue}>{user?.streak || 0}</Text>
          <Text style={styles.statLabel}>연속 학습</Text>
        </View>
      </View>

      {/* 취득한 자격증 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.sectionTitle}>취득한 자격증</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAcquired}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>추가하기</Text>
          </TouchableOpacity>
        </View>
        {acquiredCerts.length > 0 ? (
          <View style={styles.certList}>
            {acquiredCerts.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>취득한 자격증이 없습니다</Text>
        )}
      </View>

      {/* 취득하고 싶은 자격증 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>취득하고 싶은 자격증</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddDesired}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>추가하기</Text>
          </TouchableOpacity>
        </View>
        {desiredCerts.length > 0 ? (
          <View style={styles.certList}>
            {desiredCerts.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>취득하고 싶은 자격증이 없습니다</Text>
        )}
      </View>

      {/* 취득한 자격증 추가 모달 */}
      <Modal
        visible={showAddAcquiredModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddAcquiredModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>취득한 자격증 선택</Text>
              <TouchableOpacity onPress={() => setShowAddAcquiredModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.certGrid}>
                {(mockData.tutorialCertifications || []).map((cert) => (
                  <TouchableOpacity
                    key={cert.id}
                    style={[
                      styles.certBox,
                      selectedCerts.includes(cert.id) && styles.certBoxSelected,
                    ]}
                    onPress={() => handleCertToggle(cert.id)}
                  >
                    <Text
                      style={[
                        styles.certBoxText,
                        selectedCerts.includes(cert.id) && styles.certBoxTextSelected,
                      ]}
                    >
                      {cert.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAcquired}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 취득하고 싶은 자격증 추가 모달 */}
      <Modal
        visible={showAddDesiredModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddDesiredModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>취득하고 싶은 자격증 선택</Text>
              <TouchableOpacity onPress={() => setShowAddDesiredModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>복수 선택 가능</Text>
              <View style={styles.certGrid}>
                {(mockData.tutorialCertifications || []).map((cert) => (
                  <TouchableOpacity
                    key={cert.id}
                    style={[
                      styles.certBox,
                      selectedCerts.includes(cert.id) && styles.certBoxSelected,
                    ]}
                    onPress={() => handleCertToggle(cert.id)}
                  >
                    <Text
                      style={[
                        styles.certBoxText,
                        selectedCerts.includes(cert.id) && styles.certBoxTextSelected,
                      ]}
                    >
                      {cert.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveDesired}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 설정 메뉴 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={20} color="#000" />
          <Text style={styles.menuText}>알림 설정</Text>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={20} color="#000" />
          <Text style={styles.menuText}>계정 설정</Text>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={20} color="#000" />
          <Text style={styles.menuText}>도움말</Text>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CertBuddy v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
  },
  certList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certItem: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  certText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
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
    maxHeight: 500,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  certGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  certBox: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  certBoxSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  certBoxText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  certBoxTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
