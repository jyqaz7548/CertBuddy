import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home/HomeScreen';
import LearningScreen from '../screens/Learning/LearningScreen';
import ReviewScreen from '../screens/Review/ReviewScreen';
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
        options={{ title: '홈' }}
      />
      <Tab.Screen 
        name="Learning" 
        component={LearningStack}
        options={{ title: '학습' }}
      />
      <Tab.Screen 
        name="Review" 
        component={ReviewScreen}
        options={{ title: '복습' }}
      />
      <Tab.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ title: '친구' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: '마이페이지' }}
      />
    </Tab.Navigator>
  );
}

