import { useState } from 'react';
import { Download, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { LoadingIndicator } from './LoadingIndicator';
import { downloadImage } from '../utils/downloadImage';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function ImageDisplay({ imageUrl, isLoading, error, onClearError }: ImageDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;
    setIsDownloading(true);
    try {
      await downloadImage(imageUrl);
    } catch (err) {
      console.error('下载失败:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">生成结果</h2>
        {imageUrl && !isLoading && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? '下载中...' : '下载图片'}
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[400px] bg-[#2d2d2d] rounded-lg overflow-hidden">
        {isLoading ? (
          <LoadingIndicator />
        ) : error ? (
          <div className="flex flex-col items-center text-red-400 p-8">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-center">{error}</p>
            <button
              onClick={onClearError}
              className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="生成的图片"
            className="max-w-full max-h-[600px] object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <ImageIcon className="w-16 h-16 mb-4" />
            <p>输入描述并点击生成，开始创作</p>
          </div>
        )}
      </div>
    </div>
  );
}
