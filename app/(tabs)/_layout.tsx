import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, FileText, Bot } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB', // Electric Medical Blue
        tabBarInactiveTintColor: '#94A3B8', // Slate 400
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 8,
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 10,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang Chủ',
          tabBarIcon: ({ color, size }) => (
            <Home size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Bản Dịch',
          tabBarIcon: ({ color, size }) => (
            <FileText size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Bác Sĩ AI',
          tabBarIcon: ({ color, size }) => (
            <Bot size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
    </Tabs>
  );
}
