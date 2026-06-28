import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from './CopyButton';
import { FileText } from 'lucide-react';

interface OutputPanelProps {
  content: string;
  isGenerating: boolean;
  error: string | null;
}

export function OutputPanel({ content, isGenerating, error }: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="flex flex-col h-full bg-dark-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-dark-text">
          <FileText size={16} />
          AI 输出
        </label>
        {content && <CopyButton text={content} />}
      </div>

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto bg-dark-bg rounded-lg p-4"
        role="region"
        aria-label="AI输出区域"
      >
        {error ? (
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-lg">✗</span>
            <span>{error}</span>
          </div>
        ) : content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !className || !match;
                
                if (!isInline && match) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                }
                
                return (
                  <code className="bg-dark-input px-1.5 py-0.5 rounded text-sm">
                    {children}
                  </code>
                );
              },
            }}
            className="prose prose-invert max-w-none text-dark-text"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText size={48} className="mb-3 opacity-30" />
            <p>AI 生成的内容将在此显示</p>
            {isGenerating && <p className="text-sm mt-2">AI 正在写作...</p>}
          </div>
        )}
      </div>
    </div>
  );
}
