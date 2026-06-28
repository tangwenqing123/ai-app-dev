import { Trash2, History, Image as ImageIcon } from 'lucide-react';
import type { GenerationRecord } from '../types/image';

interface HistoryPanelProps {
  records: GenerationRecord[];
  onSelect: (record: GenerationRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({ records, onSelect, onDelete, onClearAll }: HistoryPanelProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncatePrompt = (prompt: string, maxLength: number = 50) => {
    return prompt.length > maxLength ? prompt.substring(0, maxLength) + '...' : prompt;
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-white">历史记录</h3>
          <span className="text-sm text-gray-500">({records.length})</span>
        </div>
        {records.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
            <ImageIcon className="w-10 h-10 mb-2" />
            <p className="text-sm">暂无历史记录</p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelect(record)}
              className="group flex gap-3 p-2 rounded-lg hover:bg-[#2d2d2d] cursor-pointer transition-colors"
            >
              <div className="w-16 h-16 rounded overflow-hidden bg-[#2d2d2d] flex-shrink-0">
                <img
                  src={record.imageUrl}
                  alt="缩略图"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate">
                  {truncatePrompt(record.optimizedPrompt || record.originalPrompt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(record.createdAt)} · {record.size}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
