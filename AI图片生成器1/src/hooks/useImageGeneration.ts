import { useState, useCallback } from 'react';
import { generateImage } from '../services/tongyiImageApi';
import type { GenerateParams, GenerationRecord, ApiError } from '../types/image';

interface UseImageGenerationReturn {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  generate: (params: GenerateParams, originalPrompt: string, optimizedPrompt?: string) => Promise<void>;
  clearImage: () => void;
  clearError: () => void;
}

export function useImageGeneration(onSuccess?: (record: GenerationRecord) => void): UseImageGenerationReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: GenerateParams, originalPrompt: string, optimizedPrompt?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = await generateImage(params);
      setImageUrl(url);

      const record: GenerationRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        originalPrompt,
        optimizedPrompt: optimizedPrompt || originalPrompt,
        imageUrl: url,
        size: params.size,
        createdAt: Date.now()
      };

      if (onSuccess) {
        onSuccess(record);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || '生成图片失败');
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  const clearImage = useCallback(() => {
    setImageUrl(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    imageUrl,
    isLoading,
    error,
    generate,
    clearImage,
    clearError
  };
}
