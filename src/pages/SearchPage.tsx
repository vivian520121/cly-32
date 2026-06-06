import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X, Clock, TrendingUp, Trash2 } from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';
import { formatNumber } from '../utils/format';

export const SearchPage = () => {
  const navigate = useNavigate();
  const {
    searchHistory,
    hotSearches,
    searchKeyword,
    initSearchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
    clearAllSearchHistory,
    performSearch,
    setSearchKeyword,
  } = useSearchStore();

  const [inputValue, setInputValue] = useState(searchKeyword);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    initSearchHistory();
  }, [initSearchHistory]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSearch = useCallback(() => {
    if (inputValue.trim()) {
      performSearch(inputValue.trim());
      navigate('/search/result');
    }
  }, [inputValue, performSearch, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleKeywordClick = useCallback((keyword: string) => {
    setInputValue(keyword);
    setSearchKeyword(keyword);
    addToSearchHistory(keyword);
    performSearch(keyword);
    navigate('/search/result');
  }, [addToSearchHistory, performSearch, setSearchKeyword, navigate]);

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
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
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
