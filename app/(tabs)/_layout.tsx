import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { ScanLine, CalendarClock, HeartHandshake } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB', // Apple System Blue
        tabBarInactiveTintColor: '#94A3B8', // Slate 400
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 0,
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 6,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Quét Đơn',
          tabBarIcon: ({ color, size }) => (
            <ScanLine size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Lịch Uống',
          tabBarIcon: ({ color, size }) => (
            <CalendarClock size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Đồng Hành',
          tabBarIcon: ({ color, size }) => (
            <HeartHandshake size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
    </Tabs>
  );
}
