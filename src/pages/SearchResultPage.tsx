import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Heart } from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';
import { useVideoStore } from '../store/useVideoStore';
import { formatNumber } from '../utils/format';

export const SearchResultPage = () => {
  const navigate = useNavigate();
  const { searchResults, searchKeyword, isSearching, clearSearchResults } = useSearchStore();
  const { videos, setCurrentIndex, setPlaying } = useVideoStore();

  useEffect(() => {
    if (!searchKeyword && searchResults.length === 0) {
      navigate('/search');
    }
  }, [searchKeyword, searchResults.length, navigate]);

  const handleBack = useCallback(() => {
    clearSearchResults();
    navigate('/search');
  }, [clearSearchResults, navigate]);

  const handleVideoClick = useCallback((videoId: string) => {
    const globalIndex = videos.findIndex(v => v.id === videoId);
    if (globalIndex > -1) {
      setCurrentIndex(globalIndex);
      setPlaying(true);
      navigate('/');
    }
  }, [videos, setCurrentIndex, setPlaying, navigate]);

  return (
    <div className="w-full h-screen bg-black overflow-y-auto">
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full">
            <Search className="w-5 h-5 text-gray-500" />
            <span className="text-white text-sm truncate">{searchKeyword}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">找到</span>
          <span className="text-white font-semibold">{searchResults.length}</span>
          <span className="text-gray-400 text-sm">个相关视频</span>
        </div>

        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">搜索中...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-500 text-sm">没有找到相关视频</p>
            <p className="text-gray-600 text-xs mt-2">换个关键词试试吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {searchResults.map((video) => (
              <div
                key={video.id}
                className="relative aspect-[9/16] bg-gray-800 cursor-pointer overflow-hidden"
                onClick={() => handleVideoClick(video.id)}
              >
                <img
                  src={video.coverUrl}
                  alt={video.description}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs line-clamp-2 mb-1">{video.description}</p>
                  <div className="flex items-center gap-1 text-white text-xs">
                    <Heart className="w-3 h-3" fill="white" />
                    <span>{formatNumber(video.likeCount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
