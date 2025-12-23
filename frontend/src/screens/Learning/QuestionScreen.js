import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { questionService } from '../../services/questionService';
import { useAuth } from '../../store/AuthContext';
import XpResultScreen from '../Learning/XpResultScreen';

export default function QuestionScreen({ route, navigation }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 문제 세션 시작
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 복습 모드인지 확인
        const isReviewMode = route?.params?.isReview === true;
        
        if (isReviewMode) {
          // 복습 세션 시작
          const reviewCertId = route?.params?.certificationId || null;
          const session = await questionService.startReviewSession(
            user?.id || 1,
            reviewCertId
          );
          setQuestions(session.questions || []);
          setSessionId(session.sessionId);
        } else {
          // 일반 학습 세션 시작
          const certificationId = route?.params?.certificationId || 1;
          const specificDay = route?.params?.specificDay; // 특정 일차 지정 (선택)
          const isRelearning = route?.params?.isRelearning === true; // 재학습 모드 (명시적으로 true인지 확인)
          
          console.log('QuestionScreen - route.params:', route?.params);
          console.log('QuestionScreen - isRelearning:', isRelearning, 'type:', typeof route?.params?.isRelearning);
          console.log('QuestionScreen - certificationId:', certificationId, 'specificDay:', specificDay);
          
          const session = await questionService.startQuestionSession(
            certificationId,
            user?.id || 1,
            specificDay,
            isRelearning
          );
          setQuestions(session.questions || []);
          setSessionId(session.sessionId);
        }
      } catch (error) {
        console.error('문제 로딩 실패:', error);
        // 에러 메시지 저장
        setError(error.message || '문제를 불러오는데 실패했습니다.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [route?.params?.isReview, route?.params?.certificationId, route?.params?.specificDay, route?.params?.isRelearning, user?.id]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  
  // 실시간 예상 XP 계산
  const calculateExpectedXp = () => {
    if (questions.length === 0) return 0;
    
    const isReviewMode = route?.params?.isReview || false;
    const answeredCount = results.length;
    const correctCount = results.filter(r => r.isCorrect).length;
    const wrongCount = answeredCount - correctCount;
    const remainingCount = questions.length - answeredCount;
    
    // 현재까지의 XP
    const baseXp = questions.length * 10;
    
    if (isReviewMode) {
      // 복습 모드: 문제당 5XP (일반 학습의 절반), 틀린 문제당 5XP 차감
      const reviewBaseXp = questions.length * 5;
      const penaltyXp = wrongCount * 5;
      const currentXp = Math.max(0, reviewBaseXp - penaltyXp);
      
      // 남은 문제를 모두 맞춘다고 가정
      const bestCaseXp = currentXp;
      // 남은 문제를 모두 틀린다고 가정
      const worstCaseXp = Math.max(0, reviewBaseXp - (wrongCount + remainingCount) * 5);
      
      return {
        current: currentXp,
        best: bestCaseXp,
        worst: worstCaseXp,
        answered: answeredCount,
        correct: correctCount,
        wrong: wrongCount,
      };
    } else {
      // 일반 학습 모드: 틀린 문제당 10XP 차감 (문제당 XP 전체 차감)
      const penaltyXp = wrongCount * 10;
      const currentXp = Math.max(0, baseXp - penaltyXp);
      
      // 남은 문제를 모두 맞춘다고 가정
      const bestCaseXp = currentXp;
      // 남은 문제를 모두 틀린다고 가정
      const worstCaseXp = Math.max(0, baseXp - (wrongCount + remainingCount) * 10);
      
      return {
        current: currentXp,
        best: bestCaseXp,
        worst: worstCaseXp,
        answered: answeredCount,
        correct: correctCount,
        wrong: wrongCount,
      };
    }
  };
  
  const expectedXp = calculateExpectedXp();

  const handleAnswerSelect = async (choice) => {
    if (showExplanation) return; // 이미 정답을 확인한 경우 무시
    
    const isCorrect = choice === currentQuestion.answer;
    setSelectedAnswer(choice);
    setShowExplanation(true);

    const isReviewMode = route?.params?.isReview || false;

    // 답안 제출 (백엔드에 저장)
    if (sessionId) {
      try {
        if (isReviewMode) {
          // 복습 모드: 복습 문제 완료 처리
          await questionService.completeReviewQuestion(
            user?.id || 1,
            currentQuestion.id,
            isCorrect
          );
        } else {
          // 일반 학습 모드: 답안 제출
          const isRelearning = route?.params?.isRelearning === true;
          
          await questionService.submitAnswer(
            sessionId,
            currentQuestion.id,
            choice,
            isCorrect
          );
          
          // 틀린 문제는 복습 리스트에 추가 (재학습 모드가 아닐 때만)
          if (!isCorrect && !isRelearning) {
            try {
              const certificationId = route?.params?.certificationId || currentQuestion.certificationId;
              await questionService.addReviewQuestion(
                user?.id || 1,
                currentQuestion.id,
                certificationId
              );
            } catch (error) {
              console.error('복습 리스트 추가 실패:', error);
            }
          }
        }
        
        // 결과 저장
        setResults(prev => [...prev, {
          questionId: currentQuestion.id,
          selectedAnswer: choice,
          isCorrect,
        }]);
      } catch (error) {
        console.error('답안 제출 실패:', error);
      }
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      const isReviewMode = route?.params?.isReview || false;
      const isRelearning = route?.params?.isRelearning === true;
      
      // 학습/복습 완료 처리
      if (sessionId && results.length > 0) {
        try {
          const correctAnswers = results.filter(r => r.isCorrect).length;
          const allWrong = correctAnswers === 0; // 모두 틀렸는지 확인
          
          // 모두 틀렸으면 복습 필요 화면으로 이동
          if (allWrong) {
            // 일반 학습 모드에서 모두 틀렸을 때 복습 리스트에 모든 문제 추가 (재학습 모드가 아닐 때만)
            if (!isReviewMode && !isRelearning) {
              try {
                const certificationId = route?.params?.certificationId;
                if (certificationId) {
                  for (const result of results) {
                    await questionService.addReviewQuestion(
                      user?.id || 1,
                      result.questionId,
                      certificationId
                    );
                  }
                }
              } catch (error) {
                console.error('복습 리스트 추가 실패:', error);
              }
            }
            
            navigation.replace('ReviewNeeded', {
              isReview: isReviewMode,
            });
            return;
          }
          
          let completionResult;
          if (isReviewMode) {
            // 복습 세션 완료 (보너스 XP 지급)
            completionResult = await questionService.completeReviewSession(
              sessionId,
              results,
              user?.id || 1
            );
          } else {
            // 일반 학습 세션 완료
            completionResult = await questionService.completeQuestionSession(
              sessionId,
              results,
              user?.id || 1
            );
          }
          
          // XP 결과 화면으로 이동
          navigation.replace('XpResult', {
            isReview: isReviewMode,
            totalQuestions: completionResult.totalQuestions || results.length,
            correctAnswers: completionResult.correctAnswers || results.filter(r => r.isCorrect).length,
            wrongAnswers: completionResult.wrongAnswers || results.filter(r => !r.isCorrect).length,
            xpEarned: completionResult.xpEarned || 0,
            bonusXp: 0, // 복습 모드에서는 xpEarned만 사용
            todayMaxXp: 0, // 더 이상 사용하지 않음
          });
        } catch (error) {
          console.error('완료 처리 실패:', error);
          navigation.goBack();
        }
      } else {
        navigation.goBack();
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>문제를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0 || error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            {error || '문제를 불러올 수 없습니다.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.retryButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'OX':
        return 'O/X 문제';
      case 'BLANK':
        return '빈칸 채우기';
      case 'ORDER':
        return '순서 문제';
      default:
        return '문제';
    }
  };

  const getButtonStyle = (choice) => {
    if (!showExplanation) {
      return selectedAnswer === choice ? styles.choiceButtonSelected : styles.choiceButton;
    }

    // 정답 확인 후 스타일
    if (choice === currentQuestion.answer) {
      return styles.choiceButtonCorrect;
    }
    if (selectedAnswer === choice && choice !== currentQuestion.answer) {
      return styles.choiceButtonWrong;
    }
    return styles.choiceButton;
  };

  const getButtonTextStyle = (choice) => {
    if (!showExplanation) {
      return styles.choiceButtonText;
    }

    if (choice === currentQuestion.answer) {
      return styles.choiceButtonTextCorrect;
    }
    if (selectedAnswer === choice && choice !== currentQuestion.answer) {
      return styles.choiceButtonTextWrong;
    }
    return styles.choiceButtonText;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.progress}>
            {currentIndex + 1} / {questions.length}
          </Text>
          {!route?.params?.isReview && expectedXp.answered > 0 && (
            <View style={styles.xpPreview}>
              <Text style={styles.xpPreviewLabel}>예상 XP</Text>
              <Text style={styles.xpPreviewValue}>
                {expectedXp.current}XP
              </Text>
            </View>
          )}
        </View>
        <View style={styles.typeContainer}>
          <Text style={styles.typeLabel}>{getTypeLabel(currentQuestion.type)}</Text>
          {currentQuestion.source === 'REAL_CBT' && (
            <View style={styles.realCbtBadge}>
              <Text style={styles.realCbtText}>실전 기출 문제</Text>
              {currentQuestion.examInfo.year && (
                <Text style={styles.examInfo}>
                  {currentQuestion.examInfo.year}년 {currentQuestion.examInfo.round}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 문제 본문 */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* 선택지 */}
        <View style={styles.choicesContainer}>
          {currentQuestion.choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={getButtonStyle(choice)}
              onPress={() => handleAnswerSelect(choice)}
              disabled={showExplanation}
              activeOpacity={0.7}
            >
              <Text style={getButtonTextStyle(choice)}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 해설 */}
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>해설</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !showExplanation && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!showExplanation}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? '학습 완료' : '다음 문제'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  xpPreview: {
    alignItems: 'flex-end',
  },
  xpPreviewLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 2,
  },
  xpPreviewValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  typeLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 12,
  },
  realCbtBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  realCbtText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  examInfo: {
    color: '#fff',
    fontSize: 11,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#000',
  },
  choicesContainer: {
    gap: 12,
    marginBottom: 20,
  },
  choiceButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: '#E3F2FD',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  choiceButtonCorrect: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#34C759',
    alignItems: 'center',
  },
  choiceButtonWrong: {
    backgroundColor: '#FFEBEE',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF3B30',
    alignItems: 'center',
  },
  choiceButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  choiceButtonTextCorrect: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
  },
  choiceButtonTextWrong: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

