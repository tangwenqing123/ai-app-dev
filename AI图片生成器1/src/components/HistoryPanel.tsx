import { Trash2, Clock, Image } from 'lucide-react';
import type { GenerationRecord } from '../types/image';

interface HistoryPanelProps {
  records: GenerationRecord[];
  onSelectRecord: (record: GenerationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({ records, onSelectRecord, onDeleteRecord, onClearAll }: HistoryPanelProps) {
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
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <h3 className="text-[#e0e0e0] font-medium">历史记录</h3>
        </div>
        {records.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            清空所有
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <Image className="w-12 h-12 mb-2 opacity-50" />
          <p>暂无历史记录</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelectRecord(record)}
              className="bg-[#2d2d2d] rounded-lg p-3 cursor-pointer hover:bg-[#353535] transition-colors group"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-[#404040]">
                  <img
                    src={record.imageUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm truncate">
                    {truncatePrompt(record.optimizedPrompt || record.originalPrompt)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-500 text-xs">
                      {formatTime(record.createdAt)} · {record.size}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(record.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
