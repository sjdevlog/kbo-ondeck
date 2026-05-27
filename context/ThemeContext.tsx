import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppColors = {
  bg: string;
  card: string;
  border: string;
  text: string;
  textSub: string;
  textMuted: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  rowAlt: string;
  accent: string;
  win: string;
  lose: string;
  tabBar: string;
  tabBorder: string;
  inputBg: string;
};

const light: AppColors = {
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textSub: '#334155',
  textMuted: '#94a3b8',
  tableHeaderBg: '#f1f5f9',
  tableHeaderText: '#475569',
  rowAlt: '#f8fafc',
  accent: '#2563eb',
  win: '#16a34a',
  lose: '#dc2626',
  tabBar: '#ffffff',
  tabBorder: '#e2e8f0',
  inputBg: '#f1f5f9',
};

const dark: AppColors = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  text: '#f8fafc',
  textSub: '#cbd5e1',
  textMuted: '#64748b',
  tableHeaderBg: '#1e293b',
  tableHeaderText: '#94a3b8',
  rowAlt: '#0c1829',
  accent: '#3b82f6',
  win: '#4ade80',
  lose: '#f87171',
  tabBar: '#0f172a',
  tabBorder: '#1e293b',
  inputBg: '#0f172a',
};

type ThemeCtx = {
  isDark: boolean;
  colors: AppColors;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx>({ isDark: false, colors: light, toggle: () => {} });

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('app_theme').then((v) => {
      if (v === 'dark') setIsDark(true);
    });
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem('app_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const value = useMemo(() => ({ isDark, colors: isDark ? dark : light, toggle }), [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useAppTheme = () => useContext(ThemeContext);
