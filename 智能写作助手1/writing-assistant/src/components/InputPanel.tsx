import { Wand2, Trash2 } from 'lucide-react';
import type { WritingMode } from '../types/writing';
import { WRITING_MODES } from '../types/writing';
import { ParameterControls } from './ParameterControls';
import { OptimizePromptButton } from './OptimizePromptButton';

interface InputPanelProps {
  mode: WritingMode;
  inputText: string;
  emailSubject: string;
  temperature: number;
  maxTokens: number;
  isGenerating: boolean;
  onModeChange: (mode: WritingMode) => void;
  onInputChange: (text: string) => void;
  onEmailSubjectChange: (subject: string) => void;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  onClear: () => void;
}

export function InputPanel({
  mode,
  inputText,
  emailSubject,
  temperature,
  maxTokens,
  isGenerating,
  onModeChange,
  onInputChange,
  onEmailSubjectChange,
  onTemperatureChange,
  onMaxTokensChange,
  onGenerate,
  onOptimizePrompt,
  onClear,
}: InputPanelProps) {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div>
        <label className="block text-sm text-[#a0a0a0] mb-2">写作模式</label>
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value as WritingMode)}
          className="w-full px-4 py-2 bg-[#2d2d2d] border border-[#404040] rounded-lg text-[#e0e0e0] focus:outline-none focus:border-blue-500"
        >
          {WRITING_MODES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {mode === 'email' && (
        <div>
          <label className="block text-sm text-[#a0a0a0] mb-2">邮件主题</label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => onEmailSubjectChange(e.target.value)}
            placeholder="输入邮件主题..."
            className="w-full px-4 py-2 bg-[#2d2d2d] border border-[#404040] rounded-lg text-[#e0e0e0] placeholder-[#6b6375] focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      <div className="flex-1">
        <label className="block text-sm text-[#a0a0a0] mb-2">输入内容</label>
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="输入你要写作的内容..."
          className="w-full h-48 px-4 py-3 bg-[#2d2d2d] border border-[#404040] rounded-lg text-[#e0e0e0] placeholder-[#6b6375] resize-none focus:outline-none focus:border-blue-500"
        />
      </div>

      <ParameterControls
        temperature={temperature}
        maxTokens={maxTokens}
        onTemperatureChange={onTemperatureChange}
        onMaxTokensChange={onMaxTokensChange}
      />

      <div className="flex gap-2">
        <OptimizePromptButton
          onClick={onOptimizePrompt}
          isLoading={isGenerating}
          disabled={!inputText.trim()}
        />
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1e1e1e] border border-[#404040] rounded-lg hover:bg-[#2d2d2d] transition-colors"
        >
          <Trash2 size={16} />
          清空
        </button>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || !inputText.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Wand2 size={18} />
        {isGenerating ? 'AI 正在写作...' : '生成内容'}
      </button>
    </div>
  );
}
