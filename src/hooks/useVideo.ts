import { useRef, useEffect, useCallback } from 'react';
import { useVideoStore } from '../store/useVideoStore';

interface UseVideoOptions {
  autoPlay?: boolean;
  playsInline?: boolean;
  loop?: boolean;
}

export const useVideo = (videoUrl: string, options: UseVideoOptions = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isPlaying,
    isMuted,
    playbackRate,
    currentTime,
    setPlaying,
    setMuted,
    setPlaybackRate,
    setCurrentTime,
    setDuration,
    setBuffered,
    setLoading,
  } = useVideoStore();

  const { autoPlay = true, playsInline = true, loop = true } = options;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleWaiting = () => {
      setLoading(true);
    };

    const handleCanPlay = () => {
      setLoading(false);
    };

    const handlePlay = () => {
      setPlaying(true);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [setDuration, setCurrentTime, setBuffered, setLoading, setPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        setPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying(!isPlaying);
  }, [isPlaying, setPlaying]);

  const toggleMute = useCallback(() => {
    setMuted(!isMuted);
  }, [isMuted, setMuted]);

  const changeSpeed = useCallback((rate: number) => {
    setPlaybackRate(rate);
  }, [setPlaybackRate]);

  return {
    videoRef,
    videoProps: {
      src: videoUrl,
      autoPlay,
      playsInline,
      loop,
      muted: isMuted,
      ref: videoRef,
    },
    seek,
    togglePlay,
    toggleMute,
    changeSpeed,
  };
};
