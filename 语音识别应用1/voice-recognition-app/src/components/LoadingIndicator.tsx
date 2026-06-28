/**
 * 加载动画组件
 */

export function LoadingIndicator({ message = '正在识别中，请稍候...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* 加载动画 */}
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>

      {/* 提示文字 */}
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
