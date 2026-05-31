import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.tabBorder },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '내 팀',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="star.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: '오늘경기',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: '팀',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.number" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '선수',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: '메뉴',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="line.3.horizontal" color={color} />,
        }}
      />
      <Tabs.Screen name="explore"  options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
