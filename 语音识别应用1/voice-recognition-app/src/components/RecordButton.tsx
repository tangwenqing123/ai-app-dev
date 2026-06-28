/**
 * 录音按钮组件
 * 中央大圆形录音按钮，处理开始/停止录音
 */

import { Mic, Square } from 'lucide-react';
import type { RecorderState } from '../types/asr';
import { formatTime } from '../utils/formatTime';

interface RecordButtonProps {
  state: RecorderState;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function RecordButton({ state, duration, onStart, onStop, disabled }: RecordButtonProps) {
  const isRecording = state === 'recording';

  const handleClick = () => {
    if (disabled) return;

    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 计时显示 */}
      {isRecording && (
        <div className="text-3xl font-mono text-red-400 animate-pulse-recording">
          {formatTime(duration)}
        </div>
      )}

      {/* 录音按钮 */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative flex items-center justify-center
          w-32 h-32 rounded-full
          transition-all duration-300 ease-in-out
          ${isRecording
            ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse shadow-lg shadow-red-500/50'
            : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-4 focus:ring-red-500/30
        `}
        aria-label={isRecording ? '停止录音' : '开始录音'}
      >
        {isRecording ? (
          <Square className="w-12 h-12 text-white" fill="white" />
        ) : (
          <Mic className="w-14 h-14 text-white" />
        )}

        {/* 脉冲动画效果 */}
        {isRecording && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
        )}
      </button>

      {/* 提示文字 */}
      <p className="text-gray-400 text-sm">
        {isRecording ? '点击停止录音' : '点击开始录音'}
      </p>
      <p className="text-gray-500 text-xs">
        最长 60 秒
      </p>
    </div>
  );
}
