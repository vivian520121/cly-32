import type { UserInteraction, SearchHistoryItem, BrowseHistoryItem } from '../types';

const STORAGE_KEY = 'short_video_interaction';
const SEARCH_HISTORY_KEY = 'short_video_search_history';
const BROWSE_HISTORY_KEY = 'short_video_browse_history';
const MAX_SEARCH_HISTORY = 20;
const MAX_BROWSE_HISTORY = 100;

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
