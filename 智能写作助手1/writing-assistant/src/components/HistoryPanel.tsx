import { History, Trash2, ChevronRight } from 'lucide-react';
import type { GenerationRecord } from '../types/writing';
import { WRITING_MODES } from '../types/writing';

interface HistoryPanelProps {
  records: GenerationRecord[];
  isOpen: boolean;
  onSelect: (record: GenerationRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString('zh-CN');
}

function getModeLabel(mode: string): string {
  return WRITING_MODES.find((m) => m.value === mode)?.label || mode;
}

export function HistoryPanel({
  records,
  isOpen,
  onSelect,
  onDelete,
  onClearAll,
}: HistoryPanelProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-64 bg-[#1e1e1e] border-l border-[#404040] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#404040]">
        <div className="flex items-center gap-2">
          <History size={18} />
          <span className="font-medium text-[#e0e0e0]">历史记录</span>
        </div>
        {records.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="清空所有历史"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {records.length === 0 ? (
          <div className="p-4 text-center text-[#6b6375] text-sm">
            暂无历史记录
          </div>
        ) : (
          <div className="divide-y divide-[#404040]">
            {records.map((record) => (
              <div
                key={record.id}
                className="group relative p-3 hover:bg-[#2d2d2d] transition-colors cursor-pointer"
                onClick={() => onSelect(record)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#a0a0a0] mb-1">
                      {getModeLabel(record.mode)}
                    </div>
                    <div className="text-sm text-[#e0e0e0] line-clamp-2">
                      {record.inputText}
                    </div>
                    <div className="text-xs text-[#6b6375] mt-1">
                      {formatTime(record.createdAt)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(record.id);
                    }}
                    className="p-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                    title="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <ChevronRight
                  size={16}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b6375]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
