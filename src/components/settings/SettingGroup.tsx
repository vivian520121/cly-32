import { cn } from '@/lib/utils';

interface SettingGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingGroup = ({ title, description, children, className }: SettingGroupProps) => {
  return (
    <div className={cn('mb-8', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-white font-semibold text-lg">{title}</h2>}
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
      )}
      <div className="bg-gray-900/50 rounded-xl p-4">
        {children}
      </div>
    </div>
  );
};
