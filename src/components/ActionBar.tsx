import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Music, UserPlus, Check } from 'lucide-react';
import type { Video } from '../types';
import { useUserStore } from '../store/useUserStore';
import { useVideoStore } from '../store/useVideoStore';
import { useUIStore } from '../store/useUIStore';
import { formatNumber } from '../utils/format';
import { LikeAnimation } from './LikeAnimation';

interface ActionBarProps {
  video: Video;
}

export const ActionBar = ({ video }: ActionBarProps) => {
  const navigate = useNavigate();
  const { likeVideo, collectVideo, followUser, isVideoLiked, isVideoCollected, isUserFollowed } = useUserStore();
  const { updateVideoCount } = useVideoStore();
  const { setShowCommentModal, setCurrentVideoId } = useUIStore();
  
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [likeAnimKey, setLikeAnimKey] = useState(0);

  const handleLike = useCallback(() => {
    const isLiked = isVideoLiked(video.id);
    likeVideo(video.id);
    updateVideoCount(video.id, 'likeCount', isLiked ? -1 : 1);
    
    if (!isLiked) {
      setLikeAnimKey((prev) => prev + 1);
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 800);
    }
  }, [video.id, isVideoLiked, likeVideo, updateVideoCount]);

  const handleCollect = useCallback(() => {
    const isCollected = isVideoCollected(video.id);
    collectVideo(video.id);
    updateVideoCount(video.id, 'collectCount', isCollected ? -1 : 1);
  }, [video.id, isVideoCollected, collectVideo, updateVideoCount]);

  const handleFollow = useCallback(() => {
    const isFollowed = isUserFollowed(video.userId);
    followUser(video.userId);
  }, [video.userId, isUserFollowed, followUser]);

  const handleComment = useCallback(() => {
    setCurrentVideoId(video.id);
    setShowCommentModal(true);
  }, [video.id, setCurrentVideoId, setShowCommentModal]);

  const handleShare = useCallback(() => {
    updateVideoCount(video.id, 'shareCount', 1);
    if (navigator.share) {
      navigator.share({
        title: video.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  }, [video.id, video.description, updateVideoCount]);

  const handleAuthorClick = useCallback(() => {
    navigate(`/author/${video.userId}`);
  }, [navigate, video.userId]);

  const isLiked = isVideoLiked(video.id);
  const isCollected = isVideoCollected(video.id);
  const isFollowed = isUserFollowed(video.userId);

  return (
    <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
      {showLikeAnim && <LikeAnimation key={likeAnimKey} />}
      
      <div className="relative">
        <img
          src={video.author.avatar}
          alt={video.author.username}
          className="w-12 h-12 rounded-full border-2 border-white cursor-pointer object-cover"
          onClick={handleAuthorClick}
        />
        {!isFollowed && (
          <button
            onClick={handleFollow}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
          >
            <UserPlus className="w-4 h-4 text-white" />
          </button>
        )}
        {isFollowed && (
          <button
            onClick={handleFollow}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      <button onClick={handleLike} className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] pt-2">
        <div className={`p-2 rounded-full transition-transform active:scale-90 ${isLiked ? 'text-red-500' : 'text-white'}`}>
          <Heart className="w-8 h-8" fill={isLiked ? 'currentColor' : 'none'} />
        </div>
        <span className="text-xs text-white font-medium">{formatNumber(video.likeCount)}</span>
      </button>

      <button onClick={handleComment} className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px]">
        <div className="p-2 rounded-full text-white transition-transform active:scale-90">
          <MessageCircle className="w-8 h-8" />
        </div>
        <span className="text-xs text-white font-medium">{formatNumber(video.commentCount)}</span>
      </button>

      <button onClick={handleCollect} className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px]">
        <div className={`p-2 rounded-full transition-transform active:scale-90 ${isCollected ? 'text-yellow-500' : 'text-white'}`}>
          <Bookmark className="w-8 h-8" fill={isCollected ? 'currentColor' : 'none'} />
        </div>
        <span className="text-xs text-white font-medium">{formatNumber(video.collectCount)}</span>
      </button>

      <button onClick={handleShare} className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px]">
        <div className="p-2 rounded-full text-white transition-transform active:scale-90">
          <Share2 className="w-8 h-8" />
        </div>
        <span className="text-xs text-white font-medium">{formatNumber(video.shareCount)}</span>
      </button>

      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-spin-slow">
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};
