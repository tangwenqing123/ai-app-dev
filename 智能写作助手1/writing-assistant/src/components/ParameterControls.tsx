import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ParameterControlsProps {
  temperature: number;
  maxTokens: number;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
}

export function ParameterControls({
  temperature,
  maxTokens,
  onTemperatureChange,
  onMaxTokensChange,
}: ParameterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-[#e0e0e0] transition-colors"
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        高级设置
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 p-4 bg-[#1e1e1e] rounded-lg">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-[#e0e0e0]">创意度 (Temperature)</label>
              <span className="text-sm text-[#a0a0a0]">{temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#a0a0a0] mt-1">
              <span>精确</span>
              <span>创意</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-[#e0e0e0]">输出长度 (Max Tokens)</label>
              <span className="text-sm text-[#a0a0a0]">{maxTokens}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxTokens}
              onChange={(e) => onMaxTokensChange(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#a0a0a0] mt-1">
              <span>简短</span>
              <span>详细</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
