/**
 * 识别结果展示区域
 * 支持编辑文本和复制功能
 */

import { useState, useEffect } from 'react';
import { Copy, Check, Edit3 } from 'lucide-react';

interface ResultPanelProps {
  text: string;
  onTextChange?: (text: string) => void;
  isEditable?: boolean;
  isLoading?: boolean;
}

export function ResultPanel({ text, onTextChange, isEditable = true, isLoading = false }: ResultPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedText(text);
    setIsEditing(false);
  }, [text]);

  const handleCopy = async () => {
    if (!editedText) return;

    try {
      await navigator.clipboard.writeText(editedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditedText(newText);
    onTextChange?.(newText);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-[#2d2d2d] border border-[#404040] rounded-xl p-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-200">识别结果</h2>

          <div className="flex gap-2">
            {/* 编辑按钮 */}
            {isEditable && text && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                title={isEditing ? '取消编辑' : '编辑'}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {/* 复制按钮 */}
            {text && (
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-colors ${
                  isCopied
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
                title={isCopied ? '已复制' : '复制文本'}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* 结果文本区域 */}
        {isLoading ? (
          <div className="h-32 flex items-center justify-center text-gray-500">
            识别中...
          </div>
        ) : isEditing || !text ? (
          <textarea
            value={editedText}
            onChange={handleTextChange}
            placeholder="点击开始录音，然后识别..."
            className="w-full h-32 bg-[#1e1e1e] text-gray-200 placeholder-gray-500 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        ) : (
          <div
            className="min-h-[8rem] text-gray-200 whitespace-pre-wrap leading-relaxed"
            onClick={() => setIsEditing(true)}
          >
            {editedText || '点击开始录音，然后识别...'}
          </div>
        )}
      </div>
    </div>
  );
}
