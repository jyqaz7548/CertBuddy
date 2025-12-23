import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LearningScreen({ route, navigation }) {
  // route.params에서 certificationId를 받거나 기본값 사용
  const certificationId = route?.params?.certificationId || 2; // 기본값: 전기기능사
  
  const handleStartLearning = () => {
    // 문제 풀이 화면으로 이동
    // certificationId: 2 = 전기기능사, 7 = 정보처리기능사
    navigation.navigate('Question', {
      certificationId: certificationId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>학습 시작하기</Text>
        <Text style={styles.subtitle}>
          객관식 문제를 풀며 자격증을 준비하세요
        </Text>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartLearning}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>문제 풀이 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

