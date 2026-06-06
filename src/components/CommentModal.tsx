import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Heart, Send, ChevronDown, ChevronUp, MessageCircle, Loader2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';
import { useVideoStore } from '../store/useVideoStore';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getCommentsByVideoId, addComment } from '../data/comments';
import { formatNumber, formatDate } from '../utils/format';
import type { Comment } from '../types';

export const CommentModal = () => {
  const { showCommentModal, currentVideoId, setShowCommentModal } = useUIStore();
  const { likeComment, isCommentLiked } = useUserStore();
  const { updateVideoCount, getCurrentVideo } = useVideoStore();
  
  const [inputValue, setInputValue] = useState('');
  const [replyTo, setReplyTo] = useState<{ commentId: string; username: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadComments = useCallback(async (page: number) => {
    if (!currentVideoId) return { items: [], hasMore: false };
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = getCommentsByVideoId(currentVideoId, page, 10);
    return { items: result.comments, hasMore: result.hasMore };
  }, [currentVideoId]);

  const { items, isLoading, hasMore, sentinelRef, reset, prependItems } = useInfiniteScroll<Comment>({
    loadMore: loadComments,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (showCommentModal && currentVideoId) {
      reset();
      setInputValue('');
      setReplyTo(null);
      setExpandedReplies(new Set());
    }
  }, [showCommentModal, currentVideoId, reset]);

  useEffect(() => {
    if (showCommentModal && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [showCommentModal]);

  const handleClose = useCallback(() => {
    setShowCommentModal(false);
  }, [setShowCommentModal]);

  const handleLikeComment = useCallback((commentId: string) => {
    const isLiked = isCommentLiked(commentId);
    likeComment(commentId);
    
    const updateCount = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return { ...c, likeCount: Math.max(0, c.likeCount + (isLiked ? -1 : 1)) };
        }
        if (c.replies) {
          return { ...c, replies: updateCount(c.replies) };
        }
        return c;
      });
    };
    
    // 直接更新 items 状态（实际项目中应该通过 store 更新）
    console.log('Update comment like count');
  }, [isCommentLiked, likeComment]);

  const handleReply = useCallback((comment: Comment) => {
    setReplyTo({ commentId: comment.id, username: comment.user.username });
    inputRef.current?.focus();
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || !currentVideoId) return;
    
    const newComment = addComment(
      currentVideoId, 
      replyTo ? `@${replyTo.username} ${inputValue}` : inputValue,
      replyTo?.commentId || null
    );
    
    prependItems([newComment]);
    updateVideoCount(currentVideoId, 'commentCount', 1);
    setInputValue('');
    setReplyTo(null);
  }, [inputValue, currentVideoId, replyTo, prependItems, updateVideoCount]);

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const currentVideo = getCurrentVideo();

  if (!showCommentModal) return null;

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const liked = isCommentLiked(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);

    return (
      <div className={`${isReply ? 'ml-12 mt-3' : 'mt-4'}`}>
        <div className="flex gap-3">
          <img 
            src={comment.user.avatar} 
            alt={comment.user.username}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs font-medium">
                {comment.user.username}
              </span>
              <span className="text-gray-500 text-xs">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-white text-sm mt-1 leading-relaxed">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {!isReply && (
                <button 
                  onClick={() => handleReply(comment)}
                  className="text-gray-400 text-xs hover:text-white transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  回复
                </button>
              )}
              <button 
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${liked ? 'text-red-500' : ''}`} 
                  fill={liked ? 'currentColor' : 'none'}
                />
                <span className="text-xs">{formatNumber(comment.likeCount)}</span>
              </button>
            </div>
            
            {hasReplies && !isReply && (
              <button 
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-1 text-gray-400 text-xs mt-2 hover:text-white transition-colors"
              >
                {isExpanded ? (
                  <><ChevronUp className="w-4 h-4" /> 收起 {comment.replyCount} 条回复</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> 查看 {comment.replyCount} 条回复</>
                )}
              </button>
            )}
            
            {hasReplies && isExpanded && comment.replies && (
              <div className="border-l-2 border-gray-700 pl-3 mt-2">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      <div 
        className="relative w-full max-w-md bg-gray-900 rounded-t-3xl overflow-hidden animate-slide-up"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 z-10 px-4 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-base">
              {currentVideo ? `${formatNumber(currentVideo.commentCount)} 条评论` : '评论'}
            </h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={listRef}
          className="overflow-y-auto px-4 pb-32"
          style={{ maxHeight: 'calc(85vh - 140px)' }}
        >
          {items.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-500 text-sm">暂无评论，快来抢沙发吧</p>
            </div>
          )}
          
          {items.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          
          <div ref={sentinelRef} className="h-12 flex items-center justify-center">
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">加载中...</span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-gray-600 text-sm">没有更多评论了</p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs">
                回复 @{replyTo.username}
              </span>
              <button 
                onClick={handleCancelReply}
                className="text-gray-500 hover:text-white text-xs"
              >
                取消
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={replyTo ? `回复 @${replyTo.username}...` : '说点什么...'}
              className="flex-1 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder-gray-500"
            />
            <button 
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-full transition-all ${
                inputValue.trim() 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
