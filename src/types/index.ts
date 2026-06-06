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
