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
  const hasCheckedTutorial = useRef(false);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      // 이미 확인했거나 사용자가 없으면 스킵
      if (hasCheckedTutorial.current || !user) {
        if (!user) {
          setTutorialCompleted(null);
          setCheckingTutorial(false);
        }
        return;
      }

      try {
        const completed = await AsyncStorage.getItem('tutorialCompleted');
        const isCompleted = completed === 'true';
        setTutorialCompleted(isCompleted);
        hasCheckedTutorial.current = true;
      } catch (error) {
        console.error('Error checking tutorial status:', error);
        setTutorialCompleted(false);
        hasCheckedTutorial.current = true;
      } finally {
        setCheckingTutorial(false);
      }
    };

    checkTutorialStatus();
  }, [user]);

  // user가 변경되면 다시 확인하도록 리셋 (로그인/로그아웃 시)
  useEffect(() => {
    if (!user) {
      hasCheckedTutorial.current = false;
      setTutorialCompleted(null);
    }
  }, [user]);

  // user와 tutorialCompleted 상태에 따라 key를 변경하여 Navigator 재마운트
  const navigatorKey = user
    ? tutorialCompleted === true
      ? 'main'
      : tutorialCompleted === false
      ? 'tutorial'
      : 'loading'
    : 'auth';

  const initialRoute = user
    ? tutorialCompleted === true
      ? 'Main'
      : tutorialCompleted === false
      ? 'Tutorial'
      : null // 아직 확인 중이면 null (로딩 화면 표시)
    : 'Auth';

  // 로딩 중이거나 튜토리얼 상태 확인 중이거나 초기 라우트가 결정되지 않았으면 로딩
  if (isLoading || checkingTutorial || (user && initialRoute === null)) {
    // TODO: 로딩 화면 추가
    return null;
  }

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

