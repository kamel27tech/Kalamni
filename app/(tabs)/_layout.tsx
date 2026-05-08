import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.primary.surface,
        tabBarInactiveTintColor: Colors.icon.disabled,
        tabBarStyle: {
          backgroundColor: Colors.surface.subtle,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.07,
          shadowRadius: 3,
          elevation: 4,
          paddingTop: 12,
          paddingBottom: 20,
          height: 81,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'IBMPlexSansArabic-Medium',
          marginTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="live-class"
        options={{
          title: 'Live Class',
          tabBarIcon: ({ color }) => <Icon name="live_tv" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Icon name="explore" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-tutor"
        options={{
          title: 'AI Tutor',
          tabBarIcon: ({ color }) => <Icon name="smart_toy" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
