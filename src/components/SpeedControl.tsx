import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';
import { useUIStore } from '../store/useUIStore';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const SpeedControl = () => {
  const { t } = useTranslation();
  const { playbackRate, setPlaybackRate } = useVideoStore();
  const { setShowSpeedControl } = useUIStore();

  const handleSelect = useCallback((speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedControl(false);
  }, [setPlaybackRate, setShowSpeedControl]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSpeedControl(false);
  }, [setShowSpeedControl]);

  return (
    <div 
      className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-900/95 rounded-2xl p-6 w-64 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">{t('video.playbackSpeed')}</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {SPEEDS.map((speed) => (
            <button
              key={speed}
              onClick={() => handleSelect(speed)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                playbackRate === speed
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {speed}x
              {speed === 1 && ` ${t('video.normal')}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
