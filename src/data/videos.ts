import type { Video } from '../types';
import { users } from './users';

const sampleVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
];

const descriptions = [
  '今天的日落真的太美了，随手拍下来分享给大家 🌅 #日落 #风景',
  '发现了一家超好吃的小店，味道绝了！🍜 #美食 #探店',
  '今天练了一个新动作，终于做到了！💪 #健身 #自律',
  '我家猫咪今天太可爱了，忍不住拍下来 🐱 #萌宠 #日常',
  '分享一首我最近一直在循环的歌 🎵 #音乐 #分享',
  '第一次尝试跳这个舞，跳得不好请见谅 💃 #舞蹈 #新人',
  '这个地方真的太美了，推荐大家来玩 🌍 #旅行 #风景',
  '今天教大家做一道简单又好吃的菜 👨‍🍳 #做饭 #教程',
  '来看看我新做的手工，是不是很漂亮 ✂️ #手工 #DIY',
  '今天的科技新品开箱，太惊艳了！📱 #数码 #开箱',
  '下雨天和音乐更配哦 🎧 #日常 #随拍',
  '给大家看看我养的小宠物，它叫豆豆 🐶 #宠物 #可爱',
  '今天的穿搭分享，你喜欢哪一套？👗 #穿搭 #时尚',
  '挑战100天减脂第30天，看看变化有多大 💪 #减肥 #打卡',
  '这个特效太好玩了，哈哈哈 😄 #特效 #搞笑',
  '带你看看凌晨5点的城市 🌆 #城市 #早起',
  '今天试了一下网红店，结果... 🤔 #测评 #美食',
  '用了三个月的护肤品，效果怎么样？💄 #美妆 #测评',
  '第一次露营，体验太棒了！⛺️ #露营 #户外',
  '这是我听过最感人的故事，分享给大家 ❤️ #故事 #情感',
];

const musicNames = [
  '原声 - 旅行达人小雨',
  '热门BGM - 夏日风情',
  '轻音乐 - 午后时光',
  '抖音热歌 - 想你的夜',
  '原创音乐 - 风中的旋律',
  '经典老歌 - 海阔天空',
  '电子音乐 - 节奏派对',
  '民谣 - 远方的故事',
  '钢琴曲 - 梦中的婚礼',
  '流行歌曲 - 小幸运',
];

export const generateVideos = (): Video[] => {
  return sampleVideos.map((url, index) => {
    const userIndex = index % users.length;
    return {
      id: `video-${index + 1}`,
      userId: users[userIndex].id,
      videoUrl: url,
      coverUrl: `https://picsum.photos/seed/video${index + 1}/400/700`,
      description: descriptions[index],
      musicName: musicNames[index % musicNames.length],
      likeCount: Math.floor(Math.random() * 100000) + 1000,
      commentCount: Math.floor(Math.random() * 5000) + 100,
      shareCount: Math.floor(Math.random() * 2000) + 50,
      collectCount: Math.floor(Math.random() * 8000) + 200,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      author: users[userIndex],
    };
  });
};

export const videos: Video[] = generateVideos();

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((video) => video.id === id);
};

export const getVideosByUserId = (userId: string): Video[] => {
  return videos.filter((video) => video.userId === userId);
};
