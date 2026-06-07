import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface SettingSelectOption<T> {
  value: T;
  label: string;
}

interface SettingSelectProps<T> {
  value: T;
  options: SettingSelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

export function SettingSelect<T extends string | number>({
  value,
  options,
  onChange,
  className,
  disabled,
}: SettingSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-sm text-gray-300',
          'hover:bg-gray-700 transition-colors min-w-[120px] justify-between',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span>{selectedOption?.label || value}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 min-w-[140px]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-2.5 text-left text-sm transition-colors',
                'hover:bg-gray-700',
                option.value === value
                  ? 'text-red-500 bg-gray-700/50'
                  : 'text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
