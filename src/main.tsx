import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initI18n } from './i18n'

const getInitialLanguage = (): string => {
  try {
    const savedSettings = localStorage.getItem('short_video_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return settings.preferences?.language || 'zh-CN';
    }
  } catch (e) {
    console.error('Failed to read initial language', e);
  }
  return 'zh-CN';
};

initI18n(getInitialLanguage());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
