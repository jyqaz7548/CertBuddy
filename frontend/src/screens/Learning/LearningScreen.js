import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LearningScreen() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // TODO: 실제 카드 데이터로 교체
  const cards = [
    {
      id: 1,
      front: '정보처리기사',
      back: '정보처리 관련 지식과 기술을 검정하는 국가기술자격증',
    },
    {
      id: 2,
      front: 'SQL이란?',
      back: 'Structured Query Language의 약자로, 데이터베이스 관리 시스템에서 데이터를 조회하고 조작하는 언어',
    },
  ];

  const currentCard = cards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleAddToReview = () => {
    // TODO: 복습 리스트에 추가
    handleNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, isFlipped && styles.cardFlipped]}
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          <Text style={styles.cardText}>
            {isFlipped ? currentCard.back : currentCard.front}
          </Text>
          <Text style={styles.flipHint}>탭하여 뒤집기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.reviewButton]}
          onPress={handleAddToReview}
        >
          <Text style={styles.buttonText}>복습하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.progress}>
        {currentCardIndex + 1} / {cards.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardFlipped: {
    backgroundColor: '#007AFF',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  flipHint: {
    marginTop: 20,
    fontSize: 14,
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButton: {
    backgroundColor: '#FF9500',
  },
  nextButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progress: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E93',
  },
});

