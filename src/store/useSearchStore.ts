import { create } from 'zustand';
import type { SearchHistoryItem, BrowseHistoryItem, HotSearchItem, Video } from '../types';
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  getBrowseHistory,
  addBrowseHistory,
  removeBrowseHistory,
  clearBrowseHistory,
} from '../utils/storage';
import { hotSearches } from '../data/hotSearches';
import { searchVideos } from '../data/videos';

interface SearchStore {
  searchHistory: SearchHistoryItem[];
  browseHistory: BrowseHistoryItem[];
  hotSearches: HotSearchItem[];
  searchResults: Video[];
  isSearching: boolean;
  searchKeyword: string;
  initSearchHistory: () => void;
  initBrowseHistory: () => void;
  addToSearchHistory: (keyword: string) => void;
  removeFromSearchHistory: (keyword: string) => void;
  clearAllSearchHistory: () => void;
  addToBrowseHistory: (videoId: string, progress?: number) => void;
  removeFromBrowseHistory: (videoId: string) => void;
  clearAllBrowseHistory: () => void;
  performSearch: (keyword: string) => void;
  setSearchKeyword: (keyword: string) => void;
  clearSearchResults: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  searchHistory: [],
  browseHistory: [],
  hotSearches,
  searchResults: [],
  isSearching: false,
  searchKeyword: '',

  initSearchHistory: () => {
    set({ searchHistory: getSearchHistory() });
  },

  initBrowseHistory: () => {
    set({ browseHistory: getBrowseHistory() });
  },

  addToSearchHistory: (keyword: string) => {
    const updatedHistory = addSearchHistory(keyword);
    set({ searchHistory: updatedHistory });
  },

  removeFromSearchHistory: (keyword: string) => {
    const updatedHistory = removeSearchHistory(keyword);
    set({ searchHistory: updatedHistory });
  },

  clearAllSearchHistory: () => {
    const updatedHistory = clearSearchHistory();
    set({ searchHistory: updatedHistory });
  },

  addToBrowseHistory: (videoId: string, progress: number = 0) => {
    const updatedHistory = addBrowseHistory(videoId, progress);
    set({ browseHistory: updatedHistory });
  },

  removeFromBrowseHistory: (videoId: string) => {
    const updatedHistory = removeBrowseHistory(videoId);
    set({ browseHistory: updatedHistory });
  },

  clearAllBrowseHistory: () => {
    const updatedHistory = clearBrowseHistory();
    set({ browseHistory: updatedHistory });
  },

  performSearch: (keyword: string) => {
    if (!keyword.trim()) {
      set({ searchResults: [], isSearching: false, searchKeyword: '' });
      return;
    }
    set({ isSearching: true, searchKeyword: keyword });
    const results = searchVideos(keyword);
    get().addToSearchHistory(keyword);
    set({ searchResults: results, isSearching: false });
  },

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
  },

  clearSearchResults: () => {
    set({ searchResults: [], searchKeyword: '' });
  },
}));
