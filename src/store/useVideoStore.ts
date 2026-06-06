import { create } from 'zustand';
import type { Video, VideoState } from '../types';
import { videos } from '../data/videos';

interface VideoStore extends VideoState {
  setCurrentIndex: (index: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
  setMuted: (isMuted: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setBuffered: (buffered: number) => void;
  setLoading: (isLoading: boolean) => void;
  nextVideo: () => void;
  prevVideo: () => void;
  updateVideoCount: (videoId: string, field: 'likeCount' | 'commentCount' | 'shareCount' | 'collectCount', delta: number) => void;
  getCurrentVideo: () => Video | undefined;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos,
  currentIndex: 0,
  isPlaying: true,
  isMuted: true,
  playbackRate: 1,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  isLoading: true,

  setCurrentIndex: (index) => set({ currentIndex: index, currentTime: 0 }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setMuted: (isMuted) => set({ isMuted }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setBuffered: (buffered) => set({ buffered }),
  setLoading: (isLoading) => set({ isLoading }),

  nextVideo: () => set((state) => {
    const nextIndex = Math.min(state.currentIndex + 1, state.videos.length - 1);
    return { currentIndex: nextIndex, currentTime: 0, isPlaying: true };
  }),

  prevVideo: () => set((state) => {
    const prevIndex = Math.max(state.currentIndex - 1, 0);
    return { currentIndex: prevIndex, currentTime: 0, isPlaying: true };
  }),

  updateVideoCount: (videoId, field, delta) => set((state) => ({
    videos: state.videos.map((v) =>
      v.id === videoId ? { ...v, [field]: Math.max(0, v[field] + delta) } : v
    ),
  })),

  getCurrentVideo: () => {
    const { videos, currentIndex } = get();
    return videos[currentIndex];
  },
}));
