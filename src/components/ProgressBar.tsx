import { useRef, useCallback, useState, useEffect } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { formatTime } from '../utils/format';

export const ProgressBar = () => {
  const { currentTime, duration, buffered, setCurrentTime } = useVideoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  const handleSeek = useCallback((clientX: number) => {
    if (!containerRef.current || duration === 0) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
  }, [duration, setCurrentTime]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    handleSeek(e.clientX);
  }, [handleSeek]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setHoverPosition(e.clientX - rect.left);
    setHoverTime(percentage * duration);
    
    if (isDragging) {
      handleSeek(e.clientX);
    }
  }, [isDragging, duration, handleSeek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setHoverTime(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    handleSeek(e.touches[0].clientX);
  }, [handleSeek]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (isDragging) {
      handleSeek(e.touches[0].clientX);
    }
  }, [isDragging, handleSeek]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="relative h-1 bg-white/20 cursor-pointer group"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setHoverPosition(e.clientX - rect.left);
        setHoverTime(((e.clientX - rect.left) / rect.width) * duration);
      }}
      onMouseLeave={() => setHoverTime(null)}
    >
      <div 
        className="absolute top-0 left-0 h-full bg-white/30 transition-none"
        style={{ width: `${bufferedProgress}%` }}
      />
      
      <div 
        className="absolute top-0 left-0 h-full bg-red-500 transition-none"
        style={{ width: `${progress}%` }}
      />
      
      <div 
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${progress}%` }}
      />
      
      {hoverTime !== null && (
        <div 
          className="absolute -top-8 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: hoverPosition }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};
