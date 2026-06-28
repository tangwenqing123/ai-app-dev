import { useState } from 'react';
import { History, Trash2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import type { GenerationRecord, WritingMode } from '@/types/writing';
import { WRITING_MODES } from '@/types/writing';

interface HistoryPanelProps {
  records: GenerationRecord[];
  onLoadRecord: (record: GenerationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({
  records,
  onLoadRecord,
  onDeleteRecord,
  onClearAll,
}: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModeLabel = (mode: WritingMode) => {
    return WRITING_MODES.find((m) => m.value === mode)?.label || mode;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-dark-card border border-dark-border rounded-r-lg p-2 hover:bg-dark-border transition-colors"
        title={isOpen ? '隐藏历史' : '显示历史'}
      >
        {isOpen ? <ChevronLeft size={20} className="text-dark-text" /> : <ChevronRight size={20} className="text-dark-text" />}
      </button>

      <div
        className={`fixed left-0 top-0 h-full w-80 bg-dark-card border-r border-dark-border transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <History size={20} className="text-dark-text" />
            <span className="font-medium text-dark-text">历史记录</span>
            <span className="text-xs text-gray-500">({records.length})</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-dark-input rounded transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <History size={48} className="mb-3 opacity-30" />
            <p>暂无历史记录</p>
          </div>
        ) : (
          <>
            <button
              onClick={onClearAll}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-input transition-colors"
            >
              清空所有历史
            </button>
            <div className="overflow-y-auto h-[calc(100%-140px)]">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border-b border-dark-border p-3 hover:bg-dark-input transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                          {getModeLabel(record.mode)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(record.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-dark-text line-clamp-2">
                        {truncateText(record.inputText, 60)}
                      </p>
                      {expandedId === record.id && (
                        <div className="mt-2 pt-2 border-t border-dark-border">
                          <p className="text-sm text-gray-400 text-xs mb-1">生成结果：</p>
                          <p className="text-sm text-dark-text whitespace-pre-wrap">
                            {truncateText(record.outputText, 200)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                        className="p-1.5 hover:bg-dark-border rounded transition-colors"
                        title={expandedId === record.id ? '收起' : '展开'}
                      >
                        <ChevronRight
                          size={16}
                          className={`text-gray-400 transition-transform ${expandedId === record.id ? 'rotate-90' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                      <button
                        onClick={() => {
                          onLoadRecord(record);
                          setIsOpen(false);
                        }}
                        className="p-1.5 hover:bg-blue-500/20 rounded transition-colors"
                        title="加载"
                      >
                        <span className="text-xs text-blue-400">加载</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
