import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`p-2 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors ${className}`}
      title="复制内容"
    >
      {copied ? (
        <Check size={18} className="text-green-500" />
      ) : (
        <Copy size={18} />
      )}
    </button>
  );
}
