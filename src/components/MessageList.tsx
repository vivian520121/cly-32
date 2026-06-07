import { useRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Loader2, Inbox, Wifi, WifiOff } from 'lucide-react';
import type { Message } from '../types';
import { MessageItem } from './MessageItem';
import { useMessageStore } from '../store/useMessageStore';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { fetchMessagesAPI } from '../data/messages';
import { cn } from '../lib/utils';

export const MessageList = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startYRef = useRef<number | null>(null);

  const activeTab = useMessageStore((state) => state.activeTab);
  const isRefreshing = useMessageStore((state) => state.isRefreshing);
  const refreshMessages = useMessageStore((state) => state.refreshMessages);
  const getFilteredMessages = useMessageStore((state) => state.getFilteredMessages);
  const markAllAsRead = useMessageStore((state) => state.markAllAsRead);
  const unreadCount = useMessageStore((state) => state.unreadCount);

  const {
    items,
    isLoading,
    hasMore,
    sentinelRef,
    reset,
    prependItems,
  } = useInfiniteScroll<Message>({
    loadMore: async (page) => {
      const result = await fetchMessagesAPI(page, 10, activeTab);
      return { items: result.messages, hasMore: result.hasMore };
    },
    initialPage: 1,
  });

  useEffect(() => {
    reset();
  }, [activeTab, reset]);

  useEffect(() => {
    const filtered = getFilteredMessages();
    if (filtered.length > 0 && filtered.length !== items.length) {
      const newItems = filtered.slice(0, items.length);
      const uniqueNewItems = newItems.filter(
        (newItem) => !items.some((item) => item.id === newItem.id)
      );
      if (uniqueNewItems.length > 0) {
        prependItems(uniqueNewItems);
      }
    }
  }, [getFilteredMessages, items, prependItems]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling || startYRef.current === null) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0 && containerRef.current?.scrollTop === 0) {
        const dampenedDistance = Math.min(distance * 0.5, 80);
        setPullDistance(dampenedDistance);
      }
    },
    [isPulling]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 60) {
      await refreshMessages();
      reset();
    }
    setPullDistance(0);
    setIsPulling(false);
    startYRef.current = null;
  }, [pullDistance, refreshMessages, reset]);

  const handleRefresh = useCallback(async () => {
    await refreshMessages();
    reset();
  }, [refreshMessages, reset]);

  const displayItems = getFilteredMessages().length > 0 ? getFilteredMessages() : items;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ConnectionStatus />
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            {t('messages.markAllAsRead')}
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn(
            'flex items-center justify-center transition-all duration-200 overflow-hidden',
            pullDistance > 0 ? 'h-auto py-3' : 'h-0 py-0'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 text-sm text-gray-500 transition-transform duration-200',
              isRefreshing && 'animate-spin'
            )}
            style={{ transform: `rotate(${pullDistance * 3}deg)` }}
          >
            <RefreshCw className="w-5 h-5" />
            <span>
              {isRefreshing
                ? t('messages.refreshing')
                : pullDistance > 60
                ? t('messages.releaseToRefresh')
                : t('messages.pullToRefresh')}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          {displayItems.length === 0 && !isLoading ? (
            <EmptyState onRefresh={handleRefresh} />
          ) : (
            <>
              {displayItems.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}

              <div ref={sentinelRef} className="py-4">
                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{t('comment.loading')}</span>
                  </div>
                )}
                {!hasMore && !isLoading && displayItems.length > 0 && (
                  <p className="text-center text-sm text-gray-400">{t('messages.noMoreMessages')}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ConnectionStatus = () => {
  const { t } = useTranslation();
  const isConnected = useMessageStore((state) => state.isConnected);

  return (
    <div className="flex items-center gap-1.5">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">{t('messages.connected')}</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">{t('messages.connecting')}</span>
        </>
      )}
    </div>
  );
};

const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-12 h-12 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('messages.noMessages')}</h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        {t('messages.noMessagesDesc')}
      </p>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors active:scale-95"
      >
        <RefreshCw className="w-4 h-4" />
        {t('messages.refresh')}
      </button>
    </div>
  );
};
