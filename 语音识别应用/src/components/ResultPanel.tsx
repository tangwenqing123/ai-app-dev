import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

// 开发环境日志控制
const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

interface ResultPanelProps {
  text: string;
  onTextChange?: (text: string) => void;
  isEditing?: boolean;
}

export function ResultPanel({ text, onTextChange, isEditing = true }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      devLog('Failed to copy:', err);
    }
  };

  if (!text && !isEditing) {
    return (
      <div className="w-full max-w-2xl bg-dark-card rounded-xl p-6 border border-dark-border">
        <p className="text-gray-500 text-center">识别结果将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-dark-card rounded-xl p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-dark-text">识别结果</h2>
        <button
          onClick={handleCopy}
          disabled={!text}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors
            ${text
              ? 'bg-dark-result hover:bg-gray-600 text-dark-text'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">复制</span>
            </>
          )}
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => onTextChange?.(e.target.value)}
          className="w-full h-48 bg-dark-result border border-dark-border rounded-lg p-4 text-dark-text resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="识别结果将显示在这里..."
        />
      ) : (
        <div className="w-full min-h-32 bg-dark-result rounded-lg p-4 text-dark-text whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
}
