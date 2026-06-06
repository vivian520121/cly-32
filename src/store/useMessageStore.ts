import { create } from 'zustand';
import type { MessageStore, MessageType, Message } from '../types';
import { fetchMessagesAPI } from '../data/messages';

const PAGE_SIZE = 10;

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  hasMore: true,
  currentPage: 1,
  activeTab: 'all',
  isConnected: false,

  setActiveTab: (tab) => {
    set({ activeTab: tab, currentPage: 1, messages: [], hasMore: true });
    get().fetchMessages(1, tab);
  },

  fetchMessages: async (page = 1, tab) => {
    const currentTab = tab || get().activeTab;
    set({ isLoading: true });

    try {
      const { messages, hasMore } = await fetchMessagesAPI(page, PAGE_SIZE, currentTab);

      set((state) => {
        const existingIds = new Set(state.messages.map((m) => m.id));
        const newMessages = messages.filter((m) => !existingIds.has(m.id));
        const allMessages = page === 1 ? messages : [...state.messages, ...newMessages];
        const unreadCount = allMessages.filter((m) => !m.isRead).length;

        return {
          messages: allMessages,
          hasMore,
          currentPage: page,
          unreadCount,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isLoading: false });
    }
  },

  refreshMessages: async () => {
    set({ isRefreshing: true });
    try {
      await get().fetchMessages(1);
    } finally {
      set({ isRefreshing: false });
    }
  },

  loadMoreMessages: async () => {
    const { isLoading, hasMore, currentPage, activeTab } = get();
    if (isLoading || !hasMore) return;
    await get().fetchMessages(currentPage + 1, activeTab);
  },

  markAsRead: (messageId) => {
    set((state) => {
      const messages = state.messages.map((m) =>
        m.id === messageId ? { ...m, isRead: true } : m
      );
      const unreadCount = messages.filter((m) => !m.isRead).length;
      return { messages, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const messages = state.messages.map((m) => ({ ...m, isRead: true }));
      return { messages, unreadCount: 0 };
    });
  },

  deleteMessage: (messageId) => {
    set((state) => {
      const messages = state.messages.filter((m) => m.id !== messageId);
      const unreadCount = messages.filter((m) => !m.isRead).length;
      return { messages, unreadCount };
    });
  },

  addMessage: (message: Message) => {
    set((state) => {
      const existingIds = new Set(state.messages.map((m) => m.id));
      if (existingIds.has(message.id)) return state;

      const messages = [message, ...state.messages];
      const unreadCount = messages.filter((m) => !m.isRead).length;
      return { messages, unreadCount };
    });
  },

  setConnected: (connected) => {
    set({ isConnected: connected });
  },

  getFilteredMessages: () => {
    const { messages, activeTab } = get();
    if (activeTab === 'all') return messages;
    return messages.filter((m) => m.type === activeTab);
  },

  getUnreadCountByType: (type: MessageType) => {
    return get().messages.filter((m) => m.type === type && !m.isRead).length;
  },
}));
