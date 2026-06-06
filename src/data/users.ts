import type { User } from '../types';

export const currentUser: User = {
  id: 'user-0',
  username: '我自己',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
  bio: '热爱生活，记录美好瞬间',
  followerCount: 128,
  followingCount: 256,
  likeCount: 1024,
};

export const users: User[] = [
  {
    id: 'user-1',
    username: '旅行达人小雨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoyu',
    bio: '用镜头记录世界的美好 🌍',
    followerCount: 12580,
    followingCount: 328,
    likeCount: 89600,
  },
  {
    id: 'user-2',
    username: '美食家阿杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ajie',
    bio: '吃遍天下美食 🍜',
    followerCount: 56800,
    followingCount: 156,
    likeCount: 325600,
  },
  {
    id: 'user-3',
    username: '健身教练Lily',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily',
    bio: '每天运动一小时，健康生活一辈子 💪',
    followerCount: 32500,
    followingCount: 89,
    likeCount: 156800,
  },
  {
    id: 'user-4',
    username: '萌宠乐园',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pet',
    bio: '分享可爱的宠物日常 🐱🐶',
    followerCount: 89600,
    followingCount: 456,
    likeCount: 523000,
  },
  {
    id: 'user-5',
    username: '音乐制作人小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
    bio: '用音乐讲述故事 🎵',
    followerCount: 23400,
    followingCount: 178,
    likeCount: 98700,
  },
  {
    id: 'user-6',
    username: '街舞少年',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dance',
    bio: '热爱街舞，享受每一个节拍 💃',
    followerCount: 45600,
    followingCount: 234,
    likeCount: 234000,
  },
  {
    id: 'user-7',
    username: '摄影师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=laowang',
    bio: '用相机定格美好瞬间 📷',
    followerCount: 78900,
    followingCount: 567,
    likeCount: 456000,
  },
  {
    id: 'user-8',
    username: '搞笑日常',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=funny',
    bio: '每天分享快乐，让生活更有趣 😄',
    followerCount: 125000,
    followingCount: 678,
    likeCount: 890000,
  },
  {
    id: 'user-9',
    username: '手工达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=craft',
    bio: '用心创造每一件手工艺品 ✂️',
    followerCount: 34500,
    followingCount: 345,
    likeCount: 178000,
  },
  {
    id: 'user-10',
    username: '科技爱好者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    bio: '探索科技的无限可能 🚀',
    followerCount: 67800,
    followingCount: 234,
    likeCount: 345000,
  },
];

export const getUserById = (id: string): User | undefined => {
  if (id === currentUser.id) return currentUser;
  return users.find((user) => user.id === id);
};
