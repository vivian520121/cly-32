import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Grid3X3, Heart, Bookmark, UserPlus, Edit, History, Trash2, X } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useVideoStore } from '../store/useVideoStore';
import { useSearchStore } from '../store/useSearchStore';
import { getVideosByUserId, getVideoById } from '../data/videos';
import { formatNumber, formatDate } from '../utils/format';
import { UnreadBadge } from '../components/UnreadBadge';
import type { Video } from '../types';

type TabType = 'works' | 'collects' | 'likes' | 'history';
type MenuType = 'following' | 'followers' | 'collections' | null;

interface HistoryVideo extends Video {
  browseTimestamp: number;
  browseProgress: number;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, interaction, isVideoLiked, isVideoCollected } = useUserStore();
  const { videos, setCurrentIndex, setPlaying } = useVideoStore();
  const { browseHistory, initBrowseHistory, clearAllBrowseHistory, removeFromBrowseHistory } = useSearchStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('works');
  const [showMenu, setShowMenu] = useState<MenuType>(null);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  const myVideos = getVideosByUserId('user-1');

  useEffect(() => {
    initBrowseHistory();
  }, [initBrowseHistory]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleClearHistory = useCallback(() => {
    clearAllBrowseHistory();
    setShowClearHistoryConfirm(false);
  }, [clearAllBrowseHistory]);

  const handleRemoveHistoryItem = useCallback((e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    removeFromBrowseHistory(videoId);
  }, [removeFromBrowseHistory]);

  const handleVideoClick = useCallback((videoId: string) => {
    const globalIndex = videos.findIndex(v => v.id === videoId);
    if (globalIndex > -1) {
      setCurrentIndex(globalIndex);
      setPlaying(true);
      navigate('/');
    }
  }, [videos, setCurrentIndex, setPlaying, navigate]);

  const handleMenuClick = useCallback((menu: MenuType) => {
    setShowMenu(showMenu === menu ? null : menu);
  }, [showMenu]);

  const handleAuthorClick = useCallback((userId: string) => {
    navigate(`/author/${userId}`);
  }, [navigate]);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'works', label: '作品', icon: <Grid3X3 className="w-5 h-5" /> },
    { key: 'collects', label: '收藏', icon: <Bookmark className="w-5 h-5" /> },
    { key: 'likes', label: '喜欢', icon: <Heart className="w-5 h-5" /> },
    { key: 'history', label: '历史', icon: <History className="w-5 h-5" /> },
  ];

  const getDisplayVideos = () => {
    switch (activeTab) {
      case 'works':
        return myVideos;
      case 'collects':
        return videos.filter(v => isVideoCollected(v.id));
      case 'likes':
        return videos.filter(v => isVideoLiked(v.id));
      default:
        return myVideos;
    }
  };

  const historyVideos: HistoryVideo[] = browseHistory
    .map(item => {
      const video = getVideoById(item.videoId);
      if (!video) return null;
      return {
        ...video,
        browseTimestamp: item.timestamp,
        browseProgress: item.progress,
      };
    })
    .filter((item): item is HistoryVideo => item !== null);

  const displayVideos = getDisplayVideos();
  const followingList = interaction.followingUsers;
  const followerList = ['user-2', 'user-3', 'user-4', 'user-5'];

  const MenuContent = () => {
    if (showMenu === 'following') {
      return (
        <div className="fixed inset-0 z-50 bg-black animate-fade-in">
          <div className="sticky top-0 bg-black z-10 flex items-center justify-between p-4 border-b border-gray-800">
            <button onClick={() => setShowMenu(null)} className="p-2">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-white font-semibold text-lg">关注</h2>
            <div className="w-10" />
          </div>
          <div className="p-4">
            {followingList.length === 0 ? (
              <div className="py-20 text-center">
                <UserPlus className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">还没有关注任何人</p>
              </div>
            ) : (
              followingList.map(userId => {
                const user = useUserStore.getState().getUserById(userId);
                if (!user) return null;
                return (
                  <div key={userId} className="flex items-center gap-3 py-3" onClick={() => handleAuthorClick(userId)}>
                    <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-gray-400 text-xs">{formatNumber(user.followerCount)} 粉丝</p>
                    </div>
                    <button className="px-4 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-full">
                      已关注
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    if (showMenu === 'followers') {
      return (
        <div className="fixed inset-0 z-50 bg-black animate-fade-in">
          <div className="sticky top-0 bg-black z-10 flex items-center justify-between p-4 border-b border-gray-800">
            <button onClick={() => setShowMenu(null)} className="p-2">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-white font-semibold text-lg">粉丝</h2>
            <div className="w-10" />
          </div>
          <div className="p-4">
            {followerList.map(userId => {
              const user = useUserStore.getState().getUserById(userId);
              if (!user) return null;
              const isFollowed = useUserStore.getState().isUserFollowed(userId);
              return (
                <div key={userId} className="flex items-center gap-3 py-3" onClick={() => handleAuthorClick(userId)}>
                  <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-gray-400 text-xs">{formatNumber(user.followerCount)} 粉丝</p>
                  </div>
                  <button 
                    className={`px-4 py-1.5 text-sm rounded-full ${
                      isFollowed 
                        ? 'bg-gray-800 text-gray-300' 
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {isFollowed ? '已关注' : '关注'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-screen bg-black overflow-y-auto">
      <MenuContent />

      <div className="sticky top-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/messages')}
              className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
            >
              <UnreadBadge />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Edit className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-start gap-4">
          <img 
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover"
          />
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl">{currentUser.username}</h2>
            <p className="text-gray-400 text-sm mt-1">抖音号: {currentUser.id}</p>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">{currentUser.bio}</p>
            <button className="mt-3 px-4 py-1.5 border border-gray-600 text-gray-300 text-xs rounded-full hover:bg-white/10 transition-colors">
              编辑资料
            </button>
          </div>
        </div>

        <div className="flex items-center justify-around mt-6 py-3 border-y border-gray-800">
          <button 
            className="text-center"
            onClick={() => handleMenuClick('following')}
          >
            <p className="text-white font-bold text-lg">{formatNumber(followingList.length)}</p>
            <p className="text-gray-400 text-xs mt-1">关注</p>
          </button>
          <button 
            className="text-center"
            onClick={() => handleMenuClick('followers')}
          >
            <p className="text-white font-bold text-lg">{formatNumber(followerList.length)}</p>
            <p className="text-gray-400 text-xs mt-1">粉丝</p>
          </button>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{formatNumber(currentUser.likeCount)}</p>
            <p className="text-gray-400 text-xs mt-1">获赞</p>
          </div>
        </div>
      </div>

      <div className="flex items-center border-b border-gray-800 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === tab.key ? 'text-white' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'history' && historyVideos.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <span className="text-gray-400 text-sm">共 {historyVideos.length} 条浏览记录</span>
          <button
            onClick={() => setShowClearHistoryConfirm(true)}
            className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
          >
            清空历史
          </button>
        </div>
      )}

      {activeTab === 'history' ? (
        <div className="p-4">
          {historyVideos.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <History className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-gray-500 text-sm">暂无浏览记录</p>
              <p className="text-gray-600 text-xs mt-2">去看看精彩视频吧</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-3 p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={video.coverUrl}
                      alt={video.description}
                      className="w-full h-full object-cover"
                    />
                    {video.browseProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${Math.min(video.browseProgress, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <p className="text-white text-sm line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                      <span>@{video.author?.username}</span>
                      <span>·</span>
                      <span>{formatNumber(video.likeCount)} 赞</span>
                    </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-xs">
                          {formatDate(new Date(video.browseTimestamp).toISOString())}
                        </span>
                        <button
                          onClick={(e) => handleRemoveHistoryItem(e, video.id)}
                          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600 hover:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {displayVideos.length === 0 ? (
            <div className="col-span-3 py-20 flex flex-col items-center justify-center">
              <Grid3X3 className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-gray-500 text-sm">
                {activeTab === 'works' ? '暂无作品，快去发布吧' :
                 activeTab === 'collects' ? '暂无收藏作品' : '暂无喜欢的作品'}
              </p>
            </div>
          ) : (
            displayVideos.map((video) => (
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
                  <div className="flex items-center gap-1 text-white text-xs">
                    <Heart className="w-3 h-3" fill="white" />
                    <span>{formatNumber(video.likeCount)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="w-[80%] max-w-sm bg-gray-900 rounded-2xl p-6 animate-scale-in">
            <div className="text-center mb-4">
              <Trash2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-white font-semibold text-lg">确定清空浏览历史？</h3>
              <p className="text-gray-500 text-sm mt-2">清空后将无法恢复</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearHistoryConfirm(false)}
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
