import { Bell } from 'lucide-react';
import { useMessageStore } from '../store/useMessageStore';
import { cn } from '../lib/utils';
import { formatNumber } from '../utils/format';

interface UnreadBadgeProps {
  className?: string;
  showZero?: boolean;
}

export const UnreadBadge = ({ className, showZero = false }: UnreadBadgeProps) => {
  const unreadCount = useMessageStore((state) => state.unreadCount);

  if (unreadCount === 0 && !showZero) return null;

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <Bell className={cn('w-6 h-6', unreadCount > 0 ? 'text-white' : 'text-gray-300')} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
          {formatNumber(unreadCount)}
        </span>
      )}
    </div>
  );
};
