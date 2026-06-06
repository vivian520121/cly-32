import { Heart, MessageCircle, Bell } from 'lucide-react';
import { MessageType } from '../types';
import { useMessageStore } from '../store/useMessageStore';
import { cn } from '../lib/utils';
import { formatNumber } from '../utils/format';

interface TabItem {
  key: MessageType | 'all';
  label: string;
  icon: typeof Heart;
}

const tabs: TabItem[] = [
  { key: 'all', label: '全部', icon: Bell },
  { key: MessageType.LIKE, label: '点赞', icon: Heart },
  { key: MessageType.COMMENT_REPLY, label: '回复', icon: MessageCircle },
];

export const MessageTabs = () => {
  const activeTab = useMessageStore((state) => state.activeTab);
  const setActiveTab = useMessageStore((state) => state.setActiveTab);
  const unreadCount = useMessageStore((state) => state.unreadCount);
  const getUnreadCountByType = useMessageStore((state) => state.getUnreadCountByType);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            const count =
              tab.key === 'all'
                ? unreadCount
                : getUnreadCountByType(tab.key as MessageType);

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold rounded-full',
                      isActive
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-600'
                    )}
                  >
                    {formatNumber(count)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
