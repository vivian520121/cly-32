import { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { i18n } from '@/i18n';

export function useLanguage() {
  const { settings } = useSettingsStore();
  const language = settings.preferences.language;

  useEffect(() => {
    if (i18n.isInitialized && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    isInitialized: i18n.isInitialized,
  };
}
