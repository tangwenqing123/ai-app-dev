import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-dark-input hover:bg-dark-border rounded-lg text-sm text-dark-text hover:text-white transition-colors"
      title={copied ? '已复制' : '复制内容'}
    >
      {copied ? (
        <>
          <Check size={14} className="text-green-500" />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>复制</span>
        </>
      )}
    </button>
  );
}
