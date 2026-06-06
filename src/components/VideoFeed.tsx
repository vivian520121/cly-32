import { useState, useCallback, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VideoPlayer } from './VideoPlayer';
import { ActionBar } from './ActionBar';
import { ProgressBar } from './ProgressBar';
import { SpeedControl } from './SpeedControl';
import { useVideoStore } from '../store/useVideoStore';
import { useUIStore } from '../store/useUIStore';
import { useSwipe } from '../hooks/useSwipe';
import type { SwipeDirection } from '../types';

export const VideoFeed = () => {
  const navigate = useNavigate();
  const { videos, currentIndex, isPlaying, playbackRate, nextVideo, prevVideo, toggleMute, isMuted, setPlaying } = useVideoStore();
  const { showSpeedControl, showControls, setShowSpeedControl, toggleControls, setShowControls } = useUIStore();
  
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideControlsTimer = useCallback(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    setShowControls(true);
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying, setShowControls]);

  const handleSwipeUp = useCallback(() => {
    if (currentIndex < videos.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setIsAnimating(true);
      setSwipeOffset(-window.innerHeight);
      
      setTimeout(() => {
        nextVideo();
        setSwipeOffset(0);
        setIsTransitioning(false);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentIndex, videos.length, isTransitioning, nextVideo]);

  const handleSwipeDown = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setIsAnimating(true);
      setSwipeOffset(window.innerHeight);
      
      setTimeout(() => {
        prevVideo();
        setSwipeOffset(0);
        setIsTransitioning(false);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentIndex, isTransitioning, prevVideo]);

  const handleSwipeMove = useCallback((_: React.TouchEvent<HTMLDivElement>, deltaY: number) => {
    if (!isTransitioning) {
      setSwipeOffset(deltaY * 0.5);
    }
  }, [isTransitioning]);

  const handleSwipeEnd = useCallback((_: React.TouchEvent<HTMLDivElement>, direction: SwipeDirection) => {
    if (!direction && !isTransitioning) {
      setSwipeOffset(0);
    }
  }, [isTransitioning]);

  const { handlers } = useSwipe({
    threshold: 60,
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown,
    onSwipeMove: handleSwipeMove,
    onSwipeEnd: handleSwipeEnd,
  });

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleControls();
    resetHideControlsTimer();
  }, [toggleControls, resetHideControlsTimer]);

  const handleMuteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMute();
  }, [toggleMute]);

  const handleSpeedClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSpeedControl(true);
  }, [setShowSpeedControl]);

  const handleProfileClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/profile');
  }, [navigate]);

  useEffect(() => {
    resetHideControlsTimer();
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [resetHideControlsTimer]);

  const currentVideo = videos[currentIndex];
  const prevVideoData = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideoData = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black"
      {...handlers}
      onClick={handleVideoClick}
      style={{ touchAction: 'pan-y' }}
    >
      <div 
        className="absolute inset-0 transition-transform"
        style={{
          transform: `translateY(${swipeOffset}px)`,
          transitionDuration: isAnimating ? '300ms' : '0ms',
          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}
      >
        {prevVideoData && (
          <div 
            className="absolute w-full h-full"
            style={{ top: '-100%', transform: 'translateZ(0)' }}
          >
            <VideoPlayer 
              videoUrl={prevVideoData.videoUrl} 
              coverUrl={prevVideoData.coverUrl}
              isActive={false}
            />
          </div>
        )}

        <div className="relative w-full h-full" style={{ transform: 'translateZ(0)' }}>
          <VideoPlayer 
            videoUrl={currentVideo.videoUrl} 
            coverUrl={currentVideo.coverUrl}
            isActive={true}
          />
        </div>

        {nextVideoData && (
          <div 
            className="absolute w-full h-full"
            style={{ top: '100%', transform: 'translateZ(0)' }}
          >
            <VideoPlayer 
              videoUrl={nextVideoData.videoUrl} 
              coverUrl={nextVideoData.coverUrl}
              isActive={false}
            />
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 right-0 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold text-lg">推荐</span>
              <span className="text-white/60 text-sm">关注</span>
            </div>
            <button 
              className="pointer-events-auto p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={handleProfileClick}
            >
              <User className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-32 left-4 right-20">
          <div className="text-white font-semibold text-base mb-2">@{currentVideo.author.username}</div>
          <div className="text-white text-sm mb-3 leading-relaxed">{currentVideo.description}</div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs">🎵</span>
            <div className="overflow-hidden whitespace-nowrap">
              <span className="inline-block animate-marquee text-white/80 text-xs">
                {currentVideo.musicName} &nbsp;&nbsp;&nbsp;&nbsp;
                {currentVideo.musicName}
              </span>
            </div>
          </div>
        </div>

        <ActionBar video={currentVideo} />

        <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              className="pointer-events-auto p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={handleMuteClick}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button 
              className="pointer-events-auto px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={handleSpeedClick}
            >
              <span className="text-white text-xs font-medium">{playbackRate}x</span>
            </button>
          </div>
          
          <ProgressBar />
        </div>
      </div>

      {showSpeedControl && <SpeedControl />}

      {currentIndex === 0 && swipeOffset > 0 && swipeOffset < 50 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-white/60 text-sm animate-pulse">
          下拉刷新
        </div>
      )}

      {currentIndex === videos.length - 1 && swipeOffset < 0 && swipeOffset > -50 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm animate-pulse">
          没有更多了
        </div>
      )}
    </div>
  );
};
