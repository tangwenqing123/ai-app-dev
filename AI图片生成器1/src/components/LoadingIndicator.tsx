import { RefreshCw } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="absolute inset-0 bg-[#1e1e1e]/90 flex flex-col items-center justify-center rounded-xl z-10">
      <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <p className="text-[#e0e0e0] text-lg">AI 正在创作中，请稍候...</p>
      <p className="text-gray-400 text-sm mt-2">通常需要 10-30 秒</p>
    </div>
  );
}
