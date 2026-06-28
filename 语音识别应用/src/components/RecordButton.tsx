import { Mic, Square } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

interface RecordButtonProps {
  isRecording: boolean;
  duration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  duration,
  onStartRecording,
  onStopRecording,
  disabled = false,
}: RecordButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          w-32 h-32 rounded-full flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${isRecording
            ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse shadow-lg shadow-red-500/50'
            : 'bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transform hover:scale-105 active:scale-95
        `}
        aria-label={isRecording ? '停止录音' : '开始录音'}
      >
        {isRecording ? (
          <Square className="w-10 h-10 text-white fill-white" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}
      </button>
      <div className="text-2xl font-mono text-dark-text">
        {formatTime(duration)}
      </div>
      <div className="text-sm text-gray-400">
        {isRecording ? '点击停止录音' : '点击开始录音'}
      </div>
    </div>
  );
}
