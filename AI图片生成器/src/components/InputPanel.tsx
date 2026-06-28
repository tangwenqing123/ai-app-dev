import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import type { SizeOption } from '../types/image';
import { OptimizePromptButton } from './OptimizePromptButton';

interface InputPanelProps {
  onGenerate: (prompt: string, size: SizeOption, promptExtend: boolean) => void;
  isLoading: boolean;
}

export function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [size, setSize] = useState<SizeOption>('2K');
  const [promptExtend, setPromptExtend] = useState(true);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt, size, promptExtend);
  };

  const effectivePrompt = optimizedPrompt || prompt;

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-white">图片描述</h2>
      
      <textarea
        value={effectivePrompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setOptimizedPrompt('');
        }}
        placeholder="描述你想要生成的图片... 例如：一只可爱的橘猫坐在窗台上"
        className="w-full h-40 bg-[#2d2d2d] border border-[#404040] rounded-lg p-4 text-[#e0e0e0] placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">图片尺寸</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as SizeOption)}
            className="bg-[#2d2d2d] border border-[#404040] rounded-lg px-3 py-2 text-[#e0e0e0] focus:outline-none"
            disabled={isLoading}
          >
            <option value="1K">1K (1024×1024)</option>
            <option value="2K">2K (2048×2048)</option>
            <option value="4K">4K (4096×4096)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">智能改写</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={promptExtend}
              onChange={(e) => setPromptExtend(e.target.checked)}
              className="w-5 h-5 rounded bg-[#2d2d2d] border-[#404040] text-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-300">
              {promptExtend ? '已开启 (+3-4秒)' : '已关闭'}
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <OptimizePromptButton
          prompt={prompt}
          onOptimized={(optimized) => {
            setOptimizedPrompt(optimized);
          }}
          disabled={isLoading}
        />

        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Wand2 className="w-5 h-5 animate-pulse" />
              生成中...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              生成图片
            </>
          )}
        </button>
      </div>

      {optimizedPrompt && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">{optimizedPrompt}</p>
        </div>
      )}
    </div>
  );
}
