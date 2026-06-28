import { useState, useCallback, useRef } from 'react';
import type { WritingMode, GenerationRecord } from '../types/writing';
import { buildPrompt, buildOptimizePrompt } from '../services/promptTemplates';
import { streamGenerate } from '../services/deepseekApi';

interface UseStreamingGenerationOptions {
  onComplete?: (record: GenerationRecord) => void;
}

export function useStreamingGeneration(options: UseStreamingGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (
    mode: WritingMode,
    inputText: string,
    temperature: number,
    maxTokens: number,
    emailSubject?: string
  ) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setOutputText('');
    setError(null);

    abortControllerRef.current = new AbortController();

    const prompt = buildPrompt(mode, inputText, emailSubject);
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: '你是一个专业的写作助手。' },
      { role: 'user', content: prompt },
    ];

    let fullOutput = '';

    await new Promise<void>((resolve) => {
      streamGenerate(messages, temperature, maxTokens, {
        onChunk: (content) => {
          fullOutput += content;
          setOutputText(fullOutput);
        },
        onDone: () => {
          resolve();
        },
        onError: (err) => {
          setError(err.message);
          resolve();
        },
      });
    });

    if (fullOutput && !error) {
      const record: GenerationRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        mode,
        inputText,
        outputText: fullOutput,
        createdAt: Date.now(),
      };
      options.onComplete?.(record);
    }

    setIsGenerating(false);
  }, [isGenerating, error, options]);

  const optimizePrompt = useCallback(async (
    currentPrompt: string,
    onOptimized: (optimized: string) => void
  ) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: '你是一个专业的写作助手。' },
      { role: 'user', content: buildOptimizePrompt(currentPrompt) },
    ];

    let optimizedText = '';

    await new Promise<void>((resolve) => {
      streamGenerate(messages, 0.7, 500, {
        onChunk: (content) => {
          optimizedText += content;
        },
        onDone: () => {
          resolve();
        },
        onError: (err) => {
          setError(err.message);
          resolve();
        },
      });
    });

    if (optimizedText) {
      onOptimized(optimizedText.trim());
    }

    setIsGenerating(false);
  }, [isGenerating, error]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    setOutputText('');
  }, []);

  return {
    isGenerating,
    outputText,
    error,
    generate,
    optimizePrompt,
    cancel,
  };
}
