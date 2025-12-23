import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { questionService } from '../../services/questionService';

export default function LearningScreen({ route, navigation }) {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  // 자격증 목록 및 학습률 로드
  const loadCertifications = async () => {
    try {
      setLoading(true);
      
      // 문제가 있는 자격증 목록 가져오기
      const availableCerts = await questionService.getAvailableCertifications();
      
      // 각 자격증의 학습률 조회
      const progressPromises = availableCerts.map(async (cert) => {
        const progress = await questionService.getCertificationProgress(
          cert.id,
          user?.id || 1
        );
        return { cert, progress };
      });
      
      const certsWithProgress = await Promise.all(progressPromises);
      
      setCertifications(availableCerts);
      
      // 학습률 맵 생성
      const progressObj = {};
      certsWithProgress.forEach(({ cert, progress }) => {
        progressObj[cert.id] = progress.progress;
      });
      setProgressMap(progressObj);
    } catch (error) {
      console.error('자격증 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 화면이 포커스될 때마다 자격증 목록 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadCertifications();
    }, [user?.id])
  );

  const handleSelectCertification = (cert) => {
    // 자격증 선택 시 일차별 선택 화면으로 이동
    navigation.navigate('DaySelect', {
      certificationId: cert.id,
      certificationName: cert.name,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>자격증 목록을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>학습할 자격증 선택</Text>
        <Text style={styles.subtitle}>
          자격증을 선택하여 학습을 시작하세요
        </Text>
        
        {certifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>학습 가능한 자격증이 없습니다.</Text>
          </View>
        ) : (
          <View style={styles.certList}>
            {certifications.map((cert) => {
              const progress = progressMap[cert.id] || 0;
              
              return (
                <TouchableOpacity
                  key={cert.id}
                  style={styles.certCard}
                  onPress={() => handleSelectCertification(cert)}
                  activeOpacity={0.7}
                >
                  <View style={styles.certCardContent}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { width: `${progress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{progress}%</Text>
                    </View>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  certList: {
    gap: 12,
  },
  certCard: {
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
  certCardContent: {
    flex: 1,
  },
  certName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    minWidth: 40,
    textAlign: 'right',
  },
  arrowContainer: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 24,
    color: '#C7C7CC',
    fontWeight: '300',
  },
});
