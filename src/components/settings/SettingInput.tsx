import { cn } from '@/lib/utils';

interface SettingInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const SettingInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  error,
  disabled,
  className,
  maxLength,
  showCount = false,
}: SettingInputProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm',
            'placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all',
            error ? 'border-red-500' : 'border-gray-700',
            disabled && 'opacity-50 cursor-not-allowed',
            showCount && maxLength && 'pr-16'
          )}
        />
        {showCount && maxLength && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};
