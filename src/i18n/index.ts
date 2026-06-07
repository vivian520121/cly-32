import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { zhCN } from './locales/zh-CN';
import { enUS } from './locales/en-US';
import { jaJP } from './locales/ja-JP';

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
  'ja-JP': {
    translation: jaJP,
  },
};

export const initI18n = (language: string = 'zh-CN') => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'zh-CN',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export { i18n };
