import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Grid3X3, Heart, Bookmark, UserPlus, Users, UserCheck, Edit, LogOut, ChevronRight } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useVideoStore } from '../store/useVideoStore';
import { getVideosByUserId } from '../data/videos';
import { formatNumber } from '../utils/format';

type TabType = 'works' | 'collects' | 'likes';
type MenuType = 'following' | 'followers' | 'collections' | null;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, interaction, isVideoLiked, isVideoCollected } = useUserStore();
  const { videos, setCurrentIndex, setPlaying } = useVideoStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('works');
  const [showMenu, setShowMenu] = useState<MenuType>(null);

  const myVideos = getVideosByUserId('user-1');

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

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
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Edit className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
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
    </div>
  );
};
