import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { ThemeMode } from '@/types';

export function useTheme() {
  const { settings } = useSettingsStore();
  const themeMode = settings.preferences.theme;
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
      if (mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return mode;
    };

    const theme = resolveTheme(themeMode);
    setResolvedTheme(theme);

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeMode]);

  return {
    theme: resolvedTheme,
    isDark: resolvedTheme === 'dark',
  };
}
