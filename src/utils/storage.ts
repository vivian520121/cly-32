import type { UserInteraction } from '../types';

const STORAGE_KEY = 'short_video_interaction';

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
