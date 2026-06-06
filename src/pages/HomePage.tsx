import { VideoFeed } from '../components/VideoFeed';
import { CommentModal } from '../components/CommentModal';

export const HomePage = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <VideoFeed />
      <CommentModal />
    </div>
  );
};
