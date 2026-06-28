import { Download, ImageOff } from 'lucide-react';
import { LoadingIndicator } from './LoadingIndicator';
import { downloadImage } from '../utils/downloadImage';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  onImageError?: () => void;
}

export function ImageDisplay({ imageUrl, isLoading, onImageError }: ImageDisplayProps) {
  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      await downloadImage(imageUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!imageUrl && !isLoading) {
    return (
      <div className="flex-1 bg-[#1e1e1e] rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <ImageOff className="w-16 h-16 text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">输入提示词，开始创作</p>
        <p className="text-gray-500 text-sm mt-2">生成的图片将在这里显示</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 min-h-[400px] relative flex items-center justify-center">
      {isLoading && <LoadingIndicator />}

      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt="Generated"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
            onError={onImageError}
          />
          <button
            onClick={handleDownload}
            className="absolute top-6 right-6 bg-[#2d2d2d] hover:bg-[#404040] p-3 rounded-lg transition-colors flex items-center gap-2"
            title="下载图片"
          >
            <Download className="w-5 h-5 text-[#e0e0e0]" />
            <span className="text-[#e0e0e0] text-sm">下载</span>
          </button>
        </>
      )}
    </div>
  );
}
