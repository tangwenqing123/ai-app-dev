import { Sparkles } from 'lucide-react';

interface OptimizePromptButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function OptimizePromptButton({
  onClick,
  isLoading,
  disabled,
}: OptimizePromptButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1e1e1e] border border-[#404040] rounded-lg hover:bg-[#2d2d2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Sparkles size={16} className={isLoading ? 'animate-pulse' : ''} />
      {isLoading ? '优化中...' : '优化提示词'}
    </button>
  );
}
