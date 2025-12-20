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
          setTutorialCompleted(isCompleted);
          
          // 튜토리얼이 완료되었고 현재 Tutorial 화면에 있다면 Main으로 이동
          if (isCompleted && navigationRef.current) {
            navigationRef.current.navigate('Main');
          }
        } catch (error) {
          console.error('Error checking tutorial status:', error);
          setTutorialCompleted(false);
        }
      }
      setCheckingTutorial(false);
    };

    checkTutorialStatus();
  }, [user]);

  if (isLoading || checkingTutorial) {
    // TODO: 로딩 화면 추가
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          user
            ? tutorialCompleted
              ? 'Main'
              : 'Tutorial'
            : 'Auth'
        }
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

