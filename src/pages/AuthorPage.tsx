import { useCallback, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Share2, Grid3X3, Heart, Bookmark, UserPlus, Check, Settings } from 'lucide-react';
import { getUserById } from '../data/users';
import { getVideosByUserId } from '../data/videos';
import { useUserStore } from '../store/useUserStore';
import { useVideoStore } from '../store/useVideoStore';
import { formatNumber } from '../utils/format';

type TabType = 'works' | 'likes' | 'collects';

export const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { followUser, isUserFollowed, isVideoLiked, isVideoCollected } = useUserStore();
  const { setCurrentIndex, setPlaying } = useVideoStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('works');

  const author = id ? getUserById(id) : undefined;
  const authorVideos = id ? getVideosByUserId(id) : [];
  const isFollowed = id ? isUserFollowed(id) : false;

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleFollow = useCallback(() => {
    if (id) {
      followUser(id);
    }
  }, [id, followUser]);

  const handleVideoClick = useCallback((videoId: string) => {
    const index = authorVideos.findIndex(v => v.id === videoId);
    if (index > -1) {
      setCurrentIndex(index);
      setPlaying(true);
      navigate('/');
    }
  }, [authorVideos, setCurrentIndex, setPlaying, navigate]);

  if (!author) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white">{t('common.userDoesNotExist')}</p>
      </div>
    );
  }

  const tabs = useMemo<{ key: TabType; label: string; icon: React.ReactNode }[]>(() => [
    { key: 'works', label: t('common.works'), icon: <Grid3X3 className="w-5 h-5" /> },
    { key: 'likes', label: t('common.likes'), icon: <Heart className="w-5 h-5" /> },
    { key: 'collects', label: t('common.collects'), icon: <Bookmark className="w-5 h-5" /> },
  ], [t]);

  const getDisplayVideos = () => {
    switch (activeTab) {
      case 'works':
        return authorVideos;
      case 'likes':
        return authorVideos.filter(v => isVideoLiked(v.id));
      case 'collects':
        return authorVideos.filter(v => isVideoCollected(v.id));
      default:
        return authorVideos;
    }
  };

  const displayVideos = getDisplayVideos();

  return (
    <div className="w-full h-screen bg-black overflow-y-auto">
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white font-semibold text-lg">{author.username}</h1>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-start gap-4">
          <img 
            src={author.avatar}
            alt={author.username}
            className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover"
          />
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl">{author.username}</h2>
            <p className="text-gray-400 text-sm mt-1">{t('author.douyinId')} {author.id}</p>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">{author.bio}</p>
          </div>
        </div>

        <div className="flex items-center justify-around mt-6 py-3 border-y border-gray-800">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{formatNumber(author.followingCount)}</p>
            <p className="text-gray-400 text-xs mt-1">{t('common.following')}</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{formatNumber(author.followerCount)}</p>
            <p className="text-gray-400 text-xs mt-1">{t('author.followersCount', { count: formatNumber(author.followerCount) })}</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{formatNumber(author.likeCount)}</p>
            <p className="text-gray-400 text-xs mt-1">{t('common.likesReceived')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleFollow}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isFollowed
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isFollowed ? (
              <><Check className="w-4 h-4" /> {t('common.followed')}</>
            ) : (
              <><UserPlus className="w-4 h-4" /> {t('common.follow')}</>
            )}
          </button>
          <button className="px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold text-sm hover:bg-gray-700 transition-colors">
            {t('common.message')}
          </button>
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
            <Settings className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-500 text-sm">
              {activeTab === 'works' ? t('author.noWorks') : 
               activeTab === 'likes' ? t('author.noLikes') : t('author.noCollects')}
            </p>
          </div>
        ) : (
          displayVideos.map((video, index) => (
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
              {index < 3 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {t('common.hotLabel')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
