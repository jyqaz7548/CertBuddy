import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import TutorialScreen from './src/screens/Tutorial/TutorialScreen';
import { AuthProvider, useAuth } from './src/store/AuthContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();
  const [tutorialCompleted, setTutorialCompleted] = useState(null);
  const [checkingTutorial, setCheckingTutorial] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      if (user) {
        try {
          const completed = await AsyncStorage.getItem('tutorialCompleted');
          const isCompleted = completed === 'true';
          console.log('[Tutorial] 튜토리얼 상태 확인:', {
            completed,
            isCompleted,
            userId: user?.id,
            userName: user?.name
          });
          setTutorialCompleted(isCompleted);
          
          // 튜토리얼이 완료되었고 현재 Tutorial 화면에 있다면 Main으로 이동
          if (isCompleted && navigationRef.current) {
            navigationRef.current.navigate('Main');
          }
        } catch (error) {
          console.error('Error checking tutorial status:', error);
          setTutorialCompleted(false);
        }
      } else {
        console.log('[Tutorial] 사용자 없음, 인증 화면으로');
      }
      setCheckingTutorial(false);
    };

    checkTutorialStatus();
  }, [user]);

  if (isLoading || checkingTutorial) {
    // TODO: 로딩 화면 추가
    return null;
  }

  // user와 tutorialCompleted 상태에 따라 key를 변경하여 Navigator 재마운트
  const navigatorKey = user
    ? tutorialCompleted
      ? 'main'
      : 'tutorial'
    : 'auth';

  const initialRoute = user
    ? tutorialCompleted
      ? 'Main'
      : 'Tutorial'
    : 'Auth';

  console.log('[Navigation] Navigator 상태:', {
    navigatorKey,
    initialRoute,
    hasUser: !!user,
    tutorialCompleted
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        key={navigatorKey}
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        {user ? (
          <>
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
            <Stack.Screen name="Main" component={MainNavigator} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}

