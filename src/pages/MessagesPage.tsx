import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MessageTabs } from '../components/MessageTabs';
import { MessageList } from '../components/MessageList';

export const MessagesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">消息中心</h1>
          <button className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <MessageTabs />
      <MessageList />
    </div>
  );
};
