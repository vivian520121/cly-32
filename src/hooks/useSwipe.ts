import { useRef, useCallback, useEffect } from 'react';
import type { SwipeDirection } from '../types';

type ReactTouchEvent = React.TouchEvent<HTMLDivElement>;

interface UseSwipeOptions {
  threshold?: number;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeStart?: (e: ReactTouchEvent) => void;
  onSwipeMove?: (e: ReactTouchEvent, deltaY: number) => void;
  onSwipeEnd?: (e: ReactTouchEvent, direction: SwipeDirection) => void;
  preventDefault?: boolean;
}

export const useSwipe = (options: UseSwipeOptions = {}) => {
  const {
    threshold = 50,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    preventDefault = true,
  } = options;

  const startY = useRef(0);
  const startX = useRef(0);
  const currentY = useRef(0);
  const currentX = useRef(0);
  const startTime = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: ReactTouchEvent) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startX.current = touch.clientX;
    currentY.current = touch.clientY;
    currentX.current = touch.clientX;
    startTime.current = Date.now();
    isDragging.current = true;
    
    onSwipeStart?.(e);
  }, [onSwipeStart]);

  const handleTouchMove = useCallback((e: ReactTouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    currentY.current = touch.clientY;
    currentX.current = touch.clientX;
    
    const deltaY = currentY.current - startY.current;
    const deltaX = currentX.current - startX.current;
    
    if (preventDefault && Math.abs(deltaY) > Math.abs(deltaX)) {
      e.preventDefault();
    }
    
    onSwipeMove?.(e, deltaY);
  }, [preventDefault, onSwipeMove]);

  const handleTouchEnd = useCallback((e: ReactTouchEvent) => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    
    const deltaY = currentY.current - startY.current;
    const deltaX = currentX.current - startX.current;
    const deltaTime = Date.now() - startTime.current;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    let direction: SwipeDirection = null;
    
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (Math.abs(deltaY) > threshold || velocity > 0.5) {
        direction = deltaY < 0 ? 'up' : 'down';
      }
    } else {
      if (Math.abs(deltaX) > threshold) {
        direction = deltaX < 0 ? 'left' : 'right';
      }
    }
    
    if (direction === 'up') onSwipeUp?.();
    if (direction === 'down') onSwipeDown?.();
    if (direction === 'left') onSwipeLeft?.();
    if (direction === 'right') onSwipeRight?.();
    
    onSwipeEnd?.(e, direction);
    
    startY.current = 0;
    startX.current = 0;
    currentY.current = 0;
    currentX.current = 0;
    startTime.current = 0;
  }, [threshold, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeEnd]);

  useEffect(() => {
    return () => {
      isDragging.current = false;
    };
  }, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
