import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Trash2, Check } from 'lucide-react';
import type { Message, LikeContent, CommentReplyContent } from '../types';
import { useMessageStore } from '../store/useMessageStore';
import { formatDate } from '../utils/format';
import { cn } from '../lib/utils';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const markAsRead = useMessageStore((state) => state.markAsRead);
  const deleteMessage = useMessageStore((state) => state.deleteMessage);

  const handleClick = useCallback(() => {
    if (!message.isRead) {
      markAsRead(message.id);
    }
  }, [message.id, message.isRead, markAsRead]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteMessage(message.id);
    },
    [message.id, deleteMessage]
  );

  const handleMarkAsRead = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      markAsRead(message.id);
    },
    [message.id, markAsRead]
  );

  const isLikeMessage = message.type === 'like';
  const likeContent = message.content as LikeContent;
  const replyContent = message.content as CommentReplyContent;

  return (
    <div
      className={cn(
        'relative p-4 bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        !message.isRead && 'bg-gradient-to-r from-blue-50 to-white border-blue-200',
        message.isRead && 'border-gray-100'
      )}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!message.isRead && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
      )}

      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={message.sender.avatar}
            alt={message.sender.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm',
              isLikeMessage ? 'bg-red-500' : 'bg-blue-500'
            )}
          >
            {isLikeMessage ? (
              <Heart className="w-3.5 h-3.5 text-white" fill="currentColor" />
            ) : (
              <MessageCircle className="w-3.5 h-3.5 text-white" fill="currentColor" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 truncate">{message.sender.username}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isLikeMessage
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  )}
                >
                  {isLikeMessage ? t('messages.likedYourVideo') : t('messages.repliedToYourComment')}
                </span>
                {!message.isRead && (
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{formatDate(message.createdAt)}</p>
            </div>

            <div
              className={cn(
                'flex items-center gap-1 transition-opacity duration-200',
                showActions ? 'opacity-100' : 'opacity-0'
              )}
            >
              {!message.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-1.5 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors"
                  title={t('common.markAsRead')}
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                title={t('common.delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-3 items-start">
            {isLikeMessage ? (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="text-gray-900">{message.sender.username}</span> {t('messages.likedYourVideo')}：
                    <span className="ml-1">{likeContent.videoDescription}</span>
                  </p>
                </div>
                <img
                  src={likeContent.videoCover}
                  alt="视频封面"
                  className="w-16 h-20 rounded-lg object-cover flex-shrink-0 shadow-sm"
                />
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-2">
                    {replyContent.replyContent}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{t('messages.yourComment')}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {replyContent.originalCommentContent}
                    </p>
                  </div>
                </div>
                <img
                  src={replyContent.videoCover}
                  alt="视频封面"
                  className="w-16 h-20 rounded-lg object-cover flex-shrink-0 shadow-sm"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
