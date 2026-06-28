import { useState, useCallback } from 'react';
import { generateImage } from '../services/tongyiImageApi';
import type { GenerateParams, GenerationRecord } from '../types/image';

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

  const generate = useCallback(async (
    params: GenerateParams,
    originalPrompt: string,
    optimizedPrompt?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = await generateImage(params);
      setImageUrl(url);

      if (onSuccess) {
        const record: GenerationRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalPrompt,
          optimizedPrompt: optimizedPrompt || undefined,
          imageUrl: url,
          size: params.size,
          createdAt: Date.now()
        };
        onSuccess(record);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  const clearImage = useCallback(() => {
    setImageUrl(null);
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
