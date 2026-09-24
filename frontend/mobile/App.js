import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import DcrScreen from './src/screens/DcrScreen';
import OrderScreen from './src/screens/OrderScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

function TabBarIcon({ emoji }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            backgroundColor: '#ffffff',
            borderTopColor: colors.border
          },
          headerStyle: {
            backgroundColor: colors.primary
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '800'
          }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Alleviare SFA',
            tabBarLabel: 'Home',
            tabBarIcon: () => <TabBarIcon emoji="🏠" />
          }}
        />
        <Tab.Screen
          name="DCR"
          component={DcrScreen}
          options={{
            title: 'Field Visit (DCR)',
            tabBarLabel: 'DCR Call',
            tabBarIcon: () => <TabBarIcon emoji="📝" />
          }}
        />
        <Tab.Screen
          name="Orders"
          component={OrderScreen}
          options={{
            title: 'POB Order Booking',
            tabBarLabel: 'POB Order',
            tabBarIcon: () => <TabBarIcon emoji="🛒" />
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpenseScreen}
          options={{
            title: 'TA / DA Expense Claim',
            tabBarLabel: 'Expense',
            tabBarIcon: () => <TabBarIcon emoji="💳" />
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'MR Profile & Targets',
            tabBarLabel: 'Profile',
            tabBarIcon: () => <TabBarIcon emoji="👤" />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
