import { useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { useVideo } from '../hooks/useVideo';
import { useVideoStore } from '../store/useVideoStore';
import { useUIStore } from '../store/useUIStore';

interface VideoPlayerProps {
  videoUrl: string;
  coverUrl: string;
  isActive: boolean;
}

export const VideoPlayer = ({ videoUrl, coverUrl, isActive }: VideoPlayerProps) => {
  const { videoProps, togglePlay } = useVideo(videoUrl, { autoPlay: isActive });
  const { isPlaying, isLoading, currentTime, duration } = useVideoStore();
  const { showControls } = useUIStore();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlay();
  }, [togglePlay]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden" onClick={handleClick}>
      <video
        {...videoProps}
        className="w-full h-full object-contain"
        poster={coverUrl}
        webkit-playsinline="true"
        x5-playsinline="true"
        style={{ transform: 'translateZ(0)' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {showControls && !isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </div>
        </div>
      )}
      
      {showControls && isPlaying && !isLoading && (
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="text-xs text-white/60">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  );
};

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
