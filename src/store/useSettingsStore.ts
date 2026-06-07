import { create } from 'zustand';
import type {
  SettingsStore,
  Settings,
  AccountSettings,
  AppPreferences,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  SettingsValidationError,
} from '../types';
import {
  getSettings,
  saveSettings,
  resetSettings,
  exportSettings as exportSettingsUtil,
  importSettings as importSettingsUtil,
} from '../utils/storage';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

const validateNickname = (nickname: string): boolean => {
  return nickname.length >= 1 && nickname.length <= 30;
};

const validateBio = (bio: string): boolean => {
  return bio.length <= 200;
};

const validateVolume = (volume: number): boolean => {
  return volume >= 0 && volume <= 100;
};

const validatePlaybackSpeed = (speed: number): boolean => {
  return speed >= 0.25 && speed <= 3;
};

const validateTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: getSettings(),
  isLoading: false,
  isSaving: false,
  errors: [],
  activeCategory: 'account',
  saveSuccess: false,
  lastSaved: null,

  initSettings: () => {
    set({ settings: getSettings(), isLoading: false });
  },

  validateField: (field: string, value: unknown): SettingsValidationError | null => {
    switch (field) {
      case 'email':
        if (typeof value === 'string' && value && !validateEmail(value)) {
          return { field, message: '请输入有效的邮箱地址' };
        }
        break;
      case 'phone':
        if (typeof value === 'string' && value && !validatePhone(value)) {
          return { field, message: '请输入有效的手机号码' };
        }
        break;
      case 'username':
        if (typeof value === 'string' && !validateUsername(value)) {
          return { field, message: '用户名长度必须在3-20个字符之间' };
        }
        break;
      case 'nickname':
        if (typeof value === 'string' && !validateNickname(value)) {
          return { field, message: '昵称长度必须在1-30个字符之间' };
        }
        break;
      case 'bio':
        if (typeof value === 'string' && !validateBio(value)) {
          return { field, message: '个人简介不能超过200个字符' };
        }
        break;
      case 'volume':
        if (typeof value === 'number' && !validateVolume(value)) {
          return { field, message: '音量必须在0-100之间' };
        }
        break;
      case 'playbackSpeed':
        if (typeof value === 'number' && !validatePlaybackSpeed(value)) {
          return { field, message: '播放速度必须在0.25-3之间' };
        }
        break;
      case 'quietHoursStart':
      case 'quietHoursEnd':
        if (typeof value === 'string' && value && !validateTime(value)) {
          return { field, message: '请输入有效的时间格式 (HH:MM)' };
        }
        break;
    }
    return null;
  },

  clearErrors: () => set({ errors: [] }),

  updateAccountSettings: async (updates: Partial<AccountSettings>): Promise<boolean> => {
    set({ isSaving: true, errors: [], saveSuccess: false });

    const errors: SettingsValidationError[] = [];

    for (const [field, value] of Object.entries(updates)) {
      const error = get().validateField(field, value);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      set({ errors, isSaving: false });
      return false;
    }

    try {
      const currentSettings = get().settings;
      const newSettings: Settings = {
        ...currentSettings,
        account: { ...currentSettings.account, ...updates },
        updatedAt: Date.now(),
      };

      saveSettings(newSettings);
      set({
        settings: newSettings,
        isSaving: false,
        saveSuccess: true,
        lastSaved: Date.now(),
      });

      setTimeout(() => set({ saveSuccess: false }), 3000);
      return true;
    } catch (e) {
      console.error('Failed to update account settings', e);
      set({
        isSaving: false,
        errors: [{ field: 'general', message: '保存失败，请重试' }],
      });
      return false;
    }
  },

  updatePreferences: async (updates: Partial<AppPreferences>): Promise<boolean> => {
    set({ isSaving: true, errors: [], saveSuccess: false });

    const errors: SettingsValidationError[] = [];

    for (const [field, value] of Object.entries(updates)) {
      const error = get().validateField(field, value);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      set({ errors, isSaving: false });
      return false;
    }

    try {
      const currentSettings = get().settings;
      const newSettings: Settings = {
        ...currentSettings,
        preferences: { ...currentSettings.preferences, ...updates },
        updatedAt: Date.now(),
      };

      saveSettings(newSettings);
      set({
        settings: newSettings,
        isSaving: false,
        saveSuccess: true,
        lastSaved: Date.now(),
      });

      setTimeout(() => set({ saveSuccess: false }), 3000);
      return true;
    } catch (e) {
      console.error('Failed to update preferences', e);
      set({
        isSaving: false,
        errors: [{ field: 'general', message: '保存失败，请重试' }],
      });
      return false;
    }
  },

  updateNotificationSettings: async (updates: Partial<NotificationSettings>): Promise<boolean> => {
    set({ isSaving: true, errors: [], saveSuccess: false });

    const errors: SettingsValidationError[] = [];

    for (const [field, value] of Object.entries(updates)) {
      const error = get().validateField(field, value);
      if (error) {
        errors.push(error);
      }
    }

    if (updates.quietHoursEnabled && updates.quietHoursStart && updates.quietHoursEnd) {
      if (updates.quietHoursStart === updates.quietHoursEnd) {
        errors.push({ field: 'quietHours', message: '开始时间和结束时间不能相同' });
      }
    }

    if (errors.length > 0) {
      set({ errors, isSaving: false });
      return false;
    }

    try {
      const currentSettings = get().settings;
      const newSettings: Settings = {
        ...currentSettings,
        notifications: { ...currentSettings.notifications, ...updates },
        updatedAt: Date.now(),
      };

      saveSettings(newSettings);
      set({
        settings: newSettings,
        isSaving: false,
        saveSuccess: true,
        lastSaved: Date.now(),
      });

      setTimeout(() => set({ saveSuccess: false }), 3000);
      return true;
    } catch (e) {
      console.error('Failed to update notification settings', e);
      set({
        isSaving: false,
        errors: [{ field: 'general', message: '保存失败，请重试' }],
      });
      return false;
    }
  },

  updatePrivacySettings: async (updates: Partial<PrivacySettings>): Promise<boolean> => {
    set({ isSaving: true, errors: [], saveSuccess: false });

    try {
      const currentSettings = get().settings;
      const newSettings: Settings = {
        ...currentSettings,
        privacy: { ...currentSettings.privacy, ...updates },
        updatedAt: Date.now(),
      };

      saveSettings(newSettings);
      set({
        settings: newSettings,
        isSaving: false,
        saveSuccess: true,
        lastSaved: Date.now(),
      });

      setTimeout(() => set({ saveSuccess: false }), 3000);
      return true;
    } catch (e) {
      console.error('Failed to update privacy settings', e);
      set({
        isSaving: false,
        errors: [{ field: 'general', message: '保存失败，请重试' }],
      });
      return false;
    }
  },

  updateSecuritySettings: async (updates: Partial<SecuritySettings>): Promise<boolean> => {
    set({ isSaving: true, errors: [], saveSuccess: false });

    try {
      const currentSettings = get().settings;
      const newSettings: Settings = {
        ...currentSettings,
        security: { ...currentSettings.security, ...updates },
        updatedAt: Date.now(),
      };

      saveSettings(newSettings);
      set({
        settings: newSettings,
        isSaving: false,
        saveSuccess: true,
        lastSaved: Date.now(),
      });

      setTimeout(() => set({ saveSuccess: false }), 3000);
      return true;
    } catch (e) {
      console.error('Failed to update security settings', e);
      set({
        isSaving: false,
        errors: [{ field: 'general', message: '保存失败，请重试' }],
      });
      return false;
    }
  },

  setActiveCategory: (category) => {
    set({ activeCategory: category, errors: [] });
  },

  resetToDefaults: () => {
    const settings = resetSettings();
    set({
      settings,
      errors: [],
      saveSuccess: true,
      lastSaved: Date.now(),
    });
    setTimeout(() => set({ saveSuccess: false }), 3000);
  },

  exportSettings: () => {
    return exportSettingsUtil();
  },

  importSettings: (json: string): boolean => {
    const settings = importSettingsUtil(json);
    if (settings) {
      set({
        settings,
        saveSuccess: true,
        lastSaved: Date.now(),
      });
      setTimeout(() => set({ saveSuccess: false }), 3000);
      return true;
    }
    set({ errors: [{ field: 'general', message: '导入失败，文件格式不正确' }] });
    return false;
  },
}));
