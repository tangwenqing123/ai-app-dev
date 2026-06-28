import { useState, useCallback } from 'react';
import { generateNonStreaming } from '@/services/deepseekApi';
import type { GenerateParams } from '@/types/writing';

interface UseStreamingGenerationReturn {
  output: string;
  isGenerating: boolean;
  error: string | null;
  startGeneration: (prompt: string, params: GenerateParams, onComplete?: (output: string) => void) => Promise<void>;
  cancelGeneration: () => void;
  reset: () => void;
}

export function useStreamingGeneration(): UseStreamingGenerationReturn {
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelGeneration = useCallback(() => {
    console.debug('[DEBUG] cancelGeneration called');
  }, []);

  const reset = useCallback(() => {
    console.debug('[DEBUG] reset called');
    setOutput('');
    setError(null);
  }, []);

  const startGeneration = useCallback(async (prompt: string, params: GenerateParams, onComplete?: (output: string) => void) => {
    console.debug('[DEBUG] startGeneration called');
    console.debug('[DEBUG] Prompt length:', prompt.length);

    setOutput('');
    setError(null);
    setIsGenerating(true);

    console.debug('[DEBUG] State updated - output: empty, error: null, isGenerating: true');

    try {
      console.debug('[DEBUG] Starting non-streaming generation...');

      const result = await generateNonStreaming(prompt, params);

      console.debug('[DEBUG] Non-streaming generation completed, result length:', result.length);
      console.debug('[DEBUG] Result preview:', result.substring(0, 100) + '...');

      if (result) {
        console.debug('[DEBUG] Setting output state...');
        setOutput(result);
        console.debug('[DEBUG] Output state set successfully');

        if (onComplete) {
          console.debug('[DEBUG] Calling onComplete callback');
          onComplete(result);
          console.debug('[DEBUG] onComplete callback completed');
        }
      } else {
        console.warn('[WARN] Generation returned empty result');
        setError('生成内容为空，请重试');
      }

    } catch (err) {
      console.error('[ERROR] Error in startGeneration:', err);
      const errorMessage = err instanceof Error ? err.message : '生成失败，请检查网络或 API Key';
      console.error('[ERROR] Setting error state:', errorMessage);
      setError(errorMessage);
    } finally {
      console.debug('[DEBUG] Setting isGenerating to false');
      setIsGenerating(false);
      console.debug('[DEBUG] Finally block completed');
    }
  }, []);

  return {
    output,
    isGenerating,
    error,
    startGeneration,
    cancelGeneration,
    reset,
  };
}