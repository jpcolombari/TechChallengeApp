import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { MainTabParamList } from './AppRoutes';

import { HomeScreen } from '../screens/App/HomeScreen';
import { AdminDashboardScreen } from '../screens/App/AdminDashboardScreen';
import { ProfileScreen } from '../screens/App/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Feed') iconName = 'newspaper';
          if (route.name === 'AdminDashboard') iconName = 'grid';
          if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Feed" 
        component={HomeScreen} 
        options={{ title: 'Postagens' }}
      />

      {user?.role === 'PROFESSOR' && (
        <Tab.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={{ title: 'Admin' }}
        />
      )}

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Meu Perfil' }}
      />
    </Tab.Navigator>
  );
}