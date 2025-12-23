import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockData } from '../../services/mockData';

export default function TutorialScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [acquiredCertifications, setAcquiredCertifications] = useState([]); // 취득한 자격증
  const [desiredCertifications, setDesiredCertifications] = useState([]); // 취득하고 싶은 자격증

  const certifications = mockData.tutorialCertifications;

  // Step 1: 취득한 자격증 선택
  const handleAcquiredCertToggle = (certId) => {
    if (certId === 14) {
      // "없음"은 단독 선택
      setAcquiredCertifications([14]);
    } else {
      // 다른 자격증 선택 시 "없음" 제거
      const filtered = acquiredCertifications.filter((id) => id !== 14);
      if (filtered.includes(certId)) {
        setAcquiredCertifications(filtered.filter((id) => id !== certId));
      } else {
        setAcquiredCertifications([...filtered, certId]);
      }
    }
  };

  const handleNextStep1 = () => {
    // "없음"을 선택하지 않았고 아무것도 선택하지 않은 경우
    if (acquiredCertifications.length === 0) {
      Alert.alert('알림', '취득한 자격증을 선택해주세요. (없으면 "없음" 선택)');
      return;
    }
    setStep(2);
  };

  // Step 2: 취득하고 싶은 자격증 선택
  const handleDesiredCertToggle = (certId) => {
    if (certId === 14) {
      // "없음"은 단독 선택
      setDesiredCertifications([14]);
    } else {
      // 다른 자격증 선택 시 "없음" 제거
      const filtered = desiredCertifications.filter((id) => id !== 14);
      if (filtered.includes(certId)) {
        setDesiredCertifications(filtered.filter((id) => id !== certId));
      } else {
        setDesiredCertifications([...filtered, certId]);
      }
    }
  };

  const handleNextStep2 = () => {
    // "없음"을 선택하지 않았고 아무것도 선택하지 않은 경우
    if (desiredCertifications.length === 0) {
      Alert.alert('알림', '취득하고 싶은 자격증을 선택해주세요. (없으면 "없음" 선택)');
      return;
    }
    setStep(3);
  };

  // Step 3: 학습 시작
  const handleCompleteTutorial = async () => {
    try {
      // 튜토리얼 완료 여부 저장
      await AsyncStorage.setItem('tutorialCompleted', 'true');

      // 취득한 자격증 저장 (없음 제외)
      const acquired = acquiredCertifications.filter(id => id !== 14);
      if (acquired.length > 0) {
        await AsyncStorage.setItem('acquiredCertifications', JSON.stringify(acquired));
      }

      // 취득하고 싶은 자격증 저장 (없음 제외)
      const desired = desiredCertifications.filter(id => id !== 14);
      if (desired.length > 0) {
        await AsyncStorage.setItem('desiredCertifications', JSON.stringify(desired));
        // 첫 번째 취득하고 싶은 자격증을 우선 표시용으로 저장
        await AsyncStorage.setItem('priorityCertificationId', desired[0].toString());
      }

      // 유저 정보에 취득한 자격증 동기화
      if (user?.id) {
        const users = await mockData.loadFromStorage(mockData.STORAGE_KEYS.USERS, mockData.users);
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex].certifications = acquired;
          await mockData.saveToStorage(mockData.STORAGE_KEYS.USERS, users);
          // AuthContext의 user 정보도 갱신
          await refreshUser();
        }
      }

      // 홈 화면으로 이동
      navigation.navigate('Main');
    } catch (error) {
      console.error('Tutorial completion error:', error);
      Alert.alert('오류', '튜토리얼 완료 처리 중 오류가 발생했습니다.');
    }
  };

  // Step 1 렌더링: 취득한 자격증 선택
  const renderStep1 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>이미 취득한 자격증이 있나요?</Text>
        <Text style={styles.subtitle}>복수 선택 가능</Text>
        <ScrollView style={styles.optionsContainer}>
          <View style={styles.gridContainer}>
            {certifications.map((cert) => (
              <TouchableOpacity
                key={cert.id}
                style={[
                  styles.certBox,
                  acquiredCertifications.includes(cert.id) &&
                    styles.certBoxSelected,
                ]}
                onPress={() => handleAcquiredCertToggle(cert.id)}
              >
                <Text
                  style={[
                    styles.certBoxText,
                    acquiredCertifications.includes(cert.id) &&
                      styles.certBoxTextSelected,
                  ]}
                >
                  {cert.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep1}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Step 2 렌더링: 취득하고 싶은 자격증 선택
  const renderStep2 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>
          취득하고 싶은 자격증이 있나요?
        </Text>
        <Text style={styles.subtitle}>복수 선택 가능</Text>
        <ScrollView style={styles.optionsContainer}>
          <View style={styles.gridContainer}>
            {certifications.map((cert) => (
              <TouchableOpacity
                key={cert.id}
                style={[
                  styles.certBox,
                  desiredCertifications.includes(cert.id) &&
                    styles.certBoxSelected,
                ]}
                onPress={() => handleDesiredCertToggle(cert.id)}
              >
                <Text
                  style={[
                    styles.certBoxText,
                    desiredCertifications.includes(cert.id) &&
                      styles.certBoxTextSelected,
                  ]}
                >
                  {cert.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep2}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Step 3 렌더링 (학습 시작)
  const renderStep3 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>학습을 시작해볼까요?</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            선택한 자격증의 문제를{'\n'}학습할 수 있어요
          </Text>
          <Text style={styles.infoSubtext}>
            하루 5~15분이면 충분해요
          </Text>
          <Text style={styles.infoSubtext}>
            첫 학습 완료 시 XP를 지급해드려요! 🎉
          </Text>
        </View>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteTutorial}
        >
          <Text style={styles.completeButtonText}>학습 시작하기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>
          {step} / 3
        </Text>
      </View>
      <ScrollView style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  stepIndicator: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  gridContainer: {
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
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 30,
    marginVertical: 30,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
