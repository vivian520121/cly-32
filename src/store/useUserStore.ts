import { create } from 'zustand';
import type { User, UserInteraction } from '../types';
import { currentUser, users } from '../data/users';
import { getInteraction, toggleLikeVideo, toggleCollectVideo, toggleFollowUser, toggleLikeComment } from '../utils/storage';

interface UserStore {
  currentUser: User;
  users: User[];
  interaction: UserInteraction;
  initInteraction: () => void;
  likeVideo: (videoId: string) => boolean;
  collectVideo: (videoId: string) => boolean;
  followUser: (userId: string) => boolean;
  likeComment: (commentId: string) => boolean;
  isVideoLiked: (videoId: string) => boolean;
  isVideoCollected: (videoId: string) => boolean;
  isUserFollowed: (userId: string) => boolean;
  isCommentLiked: (commentId: string) => boolean;
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser,
  users,
  interaction: getInteraction(),

  initInteraction: () => {
    set({ interaction: getInteraction() });
  },

  likeVideo: (videoId) => {
    const isLiked = toggleLikeVideo(videoId);
    set({ interaction: getInteraction() });
    return isLiked;
  },

  collectVideo: (videoId) => {
    const isCollected = toggleCollectVideo(videoId);
    set({ interaction: getInteraction() });
    return isCollected;
  },

  followUser: (userId) => {
    const isFollowed = toggleFollowUser(userId);
    set({ interaction: getInteraction() });
    return isFollowed;
  },

  likeComment: (commentId) => {
    const isLiked = toggleLikeComment(commentId);
    set({ interaction: getInteraction() });
    return isLiked;
  },

  isVideoLiked: (videoId) => get().interaction.likedVideos.includes(videoId),
  isVideoCollected: (videoId) => get().interaction.collectedVideos.includes(videoId),
  isUserFollowed: (userId) => get().interaction.followingUsers.includes(userId),
  isCommentLiked: (commentId) => get().interaction.likedComments.includes(commentId),

  getUserById: (id) => {
    if (id === currentUser.id) return currentUser;
    return users.find((u) => u.id === id);
  },
}));
