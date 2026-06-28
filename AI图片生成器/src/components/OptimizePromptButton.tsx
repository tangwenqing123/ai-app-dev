import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { optimizePrompt } from '../services/promptOptimizer';

interface OptimizePromptButtonProps {
  prompt: string;
  onOptimized: (optimized: string) => void;
  disabled?: boolean;
}

export function OptimizePromptButton({ prompt, onOptimized, disabled }: OptimizePromptButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const optimized = await optimizePrompt(prompt);
      onOptimized(optimized);
    } catch (error) {
      console.error('优化失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading || !prompt.trim()}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      {isLoading ? '优化中...' : '优化提示词'}
    </button>
  );
}
