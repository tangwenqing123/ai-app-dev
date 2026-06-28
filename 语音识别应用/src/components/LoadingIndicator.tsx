import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = '正在处理中...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <p className="text-dark-text text-sm">{message}</p>
    </div>
  );
}
