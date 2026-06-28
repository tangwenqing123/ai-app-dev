/**
 * 历史记录面板组件
 * 显示识别历史记录列表
 */

import { Trash2, Clock, FileText } from 'lucide-react';
import type { TranscriptionRecord } from '../types/asr';

interface HistoryPanelProps {
  records: TranscriptionRecord[];
  onSelect: (record: TranscriptionRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `今天 ${timeStr}`;
  }

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function HistoryPanel({ records, onSelect, onDelete, onClearAll }: HistoryPanelProps) {
  if (records.length === 0) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-[#1e1e1e] border border-[#404040] rounded-xl p-6">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Clock className="w-5 h-5" />
            <span>暂无历史记录</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-gray-200 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          历史记录
        </h2>

        <button
          onClick={onClearAll}
          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          清空全部
        </button>
      </div>

      {/* 记录列表 */}
      <div className="bg-[#1e1e1e] border border-[#404040] rounded-xl overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto">
          {records.map((record) => (
            <div
              key={record.id}
              className="group flex items-start gap-3 p-4 border-b border-[#404040] last:border-b-0 hover:bg-[#2d2d2d] transition-colors cursor-pointer"
              onClick={() => onSelect(record)}
            >
              <FileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-sm line-clamp-2">
                  {truncateText(record.text, 80)}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatTimestamp(record.timestamp)}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record.id);
                }}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
