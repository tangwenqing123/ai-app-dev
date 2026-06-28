import { Loader2 } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
      <p className="text-lg">AI 正在创作中，请稍候...</p>
      <p className="text-sm mt-2 text-gray-500">通常需要 10-30 秒</p>
    </div>
  );
}
