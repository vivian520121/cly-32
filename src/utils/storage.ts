import type { UserInteraction, SearchHistoryItem, BrowseHistoryItem, Settings, AccountSettings, AppPreferences, NotificationSettings, PrivacySettings, SecuritySettings } from '../types';

const STORAGE_KEY = 'short_video_interaction';
const SEARCH_HISTORY_KEY = 'short_video_search_history';
const BROWSE_HISTORY_KEY = 'short_video_browse_history';
const SETTINGS_KEY = 'short_video_settings';
const MAX_SEARCH_HISTORY = 20;
const MAX_BROWSE_HISTORY = 100;

const defaultAccountSettings: AccountSettings = {
  username: 'user_001',
  nickname: '短视频用户',
  bio: '记录美好生活',
  email: 'user@example.com',
  phone: '13800138000',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
};

const defaultAppPreferences: AppPreferences = {
  theme: 'system',
  language: 'zh-CN',
  videoQuality: 'auto',
  autoPlay: true,
  autoPlayOnMobile: true,
  showCaptions: false,
  volume: 80,
  playbackSpeed: 1,
  enableHapticFeedback: true,
};

const defaultNotificationSettings: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: false,
  smsEnabled: false,
  likeNotifications: 'always',
  commentNotifications: 'always',
  followNotifications: 'always',
  messageNotifications: 'always',
  mentionNotifications: 'always',
  systemNotifications: true,
  promotionalNotifications: false,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

const defaultPrivacySettings: PrivacySettings = {
  profileVisibility: 'public',
  videoVisibility: 'public',
  allowComments: true,
  allowDuet: true,
  allowStitch: true,
  showOnlineStatus: true,
  showActivityStatus: true,
  showFollowList: true,
  showLikeList: false,
  allowSearchByPhone: false,
  allowSearchByEmail: false,
  personalizedRecommendations: true,
  personalizedAds: true,
};

const defaultSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  loginNotifications: true,
  sessionTimeout: 7,
  allowedDevices: [],
};

export const defaultSettings: Settings = {
  account: defaultAccountSettings,
  preferences: defaultAppPreferences,
  notifications: defaultNotificationSettings,
  privacy: defaultPrivacySettings,
  security: defaultSecuritySettings,
  updatedAt: Date.now(),
};

const defaultInteraction: UserInteraction = {
  likedVideos: [],
  collectedVideos: [],
  followingUsers: [],
  likedComments: [],
};

export const getInteraction = (): UserInteraction => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get interaction from storage', e);
  }
  return defaultInteraction;
};

export const saveInteraction = (interaction: UserInteraction): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interaction));
  } catch (e) {
    console.error('Failed to save interaction to storage', e);
  }
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const data = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get search history from storage', e);
  }
  return [];
};

export const saveSearchHistory = (history: SearchHistoryItem[]): void => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save search history to storage', e);
  }
};

export const addSearchHistory = (keyword: string): SearchHistoryItem[] => {
  const history = getSearchHistory();
  const existingIndex = history.findIndex((item) => item.keyword === keyword);
  if (existingIndex > -1) {
    history.splice(existingIndex, 1);
  }
  history.unshift({
    keyword,
    timestamp: Date.now(),
  });
  const trimmedHistory = history.slice(0, MAX_SEARCH_HISTORY);
  saveSearchHistory(trimmedHistory);
  return trimmedHistory;
};

export const removeSearchHistory = (keyword: string): SearchHistoryItem[] => {
  const history = getSearchHistory();
  const filteredHistory = history.filter((item) => item.keyword !== keyword);
  saveSearchHistory(filteredHistory);
  return filteredHistory;
};

export const clearSearchHistory = (): SearchHistoryItem[] => {
  saveSearchHistory([]);
  return [];
};

