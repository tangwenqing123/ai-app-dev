import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import type { GenerateParams } from '@/types/writing';

interface ParameterControlsProps {
  params: GenerateParams;
  onChange: (params: GenerateParams) => void;
}

export function ParameterControls({ params, onChange }: ParameterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-dark-card rounded-lg p-4">
      <button
        className="w-full flex items-center justify-between text-dark-text hover:text-white transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Settings size={18} />
          <span className="font-medium">高级设置</span>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">创意度 (Temperature)</label>
              <span className="text-sm text-dark-text">{params.temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={params.temperature}
              onChange={(e) => onChange({ ...params, temperature: parseFloat(e.target.value) })}
              className="w-full h-2 bg-dark-input rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>精准</span>
              <span>创意</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">输出长度 (Max Tokens)</label>
              <span className="text-sm text-dark-text">{params.maxTokens}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={params.maxTokens}
              onChange={(e) => onChange({ ...params, maxTokens: parseInt(e.target.value) })}
              className="w-full h-2 bg-dark-input rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100</span>
              <span>2000</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
