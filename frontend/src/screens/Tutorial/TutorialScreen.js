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
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [recommendedCert, setRecommendedCert] = useState(null);

  const companies = mockData.companies;
  const certifications = mockData.tutorialCertifications;

  // Step 1: 기업 선택
  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId);
  };

  const handleNextStep1 = () => {
    if (!selectedCompany) {
      Alert.alert('알림', '기업을 선택해주세요.');
      return;
    }
    setStep(2);
  };

  // Step 2: 자격증 선택
  const handleCertificationToggle = (certId) => {
    if (certId === 5) {
      // "모르겠습니다"는 단독 선택
      setSelectedCertifications([5]);
    } else {
      // 다른 자격증 선택 시 "모르겠습니다" 제거
      const filtered = selectedCertifications.filter((id) => id !== 5);
      if (filtered.includes(certId)) {
        setSelectedCertifications(filtered.filter((id) => id !== certId));
      } else {
        setSelectedCertifications([...filtered, certId]);
      }
    }
  };

  const handleNextStep2 = () => {
    if (selectedCertifications.length === 0) {
      Alert.alert('알림', '자격증을 선택해주세요.');
      return;
    }

    // Step 3 분기 처리
    const isCompanyUnknown = selectedCompany === 5;
    const isCertUnknown = selectedCertifications.includes(5);

    if (isCompanyUnknown && isCertUnknown) {
      // 자동 추천 화면으로
      setStep(3);
      loadRecommendedCertifications();
    } else {
      // Step 4로 바로 이동
      setStep(4);
    }
  };

  // Step 3: 자동 추천
  const loadRecommendedCertifications = () => {
    if (!user?.department || !user?.grade) return;

    const stats =
      mockData.departmentCertStats[user.department]?.[user.grade] || [];
    if (stats.length > 0) {
      setRecommendedCert(stats[0]); // 첫 번째 추천 자격증
    }
  };

  const handleRecommendedCertSelect = (certId) => {
    setRecommendedCert({ certificationId: certId });
    setStep(4);
  };

  // Step 4: 학습 시작
  const handleCompleteTutorial = async () => {
    try {
      // 튜토리얼 완료 여부 저장
      await AsyncStorage.setItem('tutorialCompleted', 'true');

      // 선택된 자격증을 주 학습 자격증으로 설정
      let mainCertId = null;
      if (step === 3 && recommendedCert) {
        mainCertId = recommendedCert.certificationId;
      } else if (selectedCertifications.length > 0 && !selectedCertifications.includes(5)) {
        mainCertId = selectedCertifications[0]; // 첫 번째 선택 자격증
      }

      if (mainCertId) {
        await AsyncStorage.setItem('mainCertificationId', mainCertId.toString());
      }

      // 홈 화면으로 이동
      navigation.navigate('Main');
    } catch (error) {
      console.error('Tutorial completion error:', error);
      Alert.alert('오류', '튜토리얼 완료 처리 중 오류가 발생했습니다.');
    }
  };

  // Step 1 렌더링
  const renderStep1 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>취업하고 싶은 기업이 있나요?</Text>
        <ScrollView style={styles.optionsContainer}>
          {companies.map((company) => (
            <TouchableOpacity
              key={company.id}
              style={[
                styles.optionButton,
                selectedCompany === company.id && styles.optionButtonSelected,
              ]}
              onPress={() => handleCompanySelect(company.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCompany === company.id && styles.optionTextSelected,
                ]}
              >
                {company.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep1}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Step 2 렌더링
  const renderStep2 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>
          관심 있거나 들어본 자격증이 있나요?
        </Text>
        <Text style={styles.subtitle}>복수 선택 가능</Text>
        <ScrollView style={styles.optionsContainer}>
          {certifications.map((cert) => (
            <TouchableOpacity
              key={cert.id}
              style={[
                styles.optionButton,
                selectedCertifications.includes(cert.id) &&
                  styles.optionButtonSelected,
              ]}
              onPress={() => handleCertificationToggle(cert.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCertifications.includes(cert.id) &&
                    styles.optionTextSelected,
                ]}
              >
                {cert.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep2}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Step 3 렌더링 (자동 추천)
  const renderStep3 = () => {
    const stats =
      mockData.departmentCertStats[user?.department]?.[user?.grade] || [];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>
          같은 학과 친구들은 이런 자격증을{'\n'}가장 많이 준비하고 있어요
        </Text>
        <ScrollView style={styles.optionsContainer}>
          {stats.map((stat) => (
            <TouchableOpacity
              key={stat.certificationId}
              style={[
                styles.recommendedOption,
                recommendedCert?.certificationId === stat.certificationId &&
                  styles.optionButtonSelected,
              ]}
              onPress={() => handleRecommendedCertSelect(stat.certificationId)}
            >
              <View style={styles.recommendedContent}>
                <Text
                  style={[
                    styles.recommendedName,
                    recommendedCert?.certificationId === stat.certificationId &&
                      styles.optionTextSelected,
                  ]}
                >
                  {stat.name}
                </Text>
                <Text style={styles.recommendedPercentage}>
                  {stat.percentage}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (recommendedCert) {
              setStep(4);
            } else {
              Alert.alert('알림', '자격증을 선택해주세요.');
            }
          }}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Step 4 렌더링 (학습 시작)
  const renderStep4 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.question}>학습을 시작해볼까요?</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            선택한 자격증의 플래시카드가{'\n'}자동으로 생성되었어요
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
          {step} / 4
        </Text>
      </View>
      <ScrollView style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
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
  recommendedOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  recommendedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  recommendedPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
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
