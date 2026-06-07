import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingItemProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  bordered?: boolean;
}

export const SettingItem = ({
  icon,
  title,
  description,
  rightElement,
  onClick,
  className,
  bordered = true,
}: SettingItemProps) => {
  const content = (
    <div
      className={cn(
        'flex items-center justify-between py-4',
        bordered && 'border-b border-gray-800',
        onClick && 'cursor-pointer hover:bg-gray-800/50 transition-colors -mx-4 px-4',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium">{title}</h3>
          {description && (
            <p className="text-gray-500 text-sm mt-0.5 truncate">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        {rightElement}
        {onClick && !rightElement && (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" className="w-full text-left" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
};
