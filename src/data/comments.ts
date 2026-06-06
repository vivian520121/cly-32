import type { Comment } from '../types';
import { users, currentUser } from './users';
import { videos } from './videos';

const commentContents = [
  '太美了！请问这是哪里拍的？',
  '看着就好吃，下次一定要去尝尝',
  '太厉害了！我也想练成这样',
  '好可爱啊！是什么品种的猫？',
  '这首歌叫什么名字？好好听',
  '跳得真好！加油！',
  '我也想去！请问花费大概多少？',
  '收藏了，周末试试做',
  '手太巧了！能出个教程吗？',
  '是什么型号？看起来不错',
  '同感！下雨天最适合听音乐了',
  '太萌了！我也想养一只',
  '第二套好看！链接有吗？',
  '变化太大了！怎么做到的？',
  '哈哈哈，笑死我了',
  '早起的人真自律',
  '我上次也去了，感觉一般',
  '真的有用吗？我也想买',
  '需要准备什么装备吗？',
  '看哭了，太感人了',
  '画质真好，用什么拍的？',
  '背景音乐是什么？',
  '羡慕了，我也想去',
  '看起来好专业的样子',
  '支持！拍得越来越好',
  '这个角度绝了！',
  '第一次评论，有点紧张',
  '博主回复我一下吧！',
  '比心❤️',
  '来了来了，前排占座',
];

const generateCommentsForVideo = (videoId: string, count: number): Comment[] => {
  const comments: Comment[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = i % 2 === 0 ? users[i % users.length] : currentUser;
    const comment: Comment = {
      id: `comment-${videoId}-${i}`,
      videoId,
      userId: user.id,
      parentId: null,
      content: commentContents[i % commentContents.length],
      likeCount: Math.floor(Math.random() * 1000) + 10,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      user,
      replies: [],
      replyCount: Math.floor(Math.random() * 5),
    };
    
    if (comment.replyCount && comment.replyCount > 0) {
      for (let j = 0; j < comment.replyCount; j++) {
        const replyUser = users[(i + j) % users.length];
        const reply: Comment = {
          id: `reply-${videoId}-${i}-${j}`,
          videoId,
          userId: replyUser.id,
          parentId: comment.id,
          content: commentContents[(i + j + 5) % commentContents.length],
          likeCount: Math.floor(Math.random() * 100) + 1,
          createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
          user: replyUser,
        };
        comment.replies?.push(reply);
      }
    }
    
    comments.push(comment);
  }
  
  return comments;
};

export const allComments: Comment[] = videos.flatMap((video) => 
  generateCommentsForVideo(video.id, video.commentCount > 50 ? 50 : video.commentCount)
);

export const getCommentsByVideoId = (videoId: string, page: number = 1, pageSize: number = 10): { comments: Comment[]; hasMore: boolean } => {
  const videoComments = allComments.filter((c) => c.videoId === videoId);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    comments: videoComments.slice(start, end),
    hasMore: end < videoComments.length,
  };
};

export const addComment = (videoId: string, content: string, parentId: string | null = null): Comment => {
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    videoId,
    userId: currentUser.id,
    parentId,
    content,
    likeCount: 0,
    createdAt: new Date().toISOString(),
    user: currentUser,
    replies: parentId ? undefined : [],
    replyCount: 0,
  };
  
  allComments.unshift(newComment);
  return newComment;
};
