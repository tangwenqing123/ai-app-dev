import { useState } from 'react';
import { Sparkles, Play, Loader2 } from 'lucide-react';
import type { SizeOption } from '../types/image';
import { optimizePrompt } from '../services/promptOptimizer';

interface InputPanelProps {
  onGenerate: (params: {
    prompt: string;
    size: SizeOption;
    promptExtend: boolean;
  }) => void;
  isLoading: boolean;
}

export function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<SizeOption>('2K');
  const [promptExtend, setPromptExtend] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setOptimizeError('请先输入提示词');
      return;
    }

    setIsOptimizing(true);
    setOptimizeError(null);

    try {
      const optimized = await optimizePrompt(prompt);
      setPrompt(optimized);
    } catch (error: any) {
      setOptimizeError(error.message || '优化失败');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      return;
    }
    onGenerate({
      prompt,
      size,
      promptExtend
    });
  };

  const isGenerateDisabled = !prompt.trim() || isLoading;

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-[#e0e0e0]">AI 图片生成器</h2>

      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-sm">图片描述</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="输入你想要的图片描述，例如：一只可爱的橘猫坐在窗台上..."
          className="w-full h-40 bg-[#2d2d2d] border border-[#404040] rounded-lg p-4 text-[#e0e0e0] placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          maxLength={2100}
        />
        <p className="text-gray-500 text-xs text-right">{prompt.length}/2100</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-sm">图片尺寸</label>
        <div className="flex gap-2">
          {(['1K', '2K', '4K'] as SizeOption[]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                size === s
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-[#2d2d2d] border-[#404040] text-gray-300 hover:border-gray-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-gray-400 text-sm">智能改写</label>
        <button
          onClick={() => setPromptExtend(!promptExtend)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            promptExtend ? 'bg-blue-600' : 'bg-[#404040]'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              promptExtend ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {optimizeError && (
        <p className="text-red-400 text-sm">{optimizeError}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || !prompt.trim()}
          className="flex-1 py-3 px-4 bg-[#2d2d2d] hover:bg-[#353535] border border-[#404040] rounded-lg text-[#e0e0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isOptimizing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span>优化提示词</span>
        </button>

        <button
          onClick={handleGenerate}
          disabled={isGenerateDisabled}
          className={`flex-1 py-3 px-4 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            isGenerateDisabled
              ? 'bg-gray-600'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
          }`}
        >
          <Play className="w-5 h-5" />
          <span>生成图片</span>
        </button>
      </div>
    </div>
  );
}
