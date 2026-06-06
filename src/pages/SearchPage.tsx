import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X, Clock, TrendingUp, Trash2, Heart, ChevronLeft } from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';
import { useVideoStore } from '../store/useVideoStore';
import { formatNumber } from '../utils/format';

type SearchView = 'suggestion' | 'result';

export const SearchPage = () => {
  const navigate = useNavigate();
  const {
    searchHistory,
    hotSearches,
    searchKeyword,
    searchResults,
    isSearching,
    initSearchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
    clearAllSearchHistory,
    performSearch,
    setSearchKeyword,
    clearSearchResults,
  } = useSearchStore();
  const { videos, setCurrentIndex, setPlaying } = useVideoStore();

  const [inputValue, setInputValue] = useState(searchKeyword);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentView, setCurrentView] = useState<SearchView>(
    searchKeyword && searchResults.length > 0 ? 'result' : 'suggestion'
  );

  useEffect(() => {
    initSearchHistory();
  }, [initSearchHistory]);

  const handleBack = useCallback(() => {
    if (currentView === 'result') {
      setCurrentView('suggestion');
      clearSearchResults();
      setInputValue('');
    } else {
      navigate(-1);
    }
  }, [currentView, clearSearchResults, setInputValue, navigate]);

  const handleSearch = useCallback(() => {
    if (inputValue.trim()) {
      performSearch(inputValue.trim());
      setCurrentView('result');
    }
  }, [inputValue, performSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleKeywordClick = useCallback((keyword: string) => {
    setInputValue(keyword);
    setSearchKeyword(keyword);
    performSearch(keyword);
    setCurrentView('result');
  }, [performSearch, setSearchKeyword]);

  const handleClearInput = useCallback(() => {
    setInputValue('');
  }, []);

  const handleClearHistory = useCallback(() => {
    clearAllSearchHistory();
    setShowClearConfirm(false);
  }, [clearAllSearchHistory]);

  const handleRemoveHistory = useCallback((e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    removeFromSearchHistory(keyword);
  }, [removeFromSearchHistory]);

  const handleVideoClick = useCallback((videoId: string) => {
    const globalIndex = videos.findIndex(v => v.id === videoId);
    if (globalIndex > -1) {
      setCurrentIndex(globalIndex);
      setPlaying(true);
      navigate('/');
    }
  }, [videos, setCurrentIndex, setPlaying, navigate]);

  const handleBackToSuggestion = useCallback(() => {
    setCurrentView('suggestion');
    clearSearchResults();
  }, [clearSearchResults]);

  const handleInputFocus = useCallback(() => {
    if (currentView === 'result') {
      setCurrentView('suggestion');
    }
  }, [currentView]);

  return (
    <div className="w-full h-screen bg-black overflow-y-auto">
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {currentView === 'result' ? (
              <ChevronLeft className="w-6 h-6 text-white" />
            ) : (
              <ArrowLeft className="w-6 h-6 text-white" />
            )}
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              placeholder="搜索视频、用户、音乐"
              className="w-full h-10 pl-10 pr-10 bg-gray-900 text-white text-sm rounded-full outline-none focus:ring-2 focus:ring-red-500/50 placeholder:text-gray-500"
              autoFocus
            />
            {inputValue && (
              <button
                onClick={handleClearInput}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>

      {currentView === 'suggestion' ? (
        <div className="p-4">
          {searchHistory.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-semibold">搜索历史</span>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
                >
                  清空
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item) => (
                  <div
                    key={item.keyword}
                    onClick={() => handleKeywordClick(item.keyword)}
                    className="group flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-gray-300 text-sm">{item.keyword}</span>
                    <button
                      onClick={(e) => handleRemoveHistory(e, item.keyword)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-gray-700 transition-all"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span className="text-white font-semibold">热门热搜</span>
            </div>
            <div className="space-y-3">
              {hotSearches.slice(0, 10).map((item, index) => (
                <div
                  key={item.keyword}
                  onClick={() => handleKeywordClick(item.keyword)}
                  className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-900/50 transition-colors"
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded ${
                      index < 3
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm truncate">
                        {item.keyword}
                      </span>
                      {item.isHot && (
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                          热
                        </span>
                      )}
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                          新
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {formatNumber(item.hot)} 热度
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">找到</span>
              <span className="text-white font-semibold">{searchResults.length}</span>
              <span className="text-gray-400 text-sm">个相关视频</span>
            </div>
            <button
              onClick={handleBackToSuggestion}
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              换个关键词
            </button>
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
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="w-[80%] max-w-sm bg-gray-900 rounded-2xl p-6 animate-scale-in">
            <div className="text-center mb-4">
              <Trash2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-white font-semibold text-lg">确定清空搜索历史？</h3>
              <p className="text-gray-500 text-sm mt-2">清空后将无法恢复</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-3 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
