import { History, Trash2, FileText } from 'lucide-react';
import type { TranscriptionRecord } from '../types/asr';

interface HistoryPanelProps {
  records: TranscriptionRecord[];
  onSelectRecord: (record: TranscriptionRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
}: HistoryPanelProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-2xl bg-dark-card rounded-xl p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-medium text-dark-text">历史记录</h2>
          <span className="text-sm text-gray-500">({records.length})</span>
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
        <div className="text-center py-8 text-gray-500">
          暂无历史记录
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {records.map((record) => (
            <div
              key={record.id}
              className="group flex items-start gap-3 p-3 bg-dark-result rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => onSelectRecord(record)}
            >
              <FileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-dark-text text-sm line-clamp-2">{record.text || '（空记录）'}</p>
                <p className="text-gray-500 text-xs mt-1">{formatDate(record.timestamp)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRecord(record.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-all"
                aria-label="删除记录"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
