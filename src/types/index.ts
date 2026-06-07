export interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  likeCount: number;
}

export interface Video {
  id: string;
  userId: string;
  videoUrl: string;
  coverUrl: string;
  description: string;
  musicName: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  createdAt: string;
  author: User;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  parentId: string | null;
  content: string;
  likeCount: number;
  createdAt: string;
  user: User;
  replies?: Comment[];
  replyCount?: number;
}

export interface UserInteraction {
  likedVideos: string[];
  collectedVideos: string[];
  followingUsers: string[];
  likedComments: string[];
}

export interface VideoState {
  videos: Video[];
  currentIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  playbackRate: number;
  currentTime: number;
  duration: number;
  buffered: number;
  isLoading: boolean;
}

export interface UIState {
  showCommentModal: boolean;
  showSpeedControl: boolean;
  showControls: boolean;
  currentVideoId: string | null;
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

export interface SwipeState {
  startY: number;
  currentY: number;
  isDragging: boolean;
  direction: SwipeDirection;
}

export interface SearchHistoryItem {
  keyword: string;
  timestamp: number;
}

export interface BrowseHistoryItem {
  videoId: string;
  timestamp: number;
  progress: number;
}

export interface HotSearchItem {
  keyword: string;
  hot: number;
  isHot?: boolean;
  isNew?: boolean;
}

export enum MessageType {
  LIKE = 'like',
  COMMENT_REPLY = 'comment_reply',
}

export interface LikeContent {
  videoId: string;
  videoCover: string;
  videoDescription: string;
}

export interface CommentReplyContent {
  videoId: string;
  videoCover: string;
  originalCommentId: string;
  originalCommentContent: string;
  replyContent: string;
}

export type MessageContent = LikeContent | CommentReplyContent;

export interface Message {
  id: string;
  type: MessageType;
  senderId: string;
  sender: User;
  receiverId: string;
  content: MessageContent;
  resourceUrl: string;
  createdAt: string;
  isRead: boolean;
}

export interface MessageState {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  currentPage: number;
  activeTab: MessageType | 'all';
  isConnected: boolean;
}

export interface MessageStore extends MessageState {
  setActiveTab: (tab: MessageType | 'all') => void;
  fetchMessages: (page?: number, tab?: MessageType | 'all') => Promise<void>;
  refreshMessages: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  markAsRead: (messageId: string) => void;
  markAllAsRead: () => void;
  deleteMessage: (messageId: string) => void;
  addMessage: (message: Message) => void;
  setConnected: (connected: boolean) => void;
  getFilteredMessages: () => Message[];
  getUnreadCountByType: (type: MessageType) => number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'zh-CN' | 'en-US' | 'ja-JP';
export type VideoQuality = 'auto' | '360p' | '480p' | '720p' | '1080p';
export type NotificationFrequency = 'always' | 'daily' | 'weekly' | 'never';

export interface AccountSettings {
  username: string;
  nickname: string;
  bio: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface AppPreferences {
  theme: ThemeMode;
  language: Language;
  videoQuality: VideoQuality;
  autoPlay: boolean;
  autoPlayOnMobile: boolean;
  showCaptions: boolean;
  volume: number;
  playbackSpeed: number;
  enableHapticFeedback: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  likeNotifications: NotificationFrequency;
  commentNotifications: NotificationFrequency;
  followNotifications: NotificationFrequency;
  messageNotifications: NotificationFrequency;
  mentionNotifications: NotificationFrequency;
  systemNotifications: boolean;
  promotionalNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  videoVisibility: 'public' | 'followers' | 'private';
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  showOnlineStatus: boolean;
  showActivityStatus: boolean;
  showFollowList: boolean;
  showLikeList: boolean;
  allowSearchByPhone: boolean;
  allowSearchByEmail: boolean;
  personalizedRecommendations: boolean;
  personalizedAds: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowedDevices: string[];
}

export interface Settings {
  account: AccountSettings;
  preferences: AppPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  updatedAt: number;
}

export type SettingsCategory = 'account' | 'preferences' | 'notifications' | 'privacy' | 'about';

export interface SettingsValidationError {
  field: string;
  message: string;
}

export interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  isSaving: boolean;
  errors: SettingsValidationError[];
  activeCategory: SettingsCategory;
  saveSuccess: boolean;
  lastSaved: number | null;
}

export interface SettingsStore extends SettingsState {
  initSettings: () => void;
  updateAccountSettings: (updates: Partial<AccountSettings>) => Promise<boolean>;
  updatePreferences: (updates: Partial<AppPreferences>) => Promise<boolean>;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => Promise<boolean>;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => Promise<boolean>;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => Promise<boolean>;
  setActiveCategory: (category: SettingsCategory) => void;
  validateField: (field: string, value: unknown) => SettingsValidationError | null;
  clearErrors: () => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}
