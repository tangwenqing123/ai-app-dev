import { useState } from 'react';
import { PenLine, Trash2, Sparkles } from 'lucide-react';
import { WRITING_MODES, type WritingMode, type GenerateParams } from '@/types/writing';
import { ParameterControls } from './ParameterControls';

interface InputPanelProps {
  inputText: string;
  mode: WritingMode;
  params: GenerateParams;
  isGenerating: boolean;
  onInputChange: (text: string) => void;
  onModeChange: (mode: WritingMode) => void;
  onParamsChange: (params: GenerateParams) => void;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  isOptimizing: boolean;
}

export function InputPanel({
  inputText,
  mode,
  params,
  isGenerating,
  onInputChange,
  onModeChange,
  onParamsChange,
  onGenerate,
  onOptimizePrompt,
  isOptimizing,
}: InputPanelProps) {
  const [focusedMode, setFocusedMode] = useState<WritingMode | null>(null);

  const currentMode = WRITING_MODES.find((m) => m.value === mode);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-dark-card rounded-lg p-4 mb-4">
        <label className="block text-sm font-medium text-dark-text mb-3">选择写作模式</label>
        <div className="grid grid-cols-2 gap-2">
          {WRITING_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              onMouseEnter={() => setFocusedMode(m.value)}
              onMouseLeave={() => setFocusedMode(null)}
              className={`relative px-3 py-2 rounded-lg text-sm transition-all ${
                mode === m.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-dark-input text-dark-text hover:bg-dark-border'
              }`}
            >
              {m.label}
              {focusedMode === m.value && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-10">
                  <p className="text-xs text-gray-400">{m.description}</p>
                </div>
              )}
            </button>
          ))}
        </div>
        {currentMode && (
          <p className="mt-3 text-xs text-gray-500">当前模式：{currentMode.description}</p>
        )}
      </div>

      <div className="bg-dark-card rounded-lg p-4 mb-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-medium text-dark-text">
            <PenLine size={16} />
            输入文本
          </label>
          <button
            onClick={() => onInputChange('')}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
            title="清空输入"
          >
            <Trash2 size={14} />
            清空
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="请输入需要处理的文本..."
          className="flex-1 w-full bg-dark-input border border-dark-border rounded-lg p-3 text-dark-text placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <ParameterControls params={params} onChange={onParamsChange} />

      <div className="flex gap-3 mt-4">
        <button
          onClick={onOptimizePrompt}
          disabled={!inputText || isGenerating || isOptimizing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-input hover:bg-dark-border rounded-lg text-dark-text hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={16} />
          {isOptimizing ? '优化中...' : '优化提示词'}
        </button>
        <button
          onClick={() => {
            console.debug('[DEBUG] Generate button clicked');
            console.debug('[DEBUG] inputText:', inputText);
            console.debug('[DEBUG] isGenerating:', isGenerating);
            onGenerate();
          }}
          disabled={!inputText || isGenerating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI 正在写作...
            </>
          ) : (
            <>
              <PenLine size={16} />
              生成内容
            </>
          )}
        </button>
      </div>
    </div>
  );
}
