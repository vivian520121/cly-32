import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveToastProps {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

export const SaveToast = ({ show, type, message }: SaveToastProps) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl',
        'animate-slide-down transition-all duration-300',
        type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-white" />
      ) : (
        <XCircle className="w-5 h-5 text-white" />
      )}
      <span className="text-white font-medium text-sm">{message}</span>
    </div>
  );
};
