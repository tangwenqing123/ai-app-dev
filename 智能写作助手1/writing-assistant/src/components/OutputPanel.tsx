import { Loader2 } from 'lucide-react';
import { MarkdownRenderer } from '../utils/markdown';
import { CopyButton } from './CopyButton';

interface OutputPanelProps {
  content: string;
  isGenerating: boolean;
  error: string | null;
}

export function OutputPanel({ content, isGenerating, error }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#e0e0e0]">生成结果</h2>
        {content && !isGenerating && !error && (
          <CopyButton text={content} />
        )}
      </div>

      <div className="flex-1 overflow-auto bg-[#1e1e1e] rounded-lg p-4">
        {isGenerating && !content && (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-blue-500 mr-2" />
            <span className="text-[#a0a0a0]">AI 正在写作...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-400">
              <p className="text-lg mb-2">生成失败</p>
              <p className="text-sm text-[#a0a0a0]">{error}</p>
            </div>
          </div>
        )}

        {!content && !isGenerating && !error && (
          <div className="flex items-center justify-center h-full text-[#6b6375]">
            选择写作模式，输入内容，点击"生成内容"开始创作
          </div>
        )}

        {content && <MarkdownRenderer content={content} />}

        {isGenerating && content && (
          <div className="mt-4 pt-4 border-t border-[#404040]">
            <div className="flex items-center text-sm text-[#a0a0a0]">
              <Loader2 size={16} className="animate-spin mr-2" />
              继续生成中...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
