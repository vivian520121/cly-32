import { cn } from '@/lib/utils';

interface SettingSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  showValue?: boolean;
  unit?: string;
}

export const SettingSlider = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  showValue = true,
  unit = '',
}: SettingSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex-1 relative h-2 bg-gray-700 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none transition-all"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      {showValue && (
        <span className="text-gray-400 text-sm min-w-[50px] text-right">
          {value}{unit}
        </span>
      )}
    </div>
  );
};
