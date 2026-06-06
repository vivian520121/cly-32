import { create } from 'zustand';
import type { UIState } from '../types';

interface UIStore extends UIState {
  setShowCommentModal: (show: boolean) => void;
  setShowSpeedControl: (show: boolean) => void;
  setShowControls: (show: boolean) => void;
  toggleControls: () => void;
  setCurrentVideoId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showCommentModal: false,
  showSpeedControl: false,
  showControls: true,
  currentVideoId: null,

  setShowCommentModal: (showCommentModal) => set({ showCommentModal }),
  setShowSpeedControl: (showSpeedControl) => set({ showSpeedControl }),
  setShowControls: (showControls) => set({ showControls }),
  toggleControls: () => set((state) => ({ showControls: !state.showControls })),
  setCurrentVideoId: (currentVideoId) => set({ currentVideoId }),
}));
