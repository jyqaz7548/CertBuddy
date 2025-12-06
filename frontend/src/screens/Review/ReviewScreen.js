import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>복습 모드</Text>
      <Text style={styles.subtitle}>복습이 필요한 카드들을 학습하세요</Text>
      {/* TODO: 복습 카드 리스트 구현 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

