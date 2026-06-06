import type { Message, MessageType, LikeContent, CommentReplyContent } from '../types';
import { users, currentUser } from './users';
import { videos } from './videos';

const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createLikeMessage = (senderIndex: number, videoIndex: number, minutesAgo: number): Message => {
  const sender = users[senderIndex % users.length];
  const video = videos[videoIndex % videos.length];
  const content: LikeContent = {
    videoId: video.id,
    videoCover: video.coverUrl,
    videoDescription: video.description,
  };
  return {
    id: generateId(),
    type: 'like' as MessageType,
    senderId: sender.id,
    sender,
    receiverId: currentUser.id,
    content,
    resourceUrl: `/video/${video.id}`,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    isRead: minutesAgo > 120,
  };
};

const createCommentReplyMessage = (
  senderIndex: number,
  videoIndex: number,
  minutesAgo: number,
  originalComment: string,
  replyContent: string
): Message => {
  const sender = users[senderIndex % users.length];
  const video = videos[videoIndex % videos.length];
  const content: CommentReplyContent = {
    videoId: video.id,
    videoCover: video.coverUrl,
    originalCommentId: `comment-${Math.random().toString(36).substr(2, 9)}`,
    originalCommentContent: originalComment,
    replyContent,
  };
  return {
    id: generateId(),
    type: 'comment_reply' as MessageType,
    senderId: sender.id,
    sender,
    receiverId: currentUser.id,
    content,
    resourceUrl: `/video/${video.id}#comment-${content.originalCommentId}`,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    isRead: minutesAgo > 120,
  };
};

const originalComments = [
  '这个视频拍得太好了，学习了！',
  '请问这个是在哪里拍的呀？太美了',
  '求教程！看起来很简单的样子',
  '背景音乐是什么呀？好好听',
  'up主什么时候更新呀？等不及了',
  '这个特效是怎么做到的？太厉害了',
  '第一次看你的视频，直接关注了',
  '这个方法真的有用吗？我也想试试',
];

const replyContents = [
  '谢谢支持！我会继续努力的 💪',
  '这个是在云南大理拍的哦，推荐你去玩！',
  '教程已经发了，去我主页看看吧',
  '背景音乐是《晴天》，周杰伦的歌',
  '正在剪了正在剪了，马上就更！',
  '用的是AE的粒子特效，不难学的',
  '欢迎欢迎！以后常来玩呀 😊',
  '亲测有效！我已经用了三个月了',
  '感谢认可，我也很喜欢这个作品',
  '你也可以的，多练习就好了！',
];

export const generateMockMessages = (count: number = 30): Message[] => {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    const isLike = Math.random() > 0.4;
    if (isLike) {
      messages.push(createLikeMessage(i, i, i * 15 + Math.random() * 10));
    } else {
      messages.push(
        createCommentReplyMessage(
          i,
          i,
          i * 20 + Math.random() * 15,
          originalComments[i % originalComments.length],
          replyContents[i % replyContents.length]
        )
      );
    }
  }
  return messages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockMessages: Message[] = generateMockMessages(30);

export const fetchMessagesAPI = async (
  page: number = 1,
  pageSize: number = 10,
  tab?: MessageType | 'all'
): Promise<{ messages: Message[]; hasMore: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 100));

  let filtered = [...mockMessages];
  if (tab && tab !== 'all') {
    filtered = filtered.filter((m) => m.type === tab);
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const hasMore = endIndex < filtered.length;
  const messages = filtered.slice(startIndex, endIndex);

  return { messages, hasMore };
};

export const generateRandomMessage = (): Message => {
  const isLike = Math.random() > 0.4;
  const randomUserIndex = Math.floor(Math.random() * users.length);
  const randomVideoIndex = Math.floor(Math.random() * videos.length);

  if (isLike) {
    return createLikeMessage(randomUserIndex, randomVideoIndex, 0);
  } else {
    return createCommentReplyMessage(
      randomUserIndex,
      randomVideoIndex,
      0,
      originalComments[Math.floor(Math.random() * originalComments.length)],
      replyContents[Math.floor(Math.random() * replyContents.length)]
    );
  }
};