export const getBrowseHistory = (): BrowseHistoryItem[] => {
  try {
    const data = localStorage.getItem(BROWSE_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get browse history from storage', e);
  }
  return [];
};

export const saveBrowseHistory = (history: BrowseHistoryItem[]): void => {
  try {
    localStorage.setItem(BROWSE_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save browse history to storage', e);
  }
};

export const addBrowseHistory = (videoId: string, progress: number = 0): BrowseHistoryItem[] => {
  const history = getBrowseHistory();
  const existingIndex = history.findIndex((item) => item.videoId === videoId);
  if (existingIndex > -1) {
    history.splice(existingIndex, 1);
  }
  history.unshift({
    videoId,
    timestamp: Date.now(),
    progress,
  });
  const trimmedHistory = history.slice(0, MAX_BROWSE_HISTORY);
  saveBrowseHistory(trimmedHistory);
  return trimmedHistory;
};

export const removeBrowseHistory = (videoId: string): BrowseHistoryItem[] => {
  const history = getBrowseHistory();
  const filteredHistory = history.filter((item) => item.videoId !== videoId);
  saveBrowseHistory(filteredHistory);
  return filteredHistory;
};

export const clearBrowseHistory = (): BrowseHistoryItem[] => {
  saveBrowseHistory([]);
  return [];
};

export const toggleLikeVideo = (videoId: string): boolean => {
  const interaction = getInteraction();
  const index = interaction.likedVideos.indexOf(videoId);
  if (index > -1) {
    interaction.likedVideos.splice(index, 1);
    saveInteraction(interaction);
    return false;
  } else {
    interaction.likedVideos.push(videoId);
    saveInteraction(interaction);
    return true;
  }
};

export const toggleCollectVideo = (videoId: string): boolean => {
  const interaction = getInteraction();
  const index = interaction.collectedVideos.indexOf(videoId);
  if (index > -1) {
    interaction.collectedVideos.splice(index, 1);
    saveInteraction(interaction);
    return false;
  } else {
    interaction.collectedVideos.push(videoId);
    saveInteraction(interaction);
    return true;
  }
};

export const toggleFollowUser = (userId: string): boolean => {
  const interaction = getInteraction();
  const index = interaction.followingUsers.indexOf(userId);
  if (index > -1) {
    interaction.followingUsers.splice(index, 1);
    saveInteraction(interaction);
    return false;
  } else {
    interaction.followingUsers.push(userId);
    saveInteraction(interaction);
    return true;
  }
};

export const toggleLikeComment = (commentId: string): boolean => {
  const interaction = getInteraction();
  const index = interaction.likedComments.indexOf(commentId);
  if (index > -1) {
    interaction.likedComments.splice(index, 1);
    saveInteraction(interaction);
    return false;
  } else {
    interaction.likedComments.push(commentId);
    saveInteraction(interaction);
    return true;
  }
};

export const isVideoLiked = (videoId: string): boolean => {
  return getInteraction().likedVideos.includes(videoId);
};

export const isVideoCollected = (videoId: string): boolean => {
  return getInteraction().collectedVideos.includes(videoId);
};

export const isUserFollowed = (userId: string): boolean => {
  return getInteraction().followingUsers.includes(userId);
};

export const isCommentLiked = (commentId: string): boolean => {
  return getInteraction().likedComments.includes(commentId);
};

export const getSettings = (): Settings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...defaultSettings,
        ...parsed,
        account: { ...defaultSettings.account, ...parsed.account },
        preferences: { ...defaultSettings.preferences, ...parsed.preferences },
        notifications: { ...defaultSettings.notifications, ...parsed.notifications },
        privacy: { ...defaultSettings.privacy, ...parsed.privacy },
        security: { ...defaultSettings.security, ...parsed.security },
      };
    }
  } catch (e) {
    console.error('Failed to get settings from storage', e);
  }
  return { ...defaultSettings };
};

export const saveSettings = (settings: Settings): void => {
  try {
    settings.updatedAt = Date.now();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
    throw new Error('Failed to save settings');
  }
};

export const resetSettings = (): Settings => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {
    console.error('Failed to reset settings', e);
  }
  return { ...defaultSettings };
};

export const exportSettings = (): string => {
  const settings = getSettings();
  return JSON.stringify(settings, null, 2);
};

export const importSettings = (json: string): Settings | null => {
  try {
    const parsed = JSON.parse(json);
    const merged: Settings = {
      ...defaultSettings,
      ...parsed,
      account: { ...defaultSettings.account, ...parsed.account },
      preferences: { ...defaultSettings.preferences, ...parsed.preferences },
      notifications: { ...defaultSettings.notifications, ...parsed.notifications },
      privacy: { ...defaultSettings.privacy, ...parsed.privacy },
      security: { ...defaultSettings.security, ...parsed.security },
      updatedAt: Date.now(),
    };
    saveSettings(merged);
    return merged;
  } catch (e) {
    console.error('Failed to import settings', e);
    return null;
  }
};
