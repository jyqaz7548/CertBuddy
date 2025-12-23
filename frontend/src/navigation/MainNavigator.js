import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/HomeScreen';
import LearningScreen from '../screens/Learning/LearningScreen';
import DaySelectScreen from '../screens/Learning/DaySelectScreen';
import QuestionScreen from '../screens/Learning/QuestionScreen';
import XpResultScreen from '../screens/Learning/XpResultScreen';
import ReviewNeededScreen from '../screens/Learning/ReviewNeededScreen';
import FriendsScreen from '../screens/Friends/FriendsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ title: '홈' }}
      />
      <Stack.Screen 
        name="DaySelect" 
        component={DaySelectScreen}
        options={{ title: '일차 선택' }}
      />
      <Stack.Screen 
        name="Question" 
        component={QuestionScreen}
        options={{ title: '문제 풀이' }}
      />
      <Stack.Screen 
        name="XpResult" 
        component={XpResultScreen}
        options={{ title: '학습 완료', headerShown: false }}
      />
      <Stack.Screen 
        name="ReviewNeeded" 
        component={ReviewNeededScreen}
        options={{ title: '복습 필요', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function LearningStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LearningMain" 
        component={LearningScreen}
        options={{ title: '학습' }}
      />
      <Stack.Screen 
        name="DaySelect" 
        component={DaySelectScreen}
        options={{ title: '일차 선택' }}
      />
      <Stack.Screen 
        name="Question" 
        component={QuestionScreen}
        options={{ title: '문제 풀이' }}
      />
      <Stack.Screen 
        name="XpResult" 
        component={XpResultScreen}
        options={{ title: '학습 완료', headerShown: false }}
      />
      <Stack.Screen 
        name="ReviewNeeded" 
        component={ReviewNeededScreen}
        options={{ title: '복습 필요', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ 
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Learning" 
        component={LearningStack}
        options={{ 
          title: '학습',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ 
          title: '친구',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: '마이페이지',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

