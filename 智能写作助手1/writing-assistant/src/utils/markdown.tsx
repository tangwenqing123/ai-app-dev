import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  language: string;
  children: string;
}

function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-[#2d2d2d] opacity-0 group-hover:opacity-100 transition-opacity"
        title="复制代码"
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy size={16} />
        )}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !className;

          if (isInline) {
            return (
              <code className="px-1 py-0.5 rounded bg-[#2d2d2d] text-sm" {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock language={match![1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
          );
        },
        pre({ children }) {
          return <pre className="bg-[#2d2d2d] rounded-lg p-4 overflow-x-auto">{children}</pre>;
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {children}
            </a>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#404040] rounded-lg">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="px-4 py-2 border-b border-[#404040] bg-[#2d2d2d] text-left font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="px-4 py-2 border-b border-[#404040]">{children}</td>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-[#1e1e1e] rounded-r-lg">
              {children}
            </blockquote>
          );
        },
        ul({ children }) {
          return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-[#e0e0e0]">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold text-[#e0e0e0] mt-6 mb-4">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold text-[#e0e0e0] mt-5 mb-3">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-semibold text-[#e0e0e0] mt-4 mb-2">{children}</h3>;
        },
        p({ children }) {
          return <p className="text-[#e0e0e0] my-3 leading-relaxed">{children}</p>;
        },
        strong({ children }) {
          return <strong className="font-semibold text-white">{children}</strong>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
